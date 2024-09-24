import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";
import { Logger } from "@nestjs/common";

export class EmailService {
  private sesClient: SESClient;

  constructor() {
    this.sesClient = new SESClient({ region: 'us-east-1' });
  }

  async sendEmail(to: string, subject: string, body: string) {
    const params = {
      Destination: {
        ToAddresses: [to], // Destinatário
      },
      Message: {
        Body: {
          Text: { Data: body }, // Corpo do email
        },
        Subject: { Data: subject }, // Assunto do email
      },
      Source: 'jeans_bs@outlook.com', // Email verificado no SES
    };

    try {
      const command = new SendEmailCommand(params);
      const response = await this.sesClient.send(command);
      Logger.log(`Email sent! Message ID: ${response.MessageId}`);
    } catch (error) {
      Logger.error('Error sending email', error);
    }
  }
}