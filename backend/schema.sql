-- ===========================
--   LEARNLYNK TECH TEST
--   SECTION 1 — SCHEMA
-- ===========================

-- 1️⃣ LEADS TABLE
CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    owner_id UUID NOT NULL,
    stage TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_leads_owner ON public.leads(owner_id);
CREATE INDEX idx_leads_stage ON public.leads(stage);
CREATE INDEX idx_leads_created ON public.leads(created_at);

-----------------------------------------------------

-- 2️⃣ APPLICATIONS TABLE
CREATE TABLE public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index: fetch applications by lead
CREATE INDEX idx_applications_lead ON public.applications(lead_id);

-----------------------------------------------------

-- 3️⃣ TASKS TABLE
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    related_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    due_at TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- due_at >= created_at
    CONSTRAINT tasks_due_at_check CHECK (due_at >= created_at),

    -- task_type check constraint
    CONSTRAINT tasks_type_check CHECK (type IN ('call','email','review'))
);

-- Index: fetch tasks due today
CREATE INDEX idx_tasks_due_at ON public.tasks(due_at);
