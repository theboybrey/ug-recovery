import React, { useState } from 'react';

import { AiOutlineClose } from 'react-icons/ai';
import Button from '../core/button';
import { FiSearch } from 'react-icons/fi';

interface FilterOption {
  label: string;
  value: string;
}

interface FunctionalSearchInputProps {
  filters: FilterOption[];
  onSearch: (query: string, selectedFilters: string[]) => void;
}

const FunctionalSearchInput: React.FC<FunctionalSearchInputProps> = ({ filters, onSearch }) => {
  const [query, setQuery] = useState<string>('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleSearch = () => {
    onSearch(query, selectedFilters);
  };

  const handleFilterChange = (filterValue: string) => {
    setSelectedFilters((prevFilters) =>
      prevFilters.includes(filterValue)
        ? prevFilters.filter((filter) => filter !== filterValue)
        : [...prevFilters, filterValue]
    );
  };

  const clearQuery = () => {
    setQuery('');
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border rounded px-4 py-2 focus:outline-none focus:border-primary"
            placeholder="Search..."
          />
          {query && (
            <AiOutlineClose
              onClick={clearQuery}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray"
            />
          )}
        </div>
        <Button
          onClick={handleSearch}
          variant='primary'
          className='flex items-center justify-center gap-2'
        >
          <FiSearch className="mr-2" />
          Search
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <label key={filter.value} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              value={filter.value}
              checked={selectedFilters.includes(filter.value)}
              onChange={() => handleFilterChange(filter.value)}
              className="form-checkbox"
            />
            <span>{filter.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default FunctionalSearchInput;
