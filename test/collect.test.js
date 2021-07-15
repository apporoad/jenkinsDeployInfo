var collecter = require('../api/collect')

collecter['@get']().then(r=>{

    console.log(JSON.stringify(r))
})