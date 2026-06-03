// db/seed.js — Run once to populate MongoDB
// Usage: node db/seed.js

require('dotenv').config();
const mongoose = require('mongoose');
const { Deal, Portfolio, Task, TeamMember, TermSheet } = require('./models');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vertex-capital';

const DEALS = [
  { name:'FinNova AI',     init:'FN', sector:'Fintech',    city:'Mumbai',    ask:8,   score:84, stage:'Due Diligence', priority:'High',   analyst:'Priya S.',  days:14, source:'Partner referral', founded:2022, team:6,  bg:'#E6F1FB', tc:'#0C447C' },
  { name:'AgriLink',       init:'AG', sector:'AgriTech',   city:'Pune',      ask:3,   score:78, stage:'Term Sheet',    priority:'High',   analyst:'Rajan M.',  days:22, source:'Accelerator',      founded:2021, team:9,  bg:'#EAF3DE', tc:'#27500A' },
  { name:'HealthXR',       init:'HX', sector:'HealthTech', city:'Bengaluru', ask:5,   score:71, stage:'Screening',     priority:'High',   analyst:'Ananya K.', days:3,  source:'Cold application', founded:2023, team:4,  bg:'#FBEAF0', tc:'#72243E' },
  { name:'EduDost',        init:'ED', sector:'EdTech',     city:'Delhi',     ask:2.5, score:65, stage:'Screening',     priority:'Medium', analyst:'Vikram T.', days:6,  source:'Founder network',  founded:2022, team:5,  bg:'#FAEEDA', tc:'#633806' },
  { name:'ClimaTech Labs', init:'CL', sector:'CleanTech',  city:'Hyderabad', ask:12,  score:88, stage:'Due Diligence', priority:'High',   analyst:'Priya S.',  days:9,  source:'Partner referral', founded:2021, team:12, bg:'#E1F5EE', tc:'#085041' },
  { name:'SkillBridge',    init:'SB', sector:'EdTech',     city:'Bengaluru', ask:3.5, score:74, stage:'Screening',     priority:'Medium', analyst:'Priya S.',  days:8,  source:'Accelerator',      founded:2022, team:7,  bg:'#EEEDFE', tc:'#3C3489' },
  { name:'RetailAI',       init:'RA', sector:'SaaS',       city:'Delhi',     ask:4.5, score:69, stage:'Screening',     priority:'Medium', analyst:'Vikram T.', days:2,  source:'Cold application', founded:2023, team:5,  bg:'#FAECE7', tc:'#712B13' },
  { name:'GreenGrid',      init:'GG', sector:'CleanTech',  city:'Hyderabad', ask:9,   score:77, stage:'Due Diligence', priority:'Medium', analyst:'Ananya K.', days:11, source:'Angel syndicate',  founded:2021, team:10, bg:'#E1F5EE', tc:'#085041' },
  { name:'LogiTrack',      init:'LT', sector:'SaaS',       city:'Delhi',     ask:5.5, score:82, stage:'Term Sheet',    priority:'Medium', analyst:'Vikram T.', days:18, source:'Accelerator',      founded:2021, team:8,  bg:'#EEEDFE', tc:'#3C3489' },
  { name:'DataMesh',       init:'DM', sector:'SaaS',       city:'Bengaluru', ask:8,   score:85, stage:'Term Sheet',    priority:'High',   analyst:'Priya S.',  days:25, source:'Partner referral', founded:2020, team:15, bg:'#EEEDFE', tc:'#3C3489' },
  { name:'NovaPay',        init:'NP', sector:'Fintech',    city:'Bengaluru', ask:6.5, score:76, stage:'Due Diligence', priority:'Medium', analyst:'Priya S.',  days:7,  source:'Founder network',  founded:2022, team:9,  bg:'#E6F1FB', tc:'#0C447C' },
  { name:'SolarBridge',    init:'SB', sector:'CleanTech',  city:'Hyderabad', ask:10,  score:79, stage:'Due Diligence', priority:'Medium', analyst:'Vikram T.', days:13, source:'Angel syndicate',  founded:2021, team:11, bg:'#E1F5EE', tc:'#085041' },
];

const PORTFOLIO = [
  { name:'PaySwift',   init:'PS', sector:'Fintech',    city:'Mumbai',    invested:6,  value:18.2, moic:3.03, irr:48, stage:'Series B', date:'Mar 2023', bg:'#E6F1FB', tc:'#0C447C' },
  { name:'NeoBank',    init:'NB', sector:'Fintech',    city:'Mumbai',    invested:15, value:38.5, moic:2.57, irr:39, stage:'Series A', date:'Sep 2023', bg:'#EAF3DE', tc:'#27500A' },
  { name:'MediScan',   init:'MS', sector:'HealthTech', city:'Chennai',   invested:4,  value:9.6,  moic:2.40, irr:34, stage:'Pre-A',    date:'Jan 2024', bg:'#FBEAF0', tc:'#72243E' },
  { name:'KisanNet',   init:'KN', sector:'AgriTech',   city:'Pune',      invested:2.5,value:4.8,  moic:1.92, irr:28, stage:'Seed',     date:'Jun 2023', bg:'#FAEEDA', tc:'#633806' },
  { name:'SkyLearn',   init:'SL', sector:'EdTech',     city:'Bengaluru', invested:3,  value:5.1,  moic:1.70, irr:22, stage:'Seed',     date:'Nov 2023', bg:'#EEEDFE', tc:'#3C3489' },
  { name:'CoolCarbon', init:'CC', sector:'CleanTech',  city:'Hyderabad', invested:8,  value:11.2, moic:1.40, irr:18, stage:'Pre-A',    date:'Feb 2024', bg:'#EAF3DE', tc:'#27500A' },
];

