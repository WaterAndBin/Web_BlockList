const unableList = [
  {
    hostname: "newtab",
    href: "chrome://newtab/",
    origin: "chrome://newtab",
  },
];

type UnableItem = (typeof unableList)[number];
type UnableKey = keyof UnableItem;

export const findUnableList = (url: string, key: UnableKey = "origin") => {
  return unableList.find((items) => items[key] === url);
};

export default unableList;
