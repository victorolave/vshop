import type { Metadata } from "next";
import { GetProductDetail } from "@/modules/catalog/application/use-cases/GetProductDetail";
import { MockProductRepository } from "@/modules/catalog/infrastructure/repositories/MockProductRepository";
import ProductDetailClient from "./ProductDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const repository = new MockProductRepository();
  const getProductDetail = new GetProductDetail(repository);

  try {
    const product = await getProductDetail.execute(id);

    if (!product) {
      return {
        title: "Producto no encontrado | VShop",
        description: "El producto que buscas no existe en nuestro catálogo.",
        robots: {
          index: false,
          follow: true,
        },
      };
    }

    const description = product.description?.plainText
      ? `${product.description.plainText.substring(0, 155)}...`
      : `Compra ${product.title} por $ ${product.price.toLocaleString()} en VShop. Envíos a todo el país.`;

    const images =
      product.pictures?.map((p) => p.url) ||
      (product.thumbnailUrl ? [product.thumbnailUrl] : []);

    return {
      title: product.title,
      description,
      openGraph: {
        title: product.title,
        description,
        url: `/items/${id}`,
        siteName: "VShop",
        images: images.map((url) => ({
          url,
          alt: product.title,
        })),
        locale: "es_AR",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: product.title,
        description,
        images: images[0] ? [images[0]] : [],
      },
    };
  } catch {
    return {
      title: "Error | VShop",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const repository = new MockProductRepository();
  const getProductDetail = new GetProductDetail(repository);
  const product = await getProductDetail.execute(id);

  const jsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        image: product.pictures?.map((p) => p.url) || [product.thumbnailUrl],
        description: product.description?.plainText || product.title,
        sku: product.id,
        offers: {
          "@type": "Offer",
          url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://vshop.com"}/items/${product.id}`,
          priceCurrency: product.currencyId || "ARS",
          price: product.price,
          availability: "https://schema.org/InStock",
          itemCondition:
            product.condition === "new"
              ? "https://schema.org/NewCondition"
              : "https://schema.org/UsedCondition",
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD injection is standard practice
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetailClient />
    </>
  );
}
