import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import GeoJson from '@/views/GeoJson/index.vue';
import indexedDB from '@/views/IndexedDB/index.vue';
import czmlVue from '@/views/Czml/index.vue';
import Sensor from '@/views/Sensor/index.vue';
import Octahedron from '@/views/Octahedron/index.vue';
import Cylinder from '@/views/Cylinder/index.vue';
import Sector from '@/views/Sector/index.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/geojson',
    // redirect: '/octahedron',
  },
  {
    // 全球&中国行政区划
    path: '/geojson',
    name: 'GeoJson',
    component: GeoJson,
  },
  {
    // indexedDB
    path: '/indexedDB',
    name: 'IndexedDB',
    component: indexedDB,
  },
  {
    // czml 卫星数据
    path: '/czml',
    name: 'Czml',
    component: czmlVue,
  },

  // ts 接口和抽象类
  // {
  //   path: '/interface',
  //   name: 'Interface',
  //   component:
  // },

  // turf.js 叠加合并雷达范围
  {
    path: '/sensor',
    name: 'Sensor',
    component: Sensor,
  },
  // cesium 8面体
  {
    path: '/octahedron',
    name: 'Octahedron',
    component: Octahedron,
  },
  // 圆柱体
  {
    path: '/cylinder',
    name: 'Cylinder',
    component: Cylinder,
  },
  // 扇形
  {
    path: '/sector',
    name: 'Sector',
    component: Sector,
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
