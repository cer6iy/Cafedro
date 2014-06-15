var mongoose = require('mongoose'),
    log = require('lib/log')(module),
    conf = require('config');

var connect = function(params){
    mongoose.connect(params);
    log.info("Connecting to " + params);
    if (mongoose.connected){
        log.info("Connected.");
    }
}
var mongooseParams = conf.get('mongoose:uri');
var mongooseParamsDev = conf.get('dev:mongoose:uri');
connect(mongooseParams);

mongoose.connection.on('disconnect', function (msg) {
    connect(mongooseParams);
    log.error("DB disconnect.. reconnecting");
});

mongoose.connection.on('error', function (msg) {
    log.error("DB connection error");
    connect(mongooseParamsDev);
});

module.exports = mongoose;