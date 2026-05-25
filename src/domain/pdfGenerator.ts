import type { ChecklistItem } from '../@types/feeding.js';

export function compileHtmlTemplate(babyName: string, startDate: string, items: ChecklistItem[]): string {
  const tableRowsHtml = items.map(item => {
    const isAllergen = item.category.startsWith('Allergen');
    const badgeClass = isAllergen ? 'badge-allergen' : 'badge-standard';

    return `
      <tr>
        <td class="col-date">${item.date}</td>
        <td class="col-food">${item.foodItem}</td>
        <td class="col-cat"><span class="badge ${badgeClass}">${item.category}</span></td>
        <td class="col-chk">○</td>
        <td class="col-chk">○</td>
        <td class="col-notes"><span class="line-spacer"></span></td>
      </tr>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @page { size: A4; margin: 15mm 12mm; }
        *, *::before, *::after { box-sizing: border-box; }
        body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1e293b; font-size: 10pt; }
        .header-banner { border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 20px; }
        .header-title { font-size: 20pt; font-weight: bold; margin: 0; }
        .legend-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; margin-bottom: 20px; border-radius: 6px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
        tr { page-break-inside: avoid; }
        th { background: #f1f5f9; border: 1px solid #cbd5e1; padding: 8px; font-size: 8.5pt; text-transform: uppercase; }
        td { border: 1px solid #cbd5e1; padding: 10px; font-size: 9.5pt; }
        .line-spacer { border-bottom: 1px dashed #cbd5e1; display: block; height: 14px; }
        .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 8pt; font-weight: bold; }
        .badge-standard { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
        .badge-allergen { background: #fff1f2; color: #9f1239; border: 1px solid #fecdd3; }
        .alert-box { background: #fff5f5; border-left: 4px solid #e53e3e; padding: 12px; margin-bottom: 15px; }
        .info-grid { display: table; width: 100%; }
        .info-col { display: table-cell; width: 50%; vertical-align: top; font-size: 8.5pt; color: #475569; }
      </style>
    </head>
    <body>
      <div class="header-banner">
        <h1 class="header-title">${babyName}'s 30-Day Solid Food Plan</h1>
        <p>Baby-Led Weaning (BLW) Checklist &bull; Start Date: ${startDate}</p>
      </div>
      <div class="legend-box">
        <strong>📋 Icon Legend:</strong> ⏰ = Morning/Midday Only (Monitor for 2 hours) &bull; ○ = Manual Check-Circle
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Food Item & Method</th>
            <th>Category</th>
            <th>Offered</th>
            <th>Allergy</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>${tableRowsHtml}</tbody>
      </table>
      <div style="page-break-inside: avoid;">
        <div class="alert-box">
          <strong style="color: #c53030;">🚨 Allergy Reaction Quick Reference</strong>
          <p style="margin: 4px 0 0 0; font-size: 9pt; color: #742a2a;">Stop feeding and contact emergency services if infant exhibits Hives, Swelling of lips/tongue, Vomiting, Wheezing, or Limpness within 2 hours of exposure.</p>
        </div>
        <div class="info-grid">
          <div class="info-col" style="padding-right: 10px;">
            <strong>📚 Medical Sources</strong><br/>
            Evidence-based thresholds compiled from WHO Infant Feeding Frameworks and AAP Guidelines.
          </div>
          <div class="info-col" style="padding-left: 10px; border-left: 1px solid #e2e8f0;">
            <strong>⚖️ Medical Liability Disclaimer</strong><br/>
            This programmatic checklist serves exclusively as an educational data-planning utility for family tracking. It does not replace, constitute, or supersede individualized clinical evaluation or feeding advice provided by an accredited pediatrician.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}