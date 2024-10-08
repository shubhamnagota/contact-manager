"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalContacts: number;
  contactsPerPage: number;
  setCurrentPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalContacts, contactsPerPage, setCurrentPage }) => {
  const totalPages = Math.ceil(totalContacts / contactsPerPage);

  return (
    <div className="flex items-center space-x-2">
      <Button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} size="sm">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <Button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} size="sm">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination;