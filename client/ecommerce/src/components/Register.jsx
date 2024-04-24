import { useState } from "react";
import { Navigate } from "react-router-dom";
const API = "http://localhost:3000/api";

export default function Register({ setToken }) {
    const [Name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await fetch(`${API}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: Name,
                    email: email,
                    password: password,
                }),
            });
            console.log("submitting");
            const result = await response.json();
            const token = result.token;
            console.log(result);
            setToken(token);
            setLoggedIn(true);
        } catch (error) {
            console.error(error);
        }
    }
    if (loggedIn) {
        return <Navigate to="/" />;
    }

    return (
        <>
            <div className="regcontainer">
                <h2>Register for a New Account</h2>
                <form onSubmit={handleSubmit}>
                <h2>Name</h2>
                {error && <p>{error}</p>}
                <label>
                    Name:
                <input
                    name="Name"
                    value={Name}
                    onChange={(e) => setName(e.target.value)}
                />
                </label>

                <h2>Email</h2>
                <label>
                    Email:
                <input
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
                </label>

                <h2>Password</h2>
                <label>
                Password:
                <input
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                </label>
                <button type="submit">Register</button>
            </form>
        </div>
    </>
    );
}