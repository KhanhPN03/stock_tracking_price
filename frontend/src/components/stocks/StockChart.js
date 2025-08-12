import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
import stockService from '../../services/stockService';
import LoadingSpinner from '../ui/LoadingSpinner';

// Chart.js registration imports (you'd need to install Chart.js and related packages)
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

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: 300px;
`;

const LoadingContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.7);
`;

const StockChart = ({ symbol, timeframe }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const data = await stockService.getHistoricalData(symbol, timeframe);
        
        // Process data for Chart.js
        const labels = data.map(item => item.date);
        const prices = data.map(item => item.price);
        
        const formattedData = {
          labels,
          datasets: [
            {
              label: `${symbol} Price`,
              data: prices,
              borderColor: 'rgb(13, 110, 253)',
              backgroundColor: 'rgba(13, 110, 253, 0.1)',
              borderWidth: 2,
              pointRadius: 1,
              pointHoverRadius: 5,
              fill: true,
              tension: 0.1
            }
          ]
        };
        
        setChartData(formattedData);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchChartData();
  }, [symbol, timeframe]);
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                maximumFractionDigits: 0
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxTicksLimit: timeframe === '1d' ? 6 : 
                         timeframe === '1w' ? 7 : 
                         timeframe === '1m' ? 10 : 
                         timeframe === '3m' ? 12 : 
                         timeframe === '1y' ? 12 : 8
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('vi-VN', {
              maximumFractionDigits: 0
            }).format(value);
          }
        }
      }
    }
  };
  
  return (
    <ChartContainer>
      {chartData && <Line data={chartData} options={options} height={300} />}
      
      {loading && (
        <LoadingContainer>
          <LoadingSpinner size="40px" color="#0d6efd" />
        </LoadingContainer>
      )}
    </ChartContainer>
  );
};

export default StockChart;
