import { ipcMain, BrowserWindow } from 'electron'

export function setupIpcMainHandlers(
  appWindow: BrowserWindow | null,
  createMatchliveWindow: () => void
) {
  ipcMain.on('open-matchlive-window', () => {
    createMatchliveWindow()
  })
}
