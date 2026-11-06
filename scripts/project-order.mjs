// Shared by the homepage and project-to-project navigation.
// Add a slug here to place it explicitly; unlisted new projects follow in content order.
const projectOrder = [
  'spatial-tinting',
  'sleepwalk',
  'dear-little-alice',
  'last-call',
  'melodic-function',
  'makeup-class',
  'line-by-line',
  'to-rei',
  'dismember',
];

export function orderProjects(projects) {
  const ranks = new Map(projectOrder.map((slug, index) => [slug, index]));
  return [...projects].sort((a, b) =>
    (ranks.get(a.slug) ?? projectOrder.length) - (ranks.get(b.slug) ?? projectOrder.length));
}
