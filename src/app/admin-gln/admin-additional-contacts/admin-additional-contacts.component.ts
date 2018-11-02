//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { LoadingService } from './../../services/loading.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { GlnQueryResult } from './../../shared/types/gln-query-result';

import { AdditionalContactQuery } from './../../shared/types/additional-contact-query';
import { AdditionalContactService } from './../../services/additional-contact.service';
import { IAdditionalContactQuery } from './../../shared/interfaces/iadditional-contact-query';
import { IAdditionalContact } from './../../shared/interfaces/iadditional-contact';

import { MessagesService } from './../../services/messages.service';
import { AdminGlnAdditionalContactService } from './../admin-gln-additional-contact.service';


@Component({
  selector: 'app-admin-additional-contacts',
  templateUrl: './admin-additional-contacts.component.html',
  styleUrls: ['./admin-additional-contacts.component.css']
})

export class AdminAdditionalContactsComponent implements OnInit, OnDestroy {
  selectedAdditionalContactTitle = 'Selected Additional Contact';

  selectedAdditionalContact$: Observable<IAdditionalContact>;
  additionalContactQueryResult$: Observable<GlnQueryResult>;
  loading$: Observable<boolean>;

  additionalContactQuery: IAdditionalContactQuery;
  currentPage = 1;
  itemsOnCurrentPage: number;

  searchForm: FormGroup;
  queryForm: FormGroup;

  activeTitle = 'Subscribed';
  deactivatedTitle = 'Un-Subscribed';

  constructor(private _additionalContactService: AdminGlnAdditionalContactService,
            private _formBuilder: FormBuilder,
            private _loadingService: LoadingService,
            private _messageService: MessagesService) {

  }
  ngOnInit() {
    this.selectedAdditionalContact$ = this._additionalContactService.selectedAdditionalContact$;
    this.additionalContactQueryResult$ = this._additionalContactService.additionalContactQueryResults$;
    this.loading$ = this._loadingService.loading$;

    this.currentPage = 1;
    this.additionalContactQuery = new AdditionalContactQuery();

    this.searchForm = this.initSearchForm();
    this.queryForm = this.initQueryForm();

    let searchValueChange$ = this.searchForm.get('searchTerm').valueChanges;

    searchValueChange$.debounceTime(1000).distinctUntilChanged()
                      .do(loading => this._loadingService.loading())
                      .do(queryUpdate => this.createQueryFromForm())
                      .do(setPageToOne => this.setPageToOne())
                      .switchMap(() => this._additionalContactService.getAdditionalContactQueryResult(this.additionalContactQuery))
                      .subscribe(queryResult => {
                                this._loadingService.finishLoading();
                                this.itemsOnCurrentPage = queryResult.Items.length;
                            },
                            error => {
                              this._loadingService.finishLoading();
                              this._messageService.error('Unable to load additional contact search results. ' + error);
                            });

    let queryValueChange$ = this.queryForm.valueChanges;

    queryValueChange$.debounceTime(1000).distinctUntilChanged()
                      .do(loading => this._loadingService.loading())
                      .do(queryUpdate => this.createQueryFromForm())
                      .switchMap(() => this._additionalContactService.getAdditionalContactQueryResult(this.additionalContactQuery))
                      .subscribe(queryResult => {
                        this._loadingService.finishLoading();
                        this.itemsOnCurrentPage = queryResult.Items.length;
                      },
                    error => {
                        this._loadingService.finishLoading();
                        this._messageService.error('Unable to load additional contact search results. ' + error);
                    });

    this.setPageToOne();
  }

  initQueryForm(): FormGroup {
    return this._formBuilder.group({
      'active': [true],
      'page': [1],
      'sortBy': ['name'], // Sort by name
      'isSortingAscending': [true],
      'pageSize': [5],
      'currentPage': [1],
    });
  }

  initSearchForm(): FormGroup {
    return this._formBuilder.group({
      'searchTerm': ['']
    });
  }

  createQueryFromForm() {

    this.additionalContactQuery.Active = this.queryForm.get('active').value;
    this.additionalContactQuery.Page = this.queryForm.get('page').value;
    this.additionalContactQuery.SortBy = this.queryForm.get('sortBy').value;
    this.additionalContactQuery.IsSortAscending = this.queryForm.get('isSortingAscending').value;
    this.additionalContactQuery.PageSize = this.queryForm.get('pageSize').value;
    this.additionalContactQuery.Page = this.queryForm.get('currentPage').value;

    this.additionalContactQuery.SearchTerm = this.searchForm.get('searchTerm').value;
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

  selectAdditionalContact(additionalContactId: number) {
    this._additionalContactService.getNextAdditionalContact(additionalContactId)
            .do(loading => this._loadingService.loading())
            .subscribe(success => {
              this._loadingService.finishLoading();
              window.scrollTo(0, 0 );
            }, error => {
              this._messageService.error('Unable to retrieve additional contact. ' + error);
            });
  }

  // changes active values for filters
  onValueChange(event: any, formControlName: string) {
    this.queryForm.get(formControlName).patchValue(event);
  }

  ngOnDestroy() {
    this._additionalContactService.clearAdditionalContact();
  }

}
