import React, { useState } from 'react';
import styled from 'styled-components';
import { FaBell } from 'react-icons/fa';
import LoadingSpinner from '../ui/LoadingSpinner';
import stockService from '../../services/stockService';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  padding: 1.5rem;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  
  svg {
    color: var(--warning-color);
    margin-right: 0.75rem;
    font-size: 1.5rem;
  }
`;

const ModalTitle = styled.h3`
  margin: 0;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  display: block;
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.25);
  }
`;

const Select = styled.select`
  display: block;
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: white;
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.25);
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 0.5rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const RadioInput = styled.input`
  margin-right: 0.5rem;
`;

const StockInfo = styled.div`
  background-color: rgba(13, 110, 253, 0.1);
  border-radius: 4px;
  padding: 0.75rem;
  margin-top: 0.75rem;
  margin-bottom: 1rem;
  display: ${props => props.show ? 'block' : 'none'};
  
  p {
    margin: 0;
  }
  
  strong {
    font-weight: 600;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const Button = styled.button`
  padding: 0.75rem 1rem;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${props => props.primary ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.primary ? 'white' : 'var(--gray-color)'};
  border: ${props => props.primary ? 'none' : '1px solid var(--border-color)'};
  
  &:hover {
    background-color: ${props => props.primary ? '#0b5ed7' : 'rgba(0, 0, 0, 0.05)'};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const ErrorMessage = styled.div`
  color: var(--danger-color);
  margin-top: 0.5rem;
  font-size: 0.9rem;
`;

const CreateAlertModal = ({ onClose, onCreate }) => {
  const [loading, setLoading] = useState(false);
  const [stockLoading, setStockLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    symbol: '',
    targetPrice: '',
    condition: 'above'
  });
  const [stockInfo, setStockInfo] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // If changing the symbol, fetch stock data
    if (name === 'symbol' && value.trim().length >= 2) {
      fetchStockData(value);
    }
  };
  
  const fetchStockData = async (symbol) => {
    if (!symbol.trim()) return;
    
    try {
      setStockLoading(true);
      const data = await stockService.getStockDetails(symbol);
      setStockInfo(data);
      setError(null);
    } catch (err) {
      setStockInfo(null);
      setError(`Stock symbol ${symbol} not found`);
    } finally {
      setStockLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.symbol.trim()) {
      setError('Please enter a stock symbol');
      return;
    }
    
    if (!formData.targetPrice) {
      setError('Please enter a target price');
      return;
    }
    
    if (!stockInfo) {
      setError('Please enter a valid stock symbol');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await onCreate({
        symbol: formData.symbol,
        name: stockInfo.name,
        targetPrice: parseFloat(formData.targetPrice),
        condition: formData.condition,
        currentPrice: stockInfo.price
      });
      
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create price alert');
      setLoading(false);
    }
  };
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <FaBell />
          <ModalTitle>Create Price Alert</ModalTitle>
        </ModalHeader>
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="symbol">Stock Symbol</Label>
            <Input
              type="text"
              id="symbol"
              name="symbol"
              value={formData.symbol}
              onChange={handleChange}
              placeholder="e.g. VCB"
              required
            />
            
            {stockLoading && (
              <div style={{ marginTop: '0.5rem' }}>
                <LoadingSpinner size="20px" color="#0d6efd" />
              </div>
            )}
            
            <StockInfo show={stockInfo !== null}>
              {stockInfo && (
                <p>
                  Current price of <strong>{stockInfo.name} ({stockInfo.symbol})</strong>: 
                  <strong> {new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(stockInfo.price)}</strong>
                </p>
              )}
            </StockInfo>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="condition">Alert Condition</Label>
            <Select
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              required
            >
              <option value="above">Price goes above</option>
              <option value="below">Price goes below</option>
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="targetPrice">Target Price (VND)</Label>
            <Input
              type="number"
              id="targetPrice"
              name="targetPrice"
              value={formData.targetPrice}
              onChange={handleChange}
              min="0"
              step="100"
              required
            />
            
            {error && (
              <ErrorMessage>{error}</ErrorMessage>
            )}
          </FormGroup>
          
          <ButtonGroup>
            <Button type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              primary 
              type="submit" 
              disabled={loading || !formData.targetPrice || !formData.symbol || stockLoading}
            >
              {loading ? <LoadingSpinner size="20px" thickness="2px" /> : 'Create Alert'}
            </Button>
          </ButtonGroup>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default CreateAlertModal;
