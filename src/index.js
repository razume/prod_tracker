import React from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  return (
    <div>
      <h1>The App Here</h1>
    </div>
  );
};

const root = document.querySelector('#root');
ReactDOM.render(<App />, root);
