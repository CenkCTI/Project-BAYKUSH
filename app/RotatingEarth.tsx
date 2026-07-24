"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactElement, ReactPortal } from "react";
import { createPortal } from "react-dom";
import { earthTextureDataUri } from "./earth-texture";

type GeoPoint = readonly [longitude: number, latitude: number];
type ProjectedPoint = { x: number; y: number; visible: boolean; depth: number };

type ProjectionLookup = {
  size: number;
  pixelIndexes: Uint32Array;
  longitudeOffsets: Float32Array;
  textureRows: Uint16Array;
  diffuse: Float32Array;
  edge: Float32Array;
  imageData: ImageData;
};

type TextureSource = {
  pixels: Uint8ClampedArray;
  width: number;
  height: number;
};

const DEG = Math.PI / 180;
const TAU = Math.PI * 2;
const TILT = -8 * DEG;
const INTERNAL_MAX_SIZE = 480;
const FRAME_INTERVAL = 1000 / 32;

const CITY_LIGHTS: readonly GeoPoint[] = [
  [-122.4, 37.8], [-118.2, 34.1], [-87.6, 41.9], [-74, 40.7], [-99.1, 19.4],
  [-58.4, -34.6], [-46.6, -23.5], [-43.2, -22.9], [-0.1, 51.5], [2.35, 48.86],
  [4.9, 52.4], [13.4, 52.5], [12.5, 41.9], [23.7, 38], [28.98, 41],
  [31.2, 30], [37.6, 55.8], [44.4, 33.3], [46.7, 24.7], [55.3, 25.2],
  [72.9, 19.1], [77.2, 28.6], [77.6, 12.97], [88.4, 22.6], [90.4, 23.8],
  [100.5, 13.75], [103.8, 1.35], [106.8, -6.2], [116.4, 39.9], [121.5, 31.2],
  [114.2, 22.3], [126.98, 37.56], [139.7, 35.7], [151.2, -33.9], [144.96, -37.8],
  [18.4, -33.9], [28.0, -26.2], [36.8, -1.3], [3.4, 6.5], [32.6, 0.35],
];

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.max(minimum, Math.min(maximum, value));
}

