import { NextResponse } from "next/server";
import { GetProductDetail } from "@/modules/catalog/application/use-cases/GetProductDetail";
import { MockProductRepository } from "@/modules/catalog/infrastructure/repositories/MockProductRepository";

const getProductDetailUseCase = new GetProductDetail(
  new MockProductRepository(),
);

const DETAIL_LATENCY_MS = 300;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // Simulate network latency
  await new Promise((resolve) => {
    setTimeout(resolve, DETAIL_LATENCY_MS);
  });

  // Force error for testing error state
  if (id.toLowerCase() === "error") {
    return NextResponse.json(
      {
        error: {
          code: "FORCED_ERROR",
          message: "Forced error for testing error state",
        },
      },
      { status: 500 },
    );
  }

  try {
    const product = await getProductDetailUseCase.execute(id);

    if (!product) {
      return NextResponse.json(
        {
          error: {
            code: "PRODUCT_NOT_FOUND",
            message: `Product with ID ${id} was not found`,
          },
        },
        { status: 404 },
      );
    }

    // Map domain entity to API response (snake_case for API consistency)
    const responseBody = {
      id: product.id,
      title: product.title,
      price: product.price,
      original_price: product.originalPrice,
      currency_id: product.currencyId,
      available_quantity: product.availableQuantity,
      sold_quantity: product.soldQuantity,
      condition: product.condition,
      permalink: product.permalink,
      thumbnail: product.thumbnailUrl,
      pictures: product.pictures?.map((pic) => ({
        id: pic.id,
        url: pic.url,
      })),
      installments: product.installments
        ? {
            quantity: product.installments.quantity,
            amount: product.installments.amount,
            rate: product.installments.rate,
            currency_id: product.installments.currencyId,
          }
        : undefined,
      shipping: product.shipping
        ? {
            free_shipping: product.shipping.freeShipping,
            mode: product.shipping.mode,
            logistic_type: product.shipping.logisticType,
            store_pick_up: product.shipping.storePickUp,
          }
        : undefined,
      seller_address: product.sellerAddress
        ? {
            city: { name: product.sellerAddress.city.name },
            state: { name: product.sellerAddress.state.name },
          }
        : undefined,
      attributes: product.attributes?.map((attr) => ({
        id: attr.id,
        name: attr.name,
        value_name: attr.valueName,
      })),
      warranty: product.warranty,
      description: product.description
        ? { plain_text: product.description.plainText }
        : undefined,
      reviews: product.reviews
        ? {
            rating_average: product.reviews.ratingAverage,
            total: product.reviews.total,
          }
        : undefined,
    };

    return NextResponse.json(responseBody);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Invalid")) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_PRODUCT_ID",
            message: error.message,
          },
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Unexpected error while retrieving product",
        },
      },
      { status: 500 },
    );
  }
}
