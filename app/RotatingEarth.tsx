"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactElement, ReactPortal } from "react";
import { createPortal } from "react-dom";

type GeoPoint = readonly [longitude: number, latitude: number];
type LandShape = readonly GeoPoint[];
type ProjectedPoint = { x: number; y: number; visible: boolean; depth: number };

const DEG = Math.PI / 180;

const LAND: readonly LandShape[] = [
  [
    [-168, 72], [-155, 67], [-145, 60], [-137, 56], [-130, 51], [-125, 44],
    [-124, 37], [-117, 31], [-108, 25], [-99, 19], [-90, 19], [-83, 25],
    [-80, 31], [-76, 38], [-68, 45], [-60, 51], [-64, 58], [-78, 64],
    [-95, 70], [-120, 75], [-145, 76],
  ],
  [
    [-82, 12], [-75, 8], [-70, 2], [-67, -6], [-63, -15], [-58, -23],
    [-54, -31], [-58, -40], [-66, -50], [-72, -55], [-76, -44], [-78, -30],
    [-80, -15], [-81, 0],
  ],
  [
    [-11, 36], [-4, 44], [8, 50], [18, 57], [33, 61], [48, 65], [68, 68],
    [92, 72], [118, 67], [142, 59], [160, 51], [170, 43], [154, 35],
    [140, 31], [126, 24], [111, 20], [102, 12], [91, 8], [80, 7], [72, 18],
    [60, 25], [48, 31], [36, 35], [25, 39], [13, 43], [2, 42],
  ],
  [
    [-17, 35], [-4, 37], [10, 36], [23, 31], [33, 23], [41, 12], [42, 1],
    [37, -12], [31, -22], [24, -31], [13, -35], [3, -31], [-7, -22],
    [-12, -8], [-16, 8], [-16, 22],
  ],
  [
    [112, -11], [123, -12], [136, -15], [147, -22], [153, -32], [147, -40],
    [135, -44], [121, -37], [114, -28],
  ],
  [
    [-59, 82], [-42, 83], [-24, 75], [-20, 65], [-32, 58], [-48, 59], [-63, 69],
  ],
  [
    [-180, -69], [-150, -72], [-115, -76], [-80, -72], [-45, -76], [-10, -72],
    [25, -74], [60, -70], [95, -72], [130, -75], [165, -70], [180, -69],
  ],
  [[47, -13], [51, -17], [50, -25], [46, -22]],
  [[129, 32], [139, 35], [145, 43], [141, 46], [133, 39]],
  [[-10, 50], [-4, 58], [1, 54], [-2, 50]],
  [[95, 5], [105, 2], [117, 0], [125, -6], [118, -9], [106, -6]],
];

const CITY_LIGHTS: readonly GeoPoint[] = [
  [-74, 40.7], [-118.2, 34.1], [-99.1, 19.4], [-46.6, -23.5], [-0.1, 51.5],
  [2.35, 48.86], [13.4, 52.5], [29, 41], [31.2, 30], [37.6, 55.8],
  [77.2, 28.6], [72.9, 19.1], [90.4, 23.8], [116.4, 39.9], [121.5, 31.2],
  [139.7, 35.7], [126.98, 37.56], [103.8, 1.35], [151.2, -33.9], [18.4, -33.9],
];

function projectPoint(
  point: GeoPoint,
  rotation: number,
  tilt: number,
  center: number,
  radius: number,
): ProjectedPoint {
  const longitude = point[0] * DEG - rotation;
  const latitude = point[1] * DEG;
  const sinLatitude = Math.sin(latitude);
  const cosLatitude = Math.cos(latitude);
  const sinTilt = Math.sin(tilt);
  const cosTilt = Math.cos(tilt);
  const cosLongitude = Math.cos(longitude);

  const depth = sinTilt * sinLatitude + cosTilt * cosLatitude * cosLongitude;

  return {
    x: center + radius * cosLatitude * Math.sin(longitude),
    y: center - radius * (cosTilt * sinLatitude - sinTilt * cosLatitude * cosLongitude),
    visible: depth > 0,
    depth,
  };
}

