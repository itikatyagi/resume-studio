"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EntryOrderActions({
  index,
  total,
  onMove,
}: {
  index: number;
  total: number;
  onMove: (dir: -1 | 1) => void;
}) {
  if (total <= 1) return null;

  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={index <= 0}
        onClick={() => onMove(-1)}
        aria-label="Move entry up"
      >
        <ChevronUp className="size-4" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={index >= total - 1}
        onClick={() => onMove(1)}
        aria-label="Move entry down"
      >
        <ChevronDown className="size-4" />
      </Button>
    </div>
  );
}
