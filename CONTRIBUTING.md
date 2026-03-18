# Contributor Guide

## 🛠 Setup
For environment setup and running the application, please refer to the **Quick Start** section in the [README.md](./README.md).

## 🏛 Architectural Standards

We follow a **Pure Ionic + Emotion** UI layer. 

### 🚫 No Tailwind CSS
Tailwind is strictly forbidden – strong/unpopular opinion: it turns your JSX into a mess. CSS is a real skill. We use `@emotion/css` for custom styling.

### 1. Component Rules (Ionic)
*   **Don't** use standard HTML elements (`div`, `span`, `button`, `h1`) if an [Ionic React equivalent](https://ionicframework.com/docs/components) exists.
*   **Ideal:** `<IonTitle>`, `<IonText>`, `<IonButton>`, `<IonGrid>`.
*   **Reason:** This ensures the app feels native on touch-screen kiosks and maintains consistent spacing and accessible touch targets. Also helps ensure consistency across various mobile webviews/browsers. Also, portable to cross-platform app builds.

### 2. Styling Rules (@emotion/css)
*   Use template literals for CSS.
*   Keep styles in the component file for small components, or a sibling `*.styles.ts` file for complex ones.
*   **Pattern:**
    ```tsx
    const cardStyles = css`
      background: white;
      border-radius: 20px;
      padding: 24px;
    `;
    ```

## 🗄 Database Workflow (Prisma)
*   All queries in Server Actions must include `where: { orgId: currentOrgId }` to ensure tenant isolation.
*   Update schema in `prisma/schema.prisma`.
*   Generate client: `npx prisma generate`.
*   Run migrations: `npx prisma migrate dev`.

## 🧪 Testing Workflow
We require tests for all new core features.
1.  **Logic:** Add unit tests in `lib/*.test.ts`.
2.  **UI:** Add component tests in `components/*.test.tsx`.
3.  **Flows:** Add E2E smoke tests in `tests-e2e/*.spec.ts`.

Run the full suite with:
```bash
npm run test:unit
npm run test:components
npm run test:e2e
```

## 📝 Submitting a PR
*   Ensure all tests pass.
*   Ensure Node.js v24+ is used.
*   Verify the UI on both Mobile and Desktop views.
*   To do: test coverage cobertura reports, test coverage gating, and test jobs in CI/CD.
