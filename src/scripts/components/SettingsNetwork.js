import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { saveNetworkSettings, resetSettings } from '../actions/settings';
import { open, close } from '../actions/osc';

class SettingsNetwork extends Component {
  static propTypes = {
    close: PropTypes.func.isRequired,
    errorMessage: PropTypes.string.isRequired,
    isError: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool.isRequired,
    open: PropTypes.func.isRequired,
    resetSettings: PropTypes.func.isRequired,
    saveNetworkSettings: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired,
  }

  onValueChanged(event) {
    event.preventDefault();

    const { name, value } = event.target;
    const newSettings = Object.assign({}, this.props.settings, {
      [name]: value,
    });

    this.props.saveNetworkSettings(newSettings);
  }

  onConnectClicked(event) {
    event.preventDefault();

    this.props.open();
  }

  onDisconnectClicked(event) {
    event.preventDefault();

    this.props.close();
  }

  onResetClicked(event) {
    event.preventDefault();

    this.props.resetSettings();
  }

  render() {
    return (
      <form className='form'>
        { this.renderError() }

        <div className='form__group'>
          <label
            className='form__label'
            htmlFor='host'
          >
            Hostname
          </label>

          <input
            className='form__input'
            disabled={this.props.isOpen}
            id='host'
            name='host'
            type='text'
            value={this.props.settings.host}
            onChange={this.onValueChanged}
          />
        </div>

        <div className='form__group'>
          <label
            className='form__label'
            htmlFor='port'
          >
            Port
          </label>

          <input
            className='form__input'
            disabled={this.props.isOpen}
            id='port'
            name='port'
            type='text'
            value={this.props.settings.port}
            onChange={this.onValueChanged}
          />
        </div>

        <div className='form__actions'>
          <div className='button-group'>
            <button
              type='submit'
              className='button button-group__item'
              disabled={this.props.isOpen}
              onClick={this.onConnectClicked}
            >
              Connect
            </button>

            <button
              className='button button-group__item'
              disabled={!this.props.isOpen}
              onClick={this.onDisconnectClicked}
            >
              Disconnect
            </button>

            <button
              className='button button-group__item'
              disabled={this.props.isOpen}
              onClick={this.onResetClicked}
            >
              Reset
            </button>
          </div>
        </div>
      </form>
    );
  }

  renderError() {
    if (!this.props.isError) {
      return null;
    }

    const { errorMessage } = this.props;
    const text = errorMessage ? `: ${errorMessage}` : '';

    return (
      <div className='form__error'>
        <p><strong>An error occurred</strong>{ text }!</p>
      </div>
    );
  }

  constructor(props) {
    super(props);

    this.onConnectClicked = this.onConnectClicked.bind(this);
    this.onDisconnectClicked = this.onDisconnectClicked.bind(this);
    this.onResetClicked = this.onResetClicked.bind(this);
    this.onValueChanged = this.onValueChanged.bind(this);
  }
}

function mapStateToProps(state) {
  return {
    errorMessage: state.osc.errorMessage,
    isError: state.osc.isError,
    isOpen: state.osc.isOpen,
    settings: state.settings.network,
  };
}

export default connect(
  mapStateToProps, {
    close,
    open,
    resetSettings,
    saveNetworkSettings,
  }
)(SettingsNetwork);
