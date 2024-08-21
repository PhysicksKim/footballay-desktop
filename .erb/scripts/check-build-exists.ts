// Check if the renderer and main bundles are built
import path from 'path';
import chalk from 'chalk';
import fs from 'fs';
import webpackPaths from '../configs/webpack.paths';

const mainPath = path.join(webpackPaths.distMainPath, 'main.js');
const rendererAppPath = path.join(webpackPaths.distRendererPath, 'main.js');
const rendererMatchlivePath = path.join(
  webpackPaths.distRendererPath,
  'matchlive.js',
);

if (!fs.existsSync(mainPath)) {
  throw new Error(
    chalk.whiteBright.bgRed.bold(
      'The main process is not built yet. Build it by running "npm run build:main"',
    ),
  );
}

if (!fs.existsSync(rendererAppPath) || !fs.existsSync(rendererMatchlivePath)) {
  throw new Error(
    chalk.whiteBright.bgRed.bold(
      'The renderer process is not built yet. Build it by running "npm run build:renderer"',
    ),
  );
}
