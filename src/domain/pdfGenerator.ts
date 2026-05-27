import * as fs from 'fs';
import * as path from 'path';
import type { ChecklistItem } from '../@types/feeding.js';
import { TOOL_MESSAGES } from '../data/toolMessages.js';

const TEMPLATE_PATH = path.join(process.cwd(), 'templates', 'checklist.html');

const MONTHS = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
];

function formatOrdinalDate(isoDate: string): string {
	const [, m, d] = isoDate.split('-').map(Number);
	const suffix =
		d === 1 || d === 21 || d === 31 ? 'st' : d === 2 || d === 22 ? 'nd' : d === 3 || d === 23 ? 'rd' : 'th';
	return `${d}${suffix} ${MONTHS[m - 1]}`;
}

export function compileHtmlTemplate(babyName: string, startDate: string, items: ChecklistItem[]): string {
	const tableRowsHtml = items
		.map((item) => {
			const isAllergen = item.category.startsWith('Allergen');
			const badgeClass = isAllergen ? 'badge-allergen' : 'badge-standard';
			const [foodName, ...prepParts] = item.foodItem.split(' — ');
			const preparation = prepParts.join(' — ');
			return `
      <tr>
        <td class="col-date">${formatOrdinalDate(item.date)}</td>
        <td class="col-food">
          <span class="food-name">${foodName}</span>${preparation ? `<span class="food-prep">${preparation}</span>` : ''}
        </td>
        <td class="col-cat"><span class="badge ${badgeClass}">${item.category}</span></td>
        <td class="col-chk"></td>
        <td class="col-notes"></td>
      </tr>
    `;
		})
		.join('');

	const template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

	return template
		.replace('{{BABY_NAME}}', babyName)
		.replace('{{START_DATE}}', startDate)
		.replace('{{TABLE_ROWS}}', tableRowsHtml)
		.replace('{{TOOL_MESSAGES.ALLERGY_WARNING}}', TOOL_MESSAGES.ALLERGY_WARNING)
		.replace('{{TOOL_MESSAGES.DISCLAIMER}}', TOOL_MESSAGES.DISCLAIMER)
		.replace('{{MONITORING_INSTRUCTIONS}}', TOOL_MESSAGES.MONITORING_INSTRUCTIONS);
}
