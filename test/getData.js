var source = require('../process/app');

var settings = {
    query: 'gabe'
};
source.getData(settings)
    .then(function(data){
        if(data.mentions !== undefined){
            console.log('test complete');
            console.log(data);
            console.log('success!');
            process.exit(0);
        }else{
            console.log('test failed:');
            console.log(data);
            process.exit(1);
        }
    })
    .catch(function(err){
        console.log('test failed:');
        console.log(err);
        process.exit(1);
    })
    .done();