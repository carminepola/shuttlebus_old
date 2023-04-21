import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/module/shared/shared.module';
import { RemService } from 'src/app/services/REM/rem.service';
declare const google: any;
@Component({
  selector: 'app-home-one',
  templateUrl: './home-one.component.html',
  styleUrls: ['./home-one.component.scss']
})
export class HomeOneComponent implements OnInit {

  constructor(public share: SharedModule, public rem: RemService) { }
  public indirizzoRichiesto: string;
  public caricamentoButton: boolean;
  public posizione: any;
  public indirizzoCercato: any;
  public cercaBiglietto: string;
  public fermata = { "id": 5, "citta": "3dd9a2009d5868e32587588a5b2748cb", "indirizzo": "Aeroporto Internazionale di Napoli (NAP), Viale F. Ruffo di Calabria, 80144 Napoli NA, Italia", "lat": "40.8847493", "lng": "14.289242999999942", "foto": "cd371bee0fc686ddf2a2632d7a52d5f70dbdcb8f.jpg", "note": "79e677513c9d3b60c8ae4883d4ed0c82", "traduzioniCitta": [{ "id": 28, "nome": "3dd9a2009d5868e32587588a5b2748cb", "it": "Napoli - Aeroporto di Capodichino", "en": "Naples - Capodichino airport" }], "km": 12.38536 };
  ngOnInit() {
  }

  calcolaFermata() {
    if (!this.share.commonF.isEmpty(this.indirizzoRichiesto)) {
      this.caricamentoButton = true;
      this.updateIndirizzo()
    }

  }
  vaiacerca(id: string = "") {

    if (this.share.commonF.isEmpty(id)) {
      this.share.go("checkticket")
    } else {
      
      this.share.go("searchfromail/" + id.toLowerCase())
    }


  }
  async updateIndirizzo() {
    

    this.posizione = {
      lat: "",
      lng: "",
      latlng: "",
      indirizzo: "",
      trovato: false
    };
    await this.share.getCoordinate(this.indirizzoRichiesto).then(value => {
      this.caricamentoButton = true;
      this.posizione = value;


      if (this.posizione["trovato"]) {
        this.indirizzoCercato = this.posizione.indirizzo;
        this.caricamentoButton = true;
        var lat = this.posizione["lat"];
        var lng = this.posizione["lng"];

        this.rem.search.getLuogoVicino(lat, lng).subscribe(
          data => {
            this.share.openModal("fermata")
            this.caricamentoButton = false;
            this.fermata = data["data"][0];
            this.fermata.km = Number.parseFloat(this.fermata.km.toFixed(2));
            var indirizzo = this.fermata["indirizzo"];

            var resultsMap = new google.maps.Map(document.getElementById("map"), {
              zoom: 15,
              center: { lat: 41.397, lng: 14.644 },
              gestureHandling: 'cooperative',
              disableDefaultUI: true
            });
            var geocoder = new google.maps.Geocoder();
            geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'address': indirizzo }, function (results, status) {

              if (status === 'OK') {

                var component = results[0].address_components;






                resultsMap.setCenter(results[0].geometry.location);

                var marker = new google.maps.Marker({
                  draggable: false,
                  map: resultsMap,
                  position: results[0].geometry.location

                });



              }
            });



          },
          error => {
            this.caricamentoButton = false;
            var alert = {

              'testo': this.share.traduci('str_nessunaposizionetrovata'),
              'tipo': "alert-danger",
              'delay': 3000

            }
            this.share.alert.generateAlert(alert)

          });

      }
      else {
        var alert = {

          'testo': this.share.traduci('str_nessunaposizionetrovata'),
          'tipo': "alert-danger",
          'delay': 3000

        }
        this.share.alert.generateAlert(alert)
      }

    });



  }


}
