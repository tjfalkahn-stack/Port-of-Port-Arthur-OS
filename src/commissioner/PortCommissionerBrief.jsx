import React, { useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  Anchor,
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Film,
  FolderOpen,
  HardHat,
  MapPin,
  Paperclip,
  Plus,
  Search,
  ShieldCheck,
  TrendingUp,
  UploadCloud,
  X,
} from 'lucide-react';
import CommissionerBriefExport from './CommissionerBriefExport';
import './commissioner.css';

const stages = ['Planning', 'Design', 'Procurement', 'Construction', 'Closeout'];

const demoProjects = [
  {
    id: 'berth-modernization',
    name: 'Berth Modernization Program',
    type: 'Capital project',
    location: 'Main Terminal · Waterfront',
    status: 'On track',
    progress: 68,
    stage: 'Construction',
    owner: 'Engineering & Capital Programs',
    nextAction: 'Review the 60% field inspection package',
    due: 'Sep 18, 2026',
    budget: '$48.2M',
    variance: '+1.4%',
    blocker: 'None requiring commissioner action',
    update: 'Pile-cap work advanced this week. The next documented hold point is the field inspection review.',
    footage: [
      { id: 'berth-1', name: 'East apron progress walk', phase: 'Construction', date: 'Sep 11', kind: 'video' },
      { id: 'berth-2', name: 'Waterside foundation inspection', phase: 'Construction', date: 'Sep 8', kind: 'image' },
    ],
    files: [
      { id: 'berth-f1', name: '60-percent-field-inspection.pdf', label: 'Inspection', date: 'Sep 12' },
      { id: 'berth-f2', name: 'change-log-014.xlsx', label: 'Controls', date: 'Sep 10' },
    ],
  },
  {
    id: 'rail-expansion',
    name: 'Intermodal Rail Capacity Expansion',
    type: 'Expansion',
    location: 'Rail & Cargo Yard',
    status: 'Needs attention',
    progress: 34,
    stage: 'Design',
    owner: 'Planning & Infrastructure',
    nextAction: 'Choose the utility-conflict resolution path',
    due: 'Sep 15, 2026',
    budget: '$31.6M',
    variance: '+6.8%',
    blocker: 'Utility relocation decision is holding final design',
    update: 'The design package is otherwise ready to advance. A commissioner decision will protect the procurement date.',
    footage: [
      { id: 'rail-1', name: 'Proposed lead alignment flyover', phase: 'Design', date: 'Sep 9', kind: 'video' },
    ],
    files: [
      { id: 'rail-f1', name: 'utility-options-brief.pdf', label: 'Decision brief', date: 'Sep 12' },
      { id: 'rail-f2', name: 'rail-concept-layout.pdf', label: 'Design', date: 'Sep 7' },
    ],
  },
  {
    id: 'gate-flow',
    name: 'Truck Gate Flow Improvements',
    type: 'Operational improvement',
    location: 'Main Gate · Truck Corridor',
    status: 'On track',
    progress: 82,
    stage: 'Construction',
    owner: 'Operations & Security',
    nextAction: 'Confirm final lane-control commissioning window',
    due: 'Sep 22, 2026',
    budget: '$4.8M',
    variance: '-2.1%',
    blocker: 'Night installation window needs final confirmation',
    update: 'Lane equipment is installed. Controls testing and staff readiness remain before operational handoff.',
    footage: [
      { id: 'gate-1', name: 'Lane equipment commissioning', phase: 'Construction', date: 'Sep 12', kind: 'video' },
    ],
    files: [{ id: 'gate-f1', name: 'commissioning-checklist.pdf', label: 'Checklist', date: 'Sep 12' }],
  },
  {
    id: 'warehouse-rehab',
    name: 'Transit Shed Rehabilitation',
    type: 'Capital project',
    location: 'Cargo & Warehouse District',
    status: 'Completed',
    progress: 100,
    stage: 'Closeout',
    owner: 'Facilities & Maintenance',
    nextAction: 'Archive final warranty and closeout package',
    due: 'Completed Aug 28, 2026',
    budget: '$12.4M',
    variance: '-0.6%',
    blocker: 'No open blockers',
    update: 'The project reached operational acceptance. Final warranty documentation is retained with the closeout record.',
    footage: [
      { id: 'shed-1', name: 'Completed facility walkthrough', phase: 'Closeout', date: 'Aug 28', kind: 'video' },
    ],
    files: [{ id: 'shed-f1', name: 'final-acceptance-package.pdf', label: 'Closeout', date: 'Aug 28' }],
  },
  {
    id: 'yard-expansion',
    name: 'Cargo Yard Expansion Study',
    type: 'Expansion',
    location: 'North Cargo Yard',
    status: 'At risk',
    progress: 18,
    stage: 'Planning',
    owner: 'Commercial & Planning',
    nextAction: 'Approve demand assumptions for the alternatives study',
    due: 'Sep 16, 2026',
    budget: '$750K study',
    variance: '12 days',
    blocker: 'Demand assumptions remain unapproved',
    update: 'Scenario modeling is paused at the approval gate. The selected assumptions will shape acreage and phasing options.',
    footage: [],
    files: [{ id: 'yard-f1', name: 'demand-assumptions-v3.pdf', label: 'Decision brief', date: 'Sep 11' }],
  },
];

