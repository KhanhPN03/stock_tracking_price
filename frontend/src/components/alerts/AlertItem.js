import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaArrowUp, FaArrowDown, FaBell, FaTrash, FaBellSlash, FaCheck } from 'react-icons/fa';

const AlertContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 2fr 1fr 1fr auto;
  }
  
  @media (min-width: 992px) {
    grid-template-columns: 1fr 2fr 1fr 1fr 1fr auto;
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

const AlertInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ConditionIcon = styled.span`
  color: ${props => props.condition === 'above' ? 'var(--success-color)' : 'var(--danger-color)'};
  display: flex;
  align-items: center;
`;

const Price = styled.div`
  font-weight: 500;
  display: none;
  
  @media (min-width: 768px) {
    display: block;
  }
`;

const Status = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .triggered {
    color: var(--success-color);
  }
  
  .inactive {
    color: var(--gray-color);
  }
  
  .active {
    color: var(--warning-color);
  }
  
  display: none;
  
  @media (min-width: 992px) {
    display: flex;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background-color: transparent;
  border: none;
  color: var(--gray-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  
  &:hover {
    background-color: ${props => props.danger ? 'rgba(220, 53, 69, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
    color: ${props => props.danger ? 'var(--danger-color)' : 'var(--primary-color)'};
  }
`;

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const AlertItem = ({ alert, onDelete, onToggle }) => {
  const {
    id,
    stockSymbol,
    stockName,
    currentPrice,
    targetPrice,
    condition,
    isActive,
    triggered,
    createdAt,
    triggeredAt
  } = alert;
  
  return (
    <AlertContainer>
      <Symbol to={`/stocks/${stockSymbol}`}>
        {stockSymbol}
        <div style={{ fontSize: '0.85rem', color: 'var(--gray-color)' }}>
          {stockName}
        </div>
      </Symbol>
      
      <AlertInfo>
        <ConditionIcon condition={condition}>
          {condition === 'above' ? <FaArrowUp /> : <FaArrowDown />}
        </ConditionIcon>
        <div>
          {condition === 'above' ? 'Above' : 'Below'} {new Intl.NumberFormat('vi-VN', {
            maximumFractionDigits: 0
          }).format(targetPrice)}
        </div>
      </AlertInfo>
      
      <Price>
        Current: {new Intl.NumberFormat('vi-VN', {
          maximumFractionDigits: 0
        }).format(currentPrice)}
      </Price>
      
      <Status>
        {triggered ? (
          <span className="triggered"><FaCheck /> Triggered</span>
        ) : isActive ? (
          <span className="active"><FaBell /> Active</span>
        ) : (
          <span className="inactive"><FaBellSlash /> Inactive</span>
        )}
      </Status>
      
      <div style={{ fontSize: '0.85rem', color: 'var(--gray-color)', display: 'none', '@media (min-width: 992px)': { display: 'block' } }}>
        {triggered ? `Triggered: ${formatDate(triggeredAt)}` : `Created: ${formatDate(createdAt)}`}
      </div>
      
      <ActionButtons>
        {!triggered && (
          <ActionButton 
            title={isActive ? 'Deactivate alert' : 'Activate alert'}
            onClick={() => onToggle(!isActive)}
          >
            {isActive ? <FaBellSlash /> : <FaBell />}
          </ActionButton>
        )}
        <ActionButton 
          danger
          title="Delete alert"
          onClick={() => onDelete(id)}
        >
          <FaTrash />
        </ActionButton>
      </ActionButtons>
    </AlertContainer>
  );
};

export default AlertItem;
