import ClientStatusBadge from "@/components/client-portal/ClientStatusBadge";

export default function ClientRequestStatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return <ClientStatusBadge status={status} variant="request" className={className} />;
}
