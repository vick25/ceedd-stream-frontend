import QueryProvider from "@/components/QueryProvider";
import { Poppins } from "next/font/google";
import "../globals.css";

import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

const poppins = Poppins({
    weight: ["400", "500", "600", "700"],
    subsets: ["latin"],
    display: "swap",
});

export default async function AuthLayout({ children }: { children: React.ReactNode }) {

    const messages = await getMessages();
    const locale = await getLocale();

    return (
        <html lang={locale} className={poppins.className} suppressHydrationWarning={true}>
            <body
                className="min-h-screen bg-gray-50 text-gray-900">
                <NextIntlClientProvider messages={messages}>
                    <QueryProvider>
                        {children}
                    </QueryProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
