import React from 'react';
import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  display: inline-block;
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  
  &:after {
    content: " ";
    display: block;
    width: ${props => props.size || '40px'};
    height: ${props => props.size || '40px'};
    border-radius: 50%;
    border: ${props => props.thickness || '4px'} solid ${props => props.color || 'var(--primary-color)'};
    border-color: ${props => props.color || 'var(--primary-color)'} transparent ${props => props.color || 'var(--primary-color)'} transparent;
    animation: ${rotate} 1.2s linear infinite;
  }
`;

const LoadingSpinner = ({ size, thickness, color }) => {
  return <Spinner size={size} thickness={thickness} color={color} />;
};

export default LoadingSpinner;
