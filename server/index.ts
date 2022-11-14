import app from './utils/fastify';
import dotenv from 'dotenv';
dotenv.config();
import recipes from './routes/recipes';

if (!process.env.PORT) process.exit(1);
const PORT = Number(process.env.PORT);

app.register(recipes);

app.listen({ port: PORT }, (err, address) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`App listening on ${address}`);
});
