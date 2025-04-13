import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProfileNotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Profile Not Found</h1>
      <p className="mt-4 text-muted-foreground">
        The profile you're looking for doesn't exist or has been removed.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Return Home</Link>
      </Button>
    </main>
  );
}
