import { NhostClient } from '@nhost/nhost-js';

let nhostSingleton: NhostClient | null = null;

function buildServiceUrl(baseUrl: string | undefined, path: string): string | undefined {
  if (!baseUrl) return undefined;
  const trimmed = baseUrl.replace(/\/$/, '');
  return `${trimmed}${path}`;
}

export function getNhostClient(): NhostClient {
  if (!nhostSingleton) {
    const base = process.env.NEXT_PUBLIC_NHOST_BACKEND_URL || 'http://localhost:1337';
    nhostSingleton = new NhostClient({
      authUrl: buildServiceUrl(base, '/v1/auth'),
      storageUrl: buildServiceUrl(base, '/v1/storage'),
      graphqlUrl: process.env.NEXT_PUBLIC_GRAPHQL_HTTP || buildServiceUrl(base, '/v1/graphql'),
      functionsUrl: buildServiceUrl(base, '/v1/functions'),
    });
  }
  return nhostSingleton;
}

export const nhost = getNhostClient();


