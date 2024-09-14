"use client";

import React from 'react';

interface RecordCountProps {
  totalRecords: number;
  filteredRecords: number;
}

const RecordCount: React.FC<RecordCountProps> = ({ totalRecords, filteredRecords }) => {
  return (
    <div className="text-sm text-gray-500 mb-4">
      {filteredRecords === totalRecords ? (
        <p>Total Records: {totalRecords}</p>
      ) : (
        <p>Showing {filteredRecords} of {totalRecords} records</p>
      )}
    </div>
  );
};

export default RecordCount;