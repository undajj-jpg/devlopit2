export type UserRole = "client" | "admin" | "developer" | "pm";

export type ProjectStatus =
  | "onboarding"
  | "pending_moderation"
  | "building"
  | "build_failed"
  | "trial"
  | "active"
  | "past_due"
  | "paused"
  | "archived";

export type ProjectTier = "starter" | "growth" | "scale";

export type BillingInterval = "monthly" | "annual";

export type ModerationStatus = "pending" | "approved" | "flagged" | "rejected";

export type ChangeRequestStatus =
  | "pending_estimate"
  | "pending_approval"
  | "disputed"
  | "approved"
  | "in_progress"
  | "in_review"
  | "done"
  | "rejected";

export type KanbanColumn = "backlog" | "in_review" | "in_progress" | "done";

export type CreditType =
  | "monthly_grant"
  | "topup"
  | "spend"
  | "refund"
  | "admin_adjustment"
  | "referral_bonus";

export type DeploymentEnvironment = "staging" | "production";

export type DeploymentStatus = "building" | "ready" | "error" | "canceled";

export type DisputeResolution = "pending" | "re_estimated" | "upheld" | "admin_override";

export type SecretManagedBy = "devlop" | "client";

export type SecretTarget = "production" | "preview" | "development";

export type AbuseReportStatus = "open" | "reviewing" | "actioned" | "dismissed";

export interface Brief {
  project_name: string;
  tier_recommendation: ProjectTier;
  tier_reasoning: string;
  industry: string;
  target_users: string;
  core_features: string[];
  tech_requirements: string[];
  style_notes: string;
  estimated_pages: string[];
  initial_kanban_items: string[];
  roadmap: string[];
}

export interface AiAnalysis {
  credit_cost: number;
  complexity: "low" | "medium" | "high";
  eta_days: number;
  summary: string;
  plan_md: string;
}

