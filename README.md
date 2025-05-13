<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# Solana USDC Payment Webhook API

This API service handles webhooks for USDC payments on Solana and provides transaction verification functionality.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
SOLANA_ADDR=your_solana_address
ALCHEMY_API_KEY=your_alchemy_api_key
```

3. Start the server:
```bash
npm run start:dev
```

## API Endpoints

### 1. Webhook Endpoint

This endpoint receives notifications from Alchemy when transactions occur on your monitored Solana address.

**Endpoint:** `POST /webhook/alchemy`

**Setup in Alchemy Dashboard:**
1. Go to https://dashboard.alchemy.com/webhooks
2. Create a new webhook
3. Set the webhook URL to: `http://your-api-url/webhook/alchemy`
4. Configure the webhook to monitor your Solana address for USDC token transfers
5. Set the amount filter to 0.01 USDC

The webhook will verify:
- The transaction is a token transfer
- The destination address matches your configured address
- The token is USDC
- The amount is exactly 0.01 USDC

**Example Response:**
```json
{
  "status": "success",
  "amount": 0.01,
  "token": "USDC",
  "transactionHash": "your_transaction_hash",
  "solscanUrl": "https://solscan.io/tx/your_transaction_hash",
  "from": "sender_address",
  "to": "your_solana_address"
}
```

**Server Logs:**
```
=== Incoming Webhook ===
Event Type: TOKEN_TRANSFER
Transaction Hash: your_transaction_hash
Solscan URL: https://solscan.io/tx/your_transaction_hash
=== Valid USDC Payment Received ===
Amount: 0.01 USDC
From: sender_address
To: your_solana_address
Transaction Hash: your_transaction_hash
Solscan URL: https://solscan.io/tx/your_transaction_hash
===============================
```

### 2. Transaction Verification

This endpoint allows you to verify a transaction's details on the blockchain.

**Endpoint:** `GET /transaction/verify?txHash=your_transaction_hash`

**Example:**
```bash
curl "http://localhost:3000/transaction/verify?txHash=your_transaction_hash"
```

**Response:**
```json
{
  "status": "found",
  "transaction": {
    "hash": "your_transaction_hash",
    "amount": "0.01",
    "token": "USDC",
    "solscanUrl": "https://solscan.io/tx/your_transaction_hash"
  }
}
```

**Server Logs:**
```
=== Verifying Transaction ===
Transaction Hash: your_transaction_hash
Solscan URL: https://solscan.io/tx/your_transaction_hash
=== Transaction Details ===
Transaction Hash: your_transaction_hash
Amount: 0.01
Token: USDC
Solscan URL: https://solscan.io/tx/your_transaction_hash
===============================
```

## Error Handling

The API includes comprehensive error handling and logging. All errors are logged with appropriate context for debugging.

## Security

- The webhook endpoint should be secured in production using appropriate authentication
- API keys and sensitive configuration are managed through environment variables
- Input validation is performed on all endpoints
