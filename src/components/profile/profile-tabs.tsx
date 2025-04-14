"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RecipeCard } from "@/components/recipe/recipe-card";
import { CookbookCard } from "@/components/cookbook/cookbook-card";

interface ProfileTabsProps {
  userId: string;
}

export function ProfileTabs({ userId }: ProfileTabsProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  // Mock data - replace with real data fetching
  const recipes = [
    {
      id: "1",
      title: "Spaghetti Carbonara",
      description: "Classic Italian pasta dish",
      image: "/images/carbonara.jpg",
      cookTime: "30 mins",
      difficulty: "Medium",
    },
    // Add more mock recipes as needed
  ];

  const cookbooks = [
    {
      id: "1",
      title: "Italian Favorites",
      description: "Collection of classic Italian recipes",
      image: "/images/italian.jpg",
      recipeCount: 12,
    },
    // Add more mock cookbooks as needed
  ];

  return (
    <Tabs defaultValue="recipes" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="recipes">Recipes</TabsTrigger>
        <TabsTrigger value="liked">Liked</TabsTrigger>
        <TabsTrigger value="cookbooks">Cookbooks</TabsTrigger>
      </TabsList>
      <TabsContent value="recipes">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="liked">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="cookbooks">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cookbooks.map((cookbook) => (
            <CookbookCard key={cookbook.id} cookbook={cookbook} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
