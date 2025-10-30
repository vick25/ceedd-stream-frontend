"use client";

import API from "@/services/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/utils/constants";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AdminPage = () => {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        (async () => {
            try {
                await auth();
            } catch {
                setIsAuthorized(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isAuthorized === true) {
            // send logged in users to dashboard
            router.replace("/dashboard");
        } else if (isAuthorized === false) {
            // not logged in: send to login
            router.replace("/login");
        }
    }, [isAuthorized, router]);

    const refreshToken = async () => {
        const refresh_token = localStorage.getItem(REFRESH_TOKEN);
        if (!refresh_token) {
            setIsAuthorized(false);
            return;
        }
        try {
            const response = await API.post("/api/token/refresh/", {
                refresh: refresh_token,
            });
            if (response.status === 200 && response.data?.access) {
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
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false);
            return;
        }

        try {
            const decode = (jwtDecode as any)(token);
            const tokenExp = decode?.exp;
            if (tokenExp && tokenExp < Date.now() / 1000) {
                await refreshToken();
            } else {
                setIsAuthorized(true);
            }
        } catch (err) {
            console.log("Invalid token", err);
            setIsAuthorized(false);
        }
    };

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    // component will redirect via useEffect; render a fallback
    return (
        <div>
            {isAuthorized ? (
                <div>
                    <h1>Welcome — redirecting to dashboard…</h1>
                </div>
            ) : (
                <div>
                    <h1>Access Denied</h1>
                    <p>You must be registered and logged in to access the admin dashboard.</p>
                    <div className="flex gap-2">
                        <Link href="/login" className="underline">
                            Login
                        </Link>
                        <Link href="/register" className="underline">
                            Register
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;
