ALTER TABLE "dictionaries" RENAME TO "dict";--> statement-breakpoint
ALTER TABLE "dictionary_data" RENAME TO "dict-detail";--> statement-breakpoint
ALTER TABLE "dict-detail" RENAME COLUMN "dictionary_id" TO "dict_id";--> statement-breakpoint
ALTER TABLE "dict" RENAME CONSTRAINT "dictionaries_pkey" TO "dict_pkey";--> statement-breakpoint
ALTER TABLE "dict-detail" RENAME CONSTRAINT "dictionary_data_pkey" TO "dict-detail_pkey";--> statement-breakpoint
ALTER TABLE "dict" RENAME CONSTRAINT "dictionaries_type_unique" TO "dict_type_unique";--> statement-breakpoint
ALTER TABLE "dict-detail" RENAME CONSTRAINT "dictionary_data_dictionary_value_unique" TO "dict_detail_dict_value_unique";--> statement-breakpoint
ALTER TABLE "dict-detail" RENAME CONSTRAINT "dictionary_data_dictionary_id_dictionaries_id_fk" TO "dict-detail_dict_id_dict_id_fk";
