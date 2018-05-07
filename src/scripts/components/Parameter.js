import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

class Parameter extends Component {
  static propTypes = {
    isActive: PropTypes.bool.isRequired,
    isSelected: PropTypes.bool.isRequired,
    isUnused: PropTypes.bool.isRequired,
    onSelected: PropTypes.func.isRequired,
    parameter: PropTypes.object.isRequired,
  }

  onSelected() {
    this.props.onSelected(this.props.parameter.hash);
  }

  render() {
    const className = classnames('parameter', {
      'parameter--active': this.props.isActive,
      'parameter--selected': this.props.isSelected,
      'parameter--unused': this.props.isUnused,
    });

    return (
      <div className={className} onClick={this.onSelected}>
        { this.props.parameter.fullname }
      </div>
    );
  }

  constructor(props) {
    super(props);

    this.onSelected = this.onSelected.bind(this);
  }
}

function mapStateToProps(state, props) {
  const { hash } = props.parameter;
  const { scenes, currentSceneId } = state.scenes;

  let isActive = false;
  if (hash in state.player.parameters) {
    isActive = state.player.parameters[hash];
  }

  let isUnused = true;
  if (currentSceneId) {
    const { parameters } = scenes.find(s => s.id === currentSceneId);
    if (hash in parameters) {
      isUnused = (
        parameters[hash].triggerName === '' ||
        parameters[hash].moduleName === ''
      );
    }
  }

  return {
    isActive,
    isUnused,
    isSelected: state.editor.currentParameterHash === hash,
  };
}

export default connect(
  mapStateToProps
)(Parameter);
