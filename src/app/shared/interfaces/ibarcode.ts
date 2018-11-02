//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { IAdditionalContact } from './iadditional-contact';
import { IAddress } from './IAddress';
import { IContact } from './IContact';

export interface IBarcode {

    Id: number;
    Assigned: boolean;
    FriendlyDescriptionPurpose: string;
    TruthDescriptionPurpose: string;
    Active: boolean;
    OwnGln: string;
    ParentGln: string;
    ParentDescriptionPurpose: string;
    FunctionalType: boolean;
    LegalType: boolean;
    DigitalType: boolean;
    PhysicalType: boolean;
    CreationDate: Date;
    UseParentAddress: boolean;
    Verified: boolean;
    Public: boolean;
    TrustActive: boolean;
    SuspensionReason: string;
    SuspendedBy: string;
    SuspensionDate: Date;
    ContactId: number;
    AddressId: number;
    Version: number;
    NumberOfChildren: number;
    Primary: boolean;
    AlternativeSystemIsTruth: boolean;

    Address: IAddress;
    PrimaryContact: IContact;
    AdditionalContacts: IAdditionalContact[];
}