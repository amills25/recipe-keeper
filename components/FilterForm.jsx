"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function FilterForm({
  initialCuisine,
  initialMeal,
  cuisines,
  meals,
}) {
  // Use "all" as the sentinel value for the default option.
  const [cuisine, setCuisine] = useState(
    initialCuisine ? initialCuisine : "all"
  );
  const [meal, setMeal] = useState(initialMeal ? initialMeal : "all");
  const router = useRouter();

  const applyFilters = () => {
    const params = new URLSearchParams();
    // Only add filter parameters if they aren't "all".
    if (cuisine && cuisine !== "all") {
      params.set("cuisine", cuisine);
    }
    if (meal && meal !== "all") {
      params.set("meal", meal);
    }
    const query = params.toString();
    router.push(query ? `/?${query}` : "/");
  };

  const clearFilters = () => {
    setCuisine("all");
    setMeal("all");
    router.push("/");
  };

  return (
    <div className="flex flex-col space-y-4 p-4 rounded border">
      <div className="flex space-x-4">
        <div className="flex flex-col">
          <Label>Cuisine</Label>
          <Select value={cuisine} onValueChange={setCuisine}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {cuisines.map(function (c) {
                return (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col">
          <Label>Meal</Label>
          <Select value={meal} onValueChange={setMeal}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {meals.map(function (m) {
                return (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex space-x-4">
        <Button onClick={applyFilters}>Apply</Button>
        <Button variant="destructive" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>
    </div>
  );
}
