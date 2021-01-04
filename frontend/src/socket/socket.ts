import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_FOODIE_URL || 'http://localhost:9000');

export default socket;