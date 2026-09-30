import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function generateFinancialPDF({ transactions, categories, totalBalance, totalIncome, totalExpense, totalSavedInGoals, user }) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const timestamp = new Date().toLocaleString('en-MY', {
    dateStyle: 'full',
    timeStyle: 'medium'
  });

  // KampusKash Purple Theme Color Palette
  const primaryColor = [98, 72, 115]; // #624873 KampusKash Purple
  const darkHeaderBg = [42, 31, 53]; // #2A1F35 Deep Purple Dark
  const accentPurple = [126, 90, 155]; // #7E5A9B Soft Purple
  const incomeColor = [40, 167, 69]; // Emerald/Green for Income
  const expenseColor = [231, 76, 60]; // Rose Red for Expense
  const textColor = [51, 65, 85]; // Slate 700

  // 1. Header Graphic Banner (KampusKash Theme)
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 28, 'F');

  // Title in Header
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('KAMPUSKASH', 14, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Student Financial Statement & Transaction Report', 14, 21);

  // Sub-header Right Info
  doc.setFontSize(9);
  doc.text('CURRENCY: MYR (RM)', 196, 14, { align: 'right' });
  doc.text(`DATE: ${new Date().toISOString().split('T')[0]}`, 196, 21, { align: 'right' });

  // 2. User & Report Metadata Graphic Card
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 34, 182, 24, 3, 3, 'FD');

  doc.setTextColor(...darkHeaderBg);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('STUDENT PROFILE & STATEMENT METADATA', 18, 41);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...textColor);

  // Left Column: User details
  const studentName = user?.username || 'Student';
  const studentEmail = user?.email || '-';
  const institution = user?.university || 'Campus Student';
  const accountType = 'Authenticated Student';

  doc.text(`Student Name: ${studentName}`, 18, 47);
  doc.text(`Email Address: ${studentEmail}`, 18, 52.5);

  // Right Column: Institution & Timestamp
  doc.text(`Institution: ${institution} (${accountType})`, 110, 47);
  doc.text(`Generated On: ${timestamp}`, 110, 52.5);

  // 3. Key Financial Summary Cards (KampusKash Visual Metric Cards)
  const cardY = 64;
  const cardWidth = 42.5;
  const cardHeight = 22;
  const cardGap = 4;

  const metrics = [
    { title: 'Total Balance', value: `RM ${totalBalance.toFixed(2)}`, color: totalBalance >= 0 ? primaryColor : expenseColor },
    { title: 'Total Income', value: `RM ${totalIncome.toFixed(2)}`, color: incomeColor },
    { title: 'Total Expense', value: `RM ${totalExpense.toFixed(2)}`, color: expenseColor },
    { title: 'Saved Goals', value: `RM ${totalSavedInGoals.toFixed(2)}`, color: accentPurple }
  ];

  metrics.forEach((m, idx) => {
    const x = 14 + idx * (cardWidth + cardGap);
    
    // Outer Border & Fill
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x, cardY, cardWidth, cardHeight, 2, 2, 'FD');

    // Colored Accent Line on top of metric card
    doc.setFillColor(...m.color);
    doc.rect(x, cardY, cardWidth, 2, 'F');

    // Card Label
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(m.title.toUpperCase(), x + 4, cardY + 8);

    // Card Value
    doc.setFontSize(10);
    doc.setTextColor(...m.color);
    doc.text(m.value, x + 4, cardY + 16);
  });

  // 4. Section Header for Transaction Records
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...darkHeaderBg);
  doc.text('TRANSACTION RECORDS SUMMARY', 14, 95);

  doc.setLineWidth(0.5);
  doc.setDrawColor(...primaryColor);
  doc.line(14, 97, 196, 97);

  // 5. Transaction Table Construction
  const tableHeaders = [['#', 'Date', 'Title & Note', 'Category', 'Type', 'Amount (RM)']];
  
  const tableData = transactions.map((t, index) => {
    const cat = categories.find(c => c.id === t.categoryId);
    const categoryName = cat ? cat.name : 'Uncategorized';
    const isIncome = t.type === 'income';
    const amountStr = `${isIncome ? '+' : '-'} RM ${t.amount.toFixed(2)}`;
    const titleWithNote = t.note ? `${t.title}\n(${t.note})` : t.title;

    return [
      (index + 1).toString(),
      t.date,
      titleWithNote,
      categoryName,
      t.type.toUpperCase(),
      amountStr
    ];
  });

  autoTable(doc, {
    startY: 101,
    head: tableHeaders,
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: {
      textColor: textColor,
      fontSize: 8.5
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 24 },
      2: { cellWidth: 68 },
      3: { cellWidth: 35 },
      4: { cellWidth: 20, halign: 'center' },
      5: { cellWidth: 29, halign: 'right', fontStyle: 'bold' }
    },
    didParseCell: function(data) {
      if (data.section === 'body' && data.column.index === 5) {
        const cellText = data.cell.raw || '';
        if (cellText.startsWith('+')) {
          data.cell.styles.textColor = incomeColor;
        } else {
          data.cell.styles.textColor = expenseColor;
        }
      }
    },
    margin: { left: 14, right: 14, bottom: 20 }
  });

  // 6. Page Numbers and Footer Info
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);

    // Footer divider line
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 282, 196, 282);

    doc.text('KampusKash — Your Friendly Campus Wallet | Official Statement Export', 14, 287);
    doc.text(`Page ${i} of ${pageCount}`, 196, 287, { align: 'right' });
  }

  // Trigger browser download
  const dateStamp = new Date().toISOString().split('T')[0];
  doc.save(`kampuskash_report_${dateStamp}.pdf`);
}
