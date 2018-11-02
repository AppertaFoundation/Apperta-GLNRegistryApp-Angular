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
// Services
import { MessagesService } from './messages.service';
import { EnvironmentService } from './environment.service';

import { environment } from './../../environments/environment';
import { IUser } from './../shared/interfaces/iuser';

@Injectable()
export class AuthenticationService {

  private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
  private options: RequestOptions = new RequestOptions({ headers: this.headers, withCredentials: true});
  private baseUrl: string;

  constructor(private _http: Http,
    private _messageService: MessagesService,
    private _environmentService: EnvironmentService) {
        // this.baseUrl = this._environmentService.apiUrl;
        this._environmentService.setApiUrl().subscribe(api => this.baseUrl = api.apiUrl);
}

  getCurrentUser(): Observable<IUser> {
      if (!this.baseUrl) {
          setTimeout(() => {
              return this._http.get(`${this.baseUrl}api/Authentication`, this.options)
                    .map((resp: Response) => <IUser>resp.json())
                    .catch(err => this.catchError(err, this._messageService));
          }, 500);
      } else {
        return this._http.get(`${this.baseUrl}api/Authentication`, this.options)
            .map((resp: Response) => <IUser>resp.json())
            .catch(err => this.catchError(err, this._messageService));
      }
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
