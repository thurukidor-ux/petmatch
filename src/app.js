
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import documentRoutes from './routes/documentRoutes.js';
import animalRoutes from './routes/animalRoutes.js';
import breederRoutes from './routes/breederRoutes.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));


app.use('/api/documents', documentRoutes);
app.use('/api/animals', animalRoutes);
app.use('/api/breeders', breederRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'OK', service: 'AniCo Backend Service běží' });
});


async function startServer() {
  try {
    console.log('Pokouším se připojit k MongoDB Atlas...');
   
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 3000 });
    console.log('✅ Úspěšně připojeno k MongoDB Atlas!');
  } catch (err) {
    console.log('⚠️ Atlas není dostupný ze současné sítě. Spouštím rychlou lokální MongoDB...');
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    console.log('✅ Úspěšně připojeno k lokální testovací MongoDB v paměti!');
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server úspěšně běží na http://localhost:${PORT}`);
  });
}

startServer();

export default app;