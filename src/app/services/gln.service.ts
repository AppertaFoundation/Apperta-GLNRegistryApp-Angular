//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Injectable, OnInit, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Rx';

import { EnvironmentService } from './environment.service';
import { MessagesService } from './messages.service';

import { IContact } from './../shared/interfaces/icontact';
import { IGln } from './../shared/interfaces/igln';
import { IGlnSummary } from './../shared/interfaces/igln-summary';
import { IGlnQuery } from './../shared/interfaces/iglnQuery';
import { IGlnQueryResult } from './../shared/interfaces/iglnQueryResult';

@Injectable()
export class GlnService implements OnDestroy {

  private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
  private options: RequestOptions = new RequestOptions({ headers: this.headers, withCredentials: true});

  private baseUrl: string;
  private subscriptions: Subscription;

  constructor(
            private _http: Http,
            private _messageService: MessagesService,
            private _environmentService: EnvironmentService,
        ) {
            this.subscriptions = this._environmentService.setApiUrl().subscribe(api => this.baseUrl = api.apiUrl);
            }

  getPrimaryGln(): Observable<IGln> {
      return this._http.get(`${this.baseUrl}api/get-gln-primary`, this.options)
            .map((resp: Response) => <IGln>resp.json())
            .catch(err => this.catchError(err, this._messageService));
   }

  getGlnQueryResults(queryObject: IGlnQuery): Observable<IGlnQueryResult> {
      if (!this.baseUrl) {
          setTimeout(() => {
            return this._http.post(`${this.baseUrl}api/get-gln-query`, queryObject, this.options)
              .map((resp: Response) => <IGlnQueryResult>resp.json())
              .catch(err => this.catchError(err, this._messageService));
          }, 500);
      } else {
        return this._http.post(`${this.baseUrl}api/get-gln-query`, queryObject, this.options)
            .map((resp: Response) => <IGlnQueryResult>resp.json())
            .catch(this.handleError);
      }
   }

  getAllAssignedGlns(): Observable<IGln[]> {
      return this._http.get(`${this.baseUrl}api/get-glns`, this.options)
            .map((resp: Response) => <IGln[]>resp.json())
            .catch(err => this.catchError(err, this._messageService));
   }

  getGlnsBySearchTerm(searchTerm: string): Observable<IGln[]> {
      return this._http.get(`${this.baseUrl}api/gln-search/${searchTerm}`, this.options)
            .map((resp: Response) => <IGln[]>resp.json())
            .catch(err => this.catchError(err, this._messageService));
   }

  getGlnBySearchTermTakeAmount(takeAmount: number, searchTerm: string): Observable<IGln[]> {
      return this._http.get(`${this.baseUrl}api/gln-search/take/${takeAmount}/search/${searchTerm}`, this.options)
            .map((resp: Response) => <IGln[]>resp.json())
            .catch(err => this.catchError(err, this._messageService));
    }

  getNextUnassignedGln(): Observable<IGln> {
      return this._http.get(`${this.baseUrl}api/next-unassigned-gln`, this.options)
            .map((resp: Response) => <IGln>resp.json())
            .catch(err => this.catchError(err, this._messageService));
   }

  assignAddressGetNextUnassignedGln(addressId: number): Observable<IGln> {
      return this._http.get(`${this.baseUrl}api/change-address-get-next-unassigned-gln/${addressId}`, this.options)
            .map((resp: Response) => <IGln>resp.json())
            .catch(err => this.catchError(err, this._messageService));
   }

  getGlnById(id: number): Observable<IGln> {
      return this._http.get(`${this.baseUrl}api/gln-id/${id}`, this.options)
            .map((resp: Response) => <IGln>resp.json())
            .catch(err => this.catchError(err, this._messageService));
   }

  getGlnByGln(glnNumber: string): Observable<IGln> {
      return this._http.get(`${this.baseUrl}api/gln-by-gln/${glnNumber}`, this.options)
            .map((resp: Response) => <IGln>resp.json())
            .catch(err => this.catchError(err, this._messageService));
   }

  getChildrenByParentGln(parentGlnNumber: string): Observable<IGln[]> {
      return this._http.get(`${this.baseUrl}api/child-glns/${parentGlnNumber}`, this.options)
            .map((resp: Response) => <IGln[]>resp.json())
            .catch(err => this.catchError(err, this._messageService));
   }

