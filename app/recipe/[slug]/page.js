import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { blocksToLines } from "@/utils/blocksToLines";

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

  const ingredientLines = blocksToLines(recipe.ingredients);
  const instructionLines = blocksToLines(recipe.cookingInstructions);

  return (
    <article className="space-y-6">
      <Card>
        {recipe.image && (
          <img
            src={urlFor(recipe.image).url()}
            alt={recipe.name}
            className="object-cover w-full h-64 rounded-t"
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
          <strong>Author:</strong> {recipe.author || "Unknown"}
        </p>
        <Link href={recipe.source}>
          <strong>Source:</strong>{" "}
          <span className="underline">{recipe.source}</span>
        </Link>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Ingredients</h2>
        <ul className="pl-6 space-y-2 list-disc">
          {ingredientLines.map((line, index) => (
            <li key={index} className="text-gray-700">
              {line}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Cooking Instructions</h2>
        <ol className="pl-6 space-y-2 list-decimal">
          {instructionLines.map((line, index) => (
            <li key={index} className="text-gray-700">
              {line}
            </li>
          ))}
        </ol>
      </section>

      <Button asChild variant="link">
        <Link href="/">Back to recipes</Link>
      </Button>
    </article>
  );
}
