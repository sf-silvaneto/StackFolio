import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import imageCompression from 'browser-image-compression';
import toast from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';
import { X, Check, ZoomIn } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface Area {
  width: number;
  height: number;
  x: number;
  y: number;
}

interface ImageCropperModalProps {
  imageSrc: string;
  aspectRatio?: number; // 1 para Avatar, 16/9 para Capa
  onClose: () => void;
  onCropComplete: (croppedBase64: string) => void;
}

export default function ImageCropperModal({ imageSrc, aspectRatio = 1, onClose, onCropComplete }: ImageCropperModalProps) {
  const { colors } = useTheme() as any;
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropCompleteInternal = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = async (): Promise<void> => {
    if (!croppedAreaPixels) return;
    setIsProcessing(true);

    try {
      const image = await createImage(imageSrc);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Falha ao criar contexto do canvas');

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      // Converter Canvas para Blob
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg'));
      if (!blob) throw new Error('Falha na conversão da imagem');

      // Compressão da Imagem (Máx 200KB)
      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };
      
      const compressedFile = await imageCompression(blob as File, options);
      
      // Converter de volta para Base64 para enviar ao backend
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => {
        onCropComplete(reader.result as string);
        toast.success('Imagem otimizada com sucesso!');
      };
    } catch (error) {
      toast.error('Erro ao processar imagem.');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyItems: 'center', backdropFilter: 'blur(8px)', padding: '20px' }}>
      <div style={{ background: colors.card, width: '100%', maxWidth: '500px', borderRadius: '24px', overflow: 'hidden', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${colors.border}` }}>
          <h3 style={{ fontWeight: 800, margin: 0, color: colors.text }}>Ajustar Imagem</h3>
          <X onClick={onClose} style={{ cursor: 'pointer', color: colors.textMuted }} />
        </div>

        <div style={{ position: 'relative', width: '100%', height: '300px', background: '#000' }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onCropComplete={onCropCompleteInternal}
            onZoomChange={setZoom}
          />
        </div>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <ZoomIn color={colors.textMuted} size={20} />
            <input 
              type="range" 
              value={zoom} min={1} max={3} step={0.1} 
              onChange={(e) => setZoom(Number(e.target.value))} 
              style={{ width: '100%', accentColor: colors.primary }} 
            />
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <button onClick={onClose} disabled={isProcessing} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: `1px solid ${colors.border}`, background: 'transparent', color: colors.text, fontWeight: 700, cursor: 'pointer' }}>
              Cancelar
            </button>
            <button onClick={createCroppedImage} disabled={isProcessing} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: colors.primary, color: '#fff', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {isProcessing ? 'A processar...' : <><Check size={18} /> Confirmar</>}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// Função auxiliar para carregar a imagem para o canvas
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); 
    image.src = url;
  });