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

import { IContact } from './../shared/interfaces/icontact';
import { IContactQuery } from './../shared/interfaces/iContactQuery';
import { IGlnQueryResult } from './../shared/interfaces/iglnQueryResult';

import { EnvironmentService } from './environment.service';

@Injectable()
export class PrimaryContactService {


private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
private options: RequestOptions = new RequestOptions({ headers: this.headers, withCredentials: true});
private baseUrl: string;

  constructor(private _http: Http,
    private _environmentService: EnvironmentService) {
        // this.baseUrl = this._environmentService.apiUrl;
        this._environmentService.setApiUrl().subscribe(api => this.baseUrl = api.apiUrl);
}

  getAllPrimaryContacts(): Observable<IContact[]> {
      return this._http.get(`${this.baseUrl}api/gln-primary-contacts`, this.options)
            .map((resp: Response) => <IContact[]>resp.json())
            .catch(this.handleError);
    }

  getAllPrimaryContactsExcludingId(idToExclude: number): Observable<IContact[]> {
      return this._http.get(`${this.baseUrl}api/gln-primary-contacts/exclude-primary-contact-id/${idToExclude}`, this.options)
            .map((resp: Response) => <IContact[]>resp.json())
            .catch(this.handleError);
    }

  getPrimaryContactById(id: number): Observable<IContact> {
      return this._http.get(`${this.baseUrl}api/gln-primary-contact-id/${id}`, this.options)
            .map((resp: Response) => <IContact>resp.json())
            .catch(this.handleError);
    }

  getAllPrimaryContactsBySearchTerm(searchTerm: string): Observable<IContact[]> {
      return this._http.get(`${this.baseUrl}api/gln-primary-contacts-search/${searchTerm}`, this.options)
            .map((resp: Response) => <IContact[]>resp.json())
            .catch(this.handleError);
    }

  getPrimaryContactQueryResults(queryObject: IContactQuery): Observable<IGlnQueryResult> {
      if (!this.baseUrl) {
          setTimeout(() => {
              return this._http.post(`${this.baseUrl}api/gln-primary-contacts-query`, queryObject, this.options)
                .map((resp: Response) => <IGlnQueryResult>resp.json())
                .catch(this.handleError);
          }, 500);
      } else {
        return this._http.post(`${this.baseUrl}api/gln-primary-contacts-query`, queryObject, this.options)
            .map((resp: Response) => <IGlnQueryResult>resp.json())
            .catch(this.handleError);
      }
   }

  addPrimaryContact(contact: IContact): Observable<IContact> {
      return this._http.post(`${this.baseUrl}api/gln-primary-contacts/add-new-primary-contact`, contact, this.options)
            .map((resp: Response) => <IContact>resp.json())
            .catch(this.handleError);
   }

  updatePrimaryContact(contactToUpdate: IContact): Observable<IContact> {
      return this._http.put(`${this.baseUrl}api/gln-update-primary-contact`, contactToUpdate, this.options)
            .map((resp: Response) => <IContact>resp.json())
            .catch(this.handleError);
   }

  deactivatePrimaryContact(toDeactivateId: number, toReplaceId: number): Observable<IContact> {
      return this._http.put(`${this.baseUrl}api/gln-primary-contacts/to-deactivate-id/
            ${toDeactivateId}/to-replace-id/${toReplaceId}`, toDeactivateId, this.options)
            .map((resp: Response) => <IContact>resp.json())
            .catch(this.handleError);
   }

    private handleError(error: any): Observable<any> {
        console.error(error);
        return Observable.throw(error.json || 'Server Error');
    }

}
