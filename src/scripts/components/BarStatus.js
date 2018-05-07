import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { changeViewTo } from '../actions/view';

class BarStatus extends Component {
  static propTypes = {
    changeViewTo: PropTypes.func.isRequired,
    currentView: PropTypes.string.isRequired,
    isSocketError: PropTypes.bool.isRequired,
    isSocketOpen: PropTypes.bool.isRequired,
  }

  onStatusClicked() {
    if (this.props.currentView !== 'settings') {
      this.props.changeViewTo('settings');
    } else {
      this.props.changeViewTo('editor');
    }
  }

  render() {
    return (
      <div className='button-group'>
        { this.renderStatus() }
      </div>
    );
  }

  renderStatus() {
    const className = classnames('button button--round button-group__item', {
      'button--gray': !this.props.isSocketOpen,
      'button--green': this.props.isSocketOpen,
      'button--red': this.props.isSocketError,
    });

    return (
      <button
        className={className}
        onClick={this.onStatusClicked}
      />
    );
  }

  constructor(props) {
    super(props);

    this.onStatusClicked = this.onStatusClicked.bind(this);
  }
}

function mapStateToProps(state) {
  return {
    currentView: state.view.currentView,
    isSocketError: state.osc.isError,
    isSocketOpen: state.osc.isOpen,
  };
}

export default connect(
  mapStateToProps, {
    changeViewTo,
  }
)(BarStatus);
