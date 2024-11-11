// const BASE_IP = process.env.NODE_ENV === 'development' ? 'test78.sany.com.cn' : 'localhost';

const BASE_IP = localStorage.getItem("ipUrl-realtime") || 'localhost:8866';

export const website = {
    socket: `ws://${BASE_IP}/`,
};
