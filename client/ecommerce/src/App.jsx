import LoginForm from './components/LoginForm';
import Cart from './components/Cart';
import Products from "./components/Products";
import ProductItem from './components/productItem';
import Register from './components/Register';
import { Routes, Route, Link } from "react-router-dom";

const App = () => {
  
  return (
    <>
    <nav>
        <Link to = "/">My Cart</Link>
        <Link to = "/">Categories</Link>
        <Link to = "/components/Register">Create an account</Link>
        <Link to = "/"></Link>
        
      </nav>
      <Routes>
        <Route path="/loginForm" element={<LoginForm />} />
        <Route path="/register" element={<Register />} />
        <Route path="products" element={<Products />} />
        <Route path="productItem" element={<ProductItem />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </>
  );
};

export default App
