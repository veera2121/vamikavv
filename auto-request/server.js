// server.js
import express from 'express';
import cors from 'cors';
import twilio from 'twilio';

const app = express();
app.use(cors());
app.use(express.json());

// Twilio Account (replace with your credentials)
const accountSid = 'YOUR_TWILIO_SID';
const authToken = 'YOUR_TWILIO_AUTH_TOKEN';
const client = twilio(accountSid, authToken);

// Auto owners numbers
const autoOwners = [
  'whatsapp:+91XXXXXXXXXX', // replace with auto owner numbers
  'whatsapp:+91YYYYYYYYYY'
];

app.post('/sendAutoRequest', async (req, res) => {
  const { name, phone, pickup, drop } = req.body;

  try {
    for (let owner of autoOwners) {
      await client.messages.create({
        from: 'whatsapp:+14155238886', // Twilio sandbox number
        to: owner,
        body: `🚗 New Auto Request!\nCustomer: ${name}\nPhone: ${phone}\nPickup: ${pickup}\nDrop: ${drop}`
      });
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(5000, () => console.log('🚀 Server running on port 5000'));
