import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const OAuth2 = google.auth.OAuth2;

const createTransporter = async (env) => {
    try {
        const oauth2Client = new OAuth2(
            env.GMAIL_CLIENT_ID,
            env.GMAIL_CLIENT_SECRET,
            "https://developers.google.com/oauthplayground"
        );

        oauth2Client.setCredentials({
            refresh_token: env.GMAIL_REFRESH_TOKEN
        });

        const accessToken = await new Promise((resolve, reject) => {
            oauth2Client.getAccessToken((err, token) => {
                if (err) {
                    console.error("OAuth2 Access Token Error:", err);
                    reject("Failed to create access token");
                }
                resolve(token);
            });
        });

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                type: "OAuth2",
                user: env.EMAIL_USER,
                accessToken,
                clientId: env.GMAIL_CLIENT_ID,
                clientSecret: env.GMAIL_CLIENT_SECRET,
                refreshToken: env.GMAIL_REFRESH_TOKEN
            }
        });

        return transporter;
    } catch (err) {
        console.error("Transporter Creation Error:", err);
        throw err;
    }
};

export const sendOTP = async (email, otp, env) => {
    try {
        console.log(`Attempting to send OTP to ${email}...`);
        const transporter = await createTransporter(env);

        const mailOptions = {
            from: `"SynapseX Neural Core" <${env.EMAIL_USER}>`,
            to: email,
            subject: "Neural Access Verification Code",
            html: `
                <div style="background-color: #050505; color: #ffffff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; text-align: center; border: 1px solid #10b981;">
                    <h1 style="color: #10b981; font-size: 24px; letter-spacing: 2px;">SYNAPSEX VERIFICATION</h1>
                    <p style="color: #9ca3af; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Initial Uplink Detected</p>
                    <div style="margin: 30px 0; padding: 20px; border: 1px dashed #10b981; display: inline-block;">
                        <span style="font-size: 32px; font-weight: bold; color: #ffffff; letter-spacing: 10px;">${otp}</span>
                    </div>
                    <p style="color: #6b7280; font-size: 12px;">This neural access code will expire in 10 minutes.</p>
                    <p style="color: #4b5563; font-size: 10px; margin-top: 40px;">IF YOU DID NOT REQUEST THIS UPLINK, DISREGARD IMMEDIATELY.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email Transmitted:", info.messageId);
        return true;
    } catch (error) {
        console.error("Email Transmission Critical Failure:", error);
        return false;
    }
};

export const sendResetOTP = async (email, otp, env) => {
    try {
        const mailOptions = {
            from: `"SynapseX Security" <${env.EMAIL_USER}>`,
            to: email,
            subject: "Neural Key Reset Authorization",
            html: `
                <div style="background-color: #050505; color: #ffffff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; text-align: center; border: 1px solid #10b981;">
                    <h1 style="color: #10b981; font-size: 24px; letter-spacing: 2px;">NEURAL KEY RECOVERY</h1>
                    <p style="color: #9ca3af; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Recovery Protocol Initiated</p>
                    <div style="margin: 30px 0; padding: 20px; border: 1px dashed #10b981; display: inline-block;">
                        <span style="font-size: 32px; font-weight: bold; color: #ffffff; letter-spacing: 10px;">${otp}</span>
                    </div>
                    <p style="color: #6b7280; font-size: 12px;">Enter this code along with your new access key to restore connection.</p>
                    <p style="color: #4b5563; font-size: 10px; margin-top: 40px;">IF YOU DID NOT REQUEST THIS RECOVERY, SECURE YOUR ACCOUNT IMMEDIATELY.</p>
                </div>
            `
        };

        const transporter = await createTransporter(env);
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error("Reset Email Error:", error);
        return false;
    }
};
