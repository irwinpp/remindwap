'use client';

import { useState } from 'react';
import { Plus, CheckCircle, ChevronLeft } from 'lucide-react';
import './globals.css'; // Import the global CSS file

export default function GoalTracker() {
  const [goals, setGoals] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [bigGoal, setBigGoal] = useState('');
  const [loading, setLoading] = useState(false);

  const addGoal = async (e) => {
    e.preventDefault();
    if (!bigGoal.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: bigGoal }),
      });

      const data = await response.json();

      if (!data.steps || !Array.isArray(data.steps)) {
        throw new Error("Invalid response from AI");
      }

      const newGoal = {
        title: bigGoal,
        steps: data.steps.map(step => ({ text: step, completed: false })),
      };

      setGoals([...goals, newGoal]);
      setBigGoal("");
      setShowAddForm(false);
    } catch (error) {
      console.error("Error fetching AI-generated steps:", error);
    }
    setLoading(false);
  };

  const toggleStep = (goalIndex, stepIndex) => {
    const newGoals = [...goals];
    newGoals[goalIndex].steps[stepIndex].completed = !newGoals[goalIndex].steps[stepIndex].completed;
    setGoals(newGoals);
  };

  return (
    <main className="container">
      {showAddForm ? (
        <div className="form-container">
          <div className="form-header">
            <button
              onClick={() => setShowAddForm(false)}
              className="back-button"
            >
              <ChevronLeft className="icon" />
            </button>
            <h1>Add New Goal</h1>
          </div>

          <form onSubmit={addGoal} className="form">
            <div className="input-group">
              <label>Big Goal</label>
              <input
                type="text"
                value={bigGoal}
                onChange={(e) => setBigGoal(e.target.value)}
                placeholder="Enter your big goal..."
              />
            </div>

            <button type="submit" className="save-button" disabled={loading}>
              {loading ? "Generating Steps..." : "Break It Down"}
            </button>
          </form>
        </div>
      ) : (
        <div>
          <img src="https://cdn.discordapp.com/attachments/1337911766910238730/1337971181063635004/fettyway.png?ex=67a96243&is=67a810c3&hm=5d84bb31f3a353b54e39c8241a759b9f6724a0fe07cd54d81776184c72b97bf0" 
               alt="Company Logo" 
               className="company-logo" />
          <h1>🎯 Goal Tracker 🎯</h1>
          <div className="goal-items">
            {goals.map((goal, goalIndex) => (
              <div key={goalIndex} className="goal-card">
                <h3>{goal.title}</h3>
                <ul className="goal-steps">
                  {goal.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className={`goal-step ${step.completed ? 'completed' : ''}`}>
                      <button onClick={() => toggleStep(goalIndex, stepIndex)}>
                        <CheckCircle className={`icon ${step.completed ? 'completed-icon' : ''}`} />
                      </button>
                      {step.text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {goals.length === 0 && (
              <div className="empty-message">
                Add your first goal to get started! 🎯
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
      )}
    </main>
  );
}
