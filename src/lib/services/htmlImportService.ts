import { Item } from '../types';
import { parseHtmlTable } from './htmlParserService';

export const processHtmlImport = async (fileContent: string) => {
  const { headers, rows } = parseHtmlTable(fileContent);
  console.log('Available headers for mapping:', headers);

  return rows.map((row): Item => {
    const code = row['číslo zakázky'] || row['značka'] || '';
    const company = row['popis'] || '';
    const dimensions = `${row['délka (cm)'] || ''}x${row['šířka (cm)'] || ''}x${row['výška (cm)'] || ''}`;
    const packaging = row['č. balení'] || '';

    console.log('Processing row data:', {
      code,
      company,
      dimensions,
      packaging
    });

    return {
      id: Math.random().toString(36).substr(2, 9),
      code,
      quantity: 1,
      company,
      customer: `${dimensions} - ${packaging}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      deleted: false
    };
  });
};