// Supabase generated types placeholder — replace with `supabase gen types` output
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          clerk_id: string;
          email: string;
          name: string | null;
          timezone: string;
          role: UserRole;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["users"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          owner_id: string;
          stripe_customer_id: string | null;
          referred_by_code: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["organizations"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["organizations"]["Insert"]>;
      };
      projects: {
        Row: {
          id: string;
          org_id: string;
          name: string;
          slug: string;
          tier: ProjectTier;
          status: ProjectStatus;
          brief: Brief | null;
          moderation_status: ModerationStatus;
          moderation_notes: string | null;
          github_repo_url: string | null;
          vercel_project_id: string | null;
          vercel_subdomain: string | null;
          staging_url: string | null;
          custom_domain: string | null;
          custom_domain_verified: boolean;
          deploy_date: string | null;
          trial_ends_at: string | null;
          billing_interval: BillingInterval | null;
          stripe_subscription_id: string | null;
          months_paid: number;
          bought_out: boolean;
          build_attempts: number;
          last_build_error: string | null;
          assigned_developer_id: string | null;
          assigned_pm_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["projects"]["Row"], "id" | "created_at" | "status" | "moderation_status" | "custom_domain_verified" | "months_paid" | "bought_out" | "build_attempts"> & {
          id?: string;
          created_at?: string;
          status?: ProjectStatus;
          moderation_status?: ModerationStatus;
          custom_domain_verified?: boolean;
          months_paid?: number;
          bought_out?: boolean;
          build_attempts?: number;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
      };
      credit_ledger: {
        Row: {
          id: string;
          project_id: string;
          type: CreditType;
          amount: number;
          description: string | null;
          change_request_id: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["credit_ledger"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["credit_ledger"]["Insert"]>;
      };
      change_requests: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string;
          ai_analysis: AiAnalysis | null;
          credit_cost: number | null;
          estimate_version: number;
          status: ChangeRequestStatus;
          kanban_column: KanbanColumn;
          kanban_order: number;
          deployed_commit_sha: string | null;
          rolled_back: boolean;
          submitted_by: string | null;
          assigned_to: string | null;
          approved_at: string | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["change_requests"]["Row"], "id" | "created_at" | "estimate_version" | "kanban_order" | "rolled_back"> & {
          id?: string;
          created_at?: string;
          estimate_version?: number;
          kanban_order?: number;
          rolled_back?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["change_requests"]["Insert"]>;
      };
      estimate_disputes: {
        Row: {
          id: string;
          change_request_id: string;
          raised_by: string;
          client_reason: string;
          resolution: DisputeResolution;
          original_credits: number;
          resolved_credits: number | null;
          resolved_by: string | null;
          created_at: string;
          resolved_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["estimate_disputes"]["Row"], "id" | "created_at" | "resolution"> & {
          id?: string;
          created_at?: string;
          resolution?: DisputeResolution;
        };
        Update: Partial<Database["public"]["Tables"]["estimate_disputes"]["Insert"]>;
      };
      credit_cost_types: {
        Row: {
          id: string;
          label: string;
          description: string | null;
          credits: number;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["credit_cost_types"]["Row"], "id" | "updated_at"> & {
          id?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["credit_cost_types"]["Insert"]>;
      };
      subscriptions: {
        Row: {
          id: string;
          project_id: string;
          stripe_subscription_id: string;
          stripe_price_id: string | null;
          tier: string;
          billing_interval: string;
          status: string;
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["subscriptions"]["Row"], "id" | "created_at" | "cancel_at_period_end"> & {
          id?: string;
          created_at?: string;
          cancel_at_period_end?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Insert"]>;
      };
      project_secrets: {
        Row: {
          id: string;
          project_id: string;
          key: string;
          value_last4: string | null;
          managed_by: SecretManagedBy;
          target: SecretTarget;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["project_secrets"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["project_secrets"]["Insert"]>;
      };
      domain_verifications: {
        Row: {
          id: string;
          project_id: string;
          domain: string;
          vercel_verification_status: string | null;
          dns_instructions: Record<string, unknown> | null;
          verified_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["domain_verifications"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["domain_verifications"]["Insert"]>;
      };
      deployments: {
        Row: {
          id: string;
          project_id: string;
          change_request_id: string | null;
          environment: DeploymentEnvironment;
          vercel_deployment_id: string | null;
          commit_sha: string | null;
          status: DeploymentStatus;
          is_current_production: boolean;
          client_approved: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["deployments"]["Row"], "id" | "created_at" | "is_current_production" | "client_approved"> & {
          id?: string;
          created_at?: string;
          is_current_production?: boolean;
          client_approved?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["deployments"]["Insert"]>;
      };
      project_messages: {
        Row: {
          id: string;
          project_id: string;
          change_request_id: string | null;
          author_id: string;
          body: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["project_messages"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["project_messages"]["Insert"]>;
      };
      referrals: {
        Row: {
          id: string;
          referrer_org_id: string;
          code: string;
          referred_org_id: string | null;
          reward_granted: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["referrals"]["Row"], "id" | "created_at" | "reward_granted"> & {
          id?: string;
          created_at?: string;
          reward_granted?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["referrals"]["Insert"]>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          project_id: string | null;
          type: string;
          title: string;
          body: string | null;
          read: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["notifications"]["Row"], "id" | "created_at" | "read"> & {
          id?: string;
          created_at?: string;
          read?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
      };
      audit_log: {
        Row: {
          id: string;
          actor_id: string | null;
          project_id: string | null;
          action: string;
          payload: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["audit_log"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["audit_log"]["Insert"]>;
      };
      abuse_reports: {
        Row: {
          id: string;
          project_id: string | null;
          reported_url: string | null;
          reporter_email: string | null;
          reason: string;
          status: AbuseReportStatus;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["abuse_reports"]["Row"], "id" | "created_at" | "status"> & {
          id?: string;
          created_at?: string;
          status?: AbuseReportStatus;
        };
        Update: Partial<Database["public"]["Tables"]["abuse_reports"]["Insert"]>;
      };
    };
    Functions: {
      spend_credits: {
        Args: {
          p_project_id: string;
          p_amount: number;
          p_change_request_id: string;
          p_created_by?: string;
        };
        Returns: number;
      };
    };
  };
}
