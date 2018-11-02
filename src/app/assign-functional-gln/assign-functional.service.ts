//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { IGlnSummary } from './../shared/interfaces/igln-summary';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { RequestOptions, Headers, Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';

import { environment } from './../../environments/environment';

import { Gln } from './../shared/types/gln';
import { IGln } from './../shared/interfaces/igln';

import { MessagesService } from './../services/messages.service';
import { GlnService } from './../services/gln.service';

@Injectable()
export class AssignFunctionalService {

  private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
  private options: RequestOptions = new RequestOptions({ headers: this.headers, withCredentials: true});

  // next functional GLN to be assigned
  private nextFunctionalGlnSubject = new BehaviorSubject<IGln>(new Gln());
  nextFunctionalGln$ = this.nextFunctionalGlnSubject.asObservable();

  // next GLN to be associated with new assignment GLN
  private glnToAssociateSubject = new BehaviorSubject<IGln>(new Gln());
  glnToAssociate$ = this.glnToAssociateSubject.asObservable();

  // GLNs currently associated with GLN
  private associatedGlnsSubject = new BehaviorSubject<IGlnSummary[]>([]);
  associatedGlns$ = this.associatedGlnsSubject.asObservable();

  private nextFunctionalGln: IGln;
  toAssociateId: number;

  constructor(private _http: Http, private _messagesService: MessagesService, private _glnService: GlnService) {
    this.nextFunctionalGln$.subscribe( gln => this.nextFunctionalGln = gln );
  }


   getNextFunctionalGln(): Observable<IGln> {
      return this._glnService.getNextUnassignedGln()
            .do(gln => this.nextFunctionalGlnSubject.next(gln))
            .do(gln => this.nextFunctionalGln = gln)
            .publishLast().refCount()
            .catch(this.handlerError);
   }

  assignNewGln(): Observable<IGln> {
      return this._glnService.updateNewAssignedGln(this.nextFunctionalGln)
            .do(gln => this.nextFunctionalGlnSubject.next(gln))
            .publishLast().refCount()
            .catch(this.handlerError);
    }

  assignGlnToGln() {
    return this._glnService.createGlnAssociation(this.nextFunctionalGln.Id, this.toAssociateId)
                    .do(associatedGlns => this.associatedGlnsSubject.next(associatedGlns))
                    .publishLast().refCount();
  }

  nextGln(gln: IGln) {
      this.nextFunctionalGlnSubject.next(gln);
  }

  returnLastAssignedGln() {
      return this.nextFunctionalGln$.publishLast().refCount();
  }

  handlerError(err) {
        let errMessage: string;

        if ( err instanceof Response ) {

            errMessage = `${err.status} - ${err.statusText || ''},  ${err.json().Message}`;
            this._messagesService.error(errMessage);

        } else {
            errMessage = err.message ? err.message : err.toString();
            this._messagesService.error(errMessage);
        }

        return Observable.throw(errMessage);
    }
}
