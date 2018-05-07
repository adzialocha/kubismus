import Task from './task';
import modules from './modules';
import triggers from './triggers';

const tasks = {};

function getOptions() {
  return {
    modules,
    triggers,
  };
}

function start(id, triggerName, moduleName, options = {}, callback) {
  const trigger = triggers[triggerName];
  const module = modules[moduleName];

  const task = new Task(id, trigger, module, options, callback);

  task.start();
  tasks[id] = task;
}

function stop(id) {
  if (!tasks[id]) {
    return;
  }

  tasks[id].stop();
  delete tasks[id];
}

function stopAll() {
  tasks.forEach(task => {
    stop(task.id);
  });
}

export default {
  getOptions,
  start,
  stop,
  stopAll,
};
