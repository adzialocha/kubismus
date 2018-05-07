import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { SetupList } from './';
import { updateAbletonSetup } from '../actions/setup';

class SettingsSetup extends Component {
  static propTypes = {
    isComplete: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool.isRequired,
    setup: PropTypes.object.isRequired,
    updateAbletonSetup: PropTypes.func.isRequired,
  }

  onLoadClicked(event) {
    event.preventDefault();

    this.props.updateAbletonSetup();
  }

  render() {
    return (
      <form className='form'>
        <div className='form__group'>
          <label className='form__label'>
            Select parameters
          </label>

          <div className='form__input'>
            { this.renderSetup() }
          </div>
        </div>

        <div className='form__actions'>
          <div className='button-group'>
            <button
              type='submit'
              className='button button-group__item'
              disabled={this.props.isLoading || !this.props.isOpen}
              onClick={this.onLoadClicked}
            >
              Load from Ableton Live
            </button>
          </div>
        </div>
      </form>
    );
  }

  renderSetup() {
    if (this.props.isLoading) {
      return <p>Loading ...</p>;
    }

    if (!this.props.isComplete) {
      return (
        <div className='form__error'>
          <p>Please load setup first!</p>
        </div>
      );
    }

    return <SetupList setup={this.props.setup} />;
  }

  constructor(props) {
    super(props);

    this.onLoadClicked = this.onLoadClicked.bind(this);
  }
}

function mapStateToProps(state) {
  const {
    isComplete,
    isLoading,
    setup,
  } = state.setup;

  return {
    isComplete,
    isLoading,
    isOpen: state.osc.isOpen,
    setup,
  };
}

export default connect(
  mapStateToProps, {
    updateAbletonSetup,
  }
)(SettingsSetup);
