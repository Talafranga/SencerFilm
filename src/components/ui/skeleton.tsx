import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

// Project Card Skeleton
function ProjectCardSkeleton() {
  return (
    <div className="bg-[#0a0a0a] border border-[#262626] rounded-2xl p-6 h-[28rem] flex flex-col">
      {/* Title Skeleton */}
      <Skeleton className="h-6 w-3/4 mb-2" />
      
      {/* Description Skeleton */}
      <div className="space-y-2 mb-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
      </div>
      
      {/* Image Skeleton */}
      <div className="mt-auto">
        <Skeleton className="h-60 w-full rounded-2xl" />
      </div>
    </div>
  );
}

// About Section Skeleton
function AboutSectionSkeleton() {
  return (
    <div className="py-12 md:py-20 lg:py-24">
      <div className="px-6 md:px-8 lg:px-12">
        <div className="max-w-2xl mx-auto space-y-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="mb-12 md:mb-16">
              {/* Badge */}
              <Skeleton className="h-6 w-20 rounded-full mb-4" />
              
              {/* Title */}
              <Skeleton className="h-8 w-2/3 mb-6" />
              
              {/* Image */}
              <Skeleton className="h-64 w-full rounded-lg mb-6" />
              
              {/* Description */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Navigation Skeleton
function NavbarSkeleton() {
  return (
    <nav className="bg-[#262626] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Skeleton className="h-8 w-32" />
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-16" />
            ))}
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
          
          {/* Mobile controls */}
          <div className="md:hidden flex items-center space-x-3">
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-6 w-6" />
          </div>
        </div>
      </div>
    </nav>
  );
}

// Footer Skeleton
function FooterSkeleton() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div>
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-2 mb-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/5" />
            </div>
            <div className="flex gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-8 rounded-lg" />
              ))}
            </div>
          </div>
          
          {/* Contact Info */}
          <div>
            <Skeleton className="h-6 w-24 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-4 w-40" />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
      </div>
    </footer>
  );
}

export { 
  Skeleton, 
  ProjectCardSkeleton, 
  AboutSectionSkeleton, 
  NavbarSkeleton, 
  FooterSkeleton 
};
