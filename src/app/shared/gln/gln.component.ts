//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { StartUpService } from './../../services/start-up.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

import { IGln } from './../../shared/interfaces/igln';
import { IIpr } from './../interfaces/Iipr';

@Component({
  selector: 'app-gln',
  templateUrl: './gln.component.html',
  styleUrls: ['./gln.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlnComponent implements OnInit {

  @Input()
  gln: IGln;

  @Input()
  title: string;

  ipr$: Observable<IIpr>;

  // Labels for types
  physical = 'Physical';
  functional = 'Functional';
  digital = 'Digital';
  legal = 'Legal';
  trustNotSuspeneded = 'Trust Active';
  trustSuspended = 'Trust Suspended';

  constructor(private _route: ActivatedRoute,
              private _startUp: StartUpService
              ) { }

  ngOnInit() {
    this.ipr$ = this._startUp.ipr$;
  }

}
