import { redirect } from "next/navigation";

/** Redirect legacy route naar het nieuwe medewerkersportaal. */
export default function MedewerkerDashboardRedirectPage() {
  redirect("/portaal/medewerkers");
}
