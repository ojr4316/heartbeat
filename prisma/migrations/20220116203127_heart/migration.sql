-- CreateTable
CREATE TABLE `hearts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `message` TEXT NOT NULL,
    `viewed` TINYINT NOT NULL DEFAULT 0,
    `code` VARCHAR(8) NOT NULL DEFAULT '0',
    `passphrase` TEXT NOT NULL,
    `oneTime` TINYINT NOT NULL DEFAULT 0,
    `recipient` VARCHAR(128) NOT NULL DEFAULT '0',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
