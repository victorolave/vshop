import { NextResponse } from "next/server";
import { SearchProducts } from "@/modules/catalog/application/use-cases/SearchProducts";
import { MockProductRepository } from "@/modules/catalog/infrastructure/repositories/MockProductRepository";

const searchProductsUseCase = new SearchProducts(new MockProductRepository());

const SEARCH_LATENCY_MS = 400;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawQuery = searchParams.get("q");

  if (rawQuery == null) {
    return NextResponse.json(
      {
        error: {
          code: "MISSING_QUERY",
          message: 'Query parameter "q" is required',
        },
      },
      { status: 400 },
    );
  }

  const trimmedQuery = rawQuery.trim();

  // Simulate network latency for the search
  await new Promise((resolve) => {
    setTimeout(resolve, SEARCH_LATENCY_MS);
  });

  const normalized = trimmedQuery.toLowerCase();

  if (normalized === "error") {
    return NextResponse.json(
      {
        error: {
          code: "FORCED_ERROR",
          message: "Forced error for testing search error state",
        },
      },
      { status: 500 },
    );
  }

  try {
    const products = await searchProductsUseCase.execute(rawQuery);

    const responseBody = {
      query: trimmedQuery,
      paging: {
        total: products.length,
        offset: 0,
        limit: products.length,
      },
      results: products.map((product) => ({
        id: product.id,
        title: product.title,
        price: product.price,
        currency_id: product.currencyId,
        condition: product.condition,
        thumbnail: product.thumbnailUrl,
        installments: product.installments
          ? {
              quantity: product.installments.quantity,
              amount: product.installments.amount,
            }
          : undefined,
        shipping: product.shipping
          ? {
              free_shipping: product.shipping.freeShipping,
            }
          : undefined,
        reviews: product.reviews
          ? {
              rating_average: product.reviews.ratingAverage,
              total: product.reviews.total,
            }
          : undefined,
      })),
    };

    return NextResponse.json(responseBody);
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Unexpected error while searching products",
        },
      },
      { status: 500 },
    );
  }
}
