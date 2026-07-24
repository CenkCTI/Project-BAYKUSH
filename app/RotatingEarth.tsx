"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactElement, ReactPortal } from "react";
import { createPortal } from "react-dom";

type GeoPoint = readonly [longitude: number, latitude: number];
type LandShape = readonly GeoPoint[];
type CameraPoint = { x: number; y: number; z: number };
type GeoJsonGeometry = {
  type: "Polygon" | "MultiPolygon";
  coordinates: number[][][] | number[][][][];
};
type GeoJsonCollection = {
  features?: Array<{ geometry?: GeoJsonGeometry | null }>;
};

const DEG = Math.PI / 180;
const TAU = Math.PI * 2;
const NATURAL_EARTH_URL =
  "https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_110m_land.geojson";

/*
 * Immediate offline fallback. It is deliberately complete enough to make the
 * planet readable even before Natural Earth finishes loading or when the CDN
 * is unavailable. The high-detail Natural Earth coastlines replace these rings
 * as soon as the request succeeds.
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

function parseLand(data: GeoJsonCollection): LandShape[] {
  const shapes: LandShape[] = [];

  for (const feature of data.features ?? []) {
    const geometry = feature.geometry;
    if (!geometry) continue;

    if (geometry.type === "Polygon") {
      const polygon = geometry.coordinates as number[][][];
      const exterior = polygon[0];
      if (exterior?.length >= 3) {
        shapes.push(exterior.map((point) => [point[0], point[1]] as const));
      }
      continue;
    }

    const multipolygon = geometry.coordinates as number[][][][];
    for (const polygon of multipolygon) {
      const exterior = polygon[0];
      if (exterior?.length >= 3) {
        shapes.push(exterior.map((point) => [point[0], point[1]] as const));
      }
    }
  }

  return shapes.length > 20 ? shapes : [...FALLBACK_LAND];
}

function cameraPoint(
  point: GeoPoint,
  rotation: number,
  tilt: number,
): CameraPoint {
  const longitude = point[0] * DEG - rotation;
  const latitude = point[1] * DEG;
  const sinLatitude = Math.sin(latitude);
  const cosLatitude = Math.cos(latitude);
  const sinTilt = Math.sin(tilt);
  const cosTilt = Math.cos(tilt);
  const cosLongitude = Math.cos(longitude);

  return {
    x: cosLatitude * Math.sin(longitude),
    y: cosTilt * sinLatitude - sinTilt * cosLatitude * cosLongitude,
    z: sinTilt * sinLatitude + cosTilt * cosLatitude * cosLongitude,
  };
}

function screenPoint(
  point: CameraPoint,
  center: number,
  radius: number,
): readonly [number, number] {
  return [center + radius * point.x, center - radius * point.y];
}

function horizonIntersection(a: CameraPoint, b: CameraPoint): CameraPoint {
  const denominator = a.z - b.z;
  const amount = Math.abs(denominator) < 1e-8 ? 0.5 : a.z / denominator;
  const x = a.x + (b.x - a.x) * amount;
  const y = a.y + (b.y - a.y) * amount;
  const length = Math.hypot(x, y) || 1;
  return { x: x / length, y: y / length, z: 0 };
}

function visibleSegments(
  shape: LandShape,
  rotation: number,
  tilt: number,
): CameraPoint[][] {
  if (shape.length < 3) return [];

  const projected = shape.map((point) => cameraPoint(point, rotation, tilt));
  const segments: CameraPoint[][] = [];
  let segment: CameraPoint[] = [];

  for (let index = 0; index < projected.length; index += 1) {
    const current = projected[index];
    const next = projected[(index + 1) % projected.length];
    const currentVisible = current.z >= 0;
    const nextVisible = next.z >= 0;

    if (currentVisible && segment.length === 0) segment.push(current);

    if (currentVisible && nextVisible) {
      segment.push(next);
      continue;
    }

    if (currentVisible !== nextVisible) {
      const intersection = horizonIntersection(current, next);
      segment.push(intersection);

      if (currentVisible) {
        if (segment.length >= 3) segments.push(segment);
        segment = [];
      } else {
        segment = [intersection, next];
      }
    }
  }

  if (segment.length >= 3) {
    if (segments.length > 0) {
      const first = segments[0];
      segments[0] = [...segment, ...first];
    } else {
      segments.push(segment);
    }
  }

  return segments;
}

function traceSegment(
  context: CanvasRenderingContext2D,
  segment: readonly CameraPoint[],
  center: number,
  radius: number,
): void {
  if (segment.length < 3) return;
  const first = screenPoint(segment[0], center, radius);
  context.beginPath();
  context.moveTo(first[0], first[1]);

  for (let index = 1; index < segment.length; index += 1) {
    const point = screenPoint(segment[index], center, radius);
    context.lineTo(point[0], point[1]);
  }

  context.closePath();
}

function drawCoordinateCurve(
  context: CanvasRenderingContext2D,
  points: readonly GeoPoint[],
  rotation: number,
  tilt: number,
  center: number,
  radius: number,
): void {
  let drawing = false;
  context.beginPath();

  for (const geoPoint of points) {
    const point = cameraPoint(geoPoint, rotation, tilt);
    if (point.z <= 0) {
      drawing = false;
      continue;
    }

    const [x, y] = screenPoint(point, center, radius);
    if (!drawing) {
      context.moveTo(x, y);
      drawing = true;
    } else {
      context.lineTo(x, y);
    }
  }

  context.stroke();
}

function seededNoise(value: number): number {
  const result = Math.sin(value * 12.9898) * 43758.5453;
  return result - Math.floor(result);
}

function drawEarth(
  context: CanvasRenderingContext2D,
  size: number,
  rotation: number,
  land: readonly LandShape[],
): void {
  const center = size / 2;
  const radius = size * 0.455;
  const tilt = -9 * DEG;

  context.clearRect(0, 0, size, size);
  context.save();

  const atmosphere = context.createRadialGradient(
    center - radius * 0.25,
    center - radius * 0.32,
    radius * 0.08,
    center,
    center,
    radius * 1.08,
  );
  atmosphere.addColorStop(0, "rgba(232, 178, 91, 0.22)");
  atmosphere.addColorStop(0.64, "rgba(27, 22, 13, 0.025)");
  atmosphere.addColorStop(0.91, "rgba(211, 137, 31, 0.11)");
  atmosphere.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = atmosphere;
  context.beginPath();
  context.arc(center, center, radius * 1.08, 0, TAU);
  context.fill();

  context.save();
  context.beginPath();
  context.arc(center, center, radius, 0, TAU);
  context.clip();

  const ocean = context.createRadialGradient(
    center - radius * 0.32,
    center - radius * 0.38,
    radius * 0.04,
    center + radius * 0.25,
    center + radius * 0.11,
    radius * 1.25,
  );
  ocean.addColorStop(0, "#313027");
  ocean.addColorStop(0.22, "#171b19");
  ocean.addColorStop(0.66, "#070b0b");
  ocean.addColorStop(1, "#010202");
  context.fillStyle = ocean;
  context.fillRect(center - radius, center - radius, radius * 2, radius * 2);

  /* Subtle ocean relief keeps the sphere from reading as a flat black disc. */
  context.globalAlpha = 0.08;
  for (let index = 0; index < 190; index += 1) {
    const angle = seededNoise(index + 17) * TAU;
    const distance = Math.sqrt(seededNoise(index + 47)) * radius * 0.92;
    const x = center + Math.cos(angle) * distance;
    const y = center + Math.sin(angle) * distance;
    context.fillStyle = index % 3 === 0 ? "#d79a3c" : "#87918a";
    context.fillRect(x, y, Math.max(0.5, size / 760), Math.max(0.5, size / 760));
  }
  context.globalAlpha = 1;

  /* Land is always painted, including the bundled fallback coastlines. */
  const landGradient = context.createLinearGradient(
    center - radius,
    center - radius,
    center + radius,
    center + radius,
  );
  landGradient.addColorStop(0, "#77694a");
  landGradient.addColorStop(0.3, "#544d35");
  landGradient.addColorStop(0.64, "#303328");
  landGradient.addColorStop(1, "#121614");

  for (const shape of land) {
    for (const segment of visibleSegments(shape, rotation, tilt)) {
      traceSegment(context, segment, center, radius);
      context.fillStyle = landGradient;
      context.fill();

      context.save();
      context.clip();
      context.globalAlpha = 0.16;
      for (let stripe = -radius; stripe <= radius; stripe += Math.max(5, size / 42)) {
        context.strokeStyle = stripe % 2 === 0 ? "#e0a144" : "#111812";
        context.lineWidth = Math.max(0.45, size / 920);
        context.beginPath();
        context.moveTo(center - radius, center + stripe);
        context.lineTo(center + radius, center + stripe + radius * 0.18);
        context.stroke();
      }
      context.restore();

      traceSegment(context, segment, center, radius);
      context.strokeStyle = "rgba(236, 171, 70, 0.78)";
      context.lineWidth = Math.max(0.72, size / 450);
      context.lineJoin = "round";
      context.shadowColor = "rgba(217, 145, 40, 0.24)";
      context.shadowBlur = size / 150;
      context.stroke();
      context.shadowBlur = 0;
    }
  }

  /* Geographic HUD grid sits above the terrain but below illumination. */
  context.strokeStyle = "rgba(207, 148, 53, 0.13)";
  context.lineWidth = Math.max(0.45, size / 920);

  for (let latitude = -60; latitude <= 60; latitude += 20) {
    const curve: GeoPoint[] = [];
    for (let longitude = -180; longitude <= 180; longitude += 2) {
      curve.push([longitude, latitude]);
    }
    drawCoordinateCurve(context, curve, rotation, tilt, center, radius);
  }

  for (let longitude = -180; longitude < 180; longitude += 20) {
    const curve: GeoPoint[] = [];
    for (let latitude = -88; latitude <= 88; latitude += 2) {
      curve.push([longitude, latitude]);
    }
    drawCoordinateCurve(context, curve, rotation, tilt, center, radius);
  }

  for (const city of CITY_LIGHTS) {
    const point = cameraPoint(city, rotation, tilt);
    if (point.z < 0.12) continue;
    const [x, y] = screenPoint(point, center, radius);
    const alpha = Math.min(0.9, 0.24 + point.z * 0.66);
    context.fillStyle = `rgba(249, 177, 59, ${alpha})`;
    context.shadowColor = "rgba(245, 166, 48, 0.78)";
    context.shadowBlur = size / 70;
    context.beginPath();
    context.arc(x, y, Math.max(0.65, size / 470), 0, TAU);
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
  sunlight.addColorStop(0, "rgba(255, 225, 164, 0.18)");
  sunlight.addColorStop(0.34, "rgba(244, 178, 75, 0.055)");
  sunlight.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = sunlight;
  context.fillRect(center - radius, center - radius, radius * 2, radius * 2);

  const shade = context.createLinearGradient(center - radius, center, center + radius, center);
  shade.addColorStop(0, "rgba(255, 211, 132, 0.035)");
  shade.addColorStop(0.47, "rgba(0, 0, 0, 0)");
  shade.addColorStop(0.73, "rgba(0, 0, 0, 0.22)");
  shade.addColorStop(1, "rgba(0, 0, 0, 0.78)");
  context.fillStyle = shade;
  context.fillRect(center - radius, center - radius, radius * 2, radius * 2);

  const vignette = context.createRadialGradient(center, center, radius * 0.58, center, center, radius);
  vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
  vignette.addColorStop(0.84, "rgba(0, 0, 0, 0.07)");
  vignette.addColorStop(1, "rgba(0, 0, 0, 0.56)");
  context.fillStyle = vignette;
  context.fillRect(center - radius, center - radius, radius * 2, radius * 2);

  context.restore();

  context.strokeStyle = "rgba(240, 189, 100, 0.76)";
  context.lineWidth = Math.max(1, size / 330);
  context.shadowColor = "rgba(213, 142, 34, 0.32)";
  context.shadowBlur = size / 72;
  context.beginPath();
  context.arc(center, center, radius, 0, TAU);
  context.stroke();
  context.restore();
}

