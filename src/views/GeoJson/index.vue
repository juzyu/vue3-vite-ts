<template>
  <div class="container">
    <div id="cesiumContainer" class="viewer" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import {
  BoundingSphere,
  Cartographic,
  Color,
  Ellipsoid,
  GeoJsonDataSource,
  JulianDate,
  LabelGraphics,
  LabelStyle,
  Viewer,
  Math as CesMath,
  Cartesian3,
  Entity,
  CustomDataSource,
  SceneMode,
  Ion,
} from 'cesium';
import { CityPosition } from './data';
import { cesium_token } from '@/token';

onMounted(async () => {
  Ion.defaultAccessToken = cesium_token;
  const viewer = new Viewer('cesiumContainer', {
    // sceneMode: SceneMode.SCENE2D,
  });

  const provinceDataSource = await GeoJsonDataSource.load('/province.geojson', {
    fill: Color.YELLOW,
    stroke: Color.RED,
  });

  await viewer.dataSources.add(provinceDataSource);

  // const globaDataSource = await GeoJsonDataSource.load('/globa.geojson', {
  //   stroke: Color.fromCssColorString('#bfd3e4'),
  // });
  // viewer.dataSources.add(globaDataSource);

  const labelDataSource = new CustomDataSource('label-data-source');

  for (const entity of provinceDataSource.entities.values) {
    if (entity.name) {
      const polyPositions = entity.polygon?.hierarchy?.getValue(
        JulianDate.now()
      ).positions;
      const polyCenter = BoundingSphere.fromPoints(polyPositions).center;
      const _polyCenter = Ellipsoid.WGS84.scaleToGeodeticSurface(polyCenter);

      let cartographic = Cartographic.fromCartesian(
        _polyCenter,
        viewer.scene.globe.ellipsoid,
        new Cartographic()
      );

      const lat = CesMath.toDegrees(cartographic.latitude);
      const lon = CesMath.toDegrees(cartographic.longitude);
      const height = cartographic.height;

      const id = `label_${entity.name}`;
      const exist = labelDataSource.entities.getById(id);

      const city = CityPosition?.find((v) => v.name === entity.name);

      !exist &&
        labelDataSource.entities.add(
          new Entity({
            id,
            position: Cartesian3.fromDegrees(
              city?.center[0] || lon,
              city?.center[1] || lat,
              height
            ),
            label: new LabelGraphics({
              text: entity.name,
              show: true,
              font: '14px Helvetica',
              fillColor: Color.SKYBLUE,
              outlineColor: Color.BLACK,
              outlineWidth: 2,
              style: LabelStyle.FILL_AND_OUTLINE,
            }),
          })
        );
    }
  }

  viewer.dataSources.add(labelDataSource);
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
