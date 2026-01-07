import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { NextRequest, NextResponse } from "next/server";

// Initialize SES Client
const sesClient = new SESClient({
  region: "us-east-2", // Change this to your SES region
  credentials: {
    accessKeyId: process.env.SES_ACCESS_KEY!,
    secretAccessKey: process.env.SES_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  try {
    // Authentication is already handled by middleware at /src/middleware.ts
    // Get email data from request body
    const { recipients, subject, body, fromEmail = process.env.SES_ROOT_EMAIL! } = await request.json();

    // Validate inputs
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json(
        { error: "Recipients array is required and must not be empty" },
        { status: 400 }
      );
    }

    if (!subject || !body) {
      return NextResponse.json(
        { error: "Subject and body are required" },
        { status: 400 }
      );
    }

    // Create HTML email with embedded logo
    const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <img src="https://gdgutsc.com/gdg-logo.png" alt="GDG Logo" style="max-width: 200px; height: auto;" />
  </div>
  <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
    ${body}
  </div>
  <div style="text-align: center; color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
    <p>This email was sent by Google Developer Group UTSC</p>
    <p>University of Toronto Scarborough</p>
  </div>
</body>
</html>
    `.trim();

    // Send email using SES
    const sendEmailCommand = new SendEmailCommand({
      Source: fromEmail,
      Destination: {
        ToAddresses: recipients,
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: htmlBody,
            Charset: "UTF-8",
          },
          Text: {
            Data: body.replace(/<[^>]*>/g, ""), // Strip HTML tags for plain text version
            Charset: "UTF-8",
          },
        },
      },
    });

    const response = await sesClient.send(sendEmailCommand);

    return NextResponse.json({
      success: true,
      message: `Email sent successfully to ${recipients.length} recipient(s)`,
      messageId: response.MessageId,
    });

  } catch (error) {
    console.error("Error sending email:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to send email",
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
