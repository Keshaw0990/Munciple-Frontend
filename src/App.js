import { BrowserRouter , Routes, Route } from "react-router-dom";
import './App.css';
import Navbar from './component/Navbar';
import Dash from './component/Dash';
import Footer from "./component/Footer";
import Table from './component/Table';
import Info from "./component/Info";
function App() {
  return (
    <div className="App">
   <BrowserRouter>
  <Navbar />
  <Routes>
 
  <Route path='/' element={<Dash />} />
  <Route path='table' element={<Table />} /> {/* <-- Add this */}
  <Route path='info' element= {<Info />}/>
</Routes>
</BrowserRouter>
<Footer />
    </div>
  );
}

export default App;
