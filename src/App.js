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

  const toggleEdit = activityToEdit => {
    const activityNode = document.querySelector(
      `[name="${activityToEdit.id}"]`
    );
    const spanToUnhide = activityNode.querySelector('[name="toggle-me"]');
    spanToUnhide.classList.toggle('hide');
  };

  const updateActivity = activityToUpdate => {
    const activityNode = document.querySelector(
      `[name="${activityToUpdate.id}"]`
    );
    const originalText = activityToUpdate.text;
    const updatedText = activityNode.querySelector('[name="edited-text"]')
      .value;
    let updatedType = activityNode.querySelector('[name="edited-type"]').value;

    // both text input and type are left empty
    if (!updatedText && !updatedType) {
      toggleEdit(activityToUpdate);
      return;
    }

    if (!updatedType) {
      updatedType = activityToUpdate.type;
      console.log(updatedType);
    }

    if (!updatedText) {
      axios
        .put(`api/activities/${activityToUpdate.id}`, {
          text: originalText,
          type: updatedType,
          id: activityToUpdate.id
        })
        .then(response => {
          setActivities(
            activities.map(activity => {
              if (activity.id === response.data.id) {
                return response.data;
              }
              return activity;
            })
          );
        })
        .then(() => toggleEdit(activityToUpdate));
    } else {
      axios
        .put(`api/activities/${activityToUpdate.id}`, {
          text: updatedText,
          type: updatedType,
          id: activityToUpdate.id
        })
        .then(response => {
          setActivities(
            activities.map(activity => {
              if (activity.id === response.data.id) {
                return response.data;
              }
              return activity;
            })
          );
        })
        .then(() => {
          toggleEdit(activityToUpdate);
          activityNode.querySelector('[name="edited-text"]').value = '';
        });
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
      <h2 className="title">+Productivity Score</h2>
      <Score activities={activities} />
      <ActivityForm
        createProdActivity={createProdActivity}
        createUnprodActivity={createUnprodActivity}
      />
      <ActivityList
        activities={activities}
        deleteActivity={deleteActivity}
        toggleEdit={toggleEdit}
        updateActivity={updateActivity}
      />
    </div>
  );
};

export default App;
