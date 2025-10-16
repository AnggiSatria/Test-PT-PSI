export function combineArrays(
  colors: string[],
  items: string[],
  tags: string[],
) {
  const result = [];
  const maxLen = Math.max(colors.length, items.length, tags.length);

  for (let i = 0; i < maxLen; i++) {
    const item = items[i % items.length];
    const color = colors[i % colors.length];
    const tag = tags[i % tags.length];
    result.push(`${capitalize(item)} ${capitalize(color)} ${capitalize(tag)}`);
  }

  return result;
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}
