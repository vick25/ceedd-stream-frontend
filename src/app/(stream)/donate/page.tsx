import Footer from "@/components/Footer";
import { getTranslations } from "next-intl/server";

export default async function DonatePage() {
  const t = await getTranslations("DonatePage");

  return (
    <div className="min-h-screen flex flex-col">
      <main className="grow bg-gray-50 flex flex-col items-center justify-center p-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-lg">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("title")}
          </h1>
          <p className="text-gray-600 mb-6">{t("donateDescription")}</p>
          <button className="px-8 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-lg">
            {t("donateButton")}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
