import { Avatar } from "./../ui/avatar";
import { AvatarImage } from "./../ui/avatar";
import { AvatarFallback } from "./../ui/avatar";
import { Button } from "@/components/ui/button";

export default function Banner() {
  return (
    <div className="relative w-full bg-[#5865F2] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-xl bg-[url('https://images.unsplash.com/photo-1614422982208-51274e106c1e')] bg-cover bg-center bg-no-repeat p-8">
          <div className="relative z-10 lg:grid lg:grid-cols-2 lg:gap-8">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Find Your Perfect Discord Community
              </h2>
              <p className="text-lg text-gray-100">
                Join thousands of communities and connect with people who share
                your interests. From gaming to art, there's a server for
                everyone.
              </p>
            </div>
          </div>

          <div className="absolute inset-0 bg-black/40" />
        </div>
      </div>
    </div>
  );
}
