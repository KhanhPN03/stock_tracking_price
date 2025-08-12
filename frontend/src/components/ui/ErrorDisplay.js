import React from 'react';
import styled from 'styled-components';
import { FaExclamationTriangle } from 'react-icons/fa';

const ErrorContainer = styled.div`
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ErrorMessage = styled.p`
  margin: 0;
  font-size: 0.95rem;
`;

const ErrorDisplay = ({ message }) => {
  return (
    <ErrorContainer>
      <FaExclamationTriangle size={20} />
      <ErrorMessage>{message}</ErrorMessage>
    </ErrorContainer>
  );
};

export default ErrorDisplay;
