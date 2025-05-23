import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);
  private readonly alchemyApiKey: string | undefined;
  private readonly alchemyBaseUrl: string;
  private readonly SOLSCAN_BASE_URL = 'https://solscan.io/tx/';

  constructor(private readonly configService: ConfigService) {
    this.alchemyApiKey = this.configService.get<string>('ALCHEMY_API_KEY');
    this.alchemyBaseUrl = `https://solana-mainnet.g.alchemy.com/v2/${this.alchemyApiKey}`;
  }

  async verifyTransaction(txHash: string) {
    try {
      this.logger.log('=== Verifying Transaction ===');
      this.logger.log(`Transaction Hash: ${txHash}`);
      this.logger.log(`Solscan URL: ${this.SOLSCAN_BASE_URL}${txHash}`);

      const response = await axios.post(this.alchemyBaseUrl, {
        jsonrpc: '2.0',
        id: 1,
        method: 'getTransaction',
        params: [txHash, { encoding: 'jsonParsed', maxSupportedTransactionVersion: 0 }],
      });

      const transaction = response.data.result;
      
      if (!transaction) {
        this.logger.log(`Transaction not found: ${txHash}`);
        this.logger.log('===============================');
        return { 
          status: 'not_found',
          solscanUrl: `${this.SOLSCAN_BASE_URL}${txHash}`
        };
      }

      // Log transaction details
      this.logger.log('=== Transaction Details ===');
      this.logger.log(`Transaction Hash: ${txHash}`);
      this.logger.log(`Amount: ${transaction.meta?.postBalances?.[0]}`);
      this.logger.log(`Token: ${transaction.meta?.postTokenBalances?.[0]?.mint}`);
      this.logger.log(`Solscan URL: ${this.SOLSCAN_BASE_URL}${txHash}`);
      this.logger.log('===============================');

      return {
        status: 'found',
        transaction: {
          hash: txHash,
          amount: transaction.meta?.postBalances?.[0],
          token: transaction.meta?.postTokenBalances?.[0]?.mint,
          solscanUrl: `${this.SOLSCAN_BASE_URL}${txHash}`
        },
      };
    } catch (error) {
      this.logger.error('Error verifying transaction:', error);
      throw error;
    }
  }
} 