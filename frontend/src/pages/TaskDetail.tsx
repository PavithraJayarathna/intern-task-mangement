
import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Edit } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useTaskStore } from '@/stores/taskStore';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import TaskStatusBadge from '@/components/TaskStatusBadge';
import { useToast } from '@/hooks/use-toast';

const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getTaskById, deleteTask } = useTaskStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const task = id ? getTaskById(id) : undefined;

  useEffect(() => {
    if (!task && id) {
      toast({
        title: "Task not found",
        description: "The requested task does not exist.",
        variant: "destructive",
      });
      navigate('/tasks');
    }
  }, [task, id, navigate, toast]);

  if (!task) {
    return null;
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
      toast({
        title: "Task deleted",
        description: "The task has been deleted successfully",
      });
      navigate('/tasks');
    }
  };

  const formatDateTime = (dateTimeStr: string) => {
    try {
      return format(parseISO(dateTimeStr), 'PPpp');
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tasks
        </Button>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row justify-between md:items-center">
              <h1 className="text-2xl font-bold mb-2 md:mb-0">{task.title}</h1>
              <TaskStatusBadge status={task.status} className="text-sm md:text-base px-3 py-1" />
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
                
                <div className="mt-8">
                  <h2 className="text-lg font-semibold mb-2">Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Assigned To</p>
                      <p>{task.assignedTo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <TaskStatusBadge status={task.status} />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-4">Timeline</h3>
                <div className="space-y-4">
                  <div className="flex">
                    <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Deadline</p>
                      <p>{format(new Date(task.deadline), 'PPP')}</p>
                    </div>
                  </div>
                  <div className="flex">
                    <Clock className="h-5 w-5 text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Created</p>
                      <p>{formatDateTime(task.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex">
                    <Clock className="h-5 w-5 text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p>{formatDateTime(task.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-4">
            <Button variant="outline" onClick={handleDelete} className="text-red-600 hover:bg-red-50">
              Delete
            </Button>
            <Link to={`/edit-task/${task.id}`}>
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Edit Task
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default TaskDetail;
