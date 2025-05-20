
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTaskStore } from '@/stores/taskStore';
import AppLayout from '@/components/AppLayout';
import TaskForm from '@/components/TaskForm';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const EditTask = () => {
  const { id } = useParams<{ id: string }>();
  const { getTaskById, updateTask } = useTaskStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const task = id ? getTaskById(id) : undefined;

  useEffect(() => {
    if (!task && id) {
      toast({
        title: "Task not found",
        description: "The task you're trying to edit does not exist.",
        variant: "destructive",
      });
      navigate('/tasks');
    }
  }, [task, id, navigate, toast]);

  const handleSubmit = (data: any) => {
    if (!id) return;
    
    setIsSubmitting(true);
    
    try {
      // Process the date to be compatible with our Task type
      const updatedTask = {
        ...data,
        deadline: data.deadline.toISOString().split('T')[0],
      };
      
      // Update task in store
      updateTask(id, updatedTask);
      
      // Show success message
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully",
      });
      
      // Navigate back to tasks list
      navigate('/tasks');
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!task) {
    return null;
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Edit Task</h1>
          <p className="text-gray-500 mt-1">
            Update the details of your task
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <TaskForm 
            initialData={task} 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting} 
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default EditTask;