  getChildrenByParentId(parentGlnId: number): Observable<IGln[]> {
      return this._http.get(`${this.baseUrl}api/child-glns/${parentGlnId}`, this.options)
            .map((resp: Response) => <IGln[]>resp.json())
            .catch(err => this.catchError(err, this._messageService));
   }

  getAssociatedGlnsByParentId(parentGlnId: number): Observable<IGln[]> {
      return this._http.get(`${this.baseUrl}api/gln-associations/${parentGlnId}`, this.options)
            .map((resp: Response) => <IGln[]>resp.json())
            .catch(err => this.catchError(err, this._messageService));
   }

  updateGln(gln: IGln): Observable<IGln> {
      return this._http.put(`${this.baseUrl}api/update-gln`, gln, this.options)
            .map((resp: Response) => <IGln>resp.json())
            .catch(err => this.catchError(err, this._messageService));
   }

  assignAdditionalContactToGln(glnId: number, additionalContactId: number): Observable<IGln> {
      return this._http.put(`${this.baseUrl}api/assign-additional-contact-to-gln/gln-id/${glnId}/additional-contact-id/${additionalContactId}`, glnId, this.options)
            .map((resp: Response) => <IGln>resp.json())
            .catch(err => this.catchError(err, this._messageService));
   }

  removeAdditionalContactFromGln(glnId: number, additionalContactId: number): Observable<IGln> {
      return this._http.put(`${this.baseUrl}api/remove-additional-contact-from-gln/gln-id/${glnId}/additional-contact-id/${additionalContactId}`, glnId, this.options)
            .map((resp: Response) => <IGln>resp.json())
            .catch(err => this.catchError(err, this._messageService));
   }

  assignPrimaryContactToGln(glnId: number, newPrimaryContact: IContact): Observable<IGln> {
      return this._http.put(`${this.baseUrl}api/assign-primary-contact-to-gln/${glnId}`, newPrimaryContact, this.options)
            .map((resp: Response) => <IGln>resp.json())
            .catch(err => this.catchError(err, this._messageService));
   }

  changeParentOnChildren(origninalParentGln: string, newParentGln: string): Observable<IGln> {
      return this._http.put(`${this.baseUrl}api/change-parent-on-children/orignal-parent-gln/${origninalParentGln}/new-parent-gln/${newParentGln}`, origninalParentGln, this.options)
            .map((resp: Response) => <IGln>resp.json())
            .catch(err => this.catchError(err, this._messageService));
   }

  changeParent(glnId: number, originalParentGln: string, newParentGln: string): Observable<IGln> {
      return this._http.put(`${this.baseUrl}api/change-parent/gln-id/${glnId}/original-parent-gln/${originalParentGln}/new-parent-gln/${newParentGln}`, glnId, this.options)
            .map((resp: Response) => <IGln>resp.json())
            .catch(err => this.catchError(err, this._messageService));
   }

  updateNewAssignedGln(gln: IGln): Observable<IGln> {
      return this._http.put(`${this.baseUrl}api/new-assigned-gln`, gln, this.options)
            .map((resp: Response) => <IGln>resp.json())
            .catch(err => this.catchError(err, this._messageService));
   }

  createGlnAssociation(glnIdOne: number, glnIdTwo: number): Observable<IGlnSummary[]> {
      return this._http.post(`${this.baseUrl}api/create-gln-association/${glnIdOne}/${glnIdTwo}`, glnIdOne, this.options)
            .map((resp: Response) => <IGlnSummary[]>resp.json())
            .catch(err => this.catchError(err, this._messageService));
   }

  removeGlnAssociation(glnIdOne: number, glnIdTwo: number): Observable<IGlnSummary[]> {
      return this._http.post(`${this.baseUrl}api/remove-gln-association/${glnIdOne}/${glnIdTwo}`, glnIdOne, this.options)
            .map((resp: Response) => <IGlnSummary[]>resp.json())
            .catch(err => this.catchError(err, this._messageService));
   }

    private handleError(error: any): Observable<any> {
        console.error(error);
        return Observable.throw(error.json || 'Server Error');
    }

   private catchError(err, messageService: MessagesService) {
        console.log('Handler error: ', err, this._messageService);
        let errMessage: string;
        if ( err instanceof Response ) {
            errMessage = `${err.status} - ${err.statusText || ''}`;
            messageService.error(errMessage);
        } else {
            errMessage = err.message ? err.message : err.toString();
            messageService.error(errMessage);
        }

        return Observable.throw(errMessage);
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
