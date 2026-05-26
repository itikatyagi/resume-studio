import type { TemplateId } from "@/lib/resume/schema";
import { UniversalLayout } from "./templates/configurable";
import type { TemplateDefinition } from "./types";

const UNIVERSAL_TEMPLATE: Omit<TemplateDefinition, "id" | "name" | "description"> =
  {
    pageClassName: "resume-page-universal",
    layoutConfigurable: true,
    component: UniversalLayout,
  };

/**
 * Single universal renderer — themes + layoutConfig control all visual variants.
 */
export const TEMPLATE_REGISTRY: Record<TemplateId, TemplateDefinition> = {
  "universal-v1": {
    id: "universal-v1",
    name: "Universal",
    description: "Fully customizable — pick a theme and tune layout, colors, fonts",
    ...UNIVERSAL_TEMPLATE,
  },
  "novo-15-v1": {
    id: "novo-15-v1",
    name: "Professional Blue",
    description: "Legacy id → novo-blue theme",
    referenceUrl:
      "https://novoresume.com/editor/resume/ace68500-5fe6-11ef-a2b4-2f978d0b172a",
    ...UNIVERSAL_TEMPLATE,
  },
  "default-v1": {
    id: "default-v1",
    name: "Classic Serif",
    description: "Legacy id → classic-serif theme",
    ...UNIVERSAL_TEMPLATE,
  },
  "itika-v1": {
    id: "itika-v1",
    name: "Professional Red",
    description: "Legacy id → itika-pro theme",
    ...UNIVERSAL_TEMPLATE,
    layoutConfigurable: false,
  },
};

export const TEMPLATE_LIST = Object.values(TEMPLATE_REGISTRY);

export function getTemplate(id: TemplateId): TemplateDefinition {
  return TEMPLATE_REGISTRY[id];
}

export function getTemplateLabel(id: TemplateId): string {
  return TEMPLATE_REGISTRY[id]?.name ?? id;
}

export function isTemplateId(value: string): value is TemplateId {
  return value in TEMPLATE_REGISTRY;
}
