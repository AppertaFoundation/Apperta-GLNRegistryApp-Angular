//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Router, NavigationStart, RoutesRecognized} from '@angular/router';

@Component({
  selector: 'loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  loading$: Observable<boolean>;

  constructor(private router: Router) {
  }

  ngOnInit() {
      this.loading$ = this.router.events
          .map(event => event instanceof NavigationStart ||
                            event instanceof RoutesRecognized);

  }

}
