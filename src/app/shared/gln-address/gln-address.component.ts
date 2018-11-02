//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { IAddress } from './../interfaces/iaddress';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-gln-address',
  templateUrl: './gln-address.component.html',
  styleUrls: ['./gln-address.component.css']
})
export class GlnAddressComponent implements OnInit {

  @Input()
  address: IAddress;

  @Input()
  title: string;

  constructor() { }

  ngOnInit() {
  }

}
