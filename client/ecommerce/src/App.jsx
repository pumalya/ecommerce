import { useState, useEffect } from 'react'
const APIURL = (`https://fakestoreapi.com/products`)
const Login = ({ login })=> {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = ev => {
    ev.preventDefault();
    login({ username, password });
  }
  return (
    <form onSubmit={ submit }>
      <input value={ username } placeholder='username' onChange={ ev=> setUsername(ev.target.value)}/>
      <input value={ password} placeholder='password' onChange={ ev=> setPassword(ev.target.value)}/>
      <button disabled={ !username || !password }>Login</button>
    </form>
  );
}
function App() {
  const [auth, setAuth] = useState({});
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(()=> {
    attemptLoginWithToken();
  }, []);

  const attemptLoginWithToken = async()=> {
    const token = window.localStorage.getItem('token');
    if(token){
      const response = await fetch(`/api/auth/me`, {
        headers: {
          authorization: token
        }
      });
      const json = await response.json();
      if(response.ok){
        setAuth(json);
      }
      else {
        window.localStorage.removeItem('token');
      }
    }
  };

  useEffect(()=> {
    const fetchProducts = async()=> {
      const response = await fetch('APIURL/products');
      const json = await response.json();
      setProducts(json);
    };

    fetchProducts();
  }, []);

  

  
  
  
}

export default App
