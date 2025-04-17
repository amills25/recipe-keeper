"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
  const [search, setSearch] = useState("");
  const router = useRouter();

  const applyFilters = () => {
    const params = new URLSearchParams();
    // Only add filter parameters if they aren't "all" or empty.
    if (cuisine && cuisine !== "all") {
      params.set("cuisine", cuisine);
    }
    if (meal && meal !== "all") {
      params.set("meal", meal);
    }
    if (search.trim() !== "") {
      params.set("search", search.trim());
    }
    const query = params.toString();
    router.push(query ? `/?${query}` : "/");
  };

  const clearFilters = () => {
    setCuisine("all");
    setMeal("all");
    setSearch("");
    router.push("/");
  };

  return (
    <div className="flex flex-col p-4 space-y-4 border rounded">
      <div className="flex flex-col">
        <Label>Search</Label>
        <Input
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex flex-col space-y-4 md:flex-row md:space-x-4">
        <div className="flex flex-col">
          <Label>Cuisine</Label>
          <Select value={cuisine} onValueChange={setCuisine}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {cuisines.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
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
              {meals.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex space-x-4">
        <Button className="hover:cursor-pointer" onClick={applyFilters}>
          Apply
        </Button>
        <Button
          className="hover:cursor-pointer"
          variant="destructive"
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
}
