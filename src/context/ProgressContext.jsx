import { createContext, useContext, useState, useEffect } from 'react';

const ProgressContext = createContext(null);

const defaultProgress = {
  experiments: {},
  examScores: [],
  totalTime: 0
};

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('phylab_progress');
    return saved ? JSON.parse(saved) : defaultProgress;
  });

  useEffect(() => {
    localStorage.setItem('phylab_progress', JSON.stringify(progress));
  }, [progress]);

  const updateExperiment = (id, data) => {
    setProgress(prev => ({
      ...prev,
      experiments: {
        ...prev.experiments,
        [id]: { ...prev.experiments[id], ...data, lastAccessed: Date.now() }
      }
    }));
  };

  const markCompleted = (id, score = 100) => {
    updateExperiment(id, { completed: true, score, completedAt: Date.now() });
  };

  const addExamScore = (score, experimentId, timeTaken) => {
    setProgress(prev => ({
      ...prev,
      examScores: [...prev.examScores, { score, experimentId, timeTaken, date: Date.now() }]
    }));
  };

  const addTime = (seconds) => {
    setProgress(prev => ({ ...prev, totalTime: prev.totalTime + seconds }));
  };

  const getExperimentProgress = (id) => progress.experiments[id] || { completed: false, score: 0, observations: [] };

  const getCompletedCount = () => Object.values(progress.experiments).filter(e => e.completed).length;

  const resetProgress = () => {
    setProgress(defaultProgress);
    localStorage.removeItem('phylab_progress');
  };

  return (
    <ProgressContext.Provider value={{ progress, updateExperiment, markCompleted, addExamScore, addTime, getExperimentProgress, getCompletedCount, resetProgress }}>
      {children}
    </ProgressContext.Provider>
  );
}

export const useProgress = () => useContext(ProgressContext);
