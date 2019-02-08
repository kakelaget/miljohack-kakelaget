let things = [];

const socket = new WebSocket("ws://192.168.102.168:8081/ws");

const route = "";

const updater = function(event) {
    socket.onmessage = function(event) {
        // console.log('socket', event.data)
        let data;
        try {
            data = JSON.parse(event.data);
        } catch {
            // Skip if it doesnt parse
            return
        }

        // console.log('Parsed some JSON data', data)

        if ("lat" in data &&
        "lng" in data &&
        "vehicle_id" in data) {
            // data.indexOf(route) !== -1) {
            things.push(data);
        }
    }
}

/* "{"eventTimestamp":"2019-02-08T20:30:39.985Z",
"esti…opPlaceId":"NSR:StopPlace:6008","text":"7 Min"}]}"
*/

/*
"{ "pub_time":1549657840000,
"lat":60.07742,
"lng":11.03270,
"speed":0.0,
"course":109 }"
*/

window.setInterval(updater);

function returnAndClear() {
    var qq = things.splice(0, things.length);
    things = [];
    return qq;
}

module.exports = returnAndClear;
