"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ImportGuideProps {
  onClose: () => void;
}

const ImportGuide: React.FC<ImportGuideProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">How to Import VCF Files</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-2">Android</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Transfer the exported .vcf file to your Android device.</li>
              <li>Open the Contacts app on your device.</li>
              <li>
                Tap the menu icon (usually three dots) and select "Settings" or
                "Import/Export".
              </li>
              <li>Choose "Import from .vcf file" or a similar option.</li>
              <li>Navigate to where you saved the .vcf file and select it.</li>
              <li>Choose to import all contacts or select specific ones.</li>
              <li>Tap "Import" or "OK" to complete the process.</li>
            </ol>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">iOS (iPhone)</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Email the .vcf file to yourself or use a file transfer method to
                get it on your iPhone.
              </li>
              <li>Open the email or file containing the .vcf attachment.</li>
              <li>Tap on the .vcf file attachment.</li>
              <li>
                iOS will recognize it as a contact file and ask if you want to
                add the contact(s).
              </li>
              <li>
                Tap "Add All Contacts" to import all contacts in the file.
              </li>
              <li>
                Alternatively, you can add contacts one by one by tapping on
                each contact card.
              </li>
            </ol>
          </section>
        </div>

        <div className="mt-6">
          <Button onClick={onClose} className="w-full">
            Close Guide
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImportGuide;
