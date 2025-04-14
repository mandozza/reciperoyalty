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
    description: string;
    recipeCount: number;
    image?: string;
  };
  className?: string;
}

export function CookbookCard({ cookbook, className }: CookbookCardProps) {
  return (
    <Link href={`/cookbooks/${cookbook.id}`}>
      <Card className={cn("overflow-hidden hover:shadow-lg", className)}>
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
          <h3 className="line-clamp-1 text-lg font-semibold">{cookbook.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {cookbook.description}
          </p>
          <div className="mt-2 flex items-center text-sm text-muted-foreground">
            <Book className="mr-1 h-4 w-4" />
            <span>{cookbook.recipeCount} recipes</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
