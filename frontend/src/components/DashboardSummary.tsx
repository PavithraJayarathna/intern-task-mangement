
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Task } from "@/stores/taskStore";

interface DashboardSummaryProps {
  tasks: Task[];
}

const DashboardSummary = ({ tasks }: DashboardSummaryProps) => {
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(task => task.status === 'Pending').length;
  const inProgressTasks = tasks.filter(task => task.status === 'In Progress').length;
  const completedTasks = tasks.filter(task => task.status === 'Done').length;

  const summaryItems = [
    { title: 'Total Tasks', value: totalTasks, color: 'bg-primary-blue-100 text-primary-blue-300' },
    { title: 'Pending', value: pendingTasks, color: 'bg-task-pending text-yellow-800' },
    { title: 'In Progress', value: inProgressTasks, color: 'bg-task-inprogress text-blue-800' },
    { title: 'Completed', value: completedTasks, color: 'bg-task-done text-green-800' },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {summaryItems.map((item, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{item.value}</div>
              <div className={`${item.color} p-2 rounded-md`}>
                <span className="text-xl font-semibold">{Math.round((item.value / totalTasks) * 100) || 0}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardSummary;
