import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import marketService from '../../services/marketService';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorDisplay from '../ui/ErrorDisplay';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

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

const MarketsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
`;

const MarketCard = styled.div`
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  }
`;

const MarketName = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .country {
    font-size: 0.85rem;
    color: var(--gray-color);
    font-weight: 400;
  }
`;

const MarketPrice = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const MarketChange = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.isPositive ? 'var(--success-color)' : 'var(--danger-color)'};
  font-weight: 500;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem 0;
`;

const GlobalMarketsSection = () => {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchGlobalMarkets = async () => {
      try {
        setLoading(true);
        const data = await marketService.getGlobalMarkets();
        setMarkets(data);
      } catch (err) {
        console.error('Error fetching global markets:', err);
        setError('Failed to load global markets data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGlobalMarkets();
  }, []);
  
  if (loading) {
    return (
      <SectionContainer>
        <SectionTitle>Global Markets</SectionTitle>
        <LoadingContainer>
          <LoadingSpinner size="40px" />
        </LoadingContainer>
      </SectionContainer>
    );
  }
  
  if (error) {
    return (
      <SectionContainer>
        <SectionTitle>Global Markets</SectionTitle>
        <ErrorDisplay message={error} />
      </SectionContainer>
    );
  }
  
  return (
    <SectionContainer>
      <SectionTitle>Global Markets</SectionTitle>
      <MarketsGrid>
        {markets.map((market) => {
          const isPositive = market.change >= 0;
          
          return (
            <MarketCard key={market.symbol}>
              <MarketName>
                <span>{market.name}</span>
                <span className="country">{market.country}</span>
              </MarketName>
              <MarketPrice>{market.price.toLocaleString()}</MarketPrice>
              <MarketChange isPositive={isPositive}>
                {isPositive ? <FaArrowUp /> : <FaArrowDown />}
                <span>{Math.abs(market.change).toFixed(2)}%</span>
              </MarketChange>
            </MarketCard>
          );
        })}
      </MarketsGrid>
    </SectionContainer>
  );
};

export default GlobalMarketsSection;
