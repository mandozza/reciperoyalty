import { Metadata } from "next";
import SignOutButtons from "./components/sign-out-buttons";

export const metadata: Metadata = {
  title: "Sign Out | Recipe Royalty",
  description: "Sign out of your Recipe Royalty account",
};

export default function SignOutPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Sign out
          </h1>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to sign out?
          </p>
        </div>
        <SignOutButtons />
      </div>
    </div>
  );
}
