export default [
    {
        path: '/',
        component: './Index',
        routes: [
            // {
            //     path: '/home',
            //     name: '实时结果',
            //     component: './',
            // },
            // {
            //     path: '/history',
            //     name: '历史查询',
            //     component: './History',
            // },
            // {
            //     path: '/dataStatistics',
            //     name: '数据统计',
            //     component: './DataStatistics',
            // },
            // {
            //     path: '*',
            //     redirect: '/realtime',
            // }
        ]
    },
    {
        path: '*',
        component: './Index',
    }
];
