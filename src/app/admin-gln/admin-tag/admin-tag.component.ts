//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { IGlnTag } from '../../shared/interfaces/igln-tag';
import { IGlnTagType } from '../../shared/interfaces/igln-tag-type';
import { GlnQueryResult } from './../../shared/types/gln-query-result';
import { IGlnTagTypeQuery } from './../../shared/interfaces/igln-tag-type-query';

import { MessagesService } from './../../services/messages.service';
import { StartUpService } from './../../services/start-up.service';
import { LoadingService } from './../../services/loading.service';
import { AdminGlnTagService } from './../admin-gln-tag.service';

@Component({
  selector: 'app-admin-tag',
  templateUrl: './admin-tag.component.html',
  styleUrls: ['./admin-tag.component.css']
})
export class AdminTagComponent implements OnInit, OnDestroy {

  selectedTagTitle = 'Selected Tag Type';
  
  tagQueryResult$: Observable<GlnQueryResult>;

  selectedTagType$: Observable<IGlnTagType>;
  tagTypePage$: Observable<IGlnTag[]>;
  tagType$: Observable<IGlnTag>;
  tagTypeQueryResult$: Observable<GlnQueryResult>;

  loading$: Observable<boolean>;

  tagQuery: IGlnTagTypeQuery;
  currentPage = 1;
  itemsOnCurrentPage: number;

  searchForm: FormGroup;
  queryForm: FormGroup;

  activeTitle = 'Active';
  deactivatedTitle = 'In-Active';

  constructor(private _adminGlnTagService: AdminGlnTagService,
              private _loadingService: LoadingService,
              private _formBuilder: FormBuilder,
              private _messageService: MessagesService) { }

  ngOnInit() {
    this.selectedTagType$ = this._adminGlnTagService.selectedTagType$;
    this.tagQueryResult$ = this._adminGlnTagService.tagQueryResults$;
    this.loading$ = this._loadingService.loading$;

    this.currentPage = 1;
    this.tagQuery = new IGlnTagTypeQuery();

    this.searchForm = this.initSearchForm();
    this.queryForm = this.initQueryForm();

    let searchValueChange$ = this.searchForm.get('searchTerm').valueChanges;

    searchValueChange$.debounceTime(1000).distinctUntilChanged()
                      .do(loading => this._loadingService.loading())
                      .do(queryUpdate => this.createQueryFromForm())
                      .do(setPageToOne => this.setPageToOne())
                      .switchMap(() => this._adminGlnTagService.getTagQueryResult(this.tagQuery))
                      .subscribe(queryResult => {
                                this._loadingService.finishLoading();
                                this.itemsOnCurrentPage = queryResult.Items.length;
                                },  error => {
                                this._loadingService.finishLoading();
                                this._messageService.error('Unable to load address search results. ' + error);
                      });

    let queryValueChange$ = this.queryForm.valueChanges;

    queryValueChange$.debounceTime(1000).distinctUntilChanged()
                      .do(loading => this._loadingService.loading())
                      .do(queryUpdate => this.createQueryFromForm())
                      .switchMap(() => this._adminGlnTagService.getTagQueryResult(this.tagQuery))
                      .subscribe(queryResult => {
                        this._loadingService.finishLoading();
                        this.itemsOnCurrentPage = queryResult.Items.length;
                      },
                    error => {
                      this._loadingService.finishLoading();
                      this._messageService.error('Unable to load address search results. ' + error);
                    });

    this.setPageToOne();
  }

  initQueryForm(): FormGroup {
    return this._formBuilder.group({
      'active': [true],
      'page': [1],
      'sortBy': ['description'], // Sort by this as first line of address is Plymouth Hospital Trusts
      'isSortingAscending': [true],
      'pageSize': [5],
      'currentPage': [1],
      'level': [0]
    });
  }

  initSearchForm(): FormGroup {
    return this._formBuilder.group({
      'searchTerm': ['']
    });
  }

  createQueryFromForm() {

    this.tagQuery.Active = this.queryForm.get('active').value;
    this.tagQuery.Page = this.queryForm.get('page').value;
    this.tagQuery.SortBy = this.queryForm.get('sortBy').value;
    this.tagQuery.IsSortAscending = this.queryForm.get('isSortingAscending').value;
    this.tagQuery.PageSize = this.queryForm.get('pageSize').value;
    this.tagQuery.Page = this.queryForm.get('currentPage').value;

    this.tagQuery.SearchTerm = this.searchForm.get('searchTerm').value;
  }

  private setPageToOne() {
    this.currentPage = 1;
      this.queryForm.patchValue({
        'currentPage': this.currentPage
      });
  }

  previousPage() {
    if (this.currentPage - 1 >= 1) {
      this.currentPage -= 1;
      this.queryForm.patchValue({
        'currentPage': this.currentPage
      });
    }
  }

  nextPage() {
    this.currentPage += 1;
    this.queryForm.patchValue({
        'currentPage': this.currentPage
      });
  }

  toggleActive() {
    this.queryForm.patchValue({
        'active': !this.queryForm.get('active').value
      });
  }

  selectTagType(tagTypeId: number) {
    this._adminGlnTagService.getNextTagType(tagTypeId)
      .do(loading => this._loadingService.loading())
      .subscribe(success => {
        this._loadingService.finishLoading();
        window.scrollTo(0, 0 );
      },
    error => {
      this._loadingService.finishLoading();
      this._messageService.error('Unable to retrieve selected address. ' + error);
    });
  }

  // changes active values for filters
  onValueChange(event: any, formControlName: string) {
    this.queryForm.get(formControlName).patchValue(event);
  }

  ngOnDestroy() {
    this._adminGlnTagService.clearTagType();

  }

}
