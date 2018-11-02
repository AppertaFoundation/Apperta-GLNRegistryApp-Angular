//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { EditGlnService } from './../../edit-gln/edit-gln.service';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, Input } from '@angular/core';

import { IGln } from '../interfaces/igln';

@Component({
  selector: 'app-gln-summary',
  templateUrl: './gln-summary.component.html',
  styleUrls: ['./gln-summary.component.css']
})
export class GlnSummaryComponent implements OnInit {

  @Input()
  gln: IGln;

  @Input()
  title: string;

  // Labels for types
  physical = 'Physical';
  functional = 'Functional';
  digital = 'Digital';
  legal = 'Legal';

  constructor() { }

  ngOnInit() {

  }

}
