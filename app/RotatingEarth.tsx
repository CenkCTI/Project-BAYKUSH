"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactElement, ReactPortal } from "react";
import { createPortal } from "react-dom";

type GeoPoint = readonly [longitude: number, latitude: number];
type LandShape = readonly GeoPoint[];
type GeoJsonGeometry = {
  type: "Polygon" | "MultiPolygon";
  coordinates: number[][][] | number[][][][];
};
type GeoJsonCollection = {
  features?: Array<{ geometry?: GeoJsonGeometry | null }>;
};

type TextureSource = {
  pixels: Uint8ClampedArray;
  width: number;
  height: number;
};

type ProjectionLookup = {
  size: number;
  pixelIndexes: Uint32Array;
  longitudeOffsets: Float32Array;
  textureRows: Float32Array;
  diffuse: Float32Array;
  edge: Float32Array;
  imageData: ImageData;
};

const DEG = Math.PI / 180;
const TAU = Math.PI * 2;
const TILT = -9 * DEG;
const TEXTURE_WIDTH = 1440;
const TEXTURE_HEIGHT = 720;
const FRAME_INTERVAL = 1000 / 30;
const NATURAL_EARTH_URL =
  "https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_110m_land.geojson";

/*
 * Immediate offline fallback. Natural Earth replaces these shapes atomically
 * after loading, so the globe never enters a partially rendered state.
 */
const FALLBACK_LAND: readonly LandShape[] = [
  [
    [-168, 72], [-155, 68], [-145, 61], [-137, 57], [-130, 52], [-125, 46],
    [-124, 39], [-117, 32], [-110, 27], [-101, 22], [-92, 19], [-85, 22],
    [-81, 27], [-80, 33], [-76, 39], [-68, 45], [-60, 51], [-63, 58],
    [-75, 63], [-91, 69], [-112, 73], [-138, 76], [-158, 75],
  ],
  [
    [-82, 12], [-76, 9], [-72, 4], [-69, -3], [-66, -10], [-62, -18],
    [-58, -25], [-54, -32], [-57, -39], [-64, -48], [-69, -54], [-73, -51],
    [-76, -42], [-78, -31], [-79, -19], [-81, -7],
  ],
  [
    [-12, 36], [-6, 43], [2, 48], [10, 53], [20, 58], [32, 61], [46, 64],
    [61, 68], [78, 71], [97, 72], [116, 67], [135, 61], [151, 54], [168, 47],
    [171, 41], [158, 36], [145, 32], [132, 27], [122, 22], [111, 20], [103, 13],
    [95, 9], [87, 7], [80, 8], [75, 15], [69, 21], [61, 25], [52, 30],
    [43, 34], [35, 36], [28, 39], [20, 41], [12, 43], [4, 42], [-4, 40],
  ],
  [
    [-17, 35], [-8, 37], [2, 37], [12, 35], [23, 31], [31, 25], [37, 17],
    [42, 10], [43, 2], [40, -7], [36, -16], [31, -24], [24, -31], [15, -35],
    [7, -34], [-1, -29], [-7, -22], [-11, -13], [-14, -3], [-16, 9], [-17, 23],
  ],
  [[112, -11], [121, -12], [132, -14], [141, -18], [148, -24], [153, -32], [148, -39], [139, -43], [129, -41], [120, -35], [114, -26]],
  [[-59, 82], [-45, 83], [-31, 79], [-22, 73], [-20, 65], [-28, 60], [-40, 58], [-52, 62], [-62, 70]],
  [[-10, 50], [-7, 55], [-4, 59], [0, 57], [2, 53], [-2, 50]],
  [[47, -13], [50, -16], [51, -21], [49, -26], [46, -23]],
  [[129, 31], [134, 33], [139, 36], [143, 41], [145, 44], [141, 46], [136, 42], [132, 37]],
  [[95, 5], [102, 3], [109, 1], [116, 0], [123, -5], [119, -9], [111, -7], [104, -5], [98, -1]],
  [[-180, -69], [-150, -72], [-120, -75], [-90, -73], [-60, -76], [-30, -73], [0, -75], [30, -72], [60, -70], [90, -72], [120, -75], [150, -72], [180, -69]],
];

