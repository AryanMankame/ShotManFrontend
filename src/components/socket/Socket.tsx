import { io } from 'socket.io-client'
const URL = 'https://shotmanbackend.onrender.com/'
export const socket = io(URL);
