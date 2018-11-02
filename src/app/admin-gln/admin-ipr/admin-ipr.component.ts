//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { StartUpService } from './../../services/start-up.service';
import { MessagesService } from './../../services/messages.service';
import { LoadingService } from './../../services/loading.service';
import { IIpr } from './../../shared/interfaces/Iipr';
import { Observable } from 'rxjs/Rx';
import { AdminGlnIprService } from './../admin-gln-ipr.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-ipr',
  templateUrl: './admin-ipr.component.html',
  styleUrls: ['./admin-ipr.component.css']
})
export class AdminIprComponent implements OnInit {
  ipr$: Observable<IIpr>;
  loading$: Observable<boolean>;

  ipr: IIpr;

  constructor(private _adminGlnService: AdminGlnIprService,
              private _loadingService: LoadingService,
              private _startUp: StartUpService,
              private _messageService: MessagesService) { }

  ngOnInit() {
    this._startUp.ipr$.take(1).subscribe(ipr => this.ipr = ipr);
    this.loading$ = this._loadingService.loading$;
  }

  editIpr(id: number) {
  }
}
