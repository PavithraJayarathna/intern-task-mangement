
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();

  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const features = [
    {
      title: 'Task Management',
      description: 'Create, edit, and organize your tasks with ease.',
    },
    {
      title: 'Dashboard Analytics',
      description: 'Track your progress with visual analytics and summaries.',
    },
    {
      title: 'Calendar Integration',
      description: 'View your tasks in an intuitive calendar format.',
    },
    {
      title: 'PDF Reports',
      description: 'Generate and download task reports in PDF format.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary-blue-300">TaskMaster</h1>
          </div>
          <Link to="/login">
            <Button size="sm">Sign In</Button>
          </Link>
        </div>
      </header>

      {/* Hero section */}
      <section className="flex-1 bg-gradient-to-b from-primary-blue-100 to-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-blue-300 mb-6 animate-fade-in">
              Manage Your Tasks With Ease
            </h1>
            <p className="text-xl text-gray-700 mb-8 animate-fade-in">
              The simple, efficient way to organize your tasks, track progress,
              and boost productivity.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow"
              >
                <div className="text-primary-blue-200 mb-4 flex justify-center">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-blue-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to get organized?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Start managing your tasks more efficiently today with TaskMaster.
          </p>
          <Link to="/login">
            <Button size="lg">
              Sign In with Google
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-lg font-semibold mb-4 md:mb-0">TaskMaster</p>
            <div className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} TaskMaster. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