const TASKS = [
  { title:'Review FinNova AI audited financials FY24',  assignee:'Priya S.',  deal:'FinNova AI',     prio:'High',   due:'2026-04-02', done:false, type:'Financial' },
  { title:'FinNova cap table & dilution analysis',       assignee:'Priya S.',  deal:'FinNova AI',     prio:'High',   due:'2026-04-05', done:false, type:'Financial' },
  { title:'AgriLink term sheet final negotiation',       assignee:'Rajan M.',  deal:'AgriLink',       prio:'High',   due:'2026-04-01', done:false, type:'Legal'     },
  { title:'ClimaTech technical feasibility audit',       assignee:'Ananya K.', deal:'ClimaTech Labs', prio:'Medium', due:'2026-04-08', done:false, type:'Technical' },
  { title:'HealthXR founder reference calls (3)',        assignee:'Ananya K.', deal:'HealthXR',       prio:'Medium', due:'2026-04-06', done:false, type:'Reference' },
  { title:'DataMesh IC presentation memo draft',         assignee:'Priya S.',  deal:'DataMesh',       prio:'High',   due:'2026-04-03', done:false, type:'IC Prep'   },
  { title:'EduDost initial screening call notes',        assignee:'Vikram T.', deal:'EduDost',        prio:'Low',    due:'2026-04-10', done:true,  type:'Screening' },
  { title:'FinNova RBI compliance check',                assignee:'Vikram T.', deal:'FinNova AI',     prio:'Medium', due:'2026-04-07', done:false, type:'Legal'     },
  { title:'Portfolio MIS Q4 report — NeoBank',           assignee:'Rajan M.',  deal:'NeoBank',        prio:'Medium', due:'2026-04-04', done:false, type:'Portfolio' },
  { title:'AgriLink SHA first draft review',             assignee:'Priya S.',  deal:'AgriLink',       prio:'High',   due:'2026-03-31', done:false, type:'Legal'     },
];

const MEMBERS = [
  { name:'Priya S.',  init:'PS', role:'Partner',   bg:'#E6F1FB', tc:'#0C447C', load:85, tasks:8  },
  { name:'Rajan M.',  init:'RM', role:'VP',        bg:'#EEEDFE', tc:'#3C3489', load:72, tasks:6  },
  { name:'Ananya K.', init:'AK', role:'Associate', bg:'#EAF3DE', tc:'#27500A', load:78, tasks:7  },
  { name:'Vikram T.', init:'VT', role:'VP',        bg:'#FAEEDA', tc:'#633806', load:60, tasks:5  },
  { name:'Neha R.',   init:'NR', role:'Associate', bg:'#FBEAF0', tc:'#72243E', load:55, tasks:4  },
  { name:'Arjun D.',  init:'AD', role:'Analyst',   bg:'#FAECE7', tc:'#712B13', load:30, tasks:2  },
  { name:'Sana P.',   init:'SP', role:'Intern',    bg:'#E1F5EE', tc:'#085041', load:20, tasks:1  },
  { name:'Rohan V.',  init:'RV', role:'Analyst',   bg:'#F1EFE8', tc:'#444441', load:15, tasks:1  },
];

const TERMSHEETS = [
  { dealName:'AgriLink', color:'#1D9E75', sector:'AgriTech',  status:'Signed',       ask:3,   equity:19.5, postMoney:15.4, instrument:'CCPS', founder:'Kabir Nair',   analyst:'Rajan M.', partner:'Priya S.', agreedClauses:12, totalClauses:12 },
  { dealName:'DataMesh', color:'#7F77DD', sector:'SaaS',       status:'Negotiating',  ask:5.5, equity:17,   postMoney:32.4, instrument:'CCPS', founder:'Shreya Iyer',  analyst:'Priya S.', partner:'Priya S.', agreedClauses:5,  totalClauses:12 },
  { dealName:'LogiTrack',color:'#D85A30', sector:'SaaS',       status:'Pending sign', ask:8,   equity:22,   postMoney:36.4, instrument:'CCPS', founder:'Manish Batra', analyst:'Vikram T.',partner:'Rajan M.', agreedClauses:12, totalClauses:12 },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing
    await Promise.all([
      Deal.deleteMany({}),
      Portfolio.deleteMany({}),
      Task.deleteMany({}),
      TeamMember.deleteMany({}),
      TermSheet.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    // Insert fresh
    await Deal.insertMany(DEALS);
    await Portfolio.insertMany(PORTFOLIO);
    await Task.insertMany(TASKS);
    await TeamMember.insertMany(MEMBERS);
    await TermSheet.insertMany(TERMSHEETS);

    console.log('✅ Seed complete!');
    console.log(`  Deals: ${DEALS.length}`);
    console.log(`  Portfolio: ${PORTFOLIO.length}`);
    console.log(`  Tasks: ${TASKS.length}`);
    console.log(`  Team members: ${MEMBERS.length}`);
    console.log(`  Term sheets: ${TERMSHEETS.length}`);

    mongoose.disconnect();
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
