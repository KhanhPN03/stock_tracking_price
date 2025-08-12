module.exports = {
  emailProvider: process.env.EMAIL_PROVIDER || 'sendgrid',
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY || 'your-sendgrid-api-key',
    fromEmail: process.env.FROM_EMAIL || 'alerts@vnstockmarket.com',
    fromName: process.env.FROM_NAME || 'VN Stock Market'
  }
};
