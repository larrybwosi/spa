#!/usr/bin/env node

/**
 * ==============================================================================
 * AURA WELLNESS SANCTUARY - ENVIRONMENT GENERATION & SYNC SCRIPT
 * ==============================================================================
 * This script automates generating secure credentials (such as BETTER_AUTH_SECRET
 * and randomized POSTGRES_PASSWORD) and populating/copying the .env file
 * to the root and child workspace apps (apps/api and apps/web).
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT_DIR = __dirname;
const ENV_EXAMPLE_PATH = path.join(ROOT_DIR, '.env.example');
const ENV_ROOT_PATH = path.join(ROOT_DIR, '.env');
const API_ENV_PATH = path.join(ROOT_DIR, 'apps', 'api', '.env');
const WEB_ENV_PATH = path.join(ROOT_DIR, 'apps', 'web', '.env');

/**
 * Generates a high-entropy random string.
 * @param {number} bytes Number of bytes to generate.
 * @returns {string} Hex encoded random string.
 */
function generateSecureSecret(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Main execution flow
 */
function main() {
  console.log('✨ [Aura Env Generator] Starting environment verification & configuration...');

  let envContent = '';

  // 1. Check or generate root .env file
  if (!fs.existsSync(ENV_ROOT_PATH)) {
    console.log('📌 [Aura Env Generator] Root .env not found. Creating from .env.example...');

    if (!fs.existsSync(ENV_EXAMPLE_PATH)) {
      console.error('❌ [Aura Env Generator] Error: .env.example not found at ' + ENV_EXAMPLE_PATH);
      process.exit(1);
    }

    let exampleContent = fs.readFileSync(ENV_EXAMPLE_PATH, 'utf8');

    // Generate secure randomized secrets
    const secureAuthSecret = generateSecureSecret(32);
    const secureDbPassword = generateSecureSecret(16);

    // Dynamic replacement in the template content
    let modifiedContent = exampleContent
      .replace('POSTGRES_PASSWORD=postgres', `POSTGRES_PASSWORD=${secureDbPassword}`)
      .replace('generate_on_install', secureAuthSecret);

    // Update the DB url to use the secure password
    // Replace 'postgresql://postgres:postgres@db:5432' with 'postgresql://postgres:PASSWORD@db:5432'
    modifiedContent = modifiedContent.replace(
      'DATABASE_URL=postgresql://postgres:postgres@db:5432/spa_database?sslmode=disable',
      `DATABASE_URL=postgresql://postgres:${secureDbPassword}@db:5432/spa_database?sslmode=disable`
    );

    fs.writeFileSync(ENV_ROOT_PATH, modifiedContent, 'utf8');
    console.log('✅ [Aura Env Generator] Secure root .env successfully generated.');
    envContent = modifiedContent;
  } else {
    console.log('ℹ️ [Aura Env Generator] Root .env already exists.');
    envContent = fs.readFileSync(ENV_ROOT_PATH, 'utf8');
  }

  // 2. Ensure apps directory exists and sync environment files
  const syncTargets = [API_ENV_PATH, WEB_ENV_PATH];

  for (const targetPath of syncTargets) {
    const parentDir = path.dirname(targetPath);
    if (fs.existsSync(parentDir)) {
      fs.writeFileSync(targetPath, envContent, 'utf8');
      console.log(`✅ [Aura Env Generator] Synced .env to target: ${path.relative(ROOT_DIR, targetPath)}`);
    } else {
      console.warn(`⚠️ [Aura Env Generator] Skipping copy. Target directory does not exist: ${parentDir}`);
    }
  }

  console.log('🎉 [Aura Env Generator] Environment configuration check complete.');
}

if (require.main === module) {
  main();
}
