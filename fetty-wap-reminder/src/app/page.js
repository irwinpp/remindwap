// app/page.js
'use client';

import { useState } from 'react';
import { Bell, ChevronLeft, Plus, Edit2 } from 'lucide-react';

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
      <main className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => setShowAddForm(false)}
              className="text-gray-600 p-2"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-medium ml-2">Add Habit</h1>
          </div>

          <form onSubmit={addHabit} className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <label className="block text-sm text-gray-600 mb-1">Title</label>
              <input
                type="text"
                value={newHabit.title}
                onChange={(e) => setNewHabit({...newHabit, title: e.target.value})}
                placeholder="Enter Title"
                className="w-full p-2 bg-gray-50 rounded-lg focus:outline-none"
              />
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <label className="block text-sm text-gray-600 mb-1">Description</label>
              <textarea
                value={newHabit.description}
                onChange={(e) => setNewHabit({...newHabit, description: e.target.value})}
                placeholder="Enter Description"
                className="w-full p-2 bg-gray-50 rounded-lg focus:outline-none"
                rows="3"
              />
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <label className="block text-sm text-gray-600 mb-1">Category</label>
              <select
                value={newHabit.category}
                onChange={(e) => setNewHabit({...newHabit, category: e.target.value})}
                className="w-full p-2 bg-gray-50 rounded-lg focus:outline-none"
              >
                <option>Personal</option>
                <option>Work</option>
                <option>Health</option>
                <option>Others</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors"
            >
              Save Habit
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-xl font-medium mb-6">Habits</h1>

        <div className="space-y-3">
          {habits.map((habit, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-teal-500" />
                  <div>
                    <h3 className="font-medium">{habit.title}</h3>
                    <p className="text-sm text-gray-500">Category: {habit.category}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={habit.active}
                    onChange={() => toggleHabit(index)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                </label>
              </div>
            </div>
          ))}
          
          {habits.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              Add your first habit to get started! 🌱
            </div>
          )}
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="fixed bottom-6 right-6 w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-teal-600 transition-colors"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </main>
  );
}