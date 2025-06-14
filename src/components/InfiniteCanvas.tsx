import React, { useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, Text } from '@react-three/drei';
import { Vector3 } from 'three';
import { Plus, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CanvasObject {
  id: string;
  type: string;
  position: [number, number, number];
  code: string;
  props: any;
}

// Dynamic code executor for AI-generated objects
const ExecuteObjectCode = ({ object }: { object: CanvasObject }) => {
  try {
    // This would be where AI-generated code gets executed
    // For now, we'll render basic shapes based on type
    switch (object.type) {
      case 'cube':
        return (
          <mesh position={object.position}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={object.props.color || '#00ffff'} />
          </mesh>
        );
      case 'sphere':
        return (
          <mesh position={object.position}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color={object.props.color || '#ff00ff'} />
          </mesh>
        );
      case 'text':
        return (
          <Text
            position={object.position}
            fontSize={0.5}
            color={object.props.color || '#ffffff'}
          >
            {object.props.text || 'AI Generated'}
          </Text>
        );
      default:
        return null;
    }
  } catch (error) {
    console.error('Error executing object code:', error);
    return null;
  }
};

// Enhanced object executor for AI-generated code
const AIGeneratedObject = ({ object }: { object: CanvasObject }) => {
  try {
    if (object.code && object.metadata?.type === 'ai_generated_object') {
      // Try to execute AI-generated Three.js code
      const func = new Function('THREE', 'React', 'useFrame', object.code);
      return func(window.THREE, React, useFrame) || null;
    }
    return <ExecuteObjectCode object={object} />;
  } catch (error) {
    console.error('Error executing AI object:', error);
    return <ExecuteObjectCode object={object} />;
  }
};

const FloatingControls = ({ onAddObject }: { onAddObject: () => void }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      <Button
        onClick={onAddObject}
        className="w-12 h-12 rounded-full bg-cyan-500 hover:bg-cyan-600 text-black"
        size="icon"
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
};

const ObjectManager = ({ 
  objects, 
  selectedObject, 
  onSelectObject, 
  onDeleteObject 
}: {
  objects: CanvasObject[];
  selectedObject: string | null;
  onSelectObject: (id: string) => void;
  onDeleteObject: (id: string) => void;
}) => {
  if (!selectedObject) return null;

  const object = objects.find(obj => obj.id === selectedObject);
  if (!object) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 min-w-[300px]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-cyan-400 font-semibold">Object: {object.type}</h3>
        <Button
          onClick={() => onDeleteObject(object.id)}
          variant="destructive"
          size="sm"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      <div className="text-sm text-gray-300">
        <p>Position: {object.position.join(', ')}</p>
        <p>Type: {object.type}</p>
      </div>
    </div>
  );
};

const InfiniteCanvas = forwardRef<any, {}>((props, ref) => {
  const [objects, setObjects] = useState<CanvasObject[]>([]);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const sceneRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    addAIGeneratedObject: (code: string, metadata: any) => {
      const newObject: CanvasObject = {
        id: `ai_obj_${Date.now()}`,
        type: metadata?.type || 'ai_generated',
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        ],
        code,
        props: metadata || {}
      };
      setObjects(prev => [...prev, newObject]);
      console.log('Added AI-generated object:', newObject);
    },
    addObject: (object: any) => {
      setObjects(prev => [...prev, object]);
    },
    getScene: () => sceneRef.current,
    getObjects: () => objects
  }));

  const addRandomObject = useCallback(() => {
    const types = ['cube', 'sphere', 'text'];
    const colors = ['#00ffff', '#ff00ff', '#ffff00', '#ff0080', '#00ff80'];
    
    const newObject: CanvasObject = {
      id: `obj_${Date.now()}`,
      type: types[Math.floor(Math.random() * types.length)],
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      ],
      code: '', // This will be AI-generated code
      props: {
        color: colors[Math.floor(Math.random() * colors.length)],
        text: 'AI Generated Object'
      }
    };

    setObjects(prev => [...prev, newObject]);
    console.log('Added new object:', newObject);
  }, []);

  const deleteObject = useCallback((id: string) => {
    setObjects(prev => prev.filter(obj => obj.id !== id));
    setSelectedObject(null);
  }, []);

  const selectObject = useCallback((id: string) => {
    setSelectedObject(id);
  }, []);

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      {/* Three.js Canvas */}
      <Canvas
        ref={sceneRef}
        camera={{ position: [10, 10, 10], fov: 75 }}
        style={{ background: 'radial-gradient(circle, #1a0033 0%, #000000 100%)' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />

        {/* Grid */}
        <Grid
          position={[0, -5, 0]}
          args={[100, 100]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#333"
          sectionSize={10}
          sectionThickness={1}
          sectionColor="#666"
          fadeDistance={50}
          fadeStrength={1}
        />

        {/* Render all objects with enhanced AI support */}
        {objects.map((object) => (
          <group key={object.id}>
            {object.code && object.metadata?.type?.includes('ai') ? (
              <AIGeneratedObject object={object} />
            ) : (
              <ExecuteObjectCode object={object} />
            )}
          </group>
        ))}

        {/* Camera Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          zoomSpeed={0.6}
          panSpeed={0.8}
          rotateSpeed={0.4}
        />
      </Canvas>

      {/* UI Overlay */}
      <FloatingControls onAddObject={addRandomObject} />
      
      <ObjectManager
        objects={objects}
        selectedObject={selectedObject}
        onSelectObject={selectObject}
        onDeleteObject={deleteObject}
      />

      {/* Enhanced Header */}
      <div className="fixed top-4 left-4 z-50">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-1">
          AI Canvas Pro
        </h1>
        <p className="text-sm text-gray-400">
          Objects: {objects.length} | AI-Generated: {objects.filter(obj => obj.metadata?.type?.includes('ai')).length}
        </p>
      </div>

      {/* Status Bar */}
      <div className="fixed bottom-4 right-4 z-50 text-xs text-gray-400">
        <p>Click + to add objects • Drag to rotate • Scroll to zoom</p>
      </div>
    </div>
  );
});

InfiniteCanvas.displayName = 'InfiniteCanvas';

export default InfiniteCanvas;
