import React, { useState, useEffect } from 'react';
import { Plus, Check, Trash2, Search, Filter, Circle, CheckCircle2 } from 'lucide-react';

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const API_URL = 'http://localhost:3000/tasks'; // Change this to match your backend

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async () => {
    if (!newTask.title.trim()) return;
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newTask, status: 'pending' })
      });
      const data = await response.json();
      setTasks([...tasks, data]);
      setNewTask({ title: '', description: '' });
      setShowAddModal(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const toggleTask = async (task) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      const response = await fetch(`${API_URL}/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const updated = await response.json();
      setTasks(tasks.map(t => t.id === task.id ? updated : t));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.status === filter;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      {/* Floating background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
            Task Manager
          </h1>
          <p className="text-gray-600">Organize your work with style</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Tasks', value: stats.total, color: 'from-blue-500 to-cyan-500' },
            { label: 'Completed', value: stats.completed, color: 'from-green-500 to-emerald-500' },
            { label: 'Pending', value: stats.pending, color: 'from-orange-500 to-amber-500' }
          ].map((stat, i) => (
            <div key={i} className="backdrop-blur-xl bg-white/40 border border-white/60 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                {stat.value}
              </div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="backdrop-blur-xl bg-white/40 border border-white/60 rounded-3xl p-6 mb-6 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/60 border border-white/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white/80 transition-all"
              />
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              {['all', 'pending', 'completed'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                    filter === f
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'bg-white/60 text-gray-700 hover:bg-white/80'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* Add Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Task
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading tasks...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="backdrop-blur-xl bg-white/40 border border-white/60 rounded-3xl p-12 text-center shadow-xl">
              <p className="text-gray-500 text-lg">No tasks found</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div
                key={task.id}
                className="backdrop-blur-xl bg-white/40 border border-white/60 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group"
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleTask(task)}
                    className="mt-1 flex-shrink-0 transition-all duration-300 hover:scale-110"
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400 group-hover:text-purple-400" />
                    )}
                  </button>

                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold mb-1 transition-all ${
                      task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-800'
                    }`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-gray-600 text-sm">{task.description}</p>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        task.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="flex-shrink-0 p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all duration-300 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Task Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="backdrop-blur-xl bg-white/90 border border-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Create New Task
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-4 py-3 bg-white/60 border border-white/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                    placeholder="Enter task title..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full px-4 py-3 bg-white/60 border border-white/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all resize-none"
                    rows="3"
                    placeholder="Enter task description..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 bg-white/60 text-gray-700 rounded-2xl font-medium hover:bg-white/80 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={createTask}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  Create Task
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}