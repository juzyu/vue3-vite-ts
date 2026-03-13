<template>
  <div class="container">
    <div id="cesiumContainer-sector" class="viewer" />
    <div class="toolbar">
      <div class="input-group">
        <label>朝向角度 (Heading):</label>
        <input
          v-model.number="heading"
          type="number"
          min="0"
          max="360"
          step="1"
          @input="updateSector"
        />
        <span>度</span>
      </div>
      <NButton @click="createSector" type="primary">创建扇形</NButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { NButton } from 'naive-ui';
import * as Cesium from 'cesium';
import { cesium_token } from '@/token';

const viewer = ref<Cesium.Viewer>();
const sectorPrimitive = ref<Cesium.Primitive>();
const heading = ref<number>(0); // 默认朝向北方

// 北京坐标（Cartesian3 类型）
const BEIJING_POSITION = Cesium.Cartesian3.fromDegrees(116.4074, 39.9042);

// 扇形参数
const SECTOR_ANGLE = 120; // 扇形角度
const SECTOR_RADIUS = 200000; // 扇形半径（米）

onMounted(() => {
  Cesium.Ion.defaultAccessToken = cesium_token;
  viewer.value = new Cesium.Viewer('cesiumContainer-sector', {
    sceneMode: Cesium.SceneMode.SCENE2D,
  });

  // 设置相机视角到北京
  const cameraPosition = Cesium.Cartesian3.fromDegrees(
    116.4074,
    39.9042,
    1000000
  );
  viewer.value.camera.flyTo({
    destination: cameraPosition,
  });
});

/**
 * 生成扇形的顶点坐标
 * @param centerPosition 中心点 Cartesian3 坐标
 * @param radius 半径（米）
 * @param angle 扇形角度
 * @param heading 朝向角度（度）
 * @param segments 分段数
 */
const generateSectorPoints = (
  centerPosition: Cesium.Cartesian3,
  radius: number,
  angle: number,
  heading: number,
  segments: number = 50
): Cesium.Cartesian3[] => {
  const points: Cesium.Cartesian3[] = [];

  // 将 Cartesian3 转换为经纬度
  const cartographic = Cesium.Cartographic.fromCartesian(centerPosition);
  const centerLon = Cesium.Math.toDegrees(cartographic.longitude);
  const centerLat = Cesium.Math.toDegrees(cartographic.latitude);

  // 添加中心点
  points.push(centerPosition);

  // 计算起始角度和结束角度
  const startAngle = heading - angle / 2;
  const endAngle = heading + angle / 2;

  // 生成扇形弧线上的点
  for (let i = 0; i <= segments; i++) {
    const currentAngle = startAngle + (endAngle - startAngle) * (i / segments);
    const radians = Cesium.Math.toRadians(currentAngle);

    // 使用简化的球面坐标计算
    // 在小范围内可以近似使用平面坐标
    const deltaLat = (radius * Math.cos(radians)) / 111320; // 1度纬度约111320米
    const deltaLon =
      (radius * Math.sin(radians)) /
      (111320 * Math.cos(Cesium.Math.toRadians(centerLat)));

    const point = Cesium.Cartesian3.fromDegrees(
      centerLon + deltaLon,
      centerLat + deltaLat
    );
    points.push(point);
  }

  return points;
};

const createSector = () => {
  if (!viewer.value) return;

  // 如果已存在扇形，先移除
  if (sectorPrimitive.value) {
    viewer.value.scene.primitives.remove(sectorPrimitive.value);
  }

  // 生成扇形顶点（返回 Cartesian3 数组）
  const points = generateSectorPoints(
    BEIJING_POSITION,
    SECTOR_RADIUS,
    SECTOR_ANGLE,
    heading.value
  );

  // 创建扇形 Primitive
  sectorPrimitive.value = new Cesium.Primitive({
    geometryInstances: new Cesium.GeometryInstance({
      geometry: new Cesium.PolygonGeometry({
        polygonHierarchy: new Cesium.PolygonHierarchy(points),
      }),
    }),
    appearance: new Cesium.EllipsoidSurfaceAppearance({
      material: new Cesium.Material({
        fabric: {
          type: Cesium.Material.ColorType,
          uniforms: {
            color: Cesium.Color.YELLOW.withAlpha(0.6),
          },
        },
      }),
    }),
  });

  viewer.value.scene.primitives.add(sectorPrimitive.value);
};

const updateSector = () => {
  // 当 heading 值改变时，重新创建扇形
  if (sectorPrimitive.value) {
    createSector();
  }
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
  background: rgba(42, 42, 42, 0.9);
  padding: 15px;
  border-radius: 5px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
}

.input-group label {
  font-size: 14px;
}

.input-group input {
  width: 80px;
  padding: 4px 8px;
  border: 1px solid #555;
  border-radius: 3px;
  background: #333;
  color: white;
  font-size: 14px;
}

.input-group span {
  font-size: 14px;
}
</style>
