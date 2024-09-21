'use client'

import React, { useState, useEffect } from 'react';

const PWAStatus: React.FC = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => setIsReady(true));
    }
  }, []);

  if (!isReady) return null;

  return (
    <div className="bg-green-500 text-white p-2 text-center">
      App is ready to work offline!
    </div>
  );
};

export default PWAStatus;