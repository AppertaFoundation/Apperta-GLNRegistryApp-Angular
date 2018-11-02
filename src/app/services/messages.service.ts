//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable()
export class MessagesService {

  private errorsSubject = new BehaviorSubject<string[]>([]);

  errors$: Observable<string[]> = this.errorsSubject.asObservable();

  private updatesSubject = new BehaviorSubject<string[]>([]);

  updates$: Observable<string[]> = this.updatesSubject.asObservable();

  private questionsSubject = new BehaviorSubject<string[]>([]);

  questions$: Observable<string[]> = this.questionsSubject.asObservable();

  private answerSubject = new Subject<boolean>();

  answer$ = this.answerSubject.asObservable();

  constructor() {
    this.errors$.do(() => window.scrollTo(0, 0 )).debounceTime(7000)
                .subscribe(() => {
                  this.errorsSubject.next([]);
                });
    this.updates$.do(() => window.scrollTo(0, 0 )).debounceTime(7000)
                .subscribe(() => {
                  this.updatesSubject.next([]);
                });
  }

  error(...errors: string[]) {
    this.errorsSubject.next(errors);
  }

  update(...updates: string[]) {
    this.updatesSubject.next(updates);
  }

  question(...questions: string[]) {
    this.questionsSubject.next(questions);
  }

  yes() {
    this.answerSubject.next(true);
    this.clearQuestions();
  }

  no() {
    this.answerSubject.next(false);
    this.clearQuestions();
  }

  lastAnswer() {
    return this.answer$.take(1);
  }

  clearQuestions() {
    this.questionsSubject.next([]);
  }

}
