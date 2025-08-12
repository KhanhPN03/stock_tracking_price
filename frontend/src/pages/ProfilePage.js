import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import AuthContext from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorDisplay from '../components/ui/ErrorDisplay';
import { FaUser, FaKey, FaBell, FaSignOutAlt, FaSave } from 'react-icons/fa';
import userService from '../services/userService';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const ProfileCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const ProfileAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: 600;
  margin-right: 1.5rem;
`;

const ProfileName = styled.div`
  h2 {
    margin: 0 0 0.5rem;
    font-weight: 600;
  }
  
  p {
    margin: 0;
    color: var(--gray-color);
  }
`;

const TabContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const TabButtons = styled.div`
  display: flex;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 1.5rem;
`;

const TabButton = styled.button`
  background-color: transparent;
  border: none;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--gray-color)'};
  border-bottom: ${props => props.active ? '2px solid var(--primary-color)' : 'none'};
  font-weight: ${props => props.active ? '600' : '400'};
  
  &:hover {
    color: var(--primary-color);
  }
  
  svg {
    font-size: 1.2rem;
  }
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

const Button = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: #0b5ed7;
  }
  
  &:disabled {
    background-color: var(--gray-color);
    cursor: not-allowed;
  }
`;

const NotificationSetting = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    border-bottom: none;
  }
`;

const NotificationText = styled.div`
  p {
    margin: 0;
  }
  
  .setting-desc {
    font-size: 0.9rem;
    color: var(--gray-color);
  }
`;

const Toggle = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 34px;
  }
  
  span:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
  
  input:checked + span {
    background-color: var(--primary-color);
  }
  
  input:focus + span {
    box-shadow: 0 0 1px var(--primary-color);
  }
  
  input:checked + span:before {
    transform: translateX(26px);
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

const Divider = styled.hr`
  margin: 2rem 0;
  border: none;
  border-top: 1px solid var(--border-color);
`;

const LogoutButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: #c82333;
  }
`;

const ProfilePage = () => {
  const { user, isAuthenticated, logout, updateUserContext } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    priceChanges: true,
    marketNews: false,
    weeklyDigest: true
  });
  
  useEffect(() => {
    if (isAuthenticated && user) {
      setProfileData({
        name: user.name || '',
        email: user.email || ''
      });
      
      // In a real application, you would fetch notification settings here
      // For demo purposes, we're using the initial state defined above
    }
  }, [isAuthenticated, user]);
  
  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };
  
  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleNotificationChange = (e) => {
    setNotificationSettings({
      ...notificationSettings,
      [e.target.name]: e.target.checked
    });
  };
  
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const updatedUser = await userService.updateProfile(profileData);
      updateUserContext(updatedUser);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await userService.updatePassword(
        passwordData.currentPassword, 
        passwordData.newPassword
      );
      setSuccess('Password updated successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateNotifications = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await userService.updateNotificationSettings(notificationSettings);
      setSuccess('Notification settings updated successfully');
    } catch (err) {
      setError(err.message || 'Failed to update notification settings');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  if (!isAuthenticated) {
    return (
      <PageContainer>
        <LoginPrompt>
          <h2>You need to be logged in to view your profile</h2>
          <Link to="/login">Login</Link> or <Link to="/register">Register</Link> to access your profile settings.
        </LoginPrompt>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <ProfileCard>
        <ProfileHeader>
          <ProfileAvatar>
            {user?.name?.charAt(0) || 'U'}
          </ProfileAvatar>
          <ProfileName>
            <h2>{user?.name || 'User'}</h2>
            <p>{user?.email || 'No email'}</p>
          </ProfileName>
        </ProfileHeader>
        
        <TabContainer>
          <TabButtons>
            <TabButton
              active={activeTab === 'profile'}
              onClick={() => setActiveTab('profile')}
            >
              <FaUser /> Profile
            </TabButton>
            <TabButton
              active={activeTab === 'security'}
              onClick={() => setActiveTab('security')}
            >
              <FaKey /> Security
            </TabButton>
            <TabButton
              active={activeTab === 'notifications'}
              onClick={() => setActiveTab('notifications')}
            >
              <FaBell /> Notifications
            </TabButton>
          </TabButtons>
          
          {error && <ErrorDisplay message={error} />}
          {success && (
            <div style={{ 
              backgroundColor: 'rgba(40, 167, 69, 0.1)', 
              color: '#28a745', 
              padding: '0.75rem', 
              borderRadius: '4px', 
              marginBottom: '1rem' 
            }}>
              {success}
            </div>
          )}
          
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile}>
              <FormGroup>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  required
                />
              </FormGroup>
              
              <Button type="submit" disabled={loading}>
                <FaSave /> {loading ? <LoadingSpinner size="20px" thickness="2px" /> : 'Save Changes'}
              </Button>
            </form>
          )}
          
          {activeTab === 'security' && (
            <form onSubmit={handleUpdatePassword}>
              <FormGroup>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                />
              </FormGroup>
              
              <Button type="submit" disabled={loading}>
                <FaKey /> {loading ? <LoadingSpinner size="20px" thickness="2px" /> : 'Update Password'}
              </Button>
            </form>
          )}
          
          {activeTab === 'notifications' && (
            <>
              <NotificationSetting>
                <NotificationText>
                  <p>Email Alerts</p>
                  <p className="setting-desc">Receive notifications via email</p>
                </NotificationText>
                <Toggle>
                  <input 
                    type="checkbox"
                    name="emailAlerts"
                    checked={notificationSettings.emailAlerts}
                    onChange={handleNotificationChange}
                  />
                  <span></span>
                </Toggle>
              </NotificationSetting>
              
              <NotificationSetting>
                <NotificationText>
                  <p>Price Alerts</p>
                  <p className="setting-desc">Get notified when prices hit your targets</p>
                </NotificationText>
                <Toggle>
                  <input 
                    type="checkbox"
                    name="priceChanges"
                    checked={notificationSettings.priceChanges}
                    onChange={handleNotificationChange}
                  />
                  <span></span>
                </Toggle>
              </NotificationSetting>
              
              <NotificationSetting>
                <NotificationText>
                  <p>Market News</p>
                  <p className="setting-desc">Receive updates on market news</p>
                </NotificationText>
                <Toggle>
                  <input 
                    type="checkbox"
                    name="marketNews"
                    checked={notificationSettings.marketNews}
                    onChange={handleNotificationChange}
                  />
                  <span></span>
                </Toggle>
              </NotificationSetting>
              
              <NotificationSetting>
                <NotificationText>
                  <p>Weekly Digest</p>
                  <p className="setting-desc">Get a weekly summary of your watchlists</p>
                </NotificationText>
                <Toggle>
                  <input 
                    type="checkbox"
                    name="weeklyDigest"
                    checked={notificationSettings.weeklyDigest}
                    onChange={handleNotificationChange}
                  />
                  <span></span>
                </Toggle>
              </NotificationSetting>
              
              <Button 
                onClick={handleUpdateNotifications} 
                disabled={loading}
                style={{ marginTop: '1.5rem' }}
              >
                <FaSave /> {loading ? <LoadingSpinner size="20px" thickness="2px" /> : 'Save Preferences'}
              </Button>
            </>
          )}
        </TabContainer>
        
        <Divider />
        
        <LogoutButton onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </LogoutButton>
      </ProfileCard>
    </PageContainer>
  );
};

export default ProfilePage;
