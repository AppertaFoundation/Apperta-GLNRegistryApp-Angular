//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MessagesService } from './../services/messages.service';
import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';

@Component({
  selector: 'gln-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  errors$: Observable<string[]>;
  updates$: Observable<string[]>;
  questions$: Observable<string[]>;
  answer$: Observable<boolean>;

  constructor(private messagesService: MessagesService) {
  }

  ngOnInit() {
      this.errors$ = this.messagesService.errors$;
      this.updates$ = this.messagesService.updates$;
      this.questions$ = this.messagesService.questions$;
      this.answer$ = this.messagesService.answer$;
  }

  closeError() {
    this.messagesService.error();
  }

  closeUpdate() {
    this.messagesService.update();
  }

  yes() {
    this.messagesService.yes();
  }

  no() {
    this.messagesService.no();
  }

}
