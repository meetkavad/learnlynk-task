import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function TodayTasks() {
  const qc = useQueryClient();

  const fetchTasks = async () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .gte("due_at", start.toISOString())
      .lte("due_at", end.toISOString());

    if (error) throw error;
    return data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks_today"],
    queryFn: fetchTasks,
  });

  const markComplete = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("tasks")
        .update({ status: "completed" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries(["tasks_today"]),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading tasks</div>;

  return (
    <div>
      <h1>Tasks Due Today</h1>
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Application ID</th>
            <th>Due At</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.related_id}</td>
              <td>{new Date(task.due_at).toLocaleString()}</td>
              <td>{task.status}</td>
              <td>
                <button
                  disabled={task.status === "completed"}
                  onClick={() => markComplete.mutate(task.id)}
                >
                  Mark Complete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
