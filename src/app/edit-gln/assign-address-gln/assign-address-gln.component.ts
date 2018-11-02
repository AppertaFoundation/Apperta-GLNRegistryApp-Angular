//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { IGln } from './../../shared/interfaces/igln';
import { IAddress } from './../../shared/interfaces/iaddress';
import { IAddressQuery } from './../../shared/interfaces/iaddressQuery';
import { AddressQuery } from './../../shared/types/address-query';
import { GlnQueryResult } from './../../shared/types/gln-query-result';

import { MessagesService } from './../../services/messages.service';
import { LoadingService } from './../../services/loading.service';
import { EditGlnService } from './../../edit-gln/edit-gln.service';
import { AdminGlnAddressService } from './../../admin-gln/admin-gln-address.service';

@Component({
  selector: 'assign-address',
  templateUrl: './assign-address-gln.component.html',
  styleUrls: ['./assign-address-gln.component.css']
})
export class AssignAddressGlnComponent implements OnInit {

  selectedGln$: Observable<IGln>;
  selectedParentGln$: Observable<IGln>;
  selectedAddress$: Observable<IAddress>;
  addressPage$: Observable<IAddress[]>;
  searchCriteria$: Observable<string>;
  addressQueryResult$: Observable<GlnQueryResult>;
  loading$: Observable<boolean>;

  selectedAddressTitle = 'Selected Address';
  currentAddressTitle = 'Current Address';

  searchForm: FormGroup;
  queryForm: FormGroup;

  viewAddress = false;
  currentPage: number;
  itemsOnCurrentPage: number;
  addressQuery: IAddressQuery;

  constructor(private _editGlnService: EditGlnService,
              private _addressService: AdminGlnAddressService,
              private _formBuilder: FormBuilder,
              private _messageService: MessagesService,
              private _loadingService: LoadingService,
              private _router: Router) { }

  ngOnInit() {

    this.selectedGln$ = this._editGlnService.gln$;
    this.selectedParentGln$ = this._editGlnService.selectedParentGln$;
    this.selectedAddress$ = this._editGlnService.selectedAddress$;
    this.addressQueryResult$ = this._addressService.addressQueryResults$;
    this.loading$ = this._loadingService.loading$;

    this.currentPage = 1;
    this.addressQuery = new AddressQuery();

    this.searchForm = this.initSearchForm();
    this.queryForm = this.initQueryForm();

    let searchValueChange$ = this.searchForm.get('searchTerm').valueChanges;

    searchValueChange$.distinctUntilChanged()
                      .debounceTime(1000)
                      .do(loading => this._loadingService.loading())
                      .do(queryUpdate => this.createQueryFromForm())
                      .do(setPageToOne => this.setPageToOne())
                      .switchMap(() => this._addressService.getAddressQueryResult(this.addressQuery))
                      .subscribe(queryResult => {
                                this.itemsOnCurrentPage = queryResult.Items.length;
                                this._loadingService.finishLoading();
                            },
                            error => {
                              this._loadingService.finishLoading();
                              this._messageService.error('Unable to return address search results. ' + error);
                            });

    let queryValueChange$ = this.queryForm.valueChanges;

    queryValueChange$.distinctUntilChanged()
                      .do(loading => this._loadingService.loading())
                      .do(queryUpdate => this.createQueryFromForm())
                      .switchMap(() => this._addressService.getAddressQueryResult(this.addressQuery))
                      .subscribe(queryResult => {
                        this._loadingService.finishLoading();
                        this.itemsOnCurrentPage = queryResult.Items.length;
                      },
                      error => {
                        this._loadingService.finishLoading();
                        this._messageService.error('Unable to return address search results. ' + error);
                      });

    this.setPageToOne();
  }

  initQueryForm(): FormGroup {
    return this._formBuilder.group({
      'active': [true],
      'page': [1],
      'sortBy': ['addressLineTwo'], // Sort by this as first line of address if Plymouth Hospital Trusts
      'isSortingAscending': [true],
      'pageSize': [10],
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

    this.addressQuery.Active = this.queryForm.get('active').value;
    this.addressQuery.Page = this.queryForm.get('page').value;
    this.addressQuery.SortBy = this.queryForm.get('sortBy').value;
    this.addressQuery.IsSortAscending = this.queryForm.get('isSortingAscending').value;
    this.addressQuery.PageSize = this.queryForm.get('pageSize').value;
    this.addressQuery.Page = this.queryForm.get('currentPage').value;
    this.addressQuery.Level = this.queryForm.get('level').value;

    this.addressQuery.SearchTerm = this.searchForm.get('searchTerm').value;
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

  selectAddress(addressId: number) {
      this._editGlnService.getNextAddress(addressId)
                      .do(loading => this._loadingService.loading())
                      .subscribe(success => {
                          this._loadingService.finishLoading();
                        },
                        error => {
                          this._loadingService.finishLoading();
                          this._messageService.error('Unable to return address. ' + error);
                        });
  }

  getParentAddress() {
      this._editGlnService.getSelectedParentAddress()
                      .do(loading => this._loadingService.loading())
                      .subscribe(success => {
                          this._loadingService.finishLoading();
                        },
                        error => {
                          this._loadingService.finishLoading();
                          this._messageService.error('Unable to return address. ' + error);
                        });
  }

  toggleViewAddress() {
    this.viewAddress = !this.viewAddress;
  }

  assignAddress() {
    this._editGlnService.updateGlnAddress()
                        .do(loading => this._loadingService.loading())
                        .subscribe(
                          succcess => {
                            this._loadingService.finishLoading();
                            this._messageService.update('New address successfully assigned to GLN .');
                            window.scrollTo(0, 0 );
                            this._router.navigate(['search/edit-gln/ ' + this._editGlnService.gln.Id]);
                          },
                          error => {
                            this._loadingService.finishLoading();
                            this._messageService.error('Unable to assign new address to GLN .');
                          });
  }

}
