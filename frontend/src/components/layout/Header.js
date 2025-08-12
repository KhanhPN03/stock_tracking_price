import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import AuthContext from '../../contexts/AuthContext';
import SearchBar from '../stock/SearchBar';
import { FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaChartLine, FaList, FaBell } from 'react-icons/fa';

const HeaderContainer = styled.header`
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 0;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  text-decoration: none;
`;

const LogoIcon = styled(FaChartLine)`
  margin-right: 0.5rem;
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
`;

const NavLink = styled(Link)`
  margin-left: 1.5rem;
  color: var(--dark-color);
  text-decoration: none;
  display: flex;
  align-items: center;
  font-weight: 500;
  
  &:hover {
    color: var(--primary-color);
  }
  
  svg {
    margin-right: 0.5rem;
  }
  
  @media (max-width: 768px) {
    span {
      display: none;
    }
    
    svg {
      margin-right: 0;
    }
  }
`;

const SearchContainer = styled.div`
  flex-grow: 1;
  max-width: 500px;
  margin: 0 1.5rem;
  
  @media (max-width: 992px) {
    margin: 0 1rem;
  }
  
  @media (max-width: 768px) {
    max-width: 200px;
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: inline-block;
`;

const UserMenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: var(--dark-color);
  font-weight: 500;
  
  &:hover {
    color: var(--primary-color);
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const Header = () => {
  const { currentUser, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <HeaderContainer>
      <NavContainer>
        <Logo to="/">
          <LogoIcon />
          VN Stock Market
        </Logo>

        <SearchContainer>
          <SearchBar />
        </SearchContainer>

        <NavLinks>
          {isAuthenticated ? (
            <>
              <NavLink to="/watchlists">
                <FaList />
                <span>Watchlists</span>
              </NavLink>
              <NavLink to="/alerts">
                <FaBell />
                <span>Alerts</span>
              </NavLink>
              <NavLink to="/profile">
                <FaUser />
                <span>{currentUser?.name || 'Profile'}</span>
              </NavLink>
              <NavLink as="button" onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <FaSignOutAlt />
                <span>Logout</span>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login">
                <FaSignInAlt />
                <span>Login</span>
              </NavLink>
              <NavLink to="/register">
                <FaUserPlus />
                <span>Register</span>
              </NavLink>
            </>
          )}
        </NavLinks>
      </NavContainer>
    </HeaderContainer>
  );
};

export default Header;
