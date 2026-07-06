import { NextResponse } from "next/server";
import { requireInternApiAccess } from "@/lib/api-auth";
import {
  formatShiftbaseError,
  getShiftbaseEmployeeById,
  isShiftbaseConfigured,
} from "@/lib/shiftbase";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireInternApiAccess();
  if ("error" in auth && auth.error) return auth.error;

  if (!isShiftbaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "SHIFTBASE_API_TOKEN is niet geconfigureerd op de server" },
      { status: 503 },
    );
  }

  const { id } = await context.params;

  try {
    const employee = await getShiftbaseEmployeeById(id);
    return NextResponse.json({
      ok: true,
      employee: {
        id: employee.id,
        fullName: employee.fullName,
        email: employee.email,
        phone: employee.phone,
        address: employee.address
          ? {
              city: employee.address.city,
              postalCode: employee.address.postalCode,
              country: employee.address.country,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("[Shiftbase] Employee ophalen mislukt:", error);
    return NextResponse.json(
      { ok: false, error: formatShiftbaseError(error) },
      { status: 502 },
    );
  }
}
