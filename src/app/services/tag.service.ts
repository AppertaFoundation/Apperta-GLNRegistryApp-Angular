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

import { IGlnTagType } from '../shared/interfaces/igln-tag-type';
import { IGlnTag } from './../shared/interfaces/igln-tag';
import { IGlnTagTypeQuery } from './../shared/interfaces/igln-tag-type-query';
import { IGlnQueryResult } from './../shared/interfaces/iglnQueryResult';

import { MessagesService } from './messages.service';
import { EnvironmentService } from './environment.service';

@Injectable()
export class TagService {

  private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
  private options: RequestOptions = new RequestOptions({ headers: this.headers, withCredentials: true});
  private baseUrl: string;
  
  constructor(private _http: Http, private _messageService: MessagesService,
            private _environmentService: EnvironmentService) {
        // this.baseUrl = this._environmentService.apiUrl;
        this._environmentService.setApiUrl().subscribe(api => this.baseUrl = api.apiUrl);
      }

  
  getGlnTagTypesQueryResults(queryObject: IGlnTagTypeQuery): Observable<IGlnQueryResult> {
      if (!this.baseUrl) {
          setTimeout(() => {
            return this._http.post(`${this.baseUrl}api/get-gln-tag-type-query`, queryObject, this.options)
            .map((resp: Response) => <IGlnQueryResult>resp.json())
            .catch(err => this.catchError(err, this._messageService));
          }, 500);
      } else {
        return this._http.post(`${this.baseUrl}api/get-gln-tag-type-query`, queryObject, this.options)
            .map((resp: Response) => <IGlnQueryResult>resp.json())
            .catch(err => this.catchError(err, this._messageService));
      }
  }

  getAllTagTypes(): Observable<IGlnTagType[]> {
      return this._http.get(`${this.baseUrl}api/get/gln-tag-types`, this.options)
            .map((resp: Response) => <IGlnTagType[]>resp.json())
            .do(tagTypes => this.sortTagTypes(tagTypes))
            .catch(this.handleError);
   }

  getTagTypeById(id: number): Observable<IGlnTagType> {
      return this._http.get(`${this.baseUrl}api/get/gln-tag-types/id/?id=${id}`, this.options)
            .map((resp: Response) => <IGlnTagType>resp.json())
            .catch(this.handleError);
   }

  updateTagType(tagType: IGlnTagType): Observable<IGlnTagType> {
      return this._http.put(`${this.baseUrl}api/put/gln-tag-types/id`, tagType, this.options)
            .map((resp: Response) => <IGlnTagType>resp.json())
            .catch(this.handleError);
   }

  createTagType(tagType: IGlnTagType): Observable<IGlnTagType> {
      return this._http.post(`${this.baseUrl}api/post/gln-tag-types`, tagType, this.options)
            .map((resp: Response) => <IGlnTagType>resp.json())
            .catch(this.handleError);
   }

  getAllTags(): Observable<IGlnTag[]> {
      return this._http.get(`${this.baseUrl}api/get/gln-tags`, this.options)
            .map((resp: Response) => <IGlnTag[]>resp.json())
            .catch(this.handleError);
   }

  getTagsByGlnId(glnId: number): Observable<IGlnTag[]> {
      return this._http.get(`${this.baseUrl}api/get/gln-tags/gln-id/${glnId}`, this.options)
            .map((resp: Response) => <IGlnTag[]>resp.json())
            .catch(this.handleError);
   }

  getTagById(id: number): Observable<IGlnTag> {
      return this._http.get(`${this.baseUrl}api/get/gln-tags/id/${id}`, this.options)
            .map((resp: Response) => <IGlnTag>resp.json())
            .catch(this.handleError);
   }

  updateTag(tag: IGlnTag): Observable<IGlnTag> {
      return this._http.put(`${this.baseUrl}api/put/gln-tag-types/id`, tag, this.options)
            .map((resp: Response) => <IGlnTag>resp.json())
            .catch(this.handleError);
   }

  createTag(tagType: IGlnTag): Observable<IGlnTag> {
      return this._http.post(`${this.baseUrl}api/post/gln-tags`, tagType, this.options)
            .map((resp: Response) => <IGlnTag>resp.json())
            .catch(this.handleError);
   }

  deleteTag(tagId: number): Observable<IGlnTag> {
      return this._http.delete(`${this.baseUrl}api/delete/gln-tags/id/${tagId}`, this.options)
            .map((resp: Response) => <IGlnTag>resp.json())
            .catch(this.handleError);
   }

   private handleError(error: any): Observable<any> {
    console.error(error);
    return Observable.throw(error.json || 'Server Error');
}

    private catchError(err, messageService: MessagesService) {
        console.log('Handler error: ', err, this._messageService);
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

  private compareTags(a: IGlnTag, b: IGlnTag) {
    const descA = a.GlnTagType.Description.toUpperCase();
    const descB = b.GlnTagType.Description.toUpperCase();

    let comparison = 0;
    if (descA > descB) {
      comparison = 1;
    } else if (descA < descB) {
      comparison = -1;
    }
    return comparison;
  }

  private sortTagTypes(tagTypesToBeSorted: IGlnTagType[]) {
    console.log('before sortTagTypesFiltered: ', tagTypesToBeSorted);

    tagTypesToBeSorted.sort((leftSide, rightSide): number => {
        if (leftSide.Description.toUpperCase() < rightSide.Description.toUpperCase()) return -1;
        if (leftSide.Description.toUpperCase() > rightSide.Description.toUpperCase()) return 1;
        return 0;
    });

    console.log('sortTagTypesFiltered: ', tagTypesToBeSorted);
}

}
