import userData from "./components/Register";


async function fetchProducts() {
    try {
        const response = await fetch("http://localhost:3000/api/Products");
        const data = await response.json();
        return data;
    } catch (err) {
        console.log("Error", err);
    }
}

const fetchProductItem = async(ProductItem) => {
    try {
        const response = await fetch(
        `http://localhost:3000/api//${ProductItem}`
        );
        console.log("response: ", response);
        if (!response.ok) {
            console.log("API error", response.status);
            return;
        }

        const result = await response.json();
        return result;
    } catch (err) {
        console.err("Error:", err);
    }
};

const createUser = async (userData) => {
    try {
        const response = await fetch("http://localhost:3000/LoginForm", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        });
        const result = await response.json();
        return result;
        } catch (err) {
        console.err("Err:", err);
        throw err;
    }
};

const fetchUser = async (userData) => {
    try {
        const response = await fetch("http://localhost:3000/loginForm", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            },
        body: JSON.stringify(userData),
        });
        const result = await response.json();
        return result;
    } catch (err) {
        console.err("Error", err);
    }
};

export { fetchProducts, fetchProductItem, fetchUser, createUser, userData };