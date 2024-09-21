"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, HelpCircle, FileText, Merge } from "lucide-react";
import { parseVCF, Contact } from "../utils/vcfParser";
import { contactsToVCF } from "../utils/contactsToVCF";
import { useFileInput } from "../hooks/useFileInput";
import ContactList from "./ContactList";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";
import FileUpload from "./FileUpload";
import RecordCount from "./RecordCount";
import EditContactModal from "./EditContactModal";
import ImportGuide from "./ImportGuide";
import ExportGuide from "./ExportGuide";
import MergeByMobileModal from "./MergeByMobileModal";
import MergeByNameModal from "./MergeByNameModal";

const ContactManager: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({ key: "name", direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [showImportGuide, setShowImportGuide] = useState(false);
  const [showExportGuide, setShowExportGuide] = useState(false);
  const [selectedContactIds, setSelectedContactIds] = useState<Set<string>>(
    new Set()
  );
  const [groupUpdateText, setGroupUpdateText] = useState("");
  const [groupUpdatePosition, setGroupUpdatePosition] = useState<
    "prepend" | "append"
  >("prepend");
  const [showMergeByMobileModal, setShowMergeByMobileModal] = useState(false);
  const [showMergeByNameModal, setShowMergeByNameModal] = useState(false);

  const { fileInputRef, handleButtonClick, handleFileChange } = useFileInput(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const vcfContent = e.target?.result as string;
        const parsedContacts = parseVCF(vcfContent);
        setContacts(parsedContacts);
        setShowExportGuide(false);
      };
      reader.readAsText(file);
    }
  );

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const name = getName(contact).toLowerCase();
      const phones = contact.phones
        ? contact.phones.map((p) => p.value).join(" ")
        : "";
      const searchLower = searchTerm.toLowerCase();
      return name.includes(searchLower) || phones.includes(searchLower);
    });
  }, [contacts, searchTerm]);

  const sortedContacts = useMemo(() => {
    let sortableContacts = [...filteredContacts];
    if (sortConfig.key) {
      sortableContacts.sort((a, b) => {
        const aValue = getName(a).toLowerCase();
        const bValue = getName(b).toLowerCase();
        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableContacts;
  }, [filteredContacts, sortConfig]);

  const toggleContactSelection = useCallback((contactId: string) => {
    setSelectedContactIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(contactId)) {
        newSet.delete(contactId);
      } else {
        newSet.add(contactId);
      }
      return newSet;
    });
  }, []);

  const toggleAllContacts = useCallback(() => {
    if (selectedContactIds.size === sortedContacts.length) {
      setSelectedContactIds(new Set());
    } else {
      setSelectedContactIds(
        new Set(sortedContacts.map((contact) => contact.id))
      );
    }
  }, [sortedContacts, selectedContactIds]);

  const handleGroupUpdate = useCallback(() => {
    if (groupUpdateText.trim() === "") return;

    setContacts((prevContacts) =>
      prevContacts.map((contact) => {
        if (selectedContactIds.has(contact.id)) {
          const currentName = contact.fullName || "";
          const newName =
            groupUpdatePosition === "prepend"
              ? `${groupUpdateText} ${currentName}`
              : `${currentName} ${groupUpdateText}`;

          return {
            ...contact,
            fullName: newName.trim(),
            name: {
              ...contact.name,
              firstName: newName.trim(),
              lastName: "",
            },
          };
        }
        return contact;
      })
    );

    setGroupUpdateText("");
    setSelectedContactIds(new Set());
  }, [groupUpdateText, groupUpdatePosition, selectedContactIds]);

  const handleSort = useCallback((key: string) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  }, []);

  const handleEdit = useCallback(
    (index: number) => {
      setEditingContact(sortedContacts[index]);
    },
    [sortedContacts]
  );

  const handleDelete = useCallback(
    (index: number) => {
      const contactToDelete = sortedContacts[index];
      setContacts((prevContacts) =>
        prevContacts.filter((contact) => contact.id !== contactToDelete.id)
      );
      setSelectedContactIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(contactToDelete.id);
        return newSet;
      });
    },
    [sortedContacts]
  );

  const handleExport = useCallback(() => {
    const vcfContent = contactsToVCF(contacts);
    const blob = new Blob([vcfContent], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "contacts.vcf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowImportGuide(true);
  }, [contacts]);

  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = sortedContacts.slice(
    indexOfFirstContact,
    indexOfLastContact
  );

  const handleSaveEdit = (updatedContact: Contact) => {
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact === editingContact ? updatedContact : contact
      )
    );
    setEditingContact(null);
  };

  const handleCloseEdit = () => {
    setEditingContact(null);
  };

  const handleMergeByMobile = () => {
    setShowMergeByMobileModal(true);
  };

  const handleMergeByName = () => {
    setShowMergeByNameModal(true);
  };

  const handleMergeContactsForMobile = (mergedContacts: Contact[]) => {
    // Remove old contacts and add merged ones
    const updatedContacts = contacts.filter(
      (contact) =>
        !mergedContacts.some((mergedContact) =>
          mergedContact.phones?.some((phone) =>
            contact.phones?.some((p) => p.value === phone.value)
          )
        )
    );
    setContacts([...updatedContacts, ...mergedContacts]);
  };

  const handleMergeContactsForName = (mergedContacts: Contact[]) => {
    setContacts(prevContacts => {
      const mergedIds = new Set(mergedContacts.flatMap(contact => 
        contact.phones?.map(phone => phone.value) || []
      ));
      
      // Remove old contacts that were merged
      const updatedContacts = prevContacts.filter(contact => 
        !contact.phones?.some(phone => mergedIds.has(phone.value))
      );
      
      // Add merged contacts
      return [...updatedContacts, ...mergedContacts];
    });
  };

