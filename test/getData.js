var source = require('../process/app');

var settings = {
    pageId: 'teenagemutantninjaturtles'
};
source.getData(settings).then(function(data){
    if(data.likes !== undefined){
        console.log('test complete');
        console.log('success!');
        process.exit(0);
    }else{
        console.log('test failed:');
        console.log(data);
        process.exit(1);
    }
});