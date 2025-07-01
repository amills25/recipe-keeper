"use client";

import { useRouter } from "next/navigation";
import RecipeImportForm from "@/components/RecipeImportForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ImportPage() {
  const router = useRouter();

  const handleSuccess = (recipe) => {
    // Redirect to the newly created recipe
    router.push(`/recipe/${recipe.slug.current}`);
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-4">
          Import Recipe
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Import recipes from your favorite cooking websites by simply pasting the URL
        </p>
      </div>

      <RecipeImportForm onSuccess={handleSuccess} onCancel={handleCancel} />

      <div className="text-center">
        <Button asChild variant="outline" className="border-orange-300 hover:bg-orange-50">
          <Link href="/">← Back to All Recipes</Link>
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">How it works</h3>
        <ul className="text-blue-700 space-y-2 text-sm">
          <li>• Paste a recipe URL from popular cooking websites</li>
          <li>• Our system will automatically extract recipe information</li>
          <li>• Review and edit the extracted data before saving</li>
          <li>• The recipe will be added to your collection instantly</li>
        </ul>
        <p className="text-blue-600 text-xs mt-3">
          Works best with structured recipe websites like AllRecipes, Food Network, Bon Appétit, and similar sites that use proper recipe markup.
        </p>
      </div>
    </div>
  );
}