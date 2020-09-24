import React, { useState } from 'react';
import { IonContent, IonHeader,IonButton, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonInput } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab3.css';

const Tab3 = () => {
  var uidFromStorage = localStorage.getItem("uuid");
  const [deviceUuid, setDeviceUuid] = useState(uidFromStorage !== null ? uidFromStorage : '' );
  const [total, setTotal] = useState(uidFromStorage !== null ? `${'Идентификатор устройства: '+ uidFromStorage}` : '');
  let addDevice = () => {
    localStorage.setItem("uuid", deviceUuid);
    setTotal(`${'Идентификатор устройства: '+ deviceUuid}`)
    console.log(deviceUuid);
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Настройки</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 3</IonTitle>
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
        <IonButton expand="full" onClick={addDevice}>Добавить</IonButton>
        {total.length> 0 &&<IonItem>
          {total}
        </IonItem>}
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
