//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-pop-up-input',
  templateUrl: './pop-up-input.component.html',
  styleUrls: ['./pop-up-input.component.css']
})
export class PopUpInputComponent implements OnInit {

  @Input() title: string;
  @Input() toggleDisplayPopUp = false;

  @Input() userInfo: string;
  popUpForm: FormGroup;

  @Output() userInput: EventEmitter<string> = new EventEmitter<string>();
  @Output() turnPopUpOff: EventEmitter<boolean> = new EventEmitter<boolean>();


  userInput$: Observable<string>;

  constructor(private _fb: FormBuilder) {

  }

  ngOnInit() {

    this.popUpForm = this._fb.group({
      'userInfo': [{value: '', disabled: false}, Validators.compose([Validators.required, Validators.minLength(2)])]
    });

    this.userInput$ = this.popUpForm.get('userInfo').valueChanges;

    if (this.userInfo) {
      this.popUpForm.get('userInfo').patchValue(this.userInfo);
    }

  }

  sendUserInput() {
    this.toggleDisplayPopUp = !this.toggleDisplayPopUp;
    this.userInput.emit(this.popUpForm.get('userInfo').value);
    this.turnPopUpOff.emit(this.toggleDisplayPopUp);
  }

}
