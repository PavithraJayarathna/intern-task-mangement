
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Download, PlusCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import { useTaskStore, Task } from '@/stores/taskStore';
import AppLayout from '@/components/AppLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TaskStatusBadge from '@/components/TaskStatusBadge';
import { format } from 'date-fns';

const TaskList = () => {
  const { tasks, deleteTask } = useTaskStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'deadline' | 'title'>('deadline');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter and sort tasks
  const filteredTasks = tasks.filter(task => {
    const matchesQuery = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    
    return matchesQuery && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'deadline') {
      const dateA = new Date(a.deadline).getTime();
      const dateB = new Date(b.deadline).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else {
      return sortOrder === 'asc' 
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
  });

  // Toggle sort order
  const toggleSort = (field: 'deadline' | 'title') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Task Management Report', 105, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Generated on ${format(new Date(), 'PP')}`, 105, 22, { align: 'center' });
    
    // Add filters info
    doc.setFontSize(10);
    doc.text(`Filters: Status - ${statusFilter}, Search - ${searchQuery || 'None'}`, 20, 30);
    
    // Add table headers
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Title', 20, 40);
    doc.text('Status', 100, 40);
    doc.text('Deadline', 130, 40);
    doc.text('Assigned To', 170, 40);
    
    // Add table content
    doc.setFont('helvetica', 'normal');
    let yPos = 50;
    
    filteredTasks.forEach((task, index) => {
      // Check if we need a new page
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
        
        // Add table headers to new page
        doc.setFont('helvetica', 'bold');
        doc.text('Title', 20, yPos);
        doc.text('Status', 100, yPos);
        doc.text('Deadline', 130, yPos);
        doc.text('Assigned To', 170, yPos);
        doc.setFont('helvetica', 'normal');
        yPos += 10;
      }
      
      // Truncate title if too long
      const title = task.title.length > 40 ? task.title.substring(0, 37) + '...' : task.title;
      
      doc.text(title, 20, yPos);
      doc.text(task.status, 100, yPos);
      doc.text(format(new Date(task.deadline), 'PP'), 130, yPos);
      doc.text(task.assignedTo, 170, yPos);
      
      yPos += 10;
    });
    
    // Save the PDF
    doc.save('task-report.pdf');
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Task Management</h1>
          <Link to="/add-task">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Task
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Done">Done</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={generatePDF}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">
                  <button
                    onClick={() => toggleSort('title')}
                    className="flex items-center space-x-1 hover:text-primary-blue-300"
                  >
                    <span>Title</span>
                    {sortBy === 'title' && (
                      <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <button
                    onClick={() => toggleSort('deadline')}
                    className="flex items-center space-x-1 hover:text-primary-blue-300"
                  >
                    <span>Deadline</span>
                    {sortBy === 'deadline' && (
                      <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>
                      <TaskStatusBadge status={task.status} />
                    </TableCell>
                    <TableCell>{format(new Date(task.deadline), 'PP')}</TableCell>
                    <TableCell>{task.assignedTo}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Link to={`/tasks/${task.id}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                      <Link to={`/edit-task/${task.id}`}>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteTask(task.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No tasks found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
};

export default TaskList;
