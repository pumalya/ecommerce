import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API = "http://localhost:3000/api";

export default function Cart({ token, setToken }) {
    const params = useParams();
    const productId = params.productId;
    const [ cart, setCart ] = useState("");

    useEffect(()=> {
        async function fetchCart() {
            console.log("downloading items");
            try{
                const response = await fetch(`${API}/api/cart/${userId}`,);
                console.log(response);
                const result= await response.json();
                console.log("download: ", result);
                setCart(result.product);
            } catch(err) {
                console.error(err);
            }
        }
        fetchCart();
    }, [userId]);

    return (
        <div>
            {cart && (
                <ul>
                    <li className="producttitle">{cart.title}</li>
                    <li className="productprice">{cart.author}</li>
                    <li className="description">{cart.description}</li>
                    <li>
                        <img src={cart.coverimage} alt={cart.title} />
                    </li>
                    <li>{cart.available}</li>
                    <button onClick={async()=> {
                        await addItemToCart(productId);
                    }}>Checkout</button>
                </ul>
            )}
        </div>
    );
}
