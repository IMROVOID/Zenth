'use client';

import React from 'react';
import { IllustrationProps } from '../types';
import { imagePath } from '@/config/assets';

export function RealTimeAnalyticsIllustration({ className = '' }: IllustrationProps) {
  const exchangeLogos = [
    { name: 'Binance', file: 'logos/binance.svg' },
    { name: 'Coinbase', file: 'logos/coinbase.svg' },
    { name: 'OKX', file: 'logos/okx.svg' },
    { name: 'KuCoin', file: 'logos/kucoin.svg' },
    { name: 'Bitget', file: 'logos/bitget.svg' },
    { name: 'XT.com', file: 'logos/xt.svg' },
  ] as const;

  const rows = [
    exchangeLogos.slice(0, 3),
    exchangeLogos.slice(3),
  ];

  return (
    <div
      className={`relative w-full h-full min-h-[120px] sm:min-h-[140px] flex items-center justify-center select-none pointer-events-none ${className}`.trim()}
    >
      {/* Floating Offset Grid of Exchange Badges using local SVGs in /icons */}
      <div className="relative z-10 flex flex-col gap-2.5 sm:gap-3 md:gap-2.5 lg:gap-2 xl:gap-2.5 items-center">
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} className="flex items-center gap-2 sm:gap-3 md:gap-2.5 lg:gap-2 xl:gap-3.5">
            {row.map((exchange, idx) => (
              <div
                key={exchange.name}
                className="w-12 h-12 sm:w-13 sm:h-13 md:w-12 md:h-12 lg:w-11 lg:h-11 xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 rounded-full flex items-center justify-center bg-white/[0.05] backdrop-blur-md border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] p-2.5 sm:p-3 md:p-2.5 lg:p-2.5 xl:p-2.5 transition-all duration-300"
                title={exchange.name}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePath(exchange.file)}
                  alt={exchange.name}
                  className="w-5.5 h-5.5 sm:w-6 sm:h-6 md:w-5.5 md:h-5.5 lg:w-5 lg:h-5 xl:w-5 xl:h-5 2xl:w-5.5 2xl:h-5.5 object-contain brightness-0 invert opacity-90 transition-all duration-300"
                  loading="lazy"
                />
              </div>
            ))}
            {rowIdx === 1 && (
              <div className="w-12 h-12 sm:w-13 sm:h-13 md:w-12 md:h-12 lg:w-11 lg:h-11 xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 rounded-full flex items-center justify-center border border-dashed border-white/20 bg-white/[0.04] backdrop-blur-md text-white/80 text-[11px] sm:text-xs md:text-[11px] lg:text-[10.5px] xl:text-[11px] font-mono font-bold shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] transition-all duration-300">
                +6
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default RealTimeAnalyticsIllustration;
