//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { IAddress } from './../../shared/interfaces/iaddress';
import { IAddressQuery } from './../../shared/interfaces/iaddressQuery';
import { GlnQueryResult } from './../../shared/types/gln-query-result';
import { AddressQuery } from './../../shared/types/address-query';

import { AdminGlnAddressService } from './../admin-gln-address.service';
import { MessagesService } from './../../services/messages.service';
import { LoadingService } from './../../services/loading.service';

@Component({
  selector: 'app-admin-address',
  templateUrl: './admin-address.component.html',
  styleUrls: ['./admin-address.component.css']
})
export class AdminAddressComponent implements OnInit, OnDestroy {

  selectedAddressTitle = 'Selected Address';

  selectedAddress$: Observable<IAddress>;
  addressPage$: Observable<IAddress[]>;
  address$: Observable<IAddress>;
  addressQueryResult$: Observable<GlnQueryResult>;
  loading$: Observable<boolean>;

  addressQuery: IAddressQuery;
  currentPage = 1;
  itemsOnCurrentPage: number;

  searchForm: FormGroup;
  queryForm: FormGroup;

  activeTitle = 'Active';
  deactivatedTitle = 'In-Active';

  constructor(private _addressService: AdminGlnAddressService,
            private _formBuilder: FormBuilder,
            private _loadingService: LoadingService,
            private _messageService: MessagesService) {

  }

  ngOnInit() {
    this.address$ = this._addressService.address$;
    this.selectedAddress$ = this._addressService.selectedAddress$;
    this.addressQueryResult$ = this._addressService.addressQueryResults$;
    this.loading$ = this._loadingService.loading$;

    this.currentPage = 1;
    this.addressQuery = new AddressQuery();

    this.searchForm = this.initSearchForm();
    this.queryForm = this.initQueryForm();

    let searchValueChange$ = this.searchForm.get('searchTerm').valueChanges;

    searchValueChange$.debounceTime(1000).distinctUntilChanged()
                      .do(loading => this._loadingService.loading())
                      .do(queryUpdate => this.createQueryFromForm())
                      .do(setPageToOne => this.setPageToOne())
                      .switchMap(() => this._addressService.getAddressQueryResult(this.addressQuery))
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
                      .switchMap(() => this._addressService.getAddressQueryResult(this.addressQuery))
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
      'sortBy': ['addressLineTwo'], // Sort by this as first line of address is Plymouth Hospital Trusts
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

  toggleActive() {
    this.queryForm.patchValue({
        'active': !this.queryForm.get('active').value
      });
  }

  selectAddress(addressId: number) {
    this._addressService.getNextAddress(addressId)
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
    this._addressService.clearAddress();

  }

}
