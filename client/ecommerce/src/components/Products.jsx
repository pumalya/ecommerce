import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Products({ products }) {
    const [productList, setProductList] = useState(products);
    const [searchItem, setSearchItem] = useState("");
    const navigate = useNavigate();

    const search = (event) => {
    const foundItem = products.filter((products) => {
        return `${products} ${products.category} ${products.price}`
        .toLowerCase()
        .includes(e.target.value.toLowerCase());
    });
    setProductList(foundItem);
    setSearchItem(e.target.value);
    };

    return(
        <div id="products-list">
            <div id="search-container">
                <input 
                type="text"
                placeholder="Search for a product"
                value={searchItem}
                onChange={search}
                />
            </div>
            <h1>Products</h1>
            <div id="products">
                {
                    productList && productList.map((productItem)=> {
                        return(
                            <div className="producItem" key={productItem.id}>
                                <h3>{productItem.name}</h3>
                                <p>Price: ${productItem.price}</p>
                                <div>
                                    <button onClick={()=> navigate(`/productItems/${productItem.id}`)}>
                                        Details
                                    </button>
                                </div> 
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}