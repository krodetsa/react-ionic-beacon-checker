import * as serviceWorker from './serviceWorker';
import axios from 'axios';
import { IBeacon } from '@ionic-native/ibeacon';
import { Geolocation } from '@ionic-native/geolocation';

  let beaconRegion = IBeacon.BeaconRegion('test', 'f7826da6-4fa2-4e98-8024-bc5b71e0893e');
  IBeacon.requestAlwaysAuthorization();
  let delegate = IBeacon.Delegate();
  let geolocation = Geolocation;
  geolocation.getCurrentPosition()
  .then((resp) => {
   // resp.coords.latitude
   // resp.coords.longitude
   console.log(resp.coords.latitude, resp.coords.longitude, resp.coords.accuracy);
  }).catch((error) => {
    console.log('Error getting location', error);
  });
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
            })
          });
          console.log('SEND SMTH');
          axios({
            method: 'post',
            url: 'https://egts.ficom-it.info/api/request.php',
            data: {
              aksi: 'egts',
              uid: '1111222233335',
              beacons: data.beacons
          }
        })
        data.beacons = [];
      }
      }
  },
    error => console.error()
  );

  IBeacon.startRangingBeaconsInRegion(beaconRegion)
  .then(
    error => { console.log(error)}
  );
  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  serviceWorker.unregister();
