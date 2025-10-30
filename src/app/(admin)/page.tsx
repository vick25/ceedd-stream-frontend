'use client';

import API from "@/services/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/utils/constants";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const AdminPage = () => {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false));
    }, []);


    const refreshToken = async () => {
        // Logic to refresh token and set isAuthorized
        const refresh_token = localStorage.getItem(REFRESH_TOKEN);
        try {
            const response = await API.post("/api/token/refresh/", {
                refresh: refresh_token
            });
            if (response.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
        } catch (error) {
            console.log(error);
            setIsAuthorized(false);
        }
    };

    const auth = async () => {
        // Logic to check authorization
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false);
            return;
        }

        const decode = jwtDecode(token);
        const tokenExp = (decode as any).exp;
        if (tokenExp < Date.now() / 1000) {
            await refreshToken();
        } else {
            setIsAuthorized(true);
        }

        setIsAuthorized(true);
    };

    if (isAuthorized === null) {
        // refreshToken();
        return <div>Loading...</div>;
    }

    return isAuthorized ? (
        <div>
            <h1>Welcome to the Admin Page</h1>
            {redirect("/dashboard/")}
        </div>
    ) : (
        <div>
            <h1>Access Denied</h1>
            <p>You do not have permission to view this page.</p>
            <Link href="/login">Go to Login</Link>
        </div>
    );
}

export default AdminPage;
