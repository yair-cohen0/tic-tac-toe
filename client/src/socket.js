import { io } from 'socket.io-client';

const URL = 'http://localhost:' + import.meta.env.VITE_PORT;

export const socket = io(URL);
