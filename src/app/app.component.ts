import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'PdfConverter';

  ngOnInit(){
    var firebaseConfig = {
      apiKey: "AIzaSyAg-xUyaKYXAhMjfJOc1uac2EbLZE4ESm8",
      authDomain: "jta-conversordepdf.firebaseapp.com",
      databaseURL: "https://jta-conversordepdf.firebaseio.com",
      projectId: "jta-conversordepdf",
      storageBucket: "jta-conversordepdf.appspot.com",
      messagingSenderId: "483411471702",
      appId: "1:483411471702:web:2600d1805d50417d7bbaf7"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }
}
