<template>
  <div class="box">
    <n-button @click="handleAddLeaf">添加节点</n-button>
    <n-input v-model:value="keyWord" placeholder="输入姓名" />
    <n-tree
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
import { ref, reactive, watchEffect } from 'vue';
import { useTreePersonal } from '@/database/utils';
import { TreeItem } from '@/database/Personal';
import { db } from '@/database/index';

const data = ref([]);
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
      gender: '空',
      parentId: '',
      children,
    });
    console.log('tree', tree);
    data.value.splice(0, 1, tree);
    defaultExpandedKeys.value.splice(0, Infinity, id);
  }
});

const handleAddLeaf = () => {
  db.personal.bulkAdd([
    {
      key: 4,
      label: 's',
      age: 15,
      gender: '男',
      parentId: 999,
      children: [],
    },
  ]);
};
</script>
