const { execSync } = require('child_process');
const nodemailer = require('nodemailer');
const readline = require('readline');

// Function to create a user in Maddy
function createMaddyUser(email, password) {
  try {
    // Execute the maddy command to create the user
    const result = execSync(
      `docker exec -i maddy sh -c "cat > /tmp/password.txt && maddy creds create --password-file=/tmp/password.txt ${email} && rm /tmp/password.txt"`,
      { input: password }
    );
    
    console.log(`User ${email} created successfully!`);
    return true;
  } catch (error) {
    console.error(`Error creating user: ${error.message}`);
    return false;
  }
}

// Function to send an email through Maddy
async function sendEmail(options) {
  const { from, to, subject, text, html, auth } = options;
  
  // Create a transporter using Nodemailer
  const transporter = nodemailer.createTransport({
    host: 'localhost', // or your Maddy server address
    port: 587, // or 465 for SSL
    secure: false, // true for 465, false for other ports
    auth: {
      user: auth.user,
      pass: auth.pass
    },
    tls: {
      // Needed for self-signed certificates in development
      rejectUnauthorized: false
    }
  });
  
  // Send the email
  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html
    });
    
    console.log(`Email sent successfully! Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
    throw error;
  }
}

// Interactive CLI for creating a user and sending an email
function runInteractive() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  let userData = {};
  
  rl.question('What would you like to do? (create-user, send-email, both): ', (action) => {
    if (['create-user', 'both'].includes(action)) {
      rl.question('Enter email address: ', (email) => {
        rl.question('Enter password: ', (password) => {
          userData = { email, password };
          if (createMaddyUser(email, password)) {
            console.log('User created successfully!');
          }
          
          if (action === 'both') {
            promptForEmail(rl, userData);
          } else {
            rl.close();
          }
        });
      });
    } else if (action === 'send-email') {
      rl.question('Enter sender email: ', (senderEmail) => {
        rl.question('Enter sender password: ', (senderPassword) => {
          userData = { email: senderEmail, password: senderPassword };
          promptForEmail(rl, userData);
        });
      });
    } else {
      console.log('Invalid action. Please run the script again.');
      rl.close();
    }
  });
}

function promptForEmail(rl, userData) {
  rl.question('Enter recipient email: ', (recipient) => {
    rl.question('Enter email subject: ', (subject) => {
      rl.question('Enter email text: ', async (text) => {
        try {
          await sendEmail({
            from: userData.email,
            to: recipient,
            subject: subject,
            text: text,
            auth: {
              user: userData.email,
              pass: userData.password
            }
          });
          console.log('Email sent successfully!');
        } catch (error) {
          console.log('Failed to send email.');
        }
        rl.close();
      });
    });
  });
}

// Check if run directly
if (require.main === module) {
  runInteractive();
}

module.exports = {
  createMaddyUser,
  sendEmail
};
