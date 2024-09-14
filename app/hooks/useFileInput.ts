"use client";

import { useRef, useCallback } from 'react';

interface UseFileInputResult {
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleButtonClick: () => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const useFileInput = (onFileSelect: (file: File) => void): UseFileInputResult => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return {
    fileInputRef,
    handleButtonClick,
    handleFileChange
  };
};