const decisionItems = [
  { id: 'd1', projectId: 'rail-expansion', label: 'Utility-conflict path', due: 'Due Sep 15', level: 'Decision needed' },
  { id: 'd2', projectId: 'yard-expansion', label: 'Demand assumptions', due: 'Due Sep 16', level: 'Approval needed' },
  { id: 'd3', projectId: 'gate-flow', label: 'Commissioning window', due: 'Due Sep 22', level: 'Review' },
];

function statusClass(status) {
  return status.toLowerCase().replaceAll(' ', '-');
}

function fileKind(file) {
  if (file.type.startsWith('video/')) return 'video';
  if (file.type.startsWith('image/')) return 'image';
  return 'file';
}

export default function PortCommissionerBrief({
  onEnterPilot,
  projects: suppliedProjects,
  onUploadProjectFile,
}) {
  const [projects, setProjects] = useState(suppliedProjects || demoProjects);
  const [selectedId, setSelectedId] = useState((suppliedProjects || demoProjects)[0]?.id);
  const [filter, setFilter] = useState('Active');
  const [query, setQuery] = useState('');
  const [mediaPhase, setMediaPhase] = useState('All stages');
  const [notice, setNotice] = useState('');
  const mediaInput = useRef(null);
  const fileInput = useRef(null);

  const selected = projects.find((project) => project.id === selectedId) || projects[0];
  const active = projects.filter((project) => project.status !== 'Completed');
  const completed = projects.filter((project) => project.status === 'Completed');
  const expansions = projects.filter((project) => project.type === 'Expansion');
  const attention = active.filter((project) => ['Needs attention', 'At risk'].includes(project.status));
  const averageProgress = active.length
    ? Math.round(active.reduce((total, project) => total + project.progress, 0) / active.length)
    : 0;

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesTab =
        filter === 'All' ||
        (filter === 'Active' && project.status !== 'Completed') ||
        (filter === 'Completed' && project.status === 'Completed') ||
        (filter === 'Expansion' && project.type === 'Expansion');
      const matchesQuery =
        !normalizedQuery ||
        [project.name, project.location, project.owner, project.stage]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery);
      return matchesTab && matchesQuery;
    });
  }, [filter, projects, query]);

  const selectedMedia = (selected?.footage || []).filter(
    (item) => mediaPhase === 'All stages' || item.phase === mediaPhase,
  );

  function chooseProject(projectId) {
    setSelectedId(projectId);
    setMediaPhase('All stages');
    setNotice('');
  }

  async function handleUpload(event, category) {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (!files.length || !selected) return;

    const maxBytes = category === 'footage' ? 250 * 1024 * 1024 : 25 * 1024 * 1024;
    const oversized = files.find((file) => file.size > maxBytes);
    if (oversized) {
      setNotice(`${oversized.name} is larger than the ${category === 'footage' ? '250 MB' : '25 MB'} limit.`);
      return;
    }

    if (onUploadProjectFile) {
      try {
        await onUploadProjectFile({ projectId: selected.id, category, stage: selected.stage, files });
      } catch (error) {
        setNotice(error?.message || 'Upload did not complete. Please try again.');
        return;
      }
    }

    const today = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date());
    setProjects((current) =>
      current.map((project) => {
        if (project.id !== selected.id) return project;
        if (category === 'footage') {
          return {
            ...project,
            footage: [
              ...project.footage,
              ...files.map((file) => ({
                id: `${file.name}-${file.lastModified}`,
                name: file.name,
                phase: project.stage,
                date: today,
                kind: fileKind(file),
                url: URL.createObjectURL(file),
              })),
            ],
          };
        }
        return {
          ...project,
          files: [
            ...project.files,
            ...files.map((file) => ({
              id: `${file.name}-${file.lastModified}`,
              name: file.name,
              label: project.stage,
              date: today,
            })),
          ],
        };
      }),
    );
    setNotice(`${files.length} ${category === 'footage' ? 'media item' : 'project file'}${files.length > 1 ? 's' : ''} added to ${selected.name}.`);
  }

  return (
    <section className="commissioner">
      <header className="commissionerTopbar">
        <div className="commissionerIdentity">
          <div className="commissionerMark"><Anchor /></div>
          <div><span>PORTFLOW PA</span><strong>Commissioner Command</strong></div>
        </div>
        <div className="commissionerSession"><span>COMMISSIONER VIEW</span><small>Portfolio updated Sep 13, 2026 · 12:42 PM</small></div>
      </header>

      <div className="commissionerHero">
        <div><span>CAPITAL DELIVERY OVERVIEW</span><h2>Good afternoon, Commissioner.</h2><p>See what is moving, what is complete, and where your decision can protect the Port's schedule.</p></div>
        <div className="commissionerHeroActions">
          <button className="secondary" onClick={() => document.getElementById('commissioner-brief')?.scrollIntoView({ behavior: 'smooth' })}><FileText /> Briefing export</button>
          <button onClick={onEnterPilot}>Open operations <ArrowRight /></button>
        </div>
      </div>

      <div className="portfolioMetrics" aria-label="Portfolio summary">
        <article><div className="metricIcon"><HardHat /></div><div><span>ACTIVE PROJECTS</span><strong>{active.length}</strong><small>{expansions.length} expansion initiatives</small></div></article>
        <article><div className="metricIcon"><TrendingUp /></div><div><span>PORTFOLIO PROGRESS</span><strong>{averageProgress}%</strong><small>Average across active work</small></div></article>
        <article className={attention.length ? 'metricAttention' : ''}><div className="metricIcon"><AlertTriangle /></div><div><span>NEEDS ATTENTION</span><strong>{attention.length}</strong><small>{decisionItems.length} items in decision queue</small></div></article>
        <article><div className="metricIcon"><CheckCircle2 /></div><div><span>COMPLETED</span><strong>{completed.length}</strong><small>Closeout records retained</small></div></article>
      </div>

      <div className="commandGrid">
        <section className="projectPortfolio">
          <div className="commissionerSectionHead"><div><span>PROJECT PORTFOLIO</span><h3>Every project, one view</h3></div><button className="commissionerIconButton" onClick={onEnterPilot} aria-label="Open workspace to add a project"><Plus /></button></div>
          <div className="projectTools">
            <label className="projectSearch"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects or locations" />{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X /></button>}</label>
            <div className="projectFilterTabs" role="tablist" aria-label="Project filters">
              {['Active', 'Expansion', 'Completed', 'All'].map((item) => <button key={item} role="tab" aria-selected={filter === item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}
            </div>
          </div>
          <div className="projectList">
            {filteredProjects.map((project) => (
              <button className={`projectRow ${selected?.id === project.id ? 'selected' : ''}`} key={project.id} onClick={() => chooseProject(project.id)}>
                <div className="projectRowTop"><div><span className="projectType">{project.type}</span><strong>{project.name}</strong><small><MapPin /> {project.location}</small></div><span className={`statusPill ${statusClass(project.status)}`}>{project.status}</span></div>
                <div className="projectProgressLine"><div><i style={{ width: `${project.progress}%` }} /></div><b>{project.progress}%</b></div>
                <div className="projectRowFoot"><span>{project.stage}</span><span>{project.nextAction}</span><ChevronRight /></div>
              </button>
            ))}
            {!filteredProjects.length && <div className="commissionerEmptyState"><FolderOpen /><strong>No projects match this view.</strong><span>Try another status or search term.</span></div>}
          </div>
        </section>

        <aside className="decisionQueue">
          <div className="commissionerSectionHead"><div><span>YOUR DECISION QUEUE</span><h3>Protect the schedule</h3></div><b>{decisionItems.length}</b></div>
          <div className="decisionList">
            {decisionItems.map((item) => {
              const project = projects.find((entry) => entry.id === item.projectId);
              return <button key={item.id} onClick={() => chooseProject(item.projectId)}><span>{item.level}</span><strong>{item.label}</strong><small>{project?.name}</small><div><Clock3 /> {item.due}<ChevronRight /></div></button>;
            })}
          </div>
          <div className="decisionGuard"><ShieldCheck /><span>Actions remain human-authorized and are written to the project audit trail.</span></div>
        </aside>
      </div>

      {selected && (
        <section className="projectDetail">
          <div className="detailHeader"><div><span>SELECTED PROJECT</span><h3>{selected.name}</h3><p><MapPin /> {selected.location} <i /> {selected.owner}</p></div><div className="detailScore"><strong>{selected.progress}%</strong><span>COMPLETE</span></div></div>
          <div className="stageTracker" aria-label={`Current stage: ${selected.stage}`}>
            {stages.map((stage, index) => {
              const currentIndex = stages.indexOf(selected.stage);
              const state = index < currentIndex ? 'done' : index === currentIndex ? 'current' : 'future';
              return <div key={stage} className={state}><b>{index < currentIndex ? '✓' : index + 1}</b><span>{stage}</span></div>;
            })}
          </div>
          <div className="detailFacts">
            <article><span>CURRENT STAGE</span><strong>{selected.stage}</strong><small>{selected.update}</small></article>
            <article><span>NEXT ACTION</span><strong>{selected.nextAction}</strong><small><CalendarDays /> {selected.due}</small></article>
            <article className={selected.status === 'On track' || selected.status === 'Completed' ? '' : 'riskFact'}><span>BLOCKER / RISK</span><strong>{selected.blocker}</strong><small>Variance: {selected.variance}</small></article>
            <article><span>PROGRAM VALUE</span><strong>{selected.budget}</strong><small>Demo portfolio amount</small></article>
          </div>

          <div className="evidenceGrid">
            <section className="projectEvidence">
              <div className="evidenceHead"><div><span>PROGRESS FOOTAGE</span><h4>See the work by project stage</h4></div><button onClick={() => mediaInput.current?.click()}><UploadCloud /> Upload footage</button><input ref={mediaInput} hidden type="file" accept="video/*,image/*" multiple onChange={(event) => handleUpload(event, 'footage')} /></div>
              <div className="projectStageFilters">{['All stages', ...stages].map((stage) => <button key={stage} className={mediaPhase === stage ? 'active' : ''} onClick={() => setMediaPhase(stage)}>{stage}</button>)}</div>
              <div className="mediaGrid">
                {selectedMedia.map((item) => <article key={item.id}><div className={`mediaThumb ${item.kind}`}>{item.url && item.kind === 'image' ? <img src={item.url} alt="Uploaded project progress" /> : item.url && item.kind === 'video' ? <video src={item.url} controls preload="metadata" aria-label={item.name} /> : <Film />}<span>{item.phase}</span></div><strong>{item.name}</strong><small>{item.date}</small></article>)}
                {!selectedMedia.length && <div className="commissionerEmptyEvidence"><Film /><strong>No footage in this stage yet.</strong><span>Upload field video or photos and they will be filed under {selected.stage}.</span></div>}
              </div>
            </section>

            <section className="projectFiles">
              <div className="evidenceHead"><div><span>PROJECT FILES</span><h4>Decision-ready documents</h4></div><button onClick={() => fileInput.current?.click()}><Paperclip /> Add files</button><input ref={fileInput} hidden type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.jpg,.jpeg,.png" multiple onChange={(event) => handleUpload(event, 'files')} /></div>
              <div className="fileList">{selected.files.map((file) => <div className="projectFileRow" key={file.id}><FileText /><span><strong>{file.name}</strong><small>{file.label} · {file.date}</small></span></div>)}</div>
              <div className="filePolicy"><ShieldCheck /><span>Files inherit project access, stage, uploader, timestamp, and retention controls when connected to approved storage.</span></div>
            </section>
          </div>
          {notice && <div className="uploadNotice" role="status"><CheckCircle2 /> {notice}<button onClick={() => setNotice('')} aria-label="Dismiss"><X /></button></div>}
        </section>
      )}

      <section className="expansionSection">
        <div className="commissionerSectionHead"><div><span>EXPANSION PROGRAM</span><h3>Growth initiatives at a glance</h3></div><button onClick={() => { setFilter('Expansion'); document.querySelector('.projectPortfolio')?.scrollIntoView({ behavior: 'smooth' }); }}>View all expansion work <ArrowRight /></button></div>
        <div className="expansionCards">{expansions.map((project) => <button key={project.id} onClick={() => chooseProject(project.id)}><Building2 /><span>{project.stage}</span><strong>{project.name}</strong><small>{project.location}</small><div><i style={{ width: `${project.progress}%` }} /></div><b>{project.progress}% complete</b></button>)}</div>
      </section>

      <section id="commissioner-brief" className="briefingSection"><div className="briefingIntro"><span>PORTFLOW BRIEFING</span><h3>Commissioner leave-behind</h3><p>Export the pilot purpose, operating controls, and success measures for a meeting or board packet.</p></div><CommissionerBriefExport /></section>
      <div className="commissionerGuard"><ShieldCheck /><span>This dashboard is seeded with clearly labeled demonstration data until connected to approved Port sources. PortFlow coordinates work and evidence; it does not replace terminal, security, cargo, finance, or access-control systems.</span></div>
    </section>
  );
}
