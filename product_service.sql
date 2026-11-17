-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 17, 2026 at 05:25 AM
-- Server version: 10.6.22-MariaDB-0ubuntu0.22.04.1
-- PHP Version: 8.2.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `product_service`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `icon` varchar(255) DEFAULT '',
  `description` text DEFAULT NULL,
  `categoryImage` varchar(500) DEFAULT '',
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `icon`, `description`, `categoryImage`, `isActive`, `createdAt`, `updatedAt`) VALUES
(3, 'Online UPS', 'online-ups', '', 'Get Online UPS from 1kva to 4800 kva for industrial, commercial use.\r\n\r\nIn an onlineUPS, the batteries are always connected to the inverter, so it isn’t necessary to have a power transfer switch. When a loss of power occurs, the rectifier just drops out of the circuit and the batteries keep the flow of power steady and unchanged.\r\n\r\n\r\nWhen the power is restored, the rectifier resumes carrying most of the load and also begins charging the batteries. However, the charging current may be limited to prevent the high-power rectifier from overheating the batteries and boiling off theelectrolyte. The most beneficial advantage of an on-line UPS, in comparison with the other types of UPS, is its ability to provide an “electrical firewall” between the incoming utility power and sensitive electronic equipment.\r\n\r\n\r\nThe online UPS is ideal for environments where electrical isolation is necessary or for equipment that is very sensitive to power fluctuations. However, with the advances in technology, the online UPS unit was once only used for very large installations of 10kWor more. Now they are available as a common consumer device, supplying 500 W or less.\r\n\r\n\r\nThe initial cost of the online UPS may be higher, but its total cost of ownership is generally lower due to longer battery life. The online UPS may be necessary when the power environment is “noisy”, when utility power sags, outages and other anomalies are frequent, when protection of sensitive IT equipment loads are required or when operation from an extended-run backupgeneratoris necessary.\r\n\r\nThe basic technology of the online UPS is the same as in the standby or line-interactive UPS. However, it typically costs much more, due to it having a much greater currentAC-to-DCbattery-charger/rectifier, and with the rectifier and inverter designed to run continuously with improved cooling systems. It is called a double-conversion UPS due to the rectifier directly driving the inverter, even when powered from normal AC current', '/uploads/categories/1790677248333-615875275.webp', 1, '2026-09-29 10:20:48', '2026-09-29 10:20:48'),
(4, 'Three Phase UPS', 'three-phase-ups', '', 'Our product range includes a wide range of 10kva three phase ups, 350kva three phase ups, 20kva three phase ups, 50kva three phase ups, 15kva three phase ups and 1200kva three phase ups.', '/uploads/categories/1790677336674-123333190.webp', 1, '2026-09-29 10:22:16', '2026-09-29 10:22:16'),
(5, 'Refurbished UPS', 'refurbished-ups', '', 'We are a leading Wholesale Trader of 160kva refurbished ups, 275kva refurbished ups, 120kva refurbished ups, 200kva refurbished ups, 600kva refurbished ups and 150kva refurbished ups from Noida, India.', '/uploads/categories/1790677439546-579834352.webp', 1, '2026-09-29 10:23:59', '2026-09-29 10:23:59'),
(6, 'Online UPS Rental Services', 'online-ups-rental-services', '', 'Prominent & Leading Wholesale Trader from Noida, we offer 500kva industrial online ups on rent in delhi ncr, 150kva industrial online ups on rent in delhi ncr, 1000kva industrial online ups on rent in delhi ncr, 120kva industrial online ups rental services, 80kva industrial online ups rental services and 1000kva industrial online ups rental services.', '/uploads/categories/1790677550827-808624419.jpg', 1, '2026-09-29 10:25:50', '2026-09-29 10:25:50'),
(7, 'Used UPS', 'used ups', '', '\r\nAbhion Solution Services is your trusted partner for high-quality used UPS systems in India, offering cost-effective solutions without compromising on performance or reliability. Our selection of pre-owned UPS units is ideal for businesses seeking dependable power protection while staying within budget.\r\n\r\nWhy Choose Our Used UPS Systems?\r\nThoroughly Inspected: Each used UPS system undergoes rigorous testing and refurbishment processes to ensure optimal performance and reliability. We guarantee that our products meet industry standards and function as intended.\r\n\r\nAffordable Solutions: Purchasing a used UPS system allows businesses to enjoy substantial savings while still benefiting from reliable power protection. Our competitive pricing makes it easier for organizations of all sizes to invest in essential power solutions.\r\n\r\nDiverse Selection: We offer a wide range of used UPS systems with various capacities and specifications to meet different power requirements. Whether you need a small unit for an office or a larger solution for industrial applications, we have you covered.\r\n\r\nExpert Consultation: Our experienced team is available to help you find the right used UPS system for your specific needs. We provide personalized recommendations and guidance to ensure you make an informed decision.\r\n\r\nComprehensive After-Sales Support: We stand by our products, offering exceptional after-sales service that includes installation assistance, maintenance options, and 24/7 customer support to address any issues or concerns.\r\n\r\nEco-Friendly Choice: Opting for a used UPS system is a sustainable choice that reduces electronic waste and supports environmental conservation efforts. By choosing refurbished equipment, you contribute to a greener future.\r\n\r\nChoose Power Solution Services for reliable used UPS systems that deliver performance, affordability, and peace of mind. Trust us to provide the power protection solutions your business needs to thrive, all while helping you save on costs', '/uploads/categories/1790677646901-462457916.webp', 1, '2026-09-29 10:27:26', '2026-09-29 10:27:26'),
(8, 'Industrial UPS Systems', 'industrial-ups-systems', '', '\r\nWholesale Trader of a wide range of products which include 10kva industrial ups systems, 40kva industrial ups systems, 600kva industrial ups systems, 15kva industrial ups systems, 220kva industrial ups systems and 100kva industrial ups systems.', '/uploads/categories/1790677745590-845983432.webp', 1, '2026-09-29 10:29:05', '2026-09-29 10:29:05'),
(9, 'IGBT Online UPS', 'igbt-online-ups', '', 'Offering you a complete choice of products which include 220 kva igbt online ups, 50 kva igbt online ups, 350 kva igbt online ups, 20 kva igbt online ups, 40 kva igbt online ups and 15 kva igbt online ups.', '/uploads/categories/1790677821040-671676280.webp', 1, '2026-09-29 10:30:21', '2026-09-29 10:30:35'),
(10, 'UPS Repairing Services', 'ups-repairing-services', '', 'Offering you a complete choice of products which include 1000kva ups repairing services, 400kva ups repairing services, 60kva ups repairing services, 40kva ups repairing services, 20kva ups repairing services and 350kva ups repairing services.', '/uploads/categories/1790677963177-625963548.jpg', 1, '2026-09-29 10:32:43', '2026-09-29 10:32:43'),
(11, 'Commercial UPS AMC', 'commercial-ups-amc', '', 'Pioneers in the industry, we offer 80kva commercial ups amc, 160kva commercial ups amc, 220kva commercial ups amc, 100kva commercial ups amc, 10kva commercial ups amc and 500kva commercial ups amc from India.', '/uploads/categories/1790678060754-748066509.jpg', 1, '2026-09-29 10:34:20', '2026-09-29 10:34:20'),
(12, 'Industrial UPS AMC', 'industrial-ups-amc', '', 'Leading Wholesale Trader of 500kva industrial ups amc, 40kva industrial online ups amc, 150kva industrial online ups amc, 300kva industrial online ups amc, 800kva industrial online ups amc and 15kva industrial online ups amc from Noida.', '/uploads/categories/1790678316223-215456862.png', 1, '2026-09-29 10:38:36', '2026-09-29 10:38:36'),
(13, 'UPS AMC Service', 'ups-amc-service', '', 'With the experience of 21 years ...\r\n\r\nThe engineers appointed at the company are exceedingly qualified on the technical front with expertise in AMC maintenance of products like Emerson/TATA Liebert UPS System from 1KVA to 800KVA on PAN (Presence across Nation) India basis.\r\nThe engineer’s assigned jobs at this organization are having at least 10 years of experience in the field of UPS and Batteries maintenance.\r\nThe branch offices of our company are located in Noida as well as we have resident engineers provisioned at Mumbai, Ahmadabad, Bangalore, Hyderabad, Chennai, Jaipur, Chandigarh, Calcutta & other major metro cities.\r\nWe are the leading service provider for AMC & Renting for Emerson/Tata Liebert, PCI, APC, Hirel, Powerware & other branded UPS systems.\r\nWe are also maintaining throughout DMRC across the whole Delhi NCR & Jaipur Metro for Emerson UPS System of 10KVA to 120KVA.\r\nExpert level of maintenance of UPS is served with accurate preventive measures.\r\nReasonably priced maintenance along with guarantee of quality is furnished.', '/uploads/categories/1790678423018-947275219.png', 1, '2026-09-29 10:40:23', '2026-09-29 10:40:23'),
(14, 'Quanta Batteries', 'quanta-batteries', '', 'Abhion Solution Services proudly offers Amaron Quanta SMF Batteries, a leading choice for reliable and efficient power storage solutions. Known for their durability and performance, these batteries are ideal for various applications, including UPS systems, telecom, and renewable energy systems.\r\n\r\nWhy Choose Amaron Quanta SMF Batteries?\r\nSuperior Technology: Amaron Quanta SMF Batteries are designed with advanced technology that ensures high efficiency and longer life cycles. Their unique design minimizes water loss and reduces the need for frequent maintenance.\r\n\r\nSealed Maintenance-Free Design: The sealed construction of SMF (Sealed Maintenance-Free) batteries means no spillage, no leakage, and no need for water topping. This feature provides convenience and peace of mind, making them ideal for use in sensitive environments.\r\n\r\nHigh Discharge Rates: These batteries are engineered to deliver high discharge rates, making them perfect for applications that require reliable and consistent power supply during critical operations.\r\n\r\nRobust Performance: Amaron Quanta batteries are known for their robustness and ability to withstand harsh operating conditions, ensuring uninterrupted performance even in extreme temperatures.\r\n\r\nEco-Friendly: These batteries are designed with the environment in mind, featuring recyclable materials that contribute to sustainability and reduced environmental impact.\r\n\r\nWide Application Range: Suitable for various applications, including UPS systems, inverters, solar energy systems, and telecom equipment, Amaron Quanta SMF Batteries offer versatile power solutions for both commercial and industrial needs.\r\n\r\nExceptional After-Sales Support\r\nAt Power Solution Services, we prioritize customer satisfaction. Our commitment includes:\r\n\r\nExpert Installation Services: Our trained technicians provide professional installation to ensure your Amaron Quanta batteries are set up for optimal performance.\r\n\r\nComprehensive Maintenance Plans: We offer flexible maintenance contracts to keep your batteries in top condition, maximizing their lifespan and reliability.\r\n\r\n24/7 Customer Support: Our dedicated support team is always available to assist with any inquiries or issues, ', '/uploads/categories/1790678531027-143438682.webp', 1, '2026-09-29 10:42:11', '2026-09-29 10:42:11'),
(15, 'UPS Maintenance Services', 'ups maintenance services', '', 'Our range of products include 150kva ups maintenance services.', '/uploads/categories/1790678621219-966405884.webp', 1, '2026-09-29 10:43:41', '2026-09-29 10:43:41'),
(16, 'Amaron Quanta UPS Battery', 'amaron quanta ups battery', '', 'Wholesale Trader of a wide range of products which include amaron quanta ups battery and amaron quanta 12v 65ah smf battery.', '/uploads/categories/1790678805984-280104825.webp', 1, '2026-09-29 10:46:45', '2026-09-29 10:46:45');

