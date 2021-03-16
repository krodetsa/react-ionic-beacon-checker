import * as serviceWorker from './serviceWorker';
import axios from 'axios';
import { IBeacon } from '@ionic-native/ibeacon';

import { BackgroundGeolocation} from '@ionic-native/background-geolocation';
// import { Geolocation } from '@ionic-native/geolocation';
  const backgroundGeolocation = BackgroundGeolocation;
  backgroundGeolocation.configure({
    locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
    desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
    stationaryRadius: 50,
    distanceFilter: 50,
    notificationTitle: 'Background tracking',
    notificationText: 'enabled',
    debug: false,
    interval: 10000,
    fastestInterval: 5000,
    activitiesInterval: 10000,

    // customize post properties
    postTemplate: {
      lat: '@latitude',
      lon: '@longitude',
      foo: 'bar' // you can also add your own properties
    }
  });
  let beaconRegion = IBeacon.BeaconRegion('test', 'f7826da6-4fa2-4e98-8024-bc5b71e0893e');
  IBeacon.requestAlwaysAuthorization();

  let delegate = IBeacon.Delegate();
//   var geo = Geolocation;
  var logToDom = function (message) {
	var e = document.createElement('div');
	e.innerText = message.toString();
	document.body.appendChild(e);
};
  delegate.didRangeBeaconsInRegion()
  .subscribe(
    data =>  {

      if (data.beacons.length > 0) {

        var arr = [];
        if(data.beacons !== []) {
          data.beacons.forEach((item, i) => {
            arr.push({
              minor: item.minor,
              major: item.major,
              rssi: item.rssi,
              proximity: item.proximity
            });

          });
          console.log("Beacons found " + data.beacons)
          logToDom("Beacons found " + data.beacons)
          axios({
            method: 'post',
            url: 'https://egts.ficom-it.info/api/request.php',
            data: {
              aksi: 'egts',
              uid: '1111222233335',
              beacons: data.beacons
          }
        })
        // data.beacons = [];
      }
    }
    if (data.beacons.length == 0 ) {


      backgroundGeolocation.checkStatus(function(status) {

      backgroundGeolocation.getCurrentLocation().then( res => {
        axios({
            method: 'post',
            url: 'https://egts.ficom-it.info/api/request.php',
            data: {
              aksi: 'egts',
              uid: '1111222233335',
              beacons: [],
              coord: res
          }
        });
        logToDom('GPS found ' + JSON.stringify(res))
        console.log('GPS found ' + JSON.stringify(res));
        }
      )

      if (!status.isRunning) {
        backgroundGeolocation.start(); //triggers start on start event
      }
    });
      };

  },
    error => console.error()
  );

  IBeacon.startRangingBeaconsInRegion(beaconRegion)
  .then(
    error => { console.log(error)}
  );
  backgroundGeolocation.start();
  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  // serviceWorker.unregister();
