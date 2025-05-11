import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  private readonly SOLANA_ADDR: string | undefined;
  private readonly USDC_DECIMALS = 6;
  private readonly EXPECTED_AMOUNT = 0.01;

  constructor(private readonly configService: ConfigService) {
    this.SOLANA_ADDR = this.configService.get<string>('SOLANA_ADDR');
  }

  async handleAlchemyWebhook(payload: any) {
    try {
      const { event } = payload;
      
      if (event.type !== 'TOKEN_TRANSFER') {
        this.logger.log(`Ignoring non-token transfer event: ${event.type}`);
        return { status: 'ignored', reason: 'not_a_token_transfer' };
      }

      const { to, token, value } = event;
      
      // Verify the destination address
      if (to !== this.SOLANA_ADDR) {
        this.logger.log(`Transaction to different address: ${to}`);
        return { status: 'ignored', reason: 'wrong_destination' };
      }

      // Verify it's USDC token
      if (token.symbol !== 'USDC') {
        this.logger.log(`Non-USDC token transfer: ${token.symbol}`);
        return { status: 'ignored', reason: 'not_usdc' };
      }

      // Convert value from smallest unit to USDC
      const amount = Number(value) / Math.pow(10, this.USDC_DECIMALS);

      // Verify the amount
      if (amount !== this.EXPECTED_AMOUNT) {
        this.logger.log(`Unexpected amount: ${amount} USDC`);
        return { status: 'ignored', reason: 'wrong_amount' };
      }

      // Log the successful transaction
      this.logger.log(`Valid USDC payment received: ${amount} USDC`);
      
      return {
        status: 'success',
        amount,
        token: 'USDC',
        transactionHash: event.transactionHash,
      };
    } catch (error) {
      this.logger.error('Error processing webhook:', error);
      throw error;
    }
  }
} 