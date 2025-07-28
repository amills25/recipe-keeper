import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PortableText } from "@portabletext/react";
import ShareButton from "@/components/ShareButton";

const portableTextComponents = {
  block: {
    // Ex. 1: customizing common block types
    h1: ({ children }) => (
      <h1 className="mb-4 text-4xl font-bold">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="mb-3 text-3xl font-semibold">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-2 text-2xl font-medium">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-2 text-xl font-medium">{children}</h4>
    ),
    normal: ({ children }) => <p className="mb-2 text-base">{children}</p>,
  },
  marks: {
    // Ex. 1: custom renderer for the em / italics decorator
    em: ({ children }) => <em className="italic">{children}</em>,
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    underline: ({ children }) => <span className="underline">{children}</span>,
  },
  list: {
    // Ex. 1: customizing common list types
    bullet: ({ children }) => (
      <ul className="pl-6 mb-4 space-y-1 list-disc">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="pl-6 mb-4 space-y-1 list-decimal">{children}</ol>
    ),
  },
  listItem: {
    // Ex. 1: customizing common list types
    bullet: ({ children }) => <li className="mb-1">{children}</li>,
    number: ({ children }) => <li className="mb-1">{children}</li>,
  },
};

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
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="overflow-hidden border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
        {recipe.image && (
          <div className="relative overflow-hidden h-80">
            <img
              src={urlFor(recipe.image).url()}
              alt={recipe.name}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="mb-2 text-4xl font-bold text-white drop-shadow-lg">
                {recipe.name}
              </h1>
            </div>
          </div>
        )}
        {!recipe.image && (
          <CardHeader className="pb-8">
            <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text">
              {recipe.name}
            </h1>
          </CardHeader>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="p-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-800">
              Recipe Details
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-orange-800 bg-orange-100 rounded-full">
                {recipe.cuisine}
              </span>
              <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-amber-100 text-amber-800">
                {recipe.meal}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center space-x-2 text-gray-600">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm">Prep: {recipe.prepTime}m</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                  />
                </svg>
                <span className="text-sm">Cook: {recipe.cookTime}m</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-800">Source Info</h3>
          </div>
          <div className="space-y-3">
            <div className="text-gray-600">
              <span className="font-medium">Author:</span>{" "}
              {recipe.author || "Unknown"}
            </div>
            {recipe.source && (
              <div>
                <Link
                  href={recipe.source}
                  className="inline-flex items-center space-x-1 text-orange-600 transition-colors duration-200 hover:text-orange-700"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  <span className="underline">View Original Recipe</span>
                </Link>
              </div>
            )}
            <div className="pt-2">
              <ShareButton recipeName={recipe.name} />
            </div>
          </div>
        </Card>
      </div>

      <section>
        <Card className="p-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <div className="flex items-center mb-6 space-x-2">
            <svg
              className="w-6 h-6 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800">Ingredients</h2>
          </div>
          <div className="prose prose-gray max-w-none">
            <PortableText
              value={recipe.ingredients}
              components={portableTextComponents}
            />
          </div>
        </Card>
      </section>

      <section>
        <Card className="p-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <div className="flex items-center mb-6 space-x-2">
            <svg
              className="w-6 h-6 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800">
              Cooking Instructions
            </h2>
          </div>
          <div className="prose prose-gray max-w-none">
            <PortableText
              value={recipe.cookingInstructions}
              components={portableTextComponents}
            />
          </div>
        </Card>
      </section>

      <div className="flex justify-center pt-8">
        <Button
          asChild
          className="px-8 py-3 font-semibold text-white transition-all duration-300 rounded-full shadow-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 hover:shadow-xl hover:scale-105"
        >
          <Link href="/">← Back to All Recipes</Link>
        </Button>
      </div>
    </div>
  );
}
