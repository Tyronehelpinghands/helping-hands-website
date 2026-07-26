/**
 * Demo-access feature flags.
 *
 * - ALLOW_DEMO_ACCESS: demo_role cookie mag portalen/dashboards openen (UI-demo).
 *   Default: aan. Zet op "false" om demo-login volledig te blokkeren.
 * - ALLOW_DEMO_API_ACCESS: demo_role=internal mag Shiftbase/HubSpot/Moneybird API’s aanroepen.
 *   Default: uit. Zet op "true" alleen in vertrouwde demo/staging-omgevingen.
 */

function envFlagEnabled(name: string): boolean {
  const value = process.env[name];
  if (value == null) return false;
  return value === "1" || value.toLowerCase() === "true" || value.toLowerCase() === "yes";
}

function envFlagDisabled(name: string): boolean {
  const value = process.env[name];
  if (value == null) return false;
  return value === "0" || value.toLowerCase() === "false" || value.toLowerCase() === "no";
}

/** Mag de demo_role cookie portalen/dashboards ontgrendelen? */
export function isDemoUiAccessAllowed(): boolean {
  if (envFlagDisabled("ALLOW_DEMO_ACCESS")) return false;
  return true;
}

/** Mag demo_role=internal productie-integratie-API’s gebruiken? */
export function isDemoApiAccessAllowed(): boolean {
  return envFlagEnabled("ALLOW_DEMO_API_ACCESS");
}

export function getDemoAccessSummary() {
  return {
    ui: isDemoUiAccessAllowed(),
    api: isDemoApiAccessAllowed(),
  };
}
