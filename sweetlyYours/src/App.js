import "./App.css";
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home";

function App() {
  return (
     <div className="w-screen min-h-screen bg-white flex flex-col ">
      <Routes>
        <Route path= "/" element={<Home/>}/>
      </Routes>

    </div>
  );
}

export default App;
