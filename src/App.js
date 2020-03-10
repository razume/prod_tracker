import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './App.css';
import About from './components/About';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Score from './components/Score';
import ActivityForm from './components/ActivityForm';
import ActivityList from './components/ActivityList';

const App = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({ email: '', password: '' });
  const [activities, setActivities] = useState([]);
  const [currentActivities, setCurrentActivities] = useState([]);

  useEffect(() => {
    Promise.all([axios.get('/api/users'), axios.get('/api/activities')])
      .then(responses => responses.map(response => response.data))
      .then(results => {
        setUsers(results[0]);
        setActivities(results[1]);
        setCurrentActivities(
          results[1].filter(activity => activity.userId === currentUser.id)
        );
      });
  }, []);

  const logUserIn = ev => {
    ev.preventDefault();
    const username = document.querySelector('[name="existing-username"]').value;
    const password = document.querySelector('[name="existing-pw"]').value;
    // set the current user
    const _currentUser = users.filter(
      user => user.username === username && user.password === password
    );
    if (_currentUser[0]) {
      setCurrentUser(_currentUser[0]);
      setCurrentActivities(
        activities.filter(activity => activity.userId === _currentUser[0].id)
      );
    } else {
      alert('invalid username or password');
    }
  };

  const createProdActivity = () => {
    const activityText = document.querySelector('[name="activity-text"]').value;
    const userId = currentUser.id;
    if (userId && activityText.trim()) {
      axios
        .post('/api/activities', {
          text: activityText,
          type: 'productive',
          userId: userId
        })
        .then(response => response.data)
        .then(activity =>
          setCurrentActivities([...currentActivities, activity])
        )
        .then(
          () => (document.querySelector('[name="activity-text"]').value = '')
        );
    } else {
      alert(
        'Invalid input. Must be signed in and have non empty activity value.'
      );
      document.querySelector('[name="activity-text"]').value = '';
    }
  };

  const createUnprodActivity = () => {
    const activityText = document.querySelector('[name="activity-text"]').value;
    const userId = currentUser.id;
    if (userId && activityText.trim()) {
      axios
        .post('/api/activities', {
          text: activityText,
          type: 'unproductive',
          userId: userId
        })
        .then(response => response.data)
        .then(activity =>
          setCurrentActivities([...currentActivities, activity])
        )
        .then(
          () => (document.querySelector('[name="activity-text"]').value = '')
        );
    } else {
      alert(
        'Invalid input. Must be signed in and have non empty activity value.'
      );
      document.querySelector('[name="activity-text"]').value = '';
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
    }

    if (!updatedText) {
      axios
        .put(`api/activities/${activityToUpdate.id}`, {
          text: originalText,
          type: updatedType,
          id: activityToUpdate.id
        })
        .then(response => {
          setCurrentActivities(
            currentActivities.map(activity => {
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
          setCurrentActivities(
            currentActivities.map(activity => {
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
        setCurrentActivities(
          currentActivities.filter(
            activity => activity.id !== activityToDelete.id
          )
        );
      });
    });
  };

  return (
    <Router>
      <div>
        <nav className="header-container">
          <div>
            <Link to="/">
              <span id="logo">+PS</span>
            </Link>
            <Link to="/about">about</Link>
          </div>
          <div>
            {currentUser.username ? (
              <Link to="/login">sign out</Link>
            ) : (
              <Link to="/login">sign in</Link>
            )}

            <span>
              <i className="gg-dark-mode" />
            </span>
          </div>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/login">
            <Login
              setCurrentUser={setCurrentUser}
              currentUser={currentUser}
              logUserIn={logUserIn}
            />
          </Route>
          <Route path="/signUp">
            <SignUp />
          </Route>
          <Route path="/">
            <div>
              <h2 className="title">+Productivity Score</h2>
              <Score
                activities={activities}
                currentActivities={currentActivities}
              />
              <ActivityForm
                createProdActivity={createProdActivity}
                createUnprodActivity={createUnprodActivity}
              />
              <ActivityList
                currentActivities={currentActivities}
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
