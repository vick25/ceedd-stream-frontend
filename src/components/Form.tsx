'use client';

import API from "@/services/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/utils/constants";
import { redirect } from "next/navigation";
import { useState } from "react";

interface FormProps {
    route: string;
    method: "login" | "register";
}

const Form = ({ route, method }: FormProps) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await API({
                url: route,
                data: {
                    username: username,
                    password: password
                }
            });
            if (method === "login" && response.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
                // Redirect or update state as needed
                redirect("/");
            } else {
                redirect("/login");
            }
        } catch (error) {
            console.log(error);
            // Handle error (e.g., show error message)
        } finally {
            setLoading(false);
        }
    };

    const name = method === "login" ? "Login" : "Register";

    return (
        <form onSubmit={handleSubmit}>
            <h2>{name}</h2>
            <div>
                <label>
                    Username:
                    <input
                        type="text"
                        value={username}
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>
            </div>
            <div>
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
            </div>
            <button type="submit" disabled={loading}>
                {loading ? "Loading..." : name}
            </button>
        </form>
    )
}

export default Form