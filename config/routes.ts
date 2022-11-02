export default [
  {
    name: 'home',
    icon: 'home',
    path: '/home',
    layout: false,
    component: './home',
  },
  {
    name: 'history',
    icon: 'history',
    path: '/history',
    layout: false,
    component: './history',
  },
  {
    name: 'control',
    icon: 'control',
    path: '/control',
    layout: false,
    component: './control',
  },
  {
    name: 'setting',
    icon: 'setting',
    path: '/setting',
    layout: false,
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
    redirect: '/home',
  },
  {
    component: './404',
  },
];
