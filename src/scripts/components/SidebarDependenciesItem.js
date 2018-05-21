import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class SidebarDependenciesItem extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    onRemoved: PropTypes.func.isRequired,
    onValueChanged: PropTypes.func.isRequired,
    parameterHashes: PropTypes.array.isRequired,
    parameters: PropTypes.array.isRequired,
    values: PropTypes.object.isRequired,
  }

  onValueChanged(event) {
    const { name, value } = event.target;

    const values = this.props.values;
    values[name] = value;

    this.props.onValueChanged({
      id: this.props.id,
      values,
    });
  }

  onRemoved() {
    this.props.onRemoved({
      id: this.props.id,
    });
  }

  render() {
    return (
      <div>
        <div className='sidebar__group'>
          <label className='sidebar__label'>
            <strong>Parameter</strong>
          </label>

          <select
            className='sidebar__input'
            disabled={this.props.isDisabled}
            name='parameter'
            value={this.props.values.parameter}
            onChange={this.onValueChanged}
          >
            <option value=''>Select a parameter</option>
            { this.renderParameterList() }
          </select>
        </div>

        <div className='sidebar__group'>
          <label className='sidebar__label'>
            <strong>Type</strong>
          </label>

          <select
            className='sidebar__input'
            disabled={this.props.isDisabled}
            name='type'
            value={this.props.values.type}
            onChange={this.onValueChanged}
          >
            <option value=''>Select a type</option>
            <option value='equal'>Equal</option>
            <option value='invert'>Invert</option>
          </select>

          <button onClick={this.onRemoved} disabled={this.props.isDisabled}>
            Remove
          </button>
        </div>
      </div>
    );
  }

  renderParameterList() {
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
        <option
          value={parameter.hash}
          key={parameter.id}
        >
          { parameter.name }
        </option>
      );
    });
  }

  constructor(props) {
    super(props);

    this.onRemoved = this.onRemoved.bind(this);
    this.onValueChanged = this.onValueChanged.bind(this);
  }
}
