import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    axios.get('/api/activities').then(response => setActivities(response.data));
  }, []);

  const createProdActivity = () => {
    const activityText = document.querySelector('[name="activity-text"]').value;
    if (activityText) {
      axios
        .post('/api/activities', { text: activityText, type: 'productive' })
        .then(response => response.data)
        .then(activity => setActivities([...activities, activity]))
        .then(
          () => (document.querySelector('[name="activity-text"]').value = '')
        );
    }
  };

  const createUnprodActivity = () => {
    const activityText = document.querySelector('[name="activity-text"]').value;
    if (activityText) {
      axios
        .post('/api/activities', { text: activityText, type: 'unproductive' })
        .then(response => response.data)
        .then(activity => setActivities([...activities, activity]))
        .then(
          () => (document.querySelector('[name="activity-text"]').value = '')
        );
    }
  };

  const deleteActivity = activityToDelete => {
    axios.delete(`/api/activities/${activityToDelete.id}`).then(() => {
      axios.get('/api/activities').then(() => {
        setActivities(
          activities.filter(activity => activity.id !== activityToDelete.id)
        );
      });
    });
  };

  return (
    <div>
      <div className="title">
        <h2>Productivity Score</h2>
      </div>
      <div className="score-container">
        <div className="score">
          {activities.filter(activity => activity.type === 'productive')
            .length -
            activities.filter(activity => activity.type === 'unproductive')
              .length}
        </div>
      </div>
      <div className="form-container">
        <div className="activity-form">
          <input name="activity-text" placeholder="describe your activity" />
          <span>
            <input
              type="button"
              value="productive"
              onClick={createProdActivity}
            />
            <input
              type="button"
              value="unproductive"
              onClick={createUnprodActivity}
            />
          </span>
        </div>
      </div>
      <div className="activity-list">
        <h4>Tracked Activities:</h4>
        <ul>
          {activities.map(activity => {
            return (
              <li key={activity.id}>
                {activity.text} - {activity.type}{' '}
                <input
                  type="button"
                  onClick={() => deleteActivity(activity)}
                  value="X"
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default App;
