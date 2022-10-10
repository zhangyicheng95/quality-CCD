import Mock from 'mockjs';

function getDahboardDeom() {
    const data = [];
    for (let i = 0; i < 32; i++) {
        data.push({
            title: 'ID' + i,
            url: '/dashboard/details',
            img: '/img/dashboard/demo.jpg'
        });
    }
    return data;
}


export const DASHBOARD = {
    '/dashboard/demo': getDahboardDeom()
}