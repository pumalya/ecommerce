import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const API = "http://localhost:3000/api";

export default function Singleproduct({ token, setToken}) {
    console.log("loaded");
    const params = useParams();
    const productId = params.productId;
    const [ singleProduct, setSingleProduct ] = useState("");

    useEffect(()=> {
        async function fetchSingleProduct() {
            console.log("downloading product");
            try{
                const response = await fetch(`${API}/productId`);
                console.log(response);
                const result = await response.json();
                console.log("download: ", result);
                setSingleProduct(result.product);
            } catch(error) {
                console.error(error);
            }
        }
        fetchSingleProduct();
    }, [productId]);
    async function checkoutProduct(productId) {
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

    console.log("Single item is: ", singleProduct);
    return (
        <div>
            {singleProduct && (
                <ul>
                    <li className ="producttitle">{singleProduct.title}</li>
                    <li className ="productauthor">{singleProduct.author}</li>
                    <li className ="description">{singleProduct.description}</li>
                    <li>
                        <img src={singleProduct.coverimage} alt={singleProduct.title} />
                    </li>
                    <li>{singleProduct.available}</li>
                    <button
                        onClick={async () => {
                        await checkoutProduct(productId);
                    }}
                    >
                    Checkout
                    </button>
                </ul>
            )}
        </div>
    );
}