function drawCurve(
  context: CanvasRenderingContext2D,
  points: readonly GeoPoint[],
  rotation: number,
  tilt: number,
  center: number,
  radius: number,
): void {
  let drawing = false;
  context.beginPath();

  for (const point of points) {
    const projected = projectPoint(point, rotation, tilt, center, radius);
    if (!projected.visible) {
      drawing = false;
      continue;
    }

    if (!drawing) {
      context.moveTo(projected.x, projected.y);
      drawing = true;
    } else {
      context.lineTo(projected.x, projected.y);
    }
  }

  context.stroke();
}

function densify(shape: LandShape, steps = 5): GeoPoint[] {
  const points: GeoPoint[] = [];
  for (let index = 0; index < shape.length; index += 1) {
    const start = shape[index];
    const end = shape[(index + 1) % shape.length];
    for (let step = 0; step < steps; step += 1) {
      const amount = step / steps;
      let deltaLongitude = end[0] - start[0];
      if (deltaLongitude > 180) deltaLongitude -= 360;
      if (deltaLongitude < -180) deltaLongitude += 360;
      points.push([
        start[0] + deltaLongitude * amount,
        start[1] + (end[1] - start[1]) * amount,
      ]);
    }
  }
  return points;
}

const DENSE_LAND = LAND.map((shape) => densify(shape));

