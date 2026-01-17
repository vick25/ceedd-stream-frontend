"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

const LocaleSwitcher = () => {
  const [locale, setLocale] = useState<string>("");
  const router = useRouter();

  const handleValueChange = (newLocale: string) => {
    if (newLocale === locale) return;
    setLocale(newLocale);
    document.cookie = `STREAM_LOCALE=${newLocale}; path=/`;
    router.refresh();
  };

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
      document.cookie = `STREAM_LOCALE=${browserLocale}; path=/`;
    }
  }, []);

  return (
    <Select onValueChange={handleValueChange} value={locale}>
      <SelectTrigger
        className="w-17 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        aria-label="Language selection"
      >
        <SelectValue placeholder="Lang" />
      </SelectTrigger>
      <SelectContent className="z-1200">
        <SelectItem value="en" className="font-bold">
          EN
        </SelectItem>
        <SelectItem value="fr" className="font-bold">
          FR
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LocaleSwitcher;