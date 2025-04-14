"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Book } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CookbookCardProps {
  cookbook: {
    id: string;
    title: string;
    description?: string;
    recipeCount: number;
    image?: string;
    isPublic?: boolean;
  };
  className?: string;
}

export function CookbookCard({ cookbook, className }: CookbookCardProps) {
  return (
    <Link href={`/cookbooks/${cookbook.id}`}>
      <Card className={cn("overflow-hidden hover:shadow-lg transition-shadow", className)}>
        <div className="relative aspect-[16/9]">
          {cookbook.image ? (
            <Image
              src={cookbook.image}
              alt={cookbook.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted">
              <Book className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="line-clamp-1 text-lg font-semibold">{cookbook.title}</h3>
            {cookbook.isPublic === false && (
              <span className="text-xs text-muted-foreground">Private</span>
            )}
          </div>
          {cookbook.description && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {cookbook.description}
            </p>
          )}
          <div className="mt-2 flex items-center text-sm text-muted-foreground">
            <Book className="mr-1 h-4 w-4" />
            <span>{cookbook.recipeCount} {cookbook.recipeCount === 1 ? 'recipe' : 'recipes'}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
