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
  version?: string;
  [key: string]: any; // For any other properties that might be in the VCF
}

export const parseVCF = (vcfContent: string): Contact[] => {
  const contacts: Contact[] = [];
  const vcards = vcfContent.split('BEGIN:VCARD');

  for (let vcard of vcards) {
    if (!vcard.trim()) continue;

    const lines = vcard.split('\n');
    const contact: Contact = {
      phones: []
    };

    for (let line of lines) {
      line = line.trim();
      if (!line || line === 'END:VCARD') continue;

      const [key, ...values] = line.split(':');
      const [property, ...params] = key.split(';');
      const value = values.join(':').trim();

      switch (property.toUpperCase()) {
        case 'VERSION':
          contact.version = value;
          break;
        case 'N':
          const [lastName, firstName, middleName, prefix, suffix] = value.split(';');
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
        default:
          // Store other properties as-is
          contact[property.toLowerCase()] = value;
      }
    }

    if (Object.keys(contact).length > 0) {
      contacts.push(contact);
    }
  }

  return contacts;
};