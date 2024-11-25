export const extractTableData = (table: HTMLTableElement) => {
  const headers: string[] = [];
  const rows: Record<string, string>[] = [];

  // Get headers from first row
  const headerRow = table.rows[0];
  if (headerRow) {
    const headerCells = headerRow.cells;
    console.log('Raw header cells:', Array.from(headerCells).map(cell => cell.textContent));
    
    for (let i = 0; i < headerCells.length; i++) {
      const headerText = headerCells[i].textContent?.trim().toLowerCase() || `column${i}`;
      headers.push(headerText);
    }
  }

  // Get data from remaining rows
  for (let i = 1; i < table.rows.length; i++) {
    const row = table.rows[i];
    const rowData: Record<string, string> = {};
    
    for (let j = 0; j < row.cells.length; j++) {
      if (j < headers.length) {
        const cellValue = row.cells[j].textContent?.trim() || '';
        rowData[headers[j]] = cellValue;
      }
    }
    
    if (Object.keys(rowData).length > 0) {
      console.log(`Extracted row ${i}:`, rowData);
      rows.push(rowData);
    }
  }

  return { headers, rows };
};