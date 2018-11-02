//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.

import { Component, OnInit, Input } from '@angular/core';

import { IAddress } from './../interfaces/iaddress';

@Component({
  selector: 'app-gln-address-summary',
  templateUrl: './gln-address-summary.component.html',
  styleUrls: ['./gln-address-summary.component.css']
})
export class GlnAddressSummaryComponent implements OnInit {

  @Input()
  address: IAddress;

  @Input()
  title: string;

  constructor() { }

  ngOnInit() {
  }

}
