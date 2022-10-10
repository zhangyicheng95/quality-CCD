import Mock from 'mockjs';

function getUser() {
    const data = [];
    for (let i = 0; i < 6; i++) {
        data.push({
            id: 'ID' + i,
            name: '名称' + i,
            desc: '/dashboard/details',
            password: '123456',
            organization: '马坊'
        });
    }
    return data;
}


export const USER = {
    "/nx_api/users/list": {
        code: 0,
        total: 6,
        data: getUser()
    }
}