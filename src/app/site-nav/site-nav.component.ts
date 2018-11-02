//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { LoadingService } from './../services/loading.service';
import { Observable } from 'rxjs/Rx';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { IUser } from './../shared/interfaces/iuser';

import { StartUpService } from './../services/start-up.service';

@Component({
  selector: 'app-site-nav',
  templateUrl: './site-nav.component.html',
  styleUrls: ['./site-nav.component.css']
})
export class SiteNavComponent implements OnInit {

  successMessage = '';
  user$: Observable<IUser>;
  loading$: Observable<boolean>;

  constructor(private _router: Router,
              private _startUpService: StartUpService,
              private _loadingService: LoadingService) {

  }

  ngOnInit() {
    this.user$ = this._startUpService.user$;
    this.loading$ = this._loadingService.loading$;

  }

}
