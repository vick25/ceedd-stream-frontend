import { NextIntlClientProvider } from "next-intl";

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <NextIntlClientProvider
      locale={params.locale}
      messages={
        // Lazy import des messages de la locale
        // Note: Next charge statiquement; ici on garde simple côté client
        undefined as any
      }
    >
      {children}
    </NextIntlClientProvider>
  );
}