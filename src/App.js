import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { IBeacon } from '@ionic-native/ibeacon';
import { BackgroundGeolocation} from '@ionic-native/background-geolocation';
import './main.css';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [errors, setErrors] = useState([])
  function sendToserver(data, res) {
    axios({
        method: 'post',
        url: 'https://egts.ficom-it.info/api/request.php',
        data: {
          aksi: 'egts',
          uid: '1111222233338',
          beacons: data.beacons,
          coord: res
      }
    });
  //   function func(){
  //   let newArr = arr;
  //   if (newArr.length < 5) {
  //     newArr.push(1);
  //   } else {
  //     newArr.push(2);
  //     newArr.shift();
  //   }
  //   setArr(newArr);
  // }
  // let timerId = setInterval(
  //   () => func(), 2000);
    setMessages(messages => [...messages , data.beacons.length > 0 ? JSON.stringify(data.beacons) : res.latitude]);
  }
  useEffect(() => {
    //GPS config
    const backgroundGeolocation = BackgroundGeolocation;
    backgroundGeolocation.configure({
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 50,
      distanceFilter: 50,
      notificationTitle: 'Background tracking',
      notificationText: 'enabled',
      debug: false,
      interval: 5000,
      fastestInterval: 2500,
      activitiesInterval: 5000,
      postTemplate: {
        lat: '@latitude',
        lon: '@longitude'
      }
    });
    //iBeacon config
    const beaconRegion = IBeacon.BeaconRegion('test', 'f7826da6-4fa2-4e98-8024-bc5b71e0893e');
    const delegate = IBeacon.Delegate();
    IBeacon.requestAlwaysAuthorization();
    delegate.didRangeBeaconsInRegion()
    .subscribe(
      data => {
        backgroundGeolocation.checkStatus(function(status) {
        backgroundGeolocation.getCurrentLocation()
          .then(
            res => sendToserver(data, res),
            error => setErrors(errors => [...errors, JSON.stringify(error)])
          );
        if (!status.isRunning) {
          backgroundGeolocation.start(); //triggers start on start event
        }
      });
    },
      error => setErrors(errors => [...errors, JSON.stringify(error)])
    );
    IBeacon.startRangingBeaconsInRegion(beaconRegion)
    .then(
      error => { console.log(error);}
    );
    backgroundGeolocation.start();
  },[])
  return (
    <div className='info'>
      <div className='msgs'>
        {
          messages.map((el,i) => (
            <p>{el}</p>
          ))
        }
      </div>
      <div className='errors'>
        {
          errors.map((el,i) => (
            <p>{el}</p>
          ))
        }
      </div>
    </div>
  )
}

export default App
