/**
 * Search and Filter Component for Datasets
 * 
 * Provides a search input and filtering options for datasets:
 * - Text search by name or description
 * - Filter by metadata status
 * - Filter by file type
 * - Sort by date
 */

'use client';

import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import { MetadataStatus } from '@/types/metadata.types';

export interface FilterOptions {
  search: string;
  metadataStatus: MetadataStatus | 'ALL';
  fileType: string | 'ALL';
  sortBy: 'newest' | 'oldest' | 'name';
}

interface SearchAndFilterProps {
  onChange: (options: FilterOptions) => void;
  fileTypes: string[];
}

export default function SearchAndFilter({ onChange, fileTypes }: SearchAndFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [options, setOptions] = useState<FilterOptions>({
    search: '',
    metadataStatus: 'ALL',
    fileType: 'ALL',
    sortBy: 'newest',
  });

  // Define metadata status options
  const metadataStatusOptions = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'GENERATED', label: 'Generated' },
    { value: 'EDITED', label: 'Edited' },
    { value: 'APPROVED', label: 'Approved' },
  ];

  // Define sort options
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'name', label: 'Name (A-Z)' },
  ];

  // Update parent component when options change
  useEffect(() => {
    onChange(options);
  }, [options, onChange]);

  // Handle input/select changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOptions(prev => ({ ...prev, [name]: value }));
  };

  // Clear all filters
  const handleClearFilters = () => {
    setOptions({
      search: '',
      metadataStatus: 'ALL',
      fileType: 'ALL',
      sortBy: 'newest',
    });
  };

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptions(prev => ({ ...prev, search: e.target.value }));
  };

  // Toggle filter panel
  const toggleFilter = () => setIsFilterOpen(prev => !prev);

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
        
        <button
          onClick={toggleFilter}
          className="ml-4 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none flex items-center"
        >
          <FiFilter className="mr-2 h-4 w-4" />
          Filters
          <FiChevronDown className={`ml-1 h-4 w-4 transform transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Filter Options */}
      {isFilterOpen && (
        <div className="px-4 pb-4 border-t border-gray-200">
          <div className="flex items-center justify-between pt-4 mb-4">
            <h3 className="text-sm font-medium text-gray-900">Filter Datasets</h3>
            <button
              onClick={handleClearFilters}
              className="text-sm text-indigo-600 hover:text-indigo-900 flex items-center"
            >
              <FiX className="mr-1 h-4 w-4" />
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Metadata Status Filter */}
            <div>
              <label htmlFor="metadataStatus" className="block text-sm font-medium text-gray-700 mb-1">
                Metadata Status
              </label>
              <select
                id="metadataStatus"
                name="metadataStatus"
                value={options.metadataStatus}
                onChange={handleChange}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                {metadataStatusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* File Type Filter */}
            <div>
              <label htmlFor="fileType" className="block text-sm font-medium text-gray-700 mb-1">
                File Type
              </label>
              <select
                id="fileType"
                name="fileType"
                value={options.fileType}
                onChange={handleChange}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="ALL">All File Types</option>
                {fileTypes.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                id="sortBy"
                name="sortBy"
                value={options.sortBy}
                onChange={handleChange}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 