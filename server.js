import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: "smtp.example.com",
  port: 587,
  secure: false,
  auth: {
    user: "your_email@example.com",
    pass: "your_password"
  }
});

app.post('/send-report', (req, res) => {
  const formData = req.body;
  
  const mailOptions = {
    from: 'your_email@example.com',
    to: 'recipient@example.com',
    subject: 'Ny vernerunderapport',
    text: JSON.stringify(formData, null, 2)
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('Report sent successfully');
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});