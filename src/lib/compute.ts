/** Single registry of named functions callable from content (stats + graphs). */
import { COMPUTE, runCompute } from './stats';
import { GRAPH_COMPUTE } from './graph';

Object.assign(COMPUTE, GRAPH_COMPUTE);

export { COMPUTE, runCompute };
