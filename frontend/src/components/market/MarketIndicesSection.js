import React from 'react';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const IndicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

const IndexCard = styled.div`
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  padding: 1.25rem;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  }
`;

const IndexName = styled.h3`
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
`;

const IndexPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
`;

const IndexChange = styled.div`
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 1rem;
  color: ${props => 
    props.change > 0 
      ? 'var(--price-up)' 
      : props.change < 0 
        ? 'var(--price-down)' 
        : 'var(--price-unchanged)'
  };
`;

const ChartContainer = styled.div`
  height: 150px;
`;

const MarketIndicesSection = ({ indices = [] }) => {
  // Helper function to format index name
  const formatIndexName = (code) => {
    const nameMap = {
      'VN-Index.INDX': 'VN-Index',
      'VN30.INDX': 'VN30',
      'HNX.INDX': 'HNX',
      'HNX30.INDX': 'HNX30',
      'UPCOM.INDX': 'UPCOM'
    };
    
    return nameMap[code] || code;
  };
  
  // Helper function to generate mock chart data
  const generateChartData = (index) => {
    // In a real application, you would use actual historical data
    // For now, we'll generate mock data based on the current price and change
    const basePrice = index.close || 1000;
    const priceChange = index.change || 0;
    const direction = priceChange >= 0 ? 1 : -1;
    
    // Generate 20 data points for the chart
    const data = [];
    for (let i = 0; i < 20; i++) {
      // Add some randomness but keep the trend
      const randomFactor = Math.random() * 5 - 2.5;
      const trendFactor = (i / 20) * Math.abs(priceChange) * direction;
      data.push(basePrice - priceChange + trendFactor + randomFactor);
    }
    
    return {
      labels: Array(20).fill(''),
      datasets: [
        {
          data,
          fill: false,
          borderColor: direction >= 0 ? 'var(--price-up)' : 'var(--price-down)',
          tension: 0.4,
          pointRadius: 0
        }
      ]
    };
  };
  
  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    },
    scales: {
      x: {
        display: false
      },
      y: {
        display: false
      }
    },
    elements: {
      line: {
        borderWidth: 2
      }
    }
  };
  
  return (
    <IndicesGrid>
      {indices.map((index, i) => (
        <IndexCard key={i}>
          <IndexName>{formatIndexName(index.code || index.symbol)}</IndexName>
          <IndexPrice>{typeof index.close === 'number' ? index.close.toFixed(2) : 'N/A'}</IndexPrice>
          <IndexChange change={index.change || 0}>
            {index.change > 0 ? '+' : ''}{typeof index.change === 'number' ? index.change.toFixed(2) : '0.00'} ({typeof index.change_p === 'number' ? index.change_p.toFixed(2) : '0.00'}%)
          </IndexChange>
          <ChartContainer>
            <Line data={generateChartData(index)} options={chartOptions} />
          </ChartContainer>
        </IndexCard>
      ))}
      
      {/* If no data is available, show placeholder cards */}
      {indices.length === 0 && (
        <>
          <IndexCard>
            <IndexName>VN-Index</IndexName>
            <IndexPrice>1,204.21</IndexPrice>
            <IndexChange change={7.32}>+7.32 (+0.61%)</IndexChange>
            <ChartContainer>
              <Line 
                data={generateChartData({ close: 1204.21, change: 7.32 })} 
                options={chartOptions}
              />
            </ChartContainer>
          </IndexCard>
          <IndexCard>
            <IndexName>VN30</IndexName>
            <IndexPrice>1,232.56</IndexPrice>
            <IndexChange change={5.89}>+5.89 (+0.48%)</IndexChange>
            <ChartContainer>
              <Line 
                data={generateChartData({ close: 1232.56, change: 5.89 })} 
                options={chartOptions}
              />
            </ChartContainer>
          </IndexCard>
          <IndexCard>
            <IndexName>HNX</IndexName>
            <IndexPrice>225.17</IndexPrice>
            <IndexChange change={-1.23}>-1.23 (-0.54%)</IndexChange>
            <ChartContainer>
              <Line 
                data={generateChartData({ close: 225.17, change: -1.23 })} 
                options={chartOptions}
              />
            </ChartContainer>
          </IndexCard>
          <IndexCard>
            <IndexName>UPCOM</IndexName>
            <IndexPrice>87.92</IndexPrice>
            <IndexChange change={0.34}>+0.34 (+0.39%)</IndexChange>
            <ChartContainer>
              <Line 
                data={generateChartData({ close: 87.92, change: 0.34 })} 
                options={chartOptions}
              />
            </ChartContainer>
          </IndexCard>
        </>
      )}
    </IndicesGrid>
  );
};

export default MarketIndicesSection;
