import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const NotFoundPage = () => {
  return (
    <PageContainer>
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for does not exist.</p>
        <a href="/" className="btn btn-primary mt-4">
          Go to Homepage
        </a>
      </div>
    </PageContainer>
  );
};

export default NotFoundPage;
