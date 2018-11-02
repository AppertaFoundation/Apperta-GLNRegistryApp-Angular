//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { EnvironmentService } from './services/environment.service';
import { MessagesService } from './services/messages.service';
import { Observable, Subscription } from 'rxjs/Rx';
import { Component, OnInit } from '@angular/core';

import { IUser } from './shared/interfaces/iuser';
import { IIpr } from './shared/interfaces/Iipr';

import { StartUpService } from './services/start-up.service';
import { LoadingService } from './services/loading.service';

import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'University Hospitals Plymouth NHS Trust - GLN Registry';
  user$: Observable<IUser>;

  constructor(
    private _enService: EnvironmentService,
    private _loadingService: LoadingService,
    private _messagesService: MessagesService,
    private _startUpService: StartUpService ) {
  }

  ngOnInit(): void {
    this.user$ = this._startUpService.user$;
    this._enService.setAllSettings().do(() => this._loadingService.loading()).subscribe(settings => {
      this._enService.apiUrl = settings.apiUrl;
      this._enService.appTitle = settings.appTitle;
      this.title = settings.appTitle;
      this._startUpService.startUp()
                          .subscribe(success => {
                                        this._loadingService.finishLoading();
                                      },
                                      error => {
                                        this._loadingService.finishLoading();
                                        this._messagesService.error('Unable to load start up objects. ' + error);
                                      });
    });
  }
}
