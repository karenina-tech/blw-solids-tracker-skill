import { getSafeFoodsTool } from '../tools/getSafeFoods.js';

// Centralized tool execution function that routes calls to the appropriate tool based on the tool name. This abstracts away the individual tool implementations and provides a single interface for the agent to interact with all tools.
export async function executeTool(toolName: string, toolInput: any) {
  switch (toolName) {
    case 'getSafeFoods':
      return getSafeFoodsTool(toolInput);
    
    // Future tools like 'getChokingHazards' or 'validateAge' will register right here cleanly
    default:
      throw new Error(`Tool ${toolName} is not registered on this backend server.`);
  }
}