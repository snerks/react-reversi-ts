import * as React from 'react';

import GamePage from './components/GamePage';

class App extends React.Component<null, null> {
  render() {
    return (
      <div className="container-fluid">
        <nav className="navbar navbar-inverse">
          <div className="container-fluid">
            <div className="navbar-header">
              <button
                type="button"
                className="navbar-toggle collapsed"
                data-toggle="collapse"
                data-target="#navbar"
                aria-expanded="false"
                aria-controls="navbar"
              >
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar" />
                <span className="icon-bar" />
                <span className="icon-bar" />
              </button>
              <a className="navbar-brand" href="#">Othello TS React Redux</a>
            </div>
            <div id="navbar" className="navbar-collapse collapse">
              <ul className="nav navbar-nav">
                <li className="active"><a href="#">Home</a></li>
                <li><a href="https://github.com/snerks/react-reversi-ts">Code</a></li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="text-center">
          <GamePage />
        </div>
      </div>
    );
  }
}

export default App;
