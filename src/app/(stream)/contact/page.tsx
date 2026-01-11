import Footer from "@/components/Footer";
import { getTranslations } from "next-intl/server";

export default async function ContactPage() {
  const t = await getTranslations("ContactPage");

  return (
    <div className="min-h-screen flex flex-col">
      <main className="grow bg-gray-50 flex flex-col items-center justify-center p-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm max-w-lg w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            {t("title")}
          </h1>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("name")}
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder={t("namePlaceholder")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("email")}
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder={t("messagePlaceholder")}
              ></textarea>
            </div>
            <button
              type="button"
              className="w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              {t("sendMessage")}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
