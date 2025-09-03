import "./App.css";
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/core/HomePage/Navbar";
import OpenRoute from "./components/core/Auth/OpenRoute";
import SignupForm from "./components/core/Auth/SignupForm";

function App() {
  return (
     <div className="w-screen min-h-screen bg-white flex flex-col ">
      <Navbar/>
      <Routes>
        <Route path= "/" element={<Home/>}/>
        <Route
         path="signup"
          element={
            <OpenRoute>
              <SignupForm />
            </OpenRoute>
          }

        />
      </Routes>

    </div>
  );
}

export default App;
