import axios from "axios"
import {writeFile, readFile} from "fs";
import {app, BrowserWindow} from 'electron';
import {join as joinPath} from "path";
import Conf from '../constants/public'
import ipc from './channelMain';
import * as base64 from "./base64";
import Ref from "./ref";

export type SessionStatus = "LOGGING_IN" | "LOGGED_IN" | "LOGGED_OUT" | "ERROR";

export const api = axios.create({
  baseURL: process.env.NODE_ENV === 'development'? 'http://127.0.0.1:5000' : Conf.servers.hub.url
});

export class Session {
  status: SessionStatus;

  constructor(win: Ref<BrowserWindow>) {
    this.win = win;
    this.token = null;
    this.refresh_token = null;
    this.status = "LOGGED_OUT";

    ipc.addHandler('session:auth', this.performAuth.bind(this));
    win.on('change', w => w&& this.send());
  }

  send() {
    if (this.win.exists()) {
      this.win.get().webContents.send('session:auth:change', this.getState())
    }
  }

  async performAuth({type, login, username, pass}) {
    switch (type) {
      case 'signIn':
        await this.signIn(login, pass);
        break;
      case 'signUp':
        await this.signUp(login, pass, username);
        break;
      case 'signOut':
        await this.signOut();
        break;
      case 'refresh':
        await this.refresh();
        break;
      default:
        throw new Error('unknown thingy done');
    }

    return this.getState();
  }

  async signIn(login, pass) {
    this.status = "LOGGING_IN";
    const headers = {
      'Authorization': `Basic ${base64.encode(`${login}:${pass}`)}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    const res = await api.get('token', {
      headers
    });

    const {data} = res;
    if (data.error) {
      this.status = "ERROR";
      throw data.error
    }

    const {token, refresh_token, username} = data;
    this.token = token;
    this.refresh_token = refresh_token;
    this.username = username;
    this.status = "LOGGED_IN";
    this.save();
  }

  async signUp(login, pass, username) {
    const headers = {
      'Authorization': `Basic ${base64.encode(`${login}:${pass}`)}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    const res = await api.post('user', {username}, {
      headers
    });

    const {data} = res;
    if (data.err) throw data.err;
    return this.signIn(login, pass);
  }

  async refresh() {
    const headers = {
      'Authorization': `Token ${base64.encode(this.refresh_token)}`
    };

    const {data} = await api.get('refresh_token', {headers});

    if (data.error) {
      throw data.error;
    }

    const {token, refresh_token} = data;
    this.token = token;
    this.refresh_token = refresh_token;
    this.save();
  }

  async signOut() {
    this.token = null;
    this.refresh_token = null;
    this.username = null;
    return this.save();
  }

  async resume() {
    const path = app.getPath('userData');
    return new Promise((resolve, reject) => {
      readFile(joinPath(path, 'login_data.json'), (err, data) => {
        if (err) reject(err);
        else {
          const {token, refresh_token, username} = JSON.parse(data);
          this.token = token;
          this.refresh_token = refresh_token;
          this.username = username;
          this.send();
          resolve();
        }
      })
    })
  }

  async save() {
    const path = app.getPath('userData');
    const state = this.getState();
    return new Promise((resolve, reject) => {
      writeFile(joinPath(path, 'login_data.json'), JSON.stringify(state), (err, data) => {
        if (err) reject(err);
        else resolve(data);
      })
    });
  }

  getState() {
    const {token, refresh_token, username} = this;
    return {token, refresh_token, username};
  }
}
