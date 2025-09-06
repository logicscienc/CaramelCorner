import "./App.css";
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/core/HomePage/Navbar";
import OpenRoute from "./components/core/Auth/OpenRoute";
import SignupForm from "./components/core/Auth/SignupForm";
import LoginForm from "./components/core/Auth/LoginForm";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import Eastindian from "./pages/Eastindian";

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
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />

         <Route
         path="verify-email"
          element={
           
              <VerifyEmail/>
           
          }

        />

          <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />

         <Route
          path="EastIndianDesserts"
          element={
            <OpenRoute>
              <Eastindian />
            </OpenRoute>
          }
        />
      </Routes>

    </div>
  );
}

export default App;
