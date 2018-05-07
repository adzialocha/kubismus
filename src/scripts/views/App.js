import React, { Component } from 'react';

import {
  Bar,
  View,
} from '../components';

class App extends Component {
  render() {
    return (
      <main className='app' role='application'>
        <Bar />
        <View />
      </main>
    );
  }
}

export default App;
