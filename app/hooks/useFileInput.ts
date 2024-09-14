import { useRef } from 'react';

export const useFileInput = (onFileSelect) => {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return {
    fileInputRef,
    handleButtonClick,
    handleFileChange,
  };
};
