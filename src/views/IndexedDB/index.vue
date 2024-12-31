<template>
  <div>
    <NButton @click="initPersonalDB">init personal</NButton>
    <NButton @click="handleAddLeaf">插入数据</NButton>
    <NInput v-model:value="keyWord" placeholder="输入姓名" />

    <NTree
      v-if="data.length"
      block-line
      :data="data"
      selectable
      expand-on-click
      :defaultExpandedKeys="defaultExpandedKeys"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watchEffect, onMounted } from 'vue';
import { useTreePersonal } from '@/database/utils';
import { TreeItem } from '@/database/Personal';
import { db } from '@/database/index';
import { dataA, dataB } from './data';

onMounted(async () => {
  await db.personal.clear();
});

const data = ref<TreeItem[]>([]);

const defaultExpandedKeys = ref<(string | number)[]>([]);

const keyWord = ref('');

const { personalTree } = useTreePersonal();

watchEffect(() => {
  const children = personalTree.value;
  const id = 999;

  if (children) {
    const tree = reactive<TreeItem>({
      key: id,
      label: '根结点',
      age: 0,
      parentId: '',
      children,
    });

    data.value.splice(0, 1, tree);
    defaultExpandedKeys.value.splice(0, Infinity, id);
  }
});

const initPersonalDB = async () => {
  // @ts-ignore
  db.personal.bulkAdd(dataB);
};

const handleAddLeaf = () => {
  // @ts-ignore
  db.personal.bulkAdd(dataA);
};
</script>
