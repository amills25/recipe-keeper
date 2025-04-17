export const blocksToLines = (blocks) => {
  if (!blocks) return [];
  return blocks
    .flatMap((block) => block.children.map((child) => child.text))
    .flatMap((text) => text.split("\n"))
    .filter((line) => line.trim() !== "");
};
