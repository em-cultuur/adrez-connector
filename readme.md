# adrez-connector

Connector to the sync API of adrez

## Install

```
$ npm install @toxus/adrez-api --save
```

## Usage

```js
const Adrez = require('@toxus/adrez-api');

async function changeAdrez() {
  try {  
    let con = await AdrezApi.connection({
      key: 'test', 
      customer: 'test.user', 
      username: 'user1', 
      password: '123456',    
    });

    // add a record  
    let rec = await con.addSync('123', {contact: [{ name: 'testing', _sync: 'main'}]})
    // update a record
    rec = await con.updateSync('123', {contact: [{ name: 'other test', _sync: 'main'}]});
    // get the record
    let other = await con.getSync('123');
    // other.contact[0].name === 'other test'
    
    // delete all references to 
    await con.deleteSync('123');
    
    other = await con.getSync('123');
    // returns false;
    
  } catch (err) {
     console.error(err)
  }
}

````


 
## Maintainers

- [Jay McAnser](https://github.com/jaymcanser)


## License

(c) 2020 MIT
