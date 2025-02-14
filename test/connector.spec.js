
const Chai = require('chai');
const assert = Chai.assert;
const AdrezApi = require('../index').AdrezApi;

const accountInfo = {
  key: 'test',
  customer: 'test.basis',
  username: 'user1',
  password: '123456'
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
        assert.equal(result, 'trigger' , 'got it')
      })
    });
    it('ended', () => {
      return con.ended('now').then( (result) => {
        assert.equal(result, 'trigger' , 'got it')
      })
    });
  });

  describe('info', () => {
    before( () => {
      return AdrezApi.connection(accountInfo).then( (api) => {
        con = api;
      })
    });
    it('retrieve', () => {
      return con.info().then( (result) => {
        assert.equal(result.api, 'adrez-api');
        assert.equal(result.session.sessionGuid, 'TEST.BASIS.SYNC')
      })
    });
  })

  describe('adrez get', () => {
    before( () => {
      return AdrezApi.connection(accountInfo).then( (api) => {
        con = api;
      })
    });
    it('retrieve', () => {
      return con.get('1').then( (result) => {
        assert.isTrue(result.contact.length > 0);
        assert.equal(result.contact[0].fullName, 'EM-Cultuur')
      })
    });
  })
});
