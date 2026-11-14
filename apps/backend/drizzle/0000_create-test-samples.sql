CREATE TABLE "test_samples" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"icon" varchar(100) DEFAULT '' NOT NULL,
	"number" double precision DEFAULT 0 NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"single_select" varchar(50) NOT NULL,
	"multi_select" text[] DEFAULT '{}' NOT NULL,
	"operator" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
