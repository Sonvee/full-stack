ALTER TABLE "test_samples" RENAME COLUMN "enabled" TO "status";--> statement-breakpoint
-- 移除旧布尔默认值，仅将已有记录的 true、false 分别转换为字典值 '1'、'0'。
ALTER TABLE "test_samples" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "test_samples" ALTER COLUMN "status" SET DATA TYPE varchar(100) USING CASE WHEN "status" THEN '1' ELSE '0' END;--> statement-breakpoint
ALTER TABLE "test_samples" ALTER COLUMN "single_select" SET DATA TYPE varchar(100);
