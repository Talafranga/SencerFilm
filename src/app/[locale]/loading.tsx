import { NavbarSkeleton, FooterSkeleton, ProjectCardSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <NavbarSkeleton />
      
      {/* Main Content Skeleton */}
      <main className="min-h-screen">
        {/* Hero Section Skeleton */}
        <section className="relative min-h-[100dvh] bg-[#0a0a0a] flex items-center px-6 lg:px-12">
          <div className="max-w-4xl flex items-start">
            <div className="w-1 bg-gray-600 mr-6 lg:mr-8 h-32 animate-pulse"></div>
            <div className="flex-1 space-y-4">
              <div className="h-16 bg-gray-600 rounded animate-pulse w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded animate-pulse w-2/3"></div>
                <div className="h-4 bg-gray-700 rounded animate-pulse w-1/2"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section Skeleton */}
        <section className="min-h-screen px-6 py-20">
          <div className="max-w-7xl mx-auto">
            {/* Title */}
            <div className="text-center mb-16">
              <div className="h-12 bg-gray-600 rounded animate-pulse w-64 mx-auto mb-6"></div>
              <div className="w-24 h-0.5 bg-gray-600 mx-auto"></div>
            </div>
            
            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <FooterSkeleton />
    </>
  );
}