const CITY_LIGHTS: readonly GeoPoint[] = [
  [-74, 40.7], [-118.2, 34.1], [-87.6, 41.9], [-99.1, 19.4], [-46.6, -23.5],
  [-58.4, -34.6], [-0.1, 51.5], [2.35, 48.86], [4.9, 52.37], [13.4, 52.5],
  [12.5, 41.9], [29, 41], [31.2, 30], [37.6, 55.8], [28.05, -26.2],
  [77.2, 28.6], [72.9, 19.1], [77.6, 12.97], [88.36, 22.57], [90.4, 23.8],
  [116.4, 39.9], [121.5, 31.2], [113.3, 23.1], [139.7, 35.7], [135.5, 34.7],
  [126.98, 37.56], [103.8, 1.35], [106.8, -6.2], [100.5, 13.75], [151.2, -33.9],
];

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.max(minimum, Math.min(maximum, value));
}

function parseLand(data: GeoJsonCollection): LandShape[] {
  const shapes: LandShape[] = [];

  for (const feature of data.features ?? []) {
    const geometry = feature.geometry;
    if (!geometry) continue;

    if (geometry.type === "Polygon") {
      const exterior = (geometry.coordinates as number[][][])[0];
      if (exterior?.length >= 3) {
        shapes.push(exterior.map((point) => [point[0], point[1]] as const));
      }
      continue;
    }

    for (const polygon of geometry.coordinates as number[][][][]) {
      const exterior = polygon[0];
      if (exterior?.length >= 3) {
        shapes.push(exterior.map((point) => [point[0], point[1]] as const));
      }
    }
  }

  return shapes.length > 20 ? shapes : [...FALLBACK_LAND];
}

function unwrapShape(shape: LandShape): GeoPoint[] {
  if (shape.length === 0) return [];

  const unwrapped: GeoPoint[] = [[shape[0][0], shape[0][1]]];
  let previousLongitude = shape[0][0];

  for (let index = 1; index < shape.length; index += 1) {
    let longitude = shape[index][0];

    while (longitude - previousLongitude > 180) longitude -= 360;
    while (longitude - previousLongitude < -180) longitude += 360;

    unwrapped.push([longitude, shape[index][1]]);
    previousLongitude = longitude;
  }

  return unwrapped;
}

function traceEquirectangularShape(
  context: CanvasRenderingContext2D,
  shape: LandShape,
  width: number,
  height: number,
  longitudeShift: number,
): void {
  const points = unwrapShape(shape);
  if (points.length < 3) return;

  context.beginPath();

  for (let index = 0; index < points.length; index += 1) {
    const longitude = points[index][0] + longitudeShift;
    const latitude = clamp(points[index][1], -90, 90);
    const x = ((longitude + 180) / 360) * width;
    const y = ((90 - latitude) / 180) * height;

    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  }

  context.closePath();
}

function terrainNoise(longitude: number, latitude: number): number {
  const waveA = Math.sin(longitude * 0.11 + latitude * 0.19);
  const waveB = Math.sin(longitude * 0.31 - latitude * 0.13) * 0.5;
  const waveC = Math.cos((longitude + latitude) * 0.57) * 0.25;
  return clamp((waveA + waveB + waveC + 1.75) / 3.5, 0, 1);
}

