import MomenPageTemplate from "@/components/momen/MomenPageTemplate";
import { MOMEN_DATA, momenMetadata } from "@/lib/data/momen";

export const metadata = momenMetadata("karangan-bunga-duka-cita");

export default function Page() {
  return <MomenPageTemplate data={MOMEN_DATA["karangan-bunga-duka-cita"]} />;
}
