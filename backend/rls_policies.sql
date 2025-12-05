-- Enable Row Level Security on leads table
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 1️⃣ SELECT POLICY

CREATE POLICY "select_leads_policy"
ON public.leads
FOR SELECT
USING (
    -- Admins can read all
    auth.jwt()->>'role' = 'admin'

    -- Counselors can read their own leads
    OR owner_id = auth.uid()

    -- Counselors can read leads of users in the same team
    OR owner_id IN (
        SELECT ut2.user_id
        FROM user_teams ut1
        JOIN user_teams ut2 ON ut1.team_id = ut2.team_id
        WHERE ut1.user_id = auth.uid()
    )
);

-- 2️⃣ INSERT POLICY

CREATE POLICY "insert_leads_policy"
ON public.leads
FOR INSERT
WITH CHECK (
    auth.jwt()->>'role' = 'admin'
    OR owner_id = auth.uid()
);
