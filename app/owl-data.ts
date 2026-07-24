import chunk1 from "./owl-data/chunk-1";
import chunk2 from "./owl-data/chunk-2";
import chunk3 from "./owl-data/chunk-3";
import chunk4 from "./owl-data/chunk-4";
import chunk5 from "./owl-data/chunk-5";
import chunk6 from "./owl-data/chunk-6";

/**
 * The approved owl artwork extracted from the supplied visual reference.
 * Kept as an embedded PNG so the hero reproduces the exact line work without
 * relying on a remote asset host.
 */
export const owlDataUri = `data:image/png;base64,${chunk1}${chunk2}${chunk3}${chunk4}${chunk5}${chunk6}`;
