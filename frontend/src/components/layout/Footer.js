import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaFacebook, FaTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background-color: #212529;
  color: #fff;
  padding: 2rem 0;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const FooterSection = styled.div`
  h4 {
    color: #fff;
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
  
  a {
    color: #adb5bd;
    text-decoration: none;
    transition: color 0.2s;
    
    &:hover {
      color: #fff;
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #343a40;
    color: #fff;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: var(--primary-color);
    }
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid #343a40;
  color: #adb5bd;
  font-size: 0.9rem;
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterGrid>
          <FooterSection>
            <h4>Vietnamese Stock Market</h4>
            <p>
              Professional, secure, and user-friendly stock market website focused on the Vietnamese market. 
              Get real-time stock prices, market information, and more.
            </p>
            <SocialLinks>
              <a href="#!" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="#!" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#!" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
              <a href="#!" aria-label="YouTube">
                <FaYoutube />
              </a>
            </SocialLinks>
          </FooterSection>
          
          <FooterSection>
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><a href="#market-indices">Market Indices</a></li>
              <li><a href="#global-market">Global Market</a></li>
              <li><a href="#market-insights">Market Insights</a></li>
            </ul>
          </FooterSection>
          
          <FooterSection>
            <h4>User Account</h4>
            <ul>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/watchlists">Watchlists</Link></li>
              <li><Link to="/alerts">Price Alerts</Link></li>
            </ul>
          </FooterSection>
          
          <FooterSection>
            <h4>Contact Us</h4>
            <ul>
              <li>Email: info@vnstockmarket.com</li>
              <li>Phone: +84 28 1234 5678</li>
              <li>Address: 123 Finance Street, District 1, Ho Chi Minh City, Vietnam</li>
            </ul>
          </FooterSection>
        </FooterGrid>
        
        <Copyright>
          &copy; {currentYear} Vietnamese Stock Market. All rights reserved.
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
