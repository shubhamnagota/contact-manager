"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Contact } from '../utils/vcfParser';

interface MergeGroup {
  name: string;
  contacts: Contact[];
  finalName: string;
  selected: boolean[];
}

interface MergeByNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: Contact[];
  onMerge: (mergedContacts: Contact[]) => void;
}

const MergeByNameModal: React.FC<MergeByNameModalProps> = ({ isOpen, onClose, contacts, onMerge }) => {
  const [mergeGroups, setMergeGroups] = useState<MergeGroup[]>([]);

  useEffect(() => {
    const groups: { [key: string]: Contact[] } = {};
    contacts.forEach(contact => {
      const name = contact.fullName?.toLowerCase() || '';
      if (!groups[name]) {
        groups[name] = [];
      }
      groups[name].push(contact);
    });

    const initialMergeGroups: MergeGroup[] = Object.entries(groups)
      .filter(([_, groupContacts]) => groupContacts.length > 1)
      .map(([name, groupContacts]) => ({
        name,
        contacts: groupContacts,
        finalName: groupContacts[0].fullName || '',
        selected: groupContacts.map(() => true),
      }));

    setMergeGroups(initialMergeGroups);
  }, [contacts]);

  const handleFinalNameChange = (index: number, value: string) => {
    setMergeGroups(prev => 
      prev.map((group, i) => i === index ? { ...group, finalName: value } : group)
    );
  };

  const handleSelectionChange = (groupIndex: number, contactIndex: number) => {
    setMergeGroups(prev => 
      prev.map((group, i) => 
        i === groupIndex 
          ? { 
              ...group, 
              selected: group.selected.map((sel, j) => j === contactIndex ? !sel : sel) 
            } 
          : group
      )
    );
  };

  const handleMerge = () => {
    const mergedContacts: Contact[] = mergeGroups.flatMap(group => {
      const selectedContacts = group.contacts.filter((_, index) => group.selected[index]);
      if (selectedContacts.length > 1) {
        // Merge selected contacts
        const mergedContact: Contact = {
          ...selectedContacts[0],
          id: selectedContacts[0].id,
          fullName: group.finalName,
          phones: selectedContacts.flatMap(c => c.phones || []),
          categories: Array.from(new Set(selectedContacts.flatMap(c => c.categories || []))),
          // Merge other fields as needed
        };
        return [mergedContact];
      } else {
        // Return selected contacts without merging
        return selectedContacts;
      }
    });

    onMerge(mergedContacts);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Merge Contacts by Name</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] overflow-y-auto pr-4">
          {mergeGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-6 p-4 border rounded">
              <h3 className="font-semibold mb-2">Original Name: {group.name}</h3>
              <div className="mb-4">
                <Label htmlFor={`finalName-${groupIndex}`}>Final Name</Label>
                <Input
                  id={`finalName-${groupIndex}`}
                  value={group.finalName}
                  onChange={(e) => handleFinalNameChange(groupIndex, e.target.value)}
                  className="mt-1"
                />
              </div>
              {group.contacts.map((contact, contactIndex) => (
                <div key={contactIndex} className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    id={`contact-${groupIndex}-${contactIndex}`}
                    checked={group.selected[contactIndex]}
                    onCheckedChange={() => handleSelectionChange(groupIndex, contactIndex)}
                  />
                  <Label htmlFor={`contact-${groupIndex}-${contactIndex}`}>
                    {contact.fullName} ({contact.phones?.map(p => p.value).join(', ')})
                  </Label>
                </div>
              ))}
            </div>
          ))}
        </ScrollArea>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">Cancel</Button>
          <Button onClick={handleMerge}>Merge Selected</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MergeByNameModal;