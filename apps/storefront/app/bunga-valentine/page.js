import MomenPageTemplate from "@/components/momen/MomenPageTemplate";
import { MOMEN_DATA, momenMetadata } from "@/lib/data/momen";

export const metadata = momenMetadata("bunga-valentine");

export default function Page() {
  return <MomenPageTemplate data={MOMEN_DATA["bunga-valentine"]} />;
}
