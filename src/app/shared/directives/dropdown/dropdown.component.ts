//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { Component, Output, Input, EventEmitter, SimpleChanges, OnInit } from '@angular/core';

@Component({
    selector: 'dropdown',
    templateUrl: './dropdown.component.html',
    styles: [``]
})

export class DropdownComponent implements OnInit {

    @Output() select: EventEmitter<string> = new EventEmitter<string>();

    @Input() options: any[];

    @Input() selected = false;

    @Input() default: string;

    constructor() { }

    ngOnInit() {
        this.select.emit(this.options[this.indexOfDefault()]);

        if (this.indexOfDefault() !== 0 ) {
            this.selected = true;
        }
    }

    onSelectChange(event: any) {
        this.select.emit(event);
    }

    indexOfDefault(): number {
        return this.options.indexOf(this.default);
    }
}
