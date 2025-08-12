import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { FaStar, FaRegStar } from 'react-icons/fa';
import AuthContext from '../../contexts/AuthContext';
import watchlistService from '../../services/watchlistService';

const Button = styled.button`
  background-color: ${props => props.active ? 'var(--warning-color)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--warning-color)'};
  border: 1px solid var(--warning-color);
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.active ? '#cd9206' : 'rgba(245, 159, 0, 0.1)'};
  }
`;

const Modal = styled.div`
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

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  padding: 1.5rem;
`;

const ModalTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 1.5rem;
`;

const WatchlistList = styled.div`
  max-height: 250px;
  overflow-y: auto;
`;

const WatchlistItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    border-bottom: none;
  }
`;

const WatchlistName = styled.span`
  flex-grow: 1;
`;

const WatchlistCheckbox = styled.input`
  margin-right: 0.75rem;
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const ModalButton = styled.button`
  background-color: ${props => props.primary ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.primary ? 'white' : 'var(--gray-color)'};
  border: ${props => props.primary ? 'none' : '1px solid var(--border-color)'};
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.primary ? '#0b5ed7' : 'rgba(0, 0, 0, 0.05)'};
  }
`;

const WatchlistButton = ({ symbol, name }) => {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [watchlists, setWatchlists] = useState([]);
  const [selectedWatchlists, setSelectedWatchlists] = useState([]);
  const { isAuthenticated } = useContext(AuthContext);
  
  // Check if stock is in any watchlist when component mounts
  React.useEffect(() => {
    if (isAuthenticated) {
      const checkWatchlists = async () => {
        try {
          const userWatchlists = await watchlistService.getWatchlists();
          setWatchlists(userWatchlists);
          
          // Check if stock is in any watchlist
          const inWatchlist = userWatchlists.some(watchlist => 
            watchlist.stocks.some(stock => stock.symbol === symbol)
          );
          
          setIsInWatchlist(inWatchlist);
          
          // Pre-select watchlists that already contain this stock
          const preSelected = userWatchlists
            .filter(watchlist => watchlist.stocks.some(stock => stock.symbol === symbol))
            .map(watchlist => watchlist.id);
          
          setSelectedWatchlists(preSelected);
        } catch (error) {
          console.error('Error checking watchlists:', error);
        }
      };
      
      checkWatchlists();
    }
  }, [isAuthenticated, symbol]);
  
  const handleClick = () => {
    if (!isAuthenticated) {
      // Redirect to login or show login prompt
      alert('Please log in to add stocks to your watchlists');
      return;
    }
    
    setShowModal(true);
  };
  
  const handleWatchlistChange = (watchlistId, checked) => {
    if (checked) {
      setSelectedWatchlists([...selectedWatchlists, watchlistId]);
    } else {
      setSelectedWatchlists(selectedWatchlists.filter(id => id !== watchlistId));
    }
  };
  
  const handleSave = async () => {
    try {
      // First, get all watchlists that contain this stock
      const currentWatchlistsWithStock = watchlists
        .filter(watchlist => watchlist.stocks.some(stock => stock.symbol === symbol))
        .map(watchlist => watchlist.id);
      
      // Add stock to newly selected watchlists
      for (const watchlistId of selectedWatchlists) {
        if (!currentWatchlistsWithStock.includes(watchlistId)) {
          await watchlistService.addStockToWatchlist(watchlistId, {
            symbol,
            name
          });
        }
      }
      
      // Remove stock from unselected watchlists
      for (const watchlistId of currentWatchlistsWithStock) {
        if (!selectedWatchlists.includes(watchlistId)) {
          await watchlistService.removeStockFromWatchlist(watchlistId, symbol);
        }
      }
      
      // Update state
      setIsInWatchlist(selectedWatchlists.length > 0);
      setShowModal(false);
      
    } catch (error) {
      console.error('Error updating watchlists:', error);
      alert('Failed to update watchlists');
    }
  };
  
  return (
    <>
      <Button 
        active={isInWatchlist}
        onClick={handleClick}
      >
        {isInWatchlist ? <FaStar /> : <FaRegStar />}
        {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
      </Button>
      
      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalTitle>Add to Watchlist</ModalTitle>
            
            {watchlists.length === 0 ? (
              <p>You don't have any watchlists yet. Create a watchlist in the Watchlists page.</p>
            ) : (
              <WatchlistList>
                {watchlists.map(watchlist => (
                  <WatchlistItem key={watchlist.id}>
                    <WatchlistCheckbox 
                      type="checkbox"
                      checked={selectedWatchlists.includes(watchlist.id)}
                      onChange={e => handleWatchlistChange(watchlist.id, e.target.checked)}
                    />
                    <WatchlistName>{watchlist.name}</WatchlistName>
                  </WatchlistItem>
                ))}
              </WatchlistList>
            )}
            
            <ButtonGroup>
              <ModalButton onClick={() => setShowModal(false)}>
                Cancel
              </ModalButton>
              <ModalButton 
                primary 
                onClick={handleSave}
                disabled={watchlists.length === 0}
              >
                Save
              </ModalButton>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default WatchlistButton;
