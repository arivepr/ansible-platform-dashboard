export const contentCounts = (content) => {
  const summary = {
    total_count: content ? content.length : 0,
    contents: { module: 0, role: 0, plugin: 0 }
  };

  if (content === undefined) {
    return summary;
  }

  for (const c of content) {
    if (c.content_type === 'role') {
      summary.contents.role++;
    } else if (c.content_type === 'module') {
      summary.contents.module++;
    } else {
      summary.contents.plugin++;
    }
  }

  return summary;
};
