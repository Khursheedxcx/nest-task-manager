import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle2, Circle, Trash2, Search } from 'lucide-react';

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const API_URL = 'http://localhost:3000/tasks';

  useEffect(() => { fetchTasks(); }, []);

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
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length
  };

  return (
    <div className="page-container">

      {/* Header */}
      <div className="header">
        <h1 className="title">Task Manager</h1>
        <p className="subtitle">Organize your work with style</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Tasks</div>
        </div>

        <div className="stat-card green">
          <div className="stat-number">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>

        <div className="stat-card orange">
          <div className="stat-number">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-box">
        <div className="search-box">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          {['all', 'pending', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={filter === f ? 'filter-btn active' : 'filter-btn'}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <button className="add-btn" onClick={() => setShowAddModal(true)}>
          <Plus /> Add Task
        </button>
      </div>

      {/* Task List */}
      <div className="task-list">
        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="no-tasks">No tasks found</div>
        ) : (
          filteredTasks.map(task => (
            <div className="task-card" key={task.id}>
              <button className="task-toggle" onClick={() => toggleTask(task)}>
                {task.status === 'completed'
                  ? <CheckCircle2 className="icon-completed" />
                  : <Circle className="icon-pending" />}
              </button>

              <div className="task-content">
                <h3 className={task.status === 'completed' ? 'task-title done' : 'task-title'}>
                  {task.title}
                </h3>
                {task.description && <p className="task-desc">{task.description}</p>}
                <span className={task.status === 'completed' ? 'badge green' : 'badge orange'}>
                  {task.status}
                </span>
              </div>

              <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                <Trash2 />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create New Task</h2>

            <div className="modal-field">
              <label>Title</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>

            <div className="modal-field">
              <label>Description</label>
              <textarea
                rows="3"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              ></textarea>
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="create-btn" onClick={createTask}>
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
