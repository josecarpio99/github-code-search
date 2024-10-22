import React from 'react';
import { FileCode, GitBranch } from 'lucide-react';
import { SearchResult } from '../types';

interface SearchResultsProps {
  results: SearchResult[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  if (results.length === 0) {
    return <p className="text-center text-gray-600">No results found.</p>;
  }

  return (
    <div className="space-y-4">
      {results.map((result, index) => (
        <div key={index} className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-2 flex items-center">
            <GitBranch className="mr-2 text-blue-500" size={20} />
            <a href={result.repository.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {result.repository.full_name}
            </a>
          </h2>
          <p className="text-sm text-gray-600 flex items-center">
            <FileCode className="mr-2" size={16} />
            <a href={result.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {result.path}
            </a>
          </p>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;