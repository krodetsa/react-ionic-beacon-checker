import React, { useState }  from 'react';
import { IonContent,IonButton, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonInput, IonLabel } from '@ionic/react';
import './Tab1.css';
import axios from 'axios';
import { IBeacon } from '@ionic-native/ibeacon';
const Tab2 = () => {
  var beaconsArr = localStorage.getItem("beacons");
  var uidFromStorage = localStorage.getItem("uuid");
  const [deviceUuid, setDeviceUuid] = useState(uidFromStorage !== null ? uidFromStorage : '' );
  const [isScan, setIsScan] = useState(false);
  const [beaconName, setBeaconName] = useState('test');
  const [dataToSend, setDataToSend] = useState([]);
  const [beaconUuid, setBeaconUuid] = useState('');
  const [beaconsArray, setBeaconsArray] = useState(beaconsArr !== null ? JSON.parse(beaconsArr) : [] );
  const [text, setText] = useState('Нет событий');
  const [text2, setText2] = useState([{minor: '', major:'', rssi: '', proximity: ''}]);
  let addBeacon = () => {
    if (deviceUuid !== '' && beaconUuid !== '') {
        let temp = beaconsArray;
        temp.push({
          name: 'test',
          uuid: beaconUuid,
        })
        setBeaconsArray(temp);
        setBeaconName('');
        setBeaconUuid('');
        localStorage.setItem("beacons", JSON.stringify(temp));

    }
  }
  IBeacon.requestAlwaysAuthorization();
  let delegate = IBeacon.Delegate();
  delegate.didRangeBeaconsInRegion()
  .subscribe(
    data =>  {
      if (data.beacons.length > 0) {
        console.log(JSON.stringify(data.beacons));
        setText2([{name: '', rssi: '', proximity: ''}]);
        var arr = [];
        data.beacons.forEach((item, i) => {
          arr.push({
            minor: item.minor,
            major: item.major,
            rssi: item.rssi,
            proximity: item.proximity
          })
        });
        setDataToSend(data.beacons);
        setText2(arr);
        closeScanner();
        // axios({
        //   method: 'post',
        //   url: '',
        //   data: {
        //     data: dataToSend,
        //   }
        // })
        // .then(res => {
        //   console.log('Query was sent')
        // })
        // openScanner();
      }
  },
    error => console.error()
  );

  const closeScanner = () => {
    beaconsArray.forEach(el => {
      let beaconRegion = IBeacon.BeaconRegion(el.name, el.uuid);
      IBeacon.stopRangingBeaconsInRegion(beaconRegion)
      .then(
        () => {
          setIsScan(false);
          setTimeout(function() {
            startScan();
          }, 3000);

      },
        error => alert(error)
      );
    })
  }
  const startScan = () => {
    openScanner();
    setIsScan(true);
  }
  const stopScan = () => {
    beaconsArray.forEach(el => {
      let beaconRegion = IBeacon.BeaconRegion(el.name, el.uuid);
      IBeacon.stopRangingBeaconsInRegion(beaconRegion)
      .then(
        () => {
          setIsScan(false);
      },
        error => alert(error)
      );
    })
    setIsScan(false);
  }
  const openScanner = () => {
    beaconsArray.forEach(el => {
      let beaconRegion = IBeacon.BeaconRegion(el.name, el.uuid);
      IBeacon.startRangingBeaconsInRegion(beaconRegion)
      .then(
        () => setText('Поиск...'),
        error => alert(error)
      );
    })


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
        <IonItem>
          <IonLabel position="stacked">ID Телефона</IonLabel>
            <IonInput
            value={deviceUuid}
            placeholder="Введите ID Телефона"
            onIonChange={e => setDeviceUuid(e.detail.value)} clearInput>
            </IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Beacon UUID</IonLabel>
            <IonInput
            value={beaconUuid}
            placeholder="Введите UUID"
            onIonChange={e => setBeaconUuid(e.detail.value)} clearInput>
            </IonInput>
        </IonItem>
        <IonButton expand="full" onClick={addBeacon}>Добавить</IonButton>
        {
         beaconsArray.map((el,i) => {
            return(
              <div className='beacon-info' key={i}>
                <p className='beacon-name'>{el.name}</p>
                <p>{el.uuid}</p>
              </div>
            )
          })
        }
        {
          beaconsArray.length > 0 &&
          <div>
          {isScan === false && <IonButton onClick={startScan}>Поиск</IonButton>}
          {isScan === true && <IonButton onClick={stopScan}>Остановить поиск</IonButton>}
          </div>
        }
        {
          isScan === true && <div className='beacon-info'><p>Поиск...</p></div>
        }
        {
        <div className='beacon-info'>
        {text2.map((el, i) => {
          return (
            <div className="beacon-single">
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

export default Tab2;
