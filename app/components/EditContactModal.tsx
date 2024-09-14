"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, User } from 'lucide-react';
import { Contact } from '../utils/vcfParser';

interface EditContactModalProps {
  contact: Contact;
  onSave: (updatedContact: Contact) => void;
  onClose: () => void;
}

const EditContactModal: React.FC<EditContactModalProps> = ({ contact, onSave, onClose }) => {
  const [editedContact, setEditedContact] = useState<Contact>(contact);

  useEffect(() => {
    setEditedContact(contact);
  }, [contact]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedContact(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneChange = (index: number, field: 'type' | 'value', value: string) => {
    setEditedContact(prev => ({
      ...prev,
      phones: prev.phones?.map((phone, i) => 
        i === index ? { ...phone, [field]: value } : phone
      )
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setEditedContact(prev => ({
          ...prev,
          photo: base64String.split(',')[1] // Remove the "data:image/jpeg;base64," part
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedContact);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Contact</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
          <div className="flex items-center justify-center">
              {editedContact.photo ? (
                <img src={`data:image/jpeg;base64,${editedContact.photo}`} alt={editedContact.fullName} className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-12 w-12 text-gray-500" />
                </div>
              )}
            </div>
            <div>
              <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Change Photo</label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
              <Input
                id="fullName"
                name="fullName"
                value={editedContact.fullName || ''}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
            {editedContact.phones?.map((phone, index) => (
              <div key={index} className="space-y-2">
                <label htmlFor={`phoneType${index}`} className="block text-sm font-medium text-gray-700">Phone Type</label>
                <Input
                  id={`phoneType${index}`}
                  value={phone.type}
                  onChange={(e) => handlePhoneChange(index, 'type', e.target.value)}
                  className="mt-1"
                />
                <label htmlFor={`phoneValue${index}`} className="block text-sm font-medium text-gray-700">Phone Number</label>
                <Input
                  id={`phoneValue${index}`}
                  value={phone.value}
                  onChange={(e) => handlePhoneChange(index, 'value', e.target.value)}
                  className="mt-1"
                />
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditContactModal;