import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './App.css';
import About from './components/About';
import Login from './components/Login';
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
    <Router>
      <div>
        <nav className="header-container">
          <div>
            <span>
              <Link to="/">
                <span id="logo">+PS</span>
              </Link>
            </span>
            <span>
              <Link to="/about">about</Link>
            </span>
            <span>
              <Link to="/login">login / sign up</Link>{' '}
            </span>
          </div>
          <i className="gg-dark-mode" />
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/">
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
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
