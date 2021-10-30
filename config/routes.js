export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { path: '/user', routes: [{ path: '/user/login', component: './user/Login' }] },
      { component: './404' },
    ],
  },
  { path: '/home', layout: false, component: './Home' },
  { path: '/shp', layout: false, component: './Shp' },
  { path: '/gdb', layout: false, component: './GDB' },
  { path: '/success', layout: false, component: './Success' },
  { path: '/', redirect: '/home' },
  { component: './404' },
];
