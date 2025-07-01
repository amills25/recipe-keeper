"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function RandomRecipeButton({ recipes }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRandom = () => {
    if (recipes && recipes.length > 0) {
      setIsLoading(true);
      const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
      router.push(`/recipe/${randomRecipe.slug.current}`);
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleRandom}
      disabled={!recipes || recipes.length === 0 || isLoading}
      className="px-8 py-3 font-semibold text-white transition-all duration-300 rounded-full shadow-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Loading...</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2 hover:cursor-pointer">
          <span className="text-lg">🎲</span>
          <span>Surprise Me!</span>
        </div>
      )}
    </Button>
  );
}
