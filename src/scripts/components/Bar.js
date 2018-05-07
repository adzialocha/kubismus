import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { expandBar, collapseBar } from '../actions/view';

import {
  BarCuePoints,
  BarEditor,
  BarScenes,
  BarStatus,
  BarTransport,
} from './';

class Bar extends Component {
  static propTypes = {
    collapseBar: PropTypes.func.isRequired,
    expandBar: PropTypes.func.isRequired,
    isBarExpanded: PropTypes.bool.isRequired,
    isSettingsView: PropTypes.bool.isRequired,
  }

  onExtraBarEntered() {
    this.props.expandBar();
  }

  onExtraBarLeft() {
    this.props.collapseBar();
  }

  render() {
    if (this.props.isSettingsView) {
      return (
        <div className='bar'>
          { this.renderStatusPanel() }
        </div>
      );
    }

    const className = classnames('bar', {
      'bar--expanded': this.props.isBarExpanded,
    });

    return (
      <div className={className}>
        { this.renderStatusPanel() }

        <div className='bar__panel'>
          <BarTransport />
        </div>

        <div className='bar__panel'>
          <BarScenes />
        </div>

        <div className='bar__panel bar__panel--right'>
          <BarEditor />
        </div>

        { this.renderCueBar() }
      </div>
    );
  }

  renderStatusPanel() {
    return (
      <div className='bar__panel'>
        <BarStatus />
      </div>
    );
  }

  renderCueBar() {
    if (!this.props.isBarExpanded) {
      return;
    }

    return (
      <div
        className='bar__extra'
        onMouseEnter={this.onExtraBarEntered}
        onMouseLeave={this.onExtraBarLeft}
      >
        <div className='bar__panel'>
          <BarCuePoints />
        </div>
      </div>
    );
  }

  constructor(props) {
    super(props);

    this.onExtraBarEntered = this.onExtraBarEntered.bind(this);
    this.onExtraBarLeft = this.onExtraBarLeft.bind(this);
  }
}

function mapStateToProps(state) {
  return {
    isBarExpanded: state.view.isBarExpanded,
    isSettingsView: state.view.currentView === 'settings',
  };
}

export default connect(
  mapStateToProps, {
    collapseBar,
    expandBar,
  }
)(Bar);
