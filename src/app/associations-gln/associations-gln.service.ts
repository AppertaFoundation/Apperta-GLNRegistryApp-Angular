//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { Observable } from 'rxjs/Observable';
import { MessagesService } from './../services/messages.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { RequestOptions, Headers, Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';

import { Gln } from './../shared/types/gln';
import { IGln } from './../shared/interfaces/igln';
import { IGlnSummary } from './../shared/interfaces/igln-summary';

import { GlnService } from './../services/gln.service';

export const UNKNOWN_GLN: Gln = new Gln();

@Injectable()
export class AssociationsGlnService {

  private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
  private options: RequestOptions = new RequestOptions({ headers: this.headers, withCredentials: true});

  // Selected GLN for editing associations
  private glnSubject = new BehaviorSubject<IGln>(UNKNOWN_GLN);
  gln$ = this.glnSubject.asObservable();
  glnId: number;

  // GLN selected to be associated with GLN
  private selectedGlnToAssociateSubject = new BehaviorSubject<IGln>(UNKNOWN_GLN);
  selectedGlnToAssociate$ = this.selectedGlnToAssociateSubject.asObservable();

  // GLNs currently associated with GLN
  private associatedGlnsSubject = new BehaviorSubject<IGlnSummary[]>([]);
  associatedGlns$ = this.associatedGlnsSubject.asObservable();

  constructor(private _http: Http, private _messagesService: MessagesService, private _glnService: GlnService) { }

  getGlnsAssociatedWithGln() {
    this.getGlnId();
    return this._glnService.getAssociatedGlnsByParentId(this.glnId)
                    .do(associatedGlns => this.associatedGlnsSubject.next(associatedGlns))
                    .publishLast().refCount();
  }

  assignGlnToGln(id2: number) {
    this.getGlnId();
    return this._glnService.createGlnAssociation(this.glnId, id2)
                    .do(associatedGlns => this.associatedGlnsSubject.next(associatedGlns))
                    .publishLast().refCount();
  }

  removeAssignedGlnFromGln(id: number) {
    this.getGlnId();
    return this._glnService.removeGlnAssociation(this.glnId, id)
                    .do(associatedGlns => this.associatedGlnsSubject.next(associatedGlns))
                    .publishLast().refCount();
  }

  getGlnId() {
    this.gln$.subscribe(lastGln => this.glnId = lastGln.Id);
    this.gln$.last();
  }

  glnToAssign(gln: IGln) {
    this.glnSubject.next(gln);
    this.gln$.publishLast().refCount();
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
