//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-directional',
  templateUrl: './directional.component.html',
  styles: [
    `    
    .fa {
        margin: 20px 20px;
        height: 40px;
        display: inline-block;
        float: left;
        color: #0A1B37;
    }

    p {
      font-size: 14px;
      color: #6A80AC;
    }
    `
  ]
})
export class DirectionalComponent {

  @Input() isRightActive = false;
  @Input() isLeftActive = false;
  @Input() isUpActive = false;
  @Input() isDownActive = false;

  @Input() isActive = false;

  @Output() change = new EventEmitter();

  @Input() disabled = false;

  @Input() title = 'Direction';

  @Input() iconSize = 2;

  constructor() { }

    onClick() {
        if (!this.disabled) {
            this.change.emit(this.isActive);
        }
    }
}
