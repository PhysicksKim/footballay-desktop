import path from 'path';
import webpackPaths from './webpack.paths';

export default {
  alias: {
    '@assets': path.join(webpackPaths.rootPath, 'assets'), // /assets
    '@src': webpackPaths.srcPath, // /src
    '@main': webpackPaths.srcMainPath, // /src/main
    '@app': path.join(webpackPaths.pagesPath, 'app'), // /src/renderer/pages/app
    '@matchlive': path.join(webpackPaths.pagesPath, 'matchlive'), // /src/renderer/pages/matchlive
    '@updatechecker': path.join(webpackPaths.pagesPath, 'updatechecker'), // /src/renderer/pages/updatechecker
  },
  extensions: [
    '.js',
    '.ts',
    '.jsx',
    '.tsx',
    '.json',
    '.css',
    '.scss',
    '.sass',
    '.gif',
  ],
};
