import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import AuthContext from '../contexts/AuthContext';
import AlertItem from '../components/alerts/AlertItem';
import CreateAlertModal from '../components/alerts/CreateAlertModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorDisplay from '../components/ui/ErrorDisplay';
import EmptyState from '../components/ui/EmptyState';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import alertService from '../services/alertService';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  h1 {
    margin: 0;
  }
`;

const CreateButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: #0b5ed7;
  }
`;

const AlertsContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const FilterTabs = styled.div`
  display: flex;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 1.5rem;
`;

const FilterTab = styled.button`
  background-color: ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'inherit'};
  border: none;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-weight: ${props => props.active ? '600' : '400'};
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-color)' : 'rgba(0, 0, 0, 0.05)'};
  }
`;

const LoginPrompt = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  
  h2 {
    margin-bottom: 1.5rem;
  }
  
  a {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const AlertsPage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all'); // all, active, triggered
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchAlerts();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, filter]);
  
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const data = await alertService.getAlerts(filter);
      setAlerts(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateAlert = async (alertData) => {
    try {
      const newAlert = await alertService.createAlert(alertData);
      setAlerts([newAlert, ...alerts]);
      setShowCreateModal(false);
    } catch (err) {
      setError(err.message || 'Failed to create alert');
    }
  };
  
  const handleDeleteAlert = async (alertId) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      try {
        await alertService.deleteAlert(alertId);
        setAlerts(alerts.filter(alert => alert.id !== alertId));
      } catch (err) {
        setError(err.message || 'Failed to delete alert');
      }
    }
  };
  
  const handleToggleAlert = async (alertId, isActive) => {
    try {
      await alertService.updateAlert(alertId, { isActive });
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, isActive } : alert
      ));
    } catch (err) {
      setError(err.message || 'Failed to update alert');
    }
  };
  
  if (loading) {
    return (
      <PageContainer>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <LoadingSpinner size="50px" />
        </div>
      </PageContainer>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <PageContainer>
        <LoginPrompt>
          <h2>You need to be logged in to view price alerts</h2>
          <Link to="/login">Login</Link> or <Link to="/register">Register</Link> to create and manage your price alerts.
        </LoginPrompt>
      </PageContainer>
    );
  }
  
  const filteredAlerts = filter === 'all' 
    ? alerts 
    : filter === 'active' 
      ? alerts.filter(alert => alert.isActive && !alert.triggered) 
      : alerts.filter(alert => alert.triggered);
  
  return (
    <PageContainer>
      <PageHeader>
        <h1>Price Alerts</h1>
        <CreateButton onClick={() => setShowCreateModal(true)}>
          <FaPlus /> Create Alert
        </CreateButton>
      </PageHeader>
      
      {error && <ErrorDisplay message={error} />}
      
      <FilterTabs>
        <FilterTab 
          active={filter === 'all'} 
          onClick={() => setFilter('all')}
        >
          All
        </FilterTab>
        <FilterTab 
          active={filter === 'active'} 
          onClick={() => setFilter('active')}
        >
          Active
        </FilterTab>
        <FilterTab 
          active={filter === 'triggered'} 
          onClick={() => setFilter('triggered')}
        >
          Triggered
        </FilterTab>
      </FilterTabs>
      
      <AlertsContainer>
        {filteredAlerts.length === 0 ? (
          <EmptyState
            icon={filter === 'triggered' ? '🔔' : '⏰'}
            title={`No ${filter === 'all' ? '' : filter} alerts found`}
            message={filter === 'all' 
              ? "You haven't set up any price alerts yet." 
              : filter === 'active' 
                ? "You don't have any active price alerts."
                : "No alerts have been triggered yet."}
            actionLabel={filter === 'all' ? 'Create Alert' : undefined}
            onAction={filter === 'all' ? () => setShowCreateModal(true) : undefined}
            small
          />
        ) : (
          filteredAlerts.map(alert => (
            <AlertItem
              key={alert.id}
              alert={alert}
              onDelete={() => handleDeleteAlert(alert.id)}
              onToggle={(isActive) => handleToggleAlert(alert.id, isActive)}
            />
          ))
        )}
      </AlertsContainer>
      
      {showCreateModal && (
        <CreateAlertModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateAlert}
        />
      )}
    </PageContainer>
  );
};

export default AlertsPage;
