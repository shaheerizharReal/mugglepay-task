import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  private readonly SOLANA_ADDR: string | undefined;
  private readonly USDC_DECIMALS = 6;
  private readonly EXPECTED_AMOUNT = 0.01;
  private readonly SOLSCAN_BASE_URL = 'https://solscan.io/tx/';

  constructor(private readonly configService: ConfigService) {
    this.SOLANA_ADDR = this.configService.get<string>('SOLANA_ADDR');
  }

  async handleAlchemyWebhook(payload: any) {
    try {
      const { event } = payload;
      
      this.logger.log('=== Incoming Webhook ===');
      this.logger.log(`Event Type: ${event.type}`);
      this.logger.log(`Transaction Hash: ${event.transactionHash}`);
      this.logger.log(`Solscan URL: ${this.SOLSCAN_BASE_URL}${event.transactionHash}`);
      
      if (event.type !== 'TOKEN_TRANSFER') {
        this.logger.log(`Ignoring non-token transfer event: ${event.type}`);
        return { 
          status: 'ignored', 
          reason: 'not_a_token_transfer',
          solscanUrl: `${this.SOLSCAN_BASE_URL}${event.transactionHash}`
        };
      }

      const { to, token, value } = event;
      
      // Verify the destination address
      if (to !== this.SOLANA_ADDR) {
        this.logger.log(`Transaction to different address: ${to}`);
        this.logger.log(`Expected address: ${this.SOLANA_ADDR}`);
        return { 
          status: 'ignored', 
          reason: 'wrong_destination',
          solscanUrl: `${this.SOLSCAN_BASE_URL}${event.transactionHash}`
        };
      }

      // Verify it's USDC token
      if (token.symbol !== 'USDC') {
        this.logger.log(`Non-USDC token transfer: ${token.symbol}`);
        return { 
          status: 'ignored', 
          reason: 'not_usdc',
          solscanUrl: `${this.SOLSCAN_BASE_URL}${event.transactionHash}`
        };
      }

      // Convert value from smallest unit to USDC
      const amount = Number(value) / Math.pow(10, this.USDC_DECIMALS);

      // Verify the amount
      if (amount !== this.EXPECTED_AMOUNT) {
        this.logger.log(`Unexpected amount: ${amount} USDC`);
        this.logger.log(`Expected amount: ${this.EXPECTED_AMOUNT} USDC`);
        return { 
          status: 'ignored', 
          reason: 'wrong_amount',
          solscanUrl: `${this.SOLSCAN_BASE_URL}${event.transactionHash}`
        };
      }

      // Log the successful transaction
      this.logger.log('=== Valid USDC Payment Received ===');
      this.logger.log(`Amount: ${amount} USDC`);
      this.logger.log(`From: ${event.from}`);
      this.logger.log(`To: ${to}`);
      this.logger.log(`Transaction Hash: ${event.transactionHash}`);
      this.logger.log(`Solscan URL: ${this.SOLSCAN_BASE_URL}${event.transactionHash}`);
      this.logger.log('===============================');
      
      return {
        status: 'success',
        amount,
        token: 'USDC',
        transactionHash: event.transactionHash,
        solscanUrl: `${this.SOLSCAN_BASE_URL}${event.transactionHash}`,
        from: event.from,
        to: to
      };
    } catch (error) {
      this.logger.error('Error processing webhook:', error);
      throw error;
    }
  }
} 