import { defineType } from "sanity";

export default defineType({
  name: "recipe",
  title: "Recipe",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
    },
    {
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "prepTime",
      title: "Prep Time",
      type: "number",
      description: "Time required to prep in minutes",
    },
    {
      name: "cookTime",
      title: "Cook Time",
      type: "number",
      description: "Time required to cook in minutes",
    },
    {
      name: "cuisine",
      title: "Cuisine",
      type: "string",
    },
    {
      name: "meal",
      title: "Meal",
      type: "string",
      options: {
        list: [
          { title: "Breakfast", value: "breakfast" },
          { title: "Lunch", value: "lunch" },
          { title: "Dinner", value: "dinner" },
          { title: "Snack", value: "snack" },
          { title: "Dessert", value: "dessert" },
        ],
      },
    },
    {
      name: "ingredients",
      title: "Ingredients",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "cookingInstructions",
      title: "Cooking Instructions",
      type: "array",
      of: [{ type: "block" }],
    },
  ],
});