const loadDemoContacts = async () => {
  try {
    const response = await fetch('/demo.vcf');
    const vcfContent = await response.text();
    const demoContacts = parseVCF(vcfContent);
    setContacts(demoContacts);
  } catch (error) {
    console.error('Error loading demo contacts:', error);
    alert('Failed to load demo contacts. Please try again.');
  }
};


  return (
    <div className="max-w-full overflow-x-auto">
      <div className="mb-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <FileUpload
          fileInputRef={fileInputRef}
          handleButtonClick={handleButtonClick}
          handleFileChange={handleFileChange}
        />
         <Button onClick={loadDemoContacts}>
          <FileText className="h-4 w-4 mr-2" />
          Load Demo Contacts
        </Button>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      {contacts.length > 0 ? (
        <>
          <RecordCount
            totalRecords={contacts.length}
            filteredRecords={sortedContacts.length}
          />
          <div className="mb-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Input
              placeholder="Enter text to prepend/append"
              value={groupUpdateText}
              onChange={(e) => setGroupUpdateText(e.target.value)}
            />
            <select
              value={groupUpdatePosition}
              onChange={(e) =>
                setGroupUpdatePosition(e.target.value as "prepend" | "append")
              }
              className="border border-gray-300 rounded-md px-2 py-1"
            >
              <option value="prepend">Prepend</option>
              <option value="append">Append</option>
            </select>
            <Button
              onClick={handleGroupUpdate}
              disabled={
                selectedContactIds.size === 0 || groupUpdateText.trim() === ""
              }
            >
              Update Selected Contacts
            </Button>
          </div>
          <div className="flex space-x-2 mb-4">
            <Button onClick={handleMergeByMobile}>
              <Merge className="h-4 w-4 mr-2" />
              Merge by Mobile
            </Button>
            <Button onClick={handleMergeByName}>
              <Merge className="h-4 w-4 mr-2" />
              Merge by Name
            </Button>
          </div>
          <ContactList
            contacts={sortedContacts}
            handleSort={handleSort}
            sortConfig={sortConfig}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            selectedContactIds={selectedContactIds}
            toggleContactSelection={toggleContactSelection}
            toggleAllContacts={toggleAllContacts}
          />
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-2 sm:space-y-0">
            <Pagination
              currentPage={currentPage}
              totalContacts={sortedContacts.length}
              contactsPerPage={contactsPerPage}
              setCurrentPage={setCurrentPage}
            />
            <div className="flex space-x-2">
              <Button onClick={handleExport} className="w-full sm:w-auto">
                <Upload className="h-4 w-4 mr-2" />
                Export VCF
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center">
          <p className="mb-4">
            No contacts uploaded yet. Please select a VCF file to begin.
          </p>
          <Button onClick={() => setShowExportGuide(true)} variant="outline">
            <HelpCircle className="h-4 w-4 mr-2" />
            How to Export VCF from Phone
          </Button>
        </div>
      )}
      {editingContact && (
        <EditContactModal
          contact={editingContact}
          onSave={handleSaveEdit}
          onClose={handleCloseEdit}
        />
      )}
      {showImportGuide && (
        <ImportGuide onClose={() => setShowImportGuide(false)} />
      )}
      {showExportGuide && (
        <ExportGuide onClose={() => setShowExportGuide(false)} />
      )}
      <MergeByMobileModal
        isOpen={showMergeByMobileModal}
        onClose={() => setShowMergeByMobileModal(false)}
        contacts={contacts}
        onMerge={handleMergeContactsForMobile}
      />
            <MergeByNameModal
        isOpen={showMergeByNameModal}
        onClose={() => setShowMergeByNameModal(false)}
        contacts={contacts}
        onMerge={handleMergeContactsForName}
      />
    </div>
  );
};

const getName = (contact: Contact): string => {
  if (contact.fullName) return contact.fullName;
  if (contact.name) {
    const { firstName, lastName } = contact.name;
    return `${firstName || ""} ${lastName || ""}`.trim() || "N/A";
  }
  return "N/A";
};

export default ContactManager;
