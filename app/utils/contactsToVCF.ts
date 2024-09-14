import { Contact } from './vcfParser';

const encodeQuotedPrintable = (str: string): string => {
  return str.replace(/[^\x20-\x7E]/g, (char) => {
    const hex = char.charCodeAt(0).toString(16).toUpperCase();
    return '=' + (hex.length < 2 ? '0' : '') + hex;
  });
};

const encodeValue = (value: string): string => {
  // First, UTF-8 encode the string
  const utf8Encoded = unescape(encodeURIComponent(value));
  // Then, encode as Quoted-Printable
  return encodeQuotedPrintable(utf8Encoded);
};

export const contactsToVCF = (contacts: Contact[]): string => {
  return contacts.map(contact => {
    const lines = ['BEGIN:VCARD', 'VERSION:3.0'];

    if (contact.fullName) {
      lines.push(`FN;CHARSET=UTF-8;ENCODING=QUOTED-PRINTABLE:${encodeValue(contact.fullName)}`);
    }

    if (contact.name) {
      const { lastName, firstName, middleName, prefix, suffix } = contact.name;
      lines.push(`N;CHARSET=UTF-8;ENCODING=QUOTED-PRINTABLE:${encodeValue(lastName)};${encodeValue(firstName)};${encodeValue(middleName || '')};${encodeValue(prefix || '')};${encodeValue(suffix || '')}`);
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