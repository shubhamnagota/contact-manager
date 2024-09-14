export const parseVCF = (vcfContent) => {
  const contacts = vcfContent.split('BEGIN:VCARD')
    .filter(card => card.trim() !== '')
    .map(card => {
      const lines = card.split('\n');
      const contact = {};
      lines.forEach(line => {
        if (line.startsWith('FN:')) contact.name = line.split(':')[1].trim();
        if (line.startsWith('TEL;') || line.startsWith('TEL:')) {
          const [type, number] = line.split(':');
          if (type.includes('CELL') || type.includes('MOBILE')) {
            contact.mobile = number.trim();
          } else if (type.includes('WORK')) {
            contact.workMobile = number.trim();
          }
        }
        // Add more fields as needed
      });
      return contact;
    });
  return contacts;
};