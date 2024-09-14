"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from 'lucide-react';

interface FileUploadProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleButtonClick: () => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ fileInputRef, handleButtonClick, handleFileChange }) => {
  return (
    <>
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
    </>
  );
};

export default FileUpload;