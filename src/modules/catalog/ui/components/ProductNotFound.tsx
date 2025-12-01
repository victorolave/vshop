"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function ProductNotFound() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      data-testid="product-not-found"
      className="flex flex-col items-center justify-center gap-6 py-20"
    >
      <div className="rounded-full bg-neutral-800 p-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-neutral-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">
          Producto no encontrado
        </h1>
        <p className="mt-2 text-neutral-400">
          El producto que buscas no existe o ya no está disponible.
        </p>
      </div>
      <Button
        onClick={() => router.push("/")}
        className="bg-primary text-black hover:bg-primary/90"
      >
        Volver al catálogo
      </Button>
    </motion.div>
  );
}
