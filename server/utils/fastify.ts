import Fastify from 'fastify';
import sensible from '@fastify/sensible';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
dotenv.config();

const app = Fastify();
app.register(sensible);
app.register(cors, { origin: process.env.CLIENT_URL, credentials: true });

export default app;
