<template>
  <TestB></TestB>
</template>

<script setup lang="ts">
import TestB from '@/views/TestB/TestB.vue';
import { db } from '@/database/index';

const data = [
  {
    key: 1,
    label: 'z',
    age: 24,
    gender: '女',
    parentId: '',
    children: [],
  },
  {
    key: 11,
    label: 'z-child-1',
    age: 2,
    gender: '女',
    parentId: 1,
    children: [],
  },
  {
    key: 12,
    label: 'z-child-2',
    age: 4,
    gender: '男',
    parentId: 1,
    children: [],
  },
  {
    key: 13,
    label: 'z-child-3',
    age: 4,
    gender: '男',
    parentId: 1,
    children: [],
  },
  {
    key: 2,
    label: 'b',
    age: 46,
    gender: '男',
    parentId: '',
    children: [],
  },
  {
    key: 21,
    label: 'b-child-1',
    age: 2,
    gender: '女',
    parentId: 2,
    children: [],
  },
  {
    key: 22,
    label: 'b-child-2',
    age: 4,
    gender: '男',
    parentId: 2,
    children: [],
  },
  {
    key: 3,
    label: 'k',
    age: 46,
    gender: '男',
    parentId: '',
    children: [],
  },
];

db.personal.bulkAdd(data);
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
