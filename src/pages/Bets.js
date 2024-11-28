import React, { useState, useEffect } from 'react';
import './Bets.css';

function Bets() {
    // Initialize bettingData from local storage or use default values
    const [bettingData, setBettingData] = useState(() => {
        const savedData = localStorage.getItem('bettingData');
        try{
            let data = JSON.parse(savedData);
            if (data){
                return data;
            }           
        }catch(e){}
        return {
            bob: { 
                amount: 10, 
                outcomeBet: { betAmount: 10, prediction: 'blue' }, 
                marginBet: { betAmount: 10, prediction: 5 } },
            alice: { 
                amount: 10, 
                outcomeBet: { betAmount: 10, prediction: 'blue' }, 
                marginBet: { betAmount: 10, prediction: 5 } },
        };
    });

    const [side, setSide] = useState("blue");
    const [margin, setMargin] = useState(0);

    // Save bettingData to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('bettingData', JSON.stringify(bettingData));
    }, [bettingData]);

    function NumberInput({ propertyName, path }) {
        const pathToProperty = path.split("/");
        const value = pathToProperty.reduce((acc, key) => acc[key], bettingData); // Get the current value

        const handleChange = (e) => {
            const newValue = Number(e.target.value);
            setBettingData((prevData) => {
                const updatedData = { ...prevData }; // Shallow copy top level
                let target = updatedData;
                for (let i = 0; i < pathToProperty.length - 1; i++) {
                    target = target[pathToProperty[i]];
                }
                target[pathToProperty[pathToProperty.length - 1]] = newValue;
                return updatedData;
            });
        };

        return (
            <div className="box">
                <center>
                    <h3 style={{ marginTop: '-10px', marginBottom: '-10px' }}>
                        {propertyName}
                    </h3>
                    <br />
                    <input
                        value={value}
                        type="number"
                        onChange={handleChange}
                        className="numberInput"
                    />
                </center>
            </div>
        );
    }

    function FlippingButton({ propertyName, path }) {
        const pathToProperty = path.split("/");
        const value = pathToProperty.reduce((acc, key) => acc[key], bettingData); // Get the current value

        const handleClick = () => {
            const newSide = value === 'blue' ? 'red' : 'blue';
            setBettingData((prevData) => {
                const updatedData = { ...prevData }; // Shallow copy top level
                let target = updatedData;
                for (let i = 0; i < pathToProperty.length - 1; i++) {
                    target = target[pathToProperty[i]];
                }
                target[pathToProperty[pathToProperty.length - 1]] = newSide;
                return updatedData;
            });
        };

        return (
            <div className="box">
                <center>
                    <h3 style={{ marginTop: '-10px', marginBottom: '-10px' }}>
                        {propertyName}
                    </h3>
                    <br />
                    <button
                        id="a"
                        style={{
                            backgroundColor: value === 'blue' ? 'lightblue' : 'salmon',
                        }}
                        onClick={handleClick}
                    >
                        {value === 'blue' ? 'BLUE' : 'RED'}
                    </button>
                </center>
            </div>
        );
    }

    function End(){
        return (
            <div className="box">
                <center>
                    <h3 style={{ marginTop: '-10px', marginBottom: '-10px' }}>
                        END
                    </h3>
                    <br />
                    <button
                        id="a"
                        style={{
                            backgroundColor: side === 'blue' ? 'lightblue' : 'salmon',
                        }}
                        onClick={() => setSide(side === 'blue' ? 'red' : 'blue')}
                    >
                        {side === 'blue' ? 'BLUE' : 'RED'}
                    </button>
                    <br />
                    <input
                        value={margin}
                        type="number"
                        onChange={(e) => setMargin(e.target.value)}
                        className="numberInput"
                    />
                    <br />
                    <button onClick={() => EndMatch()}>END MATCH</button>
                </center>
            </div>
        );
    }

    function EndMatch(){
        let newBettingData = JSON.parse(JSON.stringify(bettingData));
        const maxMarginError = 5;
        for (let person in newBettingData){
            if (newBettingData[person].outcomeBet.prediction == side){
                newBettingData[person].amount += newBettingData[person].outcomeBet.betAmount;
                newBettingData[person].outcomeBet.betAmount = 0;
                newBettingData[person].outcomeBet.prediction = 'blue';
            }else{
                newBettingData[person].amount -= newBettingData[person].outcomeBet.betAmount;
                newBettingData[person].outcomeBet.betAmount = 0;
                newBettingData[person].outcomeBet.prediction = 'blue';
            }
            console.log(person, margin - newBettingData[person].marginBet.prediction);
            if (Math.abs(margin - newBettingData[person].marginBet.prediction)<=maxMarginError){
                newBettingData[person].amount += newBettingData[person].marginBet.betAmount;
                newBettingData[person].marginBet.betAmount = 0;
                newBettingData[person].marginBet.prediction = 0;
            }else{
                newBettingData[person].amount -= newBettingData[person].marginBet.betAmount;
                newBettingData[person].marginBet.betAmount = 0;
                newBettingData[person].marginBet.prediction = 0;
            }
        }
        setBettingData(newBettingData);
    }

    const peopleList = [];
    for (const key in bettingData) {
        peopleList.push(
            <div key={key}>
                <center>
                    <h1>{key}</h1>
                </center>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        gap: '10px',
                    }}
                >
                    <NumberInput
                        propertyName="Outcome Bet Amount"
                        path={`${key}/outcomeBet/betAmount`}
                    />
                    <FlippingButton
                        propertyName="Outcome Prediction"
                        path={`${key}/outcomeBet/prediction`}
                    />
                    <NumberInput
                        propertyName="Margin Bet"
                        path={`${key}/marginBet/prediction`}
                    />
                    <NumberInput
                        propertyName="Margin Bet Amount"
                        path={`${key}/marginBet/betAmount`}
                    />
                    <h3>{bettingData[key].amount}</h3>
                </div>
                <br/><br />
            </div>
        );
    }
    peopleList.push(<End />)

    return <div>{peopleList}</div>;
}

export default Bets;
