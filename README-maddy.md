# Maddy Mail Server Utilities

This package provides utilities for managing a Maddy mail server running in Docker.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Make sure your Maddy mail server is running:
   ```
   docker-compose up -d
   ```

## Usage

### Running the Interactive CLI

Run the utility script:
```
node maddy-utils.js
```

This will start an interactive CLI with three options:
- `create-user`: Create a new user in the Maddy mail server
- `send-email`: Send an email through your Maddy server
- `both`: Create a user and then send an email

### Using the Functions in Your Own Code

You can also import the functions into your own Node.js scripts:

```javascript
const { createMaddyUser, sendEmail } = require('./maddy-utils');

// Create a user
createMaddyUser('user@maddy.test', 'secure-password');

// Send an email
sendEmail({
  from: 'user@maddy.test',
  to: 'recipient@example.com',
  subject: 'Test Email',
  text: 'This is a test email from Maddy',
  auth: {
    user: 'user@maddy.test',
    pass: 'secure-password'
  }
}).then(() => {
  console.log('Email sent!');
}).catch(err => {
  console.error('Failed to send email:', err);
});
```

## Configuration Notes

The script assumes:
1. You have Maddy running in a Docker container named 'maddy'
2. Your SMTP server is accessible at localhost on port 587
3. You're using self-signed certificates

You may need to adjust these settings in the `maddy-utils.js` file based on your actual setup.
