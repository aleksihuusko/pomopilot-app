import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-red-700 via-red-800 to-red-900 text-white px-[5%]">
      <Badge variant="secondary" className="mb-4">
        Oops! Page not found.
      </Badge>
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl mb-8 text-center text-balance max-w-2xl">
        Did you take a wrong turn at Albuquerque?
      </p>
      <div className="space-y-4 text-center">
        <p className="text-xl">Here are some possible explanations:</p>
        <div className="text-center text-balance">
          <p>The page is on a coffee break</p>
          <p>It&apos;s playing hide and seek (and winning)</p>
          <p>It eloped with a 403 Forbidden page</p>
          <p>It&apos;s stuck in a parallel universe</p>
        </div>
      </div>
      <Button asChild size="lg" variant="secondary" className="mt-8">
        <Link href="/">Beam me up to the homepage, Scotty!</Link>
      </Button>
    </div>
  );
}
