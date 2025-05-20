
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { useTaskStore, Task } from '@/stores/taskStore';
import DashboardSummary from '@/components/DashboardSummary';
import TaskCard from '@/components/TaskCard';
import AppLayout from '@/components/AppLayout';

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, deleteTask } = useTaskStore();

  const getRecentTasks = (allTasks: Task[], limit: number = 4): Task[] => {
    return [...allTasks]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, limit);
  };

  const recentTasks = getRecentTasks(tasks);

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };

  const getTimeBasedGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {getTimeBasedGreeting()}, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-muted-foreground">
              Here's an overview of your tasks
            </p>
          </div>

          <Link to="/add-task">
            <Button className="mt-4 md:mt-0">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Task
            </Button>
          </Link>
        </div>

        <DashboardSummary tasks={tasks} />

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Tasks</h2>
            <Link to="/tasks" className="text-sm text-primary-blue-200 hover:underline">
              View all
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onDelete={handleDeleteTask} 
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-muted-foreground">No tasks found. Add your first task!</p>
                <Link to="/add-task">
                  <Button variant="outline" className="mt-4">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Task
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
