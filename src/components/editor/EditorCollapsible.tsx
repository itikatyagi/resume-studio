"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function CollapsibleSectionCard({
  title,
  count,
  children,
  onAdd,
  addLabel,
  defaultOpen = true,
}: {
  title: string;
  count?: number;
  children: React.ReactNode;
  onAdd?: () => void;
  addLabel?: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
          aria-expanded={open}
        >
          {open ? (
            <ChevronDown className="size-4 shrink-0 text-zinc-500" />
          ) : (
            <ChevronRight className="size-4 shrink-0 text-zinc-500" />
          )}
          <CardTitle className="text-base">
            {title}
            {count !== undefined && count > 0 ? (
              <span className="ml-2 text-sm font-normal text-zinc-500">
                ({count})
              </span>
            ) : null}
          </CardTitle>
        </button>
        {onAdd && (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
          >
            <Plus className="size-4" />
            {addLabel ?? "Add"}
          </Button>
        )}
      </CardHeader>
      {open && <CardContent className="space-y-3 pt-0">{children}</CardContent>}
    </Card>
  );
}

export function CollapsibleEntry({
  title,
  subtitle,
  open,
  onOpenChange,
  defaultOpen = false,
  children,
}: {
  title: string;
  subtitle?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = open ?? internalOpen;

  function setOpen(next: boolean) {
    onOpenChange?.(next);
    if (open === undefined) setInternalOpen(next);
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50/50">
      <button
        type="button"
        onClick={() => setOpen(!isOpen)}
        className={cn(
          "flex w-full items-start gap-2 px-3 py-2.5 text-left transition-colors",
          "hover:bg-zinc-100/80",
        )}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <ChevronDown className="mt-0.5 size-4 shrink-0 text-zinc-500" />
        ) : (
          <ChevronRight className="mt-0.5 size-4 shrink-0 text-zinc-500" />
        )}
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-zinc-900">
            {title || "Untitled"}
          </span>
          {subtitle ? (
            <span className="block truncate text-xs text-zinc-500">{subtitle}</span>
          ) : null}
        </span>
      </button>
      {isOpen ? (
        <div className="space-y-3 border-t border-zinc-200 bg-white px-3 py-3">
          {children}
        </div>
      ) : null}
    </div>
  );
}

/** Track which entry ids are expanded in a list editor. */
export function useExpandedEntries(
  itemIds: string[],
  options?: { expandNewest?: boolean },
) {
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());

  function expand(id: string) {
    setOpenIds((prev) => new Set([...prev, id]));
  }

  function collapse(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function expandOnly(id: string) {
    setOpenIds(new Set([id]));
  }

  function isOpen(id: string) {
    if (openIds.has(id)) return true;
    if (openIds.size === 0 && itemIds.length === 1) return true;
    return false;
  }

  function onAddExpand(newId: string) {
    if (options?.expandNewest) {
      expandOnly(newId);
    } else {
      expand(newId);
    }
  }

  return { isOpen, toggle, expand, collapse, expandOnly, onAddExpand, setOpenIds };
}
