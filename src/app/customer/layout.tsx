import { NextIntlClientProvider } from "next-intl";

export default async function LocaleLayout(
  props: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

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