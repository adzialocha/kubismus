import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { addParameterHash, removeParameterHash } from '../actions/settings';

class SetupList extends Component {
  static propTypes = {
    addParameterHash: PropTypes.func.isRequired,
    parameterHashes: PropTypes.array.isRequired,
    removeParameterHash: PropTypes.func.isRequired,
    setup: PropTypes.object.isRequired,
  }

  onParameterChanged(event) {
    const { name: hash, checked } = event.target;

    if (!checked) {
      this.props.removeParameterHash(hash);
    } else {
      this.props.addParameterHash(hash);
    }
  }

  render() {
    return (
      <div className='setup-list'>
        <ul className='setup-list__root'>
          { this.renderTracks(this.props.setup.tracks) }
        </ul>
      </div>
    );
  }

  renderTracks(tracks) {
    return tracks.map(track => {
      const devices = this.props.setup.devices.filter(device => {
        if (!('deviceIds' in track)) {
          return false;
        };

        return track.deviceIds.includes(device.id);
      });

      if (devices.length === 0) {
        return null;
      }

      return (
        <li className='setup-list__item setup-list__item--track' key={track.id}>
          <span className='setup-list__badge'>Track</span>
          <strong>{ track.name }</strong>

          <ul className='setup-list__inner'>
            { this.renderDevices(devices) }
          </ul>
        </li>
      );
    });
  }

  renderDevices(devices) {
    return devices.map(device => {
      const parameters = this.props.setup.parameters.filter(parameter => {
        if (!('parameterIds' in device)) {
          return false;
        };

        return device.parameterIds.includes(parameter.id);
      });

      return (
        <li className='setup-list__item setup-list__item--device' key={device.id}>
          <span className='setup-list__badge'>Device</span>
          <strong>{ device.name }</strong>

          <ul className='setup-list__inner'>
            { this.renderParameters(parameters) }
          </ul>
        </li>
      );
    });
  }

  renderParameters(parameters) {
    return parameters.map(parameter => {
      return (
        <li className='setup-list__item setup-list__item--parameter' key={parameter.id}>
          <label className='setup-list__parameters-label'>
            <div className='setup-list__parameters-name'>
              <span className='setup-list__badge'>Parameter</span>
              <strong>{ parameter.name }</strong>

              <span className='setup-list__parameters-values'>
                ({ parameter.min } - { parameter.max })
              </span>
            </div>

            <input
              className='setup-list__parameters-checkbox'
              checked={this.props.parameterHashes.includes(parameter.hash)}
              name={parameter.hash}
              type='checkbox'
              onChange={this.onParameterChanged}
            />
          </label>
        </li>
      );
    });
  }

  constructor(props) {
    super(props);

    this.onParameterChanged = this.onParameterChanged.bind(this);
  }
}

function mapStateToProps(state) {
  const {
    parameterHashes,
  } = state.settings;

  return {
    parameterHashes,
  };
}

export default connect(
  mapStateToProps, {
    addParameterHash,
    removeParameterHash,
  }
)(SetupList);
