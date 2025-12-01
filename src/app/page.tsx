import { Suspense } from "react";
import { CatalogHeader } from "@/modules/catalog/ui/components/CatalogHeader";
import { SearchView } from "@/modules/catalog/ui/components/SearchView";

function SearchViewFallback() {
  return (
    <div className="min-h-screen bg-neutral-950 pt-16">
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <CatalogHeader />
      <Suspense fallback={<SearchViewFallback />}>
        <SearchView />
      </Suspense>
    </>
  );
}
