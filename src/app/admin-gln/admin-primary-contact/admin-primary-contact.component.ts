//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { IContactQuery } from './../../shared/interfaces/iContactQuery';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';

import { IContact } from './../../shared/interfaces/icontact';

import { ContactQuery } from './../../shared/types/contact-query';
import { GlnQueryResult } from './../../shared/types/gln-query-result';

import { AdminGlnPrimaryContactService } from './../../admin-gln/admin-gln-primary-contact.service';
import { MessagesService } from './../../services/messages.service';
import { LoadingService } from './../../services/loading.service';

@Component({
  selector: 'app-admin-primary-contact',
  templateUrl: './admin-primary-contact.component.html',
  styleUrls: ['./admin-primary-contact.component.css']
})
export class AdminPrimaryContactComponent implements OnInit {

  primaryContacts$: Observable<IContact[]>;
  primaryContact$: Observable<IContact>;
  primaryContactQueryResult$: Observable<GlnQueryResult>;
  loading$: Observable<boolean>;
  editMode$: Observable<boolean>;

  primaryContactQuery: IContactQuery;
  currentPage = 1;
  itemsOnCurrentPage: number;

  searchForm: FormGroup;
  queryForm: FormGroup;

  activeTitle = 'Active';
  deactivatedTitle = 'In-Active';

  constructor(private _adminGlnService: AdminGlnPrimaryContactService,
              private _loadingService: LoadingService,
              private _messageService: MessagesService,
              private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this._adminGlnService.clearPrimaryContact();
    this.primaryContacts$ = this._adminGlnService.primaryContacts$;
    this.primaryContact$ = this._adminGlnService.primaryContact$;
    this.primaryContactQueryResult$ = this._adminGlnService.primaryContactQueryResults$;
    this.loading$ = this._loadingService.loading$;
    this.editMode$ = this._adminGlnService.editMode$;

    this.currentPage = 1;
    this.primaryContactQuery = new ContactQuery();

    this.queryForm = this.initQueryForm();
    this.searchForm = this.initSearchForm();

    let searchValueChange$ = this.searchForm.get('searchTerm').valueChanges;

    searchValueChange$.do(loading => this._loadingService.loading())
                      .debounceTime(1000).distinctUntilChanged()
                      .do(queryUpdate => this.createQueryFromForm())
                      .do(setPageToOne => this.setPageToOne())
                      .switchMap(() => this._adminGlnService.getAdditionalContactQueryResult(this.primaryContactQuery))
                      .subscribe(queryResult => {
                                this._loadingService.finishLoading();
                                this.itemsOnCurrentPage = queryResult.Items.length;
                            },
                            error => {
                              this._loadingService.finishLoading();
                              this._messageService.error('Unable to load additional contact search results. ' + error);
                            });

    let queryValueChange$ = this.queryForm.valueChanges;

    queryValueChange$.do(loading => this._loadingService.loading())
                      .debounceTime(1000).distinctUntilChanged()
                      .do(queryUpdate => this.createQueryFromForm())
                      .switchMap(() => this._adminGlnService.getAdditionalContactQueryResult(this.primaryContactQuery))
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

  createQueryFromForm() {

    this.primaryContactQuery.Active = this.queryForm.get('active').value;
    this.primaryContactQuery.Page = this.queryForm.get('page').value;
    this.primaryContactQuery.SortBy = this.queryForm.get('sortBy').value;
    this.primaryContactQuery.IsSortAscending = this.queryForm.get('isSortingAscending').value;
    this.primaryContactQuery.PageSize = this.queryForm.get('pageSize').value;
    this.primaryContactQuery.Page = this.queryForm.get('currentPage').value;

    this.primaryContactQuery.SearchTerm = this.searchForm.get('searchTerm').value;
  }

  private setPageToOne() {
    this.currentPage = 1;
      this.queryForm.patchValue({
        'currentPage': this.currentPage
      });
  }

  editPrimaryContact(id: number) {
    this._adminGlnService.getPrimaryContact(id)
                        .do(loading => this._loadingService.loading())
                        .subscribe(success => {
                          this._loadingService.finishLoading();
                        },
                      error => {
                        this._loadingService.finishLoading();
                        this._messageService.error('Unable to retrieve Primary Contact. ' + error);
                      });
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

  selectPrimaryContact(primaryContactId: number) {
    this._adminGlnService.getNextPrimaryContact(primaryContactId)
            .do(loading => this._loadingService.loading())
            .subscribe(success => {
              this._loadingService.finishLoading();
              window.scrollTo(0, 0 );
            }, error => {
              this._loadingService.finishLoading();
              this._messageService.error('Unable to retrieve additional contact. ' + error);
            });
  }
  // changes active values for filters
  onValueChange(event: any, formControlName: string) {
    this.queryForm.get(formControlName).patchValue(event);
  }

}
