--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1 (Ubuntu 16.1-1.pgdg22.04+1)
-- Dumped by pg_dump version 16.1 (Ubuntu 16.1-1.pgdg22.04+1)

-- Started on 2025-11-09 23:49:14 +04

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 3408 (class 0 OID 16498)
-- Dependencies: 216
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: contactum
--

COPY public.admins (id, username, password_hash, card_id, is_active, created_at, updated_at, default_lang) FROM stdin;
2	101	$2b$10$u5971aaD1Df9BDykFIYjXePdbPDOECvvJ3gKsLZ8Wxi7ynnDIaAeC	101	t	2025-10-24 12:48:29.864786	2025-11-07 14:46:18.79856	am
\.


--
-- TOC entry 3412 (class 0 OID 16568)
-- Dependencies: 220
-- Data for Name: admin_info; Type: TABLE DATA; Schema: public; Owner: contactum
--

COPY public.admin_info (admin_id, information, created_at, updated_at) FROM stdin;
2	{"icons": {"links": [{"href": "tel:+37477765334", "icon": "fa-solid fa-phone", "label": {"am": "Phone", "ar": "هاتف", "en": "Phone", "fr": "Phone", "ru": "Phone"}}, {"href": "sms:+37477765334://", "icon": "fa-solid fa-comment-dots", "label": {"am": "SMS", "ar": "رسالة قصيرة", "en": "SMS", "fr": "SMS", "ru": "SMS"}}, {"href": "https://t.me/KHachatryansHoldingCJSC", "icon": "fa-brands fa-telegram", "label": {"am": "Telegram", "ar": "برقية", "en": "Telegram", "fr": "Telegram", "ru": "Telegram"}}, {"href": "https://t.me/KHachatryansHoldingCJSC", "icon": "fa-brands fa-linkedin-in", "label": {"am": "Linkedin", "ar": "لينكدإن", "en": "Linkedin", "fr": "Linkedin", "ru": "Linkedin"}}, {"href": "https://wa.me/37477765334", "icon": "fa-brands fa-whatsapp", "label": {"am": "WhatsApp", "ar": "واتساب", "en": "WhatsApp", "fr": "WhatsApp", "ru": "WhatsApp"}}, {"href": "viber://add?number=%2B37477765334", "icon": "fa-brands fa-viber", "label": {"am": "Viber", "ar": "فايبر", "en": "Viber", "fr": "Viber", "ru": "Viber"}}, {"href": "https://t.me/KHachatryansHoldingCJSC", "icon": "fa-brands fa-instagram", "label": {"am": "Instagram", "ar": "انستغرام", "en": "Instagram", "fr": "Instagram", "ru": "Instagram"}}, {"href": "https://t.me/KHachatryansHoldingCJSC", "icon": "fa-brands fa-facebook-f", "label": {"am": "Facebook", "ar": "فيسبوك", "en": "Facebook", "fr": "Facebook", "ru": "Facebook"}}, {"href": "https://t.me/KHachatryansHoldingCJSC", "icon": "fa-brands fa-facebook-messenger", "label": {"am": "Messenger", "ar": "رسول", "en": "Messenger", "fr": "Messenger", "ru": "Messenger"}}, {"href": "mailto:contact@khachatryanholding.com", "icon": "fa-solid fa-envelope", "label": {"am": "Mail", "ar": "بريد", "en": "Mail", "fr": "Mail", "ru": "Mail"}}, {"href": "https://link.khachatryanholding.com/VisitCard", "icon": "fa-solid fa-globe", "label": {"am": "Website", "ar": "موقع إلكتروني", "en": "Website", "fr": "Website", "ru": "Website"}}, {"href": "https://www.google.com/maps/search/?api=1&query=Cascade,+Yerevan,+Armenia", "icon": "fa-solid fa-location-dot", "label": {"am": "Location", "ar": "موقع", "en": "Location", "fr": "Location", "ru": "Location"}}], "styles": {"cols": 4, "chipCss": "rgba(215, 232, 255, 1)", "chipRGBA": {"a": 1, "b": 255, "g": 232, "r": 215}, "labelCss": "rgb(0, 0, 0)", "labelHEX": "#000000", "glowColor": "#21ba2b", "rowCardCss": "rgba(240, 137, 180, 1)", "glowEnabled": false, "layoutStyle": "dzev3", "rowCardRGBA": {"a": 1, "b": 180, "g": 137, "r": 240}}}, "share": {"quick": {"fb": true, "ig": true, "ln": true, "tg": true, "wa": true, "mail": true, "viber": true}, "styles": {"btnBgColor": "#000000", "btnTextColor": "#ffffff", "shareTitleColor": "#000000"}, "onlineUrl": "http://localhost:5173/arm/card-101--.html", "shareText": "", "offlinePhone": "+37444667705", "offlineFullName": "KHACHATRYANS HOLDING CJSC"}, "staff": [{"id": "f38474c9-64dd-43b9-9b4d-78fa527abb0f", "link": "", "name": {"am": "kayq", "ar": "kayq", "en": "kayq", "fr": "kayq", "ru": "kayq"}, "avatar": "/file/1761818315743-pqrejjprrb.jpg"}, {"id": "0346a39e-a3d6-4509-9c4c-b5abc6211f64", "link": "", "name": {"am": "smm", "ar": "smm", "en": "smm", "fr": "smm", "ru": "smm"}, "avatar": "/file/1761830686039-h9sak43vean.jpg"}], "avatar": {"type": "video", "imageUrl": "/file/1761561725761-4q8r8pylyub.jpg", "videoUrl": "/file/1762513020242-dkpvfp3oxr.mp4"}, "brands": [{"id": "8bc0c553-0dac-47ea-9526-0b5a35d0ff8e", "href": "", "logo": "/file/1762459984344-4h4ry4isob3.png", "name": {"am": "ajs", "ar": "", "en": "", "fr": "", "ru": ""}, "keyword": "key", "linkType": "keyword"}, {"id": "f98a98f1-a000-46bd-af48-9cec9e9e0d7c", "href": "", "logo": "/file/1762635442632-j7psn3p2f38.png", "name": {"am": "szxdftgy", "ar": "xdfcgvhj", "en": "xcvbhn", "fr": "xcfvgbh", "ru": "xcfghj"}, "keyword": "key", "linkType": "keyword"}, {"id": "b30f0925-30c1-4058-9178-af68a2408d2d", "href": "", "logo": "/file/1762635479279-1ltt7pi02wn.png", "name": {"am": "cvbhjn", "ar": "xcvbhj", "en": "zxfgvhj", "fr": "xcvgbhjkl", "ru": "cvbhjn"}, "keyword": "zsdxfghji", "linkType": "keyword"}, {"id": "774832bb-8ea9-46e5-8c2a-37404e8fa7fc", "href": "", "logo": "/file/1762635523855-co7t8h8k8f8.png", "name": {"am": "zssxfghuji", "ar": "zxdcfvhjkl;", "en": "zxcvgbhkl", "fr": "aghcfghjkl", "ru": "zsdfghjk"}, "keyword": "zgxhcghjkl;'", "linkType": "keyword"}], "company": {"name": {"am": "KHACHATRYANS HOLDING CJSC", "ar": "شركة خاتشاتريان القابضة المساهمة المقفلة", "en": "KHACHATRYANS HOLDING CJSC", "fr": "KHACHATRYANS HOLDING CJSC", "ru": "KHACHATRYANS HOLDING CJSC"}, "nameColor": "#1f1f1e"}, "logo_url": "/file/1761561725761-4q8r8pylyub.jpg", "sendBgCss": "rgba(0, 0, 0, 1)", "sendLabel": {"am": "Ուղարկել", "ar": "Ուղարկել", "en": "Ուղարկել", "fr": "Ուղարկել", "ru": "Ուղարկել"}, "staffCols": 3, "staffList": [], "background": {"type": "image", "color": "#2e2929", "imageUrl": "/file/1762643851869-mhijnhwaqyq.jpeg", "videoUrl": ""}, "brandInfos": [{"id": "4bed52e0-e4cb-40d4-9555-022c160bc342", "bio": {"am": "idcciwwebwecwebdiwe", "ar": "idcciwwebwecwebdiwe", "en": "idcciwwebwecwebdiwe", "fr": "idcciwwebwecwebdiwe", "ru": "idcciwwebwecwebdiwe"}, "name": {"am": "Razmik", "ar": "Razmik", "en": "Razmik", "fr": "Razmik", "ru": "Razmik"}, "avatar": "/file/1762188924368-g79gly5xmhq.jpg", "gallery": ["/file/1762188964537-ugzx6o2uz5.png", "/file/1762188969289-ivw798vonnn.png", "/file/1762188974244-f7c3p2sd4s.png", "/file/1762188978841-s1d0uj2y9j.png", "/file/1762188983105-u2nqgatcfrl.png"], "keyword": "key", "ratingEnabled": false}, {"id": "da35efce-1bcf-478b-81f5-48ce30f45a03", "bio": {"am": "es cragravorox em", "ar": "es cragravorox em", "en": "es cragravorox em", "fr": "es cragravorox em", "ru": "es cragravorox em"}, "name": {"am": "Syuzi", "ar": "Syuzi", "en": "Syuzi", "fr": "Syuzi", "ru": "Syuzi"}, "avatar": "", "gallery": ["/file/1762244670194-1ua8fo91xed.jpg", "/file/1762244678228-6rr8pafsyho.jpg"], "keyword": "key", "ratingEnabled": true}, {"id": "563ef745-f4ea-45ac-99d1-13db7046fb64", "bio": {"am": "asdfghjkjhgfdfghj", "ar": "asdfghjkjhgfdfghj", "en": "asdfghjkjhgfdfghj", "fr": "asdfghjkjhgfdfghj", "ru": "asdfghjkjhgfdfghj"}, "name": {"am": "Arm", "ar": "Arm", "en": "Arm", "fr": "Arm", "ru": "Arm"}, "avatar": "", "gallery": ["/file/1762244775758-wzaiv87pl9d.png"], "keyword": "Arm", "ratingEnabled": true}], "brandsCols": 3, "sendBgRGBA": {"a": 1, "b": 0, "g": 0, "r": 0}, "staffItems": [{"id": "1adfecab-17f0-465d-b137-81f8d4a850dc", "name": {"am": "kayqeri patrastum", "ar": "kayqeri patrastum", "en": "kayqeri patrastum", "fr": "kayqeri patrastum", "ru": "kayqeri patrastum"}, "avatar": "/file/1761832019973-p1xqoxzmbj.jpg", "staffSlugs": ["Raz"], "serviceSlug": ""}], "description": {"am": "Միջազգային բազմապրոֆիլ ընկերություն է, որը իրականացնում է բացառիկ նախագծեր, տեխնոլոգիաների, անշարժ գույքի, ռիթեյլի, սպասարկման, արտադրական և այլ ոլորտներում։", "ar": "هي شركة دولية متعددة المجالات تنفذ مشاريع حصرية في مجالات التكنولوجيا والعقارات وتجارة التجزئة والخدمات والتصنيع والمزيد.", "en": "Is an international multi-profile company implementing exclusive projects in the fields of technology, real estate, retail, services, manufacturing, and more.", "fr": "C'est une entreprise internationale multi-profils qui met en œuvre des projets exclusifs dans les domaines de la technologie, de l'immobilier, de la vente au détail, des services, de la fabrication, etc.", "ru": "Международная многопрофильная компания, реализующая эксклюзивные проекты в сферах технологий, недвижимости, ритейла, сервиса, производства и других направлений.", "color": "#004d47"}, "emailConfig": {"MAIL_TO": "razmik.manvelyan.03@mail.ru"}, "previewLang": "fr", "brandWorkers": [{"id": "4bed52e0-e4cb-40d4-9555-022c160bc342", "bio": {"am": "idcciwwebwecwebdiwe", "ar": "idcciwwebwecwebdiwe", "en": "idcciwwebwecwebdiwe", "fr": "idcciwwebwecwebdiwe", "ru": "idcciwwebwecwebdiwe"}, "name": {"am": "Razmik", "ar": "Razmik", "en": "Razmik", "fr": "Razmik", "ru": "Razmik"}, "avatar": "/file/1762188924368-g79gly5xmhq.jpg", "gallery": ["/file/1762188964537-ugzx6o2uz5.png", "/file/1762188969289-ivw798vonnn.png", "/file/1762188974244-f7c3p2sd4s.png", "/file/1762188978841-s1d0uj2y9j.png", "/file/1762188983105-u2nqgatcfrl.png"], "keyword": "kayq"}], "default_lang": "am", "staffBgColor": "#fcfcfc", "staffDetails": [{"name": {"am": "Cragravorox", "ar": "Cragravorox", "en": "Cragravorox", "fr": "Cragravorox", "ru": "Cragravorox"}, "slug": "Syuzi", "avatar": "/file/1761834692716-vpjlog1fncf.jpg", "gallery": [], "serviceKey": "kayq", "description": {"am": "Cragravorox", "ar": "Cragravorox", "en": "Cragravorox", "fr": "Cragravorox", "ru": "Cragravorox"}}, {"name": {"am": "smm", "ar": "smm", "en": "smm", "fr": "smm", "ru": "dmm"}, "slug": "", "avatar": "/file/1761834962412-alhxkn9ddsw.jpg", "gallery": [], "serviceKey": "kayq", "description": {"am": "smm", "ar": "smm", "en": "smm", "fr": "smm", "ru": "smm"}}, {"name": {"am": "smm", "ar": "smm", "en": "smm", "fr": "smm", "ru": "smm"}, "slug": "asdf", "avatar": "/file/1761835031493-s5npsw4f8m.jpg", "gallery": ["/file/1761835144413-b3dkf3y34ab.jpg", "/file/1761835155319-8tdp2sncuix.png"], "serviceKey": "smm", "description": {"am": "smm", "ar": "smm", "en": "smm", "fr": "smm", "ru": "smm"}}], "staffService": {"avatar": "/file/1761834887511-15wfvuvk9oy.jpg"}, "brandsBgColor": "#fcfcfc", "sendTextColor": "#af2323", "staffServices": [{"name": {"am": "kayq", "ar": "kayq", "en": "kayq", "fr": "kayq", "ru": "kayq"}, "avatar": "/file/1761834584779-rur9il7girp.jpg", "shortDesc": {"am": "dftgyhuj", "ar": "dfghj", "en": "dfgbhj", "fr": "dfghj", "ru": "sdfghj"}, "serviceKey": "kayq"}, {"name": {"am": "smm", "ar": "smm", "en": "smm", "fr": "smm", "ru": "smm"}, "avatar": "/file/1761834887511-15wfvuvk9oy.jpg", "shortDesc": {"am": "smm", "ar": "smm", "en": "snn", "fr": "smm", "ru": "smm"}, "serviceKey": "smm"}], "bookingEnabled": true, "staffTitleText": {"am": "ՄԵՐ ԾԱՌԱՅՈՒԹՅՈՒՆՆԵՐԸ", "ar": "خدماتنا", "en": "OUR SERVICES", "fr": "NOS SERVICES", "ru": "НАШИ УСЛУГИ"}, "available_langs": ["am", "ru"], "brandsTitleText": {"am": "Ծառայություններ", "ar": "خدمات", "en": "Services", "fr": "Services", "ru": "Услуги"}, "feedbackEnabled": true, "staffTitleColor": "#000000", "bookingFormColor": "#2034cb", "bookingTitleText": {"am": "Այցի ամրագրում", "ar": "حجز الزيارة", "en": "Booking a visit", "fr": "Réserver une visite", "ru": "Забронировать визит"}, "brandsTitleColor": "#000000", "feedbackFormColor": "#6d9773", "feedbackTitleText": {"am": "Հետադարձ կապ", "ar": "تعليق", "en": "Feedback", "fr": "Retour", "ru": "Обратная связь"}}	2025-10-25 22:12:10.203447+04	2025-11-09 11:55:53.040698+04
\.


--
-- TOC entry 3411 (class 0 OID 16532)
-- Dependencies: 219
-- Data for Name: admin_items; Type: TABLE DATA; Schema: public; Owner: contactum
--

COPY public.admin_items (id, admin_id, title, body, link_url, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3409 (class 0 OID 16514)
-- Dependencies: 217
-- Data for Name: admin_profiles; Type: TABLE DATA; Schema: public; Owner: contactum
--

COPY public.admin_profiles (admin_id, display_name, headline, bio, contacts, updated_at) FROM stdin;
\.


--
-- TOC entry 3418 (class 0 OID 0)
-- Dependencies: 218
-- Name: admin_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: contactum
--

SELECT pg_catalog.setval('public.admin_items_id_seq', 1, false);


--
-- TOC entry 3419 (class 0 OID 0)
-- Dependencies: 215
-- Name: admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: contactum
--

SELECT pg_catalog.setval('public.admins_id_seq', 14, true);


-- Completed on 2025-11-09 23:49:14 +04

--
-- PostgreSQL database dump complete
--

