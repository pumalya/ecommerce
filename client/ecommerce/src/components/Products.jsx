import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const API = "http://localhost:3000/api";


export default function Products({token}) {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(()=> {
        async function fetchProducts() {
            try{
                const response = await fetch("${API}/products");
                const data = await response.json();
                console.log(data);
                setProducts(data);
            } catch(error) {
                console.error(error);
            }
        }
        fetchProducts();
    }, []);

    const handleProductsClick = async (productId, userId)=> {
        try{
            const response = await fetch(`${API}/cart/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ token }`,
                    body: JSON.stringify({
                        user_id: userId,
                        product_id: productId,
                    }),
                },
            });
            if (response.ok) {
                navigate(`/cart`);
            } else {
                console.error("Failed to add product to cart");
            }
        } catch (error) {
                console.error(error);
        }
    };
    return (
        <>
            <div className="Products-container">
                {products && products.map((product) => {
                    return (
                    <div key={product.id} className="products-container">
                    <p className="products-title">{product.name}</p>
                    <img
                        className="products-cover"
                        src={`http://localhost:3000/${product.images[0]}`}
                        alt={product.images[0]}
                    />
                    <p className="products-prices">${product.price}</p>
                    <p>{product.available}</p>
                    <button onClick={() => handleProductsClick(product.id)}>
                        Add To Cart
                    </button>
                    </div>
                    );
                })}
            </div>
        </>
    );
}