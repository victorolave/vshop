"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProductDetailError } from "@/modules/catalog/ui/components/ProductDetailError";
import { ProductDetailSkeleton } from "@/modules/catalog/ui/components/ProductDetailSkeleton";
import { ProductDetailView } from "@/modules/catalog/ui/components/ProductDetailView";
import { ProductNotFound } from "@/modules/catalog/ui/components/ProductNotFound";
import { useProductDetail } from "@/modules/catalog/ui/hooks/useProductDetail";

export default function ProductDetailClient() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = typeof params.id === "string" ? params.id : null;
  const fromSearch = searchParams.get("q");

  const { product, aiInsights, isLoading, error, notFound, refetch } =
    useProductDetail(productId);

  const handleBack = () => {
    if (fromSearch) {
      router.push(`/?q=${encodeURIComponent(fromSearch)}`);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 -z-10 bg-neutral-950"
      />

      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={handleBack}
            className="gap-2 text-neutral-300 hover:bg-white/10 hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Volver
          </Button>
        </motion.div>

        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProductDetailSkeleton />
            </motion.div>
          )}

          {notFound && (
            <motion.div
              key="not-found"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProductNotFound />
            </motion.div>
          )}

          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProductDetailError message={error} onRetry={refetch} />
            </motion.div>
          )}

          {product && !isLoading && !error && !notFound && (
            <motion.div
              key="product"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProductDetailView product={product} aiInsights={aiInsights} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
