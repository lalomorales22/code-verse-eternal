
export interface AIGenerationRequest {
  type: 'object' | 'code' | 'ui' | 'self-modify';
  prompt: string;
  context?: any;
  currentCode?: string;
}

export interface AIGenerationResponse {
  success: boolean;
  code?: string;
  error?: string;
  metadata?: any;
}

// xAI API service for grok-3-beta integration
export class AIService {
  private static instance: AIService;
  private apiKey: string | null = null;
  
  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  setApiKey(key: string) {
    this.apiKey = key;
    // Store in localStorage for persistence
    localStorage.setItem('xai_api_key', key);
  }

  getApiKey(): string | null {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('xai_api_key');
    }
    return this.apiKey;
  }

  private async callXAI(messages: any[]): Promise<any> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('xAI API key not set. Please enter your API key.');
    }

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-3-beta',
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`xAI API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async generateObject(prompt: string): Promise<AIGenerationResponse> {
    console.log('AI generating object for prompt:', prompt);
    
    try {
      const messages = [
        {
          role: 'system',
          content: `You are an AI that generates Three.js React components for a 3D canvas. Create a React functional component that renders a 3D object using @react-three/fiber.

CRITICAL RULES:
1. DO NOT use any import statements at all
2. Use only React, THREE (available as window.THREE), and useFrame from the provided context
3. Return ONLY a complete functional React component
4. Use proper Three.js geometry and materials
5. Make objects visually interesting with animations, colors, and effects
6. The component must be self-contained and executable

REQUIRED FORMAT - Your response must contain a complete function like this:
function MyObject() {
  const meshRef = React.useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ff0000" />
    </mesh>
  );
}

Make it creative and unique based on the user's prompt. Use colors, animations, and interesting geometries.`
        },
        {
          role: 'user',
          content: `Create a Three.js React component for: ${prompt}`
        }
      ];

      const response = await this.callXAI(messages);
      const generatedCode = response.choices[0]?.message?.content || '';

      console.log('Generated code from AI:', generatedCode);

      return {
        success: true,
        code: generatedCode,
        metadata: {
          type: 'ai_generated_object',
          complexity: 'dynamic',
          features: ['ai_generated', 'three_js', 'grok_powered'],
          prompt: prompt,
          timestamp: Date.now()
        }
      };
    } catch (error) {
      console.error('Error generating object:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async modifyCode(currentCode: string, modification: string): Promise<AIGenerationResponse> {
    console.log('AI modifying code:', { currentCode, modification });
    
    try {
      const messages = [
        {
          role: 'system',
          content: 'You are an AI that modifies and improves code. Take the existing code and apply the requested modifications. Return only the modified code.'
        },
        {
          role: 'user',
          content: `Current code:\n${currentCode}\n\nModification request: ${modification}\n\nReturn the modified code:`
        }
      ];

      const response = await this.callXAI(messages);
      const modifiedCode = response.choices[0]?.message?.content || '';

      return {
        success: true,
        code: modifiedCode,
        metadata: {
          modifications: [modification],
          timestamp: Date.now(),
          original_length: currentCode.length,
          new_length: modifiedCode.length
        }
      };
    } catch (error) {
      console.error('Error modifying code:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async generateUI(description: string): Promise<AIGenerationResponse> {
    console.log('AI generating UI for:', description);
    
    try {
      const messages = [
        {
          role: 'system',
          content: 'You are an AI that generates React UI components using Tailwind CSS. Create beautiful, functional components. Return only JSX/React code.'
        },
        {
          role: 'user',
          content: `Generate a React component for: ${description}`
        }
      ];

      const response = await this.callXAI(messages);
      const uiCode = response.choices[0]?.message?.content || '';

      return {
        success: true,
        code: uiCode,
        metadata: {
          component: 'AIGeneratedUI',
          type: 'react_component',
          description: description
        }
      };
    } catch (error) {
      console.error('Error generating UI:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async improveSelf(): Promise<AIGenerationResponse> {
    console.log('AI attempting self-improvement...');
    
    try {
      const messages = [
        {
          role: 'system',
          content: 'You are an AI that can analyze and improve code systems. Suggest specific improvements for a 3D canvas application with AI-generated content.'
        },
        {
          role: 'user',
          content: 'Analyze this 3D canvas application and suggest improvements for better performance, user experience, and AI capabilities.'
        }
      ];

      const response = await this.callXAI(messages);
      const improvements = response.choices[0]?.message?.content || '';

      return {
        success: true,
        code: improvements,
        metadata: {
          improvements: improvements.split('\n').filter(line => line.trim()),
          confidence: 0.9,
          model: 'grok-3-beta'
        }
      };
    } catch (error) {
      console.error('Error in self-improvement:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export default AIService.getInstance();
