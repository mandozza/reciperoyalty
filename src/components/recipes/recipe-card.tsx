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
    description?: string;
    likes: number;
    cookTime: string;
    difficulty: 'easy' | 'medium' | 'hard';
    isLiked?: boolean;
  };
  className?: string;
  onLike?: (id: string) => void;
}

export function RecipeCard({ recipe, className, onLike }: RecipeCardProps) {
  const difficultyColor = {
    easy: "text-green-500",
    medium: "text-yellow-500",
    hard: "text-red-500",
  };

  return (
    <Link href={`/recipes/${recipe.id}`}>
      <Card className={cn("overflow-hidden hover:shadow-lg transition-shadow", className)}>
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
          {recipe.description && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {recipe.description}
            </p>
          )}
          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{recipe.cookTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <ChefHat className={cn("h-4 w-4", difficultyColor[recipe.difficulty])} />
              <span className={cn("capitalize", difficultyColor[recipe.difficulty])}>
                {recipe.difficulty}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "ml-auto flex items-center gap-1",
              recipe.isLiked && "text-red-500 hover:text-red-600"
            )}
            onClick={(e) => {
              e.preventDefault();
              onLike?.(recipe.id);
            }}
          >
            <Heart className="h-4 w-4" fill={recipe.isLiked ? "currentColor" : "none"} />
            <span>{recipe.likes}</span>
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
