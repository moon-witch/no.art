import {
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export const contentStatus = pgEnum('content_status', ['draft', 'published'])

export type LocalizedText = Partial<Record<'en' | 'de', string>>

export const assets = pgTable('assets', {
  id: uuid('id').defaultRandom().primaryKey(),
  objectKey: text('object_key').notNull(),
  originalFilename: text('original_filename').notNull(),
  contentType: text('content_type').notNull(),
  sizeBytes: integer('size_bytes').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex('assets_object_key_unique').on(table.objectKey),
])

export const quotes = pgTable('quotes', {
  id: uuid('id').defaultRandom().primaryKey(),
  status: contentStatus('status').default('draft').notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  imageAssetId: uuid('image_asset_id').references(() => assets.id, { onDelete: 'set null' }),
  imageAlt: text('image_alt').notNull(),
  quoteText: text('quote_text').notNull(),
  attribution: text('attribution').notNull(),
  reflection: jsonb('reflection').$type<LocalizedText>().notNull(),
  desktopPlacement: jsonb('desktop_placement').$type<{ x: number, y: number, scale?: number }>().notNull(),
  mobilePlacement: jsonb('mobile_placement').$type<{ x: number, y: number, scale?: number }>().notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('quotes_public_order_index').on(table.status, table.displayOrder),
])

export const backgroundSymbols = pgTable('background_symbols', {
  id: uuid('id').defaultRandom().primaryKey(),
  status: contentStatus('status').default('draft').notNull(),
  assetId: uuid('asset_id').references(() => assets.id, { onDelete: 'set null' }),
  label: text('label'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const countries = pgTable('countries', {
  code: varchar('code', { length: 3 }).primaryKey(),
  status: contentStatus('status').default('draft').notNull(),
  visited: boolean('visited').default(false).notNull(),
  note: jsonb('note').$type<LocalizedText>().notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('countries_public_visited_index').on(table.status, table.visited),
])

export const countryMarkers = pgTable('country_markers', {
  id: uuid('id').defaultRandom().primaryKey(),
  countryCode: varchar('country_code', { length: 3 }).notNull().references(() => countries.code, { onDelete: 'cascade' }),
  status: contentStatus('status').default('draft').notNull(),
  latitude: doublePrecision('latitude').notNull(),
  longitude: doublePrecision('longitude').notNull(),
  label: text('label'),
  note: jsonb('note').$type<LocalizedText>().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('country_markers_country_index').on(table.countryCode, table.status),
])
