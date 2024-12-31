import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import GeoJson from '@/views/GeoJson/index.vue';
import indexedDB from '@/views/IndexedDB/index.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/geojson',
  },
  {
    path: '/geojson',
    name: 'GeoJson',
    component: GeoJson,
  },
  {
    path: '/indexedDB',
    name: 'IndexedDB',
    component: indexedDB,
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
