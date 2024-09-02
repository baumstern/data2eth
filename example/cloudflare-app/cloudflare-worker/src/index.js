import { createWalletClient, http, publicActions, toHex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';

BigInt.prototype["toJSON"] = function () {
	return this.toString();
  };

// Export a default object containing event handlers
export default {
  // The fetch handler is invoked when this worker receives a HTTP(S) request
  // and should return a Response (optionally wrapped in a Promise)
  async fetch(request, env, ctx) {
    // You'll find it helpful to parse the request.url string into a URL object. Learn more at https://developer.mozilla.org/en-US/docs/Web/API/URL
    const url = new URL(request.url);

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': 'https://data2eth.pages.dev',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (url.pathname.startsWith('/api/data2eth')) {
      if (request.method === 'POST') {
        let data;
        const contentType = request.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
          const body = await request.json();
          data = JSON.stringify(body.data);
        } else {
          data = await request.text();
        }
        const result = await cast(data);
        return new Response(JSON.stringify(result), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'https://data2eth.pages.dev',
          },
        });
      }
    }

async function cast(data) {
  const account = privateKeyToAccount(
      env.PRIVATE_KEY
  );

  const client = createWalletClient({
      account,
      chain: sepolia,
      transport: http(),
  }).extend(publicActions);

  const hash = await client.sendTransaction({
      to: account.address,
      value: 0,
      data: toHex(data),
  });

  const txReceipt = await client.waitForTransactionReceipt({
      hash: hash,
  });

  return txReceipt;
}

		return new Response(
			`Try making requests to:
      <ul>
      <li><code><a href="/redirect?redirectUrl=https://example.com/">/redirect?redirectUrl=https://example.com/</a></code>,</li>
      <li><code><a href="/proxy?modify&proxyUrl=https://example.com/">/proxy?modify&proxyUrl=https://example.com/</a></code>, or</li>
      <li><code><a href="/api/todos">/api/todos</a></code></li>`,
			{ headers: {
        "Content-Type": "text/html",
        "Access-Control-Allow-Origin": "https://data2eth.pages.dev"
      } }
		);
  },
};
