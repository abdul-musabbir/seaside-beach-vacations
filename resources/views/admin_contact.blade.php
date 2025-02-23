<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Contact Form Submission</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f9;
        color: #333;
        margin: 0;
        padding: 0;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      .header {
        text-align: center;
        padding-bottom: 20px;
      }
      .header h1 {
        color: #007bff;
      }
      .content {
        font-size: 16px;
        line-height: 1.6;
      }
      .content p {
        margin: 10px 0;
      }
      .footer {
        margin-top: 20px;
        text-align: center;
        font-size: 14px;
        color: #555;
      }
      .footer a {
        color: #007bff;
        text-decoration: none;
      }
      .table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      .table th,
      .table td {
        padding: 12px;
        text-align: left;
        border: 1px solid #ddd;
      }
      .table th {
        background-color: #f7f7f7;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Contact Form Submission</h1>
      </div>

      <div class="content">
        <p>Hello,</p>
        <p>You have received a new message from your contact form. Here are the details:</p>

        <table class="table">
          <tr>
            <th>Name</th>
            <td>{{ $name }}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>{{ $email }}</td>
          </tr>
          <tr>
            <th>Phone</th>
            <td>{{ $phone }}</td>
          </tr>
          <tr>
            <th>Message</th>
           <td>{{ $messagex }}</td>
          </tr>
        </table>

        <p>Best regards,<br />Your Website Team</p>
      </div>

      <div class="footer">
        <p>If you did not request this, please ignore this email.</p>
      </div>
    </div>
  </body>
</html>
