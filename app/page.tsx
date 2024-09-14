'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Trash2, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import { parseVCF } from './utils/vcfParser';
import { useFileInput } from './hooks/useFileInput';

// Custom Table components
const Table = ({ children }) => <table className="min-w-full divide-y divide-gray-200">{children}</table>;
const TableHeader = ({ children }) => <thead className="bg-gray-50">{children}</thead>;
const TableBody = ({ children }) => <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>;
const TableRow = ({ children }) => <tr>{children}</tr>;
const TableHead = ({ children }) => <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{children}</th>;
const TableCell = ({ children }) => <td className="px-6 py-4 whitespace-nowrap">{children}</td>;

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage] = useState(10);

  const { fileInputRef, handleButtonClick, handleFileChange } = useFileInput((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const vcfContent = e.target.result;
      const parsedContacts = parseVCF(vcfContent);
      setContacts(parsedContacts);
    };
    reader.readAsText(file);
  });

  const handleEdit = (index) => {
    console.log('Edit contact at index:', index);
  };

  const handleDelete = (index) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const handleExport = () => {
    console.log('Exporting contacts...');
  };

  // Pagination
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = contacts.slice(indexOfFirstContact, indexOfLastContact);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Contact Manager</h1>
      <div className="mb-4">
        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".vcf"
          className="hidden"
        />
        <Button onClick={handleButtonClick}>
          <Upload className="h-4 w-4 mr-2" />
          Choose VCF File
        </Button>
      </div>
      {contacts.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Work Mobile</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentContacts.map((contact, index) => (
                <TableRow key={index}>
                  <TableCell>{contact.name || 'N/A'}</TableCell>
                  <TableCell>{contact.mobile || 'N/A'}</TableCell>
                  <TableCell>{contact.workMobile || 'N/A'}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="icon" onClick={() => handleEdit(index)} className="mr-2">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between items-center mt-4">
            <div>
              <Button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastContact >= contacts.length}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={handleExport}>
              <Upload className="h-4 w-4 mr-2" />
              Export VCF
            </Button>
          </div>
        </>
      ) : (
        <p>No contacts uploaded yet. Please select a VCF file to begin.</p>
      )}
    </div>
  );
};

export default App;