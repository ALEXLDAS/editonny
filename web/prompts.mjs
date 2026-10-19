// Canonical request library, in workflow order.
import { create } from './prompts/create.mjs';
import { refine } from './prompts/refine.mjs';
import { audioMedia } from './prompts/audio-media.mjs';
import { deliver } from './prompts/deliver.mjs';

export const prompts = [...create, ...refine, ...audioMedia, ...deliver];
