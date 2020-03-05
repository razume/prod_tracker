import React from 'react';

export default function ActivityList({ activities, deleteActivity }) {
  return (
    <div className="activity-list">
      <h4>Tracked Activities</h4>
      <ul>
        {activities.map(activity => {
          return (
            <li key={activity.id}>
              <span className="entry">
                <span className="entry-text">
                  {activity.text} - {activity.type}
                </span>
                <span className="entry-icons">
                  <i className="gg-pen" />
                  <i
                    className="gg-trash"
                    onClick={() => deleteActivity(activity)}
                  />
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
