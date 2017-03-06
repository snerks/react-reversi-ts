import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import * as renderer from 'react-test-renderer';

import App from './App';
import GamePage from './components/GamePage';

describe('App', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
  });

  it('renders and matches our snapshot', () => {
    const component = renderer.create(
      <App />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  const _component = shallow(
    <App />
  );

  it('contains a GamePage subcomponent', () => {
    expect(_component.find(GamePage)).toHaveLength(1);
  });
});
