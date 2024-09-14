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

    if (contact.photo) {
      lines.push('PHOTO;ENCODING=BASE64;TYPE=JPEG:');
      // Split the base64 string into lines of 75 characters
      const photoLines = contact.photo.match(/.{1,75}/g) || [];
      lines.push(...photoLines);
    }

    // Add other fields as necessary

    lines.push('END:VCARD');
    return lines.join('\r\n');
  }).join('\r\n\r\n');
};