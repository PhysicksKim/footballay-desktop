import path from 'path';
import webpackPaths from './webpack.paths';

export default {
  alias: {
    '@main': webpackPaths.srcMainPath, // /src/main
    '@app': path.join(webpackPaths.srcRendererPath, 'app'), // /src/renderer/app
    '@matchlive': path.join(webpackPaths.srcRendererPath, 'matchlive'), // /src/renderer/matchlive
  },
  extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.css', '.scss', '.sass'],
};
