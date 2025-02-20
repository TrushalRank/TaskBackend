const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

exports.sendVerificationEmail = async (user, req) => {
  try {
    console.log("req.protocol", process.env)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const verificationUrl = `${req.protocol}://${req.get("host")}/auth/verify-email/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password or app password
      },
    });

    const mailOptions = {
      from: `${process.env.EMAIL_USER}`,
      to: user.email,
      subject: "Verify Your Email - Task Management",
      html: `<p>Click the link below to verify your email:</p>
             <a href="${verificationUrl}" target="_blank">Verify Email</a>
             <p>This link expires in 1 hour.</p>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};
