# Usage
==============

This frontend consumes data from multiple sources.
All of them need to be configured for the system to work perfectly, but only some of them are required runtime.

## Systems

### [MH-GeoBus](https://github.com/kakelaget/mh-geobus)

Programming language: JavaScript (NodeJS)

A wrapper around the geoposition and realtime APIs from Entur.

### [BusBank](https://github.com/kakelaget/busbank)

Programming language: Python

A scraper that collects historical data from the Entur APIs which can be indexed and searched more efficiently which improves the development experience.


### [BusParser](https://github.com/kakelaget/busparser)

Programming language: Rust

A (partial) Siri parser which destructures the XML fetched through BusBank (or any other Siri-compatible data) and allows for a custom export format (e.g. JSON).

### [LocationService](https://github.com/kakelaget/location-service)

Programming language: Kotlin

A polygon-provider which allows for easily checking if a coordinate is inside a defined polygon. Used to check if a marker for the given coordinate should be rendered, based on the viewport/configured map view.

### [Ruter MQTT to WebSockets](https://github.com/kakelaget/ruter-mqtt-to-websockets)

Programming language: Go

A wrapper around the raw MQTT stream for Ruter buses which provides the stream over WebSockets.
