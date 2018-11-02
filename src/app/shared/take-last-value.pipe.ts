//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'takeLastValue'
})
export class TakeLastValuePipe implements PipeTransform {

  transform(value: string): string {

    if (value !== null) {
      let splitString = value.split('\\');

      let newString: string;

      newString = splitString[splitString.length - 1];

      newString.trim();

      return newString;
    }

    return '';
  }

}
