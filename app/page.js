"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import FilterForm from "../components/FilterForm";
import RandomRecipeButton from "../components/RandomRecipeButton";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Home() {
  const [allRecipes, setAllRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        // Fetch all recipes
        const recipes = await client.fetch(`*[_type == "recipe"]{
          ...,
          "hasImage": defined(image)
        } | order(hasImage desc, name asc)`);

        // Get unique cuisines and meals
        const uniqueCuisines = [
          ...new Set(recipes.map((r) => r.cuisine).filter(Boolean)),
        ];
        const uniqueMeals = [
          ...new Set(recipes.map((r) => r.meal).filter(Boolean)),
        ];

        setAllRecipes(recipes);
        setFilteredRecipes(recipes);
        setCuisines(uniqueCuisines);
        setMeals(uniqueMeals);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleFilterChange = useCallback((filtered) => {
    setFilteredRecipes(filtered);
  }, []);

  if (loading) {
    return (
      <main className="space-y-8">
        <h1 className="text-3xl font-bold">All Recipes</h1>
        <div className="text-center">Loading recipes...</div>
      </main>
    );
  }

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="pb-2 mb-2 text-5xl font-bold text-transparent bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text">
          Discover Amazing Recipes
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-600">
          Explore our curated collection of delicious recipes from around the
          world
        </p>
      </div>

      <FilterForm
        recipes={allRecipes}
        cuisines={cuisines}
        meals={meals}
        onFilterChange={handleFilterChange}
      />

      <div className="flex justify-center">
        <RandomRecipeButton recipes={filteredRecipes} />
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredRecipes.map((recipe) => (
          <Link
            href={`/recipe/${recipe.slug.current}`}
            key={recipe.slug.current}
            className="group"
          >
            <Card className="h-full overflow-hidden transition-all duration-300 border-0 shadow-lg cursor-pointer hover:shadow-2xl hover:-translate-y-2 bg-white/80 backdrop-blur-sm flex flex-col">
              {recipe.image && (
                <div className="relative overflow-hidden h-56 flex-shrink-0">
                  <img
                    src={urlFor(recipe.image).url()}
                    alt={recipe.name}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/20 to-transparent group-hover:opacity-100" />
                </div>
              )}
              {!recipe.image && (
                <div className="h-56 flex-shrink-0 bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                  <div className="text-4xl text-orange-300">🍽️</div>
                </div>
              )}
              <div className="flex flex-col flex-1">
                <CardHeader className="pb-3 flex-shrink-0">
                  <h2 className="text-xl font-bold text-gray-800 transition-colors duration-300 group-hover:text-orange-600 line-clamp-2">
                    {recipe.name}
                  </h2>
                </CardHeader>
                <CardContent className="pt-0 flex-1 flex flex-col justify-between">
                  <div className="flex items-center mb-3 space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      {recipe.cuisine}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      {recipe.meal}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-auto">
                    <svg
                      className="w-4 h-4 mr-1"
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
                    {recipe.cookTime} minutes
                  </div>
                </CardContent>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl">🍽️</div>
          <h3 className="mb-2 text-xl font-semibold text-gray-700">
            No recipes found
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters to see more results
          </p>
        </div>
      )}
    </div>
  );
}
