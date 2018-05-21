import PropTypes from 'prop-types';
import React, { Component } from 'react';

class SidebarParameter extends Component {
  static propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.any,
    onValueChanged: PropTypes.func.isRequired,
    options: PropTypes.object.isRequired,
  }

  onValueChanged(event) {
    const { name, value } = event.target;

    this.props.onValueChanged({
      name,
      value,
    });
  }

  render() {
    return (
      <div className='sidebar__group'>
        <label className='sidebar__label'>{ this.props.options.label }</label>

        { this.renderInput() }
      </div>
    );
  }

  renderInput() {
    const { options, name, value } = this.props;
    const props = {};

    if (options.type === 'number') {
      props.min = options.min;
      props.max = options.max;
      props.step = options.step;
    }

    return (
      <input
        className='sidebar__input'
        disabled={this.props.isDisabled}
        name={name}
        type={options.type}
        value={value}
        onChange={this.onValueChanged}
        {...props}
      />
    );
  }

  constructor(props) {
    super(props);

    this.onValueChanged = this.onValueChanged.bind(this);
  }
}

export default SidebarParameter;
