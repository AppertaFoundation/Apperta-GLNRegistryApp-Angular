//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-exclamation',
  templateUrl: './exclamation.component.html',
  styleUrls: [`./exclamation.component.css`]
})
export class ExclamationComponent implements OnInit {

  @Input() onText = 'Exclamation On';
  @Input() offText = 'Exclamation Off';
  @Input() exclamationOnOff = false;
  @Input() disabled = false;
  @Input() iconSize = 2;

  @Output() change = new EventEmitter();

exclamationOn = true;
exclamationOff = false;

  constructor() { }

  ngOnInit() {
  }

  excalmationOn() {
      if (!this.disabled) {
          this.change.emit(this.exclamationOn);
      }
    }

  excalmationOff() {
      if (!this.disabled) {
          this.change.emit(this.exclamationOff);
      }
    }

}
