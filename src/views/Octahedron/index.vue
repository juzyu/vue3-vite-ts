<template>
  <!-- 八面体 -->
  <div class="container">
    <div id="cesiumContainer" class="viewer" />

    <div class="toolbar">
      <NButton @click="createOctahedron()">创建8面体</NButton>
      <!-- <NButton @click="animateOctahedron()">旋转动画</NButton> -->
      <NButton @click="changeColor()">改变颜色</NButton>
      <!-- <NButton @click="resetView()">重置视角</NButton> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { NButton } from 'naive-ui';
import * as Cesium from 'cesium';
import {
  Viewer,
  SceneMode,
  GeometryInstance,
  Cartesian3,
  Primitive,
  Color,
  Entity,
  Geometry,
  GeometryAttribute,
  ComponentDatatype,
  BoundingSphere,
  PrimitiveType,
  GeometryPipeline,
  Matrix4,
  Transforms,
  ColorGeometryInstanceAttribute,
  PerInstanceColorAppearance,
  HeadingPitchRoll,
} from 'cesium';
import { cesium_token } from '@/token';

const ViewerRef = ref<Viewer>();

onMounted(async () => {
  Cesium.Ion.defaultAccessToken = cesium_token;
  const viewer = new Viewer('cesiumContainer', {
    sceneMode: SceneMode.SCENE3D,
  });

  ViewerRef.value = viewer;
});

const octahedronEntity = ref<Entity>();

const currentColor = ref(Color.CYAN);

const createOctahedron = () => {
  if (!ViewerRef.value) return;

  // 如果已存在，先移除
  if (octahedronEntity.value) {
    ViewerRef.value.entities.remove(octahedronEntity.value);
  }

  const geometry = createOctahedronGeometry();

  // 创建几何体
  const octahedronGeometry = new Geometry({
    attributes: {
      position: new GeometryAttribute({
        componentDatatype: ComponentDatatype.DOUBLE,
        componentsPerAttribute: 3,
        values: geometry.vertices,
      }),
      normal: undefined,
      st: undefined,
      bitangent: undefined,
      tangent: undefined,
      color: undefined
    },
    indices: geometry.indices,
    primitiveType: PrimitiveType.TRIANGLES,
    boundingSphere: BoundingSphere.fromVertices(geometry.vertices),
  });

  // 计算法向量以获得更好的光照效果
  const geometryWithNormals =
    GeometryPipeline.computeNormal(octahedronGeometry);

  // 创建几何体实例
  const instance = new GeometryInstance({
    geometry: geometryWithNormals,
    modelMatrix: Matrix4.multiplyByUniformScale(
      Transforms.eastNorthUpToFixedFrame(
        // 北京上空1000米
        Cartesian3.fromDegrees(116.3974, 39.9093, 1000)
      ),
      // 缩放到100公里大小
      100000,
      new Matrix4()
    ),
    attributes: {
      color: ColorGeometryInstanceAttribute.fromColor(currentColor.value),
    },
  });

  // 创建primitive
  const primitive = new Primitive({
    geometryInstances: instance,
    appearance: new PerInstanceColorAppearance({
      translucent: false,
      closed: true,
    }),
    asynchronous: false,
  });

  // 添加到场景
  ViewerRef.value.scene.primitives.add(primitive);

  // 同时创建一个entity用于动画控制
  octahedronEntity.value = ViewerRef.value.entities.add({
    position: Cartesian3.fromDegrees(116.3974, 39.9093, 1000),
    orientation: Transforms.headingPitchRollQuaternion(
      Cartesian3.fromDegrees(116.3974, 39.9093, 1000),
      new HeadingPitchRoll(0, 0, 0)
    ),
    model: {
      // 这里我们不使用model，而是用primitive，但保留entity用于位置和方向控制
    },
  });

  // 设置相机视角
  ViewerRef.value.camera.setView({
    destination: Cartesian3.fromDegrees(116.3974, 39.9093, 500000),
    orientation: {
      heading: 0.0,
      pitch: -0.5,
      roll: 0.0,
    },
  });
};

const createOctahedronGeometry = () => {
  // 8面体的6个顶点坐标
  const vertices = [
    0.0, 0.0, 1.0,   // 顶点 (上)
    1.0, 0.0, 0.0,   // 右
    0.0, 1.0, 0.0,   // 前
    -1.0, 0.0, 0.0,  // 左
    0.0, -1.0, 0.0,  // 后
    0.0, 0.0, -1.0   // 底点 (下)
  ];

  // 8面体的8个三角形面的索引
  const indices = [
    // 上半部分的4个三角形
    0, 1, 2,  // 顶-右-前
    0, 2, 3,  // 顶-前-左
    0, 3, 4,  // 顶-左-后
    0, 4, 1,  // 顶-后-右
    
    // 下半部分的4个三角形
    5, 2, 1,  // 底-前-右
    5, 3, 2,  // 底-左-前
    5, 4, 3,  // 底-后-左
    5, 1, 4   // 底-右-后
  ];

  return {
    vertices: new Float32Array(vertices),
    indices: new Uint16Array(indices)
  };
}

const changeColor = () => {
  const colors = [
    Cesium.Color.CYAN,
    Cesium.Color.RED,
    Cesium.Color.GREEN,
    Cesium.Color.BLUE,
    Cesium.Color.YELLOW,
    Cesium.Color.MAGENTA,
    Cesium.Color.ORANGE,
    Cesium.Color.PURPLE
  ];
  
  // 随机选择一个颜色
  currentColor.value = colors[Math.floor(Math.random() * colors.length)];
  
  // 重新创建8面体以应用新颜色
  createOctahedron();
  
  console.log('颜色已改变');
}
</script>

<style scoped lang="scss">
.container {
  height: 100vh;
  width: 100vw;
  position: relative;
}

.viewer {
  height: 100%;
  width: 100%;
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
