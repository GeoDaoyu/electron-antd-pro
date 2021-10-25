export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/home',
    name: 'Home',
    layout: false,
    component: './Home',
  },
  {
    path: '/shp',
    name: 'Shp',
    layout: false,
    component: './Shp',
  },
  {
    path: '/gdb',
    name: 'GDB',
    layout: false,
    component: './GDB',
  },
  {
    path: '/mul',
    name: 'Mul',
    layout: false,
    component: './Mul',
  },
  {
    path: '/',
    redirect: '/home',
  },
  {
    component: './404',
  },
];
