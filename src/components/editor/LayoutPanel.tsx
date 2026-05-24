"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  FONT_FAMILIES,
  HEADING_STYLES,
  PROFILE_STYLES,
  SKILL_STYLES,
  type LayoutConfig,
} from "@/lib/resume/layout-schema";
import {
  getEffectiveLayout,
  resolveTypography,
} from "@/lib/resume/layout-utils";
import { LayoutSectionOrder } from "./LayoutSectionOrder";
import { THEME_LIST } from "@/lib/resume/themes";
import { useResumeStore } from "@/lib/resume/store";

export function LayoutPanel() {
  const document = useResumeStore((s) => s.document);
  const updateLayoutConfig = useResumeStore((s) => s.updateLayoutConfig);
  const applyTheme = useResumeStore((s) => s.applyTheme);
  const resetLayoutConfig = useResumeStore((s) => s.resetLayoutConfig);

  const layout = getEffectiveLayout(document);
  const typo = resolveTypography(layout);

  function applyLayout(patch: Partial<LayoutConfig>) {
    updateLayoutConfig(patch);
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Themes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-xs text-zinc-500">
            One universal template — pick a starting theme, then customize
            everything below.
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {THEME_LIST.map((theme) => {
              const active = layout.themeId === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => applyTheme(theme.id)}
                  className={`rounded-lg border p-2 text-left transition-colors ${
                    active
                      ? "border-violet-500 bg-violet-50 ring-1 ring-violet-500"
                      : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                  }`}
                >
                  <div
                    className="mb-2 flex h-6 overflow-hidden rounded"
                    aria-hidden
                  >
                    <span
                      className="flex-1"
                      style={{ backgroundColor: theme.layout.colors.headerBg }}
                    />
                    {theme.layout.structure === "header-sidebar-main" && (
                      <span
                        className="w-1/3"
                        style={{
                          backgroundColor: theme.layout.colors.sidebarBg,
                        }}
                      />
                    )}
                  </div>
                  <p className="text-xs font-medium text-zinc-800">
                    {theme.name}
                  </p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-base">Layout</CardTitle>
          <Button variant="outline" size="sm" onClick={resetLayoutConfig}>
            <RotateCcw className="size-4" />
            Reset
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs text-zinc-600">Structure</Label>
            <select
              value={layout.structure}
              onChange={(e) =>
                applyLayout({
                  structure: e.target.value as LayoutConfig["structure"],
                })
              }
              className="mt-1 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-sm"
            >
              <option value="header-sidebar-main">Sidebar + main</option>
              <option value="single-column">Single column</option>
            </select>
          </div>

          {layout.structure === "header-sidebar-main" && (
            <div>
              <Label className="text-xs text-zinc-600">
                Sidebar width ({layout.sidebarWidthPercent}%)
              </Label>
              <input
                type="range"
                min={24}
                max={48}
                value={layout.sidebarWidthPercent}
                onChange={(e) =>
                  applyLayout({
                    sidebarWidthPercent: Number(e.target.value),
                  })
                }
                className="mt-1 w-full"
              />
            </div>
          )}

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={layout.showHeader}
              onChange={(e) => applyLayout({ showHeader: e.target.checked })}
            />
            Show profile header
          </label>

          {layout.structure === "single-column" && (
            <div>
              <Label className="text-xs text-zinc-600">
                Page padding ({layout.pagePaddingIn ?? 0.5}in)
              </Label>
              <input
                type="range"
                min={0}
                max={100}
                value={(layout.pagePaddingIn ?? 0.5) * 100}
                onChange={(e) =>
                  applyLayout({ pagePaddingIn: Number(e.target.value) / 100 })
                }
                className="mt-1 w-full"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Typography & style</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs text-zinc-600">Font</Label>
            <select
              value={typo.fontFamily}
              onChange={(e) =>
                applyLayout({
                  typography: {
                    ...typo,
                    fontFamily: e.target.value as (typeof FONT_FAMILIES)[number],
                  },
                })
              }
              className="mt-1 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-sm"
            >
              {FONT_FAMILIES.map((f) => (
                <option key={f} value={f}>
                  {f.replace("-", " ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="text-xs text-zinc-600">
              Base size ({typo.baseSizePt}pt)
            </Label>
            <input
              type="range"
              min={9}
              max={12}
              step={0.5}
              value={typo.baseSizePt}
              onChange={(e) =>
                applyLayout({
                  typography: {
                    ...typo,
                    baseSizePt: Number(e.target.value),
                  },
                })
              }
              className="mt-1 w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-zinc-600">Profile header</Label>
              <select
                value={layout.profileStyle ?? "banner"}
                onChange={(e) =>
                  applyLayout({
                    profileStyle: e.target.value as (typeof PROFILE_STYLES)[number],
                  })
                }
                className="mt-1 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-sm"
              >
                <option value="banner">Colored banner</option>
                <option value="centered">Centered</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>
            <div>
              <Label className="text-xs text-zinc-600">Section headings</Label>
              <select
                value={layout.headingStyle ?? "caps-bar"}
                onChange={(e) =>
                  applyLayout({
                    headingStyle: e.target.value as (typeof HEADING_STYLES)[number],
                  })
                }
                className="mt-1 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-sm"
              >
                <option value="caps-bar">Caps + bar</option>
                <option value="underline">Underline</option>
                <option value="caps-plain">Caps plain</option>
                <option value="left-bar">Left accent bar</option>
              </select>
            </div>
            <div className="col-span-2">
              <Label className="text-xs text-zinc-600">Skills display</Label>
              <select
                value={layout.skillStyle ?? "boxes"}
                onChange={(e) =>
                  applyLayout({
                    skillStyle: e.target.value as (typeof SKILL_STYLES)[number],
                  })
                }
                className="mt-1 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-sm"
              >
                <option value="boxes">Boxed tags</option>
                <option value="comma">Comma list</option>
                <option value="dots">Bullet list</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Colors</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <ColorField
            label="Accent"
            value={layout.colors.accent}
            onChange={(accent) =>
              applyLayout({ colors: { ...layout.colors, accent } })
            }
          />
          <ColorField
            label="Header bg"
            value={layout.colors.headerBg}
            onChange={(headerBg) =>
              applyLayout({ colors: { ...layout.colors, headerBg } })
            }
          />
          <ColorField
            label="Header text"
            value={layout.colors.headerText}
            onChange={(headerText) =>
              applyLayout({ colors: { ...layout.colors, headerText } })
            }
          />
          <ColorField
            label="Sidebar bg"
            value={layout.colors.sidebarBg}
            onChange={(sidebarBg) =>
              applyLayout({ colors: { ...layout.colors, sidebarBg } })
            }
          />
          <ColorField
            label="Sidebar text"
            value={layout.colors.sidebarText}
            onChange={(sidebarText) =>
              applyLayout({ colors: { ...layout.colors, sidebarText } })
            }
          />
          <ColorField
            label="Main text"
            value={layout.colors.mainText}
            onChange={(mainText) =>
              applyLayout({ colors: { ...layout.colors, mainText } })
            }
          />
          <ColorField
            label="Muted text"
            value={layout.colors.mainMuted}
            onChange={(mainMuted) =>
              applyLayout({ colors: { ...layout.colors, mainMuted } })
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Sections</CardTitle>
        </CardHeader>
        <CardContent>
          <LayoutSectionOrder layout={layout} onApply={applyLayout} />
        </CardContent>
      </Card>
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Label className="text-xs text-zinc-600">{label}</Label>
      <div className="mt-1 flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="size-8 cursor-pointer rounded border border-zinc-200"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 rounded-md border border-zinc-200 px-2 py-1 text-xs"
        />
      </div>
    </div>
  );
}
