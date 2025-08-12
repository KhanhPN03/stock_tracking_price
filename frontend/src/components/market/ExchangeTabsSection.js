import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import marketService from '../../services/marketService';
import StockItem from '../stocks/StockItem';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorDisplay from '../ui/ErrorDisplay';

const SectionContainer = styled.section`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 1rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
  }
`;

const Tab = styled.button`
  background-color: ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'inherit'};
  border: none;
  padding: 0.5rem 1rem;
  margin-right: 0.25rem;
  border-radius: 4px 4px 0 0;
  cursor: pointer;
  white-space: nowrap;
  font-weight: ${props => props.active ? '600' : '400'};
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-color)' : 'rgba(0, 0, 0, 0.05)'};
  }
  
  &:last-child {
    margin-right: 0;
  }
`;

const StockList = styled.div`
  display: flex;
  flex-direction: column;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem 0;
`;

const ExchangeTabsSection = () => {
  const [activeExchange, setActiveExchange] = useState('HOSE');
  const [exchanges, setExchanges] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        const data = await marketService.getExchanges();
        setExchanges(data);
      } catch (err) {
        console.error('Error fetching exchanges:', err);
        setError('Failed to load exchanges data');
      }
    };
    
    fetchExchanges();
  }, []);
  
  useEffect(() => {
    const fetchStocksByExchange = async () => {
      try {
        setLoading(true);
        const data = await marketService.getStocksByExchange(activeExchange);
        setStocks(data);
        setError(null);
      } catch (err) {
        console.error(`Error fetching stocks for exchange ${activeExchange}:`, err);
        setError(`Failed to load stocks for ${activeExchange}`);
        setStocks([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (activeExchange) {
      fetchStocksByExchange();
    }
  }, [activeExchange]);
  
  const handleExchangeChange = (exchange) => {
    setActiveExchange(exchange);
  };
  
  return (
    <SectionContainer>
      <SectionTitle>Exchange Listings</SectionTitle>
      
      <TabsContainer>
        {exchanges.map((exchange) => (
          <Tab
            key={exchange.code}
            active={activeExchange === exchange.code}
            onClick={() => handleExchangeChange(exchange.code)}
          >
            {exchange.name}
          </Tab>
        ))}
      </TabsContainer>
      
      {error && <ErrorDisplay message={error} />}
      
      {loading ? (
        <LoadingContainer>
          <LoadingSpinner size="40px" />
        </LoadingContainer>
      ) : (
        <StockList>
          {stocks.map((stock) => (
            <StockItem
              key={stock.symbol}
              symbol={stock.symbol}
              name={stock.name}
              price={stock.price}
              change={stock.change}
              volume={stock.volume}
            />
          ))}
        </StockList>
      )}
    </SectionContainer>
  );
};

export default ExchangeTabsSection;
