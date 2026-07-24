import chunk1 from "./earth-texture/chunk-1";
import chunk2 from "./earth-texture/chunk-2";
import chunk3 from "./earth-texture/chunk-3";

/**
 * Embedded 768×384 Blue Marble terrain texture.
 * Keeping it inside the repository makes the globe deterministic and removes
 * remote-image/CORS failures from Preview and production deployments.
 */
export const earthTextureDataUri = `data:image/webp;base64,${chunk1}${chunk2}${chunk3}`;
