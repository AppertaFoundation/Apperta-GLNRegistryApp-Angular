//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { IGlnSummary } from './../interfaces/igln-summary';
import { IGln } from './../interfaces/igln';
import { IIpr } from './../interfaces/Iipr';

import { StartUpService } from './../../services/start-up.service';

@Component({
  selector: 'gln-row-summary',
  templateUrl: './gln-row-summary.component.html',
  styleUrls: ['./gln-row-summary.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlnRowSummaryComponent implements OnInit{

  ipr$: Observable<IIpr>;
  @Input()
  gln: IGlnSummary;

  @Input()
  title: string;

  // Labels for types
  physical = 'Physical';
  functional = 'Functional';
  digital = 'Digital';
  legal = 'Legal';
  trustSuspended = 'Trust Suspended';
  trustActive = 'Trust Active';

  constructor(private _startUpService: StartUpService) { }

  ngOnInit(): void {
    this.ipr$ = this._startUpService.ipr$;
  }
}
