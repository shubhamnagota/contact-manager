import React from 'react';
import ContactManager from './components/ContactManager';

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Contact Manager</h1>
      <ContactManager />
    </div>
  );
}