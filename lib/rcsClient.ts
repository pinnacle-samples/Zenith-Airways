import { Pinnacle } from 'rcs-js';
import 'dotenv/config';

const apiKey = process.env.PINNACLE_API_KEY;

if (!apiKey) {
  throw new Error('PINNACLE_API_KEY environment variable is not set');
}

export const rcsClient = new Pinnacle({ apiKey });
