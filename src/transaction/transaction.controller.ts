import { Controller, Get, Query, Logger } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);

  constructor(private readonly transactionService: TransactionService) {}

  @Get('verify')
  async verifyTransaction(@Query('txHash') txHash: string) {
    this.logger.log(`Verifying transaction: ${txHash}`);
    return this.transactionService.verifyTransaction(txHash);
  }
} 