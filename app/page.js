import Link from "next/link";
import FilterForm from "../components/FilterForm";
import RandomRecipeButton from "../components/RandomRecipeButton";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default async function Home({ searchParams }) {
  // Extract filters from searchParams.
  const params = await searchParams;
  const { cuisine, meal, search } = params || {};

  // Build a query to filter recipes using the provided filters.
  let recipeQuery = `*[_type == "recipe"`;
  if (cuisine && cuisine !== "all")
    recipeQuery += ` && cuisine == "${cuisine}"`;
  if (meal && meal !== "all") recipeQuery += ` && meal == "${meal}"`;
  if (search) recipeQuery += ` && name match "*${search}*"`;

  // Add image check and sorting
  recipeQuery += `]{
    ...,
    "hasImage": defined(image)  // Check if image exists
  } | order(hasImage desc, name asc)`; // Sort by image presence first, then name

  const recipes = await client.fetch(recipeQuery);

  // Fetch available options for cuisines.
  let availableCuisines;
  if (meal && meal !== "all") {
    availableCuisines = await client.fetch(
      '*[_type == "recipe" && meal == $meal]{cuisine}',
      { meal }
    );
  } else {
    availableCuisines = await client.fetch('*[_type == "recipe"]{cuisine}');
  }
  const cuisines = [...new Set(availableCuisines.map((r) => r.cuisine))];

  // Fetch available options for meals.
  let availableMeals;
  if (cuisine && cuisine !== "all") {
    availableMeals = await client.fetch(
      '*[_type == "recipe" && cuisine == $cuisine]{meal}',
      { cuisine }
    );
  } else {
    availableMeals = await client.fetch('*[_type == "recipe"]{meal}');
  }
  const meals = [...new Set(availableMeals.map((r) => r.meal))];

  return (
    <main className="space-y-8">
      <h1 className="text-3xl font-bold">All Recipes</h1>

      <FilterForm
        initialCuisine={cuisine || ""}
        initialMeal={meal || ""}
        cuisines={cuisines}
        meals={meals}
      />

      <RandomRecipeButton recipes={recipes} />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {recipes.map((recipe) => (
          <Link
            href={`/recipe/${recipe.slug.current}`}
            key={recipe.slug.current}
          >
            <Card className="transition-shadow cursor-pointer hover:shadow-lg">
              {recipe.image && (
                <img
                  src={urlFor(recipe.image).url()}
                  alt={recipe.name}
                  className="object-cover w-full h-64 rounded-t"
                />
              )}
              <CardHeader>
                <h2 className="text-xl font-semibold">{recipe.name}</h2>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {recipe.cuisine} &middot; {recipe.meal}
                </p>
                <p className="text-sm">Cook time: {recipe.cookTime} minutes</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
