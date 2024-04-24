import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const API = "http://localhost:3000/api";


export default function Products({ token}) {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(()=> {
        async function fetchProducts() {
            try{
                const response = await fetch(`${API}/products`);
                const data = await response.json();
                console.log(data);
                setProducts(data);
            } catch(err) {
                console.error(err);
            }
        }
        fetchProducts();
    }, []);

    const handleProductsClick = async (productId, userId)=> {
        try{
            const response = await fetch(`${API}/carts/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    body: JSON.stringify({
                        user_id: userId,
                        product_id: productId,
                    }),
                },
            });
            if (response.ok) {
                navigate(`/carts`);
            } else {
                console.error("Failed to add product to cart");
            }
        } catch (err) {
                console.error(err);
        }
    };
    return (
        <>
            <div className="Products-container">
                {products && products.map((product) => {
                    return (
                        <div key={product.id} className="products-container">
                            <p className="products-name">{product.name}</p>
                            <p className="products-price">${product.price}</p>
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