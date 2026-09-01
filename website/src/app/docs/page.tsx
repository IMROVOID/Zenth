'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DocsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/documentation/');
  }, [router]);

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] flex items-center justify-center text-zinc-400 font-mono text-xs">
      <meta httpEquiv="refresh" content="0; url=/documentation/" />
      <p>Redirecting to documentation...</p>
    </div>
  );
}
