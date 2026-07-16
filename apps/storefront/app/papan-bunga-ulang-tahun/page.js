import MomenPageTemplate from "@/components/momen/MomenPageTemplate";
import { MOMEN_DATA, momenMetadata } from "@/lib/data/momen";

export const metadata = momenMetadata("papan-bunga-ulang-tahun");

export default function Page() {
  return <MomenPageTemplate data={MOMEN_DATA["papan-bunga-ulang-tahun"]} />;
}
