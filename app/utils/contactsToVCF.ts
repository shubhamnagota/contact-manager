import { Contact } from './vcfParser';

export const contactsToVCF = (contacts: Contact[]): string => {
  return contacts.map(contact => {
    const lines = ['BEGIN:VCARD', 'VERSION:3.0'];

    if (contact.fullName) {
      lines.push(`FN:${contact.fullName}`);
    }

    if (contact.name) {
      const { lastName, firstName, middleName, prefix, suffix } = contact.name;
      lines.push(`N:${lastName};${firstName};${middleName || ''};${prefix || ''};${suffix || ''}`);
    }

    if (contact.phones) {
      contact.phones.forEach(phone => {
        let typeStr = phone.type.toUpperCase();
        if (phone.isPref) {
          typeStr += ';PREF=1';
        }
        lines.push(`TEL;TYPE=${typeStr}:${phone.value}`);
      });
    }

    // Add other fields as necessary

    lines.push('END:VCARD');
    return lines.join('\r\n');
  }).join('\r\n\r\n');
};