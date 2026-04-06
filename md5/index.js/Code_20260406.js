import Fastify from 'fastify';
import CryptoJS from 'crypto-js';

const fastify = Fastify({
  logger: false,
  trustProxy: true
});

fastify.register(async (instance) => {
  instance.addContentTypeParser('application/json', {}, (req, payload, done) => {
    payload.data = '';
    payload.on('data', (chunk) => { payload.data += chunk });
    payload.on('end', () => {
      try { done(null, JSON.parse(payload.data)) }
      catch (err) { done(null, {}) }
    });
  });
});

fastify.get('/', async () => {
  return { code: 200, msg: '服务运行中', api: 'POST /md5' };
});

fastify.post('/md5', async (request) => {
  try {
    const str = request.body?.str;
    if (!str) return { code: 400, msg: '缺少 str' };
    const md5 = CryptoJS.MD5(str).toString();
    return { code: 200, msg: 'ok', data: { str, md5 } };
  } catch (e) {
    return { code: 500, msg: 'error' };
  }
});

const start = async () => {
  const PORT = process.env.PORT || 3006;
  await fastify.listen({ host: '0.0.0.0', port: PORT });
};

start();