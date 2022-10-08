import { ipcRenderer } from "electron";
const { contextBridge } = require('electron');
import { messageType, transportConfigType } from "../types";


contextBridge.exposeInMainWorld('api', {
    createTransport: (config: transportConfigType) => {
        ipcRenderer.send('createTransport', config);
    },
    sendMail: (message: messageType) => {
        ipcRenderer.invoke('sendMail', message);
    },
    logout: () => {
        ipcRenderer.send('logout');
    },
    getCredentials: () => {
        ipcRenderer.send('getCredentials');
    },
    receiveCredentials: (callback: Function) => {
        ipcRenderer.on("credentials", (event, ...args) => callback(event, ...args));
    },
});