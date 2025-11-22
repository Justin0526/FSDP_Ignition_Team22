// src/components/ResourcesPanel.jsx
"use client";

import { useState } from "react";

export default function ResourcesPanel() {
  // "tutorial" | "article" | null
  const [openType, setOpenType] = useState(null);

  // Feedback popup state
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const openTutorial = () => setOpenType("tutorial");
  const openArticle = () => setOpenType("article");
  const handleClose = () => setOpenType(null);

  // When staff clicks YES or NO
  const handleFeedback = () => {
    setOpenType(null); // close main modal
    setFeedbackMessage("Thank you for your feedback!"); // open thanks popup
  };

  const closeFeedbackPopup = () => setFeedbackMessage(null);

  return (
    <>
      {/* Right panel – Resources */}
      <section className="rounded-2xl bg-white/85 backdrop-blur-sm border p-4 shadow-md">
        <h3 className="text-lg font-semibold mb-3 text-gray-900">Resources</h3>
        <ul className="space-y-3 text-sm">

          {/* Tutorial */}
          <li
            className="flex items-start gap-2 cursor-pointer hover:bg-gray-100 rounded-md px-2 py-1 transition"
            onClick={openTutorial}
          >
            <span className="mt-0.5">▶️</span>
            <div>
              <div className="font-medium text-gray-900 underline">
                Tutorial: Helping customers freeze their card
              </div>
              <div className="text-gray-700">Short internal video guide</div>
            </div>
          </li>

          {/* Article */}
          <li
            className="flex items-start gap-2 cursor-pointer hover:bg-gray-100 rounded-md px-2 py-1 transition"
            onClick={openArticle}
          >
            <span className="mt-0.5">📰</span>
            <div>
              <div className="font-medium text-gray-900 underline">
                Banking Help Article: Freezing bank card
              </div>
              <div className="text-gray-700">Knowledge base reference</div>
            </div>
          </li>
        </ul>
      </section>

      {/* MAIN MODAL (Tutorial or Article) */}
      {openType && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40"
          onClick={handleClose}
        >
          <div
            className="relative bg-white rounded-2xl max-w-5xl w-[90%] max-h-[90vh] p-8 shadow-2xl flex flex-col md:flex-row gap-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-red-500 text-2xl font-bold hover:text-red-700"
              onClick={handleClose}
            >
              ✕
            </button>

            {/* LEFT SIDE */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 rounded-xl bg-gray-300 flex items-center justify-center overflow-hidden">
                {openType === "tutorial" ? (
                  <span className="text-3xl">▶️</span>
                ) : (
                  <div className="w-[85%] h-[85%] bg-gray-100 border border-gray-400 shadow-inner flex items-center justify-center">
                    <span className="text-xs text-gray-500">Article preview</span>
                  </div>
                )}
              </div>

              <p className="mt-3 text-sm font-medium text-gray-800 break-all">
                {openType === "tutorial"
                  ? "https://how/to/freeze/card/tutorial"
                  : "https://how/to/freeze/card/article"}
              </p>
            </div>

            {/* RIGHT SIDE CONTENT */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                {openType === "tutorial" ? (
                  <>
                    <h2 className="text-lg font-bold mb-3 text-gray-900">
                      Brief Overview: How to help customers freeze their card
                      due to suspicious activities, unauthorised transactions, etc.
                    </h2>
                    <p className="text-sm text-gray-800 leading-relaxed">
                      This tutorial walks staff through the step-by-step process
                      of freezing a customer&apos;s card and ensuring follow-up actions.
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-lg font-bold mb-3 text-gray-900">
                      Summary: Firstly, open the card freeze tool and enter the
                      customer&apos;s card details. Next choose freeze/unfreeze and
                      enter the reason. Lastly save changes.
                    </h2>
                    <p className="text-sm text-gray-800 leading-relaxed">
                      This article provides a written reference for the full process.
                    </p>
                  </>
                )}
              </div>

              {/* YES / NO */}
              <div className="mt-6">
                <p className="text-base font-medium text-gray-900 mb-4">
                  Did this help solve your issue?
                </p>
                <div className="flex gap-4">
                  <button
                    className="px-6 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white font-semibold"
                    onClick={handleFeedback}
                  >
                    No
                  </button>
                  <button
                    className="px-6 py-2 rounded-md bg-green-500 hover:bg-green-600 text-white font-semibold"
                    onClick={handleFeedback}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK POPUP */}
      {feedbackMessage && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/20">
          <div className="bg-white rounded-xl shadow-xl p-6 text-center w-[300px]">
            <div className="text-xl mb-3">✅</div>
            <p className="text-gray-900 font-medium mb-4">
              {feedbackMessage}
            </p>
            <button
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold"
              onClick={closeFeedbackPopup}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
