import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const API = "http://localhost:3000/api";

function Account ({ token, setToken}) {
    console.log("account", token);

    const [accounts, setAccounts] = useState("");
    const [error, setError] = useState();

    async function downloadUser() {
        try{
            const response = await fetch(`${API}/auth/me`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            });
            const result = await response.jso();
            console.log(result);
            setAccounts(result);
        } catch(error) {
            console.error(error);
        }
    }

    async function deleteCarts(userId) {
        try {
            const response = await fetch(`${API}/api/carts/${userId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const result = await response.json();
    
            console.log(result);
        } catch (error) {
            console.error(error);
        }
    }
    const handleLogout = ()=> {
        localStorage.removeItem("token");
        setToken("");
        Navigate("/");
    };
    useEffect(()=> {
        downloadUser();
        console.log(token, "here");
    }, []);


    return(
        <>
        {!token && <Navigate to="/" replace={true} />}
        {error && <p>{error}</p>}
        {accounts && (
            <div>
            <ul>
              {/* <li>Name: {accounts.name}</li>
              <li>Email: {accounts.email}</li>
              <li>
                Carts:
                <ul>
                  {accounts.Carts.map((cart) => {
                    return (
                      <div>
                        <li key={cart.id}>{cart.title}</li>
  
                        <button
                          onClick={async () => {
                            await deleteCarts(cart.id);
                            downloadUser();
                          }}
                        >
                          Return cart
                        </button>
                      </div>
                    );
                  })}
                </ul>
              </li> */}
            </ul>
            <button token={token} onClick={handleLogout}>
              logoout
            </button>
          </div>
        )}
        </>
    );
}
export default Account;