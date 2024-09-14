"use client";

import React, { useState } from "react";
import IntroductionPage from "./components/IntroductionPage";
import ContactManager from "./components/ContactManager";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  const handleGetStarted = () => {
    setShowIntro(false);
  };
  return (
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
  );
}
