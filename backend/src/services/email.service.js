const sgMail = require('@sendgrid/mail');
const emailConfig = require('../config/email');
const { User } = require('../models');

// Initialize SendGrid if using it
if (emailConfig.emailProvider === 'sendgrid' && emailConfig.sendgrid.apiKey) {
  try {
    sgMail.setApiKey(emailConfig.sendgrid.apiKey);
    console.log('SendGrid initialized successfully');
  } catch (error) {
    console.warn('SendGrid initialization failed:', error.message);
    console.warn('Email notifications will be disabled');
  }
}

// Service for sending emails
const emailService = {
  /**
   * Send price alert notification
   * @param {Object} alert - Alert object
   * @param {string} alert.symbol - Stock symbol
   * @param {number} alert.targetPrice - Target price
   * @param {string} alert.condition - 'above' or 'below'
   * @param {number} alert.currentPrice - Current price when alert triggered
   * @param {number} alert.userId - User ID
   */
  async sendPriceAlertNotification(alert) {
    try {
      // Get user email
      const user = await User.findByPk(alert.userId);
      
      if (!user || !user.email) {
        throw new Error('User email not found');
      }
      
      const subject = `Price Alert: ${alert.symbol} is now ${alert.condition === 'above' ? 'above' : 'below'} ${alert.targetPrice}`;
      
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
          <h2 style="color: #333; text-align: center;">Price Alert Triggered</h2>
          <p style="font-size: 16px; line-height: 1.5;">Hello ${user.name},</p>
          <p style="font-size: 16px; line-height: 1.5;">Your price alert for <strong>${alert.symbol}</strong> has been triggered.</p>
          
          <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Stock:</strong> ${alert.symbol}</p>
            <p style="margin: 5px 0;"><strong>Alert condition:</strong> ${alert.condition === 'above' ? 'Above' : 'Below'} ${alert.targetPrice}</p>
            <p style="margin: 5px 0;"><strong>Current price:</strong> ${alert.currentPrice}</p>
            <p style="margin: 5px 0;"><strong>Triggered at:</strong> ${new Date(alert.triggeredAt).toLocaleString()}</p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.5;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/stocks/${alert.symbol}" 
               style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
              View Stock Details
            </a>
          </p>
          
          <p style="font-size: 14px; line-height: 1.5; color: #777; margin-top: 30px;">
            This is an automated message from VN Stock Market. Please do not reply to this email.
          </p>
        </div>
      `;
      
      // Send email based on provider
      if (emailConfig.emailProvider === 'sendgrid' && emailConfig.sendgrid.apiKey && emailConfig.sendgrid.apiKey.startsWith('SG.')) {
        const msg = {
          to: user.email,
          from: {
            email: emailConfig.sendgrid.fromEmail,
            name: emailConfig.sendgrid.fromName
          },
          subject,
          html: htmlContent,
          text: `Price Alert: ${alert.symbol} is now ${alert.condition === 'above' ? 'above' : 'below'} ${alert.targetPrice}. Current price: ${alert.currentPrice}`,
        };
        
        await sgMail.send(msg);
        
        return true;
      } else {
        // Log message instead of throwing error for development
        console.log('Email would be sent to:', user.email);
        console.log('Subject:', subject);
        console.log('Content:', `Price Alert: ${alert.symbol} is now ${alert.condition === 'above' ? 'above' : 'below'} ${alert.targetPrice}. Current price: ${alert.currentPrice}`);
        return true;
      }
    } catch (error) {
      console.error('Error sending price alert notification:', error);
      return false;
    }
  }
};

module.exports = emailService;
