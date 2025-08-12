import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import StockChart from '../components/stocks/StockChart';
import StockInfo from '../components/stocks/StockInfo';
import StockNews from '../components/stocks/StockNews';
import AuthContext from '../contexts/AuthContext';
import WatchlistButton from '../components/stocks/WatchlistButton';
import AlertModal from '../components/stocks/AlertModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorDisplay from '../components/ui/ErrorDisplay';
import stockService from '../services/stockService';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;

const StockHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const StockTitle = styled.div`
  h1 {
    margin: 0;
    font-size: 2rem;
  }
  
  .ticker {
    font-size: 1.2rem;
    color: var(--gray-color);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const AlertButton = styled.button`
  background-color: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: #cd9206;
  }
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 992px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const ChartContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const InfoNewsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const TimeFrameSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const TimeButton = styled.button`
  background: ${props => props.active ? 'var(--primary-color)' : 'white'};
  color: ${props => props.active ? 'white' : 'var(--primary-color)'};
  border: 1px solid var(--primary-color);
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.active ? 'var(--primary-color)' : 'rgba(13, 110, 253, 0.1)'};
  }
`;

const StockDetailsPage = () => {
  const { symbol } = useParams();
  const { isAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [timeframe, setTimeframe] = useState('1d');
  const [showAlertModal, setShowAlertModal] = useState(false);
  
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);
        const data = await stockService.getStockDetails(symbol);
        setStockData(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch stock data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStockData();
  }, [symbol]);
  
  if (loading) {
    return (
      <PageContainer>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <LoadingSpinner size="50px" />
        </div>
      </PageContainer>
    );
  }
  
  if (error) {
    return (
      <PageContainer>
        <ErrorDisplay message={error} />
      </PageContainer>
    );
  }
  
  if (!stockData) return null;
  
  return (
    <PageContainer>
      <StockHeader>
        <StockTitle>
          <h1>{stockData.name}</h1>
          <span className="ticker">{stockData.symbol}</span>
        </StockTitle>
        <ButtonGroup>
          {isAuthenticated && (
            <>
              <WatchlistButton symbol={symbol} name={stockData.name} />
              <AlertButton onClick={() => setShowAlertModal(true)}>
                Set Price Alert
              </AlertButton>
            </>
          )}
        </ButtonGroup>
      </StockHeader>
      
      <ContentContainer>
        <div>
          <ChartContainer>
            <StockChart 
              symbol={symbol} 
              timeframe={timeframe} 
            />
            <TimeFrameSelector>
              <TimeButton 
                active={timeframe === '1d'} 
                onClick={() => setTimeframe('1d')}
              >
                1D
              </TimeButton>
              <TimeButton 
                active={timeframe === '1w'} 
                onClick={() => setTimeframe('1w')}
              >
                1W
              </TimeButton>
              <TimeButton 
                active={timeframe === '1m'} 
                onClick={() => setTimeframe('1m')}
              >
                1M
              </TimeButton>
              <TimeButton 
                active={timeframe === '3m'} 
                onClick={() => setTimeframe('3m')}
              >
                3M
              </TimeButton>
              <TimeButton 
                active={timeframe === '1y'} 
                onClick={() => setTimeframe('1y')}
              >
                1Y
              </TimeButton>
              <TimeButton 
                active={timeframe === '5y'} 
                onClick={() => setTimeframe('5y')}
              >
                5Y
              </TimeButton>
            </TimeFrameSelector>
          </ChartContainer>
        </div>
        
        <InfoNewsContainer>
          <StockInfo stockData={stockData} />
          <StockNews symbol={symbol} />
        </InfoNewsContainer>
      </ContentContainer>
      
      {showAlertModal && (
        <AlertModal 
          symbol={symbol} 
          currentPrice={stockData.price} 
          onClose={() => setShowAlertModal(false)} 
        />
      )}
    </PageContainer>
  );
};

export default StockDetailsPage;
