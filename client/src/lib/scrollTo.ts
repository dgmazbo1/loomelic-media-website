/**
 * Scroll to a section by its ID, accounting for the fixed navbar height.
 * Uses absolute offsetTop (not getBoundingClientRect) so it works correctly
 * regardless of current scroll position.
 */
export function scrollToSection(id: string, offset = 80) {
  const el = document.getElementById(id);
  if (!el) return;

  // Walk up the DOM to get the true absolute offsetTop
  let top = 0;
  let node: HTMLElement | null = el;
  while (node) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }

  window.scrollTo({ top: Math.max(0, top - offset), behavior: "smooth" });
}
