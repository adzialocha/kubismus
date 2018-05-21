import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { SidebarDependenciesItem } from './';
import {
  addSceneDependency,
  removeSceneDependency,
  updateSceneDependency,
} from '../actions/scenes';

class SidebarDependencies extends Component {
  static propTypes = {
    addSceneDependency: PropTypes.func.isRequired,
    dependencies: PropTypes.array.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    parameterHash: PropTypes.string.isRequired,
    parameterHashes: PropTypes.array.isRequired,
    parameters: PropTypes.array.isRequired,
    removeSceneDependency: PropTypes.func.isRequired,
    sceneId: PropTypes.number.isRequired,
    updateSceneDependency: PropTypes.func.isRequired,
  }

  onUpdated(event) {
    this.props.updateSceneDependency(
      this.props.sceneId,
      this.props.parameterHash,
      event.id,
      event.values
    );
  }

  onAdded() {
    this.props.addSceneDependency(this.props.sceneId, this.props.parameterHash);
  }

  onRemoved(event) {
    this.props.removeSceneDependency(
      this.props.sceneId,
      this.props.parameterHash,
      event.id
    );
  }

  render() {
    return (
      <div>
        { this.renderList() }

        <button
          disabled={this.props.isDisabled}
          onClick={this.onAdded}
        >
          Add new dependency
        </button>
      </div>
    );
  }

  renderList() {
    return this.props.dependencies.map(dependency => {
      return (
        <SidebarDependenciesItem
          id={dependency.id}
          isDisabled={this.props.isDisabled}
          key={dependency.id}
          parameterHashes={this.props.parameterHashes}
          parameters={this.props.parameters}
          values={{ type: dependency.type, parameter: dependency.parameter }}
          onRemoved={this.onRemoved}
          onValueChanged={this.onUpdated}
        />
      );
    });
  }

  constructor(props) {
    super(props);

    this.onAdded = this.onAdded.bind(this);
    this.onRemoved = this.onRemoved.bind(this);
    this.onUpdated = this.onUpdated.bind(this);
  }
}

function mapStateToProps(state, props) {
  const { scenes } = state.scenes;

  const scene = scenes.find(scene => {
    return scene.id === state.scenes.currentSceneId;
  });

  const hasValues = props.parameterHash in scene.dependencies;
  const dependencies = hasValues ? scene.dependencies[props.parameterHash] : [];

  return {
    dependencies,
    parameterHashes: state.settings.parameterHashes,
    parameters: state.setup.setup.parameters,
  };
}

export default connect(
  mapStateToProps, {
    addSceneDependency,
    removeSceneDependency,
    updateSceneDependency,
  }
)(SidebarDependencies);
