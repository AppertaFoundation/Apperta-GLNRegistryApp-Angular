//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy, OnChanges } from '@angular/core';

@Component({
    selector: 'active',
    templateUrl: `./active.component.html`,
    styleUrls: [`./active.component.css`],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ActiveComponent implements OnInit, OnChanges {

    @Input() isActive= false;

    @Output() change: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Input() disabled = false;

    @Input() title = 'In-Active';

    @Input() activeTitle = 'Active';
    inActiveTitle = 'In-Active';

    @Input() iconSize = 2;

    constructor() {}

    ngOnInit() {
        this.changeTitleText();
    }

    ngOnChanges(): void {
        this.changeTitleText();
    }

    onClick() {
        if (!this.disabled) {
            this.isActive = !this.isActive;
            this.changeTitleText();
            this.change.emit(this.isActive);
        }
    }

    changeTitleText() {
        if (!this.isActive && this.title === this.activeTitle) {
            this.title = this.inActiveTitle;
        } else if ( this.isActive && this.title === this.inActiveTitle) {
            this.title = this.activeTitle;
        }
    }
}
