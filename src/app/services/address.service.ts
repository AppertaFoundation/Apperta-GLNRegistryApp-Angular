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

import { IAddress } from './../shared/interfaces/iaddress';
import { IAddressQuery } from './../shared/interfaces/iaddressQuery';
import { IGlnQueryResult } from './../shared/interfaces/iglnQueryResult';

import { EnvironmentService } from './environment.service';

@Injectable()
export class AddressService {

  private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
  private options: RequestOptions = new RequestOptions({ headers: this.headers, withCredentials: true});
  private baseUrl: string;

  constructor(private _http: Http,
            private _environmentService: EnvironmentService) {
        // this.baseUrl = this._environmentService.apiUrl;
        this._environmentService.setApiUrl().subscribe(api => this.baseUrl = api.apiUrl);
    }

  getAddressQueryResults(queryObject: IAddressQuery): Observable<IGlnQueryResult> {
      if (!this.baseUrl) {
          setTimeout(() => {
              console.log('waited half sec');
                  return this._http.post(`${this.baseUrl}api/get-address-query`, queryObject, this.options)
                    .map((resp: Response) => <IGlnQueryResult>resp.json())
                    .catch(this.handleError);
          }, 500);
      } else {
        return this._http.post(`${this.baseUrl}api/get-address-query`, queryObject, this.options)
            .map((resp: Response) => <IGlnQueryResult>resp.json())
            .catch(this.handleError);
      }
   }

  getAddressBySearchTerm(pageNumber: number, pageSize: number, searchTerm: string): Observable<IAddress[]> {
      return this._http.get(`${this.baseUrl}api/gln-address-page/page-number/
            ${pageNumber}/page-size/${pageSize}/search-term/${searchTerm}`, this.options)
            .map((resp: Response) => <IAddress[]>resp.json())
            .catch(this.handleError);
   }

  getAddressById(id: number): Observable<IAddress> {
      return this._http.get(`${this.baseUrl}api/gln-address/${id}`, this.options)
            .map((resp: Response) => <IAddress>resp.json())
            .catch(this.handleError);
    }

  getAddressByGln(gln: string): Observable<IAddress> {
      return this._http.get(`${this.baseUrl}api/gln-address/${gln}`, this.options)
            .map((resp: Response) => <IAddress>resp.json())
            .catch(this.handleError);
    }

  deactivateAddress(toDeactivateId: number, toReplaceId: number): Observable<IAddress> {
      return this._http.put(`${this.baseUrl}api/gln-deactivate-address/to-deactivate-id/
                ${toDeactivateId}/to-replace-id/${toReplaceId}`, toDeactivateId, this.options)
            .map((resp: Response) => <IAddress>resp.json())
            .catch(this.handleError);
   }

  updateAddress(address: IAddress): Observable<IAddress> {
      return this._http.put(`${this.baseUrl}api/gln-update-address`, address, this.options)
            .map((resp: Response) => <IAddress>resp.json())
            .catch(this.handleError);
   }

  addAddress(address: IAddress): Observable<IAddress> {
      return this._http.post(`${this.baseUrl}api/gln-add-address`, address, this.options)
            .map((resp: Response) => <IAddress>resp.json())
            .catch(this.handleError);
   }

    private handleError(error: any): Observable<any> {
        console.error(error);
        return Observable.throw(error.json || 'Server Error');
    }

}
