CREATE TABLE IF NOT EXISTS `network` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `up` INTEGER,
  `down` INTEGER,
  `total_up` INTEGER,
  `total_down` INTEGER,
  `down_packets` INTEGER,
  `up_packets` INTEGER,
  `addtime` INTEGER
);

CREATE TABLE IF NOT EXISTS `cpuio` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `pro` INTEGER,
  `mem` INTEGER,
  `addtime` INTEGER
);

CREATE TABLE IF NOT EXISTS `diskio` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `read_count` INTEGER,
  `write_count` INTEGER,
  `read_bytes` INTEGER,
  `write_bytes` INTEGER,
  `read_time` INTEGER,
  `write_time` INTEGER,
  `addtime` INTEGER
);

CREATE TABLE IF NOT EXISTS `load_average` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `pro` REAL,
  `one` REAL,
  `five` REAL,
  `fifteen` REAL,
  `addtime` INTEGER
);

CREATE TABLE IF NOT EXISTS `domain_speed` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `domain_id` INTEGER,
  `success_rate` REAL,
  `addtime` INTEGER 
);

CREATE TABLE IF NOT EXISTS `domain_speed_detail` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `domain_speed_id` INTEGER,
  `name` TEXT,
  `code` INTEGER,
  `speed_time` REAL,
  `ip` TEXT,
  FOREIGN KEY (domain_speed_id) REFERENCES domain_speed(id)
)