import { getDefaultLayoutForTemplate } from "./layout-presets";
import { getEffectiveLayout } from "./layout-utils";
import { LEGACY_TEMPLATE_TO_THEME } from "./themes";
import { SCHEMA_VERSION, type ResumeDocument, type SchemaVersion } from "./schema";

/** Apply schema migrations when loading persisted data */
export function migrateResume(
  doc: ResumeDocument,
  targetVersion: SchemaVersion = SCHEMA_VERSION,
): ResumeDocument {
  let result: ResumeDocument =
    doc.schemaVersion === targetVersion
      ? doc
      : { ...doc, schemaVersion: targetVersion };

  if (!result.layoutConfig) {
    result = {
      ...result,
      layoutConfig: getDefaultLayoutForTemplate(result.templateId),
    };
  }

  if (result.templateId !== "universal-v1") {
    const themeId =
      result.layoutConfig?.themeId ??
      LEGACY_TEMPLATE_TO_THEME[result.templateId] ??
      "novo-blue";
    const migrated: ResumeDocument = {
      ...result,
      templateId: "universal-v1",
      layoutConfig: getEffectiveLayout({
        ...result,
        templateId: "universal-v1",
        layoutConfig: {
          ...(result.layoutConfig ?? getDefaultLayoutForTemplate(result.templateId)),
          themeId,
        },
      }),
    };
    result = migrated;
  }

  return result;
}
