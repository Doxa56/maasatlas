import { mockPositionDetailsBySlug } from "@/lib/mock-data";
import PositionDetailsClient from "./PositionDetailsClient";

export const dynamicParams = false;

export async function generateStaticParams() {
  return Object.keys(mockPositionDetailsBySlug).map((slug) => ({ slug }));
}

type PositionDetailsPageProps = {
  params: {
    slug: string;
  };
};

export default function PositionDetailsPage({ params }: PositionDetailsPageProps) {
  return <PositionDetailsClient slug={params.slug} />;
}
