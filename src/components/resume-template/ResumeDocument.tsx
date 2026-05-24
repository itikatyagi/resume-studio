import { memo, type CSSProperties } from "react";
import type { ResumeDocument as ResumeDocumentType } from "@/lib/resume/schema";
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

  return (
    <article
      className={`resume-page mx-auto bg-white text-black shadow-md print:shadow-none ${template.pageClassName}`}
      style={cssVars as CSSProperties}
    >
      <TemplateComponent content={content} layout={layout} />
    </article>
  );
});
