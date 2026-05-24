const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const code = fs.readFileSync('Code.gs', 'utf8');
const context = {
  console,
  Date,
  Utilities: {
    formatDate(date, _timezone, pattern) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      if (pattern === 'yyyy-MM') return `${year}-${month}`;
      if (pattern === 'yyyy-MM-dd') return `${year}-${month}-${day}`;
      throw new Error(`Unsupported test pattern: ${pattern}`);
    }
  },
  Session: {
    getScriptTimeZone() {
      return 'America/New_York';
    }
  }
};

vm.createContext(context);
vm.runInContext(code, context);

assert.equal(typeof context.getCompleteMonthPeriodsBack_, 'function');

const periods = context.getCompleteMonthPeriodsBack_(6, new Date(2026, 4, 22));
const plainPeriods = JSON.parse(JSON.stringify(periods));

assert.deepEqual(plainPeriods.map((period) => period.reportMonth), [
  '2025-11',
  '2025-12',
  '2026-01',
  '2026-02',
  '2026-03',
  '2026-04'
]);

assert.deepEqual(plainPeriods[0], {
  reportMonth: '2025-11',
  startDate: '2025-11-01',
  endDate: '2025-11-30'
});

assert.deepEqual(plainPeriods[5], {
  reportMonth: '2026-04',
  startDate: '2026-04-01',
  endDate: '2026-04-30'
});

console.log('backfill date helper tests passed');
