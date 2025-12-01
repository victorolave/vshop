"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface ProductDetailErrorProps {
  message: string;
  onRetry: () => void;
}

export function ProductDetailError({
  message,
  onRetry,
}: ProductDetailErrorProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      data-testid="product-detail-error"
      className="flex flex-col items-center justify-center gap-6 py-20"
    >
      <div className="rounded-full bg-red-900/30 p-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">
          Error al cargar el producto
        </h1>
        <p className="mt-2 text-neutral-400">{message}</p>
      </div>
      <div className="flex gap-4">
        <Button
          onClick={onRetry}
          className="bg-primary text-black hover:bg-primary/90"
        >
          Reintentar
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/")}
          className="border-white/20 text-white hover:bg-white/10"
        >
          Volver al catálogo
        </Button>
      </div>
    </motion.div>
  );
}
