import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { BarSelectItem } from './';
import { selectScene } from '../actions/scenes';

class BarScenes extends Component {
  static propTypes = {
    scenes: PropTypes.array.isRequired,
    selectScene: PropTypes.func.isRequired,
    currentSceneId: PropTypes.number,
  }

  onSceneSelected(id) {
    this.props.selectScene(id);
  }

  render() {
    return (
      <div className='button-group'>
        { this.renderSceneList() }
      </div>
    );
  }

  renderSceneList() {
    return this.props.scenes.map((scene, index) => {
      return (
        <BarSelectItem
          isSelected={scene.id === this.props.currentSceneId}
          key={scene.id}
          label={index + 1}
          id={scene.id}
          onSelected={this.onSceneSelected}
        />
      );
    });
  }

  constructor(props) {
    super(props);

    this.onSceneSelected = this.onSceneSelected.bind(this);
  }
}

function mapStateToProps(state) {
  return {
    ...state.scenes,
  };
}

export default connect(
  mapStateToProps, {
    selectScene,
  }
)(BarScenes);
