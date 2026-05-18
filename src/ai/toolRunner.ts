import { getSafeFoodsTool } from '../tools/getSafeFoods.js';

// Map the tool name coming from Claude directly to our deterministic backend functions
export async function executeTool(toolName: string, toolInput: any) {
  switch (toolName) {
    case 'getSafeFoods':
      return getSafeFoodsTool(toolInput);
    
    // Future tools like 'getChokingHazards' or 'validateAge' will register right here cleanly
    default:
      throw new Error(`Tool ${toolName} is not registered on this backend server.`);
  }
}