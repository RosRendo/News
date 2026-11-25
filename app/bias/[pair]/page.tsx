import { notFound } from "next/navigation";
import { PAIR_BIASES } from "@/lib/newsData";
import PairBiasDetailClient from "@/components/PairBiasDetailClient";

interface PageProps {
  params: Promise<{ pair: string }>;
}

export async function generateStaticParams() {
  return PAIR_BIASES.map((b) => ({
    pair: b.pair.toLowerCase(),
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { pair } = await params;
  const uppercasePair = pair.toUpperCase();
  return {
    title: `${uppercasePair} Macro Intelligence & Market Driver Report — MacroPulse Wire`,
    description: `Real-time macroeconomic drivers, key pivot levels, and session flow for ${uppercasePair}. Sourced from official central bank data.`,
  };
}

export default async function PairBiasPage({ params }: PageProps) {
  const { pair } = await params;
  const uppercasePair = pair.toUpperCase();

  const biasData = PAIR_BIASES.find(
    (b) => b.pair.toUpperCase() === uppercasePair
  );

  if (!biasData) {
    notFound();
  }

  return <PairBiasDetailClient initialBias={biasData} />;
}
