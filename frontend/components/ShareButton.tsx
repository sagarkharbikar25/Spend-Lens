"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  slug: string;
};

export function ShareButton({ slug }: Props) {
  const [copied, setCopied] = useState(false);

  const copyUrl = async () => {
    const url = `${window.location.origin}/audit/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={copyUrl}
      aria-label={copied ? "Link copied" : "Copy share link to clipboard"}
    >
      <span aria-live="polite">{copied ? "Copied!" : "Copy share link"}</span>
    </Button>
  );
}
