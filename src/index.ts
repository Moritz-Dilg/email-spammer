import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { messageType, transportConfigType } from "../types";
const nodemailer = require('nodemailer');
const fs = require('fs');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
	app.quit();
}
let mainWindow: BrowserWindow;
const createWindow = (): void => {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		height: 600,
		width: 800,
		autoHideMenuBar: true,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
		},
	});

	// and load the index.html of the app.
	mainWindow.loadFile(path.join(__dirname, '../src/login.html'));

	// Open the DevTools.
	mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
let transporter: any;
let credentials: transportConfigType;

const createTransport = (config: transportConfigType) => {
	transporter = nodemailer.createTransport({
		host: config.host,
		port: config.port,
		auth: {
			user: config.user,
			pass: config.pass
		}
	});

	mainWindow.loadFile(path.join(__dirname, '../src/index.html'));
};

fs.readFile(path.join(__dirname, '../credentials.json'), 'utf-8', (err: string, jsonString: string) => {
	if (err) {
		console.log("File read failed:", err);
		return;
	}
	credentials = JSON.parse(jsonString);

	createTransport(credentials);
});


ipcMain.on("getCredentials", (event) => {
	mainWindow.webContents.send("credentials", credentials);
});

ipcMain.on("createTransport", (event, arg: transportConfigType) => {
	// Update credentials file
	fs.writeFile(path.join(__dirname, '../credentials.json'), JSON.stringify(arg), (err: string) => {
		if (err) throw err;
	});

	createTransport(arg);
});

ipcMain.handle("sendMail", async (event, arg: messageType) => {
	// send mail with defined transport object
	for (let i = 0; i < arg.count; i++) {
		await transporter.sendMail({
			from: arg.from,
			to: arg.to,
			subject: arg.subject,
			text: arg.text,
			html: arg.html,
		}).then((info: any) => {
			console.log("Message sent: %s", info.messageId);
		}).catch((err: any) => {
			console.log(err);
		});
	}
});
