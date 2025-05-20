
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Edit, Trash2 } from "lucide-react";
import { Task } from "@/stores/taskStore";
import TaskStatusBadge from "./TaskStatusBadge";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
}

const TaskCard = ({ task, onDelete }: TaskCardProps) => {
  const formattedDate = task.deadline ? format(new Date(task.deadline), 'PPP') : 'No deadline';

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">{task.title}</h3>
          <TaskStatusBadge status={task.status} />
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{formattedDate}</span>
        </div>
        <div className="text-sm mt-2">
          <span className="font-medium">Assigned to:</span> {task.assignedTo}
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <Link to={`/tasks/${task.id}`}>
          <Button variant="outline" size="sm">View</Button>
        </Link>
        <div className="space-x-2">
          <Link to={`/edit-task/${task.id}`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={() => onDelete(task.id)}>
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
