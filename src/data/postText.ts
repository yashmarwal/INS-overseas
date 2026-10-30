// How a journal post's text is split into paragraphs and which of them are headings. The post page and the build script use the same rule.
export const postParagraphs = (content: string) => content.split("\n\n").map((p) => p.trim()).filter(Boolean);
export const isPostHeading = (para: string) => para.length < 70 && !para.endsWith(".") && !para.endsWith(",") && !para.includes("—");
