import PropTypes from 'prop-types';
import React, { Component } from 'react';
import update from 'immutability-helper';
import { connect } from 'react-redux';

import player from '../services/player';
import { SidebarParameter, SidebarDependencies } from './';
import { updateSceneParameter } from '../actions/scenes';

class Sidebar extends Component {
  static propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    moduleNames: PropTypes.array.isRequired,
    moduleParameters: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    parameter: PropTypes.object,
    scene: PropTypes.object,
    triggerNames: PropTypes.array.isRequired,
    triggerParameters: PropTypes.object.isRequired,
    updateSceneParameter: PropTypes.func.isRequired,
  }

  onOptionChanged(event) {
    const { name, value } = event.target;
    this.changeOption(null, name, value);
  }

  onTriggerOptionChanged(event) {
    const { name, value } = event;
    this.changeOption('triggerOptions', name, value);
  }

  onModuleOptionChanged(event) {
    const { name, value } = event;
    this.changeOption('moduleOptions', name, value);
  }

  render() {
    if (!this.props.parameter) {
      return (
        <div className='sidebar'>
          <p>No parameter selected</p>
        </div>
      );
    }

    return (
      <div className='sidebar'>
        { this.renderHeader() }
        { this.renderTriggerParametersPanel() }
        { this.renderModuleParametersPanel() }
        { this.renderDependencies() }
      </div>
    );
  }

  renderHeader() {
    return (
      <div className='sidebar__panel'>
        <p><strong>{ this.props.parameter.fullname }</strong></p>
      </div>
    );
  }

  renderTriggerParametersPanel() {
    return (
      <div className='sidebar__panel'>
        <div className='sidebar__group'>
          <label className='sidebar__label'>
            <strong>Trigger</strong>
          </label>

          <select
            className='sidebar__input'
            disabled={this.props.isDisabled}
            name='triggerName'
            value={this.props.options.triggerName}
            onChange={this.onOptionChanged}
          >
            <option value=''>No trigger selected</option>
            { this.renderTriggers() }
          </select>
        </div>

        { this.renderTriggerParameters() }
      </div>
    );
  }

  renderTriggers() {
    return this.props.triggerNames.map((triggerName, index) => {
      return <option key={index} value={triggerName}>{ triggerName }</option>;
    });
  }

  renderTriggerParameters() {
    return Object.keys(this.props.triggerParameters).map((name, index) => {
      const options = this.props.triggerParameters[name];
      const value = this.props.options.triggerOptions[name];

      return (
        <SidebarParameter
          isDisabled={this.props.isDisabled}
          key={index}
          name={name}
          options={options}
          value={value}
          onValueChanged={this.onTriggerOptionChanged}
        />
      );
    });
  }

  renderModuleParametersPanel() {
    return (
      <div className='sidebar__panel'>
        <div className='sidebar__group'>
          <label className='sidebar__label'>
            <strong>Module</strong>
          </label>

          <select
            className='sidebar__input'
            disabled={this.props.isDisabled}
            name='moduleName'
            value={this.props.options.moduleName}
            onChange={this.onOptionChanged}
          >
            <option value=''>No module selected</option>
            { this.renderModules() }
          </select>
        </div>

        { this.renderModuleParameters() }
      </div>
    );
  }

  renderModules() {
    return this.props.moduleNames.map((moduleName, index) => {
      return <option key={index} value={moduleName}>{ moduleName }</option>;
    });
  }

  renderModuleParameters() {
    return Object.keys(this.props.moduleParameters).map((name, index) => {
      const options = this.props.moduleParameters[name];
      const value = this.props.options.moduleOptions[name];

      return (
        <SidebarParameter
          isDisabled={this.props.isDisabled}
          key={index}
          name={name}
          options={options}
          value={value}
          onValueChanged={this.onModuleOptionChanged}
        />
      );
    });
  }

  renderDependencies() {
    return (
      <div className='sidebar__panel'>
        <div className='sidebar__group'>
          <label className='sidebar__label'>
            <strong>Dependencies</strong>
          </label>
        </div>

        <SidebarDependencies
          isDisabled={this.props.isDisabled}
          parameterHash={this.props.parameter.hash}
          sceneId={this.props.scene.id}
        />
      </div>
    );
  }

  changeOption(namespace, key, value) {
    let converted = value;

    if (typeof value === 'string' && !isNaN(value) && value !== '') {
      if (value.includes('.') || value.includes(',')) {
        converted = parseFloat(value, 10);
      } else {
        converted = parseInt(value, 10);
      }
    }

    let options;

    if (!namespace) {
      options = update(this.props.options, {
        [key]: { $set: converted },
      });
    } else {
      options = update(this.props.options, {
        [namespace]: {
          [key]: { $set: converted },
        },
      });
    }

    this.props.updateSceneParameter(
      this.props.scene.id,
      this.props.parameter.hash,
      options
    );
  }

  constructor(props) {
    super(props);

    this.onModuleOptionChanged = this.onModuleOptionChanged.bind(this);
    this.onOptionChanged = this.onOptionChanged.bind(this);
    this.onTriggerOptionChanged = this.onTriggerOptionChanged.bind(this);
  }
}

function mapStateToProps(state) {
  const isDisabled = state.transport.isPlaying;
  const { scenes } = state.scenes;
  const { setup } = state.setup;
  const { modules, triggers } = player.getOptions();

  const moduleNames = Object.keys(modules);
  const triggerNames = Object.keys(triggers);

  const defaultValues = {
    moduleName: '',
    moduleOptions: {},
    triggerName: '',
    triggerOptions: {},
  };

  // Get parameter we want to display in Sidebar
  const parameter = setup.parameters.find(parameter => {
    return state.editor.currentParameterHash === parameter.hash;
  });

  // Get the current scene to find the regarding parameter settings
  const scene = scenes.find(scene => {
    return scene.id === state.scenes.currentSceneId;
  });

  // Get settings of this parameter for this scene - or take default
  const hasValues = parameter && (parameter.hash in scene.parameters);
  const options = hasValues ? scene.parameters[parameter.hash] : defaultValues;

  // Fill in module and trigger parameter options when possible
  let moduleParameters = {};

  if (options.moduleName !== '') {
    moduleParameters = modules[options.moduleName].parameters;

    if (Object.keys(options.moduleOptions).length === 0) {
      options.moduleOptions = Object.keys(moduleParameters)
        .reduce((acc, key) => {
          acc[key] = moduleParameters[key].default;
          return acc;
        }, {});
    }
  }

  let triggerParameters = {};

  if (options.triggerName !== '') {
    triggerParameters = triggers[options.triggerName].parameters;

    if (Object.keys(options.triggerOptions).length === 0) {
      options.triggerOptions = Object.keys(triggerParameters)
        .reduce((acc, key) => {
          acc[key] = triggerParameters[key].default;
          return acc;
        }, {});
    }
  }

  return {
    isDisabled,
    moduleNames,
    moduleParameters,
    options,
    parameter,
    scene,
    triggerNames,
    triggerParameters,
  };
}

export default connect(
  mapStateToProps, {
    updateSceneParameter,
  }
)(Sidebar);
