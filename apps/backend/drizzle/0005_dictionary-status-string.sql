-- 转换前移除布尔默认值，现有启用、停用状态分别映射为字符串 '1'、'0'。
ALTER TABLE "dictionaries" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "dictionaries" ALTER COLUMN "status" SET DATA TYPE varchar(50) USING CASE WHEN "status" THEN '1' ELSE '0' END;--> statement-breakpoint
ALTER TABLE "dictionaries" ALTER COLUMN "status" SET DEFAULT '1';--> statement-breakpoint
ALTER TABLE "dictionary_data" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "dictionary_data" ALTER COLUMN "status" SET DATA TYPE varchar(50) USING CASE WHEN "status" THEN '1' ELSE '0' END;--> statement-breakpoint
ALTER TABLE "dictionary_data" ALTER COLUMN "status" SET DEFAULT '1';
