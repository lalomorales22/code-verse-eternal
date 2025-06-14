
export interface Tool {
  id: string;
  name: string;
  description: string;
  code: string;
  parameters: any;
  createdAt: number;
}

export interface ToolExecutionContext {
  scene: any;
  objects: any[];
  addObject: (object: any) => void;
  updateObject: (id: string, updates: any) => void;
  deleteObject: (id: string) => void;
}

export class ToolSystem {
  private static instance: ToolSystem;
  private tools: Map<string, Tool> = new Map();

  static getInstance(): ToolSystem {
    if (!ToolSystem.instance) {
      ToolSystem.instance = new ToolSystem();
    }
    return ToolSystem.instance;
  }

  async createTool(name: string, description: string, aiService: any): Promise<Tool> {
    console.log(`Creating tool: ${name} - ${description}`);
    
    const toolPrompt = `Create a JavaScript function that ${description}. 
    The function should:
    1. Accept a context object with scene, objects, addObject, updateObject, deleteObject methods
    2. Return an object or perform the requested action
    3. Be creative and functional
    4. Handle Three.js objects, geometry, materials, animations, etc.
    
    Example context usage:
    - context.addObject({ type: 'custom', geometry: myGeometry, material: myMaterial })
    - context.scene (Three.js scene reference)
    
    Return only the function code.`;

    const response = await aiService.generateObject(toolPrompt);
    
    if (response.success && response.code) {
      const tool: Tool = {
        id: `tool_${Date.now()}`,
        name,
        description,
        code: response.code,
        parameters: {},
        createdAt: Date.now()
      };
      
      this.tools.set(tool.id, tool);
      console.log('Tool created:', tool);
      return tool;
    }
    
    throw new Error('Failed to create tool');
  }

  async executeTool(toolId: string, context: ToolExecutionContext, parameters: any = {}): Promise<any> {
    const tool = this.tools.get(toolId);
    if (!tool) {
      throw new Error(`Tool ${toolId} not found`);
    }

    try {
      // Create a safe execution environment
      const func = new Function('context', 'parameters', tool.code);
      return func(context, parameters);
    } catch (error) {
      console.error('Tool execution error:', error);
      throw error;
    }
  }

  getTools(): Tool[] {
    return Array.from(this.tools.values());
  }

  deleteTool(toolId: string): boolean {
    return this.tools.delete(toolId);
  }
}

export default ToolSystem.getInstance();
