const app = require('../src/app');

describe(`APP`, ()=>{

    it(`Get / responds with 200 status and Hello World`,()=>{
        return request(app)
            .get('/')
            .expect(200, `Hello World`);
    }); 

});