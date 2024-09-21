"use client";

import React, { useState } from "react";
import IntroductionPage from "./components/IntroductionPage";
import ContactManager from "./components/ContactManager";
import PWAStatus from "./components/PWAStatus";

export default function Home() {
  const introAlreadyShown =
    typeof localStorage !== "undefined" && !localStorage.getItem("showIntro");
  const [showIntro, setShowIntro] = useState(introAlreadyShown);

  const handleGetStarted = () => {
    setShowIntro(false);
    localStorage.setItem("showIntro", "true");
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <div>
          {showIntro ? (
            <IntroductionPage onGetStarted={handleGetStarted} />
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-4">Contact Manager</h1>
              <ContactManager />
            </>
          )}
        </div>
      </div>
      <div className="fixed w-full bottom-0">
        <PWAStatus />
      </div>
    </>
  );
}
