import { PortableText } from "@portabletext/react";

export const portableTextComponents = {
  types: {
    listGroup: ({ value }) => {
      const ListTag = value.listType === "bullet" ? "ul" : "ol";
      return (
        <ListTag className="my-4 pl-8">
          {value.items.map((item, index) => (
            <li key={index} className="mb-2">
              <PortableText value={item} components={portableTextComponents} />
            </li>
          ))}
        </ListTag>
      );
    },
  },
  block: {
    normal: ({ children }) => <p className="mb-4">{children}</p>,
    // Add other block styles as needed (h1, h2, blockquote, etc.)
  },
  // Add marks or other customizations here
};
