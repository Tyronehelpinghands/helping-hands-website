import ClientRequestsPageClient from "@/components/client-portal/ClientRequestsPageClient";
import { listClientRequestsAction } from "@/lib/client-portal/mutations";

export default async function ClientRequestsPage() {
  const result = await listClientRequestsAction();
  const initialRequests = result.ok ? result.data : [];

  return <ClientRequestsPageClient initialRequests={initialRequests} />;
}
