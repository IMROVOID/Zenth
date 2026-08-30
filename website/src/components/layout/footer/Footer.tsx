'use client';

import React, { useState } from 'react';
import { footerConfig } from '@/config/footer';
import { FooterProps, LegalDocType } from './types';
import { FooterBrand } from './FooterBrand';
import { FooterNavGrid } from './FooterNavGrid';
import { FooterLegalDisclaimer } from './FooterLegalDisclaimer';
import { FooterBottomBar } from './FooterBottomBar';
import { LegalModal } from './LegalModal';

export function Footer({ className = '', config = footerConfig }: FooterProps) {
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [activeLegalDoc, setActiveLegalDoc] = useState<LegalDocType>('privacy');

  const handleOpenLegalModal = (docType: LegalDocType) => {
    setActiveLegalDoc(docType);
    setIsLegalModalOpen(true);
  };

  const handleCloseLegalModal = () => {
    setIsLegalModalOpen(false);
  };

  const handleSwitchLegalDoc = (docType: LegalDocType) => {
    setActiveLegalDoc(docType);
  };

  return (
    <footer
      id="footer"
      className={`w-full pt-12 sm:pt-16 pb-8 sm:pb-10 px-3 sm:px-10 xl:px-14 relative z-40 overflow-hidden ${className}`.trim()}
    >
      <div className="w-full max-w-[96%] xl:max-w-[95%] 2xl:max-w-[1760px] mx-auto flex flex-col gap-8 sm:gap-10 relative z-10">
        {/* Top Section: Brand on Left, Discovery Grid on Right */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 sm:gap-10 lg:gap-14">
          <FooterBrand
            tagline={config.tagline}
            badges={config.badges}
            className="w-full lg:w-1/4 flex-shrink-0"
          />

          <FooterNavGrid
            columns={config.columns}
            onOpenLegalModal={handleOpenLegalModal}
            className="w-full lg:w-3/4 flex-grow min-w-0"
          />
        </div>

        {/* Middle Section: Compact Legal Notice & $1,000 Hard Cap */}
        <FooterLegalDisclaimer
          title={config.disclaimer.title}
          description={config.disclaimer.description}
          notionalCapText={config.disclaimer.notionalCapText}
        />

        {/* Bottom Section: Copyright, ROVOID Attribution, Legal Links */}
        <FooterBottomBar
          attribution={config.attribution}
          onOpenLegalModal={handleOpenLegalModal}
        />
      </div>

      {/* Accessible Interactive Legal Modal (Privacy Policy & Terms of Service) */}
      <LegalModal
        isOpen={isLegalModalOpen}
        activeDoc={activeLegalDoc}
        onClose={handleCloseLegalModal}
        onSwitchDoc={handleSwitchLegalDoc}
        config={config.legalModal}
      />
    </footer>
  );
}

export default Footer;
