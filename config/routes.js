export default [
  { path: '/home', layout: false, component: './Home' },
  { path: '/shp', layout: false, component: './Shp' },
  { path: '/shp-setting/:id', layout: false, component: './ShpSetting/[id]' },
  { path: '/gdb', layout: false, component: './GDB' },
  { path: '/success', layout: false, component: './Success' },
  { path: '/', redirect: '/home' },
  { component: './404' },
];
