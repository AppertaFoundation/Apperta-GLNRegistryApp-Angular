//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { AdditionalContact } from './../types/additional-contact';
import { Component, OnInit, Input } from '@angular/core';
import { IAdditionalContact } from './../interfaces/iadditional-contact';

@Component({
  selector: 'app-gln-additional-contact',
  templateUrl: './gln-additional-contact.component.html',
  styleUrls: ['./gln-additional-contact.component.css']
})
export class GlnAdditionalContactComponent implements OnInit {

  @Input()
  additionalContact: IAdditionalContact;

  @Input()
  title: string;

  subscriberTitle = 'Subscriber';

  constructor() { }

  ngOnInit() {

      if (this.additionalContact.Active) {
        this.subscriberTitle = 'Subscribed';
      } else {
        this.subscriberTitle = 'Un-Subscribed';
      }

  }
}
