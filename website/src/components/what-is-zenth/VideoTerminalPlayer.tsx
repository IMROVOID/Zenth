'use client';

import React, { useRef } from 'react';
import { siteConfig } from '@/config';
import { WebGLBacklight } from './backlight';
import { CrtOverlay } from './CrtOverlay';

export interface VideoTerminalPlayerProps {
  className?: string;
}

export function VideoTerminalPlayer({ className = '' }: VideoTerminalPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  return (
    <div className={`relative w-full max-w-5xl mx-auto px-2 sm:px-6 my-10 sm:my-16 ${className}`.trim()}>
      <WebGLBacklight position="top" />

      <div
        onClick={handleTogglePlay}
        className="relative z-20 w-full rounded-[18px] sm:rounded-[22px] md:rounded-[26px] bg-black border border-[#2FE07D]/25 shadow-[0_25px_90px_rgba(0,0,0,0.98),0_0_60px_rgba(46,224,125,0.12)] overflow-hidden transition-all duration-300 group cursor-pointer"
      >
        <div
          className="absolute top-0 left-0 right-0 h-[1.5px] z-30 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(24,150,92,0.3) 15%, rgba(46,224,125,0.85) 35%, #78FFB9 50%, rgba(46,224,125,0.85) 65%, rgba(24,150,92,0.3) 85%, transparent 100%)',
          }}
        />

        <div className="relative w-full bg-black flex items-center justify-center overflow-hidden rounded-[17px] sm:rounded-[21px] md:rounded-[25px]">
          <video
            ref={videoRef}
            src={siteConfig.whatIsZenth.videoSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="w-full h-auto block object-contain select-none bg-black"
          />

          <CrtOverlay />
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-[1.5px] z-30 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(24,150,92,0.3) 15%, rgba(46,224,125,0.85) 35%, #78FFB9 50%, rgba(46,224,125,0.85) 65%, rgba(24,150,92,0.3) 85%, transparent 100%)',
          }}
        />
      </div>

      <WebGLBacklight position="bottom" />
    </div>
  );
}

export default VideoTerminalPlayer;
