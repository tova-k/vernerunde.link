const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const formData = JSON.parse(event.body);

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "hmtaskvoll@gmail.com",
      pass: "Askvoll+Vernerunde+4645"
    }
  });

  const mailOptions = {
    from: 'hmtaskvoll@gmail.com',
    to: 'hmtaskvoll@gmail.com',
    subject: 'Ny vernerunderapport',
    text: `
Dato: ${formData.date}
Deltakarar: ${formData.participants}
Stad: ${formData.location}
Risikoscore: ${formData.riskScore.toFixed(2)}%

Svar på spørsmål:
${Object.entries(formData.answers).map(([key, value]) => `
Spørsmål ${parseInt(key) + 1}: ${value}
Kommentar: ${formData.comments[key] || 'Ingen kommentar'}
`).join('\n')}
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Report sent successfully' })
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error sending email' })
    };
  }
};