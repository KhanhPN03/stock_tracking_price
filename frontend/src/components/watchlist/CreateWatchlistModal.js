import React, { useState } from 'react';
import styled from 'styled-components';
import { FaPlus } from 'react-icons/fa';
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
    color: var(--primary-color);
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

const CreateWatchlistModal = ({ 
  onClose, 
  onCreate, 
  title = 'Create Watchlist',
  initialValue = '',
  buttonLabel = 'Create'
}) => {
  const [name, setName] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim()) {
      setError('Please enter a watchlist name');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await onCreate(name);
    } catch (err) {
      setError(err.message || 'Failed to create watchlist');
      setLoading(false);
    }
  };
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <FaPlus />
          <ModalTitle>{title}</ModalTitle>
        </ModalHeader>
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="watchlistName">Watchlist Name</Label>
            <Input
              type="text"
              id="watchlistName"
              name="watchlistName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. My Favorites"
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
              disabled={loading || !name.trim()}
            >
              {loading ? <LoadingSpinner size="20px" thickness="2px" /> : buttonLabel}
            </Button>
          </ButtonGroup>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default CreateWatchlistModal;