function buildEarthTexture(shapes: readonly LandShape[]): TextureSource {
  const mask = document.createElement("canvas");
  mask.width = TEXTURE_WIDTH;
  mask.height = TEXTURE_HEIGHT;
  const maskContext = mask.getContext("2d", { willReadFrequently: true });

  const surface = document.createElement("canvas");
  surface.width = TEXTURE_WIDTH;
  surface.height = TEXTURE_HEIGHT;
  const surfaceContext = surface.getContext("2d", { willReadFrequently: true });

  if (!maskContext || !surfaceContext) {
    throw new Error("Earth texture canvas is unavailable.");
  }

  maskContext.fillStyle = "#ffffff";
  for (const shape of shapes) {
    for (let shift = -720; shift <= 720; shift += 360) {
      traceEquirectangularShape(maskContext, shape, TEXTURE_WIDTH, TEXTURE_HEIGHT, shift);
      maskContext.fill();
    }
  }

  const maskPixels = maskContext.getImageData(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT).data;
  const textureImage = surfaceContext.createImageData(TEXTURE_WIDTH, TEXTURE_HEIGHT);
  const output = textureImage.data;

  for (let y = 0; y < TEXTURE_HEIGHT; y += 1) {
    const latitude = 90 - (y / (TEXTURE_HEIGHT - 1)) * 180;
    const polar = Math.pow(Math.abs(latitude) / 90, 2.5);

    for (let x = 0; x < TEXTURE_WIDTH; x += 1) {
      const pixelIndex = (y * TEXTURE_WIDTH + x) * 4;
      const longitude = (x / (TEXTURE_WIDTH - 1)) * 360 - 180;
      const landAmount = maskPixels[pixelIndex + 3] / 255;
      const noise = terrainNoise(longitude, latitude);
      const scan = 0.5 + 0.5 * Math.sin((x + y * 0.31) * 0.075);

      const oceanRed = 3 + noise * 4;
      const oceanGreen = 8 + noise * 7;
      const oceanBlue = 10 + noise * 8;

      const aridBand = clamp(1 - Math.abs(Math.abs(latitude) - 24) / 22, 0, 1);
      const landRed = 44 + noise * 29 + aridBand * 18 + scan * 3 + polar * 24;
      const landGreen = 42 + noise * 20 + aridBand * 6 + scan * 2 + polar * 18;
      const landBlue = 29 + noise * 12 + polar * 10;

      output[pixelIndex] = oceanRed * (1 - landAmount) + landRed * landAmount;
      output[pixelIndex + 1] = oceanGreen * (1 - landAmount) + landGreen * landAmount;
      output[pixelIndex + 2] = oceanBlue * (1 - landAmount) + landBlue * landAmount;
      output[pixelIndex + 3] = 255;
    }
  }

  surfaceContext.putImageData(textureImage, 0, 0);

  surfaceContext.strokeStyle = "rgba(232, 168, 67, 0.78)";
  surfaceContext.lineWidth = 1.15;
  surfaceContext.lineJoin = "round";
  surfaceContext.lineCap = "round";

  for (const shape of shapes) {
    for (let shift = -720; shift <= 720; shift += 360) {
      traceEquirectangularShape(surfaceContext, shape, TEXTURE_WIDTH, TEXTURE_HEIGHT, shift);
      surfaceContext.stroke();
    }
  }

  const data = surfaceContext.getImageData(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);
  return { pixels: data.data, width: TEXTURE_WIDTH, height: TEXTURE_HEIGHT };
}

function buildProjectionLookup(
  context: CanvasRenderingContext2D,
  size: number,
  textureHeight: number,
): ProjectionLookup {
  const center = size / 2;
  const radius = size * 0.455;
  const sinTilt = Math.sin(TILT);
  const cosTilt = Math.cos(TILT);

  const pixelIndexes: number[] = [];
  const longitudeOffsets: number[] = [];
  const textureRows: number[] = [];
  const diffuse: number[] = [];
  const edge: number[] = [];

  const minimum = Math.max(0, Math.floor(center - radius));
  const maximum = Math.min(size - 1, Math.ceil(center + radius));

  const lightX = -0.48;
  const lightY = -0.36;
  const lightZ = 0.8;
  const lightLength = Math.hypot(lightX, lightY, lightZ);

  for (let y = minimum; y <= maximum; y += 1) {
    const screenY = (y + 0.5 - center) / radius;
    const cameraY = -screenY;

    for (let x = minimum; x <= maximum; x += 1) {
      const cameraX = (x + 0.5 - center) / radius;
      const distanceSquared = cameraX * cameraX + cameraY * cameraY;
      if (distanceSquared > 1) continue;

      const cameraZ = Math.sqrt(1 - distanceSquared);
      const worldY = cosTilt * cameraY + sinTilt * cameraZ;
      const worldZ = -sinTilt * cameraY + cosTilt * cameraZ;
      const latitude = Math.asin(clamp(worldY, -1, 1));
      const longitudeOffset = Math.atan2(cameraX, worldZ);
      const textureRow = (0.5 - latitude / Math.PI) * (textureHeight - 1);
      const illumination = Math.max(
        0,
        (cameraX * lightX + cameraY * lightY + cameraZ * lightZ) / lightLength,
      );

      pixelIndexes.push((y * size + x) * 4);
      longitudeOffsets.push(longitudeOffset);
      textureRows.push(textureRow);
      diffuse.push(illumination);
      edge.push(cameraZ);
    }
  }

  return {
    size,
    pixelIndexes: Uint32Array.from(pixelIndexes),
    longitudeOffsets: Float32Array.from(longitudeOffsets),
    textureRows: Float32Array.from(textureRows),
    diffuse: Float32Array.from(diffuse),
    edge: Float32Array.from(edge),
    imageData: context.createImageData(size, size),
  };
}

