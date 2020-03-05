import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Score from './components/Score';
import ActivityForm from './components/ActivityForm';
import ActivityList from './components/ActivityList';

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

  const updateActivity = activityToUpdate => {
    console.log(activityToUpdate);
    axios
      .put(`api/activities/${activityToUpdate.id}`)
      .then(response => console.log(response.data));
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
      <h2 className="title">Productivity Score</h2>
      <Score activities={activities} />
      <ActivityForm
        createProdActivity={createProdActivity}
        createUnprodActivity={createUnprodActivity}
      />
      <ActivityList activities={activities} deleteActivity={deleteActivity} />
    </div>
  );
};

export default App;
