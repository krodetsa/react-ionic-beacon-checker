import React, { useState }  from 'react';
import { IonContent,IonLoading, IonButton, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab1.css';
import { IBeacon } from '@ionic-native/ibeacon';
const Tab1: React.FC = () => {
  const [text, setText] = useState('Нет событий');
  const [text2, setText2] = useState('Нет событий2');
  const [text3, setText3] = useState('Нет событий3');
  IBeacon.requestAlwaysAuthorization();
  let delegate = IBeacon.Delegate();
  delegate.didRangeBeaconsInRegion()
  .subscribe(
    data =>  {setText2(JSON.stringify(data))},
    error => console.error()
  );
  delegate.didEnterRegion()
  .subscribe(
    data => {
      setText(JSON.stringify(data));
    }
  );
  delegate.didDetermineStateForRegion()
  .subscribe(
    data => {
      setText3(JSON.stringify(data));
    }
  );

  delegate.didStartMonitoringForRegion()
  .subscribe(
    data => console.log('didStartMonitoringForRegion: ', data),
    error => console.error()
  );

  let beaconsArray = [
    {
      name: "wEci",
      uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e0893e',
      minor: 1000,
      major: 5
    },
    {
      name: "wEc2",
      uuid: '6665542b-41a1-5e00-931c-6a82db9b78c1',
      minor: 1000,
      major: 5
    },
  ]
  const stopScanner = () => {
    beaconsArray.forEach(el => {
      let beaconRegion = IBeacon.BeaconRegion(el.name, el.uuid);
      IBeacon.stopMonitoringForRegion(beaconRegion)
      .then(
        () => {
          // setText('Нет событий');
          // setText2('Нет событий2');
          // setText3('Нет событий3');
      },
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
  const openScanner = () => {
    beaconsArray.forEach(el => {
      let beaconRegion = IBeacon.BeaconRegion(el.name, el.uuid);
      IBeacon.startMonitoringForRegion(beaconRegion)
      .then(
        () => setText('Поиск'),
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
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonButton onClick={openScanner}>Scan</IonButton>
        <IonButton onClick={stopScanner}>Stop</IonButton>
        <p>didEnterRegion</p>
        <p>{text}</p>
        <p>didRangeBeaconsInRegion</p>
        <p>{text2}</p>
        <p>didDetermineStateForRegion</p>
        <p>{text3}</p>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
