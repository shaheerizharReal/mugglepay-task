import { Controller, Post, Body, Logger } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private readonly webhookService: WebhookService) {}

  @Post('alchemy')
  async handleAlchemyWebhook(@Body() payload: any) {
    this.logger.log('Received Alchemy webhook');
    return this.webhookService.handleAlchemyWebhook(payload);
  }
} 