import app from './fastify';

export default async function commitToDb(promise: Promise<unknown>) {
  const [error, data] = await app.to(promise);
  if (error) return app.httpErrors.internalServerError(error.message);
  return data;
}
