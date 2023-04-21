import {
  Component, HostListener
} from '@angular/core';
import { SharedModule } from './module/shared/shared.module';
import {
  Router, Event, NavigationStart, NavigationEnd, NavigationError
} from '@angular/router';
import { SEOService } from './services/seo/seo.service';
import { environment } from 'src/environments/environment';
import { timeout } from 'q';
import { RemService } from './services/REM/rem.service';
import { isGeneratedFile } from '@angular/compiler/src/aot/util';
import { interval } from 'rxjs';
declare const firebase: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],

})
export class AppComponent {





  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {

  }
  @HostListener('window:beforeunload', ['$event'])
  refresh(event) {
    //sessione

    //end session
  }






  @HostListener('window:resize', ['$event'])
  sizeChange(event) {



    this.share.setLarghezzaPagina();
    this.share.setAltezzaPagina();
    this.share.setAltezzaContenuto();


  }



  constructor(
    private router: Router,
    public share: SharedModule,
    private seo: SEOService,
    private rem: RemService

  ) {



    this.share.loadCart();
    this.share.addLoad();
    var timeNotifiche = 60000;
    var inCorso = false;


  /*  const firebaseConfig = {
      apiKey: "AIzaSyBXunx0kV2ogyDNOcHvW9Fu-8kTmZwZkaM",
      authDomain: "pintour-2ae34.firebaseapp.com",
      projectId: "pintour-2ae34",
      storageBucket: "pintour-2ae34.appspot.com",
      messagingSenderId: "18381792415",
      appId: "1:18381792415:web:e2dd4d8c2b343da7b42eaa"
    };
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();
    if ("serviceWorker" in navigator) {
      debugger
      navigator.serviceWorker
        .register("assets/js/firebase-messaging-sw.js")
        .then(function (registration) {
          console.log("Registration successful, scope is:", registration.scope);
          messaging.getToken({ vapidKey: 'BDbKOBjeafKrtoeQIsln8K6YaE9At-SCB6UjrHtfotPB9KUDnvou80_0MNR1d0UiU8HxtTTNe-2-ws3lo5Fgl7Q', serviceWorkerRegistration: registration })
            .then((currentToken) => {
              if (currentToken) {
                // alert(currentToken);
                console.log('current token for client: ', currentToken);
                localStorage["fbtoken"] = currentToken;
                // Track the token -> client mapping, by sending to backend server
                // show on the UI that permission is secured
              } else {
                console.log('No registration token available. Request permission to generate one.');

                // shows on the UI that permission is required
              }
            }).catch((err) => {
              console.log('An error occurred while retrieving token. ', err);
              // catch error while creating client token
            });
        })
        .catch(function (err) {
          console.log("Service worker registration failed, error:", err);
        });
    }
    messaging.onMessage((payload) => {
      console.log('Message received. ', payload);
      //  alert("messaggio ricevuto")
      // ...
    });*/

    interval(timeNotifiche).subscribe(x => {
      try {


        if (!inCorso) {

          if (sessionStorage["token"] != null && sessionStorage["token"] != undefined && sessionStorage["token"] != "") {
            this.rem.notifiche.get().subscribe(
              data => {

                console.log(data);
                if (!this.share.commonF.isEmpty(data["data"])) {
                  inCorso = true;
                  for (let i = 0; i < data["data"].length; i++) {

                    var n = data["data"][i];
                    var notifica1 = {
                      id: n.id,
                      titolo: n.titolo,
                      testo: n.testo,
                      icona: "",
                      ora: this.share.commonF.dataTimeToString(n.dataNotifica),
                      durata: 5000,
                      notificata: n.pushed
                    }
                    this.share.notifiche.creaNotifica(notifica1);

                  }
                  if (this.share.samePath('notificationscenter')) {
                    this.rem.notifiche.lette().subscribe(
                      data => {


                      });
                  }


                  inCorso = false;
                }
              }
            );

          }
        }

      }
      catch (ex) {
        console.error(ex.message);
      }

    });




    this.share.setDevMode(!environment.production)


    //if (!this.share.isDev()) {
    // window.console.log = function () { };
    // }



    this.rem.traduzioniService.getDizionario().subscribe(
      data => {
        this.share.removeLoad();

        console.log(data);
        if (!this.share.catchEx(data["error"])) {
          this.share.setDictionary(data["data"]);
        }
      },
      error => {
        this.share.removeLoad();
        sessionStorage["500"] = error["message"];
        this.share.go("/500");


      }

    );


    this.share.closeAllModal();
    this.share.ripristinaSessione();

    this.share.setDefaultLenguage();
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {

        // inizio cambio pagina




        var url = event.url.split('/');
        if (url.length > 0 && url[1] != "") {
          var found = this.share.getListLenguage().find(function (element) {
            return element.shortLng.toLowerCase() == url[1].toLowerCase();
          });
          if (!this.share.commonF.isEmpty(found)) {
            if (found.lng !== this.share.getLenguage()) {
              this.share.changeLenguage(found.shortLng);
            }
          }
          else {

            var lng = this.share.getLenguage();

            var rout = [lng];
            rout = rout.concat(url.slice(1, url.length));
            this.router.navigate(rout);
          }
        }

      }
      if (event instanceof NavigationEnd) {

        // fine cambio pagina

        try {
          //SEO

          this.share.dataFromRoute(this.router.config, this.router.url);

          var sh = this.share.getDataFromRoute();

          if (!this.share.commonF.isEmpty(share)) {

            this.seo.updateAllMeta();
          }

          this.share.setNavbar();
          this.share.setfooter();
          setTimeout(() => {
            this.share.setAltezzaContenuto();
          }, 1);


          if (!this.share.commonF.isEmpty(share)) {
            if (!this.share.commonF.isEmpty(sh["notifiche"])) {
              this.share.notifiche.setVisualizzazioneNotifiche(sh["notifiche"]);
            }
            else {
              this.share.notifiche.setVisualizzazioneNotifiche(true);
            }
          }

          if (this.share.getAccessoRichiesto()) {
            if (!this.share.isValidSession()) {

              this.share.go("/404");
            }
          }

          //END SEO
        }
        catch (ex) {
          console.log(ex.message);
        }
      }
      if (event instanceof NavigationError) {
        // Hide loading indicator
        // Present error to user
        console.log(event.error);
      }
    });
  }
}