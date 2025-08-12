import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const ItemContainer = styled.div`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 1rem;
  align-items: center;
  
  @media (min-width: 768px) {
    grid-template-columns: 1.5fr 2.5fr 1fr 1fr 1fr;
  }
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const Symbol = styled(Link)`
  font-weight: 600;
  color: var(--primary-color);
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Name = styled.div`
  color: var(--gray-color);
  display: none;
  
  @media (min-width: 768px) {
    display: block;
  }
`;

const Price = styled.div`
  font-weight: 600;
  text-align: right;
`;

const Change = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-weight: 500;
  color: ${props => props.isPositive ? 'var(--success-color)' : 'var(--danger-color)'};
  
  svg {
    margin-right: 0.25rem;
  }
`;

const Volume = styled.div`
  text-align: right;
  color: var(--gray-color);
  
  @media (max-width: 767px) {
    display: none;
  }
`;

const StockItem = ({ symbol, name, price, change, volume }) => {
  const isPositive = change >= 0;
  
  return (
    <ItemContainer>
      <Symbol to={`/stocks/${symbol}`}>
        {symbol}
      </Symbol>
      
      <Name>{name}</Name>
      
      <Price>
        {new Intl.NumberFormat('vi-VN', {
          style: 'decimal',
          maximumFractionDigits: 0
        }).format(price)}
      </Price>
      
      <Change isPositive={isPositive}>
        {isPositive ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
        {Math.abs(change).toFixed(2)}%
      </Change>
      
      <Volume>
        {new Intl.NumberFormat('vi-VN', {
          notation: 'compact',
          compactDisplay: 'short'
        }).format(volume)}
      </Volume>
    </ItemContainer>
  );
};

export default StockItem;
