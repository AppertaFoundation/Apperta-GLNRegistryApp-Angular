//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { IAdditionalContact } from '../interfaces/iadditional-contact';

export class AdditionalContact implements IAdditionalContact {

    Id: number;
    Email: string;
    System: string;
    Telephone: string;
    Fax: string;
    Active: boolean;
    Salutation: string;
    Version: number;
    Role: string;
    TrustUsername: string;
    NotificationSubscriber: boolean;
    Name: string;
}