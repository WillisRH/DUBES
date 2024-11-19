'use client';

import React, { useRef, useState } from 'react';

const Canvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current!;
        const context = canvas.getContext('2d')!;
        context.beginPath();
        context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setIsDrawing(true);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current!;
        const context = canvas.getContext('2d')!;
        context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        context.stroke();
    };

    const stopDrawing = () => {
        const canvas = canvasRef.current!;
        const context = canvas.getContext('2d')!;
        context.closePath();
        setIsDrawing(false);
    };

    const saveDrawing = async () => {
        const canvas = canvasRef.current!;
        const dataUrl = canvas.toDataURL(); // Convert canvas to Base64
        const response = await fetch('/api/save-drawing', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: dataUrl }),
        });

        const result = await response.json();
        alert(result.message);
    };

    return (
        <div className="flex flex-col items-center">
            <canvas
                ref={canvasRef}
                width={500}
                height={500}
                style={{ border: '1px solid black' }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
            ></canvas>
            <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={saveDrawing}
            >
                Save Drawing
            </button>
        </div>
    );
};

export default Canvas;
