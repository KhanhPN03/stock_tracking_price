import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import { Link } from 'react-router-dom';
import MarketIndicesSection from '../components/market/MarketIndicesSection';
import GlobalMarketsSection from '../components/market/GlobalMarketsSection';
import MarketInsightsSection from '../components/market/MarketInsightsSection';
import ExchangeTabsSection from '../components/market/ExchangeTabsSection';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const HomePageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const HeroSection = styled.section`
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  text-align: center;
`;

const SectionTitle = styled.h2`
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
  color: var(--dark-color);
  position: relative;
  padding-bottom: 0.5rem;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 3px;
    background-color: var(--primary-color);
  }
`;

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const HomePage = () => {
  const [marketIndices, setMarketIndices] = useState([]);
  const [globalIndices, setGlobalIndices] = useState([]);
  const [marketInsights, setMarketInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomePageData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [indicesRes, globalRes, insightsRes] = await Promise.all([
          api.get('/market/indices'),
          api.get('/market/global'),
          api.get('/market/insights')
        ]);
        
        if (indicesRes.data.status === 'success') {
          setMarketIndices(indicesRes.data.data || []);
        }
        
        if (globalRes.data.status === 'success') {
          setGlobalIndices(globalRes.data.data || []);
        }
        
        if (insightsRes.data.status === 'success') {
          setMarketInsights(insightsRes.data.data || []);
        }
      } catch (error) {
        console.error('Error fetching home page data:', error);
        setError('Failed to load market data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHomePageData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <h2>Error</h2>
        <p>{error}</p>
        <button className="btn btn-primary mt-3" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <HomePageContainer>
      <HeroSection>
        <h1>Welcome to Vietnamese Stock Market</h1>
        <p className="mt-3">
          Your comprehensive resource for real-time Vietnamese stock market data, analysis, and tools.
        </p>
      </HeroSection>
      
      <GridLayout>
        <div>
          <section id="market-indices" className="mb-5">
            <SectionTitle>Market Indices</SectionTitle>
            <MarketIndicesSection indices={marketIndices} />
          </section>
          
          <section className="mb-5">
            <SectionTitle>Stock Exchanges</SectionTitle>
            <ExchangeTabsSection />
          </section>
        </div>
        
        <div>
          <section id="global-market" className="mb-5">
            <SectionTitle>Global Markets</SectionTitle>
            <GlobalMarketsSection globalIndices={globalIndices} />
          </section>
          
          <section id="market-insights" className="mb-5">
            <SectionTitle>Today's Market Insights</SectionTitle>
            <MarketInsightsSection insights={marketInsights} />
          </section>
        </div>
      </GridLayout>
    </HomePageContainer>
  );
};

export default HomePage;
