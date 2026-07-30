/** Types for internal dashboard Supabase tables. */

export type ClientStatus = "active" | "prospect" | "inactive";

export type LeadStatus =
  | "new"
  | "contacted"
  | "proposal_sent"
  | "won"
  | "lost";

export type EmploymentType = "payroll" | "zzp" | "freelance" | "other";

export type CrewMemberStatus = "active" | "inactive" | "onboarding";

export type ProjectStatus =
  | "draft"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

export type ProjectType =
  | "event"
  | "horeca"
  | "restaurant"
  | "keuken"
  | "bar"
  | "stagebouw"
  | "productie"
  | "logistiek"
  | "hospitality"
  | "overig";

export type ShiftStatus =
  | "open"
  | "assigned"
  | "confirmed"
  | "completed"
  | "cancelled";

export type ShiftbaseSyncStatus =
  | "niet_gesynct"
  | "gesynct"
  | "fout"
  | "overgeslagen";

export type TimeEntryStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "rejected"
  | "invoiced";

export type InvoiceDraftStatus =
  | "draft"
  | "ready"
  | "sent"
  | "paid"
  | "cancelled";

export type TaskPriority = "low" | "normal" | "high" | "critical";

export type TaskStatus = "open" | "in_progress" | "done" | "cancelled";

export type InternalMessageStatus = "draft" | "ready" | "sent" | "archived";

export type MessageType =
  | "whatsapp_briefing"
  | "email_client"
  | "crew_reminder"
  | "invoice_reminder"
  | "other";

export type Client = {
  id: string;
  company_name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  notes: string | null;
  status: ClientStatus;
  created_at: string;
  updated_at: string;
};

export type Lead = {
  id: string;
  company_name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  source: string | null;
  status: LeadStatus;
  value_estimate: number | null;
  next_follow_up: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type CrewMember = {
  id: string;
  profile_id: string | null;
  full_name: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  employment_type: EmploymentType;
  role_type: string | null;
  skills: string[];
  certificates: string[];
  has_drivers_license: boolean;
  has_car: boolean;
  hourly_cost: number | null;
  status: CrewMemberStatus;
  notes: string | null;
  /** Shiftbase user/employee id for sync (optional until migration). */
  shiftbase_user_id?: string | null;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  client_id: string | null;
  project_name: string;
  location: string | null;
  address: string | null;
  start_date: string | null;
  end_date: string | null;
  status: ProjectStatus;
  project_type: ProjectType | null;
  contact_on_site: string | null;
  briefing: string | null;
  clothing: string | null;
  ppe: string | null;
  certificates_required: string | null;
  travel_agreements: string | null;
  default_hourly_rate: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  clients?: Pick<Client, "id" | "company_name"> | null;
};

export type Shift = {
  id: string;
  project_id: string | null;
  crew_member_id: string | null;
  shift_date: string;
  start_time: string | null;
  end_time: string | null;
  role_name: string | null;
  required_people: number;
  assigned_people: number;
  status: ShiftStatus;
  notes: string | null;
  shiftbase_shift_id?: string | null;
  shiftbase_sync_status?: ShiftbaseSyncStatus;
  shiftbase_last_synced_at?: string | null;
  shiftbase_sync_error?: string | null;
  created_at: string;
  updated_at: string;
  projects?: Pick<Project, "id" | "project_name"> | null;
  crew_members?: Pick<CrewMember, "id" | "full_name"> | null;
};

export type TimeEntry = {
  id: string;
  project_id: string | null;
  shift_id: string | null;
  crew_member_id: string | null;
  work_date: string;
  start_time: string | null;
  end_time: string | null;
  break_minutes: number;
  hours: number | null;
  kilometers: number;
  travel_time_hours: number;
  status: TimeEntryStatus;
  internal_notes: string | null;
  correction_reason: string | null;
  created_at: string;
  updated_at: string;
  projects?: Pick<Project, "id" | "project_name" | "default_hourly_rate" | "client_id"> | null;
  crew_members?: Pick<
    CrewMember,
    "id" | "full_name" | "hourly_cost" | "shiftbase_user_id"
  > | null;
};

export type InvoiceDraft = {
  id: string;
  client_id: string | null;
  project_id: string | null;
  invoice_number: string | null;
  status: InvoiceDraftStatus;
  total_hours: number;
  hourly_rate: number | null;
  travel_costs: number;
  subtotal: number;
  vat_amount: number;
  total_amount: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  clients?: Pick<Client, "id" | "company_name"> | null;
  projects?: Pick<Project, "id" | "project_name"> | null;
  invoice_draft_lines?: InvoiceDraftLine[];
};

export type InvoiceDraftLine = {
  id: string;
  invoice_draft_id: string;
  description: string;
  quantity: number | null;
  unit_price: number | null;
  vat_rate: number;
  line_total: number | null;
  created_at: string;
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  linked_type: string | null;
  linked_id: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
};

export type InternalMessage = {
  id: string;
  message_type: string | null;
  recipient_name: string | null;
  recipient_email: string | null;
  recipient_phone: string | null;
  subject: string | null;
  body: string | null;
  status: InternalMessageStatus;
  created_at: string;
  updated_at: string;
};

export type CompanySetting = {
  id: string;
  key: string;
  value: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type RateSettingsValue = {
  km_rate: number;
  vat_percent: number;
  site_crew: number;
  horeca_allround: number;
  keukenhulp: number;
  zelfstandig_kok: number;
  teamcaptain: number;
};

export type CompanyInfoValue = {
  company_name: string;
  address: string;
  postal_code: string;
  city: string;
  phone: string;
  website: string;
};

export type EmailSettingsValue = {
  planning: string;
  aanmeldingen: string;
  info: string;
};

export type DashboardStats = {
  openProjects: number;
  availableCrew: number;
  shiftsThisWeek: number;
  openHoursReview: number;
  invoiceDrafts: number;
  openTasks: number;
  newLeads: number;
  tablesReady: boolean;
  errorMessage: string | null;
};

export type ActionResult<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: string };
