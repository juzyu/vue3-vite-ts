import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import GeoJson from '@/views/GeoJson/index.vue';
import indexedDB from '@/views/IndexedDB/index.vue';
import czmlVue from '@/views/Czml/index.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/geojson',
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
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
