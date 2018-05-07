import OSC from 'osc-js';
import md5 from 'md5';

const EMPTY_TAG = '<empty>';

export default class AbletonSetup {
  constructor(options) {
    this.osc = options.osc;

    this.osc.on('/setup', message => {
      this.handleMessage(message);
    });

    this.isComplete = false;
    this.isLoading = false;
    this.resolve = null;

    this.setup = {
      devices: [],
      parameters: [],
      tracks: [],
    };
  }

  sendToMax(message) {
    this.osc.send(message);
  }

  reset() {
    this.setup.devices = [];
    this.setup.parameters = [];
    this.setup.tracks = [];
  }

  requestTracks() {
    this.sendToMax(new OSC.Message('/setup/tracks'));
  }

  requestSetupIds(key, ids) {
    if (ids.length > 0) {
      const message = new OSC.Message(`/setup/${key}`);

      ids.forEach(id => {
        message.add(id);
      });

      this.sendToMax(message);
    }
  }

  fillSetupIds(resourceId, setupName, resourceName, values) {
    const resource = this.setup[setupName].find(item => item.id === resourceId);
    const idsKey = `${resourceName.slice(0, -1)}Ids`;

    if (!resource) {
      return [];
    }

    const namesMessage = new OSC.Message('/setup/names');

    resource[idsKey] = values.reduce((acc, id) => {
      if (id !== EMPTY_TAG) {
        this.setup[resourceName].push({ id });
        namesMessage.add(id);
        acc.push(id);
      }

      return acc;
    }, []);

    if (namesMessage.args.length > 0) {
      this.sendToMax(namesMessage);
    }

    return resource[idsKey];
  }

  fillSetupNames(resourceId, name) {
    Object.keys(this.setup).forEach(key => {
      const item = this.setup[key].find(hayItem => hayItem.id === resourceId);

      if (!item) {
        return;
      }

      item.name = name;
    });
  }

  fillSetupValues(resourceId, min, max) {
    const item = this.setup.parameters.find(hayItem => {
      return hayItem.id === resourceId;
    });

    if (!item) {
      return;
    }

    item.min = min;
    item.max = max;
  }

  checkIfComplete() {
    return Object.keys(this.setup).findIndex(key => {
      if (this.setup[key].length === 0) {
        return true;
      }

      return this.setup[key].findIndex(item => {
        if (key === 'parameters') {
          return !(('max' in item) && ('min' in item));
        }

        return !('name' in item);
      }) > -1;
    }) === -1;
  }

  generateHashes() {
    this.setup.parameters = this.setup.parameters.map(parameter => {
      const device = this.setup.devices.find(device => {
        return device.parameterIds.includes(parameter.id);
      });

      const track = this.setup.tracks.find(track => {
        return track.deviceIds.includes(device.id);
      });

      const fullname = [
        track.name,
        device.name,
        parameter.name,
      ].join(' ');

      parameter.fullname = fullname;
      parameter.hash = md5(fullname);

      return parameter;
    });
  }

  finalizeSetup() {
    this.isLoading = false;
    this.isComplete = true;

    this.generateHashes();

    this.resolve(this.setup);
  }

  load() {
    return new Promise(resolve => {
      this.resolve = resolve;

      this.isComplete = false;
      this.isLoading = true;

      this.reset();
      this.requestTracks();
    });
  }

  handleMessage(data) {
    const { args } = data;

    if (args[0] === 'tracks') {
      const ids = [];
      const namesMessage = new OSC.Message('/setup/names');

      args.shift();
      this.setup.tracks = args.map(id => {
        ids.push(id);
        namesMessage.add(id);
        return { id };
      });

      if (namesMessage.args.length > 0) {
        this.sendToMax(namesMessage);
      }

      this.requestSetupIds('devices', ids);
    } else {
      const id = args.shift();
      const name = args.shift();

      if (name === 'devices') {
        const ids = this.fillSetupIds(id, 'tracks', name, args);
        this.requestSetupIds('parameters', ids);
      } else if (name === 'parameters') {
        const ids = this.fillSetupIds(id, 'devices', name, args);
        this.requestSetupIds('values', ids);
      } else if (name === 'values') {
        this.fillSetupValues(id, args[0], args[1]);
      } else if (name === 'names') {
        this.fillSetupNames(id, args[0]);
      }
    }

    if (this.checkIfComplete()) {
      this.finalizeSetup();
    }
  }
}
