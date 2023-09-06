import { io } from 'socket.io-client'
const URL = 'https://shotman.onrender.com/'
export const socket = io(URL);
