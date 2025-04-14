"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Clock, ChefHat } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RecipeCardProps {
  recipe: {
    id: string;
    title: string;
    image?: string;
    likes: number;
    cookTime: string;
    difficulty: string;
  };
  className?: string;
}

export function RecipeCard({ recipe, className }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe.id}`}>
      <Card className={cn("overflow-hidden hover:shadow-lg", className)}>
        <div className="relative aspect-[16/9]">
          {recipe.image ? (
            <Image
              src={recipe.image}
              alt={recipe.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted">
              <ChefHat className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="line-clamp-2 text-lg font-semibold">{recipe.title}</h3>
          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{recipe.cookTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <ChefHat className="h-4 w-4" />
              <span>{recipe.difficulty}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto flex items-center gap-1"
          >
            <Heart className="h-4 w-4" />
            <span>{recipe.likes}</span>
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
