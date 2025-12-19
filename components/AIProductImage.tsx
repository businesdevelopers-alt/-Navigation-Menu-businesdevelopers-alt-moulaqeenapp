
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Loader2, Sparkles, AlertTriangle } from 'lucide-react';

interface AIProductImageProps {
  src?: string;
  alt: string;
  description: string;
  className?: string;
}

const AIProductImage: React.FC<AIProductImageProps> = ({ src, alt, description, className }) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateAIImage = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setIsLoading(true);
    
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API Key missing");

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Professional industrial product photography of a robotic hardware component named "${alt}". ${description}. Studio lighting, clean dark technical background, 8k resolution, cinematic lighting, sharp details, blue and orange highlights, futuristic engineering aesthetic.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [{ parts: [{ text: prompt }] }],
      });

      let found = false;
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          setCurrentSrc(`data:image/png;base64,${base64Data}`);
          setError(false);
          found = true;
          break;
        }
      }
      if (!found) throw new Error("No image data in response");
    } catch (err) {
      console.error("AI Image Generation failed:", err);
      setError(true);
    } finally {
      setIsGenerating(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!src) {
      generateAIImage();
    } else {
      setCurrentSrc(src);
    }
  }, [src, alt]);

  const handleImageError = () => {
    if (!error && !isGenerating) {
        generateAIImage();
    } else {
        setError(true);
    }
  };

  if (isLoading || isGenerating) {
    return (
      <div className={`flex flex-col items-center justify-center bg-[#0D1117] border border-white/5 gap-3 p-8 ${className}`}>
        <div className="relative">
          <Loader2 className="animate-spin text-accent" size={32} />
          <Sparkles className="absolute -top-1 -right-1 text-highlight animate-pulse" size={14} />
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[9px] font-mono text-accent animate-pulse uppercase tracking-[0.2em] font-black">AI System Synthesis</span>
          <span className="text-[8px] font-mono text-gray-600 uppercase tracking-widest">Generating High-Fidelity Visual...</span>
        </div>
      </div>
    );
  }

  if (error && !currentSrc) {
    return (
      <div className={`flex flex-col items-center justify-center bg-red-500/5 border border-red-500/20 gap-2 p-8 ${className}`}>
        <AlertTriangle className="text-red-500 opacity-50" size={24} />
        <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Visual Link Interrupted</span>
      </div>
    );
  }

  return (
    <img 
      src={currentSrc} 
      alt={alt} 
      className={className}
      onError={handleImageError}
      loading="lazy"
    />
  );
};

export default AIProductImage;