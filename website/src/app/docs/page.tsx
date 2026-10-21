'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { withBasePath } from '@/config/sitePaths';

export default function DocsRedirectPage() {
  const router = useRouter();
  const target = withBasePath('/documentation/');

  useEffect(() => {
    router.replace(target);
  }, [router, target]);

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] flex items-center justify-center text-zinc-400 font-mono text-xs">
      <meta httpEquiv="refresh" content={`0; url=${target}`} />
      <p>Redirecting to documentation...</p>
    </div>
  );
}
