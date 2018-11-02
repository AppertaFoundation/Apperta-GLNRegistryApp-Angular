//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Component, OnInit } from '@angular/core';

import { IContact } from './../../../shared/interfaces/icontact';

import { IContactQuery } from './../../../shared/interfaces/iContactQuery';
import { ContactQuery } from './../../../shared/types/contact-query';
import { GlnQueryResult } from './../../../shared/types/gln-query-result';

import { AdminGlnPrimaryContactService } from './../../admin-gln-primary-contact.service';
import { LoadingService } from './../../../services/loading.service';
import { MessagesService } from './../../../services/messages.service';

@Component({
  selector: 'app-admin-replacement-primary-contact',
  templateUrl: './admin-replacement-primary-contact.component.html',
  styleUrls: ['./admin-replacement-primary-contact.component.css']
})
export class AdminReplacementPrimaryContactComponent implements OnInit {


  primaryContacts$: Observable<IContact[]>;
  primaryContact$: Observable<IContact>;
  primaryContactQueryResult$: Observable<GlnQueryResult>;
  loading$: Observable<boolean>;

  primaryContactQuery: IContactQuery;
  currentPage = 1;
  itemsOnCurrentPage: number;

  searchForm: FormGroup;
  queryForm: FormGroup;

  constructor(private _adminGlnService: AdminGlnPrimaryContactService,
              private _router: Router,
              private _loadingService: LoadingService,
              private _messageService: MessagesService,
              private _formBuilder: FormBuilder ) { }

  ngOnInit() {
    this.primaryContacts$ = this._adminGlnService.primaryContacts$;
    this.primaryContact$ = this._adminGlnService.primaryContact$;
    this.primaryContactQueryResult$ = this._adminGlnService.primaryContactQueryResults$;
    this.loading$ = this._loadingService.loading$;

    this.currentPage = 1;
    this.primaryContactQuery = new ContactQuery();

    this.queryForm = this.initQueryForm();
    this.searchForm = this.initSearchForm();

    let searchValueChange$ = this.searchForm.get('searchTerm').valueChanges;

    searchValueChange$.distinctUntilChanged()
                      .do(loading => this._loadingService.loading())
                      .debounceTime(1000)
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

    queryValueChange$.distinctUntilChanged()
                      .do(loading => this._loadingService.loading())
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

  selectedReplacementPrimaryContact(contact: IContact) {
    this._loadingService.loading();
    this._adminGlnService.assignReplacementContact(contact).subscribe(
      success => {
          this._router.navigate(['admin-gln/admin-primary-contact']);
          this._loadingService.finishLoading();
      }
    );
  }

}
