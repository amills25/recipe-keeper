import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function RecipePage({ params }) {
  const { slug } = await params;

  const recipe = await client.fetch(
    `*[_type == "recipe" && slug.current == $slug][0]{
       name,
       image,
       prepTime,
       cookTime,
       author,
       source,
       cuisine,
       meal,
       cookingInstructions,
       ingredients
     }`,
    { slug }
  );

  if (!recipe) {
    return <div>Recipe not found.</div>;
  }

  return (
    <article className="space-y-6">
      <Card>
        {recipe.image && (
          <img
            src={urlFor(recipe.image).url()}
            alt={recipe.name}
            className="w-full h-64 object-cover rounded-t"
          />
        )}
        <CardHeader>
          <h1 className="text-3xl font-bold">{recipe.name}</h1>
        </CardHeader>
      </Card>

      <div className="space-y-2">
        <p>
          <strong>Cuisine:</strong> {recipe.cuisine}
        </p>
        <p>
          <strong>Meal:</strong> {recipe.meal}
        </p>
        <p>
          <strong>Prep Time:</strong> {recipe.prepTime} minutes
        </p>
        <p>
          <strong>Cook Time:</strong> {recipe.cookTime} minutes
        </p>
        <p>
          <strong>Author:</strong> {recipe.author}
        </p>
        <Link href={recipe.source}>
          <strong>Source:</strong>{" "}
          <span className="underline">{recipe.source}</span>
        </Link>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Ingredients</h2>
        <ul className="list-disc list-inside">
          {recipe.ingredients &&
            recipe.ingredients.map(function (block, index) {
              return (
                <li key={index}>
                  {block.children
                    ? block.children
                        .map(function (child) {
                          return child.text;
                        })
                        .join(" ")
                    : ""}
                </li>
              );
            })}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Cooking Instructions</h2>
        {recipe.cookingInstructions &&
          recipe.cookingInstructions.map(function (block, index) {
            return (
              <p key={index}>
                {block.children
                  ? block.children
                      .map(function (child) {
                        return child.text;
                      })
                      .join(" ")
                  : ""}
              </p>
            );
          })}
      </section>

      <Button asChild variant="link">
        <Link href="/">Back to recipes</Link>
      </Button>
    </article>
  );
}
