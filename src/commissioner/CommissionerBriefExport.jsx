import React from 'react';
import { Download, FileText, Printer, ShieldCheck } from 'lucide-react';
import './commissionerExport.css';

const sections = [
  ['Executive view', 'One commissioner-facing portfolio shows active, expansion, completed and at-risk projects without forcing leadership to assemble updates from separate screens.'],
  ['Project controls', 'Every project carries a stage, completion percentage, accountable owner, next action, date, blocker, variance and supporting record.'],
  ['Visual evidence', 'Approved field video and photos are filed by project and stage so leadership can see progress behind each reported percentage.'],
  ['Decision queue', 'Items requiring commissioner review are surfaced with the affected project and due date. Consequential actions remain human-authorized and auditable.'],
  ['Pilot recommendation', 'Run a 30-day pilot with one Port point person, one selected workflow, approved data access and agreed measures for milestone variance and response time.'],
  ['Success criteria', 'Faster shared context, fewer handoff gaps, traceable decisions, reliable closeout records and less time preparing leadership reports.'],
];

function buildHtml() {
  return `<!doctype html><html><head><meta charset="utf-8"><title>PortFlow PA Commissioner Brief</title><style>body{font-family:Arial,sans-serif;color:#10221d;padding:40px;max-width:820px;margin:auto}h1{font-size:30px;margin:0 0 6px}h2{font-size:16px;margin:26px 0 6px;color:#17654f}.tag{font-size:11px;letter-spacing:1.4px;color:#357563}.note{margin-top:30px;padding:12px;border:1px solid #b7d6cc;background:#f4faf8;font-size:11px;line-height:1.5}p{font-size:13px;line-height:1.55}</style></head><body><div class="tag">PORTFLOW PA · COMMISSIONER BRIEFING</div><h1>Project delivery in one operating picture.</h1><p>Executive summary prepared from the CivicGrid PortFlow pilot experience.</p>${sections.map(([heading, copy]) => `<h2>${heading}</h2><p>${copy}</p>`).join('')}<div class="note">Dashboard records remain demonstration data until connected to an approved Port source. This brief is not an official Port record, procurement document, security assessment or performance certification.</div></body></html>`;
}

export default function CommissionerBriefExport() {
  const download = () => {
    const blob = new Blob([buildHtml()], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'PortFlow-PA-Commissioner-Brief.html';
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const print = () => {
    const printWindow = window.open('', '_blank', 'noopener,noreferrer');
    if (!printWindow) return;
    printWindow.document.write(buildHtml());
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <section className="briefExport">
      <div className="briefExportHead"><div><span>LEAVE-BEHIND BRIEF</span><h3>Give the Commissioner a clean project-delivery summary.</h3></div><FileText /></div>
      <div className="briefExportBody">{sections.map(([heading, copy]) => <article key={heading}><strong>{heading}</strong><p>{copy}</p></article>)}</div>
      <div className="briefExportActions"><button onClick={download}><Download />Download briefing</button><button onClick={print}><Printer />Print / Save as PDF</button></div>
      <div className="briefExportGuard"><ShieldCheck /><span>The exported brief summarizes the demo and proposed pilot. It does not represent official Port data or approval.</span></div>
    </section>
  );
}
