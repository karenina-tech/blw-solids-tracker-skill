// Handles chat completion loops & tool execution orchestration
// This service manages the conversational loop. If Claude decides it needs a tool to safely answer the user, this service intercepts that request, executes your local TypeScript logic, feeds the secure data back to Claude, and lets Claude finish generating the perfect response.

import Anthropic from '@anthropic-ai/sdk';
import { BLW_TOOL_DEFINITIONS } from '../ai/toolDefinitions.js';
import { executeTool } from '../ai/toolRunner.js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

// Load the official SKILL.md rules to act as Claude's baseline instructions
const skillInstructionsPath = path.join(process.cwd(), '.claude', 'skills', 'blw-solids-tracker', 'SKILL.md');
const SYSTEM_PROMPT = fs.readFileSync(skillInstructionsPath, 'utf-8');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '', 
});

export async function handleUserMessage(messageHistory: Anthropic.MessageParam[]) {
  // 1. Initial call to Claude with user data + our explicit tool rules
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6', // Production agentic standard
    max_tokens: 4000,
    system: SYSTEM_PROMPT,
    tools: BLW_TOOL_DEFINITIONS,
    messages: messageHistory,
  });

  // 2. Evaluate if Claude requested a backend validation tool call
  if (response.stop_reason === 'tool_use') {
    const toolBlock = response.content.find(block => block.type === 'tool_use');
    
    if (toolBlock && toolBlock.type === 'tool_use') {
      const { name, input, id } = toolBlock;

      // Execute our deterministic TypeScript rules backend layer
      const toolResult = await executeTool(name, input);

      // Append the execution chain history to prevent context dropping
      const updatedHistory = [
        ...messageHistory,
        { role: 'assistant', content: response.content },
        {
          role: 'user',
          content: [
            {
              type: 'tool_result',
              tool_use_id: id,
              content: JSON.stringify(toolResult),
            },
          ],
        },
      ] as Anthropic.MessageParam[];

      // 3. Resubmit context to Claude to finalize the UI presentation (the text/table layout)
      const finalResponse = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 4000,
        system: SYSTEM_PROMPT,
        tools: BLW_TOOL_DEFINITIONS,
        messages: updatedHistory,
      });

      return finalResponse.content;
    }
  }

  // Return standard text (like the onboarding step questions) if no tool execution was needed yet
  return response.content;
}