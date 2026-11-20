import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  // Le cookie vient du navigateur : il peut contenir n'importe quoi.
  // On n'accepte que les langues pour lesquelles un fichier de messages existe.
  const SUPPORTED_LOCALES = ["fr", "en"];
  const cookieLocale = (await cookies()).get("STREAM_LOCALE")?.value;
  const locale =
    cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)
      ? cookieLocale
      : "fr"; // public principal francophone
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
