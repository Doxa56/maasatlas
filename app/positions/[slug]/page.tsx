import { mockPositionDetailsBySlug } from "@/lib/mock-data";
import PositionDetailsClient from "./PositionDetailsClient";

export const dynamicParams = false;

export async function generateStaticParams() {
  return Object.keys(mockPositionDetailsBySlug).map((slug) => ({ slug }));
}

type PositionDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PositionDetailsPage({ params }: PositionDetailsPageProps) {
  const { slug } = await params;
  return <PositionDetailsClient slug={slug} />;
}
