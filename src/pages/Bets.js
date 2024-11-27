import React, { useState, useEffect } from 'react';
import './Bets.css';

function Bets() {
    // Initialize bettingData from local storage or use default values
    const [bettingData, setBettingData] = useState(() => {
        const savedData = localStorage.getItem('bettingData');
        try{
            let data = JSON.parse(savedData)
            if (data){
                return data;
            }           
        }catch(e){
            
        }
        return {
            bob: { 
                total: 10, 
                outcomeBet: { betAmount: 10, prediction: 'blue' }, 
                marginBet: { betAmount: 10, prediction: 5 } },
            alice: { 
                total: 10, 
                outcomeBet: { betAmount: 10, prediction: 'blue' }, 
                marginBet: { betAmount: 10, prediction: 5 } },
        };
    });

    // Save bettingData to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('bettingData', JSON.stringify(bettingData));
    }, [bettingData]);

    console.log(bettingData);

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

    // Controlled FlippingButton Component
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
        return (<center>
            <FlippingButton property="Match Outcome" path=""/>
        </center>
        );
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
                        propertyName="Bet Amount"
                        path={`${key}/outcomeBet/betAmount`}
                    />
                    <NumberInput
                        propertyName="Margin Bet"
                        path={`${key}/marginBet/betAmount`}
                    />
                    <FlippingButton
                        propertyName="Prediction"
                        path={`${key}/outcomeBet/prediction`}
                    />
                </div>
                <br/><br />
            </div>
        );
    }
    peopleList.push(<End />)

    return <div>{peopleList}</div>;
}

export default Bets;
