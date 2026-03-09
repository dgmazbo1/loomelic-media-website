CREATE TABLE `contracts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contractType` enum('contractor','client') NOT NULL,
	`status` enum('draft','sent','signed','completed','cancelled','expired') NOT NULL DEFAULT 'draft',
	`signingToken` varchar(128),
	`vendorId` int,
	`dealerId` int,
	`clientName` varchar(256),
	`clientEmail` varchar(320),
	`contractorRole` varchar(128),
	`eventDate` varchar(32),
	`eventCity` varchar(128),
	`equipmentDetails` text,
	`equipmentSummary` text,
	`amount` int,
	`isRevenue` int NOT NULL DEFAULT 0,
	`contractBody` text,
	`signedAt` timestamp,
	`signatureData` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contracts_id` PRIMARY KEY(`id`),
	CONSTRAINT `contracts_signingToken_unique` UNIQUE(`signingToken`)
);
--> statement-breakpoint
CREATE TABLE `crm_contacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(256) NOT NULL,
	`email` varchar(320),
	`phone` varchar(32),
	`company` varchar(256),
	`title` varchar(128),
	`contactType` enum('lead','client','partner','vendor','other') NOT NULL DEFAULT 'lead',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `crm_contacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `crm_deals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contactId` int,
	`dealerId` int,
	`title` varchar(256) NOT NULL,
	`stage` enum('lead','qualified','proposal','negotiation','closed_won','closed_lost') NOT NULL DEFAULT 'lead',
	`value` int,
	`notes` text,
	`expectedCloseDate` varchar(32),
	`closedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `crm_deals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `crm_incidents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(256) NOT NULL,
	`description` text,
	`severity` enum('low','medium','high','critical') NOT NULL DEFAULT 'medium',
	`status` enum('open','investigating','resolved','closed') NOT NULL DEFAULT 'open',
	`reportedBy` varchar(256),
	`dealerId` int,
	`vendorId` int,
	`resolvedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `crm_incidents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `crm_tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(256) NOT NULL,
	`description` text,
	`assignedTo` varchar(256),
	`priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
	`status` enum('open','in_progress','completed','cancelled') NOT NULL DEFAULT 'open',
	`dueDate` varchar(32),
	`dealerId` int,
	`vendorId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `crm_tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dealer_comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dealerId` int NOT NULL,
	`authorName` varchar(256),
	`authorRole` varchar(64),
	`content` text NOT NULL,
	`isAdminComment` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `dealer_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dealer_compliance` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dealerId` int NOT NULL,
	`oemRestrictions` text,
	`brandGuidelines` text,
	`additionalRestrictions` text,
	`acknowledgedDeliverables` int DEFAULT 0,
	`acknowledgedPolicies` int DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dealer_compliance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dealer_contacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dealerId` int NOT NULL,
	`contactType` varchar(64),
	`name` varchar(256),
	`title` varchar(128),
	`email` varchar(320),
	`phone` varchar(32),
	`preferredMethod` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `dealer_contacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dealer_files` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dealerId` int NOT NULL,
	`filename` varchar(512),
	`fileKey` text NOT NULL,
	`url` text NOT NULL,
	`mimeType` varchar(128),
	`sizeBytes` int,
	`uploadedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `dealer_files_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dealer_monthly_inputs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dealerId` int NOT NULL,
	`inputType` enum('special','campaign','promotion','event') NOT NULL,
	`title` varchar(256),
	`description` text,
	`startDate` varchar(32),
	`endDate` varchar(32),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `dealer_monthly_inputs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dealer_platform_access` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dealerId` int NOT NULL,
	`platform` varchar(128),
	`username` varchar(256),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `dealer_platform_access_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dealers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`token` varchar(128) NOT NULL,
	`status` enum('invited','in_progress','submitted','under_review','approved','active','paused','rejected','archived','cancelled') NOT NULL DEFAULT 'invited',
	`legalName` varchar(256),
	`storeName` varchar(256),
	`slogan` varchar(512),
	`address` text,
	`city` varchar(128),
	`state` varchar(64),
	`zip` varchar(20),
	`phone` varchar(32),
	`timezone` varchar(64),
	`businessHours` text,
	`dealershipStructure` varchar(128),
	`completionScore` int NOT NULL DEFAULT 0,
	`submittedAt` timestamp,
	`approvedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dealers_id` PRIMARY KEY(`id`),
	CONSTRAINT `dealers_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `vendor_jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`vendorId` int NOT NULL,
	`projectId` int,
	`title` varchar(256) NOT NULL,
	`description` text,
	`eventDate` varchar(32),
	`eventCity` varchar(128),
	`status` enum('pending','confirmed','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
	`deliverablesDue` varchar(32),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vendor_jobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vendors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`token` varchar(128) NOT NULL,
	`status` enum('invited','active','inactive','suspended') NOT NULL DEFAULT 'invited',
	`name` varchar(256),
	`email` varchar(320),
	`phone` varchar(32),
	`role` enum('photographer','videographer','editor','drone_operator','social_media','graphic_designer','other') NOT NULL DEFAULT 'photographer',
	`bio` text,
	`location` varchar(256),
	`portfolioUrl` text,
	`ratePerDay` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vendors_id` PRIMARY KEY(`id`),
	CONSTRAINT `vendors_token_unique` UNIQUE(`token`)
);