function projectPoint(
  point: GeoPoint,
  rotation: number,
  center: number,
  radius: number,
): ProjectedPoint {
  const longitude = point[0] * DEG - rotation;
  const latitude = point[1] * DEG;
  const sinLatitude = Math.sin(latitude);
  const cosLatitude = Math.cos(latitude);
  const sinTilt = Math.sin(TILT);
  const cosTilt = Math.cos(TILT);
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
  center: number,
  radius: number,
): void {
  let drawing = false;
  context.beginPath();

  for (const point of points) {
    const projected = projectPoint(point, rotation, center, radius);
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

function loadTexture(): Promise<TextureSource> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";

    image.onload = () => {
      const surface = document.createElement("canvas");
      surface.width = image.naturalWidth;
      surface.height = image.naturalHeight;
      const context = surface.getContext("2d", { willReadFrequently: true });

      if (!context) {
        reject(new Error("Earth texture canvas is unavailable."));
        return;
      }

      context.drawImage(image, 0, 0);
      const data = context.getImageData(0, 0, surface.width, surface.height);
      resolve({ pixels: data.data, width: surface.width, height: surface.height });
    };

    image.onerror = () => reject(new Error("Earth texture failed to decode."));
    image.src = earthTextureDataUri;
  });
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

  // Fixed upper-left studio light. It gives the terrain shape and preserves the
  // dark intelligence-dashboard look without flattening the satellite image.
  const lightX = -0.48;
  const lightY = -0.36;
  const lightZ = 0.80;
  const lightLength = Math.hypot(lightX, lightY, lightZ);

  for (let y = minimum; y <= maximum; y += 1) {
    const normalizedY = (y + 0.5 - center) / radius;

    for (let x = minimum; x <= maximum; x += 1) {
      const normalizedX = (x + 0.5 - center) / radius;
      const distanceSquared = normalizedX * normalizedX + normalizedY * normalizedY;
      if (distanceSquared > 1) continue;

      const z = Math.sqrt(1 - distanceSquared);
      const worldY = -normalizedY;
      const sinLatitude = clamp(cosTilt * worldY + sinTilt * z, -1, 1);
      const latitude = Math.asin(sinLatitude);
      const longitudeReference = cosTilt * z - sinTilt * worldY;
      const longitudeOffset = Math.atan2(normalizedX, longitudeReference);
      const textureRow = Math.round((0.5 - latitude / Math.PI) * (textureHeight - 1));

      const illumination = Math.max(
        0,
        (normalizedX * lightX + normalizedY * lightY + z * lightZ) / lightLength,
      );

      pixelIndexes.push((y * size + x) * 4);
      longitudeOffsets.push(longitudeOffset);
      textureRows.push(textureRow);
      diffuse.push(illumination);
      edge.push(Math.pow(z, 0.36));
    }
  }

  return {
    size,
    pixelIndexes: Uint32Array.from(pixelIndexes),
    longitudeOffsets: Float32Array.from(longitudeOffsets),
    textureRows: Uint16Array.from(textureRows),
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

  for (let index = 0; index < lookup.pixelIndexes.length; index += 1) {
    const longitude = lookup.longitudeOffsets[index] + normalizedRotation;
    const wrapped = ((longitude / TAU + 0.5) % 1 + 1) % 1;
    const textureColumn = Math.min(texture.width - 1, Math.floor(wrapped * texture.width));
    const textureIndex = (lookup.textureRows[index] * texture.width + textureColumn) * 4;
    const outputIndex = lookup.pixelIndexes[index];

    const sourceRed = texture.pixels[textureIndex];
    const sourceGreen = texture.pixels[textureIndex + 1];
    const sourceBlue = texture.pixels[textureIndex + 2];
    const luminance = sourceRed * 0.2126 + sourceGreen * 0.7152 + sourceBlue * 0.0722;

    const isIce = luminance > 190 && Math.abs(sourceRed - sourceBlue) < 45;
    const isOcean = sourceBlue > sourceRed * 1.22 && sourceBlue > sourceGreen * 1.08;

    let red: number;
    let green: number;
    let blue: number;

    if (isIce) {
      // Warm polar ice rather than a bright white patch that breaks the palette.
      red = luminance * 0.68 + 28;
      green = luminance * 0.56 + 19;
      blue = luminance * 0.35 + 8;
    } else if (isOcean) {
      // Keep ocean topography visible, but close to black as in the reference.
      red = sourceRed * 0.13 + luminance * 0.035 + 1;
      green = sourceGreen * 0.17 + luminance * 0.045 + 3;
      blue = sourceBlue * 0.19 + luminance * 0.055 + 5;
    } else {
      // Preserve real terrain detail while grading vegetation/desert into amber.
      red = sourceRed * 0.31 + sourceGreen * 0.15 + luminance * 0.30 + 13;
      green = sourceGreen * 0.25 + sourceRed * 0.08 + luminance * 0.19 + 7;
      blue = sourceBlue * 0.10 + luminance * 0.075 + 2;
    }

    const lighting = (0.22 + lookup.diffuse[index] * 0.92) * (0.42 + lookup.edge[index] * 0.58);
    const atmosphericGold = Math.pow(1 - lookup.edge[index], 2.4) * 16;

    output[outputIndex] = clamp(red * lighting + atmosphericGold, 0, 255);
    output[outputIndex + 1] = clamp(green * lighting + atmosphericGold * 0.48, 0, 255);
    output[outputIndex + 2] = clamp(blue * lighting + atmosphericGold * 0.12, 0, 255);
    output[outputIndex + 3] = 255;
  }

  context.putImageData(lookup.imageData, 0, 0);
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

  context.lineWidth = Math.max(0.45, size / 760);
  context.strokeStyle = "rgba(211, 151, 55, 0.105)";

  for (let latitude = -60; latitude <= 60; latitude += 20) {
    const curve: GeoPoint[] = [];
    for (let longitude = -180; longitude <= 180; longitude += 2) {
      curve.push([longitude, latitude]);
    }
    drawCurve(context, curve, rotation, center, radius);
  }

  for (let longitude = -180; longitude < 180; longitude += 20) {
    const curve: GeoPoint[] = [];
    for (let latitude = -88; latitude <= 88; latitude += 2) {
      curve.push([longitude, latitude]);
    }
    drawCurve(context, curve, rotation, center, radius);
  }

  for (const city of CITY_LIGHTS) {
    const point = projectPoint(city, rotation, center, radius);
    if (!point.visible || point.depth < 0.2) continue;

    const alpha = Math.min(0.72, 0.13 + point.depth * 0.53);
    const pointRadius = Math.max(0.45, size / 650);
    context.fillStyle = `rgba(247, 175, 61, ${alpha})`;
    context.shadowColor = "rgba(247, 175, 61, 0.58)";
    context.shadowBlur = size / 110;
    context.beginPath();
    context.arc(point.x, point.y, pointRadius, 0, TAU);
    context.fill();
  }
  context.shadowBlur = 0;

  const nightShade = context.createLinearGradient(center - radius, center, center + radius, center);
  nightShade.addColorStop(0, "rgba(255, 208, 126, 0.025)");
  nightShade.addColorStop(0.52, "rgba(0, 0, 0, 0)");
  nightShade.addColorStop(0.78, "rgba(0, 0, 0, 0.24)");
  nightShade.addColorStop(1, "rgba(0, 0, 0, 0.79)");
  context.fillStyle = nightShade;
  context.fillRect(center - radius, center - radius, radius * 2, radius * 2);

  const vignette = context.createRadialGradient(center, center, radius * 0.62, center, center, radius);
  vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
  vignette.addColorStop(0.84, "rgba(0, 0, 0, 0.035)");
  vignette.addColorStop(1, "rgba(0, 0, 0, 0.48)");
  context.fillStyle = vignette;
  context.fillRect(center - radius, center - radius, radius * 2, radius * 2);

  context.restore();

  const highlight = context.createRadialGradient(
    center - radius * 0.38,
    center - radius * 0.46,
    0,
    center - radius * 0.38,
    center - radius * 0.46,
    radius * 0.72,
  );
  highlight.addColorStop(0, "rgba(255, 225, 171, 0.18)");
  highlight.addColorStop(0.38, "rgba(226, 163, 67, 0.045)");
  highlight.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = highlight;
  context.beginPath();
  context.arc(center, center, radius, 0, TAU);
  context.fill();

  context.strokeStyle = "rgba(239, 190, 104, 0.69)";
  context.lineWidth = Math.max(0.9, size / 360);
  context.shadowColor = "rgba(213, 142, 34, 0.30)";
  context.shadowBlur = size / 86;
  context.beginPath();
  context.arc(center, center, radius, 0, TAU);
  context.stroke();
  context.shadowBlur = 0;
}

