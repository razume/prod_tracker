import React from 'react';

export default function Score({ currentActivities }) {
  const score =
    currentActivities.filter(activity => activity.type === 'productive')
      .length -
    currentActivities.filter(activity => activity.type === 'unproductive')
      .length;

  return (
    <div className="score-container">
      {score === 0 ? (
        <div className="neutral-score">{score}</div>
      ) : score > 0 ? (
        <div className="positive-score">{score}</div>
      ) : (
        <div className="negative-score">{score}</div>
      )}
    </div>
  );
}
