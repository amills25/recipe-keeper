"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function FilterForm({
  recipes,
  cuisines,
  meals,
  onFilterChange,
}) {
  const [cuisine, setCuisine] = useState("all");
  const [meal, setMeal] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Filter recipes based on current filters
    let filteredRecipes = recipes;

    if (cuisine !== "all") {
      filteredRecipes = filteredRecipes.filter(
        (recipe) => recipe.cuisine === cuisine
      );
    }

    if (meal !== "all") {
      filteredRecipes = filteredRecipes.filter(
        (recipe) => recipe.meal === meal
      );
    }

    if (search.trim() !== "") {
      filteredRecipes = filteredRecipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    onFilterChange(filteredRecipes);
  }, [cuisine, meal, search, recipes, onFilterChange]);

  const clearFilters = () => {
    setCuisine("all");
    setMeal("all");
    setSearch("");
  };

  return (
    <div className="p-8 border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl">
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <h2 className="text-xl font-semibold text-gray-800">
          Find Your Perfect Recipe
        </h2>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col">
          <Label className="mb-2 text-sm font-medium text-gray-700">
            Search Recipes
          </Label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search by recipe name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 border-gray-200 rounded-lg focus:border-orange-300 focus:ring-orange-200"
            />
            <svg
              className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col">
            <Label className="mb-2 text-sm font-medium text-gray-700">
              Cuisine Type
            </Label>
            <Select value={cuisine} onValueChange={setCuisine}>
              <SelectTrigger className="border-gray-200 rounded-lg focus:border-orange-300 focus:ring-orange-200">
                <SelectValue placeholder="All Cuisines" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cuisines</SelectItem>
                {cuisines.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col">
            <Label className="mb-2 text-sm font-medium text-gray-700">
              Meal Type
            </Label>
            <Select value={meal} onValueChange={setMeal}>
              <SelectTrigger className="border-gray-200 rounded-lg focus:border-orange-300 focus:ring-orange-200">
                <SelectValue placeholder="All Meals" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Meals</SelectItem>
                {meals.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            className="px-6 py-2 text-sm font-medium text-orange-600 transition-colors duration-200 rounded-lg hover:text-orange-700 hover:bg-orange-50 hover:cursor-pointer"
            onClick={clearFilters}
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </div>
  );
}
