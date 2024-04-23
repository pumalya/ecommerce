import React from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";

const CartProduct = ({productItem})=> {
    const { removefromCart, increaseAmount, decreaseAmount }  = useContext(CartContext);
    const { id, name, category, price, quantity } = item;
    
    return (
        <div>
            <div>
                <Link to={`/products/${id}`}></Link>
            </div>
            <div onClick={()=>removefromCart(id)}></div>
            <div onClick={() => decreaseAmount(id)}></div>
            <div onClick={() => increaseAmount(id)}></div>
        </div>
    )
}

export default CartProduct