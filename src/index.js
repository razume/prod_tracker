import React from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  return (
    <div>
      <h1>Productivity Tracker</h1>
      <div>score goes here</div>
      <form>
        <input type="text"></input>
        <span>
          <button>Productive</button>
          <button>Unproductive</button>
        </span>
      </form>
    </div>
  );
};

const root = document.querySelector('#root');
ReactDOM.render(<App />, root);