function renderTexturedSphere(
  context: CanvasRenderingContext2D,
  lookup: ProjectionLookup,
  texture: TextureSource,
  rotation: number,
): void {
  const output = lookup.imageData.data;
  output.fill(0);

  const normalizedRotation = ((rotation % TAU) + TAU) % TAU;
  const textureWidth = texture.width;
  const textureHeight = texture.height;
  const source = texture.pixels;

  for (let index = 0; index < lookup.pixelIndexes.length; index += 1) {
    const longitude = lookup.longitudeOffsets[index] + normalizedRotation;
    const wrapped = ((longitude / TAU + 0.5) % 1 + 1) % 1;

    const sourceX = wrapped * textureWidth;
    const xBase = Math.floor(sourceX);
    const x0 = ((xBase % textureWidth) + textureWidth) % textureWidth;
    const x1 = (x0 + 1) % textureWidth;
    const horizontalMix = sourceX - xBase;

    const sourceY = clamp(lookup.textureRows[index], 0, textureHeight - 1);
    const y0 = Math.floor(sourceY);
    const y1 = Math.min(y0 + 1, textureHeight - 1);
    const verticalMix = sourceY - y0;

    const i00 = (y0 * textureWidth + x0) * 4;
    const i10 = (y0 * textureWidth + x1) * 4;
    const i01 = (y1 * textureWidth + x0) * 4;
    const i11 = (y1 * textureWidth + x1) * 4;

    const topRed = source[i00] + (source[i10] - source[i00]) * horizontalMix;
    const topGreen = source[i00 + 1] + (source[i10 + 1] - source[i00 + 1]) * horizontalMix;
    const topBlue = source[i00 + 2] + (source[i10 + 2] - source[i00 + 2]) * horizontalMix;

    const bottomRed = source[i01] + (source[i11] - source[i01]) * horizontalMix;
    const bottomGreen = source[i01 + 1] + (source[i11 + 1] - source[i01 + 1]) * horizontalMix;
    const bottomBlue = source[i01 + 2] + (source[i11 + 2] - source[i01 + 2]) * horizontalMix;

    const sourceRed = topRed + (bottomRed - topRed) * verticalMix;
    const sourceGreen = topGreen + (bottomGreen - topGreen) * verticalMix;
    const sourceBlue = topBlue + (bottomBlue - topBlue) * verticalMix;

    const lighting =
      (0.34 + lookup.diffuse[index] * 0.84) *
      (0.56 + Math.pow(lookup.edge[index], 0.42) * 0.44);
    const atmosphericGold = Math.pow(1 - lookup.edge[index], 2.6) * 18;
    const outputIndex = lookup.pixelIndexes[index];

    output[outputIndex] = clamp(sourceRed * lighting + atmosphericGold, 0, 255);
    output[outputIndex + 1] = clamp(sourceGreen * lighting + atmosphericGold * 0.48, 0, 255);
    output[outputIndex + 2] = clamp(sourceBlue * lighting + atmosphericGold * 0.12, 0, 255);
    output[outputIndex + 3] = 255;
  }

  context.putImageData(lookup.imageData, 0, 0);
}

