import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Only POST allowed" }), {
        status: 400,
      });
    }

    const body = await req.json();
    const { application_id, task_type, due_at } = body;

    // 1. Validate task_type
    const allowed = ["call", "email", "review"];
    if (!allowed.includes(task_type)) {
      return new Response(JSON.stringify({ error: "Invalid task type" }), {
        status: 400,
      });
    }

    // 2. Validate due_at
    const dueDate = new Date(due_at);
    if (isNaN(dueDate.getTime()) || dueDate <= new Date()) {
      return new Response(JSON.stringify({ error: "due_at must be in future" }), {
        status: 400,
      });
    }

    // 3. Service Role Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Insert task
    const { data, error } = await supabase
      .from("tasks")
      .insert({
        related_id: application_id,
        type: task_type,
        due_at,
        title: `${task_type} task`
      })
      .select("id")
      .single();

    if (error) throw error;

    // 4. Broadcast event
    await supabase.channel("task.created").send({
      type: "broadcast",
      event: "task.created",
      payload: { task_id: data.id },
    });

    return new Response(JSON.stringify({ success: true, task_id: data.id }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
});
