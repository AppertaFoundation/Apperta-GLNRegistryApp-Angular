//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'publicPrivate',
    templateUrl: `./publicPrivate.component.html`,
    styleUrls: [`./publicPrivate.component.css`]
})

export class PublicPrivateComponent {

    @Input() publicPrivate = false;

    @Output() change = new EventEmitter();

    @Input() disabled = false;

    @Input() iconSize = 2;

    onClick() {
        if(!this.disabled){
            this.publicPrivate =!this.publicPrivate;
            this.change.emit(this.publicPrivate);
        }
    }
}