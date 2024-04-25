import React from "react";
import Products from "./Products";

export default function Home() {
    return(
        <>
        <div className="Storefront-container">
            <h1>Welcome to your Pokémon cards store</h1>
        </div>
        <Products />
        </>
    );
}