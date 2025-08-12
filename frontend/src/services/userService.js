import axios from 'axios';
import { API_URL } from '../config/constants';

const userService = {
  /**
   * Update user profile
   */
  async updateProfile(profileData) {
    try {
      const response = await axios.put(`${API_URL}/users/profile`, profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  /**
   * Update user password
   */
  async updatePassword(currentPassword, newPassword) {
    try {
      const response = await axios.put(`${API_URL}/users/password`, {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  },

  /**
   * Update notification settings
   */
  async updateNotificationSettings(settings) {
    try {
      const response = await axios.put(`${API_URL}/users/notifications`, settings);
      return response.data;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  },

  /**
   * Get user activity history
   */
  async getUserActivity() {
    try {
      const response = await axios.get(`${API_URL}/users/activity`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user activity:', error);
      throw error;
    }
  }
};

export default userService;
