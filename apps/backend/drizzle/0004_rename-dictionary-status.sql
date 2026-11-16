ALTER TABLE "dictionaries" RENAME COLUMN "enabled" TO "status";--> statement-breakpoint
ALTER TABLE "dictionary_data" RENAME COLUMN "enabled" TO "status";