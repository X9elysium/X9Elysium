import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPlans, getPlanMeta } from "../lib";
import PlanClient from "./PlanClient";

export function generateStaticParams() {
  return getAllPlans().map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const plan = getPlanMeta(params.slug);
  return {
    title: plan ? `${plan.title} · Plans` : "Plan not found",
    description: "Private editable plan.",
    robots: { index: false, follow: false, noarchive: true, nosnippet: true },
  };
}

export default function PlanPage({ params }: { params: { slug: string } }) {
  const plan = getPlanMeta(params.slug);
  if (!plan) notFound();
  return <PlanClient slug={plan.slug} title={plan.title} />;
}
