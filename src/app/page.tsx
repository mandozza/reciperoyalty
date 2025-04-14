import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Theme Switcher */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeSwitcher />
      </div>

      {/* Hero Section */}
      <section className="relative flex h-[600px] items-center justify-center bg-black">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-[1]" />
          <Image
            src="/images/hero-bg.jpg"
            alt="Delicious food background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <div className="mb-6 flex items-center justify-center gap-3">
            <Crown className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold text-white md:text-6xl">Recipe Royalty</h1>
          </div>
          <p className="mb-8 text-lg text-white/90 md:text-xl">
            Share your culinary masterpieces and discover recipes from food enthusiasts around the world
          </p>
          <div className="flex flex-col gap-4 sm:flex-row justify-center">
            <Button size="lg" variant="default" asChild>
              <Link href="/recipes">Explore Recipes</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 text-white hover:bg-white/20" asChild>
              <Link href="/auth">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 md:px-8">
        <h2 className="mb-8 text-center text-3xl font-bold">Featured Recipes</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={`/images/recipe-${i}.jpg`}
                  alt="Recipe preview"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  loading="lazy"
                  quality={85}
                />
              </div>
              <CardHeader>
                <CardTitle>Delicious Recipe {i}</CardTitle>
                <CardDescription>By Chef Name</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  A brief description of this amazing recipe that will make your mouth water...
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" className="w-full" asChild>
                  <Link href={`/recipes/${i}`}>View Recipe</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-muted py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold">Why Recipe Royalty?</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: "Premium Recipes",
                description: "Access high-quality, curated recipes from talented chefs worldwide"
              },
              {
                title: "Community Driven",
                description: "Share your recipes and connect with other food enthusiasts"
              },
              {
                title: "Easy to Use",
                description: "Intuitive interface for sharing and discovering new recipes"
              }
            ].map((feature, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Crown className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-3xl px-4 py-16 text-center md:px-8">
        <h2 className="mb-4 text-3xl font-bold">Ready to Share Your Recipes?</h2>
        <p className="mb-8 text-lg text-muted-foreground">
          Join our community of food enthusiasts and share your culinary creations with the world
        </p>
        <Button size="lg" asChild>
          <Link href="/auth">Create Account</Link>
        </Button>
      </section>
    </div>
  );
}
