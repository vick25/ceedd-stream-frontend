"use client";

import { Locale, useTranslations } from "@/lib/i18n";
import { useState } from "react";

type Props = {};

const InfrastructureDetails = () => {
  const [locale, setLocale] = useState<Locale>("fr");
  const t = useTranslations(locale);

  return (
    <main className="container py-6 space-y-6 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t.navigation.dashboard}</h1>
        <div className="flex gap-2">
          {/* <button
                onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
                className="bg-gray-200 px-3 py-2 rounded"
              >
                {locale === "fr" ? "EN" : "FR"}
              </button> */}

          {/* <button className="bg-blue-600 text-white px-3 py-2 rounded flex flex-row gap-4 items-center"></button> */}
        </div>
      </div>

      {/* KPI Cards */}
      {/* <div className="w-full bg-white rounded-lg shadow-xl p-6"> */}
      <div className="w-full mx-auto bg-white rounded-2xl shadow-lg p-8 sm:p-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-10">
          Infrastructure details
        </h1>

        {/* Profile Section */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border">
            {/* {image ? (
                <img src={image} className="w-full h-full object-cover" />
              ) : ( */}
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              No Photo
            </div>
            {/* )} */}
          </div>

          <div>
            <div className="flex flex-wrap gap-3 mb-2">
              <label className="inline-flex items-center justify-center px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition cursor-pointer">
                Upload Image
                <input
                  type="file"
                  className="hidden"
                // onChange={handleImageUpload}
                />
              </label>

              <button className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                Remove
              </button>
            </div>

            <p className="text-xs text-gray-500">PNG, JPG or GIF • Max 10MB</p>
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              defaultValue="Dianne"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              defaultValue="Russell"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-10">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              defaultValue="russel@hey.com"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition">
              Edit Email
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-1">
            Used to log in to your account
          </p>
        </div>

        {/* Password */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t pt-8 gap-4">
          <div>
            <p className="font-medium text-gray-900">Password</p>
            <p className="text-sm text-gray-500">
              Secure your account with a strong password
            </p>
          </div>

          <button className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition">
            Change Password
          </button>
        </div>
      </div>
      {/* </div> */}
    </main>
  );
};

export default InfrastructureDetails;
