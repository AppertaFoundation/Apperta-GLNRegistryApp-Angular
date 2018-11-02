//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Injectable, OnInit } from '@angular/core';

import { IAddress } from './../shared/interfaces/iaddress';

import { AdminGlnAddressService } from './../admin-gln/admin-gln-address.service';
import { EnvironmentService } from './environment.service';


@Injectable()
export class AddressPagerService implements OnInit{

  private PAGE_SIZE = 10;
  private baseUrl: string;

  headers: Headers = new Headers({ 'Content-Type': 'application/json' });
  options: RequestOptions = new RequestOptions({ headers: this.headers, withCredentials: true });

  private addressPageSubject = new BehaviorSubject<IAddress[]>([]);

  addressPage$: Observable<IAddress[]> = this.addressPageSubject.asObservable();
  address$: Observable<IAddress>;

  currentPageNumber = 1;

  searchTerm: string;

  active = true;

  constructor(private _http: Http, private _adminGlnService: AdminGlnAddressService,
              private _environmentService: EnvironmentService) {
          // this.baseUrl = this._environmentService.apiUrl;
          this._environmentService.setApiUrl().subscribe(api => this.baseUrl = api.apiUrl);
}

  ngOnInit(): void {
    this.address$ = this._adminGlnService.address$;
  }

  getAddressPaged(): Observable<IAddress[]> {
      return this._http.get(`${this.baseUrl}api/gln-address-page/page-number/
          ${this.currentPageNumber}/page-size/${this.PAGE_SIZE}/search-term/${this.searchTerm}`, {withCredentials: true})
            .map((resp: Response) => <IAddress[]>resp.json())
            .map(addressPage => addressPage.filter(a => a.Active === this.active))
            .do(addressPage => this.addressPageSubject.next(addressPage))
            .publishLast().refCount();
   }

   toggleActive() {
    this.active = !this.active;
      this.currentPageNumber = 1;
      this.getAddressPaged().subscribe();
   }

  loadFirstPage(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.currentPageNumber = 1;

    this.loadPage(this.currentPageNumber, this.searchTerm);
  }

  previous() {
    if (this.currentPageNumber - 1 >= 1) {
      this.currentPageNumber -= 1;
      this.loadPage(this.currentPageNumber, this.searchTerm);
    }

  }

  next() {
    this.currentPageNumber += 1;
    this.loadPage(this.currentPageNumber, this.searchTerm);

  }

  loadPage(pageNumber: number, searchTerm: string) {
    this.searchTerm = searchTerm;
    this.currentPageNumber = pageNumber;

    this.getAddressPaged().subscribe();
  }

  reloadPage() {
    this.getAddressPaged().subscribe();
  }


}
