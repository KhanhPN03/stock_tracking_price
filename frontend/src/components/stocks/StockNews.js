import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import stockService from '../../services/stockService';
import LoadingSpinner from '../ui/LoadingSpinner';
import { FaNewspaper } from 'react-icons/fa';

const NewsCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const NewsTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    color: var(--primary-color);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 1.5rem 0;
`;

const NewsItem = styled.div`
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-color);
  
  &:first-child {
    padding-top: 0;
  }
  
  &:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const NewsHeadline = styled.h4`
  margin: 0 0 0.5rem;
  font-weight: 600;
  font-size: 1rem;
`;

const NewsLink = styled.a`
  color: inherit;
  text-decoration: none;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const NewsDetails = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: var(--gray-color);
`;

const NewsDivider = styled.span`
  margin: 0 0.5rem;
`;

const NewsSummary = styled.p`
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const StockNews = ({ symbol }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const data = await stockService.getStockNews(symbol);
        setNews(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNews();
  }, [symbol]);
  
  return (
    <NewsCard>
      <NewsTitle>
        <FaNewspaper />
        News
      </NewsTitle>
      
      {loading ? (
        <LoadingContainer>
          <LoadingSpinner size="30px" color="#0d6efd" />
        </LoadingContainer>
      ) : (
        <>
          {news.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <p>No recent news available for {symbol}.</p>
            </div>
          ) : (
            news.map((item) => (
              <NewsItem key={item.id}>
                <NewsHeadline>
                  <NewsLink href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.title}
                  </NewsLink>
                </NewsHeadline>
                <NewsDetails>
                  <span>{item.source}</span>
                  <NewsDivider>•</NewsDivider>
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                </NewsDetails>
                <NewsSummary>{item.summary}</NewsSummary>
              </NewsItem>
            ))
          )}
        </>
      )}
    </NewsCard>
  );
};

export default StockNews;
