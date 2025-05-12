import { BrowserRouter , Routes, Route } from "react-router-dom";

import './App.css';
import Navbar from './component/Navbar';
import Dash from './component/Dash';
import Pari from "./component/Pari";
function App() {
  return (
    <div className="App">
   <BrowserRouter>
  <Navbar />
  <Routes>
    <Route path='pari' exact element={<Pari/>}/> 
    <Route path='dash' exact element={<Dash/>}/>
  </Routes>
</BrowserRouter>
    </div>
  );
}

export default App;
