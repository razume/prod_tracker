import React from 'react';

export default function Login({ logUserIn, currentUser }) {
  return (
    <div className="login-form-container">
      {currentUser.username ? (
        <div>
          <h2>Welcome, {currentUser.username}</h2>
          <p>
            Not {currentUser.username}? <button>Sign out</button>
          </p>
        </div>
      ) : (
        <div className="login-form">
          <h1>Sign in</h1>
          <h2>
            Don't have an account?{' '}
            <span style={{ color: 'rgb(17, 194, 96)' }}>Create one </span>here.
          </h2>
          <form onSubmit={logUserIn}>
            <span>
              <p>Username</p>
              <input name="existing-username" type="text" />
            </span>
            <span>
              <p>Password</p>
              <input name="existing-pw" type="password" />
            </span>
            <button>Sign In</button>
          </form>
        </div>
      )}
    </div>
  );
}
