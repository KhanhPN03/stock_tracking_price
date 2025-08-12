import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaSearch, FaTimes } from 'react-icons/fa';
import api from '../../services/api';

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.25);
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  background: none;
  border: none;
  padding: 0 0.75rem;
  color: var(--gray-color);
  cursor: pointer;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 2rem;
  top: 0;
  bottom: 0;
  background: none;
  border: none;
  padding: 0 0.5rem;
  color: var(--gray-color);
  cursor: pointer;
  display: ${props => (props.show ? 'block' : 'none')};
  
  &:hover {
    color: var(--danger-color);
  }
`;

const ResultsDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #fff;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  margin-top: 0.25rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow-y: auto;
  display: ${props => (props.show ? 'block' : 'none')};
`;

const ResultItem = styled.div`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: rgba(13, 110, 253, 0.1);
  }
  
  h4 {
    margin: 0;
    font-size: 1rem;
  }
  
  p {
    margin: 0.25rem 0 0;
    font-size: 0.875rem;
    color: var(--gray-color);
  }
`;

const NoResults = styled.div`
  padding: 1rem;
  text-align: center;
  color: var(--gray-color);
`;

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  
  // Handle clicks outside of the search component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Debounce search function
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2) {
        performSearch();
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query]);
  
  const performSearch = async () => {
    try {
      setIsSearching(true);
      
      const response = await api.get(`/stocks/search/${query}`);
      
      if (response.data.status === 'success') {
        setResults(response.data.data || []);
        setShowResults(true);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (query.trim()) {
      // If results exist, navigate to the first result
      if (results.length > 0) {
        handleResultClick(results[0]);
      } else {
        // Perform a new search and navigate to results page
        performSearch();
      }
    }
  };
  
  const handleResultClick = (stock) => {
    setShowResults(false);
    navigate(`/stocks/${stock.Code || stock.symbol}`);
  };
  
  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };
  
  return (
    <SearchContainer ref={searchRef}>
      <form onSubmit={handleSearch}>
        <SearchInput
          type="text"
          placeholder="Search for stocks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
        />
        <ClearButton
          type="button"
          show={query.length > 0}
          onClick={clearSearch}
        >
          <FaTimes />
        </ClearButton>
        <SearchButton type="submit">
          <FaSearch />
        </SearchButton>
      </form>
      
      <ResultsDropdown show={showResults && query.length >= 2}>
        {isSearching ? (
          <NoResults>Searching...</NoResults>
        ) : results.length > 0 ? (
          results.map((stock, index) => (
            <ResultItem key={index} onClick={() => handleResultClick(stock)}>
              <h4>{stock.Code || stock.symbol}</h4>
              <p>{stock.Name || stock.description || stock.exchange}</p>
            </ResultItem>
          ))
        ) : (
          <NoResults>No results found</NoResults>
        )}
      </ResultsDropdown>
    </SearchContainer>
  );
};

export default SearchBar;
