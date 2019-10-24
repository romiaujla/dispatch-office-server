const app = require('./app');
const {PORT, NODE_ENV} = require('./config');

app.use((error, req, res, next) => {
    let response = {};
    if(NODE_ENV === 'production'){
        response = {
            error: {
                message: `Server Error`
            }
        }
    }else{
        response = {error}
    }
    res.status(500).json(response);
})

app.listen(PORT, ()=> {
    console.log(`Sever listening at PORT:${PORT}`);
})