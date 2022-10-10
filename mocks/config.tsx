import Mock from 'mockjs';

function getUser() {
    const data = [];
    for (let i = 0; i < 6; i++) {
        data.push({
            id: 'ID' + i,
            name: '名称' + i,
            key: 'logo',
            value: '可视化项目',
        });
    }
    return data;
}


export const CONFIG = {
    "/nx_api/system/oem": {
        code: 0,
        total: 6,
        data: getUser()
    }
}