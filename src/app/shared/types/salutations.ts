//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
export class Salutations {

    public options: string[] = ['Please Select', 'Mr', 'Mrs', 'Miss', 'Ms', 'Sir', 'Dr', 'Prof', 'Lord'];

    public AddSalutation(salutation: string): void {

        this.options.push(salutation);
    }
}
