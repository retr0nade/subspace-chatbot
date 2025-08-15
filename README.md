## Subspace Chatbot

Next.js 14 (Pages Router) + TypeScript + Tailwind CSS, configured for Netlify hosting, with Nhost and Apollo GraphQL.

### Getting started

1. Install dependencies:

```bash
npm install
```

2. Copy env file and fill values:

```bash
cp .env.example .env.local
```

Fill the following keys with your Nhost backend and Hasura GraphQL endpoints:

- `NEXT_PUBLIC_NHOST_BACKEND_URL`
- `NEXT_PUBLIC_GRAPHQL_HTTP`
- `NEXT_PUBLIC_GRAPHQL_WS`

3. Run the dev server:

```bash
npm run dev
```

### Production build

```bash
npm run build && npm start
```

### Netlify

This repo includes `netlify.toml` and `@netlify/plugin-nextjs`. On Netlify, set the build command to `npm run build` and publish directory to `.next`.


