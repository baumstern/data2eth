import Fastify from 'fastify';

import { cast } from './caster.js';

// This is to fix 'JSON.stringify() doesn't know how to serialize a BigInt' error
//  ref: https://github.com/GoogleChromeLabs/jsbi/issues/30#issuecomment-953187833
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const server = Fastify({
  logger: true,
});

server.get('/ping', async () => {
  return { response: 'pong' };
});

server.post('/upload', async (req, reply) => {
  const body = req.body;

  const result = await cast(JSON.stringify(body));

  reply.send(JSON.stringify(result));
});

const start = async () => {
  try {
    await server.listen({ port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
