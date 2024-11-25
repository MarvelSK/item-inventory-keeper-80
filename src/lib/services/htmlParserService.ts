export const parseHtmlTable = (htmlContent: string) => {
  console.log('Starting HTML parsing...');
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const tables = doc.getElementsByTagName('table');
  
  if (tables.length === 0) {
    console.log('No tables found in HTML content');
    throw new Error('No table found in HTML file');
  }

  console.log(`Found ${tables.length} tables in HTML content`);
  const table = tables[0];
  const headers: string[] = [];
  const rows: Record<string, string>[] = [];

  // Get headers
  const headerRow = table.getElementsByTagName('tr')[0];
  if (headerRow) {
    const headerCells = headerRow.getElementsByTagName('th').length > 0 
      ? headerRow.getElementsByTagName('th')
      : headerRow.getElementsByTagName('td');
    
    console.log(`Found ${headerCells.length} header cells`);
    for (let i = 0; i < headerCells.length; i++) {
      const headerText = headerCells[i].textContent?.trim().toLowerCase() || `column${i}`;
      console.log(`Header ${i + 1}: "${headerText}"`);
      headers.push(headerText);
    }
  }

  // Get data rows
  const dataRows = table.getElementsByTagName('tr');
  console.log(`Found ${dataRows.length - 1} data rows`);
  
  for (let i = 1; i < dataRows.length; i++) {
    const row = dataRows[i];
    const cells = row.getElementsByTagName('td');
    if (cells.length === 0) continue;
    
    const rowData: Record<string, string> = {};
    for (let j = 0; j < cells.length; j++) {
      if (j < headers.length) {
        rowData[headers[j]] = cells[j].textContent?.trim() || '';
      }
    }
    
    if (Object.keys(rowData).length > 0) {
      console.log(`Row ${i} data:`, rowData);
      rows.push(rowData);
    }
  }

  console.log('Parsing completed. Total valid rows:', rows.length);
  return { headers, rows };
};