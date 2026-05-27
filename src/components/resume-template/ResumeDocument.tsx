import { memo, type CSSProperties } from "react";
import type { ResumeDocument as ResumeDocumentType } from "@/lib/resume/schema";
import { isItikaLayout } from "@/lib/resume/is-itika-layout";
import {
  getEffectiveLayout,
  layoutToCssVariables,
} from "@/lib/resume/layout-utils";
import { getTemplate } from "./registry";

type ResumeDocumentProps = {
  document: ResumeDocumentType;
};

export const ResumeDocument = memo(function ResumeDocument({
  document,
}: ResumeDocumentProps) {
  const { content, templateId } = document;
  const template = getTemplate(templateId);
  const layout = getEffectiveLayout(document);
  const TemplateComponent = template.component;
  const cssVars = layoutToCssVariables(layout);
  const itikaClass = isItikaLayout(layout) ? "resume-page-itika" : "";
  const density = layout.density ?? "comfortable";

  return (
    <article
      className={`resume-page mx-auto flex min-h-[11in] flex-col bg-white text-black shadow-md print:shadow-none ${template.pageClassName} ${itikaClass}`.trim()}
      style={cssVars as CSSProperties}
      data-theme={layout.themeId}
      data-density={density}
    >
      <TemplateComponent content={content} layout={layout} />
    </article>
  );
});
