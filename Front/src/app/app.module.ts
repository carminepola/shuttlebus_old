import { BrowserModule, Title, Meta } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './module/shared/shared.module';
import { commonFunctionModule } from './module/commonFunction/commonFunction.module';
import { TestComponent } from 'src/app/pages/test/test.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LowerCaseUrlSerializer } from "src/app/class/lowerCaseUrlSerializer";


import { UrlSerializer, Router, Scroll } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './pieces/navbar/navbar.component';
import { FooterComponent } from './pieces/footer/footer.component';
import { ServerErrorComponent } from './pages/server-error/server-error.component';
import { NotificationsComponent } from './pieces/notifications/notifications.component';
import { NotificationsModule } from './module/shared/notifications.module';
import { ModuleComponent } from './pieces/module/module.component';
import { AlertComponent } from './pieces/alert/alert.component';
import { AlertsModule } from './module/shared/alert.module';
import { CentroNotificheComponent } from './pages/centro-notifiche/centro-notifiche.component';

import { reversePipe } from "src/app/class/reversePipe";
import { HttpClientModule } from '@angular/common/http';
import { CarrelloIconComponent } from './pieces/carrello-icon/carrello-icon.component';
import { CambioLinguaComponent } from './pieces/cambio-lingua/cambio-lingua.component';
import { LoadingComponent } from './pieces/loading/loading.component';
import { LoginComponent } from './pages/login/login.component';
import { Routes, RouterModule } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { DashComponent } from './pages/dash/dash.component';
import { NavAdminComponent } from './pieces/nav-admin/nav-admin.component';
import { NotificheComponent } from './pieces/notifiche/notifiche.component';
import { UserComponent } from './pages/user/user.component';
import { LoadingDivComponent } from './pieces/loading-div/loading-div.component';
import { UtentiComponent } from './pages/utenti/utenti.component';
import { NewUserComponent } from './pages/new-user/new-user.component';
import { ListaBigliettiComponent } from './pages/lista-biglietti/lista-biglietti.component';
import { BigliettoComponent } from './pages/biglietto/biglietto.component';
import { filter } from './pipe/filter.pipe';
import { NgxWigModule } from 'ngx-wig';
import { ListaFermateComponent } from './pages/lista-fermate/lista-fermate.component';
import { FermateComponent } from './pages/fermate/fermate.component';
import { LineeComponent } from './pages/linee/linee.component';
import { LineaComponent } from './pages/linea/linea.component';
import { ListaTraduzioniComponent } from './pages/lista-traduzioni/lista-traduzioni.component';
import { TraduzioniComponent } from './pages/traduzioni/traduzioni.component';
import { ListaFaqComponent } from './pages/lista-faq/lista-faq.component';
import { AdminFaqComponent } from './pages/admin-faq/admin-faq.component';
import { FaqComponent } from './pages/faq/faq.component';
import { AziendaComponent } from './pages/azienda/azienda.component';
import { LelineeComponent } from './pages/lelinee/lelinee.component';
import { BuslineComponent } from './pages/busline/busline.component';
import { ClickOutsideModule } from 'ng-click-outside';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale, itLocale, enGbLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { HomeOneComponent } from './pieces/home-one/home-one.component';
import { HomeSearchComponent } from './pieces/home-search/home-search.component';
import { CarrelloComponent } from './pages/carrello/carrello.component';
import { RiepilogoComponent } from './pages/riepilogo/riepilogo.component';
import { MetodiPagamentoComponent } from './pages/metodi-pagamento/metodi-pagamento.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { CheckPaymentComponent } from './pages/check-payment/check-payment.component';
import { TicketsComponent } from './pages/tickets/tickets.component';
import { CheckTicketComponent } from './pages/check-ticket/check-ticket.component';
import { SearchFromMailComponent } from './pages/search-from-mail/search-from-mail.component';


defineLocale('it', itLocale);
defineLocale('en', enGbLocale);


@NgModule({
  declarations: [
    AppComponent,
    filter,


    HomeComponent,
    NavbarComponent,
    FooterComponent,
    TestComponent,
    NotFoundComponent,
    ServerErrorComponent,
    NotificationsComponent,
    ModuleComponent,
    AlertComponent,
    CentroNotificheComponent,
    reversePipe,
    CarrelloIconComponent,
    CambioLinguaComponent,
    LoadingComponent,
    LoginComponent,
    DashComponent,
    NavAdminComponent,
    NotificheComponent,
    UserComponent,
    LoadingDivComponent,
    UtentiComponent,
    NewUserComponent,
    ListaBigliettiComponent,
    BigliettoComponent,
    ListaFermateComponent,
    FermateComponent,
    LineeComponent,
    LineaComponent,
    ListaTraduzioniComponent,
    TraduzioniComponent,
    ListaFaqComponent,
    AdminFaqComponent,
    FaqComponent,
    AziendaComponent,
    LelineeComponent,
    BuslineComponent,
    HomeOneComponent,
    HomeSearchComponent,
    CarrelloComponent,
    RiepilogoComponent,
    MetodiPagamentoComponent,
    SettingsComponent,
    CheckPaymentComponent,
    TicketsComponent,
    CheckTicketComponent,
    SearchFromMailComponent,


  ],
  imports: [

    BrowserModule,
    AppRoutingModule,
    SharedModule,
    commonFunctionModule,
    ReactiveFormsModule,
    FormsModule,
    NotificationsModule,
    AlertsModule,
    HttpClientModule,
    NgxWigModule,
    ClickOutsideModule,
    BsDatepickerModule.forRoot(),
    BrowserAnimationsModule,
    TooltipModule.forRoot()

  ],
  providers: [Title, Meta,
    {
      provide: UrlSerializer,
      useClass: LowerCaseUrlSerializer
    }],
  bootstrap: [AppComponent]
})
export class AppModule {

}
