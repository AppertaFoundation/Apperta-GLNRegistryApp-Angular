//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { Directive, Input, EventEmitter, ElementRef, Renderer, Inject, OnInit } from '@angular/core';

@Directive({
 selector: '[focus]'
})
export class FocusDirective implements OnInit {
 @Input('focus') focusEvent: EventEmitter<boolean>;

 constructor(@Inject(ElementRef) private element: ElementRef, private renderer: Renderer) {
  }

  ngOnInit() {
    this.focusEvent.subscribe(event => {
      this.renderer.invokeElementMethod(this.element.nativeElement, 'focus', []);
    });
  }
}
