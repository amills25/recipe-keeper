"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function RandomRecipeButton({ recipes }) {
  const router = useRouter();

  const handleRandom = () => {
    if (recipes && recipes.length > 0) {
      const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
      router.push(`/recipe/${randomRecipe.slug.current}`);
    }
  };

  return <Button onClick={handleRandom}>Random Recipe</Button>;
}
