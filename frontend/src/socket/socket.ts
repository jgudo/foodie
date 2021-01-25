import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_FOODIE_URL || 'http://localhost:9000', {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 50
});

export default socket;