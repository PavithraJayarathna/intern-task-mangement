
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTaskStore } from '@/stores/taskStore';
import AppLayout from '@/components/AppLayout';
import TaskForm from '@/components/TaskForm';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const AddTask = () => {
  const { addTask } = useTaskStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (data: any) => {
    setIsSubmitting(true);
    
    try {
      // Process the date to be compatible with our Task type
      const task = {
        ...data,
        deadline: data.deadline.toISOString().split('T')[0],
      };
      
      // Add task to store
      addTask(task);
      
      // Show success message
      toast({
        title: "Task created",
        description: "Your task has been created successfully",
      });
      
      // Navigate back to tasks list
      navigate('/tasks');
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h1 className="text-3xl font-bold">Create New Task</h1>
          <p className="text-gray-500 mt-1">
            Add a new task to your task list
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <TaskForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>
    </AppLayout>
  );
};

export default AddTask;
