import { useState } from "react";

export default function Register({ setToken }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isAdmin, setIsAdmin] = useState("false");
    const [err, setErr] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const condition =
            !username ||
            !password ||
            password.length < 8;
        if (condition) {
            const errMessage = "Please try again";
        throw err(errMessage);
        }
        const userData = {
            username: username,
            password: password,
            isAdmin: isAdmin,
        };
        const result = await createUser(userData);
        setToken(result.token);
        } catch (err) {
            setErr(err.message);
        }
    }
    return (
        <>
        <div id="registerForm">
            <h2>Registration</h2>
            {err && <p>{err}</p>}
            <form id="register" onSubmit={handleSubmit}>
                <label>
                    Username:{" "}
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                </label>
                <label>
                    Password:{" "}
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
                </label>
                <button>Submit</button>
            </form>
        </div>
    </>
    );
}
