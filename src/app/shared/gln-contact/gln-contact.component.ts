//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { Component, OnInit, Input } from '@angular/core';
import { IContact } from './../interfaces/icontact';

@Component({
  selector: 'app-gln-contact',
  templateUrl: './gln-contact.component.html',
  styleUrls: ['./gln-contact.component.css']
})
export class GlnContactComponent implements OnInit {

  @Input()
  primaryContact: IContact;

  @Input()
  title: string;

  constructor() { }

  ngOnInit() {
  }

}
