import Account from './components/Account';
import Home from './components/Home';
import LoginForm from './components/LoginForm';
import Cart from './components/Cart';
import Navigation from './components/Navigation';
import Products from "./components/Products";
import Register from './components/Register';
import { Routes, Route} from "react-router-dom";
import { useState, useEffect } from 'react';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

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
        <Route path="/Login" element={<LoginForm token={token} setToken={setToken} />} />
        <Route path="/Register" element={<Register token={token} setToken={setToken} />} />
        <Route path="/Products" element={<Products />} />
        <Route path="/Cart" element={<Cart token={token} setToken={setToken} />} />
        <Route path="/Account" element={<Account token={token} setToken={setToken} />} />
      </Routes>
    </>
  );
};

export default App
