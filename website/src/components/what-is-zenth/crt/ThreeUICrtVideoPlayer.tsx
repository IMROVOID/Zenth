'use client';

import React, { useEffect, useRef, useState } from 'react';
import { siteConfig } from '@/config';
import { WebGLBacklight } from '../backlight';
import { useCrtRenderer } from './useCrtRenderer';

export interface ThreeUICrtVideoPlayerProps {
  className?: string;
}

export function ThreeUICrtVideoPlayer({ className = '' }: ThreeUICrtVideoPlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number>(16 / 9);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      if (video.videoWidth && video.videoHeight) {
        setAspectRatio(video.videoWidth / video.videoHeight);
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    if (video.readyState >= 1) handleLoadedMetadata();

    video.play().catch(() => {});

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  useCrtRenderer(canvasRef, videoRef);

  return (
    <div className={`relative w-full max-w-5xl mx-auto px-2 sm:px-6 my-8 sm:my-14 ${className}`.trim()}>
      <video
        ref={videoRef}
        src={siteConfig.whatIsZenth.videoSrc}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="hidden"
      />

      <WebGLBacklight position="top" />

      <div
        className="absolute -top-4 sm:-top-7 left-1/2 -translate-x-1/2 w-[85%] sm:w-[90%] h-6 sm:h-9 pointer-events-none z-10 filter blur-[8px] opacity-90"
        style={{
          background:
            'radial-gradient(ellipse 65% 100% at 50% 100%, rgba(255,255,255,0.95) 0%, rgba(120,255,185,0.8) 18%, rgba(46,224,125,0.45) 40%, rgba(24,150,92,0.1) 68%, transparent 85%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-20 w-full rounded-[20px] sm:rounded-[26px] md:rounded-[30px] bg-black border-0 shadow-[0_30px_100px_rgba(0,0,0,0.98)] overflow-hidden pointer-events-none select-none">
        <div
          className="absolute top-0 left-0 right-0 h-[1.5px] z-30 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, transparent 8%, rgba(24,150,92,0.3) 16%, rgba(46,224,125,0.85) 30%, #FFFFFF 50%, rgba(46,224,125,0.85) 70%, rgba(24,150,92,0.3) 84%, transparent 92%, transparent 100%)',
          }}
        />

        <div
          className="relative w-full bg-black flex items-center justify-center overflow-hidden rounded-[19px] sm:rounded-[25px] md:rounded-[29px]"
          style={{ aspectRatio: `${aspectRatio}` }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full block object-contain select-none bg-black pointer-events-none"
          />
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-[1.5px] z-30 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, transparent 8%, rgba(24,150,92,0.3) 16%, rgba(46,224,125,0.85) 30%, #FFFFFF 50%, rgba(46,224,125,0.85) 70%, rgba(24,150,92,0.3) 84%, transparent 92%, transparent 100%)',
          }}
        />
      </div>

      <div
        className="absolute -bottom-4 sm:-bottom-7 left-1/2 -translate-x-1/2 w-[85%] sm:w-[90%] h-6 sm:h-9 pointer-events-none z-10 filter blur-[8px] opacity-90"
        style={{
          background:
            'radial-gradient(ellipse 65% 100% at 50% 0%, rgba(255,255,255,0.95) 0%, rgba(120,255,185,0.8) 18%, rgba(46,224,125,0.45) 40%, rgba(24,150,92,0.1) 68%, transparent 85%)',
        }}
        aria-hidden="true"
      />

      <WebGLBacklight position="bottom" />
    </div>
  );
}

export default ThreeUICrtVideoPlayer;
