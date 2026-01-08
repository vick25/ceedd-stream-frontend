"use client";

import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

const LocaleSwitcher = () => {
  const [locale, setLocale] = useState<string>("");
  const router = useRouter();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newLocale = e.target.value;
      setLocale(newLocale);
      document.cookie = `STREAM_LOCALE=${newLocale};`;
      router.refresh();
    },
    [router],
  );

  useEffect(() => {
    const cookieLocale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("STREAM_LOCALE="))
      ?.split("=")[1];

    if (cookieLocale) {
      setLocale(cookieLocale);
    } else {
      const browserLocale = navigator.language.slice(0, 2);
      setLocale(browserLocale);
      document.cookie = `STREAM_LOCALE=${browserLocale};`;
      router.refresh();
    }
  }, [router]);

  return (
    <div className="relative">
      <select
        id="locale"
        name="locale"
        value={locale}
        onChange={handleChange}
        className="appearance-none bg-white border border-gray-300 text-gray-700 py-1.5 pl-3 pr-8 rounded leading-tight focus:outline-none focus:bg-gray-50 focus:border-blue-500 text-sm cursor-pointer font-medium hover:text-gray-900"
        aria-label="Language selection"
      >
        <option
          value="en"
          className={`font-bold ${locale === "en" ? "text-red-600" : ""}`}
        >
          EN
        </option>
        <option
          value="fr"
          className={`font-bold ${locale === "fr" ? "text-red-600" : ""}`}
        >
          FR
        </option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};

export default LocaleSwitcher;
