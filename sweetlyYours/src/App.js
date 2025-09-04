import "./App.css";
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/core/HomePage/Navbar";
import OpenRoute from "./components/core/Auth/OpenRoute";
import SignupForm from "./components/core/Auth/SignupForm";
import LoginForm from "./components/core/Auth/LoginForm";
import VerifyEmail from "./pages/VerifyEmail";

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

         <Route
         path="login"
          element={
            <OpenRoute>
              <LoginForm/>
            </OpenRoute>
          }

        />

         <Route
         path="verify-email"
          element={
           
              <VerifyEmail/>
           
          }

        />
      </Routes>

    </div>
  );
}

export default App;