function cameraPoint(
  point: GeoPoint,
  rotation: number,
): { x: number; y: number; z: number } {
  const longitude = point[0] * DEG - rotation;
  const latitude = point[1] * DEG;
  const sinLatitude = Math.sin(latitude);
  const cosLatitude = Math.cos(latitude);
  const sinTilt = Math.sin(TILT);
  const cosTilt = Math.cos(TILT);
  const cosLongitude = Math.cos(longitude);

  return {
    x: cosLatitude * Math.sin(longitude),
    y: cosTilt * sinLatitude - sinTilt * cosLatitude * cosLongitude,
    z: sinTilt * sinLatitude + cosTilt * cosLatitude * cosLongitude,
  };
}

function drawCoordinateCurve(
  context: CanvasRenderingContext2D,
  points: readonly GeoPoint[],
  rotation: number,
  center: number,
  radius: number,
): void {
  let drawing = false;
  context.beginPath();

  for (const geoPoint of points) {
    const point = cameraPoint(geoPoint, rotation);
    if (point.z <= 0) {
      drawing = false;
      continue;
    }

    const x = center + radius * point.x;
    const y = center - radius * point.y;

    if (!drawing) {
      context.moveTo(x, y);
      drawing = true;
    } else {
      context.lineTo(x, y);
    }
  }

  context.stroke();
}

function drawHudOverlay(
  context: CanvasRenderingContext2D,
  size: number,
  rotation: number,
): void {
  const center = size / 2;
  const radius = size * 0.455;

  context.save();
  context.beginPath();
  context.arc(center, center, radius, 0, TAU);
  context.clip();

  context.strokeStyle = "rgba(207, 148, 53, 0.115)";
  context.lineWidth = Math.max(0.45, size / 920);

  for (let latitude = -60; latitude <= 60; latitude += 20) {
    const curve: GeoPoint[] = [];
    for (let longitude = -180; longitude <= 180; longitude += 2) {
      curve.push([longitude, latitude]);
    }
    drawCoordinateCurve(context, curve, rotation, center, radius);
  }

  for (let longitude = -180; longitude < 180; longitude += 20) {
    const curve: GeoPoint[] = [];
    for (let latitude = -88; latitude <= 88; latitude += 2) {
      curve.push([longitude, latitude]);
    }
    drawCoordinateCurve(context, curve, rotation, center, radius);
  }

  for (const city of CITY_LIGHTS) {
    const point = cameraPoint(city, rotation);
    if (point.z < 0.12) continue;

    const x = center + radius * point.x;
    const y = center - radius * point.y;
    const alpha = Math.min(0.86, 0.2 + point.z * 0.62);

    context.fillStyle = `rgba(249, 177, 59, ${alpha})`;
    context.shadowColor = "rgba(245, 166, 48, 0.72)";
    context.shadowBlur = size / 76;
    context.beginPath();
    context.arc(x, y, Math.max(0.6, size / 500), 0, TAU);
    context.fill();
  }

  context.shadowBlur = 0;

  const sunlight = context.createRadialGradient(
    center - radius * 0.35,
    center - radius * 0.42,
    radius * 0.02,
    center - radius * 0.12,
    center - radius * 0.12,
    radius * 0.88,
  );
  sunlight.addColorStop(0, "rgba(255, 225, 164, 0.16)");
  sunlight.addColorStop(0.34, "rgba(244, 178, 75, 0.05)");
  sunlight.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = sunlight;
  context.fillRect(center - radius, center - radius, radius * 2, radius * 2);

  const shade = context.createLinearGradient(center - radius, center, center + radius, center);
  shade.addColorStop(0, "rgba(255, 211, 132, 0.025)");
  shade.addColorStop(0.48, "rgba(0, 0, 0, 0)");
  shade.addColorStop(0.75, "rgba(0, 0, 0, 0.18)");
  shade.addColorStop(1, "rgba(0, 0, 0, 0.7)");
  context.fillStyle = shade;
  context.fillRect(center - radius, center - radius, radius * 2, radius * 2);

  const vignette = context.createRadialGradient(center, center, radius * 0.58, center, center, radius);
  vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
  vignette.addColorStop(0.84, "rgba(0, 0, 0, 0.06)");
  vignette.addColorStop(1, "rgba(0, 0, 0, 0.48)");
  context.fillStyle = vignette;
  context.fillRect(center - radius, center - radius, radius * 2, radius * 2);

  context.restore();

  const atmosphere = context.createRadialGradient(
    center - radius * 0.25,
    center - radius * 0.32,
    radius * 0.08,
    center,
    center,
    radius * 1.08,
  );
  atmosphere.addColorStop(0, "rgba(232, 178, 91, 0.12)");
  atmosphere.addColorStop(0.82, "rgba(211, 137, 31, 0.035)");
  atmosphere.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = atmosphere;
  context.beginPath();
  context.arc(center, center, radius * 1.08, 0, TAU);
  context.fill();

  context.strokeStyle = "rgba(240, 189, 100, 0.74)";
  context.lineWidth = Math.max(1, size / 330);
  context.shadowColor = "rgba(213, 142, 34, 0.3)";
  context.shadowBlur = size / 72;
  context.beginPath();
  context.arc(center, center, radius, 0, TAU);
  context.stroke();
  context.shadowBlur = 0;
}

