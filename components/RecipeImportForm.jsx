"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { client } from "@/sanity/lib/client";

export default function RecipeImportForm({ onSuccess, onCancel }) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [parsedRecipe, setParsedRecipe] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleParseUrl = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setError("");
    setParsedRecipe(null);

    try {
      const response = await fetch("/api/import-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to parse recipe");
      }

      setParsedRecipe(data.recipe);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRecipe = async () => {
    if (!parsedRecipe) return;

    setIsCreating(true);
    setError("");

    try {
      // Create recipe without image first
      const { imageUrl, ...recipeData } = parsedRecipe;
      
      let imageAsset = null;
      
      // If there's an image URL, upload it to Sanity
      if (imageUrl && imageUrl.trim()) {
        try {
          const imageResponse = await fetch(imageUrl);
          if (imageResponse.ok) {
            const imageBlob = await imageResponse.blob();
            imageAsset = await client.assets.upload('image', imageBlob, {
              filename: `${recipeData.slug.current}-image.jpg`
            });
          }
        } catch (imageError) {
          console.warn("Failed to upload image:", imageError);
          // Continue without image
        }
      }

      const result = await client.create({
        _type: "recipe",
        ...recipeData,
        ...(imageAsset && {
          image: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: imageAsset._id
            }
          }
        })
      });

      console.log("Recipe created:", result);
      onSuccess?.(result);
    } catch (err) {
      console.error("Error creating recipe:", err);
      setError("Failed to create recipe in Sanity");
    } finally {
      setIsCreating(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setParsedRecipe(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800">Import Recipe from URL</h2>
          </div>
          <p className="text-gray-600">
            Enter a recipe URL to automatically extract recipe information
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleParseUrl} className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2">Recipe URL</Label>
              <div className="flex space-x-2">
                <Input
                  type="url"
                  placeholder="https://example.com/recipe"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 border-gray-200 focus:border-orange-300 focus:ring-orange-200 rounded-lg"
                  required
                />
                <Button
                  type="submit"
                  disabled={isLoading || !url.trim()}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Parsing...</span>
                    </div>
                  ) : (
                    "Parse Recipe"
                  )}
                </Button>
              </div>
            </div>
          </form>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {parsedRecipe && (
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <h3 className="text-xl font-semibold text-gray-800">Parsed Recipe Data</h3>
            <p className="text-gray-600">Review and edit the extracted information before creating the recipe</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2">Recipe Name</Label>
                  <Input
                    value={parsedRecipe.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    className="border-gray-200 focus:border-orange-300 focus:ring-orange-200 rounded-lg"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2">Author</Label>
                  <Input
                    value={parsedRecipe.author}
                    onChange={(e) => handleFieldChange('author', e.target.value)}
                    className="border-gray-200 focus:border-orange-300 focus:ring-orange-200 rounded-lg"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2">Cuisine</Label>
                  <Input
                    value={parsedRecipe.cuisine}
                    onChange={(e) => handleFieldChange('cuisine', e.target.value)}
                    className="border-gray-200 focus:border-orange-300 focus:ring-orange-200 rounded-lg"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2">Meal Type</Label>
                  <select
                    value={parsedRecipe.meal}
                    onChange={(e) => handleFieldChange('meal', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-orange-300 focus:ring-orange-200"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Drink">Drink</option>
                    <option value="Sides">Sides</option>
                    <option value="Sauce">Sauce</option>
                  </select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2">Prep Time (minutes)</Label>
                  <Input
                    type="number"
                    value={parsedRecipe.prepTime}
                    onChange={(e) => handleFieldChange('prepTime', parseInt(e.target.value) || 0)}
                    className="border-gray-200 focus:border-orange-300 focus:ring-orange-200 rounded-lg"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2">Cook Time (minutes)</Label>
                  <Input
                    type="number"
                    value={parsedRecipe.cookTime}
                    onChange={(e) => handleFieldChange('cookTime', parseInt(e.target.value) || 0)}
                    className="border-gray-200 focus:border-orange-300 focus:ring-orange-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">Recipe Image URL</Label>
                <div className="space-y-2">
                  <Input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={parsedRecipe.imageUrl || ''}
                    onChange={(e) => handleFieldChange('imageUrl', e.target.value)}
                    className="border-gray-200 focus:border-orange-300 focus:ring-orange-200 rounded-lg"
                  />
                  {parsedRecipe.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={parsedRecipe.imageUrl}
                        alt="Recipe preview"
                        className="max-w-xs h-32 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    Enter a direct link to an image. The image will be automatically downloaded and uploaded to your recipe.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2">Ingredients Preview</Label>
              <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600 max-h-32 overflow-y-auto">
                {parsedRecipe.ingredients.map((ingredient, index) => (
                  <div key={index}>• {ingredient.children[0]?.text}</div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2">Instructions Preview</Label>
              <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600 max-h-32 overflow-y-auto">
                {parsedRecipe.cookingInstructions.map((instruction, index) => (
                  <div key={index} className="mb-1">{instruction.children[0]?.text}</div>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={onCancel}
                className="border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateRecipe}
                disabled={isCreating}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6"
              >
                {isCreating ? (
                  <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating...</span>
                  </div>
                ) : (
                  "Create Recipe"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}