function drawLoadingEarth(context: CanvasRenderingContext2D, size: number): void {
  const center = size / 2;
  const radius = size * 0.455;
  context.clearRect(0, 0, size, size);
  const fallback = context.createRadialGradient(
    center - radius * 0.35,
    center - radius * 0.42,
    radius * 0.04,
    center,
    center,
    radius,
  );
  fallback.addColorStop(0, "#302719");
  fallback.addColorStop(0.42, "#111413");
  fallback.addColorStop(1, "#010202");
  context.fillStyle = fallback;
  context.beginPath();
  context.arc(center, center, radius, 0, TAU);
  context.fill();
}

function EarthCanvas(): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
    if (!context) return undefined;

    let cancelled = false;
    let frame = 0;
    let texture: TextureSource | null = null;
    let lookup: ProjectionLookup | null = null;
    let rotation = 18 * DEG;
    let previousTime = performance.now();
    let previousDraw = 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ensureCanvas = (): number => {
      const bounds = canvas.getBoundingClientRect();
      const cssSize = Math.max(1, Math.min(bounds.width, bounds.height));
      const renderSize = Math.max(300, Math.min(INTERNAL_MAX_SIZE, Math.round(cssSize * 1.32)));

      if (canvas.width !== renderSize || canvas.height !== renderSize) {
        canvas.width = renderSize;
        canvas.height = renderSize;
        lookup = null;
      }

      return renderSize;
    };

    const render = (time: number): void => {
      if (cancelled) return;

      if (!reduceMotion && time - previousDraw < FRAME_INTERVAL) {
        frame = window.requestAnimationFrame(render);
        return;
      }

      const size = ensureCanvas();
      const elapsed = Math.min(80, time - previousTime);
      previousTime = time;
      previousDraw = time;

      if (!reduceMotion) rotation += elapsed * 0.000042;

      if (!texture) {
        drawLoadingEarth(context, size);
      } else {
        if (!lookup || lookup.size !== size) {
          lookup = buildProjectionLookup(context, size, texture.height);
        }
        renderTexturedSphere(context, lookup, texture, rotation);
        drawHudOverlay(context, size, rotation);
      }

      if (!reduceMotion) frame = window.requestAnimationFrame(render);
    };

    void loadTexture()
      .then((loadedTexture) => {
        if (cancelled) return;
        texture = loadedTexture;
        const size = ensureCanvas();
        lookup = buildProjectionLookup(context, size, texture.height);

        if (reduceMotion) {
          renderTexturedSphere(context, lookup, texture, rotation);
          drawHudOverlay(context, size, rotation);
        }
      })
      .catch(() => {
        // The local data URI should always decode. The fallback globe remains if
        // a browser cannot decode WebP for any reason.
      });

    frame = window.requestAnimationFrame(render);
    return () => {
      cancelled = true;
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
