#!/usr/bin/env node
/**
 * ============================================================
 * BACKUP SCRIPT — Export data before migration
 * ============================================================
 * Run: node scripts/backup.mjs
 *
 * Creates timestamped backup folder with:
 *   - JSON exports of all collections
 *   - mongodump command for full binary backup
 *   - Backup manifest (metadata)
 * ============================================================
 */

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ MONGODB_URI not found'); process.exit(1); }

// ── Schema Definitions ────────────────────────────────────────
const schemas = {
  users:       new mongoose.Schema({}, { strict: false }),
  courses:     new mongoose.Schema({}, { strict: false }),
  payments:    new mongoose.Schema({}, { strict: false }),
  enrollments: new mongoose.Schema({}, { strict: false }),
  staffs:      new mongoose.Schema({}, { strict: false }),
};

async function backup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupDir = path.join(__dirname, '../backups', `backup-${timestamp}`);
  fs.mkdirSync(backupDir, { recursive: true });

  console.log('\n📦 Starting database backup...');
  console.log(`📁 Backup directory: ${backupDir}\n`);

  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB\n');

  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  const manifest = {
    timestamp, source: MONGODB_URI.replace(/\/\/.*@/, '//***:***@'),
    dbName: mongoose.connection.name, collections: {},
  };

  for (const col of collections) {
    const name = col.name;
    const docs = await db.collection(name).find({}).toArray();
    const filePath = path.join(backupDir, `${name}.json`);
    fs.writeFileSync(filePath, JSON.stringify(docs, null, 2), 'utf-8');
    manifest.collections[name] = docs.length;
    console.log(`   ✓ ${name}: ${docs.length} documents → ${name}.json`);
  }

  // Save manifest
  fs.writeFileSync(path.join(backupDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

  console.log('\n📋 Backup Manifest saved: manifest.json');
  console.log('\n💡 For binary backup using mongodump, run:');
  console.log(`   mongodump --uri="${MONGODB_URI}" --out="${backupDir}/mongodump"\n`);
  console.log('✅ Backup complete!\n');

  await mongoose.disconnect();
}

backup().catch(err => { console.error('❌ Backup failed:', err.message); process.exit(1); });
