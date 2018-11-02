//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { IGlnTagType } from './../shared/interfaces/igln-tag-type';
import { SearchGlnService } from './../shared/search-gln/search-gln.service';
import { EditGlnService } from './../edit-gln/edit-gln.service';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Injectable, OnInit } from '@angular/core';

import { IGlnTag } from './../shared/interfaces/igln-tag';
import { GlnTag } from './../shared/types/gln-tag';
import { IGln } from '../shared/interfaces/igln';
import { Gln } from '../shared/types/gln';

import { MessagesService } from './../services/messages.service';
import { GlnService } from '../services/gln.service';
import { TagService } from '../services/tag.service';

@Injectable()
export class AssociatedTagsService implements OnInit {

  private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
  private options: RequestOptions = new RequestOptions({ headers: this.headers, withCredentials: true});

  // Selected GLN for editing associations
  private glnSubject = new BehaviorSubject<IGln>(new Gln());
  gln$ = this.glnSubject.asObservable();
  glnId: number;

  // Selected GLN for editing associations
  private glnTagSubject = new BehaviorSubject<IGlnTag>(new GlnTag());
  tag$ = this.glnTagSubject.asObservable();
  tagId: number;

  // GLN selected to be associated with GLN
  private selectedTagToAssociateSubject = new BehaviorSubject<IGlnTag>(new GlnTag());
  selectedTagToAssociate$ = this.selectedTagToAssociateSubject.asObservable();

  // GLNs currently associated with GLN
  private associatedTagsSubject = new BehaviorSubject<IGlnTag[]>([]);
  associatedTags$ = this.associatedTagsSubject.asObservable();

  // GLNs currently associated with GLN
  private tagTypesSubject = new BehaviorSubject<IGlnTagType[]>([]);
  tagTypes$ = this.tagTypesSubject.asObservable();

  constructor(private _http: Http, 
              private _messagesService: MessagesService, 
              private _tagService: TagService,
              private _glnEditService: EditGlnService
              ) { }

  ngOnInit() {
    this.gln$ = this._glnEditService.gln$;
    this.getGlnId();
  }

  getTagsAssociatedWithGln() {
    this.getGlnId();
    return this._tagService.getTagsByGlnId(this.glnId)
                    .do(associatedTags => this.associatedTagsSubject.next(associatedTags))
                    .publishLast().refCount();
  }

  assignTagToGln(tag: IGlnTag) {
    tag.GlnId = this.glnId;
    return this._tagService.createTag(tag).subscribe(t => {
        this.getTagsAssociatedWithGln();
      },
      error => {
        this.handlerError(error);
      })
  }

  removeTagFromGln(tag: IGlnTag) {
    return this._tagService.updateTag(tag).subscribe(t => {
        this.getTagsAssociatedWithGln().subscribe();
      },
      error => {
        this.handlerError(error);
    });
  }

  createTag(tag: IGlnTag) {
    return this._tagService.createTag(tag).subscribe(t => {
        this.getTagsAssociatedWithGln().subscribe();
      },
      error => {
        this.handlerError(error);
    });
  }

  deleteTag(tagId: number) {
    return this._tagService.deleteTag(tagId).subscribe(t => {
        this.getTagsAssociatedWithGln().subscribe();
      },
      error => {
        this.handlerError(error);
    });
  }

  getGlnId() {
    this.gln$.subscribe(lastGln => {
      this.glnId = lastGln.Id;
      console.log('glnid: ', this.glnId);
    });
    this.gln$.last();
  }

  getTagTypes() {
    return this._tagService.getAllTagTypes()
                    .do(tagTypes => this.tagTypesSubject.next(tagTypes))
                    .publishLast().refCount();
  }

  glnToAssign(gln: IGln) {
    this.glnSubject.next(gln);
    this.gln$.publishLast().refCount();
  }

  sortTags(tags: IGlnTag[]) {
    return tags.sort((leftSide, rightSide): number => {
        if (leftSide.GlnTagType.Description < rightSide.GlnTagType.Description) return -1;
        if (leftSide.GlnTagType.Description > rightSide.GlnTagType.Description) return 1;
        return 0;
    });
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
