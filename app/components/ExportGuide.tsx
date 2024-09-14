"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

interface ExportGuideProps {
  onClose: () => void;
}

const ExportGuide: React.FC<ExportGuideProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">How to Export VCF Files</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-2">Android</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Open the Contacts app on your Android device.</li>
              <li>Tap the menu icon (usually three dots) and select "Settings" or "Import/Export".</li>
              <li>Choose "Export to .vcf file" or a similar option.</li>
              <li>Select the contacts you want to export, or choose "All contacts".</li>
              <li>Choose a location to save the file (e.g., internal storage or SD card).</li>
              <li>Tap "Save" or "Export".</li>
              <li>Transfer the .vcf file to your computer or upload it directly to this app.</li>
            </ol>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">iOS (iPhone)</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Open the Contacts app on your iPhone.</li>
              <li>Tap on a contact to view their details.</li>
              <li>Scroll down and tap "Share Contact".</li>
              <li>Choose "Mail" or another sharing option.</li>
              <li>Send the .vcf file to yourself or directly upload it to this app.</li>
              <li>To export multiple contacts, use iCloud:</li>
              <ol className="list-[lower-alpha] list-inside ml-4 mt-2 space-y-1">
                <li>Go to icloud.com and sign in.</li>
                <li>Click on "Contacts".</li>
                <li>Select the contacts you want to export.</li>
                <li>Click the gear icon and choose "Export vCard".</li>
              </ol>
            </ol>
          </section>
        </div>

        <div className="mt-6">
          <Button onClick={onClose} className="w-full">Close Guide</Button>
        </div>
      </div>
    </div>
  );
};

export default ExportGuide;