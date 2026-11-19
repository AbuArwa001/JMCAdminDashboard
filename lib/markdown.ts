/**
 * Utility to convert raw HTML tags into standard Markdown syntax.
 * Ensures consistent rendering across Web (React Markdown) and Mobile (Flutter Markdown).
 */
export function htmlToMarkdown(input: string): string {
  if (!input) return "";

  let text = input;

  // Only process if it appears to contain HTML tags
  if (text.includes("<") && text.includes(">")) {
    text = text
      .replace(/<h[1-2][^>]*>([\s\S]*?)<\/h[1-2]>/gi, "## $1\n\n")
      .replace(/<h[3-4][^>]*>([\s\S]*?)<\/h[3-4]>/gi, "### $1\n\n")
      .replace(/<h[5-6][^>]*>([\s\S]*?)<\/h[5-6]>/gi, "#### $1\n\n")
      .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, "> $1\n\n")
      .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "$1\n\n")
      .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "- $1\n")
      .replace(/<\/?(?:ul|ol|div)[^>]*>/gi, "\n")
      .replace(/<(?:strong|b)>([\s\S]*?)<\/(?:strong|b)>/gi, "**$1**")
      .replace(/<(?:em|i)>([\s\S]*?)<\/(?:em|i)>/gi, "*$1*")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "`$1`")
      .replace(/<[^>]+>/g, ""); // Strip any leftover unknown HTML tags

    // Decode HTML entities
    text = text
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");

    text = text.replace(/\n{3,}/g, "\n\n").trim();
  }

  return text;
}
