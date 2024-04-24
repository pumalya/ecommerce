import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const API = "http://localhost:3000/api";

export default function SingleItem({ token, setToken}) {
    console.log("loaded");
    const params = useParams();
    const productId = params.productId;
    const [ singleItem, setSingleItem ] = useState("");

    useEffect(()=> {
        async function fetchSingleItem() {
            console.log("downloading product");
            try{
                const response = await fetch(`${API}/productId`);
                console.log(response);
                const result = await response.json();
                console.log("download: ", result);
                setSingleItem(result.product);
            } catch(err) {
                console.error(err);
            }
        }
        fetchSingleItem();
    }, [productId]);
    async function checkoutItem(productId) {
        try {
            const response = await fetch(`${API}/products/${productId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                available: false,
                }),
            });
            const result= await response.json();
            console.log(result);
        } catch(err) {
            console.error(err);
        }
    }

    console.log("Single item is: ", singleItem);
    return(
        <div>
        {singleItem && (
            <ul>
                <li className ="productname">{singleItem.name}</li>
                <li className ="productprice">{singleItem.price}</li>
                <li className ="quantity">{singleItem.quantity}</li>
                <li>{singleItem.available}</li>
            <button onClick={async () => {
                await checkoutItem(productId);
            }}
            >Checkout</button>
            </ul>
        )}
        </div>
    );
}