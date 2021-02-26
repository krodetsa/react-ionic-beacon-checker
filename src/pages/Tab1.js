import React, { useState,useEffect }  from 'react';
import { useLocation } from 'react-router-dom';
import { IonContent,IonButton, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonInput, IonLabel } from '@ionic/react';
import './Tab1.css';
import axios from 'axios';
import { IBeacon } from '@ionic-native/ibeacon';
const Tab1 = (props) => {
  let location = useLocation();
  var beaconsArr = localStorage.getItem("beacons");
  var uidFromStorage = localStorage.getItem("uuid");
  const [deviceUuid, setDeviceUuid] = useState(uidFromStorage !== null ? uidFromStorage : '' );
  const [isScan, setIsScan] = useState(false);
  const [wasSent, setWasSent] = useState(0);
  const [wasDelivered, setWasDelivered] = useState(0);
  const [beaconName, setBeaconName] = useState('test');
  const [dataToSend, setDataToSend] = useState([]);
  const [beaconUuid, setBeaconUuid] = useState('');
  const [beaconsArray, setBeaconsArray] = useState( [1] );
  const [text, setText] = useState('Нет событий');
  const [text2, setText2] = useState([]);
  let beaconRegion = IBeacon.BeaconRegion('test', 'f7826da6-4fa2-4e98-8024-bc5b71e0893e');
  useEffect(() => {
    setWasDelivered(0);
    setWasSent(0);
    setText2([]);
    startScan();
  },[location.pathname]);
  IBeacon.requestAlwaysAuthorization();
  let delegate = IBeacon.Delegate();
  delegate.didRangeBeaconsInRegion()
  .subscribe(
    data =>  {
      if (data.beacons.length > 0) {
        setWasSent(wasSent + 1);
        var arr = [];
        setDataToSend(data.beacons);
        if(data.beacons !== []) {
          data.beacons.forEach((item, i) => {
            arr.push({
              minor: item.minor,
              major: item.major,
              rssi: item.rssi,
              proximity: item.proximity
            })
          });
          setText2(arr.sort(function(a, b) {
            return a.rssi - b.rssi;
          }).reverse());
          axios({
            method: 'post',
            url: 'https://egts.ficom-it.info/api/request.php',
            data: {
              aksi: 'egts',
              uid: '1111222233335',
              beacons: data.beacons
          }
        })
        .then(res => {
          setWasDelivered(wasDelivered + 1);
        });
        data.beacons = [];
      }
      }
  },
    error => console.error()
  );

  const closeScanner = () => {
      IBeacon.stopRangingBeaconsInRegion(beaconRegion)
      .then(
        () => {
          setIsScan(false);
          setTimeout(function() {
            startScan();
          }, 1000);

      },
        error => alert(error)
      );
  }
  const startScan = () => {
    openScanner();
    setIsScan(true);
  }
  const stopScan = () => {
      IBeacon.stopRangingBeaconsInRegion(beaconRegion)
      .then(
        () => {
          setIsScan(false);
      },
        error => alert(error)
      );
    setIsScan(false);
  }
  const openScanner = () => {
    // console.log("SCAN IS STARTED");
      IBeacon.startRangingBeaconsInRegion(beaconRegion)
      .then(
        () => setText('Поиск...'),
        error => alert(error)
      );


 };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Поиск устройств</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>


        {
          beaconsArray.length > 0 &&
          <div>
          {isScan === false && <IonButton onClick={startScan}>Поиск</IonButton>}
          {isScan === true && <IonButton onClick={stopScan}>Остановить поиск</IonButton>}
          </div>
        }
        <IonItem>
          Отправлено пакетов: {wasSent}
        </IonItem>
        <IonItem>
          Доставлено пакетов: {wasDelivered}
        </IonItem>
        {
          isScan === true && <div className='beacon-info'><p>Поиск...</p></div>
        }
        {
        <div className='beacon-info'>
        {text2.length > 0 && text2.map((el, i) => {
          return (
            <div key={i} className="beacon-single">
              <p>Minor: {el.minor}</p>
              <p>Major: {el.major}</p>
              <p>Rssi: {el.rssi}</p>
              <p>Proximity: {el.proximity}</p>
            </div>
          )
        })}

        </div>
        }

      </IonContent>
    </IonPage>
  );
};

export default Tab1;
