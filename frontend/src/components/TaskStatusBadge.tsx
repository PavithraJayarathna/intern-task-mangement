
import { cn } from "@/lib/utils";

interface TaskStatusBadgeProps {
  status: 'Pending' | 'In Progress' | 'Done';
  className?: string;
}

const TaskStatusBadge = ({ status, className }: TaskStatusBadgeProps) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'Pending':
        return 'bg-task-pending text-yellow-800';
      case 'In Progress':
        return 'bg-task-inprogress text-blue-800';
      case 'Done':
        return 'bg-task-done text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      getStatusStyles(),
      className
    )}>
      {status}
    </span>
  );
};

export default TaskStatusBadge;
