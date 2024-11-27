import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Bets from "./pages/Bets"
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/bets" element={<Bets />}/>
        <Route path="/" element={<Bets />}/>
      </Routes>
    </BrowserRouter>
  );
}


export default App;
