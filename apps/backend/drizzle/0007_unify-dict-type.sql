ALTER TABLE "dict" RENAME COLUMN "type" TO "dict_type";--> statement-breakpoint
ALTER TABLE "dict-detail" RENAME COLUMN "dict_id" TO "dict_type";--> statement-breakpoint
ALTER TABLE "dict-detail" DROP CONSTRAINT "dict-detail_dict_id_dict_id_fk";
--> statement-breakpoint
ALTER TABLE "dict-detail" ALTER COLUMN "dict_type" SET DATA TYPE varchar(100) USING "dict_type"::text;--> statement-breakpoint
-- 将原字典编号转换为所属字典的类型标识，保留已有详情数据。
UPDATE "dict-detail" AS detail
SET "dict_type" = dict."dict_type"
FROM "dict" AS dict
WHERE detail."dict_type" = dict."id"::text;--> statement-breakpoint
ALTER TABLE "dict-detail" ADD CONSTRAINT "dict-detail_dict_type_dict_dict_type_fk" FOREIGN KEY ("dict_type") REFERENCES "public"."dict"("dict_type") ON DELETE restrict ON UPDATE cascade;
