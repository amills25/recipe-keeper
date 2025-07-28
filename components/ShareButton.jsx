'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';

export default function ShareButton({ recipeName }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL to clipboard:', err);
    }
  };

  return (
    <Button 
      onClick={handleShare}
      size="sm"
      variant="outline"
      className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
    >
      <Share2 className="w-4 h-4 mr-2" />
      {copied ? 'Copied!' : 'Share Recipe'}
    </Button>
  );
}