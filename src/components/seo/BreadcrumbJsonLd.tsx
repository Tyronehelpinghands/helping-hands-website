import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

type BreadcrumbJsonLdProps = {
  items: { name: string; path: string }[];
};

export default function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  return <JsonLd data={breadcrumbJsonLd(items)} />;
}
