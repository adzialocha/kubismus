function mergeOptions(triggerParams, moduleParams, customOptions) {
  const defaultOptions = {
    trigger: {},
    module: {},
  };

  Object.keys(triggerParams).forEach(key => {
    defaultOptions.trigger[key] = triggerParams[key].default;
  });

  Object.keys(moduleParams).forEach(key => {
    defaultOptions.module[key] = moduleParams[key].default;
  });

  return {
    trigger: Object.assign({}, defaultOptions.trigger, customOptions.trigger),
    module: Object.assign({}, defaultOptions.module, customOptions.module),
  };
}

export default class Task {
  constructor(id, trigger, module, customOptions = {}, callback) {
    this.id = id;

    this.options = mergeOptions(
      trigger.parameters,
      module.parameters,
      customOptions,
    );

    this.trigger = trigger;
    this.module = module;
    this.callback = callback;

    this.runtime = {
      counter: 1,
      lastAt: undefined,
      startedAt: Date.now(),
    };

    this.timeout = null;
  }

  start() {
    this.next();
  }

  next() {
    this.timeout = setTimeout(() => {
      const isActive = this.module.value(this.options.module);

      this.callback(isActive);
      this.next();
    }, this.trigger.value(this.runtime, this.options.trigger));

    this.runtime.lastAt = Date.now();
    this.runtime.counter += 1;
  }

  stop() {
    clearTimeout(this.timeout);
  }
}
