import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    axios.get('/api/activities').then(response => setActivities(response.data));
  }, []);

  return (
    <div>
      <div>
        <h2>Productivity Score</h2>
      </div>
      <div>
        <p>
          Productive count:{' '}
          {activities.filter(activity => activity.type === 'productive').length}
        </p>
      </div>
      <form>
        <input placeholder="describe your activity" />
        <button type="submit">Productive</button>
        <button type="submit">Unproductive</button>
      </form>
      <ul>
        <h4>Tracked Activities:</h4>
        {activities.map(activity => {
          return (
            <li key={activity.id}>
              {activity.text} - {activity.type}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default App;
