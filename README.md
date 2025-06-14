
# AI Canvas - Self-Evolving 3D World

An infinite 3D canvas where AI creates, modifies, and evolves code in real-time. This revolutionary application combines Three.js with AI-powered content generation to create an unlimited creative playground.

## Project Info

**Repository**: https://github.com/lalomorales22/code-verse-eternal.git

## What is AI Canvas?

AI Canvas is a cutting-edge web application that demonstrates the future of creative coding. It features:

- **Infinite 3D Canvas**: An unlimited space for 3D object creation and manipulation
- **AI-Powered Generation**: Uses Grok-3-beta to generate Three.js objects, UI components, and custom tools
- **Real-time Code Evolution**: AI can modify and improve its own code generation capabilities
- **Interactive Tools System**: Create custom tools on-demand that can manipulate the 3D environment
- **Draggable AI Interface**: Move the control panel anywhere on screen for optimal workflow
- **Self-Improving System**: The AI continuously learns and enhances its capabilities

## Features

### 🎨 Creative Mode
- Generate unlimited 3D objects with natural language prompts
- AI creates unique Three.js components with animations, materials, and effects
- No pre-made assets - everything is generated fresh by AI

### 🛠️ Dynamic Tool Creation
- Ask AI to create custom tools for specific tasks
- Tools can manipulate objects, create patterns, or perform complex operations
- Execute tools with a single click

### 🎯 Interactive 3D Environment
- Zoom, pan, and rotate around your creations
- Objects are positioned randomly in 3D space for natural exploration
- Real-time rendering with smooth animations

### 🤖 AI-Powered Everything
- Object generation powered by Grok-3-beta
- UI component generation on demand
- Code modification and improvement capabilities
- Self-evolving system architecture

## How to Run the App

### Prerequisites

- Node.js (v16 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm (comes with Node.js)
- Git

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/lalomorales22/code-verse-eternal.git
   cd code-verse-eternal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5173`
   - The app will automatically reload when you make changes

### Getting Started

1. **Set up AI Integration**
   - Click on the draggable AI interface panel
   - Enter your xAI API key when prompted
   - The key will be stored locally for future sessions

2. **Create Your First Object**
   - Type a description like "a spinning golden cube with rainbow edges"
   - Click "Generate Object"
   - Watch as AI creates a unique Three.js component

3. **Explore the Canvas**
   - Use mouse to rotate, zoom, and pan around the 3D space
   - Generated objects appear at random positions
   - Each object has unique animations and visual effects

4. **Create Custom Tools**
   - Use the "Create Tool" feature to generate custom functionality
   - Example: "Create a tool that arranges all objects in a circle"
   - Execute tools from the Tools Panel

## Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **3D Graphics**: Three.js, @react-three/fiber, @react-three/drei
- **Styling**: Tailwind CSS, shadcn/ui components
- **AI Integration**: xAI Grok-3-beta API
- **State Management**: React hooks, React Query
- **Notifications**: Sonner toast system

## Development

### Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── InfiniteCanvas.tsx
│   ├── DraggableAIInterface.tsx
│   └── ...
├── services/           # Business logic
│   ├── aiService.ts    # AI integration
│   └── toolSystem.ts   # Dynamic tool system
├── pages/              # Page components
└── hooks/              # Custom React hooks
```

### Key Components

- **InfiniteCanvas**: The main 3D rendering engine
- **AIService**: Handles communication with Grok-3-beta
- **ToolSystem**: Dynamic tool creation and execution
- **DraggableAIInterface**: User interface for AI interactions

### Building for Production

```bash
npm run build
```

The built application will be in the `dist/` directory, ready for deployment.

## Deployment

This app can be deployed to any static hosting service:

- **Netlify**: Connect your GitHub repo for automatic deployments
- **Vercel**: Deploy with zero configuration
- **GitHub Pages**: Use the built files from `dist/`
- **Any CDN**: Upload the `dist/` folder contents

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have questions:
- Check the browser console for error messages
- Ensure your xAI API key is valid and has sufficient credits
- Verify that your browser supports WebGL for 3D rendering

---

*Built with ❤️ using React, Three.js, and the power of AI*
