import React, { Component } from 'react';

import { Editor } from '../components';

class EditorView extends Component {
  render() {
    return (
      <section className='editor-view'>
        <Editor />
      </section>
    );
  }
}

export default EditorView;
