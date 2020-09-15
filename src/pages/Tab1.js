import React, { useState }  from 'react';
import { IonContent,IonButton, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonInput, IonLabel } from '@ionic/react';
import './Tab1.css';
import { IBeacon } from '@ionic-native/ibeacon';
const Tab1 = () => {
  var beaconsArr = localStorage.getItem("beacons");
  const [isScan, setIsScan] = useState(false);
  const [beaconName, setBeaconName] = useState('');
  const [beaconUuid, setBeaconUuid] = useState('');
  const [beaconsArray, setBeaconsArray] = useState(beaconsArr !== null ? JSON.parse(beaconsArr) : [] );
  const [text, setText] = useState('Нет событий');
  const [text2, setText2] = useState({name: '', rssi: '', proximity: ''});
  // const [text3, setText3] = useState('Нет событий3');
  let addBeacon = () => {
    if (beaconName !== '' && beaconUuid !== '') {
        let temp = beaconsArray;
        temp.push({
          name: beaconName,
          uuid: beaconUuid
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
        setText2({
          name: data.region.identifier,
          rssi: data.beacons[0].rssi,
          proximity: data.beacons[0].proximity
        });
        closeScanner();
        setInterval(function() {
          openScanner();
        }, 60000);
      }
  },
    error => console.error()
  );


  // delegate.didEnterRegion()
  // .subscribe(
  //   data => {
  //     setText(JSON.stringify(data));
  //   }
  // );
  // delegate.didDetermineStateForRegion()
  // .subscribe(
  //   data => {
  //     setText3(JSON.stringify(data));
  //   }
  // );
  // delegate.didStartMonitoringForRegion()
  // .subscribe(
  //   data => console.log('didStartMonitoringForRegion: ', data),
  //   error => console.error()
  // );

  // let beaconsArray = [
  //   {
  //     name: "wEci",
  //     uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e0893e',
  //   },
  //   {
  //     name: "wEc2",
  //     uuid: '6665542b-41a1-5e00-931c-6a82db9b78c1',
  //   },
  // ]
  const closeScanner = () => {
    beaconsArray.forEach(el => {
      let beaconRegion = IBeacon.BeaconRegion(el.name, el.uuid);
      IBeacon.stopMonitoringForRegion(beaconRegion)
      .then(
        () => {},
        error => alert(error)
      );
      IBeacon.stopRangingBeaconsInRegion(beaconRegion)
      .then(
        () => {
          // setText('Нет событий');
          // setText2('Нет событий2');
          // setText3('Нет событий3');
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
    closeScanner();
    setIsScan(false);
  }
  const openScanner = () => {
    beaconsArray.forEach(el => {
      let beaconRegion = IBeacon.BeaconRegion(el.name, el.uuid);
      IBeacon.startMonitoringForRegion(beaconRegion)
      .then(
        () => setText('Поиск...'),
        error => alert(error)
      );
      IBeacon.startRangingBeaconsInRegion(beaconRegion)
      .then(
        () => console.log('startRangingBeaconsInRegion'),
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
          <IonLabel position="stacked">Beacon Name</IonLabel>
            <IonInput
            value={beaconName}
            placeholder="Введите имя"
            onIonChange={e => setBeaconName(e.detail.value)} clearInput>
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
          isScan === true  &&
        <div className='beacon-info'>
          <p>Имя: {text2.name}</p>
          <p>Rssi: {text2.rssi}</p>
          <p>Proximity: {text2.proximity}</p>
        </div>
        }

    {
    //   <p>didEnterRegion</p>
    // <p>{text}</p>
    // <p>didRangeBeaconsInRegion</p>
    // <p>{text2}</p>
    // <p>didDetermineStateForRegion</p>
    // <p>{text3}</p>
    }
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
