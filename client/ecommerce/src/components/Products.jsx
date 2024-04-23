import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function productItem({ productItem }) {
    const [productList, setProductList] = useState(productItem);
    const [searchItem, setSearchItem] = useState("");
    const navigate = useNavigate();

    const search = (e) => {
    const foundItem = productItem.filter((productItem) => {
        return `${productItem} ${productItem.category} ${productItem.price}`
        .toLowerCase()
        .includes(e.target.value.toLowerCase());
    });
    setProductList(foundItem);
    setSearchItem(e.target.value);
    };

    return(
        <div id="productItem-list">
            <div id="search-container">
                <input 
                type="text"
                placeholder="Search for a product"
                value={searchItem}
                onChange={search}
                />
            </div>
            <h1>productItem</h1>
            <div id="productItem">
                {
                    productList && productList.map((productItem)=> {
                        return(
                            <div className="producItem" key={productItem.id}>
                                <h3>{productItem.name}</h3>
                                <p>Price: ${productItem.price}</p>
                                <div>
                                    <button onClick={()=> navigate(`/productItem/${productItem.id}`)}>
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