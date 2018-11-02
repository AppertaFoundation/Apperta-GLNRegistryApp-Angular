//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Pagination } from './../../types/pagination';
import { IPagination } from './../../interfaces/ipagination';

@Component({
    moduleId: module.id,
    selector: 'pagination',
    templateUrl: './pagination.component.html',
    styles: []
})

export class PaginationComponent {

    @Input() pagination: IPagination;
    @Output() pageChanged = new EventEmitter();

    constructor() {
    }

    changePage(page) {
        this.pagination.CurrentPage = page;
        this.pageChanged.emit(page);
    }

    previous() {
        if (this.pagination.CurrentPage === 1 ) {
            return;
        } else {
            this.pagination.CurrentPage--;
            this.pageChanged.emit(this.pagination.CurrentPage);
        }
    }

    next() {
        if ( this.pagination.CurrentPage === this.pagination.TotalPages ) {
            return;
        } else {
            this.pagination.CurrentPage++;
            this.pageChanged.emit(this.pagination.CurrentPage);
        }
    }

    start() {
        this.pagination.CurrentPage = 1;
        this.pageChanged.emit(1);
    }

    end() {
        this.pageChanged.emit(this.pagination.TotalPages);
    }
}
