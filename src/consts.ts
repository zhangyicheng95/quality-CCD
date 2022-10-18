// const BASE_IP = process.env.NODE_ENV === 'development' ? 'test78.sany.com.cn' : 'localhost';
const { origin, pathname = '/', href } = window.location;
const BASE_IP = (href.indexOf('iframe') > -1 || pathname !== '/') ?
    `${origin.split('http://')[1] + pathname}` :
    ((localStorage.getItem("ipUrl-real") || 'localhost:8888') + pathname);

export const website = {
    socket: `ws://${BASE_IP}webSocket`,
};
