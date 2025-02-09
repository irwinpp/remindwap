'use client';

import { useState } from 'react';
import { Plus, CheckCircle, ChevronLeft } from 'lucide-react';
import './globals.css'; // Import the CSS file

export default function GoalTracker() {
  const [ goals, setGoals ] = useState([]);
  const [ showAddForm, setShowAddForm ] = useState(false);
  const [ bigGoal, setBigGoal ] = useState('');
  const [ loading, setLoading ] = useState(false);

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
        intro: data.intro || "Here are your steps to achieve your goal:", // Ensure intro is separate
        steps: data.steps.map(step => ({ text: step, completed: false })),
        showInfo: true,
      };

      setGoals([ ...goals, newGoal ]);
      setBigGoal("");
      setShowAddForm(false);
    } catch (error) {
      console.error("Error fetching AI-generated steps:", error);
    }
    setLoading(false);
  };

  const toggleStep = (goalIndex, stepIndex) => {
    const newGoals = [ ...goals ];
    newGoals[ goalIndex ].steps[ stepIndex ].completed = !newGoals[ goalIndex ].steps[ stepIndex ].completed;
    setGoals(newGoals);
  };

  const toggleGoalInfo = (goalIndex) => {
    const newGoals = [...goals];
    newGoals[goalIndex].showInfo = !newGoals[goalIndex].showInfo;
    setGoals(newGoals);
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
                required
              />
            </div>

            <button type="submit" className="save-button" disabled={loading}>
              {loading ? "Generating Steps..." : "Break It Down"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <div className="goal-list">
        <h1>🎯 Goal Tracker</h1>

        <div className="goal-items">
          {goals.map((goal, goalIndex) => (
            <div key={goalIndex} className="goal-card">
              <button onClick={() => toggleGoalInfo(goalIndex)} className="toggle-info-button">
                <ChevronLeft className={`icon ${goal.showInfo ? 'expanded' : 'collapsed'}`} />
              </button>
              <h3 className="goal-title">{goal.title}</h3>

              {goal.showInfo && (
                <div className="goal-info">
                  <p className="goal-intro">{goal.intro}</p> {/* Intro text without checkmark */}
                  <ul className="goal-steps">
                    {goal.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className={`goal-step ${step.completed ? 'completed' : ''}`}>
                        <button onClick={() => toggleStep(goalIndex, stepIndex)} className="check-button">
                          <CheckCircle className={`icon ${step.completed ? 'checked' : ''}`} />
                        </button>
                        <span className="step-text">{step.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
    </main>
  );
}
