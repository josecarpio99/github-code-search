import React, { useState } from 'react';
import { Search } from 'lucide-react';
import axios from 'axios';
import SearchForm from './components/SearchForm';
import SearchResults from './components/SearchResults';
import Pagination from './components/Pagination';
import { SearchResult } from './types';

function App() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentQuery, setCurrentQuery] = useState('');
  const [currentFilename, setCurrentFilename] = useState('');
  const perPage = 30; // GitHub API default

  const handleSearch = async (query: string, filename: string, page: number = 1) => {
    setLoading(true);
    setError(null);
    setCurrentQuery(query);
    setCurrentFilename(filename);

    try {
      const q = `${query}${filename ? ` filename:${filename}` : ''}`;
      const response = await axios.get('https://api.github.com/search/code', {
        params: { q, page, per_page: perPage },
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`,
        },
      });

      const results: SearchResult[] = response.data.items.map((item: any) => ({
        name: item.name,
        path: item.path,
        repository: {
          full_name: item.repository.full_name,
          html_url: item.repository.html_url,
        },
        html_url: item.html_url,
      }));

      setSearchResults(results);
      setTotalCount(response.data.total_count);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError('An error occurred while fetching search results. Please try again.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    handleSearch(currentQuery, currentFilename, newPage);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          <Search className="inline-block mr-2" />
          GitHub Code Search
        </h1>
        <SearchForm onSearch={handleSearch} />
        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        <SearchResults results={searchResults} />
        {totalCount > perPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalCount / perPage)}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}

export default App;