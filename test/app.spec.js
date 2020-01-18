const app = require('../src/app');
const { PORT } = require('../src/config');

describe(`APP`, ()=>{

    it(`Get / responds with 200 and Server Running`,()=>{
        return request(app)
            .get('/')
            .expect(200, `Server running`);
    }); 

});