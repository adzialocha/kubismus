import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';

class BarSelectItem extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    isSelected: PropTypes.bool.isRequired,
    label: PropTypes.number.isRequired,
    onSelected: PropTypes.func.isRequired,
  }

  onClicked() {
    this.props.onSelected(this.props.id);
  }

  render() {
    const className = classnames(
      'button button--round button--clear button-group__item', {
        'button--blue': this.props.isSelected,
      }
    );

    return (
      <button
        className={className}
        onClick={this.onClicked}
      >
        { this.props.label }
      </button>
    );
  }

  constructor(props) {
    super(props);

    this.onClicked = this.onClicked.bind(this);
  }
}

export default BarSelectItem;
