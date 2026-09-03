CREATE TABLE `gallery_items` (
	`media_id` text PRIMARY KEY NOT NULL,
	`gallery` text DEFAULT 'welding' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_gallery_items_gallery_order` ON `gallery_items` (`gallery`,`sort_order`);