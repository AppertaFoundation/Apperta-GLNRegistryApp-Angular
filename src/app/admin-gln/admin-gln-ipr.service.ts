//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable, OnInit } from '@angular/core';

import { IIpr } from './../shared/interfaces/Iipr';
import { Ipr } from './../shared/types/ipr';

import { IprService } from './../services/ipr.service';
import { MessagesService } from './../services/messages.service';

@Injectable()
export class AdminGlnIprService implements OnInit {

  private iprSubject = new BehaviorSubject<IIpr>(new Ipr());
  ipr$: Observable<IIpr> = this.iprSubject.asObservable();

  constructor(private _http: Http, private _messagesService: MessagesService, private _iprService: IprService) { }

  ngOnInit(): void {
      this._iprService.getIpr().subscribe(ipr => {
        this.iprSubject.next(ipr);
        this.ipr$.publishLast().refCount();
      })
  }

  updateIpr(ipr: IIpr) {
    return this._iprService.updateIpr(ipr);
  }
}
