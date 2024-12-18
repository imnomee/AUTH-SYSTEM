import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS,
    },
});

transporter.verify((err, succ) => {
    if (err) {
        console.error('Error configuring transporter:', err);
    } else {
        console.log('Email transporter is ready to send emails');
    }
});

export default transporter;
