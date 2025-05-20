import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import AppLayout from '@/components/AppLayout';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { useTaskStore, Task } from '@/stores/taskStore';
import { Link } from 'react-router-dom';
import TaskStatusBadge from '@/components/TaskStatusBadge';
import { DayContentProps } from 'react-day-picker';

const Calendar = () => {
  const { tasks } = useTaskStore();

  // Group only Pending and In Progress tasks by date
  const tasksByDate = useMemo(() => {
    const grouped: Record<string, Task[]> = {};

    tasks
      .filter(task => (task.status === 'Pending' || task.status === 'In Progress') && task.deadline)
      .forEach(task => {
        try {
          const dateKey = format(new Date(task.deadline), 'yyyy-MM-dd');
          if (!grouped[dateKey]) {
            grouped[dateKey] = [];
          }
          grouped[dateKey].push(task);
        } catch (err) {
          console.error('Invalid date in task:', task, err);
        }
      });

    return grouped;
  }, [tasks]);

  // Get tasks for currently selected date
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const selectedDateTasks = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    return tasksByDate[dateKey] || [];
  }, [selectedDate, tasksByDate]);

  // Custom day content component — typed as function returning JSX.Element
  const DayContent = (props: DayContentProps): JSX.Element => {
    const dateKey = format(props.date, 'yyyy-MM-dd');
    const dayTasks = tasksByDate[dateKey] || [];

    return (
      <div className="w-full h-full">
        <div className="text-center">
          <span>{format(props.date, 'd')}</span>
        </div>
        {dayTasks.length > 0 && (
          <div className="mt-1">
            {dayTasks.length > 2 ? (
              <div className="text-xs text-center bg-primary-blue-100 text-primary-blue-300 rounded-full px-1">
                {dayTasks.length} tasks
              </div>
            ) : (
              dayTasks.map((task, i) => (
                <div key={i} className="text-xs truncate px-1" title={task.title}>
                  <div
                    className="w-2 h-2 rounded-full inline-block mr-1"
                    style={{
                      backgroundColor:
                        task.status === 'Pending'
                          ? '#F59E0B'
                          : task.status === 'In Progress'
                          ? '#3B82F6'
                          : '#10B981',
                    }}
                  />
                  {task.title.substring(0, 6)}...
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar View</h1>
          <p className="text-muted-foreground">
            View and manage your tasks in calendar format
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardContent className="pt-6">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                components={{
                  DayContent: DayContent
                }}
              />
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Tasks for {selectedDate ? format(selectedDate, 'PPP') : 'Selected Date'}
            </h2>

            {selectedDateTasks.length > 0 ? (
              selectedDateTasks.map((task) => (
                <Link key={task.id} to={`/tasks/${task.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {task.description}
                          </p>
                        </div>
                        <TaskStatusBadge status={task.status} />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-muted-foreground">
                  No tasks scheduled for this date.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Calendar;
