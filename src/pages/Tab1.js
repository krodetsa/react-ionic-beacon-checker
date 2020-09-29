import React, { useState,useEffect }  from 'react';
import { useLocation } from 'react-router-dom';
import { IonContent,IonButton,IonSelect,IonSelectOption, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonInput, IonLabel } from '@ionic/react';
import './Tab1.css';
import axios from 'axios';
import { IBeacon } from '@ionic-native/ibeacon';
const Tab1 = (props) => {
  let location = useLocation();
  var uidFromStorage = localStorage.getItem("uuid");
  const [deviceUuid, setDeviceUuid] = useState(props.deviceUuid !== '' ? props.deviceUuid : '' );
  const [total, setTotal] = useState(deviceUuid !== '' ? `${'Идентификатор устройства: '+ props.deviceUuid}` : 'Перед началом поиска ведите идентификатор устройства');
  const [pointValue, setPointValue] = useState('');
  const [direction, setDirection] = useState(1);
  const [isScan, setIsScan] = useState(false);
  const [show, setShow] = useState(true);
  const [dataToSend, setDataToSend] = useState([]);
  const [beaconUuid, setBeaconUuid] = useState('');
  const [text, setText] = useState('Нет событий');
  const [button1, setButton1] = useState(false);
  const [button2, setButton2] = useState(false);
  const [button3, setButton3] = useState(false);
  const [button4, setButton4] = useState(false);
  const [text2, setText2] = useState([{minor: '', major:'', rssi: '', proximity: ''}]);
  let beaconRegion = IBeacon.BeaconRegion('test', 'f7826da6-4fa2-4e98-8024-bc5b71e0893e');
  useEffect(() => {
     setButton1(false);
     setButton2(false);
     setButton3(false);
     setButton4(false);
  },[pointValue]);
  IBeacon.requestAlwaysAuthorization();
  let delegate = IBeacon.Delegate();
  delegate.didRangeBeaconsInRegion()
  .subscribe(
    data =>  {
      if (data.beacons.length > 0) {
        closeScanner();
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

        if(data.beacons !== []){
          axios({
          method: 'post',
          url: 'https://egts.ficom-it.info/api/request.php',
          data: {
            aksi: 'setPoint',
            uid: props.deviceUuid,
            pointName: pointValue,
            beacons: data.beacons,
            direction: direction
          }
        })
        .then(res => {
          console.log('Query was sent', props.deviceUuid );

            if (direction === 1) {
            setButton1(true)
            }
            if (direction === 2) {
            setButton2(true)
            }
            if (direction === 3) {
            setButton3(true)
            }
            if (direction === 4) {
            setButton4(true)
            }
        })
      }
        // openScanner();
      }
  },
    error => console.error()
  );

  const closeScanner = () => {

      IBeacon.stopRangingBeaconsInRegion(beaconRegion)
      .then(
        () => {
          setIsScan(false);
      },
        error => alert(error)
      );
  }
  let addDevice = () => {
    localStorage.setItem("uuid", props.deviceUuid);
    setTotal(`${'Идентификатор устройства: '+ props.deviceUuid}`);
    setShow(false);
  }
  const startScan1 = () => {
    if (pointValue !== '') {
      setDirection(1);
      openScanner();
      setIsScan(true);

    }
  }
  const startScan2 = () => {
    if (pointValue !== '') {
      setDirection(2);
      openScanner();
      setIsScan(true);

    }
  }
  const startScan3 = () => {
    if (pointValue !== '') {
      setDirection(3);
      openScanner();
      setIsScan(true);

    }
  }
  // console.log(props);
  const startScan4 = () => {
    if (pointValue !== '') {
      setDirection(4);
      openScanner();
      setIsScan(true);

    }
  }
  const stopScan = () => {
    closeScanner();
    setIsScan(false);
  }
  const openScanner = () => {
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
            <IonTitle size="large">Поиск устройств</IonTitle>
          </IonToolbar>
        </IonHeader>
      { show === true &&
        <>
        <IonItem>
          <IonLabel position="stacked">ID Телефона</IonLabel>
            <IonInput
            value={props.deviceUuid}
            placeholder="Введите ID Телефона"
            onIonChange={e => props.setDeviceUuid(e.detail.value)} clearInput>
            </IonInput>
        </IonItem>
        <IonButton expand="full" onClick={addDevice}>Cохранить</IonButton>
        </>
      }
        {total.length> 0 &&<IonItem>
          {total}
        </IonItem>}

        <IonItem>
            <IonLabel>Название точки</IonLabel>
            <IonSelect value={pointValue} placeholder="Выберите точку" onIonChange={e => setPointValue(e.detail.value)}>
              <IonSelectOption value="Д1">Д1</IonSelectOption>
              <IonSelectOption value="Д2">Д2</IonSelectOption>
              <IonSelectOption value="Д3">Д3</IonSelectOption>
              <IonSelectOption value="Д4">Д4</IonSelectOption>
              <IonSelectOption value="К1">K1</IonSelectOption>
              <IonSelectOption value="K2">K2</IonSelectOption>
              <IonSelectOption value="K3">K3</IonSelectOption>
              <IonSelectOption value="K4">K4</IonSelectOption>
              <IonSelectOption value="K5">K5</IonSelectOption>
              <IonSelectOption value="Х1">Х1</IonSelectOption>
              <IonSelectOption value="Х2">Х2</IonSelectOption>
              <IonSelectOption value="Х3">Х3</IonSelectOption>
              <IonSelectOption value="Х4">Х4</IonSelectOption>
              <IonSelectOption value="Х5">Х5</IonSelectOption>
              <IonSelectOption value="Х6">Х6</IonSelectOption>
              <IonSelectOption value="Х7">Х7</IonSelectOption>
              <IonSelectOption value="Х8">Х8</IonSelectOption>
              <IonSelectOption value="Х9">Х9</IonSelectOption>
              <IonSelectOption value="Х10">Х10</IonSelectOption>
              <IonSelectOption value="Х11">Х11</IonSelectOption>
              <IonSelectOption value="Х12">Х12</IonSelectOption>
              <IonSelectOption value="Х13">Х13</IonSelectOption>
              <IonSelectOption value="Х14">Х14</IonSelectOption>
              <IonSelectOption value="Х15">Х15</IonSelectOption>
              <IonSelectOption value="Х16">Х16</IonSelectOption>
              <IonSelectOption value="Х17">Х17</IonSelectOption>
              <IonSelectOption value="Х18">Х18</IonSelectOption>
              <IonSelectOption value="Х19">Х19</IonSelectOption>
              <IonSelectOption value="Х20">Х20</IonSelectOption>
              <IonSelectOption value="Х21">Х21</IonSelectOption>
              <IonSelectOption value="Х22">Х22</IonSelectOption>
              <IonSelectOption value="Х23">Х23</IonSelectOption>
              <IonSelectOption value="Х24">Х24</IonSelectOption>
              <IonSelectOption value="Х25">Х25</IonSelectOption>
              <IonSelectOption value="Х26">Х26</IonSelectOption>
              <IonSelectOption value="Х27">Х27</IonSelectOption>
              <IonSelectOption value="Т1">Т1</IonSelectOption>
              <IonSelectOption value="Т2">Т2</IonSelectOption>
              <IonSelectOption value="Т3">Т3</IonSelectOption>
              <IonSelectOption value="Т4">Т4</IonSelectOption>
              <IonSelectOption value="Т5">Т5</IonSelectOption>
              <IonSelectOption value="П1">П1</IonSelectOption>
              <IonSelectOption value="П2">П2</IonSelectOption>
              <IonSelectOption value="П3">П3</IonSelectOption>
              <IonSelectOption value="П4">П4</IonSelectOption>
              <IonSelectOption value="П5">П5</IonSelectOption>
              <IonSelectOption value="П6">П6</IonSelectOption>
              <IonSelectOption value="П7">П7</IonSelectOption>
              <IonSelectOption value="П8">П8</IonSelectOption>
              <IonSelectOption value="П9">П9</IonSelectOption>
              <IonSelectOption value="П10">П10</IonSelectOption>
              <IonSelectOption value="П11">П11</IonSelectOption>
              <IonSelectOption value="П12">П12</IonSelectOption>
              <IonSelectOption value="П13">П13</IonSelectOption>
              <IonSelectOption value="П14">П14</IonSelectOption>
              <IonSelectOption value="П15">П15</IonSelectOption>
              <IonSelectOption value="П16">П16</IonSelectOption>
              <IonSelectOption value="П17">П17</IonSelectOption>
              <IonSelectOption value="П18">П18</IonSelectOption>
              <IonSelectOption value="П19">П19</IonSelectOption>
              <IonSelectOption value="П20">П20</IonSelectOption>
              <IonSelectOption value="П21">П21</IonSelectOption>
              <IonSelectOption value="П22">П22</IonSelectOption>
              <IonSelectOption value="П23">П23</IonSelectOption>
              <IonSelectOption value="П24">П24</IonSelectOption>
              <IonSelectOption value="П25">П25</IonSelectOption>
              <IonSelectOption value="П26">П26</IonSelectOption>
              <IonSelectOption value="П27">П27</IonSelectOption>
              <IonSelectOption value="П28">П28</IonSelectOption>
              <IonSelectOption value="П29">П629</IonSelectOption>
              <IonSelectOption value="П30">П30</IonSelectOption>
              <IonSelectOption value="П31">П31</IonSelectOption>
              <IonSelectOption value="П32">П32</IonSelectOption>
              <IonSelectOption value="П33">П33</IonSelectOption>
              <IonSelectOption value="П34">П34</IonSelectOption>
              <IonSelectOption value="П35">П35</IonSelectOption>
              <IonSelectOption value="П36">П36</IonSelectOption>
              <IonSelectOption value="П37">П37</IonSelectOption>
              <IonSelectOption value="П38">П38</IonSelectOption>
              <IonSelectOption value="П39">П39</IonSelectOption>
              <IonSelectOption value="П40">П40</IonSelectOption>
              <IonSelectOption value="П41">П41</IonSelectOption>
              <IonSelectOption value="П42">П42</IonSelectOption>
              <IonSelectOption value="П43">П43</IonSelectOption>
              <IonSelectOption value="П44">П44</IonSelectOption>
              <IonSelectOption value="П45">П45</IonSelectOption>
              <IonSelectOption value="П46">П46</IonSelectOption>
              <IonSelectOption value="П47">П47</IonSelectOption>
              <IonSelectOption value="П48">П48</IonSelectOption>
            </IonSelect>
          </IonItem>
          <div>

            {isScan === false && <IonButton color={button1 === true ? "success": 'primary'} expand="full" onClick={startScan1}>Север</IonButton>}
            {isScan === false && <IonButton color={button2 === true ? "success": 'primary'} expand="full" onClick={startScan2}>Запад</IonButton>}
            {isScan === false && <IonButton color={button3 === true ? "success": 'primary'} expand="full" onClick={startScan3}>Юг</IonButton>}
            {isScan === false && <IonButton color={button4 === true ? "success": 'primary'} expand="full" onClick={startScan4}>Восток</IonButton>}
            {isScan === true && <IonButton expand="full" onClick={stopScan}>Остановить поиск</IonButton>}

          </div>

        {
          isScan === true && <div className='beacon-info'><p>Поиск...</p></div>
        }
        {
        <div className='beacon-info'>
        {text2.map((el, i) => {
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
