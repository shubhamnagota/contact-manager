"use client";

import React, { memo, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2, ChevronUp, ChevronDown, User } from 'lucide-react';
import { Contact } from '../utils/vcfParser';

interface ContactListProps {
  contacts: Contact[];
  handleSort: (key: string) => void;
  sortConfig: { key: string; direction: 'asc' | 'desc' };
  handleEdit: (index: number) => void;
  handleDelete: (index: number) => void;
  selectedContactIds: Set<string>;
  toggleContactSelection: (contactId: string) => void;
  toggleAllContacts: () => void;
}

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

const ContactRow = memo(({ contact, index, isSelected, onToggle, onEdit, onDelete }: {
  contact: Contact;
  index: number;
  isSelected: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <tr>
    <td className="px-6 py-4 whitespace-nowrap">
      <Checkbox
        checked={isSelected}
        onCheckedChange={onToggle}
      />
    </td>
    <td className="px-6 py-4 whitespace-nowrap">{getName(contact)}</td>
    <td className="px-6 py-4 whitespace-nowrap">{getPhones(contact)}</td>
    <td className="px-6 py-4 whitespace-nowrap">
      <Button variant="outline" size="sm" onClick={onEdit} className="mr-2">
        <Edit className="h-4 w-4 mr-2" />
        Edit
      </Button>
      <Button variant="outline" size="sm" onClick={onDelete}>
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </Button>
    </td>
  </tr>
));

const ContactCard = memo(({ contact, index, isSelected, onToggle, onEdit, onDelete }: {
  contact: Contact;
  index: number;
  isSelected: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <div className="bg-white shadow rounded-lg p-4 mb-4">
    <div className="flex items-center mb-2">
      <Checkbox
        checked={isSelected}
        onCheckedChange={onToggle}
        className="mr-3"
      />
      {contact.photo ? (
        <img src={`data:image/jpeg;base64,${contact.photo}`} alt={getName(contact)} className="w-10 h-10 rounded-full object-cover mr-3" />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
          <User className="h-6 w-6 text-gray-500" />
        </div>
      )}
      <h3 className="text-lg font-semibold">{getName(contact)}</h3>
    </div>
    <div className="mb-3">
      <h4 className="text-sm font-medium text-gray-500 mb-1">Phone Numbers:</h4>
      {getPhones(contact)}
    </div>
    <div className="flex space-x-2">
      <Button variant="outline" size="sm" onClick={onEdit} className="flex-1">
        <Edit className="h-4 w-4 mr-2" />
        Edit
      </Button>
      <Button variant="outline" size="sm" onClick={onDelete} className="flex-1">
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </Button>
    </div>
  </div>
));

const ContactList: React.FC<ContactListProps> = ({ 
  contacts, 
  handleSort, 
  sortConfig, 
  handleEdit, 
  handleDelete, 
  selectedContactIds,
  toggleContactSelection,
  toggleAllContacts
}) => {
  const renderContactRow = useCallback((contact: Contact, index: number) => (
    <ContactRow
      key={contact.id}
      contact={contact}
      index={index}
      isSelected={selectedContactIds.has(contact.id)}
      onToggle={() => toggleContactSelection(contact.id)}
      onEdit={() => handleEdit(index)}
      onDelete={() => handleDelete(index)}
    />
  ), [selectedContactIds, toggleContactSelection, handleEdit, handleDelete]);

  const renderContactCard = useCallback((contact: Contact, index: number) => (
    <ContactCard
      key={contact.id}
      contact={contact}
      index={index}
      isSelected={selectedContactIds.has(contact.id)}
      onToggle={() => toggleContactSelection(contact.id)}
      onEdit={() => handleEdit(index)}
      onDelete={() => handleDelete(index)}
    />
  ), [selectedContactIds, toggleContactSelection, handleEdit, handleDelete]);

  return (
    <div>
      {/* Table for larger screens */}
      <div className="hidden md:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Checkbox
                  checked={selectedContactIds.size === contacts.length && contacts.length > 0}
                  onCheckedChange={toggleAllContacts}
                />
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Name
                  {sortConfig.key === 'name' && (
                    sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone Numbers
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contacts.map(renderContactRow)}
          </tbody>
        </table>
      </div>

      {/* Cards for smaller screens */}
      <div className="md:hidden">
        {contacts.map(renderContactCard)}
      </div>
    </div>
  );
};

export default memo(ContactList);