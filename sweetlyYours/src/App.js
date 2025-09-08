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
import WestIndian from "./pages/WestIndian"
import Cupcakes from "./pages/Cupcakes"
import SouthIndian from "./pages/SouthIndian";
import Cakes from "./pages/Cakes";
import BabyShower from "./pages/BabyShower";
import Birthday from "./pages/Birthday";
import Brownies from "./pages/Brownies";
import Christmas from "./pages/Christmas";
import Diwali from "./pages/Diwali";
import Donuts from "./pages/Donuts"
import Eid from "./pages/Eid";
import French from "./pages/French";
import FunAndColourful from "./pages/FunAndColourful";
import IceCream from "./pages/IceCreams";
import Italian from "./pages/Italian";
import Japanese from "./pages/Japanese";
import MiddleEast from "./pages/MiddleEast"
import Truffles from "./pages/Truffles"
import Wedding from "./pages/Wedding";
import Product from "./pages/Product";


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
         <Route
          path="WestIndianDesserts"
          element={
            <OpenRoute>
              <WestIndian />
            </OpenRoute>
          }
        />
         <Route
          path="SouthIndianDesserts"
          element={
            <OpenRoute>
              <SouthIndian />
            </OpenRoute>
          }
        />
         <Route
          path="Cakes"
          element={
            <OpenRoute>
              <Cakes />
            </OpenRoute>
          }
        />
         <Route
          path="Cupcakes"
          element={
            <OpenRoute>
              <Cupcakes />
            </OpenRoute>
          }
        /> 
         <Route
          path="Brownies"
          element={
            <OpenRoute>
              <Brownies />
            </OpenRoute>
          }
        /> 
         <Route
          path="Donuts"
          element={
            <OpenRoute>
              <Donuts />
            </OpenRoute>
          }
        /> 
         <Route
          path="Truffles"
          element={
            <OpenRoute>
              <Truffles />
            </OpenRoute>
          }
        /> 
         <Route
          path="IceCreams"
          element={
            <OpenRoute>
              <IceCream />
            </OpenRoute>
          }
        /> 
         <Route
          path="French Desserts"
          element={
            <OpenRoute>
              <French />
            </OpenRoute>
          }
        /> 
         <Route
          path="Italian Desserts"
          element={
            <OpenRoute>
              <Italian />
            </OpenRoute>
          }
        /> 
         <Route
          path="MiddleEast Desserts"
          element={
            <OpenRoute>
              <MiddleEast />
            </OpenRoute>
          }
        /> 
         <Route
          path="Japanese Desserts"
          element={
            <OpenRoute>
              <Japanese />
            </OpenRoute>
          }
        /> 
         <Route
          path="FunAndColourful"
          element={
            <OpenRoute>
              <FunAndColourful />
            </OpenRoute>
          }
        /> 
         <Route
          path="ChilledTreats"
          element={
            <OpenRoute>
              <IceCream />
            </OpenRoute>
          }
        /> 
        <Route
          path="Diwali Specials"
          element={
            <OpenRoute>
              <Diwali />
            </OpenRoute>
          }
        /> 
         <Route
          path="ChristmasSpecials"
          element={
            <OpenRoute>
              <Christmas />
            </OpenRoute>
          }
        /> 
         <Route
          path="Eid Specials"
          element={
            <OpenRoute>
              <Eid />
            </OpenRoute>
          }
        /> 
         <Route
          path="WeddingSpecials"
          element={
            <OpenRoute>
              <Wedding />
            </OpenRoute>
          }
        /> 
         <Route
          path="Baby Shower"
          element={
            <OpenRoute>
              <BabyShower />
            </OpenRoute>
          }
        /> 
         <Route
          path="Birthday"
          element={
            <OpenRoute>
              <Birthday />
            </OpenRoute>
          }
        /> 

        <Route path="/product/:productId" element={<Product />} />
        
      </Routes>

    </div>
  );
}

export default App;
