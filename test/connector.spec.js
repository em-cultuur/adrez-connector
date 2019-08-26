
const Chai = require('chai');
const assert = Chai.assert;
const AdrezApi = require('../index').AdrezApi;

describe('connector', () => {
  describe('connect', () => {
    it('test', () => {
      return AdrezApi.connection({key: 'test', customer: 'test', username: 'api.call', password: '123456'}).then( (api) => {
        return api.test().then( (result) => {
          assert(result !== undefined, 'did anwser');
          assert(result === true, 'did awnser')
        })
      });
    })
  });

  describe('add', () => {
    let con;
    before( () => {
      return AdrezApi.connection({key: 'test', customer: 'test', username: 'api.call', password: '123456'}).then( (api) => {
        con = api;
      })
    });

    it('empty record', () => {
      return con.addSync('123', {}).then( (result) => {
        assert(result, 'did the add')
      })
    })
  });

  describe('get', () => {
    let con;
    before( () => {
      return AdrezApi.connection({key: 'test', customer: 'test', username: 'api.call', password: '123456'}).then( (api) => {
        con = api;
      })
    });

    it('get record', () => {
      return con.getSync('123').then( (result) => {
        assert(result, 'did the get')
      })
    })
  });


  describe('update', () => {
    let con;
    before( () => {
      return AdrezApi.connection({key: 'test', customer: 'test', username: 'api.call', password: '123456'}).then( (api) => {
        con = api;
      })
    });

    it('record', () => {
      return con.updateSync('123', {contact: [{name: 'test'}]}).then( (result) => {
        assert(result, 'did the update')
      })
    })
  });

  describe('remove', () => {
    let con;
    before( () => {
      return AdrezApi.connection({key: 'test', customer: 'test', username: 'api.call', password: '123456'}).then( (api) => {
        con = api;
      })
    });

    it('record', () => {
      return con.removeSync('123', {contact: [{name: 'test'}]}).then( (result) => {
        assert(result, 'did the remove')
      })
    })
  });

});
