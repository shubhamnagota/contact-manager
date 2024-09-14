export interface Contact {
  fullName?: string;
  name?: {
    firstName: string;
    lastName: string;
    middleName?: string;
    prefix?: string;
    suffix?: string;
  };
  phones?: Array<{
    type: string;
    value: string;
    isPref: boolean;
  }>;
  photo?: string;
  [key: string]: any;
}

const decodeQuotedPrintable = (str: string): string => {
  return str.replace(/=([0-9A-F]{2})/g, (_, p1) => 
    String.fromCharCode(parseInt(p1, 16))
  );
};

const decodeValue = (value: string): string => {
  // First, decode Quoted-Printable
  const decodedQP = decodeQuotedPrintable(value);
  
  // Then, decode UTF-8
  try {
    return decodeURIComponent(escape(decodedQP));
  } catch (e) {
    console.error("Error decoding value:", e);
    return decodedQP; // Return the Quoted-Printable decoded string if UTF-8 decoding fails
  }
};

export const parseVCF = (vcfContent: string): Contact[] => {
  const contacts: Contact[] = [];
  const vcards = vcfContent.split('BEGIN:VCARD');

  for (let vcard of vcards) {
    if (!vcard.trim()) continue;

    const lines = vcard.split('\n');
    const contact: Contact = {
      phones: []
    };

    let photoData = '';
    let isCollectingPhotoData = false;

    for (let line of lines) {
      line = line.trim();
      if (!line || line === 'END:VCARD') {
        if (isCollectingPhotoData) {
          contact.photo = photoData;
          isCollectingPhotoData = false;
        }
        continue;
      }

      if (isCollectingPhotoData) {
        photoData += line;
        continue;
      }

      const [key, ...values] = line.split(':');
      const [property, ...params] = key.split(';');
      const value = decodeValue(values.join(':').trim());

      switch (property.toUpperCase()) {
        case 'VERSION':
          contact.version = value;
          break;
        case 'N':
          const [lastName, firstName, middleName, prefix, suffix] = value.split(';').map(decodeValue);
          contact.name = { lastName, firstName, middleName, prefix, suffix };
          break;
        case 'FN':
          contact.fullName = value;
          break;
        case 'TEL':
          const phoneType = params.find(p => p !== 'PREF')?.toLowerCase() || 'other';
          contact.phones?.push({
            type: phoneType,
            value,
            isPref: params.includes('PREF')
          });
          break;
        case 'PHOTO':
          isCollectingPhotoData = true;
          photoData = value;
          break;
        default:
          contact[property.toLowerCase()] = value;
      }
    }

    if (Object.keys(contact).length > 0) {
      contacts.push(contact);
    }
  }

  return contacts;
};