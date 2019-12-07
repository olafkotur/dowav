import express from 'express'
import { MongoService } from './services/mongo';
import { LiveHandler } from './handlers/live';

const PORT = process.env.PORT || 8080;
const app: express.Application = express();

async function main() {
  await MongoService.connect();

  // Live Handlers
  app.get('/api/live/:sensor', LiveHandler.getLiveSensor);

  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

} main();
