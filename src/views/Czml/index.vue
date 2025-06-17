<template>
  <div class="container">
    <div id="cesiumContainer-czml" class="viewer" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import * as Cesium from 'cesium';
import { Viewer, CzmlDataSource } from 'cesium';
import { satellite_czml } from './satellite';
import { cesium_token } from 'token';

onMounted(async () => {
  Cesium.Ion.defaultAccessToken = cesium_token;
  const viewer = new Viewer('cesiumContainer-czml', {
    // sceneMode: SceneMode.SCENE2D,
  });

  viewer.dataSources.add(CzmlDataSource.load(satellite_czml));
});
</script>

<style scoped lang="scss">
.container {
  height: 100vh;
  width: 100vw;
}

.viewer {
  height: 100%;
  width: 100%;
}
</style>
