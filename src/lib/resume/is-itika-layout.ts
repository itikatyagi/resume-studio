import type { LayoutConfig } from "./layout-schema";

export function isItikaLayout(layout: LayoutConfig): boolean {
  return layout.themeId === "itika-pro" || layout.profileStyle === "itika";
}
