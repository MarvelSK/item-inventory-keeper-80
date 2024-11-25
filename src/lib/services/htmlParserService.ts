import { extractTableData } from './htmlTableParser';

export const parseHtmlTable = (htmlContent: string) => {
  console.log('Starting HTML parsing...');
  
  // Create a temporary container
  const container = document.createElement('div');
  container.innerHTML = htmlContent;
  
  // Find all tables
  const tables = container.getElementsByTagName('table');
  console.log(`Found ${tables.length} tables in HTML content`);
  
  if (tables.length === 0) {
    console.log('No tables found in HTML content');
    throw new Error('No table found in HTML file');
  }

  // Process the first table
  const table = tables[0] as HTMLTableElement;
  console.log('Processing first table:', table);
  
  const { headers, rows } = extractTableData(table);
  console.log('Extracted headers:', headers);
  console.log('Total rows extracted:', rows.length);

  return { headers, rows };
};