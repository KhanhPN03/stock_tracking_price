import React from 'react';
import styled from 'styled-components';

const InfoCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const InfoTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

const InfoSection = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h4`
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
  color: var(--gray-color);
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem 2rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoLabel = styled.span`
  font-size: 0.85rem;
  color: var(--gray-color);
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.span`
  font-weight: 500;
`;

const CompanyDetails = styled.div`
  p {
    margin: 0 0 0.5rem;
    line-height: 1.5;
  }
`;

const StockInfo = ({ stockData }) => {
  return (
    <InfoCard>
      <InfoTitle>Stock Info</InfoTitle>
      
      <InfoSection>
        <SectionTitle>Trading Information</SectionTitle>
        <InfoGrid>
          <InfoItem>
            <InfoLabel>Open</InfoLabel>
            <InfoValue>
              {new Intl.NumberFormat('vi-VN', {
                maximumFractionDigits: 0
              }).format(stockData.open)}
            </InfoValue>
          </InfoItem>
          
          <InfoItem>
            <InfoLabel>Previous Close</InfoLabel>
            <InfoValue>
              {new Intl.NumberFormat('vi-VN', {
                maximumFractionDigits: 0
              }).format(stockData.previousClose)}
            </InfoValue>
          </InfoItem>
          
          <InfoItem>
            <InfoLabel>Day's High</InfoLabel>
            <InfoValue>
              {new Intl.NumberFormat('vi-VN', {
                maximumFractionDigits: 0
              }).format(stockData.high)}
            </InfoValue>
          </InfoItem>
          
          <InfoItem>
            <InfoLabel>Day's Low</InfoLabel>
            <InfoValue>
              {new Intl.NumberFormat('vi-VN', {
                maximumFractionDigits: 0
              }).format(stockData.low)}
            </InfoValue>
          </InfoItem>
          
          <InfoItem>
            <InfoLabel>52 Week High</InfoLabel>
            <InfoValue>
              {new Intl.NumberFormat('vi-VN', {
                maximumFractionDigits: 0
              }).format(stockData.yearHigh)}
            </InfoValue>
          </InfoItem>
          
          <InfoItem>
            <InfoLabel>52 Week Low</InfoLabel>
            <InfoValue>
              {new Intl.NumberFormat('vi-VN', {
                maximumFractionDigits: 0
              }).format(stockData.yearLow)}
            </InfoValue>
          </InfoItem>
          
          <InfoItem>
            <InfoLabel>Volume</InfoLabel>
            <InfoValue>
              {new Intl.NumberFormat('vi-VN', {
                notation: 'compact',
                compactDisplay: 'short'
              }).format(stockData.volume)}
            </InfoValue>
          </InfoItem>
          
          <InfoItem>
            <InfoLabel>Avg. Volume</InfoLabel>
            <InfoValue>
              {new Intl.NumberFormat('vi-VN', {
                notation: 'compact',
                compactDisplay: 'short'
              }).format(stockData.avgVolume)}
            </InfoValue>
          </InfoItem>
        </InfoGrid>
      </InfoSection>
      
      <InfoSection>
        <SectionTitle>Company Details</SectionTitle>
        <InfoGrid>
          <InfoItem>
            <InfoLabel>Market Cap</InfoLabel>
            <InfoValue>
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                notation: 'compact',
                compactDisplay: 'short',
                maximumFractionDigits: 0
              }).format(stockData.marketCap)}
            </InfoValue>
          </InfoItem>
          
          <InfoItem>
            <InfoLabel>P/E Ratio</InfoLabel>
            <InfoValue>{stockData.pe}</InfoValue>
          </InfoItem>
          
          <InfoItem>
            <InfoLabel>EPS</InfoLabel>
            <InfoValue>
              {new Intl.NumberFormat('vi-VN', {
                maximumFractionDigits: 0
              }).format(stockData.eps)}
            </InfoValue>
          </InfoItem>
          
          <InfoItem>
            <InfoLabel>Dividend Yield</InfoLabel>
            <InfoValue>{stockData.dividend}%</InfoValue>
          </InfoItem>
          
          <InfoItem>
            <InfoLabel>Sector</InfoLabel>
            <InfoValue>{stockData.sector}</InfoValue>
          </InfoItem>
          
          <InfoItem>
            <InfoLabel>Industry</InfoLabel>
            <InfoValue>{stockData.industry}</InfoValue>
          </InfoItem>
          
          <InfoItem>
            <InfoLabel>Exchange</InfoLabel>
            <InfoValue>{stockData.exchange}</InfoValue>
          </InfoItem>
        </InfoGrid>
      </InfoSection>
      
      <InfoSection>
        <SectionTitle>About {stockData.name}</SectionTitle>
        <CompanyDetails>
          <p>
            {stockData.description || 
              `${stockData.name} (${stockData.symbol}) is a company listed on the ${stockData.exchange}. It operates in the ${stockData.industry} industry within the ${stockData.sector} sector.`}
          </p>
        </CompanyDetails>
      </InfoSection>
    </InfoCard>
  );
};

export default StockInfo;
