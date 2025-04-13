"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Book } from "lucide-react";

interface Cookbook {
  id: string;
  title: string;
  description: string;
  image: string;
  recipeCount: number;
}

interface CookbookCardProps {
  cookbook: Cookbook;
}

export function CookbookCard({ cookbook }: CookbookCardProps) {
  return (
    <Link href={`/cookbooks/${cookbook.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative aspect-[4/3]">
          <Image
            src={cookbook.image}
            alt={cookbook.title}
            fill
            className="object-cover"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold line-clamp-1">{cookbook.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {cookbook.description}
          </p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
            <Book className="h-4 w-4" />
            <span>{cookbook.recipeCount} recipes</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
