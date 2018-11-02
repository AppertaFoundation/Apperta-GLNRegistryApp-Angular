//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { RadBtnItem } from './../../types/radio-btn-item';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.css']
})
export class RadioButtonComponent implements OnInit {

  boolValue: boolean;

  @Input()
  trueValue = false;

  @Input()
  falseValue = false;

  @Input()
  trueTitle = 'True';

  @Input()
  falseTitle = 'False';

  @Input()
  iconSize = 2;

  @Output()
  change: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  items: RadBtnItem[];

  constructor() { }

  ngOnInit() {

  }

  changeTrue() {
    this.trueValue = !this.trueValue;
    this.falseValue = !this.trueValue;
    this.change.emit(this.trueValue);
  }

  changeFalse() {
    this.falseValue = !this.falseValue;
    this.trueValue = !this.falseValue;
    this.change.emit(this.trueValue);
  }

}
