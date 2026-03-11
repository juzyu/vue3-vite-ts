<template>
  <div class="container">
    <div id="cesiumContainer" class="viewer" />
    <div class="toolbar">
      <NButton @click="createCylinder">创建圆柱体</NButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { NButton } from 'naive-ui';
import * as Cesium from 'cesium';
import { cesium_token } from '@/token';

const viewer = ref<Cesium.Viewer>();

onMounted(() => {
  Cesium.Ion.defaultAccessToken = cesium_token;
  viewer.value = new Cesium.Viewer('cesiumContainer', {
    sceneMode: Cesium.SceneMode.SCENE3D,
  });
});

const createCylinder = () => {
  if (!viewer.value) return;

  // 创建自定义水波扩散条纹材质
  const stripeMaterial = new Cesium.Material({
    fabric: {
      type: 'WaveStripe',
      uniforms: {
        color: new Cesium.Color(1.0, 1.0, 0.0, 1.0), // 黄色
        time: 0,
        frequency: 10.0, // 条纹频率
        speed: 2.0, // 扩散速度
      },
      source: `
        czm_material czm_getMaterial(czm_materialInput materialInput) {
          czm_material material = czm_getDefaultMaterial(materialInput);
          
          vec2 st = materialInput.st;
          float time = time;
          
          // 使用 st.t (纵向坐标) 创建水平条纹，从下往上扩散
          float wave = fract((st.t * frequency) - time * speed);
          
          // 创建条纹效果：使用 step 函数创建硬边界
          float stripe = step(0.5, wave);
          
          // 黄色和透明交替
          material.diffuse = color.rgb;
          material.alpha = stripe * 0.8; // 黄色条纹有 0.8 透明度，透明条纹完全透明
          
          return material;
        }
      `,
    },
  });

  // 创建静态条纹材质（无动画）
  const staticStripeMaterial = new Cesium.Material({
    fabric: {
      type: 'StaticStripe',
      uniforms: {
        color: new Cesium.Color(1.0, 1.0, 0.0, 1.0), // 黄色
        frequency: 15.0, // 条纹频率
      },
      source: `
        czm_material czm_getMaterial(czm_materialInput materialInput) {
          czm_material material = czm_getDefaultMaterial(materialInput);
          
          vec2 st = materialInput.st;
          
          // 使用 st.t (纵向坐标) 创建水平条纹
          float stripe = step(0.5, fract(st.t * frequency));
          
          // 黄色和透明交替
          material.diffuse = color.rgb;
          material.alpha = stripe * 0.8;
          
          return material;
        }
      `,
    },
  });

  const cylinderPrimitive = new Cesium.Primitive({
    geometryInstances: new Cesium.GeometryInstance({
      geometry: new Cesium.CylinderGeometry({
        length: 100000.0, // 高度
        topRadius: 50000.0, // 顶半径
        bottomRadius: 50000.0, // 底半径
        vertexFormat:
          Cesium.MaterialAppearance.MaterialSupport.TEXTURED.vertexFormat,
      }),
      modelMatrix: Cesium.Matrix4.multiplyByTranslation(
        Cesium.Transforms.eastNorthUpToFixedFrame(
          Cesium.Cartesian3.fromDegrees(116.4, 39.9)
        ),
        new Cesium.Cartesian3(0.0, 0.0, 50000.0), // 调整中心位置
        new Cesium.Matrix4()
      ),
    }),
    appearance: new Cesium.MaterialAppearance({
      material: stripeMaterial,
      translucent: true,
    }),
  });

  viewer.value.scene.primitives.add(cylinderPrimitive);

  // 动画更新时间参数，实现水波扩散效果
  viewer.value.scene.preRender.addEventListener(() => {
    stripeMaterial.uniforms.time = performance.now() / 1000.0;
  });

  // 设置相机视角
  viewer.value.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(116.4, 39.9, 500000),
    orientation: {
      heading: 0,
      pitch: -0.5,
      roll: 0,
    },
  });
};
</script>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  position: relative;
}

.viewer {
  width: 100%;
  height: 100%;
}

.toolbar {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(42, 42, 42, 0.8);
  padding: 10px;
  border-radius: 5px;
  z-index: 1000;
}
</style>
