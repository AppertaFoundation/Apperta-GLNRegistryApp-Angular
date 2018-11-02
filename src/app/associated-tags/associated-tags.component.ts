//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { element } from 'protractor';
import { Observable, Subscription } from 'rxjs/Rx';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { IGlnTagType } from './../shared/interfaces/igln-tag-type';
import { IGlnTag } from './../shared/interfaces/igln-tag';
import { IGln } from './../shared/interfaces/igln';

import { MessagesService } from './../services/messages.service';
import { LoadingService } from './../services/loading.service';
import { AssociatedTagsService } from './associated-tags.service';
import { SearchGlnService } from './../shared/search-gln/search-gln.service';
import { EditGlnService } from './../edit-gln/edit-gln.service';
import { TagService } from '../services/tag.service';
import { GlnTag } from '../shared/types/gln-tag';

@Component({
  selector: 'app-associated-tags',
  templateUrl: './associated-tags.component.html',
  styleUrls: ['./associated-tags.component.css']
})
export class AssociatedTagsComponent implements OnInit {
  
  gln$: Observable<IGln>;
  glnId: number;
  glnNumber: string;
  associatedTags$: Observable<IGlnTag[]>;
  tagTypes$: Observable<IGlnTagType[]>;
  loading$: Observable<boolean>;
  answer$: Observable<boolean>;
  
  tagTypes: IGlnTagType[] = new Array;
  tagTypesFiltered: IGlnTagType[] = new Array;
  tags: IGlnTag[] = new Array;
  tagIds: number[] = new Array;
  tagTypeId: number;
  
  buttonTitle = 'Associate Tag';
  
  searchMode = false;
  
  constructor(private _glnEditService: EditGlnService,
    private _associatedTagService: AssociatedTagsService,
    private _searchGlnService: SearchGlnService,
    private _loadingService: LoadingService,
    public _messagesService: MessagesService,
    private _location: Location) { }
    
    ngOnInit(): void {
      this.gln$ = this._glnEditService.gln$;
      this._associatedTagService.gln$ = this.gln$;
      this.loading$ = this._loadingService.loading$;
      this.answer$ = this._messagesService.answer$;

      this.associatedTags$ = this._associatedTagService.associatedTags$;
      this.tagTypes$ = this._associatedTagService.tagTypes$;

      this._associatedTagService.getTagsAssociatedWithGln().subscribe(t => {
        this.tags = t;
        this.sortTags();
        this.createTagIds();

        this._associatedTagService.getTagTypes().subscribe(tt => {
          this.tagTypes = tt;
          this.filterTagTypes();
        });
      });

      this.associatedTags$.subscribe(t => {
        this.tags = t
        this.createTagIds()
        this.filterTagTypes();
        this.sortTags();
      });

      this.gln$.subscribe(g => {
        this.glnId = g.Id;
        this.glnNumber = g.OwnGln;
      });
    }

    private createTagIds() {
      this.tagIds = new Array;

      this.tags.forEach(t => {
        this.tagIds.push(t.GlnTagTypeId);
      });
    }

    private filterTagTypes() {
      let tagIds = this.tagIds;
      let filteredTagTypes = this.tagTypes.filter(function(tag){
        return tagIds.indexOf(tag.GlnTagTypeId) === -1;
      });//filter

      this.tagTypesFiltered = filteredTagTypes;
      this.sortTagTypesFiltered();
    }

    associateTag() {
      let newTag = new GlnTag();
      newTag.Active = true;
      newTag.GlnId = this.glnId;
      newTag.GlnTagTypeId = this.tagTypeId;
      newTag.TypeKey = this.glnNumber; 
      
      this._associatedTagService.createTag(newTag);
      console.log(newTag);
    }

    private sortTagTypesFiltered() {
      console.log('before sortTagTypesFiltered: ',this.tagTypesFiltered);

      this.tagTypesFiltered.sort((leftSide, rightSide): number => {
          if (leftSide.Description.toUpperCase() < rightSide.Description.toUpperCase()) return -1;
          if (leftSide.Description.toUpperCase() > rightSide.Description.toUpperCase()) return 1;
          return 0;
      });

      console.log('sortTagTypesFiltered: ',this.tagTypesFiltered);
  }

    private sortTags() {

      console.log('before tags: ',this.tags);
      let sortedTags = new Array();
      sortedTags = this.tags.sort(this.compareTags);

      this.tags = sortedTags;

      console.log('tags: ',this.tags);
      console.log('sorted tags: ',sortedTags);
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

    deleteAssociatedTag(tagId: number) {
      this._associatedTagService.deleteTag(tagId);
    }

    goBack() {
      this._location.back();
    }

  }
