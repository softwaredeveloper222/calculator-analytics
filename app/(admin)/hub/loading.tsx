import { PageLoadingSpinner } from "@/components/PageLoadingSpinner";

export default function Loading() {
  return <PageLoadingSpinner label="Loading dashboard…" fullScreen={false} />;
}
