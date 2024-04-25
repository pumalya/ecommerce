import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API = "http://localhost:3000/api";

export default function Carts({ token, setToken }) {
    const params = useParams();
    const productId = params.productId;
    const [ carts, setCarts ] = useState(null);

    useEffect(()=> {
        async function fetchCarts() {
            console.log("downloading items");
            try{
                const response = await fetch(`${API}/api/carts/${userId}`,);
                console.log(response);
                const result= await response.json();
                console.log("download: ", result);
                setCarts(result.product);
            } catch(error) {
                console.error(error);
            }
        }
        fetchCarts();
    }, [userId]);

    return (
        <div>
            {carts && (
                <ul>
                    <li className="producttitle">{carts.title}</li>
                    <li className="productprice">{carts.author}</li>
                    <li className="description">{carts.description}</li>
                    <li>
                        <img src={carts.coverimage} alt={carts.title} />
                    </li>
                    <li>{carts.available}</li>
                    <button onClick={async()=> {
                        await addItemToCarts(productId);
                    }}>Checkout</button>
                </ul>
            )}
        </div>
    );
}
