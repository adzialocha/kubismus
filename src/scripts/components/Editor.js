import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { Parameter, Sidebar } from './';
import { selectParameter } from '../actions/editor';

class Editor extends Component {
  static propTypes = {
    currentSceneId: PropTypes.number,
    isSidebarExpanded: PropTypes.bool.isRequired,
    parameterHashes: PropTypes.array.isRequired,
    parameters: PropTypes.array.isRequired,
    selectParameter: PropTypes.func.isRequired,
  }

  onParameterSelected(hash) {
    this.props.selectParameter(hash);
  }

  render() {
    if (!this.props.currentSceneId) {
      return null;
    }

    const className = classnames('editor', {
      'editor--sidebar-expanded': this.props.isSidebarExpanded,
    });

    return (
      <div className={className}>
        <div className='editor__parameters'>
          { this.renderParameters() }
        </div>

        { this.renderSidebar() }
      </div>
    );
  }

  renderParameters() {
    const parameters = this.props.parameterHashes
      .map(hash => {
        return this.props.parameters.find(p => p.hash === hash);
      })
      .sort((a, b) => {
        return a.fullname.localeCompare(b.fullname);
      });

    return parameters.map(parameter => {
      if (!parameter) {
        return null;
      }

      return (
        <div
          className='editor__parameters-item'
          key={parameter.id}
        >
          <Parameter
            parameter={parameter}
            onSelected={this.onParameterSelected}
          />
        </div>
      );
    });
  }

  renderSidebar() {
    if (!this.props.isSidebarExpanded) {
      return null;
    }

    return (
      <div className='editor__sidebar'>
        <Sidebar />
      </div>
    );
  }

  constructor(props) {
    super(props);

    this.onParameterSelected = this.onParameterSelected.bind(this);
  }
}

function mapStateToProps(state) {
  return {
    ...state.editor,
    currentSceneId: state.scenes.currentSceneId,
    parameterHashes: state.settings.parameterHashes,
    parameters: state.setup.setup.parameters,
  };
}

export default connect(
  mapStateToProps, {
    selectParameter,
  }
)(Editor);
