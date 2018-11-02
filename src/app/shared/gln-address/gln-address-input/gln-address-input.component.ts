//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { IAddress } from './../../interfaces/iaddress';
import { Address } from './../../types/address';

import { MessagesService } from './../../../services/messages.service';
import { AdminGlnAddressService } from './../../../admin-gln/admin-gln-address.service';
import { LoadingService } from './../../../services/loading.service';

@Component({
  selector: 'app-gln-address-input',
  templateUrl: './gln-address-input.component.html',
  styleUrls: ['./gln-address-input.component.css']
})
export class GlnAddressInputComponent implements OnInit, OnDestroy {

  @Input()
  address: IAddress = new Address();

  address$: Observable<IAddress>;
  loading$: Observable<boolean>;

  addressInputForm: FormGroup;

  validForm$: Observable<any>;
  editMode$: Observable<boolean>;

  activeTitle: string;

  constructor(private _fb: FormBuilder,
              private _addressService: AdminGlnAddressService,
              private _messagesService: MessagesService,
              private _loadingService: LoadingService) { }

  ngOnInit() {
    this.addressInputForm = this.initForm();
    this.address$ = this._addressService.selectedAddress$;
    this.editMode$ = this._addressService.editMode$;
    this.loading$ = this._loadingService.loading$;
    this.updateFormFromService();

  }

  addNewAddress() {
    this.addressInputForm.reset();
    this._addressService.createMode();
  }

    initForm(): FormGroup {
      return this._fb.group({
          'id': { value: '', disabled: false },
          'addressLineOne': [{ value: '', disabled: false }, Validators.compose([
                                                              Validators.required,
                                                              Validators.minLength(2)])],
          'level': [{ value: '', disabled: false }, Validators.pattern('^\\d+$')],
          'addressLineTwo': { value: '', disabled: false },
          'addressLineThree': { value: '', disabled: false },
          'addressLineFour': { value: '', disabled: false },
          'city': [{value: '', disabled: false}, Validators.compose([Validators.required])],
          'regionCounty': [{value: '', disabled: false}, Validators.compose([Validators.required])],
          'postcode': [{value: '', disabled: false }, Validators.compose([Validators.required,
                      Validators.pattern("^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$")])],
          'country': { value: 'GBR', disabled: false },
          'version': { value: '', disabled: false },
          'active': { value: '', disabled: false },
      });
  }

  updateFormFromService() {
    this.address$.subscribe(a => {
      this.addressInputForm.patchValue({
      addressLineOne: a.AddressLineOne,
      addressLineTwo: a.AddressLineTwo,
      addressLineThree: a.AddressLineThree,
      addressLineFour: a.AddressLineFour,
      city: a.City,
      regionCounty: a.RegionCounty,
      postcode: a.Postcode,
      country: a.Country,
      version: a.Version,
      id: a.Id,
      active: a.Active,
      level: a.Level,
    })});

    this.address$.publishLast();
  }

  updateModelFromForm() {
    this.address.AddressLineOne = this.addressInputForm.get('addressLineOne').value;
    this.address.AddressLineTwo = this.addressInputForm.get('addressLineTwo').value;
    this.address.AddressLineThree = this.addressInputForm.get('addressLineThree').value;
    this.address.AddressLineFour = this.addressInputForm.get('addressLineFour').value;
    this.address.Postcode = this.addressInputForm.get('postcode').value;
    this.address.City = this.addressInputForm.get('city').value;
    this.address.RegionCounty = this.addressInputForm.get('regionCounty').value;
    this.address.Country = this.addressInputForm.get('country').value;
    this.address.Version = this.addressInputForm.get('version').value;
    this.address.Id = this.addressInputForm.get('id').value;
    this.address.Active = this.addressInputForm.get('active').value;
    this.address.Level = this.addressInputForm.get('level').value;
  }

  submit() {
    this._loadingService.loading();
    this.updateModelFromForm();
    this._addressService.updateAddress(this.address)
        .subscribe(
          success => {
            this._loadingService.finishLoading();
            this._messagesService.update('Address has been successfully updated.');
            this._addressService.repeatLastQuery();
            this.addressInputForm.markAsPristine();
            this._addressService.createMode();
            this._addressService.clearAddress();
          },
          error => {
            this._loadingService.finishLoading();
            this._messagesService.error('Unable to update Address.');
          }
        );
  }

  createAddress() {
    this._loadingService.loading();
    this.updateModelFromForm();
    this.address.Id = 0;
    this.address.Active = true;
    this._addressService.createAddress(this.address)
        .subscribe(
          success => {
            this._addressService.repeatLastQuery();
            this._loadingService.finishLoading();
            this._messagesService.update('Address has been successfully created.');
            this.addressInputForm.markAsPristine();
            this._addressService.createMode();
            this._addressService.clearAddress();
          },
          error => {
            this._loadingService.finishLoading();
            this._messagesService.update('Unable to create new Address.');
          }
        );
  }

  addNewAdditionalContact() {
    this.addressInputForm.reset();
    this.addressInputForm.markAsPristine();
    this._addressService.createMode();
  }
  // changes active values for specified boolean types
  onValueChange(event: any, formControlName: string) {
      this.addressInputForm.get(formControlName).patchValue(event);
      this.addressInputForm.get(formControlName).markAsDirty();
  }

  ngOnDestroy() {
  }

}
