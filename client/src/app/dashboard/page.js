// src/app/dashboard/page.js
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SummaryPanelServer from "@/components/dashboard/SummaryPanelServer";
import ResourcesPanel from "@/components/dashboard/ResourcesPanel";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader />

      <main className="p-8">
        <div className="grid grid-cols-12 gap-4">
          {/* LEFT: Summary + Customer Info */}
          <div className="col-span-12 md:col-span-3">
            <SummaryPanelServer />
          </div>

          {/* MIDDLE + RIGHT with shared background */}
          <div
            className="col-span-12 md:col-span-9 rounded-2xl bg-cover bg-center bg-no-repeat p-4"
            style={{ backgroundImage: "url('/dashboard-bg.jpg')" }}
          >
            <div className="grid md:grid-cols-9 gap-4">
              {/* CENTER */}
              <div className="col-span-9 md:col-span-6 space-y-4">
                <section className="rounded-2xl bg-white/85 backdrop-blur-sm border p-4 shadow-md">
                  <h2 className="text-xl font-bold mb-3 text-gray-900">
                    Tools (AI Recommended &amp; Manual Options)
                  </h2>

                  <div className="mb-6">
                    <h3 className="font-semibold mb-3 text-gray-900">
                      AI Recommended Tools
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <span className="mt-1">⚙️</span>
                        <div>
                          <div className="font-semibold text-gray-900">
                            Card Freeze Tool
                          </div>
                          <div className="text-sm font-medium text-gray-800">
                            Suspends customer’s card to stop further transactions
                          </div>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1">🔎</span>
                        <div>
                          <div className="font-semibold text-gray-900">
                            Transaction Tracer
                          </div>
                          <div className="text-sm font-medium text-gray-800">
                            Review recent transactions
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="mb-2">
                    <h3 className="font-semibold mb-3 text-gray-900">
                      Other Available Tools
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <span className="mt-1">👤</span>
                        <div>
                          <div className="font-semibold text-gray-900">
                            View Customer Profile
                          </div>
                          <div className="text-sm font-medium text-gray-800">
                            View accounts, cards, etc.
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </section>

                <section className="rounded-2xl bg-white/85 backdrop-blur-sm border p-4 shadow-md">
                  <div className="font-semibold text-gray-900 mb-2">
                    Voice to text Note taking
                  </div>
                  <p className="text-sm text-gray-800">
                    <span className="font-semibold">Customer:</span> I want to
                    freeze my card as I have recently received an unauthorised
                    transaction
                  </p>
                  <p className="text-sm text-gray-800 mt-1">
                    <span className="font-semibold">Staff:</span> Okay I will
                    help you look into the transaction and freeze your card
                    shortly.
                  </p>
                </section>
              </div>

              {/* RIGHT */}
              <div className="col-span-9 md:col-span-3 space-y-4">
                {/* Resources with popup */}
                <ResourcesPanel />

                {/* Guideline Questions (unchanged) */}
                <section className="rounded-2xl bg-white/85 backdrop-blur-sm border p-4 shadow-md">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">
                    Guideline Questions
                  </h3>
                  <ul className="list-disc pl-5 text-sm space-y-2 text-gray-800">
                    <li>When did this transaction happen?</li>
                    <li>Would you like to request a replacement card now?</li>
                  </ul>
                </section>

                {/* Mini OCBC AI widget (unchanged) */}
                <section className="rounded-2xl bg-white/85 backdrop-blur-sm border p-4 shadow-md">
                  <div className="flex items-center gap-2">
                    <img
                      src="/Logo.png"
                      alt="OCBC AI"
                      className="h-5 w-auto object-contain"
                    />
                    <span className="text-sm font-semibold text-gray-900">
                      OCBC AI
                    </span>
                  </div>

                  <div className="mt-3 rounded-xl border bg-gray-50 p-3 text-sm">
                    <div className="text-gray-900">
                      How may I assist you today?
                    </div>
                    <div className="mt-2 text-gray-900">
                      I&apos;m looking for the{" "}
                      <span className="font-semibold">PIN Reset Tool</span>
                    </div>
                    <button className="mt-3 w-full rounded-full bg-rose-200 hover:bg-rose-300 text-gray-900 px-3 py-2 font-semibold">
                      PIN Reset Tool
                    </button>
                  </div>

                  <div className="mt-3 flex items-center gap-2 rounded-full border px-3 py-2 bg-white">
                    <input
                      type="text"
                      placeholder="Write a message"
                      className="flex-1 outline-none text-sm placeholder:text-gray-500"
                    />
                    <span className="text-rose-400">➤</span>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
