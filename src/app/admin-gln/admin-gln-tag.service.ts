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

import { IGlnTag } from '../shared/interfaces/igln-tag';
import { GlnTag } from './../shared/types/gln-tag';
import { IGlnTagType } from './../shared/interfaces/igln-tag-type';
import { GlnTagType } from './../shared/types/gln-tag-type';
import { GlnQueryResult } from './../shared/types/gln-query-result';
import { IGlnQueryResult } from './../shared/interfaces/iglnQueryResult';
import { GlnTagTypeQuery } from './../shared/types/gln-tag-type-query';

import { IprService } from './../services/ipr.service';
import { TagService } from './../services/tag.service';
import { MessagesService } from './../services/messages.service';
import { IGlnTagTypeQuery } from '../shared/interfaces/igln-tag-type-query';

@Injectable()
export class AdminGlnTagService {

  private editSubject = new BehaviorSubject<boolean>(false);
  editMode$: Observable<boolean> = this.editSubject.asObservable();

  private tagSubject = new BehaviorSubject<IGlnTag>(new GlnTag());
  tag$: Observable<IGlnTag> = this.tagSubject.asObservable();

  private selectedTagSubject = new BehaviorSubject<IGlnTag>(new GlnTag());
  selectedTag$: Observable<IGlnTag> = this.selectedTagSubject.asObservable();

  private tagTypeSubject = new BehaviorSubject<IGlnTagType>(new GlnTagType());
  tagType$: Observable<IGlnTagType> = this.tagTypeSubject.asObservable();

  private selectedTagTypeSubject = new BehaviorSubject<IGlnTagType>(new GlnTagType());
  selectedTagType$: Observable<IGlnTagType> = this.selectedTagTypeSubject.asObservable();
  
  private tagTypeQuerySubject = new BehaviorSubject<IGlnTagTypeQuery>(new GlnTagTypeQuery());
  tagTypeQuery$ = this.tagTypeQuerySubject.asObservable();

  // Address query results sent back from API
  private tagQueryResultsSubject = new BehaviorSubject<IGlnQueryResult>(new GlnQueryResult());
  tagQueryResults$ = this.tagQueryResultsSubject.asObservable();

  constructor(private _http: Http, private _messagesService: MessagesService, private _tagService: TagService) { }

  ngOnInit(): void {

  }
  createMode() {
    this.editSubject.next(false);
  }

  editMode() {
    this.editSubject.next(true);
  }

  setNextTag(tag: IGlnTag) {
    this.tagSubject.next(tag);
  }

  clearTag() {
    this.tagSubject.next(new GlnTag());
  }

  clearTagType() {
    this.selectedTagTypeSubject.next(new GlnTagType());
  }
  
  getNextTag(id: number): Observable<IGlnTag> {
    return this._tagService.getTagById(id)
          .do(() => this.editSubject.next(true))
          .do(tag => this.selectedTagSubject.next(tag))
          .publishLast().refCount()
          .catch(this.handlerError);
 }
  
  getNextTagType(id: number): Observable<IGlnTagType> {
    return this._tagService.getTagTypeById(id)
          .do(() => this.editSubject.next(true))
          .do(tagType => this.selectedTagTypeSubject.next(tagType))
          .publishLast().refCount()
          .catch(this.handlerError);
 }

 
 repeatLastTagTypeQuery() {
  this.tagTypeQuery$.take(1)
      .switchMap(query => this.getTagQueryResult(query))
      .subscribe(query => {});
}
 
 getTagQueryResult(queryObj: IGlnTagTypeQuery) {
  this.tagTypeQuerySubject.next(queryObj);
    return this._tagService.getGlnTagTypesQueryResults(queryObj)
                    .do(queryResult => this.tagQueryResultsSubject.next(queryResult))
                    .publishLast().refCount()
                    .catch(this.handlerError);
}

updateTag(tag: IGlnTag): Observable<IGlnTag> {
  return this. _tagService.updateTag(tag)
    .do(updatedTag => this.tagSubject.next(updatedTag))
    .publishLast().refCount()
    .catch(this.handlerError);
}

updateTagType(tagType: IGlnTagType): Observable<IGlnTagType> {
  return this. _tagService.updateTagType(tagType)
    .do(updatedTagType => this.tagTypeSubject.next(updatedTagType))
    .publishLast().refCount()
    .catch(this.handlerError);
}  

createTagType(newTagType: IGlnTagType): Observable<IGlnTagType> {
  return this._tagService.createTagType(newTagType)
      .do(tagType => this.tagTypeSubject.next(tagType))
      .do(tagType => this.selectedTagTypeSubject.next(tagType))
      .publishLast().refCount()
      .catch(this.handlerError);
}
  handlerError(err) {
      let errMessage: string;

      if ( err instanceof Response ) {

          errMessage = `${err.status} - ${err.statusText || ''},  ${err.json()}`;
          this._messagesService.error(errMessage);

      } else {
          errMessage = err.message ? err.message : err.toString();
          this._messagesService.error(errMessage);
      }

      return Observable.throw(errMessage);
  }

}
