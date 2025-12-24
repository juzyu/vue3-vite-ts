<template>
  <!-- 八面体 -->
  <div class="container">
    <div id="cesiumContainer" class="viewer" />

    <div class="toolbar">
      <NButton @click="createOctahedronNew()">创建8面体</NButton>
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
      color: new GeometryAttribute({
        componentDatatype: ComponentDatatype.DOUBLE,
        componentsPerAttribute: 3,
        values: geometry.vertices,
      }),
    },
    indices: geometry.indices,
    primitiveType: PrimitiveType.TRIANGLES,
    boundingSphere: BoundingSphere.fromVertices(geometry.vertices as unknown as number[]),
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
      flat: false,
      translucent: true,
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

const octahedronPrimitive = ref<Primitive>();
const octahedronEdgePrimitive = ref<Primitive>();

const createOctahedronNew = () => {
  if (!ViewerRef.value) return;

  // 如果已存在，先移除
  if (octahedronPrimitive.value) {
    ViewerRef.value.scene.primitives.remove(octahedronPrimitive.value);
    octahedronPrimitive.value = undefined;
  }

  // 如果已存在，先移除
  if (octahedronEdgePrimitive.value) {
    ViewerRef.value.scene.primitives.remove(octahedronEdgePrimitive.value);
    octahedronEdgePrimitive.value = undefined;
  }

  const data = createOctahedronGeometry();

  // 创建模型矩阵
  const modelMatrix = Matrix4.multiplyByUniformScale(
    Transforms.eastNorthUpToFixedFrame(
      Cartesian3.fromDegrees(116.3974, 39.9093, 1000)
    ),
    // 缩放到100公里大小
    100000,
    new Matrix4()
  );

  // 创建几何体实例数组，每个面一个实例
  const instances = [];

  for (let faceIndex = 0; faceIndex < 8; faceIndex++) {
    // 获取当前面的三个顶点索引
    const i1 = data.indices[faceIndex * 3];
    const i2 = data.indices[faceIndex * 3 + 1];
    const i3 = data.indices[faceIndex * 3 + 2];

    // 获取三个顶点的坐标
    const v1 = new Cartesian3(
      data.vertices[i1 * 3],
      data.vertices[i1 * 3 + 1],
      data.vertices[i1 * 3 + 2]
    );
    const v2 = new Cartesian3(
      data.vertices[i2 * 3],
      data.vertices[i2 * 3 + 1],
      data.vertices[i2 * 3 + 2]
    );
    const v3 = new Cartesian3(
      data.vertices[i3 * 3],
      data.vertices[i3 * 3 + 1],
      data.vertices[i3 * 3 + 2]
    );

    // 创建三角形几何体
    const triangleGeometry = new Geometry({
      attributes: {
        position: new GeometryAttribute({
          componentDatatype: ComponentDatatype.DOUBLE,
          componentsPerAttribute: 3,
          values: new Float64Array([
            v1.x,
            v1.y,
            v1.z,
            v2.x,
            v2.y,
            v2.z,
            v3.x,
            v3.y,
            v3.z,
          ]),
        }),
        normal: undefined,
        st: undefined,
        bitangent: undefined,
        tangent: undefined,
        color: undefined,
      },
      indices: new Uint16Array([0, 1, 2]),
      primitiveType: PrimitiveType.TRIANGLES,
      boundingSphere: BoundingSphere.fromPoints([v1, v2, v3]),
    });

    // 计算法向量
    const geometryWithNormals =
      GeometryPipeline.computeNormal(triangleGeometry);

    // 创建几何体实例
    const instance = new GeometryInstance({
      geometry: geometryWithNormals,
      modelMatrix,
      attributes: {
        color: ColorGeometryInstanceAttribute.fromColor(
          data.faceColors[faceIndex]
        ),
      },
      id: `octahedron_face_${faceIndex}`,
    });

    instances.push(instance);
  }

  // 创建面primitive
  octahedronPrimitive.value = new Primitive({
    geometryInstances: instances,
    appearance: new PerInstanceColorAppearance({
      translucent: true,
      closed: false,
      flat: false, // 启用光照效果
    }),
    asynchronous: false, // 同步创建，避免worker问题
  });

  // 创建边线primitive
  octahedronEdgePrimitive.value = createOctahedronEdges(data, modelMatrix);

  // 添加到场景
  ViewerRef.value.scene.primitives.add(octahedronPrimitive.value);
  ViewerRef.value.scene.primitives.add(octahedronEdgePrimitive.value);

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

// 创建8面体的边线
const createOctahedronEdges = (
  data: {
    vertices: Float32Array<ArrayBuffer>;
    indices: Uint16Array<ArrayBuffer>;
    faceColors: Color[];
    edges: Uint16Array<ArrayBuffer>;
  },
  modelMatrix: Matrix4
) => {
  // 创建边线的顶点数组
  const edgePositions = [];

  for (let i = 0; i < data.edges.length; i += 2) {
    const v1Index = data.edges[i];
    const v2Index = data.edges[i + 1];

    // 获取两个顶点的坐标
    const v1 = new Cartesian3(
      data.vertices[v1Index * 3],
      data.vertices[v1Index * 3 + 1],
      data.vertices[v1Index * 3 + 2]
    );

    const v2 = new Cartesian3(
      data.vertices[v2Index * 3],
      data.vertices[v2Index * 3 + 1],
      data.vertices[v2Index * 3 + 2]
    );

    edgePositions.push(v1.x, v1.y, v1.z);
    edgePositions.push(v2.x, v2.y, v2.z);
  }

  // 创建线条几何体
  const edgeGeometry = new Geometry({
    attributes: {
      position: new GeometryAttribute({
        componentDatatype: ComponentDatatype.DOUBLE,
        componentsPerAttribute: 3,
        values: new Float64Array(edgePositions),
      }),
      normal: undefined,
      st: undefined,
      bitangent: undefined,
      tangent: undefined,
      color: undefined
    },
    indices: new Uint16Array(
      Array.from({ length: edgePositions.length / 3 }, (_, i) => i)
    ),
    primitiveType: PrimitiveType.LINES,
    boundingSphere: BoundingSphere.fromVertices(
      new Float64Array(edgePositions) as unknown as number[]
    ),
  });

  // 创建边线实例
  const edgeInstance = new GeometryInstance({
    geometry: edgeGeometry,
    modelMatrix: modelMatrix,
    attributes: {
      color: ColorGeometryInstanceAttribute.fromColor(
        Color.WHITE
      ),
    },
    id: 'octahedron_edges',
  });

  // 创建边线primitive
  const edgePrimitive = new Primitive({
    geometryInstances: edgeInstance,
    appearance: new PerInstanceColorAppearance({
      translucent: false,
      closed: false,
      flat: true,
    }),
    asynchronous: false,
  });

  return edgePrimitive;
}

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

  // 为每个面分配不同的颜色
  const faceColors = [
    Color.RED.withAlpha(0.6),      // 面0: 半透明红色
    Color.GREEN.withAlpha(0.6),    // 面1: 半透明绿色
    Color.BLUE.withAlpha(0.6),     // 面2: 半透明蓝色
    Color.YELLOW.withAlpha(0.6),   // 面3: 半透明黄色
    Color.MAGENTA.withAlpha(0.6),  // 面4: 半透明洋红色
    Color.CYAN.withAlpha(0.6),     // 面5: 半透明青色
    Color.ORANGE.withAlpha(0.6),   // 面6: 半透明橙色
    Color.PURPLE.withAlpha(0.6)    // 面7: 半透明紫色
  ];

  // 8面体的12条边（每条边连接两个顶点）
  const edges = new Uint16Array([
    // 上顶点到中间4个顶点的边
    0, 1,  // 边0: 顶-右
    0, 2,  // 边1: 顶-前
    0, 3,  // 边2: 顶-左
    0, 4,  // 边3: 顶-后
    
    // 中间4个顶点之间的边（形成正方形）
    1, 2,  // 边4: 右-前
    2, 3,  // 边5: 前-左
    3, 4,  // 边6: 左-后
    4, 1,  // 边7: 后-右
    
    // 下顶点到中间4个顶点的边
    5, 1,  // 边8: 底-右
    5, 2,  // 边9: 底-前
    5, 3,  // 边10: 底-左
    5, 4   // 边11: 底-后
  ]);

  return {
    vertices: new Float32Array(vertices),
    indices: new Uint16Array(indices),
    faceColors,
    edges,
  };
}

const changeColor = () => {
  const colors = [
    Color.CYAN,
    Color.RED,
    Color.GREEN,
    Color.BLUE,
    Color.YELLOW,
    Color.MAGENTA,
    Color.ORANGE,
    Color.PURPLE,
  ];

  // 随机选择一个颜色
  currentColor.value = colors[Math.floor(Math.random() * colors.length)];

  // 重新创建8面体以应用新颜色
  createOctahedron();

  console.log('颜色已改变');
};
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
