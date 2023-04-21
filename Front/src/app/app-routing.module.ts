import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestComponent } from 'src/app/pages/test/test.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HomeComponent } from 'src/app/pages/home/home.component';
import { ServerErrorComponent } from 'src/app/pages/server-error/server-error.component';
import { CentroNotificheComponent } from 'src/app/pages/centro-notifiche/centro-notifiche.component';
import { from } from 'rxjs';
import { LoginComponent } from './pages/login/login.component';
import { DashComponent } from './pages/dash/dash.component';
import { UserComponent } from './pages/user/user.component';
import { UtentiComponent } from './pages/utenti/utenti.component';
import { NewUserComponent } from './pages/new-user/new-user.component';
import { BigliettoComponent } from './pages/biglietto/biglietto.component';
import { ListaBigliettiComponent } from './pages/lista-biglietti/lista-biglietti.component';
import { ListaFermateComponent } from './pages/lista-fermate/lista-fermate.component';
import { FermateService } from './services/REM/fermate/fermate.service';
import { FermateComponent } from './pages/fermate/fermate.component';
import { LineaComponent } from './pages/linea/linea.component';
import { LineeComponent } from './pages/linee/linee.component';
import { ListaTraduzioniComponent } from './pages/lista-traduzioni/lista-traduzioni.component';
import { TraduzioniComponent } from './pages/traduzioni/traduzioni.component';
import { FaqComponent } from './pages/faq/faq.component';
import { ListaFaqComponent } from './pages/lista-faq/lista-faq.component';
import { AdminFaqComponent } from './pages/admin-faq/admin-faq.component';
import { AziendaComponent } from './pages/azienda/azienda.component';
import { LelineeComponent } from './pages/lelinee/lelinee.component';
import { BuslineComponent } from './pages/busline/busline.component';
import { CarrelloComponent } from './pages/carrello/carrello.component';
import { RiepilogoComponent } from './pages/riepilogo/riepilogo.component';
import { MetodiPagamentoComponent } from './pages/metodi-pagamento/metodi-pagamento.component';
import { settings } from 'cluster';
import { SettingsComponent } from './pages/settings/settings.component';
import { CheckPaymentComponent } from './pages/check-payment/check-payment.component';
import { TicketsComponent } from './pages/tickets/tickets.component';
import { CheckTicketComponent } from './pages/check-ticket/check-ticket.component';
import { SearchFromMailComponent } from './pages/search-from-mail/search-from-mail.component';
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      indicizza: true,
      title: {
        "it": "Pintour | Autobus di linea per Costiera Amalfitana, Penisola Sorrentina e l’intera Campania ",
        "en": "Pintour | Line bus to the Amalfi Coast, Sorrento area and whole Campania"
      },
      description: {
        "it": "Linee autobus giornaliere per e da Napoli, Costiera Amalfitana, Penisola Sorrentina, Salerno e altre destinazioni della regione Campania.",
        "en": "Daily bus lines to and from Naples, Amalfi Coast, Sorrento area, Salerno and other destinations of Campania region (South Italy)."
      },
      keywords: [],
      type: "website",
      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: true, trasparent: false },
      footer: { show: true, trasparent: false },
      admin: false,
      richiedeAccesso: false,
    },
  },
  {

    path: 'it',
    component: HomeComponent,
    data: {
      indicizza: true,
      title: {
        "it": "Pintour | Autobus di linea per Costiera Amalfitana, Penisola Sorrentina e l’intera Campania",
        "en": "Pintour | Line bus to the Amalfi Coast, Sorrento area and whole Campania"
      },
      description: {
        "it": "Linee autobus giornaliere per e da Napoli, Costiera Amalfitana, Penisola Sorrentina, Salerno e altre destinazioni della regione Campania.",
        "en": "Daily bus lines to and from Naples, Amalfi Coast, Sorrento area, Salerno and other destinations of Campania region (South Italy)."
      },
      keywords: [],
      type: "website",
      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: true, trasparent: false },
      footer: { show: true, trasparent: false },
      admin: false,
      richiedeAccesso: false,
    },
  },
  {

    path: 'en',
    component: HomeComponent,
    data: {
      indicizza: true,
      title: {
        "it": "Pintour | Autobus di linea per Costiera Amalfitana, Penisola Sorrentina e l’intera Campania",
        "en": "Pintour | Line bus to the Amalfi Coast, Sorrento area and whole Campania"
      },
      description: {
        "it": "Linee autobus giornaliere per e da Napoli, Costiera Amalfitana, Penisola Sorrentina, Salerno e altre destinazioni della regione Campania.",
        "en": "Daily bus lines to and from Naples, Amalfi Coast, Sorrento area, Salerno and other destinations of Campania region (South Italy)."
      },
      keywords: [],
      type: "website",
      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: true, trasparent: false },
      footer: { show: true, trasparent: false },
      richiedeAccesso: false,
    },
  },
  {

    path: ':lng/test',
    component: TestComponent,
    data: {
      indicizza: false,
      title: {
        "it": "Pagina test",
        "en": "Test page"
      },
      description: {
        "it": "Pagina test",
        "en": "Test page"
      },
      keywords: [],
      type: "website",

      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: true, trasparent: false },
      footer: { show: true, trasparent: false },
      richiedeAccesso: false,
    }
  },
  {

    path: ':lng/searchfromail/:id',
    component: SearchFromMailComponent,
    data: {
      indicizza: false,
      title: {
        "it": "Cerca biglietti",
        "en": "Search Ticket"
      },
      description: {
        "it": "Cerca biglietti",
        "en": "Search Ticket"
      },
      keywords: [],
      type: "website",
      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: true, trasparent: false },
      footer: { show: true, trasparent: false },
      admin: false,
      richiedeAccesso: false,
    }
  },
  {

    path: ':lng/checkticket',
    component: CheckTicketComponent,
    data: {
      indicizza: false,
      title: {
        "it": "Controllo biglietti",
        "en": "Check Ticket"
      },
      description: {
        "it": "Controllo biglietti",
        "en": "Check Ticket"
      },
      keywords: [],
      type: "website",
      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: true, trasparent: false },
      footer: { show: true, trasparent: false },
      admin: false,
      richiedeAccesso: false,
    }
  },
  {

    path: ':lng/checkticket/:id',
    component: CheckTicketComponent,
    data: {
      indicizza: false,
      title: {
        "it": "Controllo biglietti",
        "en": "Check Ticket"
      },
      description: {
        "it": "Controllo biglietti",
        "en": "Check Ticket"
      },
      keywords: [],
      type: "website",
      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: true, trasparent: false },
      footer: { show: true, trasparent: false },
      admin: false,
      richiedeAccesso: false,
    }
  },
  {

    path: ':lng/search',
    component: HomeComponent,
    data: {
      indicizza: true,
      title: {
        "it": "Pintour | Autobus di linea per Costiera Amalfitana, Penisola Sorrentina e l’intera Campania ",
        "en": "Pintour | Line bus to the Amalfi Coast, Sorrento area and whole Campania"
      },
      description: {
        "it": "Linee autobus giornaliere per e da Napoli, Costiera Amalfitana, Penisola Sorrentina, Salerno e altre destinazioni della regione Campania.",
        "en": "Daily bus lines to and from Naples, Amalfi Coast, Sorrento area, Salerno and other destinations of Campania region (South Italy)."
      },
      keywords: [],
      type: "website",
      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: true, trasparent: false },
      footer: { show: true, trasparent: false },
      admin: false,
      richiedeAccesso: false,
    }
  },
  {

    path: ':lng/faq',
    component: FaqComponent,
    data: {
      indicizza: false,
      title: {
        "it": "Pintour | FAQ",
        "en": "Pintour | FAQ"
      },
      description: {
        "it": "In questa sezione tutte le domande più ricorrenti sui servizi di linea Pintour.",
        "en": "In this section all the most frequently asked questions about Pintour bus line services."
      },
      keywords: ["Domande","question"],
      type: "website",

      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: true, trasparent: false },
      footer: { show: true, trasparent: false },
      richiedeAccesso: false,
    }
  },
  {

    path: ':lng/buslines',
    component: LelineeComponent,
    data: {
      indicizza: false,
      title: {
        "it": "Pintour | Le Linee",
        "en": "Pintour | Bus lines"
      },
      description: {
        "it": "Scopri tutte le linee e le fermate degli autobus di Pintour con partenze da Napoli, Costiera Amalfitana e Penisola Sorrentina.",
        "en": "Discover all the lines and bus stops of Pintour with departures from Naples, the Amalfi Coast and Sorrento area."
      },
      keywords: ["linea","linee","pintour","busline","stops","naples","napoli","amalfi","Coast","sorrento"],
      type: "website",

      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: true, trasparent: false },
      footer: { show: true, trasparent: false },
      richiedeAccesso: false,
    }
  },
  {

    path: ':lng/busline/:id/:name',
    component: BuslineComponent,
    data: {
      indicizza: false,
      title: {
        "it": "Pintour | BUS LINE",
        "en": "Pintour | BUS LINE"
      },
      description: {
        "it": "Scopri nel dettaglio ogni singola fermata di #nome# del servizio autobus Pintour.",
        "en": "Discover in detail every single stop of the #nome# by Pintour bus line service."
      },
      keywords: [],
      type: "website",

      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: true, trasparent: false },
      footer: { show: true, trasparent: false },
      richiedeAccesso: false,
    }
  },
  {

    path: ':lng/login',
    component: LoginComponent,
    data: {
      indicizza: false,
      title: {
        "it": "Login",
        "en": "Login"
      },
      description: {
        "it": "Effettua l'accesso",
        "en": "login"
      },
      keywords: ["Login"],
      type: "website",

      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: true, trasparent: false },
      footer: { show: true, trasparent: false },
      richiedeAccesso: false,
      notifiche: false
    }
  },
  {

    path: ':lng/azienda',
    component: AziendaComponent,
    data: {
      indicizza: false,
      title: {
        "it": "Pintour | Azienda",
        "en": "Pintour | Company"
      },
      description: {
        "it": "In questa sezione una breve descrizione della storia di Pintour, i suoi servizi e valori.",
        "en": "In this section a brief description of Pintour history, its services and values."
      },
      keywords: ["Company","Azienda","Pintour"],
      type: "website",

      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: true, trasparent: false },
      footer: { show: true, trasparent: false },
      richiedeAccesso: false,
      notifiche: false
    }
  },
  {

    path: ':lng/dash',
    component: DashComponent,
    data: {
      indicizza: false,
      title: {
        "it": "Dashboard",
        "en": "Dashboard"
      },
      description: {
        "it": "Pagina test",
        "en": "Test page"
      },
      keywords: [],
      type: "website",

      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: false, trasparent: false },
      footer: { show: false, trasparent: false },
      richiedeAccesso: true,
      notifiche: true
    }
  },
  {

    path: ':lng/utenti',
    component: UtentiComponent,
    data: {
      indicizza: false,
      title: {
        "it": "Utenti",
        "en": "Users"
      },
      description: {
        "it": "Pagina test",
        "en": "Test page"
      },
      keywords: [],
      type: "website",

      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: false, trasparent: false },
      footer: { show: false, trasparent: false },
      richiedeAccesso: true,
      notifiche: true
    }
  },
  {

    path: ':lng/tickets',
    component: TicketsComponent,
    data: {
      indicizza: false,
      title: {
        "it": "Biglietti acquistati",
        "en": "Biglietti acquistati"
      },
      description: {
        "it": "Pagina test",
        "en": "Test page"
      },
      keywords: [],
      type: "website",

      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: false, trasparent: false },
      footer: { show: false, trasparent: false },
      richiedeAccesso: true,
      notifiche: true
    }
  },
  {

    path: ':lng/user',
    component: UserComponent,
    data: {
      indicizza: false,
      title: {
        "it": "Utente",
        "en": "User"
      },
      description: {
        "it": "Pagina test",
        "en": "Test page"
      },
      keywords: [],
      type: "website",

      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: false, trasparent: false },
      footer: { show: false, trasparent: false },
      richiedeAccesso: true,
      notifiche: true
    }
  },
  {

    path: ':lng/nuovoutente',
    component: NewUserComponent,
    data: {
      indicizza: false,
      title: {
        "it": "Nuvoo utente",
        "en": "new user"
      },
      description: {
        "it": "Pagina test",
        "en": "Test page"
      },
      keywords: [],
      type: "website",

      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: false, trasparent: false },
      footer: { show: false, trasparent: false },
      richiedeAccesso: true,
      notifiche: true
    }
  },
  {
    path: ':lng/traduzioni',
    component: ListaTraduzioniComponent,
    data: {
      indicizza: false,
      title: {
        "it": "Traduzioni",
        "en": "Traduzioni"
      },
      description: {
        "it": "Pagina test",
        "en": "Test page"
      },
      keywords: [],
      type: "website",
      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: false, trasparent: false },
      footer: { show: false, trasparent: false },
      richiedeAccesso: true,
      notifiche: true

    }
  },
  {
    path: ':lng/traduzione',
    component: TraduzioniComponent,
    data: {
      indicizza: false,
      title: {
        "it": "Traduzione",
        "en": "Traduzione"
      },
      description: {
        "it": "Pagina test",
        "en": "Test page"
      },
      keywords: [],
      type: "website",
      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: false, trasparent: false },
      footer: { show: false, trasparent: false },
      richiedeAccesso: true,
      notifiche: true

    }
  },
  {
    path: ':lng/listafaq',
    component: ListaFaqComponent,
    data: {
      indicizza: false,
      title: {
        "it": "FAQ",
        "en": "FAQ"
      },
      description: {
        "it": "Pagina test",
        "en": "Test page"
      },
      keywords: [],
      type: "website",
      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: false, trasparent: false },
      footer: { show: false, trasparent: false },
      richiedeAccesso: true,
      notifiche: true

    }
  },
  {
    path: ':lng/adminfaq',
    component: AdminFaqComponent,
    data: {
      indicizza: false,
      title: {
        "it": "FAQ",
        "en": "FAQ"
      },
      description: {
        "it": "Pagina test",
        "en": "Test page"
      },
      keywords: [],
      type: "website",
      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: false, trasparent: false },
      footer: { show: false, trasparent: false },
      richiedeAccesso: true,
      notifiche: true

    }
  },

  {
    path: ':lng/adminfaq/:id',
    component: AdminFaqComponent,
    data: {
      indicizza: false,
      title: {
        "it": "FAQ",
        "en": "FAQ"
      },
      description: {
        "it": "Pagina test",
        "en": "Test page"
      },
      keywords: [],
      type: "website",
      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: false, trasparent: false },
      footer: { show: false, trasparent: false },
      richiedeAccesso: true,
      notifiche: true

    }
  },
  {
    path: ':lng/traduzione/:id',
    component: TraduzioniComponent,
    data: {
      indicizza: false,
      title: {
        "it": "Traduzione",
        "en": "Traduzione"
      },
      description: {
        "it": "Pagina test",
        "en": "Test page"
      },
      keywords: [],
      type: "website",
      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: false, trasparent: false },
      footer: { show: false, trasparent: false },
      richiedeAccesso: true,
      notifiche: true

    }
  },
  {
    path: ':lng/linee',
    component: LineeComponent,
    data: {
      indicizza: false,
      title: {
        "it": "Linee",
        "en": "Linee"
      },
      description: {
        "it": "Pagina test",
        "en": "Test page"
      },
      keywords: [],
      type: "website",
      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: false, trasparent: false },
      footer: { show: false, trasparent: false },
      richiedeAccesso: true,
      notifiche: true

    }
  },
  {
    path: ':lng/linea',
    component: LineaComponent,
    data: {
      indicizza: false,
      title: {
        "it": "Linea",
        "en": "Linea"
      },
      description: {
        "it": "Pagina test",
        "en": "Test page"
      },
      keywords: [],
      type: "website",
      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: false, trasparent: false },
      footer: { show: false, trasparent: false },
      richiedeAccesso: true,
      notifiche: true

    }
  },
  {
    path: ':lng/linea/:id',
    component: LineaComponent,
    data: {
      indicizza: false,
      title: {
        "it": "Linea",
        "en": "Linea"
      },
      description: {
        "it": "Pagina test",
        "en": "Test page"
      },
      keywords: [],
      type: "website",
      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: false, trasparent: false },
      footer: { show: false, trasparent: false },
      richiedeAccesso: true,
      notifiche: true

    }
  },
  {

    path: ':lng/biglietti',
    component: ListaBigliettiComponent,
    data: {
      indicizza: false,
      title: {
        "it": "Biglietti",
        "en": "Tickets"
      },
      description: {
        "it": "Pagina test",
        "en": "Test page"
      },
      keywords: [],
      type: "website",

      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: false, trasparent: false },
      footer: { show: false, trasparent: false },
      richiedeAccesso: true,
      notifiche: true
    }
  },

  {

    path: ':lng/biglietto',

    component: BigliettoComponent,
    data: {
      indicizza: false,
      title: {
        "it": "Biglietto",
        "en": "Ticket"
      },
      description: {
        "it": "Pagina test",
        "en": "Test page"
      },
      keywords: [],
      type: "website",

      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: false, trasparent: false },
      footer: { show: false, trasparent: false },
      richiedeAccesso: true,
      notifiche: true

    }
  },
  {

    path: ':lng/biglietto/:id',

    component: BigliettoComponent,
    data: {
      indicizza: false,
      title: {
        "it": "Biglietto",
        "en": "Ticket"
      },
      description: {
        "it": "Pagina test",
        "en": "Test page"
      },
      keywords: [],
      type: "website",

      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: false, trasparent: false },
      footer: { show: false, trasparent: false },
      richiedeAccesso: true,
      notifiche: true

    }
  },

  {

    path: ':lng/fermate',
    component: ListaFermateComponent,
    data: {
      indicizza: false,
      title: {
        "it": "Fermate",
        "en": "Fermate"
      },
      description: {
        "it": "Pagina test",
        "en": "Test page"
      },
      keywords: [],
      type: "website",

      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: false, trasparent: false },
      footer: { show: false, trasparent: false },
      richiedeAccesso: true,
      notifiche: true
    }
  },
  {

    path: ':lng/fermata',

    component: FermateComponent,
    data: {
      indicizza: false,
      title: {
        "it": "Fermata",
        "en": "Fermata"
      },
      description: {
        "it": "Pagina test",
        "en": "Test page"
      },
      keywords: [],
      type: "website",

      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: false, trasparent: false },
      footer: { show: false, trasparent: false },
      richiedeAccesso: true,
      notifiche: true

    }
  },
  {

    path: ':lng/settings',
    component: SettingsComponent,
    data: {
      indicizza: false,
      title: {
        "it": "Impostazioni",
        "en": "Settings"
      },
      description: {
        "it": "Pagina test",
        "en": "Test page"
      },
      keywords: [],
      type: "website",

      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: false, trasparent: false },
      footer: { show: false, trasparent: false },
      richiedeAccesso: true,
      notifiche: true
    }
  },
  {

    path: ':lng/carrello',

    component: CarrelloComponent,
    data: {
      indicizza: false,
      title: {
        "it": "Carrello",
        "en": "Carrello"
      },
      description: {
        "it": "Carrello",
        "en": "Chart"
      },
      keywords: [],
      type: "website",

      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: true, trasparent: false },
      footer: { show: true, trasparent: false },
      richiedeAccesso: false,
      notifiche: false

    }
  },
  {

    path: ':lng/checkout',

    component: RiepilogoComponent,
    data: {
      indicizza: false,
      title: {
        "it": "Pagamento",
        "en": "Payment"
      },
      description: {
        "it": "Carrello",
        "en": "Chart"
      },
      keywords: [],
      type: "website",

      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: true, trasparent: false },
      footer: { show: true, trasparent: false },
      richiedeAccesso: false,
      notifiche: false

    }
  },
  {
    path: ':lng/checkpayment/:tipo/:id',
    component: CheckPaymentComponent,
    data: {
      indicizza: false,
      title: {
        "it": "Controllo pagamento",
        "en": "Payment"
      },
      description: {
        "it": "Payment",
        "en": "Payment"
      },
      keywords: [],
      type: "website",
      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: true, trasparent: false },
      footer: { show: true, trasparent: false },
      richiedeAccesso: false,
      notifiche: false
    }
  },
  {
    path: ':lng/payment',
    component: MetodiPagamentoComponent,
    data: {
      indicizza: false,
      title: {
        "it": "Pagamento",
        "en": "Payment"
      },
      description: {
        "it": "Carrello",
        "en": "Chart"
      },
      keywords: [],
      type: "website",
      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: true, trasparent: false },
      footer: { show: true, trasparent: false },
      richiedeAccesso: false,
      notifiche: false
    }
  },
  {
    path: ':lng/fermata/:id',
    component: FermateComponent,
    data: {
      indicizza: false,
      title: {
        "it": "Fermate",
        "en": "Fermate"
      },
      description: {
        "it": "Pagina test",
        "en": "Test page"
      },
      keywords: [],
      type: "website",
      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: false, trasparent: false },
      footer: { show: false, trasparent: false },
      richiedeAccesso: true,
      notifiche: true
    }
  },
  {
    path: ':lng/notificationscenter',
    component: CentroNotificheComponent,
    data: {
      indicizza: false,
      title: {
        "it": "Centro notifiche",
        "en": "Notification center"
      },
      description: {
        "it": "Pagina test",
        "en": "Test page"
      },
      keywords: [],
      type: "website",

      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: false, trasparent: false },
      footer: { show: true, trasparent: false },
      richiedeAccesso: true,
      notifiche: false
    }
  },
  {

    path: ':lng/500',
    component: ServerErrorComponent,
    data: {
      indicizza: false,
      title: {
        "it": "505",
        "en": "505"
      },
      description: {
        "it": "Pagina test",
        "en": "Test page"
      },
      keywords: [],
      type: "website",

      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: true, trasparent: false },
      footer: { show: true, trasparent: false },
      richiedeAccesso: false,
    }
  },
  {
    path: '404',
    component: NotFoundComponent,
    data: {
      indicizza: false,
      title: {
        "it": "404 pagina non trovata",
        "en": "404 page not found"
      },
      description: {
        "it": "Pagina test",
        "en": "Test page"
      },
      keywords: [],
      type: "website",

      theme_color: "#d01361",
      author: "Carmine Pola",
      navbar: { show: true, trasparent: false },
      footer: { show: true, trasparent: false },
      richiedeAccesso: false,
    }


  },

  { path: '**', redirectTo: '/' }


];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled', // Add options right here
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
