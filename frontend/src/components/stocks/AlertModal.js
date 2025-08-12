import React, { useState } from 'react';
import styled from 'styled-components';
import { FaBell } from 'react-icons/fa';
import alertService from '../../services/alertService';
import LoadingSpinner from '../ui/LoadingSpinner';

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

const PriceInfo = styled.div`
  background-color: rgba(13, 110, 253, 0.1);
  border-radius: 4px;
  padding: 0.75rem;
  margin-bottom: 1.5rem;
  
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

const AlertModal = ({ symbol, currentPrice, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    targetPrice: '',
    condition: 'above'
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.targetPrice) {
      setError('Please enter a target price');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await alertService.createAlert({
        symbol,
        targetPrice: parseFloat(formData.targetPrice),
        condition: formData.condition,
        currentPrice
      });
      
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create price alert');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <FaBell />
          <ModalTitle>Set Price Alert</ModalTitle>
        </ModalHeader>
        
        <PriceInfo>
          <p>
            Current price of <strong>{symbol}</strong>: 
            <strong> {new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(currentPrice)}</strong>
          </p>
        </PriceInfo>
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="targetPrice">Alert me when price is:</Label>
            <RadioGroup>
              <RadioLabel>
                <RadioInput
                  type="radio"
                  name="condition"
                  value="above"
                  checked={formData.condition === 'above'}
                  onChange={handleChange}
                />
                Above
              </RadioLabel>
              
              <RadioLabel>
                <RadioInput
                  type="radio"
                  name="condition"
                  value="below"
                  checked={formData.condition === 'below'}
                  onChange={handleChange}
                />
                Below
              </RadioLabel>
            </RadioGroup>
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
              disabled={loading || !formData.targetPrice}
            >
              {loading ? <LoadingSpinner size="20px" thickness="2px" /> : 'Create Alert'}
            </Button>
          </ButtonGroup>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AlertModal;
