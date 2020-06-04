
const Chai = require('chai');
const assert = Chai.assert;
const AdrezApi = require('../index').AdrezApi;

const accountInfo = {
  key: 'test',
  customer: 'connector',
  username: 'test.connector',
  password: '123456',
  session: 'testDb'
};

describe('connector', () => {
  describe('connect', () => {
    it('test', () => {
      return AdrezApi.connection(accountInfo).then( (api) => {
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
      return AdrezApi.connection(accountInfo).then( (api) => {
        con = api;
      })
    });

    it('basic record', () => {
      return con.addSync('123', {contact: [{fullName: 'Test User'}]}).then( (result) => {
        assert.isDefined(result, 'did the add');
        assert.isDefined(result.id, 'got the id');
        assert.isDefined(result.contact, 'got a contact');
        // can fail if test was not fully runned. It becomes an upd
        assert.equal(result.contact.add, 1, 'one added');
      })
    })
  });

  describe('get', () => {
    let con;
    before( () => {
      return AdrezApi.connection(accountInfo).then( (api) => {
        con = api;
      })
    });

    it('get record', () => {
      return con.getSync('123').then( (result) => {
        assert.isDefined(result, 'did the get');
        assert.equal(result.contact[0].name, 'User', 'The name');
//        assert.equal(result.firstLetters, 'T.', 'and processed it')
      })
    })
  });


  describe('update', () => {
    let con;
    before( () => {
      return AdrezApi.connection(accountInfo).then( (api) => {
        con = api;
      })
    });

    it('record', () => {
      return con.updateSync('123', {contact: [{fullName: 'User Test'}]}).then( (result) => {
        assert.isDefined(result, 'did the update');
        assert.isDefined(result.id, 'has an id');
        assert.isDefined(result.contact, 'has update record')
      })
    })
  });

  describe('remove', () => {
    let con;
    before( () => {
      return AdrezApi.connection(accountInfo).then( (api) => {
        con = api;
      })
    });

    it('record', () => {
      return con.removeSync('123', {contact: [{name: 'test'}]}).then( (result) => {
        assert(result, 'did the remove')
        assert.equal(result.del, 1)
      })
    })
  });

  describe('remove all', () => {
    let con;
    before( () => {
      return AdrezApi.connection(accountInfo).then( (api) => {
        con = api;
      })
    });
    it('all', () => {
      return con.removeAll().then( (result) => {
        assert.equal(result.count, 0, 'got it')
      })
    })
  })

  describe('start/stop', () => {
    let con;
    before( () => {
      return AdrezApi.connection(accountInfo).then( (api) => {
        con = api;
      })
    });
    it('start', () => {
      return con.start('now').then( (result) => {
        assert.equal(result, 'ok' , 'got it')
      })
    });
    it('ended', () => {
      return con.start('now').then( (result) => {
        assert.equal(result, 'ok' , 'got it')
      })
    })

  });
});
