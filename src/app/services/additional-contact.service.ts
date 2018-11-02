//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAdditionalContact } from './../shared/interfaces/iadditional-contact';
import { IAdditionalContactQuery } from './../shared/interfaces/iadditional-contact-query';
import { IContact } from './../shared/interfaces/icontact';
import { IContactQuery } from './../shared/interfaces/iContactQuery';
import { IGlnQueryResult } from './../shared/interfaces/iglnQueryResult';

import { MessagesService } from './messages.service';
import { EnvironmentService } from './environment.service';

@Injectable()
export class AdditionalContactService {

private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
private options: RequestOptions = new RequestOptions({ headers: this.headers, withCredentials: true});

private baseUrl: string;

  constructor(private _http: Http,
            private _messageService: MessagesService,
            private _environmentService: EnvironmentService) {
    // this.baseUrl = this._environmentService.apiUrl;
    this._environmentService.setApiUrl().subscribe(api => this.baseUrl = api.apiUrl);
  }

  getAllAdditionalContacts(): Observable<IAdditionalContact[]> {
      return this._http.get(`${this.baseUrl}api/gln-additional-contacts`, this.options)
            .map((resp: Response) => <IAdditionalContact[]>resp.json())
            .catch(err => this.catchError(err, this._messageService));
    }

  getAdditionalContactById(id: number): Observable<IAdditionalContact> {
      return this._http.get(`${this.baseUrl}api/gln-additional-contacts/${id}`, this.options)
            .map((resp: Response) => <IAdditionalContact>resp.json())
            .catch(err => this.catchError(err, this._messageService));
    }

  getAdditionalContactsBySearchTerm(searchTerm: string): Observable<IAdditionalContact[]> {
      return this._http.get(`${this.baseUrl}api/gln-additional-contacts/${searchTerm}`, this.options)
            .map((resp: Response) => <IAdditionalContact[]>resp.json())
            .catch(err => this.catchError(err, this._messageService));
    }

  getAdditionalContactsTakeBySearchTerm(searchTerm: string, take: number): Observable<IAdditionalContact[]> {
      return this._http.get(`${this.baseUrl}api/gln-additional-contacts/take/${take}/search/${searchTerm}`, this.options)
            .map((resp: Response) => <IAdditionalContact[]>resp.json())
            .catch(err => this.catchError(err, this._messageService));
    }

  getAdditionalContactQueryResults(queryObject: IAdditionalContactQuery): Observable<IGlnQueryResult> {
    if (!this.baseUrl) {
        setTimeout(() => {
            return this._http.post(`${this.baseUrl}api/gln-additional-contacts-query`, queryObject, this.options)
                  .map((resp: Response) => <IGlnQueryResult>resp.json())
                  .catch(err => this.catchError(err, this._messageService));
          }, 500);
    } else {
        return this._http.post(`${this.baseUrl}api/gln-additional-contacts-query`, queryObject, this.options)
            .map((resp: Response) => <IGlnQueryResult>resp.json())
            .catch(err => this.catchError(err, this._messageService));
    }
   }

  addAdditionalContact(additionalContact: IAdditionalContact): Observable<IAdditionalContact> {
      return this._http.post(`${this.baseUrl}api/gln-additional-contacts/add-new-additional-contact/`, additionalContact, this.options)
            .map((resp: Response) => <IAdditionalContact>resp.json())
            .catch(err => this.catchError(err, this._messageService));
   }

  updateAdditionalContact(additionalContactToUpdate: IAdditionalContact): Observable<IAdditionalContact> {
      return this._http.put(`${this.baseUrl}api/gln-update-additional-contact`, additionalContactToUpdate, this.options)
            .map((resp: Response) => <IAdditionalContact>resp.json())
            .catch(err => this.catchError(err, this._messageService));
   }

  deactivateAdditionalContact(toDeactivateId: number, toReplaceId: number): Observable<IAdditionalContact> {
      return this._http.put(`${this.baseUrl}api/gln-additional-contacts/to-deactivate-id/${toDeactivateId}/to-replace-id/${toReplaceId}`, toDeactivateId, this.options)
            .map((resp: Response) => <IAdditionalContact>resp.json())
            .catch(err => this.catchError(err, this._messageService));
   }

   private catchError(err, messageService: MessagesService) {
        let errMessage: string;
        if ( err instanceof Response ) {
            errMessage = `${err.status} - ${err.statusText || ''} -  ${err.json()}`;
            messageService.error(errMessage);
        } else {
            errMessage = err.message ? err.message : err.toString();
            messageService.error(errMessage);
        }

        return Observable.throw(errMessage);
    }

}
