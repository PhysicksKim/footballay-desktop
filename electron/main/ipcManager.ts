import log from 'electron-log'
import { ipcMain, app } from 'electron'
import matchliveWindowService from './matchliveWindowService'
import { WindowControlMsg } from '@src/types/WindowControl'
import WindowManager from './WindowManager'

export const setupCommonWindowIpcHandlers = () => {
  ipcMain.on('window-control', async (event, msg: WindowControlMsg) => {
    if (msg.window === 'matchlive') {
      const nowMatchliveWindow = WindowManager.getInstance().matchliveWindow
      if (!nowMatchliveWindow || nowMatchliveWindow.isDestroyed()) {
        sendMatchliveAlwaysOnTopFalseToAppWindow()
        return
      }
      switch (msg.action) {
        case 'reload':
          await nowMatchliveWindow.reload()
          break
        case 'minimize':
          if (nowMatchliveWindow.isMinimized()) {
            await nowMatchliveWindow.restore()
          } else {
            await nowMatchliveWindow.minimize()
          }
          break
        case 'close':
          await nowMatchliveWindow.close()
          sendMatchliveAlwaysOnTopFalseToAppWindow()
          break
        /* temporary disabled because of issue #1 */
        // case 'toggle:always-on-top':
        //   await nowMatchliveWindow.setAlwaysOnTop(
        //     !nowMatchliveWindow.isAlwaysOnTop(),
        //   );
        //   sendMatchliveAlwaysOnTopToAppWindow();
        //   break;
        case 'get:always-on-top':
          sendMatchliveAlwaysOnTopToAppWindow()
          break
        default:
          log.error(`Unknown msg: ${JSON.stringify(msg)}`)
      }
      return
    } else if (msg.window === 'app') {
      const appWindow = WindowManager.getInstance().appWindow
      if (!appWindow) {
        console.error('appWindow is undefined.')
        return
      }
      switch (msg.action) {
        case 'minimize':
          appWindow.minimize()
          break
        case 'quit':
          app.quit()
          break
        default:
          log.error(`Unknown window contol: ${msg}`)
      }
      return
    }
  })

  ipcMain.on('loginfo', (event, data) => {
    log.info(data)
  })
}

export const setupappWindowIpcMainHandlers = () => {
  ipcMain.on('open-matchlive-window', async (event, data) => {
    const matchliveWindow =
      await WindowManager.getInstance().createMatchliveWindow()
    if (!matchliveWindow) {
      console.error('Failed to create matchliveWindow.')
    }
  })

  ipcMain.on('to-app', (event, data) => {
    const appWindow = WindowManager.getInstance().appWindow
    if (!appWindow) {
      console.error('appWindow is undefined.')
      return
    }
    appWindow.webContents.send('to-app', data)
  })

  ipcMain.on('matchlive-react-ready', () => {
    const appWindow = WindowManager.getInstance().appWindow
    if (!appWindow) {
      console.error('appWindow is undefined.')
      return
    }
    appWindow.webContents.send('to-app', { type: 'SEND_SHOW_PHOTO' })
  })
}

export const setupMatchliveIpcMainHandlers = () => {
  ipcMain.on('to-matchlive', (event, data) => {
    const nowMatchliveWindow = WindowManager.getInstance().matchliveWindow
    if (!nowMatchliveWindow || nowMatchliveWindow.isDestroyed()) {
      return
    }

    try {
      nowMatchliveWindow.webContents.send('to-matchlive', data)
    } catch (e) {
      log.error('to-matchlive ipc error message', e)
    }
  })

  ipcMain.handle('reset-matchlive-window', async () => {
    const nowMatchliveWindow = WindowManager.getInstance().matchliveWindow
    if (!nowMatchliveWindow || nowMatchliveWindow.isDestroyed()) {
      console.error('matchliveWindow is not ready for reset.')
      return
    }

    const { height, width } =
      await matchliveWindowService.getDefaultWindowSize()

    nowMatchliveWindow.setSize(width, height)
    nowMatchliveWindow.center()
    nowMatchliveWindow.focus()
  })
}

const sendMatchliveAlwaysOnTopToAppWindow = async () => {
  const matchliveWindow = WindowManager.getInstance().matchliveWindow
  WindowManager.getInstance().appWindow?.webContents.send(
    'window-control-response',
    {
      type: 'get:always-on-top',
      data: matchliveWindow ? matchliveWindow.isAlwaysOnTop() : false,
    }
  )
}

const sendMatchliveAlwaysOnTopFalseToAppWindow = async () => {
  WindowManager.getInstance().appWindow?.webContents.send(
    'window-control-response',
    {
      type: 'get:always-on-top',
      data: false,
    }
  )
}
