CREATE TABLE `studyReviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(180) NOT NULL,
	`subject` varchar(120) NOT NULL,
	`difficulty` enum('easy','medium','hard') NOT NULL,
	`scheduledFor` timestamp NOT NULL,
	`status` enum('pending','completed','postponed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `studyReviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `studySubjects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(120) NOT NULL,
	`weeklyMinutes` int NOT NULL DEFAULT 0,
	`studiedMinutes` int NOT NULL DEFAULT 0,
	`color` varchar(20) NOT NULL DEFAULT '#6869e6',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `studySubjects_id` PRIMARY KEY(`id`)
);
