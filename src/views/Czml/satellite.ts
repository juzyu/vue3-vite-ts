export const satellite_czml = [
  {
    id: 'document',
    name: 'Satellite Motion',
    version: '1.0',
  },
  {
    id: 'satellite',
    name: 'Satellite',
    availability: '2023-10-01T00:00:00Z/2023-10-01T12:00:00Z',
    position: {
      epoch: '2023-10-01T00:00:00Z',
      cartesian: [
        0, 7000000, 0, 0, 3600, 0, 7000000, 0, 7200, -7000000, 0, 0, 10800, 0,
        -7000000, 0, 14400, 7000000, 0, 0,
      ],
    },
    billboard: {
      image:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADJSURBVDhPnZHRDcMgEEMZjVEYpaNklIzSEfLfD4qNnXAJSFWfhO7w2Zc0Tf9QG2rXrEzSUeZLOGm47WoH95x3Hl3jEgilvDgsOQUTqsNl68ezEwn1vae6lceSEEYvvWNT/Rxc4CXQNGadho1NXoJ+9iaqc2xi2xbt23PJCDIB6TQjOC6Bho/sDy3fBQT8PrVhibU7yBFcEPaRxOoeTwbwByCOYf9VGp1BYI1BA+EeHhmfzKbBoJEQwn1yzUZtyspIQUha85MpkNIXB7GizqDEECsAAAAASUVORK5CYII=',
      scale: 1.5,
    },
    path: {
      material: {
        polylineOutline: {
          color: {
            rgba: [255, 0, 0, 255],
          },
          outlineColor: {
            rgba: [0, 0, 0, 255],
          },
          outlineWidth: 2,
        },
      },
      width: 2,
      resolution: 120,
    },
  },
];