function EarthCanvas(): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return undefined;

    let frame = 0;
    let rotation = 22 * DEG;
    let previousTime = performance.now();
    let lastPaint = 0;
    let land: readonly LandShape[] = FALLBACK_LAND;
    let disposed = false;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const controller = new AbortController();
    fetch(NATURAL_EARTH_URL, { signal: controller.signal, cache: "force-cache" })
      .then((response) => {
        if (!response.ok) throw new Error(`Natural Earth request failed: ${response.status}`);
        return response.json() as Promise<GeoJsonCollection>;
      })
      .then((data) => {
        if (!disposed) land = parseLand(data);
      })
      .catch(() => {
        /* The bundled fallback is intentionally retained on network failure. */
      });

    const render = (time: number): void => {
      const elapsed = Math.min(50, time - previousTime);
      previousTime = time;
      if (!reduceMotion) rotation += elapsed * 0.00007;

      /* 30 fps is sufficient for the slow globe and keeps Canvas inexpensive. */
      if (reduceMotion || time - lastPaint >= 32) {
        const bounds = canvas.getBoundingClientRect();
        const cssSize = Math.max(1, Math.min(bounds.width, bounds.height));
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.6);
        const renderSize = Math.max(280, Math.round(cssSize * pixelRatio));

        if (canvas.width !== renderSize || canvas.height !== renderSize) {
          canvas.width = renderSize;
          canvas.height = renderSize;
        }

        drawEarth(context, renderSize, rotation, land);
        lastPaint = time;
      }

      if (!reduceMotion) frame = window.requestAnimationFrame(render);
    };

    frame = window.requestAnimationFrame(render);
    return () => {
      disposed = true;
      controller.abort();
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
