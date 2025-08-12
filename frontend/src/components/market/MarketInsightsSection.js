import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import marketService from '../../services/marketService';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorDisplay from '../ui/ErrorDisplay';
import { FaChartLine, FaChartBar, FaChartPie, FaNewspaper } from 'react-icons/fa';

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

const InsightsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const InsightCard = styled.div`
  border-radius: 6px;
  border: 1px solid var(--border-color);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  }
`;

const InsightHeader = styled.div`
  background-color: var(--light-bg-color);
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    color: var(--primary-color);
    font-size: 1.2rem;
  }
  
  h4 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
  }
`;

const InsightContent = styled.div`
  padding: 1rem;
  min-height: 100px;
`;

const InsightMetric = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.color || 'inherit'};
  margin-bottom: 0.5rem;
`;

const InsightDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: var(--gray-color);
`;

const InsightList = styled.ul`
  margin: 0;
  padding-left: 1.5rem;
  
  li {
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem 0;
`;

const MarketInsightsSection = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchMarketInsights = async () => {
      try {
        setLoading(true);
        const data = await marketService.getMarketInsights();
        setInsights(data);
      } catch (err) {
        console.error('Error fetching market insights:', err);
        setError('Failed to load market insights data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMarketInsights();
  }, []);
  
  if (loading) {
    return (
      <SectionContainer>
        <SectionTitle>Market Insights</SectionTitle>
        <LoadingContainer>
          <LoadingSpinner size="40px" />
        </LoadingContainer>
      </SectionContainer>
    );
  }
  
  if (error) {
    return (
      <SectionContainer>
        <SectionTitle>Market Insights</SectionTitle>
        <ErrorDisplay message={error} />
      </SectionContainer>
    );
  }
  
  if (!insights) return null;
  
  return (
    <SectionContainer>
      <SectionTitle>Market Insights</SectionTitle>
      <InsightsGrid>
        <InsightCard>
          <InsightHeader>
            <FaChartLine />
            <h4>Market Overview</h4>
          </InsightHeader>
          <InsightContent>
            <InsightMetric color={insights.marketTrend === 'up' ? 'var(--success-color)' : 'var(--danger-color)'}>
              {insights.marketTrend === 'up' ? '+' : '-'}{insights.marketPercentage}%
            </InsightMetric>
            <InsightDescription>
              {insights.marketSummary}
            </InsightDescription>
          </InsightContent>
        </InsightCard>
        
        <InsightCard>
          <InsightHeader>
            <FaChartBar />
            <h4>Top Movers</h4>
          </InsightHeader>
          <InsightContent>
            <InsightList>
              {insights.topMovers.map((mover, index) => (
                <li key={index}>
                  <strong>{mover.symbol}</strong>: {mover.change > 0 ? '+' : ''}{mover.change}% 
                  <span style={{ color: 'var(--gray-color)', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
                    ({mover.reason})
                  </span>
                </li>
              ))}
            </InsightList>
          </InsightContent>
        </InsightCard>
        
        <InsightCard>
          <InsightHeader>
            <FaChartPie />
            <h4>Sector Performance</h4>
          </InsightHeader>
          <InsightContent>
            <InsightList>
              {insights.sectorPerformance.map((sector, index) => (
                <li key={index}>
                  <strong>{sector.name}</strong>: 
                  <span style={{ 
                    color: sector.change > 0 ? 'var(--success-color)' : 'var(--danger-color)',
                    fontWeight: 500,
                    marginLeft: '0.25rem'
                  }}>
                    {sector.change > 0 ? '+' : ''}{sector.change}%
                  </span>
                </li>
              ))}
            </InsightList>
          </InsightContent>
        </InsightCard>
        
        <InsightCard>
          <InsightHeader>
            <FaNewspaper />
            <h4>Market Headlines</h4>
          </InsightHeader>
          <InsightContent>
            <InsightList>
              {insights.marketHeadlines.map((headline, index) => (
                <li key={index}>
                  {headline}
                </li>
              ))}
            </InsightList>
          </InsightContent>
        </InsightCard>
      </InsightsGrid>
    </SectionContainer>
  );
};

export default MarketInsightsSection;
