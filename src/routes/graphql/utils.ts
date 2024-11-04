export const collectBy = <ItemType>(
  items: ItemType[],
  keySelector: (item: ItemType) => string,
) =>
  items.reduce<Record<string, ItemType[]>>((accumulator, currentItem) => {
    const key = keySelector(currentItem);
    const group = accumulator[key] || [];
    group.push(currentItem);
    return { ...accumulator, [key]: group };
  }, {});

export const indexBy = <ItemType>(
  items: ItemType[],
  keySelector: (item: ItemType) => string,
) => Object.fromEntries(items.map((item) => [keySelector(item), item]));
