export function groupListItems(blocks) {
  const grouped = [];
  let currentList = null;

  blocks?.forEach((block) => {
    if (block._type === "block" && block.listItem) {
      if (
        !currentList ||
        currentList.listType !== block.listItem ||
        currentList.level !== block.level
      ) {
        currentList = {
          _type: "listGroup",
          listType: block.listItem,
          level: block.level,
          items: [block],
        };
        grouped.push(currentList);
      } else {
        currentList.items.push(block);
      }
    } else {
      currentList = null;
      grouped.push(block);
    }
  });

  return grouped;
}
