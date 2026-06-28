-- Devlop Platform - Initial Schema
-- All tables, RLS policies, functions

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id text UNIQUE NOT NULL,
  email text NOT NULL,
  name text,
  timezone text DEFAULT 'UTC',
  role text NOT NULL CHECK (role IN ('client', 'admin', 'developer', 'pm')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  owner_id uuid NOT NULL REFERENCES users(id),
  stripe_customer_id text,
  referred_by_code text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid NOT NULL REFERENCES organizations(id),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  tier text NOT NULL CHECK (tier IN ('starter', 'growth', 'scale')),
  status text NOT NULL DEFAULT 'onboarding' CHECK (status IN (
    'onboarding', 'pending_moderation', 'building', 'build_failed',
    'trial', 'active', 'past_due', 'paused', 'archived'
  )),
  brief jsonb,
  moderation_status text DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'flagged', 'rejected')),
  moderation_notes text,
  github_repo_url text,
  vercel_project_id text,
  vercel_subdomain text,
  staging_url text,
  custom_domain text,
  custom_domain_verified boolean DEFAULT false,
  deploy_date timestamptz,
  trial_ends_at timestamptz,
  billing_interval text CHECK (billing_interval IN ('monthly', 'annual')),
  stripe_subscription_id text,
  months_paid integer DEFAULT 0,
  bought_out boolean DEFAULT false,
  build_attempts integer DEFAULT 0,
  last_build_error text,
  assigned_developer_id uuid REFERENCES users(id),
  assigned_pm_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE credit_ledger (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES projects(id),
  type text NOT NULL CHECK (type IN ('monthly_grant', 'topup', 'spend', 'refund', 'admin_adjustment', 'referral_bonus')),
  amount numeric NOT NULL,
  description text,
  change_request_id uuid,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE change_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES projects(id),
  title text NOT NULL,
  description text NOT NULL,
  ai_analysis jsonb,
  credit_cost numeric,
  estimate_version integer DEFAULT 1,
  status text NOT NULL DEFAULT 'pending_estimate' CHECK (status IN (
    'pending_estimate', 'pending_approval', 'disputed', 'approved',
    'in_progress', 'in_review', 'done', 'rejected'
  )),
  kanban_column text DEFAULT 'backlog' CHECK (kanban_column IN ('backlog', 'in_review', 'in_progress', 'done')),
  kanban_order integer DEFAULT 0,
  deployed_commit_sha text,
  rolled_back boolean DEFAULT false,
  submitted_by uuid REFERENCES users(id),
  assigned_to uuid REFERENCES users(id),
  approved_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Add FK now that change_requests exists
ALTER TABLE credit_ledger
  ADD CONSTRAINT credit_ledger_change_request_fk
  FOREIGN KEY (change_request_id) REFERENCES change_requests(id);

CREATE TABLE estimate_disputes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  change_request_id uuid NOT NULL REFERENCES change_requests(id),
  raised_by uuid NOT NULL REFERENCES users(id),
  client_reason text NOT NULL,
  resolution text DEFAULT 'pending' CHECK (resolution IN ('pending', 're_estimated', 'upheld', 'admin_override')),
  original_credits numeric NOT NULL,
  resolved_credits numeric,
  resolved_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

CREATE TABLE credit_cost_types (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  label text NOT NULL,
  description text,
  credits numeric NOT NULL,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES projects(id),
  stripe_subscription_id text UNIQUE NOT NULL,
  stripe_price_id text,
  tier text NOT NULL,
  billing_interval text NOT NULL,
  status text NOT NULL,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE project_secrets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES projects(id),
  key text NOT NULL,
  value_last4 text,
  managed_by text NOT NULL CHECK (managed_by IN ('devlop', 'client')),
  target text NOT NULL CHECK (target IN ('production', 'preview', 'development')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE domain_verifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES projects(id),
  domain text NOT NULL,
  vercel_verification_status text,
  dns_instructions jsonb,
  verified_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE deployments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES projects(id),
  change_request_id uuid REFERENCES change_requests(id),
  environment text NOT NULL CHECK (environment IN ('staging', 'production')),
  vercel_deployment_id text,
  commit_sha text,
  status text NOT NULL DEFAULT 'building' CHECK (status IN ('building', 'ready', 'error', 'canceled')),
  is_current_production boolean DEFAULT false,
  client_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE project_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES projects(id),
  change_request_id uuid REFERENCES change_requests(id),
  author_id uuid NOT NULL REFERENCES users(id),
  body text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE referrals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_org_id uuid NOT NULL REFERENCES organizations(id),
  code text UNIQUE NOT NULL,
  referred_org_id uuid REFERENCES organizations(id),
  reward_granted boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id),
  project_id uuid REFERENCES projects(id),
  type text NOT NULL,
  title text NOT NULL,
  body text,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE audit_log (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id uuid REFERENCES users(id),
  project_id uuid REFERENCES projects(id),
  action text NOT NULL,
  payload jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE abuse_reports (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES projects(id),
  reported_url text,
  reporter_email text,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'reviewing', 'actioned', 'dismissed')),
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_projects_org_id ON projects(org_id);
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_credit_ledger_project_id ON credit_ledger(project_id);
CREATE INDEX idx_change_requests_project_id ON change_requests(project_id);
CREATE INDEX idx_change_requests_status ON change_requests(status);
CREATE INDEX idx_deployments_project_id ON deployments(project_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read);
CREATE INDEX idx_audit_log_project_id ON audit_log(project_id);
CREATE INDEX idx_project_messages_project_id ON project_messages(project_id);
CREATE INDEX idx_subscriptions_project_id ON subscriptions(project_id);

-- ============================================================
-- SEED: Credit cost reference table
-- ============================================================

INSERT INTO credit_cost_types (label, description, credits) VALUES
  ('Text / copy change', 'Update text or copy content', 0.5),
  ('Image swap', 'Replace an existing image', 0.5),
  ('Color / style tweak', 'Adjust colors, fonts, or styling', 1),
  ('New section on existing page', 'Add a new section to a page', 2),
  ('New page', 'Create an entirely new page', 3),
  ('UI redesign of existing page', 'Redesign the layout/UI of a page', 6),
  ('New feature (small)', 'Small new functionality', 5),
  ('New feature (large)', 'Large new functionality', 10),
  ('New third-party integration', 'Integrate with an external service', 8),
  ('Database schema change', 'Modify the database schema', 6),
  ('Performance optimization', 'Improve performance', 4);

-- ============================================================
-- FUNCTION: spend_credits (atomic credit deduction)
-- ============================================================

CREATE OR REPLACE FUNCTION spend_credits(
  p_project_id uuid,
  p_amount numeric,
  p_change_request_id uuid,
  p_created_by uuid DEFAULT NULL
)
RETURNS numeric
LANGUAGE plpgsql
AS $$
DECLARE
  v_balance numeric;
  v_new_balance numeric;
BEGIN
  -- Lock the project row to prevent concurrent spending
  PERFORM id FROM projects WHERE id = p_project_id FOR UPDATE;

  -- Compute current balance from ledger
  SELECT COALESCE(SUM(amount), 0) INTO v_balance
  FROM credit_ledger
  WHERE project_id = p_project_id;

  -- Check sufficient balance
  IF v_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient credits. Balance: %, Required: %', v_balance, p_amount;
  END IF;

  -- Insert the spend row (negative amount)
  INSERT INTO credit_ledger (project_id, type, amount, description, change_request_id, created_by)
  VALUES (p_project_id, 'spend', -p_amount, 'Credit spend for change request', p_change_request_id, p_created_by);

  v_new_balance := v_balance - p_amount;
  RETURN v_new_balance;
END;
$$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimate_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_cost_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_secrets ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE abuse_reports ENABLE ROW LEVEL SECURITY;

-- Helper: get the current user's org IDs
CREATE OR REPLACE FUNCTION auth_user_org_ids()
RETURNS SETOF uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT o.id FROM organizations o
  WHERE o.owner_id = auth.uid()
$$;

-- Users: users can read their own row
CREATE POLICY users_self_read ON users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY users_self_update ON users
  FOR UPDATE USING (id = auth.uid());

-- Organizations: owners can CRUD their own org
CREATE POLICY orgs_owner_read ON organizations
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY orgs_owner_insert ON organizations
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY orgs_owner_update ON organizations
  FOR UPDATE USING (owner_id = auth.uid());

-- Projects: scoped to user's org
CREATE POLICY projects_org_read ON projects
  FOR SELECT USING (org_id IN (SELECT auth_user_org_ids()));

CREATE POLICY projects_org_insert ON projects
  FOR INSERT WITH CHECK (org_id IN (SELECT auth_user_org_ids()));

CREATE POLICY projects_org_update ON projects
  FOR UPDATE USING (org_id IN (SELECT auth_user_org_ids()));

-- Credit ledger: read-only for clients, scoped to org's projects
CREATE POLICY credit_ledger_read ON credit_ledger
  FOR SELECT USING (
    project_id IN (SELECT id FROM projects WHERE org_id IN (SELECT auth_user_org_ids()))
  );

-- Change requests: scoped to org's projects
CREATE POLICY change_requests_read ON change_requests
  FOR SELECT USING (
    project_id IN (SELECT id FROM projects WHERE org_id IN (SELECT auth_user_org_ids()))
  );

CREATE POLICY change_requests_insert ON change_requests
  FOR INSERT WITH CHECK (
    project_id IN (SELECT id FROM projects WHERE org_id IN (SELECT auth_user_org_ids()))
  );

CREATE POLICY change_requests_update ON change_requests
  FOR UPDATE USING (
    project_id IN (SELECT id FROM projects WHERE org_id IN (SELECT auth_user_org_ids()))
  );

-- Estimate disputes: scoped via change request's project
CREATE POLICY disputes_read ON estimate_disputes
  FOR SELECT USING (
    change_request_id IN (
      SELECT id FROM change_requests WHERE project_id IN (
        SELECT id FROM projects WHERE org_id IN (SELECT auth_user_org_ids())
      )
    )
  );

CREATE POLICY disputes_insert ON estimate_disputes
  FOR INSERT WITH CHECK (
    change_request_id IN (
      SELECT id FROM change_requests WHERE project_id IN (
        SELECT id FROM projects WHERE org_id IN (SELECT auth_user_org_ids())
      )
    )
  );

-- Credit cost types: public read
CREATE POLICY credit_cost_types_read ON credit_cost_types
  FOR SELECT USING (true);

-- Subscriptions: scoped to org's projects
CREATE POLICY subscriptions_read ON subscriptions
  FOR SELECT USING (
    project_id IN (SELECT id FROM projects WHERE org_id IN (SELECT auth_user_org_ids()))
  );

-- Project secrets: scoped, only value_last4 visible (enforced at app layer)
CREATE POLICY secrets_read ON project_secrets
  FOR SELECT USING (
    project_id IN (SELECT id FROM projects WHERE org_id IN (SELECT auth_user_org_ids()))
  );

CREATE POLICY secrets_insert ON project_secrets
  FOR INSERT WITH CHECK (
    project_id IN (SELECT id FROM projects WHERE org_id IN (SELECT auth_user_org_ids()))
    AND managed_by = 'client'
  );

CREATE POLICY secrets_update ON project_secrets
  FOR UPDATE USING (
    project_id IN (SELECT id FROM projects WHERE org_id IN (SELECT auth_user_org_ids()))
    AND managed_by = 'client'
  );

-- Domain verifications: scoped
CREATE POLICY domain_verifications_read ON domain_verifications
  FOR SELECT USING (
    project_id IN (SELECT id FROM projects WHERE org_id IN (SELECT auth_user_org_ids()))
  );

-- Deployments: scoped
CREATE POLICY deployments_read ON deployments
  FOR SELECT USING (
    project_id IN (SELECT id FROM projects WHERE org_id IN (SELECT auth_user_org_ids()))
  );

-- Project messages: scoped
CREATE POLICY messages_read ON project_messages
  FOR SELECT USING (
    project_id IN (SELECT id FROM projects WHERE org_id IN (SELECT auth_user_org_ids()))
  );

CREATE POLICY messages_insert ON project_messages
  FOR INSERT WITH CHECK (
    project_id IN (SELECT id FROM projects WHERE org_id IN (SELECT auth_user_org_ids()))
  );

-- Referrals: org can see their own
CREATE POLICY referrals_read ON referrals
  FOR SELECT USING (referrer_org_id IN (SELECT auth_user_org_ids()));

CREATE POLICY referrals_insert ON referrals
  FOR INSERT WITH CHECK (referrer_org_id IN (SELECT auth_user_org_ids()));

-- Notifications: user's own
CREATE POLICY notifications_read ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY notifications_update ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Audit log: no client access (admin/service role only)
-- No SELECT policy = denied for clients

-- Abuse reports: public insert (anyone can report), no client reads
CREATE POLICY abuse_reports_insert ON abuse_reports
  FOR INSERT WITH CHECK (true);

-- ============================================================
-- REALTIME: Enable for notifications and messages
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE project_messages;
