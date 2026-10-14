import * as migration_20261008_073844_initial from './20261008_073844_initial';
import * as migration_20261012_061638_crm from './20261012_061638_crm';
import * as migration_20261012_071632_email_editor from './20261012_071632_email_editor';
import * as migration_20261012_111058_home_page from './20261012_111058_home_page';
import * as migration_20261012_114630_founder_points_removed from './20261012_114630_founder_points_removed';
import * as migration_20261012_180900_site_details from './20261012_180900_site_details';
import * as migration_20261012_181820_fact_sheet_review_note from './20261012_181820_fact_sheet_review_note';
import * as migration_20261012_181900_pms_fact_sheet from './20261012_181900_pms_fact_sheet';
import * as migration_20261013_105359_pms_page from './20261013_105359_pms_page';
import * as migration_20261013_111455_about_page_and_team from './20261013_111455_about_page_and_team';
import * as migration_20261013_112654_investor_centre_contact_documents from './20261013_112654_investor_centre_contact_documents';
import * as migration_20261013_115823_remaining_pages from './20261013_115823_remaining_pages';
import * as migration_20261014_062217_ai_switches_in_admin from './20261014_062217_ai_switches_in_admin';

export const migrations = [
  {
    up: migration_20261008_073844_initial.up,
    down: migration_20261008_073844_initial.down,
    name: '20261008_073844_initial',
  },
  {
    up: migration_20261012_061638_crm.up,
    down: migration_20261012_061638_crm.down,
    name: '20261012_061638_crm',
  },
  {
    up: migration_20261012_071632_email_editor.up,
    down: migration_20261012_071632_email_editor.down,
    name: '20261012_071632_email_editor',
  },
  {
    up: migration_20261012_111058_home_page.up,
    down: migration_20261012_111058_home_page.down,
    name: '20261012_111058_home_page',
  },
  {
    up: migration_20261012_114630_founder_points_removed.up,
    down: migration_20261012_114630_founder_points_removed.down,
    name: '20261012_114630_founder_points_removed',
  },
  {
    up: migration_20261012_180900_site_details.up,
    down: migration_20261012_180900_site_details.down,
    name: '20261012_180900_site_details',
  },
  {
    up: migration_20261012_181820_fact_sheet_review_note.up,
    down: migration_20261012_181820_fact_sheet_review_note.down,
    name: '20261012_181820_fact_sheet_review_note',
  },
  {
    up: migration_20261012_181900_pms_fact_sheet.up,
    down: migration_20261012_181900_pms_fact_sheet.down,
    name: '20261012_181900_pms_fact_sheet',
  },
  {
    up: migration_20261013_105359_pms_page.up,
    down: migration_20261013_105359_pms_page.down,
    name: '20261013_105359_pms_page',
  },
  {
    up: migration_20261013_111455_about_page_and_team.up,
    down: migration_20261013_111455_about_page_and_team.down,
    name: '20261013_111455_about_page_and_team',
  },
  {
    up: migration_20261013_112654_investor_centre_contact_documents.up,
    down: migration_20261013_112654_investor_centre_contact_documents.down,
    name: '20261013_112654_investor_centre_contact_documents',
  },
  {
    up: migration_20261013_115823_remaining_pages.up,
    down: migration_20261013_115823_remaining_pages.down,
    name: '20261013_115823_remaining_pages',
  },
  {
    up: migration_20261014_062217_ai_switches_in_admin.up,
    down: migration_20261014_062217_ai_switches_in_admin.down,
    name: '20261014_062217_ai_switches_in_admin'
  },
];
