import { Footer } from "@/components/MapFooter";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function AboutPage() {
  const t = await getTranslations("AboutPage");

  return (
    <div className="min-h-screen flex flex-col">
      <main className="grow bg-gray-50 flex flex-col items-center justify-center p-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-5xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-md text-gray-600 mb-6">
            {t.rich("whoWeAreDescription", {
              link: (chunks: React.ReactNode) => (
                <Link
                  className="text-blue-500 hover:underline"
                  href={t("ceeddHref")}
                  rel="noopener noreferrer"
                >
                  {chunks}
                </Link>
              ),
              link1: (chunks: React.ReactNode) => (
                <Link
                  className="text-blue-500 hover:underline"
                  href={t("terrafirmaHref")}
                  rel="noopener noreferrer"
                >
                  {chunks}
                </Link>
              ),
            })}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="p-4 bg-blue-50 rounded-lg space-y-2">
              <h3 className="font-bold text-blue-800 mb-2">
                {t("ourMission")}
              </h3>
              <div className="text-md text-gray-700">
                {t("value1")}
                <ul className="list-disc list-inside mt-2 space-y-1 pl-5">
                  <li>{t("value2")}</li>
                  <li>{t("value3")}</li>
                </ul>
              </div>
              <p className="text-md text-gray-700">{t("value4")}</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-bold text-blue-800 mb-2">{t("ourVision")}</h3>
              <p className="text-md text-gray-700">{t("value5")}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
