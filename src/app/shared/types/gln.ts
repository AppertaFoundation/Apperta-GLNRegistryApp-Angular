//Global Location Number (GLN) Registry Angular Client Site
//Copyright (C) 2018  University Hospitals Plymouth NHS Trust
//
//You should have received a copy of the GNU Affero General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>. 
// 
// See LICENSE in the project root for license information.
import { GlnTag } from './gln-tag';
import { GlnSummary } from './gln-summary';
import { AdditionalContact } from './additional-contact';
import { IGln } from './../interfaces/igln';
import { Address } from './address';
import { Contact } from './contact';

export class Gln implements IGln {

    Id: number;
    Assigned: boolean;
    FriendlyDescriptionPurpose: string;
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
    TruthDescriptionPurpose: string;
    AlternativeSystemIsTruth: boolean;
    Department: string;
    Function: string;
    TierLevel: number;
    DeliveryNote: string;

    Address: Address = new Address();
    PrimaryContact: Contact = new Contact();
    AdditionalContacts: AdditionalContact[];
    Children: GlnSummary[];
    Tags: GlnTag[];
}


