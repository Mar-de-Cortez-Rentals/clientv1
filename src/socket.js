import { io } from 'socket.io-client';
import { API_URL } from '../config';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:2000';

export const socket = io(API_URL);
