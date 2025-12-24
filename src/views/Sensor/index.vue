<template>
  <div class="container">
    <div id="cesiumContainer-sensor" class="viewer" />

    <div class="action">
      <NButton @click="unionFn" type="primary">融合</NButton>
      <NButton @click="cancelUnionFn" type="primary" class="ml12">
        取消融合
      </NButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { NButton } from 'naive-ui';
import * as Cesium from 'cesium';
import * as turf from '@turf/turf';
import {
  Viewer,
  SceneMode,
  GeometryInstance,
  Cartesian3,
  Primitive,
  Color,
  Material,
  PolygonGeometry,
  PolygonHierarchy,
} from 'cesium';
import { cesium_token } from '@/token';
import { sensor1, sensor2 } from './sensor';

const ViewerRef = ref<Viewer>();

const primitive3 = ref<Primitive>();

const ellipse1 = turf.ellipse([-85.0, 20.0], 1000, 600, {
  // units: 'miles',
  // steps: 12,
  // angle: 90,
});

const ellipse2 = turf.ellipse([-99.0, 21.0], 1800, 1400, {});

onMounted(async () => {
  Cesium.Ion.defaultAccessToken = cesium_token;
  const viewer = new Viewer('cesiumContainer-sensor', {
    sceneMode: SceneMode.SCENE2D,
  });

  ViewerRef.value = viewer;

  const primitive1 = new Primitive({
    geometryInstances: new GeometryInstance({
      geometry: new PolygonGeometry({
        polygonHierarchy: new PolygonHierarchy(
          Cartesian3.fromDegreesArray(ellipse1.geometry.coordinates[0].flat())
        ),
      }),
    }),
    appearance: new Cesium.EllipsoidSurfaceAppearance({
      // material: Cesium.Material.fromType('Stripe'),
      material: new Material({
        fabric: {
          type: Material.ColorType,
          uniforms: {
            color: Color.YELLOW.withAlpha(0.2),
          },
        },
      }),
    }),
  });
  const primitive2 = new Primitive({
    geometryInstances: new GeometryInstance({
      geometry: new PolygonGeometry({
        polygonHierarchy: new Cesium.PolygonHierarchy(
          Cesium.Cartesian3.fromDegreesArray(
            ellipse2.geometry.coordinates[0].flat()
          )
        ),
      }),
    }),
    appearance: new Cesium.EllipsoidSurfaceAppearance({
      // material: Cesium.Material.fromType('Stripe'),

      material: new Material({
        fabric: {
          type: Material.ColorType,
          uniforms: {
            color: Color.GREEN.withAlpha(0.5),
          },
        },
      }),
    }),
  });

  ViewerRef.value.scene.primitives.add(primitive1);
  ViewerRef.value.scene.primitives.add(primitive2);
});

const union = turf.union(
  turf.featureCollection([
    turf.polygon(ellipse1.geometry.coordinates),
    turf.polygon(ellipse2.geometry.coordinates),
  ])
);

const unionFn = () => {
  if (!ViewerRef.value) return;

  if (union) {
    primitive3.value = new Primitive({
      geometryInstances: new GeometryInstance({
        geometry: new PolygonGeometry({
          polygonHierarchy: new Cesium.PolygonHierarchy(
            Cesium.Cartesian3.fromDegreesArray(
              union.geometry.coordinates[0].flat() as unknown as number[]
            )
          ),
        }),
      }),
      appearance: new Cesium.EllipsoidSurfaceAppearance({
        material: new Material({
          fabric: {
            type: Material.ColorType,
            uniforms: {
              color: Color.RED,
            },
          },
        }),
      }),
    });
  }

  ViewerRef.value.scene.primitives.add(primitive3.value);
};

const cancelUnionFn = () => {
  if (!ViewerRef.value) return;

  if (!primitive3.value) return;

  ViewerRef.value.scene.primitives.remove(primitive3.value);
}

// watch(
//   () => ViewerRef.value,
//   (nv) => {
//     if (nv) {
//       console.log('=======', union);
//       const points = union?.geometry.coordinates[0];
//       console.log('=====points', points);
//     }
//   }
// );
</script>

<style scoped lang="scss">
.ml12 {
  margin-left: 12px;
}

.container {
  height: 100vh;
  width: 100vw;
  position: relative;
}

.viewer {
  height: 100%;
  width: 100%;
}

.action {
  position: absolute;
  top: 20px;
  left: 20px;
}
</style>
