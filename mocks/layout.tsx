import Mock from 'mockjs';

// yarn add file-saver --save
// @types/file-saver


function getLayoutList() {
    const data = [];
    for (let i = 0; i < 6; i++) {
        data.push({
            title: 'ID' + i,
            url: '/dashboard/details',
            img: 'img/layout/demo.jpg',
            rows: JSON.parse(localStorage.getItem('/layout/add') || '{}')
        });
    }
    return data;
}


export const LAYOUT = {
    '/layout/add': JSON.parse(localStorage.getItem('/layout/add') || '{}'),
    '/custom/layout/add': {},
    '/upload/demo': {
        url: 'layout'
    },
    '/custom/layout/list': getLayoutList(),
}