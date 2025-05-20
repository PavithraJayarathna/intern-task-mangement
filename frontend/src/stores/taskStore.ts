
import { create } from 'zustand';

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  assignedTo: string;
  status: 'Pending' | 'In Progress' | 'Done';
  createdAt: string;
  updatedAt: string;
}

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
}

// Generate a random ID for tasks
const generateId = () => Math.random().toString(36).substring(2, 9);

// Mock data for initial tasks
const initialTasks: Task[] = [
  {
    id: generateId(),
    title: "Complete project proposal",
    description: "Write a detailed proposal for the new client project",
    deadline: "2025-06-01",
    assignedTo: "John Doe",
    status: "Pending",
    createdAt: "2025-05-15T10:30:00",
    updatedAt: "2025-05-15T10:30:00"
  },
  {
    id: generateId(),
    title: "Design user interface mockups",
    description: "Create UI/UX mockups for the dashboard section",
    deadline: "2025-05-28",
    assignedTo: "Jane Smith",
    status: "In Progress",
    createdAt: "2025-05-14T09:15:00",
    updatedAt: "2025-05-14T14:20:00"
  },
  {
    id: generateId(),
    title: "Database schema review",
    description: "Review and finalize the database schema design",
    deadline: "2025-05-25",
    assignedTo: "Mike Johnson",
    status: "Done",
    createdAt: "2025-05-10T11:45:00",
    updatedAt: "2025-05-18T16:30:00"
  }
];

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: initialTasks,
  
  addTask: (task) => set((state) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...task,
      id: generateId(),
      createdAt: now,
      updatedAt: now
    };
    
    return { tasks: [...state.tasks, newTask] };
  }),
  
  updateTask: (id, updatedTask) => set((state) => {
    const now = new Date().toISOString();
    return {
      tasks: state.tasks.map((task) =>
        task.id === id
          ? { ...task, ...updatedTask, updatedAt: now }
          : task
      )
    };
  }),
  
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((task) => task.id !== id)
  })),
  
  getTaskById: (id) => {
    const { tasks } = get();
    return tasks.find((task) => task.id === id);
  }
}));
