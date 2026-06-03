// db/models.js — Mongoose schemas & models

const mongoose = require('mongoose');
const { Schema } = mongoose;

// ── DEAL ──────────────────────────────────────────────
const DealSchema = new Schema({
  name:     { type: String, required: true, trim: true },
  init:     { type: String, default: '' },
  sector:   { type: String, required: true },
  city:     { type: String, default: 'Mumbai' },
  ask:      { type: Number, default: 0 },
  score:    { type: Number, default: 60, min: 0, max: 100 },
  stage:    { type: String, enum: ['Screening','Due Diligence','Term Sheet','Invested','Passed'], default: 'Screening' },
  priority: { type: String, enum: ['High','Medium','Low'], default: 'Medium' },
  analyst:  { type: String, default: 'Unassigned' },
  days:     { type: Number, default: 0 },
  source:   { type: String, default: 'Cold application' },
  founded:  { type: Number },
  team:     { type: Number, default: 1 },
  bg:       { type: String, default: '#E6F1FB' },
  tc:       { type: String, default: '#0C447C' },
  notes:    { type: String, default: '' },
}, { timestamps: true });

// ── PORTFOLIO ─────────────────────────────────────────
const PortfolioSchema = new Schema({
  name:     { type: String, required: true },
  init:     { type: String, default: '' },
  sector:   { type: String },
  city:     { type: String },
  invested: { type: Number, default: 0 },
  value:    { type: Number, default: 0 },
  moic:     { type: Number, default: 1 },
  irr:      { type: Number, default: 0 },
  stage:    { type: String },
  date:     { type: String },
  bg:       { type: String, default: '#E6F1FB' },
  tc:       { type: String, default: '#0C447C' },
}, { timestamps: true });

// ── TASK ──────────────────────────────────────────────
const TaskSchema = new Schema({
  title:    { type: String, required: true },
  assignee: { type: String, default: 'Unassigned' },
  deal:     { type: String, default: 'General' },
  prio:     { type: String, enum: ['High','Medium','Low'], default: 'Medium' },
  due:      { type: String },
  done:     { type: Boolean, default: false },
  type:     { type: String, default: 'General' },
}, { timestamps: true });

// ── TEAM MEMBER ───────────────────────────────────────
const TeamMemberSchema = new Schema({
  name:  { type: String, required: true },
  init:  { type: String },
  role:  { type: String, enum: ['Partner','VP','Associate','Analyst','Intern'], default: 'Analyst' },
  bg:    { type: String, default: '#E6F1FB' },
  tc:    { type: String, default: '#0C447C' },
  load:  { type: Number, default: 50 },
  tasks: { type: Number, default: 0 },
  email: { type: String, default: '' },
}, { timestamps: true });

// ── COMMENT ───────────────────────────────────────────
const CommentSchema = new Schema({
  deal:    { type: String, required: true },
  author:  { type: String, required: true },
  authorInit: { type: String },
  tag:     { type: String, default: 'Note' },
  text:    { type: String, required: true },
  replies: [{
    author: String,
    authorInit: String,
    text:   String,
    time:   { type: Date, default: Date.now },
  }],
}, { timestamps: true });

// ── TERM SHEET ────────────────────────────────────────
const TermSheetSchema = new Schema({
  dealName:      { type: String, required: true },
  color:         { type: String, default: '#378ADD' },
  sector:        { type: String },
  status:        { type: String, enum: ['Negotiating','Pending sign','Signed'], default: 'Negotiating' },
  ask:           { type: Number },
  equity:        { type: Number },
  postMoney:     { type: Number },
  instrument:    { type: String, default: 'CCPS' },
  founder:       { type: String },
  analyst:       { type: String },
  partner:       { type: String },
  agreedClauses: { type: Number, default: 0 },
  totalClauses:  { type: Number, default: 12 },
  clauses: [{
    name:    String,
    vcPos:   String,
    fndPos:  String,
    status:  { type: String, enum: ['agreed','open','flagged'], default: 'open' },
    note:    String,
  }],
}, { timestamps: true });

module.exports = {
  Deal:       mongoose.model('Deal',       DealSchema),
  Portfolio:  mongoose.model('Portfolio',  PortfolioSchema),
  Task:       mongoose.model('Task',       TaskSchema),
  TeamMember: mongoose.model('TeamMember', TeamMemberSchema),
  Comment:    mongoose.model('Comment',    CommentSchema),
  TermSheet:  mongoose.model('TermSheet',  TermSheetSchema),
};
