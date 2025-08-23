/**
 * Notification System Service Entry Point
 * This service provides a centralized notification system for the Caring Compass application
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import notification services
const { ServicesFactory } = require('../../services/src/index');

const app = express();
const PORT = process.env.NOTIFICATION_SERVICE_PORT || 3003;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'notification-system',
    timestamp: new Date().toISOString()
  });
});

// API endpoints for notification management
app.post('/api/notifications/send', async (req, res) => {
  try {
    const { type, recipient, message, metadata } = req.body;
    
    if (!type || !recipient || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields: type, recipient, message' 
      });
    }

    const result = await ServicesFactory.sendNotification({
      type,
      recipient,
      message,
      metadata
    });

    res.json({ 
      success: true, 
      notificationId: result.id,
      message: 'Notification sent successfully'
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get notification status
app.get('/api/notifications/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    
    // This would typically query a database or cache
    // For now, return a mock response
    res.json({
      id,
      status: 'sent',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Schedule notification
app.post('/api/notifications/schedule', async (req, res) => {
  try {
    const { type, recipient, message, scheduleAt, metadata } = req.body;
    
    if (!type || !recipient || !message || !scheduleAt) {
      return res.status(400).json({ 
        error: 'Missing required fields: type, recipient, message, scheduleAt' 
      });
    }

    const scheduler = ServicesFactory.getNotificationScheduler();
    const job = await scheduler.schedule({
      type,
      recipient,
      message,
      scheduleAt,
      metadata
    });

    res.json({ 
      success: true, 
      jobId: job.id,
      message: 'Notification scheduled successfully'
    });
  } catch (error) {
    console.error('Error scheduling notification:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Something went wrong!' 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Notification System Service running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
