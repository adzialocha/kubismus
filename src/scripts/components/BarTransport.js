import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { expandBar, collapseBar } from '../actions/view';
import { play, stop, record } from '../actions/transport';

class BarTransport extends Component {
  static propTypes = {
    collapseBar: PropTypes.func.isRequired,
    expandBar: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    isPlaying: PropTypes.bool.isRequired,
    isRecording: PropTypes.bool.isRequired,
    play: PropTypes.func.isRequired,
    record: PropTypes.func.isRequired,
    stop: PropTypes.func.isRequired,
  }

  onPlayClicked() {
    this.props.play();
  }

  onStopClicked() {
    this.props.stop();
  }

  onRecordClicked() {
    this.props.record();
  }

  onPlayEntered() {
    this.props.expandBar('play');
  }

  onPlayLeft() {
    this.props.collapseBar();
  }

  onRecordEntered() {
    this.props.expandBar('record');
  }

  onRecordLeft() {
    this.props.collapseBar();
  }

  render() {
    const playClassName = classnames(
      'button button--clear button-group__item', {
        'button--gray': !this.props.isPlaying,
        'button--green': this.props.isPlaying,
      }
    );

    const stopClassName = classnames(
      'button button--clear button-group__item', {
        'button--gray': this.props.isPlaying,
        'button--blue': !this.props.isPlaying,
      }
    );

    const recordClassName = classnames(
      'button button--clear button-group__item', {
        'button--gray': !this.props.isRecording,
        'button--red': this.props.isRecording,
      }
    );

    return (
      <div className='button-group'>
        <button
          className={playClassName}
          disabled={!this.props.isOpen}
          onClick={this.onPlayClicked}
          onMouseEnter={this.onPlayEntered}
          onMouseLeave={this.onPlayLeft}
        >
          <i className='icon icon--play' />
        </button>

        <button
          className={stopClassName}
          disabled={!this.props.isOpen}
          onClick={this.onStopClicked}
        >
          <i className='icon icon--stop' />
        </button>

        <button
          className={recordClassName}
          disabled={!this.props.isOpen}
          onClick={this.onRecordClicked}
          onMouseEnter={this.onRecordEntered}
          onMouseLeave={this.onRecordLeft}
        >
          <i className='icon icon--record' />
        </button>
      </div>
    );
  }

  constructor(props) {
    super(props);

    this.onPlayClicked = this.onPlayClicked.bind(this);
    this.onPlayEntered = this.onPlayEntered.bind(this);
    this.onPlayLeft = this.onPlayLeft.bind(this);
    this.onRecordClicked = this.onRecordClicked.bind(this);
    this.onRecordEntered = this.onRecordEntered.bind(this);
    this.onRecordLeft = this.onRecordLeft.bind(this);
    this.onStopClicked = this.onStopClicked.bind(this);
  }
}

function mapStateToProps(state) {
  return {
    ...state.transport,
    isOpen: state.osc.isOpen,
  };
}

export default connect(
  mapStateToProps, {
    collapseBar,
    expandBar,
    play,
    record,
    stop,
  }
)(BarTransport);