function drawEarth(
  context: CanvasRenderingContext2D,
  size: number,
  rotation: number,
): void {
  const center = size / 2;
  const radius = size * 0.455;
  const tilt = -8 * DEG;

  context.clearRect(0, 0, size, size);
  context.save();

  const atmosphere = context.createRadialGradient(
    center - radius * 0.28,
    center - radius * 0.35,
    radius * 0.05,
    center,
    center,
    radius * 1.08,
  );
  atmosphere.addColorStop(0, "rgba(214, 164, 86, 0.23)");
  atmosphere.addColorStop(0.54, "rgba(20, 24, 24, 0.04)");
  atmosphere.addColorStop(0.9, "rgba(2, 4, 5, 0.9)");
  atmosphere.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = atmosphere;
  context.beginPath();
  context.arc(center, center, radius * 1.08, 0, Math.PI * 2);
  context.fill();

  context.save();
  context.beginPath();
  context.arc(center, center, radius, 0, Math.PI * 2);
  context.clip();

  const ocean = context.createRadialGradient(
    center - radius * 0.32,
    center - radius * 0.4,
    radius * 0.03,
    center + radius * 0.22,
    center + radius * 0.08,
    radius * 1.2,
  );
  ocean.addColorStop(0, "#28271f");
  ocean.addColorStop(0.26, "#111514");
  ocean.addColorStop(0.72, "#050808");
  ocean.addColorStop(1, "#010202");
  context.fillStyle = ocean;
  context.fillRect(center - radius, center - radius, radius * 2, radius * 2);

  context.lineWidth = Math.max(0.55, size / 560);
  context.strokeStyle = "rgba(195, 139, 50, 0.12)";

  for (let latitude = -60; latitude <= 60; latitude += 20) {
    const curve: GeoPoint[] = [];
    for (let longitude = -180; longitude <= 180; longitude += 2) {
      curve.push([longitude, latitude]);
    }
    drawCurve(context, curve, rotation, tilt, center, radius);
  }

  for (let longitude = -180; longitude < 180; longitude += 20) {
    const curve: GeoPoint[] = [];
    for (let latitude = -88; latitude <= 88; latitude += 2) {
      curve.push([longitude, latitude]);
    }
    drawCurve(context, curve, rotation, tilt, center, radius);
  }

  for (const shape of DENSE_LAND) {
    const projected = shape.map((point) => projectPoint(point, rotation, tilt, center, radius));
    const visible = projected.filter((point) => point.visible);
    if (visible.length < 3) continue;

    const allVisible = visible.length === projected.length;
    context.beginPath();
    let started = false;
    for (const point of projected) {
      if (!point.visible) {
        started = false;
        continue;
      }
      if (!started) {
        context.moveTo(point.x, point.y);
        started = true;
      } else {
        context.lineTo(point.x, point.y);
      }
    }

    if (allVisible) {
      context.closePath();
      const landGradient = context.createLinearGradient(
        center - radius,
        center - radius,
        center + radius,
        center + radius,
      );
      landGradient.addColorStop(0, "rgba(84, 72, 48, 0.92)");
      landGradient.addColorStop(0.5, "rgba(42, 39, 29, 0.96)");
      landGradient.addColorStop(1, "rgba(13, 15, 13, 0.98)");
      context.fillStyle = landGradient;
      context.fill();
    }

    context.strokeStyle = "rgba(225, 164, 67, 0.72)";
    context.lineWidth = Math.max(0.8, size / 390);
    context.shadowColor = "rgba(217, 145, 40, 0.22)";
    context.shadowBlur = size / 120;
    context.stroke();
    context.shadowBlur = 0;
  }

  for (const city of CITY_LIGHTS) {
    const point = projectPoint(city, rotation, tilt, center, radius);
    if (!point.visible || point.depth < 0.16) continue;
    const alpha = Math.min(0.95, 0.26 + point.depth * 0.72);
    context.fillStyle = `rgba(245, 174, 61, ${alpha})`;
    context.shadowColor = "rgba(245, 174, 61, 0.72)";
    context.shadowBlur = size / 65;
    context.beginPath();
    context.arc(point.x, point.y, Math.max(0.7, size / 410), 0, Math.PI * 2);
    context.fill();
  }
  context.shadowBlur = 0;

  const shade = context.createLinearGradient(center - radius, center, center + radius, center);
  shade.addColorStop(0, "rgba(255, 210, 130, 0.05)");
  shade.addColorStop(0.48, "rgba(0, 0, 0, 0)");
  shade.addColorStop(0.74, "rgba(0, 0, 0, 0.28)");
  shade.addColorStop(1, "rgba(0, 0, 0, 0.88)");
  context.fillStyle = shade;
  context.fillRect(center - radius, center - radius, radius * 2, radius * 2);

  const vignette = context.createRadialGradient(center, center, radius * 0.55, center, center, radius);
  vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
  vignette.addColorStop(0.83, "rgba(0, 0, 0, 0.08)");
  vignette.addColorStop(1, "rgba(0, 0, 0, 0.62)");
  context.fillStyle = vignette;
  context.fillRect(center - radius, center - radius, radius * 2, radius * 2);

  context.restore();

  context.strokeStyle = "rgba(239, 190, 104, 0.72)";
  context.lineWidth = Math.max(1, size / 310);
  context.shadowColor = "rgba(213, 142, 34, 0.3)";
  context.shadowBlur = size / 70;
  context.beginPath();
  context.arc(center, center, radius, 0, Math.PI * 2);
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
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const render = (time: number): void => {
      const bounds = canvas.getBoundingClientRect();
      const cssSize = Math.max(1, Math.min(bounds.width, bounds.height));
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const renderSize = Math.round(cssSize * pixelRatio);

      if (canvas.width !== renderSize || canvas.height !== renderSize) {
        canvas.width = renderSize;
        canvas.height = renderSize;
      }

      const elapsed = Math.min(50, time - previousTime);
      previousTime = time;
      if (!reduceMotion) rotation += elapsed * 0.000075;

      drawEarth(context, renderSize, rotation);
      if (!reduceMotion) frame = window.requestAnimationFrame(render);
    };

    frame = window.requestAnimationFrame(render);
    return () => window.cancelAnimationFrame(frame);
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
