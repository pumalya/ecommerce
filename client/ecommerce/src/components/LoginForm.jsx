import { useState } from "react";
import { fetchUser } from "../api";

export default function LoginForm ({ setToken }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const userData = { username, password };
            const result = await fetchUser(userData);

        if (!result.token) {
            const errMessage =
            "The email or password you entered does not match our records";
            throw err(errMessage);
            }

            setToken(result.token);
        } catch (err) {
        setErr(err.message);
        }
    }
    return (
        <>
        <div id="loginForm">
            <h2>Log In</h2>
            {err && <p>{err}</p>}
            <form id="login" onSubmit={handleSubmit}>
            <label>
                Username:{" "}
            <input value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>
            <label>
                Password:{""}
                <input
                    type="password"
                    value={password}
                    placeholder="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </label>
            <button>Submit</button>
            </form>
        </div>
    </>
    );
}