-- --------------------------------------------------------

--
-- Table structure for table `enquiries`
--

CREATE TABLE `enquiries` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(255) DEFAULT '',
  `city` varchar(100) DEFAULT '',
  `message` text DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `productName` varchar(255) DEFAULT '',
  `serviceType` enum('online','offline') NOT NULL,
  `isVerified` tinyint(1) DEFAULT 0,
  `status` enum('new','contacted','closed') DEFAULT 'new',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(12,2) NOT NULL,
  `priceUnit` enum('Piece','Month','Unit','Set') DEFAULT 'Piece',
  `category_id` int(11) NOT NULL,
  `technicalDetails` text DEFAULT NULL,
  `minOrderQuantity` int(11) DEFAULT 1,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `brochure` varchar(500) DEFAULT '',
  `isActive` tinyint(1) DEFAULT 1,
  `isFeatured` tinyint(1) DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `slug`, `description`, `price`, `priceUnit`, `category_id`, `technicalDetails`, `minOrderQuantity`, `images`, `brochure`, `isActive`, `isFeatured`, `createdAt`, `updatedAt`) VALUES
(2, '350kva Online UPS', '350kva-online-ups', 'We are a trusted dealer of 350kVA Online UPS in Delhi NCR, offering high-performance and reliable power backup solutions for industrial, commercial, and mission-critical applications. Our Online UPS systems are engineered with advanced double conversion technology to ensure uninterrupted, clean, and stable power supply for sensitive and critical equipment. We supply 350kVA UPS systems suitable for data centers, IT infrastructure, hospitals, telecom networks, manufacturing plants, and large commercial facilities. These systems provide zero transfer time, high efficiency, and complete protection against power failures, voltage fluctuations, surges, spikes, and electrical disturbances. ### Specifications: * Capacity: 350kVA * Technology: Online Double Conversion UPS * Input Voltage: 380V�415V AC * Output Voltage: 230V/415V AC (as per configuration) * Frequency: 50Hz �0.5% * Phase: Three Phase * Battery Type: SMF / Tubular Batteries * Backup Time: 180�300 Minutes (Expandable) * Efficiency: Up to 96% * Protection: Overload, Short Circuit, Over Temperature, Low Battery Protection * Display: LCD Digital Monitoring System * Applications: Data Centers, Hospitals, IT Infrastructure, Telecom, Industrial Units We also provide complete installation, commissioning, AMC services, battery replacement, and technical support. Our experienced engineers ensure smooth setup and reliable long-term performance across Delhi NCR including Noida, Gurugram, Ghaziabad, and Faridabad. We are committed to delivering efficient, durable, and cost-effective UPS solutions with strong after-sales support.', '1650000.00', 'Piece', 3, '', 1, '[\"/uploads/products/1790679806624-674676769.webp\",\"/uploads/products/1790679806625-892810317.webp\",\"/uploads/products/1790679806626-451797990.webp\"]', '', 1, 0, '2026-09-29 11:03:26', '2026-09-29 11:17:54');

