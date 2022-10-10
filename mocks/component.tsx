import Mock from 'mockjs';

const getComponentList = () => {
    const data = [];
    for (let i = 0; i < 20; i++) {
        data.push({
            title: 'ID' + i,
            url: '/dashboard/details',
            img: 'img/component/demo.jpg'
        });
    }
    return data
}

function responseData() {
    const data = [];
    for (let i = 0; i < 10; i++) {
        data.push(Mock.mock({
            name: 'name' + i,
            'value|1-100': 100
        }));
    }
    return data;
}

export const component = {
    "/component/list": {
        data: getComponentList()
    },
    '/component/add/response': responseData()
}
