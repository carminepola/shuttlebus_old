import { Injectable } from '@angular/core';
import { UsersService } from '../REM/users/users.service'
import { TraduzioniService } from './traduzioni/traduzioni.service';
import { LoginService } from './login/login.service';
import { BigliettiService } from './biglietti/biglietti.service';
import { FermateService } from './fermate/fermate.service';
import { UploadService } from './upload/upload.service';
import { LineeService } from './linee/linee.service';
import { FaqService } from './faq/faq.service';
import { SearchService } from './search/search.service';
import { ImpostazioniService } from './impostazioni/impostazioni.service';
import { PagamentiService } from './pagamenti/pagamenti.service';
import { DashboardService } from './dashboard/dashboard.service';
import { TicketsService } from './tickets/tickets.service';
import { NotificheService } from './notifiche/notifiche.service';
@Injectable({
  providedIn: 'root'
})
export class RemService {
  constructor(
    public user: UsersService,
    public traduzioniService: TraduzioniService,
    public login: LoginService,
    public biglietti: BigliettiService,
    public fermate: FermateService,
    public upload: UploadService,
    public linee: LineeService,
    public faq: FaqService,
    public search: SearchService,
    public impostazioni: ImpostazioniService,
    public pagamenti: PagamentiService,
    public dashboard: DashboardService,
    public tickets: TicketsService,
    public notifiche: NotificheService
  ) {
  }
}
