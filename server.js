const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Nodemailer Transporter Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verification of Transporter
transporter.verify((error, success) => {
    if (error) {
        console.log('Error with transporter:', error);
    } else {
        console.log('Server is ready to take messages');
    }
});

// API Endpoint for Registration
app.post('/api/register', async (req, res) => {
    const formData = req.body;
    console.log('Received registration:', formData);

    const mailOptions = {
        from: `" .root Club" <${process.env.EMAIL_USER}>`,
        to: process.env.RECEIVER_EMAIL,
        subject: `New Registration: ${formData.fullName} (${formData.domain})`,
        text: `
            New Member Registration Details:
            --------------------------------
            Full Name: ${formData.fullName}
            USN: ${formData.usn}
            Phone: ${formData.phone}
            Email: ${formData.email}
            Branch: ${formData.branch}
            Semester: ${formData.semester}
            Domain: ${formData.domain}
            
            ${formData.domain === 'tech' ? `
            Techstack: ${formData.techstack}
            Skill Level: ${formData.skillLevel}
            ` : `
            Non-Tech Field: ${formData.nonTechField}
            Portfolio: ${formData.portfolio}
            `}
            
            Value to .root:
            ${formData.valueContribution}
            --------------------------------
        `,
        html: `
            <h3>New Member Registration Details</h3>
            <table border="1" cellpadding="10" style="border-collapse: collapse; width: 100%;">
                <tr><td><strong>Full Name</strong></td><td>${formData.fullName}</td></tr>
                <tr><td><strong>USN</strong></td><td>${formData.usn}</td></tr>
                <tr><td><strong>Phone</strong></td><td>${formData.phone}</td></tr>
                <tr><td><strong>Email</strong></td><td>${formData.email}</td></tr>
                <tr><td><strong>Branch</strong></td><td>${formData.branch}</td></tr>
                <tr><td><strong>Semester</strong></td><td>${formData.semester}</td></tr>
                <tr><td><strong>Domain</strong></td><td>${formData.domain}</td></tr>
                ${formData.domain === 'tech' ? `
                <tr><td><strong>Techstack</strong></td><td>${formData.techstack}</td></tr>
                <tr><td><strong>Skill Level</strong></td><td>${formData.skillLevel}</td></tr>
                ` : `
                <tr><td><strong>Non-Tech Field</strong></td><td>${formData.nonTechField}</td></tr>
                <tr><td><strong>Portfolio</strong></td><td>${formData.portfolio}</td></tr>
                `}
                <tr><td><strong>Value to .root</strong></td><td>${formData.valueContribution}</td></tr>
            </table>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Registration email sent successfully!' });
    } catch (error) {
        console.error('Email send error:', error);
        res.status(500).json({ success: false, message: 'Failed to send registration email.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