-- --------------------------------------------------------

--
-- Table structure for table `product_specs`
--

CREATE TABLE `product_specs` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` text NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_specs`
--

INSERT INTO `product_specs` (`id`, `product_id`, `key`, `value`, `createdAt`, `updatedAt`) VALUES
(61, 2, 'Capacity', '350 KVA', '2026-09-29 11:17:54', '2026-09-29 11:17:54'),
(62, 2, 'Phase', '3 Phase In 3 Phase Out', '2026-09-29 11:17:54', '2026-09-29 11:17:54'),
(63, 2, 'Backup Time', '15 min', '2026-09-29 11:17:54', '2026-09-29 11:17:54'),
(64, 2, 'Input Voltage', '230 V', '2026-09-29 11:17:54', '2026-09-29 11:17:54'),
(65, 2, 'Output Voltage', '400 V', '2026-09-29 11:17:54', '2026-09-29 11:17:54'),
(66, 2, 'Form Factor', 'Tower', '2026-09-29 11:17:54', '2026-09-29 11:17:54'),
(67, 2, 'Battery Type', 'SMF VRLA', '2026-09-29 11:17:54', '2026-09-29 11:17:54'),
(68, 2, 'Warranty', '1 Year', '2026-09-29 11:17:54', '2026-09-29 11:17:54'),
(69, 2, 'Application', 'Bank ATM, Data Center, IT Server', '2026-09-29 11:17:54', '2026-09-29 11:17:54'),
(70, 2, 'Minimum order quantity', '1 Piece', '2026-09-29 11:17:54', '2026-09-29 11:17:54');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `role` enum('client','admin') NOT NULL DEFAULT 'client',
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `role`, `name`, `email`, `phone`, `password`, `createdAt`, `updatedAt`) VALUES
(1, 'admin', 'admin', 'admin@powersolutions.com', '6307899113', 'admin123', '2026-09-23 08:32:01', '2026-09-23 09:41:02');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `enquiries`
--
ALTER TABLE `enquiries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_enquiry_createdAt` (`createdAt`),
  ADD KEY `idx_enquiry_status` (`status`),
  ADD KEY `fk_enquiry_product` (`product_id`),
  ADD KEY `fk_enquiry_category` (`category_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `fk_product_category` (`category_id`);

--
-- Indexes for table `product_specs`
--
ALTER TABLE `product_specs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_product_specs_product` (`product_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `enquiries`
--
ALTER TABLE `enquiries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `product_specs`
--
ALTER TABLE `product_specs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `enquiries`
--
ALTER TABLE `enquiries`
  ADD CONSTRAINT `fk_enquiry_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_enquiry_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_product_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `product_specs`
--
ALTER TABLE `product_specs`
  ADD CONSTRAINT `fk_product_specs_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
