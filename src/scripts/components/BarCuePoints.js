import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { BarSelectItem } from './';
import { recordAtCue, playAtCue } from '../actions/transport';

class BarCuePoints extends Component {
  static propTypes = {
    cuePointCount: PropTypes.number.isRequired,
    mode: PropTypes.string.isRequired,
    playAtCue: PropTypes.func.isRequired,
    recordAtCue: PropTypes.func.isRequired,
  }

  onCuePointSelected(index) {
    if (this.props.mode === 'play') {
      this.props.playAtCue(index);
    } else if (this.props.mode === 'record') {
      this.props.recordAtCue(index);
    }
  }

  render() {
    return (
      <div className='button-group'>
        { this.renderSceneList() }
      </div>
    );
  }

  renderSceneList() {
    return new Array(this.props.cuePointCount).fill(0).map((cuePoint, index) => {
      return (
        <BarSelectItem
          isSelected={false}
          key={index}
          label={index + 1}
          id={index}
          onSelected={this.onCuePointSelected}
        />
      );
    });
  }

  constructor(props) {
    super(props);

    this.onCuePointSelected = this.onCuePointSelected.bind(this);
  }
}

function mapStateToProps(state) {
  return {
    ...state.transport,
    mode: state.view.extraBarMode,
  };
}

export default connect(
  mapStateToProps, {
    playAtCue,
    recordAtCue,
  }
)(BarCuePoints);
