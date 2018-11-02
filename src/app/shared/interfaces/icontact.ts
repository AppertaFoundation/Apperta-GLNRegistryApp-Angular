//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.

export interface IContact {

    Id: number;
    Name: string;
    Email: string;
    Function: string;
    Salutation: string;
    Telephone: string;
    Fax: string;
    Active: boolean;
    Version: number;
}