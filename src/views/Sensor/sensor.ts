export const sensor1 = {
  BaseComponent: {
    unit_id: 'sensor1',
    name: 'sensor1',
    category: 103,
  },
  Position: {
    lon: 0,
    lat: 0,
    alt: 0,
  },
  Sensor: {
    /** 最小探测范围 */
    minimum_range: 0.01,
    /** 最大探测范围 */
    maximum_range: 2000,
    /** 最小方位角 */
    azimuth_field_of_view_min: 30,
    /** 最大方位角 */
    azimuth_field_of_view_max: 180,
    /** 最小俯仰角 */
    elevation_field_of_view_min: 0,
    /** 最大俯仰角 */
    elevation_field_of_view_max: 90,
  },
};

export const sensor2 = {
  BaseComponent: {
    unit_id: 'sensor2',
    name: 'sensor2',
    category: 103,
  },
  Position: {
    lon: 0.01,
    lat: 0,
    alt: 0,
  },
  Sensor: {
    /** 最小探测范围 */
    minimum_range: 0.01,
    /** 最大探测范围 */
    maximum_range: 3000,
    /** 最小方位角 */
    azimuth_field_of_view_min: 30,
    /** 最大方位角 */
    azimuth_field_of_view_max: 180,
    /** 最小俯仰角 */
    elevation_field_of_view_min: 0,
    /** 最大俯仰角 */
    elevation_field_of_view_max: 90,
  },
};
