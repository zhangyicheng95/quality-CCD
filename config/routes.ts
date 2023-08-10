export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/Login',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'home',
    icon: 'home',
    path: '/home',
    // layout: false,
    component: './home',
    routes: [
      {
        path: '/home',
        redirect: './home/components/Canvas',
      },
      {
        path: '/home/edit',
        component: './home/components/Canvas',
      },
    ],
    access: 'canAdmin',
  },
  {
    name: 'history',
    icon: 'history',
    path: '/history',
    access: 'canHistory',
    component: './history-demo',
    routes: [
      {
        path: '/history',
        redirect: './history-demo/components/List',
      },
      {
        path: '/history/detail',
        component: './history-demo/components/Details',
      },
    ]
  },
  {
    name: 'mark',
    icon: 'highlight',
    path: '/mark',
    component: './mark',
    access: 'canMark',
    routes: [
      {
        path: '/mark',
        redirect: './mark/components/List',
      },
      {
        path: '/mark/detail',
        component: './mark/components/Details',
      },
    ]
  },
  {
    name: 'control',
    icon: 'control',
    path: '/control',
    access: 'canControl',
    component: './control',
  },
  {
    name: 'setting',
    icon: 'setting',
    path: '/setting',
    component: './setting',
  },

  // {
  //   path: '/dashboard',
  //   name: 'dashboard',
  //   icon: 'dashboard',
  //   routes: [
  //     {
  //       path: '/dashboard',
  //       redirect: '/dashboard/analysis',
  //     },
  //     {
  //       name: 'analysis',
  //       icon: 'smile',
  //       path: '/dashboard/analysis',
  //       component: './dashboard/analysis',
  //     },
  //     {
  //       name: 'monitor',
  //       icon: 'smile',
  //       path: '/dashboard/monitor',
  //       component: './dashboard/monitor',
  //     },
  //     {
  //       name: 'workplace',
  //       icon: 'smile',
  //       path: '/dashboard/workplace',
  //       component: './dashboard/workplace',
  //     },
  //   ],
  // },
  {
    path: '/',
    redirect: '/setting',
  },
  {
    component: './404',
  },
];
