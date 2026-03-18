# Recipe Manager - Kitchen Kiosk

A multi-tenant, digital recipe management system designed for professional kitchens. Optimized for touch-first kiosk displays and tablets.

## How I Did This

1. [Goal] Highest fidelity application and implementation within 4 hours
2. [30 mins] Give original requirements PDF/Doc to Gemini 3.1-pro Chat along with a PRD template and Design Doc template; Iterate 5-6x quickly and give guidance
3. [10 mins] Feed PRD and Requirements into Figma Make to generate a rapid functional prototype; Iterate 1-2x with guidance
4. [20 mins] Feed Figma prototype code, along with NextJS + Prisma starter repo into gemini-cli (gemini-3.1-pro)
5. [2 hours] Iterate and fix AI jank
6. [1 hour] Generate test skeletons and fix by hand
7. Generate docs + repo and submit

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js:** v24.0+
- **Docker:** Installed and running.

### 2. Initial Setup
```bash
npm install
npm run db:setup
npm run dev
```
The app will be available at `http://localhost:3000`.


## 🏛 Documentation
- **Architecture & Design:** See [DESIGN.md](./DESIGN.md)
- **Contribution Rules:** See [CONTRIBUTING.md](./CONTRIBUTING.md)

## 🧪 Testing

Try the E2E tests. It'll effectively give you a guided tour of the UI... but like, very quickly.

```bash
npm run test:prepare # Install browsers
npm run test:unit
npm run test:components
npm run test:e2e
```
