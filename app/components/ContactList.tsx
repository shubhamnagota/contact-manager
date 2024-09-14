"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ChevronUp, ChevronDown,User } from 'lucide-react';
import { Contact } from '../utils/vcfParser';

interface ContactListProps {
  contacts: Contact[];
  handleSort: (key: string) => void;
  sortConfig: { key: string; direction: 'asc' | 'desc' };
  handleEdit: (index: number) => void;
  handleDelete: (index: number) => void;
}

const Table: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">{children}</table>
  </div>
);
const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => <thead className="bg-gray-50">{children}</thead>;
const TableBody: React.FC<{ children: React.ReactNode }> = ({ children }) => <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>;
const TableRow: React.FC<{ children: React.ReactNode }> = ({ children }) => <tr>{children}</tr>;
const TableHead: React.FC<{ children: React.ReactNode; onClick?: () => void; isSorted?: boolean; sortDirection?: 'asc' | 'desc' }> = ({ children, onClick, isSorted, sortDirection }) => (  <th 
    scope="col" 
    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-center">
      {children}
      {isSorted && (
        sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
      )}
    </div>
  </th>
);
const TableCell: React.FC<{ children: React.ReactNode }> = ({ children }) => <td className="px-6 py-4 whitespace-normal">{children}</td>;

const getName = (contact: Contact): string => {
  if (contact.fullName) return contact.fullName;
  if (contact.name) {
    const { firstName, lastName } = contact.name;
    return `${firstName || ''} ${lastName || ''}`.trim() || 'N/A';
  }
  return 'N/A';
};

const getPhones = (contact: Contact): React.ReactNode => {
  if (contact.phones && contact.phones.length > 0) {
    return contact.phones.map((phone, index) => (
      <div key={index} className="text-sm">
        {phone.type}: {phone.value} {phone.isPref ? '(Preferred)' : ''}
      </div>
    ));
  }
  return 'N/A';
};

const ContactList: React.FC<ContactListProps> = ({ contacts, handleSort, sortConfig, handleEdit, handleDelete }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
        <TableHead>Photo</TableHead>
        <TableHead 
            onClick={() => handleSort('name')}
            isSorted={sortConfig.key === 'name'}
            sortDirection={sortConfig.direction}
          >
            Name
          </TableHead>
          <TableHead>Phone Numbers</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map((contact, index) => (
          <TableRow key={index}>
                  <TableCell>
              {contact.photo ? (
                <img src={`data:image/jpeg;base64,${contact.photo}`} alt={getName(contact)} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-500" />
                </div>
              )}
            </TableCell>
            <TableCell>{getName(contact)}</TableCell>
            <TableCell>{getPhones(contact)}</TableCell>
            <TableCell>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(index)} className="w-full sm:w-auto">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(index)} className="w-full sm:w-auto">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ContactList;