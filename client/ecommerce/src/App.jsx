import { useState, useEffect } from 'react';
import Account from './components/Account';
import Home from './components/Home';
import LoginForm from './components/LoginForm.jsx';
import Carts from './components/Carts.jsx';
import Navigation from './components/Navigation';
import Products from "./components/Products";
import Register from './components/Register.jsx';
import SingleProduct from './components/SingleProduct';
import { Routes, Route} from "react-router-dom";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "shhh");

  useEffect(()=> {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <>
      <div id="navbar">
        <Navigation token={token} setToken={setToken} />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/LoginForm" element={<LoginForm token={token} setToken={setToken} />} />
        <Route path="/Products" element={<Products token={token} setToken={setToken} />} />
        <Route path="/Register" element={<Register token={token} setToken={setToken} />} />
        <Route path="/carts" element={<Carts token={token} setToken={setToken} />} />
        <Route path="/Account" element={<Account token={token} setToken={setToken} />} />
      </Routes>
    </>
  );
}

export default App;
