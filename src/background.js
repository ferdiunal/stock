'use strict'
import path from "path"
const low = require('lowdb')
const lodashId = require('lodash-id')
const FileSync = require('lowdb/adapters/FileSync')
import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import {
  createProtocol,
  // installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'

const isDevelopment = process.env.NODE_ENV !== 'production';
const HomeDir = app.getPath('home');
const JsonFileName = "stock.json";
const JsonFile = path.join(HomeDir, JsonFileName); // eslint-disable-line
const adapter = new FileSync(JsonFile)
const db = low(adapter)

db._.mixin(lodashId)

db.defaults({ products: [], assigns: [] })
  .write()

let win
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow() {
  win = new BrowserWindow({
    show:false,
    minWidth: 800, minHeight: 600, width: 1000, webPreferences: {
      nodeIntegration: true
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
  } else {
    createProtocol('app')
    win.loadURL('app://./index.html')
  }
  win.setMenu(null);
  win.on('closed', () => {
    win = null
  })

  ipcMain.on("loaded:app", function () { // eslint-disable-line
      win.webContents.send("load:products", 
        db
          .get("products")
          .filter(e => e.deletedAt === null)
          .sortBy('updatedAt')
          .reverse()
          .value());
  });

  ipcMain.on("loaded:assignList", function (_, product_id) { // eslint-disable-line
    win.webContents.send("assigns:rows", db.get("assigns").value().filter(e => e.product_id === product_id));
  });

  ipcMain.on("assign:return", (e, form) => { 
    form = JSON.parse(form);  
    const assign = db.get("assigns")
        .find({
          id: form.assign_id,
          product_id: form.product_id
        })
        .value();

    db.get("assigns").find({
      id: form.assign_id,
      product_id: form.product_id
    })
    .assign({
      return: assign.return + form.return,
      updatedAt: Date.now()
    })
    .write() 

    const product = db.get("products")
      .find({id: form.product_id})
      .value();
    
      db.get("products").find({
        id: form.product_id
      })
      .assign({
        count: product.count + form.return,
        updatedAt: Date.now()
      })
      .write()

    win.webContents.send("assign:returned");
    win.webContents.send("load:products", db.get("products").value());
    win.webContents.send("assigns:rows", db.get("assigns").value().filter(e => e.product_id === form.product_id));
  })

  ipcMain.on("assign:save", (e, form) => {
    form = JSON.parse(form); 
    db.get("assigns").insert({
      ...form,
      return: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      deletedAt: null,
    }).write()

    const product = db.get("products")
      .find({id: form.product_id})
      .value();
    
      db.get("products").find({
        id: form.product_id
      })
      .assign({
        count: product.count - form.count,
        updatedAt: Date.now()
      })
      .write()

    win.webContents.send("assign:saved");
    win.webContents.send("load:products", db.get("products").value());
  })

  ipcMain.on("product:save", (e, form) => {
    form = JSON.parse(form);

    const check = db.get("products").find({
      name: form.name
    }).value()

    if(check !== undefined && check.deletedAt === null) {
      win.webContents.send("product:exits", "Ürün adı daha önce kayıt kullanılmış");

      return
    }

    db.get("products").insert({
      ...form,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      deletedAt: null,
    }).write()
    win.webContents.send("product:saved");
    win.webContents.send("load:products", db.get("products").value());
  })

  ipcMain.on("product:update", (e, data) => {
    const {form, id} = JSON.parse(data)

    const check = db.get("products").find({
      name: form.name
    }).value()

    if(check !== undefined && check.id !== id && check.deletedAt === null) {
      win.webContents.send("product:exits", "Ürün adı daha önce kayıt kullanılmış");

      return
    }

    db.get("products").find({
      id
    })
    .assign({
      ...form,
      updatedAt: Date.now()
    })
    .write()
    win.webContents.send("product:updated");
    win.webContents.send("load:products", db.get("products").value());
  })


  win.maximize();
  win.show();

  // win.webContents.on("devtools-opened", () => { win.webContents.closeDevTools(); });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

app.on('ready', async () => {
  createWindow()

})

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
