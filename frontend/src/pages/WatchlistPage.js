import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import AuthContext from '../contexts/AuthContext';
import WatchlistItem from '../components/watchlist/WatchlistItem';
import CreateWatchlistModal from '../components/watchlist/CreateWatchlistModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorDisplay from '../components/ui/ErrorDisplay';
import EmptyState from '../components/ui/EmptyState';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import watchlistService from '../services/watchlistService';

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

const WatchlistTabs = styled.div`
  display: flex;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 1.5rem;
`;

const WatchlistTab = styled.button`
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

const WatchlistActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ActionButton = styled.button`
  background-color: transparent;
  border: none;
  color: var(--gray-color);
  padding: 0.25rem;
  cursor: pointer;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const WatchlistCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  overflow: hidden;
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

const WatchlistPage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [watchlists, setWatchlists] = useState([]);
  const [activeWatchlistId, setActiveWatchlistId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchWatchlists();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);
  
  const fetchWatchlists = async () => {
    try {
      setLoading(true);
      const data = await watchlistService.getWatchlists();
      setWatchlists(data);
      
      // Set active watchlist to the first one if available
      if (data.length > 0 && !activeWatchlistId) {
        setActiveWatchlistId(data[0].id);
      }
      
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch watchlists');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateWatchlist = async (name) => {
    try {
      const newWatchlist = await watchlistService.createWatchlist(name);
      setWatchlists([...watchlists, newWatchlist]);
      setActiveWatchlistId(newWatchlist.id);
      setShowCreateModal(false);
    } catch (err) {
      setError(err.message || 'Failed to create watchlist');
    }
  };
  
  const handleRenameWatchlist = async (id, name) => {
    try {
      await watchlistService.updateWatchlist(id, name);
      const updatedWatchlists = watchlists.map(wl => 
        wl.id === id ? { ...wl, name } : wl
      );
      setWatchlists(updatedWatchlists);
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to rename watchlist');
    }
  };
  
  const handleDeleteWatchlist = async (id) => {
    if (window.confirm('Are you sure you want to delete this watchlist?')) {
      try {
        await watchlistService.deleteWatchlist(id);
        const remainingWatchlists = watchlists.filter(wl => wl.id !== id);
        setWatchlists(remainingWatchlists);
        
        if (activeWatchlistId === id) {
          // Set active to first available or null
          setActiveWatchlistId(remainingWatchlists[0]?.id || null);
        }
      } catch (err) {
        setError(err.message || 'Failed to delete watchlist');
      }
    }
  };
  
  const handleRemoveStock = async (stockSymbol) => {
    try {
      await watchlistService.removeStockFromWatchlist(activeWatchlistId, stockSymbol);
      
      // Update the current watchlist to reflect the removal
      const updatedWatchlists = watchlists.map(wl => {
        if (wl.id === activeWatchlistId) {
          return {
            ...wl,
            stocks: wl.stocks.filter(stock => stock.symbol !== stockSymbol)
          };
        }
        return wl;
      });
      
      setWatchlists(updatedWatchlists);
    } catch (err) {
      setError(err.message || 'Failed to remove stock from watchlist');
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
          <h2>You need to be logged in to view watchlists</h2>
          <Link to="/login">Login</Link> or <Link to="/register">Register</Link> to create and manage your watchlists.
        </LoginPrompt>
      </PageContainer>
    );
  }
  
  const activeWatchlist = watchlists.find(wl => wl.id === activeWatchlistId);
  
  return (
    <PageContainer>
      <PageHeader>
        <h1>My Watchlists</h1>
        <CreateButton onClick={() => setShowCreateModal(true)}>
          <FaPlus /> Create Watchlist
        </CreateButton>
      </PageHeader>
      
      {error && <ErrorDisplay message={error} />}
      
      {watchlists.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No Watchlists Yet"
          message="Create your first watchlist to start tracking stocks you're interested in."
          actionLabel="Create Watchlist"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <>
          <WatchlistTabs>
            {watchlists.map(watchlist => (
              <WatchlistTab
                key={watchlist.id}
                active={activeWatchlistId === watchlist.id}
                onClick={() => setActiveWatchlistId(watchlist.id)}
              >
                {watchlist.name}
              </WatchlistTab>
            ))}
          </WatchlistTabs>
          
          {activeWatchlist && (
            <>
              <WatchlistActions>
                <ActionButton onClick={() => setIsEditing(true)} title="Rename">
                  <FaEdit size={18} />
                </ActionButton>
                <ActionButton onClick={() => handleDeleteWatchlist(activeWatchlist.id)} title="Delete">
                  <FaTrash size={18} />
                </ActionButton>
              </WatchlistActions>
              
              <WatchlistCard>
                {activeWatchlist.stocks && activeWatchlist.stocks.length > 0 ? (
                  activeWatchlist.stocks.map(stock => (
                    <WatchlistItem
                      key={stock.symbol}
                      stock={stock}
                      onRemove={() => handleRemoveStock(stock.symbol)}
                    />
                  ))
                ) : (
                  <EmptyState
                    icon="📈"
                    title="No Stocks Added"
                    message="Search for stocks and add them to this watchlist."
                    small
                  />
                )}
              </WatchlistCard>
            </>
          )}
        </>
      )}
      
      {showCreateModal && (
        <CreateWatchlistModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateWatchlist}
        />
      )}
      
      {isEditing && activeWatchlist && (
        <CreateWatchlistModal
          title="Rename Watchlist"
          initialValue={activeWatchlist.name}
          buttonLabel="Rename"
          onClose={() => setIsEditing(false)}
          onCreate={(name) => handleRenameWatchlist(activeWatchlist.id, name)}
        />
      )}
    </PageContainer>
  );
};

export default WatchlistPage;
