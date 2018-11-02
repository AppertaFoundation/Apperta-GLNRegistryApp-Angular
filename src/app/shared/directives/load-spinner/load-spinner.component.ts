//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { Observable } from 'rxjs/Rx';
import { Component, Input, OnInit } from '@angular/core';

import { LoadingService } from './../../../services/loading.service';

@Component({
  selector: 'load-spinner',
  templateUrl: './load-spinner.component.html',
  styles: []
})
export class LoadSpinnerComponent implements OnInit {

  @Input() visible = false;
  @Input() iconSize = 3;

  loading$: Observable<boolean>;

  constructor(private _loadingService: LoadingService) { }

  ngOnInit(): void {
    this.loading$ = this._loadingService.loading$;
  }

}
