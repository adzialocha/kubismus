const path = require('path');
const url = require('url');

const OSC = require('osc-js');
const chalk = require('chalk');
const electron = require('electron');
const ip = require('ip');

const pkg = require('./package.json');

const STATIC_FOLDER_NAME = 'dist';

const options = {
  host: '0.0.0.0',
  port: 3000,
  udpClientHost: '0.0.0.0',
  udpClientPort: 9012,
  udpServerHost: '0.0.0.0',
  udpServerPort: 9123,
  wsHost: '0.0.0.0',
  wsPort: 9789,
};

const ipAddress = ip.address();

// Clear terminal
process.stdout.write('\x1Bc');

// Say hello!
console.log(chalk.bold.blue(pkg.name));
console.log('- - - - - - - - - - - - - - - - - - - - -');
console.log(`version: ${chalk.green(pkg.version)}`);
console.log(`ip: ${chalk.green(ipAddress)}`);
console.log('- - - - - - - - - - - - - - - - - - - - -');
console.log(chalk.bold('udp'));
console.log('  client');
console.log(`    host: ${chalk.green(options.udpClientHost)}`);
console.log(`    port: ${chalk.green(options.udpClientPort)}`);
console.log('  server');
console.log(`    host: ${chalk.green(options.udpServerHost)}`);
console.log(`    port: ${chalk.green(options.udpServerPort)}`);
console.log(chalk.bold('websocket'));
console.log('  server');
console.log(`    host: ${chalk.green(options.wsHost)}`);
console.log(`    port: ${chalk.green(options.wsPort)}`);
console.log('- - - - - - - - - - - - - - - - - - - - -');

const { app, BrowserWindow } = electron;

let mainWindow;
let osc;

function createOSCBridge() {
  const config = {
    udpServer: {
      host: options.udpServerHost,
      port: options.udpServerPort,
    },
    udpClient: {
      host: options.udpClientHost,
      port: options.udpClientPort,
    },
    wsServer: {
      host: options.wsHost,
      port: options.wsPort,
    },
  };

  osc = new OSC({
    plugin: new OSC.BridgePlugin(config),
  });

  osc.on('error', error => {
    console.error(`${chalk.red('✘')} osc error: ${error.message}`);
  });

  osc.on('open', () => {
    console.log(`${chalk.green('✔')} osc bridge ready`);
  });

  osc.open();
}

function createWindow() {
  mainWindow = new BrowserWindow({ width: 800, height: 600 });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, STATIC_FOLDER_NAME, 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();
  createOSCBridge();
});

app.on('window-all-closed', () => {
  osc.close();

  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
