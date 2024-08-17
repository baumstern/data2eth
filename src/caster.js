import { createWalletClient, http, publicActions, toHex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';

export async function cast(body) {
  const account = privateKeyToAccount(
    '',
  );

  const client = createWalletClient({
    account,
    chain: sepolia,
    transport: http(),
  }).extend(publicActions);

  const hash = await client.sendTransaction({
    to: account.address,
    value: 0,
    data: toHex(body),
  });

  const txReceipt = await client.waitForTransactionReceipt({
    hash: hash,
  });

  return txReceipt;
}
