var express = require('express');
var path = require('path');
var history = require('connect-history-api-fallback');
var compression = require('compression')

app = express();

app.use(compression());
app.use('/static', express.static(path.join(__dirname + "/dist/static")));
app.use('/favicons', express.static(path.join(__dirname + "/favicons")));
app.use('/css', express.static(path.join(__dirname + "/dist/css")));
app.use('/js', express.static(path.join(__dirname + "/dist/js")));
app.use(history({
    index: '/'
}));

var port = process.env.PORT || 30011;

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
});

console.log('Serving webpage on port:', port)

app.listen(port);
