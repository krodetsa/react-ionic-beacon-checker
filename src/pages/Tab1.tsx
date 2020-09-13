import React, { useState }  from 'react';
import { IonContent,IonLoading, IonButton, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab1.css';
import { IBeacon } from '@ionic-native/ibeacon';
const Tab1: React.FC = () => {
  const [text, setText] = useState('Нет событий');
  let delegate = IBeacon.Delegate();
  delegate.didRangeBeaconsInRegion()
  .subscribe(
    data => console.log('didRangeBeaconsInRegion: ', data),
    error => console.error()
  );
  delegate.didEnterRegion()
  .subscribe(
    data => {
      setText(data.region.identifier);
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
      uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e0893e'
    },
    {
      name: "wEc2",
      uuid: '6665542b-41a1-5e00-931c-6a82db9b78c1'
    },
  ]
  const stopScanner = () => {
    beaconsArray.forEach(el => {
      let beaconRegion = IBeacon.BeaconRegion(el.name, el.uuid);
      IBeacon.stopMonitoringForRegion(beaconRegion)
      .then(
        () => setText('Нет событий'),
        error => alert(error)
      )
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
        <IonTitle>{text}</IonTitle>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
