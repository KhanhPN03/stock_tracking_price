import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.small ? '2rem 1rem' : '3rem 1rem'};
  text-align: center;
`;

const IconContainer = styled.div`
  font-size: ${props => props.small ? '2.5rem' : '4rem'};
  margin-bottom: ${props => props.small ? '1rem' : '1.5rem'};
`;

const Title = styled.h3`
  margin: 0 0 1rem;
  font-weight: 600;
  font-size: ${props => props.small ? '1.25rem' : '1.5rem'};
`;

const Message = styled.p`
  margin: 0 0 ${props => props.hasAction ? '1.5rem' : '0'};
  color: var(--gray-color);
  max-width: 600px;
  font-size: ${props => props.small ? '0.9rem' : '1rem'};
`;

const ActionButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: #0b5ed7;
  }
`;

const EmptyState = ({ 
  icon, 
  title, 
  message, 
  actionLabel, 
  onAction, 
  small = false 
}) => {
  return (
    <Container small={small}>
      <IconContainer small={small}>
        {icon}
      </IconContainer>
      <Title small={small}>{title}</Title>
      <Message small={small} hasAction={!!actionLabel}>{message}</Message>
      
      {actionLabel && onAction && (
        <ActionButton onClick={onAction}>
          {actionLabel}
        </ActionButton>
      )}
    </Container>
  );
};

export default EmptyState;
