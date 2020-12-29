CREATE TABLE `oil_activity_V2` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` varchar(50) NOT NULL COMMENT '活动名字',
  `status` tinyint(4) NOT NULL COMMENT '活动状态: 0-无效; 1-有效',
  `start_time` datetime NOT NULL COMMENT '活动开始时间',
  `end_time` datetime NOT NULL COMMENT '活动结束时间',
  `max_num` int(11) NOT NULL COMMENT '活动奖品数量',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_idx_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='活动信息';


CREATE TABLE `oil_exchange_code_V2` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user_id` varchar(50) NOT NULL COMMENT '用户id',
  `code` varchar(50) NOT NULL COMMENT '兑换码',
  `allow_shop_code` varchar(50) NOT NULL COMMENT '允许核销的门店code/1则表示全部',
  `platform` varchar(5) NOT NULL COMMENT '获取平台: (app|h5)',
  `verified` tinyint(4) NOT NULL DEFAULT '0' COMMENT '是否已核销: 0-未核销;1-已核销',
  `verifier_id` varchar(50) DEFAULT NULL COMMENT '核销人id',
  `verify_shop_code` varchar(50) DEFAULT NULL COMMENT '核销门店码',
  `verify_time` timestamp NULL DEFAULT NULL COMMENT '核销时间',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_idx_code` (`code`),
  UNIQUE KEY `uniq_idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='送机油活动_兑换码表';

CREATE TABLE `oil_exchange_fail_V2` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `code` varchar(50) NOT NULL COMMENT '兑换码',
  `verifier_id` varchar(50) NOT NULL COMMENT '核销人id',
  `verifier_phone` varchar(12) NOT NULL COMMENT '核销人手机',
  `verifier_name` varchar(12) NOT NULL COMMENT '核销人姓名',
  `verify_shop_code` varchar(50) NOT NULL COMMENT '核销门店码',
  `failure_reason` varchar(50) DEFAULT NULL COMMENT '核销失败理由',
  `failure_code` int(11) DEFAULT NULL COMMENT '核销失败码',
  `verify_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '核销时间',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='送机油活动_兑换失败表';


CREATE TABLE `oil_shop_brief_V2` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `shop_name` varchar(255) NOT NULL COMMENT '门店名称',
  `city` varchar(10) NOT NULL COMMENT '城市',
  `address` varchar(255) NOT NULL COMMENT '门店地址',
  `tel` varchar(50) NOT NULL COMMENT '门店电话',
  `shop_code` varchar(50) NOT NULL COMMENT '店铺code',
  `company_code` varchar(50) NOT NULL COMMENT '公司code',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_idx_shop_code` (`shop_code`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8 COMMENT='送机油活动_门店信息摘要';

CREATE TABLE `oil_user_V2` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user_id` varchar(50) NOT NULL COMMENT '用户id',
  `iid` varchar(50) NOT NULL COMMENT '用户iid',
  `city` varchar(10) NOT NULL COMMENT '订单所在城市',
  `order_status` tinyint(4) NOT NULL COMMENT '租赁状态: 0-租前; 1:租后',
  `order_num` varchar(255) NOT NULL COMMENT '订单号',
  `allow_shop_code` varchar(50) NOT NULL COMMENT '允许核销的门店code/1则表示全部',
  `original_shop_code` varchar(50) NOT NULL COMMENT '用户订单原始门店码',
  `company_code` varchar(50) NOT NULL COMMENT '订单所在公司code',
  `code` varchar(50) NOT NULL COMMENT '开始分配的核销码',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_idx_user_id` (`user_id`),
  UNIQUE KEY `uniq_idx_iid` (`iid`)
) ENGINE=InnoDB AUTO_INCREMENT=28728 DEFAULT CHARSET=utf8 COMMENT='送机油活动_用户白名单';

