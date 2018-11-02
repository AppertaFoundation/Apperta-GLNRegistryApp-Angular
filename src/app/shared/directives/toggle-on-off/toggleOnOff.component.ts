//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'onOff',
    templateUrl: `./toggleOnOff.component.html`,
    styles: [`
    font-size {

    }`
    ]
})

export class ToggleOnOffComponent {

    @Input() onOff = false;

    @Output() change = new EventEmitter();

    @Input() disabled = false;

    @Input() iconSize = 2;

    onClick() {
        if (!this.disabled) {
            this.onOff = !this.onOff;
            this.change.emit(this.onOff);
        }
    }
}