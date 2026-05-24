import type { ComponentType } from "react";
import type { LayoutConfig } from "@/lib/resume/layout-schema";
import type { ResumeContent, TemplateId } from "@/lib/resume/schema";

/** Props every resume template component receives */
export type ResumeTemplateProps = {
  content: ResumeContent;
  layout: LayoutConfig;
};

export type TemplateDefinition = {
  id: TemplateId;
  name: string;
  description: string;
  /** Reference for this template variant */
  referenceUrl?: string;
  /** CSS class applied to the `.resume-page` wrapper */
  pageClassName: string;
  /** Whether layout can be customized in the browser */
  layoutConfigurable: boolean;
  component: ComponentType<ResumeTemplateProps>;
};
