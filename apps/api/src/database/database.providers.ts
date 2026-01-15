import * as mongoose from 'mongoose';
import { DATABASE_CONNECTION, MONGODB_URI } from 'src/constants/app.constants';

export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: async (): Promise<typeof mongoose> => {
      if (!MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined');
      }
      try {
        const connection = await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connected');
        return connection;
      } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
      }
    },
  },
];
