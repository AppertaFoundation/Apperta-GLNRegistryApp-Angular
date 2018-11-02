//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { Component, OnInit, Input } from '@angular/core';

import { IIpr } from './../interfaces/Iipr';

@Component({
  selector: 'app-ipr',
  templateUrl: './ipr.component.html',
  styleUrls: ['./ipr.component.css']
})
export class IprComponent implements OnInit {

  @Input()
  ipr: IIpr;

  @Input()
  title: string;

  constructor() { }

  ngOnInit() {
  }

}
