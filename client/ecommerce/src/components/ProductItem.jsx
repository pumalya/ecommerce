import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProducts } from "../api";


function ProductItem() {
    const [ item, setItem ] = useState("");
    const { id } = useParams();

    const fetchProductItem = async()=> {
        try {
            const result = await fetchProducts(id);
            setItem(result);
            console.log(item);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchProductItem();
    }, );

    fetchProductItem()

    return (
        <div>
        {item && (
            <div id="item">
            <h2>{item.name}</h2>
            <p>
                <span>Description: </span> {item.description}
            </p>
            <p>
            <span>Price: </span>${item.price}
            </p>
            <button>Add to Cart</button>
            </div>
        )}
    </div>
    );
}

export default ProductItem