//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';

import { IAddress } from './../../../shared/interfaces/iaddress';

import { MessagesService } from './../../../services/messages.service';
import { AdminGlnAddressService } from './../../admin-gln-address.service';
import { AddressPagerService } from './../../../services/address-pager.service';

@Component({
  selector: 'app-admin-replacement-address',
  templateUrl: './admin-replacement-address.component.html',
  styleUrls: ['./admin-replacement-address.component.css'],
})
export class AdminReplacementAddressComponent implements OnInit {

  selectedAddress$: Observable<IAddress>;
  selectedAddressTitle = 'Selected Address';

  addressPage$: Observable<IAddress[]>;
  address$: Observable<IAddress>;

  searchCriteria$: Observable<string>;

  searchForm: FormGroup;

  constructor(public _addressPageService: AddressPagerService,
            private _addressService: AdminGlnAddressService,
            private _formBuilder: FormBuilder,
            private _messagesService: MessagesService,
            private _router: Router ) {

  }

  ngOnInit() {
    this.addressPage$ = this._addressPageService.addressPage$;
    this.address$ = this._addressService.address$;
    this.selectedAddress$ = this._addressService.selectedAddress$;

    this._addressPageService.loadFirstPage('');

    this.searchForm = this._formBuilder.group({
            'searchCriteria': ['']
        });

    this.searchCriteria$ = this.searchForm.valueChanges;

    this.searchCriteria$.distinctUntilChanged()
            .debounceTime(1000)
            .do(() => this._addressPageService.loadFirstPage(this.searchForm.get('searchCriteria').value))
            .subscribe(
              success => {},
              err => {this._messagesService.error('Could not load address search results' + err ); }
            );
  }


  previousAddressPage() {
    this._addressPageService.previous();

  }

  nextAddressPage() {
    this._addressPageService.next();
  }


  selectAddress(address: IAddress) {
    this._addressService.assignReplacementAddress(address);
    this._router.navigate(['admin-gln/admin-address']);
  }
}
