CREATE TABLE "dictionaries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"type" varchar(100) NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"remark" varchar(500) DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "dictionaries_type_unique" UNIQUE("type")
);
--> statement-breakpoint
CREATE TABLE "dictionary_data" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dictionary_id" uuid NOT NULL,
	"label" varchar(100) NOT NULL,
	"value" varchar(100) NOT NULL,
	"index" integer DEFAULT 0 NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"tag_type" varchar(10) DEFAULT 'primary' NOT NULL,
	"remark" varchar(500) DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "dictionary_data_dictionary_value_unique" UNIQUE("dictionary_id","value")
);
--> statement-breakpoint
ALTER TABLE "dictionary_data" ADD CONSTRAINT "dictionary_data_dictionary_id_dictionaries_id_fk" FOREIGN KEY ("dictionary_id") REFERENCES "public"."dictionaries"("id") ON DELETE restrict ON UPDATE no action;