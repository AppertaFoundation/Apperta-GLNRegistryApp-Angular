//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pop-up-warning',
  templateUrl: './pop-up-warning.component.html',
  styleUrls: ['./pop-up-warning.component.css']
})
export class PopUpWarningComponent implements OnInit {

  @Input() title: string;
  @Input() toggleDisplayPopUp = false;

  @Output() userAnswer: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() turnPopUpOff: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  sendCancel() {
    this.userAnswer.emit(false);
    this.turnPopUpOff.emit(false);
  }

  sendOk(){
    this.userAnswer.emit(true);
    this.turnPopUpOff.emit(false);
  }
}
