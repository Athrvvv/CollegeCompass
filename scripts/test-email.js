const nodemailer = require('nodemailer');

async function testMail() {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "atharvapkhond@gmail.com",
      pass: "idno ipuu hrkc cxme"
    }
  });

  try {
    console.log("Verifying transporter...");
    await transporter.verify();
    console.log("Transporter verified!");

    console.log("Sending test mail...");
    const info = await transporter.sendMail({
      from: '"College Compass Test" <atharvapkhond@gmail.com>',
      to: "atharvapkhond@gmail.com",
      subject: "Test Email from College Compass",
      text: "If you receive this, your Nodemailer config is working!",
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Test Mail Error:", error);
  }
}

testMail();
