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
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";


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
           
              <Eastindian />
            
          }
        />
         <Route
          path="WestIndianDesserts"
          element={
           
              <WestIndian />
            
          }
        />
         <Route
          path="SouthIndianDesserts"
          element={
            
              <SouthIndian />
            
          }
        />
         <Route
          path="Cakes"
          element={
            
              <Cakes />
            
          }
        />
         <Route
          path="Cupcakes"
          element={
            
              <Cupcakes />
          } 
        /> 
         <Route
          path="Brownies"
          element={
            
              <Brownies />
           
          }
        /> 
         <Route
          path="Donuts"
          element={
            
              <Donuts />
            
          }
        /> 
         <Route
          path="Truffles"
          element={
            
              <Truffles />
            
          }
        /> 
         <Route
          path="IceCreams"
          element={
            
              <IceCream />
            
          }
        /> 
         <Route
          path="French Desserts"
          element={
           
              <French />
            
          }
        /> 
         <Route
          path="Italian Desserts"
          element={
            
              <Italian />
            
          }
        /> 
         <Route
          path="MiddleEast Desserts"
          element={
            
              <MiddleEast />
           
          }
        /> 
         <Route
          path="Japanese Desserts"
          element={
           
              <Japanese />
            
          }
        /> 
         <Route
          path="FunAndColourful"
          element={
            
              <FunAndColourful />
            
          }
        /> 
         <Route
          path="ChilledTreats"
          element={
            
              <IceCream />
            
          }
        /> 
        <Route
          path="Diwali Specials"
          element={
            
              <Diwali />
            
          }
        /> 
         <Route
          path="ChristmasSpecials"
          element={
            
              <Christmas />
           
          }
        /> 
         <Route
          path="Eid Specials"
          element={
            
              <Eid />
            
          }
        /> 
         <Route
          path="WeddingSpecials"
          element={
            
              <Wedding />
           
          }
        /> 
         <Route
          path="Baby Shower"
          element={
            
              <BabyShower />
            
          }
        /> 
         <Route
          path="Birthday"
          element={
            
              <Birthday />
            
          }
        /> 

        <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} /> 
          <Route path="/wishlist" element={<Wishlist />} />
      </Routes>

    </div>
  );
}

export default App;
