import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";
import { Logger } from "@nestjs/common";

export class EmailService {

  private readonly logger = new Logger(EmailService.name);

  private sesClient: SESClient;

  constructor() {
    this.sesClient = new SESClient({ region: 'us-east-1',
      credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY }
     });
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
      this.logger.log(`Email sent! Message ID: ${response.MessageId}`);
    } catch (error) {
      this.logger.error('Error sending email', error);
    }
  }
}