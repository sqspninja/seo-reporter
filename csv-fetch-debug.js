(function () {
  const DEBUG_VERSION = '2026-05-24.1';
  const DEFAULT_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRiDP5-SSqPNCk6BI8ujx6OCPfr_WhKyCRk1WDSBwXXSJ1s5U0euzAeflbE-hLHAZ04bindi1yhYg4U/pub?output=csv';

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let value = '';
    let inQuotes = false;

    for (let index = 0; index < text.length; index += 1) {
      const char = text[index];
      const next = text[index + 1];

      if (char === '"' && inQuotes && next === '"') {
        value += '"';
        index += 1;
      } else if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        row.push(value);
        value = '';
      } else if ((char === '\n' || char === '\r') && !inQuotes) {
        if (char === '\r' && next === '\n') index += 1;
        row.push(value);
        rows.push(row);
        row = [];
        value = '';
      } else {
        value += char;
      }
    }

    if (value || row.length) {
      row.push(value);
      rows.push(row);
    }

    return rows.filter((item) => item.some((cell) => cell.trim()));
  }

  async function runDebug(root) {
    const csvUrl = root.getAttribute('data-csv-src') || DEFAULT_CSV_URL;
    const clientId = root.getAttribute('data-client-id') || 'bergen_design';

    root.textContent = `CSV debug ${DEBUG_VERSION}: loading...`;

    console.log('[csv-debug] CDN script loaded:', {
      version: DEBUG_VERSION,
      csvUrl,
      clientId
    });

    try {
      const response = await fetch(csvUrl, { cache: 'reload' });
      const text = await response.text();

      console.log('[csv-debug] HTTP status:', response.status, response.statusText);
      console.log('[csv-debug] Content type:', response.headers.get('content-type'));
      console.log('[csv-debug] Raw response text:', text);

      const rows = parseCsv(text);
      const headers = rows[0] || [];
      const dataRows = rows.slice(1);

      console.log('[csv-debug] Parsed headers:', headers);
      console.log('[csv-debug] Parsed data rows:', dataRows);

      const clientIdIndex = headers.indexOf('client_id');
      const payloadIndex = headers.indexOf('payload_json');

      if (clientIdIndex === -1 || payloadIndex === -1) {
        throw new Error(`Missing expected headers. Found: ${headers.join(', ') || 'none'}`);
      }

      const matchingRow = dataRows.find((row) => row[clientIdIndex] === clientId);

      if (!matchingRow) {
        throw new Error(`No row found for client_id: ${clientId}`);
      }

      const payload = JSON.parse(matchingRow[payloadIndex]);

      console.log('[csv-debug] Matching row:', matchingRow);
      console.log('[csv-debug] Parsed payload:', payload);

      root.textContent = `CSV debug ${DEBUG_VERSION}: loaded ${clientId}. Check console.`;
    } catch (error) {
      console.error('[csv-debug] Failed:', error);
      root.textContent = `CSV debug ${DEBUG_VERSION}: failed - ${error.message}`;
    }
  }

  document.querySelectorAll('[data-csv-debug]').forEach(runDebug);
}());
