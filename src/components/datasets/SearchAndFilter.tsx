/**
 * Search and Filter Component for Datasets
 * 
 * Provides a search input and filtering options for datasets:
 * - Text search by name or description
 * - Filter by metadata status via dropdown
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiFilter, FiCheck } from 'react-icons/fi';
import { MetadataStatus } from '@/types/metadata.types';

export interface FilterOptions {
  search: string;
  metadataStatus: MetadataStatus | 'ALL' | 'REJECTED';
  sortBy: 'newest' | 'oldest' | 'name';
}

interface SearchAndFilterProps {
  onChange: (options: FilterOptions) => void;
}

export default function SearchAndFilter({ onChange }: SearchAndFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [options, setOptions] = useState<FilterOptions>({
    search: '',
    metadataStatus: 'ALL',
    sortBy: 'newest',
  });

  // Define metadata status options
  const metadataStatusOptions = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'PENDING', label: 'Needs Metadata' },
    { value: 'EDITED', label: 'Pending Review' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' },
  ];

  // Update parent component when options change
  useEffect(() => {
    onChange(options);
  }, [options, onChange]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle filter dropdown
  const toggleFilter = () => setIsFilterOpen(prev => !prev);

  // Handle status selection
  const handleStatusChange = (value: string) => {
    setOptions(prev => ({ ...prev, metadataStatus: value as FilterOptions['metadataStatus'] }));
    setIsFilterOpen(false);
  };

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptions(prev => ({ ...prev, search: e.target.value }));
  };

  return (
    <div className="mb-6 bg-white rounded-lg shadow">
      {/* Search Bar */}
      <div className="p-4 flex items-center">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="search"
            value={options.search}
            onChange={handleSearchChange}
            placeholder="Search datasets..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleFilter}
            className="ml-4 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none flex items-center"
          >
            <FiFilter className="mr-2 h-4 w-4" />
            {options.metadataStatus === 'ALL' ? 'Filters' : `Status: ${metadataStatusOptions.find(opt => opt.value === options.metadataStatus)?.label}`}
          </button>
          
          {/* Status Filter Dropdown */}
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200 py-1">
              {metadataStatusOptions.map(option => (
                <button
                  key={option.value}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => handleStatusChange(option.value)}
                >
                  <span className="flex-grow">{option.label}</span>
                  {options.metadataStatus === option.value && (
                    <FiCheck className="h-4 w-4 text-indigo-600" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 