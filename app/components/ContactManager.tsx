"use client";

import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from 'lucide-react';
import { parseVCF, Contact } from '../utils/vcfParser';
import { useFileInput } from '../hooks/useFileInput';
import ContactList from './ContactList';
import SearchBar from './SearchBar';
import Pagination from './Pagination';
import FileUpload from './FileUpload';
import RecordCount from './RecordCount';
import EditContactModal from './EditContactModal';
import { contactsToVCF } from '../utils/contactsToVCF';

const ContactManager: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const { fileInputRef, handleButtonClick, handleFileChange } = useFileInput((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const vcfContent = e.target?.result as string;
      const parsedContacts = parseVCF(vcfContent);
      setContacts(parsedContacts);
    };
    reader.readAsText(file);
  });

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const name = getName(contact).toLowerCase();
      const phones = contact.phones ? contact.phones.map(p => p.value).join(' ') : '';
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
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableContacts;
  }, [filteredContacts, sortConfig]);

  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = sortedContacts.slice(indexOfFirstContact, indexOfLastContact);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };


  const handleEdit = (index: number) => {
    setEditingContact(currentContacts[index]);
  };

  const handleSaveEdit = (updatedContact: Contact) => {
    setContacts(prevContacts => 
      prevContacts.map(contact => 
        contact === editingContact ? updatedContact : contact
      )
    );
    setEditingContact(null);
  };

  const handleCloseEdit = () => {
    setEditingContact(null);
  };

  const handleDelete = (index: number) => {
    const contactToDelete = currentContacts[index];
    const newContacts = contacts.filter(contact => contact !== contactToDelete);
    setContacts(newContacts);
    
    // If we're on the last page and it's now empty, go to the previous page
    if (currentContacts.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleExport = () => {
    const vcfContent = contactsToVCF(contacts);
    const blob = new Blob([vcfContent], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'contacts.vcf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  return (
    <div className="max-w-full overflow-x-auto">
      <div className="mb-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <FileUpload 
          fileInputRef={fileInputRef}
          handleButtonClick={handleButtonClick}
          handleFileChange={handleFileChange}
        />
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      {contacts.length > 0 ? (
        <>
          <RecordCount totalRecords={contacts.length} filteredRecords={sortedContacts.length} />
          <ContactList 
            contacts={currentContacts}
            handleSort={handleSort}
            sortConfig={sortConfig}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-2 sm:space-y-0">
            <Pagination 
              currentPage={currentPage}
              totalContacts={sortedContacts.length}
              contactsPerPage={contactsPerPage}
              setCurrentPage={setCurrentPage}
            />
            <Button onClick={handleExport} className="w-full sm:w-auto">
              <Upload className="h-4 w-4 mr-2" />
              Export VCF
            </Button>
          </div>
        </>
      ) : (
        <p>No contacts uploaded yet. Please select a VCF file to begin.</p>
      )}
            {editingContact && (
        <EditContactModal
          contact={editingContact}
          onSave={handleSaveEdit}
          onClose={handleCloseEdit}
        />
      )}
    </div>
  );
};

const getName = (contact: Contact): string => {
  if (contact.fullName) return contact.fullName;
  if (contact.name) {
    const { firstName, lastName } = contact.name;
    return `${firstName || ''} ${lastName || ''}`.trim() || 'N/A';
  }
  return 'N/A';
};

export default ContactManager;