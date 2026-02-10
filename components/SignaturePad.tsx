import React, { useRef, useEffect, useState } from 'react';

interface SignaturePadProps {
  onSave: (signature: string) => void;
  className?: string;
  initialData?: string | null;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onSave, className, initialData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const parent = canvas.parentElement;
      if (parent) {
        // Set actual canvas size to match display size for correct resolution
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#000000'; // Default black ink
      }

      // Restore initial data if provided
      if (initialData && initialData.startsWith('data:image')) {
          const img = new Image();
          img.onload = () => {
              ctx?.drawImage(img, 0, 0);
              setHasSignature(true);
          };
          img.src = initialData;
      }
    }
  }, []); // Run once on mount

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent default scrolling behavior on touch devices
    if (e.type === 'touchstart') {
      // e.preventDefault(); // Note: this might need passive: false listener if added manually
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsDrawing(true);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { offsetX, offsetY } = getCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { offsetX, offsetY } = getCoordinates(e, canvas);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    
    if (!hasSignature) setHasSignature(true);
  };

  const stopDrawing = () => {
    if (isDrawing) {
        setIsDrawing(false);
        save();
    }
  };
  
  const save = () => {
      if (canvasRef.current && hasSignature) {
          onSave(canvasRef.current.toDataURL('image/png'));
      }
  }

  const clear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      setHasSignature(false);
      onSave('');
    }
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    
    const rect = canvas.getBoundingClientRect();
    return {
      offsetX: clientX - rect.left,
      offsetY: clientY - rect.top
    };
  };

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="w-full h-full touch-none cursor-crosshair bg-white rounded-xl"
        style={{ touchAction: 'none' }} // Critical for preventing scrolling while drawing
      />
      {hasSignature && (
        <button 
            type="button"
            onClick={clear}
            className="absolute top-2 right-2 p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 shadow-sm transition-colors z-10"
            title="Limpar assinatura"
        >
            <span className="material-symbols-outlined text-lg">delete</span>
        </button>
      )}
      {!hasSignature && (
         <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-300">
             <span className="text-sm">Assine aqui</span>
         </div>
      )}
    </div>
  );
};

export default SignaturePad;
