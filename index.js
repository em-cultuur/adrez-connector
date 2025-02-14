/**
 * Connector to the AdreZ.sync api
 *
 * version 0.0.1  JvK 2019-08-26
 * version 0.4.0  Jay 2020-06-23
 */

const Axios = require('axios');
const ErrorNotValid = require('error-types').ErrorFieldNotValid;
const fs = require('fs');
const Path = require('path');


class Connector {

  constructor(options = {}) {
    this._server = options.server ? options.server : 'http://localhost:3042';
    this._customer = options.customer ? options.customer : false;
    this._username = options.username ? options.username : false;
    this._password = options.password ? options.password : false;
    this._session = options.session ? options.session : 'noSession';
    this._authKey = options.authKey ? options.authKey : false;
    this._key = options.key ? options.key : false;
    this._apiServer = Axios.create({
      baseURL: this._server
    });
  }

  /**
   * test if the connection is valid
   *
   * @return Promise
   */
  async test() {
    if (this._key === false) {
      return Promise.resolve(new ErrorNotValid('key', 'missing'))
    }
    return this._connect();
  }

  _handleResponse(action) {
    if (action.status && action.status === 200) {
      return Promise.resolve(action.data);
    }
    return Promise.reject(action.status, action.message);
  }

  async _connect() {
    if (!this._authKey) {
      if (!this._customer || !this._username || !this._password) {
        return Promise.reject(new Error('missing username, password or customer'));
      }
      let result = await this._apiServer.post('/auth', {customer: this._customer, username: this._username, password: this._password, session: this._session});
      let data = await this._handleResponse(result);
      if (data.token) {
        this._authKey = data.token;
      }
    }
    this._apiServer.defaults.headers.common.Authorization = this._authKey;
    return Promise.resolve(true);
  }

  addSync(syncId, addr) {
    return this._connect().then( () => {
      return this._apiServer.post('/sync/' + syncId, addr).then( (data) => {
        return this._handleResponse(data)
      });
    });
  }
  updateSync(syncId, addr) {
    return this._connect().then( () => {
      return this._apiServer.post('/sync/' + syncId, addr).then( (data) => {
        return this._handleResponse(data)
      });
    });
  }
  removeSync(syncId) {
    return this._connect().then( () => {
      return this._apiServer.delete('/sync/' + syncId).then( (data) => {
        return this._handleResponse(data)
      });
    });
  }
  getSync(syncId, options = {}) {
    return this._connect().then( () => {
      let url = `/sync/${syncId}`;
      if (options.noSiblings) {
        url += '?noSiblings=1'
      }
      return this._apiServer.get(url).then( (data) => {
        return this._handleResponse(data)
      });
    });
  }

  get(id, options = {}) {
    return this._connect().then( () => {
      let url = `/adrez/${id}`;
      return this._apiServer.get(url).then( (data) => {
        return this._handleResponse(data)
      });
    });
  }


  removeAll() {
    return this._connect().then( () => {
      return this._apiServer.delete('/sync/remove-all').then( (data) => {
        return this._handleResponse(data);
      })
    })
  }

  close() {
    return Promise.reject('not implemented');
  }

  start(key) {
    return this._connect().then( () => {
      return this._apiServer.post('/sync/start/' + key).then( (data) => {
        return this._handleResponse(data);
      })
    })
  }
  ended(key) {
    return this._connect().then( () => {
      return this._apiServer.post('/sync/ended/' + key).then( (data) => {
        return this._handleResponse(data);
      })
    })
  }

  info() {
    return this._connect().then( () => {
      return this._apiServer.get('/').then( (rec) => {
        let raw = fs.readFileSync(Path.join(__dirname, 'package.json'));
        let pack = JSON.parse(raw);
        return this._apiServer.get('/sync/info').then( (inf2) => {
          if (inf2.data.errors) {
            return inf2.data
          }
          return Object.assign({},
            {
              api: 'adrez-api',
              version: pack.version,
              url: this._server,
              customer: this._customer,
              username: this._username,
              password: this._password,
              adrezApi: rec.data,
              session: inf2.data
            }
          );
        })
      }).catch( (err) => {
        return err;
      });
    })
  }
}

const AdrezApi = {
  connection(options = {} ) {
    return Promise.resolve(new Connector(options))
  }
};

module.exports.AdrezApi = AdrezApi;
