import React from "react";
import { Route, Link, Routes } from "react-router-dom";

export default function Navigation({ token, SetToken }) {
    return(
        <div id="nav-container">
            <nav>
                <Link to="/">Home </Link>
                <Link to="/Account">Account </Link>
                <Link to="/LoginForm">Login </Link>
                <Link to="/Cart">Cart </Link>
                <Link to="/Register">Register </Link>
                <Link to="/Products">Products </Link>
            </nav>
        </div>
    );
}