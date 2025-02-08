'use client';

import { useState } from 'react';
import { Bell, ChevronLeft, Plus, Edit2 } from 'lucide-react';
import './globals.css'; // Import the CSS file

export default function HealthyHabitsPage() {
  const [habits, setHabits] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabit, setNewHabit] = useState({
    title: '',
    description: '',
    category: 'Personal',
    active: true
  });

  const addHabit = (e) => {
    e.preventDefault();
    if (newHabit.title.trim()) {
      setHabits([...habits, newHabit]);
      setNewHabit({
        title: '',
        description: '',
        category: 'Personal',
        active: true
      });
      setShowAddForm(false);
    }
  };

  const toggleHabit = (index) => {
    const newHabits = [...habits];
    newHabits[index].active = !newHabits[index].active;
    setHabits(newHabits);
  };

  if (showAddForm) {
    return (
      <main className="container">
        <div className="form-container">
          <div className="form-header">
            <button 
              onClick={() => setShowAddForm(false)}
              className="back-button"
            >
              <ChevronLeft className="icon" />
            </button>
            <h1>Add New Habit</h1>
          </div>

          <form onSubmit={addHabit} className="form">
            <div className="input-group">
              <label>Title</label>
              <input
                type="text"
                value={newHabit.title}
                onChange={(e) => setNewHabit({...newHabit, title: e.target.value})}
                placeholder="Enter habit title"
              />
            </div>

            <div className="input-group">
              <label>Description</label>
              <textarea
                value={newHabit.description}
                onChange={(e) => setNewHabit({...newHabit, description: e.target.value})}
                placeholder="Write a short description..."
              />
            </div>

            <div className="input-group">
              <label>Category</label>
              <select
                value={newHabit.category}
                onChange={(e) => setNewHabit({...newHabit, category: e.target.value})}
              >
                <option>Personal</option>
                <option>Work</option>
                <option>Health</option>
                <option>Others</option>
              </select>
            </div>

            <button type="submit" className="save-button">
              Save Habit
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <div className="habit-list">
        <h1>🌱 Healthy Habits</h1>

        <div className="habit-items">
          {habits.map((habit, index) => (
            <div key={index} className="habit-card">
              <div className="habit-info">
                <Bell className="habit-icon" />
                <div>
                  <h3>{habit.title}</h3>
                  <p>Category: {habit.category}</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={habit.active}
                  onChange={() => toggleHabit(index)}
                />
                <span className="slider"></span>
              </label>
            </div>
          ))}
          
          {habits.length === 0 && (
            <div className="empty-message">
              Add your first habit to get started! 🌱
            </div>
          )}
        </div>

        {/* Floating Add Button */}
        <button
          onClick={() => setShowAddForm(true)}
          className="add-button"
        >
          <Plus className="icon" />
        </button>
      </div>
    </main>
  );
}
