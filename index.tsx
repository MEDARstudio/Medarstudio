/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {GoogleGenAI} from '@google/genai';
import {marked} from 'marked';

async function debug(...args: string[]) {
  const turn = document.createElement('div');
  const promises = args.map(async (arg) => await marked.parse(arg ?? ''));
  const strings = await Promise.all(promises);
  turn.innerHTML = strings.join('');
  document.body.append(turn);
}

async function generateContentFrom() {
  // Initialize with the correct API key from environment variables.
  const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

  debug('Generating...');

  const response = await ai.models.generateContent({
    // Use the recommended model for general text tasks.
    model: 'gemini-2.5-flash',
    contents:
      'What is the sum of the first 50 prime numbers? Generate and run code for the calculation, and make sure you get all 50.',
    config: {
      tools: [{codeExecution: {}}],
    },
  });

  // Extract the final text response. The SDK handles the tool execution loop.
  await debug(response.text);
}

async function main() {
  await generateContentFrom().catch(async (e) => await debug('got error', e));
}

main();
