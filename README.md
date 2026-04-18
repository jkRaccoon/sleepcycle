# Sleep Cycle Calculator

Live: https://sleepcycle.bal.pe.kr

Calculate the best bedtime or wake-up time using 90-minute REM sleep cycles with a 14-minute fall-asleep buffer. Three modes: Sleep Now, Wake At, Go To Bed At.

## Development
```bash
npm install
npm run dev
```

## Deploy
Pushing to `main` triggers the shared OIDC GitHub Actions workflow which deploys via CDK.

## Stack
- Vite + React 19 + TypeScript + Tailwind
- Pure client-side calculation, no external API
- React Router 3 pages + puppeteer prerender
- AWS S3 + CloudFront + ACM + Route53 (`microsaas-infra` CDK Construct)
