import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js'

// import { Geolocation } from '@ionic-native/geolocation';
//
//
//   let messages = [];
//   let errors = []
//
// //   var geo = Geolocation;
//   var logToDom = function (message) {
//     messages.splice(0, 0, message)
//     messages.forEach((item, i) => {
//       if (i < 9) {
//         var e = document.createElement('div');
//       	e.innerText = item.toString();
//       	document.body.appendChild(e);
//       }
//     });
//
// };
// var errorToDom = function (message) {
//   var e = document.createElement('b');
//   e.innerText = message.toString();
//   document.body.appendChild(e);
// };


  ReactDOM.render(
    <App/>
    , document.getElementById('root')
  );
