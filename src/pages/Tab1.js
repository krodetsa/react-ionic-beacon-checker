import React, { useState }  from 'react';
import { IonContent,IonButton, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonInput, IonLabel } from '@ionic/react';
import './Tab1.css';
import { IBeacon } from '@ionic-native/ibeacon';
const Tab1 = () => {
  var beaconsArr = localStorage.getItem("beacons");
  console.log("beaconshere", beaconsArr);
  const [isScan, setIsScan] = useState(false);
  const [beaconName, setBeaconName] = useState('');
  const [beaconUuid, setBeaconUuid] = useState('');
  const [beaconsArray, setBeaconsArray] = useState(beaconsArr !== null ? JSON.parse(beaconsArr) : [] );
  const [text, setText] = useState('Нет событий');
  const [text2, setText2] = useState([{name: '', rssi: '', proximity: ''}]);
  let addBeacon = () => {
    if (beaconName !== '' && beaconUuid !== '') {
        let temp = beaconsArray;
        temp.push({
          name: beaconName,
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
        console.log("TOGGLED");
        console.log(data.beacons);
        setText2([{name: '', rssi: '', proximity: ''}]);
        var arr = [];
        data.beacons.forEach((item, i) => {
          arr.push({
            name: data.region.identifier,
            rssi: item.rssi,
            proximity: item.proximity
          })
        });
        setText2(arr);
        closeScanner();

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
          // setTimeout(function() {
          //   openScanner();
          // }, 3000);

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
        <div className='beacon-info'>
        {text2.map((el, i) => {
          return (
            <>
              <p>Имя: {el.name}</p>
              <p>Rssi: {el.rssi}</p>
              <p>Proximity: {el.proximity}</p>
            </>
          )
        })}

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
