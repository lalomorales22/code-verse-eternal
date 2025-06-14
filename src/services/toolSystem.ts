
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
    5. Use modern JavaScript/ES6+ syntax
    
    Example context usage:
    - context.addObject({ type: 'custom', geometry: myGeometry, material: myMaterial })
    - context.scene (Three.js scene reference)
    - context.objects (current objects array)
    
    Return ONLY the function code that can be executed with new Function().
    
    Example format:
    function executeTool(context, parameters) {
      // Your tool logic here
      const newObject = {
        id: 'tool_obj_' + Date.now(),
        type: 'tool_generated',
        position: [0, 0, 0],
        code: '',
        props: { color: '#ff0000' },
        metadata: { type: 'tool_generated', tool: '${name}' }
      };
      context.addObject(newObject);
      return { success: true, message: 'Tool executed successfully' };
    }`;

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
      console.log('Executing tool:', tool.name);
      console.log('Tool code:', tool.code);
      
      // Create a safe execution environment
      const func = new Function('context', 'parameters', `
        ${tool.code}
        return executeTool(context, parameters);
      `);
      
      const result = func(context, parameters);
      console.log('Tool execution result:', result);
      return result;
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