function drawEarth(
  context: CanvasRenderingContext2D,
  lookup: ProjectionLookup,
  texture: TextureSource,
  rotation: number,
): void {
  context.clearRect(0, 0, lookup.size, lookup.size);
  renderTexturedSphere(context, lookup, texture, rotation);
  drawHudOverlay(context, lookup.size, rotation);
}

function EarthCanvas(): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d", {
      alpha: true,
      willReadFrequently: true,
    });
    if (!context) return undefined;

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    let frame = 0;
    let rotation = 22 * DEG;
    let previousTime = performance.now();
    let lastPaint = 0;
    let texture = buildEarthTexture(FALLBACK_LAND);
    let lookup: ProjectionLookup | null = null;
    let disposed = false;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const controller = new AbortController();

    const resize = (): void => {
      const bounds = canvas.getBoundingClientRect();
      const cssSize = Math.max(1, Math.min(bounds.width, bounds.height));
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.6);
      const renderSize = Math.max(280, Math.round(cssSize * pixelRatio));

      if (canvas.width === renderSize && canvas.height === renderSize && lookup) return;

      canvas.width = renderSize;
      canvas.height = renderSize;
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      lookup = buildProjectionLookup(context, renderSize, texture.height);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    fetch(NATURAL_EARTH_URL, { signal: controller.signal, cache: "force-cache" })
      .then((response) => {
        if (!response.ok) throw new Error(`Natural Earth request failed: ${response.status}`);
        return response.json() as Promise<GeoJsonCollection>;
      })
      .then((data) => {
        if (disposed) return;
        const detailedTexture = buildEarthTexture(parseLand(data));
        if (!disposed) texture = detailedTexture;
      })
      .catch(() => {
        /* The bundled fallback texture remains active on network failure. */
      });

    const render = (time: number): void => {
      const elapsed = Math.min(50, time - previousTime);
      previousTime = time;
      if (!reduceMotion) rotation += elapsed * 0.00007;

      if (lookup && (reduceMotion || time - lastPaint >= FRAME_INTERVAL)) {
        drawEarth(context, lookup, texture, rotation);
        lastPaint = time;
      }

      if (!reduceMotion) frame = window.requestAnimationFrame(render);
    };

    frame = window.requestAnimationFrame(render);

    return () => {
      disposed = true;
      controller.abort();
      resizeObserver.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} className="real-earth-canvas" aria-hidden="true" />;
}

export default function RotatingEarth(): ReactPortal | null {
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setTarget(document.querySelector<HTMLElement>(".globe-shell"));
  }, []);

  return target ? createPortal(<EarthCanvas />, target) : null;
}
