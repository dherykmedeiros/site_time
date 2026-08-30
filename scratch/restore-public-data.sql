BEGIN;
SET session_replication_role = replica;
COPY public.achievements (id, "playerId", type, "matchId", "awardedAt", "updatedAt") FROM stdin;
cmpjn8s76000q04kzctm877rf	cmpdz2mcq000104jr9xnhl4i0	ASSIST_MASTER	cmpfezhxy000004lblpwmx62l	2026-05-24 10:37:46.818	2026-05-24 10:37:46.818
cmpjn8s76000r04kzxorfcynb	cmpefcqj2000104ladlx0ysjz	TOP_SCORER_ROUND	cmpfezhxy000004lblpwmx62l	2026-05-24 10:37:46.818	2026-05-24 10:37:46.818
cmposn6yf000f04jrgir8mi38	cmpefcd1z000004lasd2r1kdh	TOP_SCORER_ROUND	cmpkl4qyr000004l41n642701	2026-05-28 01:07:48.087	2026-05-28 01:07:48.087
cmposn6yf000g04jrswc46kr1	cmpdz2mcq000104jr9xnhl4i0	TOP_SCORER_ROUND	cmpkl4qyr000004l41n642701	2026-05-28 01:07:48.087	2026-05-28 01:07:48.087
cmqi3eh59000r04kytk45kk3s	cmpcm7sgp000004l1fp9o52ky	TOP_SCORER_ROUND	cmq9kccux000004l58m8puvai	2026-06-17 13:14:16.269	2026-06-17 13:14:16.269
cmr6u70a3000p04jpcoo5w0no	cmpefcqj2000104ladlx0ysjz	TOP_SCORER_ROUND	cmr4v6j8z000004jmrs48v3h3	2026-07-04 20:50:45.675	2026-07-04 20:50:45.675
cmrru654s000l04jyuxg4ekxe	cmpcopzu6000004jro3prr7ca	TOP_SCORER_ROUND	cmqp5jh8b000004jp8k1q116l	2026-07-19 13:33:15.004	2026-07-19 13:33:15.004
cmrru654s000m04jywbcmkiq4	cmpefcqj2000104ladlx0ysjz	TOP_SCORER_ROUND	cmqp5jh8b000004jp8k1q116l	2026-07-19 13:33:15.004	2026-07-19 13:33:15.004
cms38vn8e000r04jo8ne1y9ro	cmpn1o6et000004jrcnmw0gav	TOP_SCORER_ROUND	cmrthsbf6000004kybfhn32yj	2026-07-27 13:10:27.422	2026-07-27 13:10:27.422
cms38vn8e000s04jofv9a6v4b	cmpdz2mcq000104jr9xnhl4i0	TOP_SCORER_ROUND	cmrthsbf6000004kybfhn32yj	2026-07-27 13:10:27.422	2026-07-27 13:10:27.422
cms6wsbjv000y04ifz32somg6	cmpdz2mcq000104jr9xnhl4i0	TOP_SCORER_ROUND	cms3d5vfv000004jxuwwehm57	2026-07-30 02:43:01.627	2026-07-30 02:43:01.627
cms9npo9y000o04l1p3d71sxt	cmpefcqj2000104ladlx0ysjz	TOP_SCORER_ROUND	cmrpgk0qh000004jttg2q1s11	2026-08-01 00:52:20.134	2026-08-01 00:52:20.134
cms9npo9y000p04l1autc3j54	cmpn1o6et000004jrcnmw0gav	TOP_SCORER_ROUND	cmrpgk0qh000004jttg2q1s11	2026-08-01 00:52:20.134	2026-08-01 00:52:20.134
cmss81zmv001i04ld2bal8er2	cmpefcqj2000104ladlx0ysjz	TOP_SCORER_ROUND	cmsnjw3d4000004l73omej79w	2026-08-14 00:41:38.215	2026-08-14 00:41:38.215
cmsweu94v000z04jubt2amol1	cmpcpimjz000004jpcdqgfhfx	TOP_SCORER_ROUND	cmsd9fo2a000004l80caeqs67	2026-08-16 23:02:39.295	2026-08-16 23:02:39.295
cmsweu94v001004jujmicc3jm	cmpefep0o000504laynrqmhnw	TOP_SCORER_ROUND	cmsd9fo2a000004l80caeqs67	2026-08-16 23:02:39.295	2026-08-16 23:02:39.295
cmt6fj1nb001704jqkp8jyfm9	cmpefcqj2000104ladlx0ysjz	TOP_SCORER_ROUND	cmt0aw2dv000004jyn5mtmejp	2026-08-23 23:19:37.751	2026-08-23 23:19:37.751
cmt6fj1nb001804jql9ttiq17	cmpfk8v2v000704jlp8siky9e	TOP_SCORER_ROUND	cmt0aw2dv000004jyn5mtmejp	2026-08-23 23:19:37.751	2026-08-23 23:19:37.751
\.
COPY public.activity_events (id, "teamId", "userId", type, description, metadata, "createdAt", visibility) FROM stdin;
cmsd9fehm000004l7yk4bae5x	cmpbkj695000004jxaktrnbvc	cmpcoy9by000504l8sw41rlak	TRANSACTION_LOGGED	Lançou uma transação de entrada: Gelo (R$ 10,00)	{"transactionId": "3491f42b-0f23-4542-a232-dc947f83d96e"}	2026-08-03 13:23:30.97	ALL
cmsd9fpfs000v04l8xh4wkd37	cmpbkj695000004jxaktrnbvc	cmpcoy9by000504l8sw41rlak	TRANSACTION_LOGGED	Lançou uma transação de saída: Gelo (R$ 10,00)	{"transactionId": "6cef809a-9a05-41f0-b289-cba2846639fc"}	2026-08-03 13:23:45.16	ALL
cmsd9g8dd000004jj3zligbfj	cmpbkj695000004jxaktrnbvc	cmpcoy9by000504l8sw41rlak	TRANSACTION_LOGGED	Lançou uma transação de saída: Arbitragem contra Azilados (R$ 35,00)	{"transactionId": "6ef1b0df-2070-44b2-a643-0441ed1abda1"}	2026-08-03 13:24:09.698	ALL
cmsd9ggw6000004l6dkaofmb2	cmpbkj695000004jxaktrnbvc	cmpcoy9by000504l8sw41rlak	TRANSACTION_LOGGED	Lançou uma transação de saída: Gelo (R$ 6,00)	{"transactionId": "a38293cb-7c22-4532-8002-ed19b60eafce"}	2026-08-03 13:24:20.742	ALL
cmsd9h6l9000104l6ckea1fzz	cmpbkj695000004jxaktrnbvc	cmpcoy9by000504l8sw41rlak	TRANSACTION_LOGGED	Lançou uma transação de entrada: Cota jogo contra Integral (R$ 95,00)	{"transactionId": "441773c9-5775-4f94-be1b-201dc5a5bad7"}	2026-08-03 13:24:54.045	ALL
cmsnhm7lw000004joke9mfxyc	cmpbkj695000004jxaktrnbvc	cmpcoy9by000504l8sw41rlak	TRANSACTION_LOGGED	Lançou uma transação de entrada: Cota do jogo contra o porto (R$ 100,00)	{"transactionId": "f33206a1-6d71-4909-b537-da10ba8b30f3"}	2026-08-10 17:10:27.332	ALL
cmsnhmgmi000104josbv41dya	cmpbkj695000004jxaktrnbvc	cmpcoy9by000504l8sw41rlak	TRANSACTION_LOGGED	Lançou uma transação de saída: Gelo (R$ 12,00)	{"transactionId": "840d53fe-e8f8-4e1c-91a0-e29655850053"}	2026-08-10 17:10:39.018	ALL
cmssae6xk000004jlyxjtt6yq	cmpbkj695000004jxaktrnbvc	cmpcoy9by000504l8sw41rlak	TRANSACTION_LOGGED	Lançou uma transação de entrada: Cota amistoso (R$ 100,00)	{"transactionId": "8b9e5414-1ca6-4d6c-9729-86a5234c177c"}	2026-08-14 01:47:06.776	ALL
cmssaeind000004l87rw4s7un	cmpbkj695000004jxaktrnbvc	cmpcoy9by000504l8sw41rlak	TRANSACTION_LOGGED	Lançou uma transação de saída: Gelo (R$ 10,00)	{"transactionId": "514e35c2-a10f-4f0f-8317-86c39e1bbf7c"}	2026-08-14 01:47:21.961	ALL
cmssclrmp000304jo1rbld1lt	cmpbkj695000004jxaktrnbvc	cmpcoy9by000504l8sw41rlak	POLL_CREATED	Criou uma nova enquete de data: "Treino"	{"pollId": "cmssclrm7000104jouiqd3n6r"}	2026-08-14 02:48:59.425	ALL
cmst6196a000204jv90zo9707	cmpbkj695000004jxaktrnbvc	cmpcoy9by000504l8sw41rlak	PLAYER_ADDED	Adicionou o jogador Luiz Gustavo (#30) ao elenco	{"playerId": "cmst61960000104jvfkkcgzp4"}	2026-08-14 16:32:50.866	ALL
cmsxfw3bg000004l1sqfyjq6o	cmpbkj695000004jxaktrnbvc	cmpcoy9by000504l8sw41rlak	TRANSACTION_LOGGED	Lançou uma transação de saída: Inscrição campeonato,\nGelo,\nArbitragem (R$ 141,00)	{"transactionId": "c74b685a-afee-4274-865d-ec15c716a7a0"}	2026-08-17 16:19:50.86	ALL
cmt4z49t1000004kznp21jucj	cmpbkj695000004jxaktrnbvc	cmpcoy9by000504l8sw41rlak	TRANSACTION_LOGGED	Lançou uma transação de saída: Arbitragem campeonato (R$ 200,00)	{"transactionId": "bdf20d57-d948-4319-8770-44ea826af073"}	2026-08-22 22:52:28.453	ALL
cmt4z4rsb000104kzo19jspf7	cmpbkj695000004jxaktrnbvc	cmpcoy9by000504l8sw41rlak	TRANSACTION_LOGGED	Lançou uma transação de saída: Goleiro campeonato (R$ 40,00)	{"transactionId": "8a6381ac-5e09-4de5-8cb9-cbecf658752e"}	2026-08-22 22:52:51.755	ALL
cmt9b33sk000004l26m8csrr5	cmpbkj695000004jxaktrnbvc	cmpcoy9by000504l8sw41rlak	TRANSACTION_LOGGED	Lançou uma transação de saída: Arbitragem (R$ 35,00)	{"transactionId": "edd494f4-4513-4ba8-b0ee-ddfc3c980ddd"}	2026-08-25 23:38:34.1	ALL
cmt9b3opv000104l2yzcdewhn	cmpbkj695000004jxaktrnbvc	cmpcoy9by000504l8sw41rlak	TRANSACTION_LOGGED	Lançou uma transação de saída: Goleiro (R$ 30,00)	{"transactionId": "4b03c751-fa6e-4b82-b93c-776b547979be"}	2026-08-25 23:39:01.219	ALL
cmt9b9d7i000204l2v4xzt16y	cmpbkj695000004jxaktrnbvc	cmpcoy9by000504l8sw41rlak	TRANSACTION_LOGGED	Lançou uma transação de entrada: Contribuição jogadores (R$ 120,00)	{"transactionId": "a2fab880-2e7a-4ee6-99c3-771db09e022a"}	2026-08-25 23:43:26.238	ALL
\.
COPY public.audit_logs (id, "teamId", "userId", "userEmail", action, "targetEntity", "targetId", details, "ipAddress", "createdAt") FROM stdin;
cmsjaszb8000060t8uyrzohwu	cmpbkj695000004jxaktrnbvc	cmpbj9qd90000s4t86d3f4avs	admin@admin.com	FINANCES_EXPORTED	Transaction	\N	\N	\N	2026-08-07 18:48:41.157
\.
COPY public.date_poll_options (id, "pollId", date, label, "createdAt") FROM stdin;
cmpftb6xv000104lhsp5snft5	cmpftb6xb000004lhlii3slyl	2026-05-21 19:00:00	\N	2026-05-21 18:16:32.207
cmssclrmf000204jobzb0rnw7	cmssclrm7000104jouiqd3n6r	2026-08-23 21:00:00	\N	2026-08-14 02:48:59.407
\.
COPY public.date_poll_votes (id, "optionId", "playerId", "createdAt") FROM stdin;
\.
COPY public.date_polls (id, "teamId", "matchId", title, "closedAt", "createdAt", "updatedAt") FROM stdin;
cmpftb6xb000004lhlii3slyl	cmpbkj695000004jxaktrnbvc	cmpfezhxy000004lblpwmx62l	Qual a expectativa para o jogo de sabado?	2026-05-21 18:16:56.728	2026-05-21 18:16:32.207	2026-05-21 18:16:56.735
cmssclrm7000104jouiqd3n6r	cmpbkj695000004jxaktrnbvc	\N	Treino	2026-08-14 02:49:14.265	2026-08-14 02:48:59.407	2026-08-14 02:49:14.284
\.
COPY public.default_lineup_selections (id, "teamId", "playerId", role, "sortOrder", "fieldX", "fieldY", "createdAt", "updatedAt") FROM stdin;
cmq9dv07o000n04l80270loi8	cmpbkj695000004jxaktrnbvc	cmpefdukz000404lanevrsp34	STARTER	0	50	14	2026-06-11 10:57:08.052	2026-06-11 10:57:08.052
cmq9dv07o000o04l800fsrrq9	cmpbkj695000004jxaktrnbvc	cmpcqf47m000004l85vce0gfh	STARTER	1	86	55	2026-06-11 10:57:08.052	2026-06-11 10:57:08.052
cmq9dv07o000p04l8j24b43bz	cmpbkj695000004jxaktrnbvc	cmpcm7sgp000004l1fp9o52ky	STARTER	2	72	33	2026-06-11 10:57:08.052	2026-06-11 10:57:08.052
cmq9dv07o000q04l8kbarsix8	cmpbkj695000004jxaktrnbvc	cmpefdkyx000304la3k3nq9p9	STARTER	3	50	30	2026-06-11 10:57:08.052	2026-06-11 10:57:08.052
cmq9dv07o000r04l838s3cwm2	cmpbkj695000004jxaktrnbvc	cmpefcd1z000004lasd2r1kdh	STARTER	4	28	33	2026-06-11 10:57:08.052	2026-06-11 10:57:08.052
cmq9dv07o000s04l8wxa88571	cmpbkj695000004jxaktrnbvc	cmpdz2mcq000104jr9xnhl4i0	STARTER	5	50	60	2026-06-11 10:57:08.052	2026-06-11 10:57:08.052
cmq9dv07o000t04l8029ocpt9	cmpbkj695000004jxaktrnbvc	cmpefcqj2000104ladlx0ysjz	STARTER	6	22	60	2026-06-11 10:57:08.052	2026-06-11 10:57:08.052
cmq9dv07o000u04l8hweytut4	cmpbkj695000004jxaktrnbvc	cmpcpt3n6000004l561lm2ja7	STARTER	7	58	46	2026-06-11 10:57:08.052	2026-06-11 10:57:08.052
cmq9dv07o000v04l8zgki02k9	cmpbkj695000004jxaktrnbvc	cmpcov8jd000004l8umh13pux	STARTER	8	34	46	2026-06-11 10:57:08.052	2026-06-11 10:57:08.052
cmq9dv07o000w04l8rj71bhkf	cmpbkj695000004jxaktrnbvc	cmpfk8v2v000704jlp8siky9e	STARTER	9	58	80	2026-06-11 10:57:08.052	2026-06-11 10:57:08.052
cmq9dv07o000x04l8ag1we1xo	cmpbkj695000004jxaktrnbvc	cmpcopzu6000004jro3prr7ca	STARTER	10	42	80	2026-06-11 10:57:08.052	2026-06-11 10:57:08.052
cmq9dv07o000y04l8tmoyat2x	cmpbkj695000004jxaktrnbvc	cmpcsehq1000104ibueo8dlm5	BENCH	0	\N	\N	2026-06-11 10:57:08.052	2026-06-11 10:57:08.052
cmq9dv07o000z04l8nsdx9t52	cmpbkj695000004jxaktrnbvc	cmpdz3jpw000004jvdohsd2ri	BENCH	1	\N	\N	2026-06-11 10:57:08.052	2026-06-11 10:57:08.052
cmq9dv07o001004l8o4zsmzsj	cmpbkj695000004jxaktrnbvc	cmpcoxez0000304l8g40zcfou	BENCH	2	\N	\N	2026-06-11 10:57:08.052	2026-06-11 10:57:08.052
cmq9dv07o001104l8jtkca4zc	cmpbkj695000004jxaktrnbvc	cmpefep0o000504laynrqmhnw	BENCH	3	\N	\N	2026-06-11 10:57:08.052	2026-06-11 10:57:08.052
cmq9dv07o001204l8xt9e7r8m	cmpbkj695000004jxaktrnbvc	cmpcpimjz000004jpcdqgfhfx	BENCH	4	\N	\N	2026-06-11 10:57:08.052	2026-06-11 10:57:08.052
cmq9dv07o001304l89o5imv86	cmpbkj695000004jxaktrnbvc	cmpcpgupa000004l5ehnc0kjs	BENCH	5	\N	\N	2026-06-11 10:57:08.052	2026-06-11 10:57:08.052
cmq9dv07o001404l8ukfrb5dm	cmpbkj695000004jxaktrnbvc	cmpcsds4s000004jmgpwku1j2	BENCH	6	\N	\N	2026-06-11 10:57:08.052	2026-06-11 10:57:08.052
cmq9dv07o001504l8yc35bkog	cmpbkj695000004jxaktrnbvc	cmpct2xp7000004jsv1ujpe1r	BENCH	7	\N	\N	2026-06-11 10:57:08.052	2026-06-11 10:57:08.052
cmq9dv07o001604l8dmd8fa04	cmpbkj695000004jxaktrnbvc	cmpct94t9000204jsxeeckk3m	BENCH	8	\N	\N	2026-06-11 10:57:08.052	2026-06-11 10:57:08.052
cmq9dv07o001704l85oknndgx	cmpbkj695000004jxaktrnbvc	cmpg41k59000004l7521hfcn4	BENCH	9	\N	\N	2026-06-11 10:57:08.052	2026-06-11 10:57:08.052
cmq9dv07o001804l8ukptn6g3	cmpbkj695000004jxaktrnbvc	cmpg43u13000604l7y6t0hdtt	BENCH	10	\N	\N	2026-06-11 10:57:08.052	2026-06-11 10:57:08.052
cmq9dv07o001904l8nmovgdy0	cmpbkj695000004jxaktrnbvc	cmph7t8a1000004l9n8uic25p	BENCH	11	\N	\N	2026-06-11 10:57:08.052	2026-06-11 10:57:08.052
cmq9dv07o001a04l83rqmd0hw	cmpbkj695000004jxaktrnbvc	cmpn1o6et000004jrcnmw0gav	BENCH	12	\N	\N	2026-06-11 10:57:08.052	2026-06-11 10:57:08.052
\.
COPY public.equipment_orders (id, name, category, quantity, status, notes, "teamId", "createdAt", "updatedAt") FROM stdin;
cmpoitpgm000004laez4khura	Pretos para reserva	SOCKS	5	PENDING	\N	cmpbkj695000004jxaktrnbvc	2026-05-27 20:32:55.846	2026-05-27 20:32:55.846
cmpoiu5r6000104laft16xsp5	Branco para reserva	SOCKS	3	PENDING	\N	cmpbkj695000004jxaktrnbvc	2026-05-27 20:33:16.962	2026-05-27 20:33:16.962
cmpoiuot6000204laefher9rz	Penalty Pro 8	BALL	1	PENDING	\N	cmpbkj695000004jxaktrnbvc	2026-05-27 20:33:41.658	2026-05-27 20:33:41.658
cmpoj0zlb000104i8wt913se5	Vermelho	UNIFORM	6	RECEIVED	\N	cmpbkj695000004jxaktrnbvc	2026-05-27 20:38:35.567	2026-07-16 21:47:13.022
cmpoj0gaw000004i833ty5o82	Cinza	UNIFORM	5	RECEIVED	\N	cmpbkj695000004jxaktrnbvc	2026-05-27 20:38:10.568	2026-07-16 21:47:16.579
cmpoivtn6000r04jxdidd11k9	Prancheta Tática	OTHER	1	RECEIVED		cmpbkj695000004jxaktrnbvc	2026-05-27 20:34:34.578	2026-07-16 21:47:35.166
cmpoivb55000304laz9biogu8	Kit Garrafas Squeeze 6 unidades	OTHER	1	RECEIVED		cmpbkj695000004jxaktrnbvc	2026-05-27 20:34:10.601	2026-07-16 21:47:45.626
\.
COPY public.equipments (id, name, category, "totalQty", "availableQty", "damagedQty", "lostQty", status, location, notes, "teamId", "createdAt", "updatedAt", "minQty") FROM stdin;
cmpoie1uu000o04jxt67lxfqb	Vermelho	UNIFORM	16	16	0	0	GOOD	\N	\N	cmpbkj695000004jxaktrnbvc	2026-05-27 20:20:45.414	2026-05-27 20:20:45.414	20
cmpohsf05000004l72s9cj83f	Cinza	UNIFORM	16	16	0	0	GOOD	Joaquim	\N	cmpbkj695000004jxaktrnbvc	2026-05-27 20:03:56.021	2026-05-27 20:20:53.729	20
cmpoig3lo000p04jx7ok9zoxo	Penalty Pro 8	BALL	1	1	0	0	GOOD	\N	\N	cmpbkj695000004jxaktrnbvc	2026-05-27 20:22:20.988	2026-05-27 20:22:45.07	2
cmpoii1bk000q04jx9hc5c3lf	Branco Reserva	SOCKS	2	2	0	0	GOOD	\N	\N	cmpbkj695000004jxaktrnbvc	2026-05-27 20:23:51.344	2026-05-27 20:23:51.344	5
cmpoiip6r000004k0xehamqdw	Preto Reserva	SOCKS	0	0	0	0	GOOD	\N	\N	cmpbkj695000004jxaktrnbvc	2026-05-27 20:24:22.276	2026-05-27 20:24:22.276	5
cmpoik5x6000104k06ce920s6	Garrafas Squeeze	OTHER	0	0	0	0	GOOD	\N	\N	cmpbkj695000004jxaktrnbvc	2026-05-27 20:25:30.618	2026-05-27 20:25:30.618	6
cmpoim0k1000204k06mj43kns	Prancheta Tática	OTHER	0	0	0	0	GOOD	\N	\N	cmpbkj695000004jxaktrnbvc	2026-05-27 20:26:56.977	2026-05-27 20:26:56.977	1
\.
COPY public.fines (id, "playerId", "ruleId", description, date, "teamId", "createdAt", "updatedAt", "matchesSuspended", severity, status, "punishmentTypeId", "suspendedMatchId") FROM stdin;
cms399d56000r04ju9x4i9t1c	cmpct94t9000204jsxeeckk3m	cmpcm3peo000004jlou84ub6l	Atraso por jogo	2026-07-25 00:00:00	cmpbkj695000004jxaktrnbvc	2026-07-27 13:21:07.53	2026-07-27 13:21:07.53	\N	WARNING	ACTIVE	cmpigtkya000204laljnrvmrb	\N
cms399q85000v04l41e7ow5gq	cmpdz2mcq000104jr9xnhl4i0	cmpcm3peo000004jlou84ub6l	Atraso por jogo	2026-07-25 00:00:00	cmpbkj695000004jxaktrnbvc	2026-07-27 13:21:24.485	2026-07-27 13:21:24.485	\N	WARNING	ACTIVE	cmpigtkya000204laljnrvmrb	\N
cms39ab3x000s04ju89bjeuj0	cmpefcqj2000104ladlx0ysjz	cmpcm3peo000004jlou84ub6l	Atraso por jogo	2026-07-25 00:00:00	cmpbkj695000004jxaktrnbvc	2026-07-27 13:21:51.549	2026-07-27 13:21:51.549	\N	WARNING	ACTIVE	cmpigtkya000204laljnrvmrb	\N
cms39auka000104jxjhxrmvdt	cmpefdkyx000304la3k3nq9p9	cmpcm3peo000004jlou84ub6l	Atraso por jogo	2026-07-25 00:00:00	cmpbkj695000004jxaktrnbvc	2026-07-27 13:22:16.762	2026-07-27 13:22:16.762	\N	WARNING	ACTIVE	cmpigtkya000204laljnrvmrb	\N
cms39bdsc000w04l4sco49u9k	cmpcopzu6000004jro3prr7ca	cmpcm3peo000004jlou84ub6l	Atraso por jogo	2026-07-25 00:00:00	cmpbkj695000004jxaktrnbvc	2026-07-27 13:22:41.676	2026-07-27 13:22:41.676	\N	WARNING	ACTIVE	cmpigtkya000204laljnrvmrb	\N
cms39c1m5000104l8o0r73j6q	cmpcpimjz000004jpcdqgfhfx	cmpcm3peo000004jlou84ub6l	Atraso por jogo	2026-07-25 00:00:00	cmpbkj695000004jxaktrnbvc	2026-07-27 13:23:12.557	2026-07-27 13:23:12.557	\N	WARNING	ACTIVE	cmpigtkya000204laljnrvmrb	\N
cms39cidl000204jxnjqbo6rw	cmph7t8a1000004l9n8uic25p	cmpcm3peo000004jlou84ub6l	Atraso por jogo	2026-07-25 00:00:00	cmpbkj695000004jxaktrnbvc	2026-07-27 13:23:34.281	2026-07-27 13:23:34.281	\N	WARNING	ACTIVE	cmpigtkya000204laljnrvmrb	\N
cms397d3a000u04l4jjvuq8q0	cmpcqf47m000004l85vce0gfh	cmpcm3peo000004jlou84ub6l	Atraso por jogo	2026-07-25 00:00:00	cmpbkj695000004jxaktrnbvc	2026-07-27 13:19:34.15	2026-07-27 13:19:34.15	\N	WARNING	ACTIVE	cmpigtkya000204laljnrvmrb	\N
cms398z2m000004l8mvzlan8p	cmpcpt3n6000004l561lm2ja7	cmpcm3peo000004jlou84ub6l	Atraso por jogo	2026-07-25 00:00:00	cmpbkj695000004jxaktrnbvc	2026-07-27 13:20:49.294	2026-07-27 13:20:49.294	\N	WARNING	ACTIVE	cmpigtkya000204laljnrvmrb	\N
\.
COPY public.friendly_requests (id, "requesterTeamName", "contactEmail", "contactPhone", "suggestedDates", "suggestedVenue", "proposedFee", status, "rejectionReason", "teamId", "createdAt", "updatedAt", "requesterTeamId") FROM stdin;
cmpg3hja5000l04jultu64ywo	Ajax	fcowesley2303@gmail.com	85989401486	Dia 06/06 às 16h	Areninha da Vila Olímpica da Messejana	130.00	APPROVED	\N	cmpbkj695000004jxaktrnbvc	2026-05-21 23:01:24.317	2026-05-21 23:03:20.139	\N
\.
COPY public.guest_players (id, name, "shirtNumber", "position", "matchId", "teamId", "createdAt", "updatedAt", cpf) FROM stdin;
cmpohz21c000004jx24id9rok	Aurélio	\N	GOALKEEPER	cmpkl4qyr000004l41n642701	cmpbkj695000004jxaktrnbvc	2026-05-27 20:09:05.808	2026-05-27 20:09:05.808	\N
cmpol69a5000004l7wi5vd4ad	Berg	\N	DEFENDER	cmpkl4qyr000004l41n642701	cmpbkj695000004jxaktrnbvc	2026-05-27 21:38:40.637	2026-05-27 21:38:40.637	\N
cmpsgy3kr000004l76jl6gdk5	Abílio	\N	DEFENSIVE_MIDFIELDER	cmpr23ivg000204icrms1915w	cmpbkj695000004jxaktrnbvc	2026-05-30 14:51:26.235	2026-05-30 14:51:26.235	\N
cmpslxcyw000004l416kqdc9h	Robgol	\N	RIGHT_WINGER	cmpr23ivg000204icrms1915w	cmpbkj695000004jxaktrnbvc	2026-05-30 17:10:49.832	2026-05-30 17:10:49.832	\N
cmqe5zpmt000204l25zy7ohyt	Eval	\N	LEFT_WINGER	cmq9kccux000004l58m8puvai	cmpbkj695000004jxaktrnbvc	2026-06-14 19:15:41.573	2026-06-14 19:15:41.573	\N
cmqe5zzgb000304l21rk9ubv0	Sebastião	\N	FORWARD	cmq9kccux000004l58m8puvai	cmpbkj695000004jxaktrnbvc	2026-06-14 19:15:54.3	2026-06-14 19:15:54.3	\N
cmqe606p8000004l5j21svsoh	Gabriel	\N	DEFENSIVE_MIDFIELDER	cmq9kccux000004l58m8puvai	cmpbkj695000004jxaktrnbvc	2026-06-14 19:16:03.692	2026-06-14 19:16:03.692	\N
cmqe60f05000004ll8vlr1u74	Jeferson	\N	LEFT_BACK	cmq9kccux000004l58m8puvai	cmpbkj695000004jxaktrnbvc	2026-06-14 19:16:14.453	2026-06-14 19:16:14.453	\N
cmqe60oyw000104ll0wy6aevp	Abílio	\N	DEFENSIVE_MIDFIELDER	cmq9kccux000004l58m8puvai	cmpbkj695000004jxaktrnbvc	2026-06-14 19:16:27.368	2026-06-14 19:16:27.368	\N
cmqi3jlsz000004icv2ftp956	Magão	\N	DEFENSIVE_MIDFIELDER	cmq9kccux000004l58m8puvai	cmpbkj695000004jxaktrnbvc	2026-06-17 13:18:15.587	2026-06-17 13:18:15.587	\N
cmqp55dtw000004joj17g14h4	Frutuoso	\N	GOALKEEPER	cmpg3rbz2000004la05x1z03i	cmpbkj695000004jxaktrnbvc	2026-06-22 11:37:34.532	2026-06-22 11:37:34.532	\N
cmqp55xex000104joppfgvf9t	Magão	\N	DEFENSIVE_MIDFIELDER	cmpg3rbz2000004la05x1z03i	cmpbkj695000004jxaktrnbvc	2026-06-22 11:37:59.913	2026-06-22 11:37:59.913	\N
cmqp565iz000004l597qyl257	Berg	\N	DEFENSIVE_MIDFIELDER	cmpg3rbz2000004la05x1z03i	cmpbkj695000004jxaktrnbvc	2026-06-22 11:38:10.428	2026-06-22 11:38:10.428	\N
cmr4v31be000004l5cpda9y3t	Frutuoso	\N	GOALKEEPER	cmq59e1vu000004juzmp8xftw	cmpbkj695000004jxaktrnbvc	2026-07-03 11:40:07.658	2026-07-03 11:40:07.658	\N
cmr6fb1io000004l4iyxqk8ns	George	\N	LEFT_WINGER	cmr4v6j8z000004jmrs48v3h3	cmpbkj695000004jxaktrnbvc	2026-07-04 13:53:59.664	2026-07-04 13:53:59.664	\N
cmr6fbbr5000004jv15p6b2im	Henrique Jorge	\N	FORWARD	cmr4v6j8z000004jmrs48v3h3	cmpbkj695000004jxaktrnbvc	2026-07-04 13:54:12.93	2026-07-04 13:54:12.93	\N
cmrnwdiee000004ldvhn5k2ft	Henrique Jorge	\N	FORWARD	cmrkxjsua000004jtqvbnfwac	cmpbkj695000004jxaktrnbvc	2026-07-16 19:23:53.318	2026-07-16 19:23:53.318	\N
cmrnwl1mg000104ldorxpquij	Felipe	\N	RIGHT_WINGER	cmrkxjsua000004jtqvbnfwac	cmpbkj695000004jxaktrnbvc	2026-07-16 19:29:44.824	2026-07-16 19:29:44.824	\N
cmrozrrrf000004l5i4q9s0qe	Charles	\N	GOALKEEPER	cmrkxjsua000004jtqvbnfwac	cmpbkj695000004jxaktrnbvc	2026-07-17 13:46:43.659	2026-07-17 13:46:43.659	\N
cmrp3cv27000004l2opjs1ij2	Aurélio	\N	GOALKEEPER	cmqp62ilp000004jul47gswr8	cmpbkj695000004jxaktrnbvc	2026-07-17 15:27:06.559	2026-07-17 15:27:06.559	\N
cmrp3deel000004i3d7fks5ke	Magão	\N	DEFENSIVE_MIDFIELDER	cmqp62ilp000004jul47gswr8	cmpbkj695000004jxaktrnbvc	2026-07-17 15:27:31.629	2026-07-17 15:27:31.629	\N
cmrp3dmyb000104l2x24r6itt	Felipe	\N	RIGHT_WINGER	cmqp62ilp000004jul47gswr8	cmpbkj695000004jxaktrnbvc	2026-07-17 15:27:42.707	2026-07-17 15:27:42.707	\N
cmrp3ybfk000004l54dm1yosy	Berg	\N	DEFENSIVE_MIDFIELDER	cmr4v6j8z000004jmrs48v3h3	cmpbkj695000004jxaktrnbvc	2026-07-17 15:43:47.552	2026-07-17 15:43:47.552	\N
cmrp45iya000004l79ltrmhya	Danrley	\N	MIDFIELDER	cmq59e1vu000004juzmp8xftw	cmpbkj695000004jxaktrnbvc	2026-07-17 15:49:23.89	2026-07-17 15:49:23.89	\N
cmrp45o8h000004ksdg2qpj8s	Magão	\N	DEFENSIVE_MIDFIELDER	cmq59e1vu000004juzmp8xftw	cmpbkj695000004jxaktrnbvc	2026-07-17 15:49:30.737	2026-07-17 15:49:30.737	\N
cmrp5nm92000004l4y86d072u	Manoel	\N	DEFENDER	cmpr23ivg000204icrms1915w	cmpbkj695000004jxaktrnbvc	2026-07-17 16:31:27.59	2026-07-17 16:31:27.59	\N
cmrp8ctgg000004lcwm8kpp5d	Victor Coelho	\N	RIGHT_WINGER	cmrp8963m000004larspejvgr	cmpbkj695000004jxaktrnbvc	2026-07-17 17:47:02.56	2026-07-17 17:47:02.56	\N
cmrp8g9ju000004l4vofclrlu	Matheus	\N	FORWARD	cmpgxpcmr000104l1gbglqrdc	cmpbkj695000004jxaktrnbvc	2026-07-17 17:49:43.386	2026-07-17 17:49:43.386	\N
cmrp9z1ns000o04jpjhiynaor	Maicon	\N	RIGHT_WINGER	cmrp9yfic000004jpt8bwp440	cmpbkj695000004jxaktrnbvc	2026-07-17 18:32:19.24	2026-07-17 18:32:19.24	\N
cmrp9z9ne000004jsrwa2hqde	Marlon	\N	MIDFIELDER	cmrp9yfic000004jpt8bwp440	cmpbkj695000004jxaktrnbvc	2026-07-17 18:32:29.594	2026-07-17 18:32:29.594	\N
cmrp9zx9m000204kz1cbpv1rw	Victor Coelho	\N	RIGHT_WINGER	cmrp9yfic000004jpt8bwp440	cmpbkj695000004jxaktrnbvc	2026-07-17 18:33:00.202	2026-07-17 18:33:00.202	\N
cmrpa8uzp000304kzg6xickjp	Victor Coelho	\N	RIGHT_WINGER	cmrpa59lt000p04jpzp8qdy4l	cmpbkj695000004jxaktrnbvc	2026-07-17 18:39:57.157	2026-07-17 18:39:57.157	\N
cmrpbusr5003304ldfdrzw9ub	Danrley	\N	MIDFIELDER	cmrpbrolu002f04ld1jou7dvp	cmpbkj695000004jxaktrnbvc	2026-07-17 19:25:00.305	2026-07-17 19:25:00.305	\N
cmrpgs5yy001c04jt1w2oexg8	Danrley	\N	MIDFIELDER	cmrpgrdrs000o04jtnnx9wcf4	cmpbkj695000004jxaktrnbvc	2026-07-17 21:42:55.546	2026-07-17 21:42:55.546	\N
cmrpgsfkc000004jth6k035mr	Gabriel	\N	LEFT_BACK	cmrpgrdrs000o04jtnnx9wcf4	cmpbkj695000004jxaktrnbvc	2026-07-17 21:43:07.98	2026-07-17 21:43:07.98	\N
cmrqlopou000004laqlusx2d1	Gabriel	\N	LEFT_BACK	cmrqlng1w000004junomwb3sz	cmpbkj695000004jxaktrnbvc	2026-07-18 16:47:58.734	2026-07-18 16:47:58.734	\N
cmrqtu0h3000004lffcbgo1i8	Frutuoso	\N	GOALKEEPER	cmqp5jh8b000004jp8k1q116l	cmpbkj695000004jxaktrnbvc	2026-07-18 20:36:02.919	2026-07-18 20:36:02.919	\N
cmrquvpyi000004l7unpqoe7j	George	\N	LEFT_WINGER	cmqp5jh8b000004jp8k1q116l	cmpbkj695000004jxaktrnbvc	2026-07-18 21:05:22.218	2026-07-18 21:05:22.218	\N
cmrquvxr1000204lb5m6v8ik1	Henrique Jorge	\N	FORWARD	cmqp5jh8b000004jp8k1q116l	cmpbkj695000004jxaktrnbvc	2026-07-18 21:05:32.317	2026-07-18 21:05:32.317	\N
cmrw3v4ri000104l2gfpdms8z	Henrique Jorge	\N	FORWARD	cmrkxlng5000004jofpanlfev	cmpbkj695000004jxaktrnbvc	2026-07-22 13:15:42.174	2026-07-22 13:15:42.174	\N
cmrzexgp2000004l78kqxjk6i	Alison	\N	FORWARD	cmrthsbf6000004kybfhn32yj	cmpbkj695000004jxaktrnbvc	2026-07-24 20:48:45.254	2026-07-24 20:48:45.254	\N
cmrzexwwc000004jswbo5x3tv	George	\N	MIDFIELDER	cmrthsbf6000004kybfhn32yj	cmpbkj695000004jxaktrnbvc	2026-07-24 20:49:06.253	2026-07-24 20:49:06.253	\N
cmrzf5nhj000004ktc5cfdvhn	Daniel	\N	MIDFIELDER	cmrthsbf6000004kybfhn32yj	cmpbkj695000004jxaktrnbvc	2026-07-24 20:55:07.304	2026-07-24 20:55:07.304	\N
cms0jkysa000004l1f4w2tuwg	Gilmario	\N	DEFENSIVE_MIDFIELDER	cmrthsbf6000004kybfhn32yj	cmpbkj695000004jxaktrnbvc	2026-07-25 15:46:46.426	2026-07-25 15:46:46.426	\N
cms38trc5000004jxs9a018ai	Lima	\N	GOALKEEPER	cmrthsbf6000004kybfhn32yj	cmpbkj695000004jxaktrnbvc	2026-07-27 13:08:59.429	2026-07-27 13:08:59.429	\N
cms8wyiin000004l5g27tpmk2	Aurélio	\N	GOALKEEPER	cmrpgk0qh000004jttg2q1s11	cmpbkj695000004jxaktrnbvc	2026-07-31 12:23:22.943	2026-07-31 12:23:22.943	\N
cms9gingl000004la9tsynrto	Daniel ponta	\N	LEFT_WINGBACK	cmrpgk0qh000004jttg2q1s11	cmpbkj695000004jxaktrnbvc	2026-07-31 21:30:55.173	2026-07-31 21:30:55.173	\N
cms9gj2zl000004k15sk7bual	Magao	\N	\N	cmrpgk0qh000004jttg2q1s11	cmpbkj695000004jxaktrnbvc	2026-07-31 21:31:15.297	2026-07-31 21:31:15.297	\N
cms9gjhvz000004joimfxq242	Arilouco zagueiro	\N	\N	cmrpgk0qh000004jttg2q1s11	cmpbkj695000004jxaktrnbvc	2026-07-31 21:31:34.607	2026-07-31 21:31:34.607	\N
cms9gjsy7000004jpqr11nr9h	Ramon volante	\N	\N	cmrpgk0qh000004jttg2q1s11	cmpbkj695000004jxaktrnbvc	2026-07-31 21:31:48.943	2026-07-31 21:31:48.943	\N
cmsc66qh4000004kvzi0f1rz3	Wender	\N	MIDFIELDER	cmsadtjr8000004joiy5e4pc7	cmpbkj695000004jxaktrnbvc	2026-08-02 19:05:01.576	2026-08-02 19:05:01.576	\N
cmsg932g6000004jx2zr07fxx	Damabioh Francelino de Oliveira	\N	MIDFIELDER	cmpg3u3kh000l04la6hj2e5r3	cmpbkj695000004jxaktrnbvc	2026-08-05 15:37:14.022	2026-08-05 15:37:14.022	60836475330
cmsgc4biu000004lcyvrpzkx6	Luiz Gustavo Da Costa Oliveira	\N	MIDFIELDER	cmpg3u3kh000l04la6hj2e5r3	cmpbkj695000004jxaktrnbvc	2026-08-05 17:02:11.286	2026-08-05 17:02:11.286	07012487348
cmsj1phbf000004l78gg04nk6	Matheus Vinícius Costa Sousa	\N	FORWARD	cmpg3u3kh000l04la6hj2e5r3	cmpbkj695000004jxaktrnbvc	2026-08-07 14:34:01.323	2026-08-07 14:34:01.323	07911107378
cmskcuerr000e04jnr5j7fhs4	David Ronald Pereira	\N	GOALKEEPER	cmpg3u3kh000l04la6hj2e5r3	cmpbkj695000004jxaktrnbvc	2026-08-08 12:33:33.255	2026-08-08 12:33:33.255	\N
cmspgjypm000004kysmvkqplm	Nogueira	\N	GOALKEEPER	cmsnjw3d4000004l73omej79w	cmpbkj695000004jxaktrnbvc	2026-08-12 02:16:15.226	2026-08-12 02:16:15.226	\N
cmspxfiuv000004jxpaj9z2h4	Gustavo	\N	DEFENSIVE_MIDFIELDER	cmsnjw3d4000004l73omej79w	cmpbkj695000004jxaktrnbvc	2026-08-12 10:08:41.528	2026-08-12 10:08:41.528	\N
cmsrtfetn000004kwf027gs36	Magao	\N	DEFENDER	cmsnjw3d4000004l73omej79w	cmpbkj695000004jxaktrnbvc	2026-08-13 17:52:10.187	2026-08-13 17:52:10.187	\N
cmsv0y7sj000004kzopwy8py9	Manoel	\N	GOALKEEPER	cmsd9fo2a000004l80caeqs67	cmpbkj695000004jxaktrnbvc	2026-08-15 23:46:03.379	2026-08-15 23:46:03.379	\N
cmt1fctcn000004lflaxol39d	Magao	\N	DEFENDER	cmsx2wppc000004ldfwf8elsy	cmpbkj695000004jxaktrnbvc	2026-08-20 11:15:56.183	2026-08-20 11:15:56.183	\N
cmt55yeme000204jq2ea6h0tu	George	\N	MIDFIELDER	cmt0aw2dv000004jyn5mtmejp	cmpbkj695000004jxaktrnbvc	2026-08-23 02:03:52.07	2026-08-23 02:03:52.07	\N
cmt5ve5xc000204juox35y5w2	Flaviano	\N	LEFT_BACK	cmt0aw2dv000004jyn5mtmejp	cmpbkj695000004jxaktrnbvc	2026-08-23 13:55:57.696	2026-08-23 13:55:57.696	\N
cmt5vj0a7000004jv02xu8nzj	Luiz	\N	DEFENDER	cmt0aw2dv000004jyn5mtmejp	cmpbkj695000004jxaktrnbvc	2026-08-23 13:59:43.664	2026-08-23 13:59:43.664	\N
cmt5vz0k9000004ldxwbo68sq	Rafael	\N	FORWARD	cmt0aw2dv000004jyn5mtmejp	cmpbkj695000004jxaktrnbvc	2026-08-23 14:12:10.521	2026-08-23 14:12:10.521	\N
cmt5zopwv000004jufwc47pxw	Flávio	\N	RIGHT_WINGBACK	cmt0aw2dv000004jyn5mtmejp	cmpbkj695000004jxaktrnbvc	2026-08-23 15:56:08.623	2026-08-23 15:56:08.623	\N
cmt5zozbq000004l3sl8s7mv0	Messias	\N	DEFENSIVE_MIDFIELDER	cmt0aw2dv000004jyn5mtmejp	cmpbkj695000004jxaktrnbvc	2026-08-23 15:56:20.823	2026-08-23 15:56:20.823	\N
cmt5zpeyn000104ju3scdov2h	Gabriel	\N	MIDFIELDER	cmt0aw2dv000004jyn5mtmejp	cmpbkj695000004jxaktrnbvc	2026-08-23 15:56:41.087	2026-08-23 15:56:41.087	\N
cmt94uqbr000004l3vobw1jqp	Wender	\N	MIDFIELDER	cmskhxpbb000004jq77wb6pqt	cmpbkj695000004jxaktrnbvc	2026-08-25 20:44:05.703	2026-08-25 20:44:05.703	\N
cmt9s41lt000004l1tflnvojq	Erick	\N	LEFT_WINGBACK	cmskhxpbb000004jq77wb6pqt	cmpbkj695000004jxaktrnbvc	2026-08-26 07:35:11.393	2026-08-26 07:35:11.393	\N
cmt9s4aa4000004jx57es2ev9	Gabriel	\N	MIDFIELDER	cmskhxpbb000004jq77wb6pqt	cmpbkj695000004jxaktrnbvc	2026-08-26 07:35:22.636	2026-08-26 07:35:22.636	\N
cmtaiuip6000004letwqi9ce4	Magao	\N	DEFENDER	cmskhxpbb000004jq77wb6pqt	cmpbkj695000004jxaktrnbvc	2026-08-26 20:03:36.618	2026-08-26 20:03:36.618	\N
\.
COPY public.invite_tokens (id, token, "teamId", "playerId", "expiresAt", "usedAt", "createdAt", "updatedAt") FROM stdin;
cmpflc3ea000004lbaf3uugs1	045b1b49-9fb2-43c9-82d1-7b4f8713cbe0	cmpbkj695000004jxaktrnbvc	cmpfk8v2v000704jlp8siky9e	2026-05-28 14:33:17.355	2026-05-21 15:19:09.732	2026-05-21 14:33:17.362	2026-05-21 15:19:09.737
cmpfr6rgv000004iksau206x4	15aadb8e-1eaf-4501-bb62-d2826406f871	cmpbkj695000004jxaktrnbvc	cmpdz3jpw000004jvdohsd2ri	2026-05-28 17:17:06.312	2026-05-21 17:20:03.174	2026-05-21 17:17:06.319	2026-05-21 17:20:03.177
cmpfunccl000004l5f9zxdvf2	2569dac5-1c5f-4d33-866d-f9ef0bada993	cmpbkj695000004jxaktrnbvc	cmpefdkyx000304la3k3nq9p9	2026-05-28 18:53:58.718	2026-05-21 19:05:57.317	2026-05-21 18:53:58.726	2026-05-21 19:05:57.32
cmpg6mro1000004l2wrnpb0j3	4aedde89-a6fc-4cce-a98a-5069c778bed8	cmpbkj695000004jxaktrnbvc	cmpcqf47m000004l85vce0gfh	2026-05-29 00:29:27.304	\N	2026-05-22 00:29:27.313	2026-05-22 00:29:27.313
cmpcqf8lh000104l8shib7o0s	e72a2e30-d069-44e9-8932-593b75ddbe16	cmpbkj695000004jxaktrnbvc	cmpcqf47m000004l85vce0gfh	2026-05-26 14:32:23.62	2026-05-22 12:01:43.139	2026-05-19 14:32:23.622	2026-05-22 12:01:43.143
cmpgvihe9000004l7xol09bgq	57567e1d-0a69-4ee1-b474-7b670bd3f7d2	cmpbkj695000004jxaktrnbvc	cmpg41k59000004l7521hfcn4	2026-05-29 12:05:57.763	\N	2026-05-22 12:05:57.777	2026-05-22 12:05:57.777
cmpgxkrev000004l1swhd8s16	65622682-1d1f-4e43-af7a-78dbe122918a	cmpbkj695000004jxaktrnbvc	cmpg41k59000004l7521hfcn4	2026-05-29 13:03:43.295	\N	2026-05-22 13:03:43.303	2026-05-22 13:03:43.303
cmpgxlu73000004la0mylmudz	5c30e372-aa87-4099-8fc8-552c46e4f4a9	cmpbkj695000004jxaktrnbvc	cmpg41k59000004l7521hfcn4	2026-05-29 13:04:33.56	2026-05-22 13:06:50.274	2026-05-22 13:04:33.567	2026-05-22 13:06:50.278
cmpg6j3r8000004jmhoep00d7	01a690b8-bb5d-4074-b66e-d1d02cf7f93b	cmpbkj695000004jxaktrnbvc	cmpefep0o000504laynrqmhnw	2026-05-29 00:26:36.348	2026-05-22 15:02:04.488	2026-05-22 00:26:36.357	2026-05-22 15:02:04.492
cmphebmx6000004l1p40shvcs	3184a67a-8715-4654-89a9-43b8c24b65fb	cmpbkj695000004jxaktrnbvc	cmpcpt3n6000004l561lm2ja7	2026-05-29 20:52:31.043	2026-05-22 20:53:44.263	2026-05-22 20:52:31.05	2026-05-22 20:53:44.266
cmpcoxjej000404l8hcw7diza	5224be53-0060-4ed3-9557-f1ac49810c17	cmpbkj695000004jxaktrnbvc	cmpcoxez0000304l8g40zcfou	2026-05-26 13:50:38.203	2026-05-19 13:51:11.819	2026-05-19 13:50:38.203	2026-05-19 13:51:11.822
cmphnpo1q000004la4ghn4m53	b4617ef3-a218-46aa-984e-3ed2e5cff868	cmpbkj695000004jxaktrnbvc	cmpefdukz000404lanevrsp34	2026-05-30 01:15:22.232	2026-05-23 01:19:06.56	2026-05-23 01:15:22.238	2026-05-23 01:19:06.563
cmphnxdv0000004jsu9fpemhh	01eb063c-f91d-4211-a752-efff6ff2a721	cmpbkj695000004jxaktrnbvc	cmpefcqj2000104ladlx0ysjz	2026-05-30 01:21:22.276	\N	2026-05-23 01:21:22.284	2026-05-23 01:21:22.284
cmpcptdop000004js8l7xltuj	52838c56-6c08-489b-971c-6ae90ac8ec41	cmpbkj695000004jxaktrnbvc	cmpcpt3n6000004l561lm2ja7	2026-05-26 14:15:23.777	\N	2026-05-19 14:15:23.785	2026-05-19 14:15:23.785
cmphnp0ui000004joor0qt8tj	9fdb66e6-7889-4944-8870-21603c71166a	cmpbkj695000004jxaktrnbvc	cmpefcqj2000104ladlx0ysjz	2026-05-30 01:14:52.164	2026-05-23 01:24:06.949	2026-05-23 01:14:52.171	2026-05-23 01:24:06.953
cmpj1gm83000004l127bi3xfy	37757e00-2c75-47c6-b106-cb30415555de	cmpbkj695000004jxaktrnbvc	cmpct2xp7000004jsv1ujpe1r	2026-05-31 00:28:00.762	2026-05-24 01:21:17.492	2026-05-24 00:28:00.771	2026-05-24 01:21:17.497
cmpcqp1px000004l79himgm1j	be2c0b11-9b86-44dc-815d-38935622eedb	cmpbkj695000004jxaktrnbvc	cmpcpgupa000004l5ehnc0kjs	2026-05-26 14:40:01.261	\N	2026-05-19 14:40:01.27	2026-05-19 14:40:01.27
cmpn1oe78000004jrbb9q377s	501da39e-37d2-47e1-bac4-a71169ee79fb	cmpbkj695000004jxaktrnbvc	cmpn1o6et000004jrcnmw0gav	2026-06-02 19:45:08.316	2026-05-26 19:52:55.255	2026-05-26 19:45:08.324	2026-05-26 19:52:55.259
cmpcpj2zl000104jpgusi6925	f65dc002-a360-4000-9398-2ed266be6e3d	cmpbkj695000004jxaktrnbvc	cmpcpimjz000004jpcdqgfhfx	2026-05-26 14:07:23.358	2026-05-19 15:03:28.991	2026-05-19 14:07:23.361	2026-05-19 15:03:28.995
cmpn5fi9g000004jiujb3kqbl	3b919166-4406-4bf8-90e4-758f2645a4db	cmpbkj695000004jxaktrnbvc	cmph7t8a1000004l9n8uic25p	2026-06-02 21:30:12.14	\N	2026-05-26 21:30:12.148	2026-05-26 21:30:12.148
cmpcph303000104l52ebayk90	eaece908-d9d6-4774-8e20-9d2715aba09e	cmpbkj695000004jxaktrnbvc	cmpcpgupa000004l5ehnc0kjs	2026-05-26 14:05:50.064	2026-05-19 15:04:23.386	2026-05-19 14:05:50.067	2026-05-19 15:04:23.387
cmpcse3i9000004ibj4zaaboa	4bf8b99c-aab1-4544-afd2-023e24c0c9a8	cmpbkj695000004jxaktrnbvc	cmpcsds4s000004jmgpwku1j2	2026-05-26 15:27:29.588	\N	2026-05-19 15:27:29.602	2026-05-19 15:27:29.602
cmpct36vn000104jszvemz6bk	2e53e2ca-bf72-4c40-a975-40976c34f113	cmpbkj695000004jxaktrnbvc	cmpct2xp7000004jsv1ujpe1r	2026-05-26 15:47:00.369	\N	2026-05-19 15:47:00.371	2026-05-19 15:47:00.371
cmpcoqnhk000204jrnu63xhse	40fa1403-d426-46f6-a108-a024656ba934	cmpbkj695000004jxaktrnbvc	cmpcopzu6000004jro3prr7ca	2026-05-26 13:45:16.904	2026-05-19 16:05:17.945	2026-05-19 13:45:16.904	2026-05-19 16:05:17.949
cmpcovpad000204l8s1kpkr2i	d336daf2-8d05-4c1b-9f50-08c608e125ce	cmpbkj695000004jxaktrnbvc	cmpcov8jd000004l8umh13pux	2026-05-26 13:49:12.517	2026-05-19 21:59:25.827	2026-05-19 13:49:12.517	2026-05-19 21:59:25.831
cmpmugtzj000104l7vpgnnf5d	ab1b3ea5-993f-4c9a-8980-d10187ca68c0	cmpbkj695000004jxaktrnbvc	cmph7t8a1000004l9n8uic25p	2026-06-02 16:23:18.221	2026-05-26 21:30:57.35	2026-05-26 16:23:18.224	2026-05-26 21:30:57.354
cmpcsesep000204ibz76tz673	22d9914c-16db-42b2-be27-5040f1aed8d0	cmpbkj695000004jxaktrnbvc	cmpcsehq1000104ibueo8dlm5	2026-05-26 15:28:01.872	2026-05-19 22:40:28.082	2026-05-19 15:28:01.873	2026-05-19 22:40:28.087
cmpy6l7e1000404jrmbv5flnp	67b14c2a-736f-4427-a92f-ffd730c0c523	cmpbkj695000004jxaktrnbvc	cmpg43u13000604l7y6t0hdtt	2026-06-10 14:48:05.543	\N	2026-06-03 14:48:05.545	2026-06-03 14:48:05.545
cmrp1pvdr000004jtes564z1p	deaa7982-7f48-4755-b8a3-d82d0fec7637	cmpbkj695000004jxaktrnbvc	cmrozuqv4000104l5tbza8qgy	2026-07-24 14:41:14.263	2026-07-18 15:48:49.45	2026-07-17 14:41:14.272	2026-07-18 15:48:49.454
cmpct9jmk000304js1nmvuhb5	626e60bc-1105-4c22-9d55-17013dab39c8	cmpbkj695000004jxaktrnbvc	cmpct94t9000204jsxeeckk3m	2026-05-26 15:51:56.827	2026-05-19 23:05:29.156	2026-05-19 15:51:56.828	2026-05-19 23:05:29.16
cmsd6vw3p000204l7416rq5wg	08f4f7da-7a94-4b48-a3b5-626fc7c5bcca	cmpbkj695000004jxaktrnbvc	cmsd6v73x000004jupd8tbvon	2026-08-10 12:12:21.444	2026-08-03 12:30:07.859	2026-08-03 12:12:21.445	2026-08-03 12:30:07.863
cmst61kto000004jsyy61tphh	9a7b1ff3-8fa1-4c09-bf53-704a2e76222a	cmpbkj695000004jxaktrnbvc	cmst61960000104jvfkkcgzp4	2026-08-21 16:33:05.945	2026-08-14 21:53:00.267	2026-08-14 16:33:05.964	2026-08-14 21:53:00.271
cmpcn6fwc000104lbktkzsac7	a57a45ea-9342-4f33-9dd6-a0f64c1e16e8	cmpbkj695000004jxaktrnbvc	cmpcm7sgp000004l1fp9o52ky	2026-05-26 13:01:34.332	2026-05-19 13:16:31.889	2026-05-19 13:01:34.332	2026-05-19 13:16:31.894
cmpdz3te9000104jvh9lpuf9s	97dabf51-4aff-47e8-a373-38e476f4f22e	cmpbkj695000004jxaktrnbvc	cmpdz3jpw000004jvdohsd2ri	2026-05-27 11:23:13.423	\N	2026-05-20 11:23:13.425	2026-05-20 11:23:13.425
cmpdz2497000004jrdwit038j	dcc044d1-f0c2-4d46-b0c7-7e55c013fb98	cmpbkj695000004jxaktrnbvc	cmpcsds4s000004jmgpwku1j2	2026-05-27 11:21:54.178	2026-05-20 12:05:59.445	2026-05-20 11:21:54.187	2026-05-20 12:05:59.449
cmpdz2vmh000204jrovuhrihk	02c464bc-54d2-47b6-9be1-f502cac37fd2	cmpbkj695000004jxaktrnbvc	cmpdz2mcq000104jr9xnhl4i0	2026-05-27 11:22:29.657	2026-05-20 20:40:58.885	2026-05-20 11:22:29.657	2026-05-20 20:40:58.889
cmpfhvsfi000004i9i372m13d	ff8cb76a-9ef8-4498-bf10-1a3114d2105f	cmpbkj695000004jxaktrnbvc	cmpefcd1z000004lasd2r1kdh	2026-05-28 12:56:37.798	2026-05-21 13:18:38.838	2026-05-21 12:56:37.806	2026-05-21 13:18:38.841
\.
COPY public.match_attendances (id, "matchId", "playerId", present, "checkedInAt", "createdAt", "updatedAt", "shirtNumber") FROM stdin;
cmpidu8wc0000b0uo4i23vr5c	cmpe1azov000004l1iw95x1zw	cmpcpimjz000004jpcdqgfhfx	t	\N	2026-05-23 13:26:45.9	2026-05-23 13:26:45.9	\N
cmpiduae40001b0uof23erc1o	cmpe1azov000004l1iw95x1zw	cmpcsds4s000004jmgpwku1j2	t	\N	2026-05-23 13:26:47.836	2026-05-23 13:26:47.836	\N
cmpiduaw90002b0uogsggr4lt	cmpe1azov000004l1iw95x1zw	cmpct94t9000204jsxeeckk3m	t	\N	2026-05-23 13:26:48.489	2026-05-23 13:26:48.489	\N
cmpidubgv0003b0uoswb6fw1o	cmpe1azov000004l1iw95x1zw	cmpefcd1z000004lasd2r1kdh	t	\N	2026-05-23 13:26:49.231	2026-05-23 13:26:49.231	\N
cmpiduc730004b0uoxd3mh9ll	cmpe1azov000004l1iw95x1zw	cmpefcqj2000104ladlx0ysjz	t	\N	2026-05-23 13:26:50.175	2026-05-23 13:26:50.175	\N
cmpidued80005b0uoodw3dtkr	cmpe1azov000004l1iw95x1zw	cmpcqf47m000004l85vce0gfh	t	\N	2026-05-23 13:26:52.988	2026-05-23 13:26:52.988	\N
cmpidufdb0006b0uo7l9mc3iv	cmpe1azov000004l1iw95x1zw	cmpdz2mcq000104jr9xnhl4i0	t	\N	2026-05-23 13:26:54.287	2026-05-23 13:26:54.287	\N
cmpidug7w0007b0uo93mdjv7o	cmpe1azov000004l1iw95x1zw	cmpefd4zq000204la3jqyndzz	t	\N	2026-05-23 13:26:55.388	2026-05-23 13:26:55.388	\N
cmpidui7o0008b0uo11qp6113	cmpe1azov000004l1iw95x1zw	cmpcov8jd000004l8umh13pux	t	\N	2026-05-23 13:26:57.972	2026-05-23 13:26:57.972	\N
cmpidujep0009b0uops50gew3	cmpe1azov000004l1iw95x1zw	cmpct2xp7000004jsv1ujpe1r	t	\N	2026-05-23 13:26:59.521	2026-05-23 13:26:59.521	\N
cmpidujph000ab0uoko5tgmf1	cmpe1azov000004l1iw95x1zw	cmpefdkyx000304la3k3nq9p9	t	\N	2026-05-23 13:26:59.909	2026-05-23 13:26:59.909	\N
cmpidujs7000bb0uolj76bd23	cmpe1azov000004l1iw95x1zw	cmpefdukz000404lanevrsp34	t	\N	2026-05-23 13:27:00.007	2026-05-23 13:27:00.007	\N
cmpidujxb000cb0uokzwz0lay	cmpe1azov000004l1iw95x1zw	cmpcm7sgp000004l1fp9o52ky	t	\N	2026-05-23 13:27:00.191	2026-05-23 13:27:00.191	\N
cmpiduk05000db0uotgybymoq	cmpe1azov000004l1iw95x1zw	cmpefep0o000504laynrqmhnw	t	\N	2026-05-23 13:27:00.293	2026-05-23 13:27:00.293	\N
cmpiduk5f000eb0uofqxw7kx7	cmpg3xoab000e04jupuf15f34	cmpg41k59000004l7521hfcn4	t	\N	2026-05-23 13:27:00.483	2026-05-23 13:27:00.483	\N
cmpiduki2000fb0uovyb9s701	cmpg3xoab000e04jupuf15f34	cmpefcqj2000104ladlx0ysjz	t	\N	2026-05-23 13:27:00.938	2026-05-23 13:27:00.938	\N
cmpidul6t000gb0uoj4wnshbw	cmpg3xoab000e04jupuf15f34	cmpfk8v2v000704jlp8siky9e	t	\N	2026-05-23 13:27:01.829	2026-05-23 13:27:01.829	\N
cmpidul9m000hb0uo3he1ospb	cmpg3xoab000e04jupuf15f34	cmpefcd1z000004lasd2r1kdh	t	\N	2026-05-23 13:27:01.93	2026-05-23 13:27:01.93	\N
cmpidulbw000ib0uoqviqahgk	cmpg3xoab000e04jupuf15f34	cmpcqf47m000004l85vce0gfh	t	\N	2026-05-23 13:27:02.012	2026-05-23 13:27:02.012	\N
cmpidulgi000jb0uojfeibqi0	cmpg3xoab000e04jupuf15f34	cmpcpgupa000004l5ehnc0kjs	t	\N	2026-05-23 13:27:02.178	2026-05-23 13:27:02.178	\N
cmpidulxf000kb0uoglg2pexm	cmpg3xoab000e04jupuf15f34	cmpefdukz000404lanevrsp34	t	\N	2026-05-23 13:27:02.787	2026-05-23 13:27:02.787	\N
cmpidum15000lb0uoo9eg3x64	cmpg3xoab000e04jupuf15f34	cmpefdkyx000304la3k3nq9p9	t	\N	2026-05-23 13:27:02.921	2026-05-23 13:27:02.921	\N
cmpidum7n000mb0uowczd3fh3	cmpg3xoab000e04jupuf15f34	cmpcopzu6000004jro3prr7ca	t	\N	2026-05-23 13:27:03.155	2026-05-23 13:27:03.155	\N
cmpidumdm000nb0uo79x6r8ct	cmpg3xoab000e04jupuf15f34	cmpcpt3n6000004l561lm2ja7	t	\N	2026-05-23 13:27:03.37	2026-05-23 13:27:03.37	\N
cmpidumoc000ob0uo08slel9v	cmpgvy3i1000004jupkxo13f9	cmpfk8v2v000704jlp8siky9e	t	\N	2026-05-23 13:27:03.756	2026-05-23 13:27:03.756	\N
cmpidumrz000pb0uoxiqdo6yi	cmpgvy3i1000004jupkxo13f9	cmpcopzu6000004jro3prr7ca	t	\N	2026-05-23 13:27:03.887	2026-05-23 13:27:03.887	\N
cmpidumwe000qb0uojxtt7dtg	cmpgvy3i1000004jupkxo13f9	cmpcpimjz000004jpcdqgfhfx	t	\N	2026-05-23 13:27:04.046	2026-05-23 13:27:04.046	\N
cmpidumz1000rb0uo71pmdjc6	cmpgvy3i1000004jupkxo13f9	cmpcsds4s000004jmgpwku1j2	t	\N	2026-05-23 13:27:04.141	2026-05-23 13:27:04.141	\N
cmpidun1r000sb0uoylm8xibk	cmpgvy3i1000004jupkxo13f9	cmpefcd1z000004lasd2r1kdh	t	\N	2026-05-23 13:27:04.239	2026-05-23 13:27:04.239	\N
cmpidun8n000tb0uo79o3o2ae	cmpgvy3i1000004jupkxo13f9	cmpefcqj2000104ladlx0ysjz	t	\N	2026-05-23 13:27:04.487	2026-05-23 13:27:04.487	\N
cmpidunb0000ub0uof9do464e	cmpgvy3i1000004jupkxo13f9	cmpcqf47m000004l85vce0gfh	t	\N	2026-05-23 13:27:04.572	2026-05-23 13:27:04.572	\N
cmpidunda000vb0uortttxdc8	cmpgvy3i1000004jupkxo13f9	cmpcpt3n6000004l561lm2ja7	t	\N	2026-05-23 13:27:04.654	2026-05-23 13:27:04.654	\N
cmpidunew000wb0uo30t8t3kv	cmpgvy3i1000004jupkxo13f9	cmpcov8jd000004l8umh13pux	t	\N	2026-05-23 13:27:04.712	2026-05-23 13:27:04.712	\N
cmpidunh0000xb0uolxa37n63	cmpgvy3i1000004jupkxo13f9	cmpct2xp7000004jsv1ujpe1r	t	\N	2026-05-23 13:27:04.788	2026-05-23 13:27:04.788	\N
cmpidunm8000yb0uoopkdwtk7	cmpgvy3i1000004jupkxo13f9	cmpcm7sgp000004l1fp9o52ky	t	\N	2026-05-23 13:27:04.976	2026-05-23 13:27:04.976	\N
cmpidunpg000zb0uojiw85x8i	cmpgvy3i1000004jupkxo13f9	cmpefep0o000504laynrqmhnw	t	\N	2026-05-23 13:27:05.092	2026-05-23 13:27:05.092	\N
cmpiduoa90018b0uonligcbib	cmpgxpcmr000104l1gbglqrdc	cmpcopzu6000004jro3prr7ca	t	\N	2026-05-23 13:27:05.841	2026-05-23 13:27:05.841	\N
cmpiduojf001db0uoxm8e2mcf	cmph7ki34000004ibhrgnxf2y	cmpefcqj2000104ladlx0ysjz	t	\N	2026-05-23 13:27:06.171	2026-05-23 13:27:06.171	\N
cmpiduola001eb0uo7nzkvj9i	cmph7ki34000004ibhrgnxf2y	cmpdz2mcq000104jr9xnhl4i0	t	\N	2026-05-23 13:27:06.238	2026-05-23 13:27:06.238	\N
cmpiduona001fb0uo9zf0ou2m	cmph7ki34000004ibhrgnxf2y	cmpefdukz000404lanevrsp34	t	\N	2026-05-23 13:27:06.31	2026-05-23 13:27:06.31	\N
cmpiduooz001gb0uo7ry08qjg	cmph7ki34000004ibhrgnxf2y	cmpfk8v2v000704jlp8siky9e	t	\N	2026-05-23 13:27:06.371	2026-05-23 13:27:06.371	\N
cmpiduoqt001hb0uotagk4y21	cmph7ki34000004ibhrgnxf2y	cmpcpimjz000004jpcdqgfhfx	t	\N	2026-05-23 13:27:06.437	2026-05-23 13:27:06.437	\N
cmpiduoso001ib0uolbffgj8q	cmph7ki34000004ibhrgnxf2y	cmpcsds4s000004jmgpwku1j2	t	\N	2026-05-23 13:27:06.504	2026-05-23 13:27:06.504	\N
cmpiduoug001jb0uonbbck98z	cmph7ki34000004ibhrgnxf2y	cmpct94t9000204jsxeeckk3m	t	\N	2026-05-23 13:27:06.568	2026-05-23 13:27:06.568	\N
cmpiduow4001kb0uo3f644oy1	cmph7ki34000004ibhrgnxf2y	cmpcpt3n6000004l561lm2ja7	t	\N	2026-05-23 13:27:06.628	2026-05-23 13:27:06.628	\N
cmpiduoy1001lb0uo6azlpdju	cmph7ki34000004ibhrgnxf2y	cmpefd4zq000204la3jqyndzz	t	\N	2026-05-23 13:27:06.697	2026-05-23 13:27:06.697	\N
cmpiduozo001mb0uoj2968k3p	cmph7ki34000004ibhrgnxf2y	cmpct2xp7000004jsv1ujpe1r	t	\N	2026-05-23 13:27:06.756	2026-05-23 13:27:06.756	\N
cmpidup1j001nb0uokxxk6zua	cmph7ki34000004ibhrgnxf2y	cmpcsehq1000104ibueo8dlm5	t	\N	2026-05-23 13:27:06.823	2026-05-23 13:27:06.823	\N
cmpidup3a001ob0uo03ipxcgz	cmph7ki34000004ibhrgnxf2y	cmpg43u13000604l7y6t0hdtt	t	\N	2026-05-23 13:27:06.886	2026-05-23 13:27:06.886	\N
cmpidup4z001pb0uo4yd1gsjp	cmph7ki34000004ibhrgnxf2y	cmpcopzu6000004jro3prr7ca	t	\N	2026-05-23 13:27:06.947	2026-05-23 13:27:06.947	\N
cmpidup71001qb0uocpq5yfih	cmph7ki34000004ibhrgnxf2y	cmpefep0o000504laynrqmhnw	t	\N	2026-05-23 13:27:07.021	2026-05-23 13:27:07.021	\N
cmpidup8v001rb0uo6ubmd83n	cmph7ki34000004ibhrgnxf2y	cmpefcd1z000004lasd2r1kdh	t	\N	2026-05-23 13:27:07.087	2026-05-23 13:27:07.087	\N
cmpidupap001sb0uo3nxum6vt	cmph7ki34000004ibhrgnxf2y	cmpcm7sgp000004l1fp9o52ky	t	\N	2026-05-23 13:27:07.153	2026-05-23 13:27:07.153	\N
cmpidupck001tb0uo9tczit44	cmph7ki34000004ibhrgnxf2y	cmph7s4ma000004l727k39xdv	t	\N	2026-05-23 13:27:07.22	2026-05-23 13:27:07.22	\N
cmpidupem001ub0uogneof7iz	cmph7ki34000004ibhrgnxf2y	cmph7t8a1000004l9n8uic25p	t	\N	2026-05-23 13:27:07.294	2026-05-23 13:27:07.294	\N
44fec6c9-63ca-47df-b073-942a8cdb4b8d	cmpkl4qyr000004l41n642701	cmpcov8jd000004l8umh13pux	t	\N	2026-05-27 22:34:02.596	2026-05-28 13:42:57.745	0
155aafaa-9a5f-4323-8c45-e44b3ed7afe4	cmpkl4qyr000004l41n642701	cmpefcd1z000004lasd2r1kdh	t	2026-05-27 22:23:55.472	2026-05-27 22:34:02.596	2026-05-28 13:42:57.755	0
59e4a1c1-8d6a-4905-b473-c93eb012ed70	cmpkl4qyr000004l41n642701	cmpcqf47m000004l85vce0gfh	t	\N	2026-05-27 22:34:02.596	2026-05-28 13:42:57.77	0
8338ce51-8291-43ce-8bee-55ff3608f8df	cmpkl4qyr000004l41n642701	cmpn1o6et000004jrcnmw0gav	t	2026-05-27 22:32:13.243	2026-05-27 22:34:02.596	2026-05-28 13:42:57.785	0
b70aaa0a-72b5-4756-abcc-50d829953502	cmpr23ivg000204icrms1915w	cmpefdukz000404lanevrsp34	f	\N	2026-06-01 11:09:03.511	2026-06-01 11:09:03.511	0
cd1aba24-de7b-4974-a740-435a9d3e9af9	cmpr23ivg000204icrms1915w	cmpefd4zq000204la3jqyndzz	f	\N	2026-06-01 11:09:03.511	2026-06-01 11:09:03.511	0
e64bcb0c-8f1f-4c40-bf90-7fe4bcfeaad4	cmpkl4qyr000004l41n642701	cmpcm7sgp000004l1fp9o52ky	t	2026-05-27 22:23:55.464	2026-05-27 22:34:02.596	2026-05-28 13:42:57.716	0
1922f01a-4da3-4ff0-8d44-7f690c569ebd	cmpkl4qyr000004l41n642701	cmpdz2mcq000104jr9xnhl4i0	t	2026-05-27 22:33:31.569	2026-05-27 22:34:02.596	2026-05-28 13:42:57.727	0
095a9777-6d9c-4251-be86-04a3ba53fd22	cmpr23ivg000204icrms1915w	cmpcm7sgp000004l1fp9o52ky	t	\N	2026-06-01 11:09:03.511	2026-07-17 16:32:50.76	0
3fed175b-62db-4159-a026-f5cb88b70485	cmpr23ivg000204icrms1915w	cmpefcd1z000004lasd2r1kdh	t	\N	2026-06-01 11:09:03.511	2026-07-17 16:32:50.765	0
0963fba8-b7e7-4f3f-adbe-87a019dd8e39	cmpr23ivg000204icrms1915w	cmpefdkyx000304la3k3nq9p9	t	\N	2026-06-01 11:09:03.511	2026-07-17 16:32:50.769	0
f5836f5a-c7ba-46c7-aad7-8ead01edba01	cmpr23ivg000204icrms1915w	cmpn1o6et000004jrcnmw0gav	t	\N	2026-06-01 11:09:03.511	2026-07-17 16:32:50.786	0
b1995cae-7ec9-48fc-a1ce-222b116174db	cmpfezhxy000004lblpwmx62l	cmpefdukz000404lanevrsp34	t	2026-05-23 19:06:19.891	2026-05-27 16:36:45.712	2026-05-27 16:36:45.712	1
c8257612-18c3-40b1-aa98-c11a429a1f76	cmpfezhxy000004lblpwmx62l	cmpcqf47m000004l85vce0gfh	f	\N	2026-05-27 16:36:45.712	2026-05-27 16:36:45.712	2
72d7b188-6442-482a-a505-3320167f17f5	cmpfezhxy000004lblpwmx62l	cmpefdkyx000304la3k3nq9p9	t	2026-05-23 18:36:05.297	2026-05-27 16:36:45.712	2026-05-27 16:36:45.712	13
9db89102-56c9-42b6-a4a8-935264974c42	cmpfezhxy000004lblpwmx62l	cmpcm7sgp000004l1fp9o52ky	t	2026-05-23 18:35:02.447	2026-05-27 16:36:45.712	2026-05-27 16:36:45.712	12
e0d04dea-3d7e-4846-91d2-4e8f1a55aff9	cmpfezhxy000004lblpwmx62l	cmpcov8jd000004l8umh13pux	f	\N	2026-05-27 16:36:45.712	2026-05-27 16:36:45.712	5
c9dc178b-4891-4ff6-afa3-2cf3ef933265	cmpfezhxy000004lblpwmx62l	cmpefcd1z000004lasd2r1kdh	t	2026-05-23 18:35:02.458	2026-05-27 16:36:45.712	2026-05-27 16:36:45.712	6
6f775c79-7c00-4e1f-b3a4-fe77c461a5b9	cmpfezhxy000004lblpwmx62l	cmpefd4zq000204la3jqyndzz	f	\N	2026-05-27 16:36:45.712	2026-05-27 16:36:45.712	7
7def96f2-4959-4831-847b-c600f50e6530	cmpfezhxy000004lblpwmx62l	cmpn1o6et000004jrcnmw0gav	f	\N	2026-05-27 16:36:45.712	2026-05-27 16:36:45.712	8
0817b06f-b0f3-46fc-8a99-f8ee5d563073	cmpfezhxy000004lblpwmx62l	cmpdz2mcq000104jr9xnhl4i0	t	2026-05-23 18:47:55.151	2026-05-27 16:36:45.712	2026-05-27 16:36:45.712	16
896800b7-d4e6-4f76-b7af-1455c3a8381c	cmpfezhxy000004lblpwmx62l	cmpefcqj2000104ladlx0ysjz	t	2026-05-23 19:09:04.924	2026-05-27 16:36:45.712	2026-05-27 16:36:45.712	11
b268927d-742e-4627-8442-ff2a9263a1ce	cmpfezhxy000004lblpwmx62l	cmpct94t9000204jsxeeckk3m	f	\N	2026-05-27 16:36:45.712	2026-05-27 16:36:45.712	12
562da07d-ec38-486f-9b12-0fca911b0c08	cmpfezhxy000004lblpwmx62l	cmpct2xp7000004jsv1ujpe1r	f	\N	2026-05-27 16:36:45.712	2026-05-27 16:36:45.712	13
876c4a6e-d939-4774-9e8d-3a9b4932b4e3	cmpfezhxy000004lblpwmx62l	cmpcsds4s000004jmgpwku1j2	t	2026-05-23 18:58:25.255	2026-05-27 16:36:45.712	2026-05-27 16:36:45.712	5
bbeb1f1b-9f11-45a2-a9e3-b402ec3b2079	cmpfezhxy000004lblpwmx62l	cmpcpgupa000004l5ehnc0kjs	f	\N	2026-05-27 16:36:45.712	2026-05-27 16:36:45.712	15
579019f2-20b6-4715-9cc9-d9f7c2799f0f	cmpfezhxy000004lblpwmx62l	cmpcpimjz000004jpcdqgfhfx	t	2026-05-23 18:58:25.264	2026-05-27 16:36:45.712	2026-05-27 16:36:45.712	21
3b5d2100-f00a-4a98-80e6-89ac10de48e3	cmpfezhxy000004lblpwmx62l	cmpcsehq1000104ibueo8dlm5	f	\N	2026-05-27 16:36:45.712	2026-05-27 16:36:45.712	17
18d6a250-260d-4f82-8e89-0a0ab69c7843	cmpfezhxy000004lblpwmx62l	cmpdz3jpw000004jvdohsd2ri	t	2026-05-23 19:00:22.79	2026-05-27 16:36:45.712	2026-05-27 16:36:45.712	18
8b30e01d-4e91-4216-bd89-37d6d875651a	cmpfezhxy000004lblpwmx62l	cmpcopzu6000004jro3prr7ca	f	\N	2026-05-27 16:36:45.712	2026-05-27 16:36:45.712	19
27adc885-2a3b-4072-b58a-c8f09fa2791c	cmpfezhxy000004lblpwmx62l	cmpcoxez0000304l8g40zcfou	t	2026-05-23 18:35:02.518	2026-05-27 16:36:45.712	2026-05-27 16:36:45.712	23
01bff75a-ccd4-433d-ad44-fa0bfdc28459	cmpfezhxy000004lblpwmx62l	cmpefep0o000504laynrqmhnw	t	2026-05-23 18:35:02.523	2026-05-27 16:36:45.712	2026-05-27 16:36:45.712	25
ba7175ca-88bb-4cc8-a715-ba16ca303af5	cmpfezhxy000004lblpwmx62l	cmpfk8v2v000704jlp8siky9e	t	2026-05-23 18:35:02.528	2026-05-27 16:36:45.712	2026-05-27 16:36:45.712	7
768b027d-0bcc-49bc-85cf-3b86a59a5e7f	cmpfezhxy000004lblpwmx62l	cmpg41k59000004l7521hfcn4	f	\N	2026-05-27 16:36:45.712	2026-05-27 16:36:45.712	23
c156bda2-afc3-4321-9314-2376c308ccd3	cmpfezhxy000004lblpwmx62l	cmpg43u13000604l7y6t0hdtt	f	\N	2026-05-27 16:36:45.712	2026-05-27 16:36:45.712	24
865ec13b-a2d4-418b-abf2-9dd9ad4cf482	cmpfezhxy000004lblpwmx62l	cmph7s4ma000004l727k39xdv	f	\N	2026-05-27 16:36:45.712	2026-05-27 16:36:45.712	25
d915987d-4166-4062-8b2e-257e2f781879	cmpfezhxy000004lblpwmx62l	cmph7t8a1000004l9n8uic25p	f	\N	2026-05-27 16:36:45.712	2026-05-27 16:36:45.712	26
13924747-7aac-466c-9c8c-abd0ae7dc9be	cmpkl4qyr000004l41n642701	cmpefd4zq000204la3jqyndzz	f	\N	2026-05-27 22:34:02.596	2026-05-27 22:34:02.596	0
fbd3a4be-4dd4-48c2-bf6f-551297398b70	cmpfezhxy000004lblpwmx62l	cmpcpt3n6000004l561lm2ja7	t	2026-05-23 18:51:24.456	2026-05-27 16:36:45.712	2026-05-27 16:36:45.712	17
2340d641-ff20-4433-bef4-0511c9d88668	cmpg3k0ot000004l5zes9kdtc	cmpefd4zq000204la3jqyndzz	f	\N	2026-06-06 18:49:38.857	2026-06-06 18:49:38.857	0
a21dfc5b-1ab4-4152-a662-6786a2d9a679	cmpg3k0ot000004l5zes9kdtc	cmpn1o6et000004jrcnmw0gav	f	\N	2026-06-06 18:49:38.857	2026-06-06 18:49:38.857	0
97bd9006-f82b-4af2-8bb0-a3f5c776a3d1	cmpkl4qyr000004l41n642701	cmpcsehq1000104ibueo8dlm5	t	2026-05-27 22:17:31.332	2026-05-27 22:34:02.596	2026-05-28 13:42:57.703	0
2074bca5-4876-477e-bfd7-38f99bdf6b46	cmpkl4qyr000004l41n642701	cmpcopzu6000004jro3prr7ca	t	\N	2026-05-27 22:34:02.596	2026-05-28 13:42:57.722	0
e2f16dc9-eac9-4d75-8caf-b83a9b68f340	cmpkl4qyr000004l41n642701	cmpefep0o000504laynrqmhnw	t	2026-05-27 22:31:14.001	2026-05-27 22:34:02.596	2026-05-28 13:42:57.732	0
ec51acc8-a62b-4112-8654-9b3368a0a380	cmpkl4qyr000004l41n642701	cmpcpimjz000004jpcdqgfhfx	t	2026-05-27 22:33:05.272	2026-05-27 22:34:02.596	2026-05-28 13:42:57.739	0
5757fea8-c97d-412d-ab1c-2400820836c7	cmpkl4qyr000004l41n642701	cmpdz3jpw000004jvdohsd2ri	t	2026-05-27 22:30:40.748	2026-05-27 22:34:02.596	2026-05-28 13:42:57.749	0
241be11d-9d4f-4144-9e26-6450edfeb604	cmpkl4qyr000004l41n642701	cmpcsds4s000004jmgpwku1j2	t	2026-05-27 22:23:55.496	2026-05-27 22:34:02.596	2026-05-28 13:42:57.76	0
c8555dd2-c440-4127-8d31-37d1e57ba852	cmpkl4qyr000004l41n642701	cmpct94t9000204jsxeeckk3m	t	\N	2026-05-27 22:34:02.596	2026-05-28 13:42:57.765	0
b7055149-a4e3-4741-a7d2-f3df7352299d	cmpkl4qyr000004l41n642701	cmpg41k59000004l7521hfcn4	t	\N	2026-05-27 22:34:02.596	2026-05-28 13:42:57.775	0
5fac25c8-3b85-41d3-9301-905d597b14dc	cmpkl4qyr000004l41n642701	cmpefcqj2000104ladlx0ysjz	t	2026-05-27 22:33:53.855	2026-05-27 22:34:02.596	2026-05-28 13:42:57.78	0
f42670fd-9300-4f4f-97bc-4ff7e63b5429	cmpr23ivg000204icrms1915w	cmpcsehq1000104ibueo8dlm5	f	\N	2026-06-01 11:09:03.511	2026-06-01 11:09:03.511	0
ff1e9085-12f5-4652-8343-21c883fb5828	cmpr23ivg000204icrms1915w	cmpg43u13000604l7y6t0hdtt	f	\N	2026-06-01 11:09:03.511	2026-06-01 11:09:03.511	0
e62b9f7d-3d57-40eb-8fd0-6ac440695e8d	cmpr23ivg000204icrms1915w	cmph7s4ma000004l727k39xdv	f	\N	2026-06-01 11:09:03.511	2026-06-01 11:09:03.511	0
405e1ed0-aaa0-42ae-be44-ee060c07a260	cmpg3k0ot000004l5zes9kdtc	cmpg43u13000604l7y6t0hdtt	f	\N	2026-06-06 18:49:38.857	2026-06-06 18:49:38.857	0
b1fffe7f-cc0c-4ea6-a2a5-d2a852673d40	cmpg3k0ot000004l5zes9kdtc	cmph7s4ma000004l727k39xdv	f	\N	2026-06-06 18:49:38.857	2026-06-06 18:49:38.857	0
3e326c90-db23-48a0-ad8b-2cd9a676d709	cmpg3k0ot000004l5zes9kdtc	cmpcm7sgp000004l1fp9o52ky	t	2026-06-06 18:49:38.95	2026-06-06 18:49:38.857	2026-06-09 21:44:08.508	0
157ff7b5-87c6-41ea-a724-f4cb2927cc55	cmpg3k0ot000004l5zes9kdtc	cmpcqf47m000004l85vce0gfh	t	\N	2026-06-06 18:49:38.857	2026-06-09 21:44:08.515	0
e7d9836f-b712-4bd5-a8fa-ac8aa0b297a5	cmpg3k0ot000004l5zes9kdtc	cmpdz2mcq000104jr9xnhl4i0	t	\N	2026-06-06 18:49:38.857	2026-06-09 21:44:08.528	0
c4fde154-d80f-4fb5-b97e-c970a0ba0c87	cmpg3k0ot000004l5zes9kdtc	cmpefdukz000404lanevrsp34	t	\N	2026-06-06 18:49:38.857	2026-06-09 21:44:08.534	0
3d29bd8c-6cb9-4649-a154-c9ab29a790ff	cmpg3k0ot000004l5zes9kdtc	cmpcpt3n6000004l561lm2ja7	t	\N	2026-06-06 18:49:38.857	2026-06-09 21:44:08.541	0
87e484ce-1a9b-43a0-89ea-be52361cea45	cmpg3k0ot000004l5zes9kdtc	cmpct94t9000204jsxeeckk3m	t	\N	2026-06-06 18:49:38.857	2026-06-09 21:44:08.546	0
19e54c7f-b4f0-473d-b43a-7daef7207020	cmpg3k0ot000004l5zes9kdtc	cmpct2xp7000004jsv1ujpe1r	t	\N	2026-06-06 18:49:38.857	2026-06-09 21:44:08.551	0
62bec67e-9f5d-4f60-aa22-cbd9c6018473	cmpg3k0ot000004l5zes9kdtc	cmpefep0o000504laynrqmhnw	t	\N	2026-06-06 18:49:38.857	2026-06-09 21:44:08.557	0
81f6fe02-160f-4629-ac66-92132d53db1d	cmpg3k0ot000004l5zes9kdtc	cmpcpimjz000004jpcdqgfhfx	t	\N	2026-06-06 18:49:38.857	2026-06-09 21:44:08.563	0
8f33ab4a-dd95-4ead-b320-0b1adc8ddc2f	cmpg3k0ot000004l5zes9kdtc	cmpcov8jd000004l8umh13pux	t	\N	2026-06-06 18:49:38.857	2026-06-09 21:44:08.568	0
80254440-ff2e-47a8-9ab5-86c6da3b96a4	cmpg3k0ot000004l5zes9kdtc	cmpefcd1z000004lasd2r1kdh	t	\N	2026-06-06 18:49:38.857	2026-06-09 21:44:08.574	0
5ded519f-754b-4329-a62a-64b46f795103	cmpg3k0ot000004l5zes9kdtc	cmpfk8v2v000704jlp8siky9e	t	\N	2026-06-06 18:49:38.857	2026-06-09 21:44:08.581	0
6d06d70f-4525-48db-aa50-4d5b4367bd27	cmpr23ivg000204icrms1915w	cmpcsds4s000004jmgpwku1j2	t	\N	2026-06-01 11:09:03.511	2026-07-17 16:32:50.773	0
db9e8986-cc18-4c2f-a4bb-d7e6afeb0231	cmpr23ivg000204icrms1915w	cmpdz3jpw000004jvdohsd2ri	t	\N	2026-06-01 11:09:03.511	2026-07-17 16:32:50.776	0
cb68ed95-6d5c-49ed-8512-0ec23e2ed4fe	cmpr23ivg000204icrms1915w	cmpfk8v2v000704jlp8siky9e	t	\N	2026-06-01 11:09:03.511	2026-07-17 16:32:50.78	0
edc60459-9d82-449f-b4bf-9eb90995893b	cmpr23ivg000204icrms1915w	cmpcpgupa000004l5ehnc0kjs	t	\N	2026-06-01 11:09:03.511	2026-07-17 16:32:50.783	0
87d88b4f-9a59-4a6d-ad86-0c50df8e92ab	cmpkl4qyr000004l41n642701	cmpfk8v2v000704jlp8siky9e	f	\N	2026-05-27 22:34:02.596	2026-05-27 22:34:02.596	0
b5fce492-02d1-45a3-85b7-ba34fefefe5f	cmpkl4qyr000004l41n642701	cmpg43u13000604l7y6t0hdtt	f	\N	2026-05-27 22:34:02.596	2026-05-27 22:34:02.596	0
ee642d5b-f1aa-4d52-9485-034badb44ead	cmpkl4qyr000004l41n642701	cmph7s4ma000004l727k39xdv	f	\N	2026-05-27 22:34:02.596	2026-05-27 22:34:02.596	0
43e3ec60-5f2a-46b1-911b-3f9f142b1834	cmpg3k0ot000004l5zes9kdtc	cmpefdkyx000304la3k3nq9p9	t	\N	2026-06-06 18:49:38.857	2026-06-09 21:44:08.586	0
02318919-14ca-4f59-be0b-0490246b43cc	cmpg3k0ot000004l5zes9kdtc	cmpcsds4s000004jmgpwku1j2	t	\N	2026-06-06 18:49:38.857	2026-06-09 21:44:08.592	0
813361c1-7daf-42f6-9e98-5ec61071b05f	cmpg3k0ot000004l5zes9kdtc	cmpcsehq1000104ibueo8dlm5	t	\N	2026-06-06 18:49:38.857	2026-06-09 21:44:08.597	0
0f87e460-a495-4e02-9641-14c2d0dd9a62	cmpg3k0ot000004l5zes9kdtc	cmpefcqj2000104ladlx0ysjz	t	\N	2026-06-06 18:49:38.857	2026-06-09 21:44:08.602	0
86adfd73-ce3e-421d-b83e-51cdb559467f	cmpg3k0ot000004l5zes9kdtc	cmpg41k59000004l7521hfcn4	t	\N	2026-06-06 18:49:38.857	2026-06-09 21:44:08.607	0
cmqe8jnzo000204jxcuj0sg5h	cmq9kccux000004l58m8puvai	cmpcsehq1000104ibueo8dlm5	t	2026-06-14 20:27:11.796	2026-06-14 20:27:11.796	2026-06-17 13:14:15.851	\N
cmqi3egtw000h04kyuylbhuy4	cmq9kccux000004l58m8puvai	cmpdz3jpw000004jvdohsd2ri	t	2026-06-17 13:14:15.859	2026-06-17 13:14:15.86	2026-06-17 13:14:15.86	\N
cmqe8hj9v000204jle95l9hu1	cmq9kccux000004l58m8puvai	cmpct94t9000204jsxeeckk3m	t	2026-06-14 20:25:32.37	2026-06-14 20:25:32.371	2026-06-17 13:14:15.868	\N
cmqi3egu9000j04ky8z4vsqa4	cmq9kccux000004l58m8puvai	cmpcm7sgp000004l1fp9o52ky	t	2026-06-17 13:14:15.873	2026-06-17 13:14:15.873	2026-06-17 13:14:15.873	\N
cmqi3eguf000k04kyj3f3fben	cmq9kccux000004l58m8puvai	cmpefep0o000504laynrqmhnw	t	2026-06-17 13:14:15.878	2026-06-17 13:14:15.879	2026-06-17 13:14:15.879	\N
cmqe8b6my000004jl578eos6b	cmq9kccux000004l58m8puvai	cmpcpimjz000004jpcdqgfhfx	t	2026-06-14 20:20:36.046	2026-06-14 20:20:36.059	2026-06-17 13:14:15.884	\N
cmqi3egup000m04kywtrhnmgv	cmq9kccux000004l58m8puvai	cmpcopzu6000004jro3prr7ca	t	2026-06-17 13:14:15.889	2026-06-17 13:14:15.889	2026-06-17 13:14:15.889	\N
cmqi3eguv000n04ky4r28ipyp	cmq9kccux000004l58m8puvai	cmpcov8jd000004l8umh13pux	t	2026-06-17 13:14:15.894	2026-06-17 13:14:15.895	2026-06-17 13:14:15.895	\N
cmqe8aoee000004jxzbs2s0lk	cmq9kccux000004l58m8puvai	cmpcsds4s000004jmgpwku1j2	t	2026-06-14 20:20:12.411	2026-06-14 20:20:12.422	2026-06-17 13:14:15.9	\N
cmqi3egv5000p04kycsioopw6	cmq9kccux000004l58m8puvai	cmpefcd1z000004lasd2r1kdh	t	2026-06-17 13:14:15.905	2026-06-17 13:14:15.905	2026-06-17 13:14:15.905	\N
cmqi3egva000q04kyb3l6f59e	cmq9kccux000004l58m8puvai	cmpefcqj2000104ladlx0ysjz	t	2026-06-17 13:14:15.91	2026-06-17 13:14:15.91	2026-06-17 13:14:15.91	\N
cmro4vlw9000204l8hvomcbi9	cmrkxjsua000004jtqvbnfwac	cmpcqf47m000004l85vce0gfh	t	2026-07-16 23:21:54.585	2026-07-16 23:21:54.585	2026-07-17 01:43:55.121	\N
cmro5ayg7000104js771skxjd	cmrkxjsua000004jtqvbnfwac	cmpefdkyx000304la3k3nq9p9	t	2026-07-16 23:33:50.695	2026-07-16 23:33:50.696	2026-07-17 01:43:55.132	\N
cmro5o33a000404iegj0pg0eq	cmrkxjsua000004jtqvbnfwac	cmpcov8jd000004l8umh13pux	t	2026-07-16 23:44:03.237	2026-07-16 23:44:03.238	2026-07-17 01:43:55.137	\N
cmro9y8ee000o04lbbnlxbvyb	cmrkxjsua000004jtqvbnfwac	cmpefcd1z000004lasd2r1kdh	t	2026-07-17 01:43:54.938	2026-07-17 01:43:55.142	2026-07-17 01:43:55.142	\N
cmro5jykl000304l83p23ofol	cmrkxjsua000004jtqvbnfwac	cmpdz2mcq000104jr9xnhl4i0	t	2026-07-16 23:40:50.757	2026-07-16 23:40:50.757	2026-07-17 01:43:55.152	\N
cmro4sabr000104l8my6bilip	cmrkxjsua000004jtqvbnfwac	cmpcm7sgp000004l1fp9o52ky	t	2026-07-16 23:19:19.623	2026-07-16 23:19:19.623	2026-07-17 01:43:55.157	\N
cmro51lgx000004jspx495hgg	cmrkxjsua000004jtqvbnfwac	cmpn1o6et000004jrcnmw0gav	t	2026-07-16 23:26:33.958	2026-07-16 23:26:33.969	2026-07-17 01:43:55.161	\N
cmro5hhkz000204iepzbiln5f	cmrkxjsua000004jtqvbnfwac	cmpefcqj2000104ladlx0ysjz	t	2026-07-16 23:38:55.426	2026-07-16 23:38:55.427	2026-07-17 01:43:55.166	\N
cmr6u7034000d04jpki9esj75	cmr4v6j8z000004jmrs48v3h3	cmpcoxez0000304l8g40zcfou	t	2026-07-04 20:50:45.251	2026-07-04 20:50:45.424	2026-07-17 15:44:24.665	\N
cmr6u7044000e04jp5gu5noak	cmr4v6j8z000004jmrs48v3h3	cmpcov8jd000004l8umh13pux	t	2026-07-04 20:50:45.251	2026-07-04 20:50:45.46	2026-07-17 15:44:24.672	\N
cmr6u704a000f04jpx4g8xyl0	cmr4v6j8z000004jmrs48v3h3	cmpcm7sgp000004l1fp9o52ky	t	2026-07-04 20:50:45.251	2026-07-04 20:50:45.466	2026-07-17 15:44:24.677	\N
cmr6u704f000g04jp0pyhoz8x	cmr4v6j8z000004jmrs48v3h3	cmpfk8v2v000704jlp8siky9e	t	2026-07-04 20:50:45.251	2026-07-04 20:50:45.471	2026-07-17 15:44:24.682	\N
cmr6u704k000h04jp47p0xkkg	cmr4v6j8z000004jmrs48v3h3	cmpcsehq1000104ibueo8dlm5	t	2026-07-04 20:50:45.251	2026-07-04 20:50:45.476	2026-07-17 15:44:24.687	\N
cmr6u704q000i04jp2l16ihvk	cmr4v6j8z000004jmrs48v3h3	cmpefcd1z000004lasd2r1kdh	t	2026-07-04 20:50:45.251	2026-07-04 20:50:45.482	2026-07-17 15:44:24.692	\N
cmr6u704v000j04jpcm19ex4f	cmr4v6j8z000004jmrs48v3h3	cmpcpimjz000004jpcdqgfhfx	t	2026-07-04 20:50:45.251	2026-07-04 20:50:45.487	2026-07-17 15:44:24.697	\N
cmr6u7050000k04jp078w807q	cmr4v6j8z000004jmrs48v3h3	cmpdz2mcq000104jr9xnhl4i0	t	2026-07-04 20:50:45.251	2026-07-04 20:50:45.492	2026-07-17 15:44:24.702	\N
cmr6u7055000l04jprmv2csv2	cmr4v6j8z000004jmrs48v3h3	cmpct94t9000204jsxeeckk3m	t	2026-07-04 20:50:45.251	2026-07-04 20:50:45.497	2026-07-17 15:44:24.707	\N
cmr6u705a000m04jpi4t1bpn6	cmr4v6j8z000004jmrs48v3h3	cmpcsds4s000004jmgpwku1j2	t	2026-07-04 20:50:45.251	2026-07-04 20:50:45.502	2026-07-17 15:44:24.712	\N
cmr6u705f000n04jpel2zceuv	cmr4v6j8z000004jmrs48v3h3	cmpcpt3n6000004l561lm2ja7	t	2026-07-04 20:50:45.251	2026-07-04 20:50:45.507	2026-07-17 15:44:24.716	\N
cmr6u705j000o04jp3gsu0us4	cmr4v6j8z000004jmrs48v3h3	cmpefcqj2000104ladlx0ysjz	t	2026-07-04 20:50:45.251	2026-07-04 20:50:45.511	2026-07-17 15:44:24.721	\N
cmqp5ei4z000h04jrpefb1k18	cmpg3rbz2000004la05x1z03i	cmpcqf47m000004l85vce0gfh	t	2026-06-22 11:44:40.016	2026-06-22 11:44:40.019	2026-07-17 15:57:26.643	\N
cmqp5ei5j000i04jrqqpttzpt	cmpg3rbz2000004la05x1z03i	cmpcm7sgp000004l1fp9o52ky	t	2026-06-22 11:44:40.038	2026-06-22 11:44:40.039	2026-07-17 15:57:26.65	\N
cmqp5ei5n000j04jr46rtibd9	cmpg3rbz2000004la05x1z03i	cmpcov8jd000004l8umh13pux	t	2026-06-22 11:44:40.043	2026-06-22 11:44:40.044	2026-07-17 15:57:26.656	\N
cmqp5ei5s000k04jrbuzn5z8e	cmpg3rbz2000004la05x1z03i	cmpefcd1z000004lasd2r1kdh	t	2026-06-22 11:44:40.048	2026-06-22 11:44:40.048	2026-07-17 15:57:26.661	\N
cmqp5ei5w000l04jrpjt6bqq9	cmpg3rbz2000004la05x1z03i	cmpdz2mcq000104jr9xnhl4i0	t	2026-06-22 11:44:40.052	2026-06-22 11:44:40.052	2026-07-17 15:57:26.667	\N
cmqp5ei60000m04jrq0ifw4ne	cmpg3rbz2000004la05x1z03i	cmpefcqj2000104ladlx0ysjz	t	2026-06-22 11:44:40.056	2026-06-22 11:44:40.056	2026-07-17 15:57:26.674	\N
cmqp5ei64000n04jrns7hq7xi	cmpg3rbz2000004la05x1z03i	cmpct2xp7000004jsv1ujpe1r	t	2026-06-22 11:44:40.06	2026-06-22 11:44:40.06	2026-07-17 15:57:26.681	\N
cmqp5ei68000o04jrsjr5b2tu	cmpg3rbz2000004la05x1z03i	cmpcpimjz000004jpcdqgfhfx	t	2026-06-22 11:44:40.064	2026-06-22 11:44:40.064	2026-07-17 15:57:26.687	\N
cmqp5ei6d000p04jrxuea2yc0	cmpg3rbz2000004la05x1z03i	cmpefep0o000504laynrqmhnw	t	2026-06-22 11:44:40.068	2026-06-22 11:44:40.069	2026-07-17 15:57:26.693	\N
cmqp5ei6g000q04jrf03t1rtk	cmpg3rbz2000004la05x1z03i	cmpfk8v2v000704jlp8siky9e	t	2026-06-22 11:44:40.072	2026-06-22 11:44:40.072	2026-07-17 15:57:26.698	\N
cmqp5ei6k000r04jr209m3vsd	cmpg3rbz2000004la05x1z03i	cmph7t8a1000004l9n8uic25p	t	2026-06-22 11:44:40.076	2026-06-22 11:44:40.076	2026-07-17 15:57:26.708	\N
cmro59dth000104ieuyuqh7y8	cmrkxjsua000004jtqvbnfwac	cmpct94t9000204jsxeeckk3m	t	2026-07-16 23:32:37.301	2026-07-16 23:32:37.301	2026-07-17 01:43:55.17	\N
cmro5pmg6000504iemjp4aweh	cmrkxjsua000004jtqvbnfwac	cmpcopzu6000004jro3prr7ca	t	2026-07-16 23:45:14.982	2026-07-16 23:45:14.982	2026-07-17 01:43:55.177	\N
cmro4q7po000004iel4r81xg5	cmrkxjsua000004jtqvbnfwac	cmpcpimjz000004jpcdqgfhfx	t	2026-07-16 23:17:42.913	2026-07-16 23:17:42.924	2026-07-17 01:43:55.181	\N
cmro5tglb000004jswwkjxbzr	cmrkxjsua000004jtqvbnfwac	cmpfk8v2v000704jlp8siky9e	t	2026-07-16 23:48:14.005	2026-07-16 23:48:14.015	2026-07-17 01:43:55.186	\N
cmro4oq5r000004l82ratb79x	cmrkxjsua000004jtqvbnfwac	cmpcsds4s000004jmgpwku1j2	t	2026-07-16 23:16:33.508	2026-07-16 23:16:33.519	2026-07-17 01:43:55.191	\N
cmro48okb000004lbjitsz27l	cmrkxjsua000004jtqvbnfwac	cmpcoxez0000304l8g40zcfou	t	2026-07-16 23:04:04.936	2026-07-16 23:04:04.955	2026-07-17 01:43:55.196	\N
cmro9y8g1000z04lbthkjhs0x	cmrkxjsua000004jtqvbnfwac	cmpefep0o000504laynrqmhnw	t	2026-07-17 01:43:54.938	2026-07-17 01:43:55.201	2026-07-17 01:43:55.201	\N
cmro5ib0x000304ie9ou6jtqr	cmrkxjsua000004jtqvbnfwac	cmpcpt3n6000004l561lm2ja7	t	2026-07-16 23:39:33.585	2026-07-16 23:39:33.585	2026-07-17 01:43:55.205	\N
cmro9y8ga001104lbipgvzv5p	cmrkxjsua000004jtqvbnfwac	cmpct2xp7000004jsv1ujpe1r	t	2026-07-17 01:43:54.938	2026-07-17 01:43:55.21	2026-07-17 01:43:55.21	\N
cmrp3c0c3000c04kx94uiaioy	cmqp62ilp000004jul47gswr8	cmpdz2mcq000104jr9xnhl4i0	t	2026-07-17 15:26:26.734	2026-07-17 15:26:26.739	2026-07-17 15:29:08.691	\N
cmrp3c0cd000d04kxs2r6c1dr	cmqp62ilp000004jul47gswr8	cmpfk8v2v000704jlp8siky9e	t	2026-07-17 15:26:26.749	2026-07-17 15:26:26.749	2026-07-17 15:29:08.695	\N
cmrp3c0ci000e04kxzfrc0rsq	cmqp62ilp000004jul47gswr8	cmpcpimjz000004jpcdqgfhfx	t	2026-07-17 15:26:26.754	2026-07-17 15:26:26.754	2026-07-17 15:29:08.698	\N
cmrp3c0cn000f04kxjgi7a19s	cmqp62ilp000004jul47gswr8	cmpcsds4s000004jmgpwku1j2	t	2026-07-17 15:26:26.759	2026-07-17 15:26:26.759	2026-07-17 15:29:08.701	\N
cmrp3c0ct000g04kxox97kzn3	cmqp62ilp000004jul47gswr8	cmpefcqj2000104ladlx0ysjz	t	2026-07-17 15:26:26.764	2026-07-17 15:26:26.765	2026-07-17 15:29:08.704	\N
cmrp3c0cy000h04kxyn7tufmo	cmqp62ilp000004jul47gswr8	cmph7t8a1000004l9n8uic25p	t	2026-07-17 15:26:26.769	2026-07-17 15:26:26.77	2026-07-17 15:29:08.707	\N
cmrp3c0d3000i04kxakkfe9zu	cmqp62ilp000004jul47gswr8	cmpcpt3n6000004l561lm2ja7	t	2026-07-17 15:26:26.775	2026-07-17 15:26:26.775	2026-07-17 15:29:08.71	\N
cmrp3c0d8000j04kx5m4tkh1w	cmqp62ilp000004jul47gswr8	cmpcov8jd000004l8umh13pux	t	2026-07-17 15:26:26.779	2026-07-17 15:26:26.78	2026-07-17 15:29:08.713	\N
cmrp3c0dd000k04kxcg3pelat	cmqp62ilp000004jul47gswr8	cmpct2xp7000004jsv1ujpe1r	t	2026-07-17 15:26:26.785	2026-07-17 15:26:26.785	2026-07-17 15:29:08.716	\N
cmrp3c0di000l04kxa80gh263	cmqp62ilp000004jul47gswr8	cmpcsehq1000104ibueo8dlm5	t	2026-07-17 15:26:26.79	2026-07-17 15:26:26.79	2026-07-17 15:29:08.719	\N
cmrp3c0dn000m04kxjg5q2vqc	cmqp62ilp000004jul47gswr8	cmpcopzu6000004jro3prr7ca	t	2026-07-17 15:26:26.794	2026-07-17 15:26:26.795	2026-07-17 15:29:08.722	\N
cmrp3c0ds000n04kx8blw7yem	cmqp62ilp000004jul47gswr8	cmpcm7sgp000004l1fp9o52ky	t	2026-07-17 15:26:26.799	2026-07-17 15:26:26.8	2026-07-17 15:29:08.725	\N
cmrp49sl3000h04ks7u9gclfi	cmq59e1vu000004juzmp8xftw	cmpfk8v2v000704jlp8siky9e	t	2026-07-17 15:52:42.996	2026-07-17 15:52:42.999	2026-07-17 15:53:57.94	\N
cmrp49sle000i04ksk4w4vvec	cmq59e1vu000004juzmp8xftw	cmpcpimjz000004jpcdqgfhfx	t	2026-07-17 15:52:43.01	2026-07-17 15:52:43.01	2026-07-17 15:53:57.947	\N
cmrp49slj000j04ks1eu9a41g	cmq59e1vu000004juzmp8xftw	cmpcsds4s000004jmgpwku1j2	t	2026-07-17 15:52:43.015	2026-07-17 15:52:43.015	2026-07-17 15:53:57.951	\N
cmrp49sln000k04kskwiudfrf	cmq59e1vu000004juzmp8xftw	cmpefcd1z000004lasd2r1kdh	t	2026-07-17 15:52:43.019	2026-07-17 15:52:43.019	2026-07-17 15:53:57.956	\N
cmrp49sls000l04ks3qg6ovxx	cmq59e1vu000004juzmp8xftw	cmpefcqj2000104ladlx0ysjz	t	2026-07-17 15:52:43.024	2026-07-17 15:52:43.024	2026-07-17 15:53:57.961	\N
cmrp49slx000m04ksksil32wz	cmq59e1vu000004juzmp8xftw	cmph7t8a1000004l9n8uic25p	t	2026-07-17 15:52:43.028	2026-07-17 15:52:43.029	2026-07-17 15:53:57.967	\N
cmrp49sm1000n04ks119oobuy	cmq59e1vu000004juzmp8xftw	cmpcqf47m000004l85vce0gfh	t	2026-07-17 15:52:43.033	2026-07-17 15:52:43.033	2026-07-17 15:53:57.971	\N
cmrp49sm5000o04ksks7zxh7f	cmq59e1vu000004juzmp8xftw	cmpdz2mcq000104jr9xnhl4i0	t	2026-07-17 15:52:43.037	2026-07-17 15:52:43.037	2026-07-17 15:53:57.975	\N
cmrp49sma000p04ksm5vfbuko	cmq59e1vu000004juzmp8xftw	cmpcopzu6000004jro3prr7ca	t	2026-07-17 15:52:43.042	2026-07-17 15:52:43.042	2026-07-17 15:53:57.979	\N
cmrp49smf000q04ksuc0pkbli	cmq59e1vu000004juzmp8xftw	cmpcm7sgp000004l1fp9o52ky	t	2026-07-17 15:52:43.046	2026-07-17 15:52:43.047	2026-07-17 15:53:57.983	\N
cmrp49smj000r04ks7xtkcmc4	cmq59e1vu000004juzmp8xftw	cmrozuqv4000104l5tbza8qgy	t	2026-07-17 15:52:43.051	2026-07-17 15:52:43.051	2026-07-17 15:53:57.987	\N
cmrp49smo000s04ksyks27u01	cmq59e1vu000004juzmp8xftw	cmpcov8jd000004l8umh13pux	t	2026-07-17 15:52:43.056	2026-07-17 15:52:43.056	2026-07-17 15:53:57.991	\N
cmrp49sms000t04ksoq6h0hl1	cmq59e1vu000004juzmp8xftw	cmpct2xp7000004jsv1ujpe1r	t	2026-07-17 15:52:43.06	2026-07-17 15:52:43.06	2026-07-17 15:53:57.995	\N
cmrp7mda8000204l1riaiikj7	cmrp7l1ax000104l49nmc6qf9	cmpg41k59000004l7521hfcn4	t	2026-07-17 17:26:28.54	2026-07-17 17:26:28.544	2026-07-17 17:28:41.342	\N
cmrp7mdaj000304l19mwbxwlj	cmrp7l1ax000104l49nmc6qf9	cmpefcqj2000104ladlx0ysjz	t	2026-07-17 17:26:28.554	2026-07-17 17:26:28.555	2026-07-17 17:28:41.355	\N
cmrp7n4zv000v04l4dlty8gm7	cmrp7l1ax000104l49nmc6qf9	cmpcm7sgp000004l1fp9o52ky	t	2026-07-17 17:27:04.459	2026-07-17 17:27:04.459	2026-07-17 17:28:41.361	\N
cmrp7n500000w04l4j3z2faa2	cmrp7l1ax000104l49nmc6qf9	cmpdz2mcq000104jr9xnhl4i0	t	2026-07-17 17:27:04.464	2026-07-17 17:27:04.464	2026-07-17 17:28:41.367	\N
cmrp7p7rw001f04l4euszco2n	cmrp7l1ax000104l49nmc6qf9	cmpcoxez0000304l8g40zcfou	t	2026-07-17 17:28:41.372	2026-07-17 17:28:41.372	2026-07-17 17:28:41.372	\N
cmrp7p7s3001g04l4t3yt7qoy	cmrp7l1ax000104l49nmc6qf9	cmpcpimjz000004jpcdqgfhfx	t	2026-07-17 17:28:41.379	2026-07-17 17:28:41.379	2026-07-17 17:28:41.379	\N
cmrp7p7s9001h04l4e5eymezr	cmrp7l1ax000104l49nmc6qf9	cmph7s4ma000004l727k39xdv	t	2026-07-17 17:28:41.385	2026-07-17 17:28:41.385	2026-07-17 17:28:41.385	\N
cmrp7p7se001i04l4cjddyprk	cmrp7l1ax000104l49nmc6qf9	cmpct94t9000204jsxeeckk3m	t	2026-07-17 17:28:41.39	2026-07-17 17:28:41.39	2026-07-17 17:28:41.39	\N
cmrp7p7sk001j04l4xbswq4u7	cmrp7l1ax000104l49nmc6qf9	cmpcpt3n6000004l561lm2ja7	t	2026-07-17 17:28:41.396	2026-07-17 17:28:41.396	2026-07-17 17:28:41.396	\N
cmrp7p7sq001k04l49onl0zxc	cmrp7l1ax000104l49nmc6qf9	cmpefd4zq000204la3jqyndzz	t	2026-07-17 17:28:41.401	2026-07-17 17:28:41.402	2026-07-17 17:28:41.402	\N
cmrp7p7sw001l04l4fbo7p7na	cmrp7l1ax000104l49nmc6qf9	cmpct2xp7000004jsv1ujpe1r	t	2026-07-17 17:28:41.407	2026-07-17 17:28:41.408	2026-07-17 17:28:41.408	\N
cmrp7p7t1001m04l4fhjtlbb6	cmrp7l1ax000104l49nmc6qf9	cmpefdukz000404lanevrsp34	t	2026-07-17 17:28:41.413	2026-07-17 17:28:41.413	2026-07-17 17:28:41.413	\N
cmrp7p7t8001n04l45xskzqoc	cmrp7l1ax000104l49nmc6qf9	cmpcopzu6000004jro3prr7ca	t	2026-07-17 17:28:41.42	2026-07-17 17:28:41.42	2026-07-17 17:28:41.42	\N
cmrp7p7te001o04l4ywwngum8	cmrp7l1ax000104l49nmc6qf9	cmpefep0o000504laynrqmhnw	t	2026-07-17 17:28:41.425	2026-07-17 17:28:41.426	2026-07-17 17:28:41.426	\N
cmrp8alup000p04laif2fauo6	cmrp8963m000004larspejvgr	cmpfk8v2v000704jlp8siky9e	t	2026-07-17 17:45:19.39	2026-07-17 17:45:19.393	2026-07-17 17:48:48.085	\N
cmrp8bjqp000404jpjq1sts2g	cmrp8963m000004larspejvgr	cmpefcqj2000104ladlx0ysjz	t	2026-07-17 17:46:03.312	2026-07-17 17:46:03.313	2026-07-17 17:48:48.091	\N
cmrp8bjqv000504jpsvkxpp7s	cmrp8963m000004larspejvgr	cmpcpgupa000004l5ehnc0kjs	t	2026-07-17 17:46:03.319	2026-07-17 17:46:03.319	2026-07-17 17:48:48.096	\N
cmrp8ceyn000704l5dt1n0tgo	cmrp8963m000004larspejvgr	cmpefdukz000404lanevrsp34	t	2026-07-17 17:46:43.774	2026-07-17 17:46:43.775	2026-07-17 17:48:48.101	\N
cmrp8f2wa000q04jp4ddkgn6r	cmrp8963m000004larspejvgr	cmpcpimjz000004jpcdqgfhfx	t	2026-07-17 17:48:48.105	2026-07-17 17:48:48.106	2026-07-17 17:48:48.106	\N
cmrp8f2wg000r04jppwenmois	cmrp8963m000004larspejvgr	cmph7s4ma000004l727k39xdv	t	2026-07-17 17:48:48.111	2026-07-17 17:48:48.112	2026-07-17 17:48:48.112	\N
cmrp8f2wl000s04jp9e438ki1	cmrp8963m000004larspejvgr	cmpdz3jpw000004jvdohsd2ri	t	2026-07-17 17:48:48.117	2026-07-17 17:48:48.117	2026-07-17 17:48:48.117	\N
cmrp8f2wq000t04jpa6bfpzjl	cmrp8963m000004larspejvgr	cmpefcd1z000004lasd2r1kdh	t	2026-07-17 17:48:48.122	2026-07-17 17:48:48.122	2026-07-17 17:48:48.122	\N
cmrp8f2wv000u04jp5xt3mqq7	cmrp8963m000004larspejvgr	cmpcpt3n6000004l561lm2ja7	t	2026-07-17 17:48:48.127	2026-07-17 17:48:48.127	2026-07-17 17:48:48.127	\N
cmrp8f2x2000v04jpweodupeb	cmrp8963m000004larspejvgr	cmpefd4zq000204la3jqyndzz	t	2026-07-17 17:48:48.133	2026-07-17 17:48:48.134	2026-07-17 17:48:48.134	\N
cmrp8f2x7000w04jpio2e4cp1	cmrp8963m000004larspejvgr	cmpcov8jd000004l8umh13pux	t	2026-07-17 17:48:48.139	2026-07-17 17:48:48.139	2026-07-17 17:48:48.139	\N
cmrp8f2xc000x04jpk9uuhvx2	cmrp8963m000004larspejvgr	cmpct2xp7000004jsv1ujpe1r	t	2026-07-17 17:48:48.144	2026-07-17 17:48:48.144	2026-07-17 17:48:48.144	\N
cmrp8f2xh000y04jpk7laoktf	cmrp8963m000004larspejvgr	cmpcopzu6000004jro3prr7ca	t	2026-07-17 17:48:48.149	2026-07-17 17:48:48.149	2026-07-17 17:48:48.149	\N
cmrp8f2xm000z04jp9rm3lgzg	cmrp8963m000004larspejvgr	cmpefep0o000504laynrqmhnw	t	2026-07-17 17:48:48.154	2026-07-17 17:48:48.154	2026-07-17 17:48:48.154	\N
cmrp8f2xr001004jpuzinqhx7	cmrp8963m000004larspejvgr	cmpcm7sgp000004l1fp9o52ky	t	2026-07-17 17:48:48.159	2026-07-17 17:48:48.159	2026-07-17 17:48:48.159	\N
cmpidunrw0010b0uoo2924y4x	cmpgxpcmr000104l1gbglqrdc	cmpefcd1z000004lasd2r1kdh	t	\N	2026-05-23 13:27:05.18	2026-07-17 17:50:02.569	\N
cmpiduntr0011b0uouqnrypkc	cmpgxpcmr000104l1gbglqrdc	cmpefcqj2000104ladlx0ysjz	t	\N	2026-05-23 13:27:05.247	2026-07-17 17:50:02.577	\N
cmpidunvs0012b0uoalh17h1b	cmpgxpcmr000104l1gbglqrdc	cmpdz2mcq000104jr9xnhl4i0	t	\N	2026-05-23 13:27:05.32	2026-07-17 17:50:02.582	\N
cmpidunz20013b0uoo8m7gt9s	cmpgxpcmr000104l1gbglqrdc	cmpfk8v2v000704jlp8siky9e	t	\N	2026-05-23 13:27:05.438	2026-07-17 17:50:02.586	\N
cmpiduo0w0014b0uos4cfq70w	cmpgxpcmr000104l1gbglqrdc	cmpcpimjz000004jpcdqgfhfx	t	\N	2026-05-23 13:27:05.504	2026-07-17 17:50:02.59	\N
cmpiduo3l0015b0uoff1gs37w	cmpgxpcmr000104l1gbglqrdc	cmpcsds4s000004jmgpwku1j2	t	\N	2026-05-23 13:27:05.601	2026-07-17 17:50:02.594	\N
cmpiduo6w0016b0uoh2uyczil	cmpgxpcmr000104l1gbglqrdc	cmpct94t9000204jsxeeckk3m	t	\N	2026-05-23 13:27:05.72	2026-07-17 17:50:02.598	\N
cmpiduo8k0017b0uop2vlgkzh	cmpgxpcmr000104l1gbglqrdc	cmpcqf47m000004l85vce0gfh	t	\N	2026-05-23 13:27:05.78	2026-07-17 17:50:02.602	\N
cmpiduoc10019b0uonurd9n6t	cmpgxpcmr000104l1gbglqrdc	cmpcpgupa000004l5ehnc0kjs	t	\N	2026-05-23 13:27:05.905	2026-07-17 17:50:02.606	\N
cmpiduodv001ab0uoiutw70cf	cmpgxpcmr000104l1gbglqrdc	cmpefdukz000404lanevrsp34	t	\N	2026-05-23 13:27:05.971	2026-07-17 17:50:02.61	\N
cmpiduofp001bb0uoljcivlov	cmpgxpcmr000104l1gbglqrdc	cmpcm7sgp000004l1fp9o52ky	t	\N	2026-05-23 13:27:06.037	2026-07-17 17:50:02.614	\N
cmpiduoho001cb0uodx7afdfd	cmpgxpcmr000104l1gbglqrdc	cmpefd4zq000204la3jqyndzz	t	\N	2026-05-23 13:27:06.108	2026-07-17 17:50:02.618	\N
cmrp9ovp8000104kzmyhp6b0h	cmrp9ms6u000004ldf8womoau	cmpefd4zq000204la3jqyndzz	t	2026-07-17 18:24:24.951	2026-07-17 18:24:24.956	2026-07-17 18:26:13.623	\N
cmrp9r7jy000f04igcmup6spt	cmrp9ms6u000004ldf8womoau	cmpefdukz000404lanevrsp34	t	2026-07-17 18:26:13.63	2026-07-17 18:26:13.63	2026-07-17 18:26:13.63	\N
cmrp9r7k5000g04iga6wxv0dz	cmrp9ms6u000004ldf8womoau	cmpg41k59000004l7521hfcn4	t	2026-07-17 18:26:13.637	2026-07-17 18:26:13.637	2026-07-17 18:26:13.637	\N
cmrp9r7kb000h04igbhson5to	cmrp9ms6u000004ldf8womoau	cmpcpimjz000004jpcdqgfhfx	t	2026-07-17 18:26:13.642	2026-07-17 18:26:13.643	2026-07-17 18:26:13.643	\N
cmrp9r7kg000i04igp3zcro13	cmrp9ms6u000004ldf8womoau	cmph7s4ma000004l727k39xdv	t	2026-07-17 18:26:13.647	2026-07-17 18:26:13.648	2026-07-17 18:26:13.648	\N
cmrp9r7kk000j04ignkoc18z1	cmrp9ms6u000004ldf8womoau	cmpcsds4s000004jmgpwku1j2	t	2026-07-17 18:26:13.652	2026-07-17 18:26:13.652	2026-07-17 18:26:13.652	\N
cmrp9r7kp000k04igw6lukkfj	cmrp9ms6u000004ldf8womoau	cmpefcqj2000104ladlx0ysjz	t	2026-07-17 18:26:13.656	2026-07-17 18:26:13.657	2026-07-17 18:26:13.657	\N
cmrp9r7kt000l04igq0l64teb	cmrp9ms6u000004ldf8womoau	cmpcpt3n6000004l561lm2ja7	t	2026-07-17 18:26:13.661	2026-07-17 18:26:13.661	2026-07-17 18:26:13.661	\N
cmrp9r7ky000m04ig3uxp1cnx	cmrp9ms6u000004ldf8womoau	cmpdz3jpw000004jvdohsd2ri	t	2026-07-17 18:26:13.666	2026-07-17 18:26:13.666	2026-07-17 18:26:13.666	\N
cmrp9r7l3000n04igw4ww74ll	cmrp9ms6u000004ldf8womoau	cmpdz2mcq000104jr9xnhl4i0	t	2026-07-17 18:26:13.67	2026-07-17 18:26:13.671	2026-07-17 18:26:13.671	\N
cmrp9r7l8000o04ig4yhqvicj	cmrp9ms6u000004ldf8womoau	cmpcov8jd000004l8umh13pux	t	2026-07-17 18:26:13.675	2026-07-17 18:26:13.676	2026-07-17 18:26:13.676	\N
cmrp9r7ld000p04igdl4qp372	cmrp9ms6u000004ldf8womoau	cmpct2xp7000004jsv1ujpe1r	t	2026-07-17 18:26:13.681	2026-07-17 18:26:13.681	2026-07-17 18:26:13.681	\N
cmrp9r7lj000q04igmfn071nj	cmrp9ms6u000004ldf8womoau	cmpefep0o000504laynrqmhnw	t	2026-07-17 18:26:13.687	2026-07-17 18:26:13.687	2026-07-17 18:26:13.687	\N
cmrp9r7lp000r04igovl1qp57	cmrp9ms6u000004ldf8womoau	cmpcm7sgp000004l1fp9o52ky	t	2026-07-17 18:26:13.692	2026-07-17 18:26:13.693	2026-07-17 18:26:13.693	\N
cmrpa0zj6000t04lda0ks8a8p	cmrp9yfic000004jpt8bwp440	cmpcov8jd000004l8umh13pux	t	2026-07-17 18:33:49.791	2026-07-17 18:33:49.794	2026-07-17 18:34:48.486	\N
cmrpa0zjh000u04ldx54l682p	cmrp9yfic000004jpt8bwp440	cmpefcqj2000104ladlx0ysjz	t	2026-07-17 18:33:49.804	2026-07-17 18:33:49.805	2026-07-17 18:34:48.491	\N
cmrpa28ts001504igyw4bslsi	cmrp9yfic000004jpt8bwp440	cmpcpimjz000004jpcdqgfhfx	t	2026-07-17 18:34:48.495	2026-07-17 18:34:48.496	2026-07-17 18:34:48.496	\N
cmrpa28u2001604iguudwjc8q	cmrp9yfic000004jpt8bwp440	cmph7s4ma000004l727k39xdv	t	2026-07-17 18:34:48.506	2026-07-17 18:34:48.506	2026-07-17 18:34:48.506	\N
cmrpa28up001704ig6cla1sv8	cmrp9yfic000004jpt8bwp440	cmpefcd1z000004lasd2r1kdh	t	2026-07-17 18:34:48.529	2026-07-17 18:34:48.529	2026-07-17 18:34:48.529	\N
cmrpa28v9001804ig7f1vugyg	cmrp9yfic000004jpt8bwp440	cmpefd4zq000204la3jqyndzz	t	2026-07-17 18:34:48.549	2026-07-17 18:34:48.549	2026-07-17 18:34:48.549	\N
cmrpa28vf001904ig0ub9gedb	cmrp9yfic000004jpt8bwp440	cmpcpgupa000004l5ehnc0kjs	t	2026-07-17 18:34:48.554	2026-07-17 18:34:48.555	2026-07-17 18:34:48.555	\N
cmrpa28vk001a04igl581c04q	cmrp9yfic000004jpt8bwp440	cmpcopzu6000004jro3prr7ca	t	2026-07-17 18:34:48.56	2026-07-17 18:34:48.56	2026-07-17 18:34:48.56	\N
cmrpa69nb001f04jpq1x8m8eu	cmrpa59lt000p04jpzp8qdy4l	cmpdz2mcq000104jr9xnhl4i0	t	2026-07-17 18:37:56.18	2026-07-17 18:37:56.183	2026-07-17 18:40:11.347	\N
cmrpa69ni001g04jpd110285h	cmrpa59lt000p04jpzp8qdy4l	cmpefcqj2000104ladlx0ysjz	t	2026-07-17 18:37:56.19	2026-07-17 18:37:56.19	2026-07-17 18:40:11.353	\N
cmrpa8kge001x04jpcjcrjzcc	cmrpa59lt000p04jpzp8qdy4l	cmpcpimjz000004jpcdqgfhfx	t	2026-07-17 18:39:43.501	2026-07-17 18:39:43.502	2026-07-17 18:40:11.357	\N
cmrpa8kgj001y04jpaxilloud	cmrpa59lt000p04jpzp8qdy4l	cmph7s4ma000004l727k39xdv	t	2026-07-17 18:39:43.507	2026-07-17 18:39:43.507	2026-07-17 18:40:11.362	\N
cmrpa8kgo001z04jptxt5zzgl	cmrpa59lt000p04jpzp8qdy4l	cmpcsds4s000004jmgpwku1j2	t	2026-07-17 18:39:43.512	2026-07-17 18:39:43.512	2026-07-17 18:40:11.366	\N
cmrpa8kgt002004jpoideq3pk	cmrpa59lt000p04jpzp8qdy4l	cmpct94t9000204jsxeeckk3m	t	2026-07-17 18:39:43.517	2026-07-17 18:39:43.517	2026-07-17 18:40:11.37	\N
cmrpa8kgx002104jpkwvml23t	cmrpa59lt000p04jpzp8qdy4l	cmpefcd1z000004lasd2r1kdh	t	2026-07-17 18:39:43.521	2026-07-17 18:39:43.521	2026-07-17 18:40:11.374	\N
cmrpa8kh1002204jp928i1q8n	cmrpa59lt000p04jpzp8qdy4l	cmpcpt3n6000004l561lm2ja7	t	2026-07-17 18:39:43.525	2026-07-17 18:39:43.525	2026-07-17 18:40:11.378	\N
cmrpa8kh5002304jpabgrk02e	cmrpa59lt000p04jpzp8qdy4l	cmpefd4zq000204la3jqyndzz	t	2026-07-17 18:39:43.529	2026-07-17 18:39:43.529	2026-07-17 18:40:11.385	\N
cmrpa8kha002404jpprjh55fe	cmrpa59lt000p04jpzp8qdy4l	cmpct2xp7000004jsv1ujpe1r	t	2026-07-17 18:39:43.533	2026-07-17 18:39:43.534	2026-07-17 18:40:11.389	\N
cmrpa8khe002504jpgdo9l4em	cmrpa59lt000p04jpzp8qdy4l	cmpefdukz000404lanevrsp34	t	2026-07-17 18:39:43.537	2026-07-17 18:39:43.538	2026-07-17 18:40:11.393	\N
cmrpa8khi002604jpkfo34kmv	cmrpa59lt000p04jpzp8qdy4l	cmpefdkyx000304la3k3nq9p9	t	2026-07-17 18:39:43.541	2026-07-17 18:39:43.542	2026-07-17 18:40:11.398	\N
cmrpa8khm002704jpe60th97i	cmrpa59lt000p04jpzp8qdy4l	cmpcopzu6000004jro3prr7ca	t	2026-07-17 18:39:43.545	2026-07-17 18:39:43.546	2026-07-17 18:40:11.402	\N
cmrpa8khq002804jpg5ed7mv7	cmrpa59lt000p04jpzp8qdy4l	cmpcm7sgp000004l1fp9o52ky	t	2026-07-17 18:39:43.549	2026-07-17 18:39:43.55	2026-07-17 18:40:11.406	\N
cmrpb0luh000404jsfcqal0od	cmrpaz5ve001b04igete2fxqx	cmph7t8a1000004l9n8uic25p	t	2026-07-17 19:01:31.67	2026-07-17 19:01:31.673	2026-07-17 19:03:19.431	\N
cmrpb0lut000504jsoo4pkhvo	cmrpaz5ve001b04igete2fxqx	cmpcov8jd000004l8umh13pux	t	2026-07-17 19:01:31.684	2026-07-17 19:01:31.685	2026-07-17 19:03:19.437	\N
cmrpb0luy000604jssnw66s2z	cmrpaz5ve001b04igete2fxqx	cmpdz2mcq000104jr9xnhl4i0	t	2026-07-17 19:01:31.69	2026-07-17 19:01:31.69	2026-07-17 19:03:19.442	\N
cmrpb2x09001e04ld9l6ijbdz	cmrpaz5ve001b04igete2fxqx	cmpefdukz000404lanevrsp34	t	2026-07-17 19:03:19.449	2026-07-17 19:03:19.449	2026-07-17 19:03:19.449	\N
cmrpb2x0j001f04ld9ahequxp	cmrpaz5ve001b04igete2fxqx	cmpfk8v2v000704jlp8siky9e	t	2026-07-17 19:03:19.458	2026-07-17 19:03:19.459	2026-07-17 19:03:19.459	\N
cmrpb2x0p001g04ldoa94s4k1	cmrpaz5ve001b04igete2fxqx	cmpcpimjz000004jpcdqgfhfx	t	2026-07-17 19:03:19.464	2026-07-17 19:03:19.465	2026-07-17 19:03:19.465	\N
cmrpb2x0v001h04ld12ogevp0	cmrpaz5ve001b04igete2fxqx	cmph7s4ma000004l727k39xdv	t	2026-07-17 19:03:19.47	2026-07-17 19:03:19.471	2026-07-17 19:03:19.471	\N
cmrpb2x11001i04ldmkift4x5	cmrpaz5ve001b04igete2fxqx	cmpcsds4s000004jmgpwku1j2	t	2026-07-17 19:03:19.476	2026-07-17 19:03:19.477	2026-07-17 19:03:19.477	\N
cmrpb2x17001j04ldy93cpbfr	cmrpaz5ve001b04igete2fxqx	cmpct94t9000204jsxeeckk3m	t	2026-07-17 19:03:19.482	2026-07-17 19:03:19.483	2026-07-17 19:03:19.483	\N
cmrpb2x1d001k04ld99vjd3uq	cmrpaz5ve001b04igete2fxqx	cmpefcd1z000004lasd2r1kdh	t	2026-07-17 19:03:19.489	2026-07-17 19:03:19.489	2026-07-17 19:03:19.489	\N
cmrpb2x1j001l04ldkoz2s072	cmrpaz5ve001b04igete2fxqx	cmpefcqj2000104ladlx0ysjz	t	2026-07-17 19:03:19.494	2026-07-17 19:03:19.495	2026-07-17 19:03:19.495	\N
cmrpb2x1p001m04ld4evmn28m	cmrpaz5ve001b04igete2fxqx	cmpefd4zq000204la3jqyndzz	t	2026-07-17 19:03:19.5	2026-07-17 19:03:19.501	2026-07-17 19:03:19.501	\N
cmrpb2x1v001n04ld3clo50vu	cmrpaz5ve001b04igete2fxqx	cmpct2xp7000004jsv1ujpe1r	t	2026-07-17 19:03:19.506	2026-07-17 19:03:19.507	2026-07-17 19:03:19.507	\N
cmrpb2x20001o04ldfjqujfp5	cmrpaz5ve001b04igete2fxqx	cmpcpgupa000004l5ehnc0kjs	t	2026-07-17 19:03:19.512	2026-07-17 19:03:19.512	2026-07-17 19:03:19.512	\N
cmrpb2x26001p04ldu12nde8i	cmrpaz5ve001b04igete2fxqx	cmpcopzu6000004jro3prr7ca	t	2026-07-17 19:03:19.518	2026-07-17 19:03:19.518	2026-07-17 19:03:19.518	\N
cmrpb2x2c001q04ldm9i5omwp	cmrpaz5ve001b04igete2fxqx	cmpcm7sgp000004l1fp9o52ky	t	2026-07-17 19:03:19.523	2026-07-17 19:03:19.524	2026-07-17 19:03:19.524	\N
cmrpbnegc000c04js0awkv8yv	cmrpblr3f001r04ldzbbc1u6h	cmpefcqj2000104ladlx0ysjz	t	2026-07-17 19:19:15.179	2026-07-17 19:19:15.18	2026-07-17 19:20:37.313	\N
cmrpbnegr000d04js0m7nsww2	cmrpblr3f001r04ldzbbc1u6h	cmpefd4zq000204la3jqyndzz	t	2026-07-17 19:19:15.195	2026-07-17 19:19:15.195	2026-07-17 19:20:37.318	\N
cmrpbnegx000e04jszcmkywzo	cmrpblr3f001r04ldzbbc1u6h	cmpcov8jd000004l8umh13pux	t	2026-07-17 19:19:15.201	2026-07-17 19:19:15.201	2026-07-17 19:20:37.322	\N
cmrpbneh4000f04js8hmk99ct	cmrpblr3f001r04ldzbbc1u6h	cmpg41k59000004l7521hfcn4	t	2026-07-17 19:19:15.207	2026-07-17 19:19:15.208	2026-07-17 19:20:37.326	\N
cmrpbneha000g04jsrchpyd8v	cmrpblr3f001r04ldzbbc1u6h	cmpcpgupa000004l5ehnc0kjs	t	2026-07-17 19:19:15.213	2026-07-17 19:19:15.214	2026-07-17 19:20:37.33	\N
cmrpbp5ue002k04igpf4ziq6z	cmrpblr3f001r04ldzbbc1u6h	cmpcpimjz000004jpcdqgfhfx	t	2026-07-17 19:20:37.334	2026-07-17 19:20:37.334	2026-07-17 19:20:37.334	\N
cmrpbp5uj002l04igadk09uo4	cmrpblr3f001r04ldzbbc1u6h	cmph7s4ma000004l727k39xdv	t	2026-07-17 19:20:37.339	2026-07-17 19:20:37.339	2026-07-17 19:20:37.339	\N
cmrpbp5up002m04igc5z9zldx	cmrpblr3f001r04ldzbbc1u6h	cmpcsds4s000004jmgpwku1j2	t	2026-07-17 19:20:37.345	2026-07-17 19:20:37.345	2026-07-17 19:20:37.345	\N
cmrpbp5ut002n04igx8bhkebu	cmrpblr3f001r04ldzbbc1u6h	cmpct94t9000204jsxeeckk3m	t	2026-07-17 19:20:37.349	2026-07-17 19:20:37.349	2026-07-17 19:20:37.349	\N
cmrpbp5ux002o04igagll60lw	cmrpblr3f001r04ldzbbc1u6h	cmpdz3jpw000004jvdohsd2ri	t	2026-07-17 19:20:37.353	2026-07-17 19:20:37.353	2026-07-17 19:20:37.353	\N
cmrpbp5v2002p04igawcqrzxu	cmrpblr3f001r04ldzbbc1u6h	cmpefcd1z000004lasd2r1kdh	t	2026-07-17 19:20:37.357	2026-07-17 19:20:37.358	2026-07-17 19:20:37.358	\N
cmrpbp5v6002q04igtn77ipyi	cmrpblr3f001r04ldzbbc1u6h	cmph7t8a1000004l9n8uic25p	t	2026-07-17 19:20:37.361	2026-07-17 19:20:37.362	2026-07-17 19:20:37.362	\N
cmrpbp5va002r04igvxnzw8nv	cmrpblr3f001r04ldzbbc1u6h	cmpefdukz000404lanevrsp34	t	2026-07-17 19:20:37.365	2026-07-17 19:20:37.366	2026-07-17 19:20:37.366	\N
cmrpbp5ve002s04ig0ycdxkel	cmrpblr3f001r04ldzbbc1u6h	cmpefdkyx000304la3k3nq9p9	t	2026-07-17 19:20:37.369	2026-07-17 19:20:37.37	2026-07-17 19:20:37.37	\N
cmrpbp5vi002t04igsqza5ziv	cmrpblr3f001r04ldzbbc1u6h	cmpcopzu6000004jro3prr7ca	t	2026-07-17 19:20:37.373	2026-07-17 19:20:37.374	2026-07-17 19:20:37.374	\N
cmrpbp5vm002u04ig7dwp2cts	cmrpblr3f001r04ldzbbc1u6h	cmpcm7sgp000004l1fp9o52ky	t	2026-07-17 19:20:37.377	2026-07-17 19:20:37.378	2026-07-17 19:20:37.378	\N
cmrpbya2k000z04js8xozoops	cmrpbrolu002f04ld1jou7dvp	cmpefcqj2000104ladlx0ysjz	t	2026-07-17 19:27:42.715	2026-07-17 19:27:42.716	2026-07-17 19:27:42.716	\N
cmrpbya2z001004jsjhz81mfp	cmrpbrolu002f04ld1jou7dvp	cmpefcd1z000004lasd2r1kdh	t	2026-07-17 19:27:42.731	2026-07-17 19:27:42.731	2026-07-17 19:27:42.731	\N
cmrpbya35001104jspiziqxzu	cmrpbrolu002f04ld1jou7dvp	cmph7t8a1000004l9n8uic25p	t	2026-07-17 19:27:42.737	2026-07-17 19:27:42.737	2026-07-17 19:27:42.737	\N
cmrpbya3b001204jsmq1q7vn5	cmrpbrolu002f04ld1jou7dvp	cmpcov8jd000004l8umh13pux	t	2026-07-17 19:27:42.743	2026-07-17 19:27:42.743	2026-07-17 19:27:42.743	\N
cmrpbya3g001304js49as028c	cmrpbrolu002f04ld1jou7dvp	cmpg43u13000604l7y6t0hdtt	t	2026-07-17 19:27:42.748	2026-07-17 19:27:42.748	2026-07-17 19:27:42.748	\N
cmrpbya3m001404jshotq75wt	cmrpbrolu002f04ld1jou7dvp	cmpcpt3n6000004l561lm2ja7	t	2026-07-17 19:27:42.754	2026-07-17 19:27:42.754	2026-07-17 19:27:42.754	\N
cmrpbya3s001504jsbei3iscm	cmrpbrolu002f04ld1jou7dvp	cmpdz2mcq000104jr9xnhl4i0	t	2026-07-17 19:27:42.759	2026-07-17 19:27:42.76	2026-07-17 19:27:42.76	\N
cmrpbya3x001604jsd4o2cpt7	cmrpbrolu002f04ld1jou7dvp	cmpfk8v2v000704jlp8siky9e	t	2026-07-17 19:27:42.765	2026-07-17 19:27:42.765	2026-07-17 19:27:42.765	\N
cmrpbya42001704jsu6lbx49j	cmrpbrolu002f04ld1jou7dvp	cmpcpimjz000004jpcdqgfhfx	t	2026-07-17 19:27:42.77	2026-07-17 19:27:42.77	2026-07-17 19:27:42.77	\N
cmrpbya49001804js8buysjp3	cmrpbrolu002f04ld1jou7dvp	cmpcsds4s000004jmgpwku1j2	t	2026-07-17 19:27:42.776	2026-07-17 19:27:42.777	2026-07-17 19:27:42.777	\N
cmrpbya4e001904jsamlp68r0	cmrpbrolu002f04ld1jou7dvp	cmpct94t9000204jsxeeckk3m	t	2026-07-17 19:27:42.782	2026-07-17 19:27:42.782	2026-07-17 19:27:42.782	\N
cmrpbya4k001a04js0ujdqmy8	cmrpbrolu002f04ld1jou7dvp	cmpefd4zq000204la3jqyndzz	t	2026-07-17 19:27:42.787	2026-07-17 19:27:42.788	2026-07-17 19:27:42.788	\N
cmrpbya4p001b04jsxiuhmi8r	cmrpbrolu002f04ld1jou7dvp	cmpct2xp7000004jsv1ujpe1r	t	2026-07-17 19:27:42.793	2026-07-17 19:27:42.793	2026-07-17 19:27:42.793	\N
cmrpbya4v001c04jsnha2bawg	cmrpbrolu002f04ld1jou7dvp	cmpefdkyx000304la3k3nq9p9	t	2026-07-17 19:27:42.798	2026-07-17 19:27:42.799	2026-07-17 19:27:42.799	\N
cmrpbya50001d04js1xeqx46e	cmrpbrolu002f04ld1jou7dvp	cmpcopzu6000004jro3prr7ca	t	2026-07-17 19:27:42.804	2026-07-17 19:27:42.804	2026-07-17 19:27:42.804	\N
cmrpbya59001e04js5pltk38b	cmrpbrolu002f04ld1jou7dvp	cmpefep0o000504laynrqmhnw	t	2026-07-17 19:27:42.812	2026-07-17 19:27:42.813	2026-07-17 19:27:42.813	\N
cmrpbya5e001f04jsbwpoyefb	cmrpbrolu002f04ld1jou7dvp	cmpcm7sgp000004l1fp9o52ky	t	2026-07-17 19:27:42.818	2026-07-17 19:27:42.818	2026-07-17 19:27:42.818	\N
cmrpcd2h4000104l5l8ke9br5	cmrpcbynn003404ldris66yj1	cmpefcqj2000104ladlx0ysjz	t	2026-07-17 19:39:12.708	2026-07-17 19:39:12.712	2026-07-17 19:42:25.963	\N
cmrpcea3h003x04ldw4u0dt7h	cmrpcbynn003404ldris66yj1	cmpg43u13000604l7y6t0hdtt	t	2026-07-17 19:40:09.245	2026-07-17 19:40:09.245	2026-07-17 19:42:25.969	\N
cmrpcea3o003y04lde0cmyr9r	cmrpcbynn003404ldris66yj1	cmpdz2mcq000104jr9xnhl4i0	t	2026-07-17 19:40:09.251	2026-07-17 19:40:09.252	2026-07-17 19:42:25.988	\N
cmrpcea3t003z04ld4wgsaius	cmrpcbynn003404ldris66yj1	cmpg41k59000004l7521hfcn4	t	2026-07-17 19:40:09.257	2026-07-17 19:40:09.257	2026-07-17 19:42:25.994	\N
cmrpcfqh5001u04js9s6dmwo2	cmrpcbynn003404ldris66yj1	cmpfk8v2v000704jlp8siky9e	t	2026-07-17 19:41:17.129	2026-07-17 19:41:17.129	2026-07-17 19:42:26	\N
cmrpcfqhb001v04jsdkiny9pt	cmrpcbynn003404ldris66yj1	cmpcpimjz000004jpcdqgfhfx	t	2026-07-17 19:41:17.135	2026-07-17 19:41:17.135	2026-07-17 19:42:26.006	\N
cmrpcfqhh001w04jsc0huhe9u	cmrpcbynn003404ldris66yj1	cmpcsds4s000004jmgpwku1j2	t	2026-07-17 19:41:17.141	2026-07-17 19:41:17.142	2026-07-17 19:42:26.011	\N
cmrpcfqhn001x04js91gjqp6a	cmrpcbynn003404ldris66yj1	cmpefcd1z000004lasd2r1kdh	t	2026-07-17 19:41:17.147	2026-07-17 19:41:17.147	2026-07-17 19:42:26.017	\N
cmrpcfqht001y04jsnt2knr1f	cmrpcbynn003404ldris66yj1	cmpefd4zq000204la3jqyndzz	t	2026-07-17 19:41:17.153	2026-07-17 19:41:17.153	2026-07-17 19:42:26.023	\N
cmrpcfqhz001z04jsvpik50dp	cmrpcbynn003404ldris66yj1	cmpefdkyx000304la3k3nq9p9	t	2026-07-17 19:41:17.159	2026-07-17 19:41:17.159	2026-07-17 19:42:26.029	\N
cmrpcgt8o000o04l9stcbjj8b	cmrpcbynn003404ldris66yj1	cmpct94t9000204jsxeeckk3m	t	2026-07-17 19:42:07.368	2026-07-17 19:42:07.368	2026-07-17 19:42:26.034	\N
cmrpcgt8s000p04l953zb9t57	cmrpcbynn003404ldris66yj1	cmpcpt3n6000004l561lm2ja7	t	2026-07-17 19:42:07.372	2026-07-17 19:42:07.372	2026-07-17 19:42:26.04	\N
cmrpcgt93000q04l9bomq7fu4	cmrpcbynn003404ldris66yj1	cmpefep0o000504laynrqmhnw	t	2026-07-17 19:42:07.383	2026-07-17 19:42:07.383	2026-07-17 19:42:26.046	\N
cmrpcgt99000r04l9x2hx84sh	cmrpcbynn003404ldris66yj1	cmpcov8jd000004l8umh13pux	t	2026-07-17 19:42:07.389	2026-07-17 19:42:07.389	2026-07-17 19:42:26.052	\N
cmrpch7nu001l04l90u8lvqjp	cmrpcbynn003404ldris66yj1	cmpcm7sgp000004l1fp9o52ky	t	2026-07-17 19:42:26.058	2026-07-17 19:42:26.058	2026-07-17 19:42:26.058	\N
cmrpg5vcr000g04i5ef8fo9yt	cmrpg2uyd000004l44co9je0h	cmpfk8v2v000704jlp8siky9e	t	2026-07-17 21:25:35.35	2026-07-17 21:25:35.355	2026-07-17 21:25:35.355	\N
cmrpg5vd9000h04i5ewm6u7uo	cmrpg2uyd000004l44co9je0h	cmpcpimjz000004jpcdqgfhfx	t	2026-07-17 21:25:35.372	2026-07-17 21:25:35.373	2026-07-17 21:25:35.373	\N
cmrpg5vdf000i04i5bvcxzdyl	cmrpg2uyd000004l44co9je0h	cmpcsds4s000004jmgpwku1j2	t	2026-07-17 21:25:35.378	2026-07-17 21:25:35.379	2026-07-17 21:25:35.379	\N
cmrpg5vdk000j04i5fgbixvdr	cmrpg2uyd000004l44co9je0h	cmpct94t9000204jsxeeckk3m	t	2026-07-17 21:25:35.384	2026-07-17 21:25:35.384	2026-07-17 21:25:35.384	\N
cmrpg5vdq000k04i52c8y4mqj	cmrpg2uyd000004l44co9je0h	cmpefcd1z000004lasd2r1kdh	t	2026-07-17 21:25:35.39	2026-07-17 21:25:35.39	2026-07-17 21:25:35.39	\N
cmrpg5ve1000l04i5roas34c3	cmrpg2uyd000004l44co9je0h	cmpefcqj2000104ladlx0ysjz	t	2026-07-17 21:25:35.401	2026-07-17 21:25:35.401	2026-07-17 21:25:35.401	\N
cmrpg5ve7000m04i53kmn7sgc	cmrpg2uyd000004l44co9je0h	cmph7t8a1000004l9n8uic25p	t	2026-07-17 21:25:35.406	2026-07-17 21:25:35.407	2026-07-17 21:25:35.407	\N
cmrpg5vec000n04i540678bah	cmrpg2uyd000004l44co9je0h	cmpdz2mcq000104jr9xnhl4i0	t	2026-07-17 21:25:35.412	2026-07-17 21:25:35.413	2026-07-17 21:25:35.413	\N
cmrpg5vei000o04i55r36gbnt	cmrpg2uyd000004l44co9je0h	cmpefd4zq000204la3jqyndzz	t	2026-07-17 21:25:35.418	2026-07-17 21:25:35.418	2026-07-17 21:25:35.418	\N
cmrpg5veo000p04i5t8em9sq2	cmrpg2uyd000004l44co9je0h	cmpcov8jd000004l8umh13pux	t	2026-07-17 21:25:35.424	2026-07-17 21:25:35.424	2026-07-17 21:25:35.424	\N
cmrpg5vet000q04i5j5lfoeqi	cmrpg2uyd000004l44co9je0h	cmpct2xp7000004jsv1ujpe1r	t	2026-07-17 21:25:35.429	2026-07-17 21:25:35.429	2026-07-17 21:25:35.429	\N
cmrpg5vf5000r04i5bmt6jlw9	cmrpg2uyd000004l44co9je0h	cmpefdukz000404lanevrsp34	t	2026-07-17 21:25:35.44	2026-07-17 21:25:35.441	2026-07-17 21:25:35.441	\N
cmrpg5vfa000s04i5oqwsmuqd	cmrpg2uyd000004l44co9je0h	cmpefdkyx000304la3k3nq9p9	t	2026-07-17 21:25:35.446	2026-07-17 21:25:35.446	2026-07-17 21:25:35.446	\N
cmrpg5vff000t04i571rsdpf9	cmrpg2uyd000004l44co9je0h	cmpefep0o000504laynrqmhnw	t	2026-07-17 21:25:35.451	2026-07-17 21:25:35.451	2026-07-17 21:25:35.451	\N
cmrpg5vfl000u04i5sz8uyv76	cmrpg2uyd000004l44co9je0h	cmpcm7sgp000004l1fp9o52ky	t	2026-07-17 21:25:35.456	2026-07-17 21:25:35.457	2026-07-17 21:25:35.457	\N
cmrpg5vfq000v04i5iq57d1t2	cmrpg2uyd000004l44co9je0h	cmpcqf47m000004l85vce0gfh	t	2026-07-17 21:25:35.462	2026-07-17 21:25:35.462	2026-07-17 21:25:35.462	\N
cmrqls7ps000j04lawyipp2fb	cmrqlng1w000004junomwb3sz	cmpefdukz000404lanevrsp34	t	2026-07-18 16:50:42.063	2026-07-18 16:50:42.064	2026-07-18 16:50:42.064	\N
cmrqls7q3000k04la9pwv7wtv	cmrqlng1w000004junomwb3sz	cmph7s4ma000004l727k39xdv	t	2026-07-18 16:50:42.075	2026-07-18 16:50:42.076	2026-07-18 16:50:42.076	\N
cmrpgtwjn000504jt4ynnajb9	cmrpgrdrs000o04jtnnx9wcf4	cmpefcd1z000004lasd2r1kdh	t	2026-07-17 21:44:16.64	2026-07-17 21:44:16.643	2026-07-17 21:46:16.52	\N
cmrpgtwk0000604jtis6xw43w	cmrpgrdrs000o04jtnnx9wcf4	cmpefcqj2000104ladlx0ysjz	t	2026-07-17 21:44:16.655	2026-07-17 21:44:16.656	2026-07-17 21:46:16.532	\N
cmrpgwh20000k04l1sd7dn907	cmrpgrdrs000o04jtnnx9wcf4	cmpg41k59000004l7521hfcn4	t	2026-07-17 21:46:16.536	2026-07-17 21:46:16.536	2026-07-17 21:46:16.536	\N
cmrpgwh26000l04l1mcak7xrz	cmrpgrdrs000o04jtnnx9wcf4	cmpcsds4s000004jmgpwku1j2	t	2026-07-17 21:46:16.542	2026-07-17 21:46:16.542	2026-07-17 21:46:16.542	\N
cmrpgwh2f000m04l1igv7jt02	cmrpgrdrs000o04jtnnx9wcf4	cmpcpimjz000004jpcdqgfhfx	t	2026-07-17 21:46:16.551	2026-07-17 21:46:16.551	2026-07-17 21:46:16.551	\N
cmrpgwh2l000n04l1i08s6dri	cmrpgrdrs000o04jtnnx9wcf4	cmpefdukz000404lanevrsp34	t	2026-07-17 21:46:16.556	2026-07-17 21:46:16.557	2026-07-17 21:46:16.557	\N
cmrpgwh2p000o04l1nm0rb9yk	cmrpgrdrs000o04jtnnx9wcf4	cmpct94t9000204jsxeeckk3m	t	2026-07-17 21:46:16.56	2026-07-17 21:46:16.561	2026-07-17 21:46:16.561	\N
cmrpgwh2t000p04l1i6m415wr	cmrpgrdrs000o04jtnnx9wcf4	cmpefd4zq000204la3jqyndzz	t	2026-07-17 21:46:16.565	2026-07-17 21:46:16.565	2026-07-17 21:46:16.565	\N
cmrpgwh2y000q04l1i0b7vlj0	cmrpgrdrs000o04jtnnx9wcf4	cmpcov8jd000004l8umh13pux	t	2026-07-17 21:46:16.57	2026-07-17 21:46:16.57	2026-07-17 21:46:16.57	\N
cmrpgwh33000r04l10n8q9t4h	cmrpgrdrs000o04jtnnx9wcf4	cmpct2xp7000004jsv1ujpe1r	t	2026-07-17 21:46:16.575	2026-07-17 21:46:16.575	2026-07-17 21:46:16.575	\N
cmrpgwh37000s04l1z38385hh	cmrpgrdrs000o04jtnnx9wcf4	cmpcsehq1000104ibueo8dlm5	t	2026-07-17 21:46:16.579	2026-07-17 21:46:16.579	2026-07-17 21:46:16.579	\N
cmrpgwh3d000t04l179ygggpx	cmrpgrdrs000o04jtnnx9wcf4	cmpefdkyx000304la3k3nq9p9	t	2026-07-17 21:46:16.585	2026-07-17 21:46:16.585	2026-07-17 21:46:16.585	\N
cmrpgwh3h000u04l10n5uy2si	cmrpgrdrs000o04jtnnx9wcf4	cmpcopzu6000004jro3prr7ca	t	2026-07-17 21:46:16.589	2026-07-17 21:46:16.589	2026-07-17 21:46:16.589	\N
cmrpgwh3l000v04l14uyuwdzw	cmrpgrdrs000o04jtnnx9wcf4	cmpefep0o000504laynrqmhnw	t	2026-07-17 21:46:16.593	2026-07-17 21:46:16.593	2026-07-17 21:46:16.593	\N
cmrpgwh3q000w04l18an097k1	cmrpgrdrs000o04jtnnx9wcf4	cmpcm7sgp000004l1fp9o52ky	t	2026-07-17 21:46:16.598	2026-07-17 21:46:16.598	2026-07-17 21:46:16.598	\N
cmrpgwh3u000x04l14uqk4g9r	cmrpgrdrs000o04jtnnx9wcf4	cmph7s4ma000004l727k39xdv	t	2026-07-17 21:46:16.602	2026-07-17 21:46:16.602	2026-07-17 21:46:16.602	\N
cmrqls7q8000l04lanb5jfukc	cmrqlng1w000004junomwb3sz	cmpcsds4s000004jmgpwku1j2	t	2026-07-18 16:50:42.08	2026-07-18 16:50:42.08	2026-07-18 16:50:42.08	\N
cmrqls7qe000m04labqnwsr9j	cmrqlng1w000004junomwb3sz	cmpct94t9000204jsxeeckk3m	t	2026-07-18 16:50:42.086	2026-07-18 16:50:42.086	2026-07-18 16:50:42.086	\N
cmrqls7qi000n04laa26ij8i0	cmrqlng1w000004junomwb3sz	cmpdz3jpw000004jvdohsd2ri	t	2026-07-18 16:50:42.09	2026-07-18 16:50:42.09	2026-07-18 16:50:42.09	\N
cmrqkxxk3000304l7ea6gisr8	cmrqkwrev000004jpjug6t8wd	cmpefcqj2000104ladlx0ysjz	t	2026-07-18 16:27:09.215	2026-07-18 16:27:09.219	2026-07-18 16:29:23.146	\N
cmrqkxxkd000404l79gnj2og7	cmrqkwrev000004jpjug6t8wd	cmpg43u13000604l7y6t0hdtt	t	2026-07-18 16:27:09.228	2026-07-18 16:27:09.229	2026-07-18 16:29:23.182	\N
cmrqkxxkh000504l7eeqkcpxc	cmrqkwrev000004jpjug6t8wd	cmpefd4zq000204la3jqyndzz	t	2026-07-18 16:27:09.233	2026-07-18 16:27:09.233	2026-07-18 16:29:23.188	\N
cmrqkz18q000904jroqqg1evw	cmrqkwrev000004jpjug6t8wd	cmpefcd1z000004lasd2r1kdh	t	2026-07-18 16:28:00.65	2026-07-18 16:28:00.65	2026-07-18 16:29:23.206	\N
cmrqkz18u000a04jrhcpx8g3y	cmrqkwrev000004jpjug6t8wd	cmpcpt3n6000004l561lm2ja7	t	2026-07-18 16:28:00.653	2026-07-18 16:28:00.654	2026-07-18 16:29:23.212	\N
cmrqkz18x000b04jrv1l3zscy	cmrqkwrev000004jpjug6t8wd	cmpdz2mcq000104jr9xnhl4i0	t	2026-07-18 16:28:00.657	2026-07-18 16:28:00.658	2026-07-18 16:29:23.221	\N
cmrql0syj000p04lanqqjer99	cmrqkwrev000004jpjug6t8wd	cmpcpimjz000004jpcdqgfhfx	t	2026-07-18 16:29:23.227	2026-07-18 16:29:23.227	2026-07-18 16:29:23.227	\N
cmrql0syp000q04laz2sl5gxp	cmrqkwrev000004jpjug6t8wd	cmph7s4ma000004l727k39xdv	t	2026-07-18 16:29:23.233	2026-07-18 16:29:23.233	2026-07-18 16:29:23.233	\N
cmrql0syv000r04laqlwximff	cmrqkwrev000004jpjug6t8wd	cmpct94t9000204jsxeeckk3m	t	2026-07-18 16:29:23.239	2026-07-18 16:29:23.239	2026-07-18 16:29:23.239	\N
cmrql0sz1000s04la3kg2jvdo	cmrqkwrev000004jpjug6t8wd	cmph7t8a1000004l9n8uic25p	t	2026-07-18 16:29:23.245	2026-07-18 16:29:23.245	2026-07-18 16:29:23.245	\N
cmrql0sz7000t04laufxn48mt	cmrqkwrev000004jpjug6t8wd	cmpcov8jd000004l8umh13pux	t	2026-07-18 16:29:23.251	2026-07-18 16:29:23.251	2026-07-18 16:29:23.251	\N
cmrql0szd000u04lao0lojmru	cmrqkwrev000004jpjug6t8wd	cmpct2xp7000004jsv1ujpe1r	t	2026-07-18 16:29:23.256	2026-07-18 16:29:23.257	2026-07-18 16:29:23.257	\N
cmrql0szj000v04la1rirka5i	cmrqkwrev000004jpjug6t8wd	cmpcsehq1000104ibueo8dlm5	t	2026-07-18 16:29:23.262	2026-07-18 16:29:23.263	2026-07-18 16:29:23.263	\N
cmrql0szo000w04lahxzup93o	cmrqkwrev000004jpjug6t8wd	cmpefdukz000404lanevrsp34	t	2026-07-18 16:29:23.268	2026-07-18 16:29:23.268	2026-07-18 16:29:23.268	\N
cmrql0szu000x04la55nekydo	cmrqkwrev000004jpjug6t8wd	cmpefdkyx000304la3k3nq9p9	t	2026-07-18 16:29:23.273	2026-07-18 16:29:23.274	2026-07-18 16:29:23.274	\N
cmrql0szz000y04lahylijcxg	cmrqkwrev000004jpjug6t8wd	cmpcopzu6000004jro3prr7ca	t	2026-07-18 16:29:23.279	2026-07-18 16:29:23.279	2026-07-18 16:29:23.279	\N
cmrql0t05000z04laa8h2js1z	cmrqkwrev000004jpjug6t8wd	cmpefep0o000504laynrqmhnw	t	2026-07-18 16:29:23.285	2026-07-18 16:29:23.285	2026-07-18 16:29:23.285	\N
cmrql0t0b001004laahp1cz3d	cmrqkwrev000004jpjug6t8wd	cmpcm7sgp000004l1fp9o52ky	t	2026-07-18 16:29:23.29	2026-07-18 16:29:23.291	2026-07-18 16:29:23.291	\N
cmrql0t0g001104lafnts83lp	cmrqkwrev000004jpjug6t8wd	cmpcsds4s000004jmgpwku1j2	t	2026-07-18 16:29:23.296	2026-07-18 16:29:23.296	2026-07-18 16:29:23.296	\N
cmrqlg0qk000j04l9nkd2vk9r	cmrqld3kq000p04jp208zp47h	cmpefcqj2000104ladlx0ysjz	t	2026-07-18 16:41:13.143	2026-07-18 16:41:13.148	2026-07-18 16:41:13.148	\N
cmrqlg0qw000k04l9l3q3xhbb	cmrqld3kq000p04jp208zp47h	cmpefd4zq000204la3jqyndzz	t	2026-07-18 16:41:13.159	2026-07-18 16:41:13.16	2026-07-18 16:41:13.16	\N
cmrqlg0r2000l04l9wo1xxchy	cmrqld3kq000p04jp208zp47h	cmpg41k59000004l7521hfcn4	t	2026-07-18 16:41:13.166	2026-07-18 16:41:13.166	2026-07-18 16:41:13.166	\N
cmrqlg0re000m04l9fmpqtmbl	cmrqld3kq000p04jp208zp47h	cmpfk8v2v000704jlp8siky9e	t	2026-07-18 16:41:13.177	2026-07-18 16:41:13.178	2026-07-18 16:41:13.178	\N
cmrqlg0rk000n04l9cggtaklw	cmrqld3kq000p04jp208zp47h	cmpcpimjz000004jpcdqgfhfx	t	2026-07-18 16:41:13.184	2026-07-18 16:41:13.184	2026-07-18 16:41:13.184	\N
cmrqlg0rq000o04l91rk29ysx	cmrqld3kq000p04jp208zp47h	cmph7s4ma000004l727k39xdv	t	2026-07-18 16:41:13.19	2026-07-18 16:41:13.19	2026-07-18 16:41:13.19	\N
cmrqlg0ry000p04l9n2laxhws	cmrqld3kq000p04jp208zp47h	cmpcsds4s000004jmgpwku1j2	t	2026-07-18 16:41:13.197	2026-07-18 16:41:13.198	2026-07-18 16:41:13.198	\N
cmrqls7qn000o04lahqqqu3k3	cmrqlng1w000004junomwb3sz	cmpefcd1z000004lasd2r1kdh	t	2026-07-18 16:50:42.094	2026-07-18 16:50:42.095	2026-07-18 16:50:42.095	\N
cmrqls7qr000p04ladcl3fnfw	cmrqlng1w000004junomwb3sz	cmpefcqj2000104ladlx0ysjz	t	2026-07-18 16:50:42.098	2026-07-18 16:50:42.099	2026-07-18 16:50:42.099	\N
cmrqls7qw000q04lafqmxrix3	cmrqlng1w000004junomwb3sz	cmpefd4zq000204la3jqyndzz	t	2026-07-18 16:50:42.103	2026-07-18 16:50:42.104	2026-07-18 16:50:42.104	\N
cmrqls7r0000r04la6c4nb3ty	cmrqlng1w000004junomwb3sz	cmpct2xp7000004jsv1ujpe1r	t	2026-07-18 16:50:42.108	2026-07-18 16:50:42.108	2026-07-18 16:50:42.108	\N
cmrqls7r4000s04ladxca4jqa	cmrqlng1w000004junomwb3sz	cmpcpgupa000004l5ehnc0kjs	t	2026-07-18 16:50:42.112	2026-07-18 16:50:42.112	2026-07-18 16:50:42.112	\N
cmrqls7r8000t04lawgk43sne	cmrqlng1w000004junomwb3sz	cmpcopzu6000004jro3prr7ca	t	2026-07-18 16:50:42.116	2026-07-18 16:50:42.116	2026-07-18 16:50:42.116	\N
cmrqls7rc000u04laoz9ny5mg	cmrqlng1w000004junomwb3sz	cmpcm7sgp000004l1fp9o52ky	t	2026-07-18 16:50:42.12	2026-07-18 16:50:42.12	2026-07-18 16:50:42.12	\N
cmrqls7rh000v04las6i9tj8g	cmrqlng1w000004junomwb3sz	cmpcpimjz000004jpcdqgfhfx	t	2026-07-18 16:50:42.124	2026-07-18 16:50:42.125	2026-07-18 16:50:42.125	\N
cmrqlg0s3000q04l9h29tppnh	cmrqld3kq000p04jp208zp47h	cmpct94t9000204jsxeeckk3m	t	2026-07-18 16:41:13.203	2026-07-18 16:41:13.203	2026-07-18 16:41:13.203	\N
cmrqlg0sc000r04l9vpgfj3se	cmrqld3kq000p04jp208zp47h	cmpefcd1z000004lasd2r1kdh	t	2026-07-18 16:41:13.212	2026-07-18 16:41:13.212	2026-07-18 16:41:13.212	\N
cmrqlg0si000s04l9ypwu9bw1	cmrqld3kq000p04jp208zp47h	cmpcpt3n6000004l561lm2ja7	t	2026-07-18 16:41:13.218	2026-07-18 16:41:13.218	2026-07-18 16:41:13.218	\N
cmrqlg0so000t04l9vfm3s2us	cmrqld3kq000p04jp208zp47h	cmpdz2mcq000104jr9xnhl4i0	t	2026-07-18 16:41:13.224	2026-07-18 16:41:13.224	2026-07-18 16:41:13.224	\N
cmrqlg0st000u04l99wm1dii0	cmrqld3kq000p04jp208zp47h	cmpcov8jd000004l8umh13pux	t	2026-07-18 16:41:13.229	2026-07-18 16:41:13.229	2026-07-18 16:41:13.229	\N
cmrqlg0t0000v04l92tao8my0	cmrqld3kq000p04jp208zp47h	cmpcsehq1000104ibueo8dlm5	t	2026-07-18 16:41:13.235	2026-07-18 16:41:13.236	2026-07-18 16:41:13.236	\N
cmrqlg0t5000w04l93b3g56hk	cmrqld3kq000p04jp208zp47h	cmpcpgupa000004l5ehnc0kjs	t	2026-07-18 16:41:13.241	2026-07-18 16:41:13.241	2026-07-18 16:41:13.241	\N
cmrqlg0tb000x04l9q8qukc4e	cmrqld3kq000p04jp208zp47h	cmpefdukz000404lanevrsp34	t	2026-07-18 16:41:13.247	2026-07-18 16:41:13.247	2026-07-18 16:41:13.247	\N
cmrqlg0tg000y04l93w2ci1yw	cmrqld3kq000p04jp208zp47h	cmpefdkyx000304la3k3nq9p9	t	2026-07-18 16:41:13.252	2026-07-18 16:41:13.252	2026-07-18 16:41:13.252	\N
cmrqlg0tm000z04l9xz4ht7su	cmrqld3kq000p04jp208zp47h	cmpcopzu6000004jro3prr7ca	t	2026-07-18 16:41:13.257	2026-07-18 16:41:13.258	2026-07-18 16:41:13.258	\N
cmrqlg0tr001004l9dskvl9wj	cmrqld3kq000p04jp208zp47h	cmpefep0o000504laynrqmhnw	t	2026-07-18 16:41:13.263	2026-07-18 16:41:13.263	2026-07-18 16:41:13.263	\N
cmrqlg0tw001104l97auemmvp	cmrqld3kq000p04jp208zp47h	cmpcm7sgp000004l1fp9o52ky	t	2026-07-18 16:41:13.268	2026-07-18 16:41:13.268	2026-07-18 16:41:13.268	\N
cmrqlpjsf000204l1m4u9pcln	cmrqlng1w000004junomwb3sz	cmpcov8jd000004l8umh13pux	t	2026-07-18 16:48:37.739	2026-07-18 16:48:37.743	2026-07-18 16:50:42.051	\N
cmrqls7rl000w04lajse3tnxs	cmrqlng1w000004junomwb3sz	cmpdz2mcq000104jr9xnhl4i0	t	2026-07-18 16:50:42.129	2026-07-18 16:50:42.129	2026-07-18 16:50:42.129	\N
cmrqls7rt000x04lavwcbdn4e	cmrqlng1w000004junomwb3sz	cmpcsehq1000104ibueo8dlm5	t	2026-07-18 16:50:42.137	2026-07-18 16:50:42.137	2026-07-18 16:50:42.137	\N
cmrru64yo000b04jyz69prq2k	cmqp5jh8b000004jp8k1q116l	cmpcm7sgp000004l1fp9o52ky	t	2026-07-19 13:33:14.629	2026-07-19 13:33:14.784	2026-07-19 13:33:14.784	\N
cmrru64z3000c04jy3szn1ae6	cmqp5jh8b000004jp8k1q116l	cmpn1o6et000004jrcnmw0gav	t	2026-07-19 13:33:14.629	2026-07-19 13:33:14.799	2026-07-19 13:33:14.799	\N
cmrru64z9000d04jy0ir8u1cb	cmqp5jh8b000004jp8k1q116l	cmpcopzu6000004jro3prr7ca	t	2026-07-19 13:33:14.629	2026-07-19 13:33:14.805	2026-07-19 13:33:14.805	\N
cmrru64ze000e04jyxe7rg0bq	cmqp5jh8b000004jp8k1q116l	cmpcpimjz000004jpcdqgfhfx	t	2026-07-19 13:33:14.629	2026-07-19 13:33:14.81	2026-07-19 13:33:14.81	\N
cmrru64zk000f04jyho9d62lf	cmqp5jh8b000004jp8k1q116l	cmpcsds4s000004jmgpwku1j2	t	2026-07-19 13:33:14.629	2026-07-19 13:33:14.816	2026-07-19 13:33:14.816	\N
cmrru64zq000g04jyf8mlgx7r	cmqp5jh8b000004jp8k1q116l	cmpdz2mcq000104jr9xnhl4i0	t	2026-07-19 13:33:14.629	2026-07-19 13:33:14.822	2026-07-19 13:33:14.822	\N
cmrru64zw000h04jyt1fam0a1	cmqp5jh8b000004jp8k1q116l	cmpefcqj2000104ladlx0ysjz	t	2026-07-19 13:33:14.629	2026-07-19 13:33:14.828	2026-07-19 13:33:14.828	\N
cmrru6502000i04jyvvox9tdw	cmqp5jh8b000004jp8k1q116l	cmpcoxez0000304l8g40zcfou	t	2026-07-19 13:33:14.629	2026-07-19 13:33:14.834	2026-07-19 13:33:14.834	\N
cmrru6508000j04jyvgy4vugw	cmqp5jh8b000004jp8k1q116l	cmrozuqv4000104l5tbza8qgy	t	2026-07-19 13:33:14.629	2026-07-19 13:33:14.84	2026-07-19 13:33:14.84	\N
cmrru650d000k04jyigyi65pk	cmqp5jh8b000004jp8k1q116l	cmpcqf47m000004l85vce0gfh	t	2026-07-19 13:33:14.629	2026-07-19 13:33:14.845	2026-07-19 13:33:14.845	\N
cms393794000f04l4fg3s6g5p	cms390n9w000t04jol6dfwp3s	cmpg41k59000004l7521hfcn4	t	2026-07-27 13:16:19.931	2026-07-27 13:16:19.96	2026-07-27 13:16:19.96	\N
cms39379y000g04l42zis04jj	cms390n9w000t04jol6dfwp3s	cmpfk8v2v000704jlp8siky9e	t	2026-07-27 13:16:19.989	2026-07-27 13:16:19.99	2026-07-27 13:16:19.99	\N
cms3937a5000h04l4p113x604	cms390n9w000t04jol6dfwp3s	cmpcpimjz000004jpcdqgfhfx	t	2026-07-27 13:16:19.996	2026-07-27 13:16:19.997	2026-07-27 13:16:19.997	\N
cms3937ab000i04l412t6qscj	cms390n9w000t04jol6dfwp3s	cmpcsds4s000004jmgpwku1j2	t	2026-07-27 13:16:20.002	2026-07-27 13:16:20.003	2026-07-27 13:16:20.003	\N
cmrwnilx2000004l83xl8tdbl	cmrkxlng5000004jofpanlfev	cmpcm7sgp000004l1fp9o52ky	t	2026-07-22 22:25:50.184	2026-07-22 22:25:50.198	2026-07-23 14:23:39.906	\N
cmrwnkwuv000004jorrza7olh	cmrkxlng5000004jofpanlfev	cmpcopzu6000004jro3prr7ca	t	2026-07-22 22:27:37.669	2026-07-22 22:27:37.687	2026-07-23 14:23:39.921	\N
cmrxllytg000r04l7mb36rbi7	cmrkxlng5000004jofpanlfev	cmpcqf47m000004l85vce0gfh	t	2026-07-23 14:20:13.828	2026-07-23 14:20:13.828	2026-07-23 14:23:39.927	\N
cmrxllyqq000f04l7mn7v5cxi	cmrkxlng5000004jofpanlfev	cmpcpimjz000004jpcdqgfhfx	t	2026-07-23 14:20:13.724	2026-07-23 14:20:13.73	2026-07-23 14:23:39.941	\N
cmrwo20f1000004js0axrt7bt	cmrkxlng5000004jofpanlfev	cmpefdkyx000304la3k3nq9p9	t	2026-07-22 22:40:55.443	2026-07-22 22:40:55.453	2026-07-23 14:23:39.947	\N
cmrxllyr4000g04l7h62l1mry	cmrkxlng5000004jofpanlfev	cmpefcqj2000104ladlx0ysjz	t	2026-07-23 14:20:13.743	2026-07-23 14:20:13.744	2026-07-23 14:23:39.969	\N
cmrwo87i7000204l7iffcvm9r	cmrkxlng5000004jofpanlfev	cmpefcd1z000004lasd2r1kdh	t	2026-07-22 22:45:44.575	2026-07-22 22:45:44.575	2026-07-23 14:23:39.975	\N
cmrwnpbeh000104l7rj2uiacz	cmrkxlng5000004jofpanlfev	cmpn1o6et000004jrcnmw0gav	t	2026-07-22 22:31:03.161	2026-07-22 22:31:03.161	2026-07-23 14:23:39.987	\N
cmrwnkego000004l7i6dmb5e2	cmrkxlng5000004jofpanlfev	cmpct94t9000204jsxeeckk3m	t	2026-07-22 22:27:13.838	2026-07-22 22:27:13.848	2026-07-23 14:23:39.992	\N
cmrxllys7000m04l72qtonps3	cmrkxlng5000004jofpanlfev	cmpdz2mcq000104jr9xnhl4i0	t	2026-07-23 14:20:13.783	2026-07-23 14:20:13.783	2026-07-23 14:23:39.999	\N
cmrwnwcz0000204l8457ztlyn	cmrkxlng5000004jofpanlfev	cmpcsds4s000004jmgpwku1j2	t	2026-07-22 22:36:31.788	2026-07-22 22:36:31.788	2026-07-23 14:23:40.004	\N
cmrwnkpsq000104l871ygxdoa	cmrkxlng5000004jofpanlfev	cmpfk8v2v000704jlp8siky9e	t	2026-07-22 22:27:28.538	2026-07-22 22:27:28.538	2026-07-23 14:23:40.009	\N
cmrxllysd000n04l7aml1z6xc	cmrkxlng5000004jofpanlfev	cmrozuqv4000104l5tbza8qgy	t	2026-07-23 14:20:13.789	2026-07-23 14:20:13.789	2026-07-23 14:23:40.014	\N
cmrxllyrn000j04l7wmkm96uo	cmrkxlng5000004jofpanlfev	cmpcpt3n6000004l561lm2ja7	t	2026-07-23 14:20:13.762	2026-07-23 14:20:13.763	2026-07-23 14:23:40.203	\N
cmrxllyry000l04l7u4ta11bx	cmrkxlng5000004jofpanlfev	cmpefep0o000504laynrqmhnw	t	2026-07-23 14:20:13.774	2026-07-23 14:20:13.774	2026-07-23 14:23:40.209	\N
cms3937ah000j04l4ohs75j9u	cms390n9w000t04jol6dfwp3s	cmpct94t9000204jsxeeckk3m	t	2026-07-27 13:16:20.008	2026-07-27 13:16:20.009	2026-07-27 13:16:20.009	\N
cms3937am000k04l4k6y6uy2t	cms390n9w000t04jol6dfwp3s	cmpdz3jpw000004jvdohsd2ri	t	2026-07-27 13:16:20.014	2026-07-27 13:16:20.014	2026-07-27 13:16:20.014	\N
cms3937at000l04l4jotvpx3v	cms390n9w000t04jol6dfwp3s	cmpefcd1z000004lasd2r1kdh	t	2026-07-27 13:16:20.02	2026-07-27 13:16:20.021	2026-07-27 13:16:20.021	\N
cms0pefhf000004jvjjr3dico	cmrthsbf6000004kybfhn32yj	cmpn1o6et000004jrcnmw0gav	t	2026-07-25 18:29:39.162	2026-07-25 18:29:39.171	2026-07-27 13:12:23.438	\N
cms0p7w7v000004l7igo9ccyn	cmrthsbf6000004kybfhn32yj	cmpcm7sgp000004l1fp9o52ky	t	2026-07-25 18:24:34.254	2026-07-25 18:24:34.268	2026-07-27 13:12:23.447	\N
cms0q6nh2000104l7nk463tns	cmrthsbf6000004kybfhn32yj	cmpefdkyx000304la3k3nq9p9	t	2026-07-25 18:51:35.894	2026-07-25 18:51:35.894	2026-07-27 13:12:23.452	\N
cms38vmrv000j04joy1i4dvx8	cmrthsbf6000004kybfhn32yj	cmpcqf47m000004l85vce0gfh	t	2026-07-27 13:10:26.826	2026-07-27 13:10:26.827	2026-07-27 13:12:23.458	\N
cms38vms2000k04jo403guk7h	cmrthsbf6000004kybfhn32yj	cmpcpt3n6000004l561lm2ja7	t	2026-07-27 13:10:26.834	2026-07-27 13:10:26.834	2026-07-27 13:12:23.464	\N
cms38vms7000l04joemxpk7mq	cmrthsbf6000004kybfhn32yj	cmpdz2mcq000104jr9xnhl4i0	t	2026-07-27 13:10:26.839	2026-07-27 13:10:26.839	2026-07-27 13:12:23.47	\N
cms0q66in000004l2hx443ad9	cmrthsbf6000004kybfhn32yj	cmph7t8a1000004l9n8uic25p	t	2026-07-25 18:51:13.901	2026-07-25 18:51:13.92	2026-07-27 13:12:23.475	\N
cms0q68j3000004l7ipxlc7f2	cmrthsbf6000004kybfhn32yj	cmpcpimjz000004jpcdqgfhfx	t	2026-07-25 18:51:16.518	2026-07-25 18:51:16.527	2026-07-27 13:12:23.481	\N
cms0pt5vo000004kzufsz9wd6	cmrthsbf6000004kybfhn32yj	cmpct94t9000204jsxeeckk3m	t	2026-07-25 18:41:06.552	2026-07-25 18:41:06.564	2026-07-27 13:12:23.487	\N
cms38vmsp000p04jo37of537u	cmrthsbf6000004kybfhn32yj	cmpefcqj2000104ladlx0ysjz	t	2026-07-27 13:10:26.857	2026-07-27 13:10:26.857	2026-07-27 13:12:23.492	\N
cms0pt6hr000004l6zi9amwu0	cmrthsbf6000004kybfhn32yj	cmpcopzu6000004jro3prr7ca	t	2026-07-25 18:41:07.348	2026-07-25 18:41:07.36	2026-07-27 13:12:23.499	\N
cms3937az000m04l43skzg9se	cms390n9w000t04jol6dfwp3s	cmpefcqj2000104ladlx0ysjz	t	2026-07-27 13:16:20.026	2026-07-27 13:16:20.027	2026-07-27 13:16:20.027	\N
cms3937b8000n04l4684wehes	cms390n9w000t04jol6dfwp3s	cmpcqf47m000004l85vce0gfh	t	2026-07-27 13:16:20.036	2026-07-27 13:16:20.036	2026-07-27 13:16:20.036	\N
cms3937be000o04l4zymfrl71	cms390n9w000t04jol6dfwp3s	cmpefd4zq000204la3jqyndzz	t	2026-07-27 13:16:20.041	2026-07-27 13:16:20.042	2026-07-27 13:16:20.042	\N
cms3937bj000p04l4k94r0oby	cms390n9w000t04jol6dfwp3s	cmpcsehq1000104ibueo8dlm5	t	2026-07-27 13:16:20.047	2026-07-27 13:16:20.047	2026-07-27 13:16:20.047	\N
cms3937bp000q04l4rqlwhsw7	cms390n9w000t04jol6dfwp3s	cmpcpgupa000004l5ehnc0kjs	t	2026-07-27 13:16:20.053	2026-07-27 13:16:20.053	2026-07-27 13:16:20.053	\N
cms3937bv000r04l450qgy7lp	cms390n9w000t04jol6dfwp3s	cmpefdkyx000304la3k3nq9p9	t	2026-07-27 13:16:20.059	2026-07-27 13:16:20.059	2026-07-27 13:16:20.059	\N
cms3937c1000s04l4wtummuzt	cms390n9w000t04jol6dfwp3s	cmpcopzu6000004jro3prr7ca	t	2026-07-27 13:16:20.065	2026-07-27 13:16:20.065	2026-07-27 13:16:20.065	\N
cms3937c8000t04l436m17yb3	cms390n9w000t04jol6dfwp3s	cmpcm7sgp000004l1fp9o52ky	t	2026-07-27 13:16:20.071	2026-07-27 13:16:20.072	2026-07-27 13:16:20.072	\N
cms6m50mu000004jo42krf40r	cms3d5vfv000004jxuwwehm57	cmpcm7sgp000004l1fp9o52ky	t	2026-07-29 21:44:58.218	2026-07-29 21:44:58.23	2026-07-30 02:43:01.192	\N
cms6wsb8l000i04ifqu9anjdw	cms3d5vfv000004jxuwwehm57	cmpdz2mcq000104jr9xnhl4i0	t	2026-07-30 02:43:01.221	2026-07-30 02:43:01.221	2026-07-30 02:43:01.221	\N
cms6o65ox000004l1nytoarz5	cms3d5vfv000004jxuwwehm57	cmpefdkyx000304la3k3nq9p9	t	2026-07-29 22:41:50.661	2026-07-29 22:41:50.673	2026-07-30 02:43:01.228	\N
cms6wsb8w000k04if9r7jt03q	cms3d5vfv000004jxuwwehm57	cmpefep0o000504laynrqmhnw	t	2026-07-30 02:43:01.232	2026-07-30 02:43:01.232	2026-07-30 02:43:01.232	\N
cms6nkd26000104l7jrstdpoe	cms3d5vfv000004jxuwwehm57	cmpdz3jpw000004jvdohsd2ri	t	2026-07-29 22:24:53.79	2026-07-29 22:24:53.79	2026-07-30 02:43:01.236	\N
cms6nk8n0000004l79izg7xgd	cms3d5vfv000004jxuwwehm57	cmph7t8a1000004l9n8uic25p	t	2026-07-29 22:24:48.051	2026-07-29 22:24:48.06	2026-07-30 02:43:01.241	\N
cms6mn9nz000004jr3cem40ee	cms3d5vfv000004jxuwwehm57	cmpcpt3n6000004l561lm2ja7	t	2026-07-29 21:59:09.73	2026-07-29 21:59:09.743	2026-07-30 02:43:01.244	\N
cms6wsb9b000o04ifnw8793xt	cms3d5vfv000004jxuwwehm57	cmpct2xp7000004jsv1ujpe1r	t	2026-07-30 02:43:01.247	2026-07-30 02:43:01.248	2026-07-30 02:43:01.248	\N
cms6wsb9g000p04ifgcjxk1vc	cms3d5vfv000004jxuwwehm57	cmrozuqv4000104l5tbza8qgy	t	2026-07-30 02:43:01.252	2026-07-30 02:43:01.252	2026-07-30 02:43:01.252	\N
cms6m1yhz000004kyyq4lvync	cms3d5vfv000004jxuwwehm57	cmpcqf47m000004l85vce0gfh	t	2026-07-29 21:42:35.484	2026-07-29 21:42:35.495	2026-07-30 02:43:01.256	\N
cms6mhkzn000104l5w926at04	cms3d5vfv000004jxuwwehm57	cmpcov8jd000004l8umh13pux	t	2026-07-29 21:54:44.483	2026-07-29 21:54:44.483	2026-07-30 02:43:01.259	\N
cms6mp58c000204l581hsbrj2	cms3d5vfv000004jxuwwehm57	cmpefcd1z000004lasd2r1kdh	t	2026-07-29 22:00:37.307	2026-07-29 22:00:37.308	2026-07-30 02:43:01.262	\N
cms6mu5ou000104jrpexzid2w	cms3d5vfv000004jxuwwehm57	cmpct94t9000204jsxeeckk3m	t	2026-07-29 22:04:31.182	2026-07-29 22:04:31.182	2026-07-30 02:43:01.266	\N
cms6nh1dn000004l7iszpdg1k	cms3d5vfv000004jxuwwehm57	cmpefcqj2000104ladlx0ysjz	t	2026-07-29 22:22:18.674	2026-07-29 22:22:18.683	2026-07-30 02:43:01.269	\N
cms6llwew000004jra1okvdkl	cms3d5vfv000004jxuwwehm57	cmpn1o6et000004jrcnmw0gav	t	2026-07-29 21:30:06.288	2026-07-29 21:30:06.296	2026-07-30 02:43:01.273	\N
cms6nkovl000104l77g9402tz	cms3d5vfv000004jxuwwehm57	cmpcpimjz000004jpcdqgfhfx	t	2026-07-29 22:25:09.104	2026-07-29 22:25:09.105	2026-07-30 02:43:01.276	\N
cms6mgue4000004l5nd7cp0zw	cms3d5vfv000004jxuwwehm57	cmpcopzu6000004jro3prr7ca	t	2026-07-29 21:54:09.999	2026-07-29 21:54:10.012	2026-07-30 02:43:01.28	\N
cms9jak0f000104l4g8ryv42i	cmrpgk0qh000004jttg2q1s11	cmpefcd1z000004lasd2r1kdh	t	2026-07-31 22:48:36.303	2026-07-31 22:48:36.304	2026-08-01 00:51:54.046	\N
cms9jy1ph000004ky5djw10zy	cmrpgk0qh000004jttg2q1s11	cmpcqf47m000004l85vce0gfh	t	2026-07-31 23:06:52.308	2026-07-31 23:06:52.325	2026-08-01 00:51:54.068	\N
cms9ipqpo000004jvqvgyuj1o	cmrpgk0qh000004jttg2q1s11	cmpcm7sgp000004l1fp9o52ky	t	2026-07-31 22:32:25.18	2026-07-31 22:32:25.212	2026-08-01 00:51:54.073	\N
cms9ja7i9000004ktq3y4quno	cmrpgk0qh000004jttg2q1s11	cmpcoxez0000304l8g40zcfou	t	2026-07-31 22:48:20.087	2026-07-31 22:48:20.097	2026-08-01 00:51:54.079	\N
cms9ja0oh000004ky3untht0u	cmrpgk0qh000004jttg2q1s11	cmpcopzu6000004jro3prr7ca	t	2026-07-31 22:48:11.229	2026-07-31 22:48:11.249	2026-08-01 00:51:54.085	\N
cms9i0twn000004jrjz2bkyu2	cmrpgk0qh000004jttg2q1s11	cmpcsehq1000104ibueo8dlm5	t	2026-07-31 22:13:02.914	2026-07-31 22:13:02.951	2026-08-01 00:51:54.09	\N
cms9i0u24000004l4kniy2k9a	cmrpgk0qh000004jttg2q1s11	cmpcpt3n6000004l561lm2ja7	t	2026-07-31 22:13:03.113	2026-07-31 22:13:03.148	2026-08-01 00:51:54.095	\N
cms9j0y8w000004l4t7dc6uod	cmrpgk0qh000004jttg2q1s11	cmpefcqj2000104ladlx0ysjz	t	2026-07-31 22:41:08.181	2026-07-31 22:41:08.192	2026-08-01 00:51:54.101	\N
cms9igvx1000004l492bhngg5	cmrpgk0qh000004jttg2q1s11	cmpn1o6et000004jrcnmw0gav	t	2026-07-31 22:25:32.022	2026-07-31 22:25:32.053	2026-08-01 00:51:54.106	\N
cms9i6uw8000004jwbft3rfqb	cmrpgk0qh000004jttg2q1s11	cmpcpimjz000004jpcdqgfhfx	t	2026-07-31 22:17:44.156	2026-07-31 22:17:44.168	2026-08-01 00:51:54.112	\N
cms9j43qg000104l43na20ee3	cmrpgk0qh000004jttg2q1s11	cmpefdkyx000304la3k3nq9p9	t	2026-07-31 22:43:35.272	2026-07-31 22:43:35.272	2026-08-01 00:51:54.117	\N
cmsd9jgr8001d04l8crggrio5	cmsadtjr8000004joiy5e4pc7	cmpcopzu6000004jro3prr7ca	t	2026-08-03 13:26:40.5	2026-08-03 13:26:40.532	2026-08-06 14:52:34.857	\N
cmsd9jgse001e04l8v5a192en	cmsadtjr8000004joiy5e4pc7	cmpcpimjz000004jpcdqgfhfx	t	2026-08-03 13:26:40.573	2026-08-03 13:26:40.574	2026-08-06 14:52:34.867	\N
cmsd9jgsl001f04l83ij4hdmi	cmsadtjr8000004joiy5e4pc7	cmpefcqj2000104ladlx0ysjz	t	2026-08-03 13:26:40.579	2026-08-03 13:26:40.581	2026-08-06 14:52:34.873	\N
cmsd9jgsu001g04l876pqjwyf	cmsadtjr8000004joiy5e4pc7	cmpcpt3n6000004l561lm2ja7	t	2026-08-03 13:26:40.586	2026-08-03 13:26:40.59	2026-08-06 14:52:34.887	\N
cmsd9jgt0001h04l8niaws03h	cmsadtjr8000004joiy5e4pc7	cmpcsehq1000104ibueo8dlm5	t	2026-08-03 13:26:40.596	2026-08-03 13:26:40.596	2026-08-06 14:52:34.893	\N
cmsd9jgt6001i04l8zac5y2yr	cmsadtjr8000004joiy5e4pc7	cmpcm7sgp000004l1fp9o52ky	t	2026-08-03 13:26:40.601	2026-08-03 13:26:40.602	2026-08-06 14:52:34.907	\N
cmsd9jgtb001j04l8fb4gv244	cmsadtjr8000004joiy5e4pc7	cmpefcd1z000004lasd2r1kdh	t	2026-08-03 13:26:40.606	2026-08-03 13:26:40.607	2026-08-06 14:52:34.913	\N
cmsd9jgtf001k04l8pld22zf8	cmsadtjr8000004joiy5e4pc7	cmpct2xp7000004jsv1ujpe1r	t	2026-08-03 13:26:40.611	2026-08-03 13:26:40.611	2026-08-06 14:52:34.931	\N
cmsd9jgtk001l04l8h3bl0zv7	cmsadtjr8000004joiy5e4pc7	cmpdz3jpw000004jvdohsd2ri	t	2026-08-03 13:26:40.616	2026-08-03 13:26:40.616	2026-08-06 14:52:34.937	\N
cmsd9jgtp001m04l83r1is6nr	cmsadtjr8000004joiy5e4pc7	cmpct94t9000204jsxeeckk3m	t	2026-08-03 13:26:40.62	2026-08-03 13:26:40.621	2026-08-06 14:52:34.95	\N
cmsd9jgtt001n04l8tz906ioa	cmsadtjr8000004joiy5e4pc7	cmpefep0o000504laynrqmhnw	t	2026-08-03 13:26:40.625	2026-08-03 13:26:40.625	2026-08-06 14:52:34.956	\N
cmsd9jgty001o04l8jhj4sss0	cmsadtjr8000004joiy5e4pc7	cmpn1o6et000004jrcnmw0gav	t	2026-08-03 13:26:40.63	2026-08-03 13:26:40.631	2026-08-06 14:52:34.962	\N
cmsd9jgu3001p04l8vjpwviue	cmsadtjr8000004joiy5e4pc7	cmpfk8v2v000704jlp8siky9e	t	2026-08-03 13:26:40.635	2026-08-03 13:26:40.635	2026-08-06 14:52:34.969	\N
cmsd9jgu8001q04l874k2yt9t	cmsadtjr8000004joiy5e4pc7	cmpcsds4s000004jmgpwku1j2	t	2026-08-03 13:26:40.64	2026-08-03 13:26:40.64	2026-08-06 14:52:34.975	\N
cmsd9jgud001r04l8roic8nhy	cmsadtjr8000004joiy5e4pc7	cmpdz2mcq000104jr9xnhl4i0	t	2026-08-03 13:26:40.644	2026-08-03 13:26:40.645	2026-08-06 14:52:34.981	\N
cmsd9jguh001s04l8nyhvhp7w	cmsadtjr8000004joiy5e4pc7	cmsd6v73x000004jupd8tbvon	t	2026-08-03 13:26:40.649	2026-08-03 13:26:40.649	2026-08-06 14:52:34.987	\N
cmskqaobh000004layjuyrdlw	cmpg3u3kh000l04la6hj2e5r3	cmpefdkyx000304la3k3nq9p9	t	2026-08-08 18:50:07.099	2026-08-08 18:50:07.133	2026-08-08 20:49:31.889	\N
cmskuk8ox000i04i8cqc5dvnp	cmpg3u3kh000l04la6hj2e5r3	cmpcm7sgp000004l1fp9o52ky	t	2026-08-08 20:49:31.761	2026-08-08 20:49:31.906	2026-08-08 20:49:31.906	\N
cmskuk8p7000j04i8d6qn9kxs	cmpg3u3kh000l04la6hj2e5r3	cmpdz3jpw000004jvdohsd2ri	t	2026-08-08 20:49:31.761	2026-08-08 20:49:31.915	2026-08-08 20:49:31.915	\N
cmskuk8ph000k04i8zv48fwvk	cmpg3u3kh000l04la6hj2e5r3	cmpefep0o000504laynrqmhnw	t	2026-08-08 20:49:31.761	2026-08-08 20:49:31.925	2026-08-08 20:49:31.925	\N
cmskpyzmw000004l7cc0jq1z2	cmpg3u3kh000l04la6hj2e5r3	cmpefcd1z000004lasd2r1kdh	t	2026-08-08 18:41:01.897	2026-08-08 18:41:01.929	2026-08-08 20:49:31.932	\N
cmskqnvel000004job22yefco	cmpg3u3kh000l04la6hj2e5r3	cmpcpimjz000004jpcdqgfhfx	t	2026-08-08 19:00:22.823	2026-08-08 19:00:22.845	2026-08-08 20:49:31.938	\N
cmskpznez000004jq6cgfxln1	cmpg3u3kh000l04la6hj2e5r3	cmpcsehq1000104ibueo8dlm5	t	2026-08-08 18:41:32.737	2026-08-08 18:41:32.747	2026-08-08 20:49:31.945	\N
cmskuk8q7000o04i80esxmpz4	cmpg3u3kh000l04la6hj2e5r3	cmpdz2mcq000104jr9xnhl4i0	t	2026-08-08 20:49:31.761	2026-08-08 20:49:31.951	2026-08-08 20:49:31.951	\N
cmskr2ufb000204kz2zfwqdjf	cmpg3u3kh000l04la6hj2e5r3	cmpct94t9000204jsxeeckk3m	t	2026-08-08 19:12:01.413	2026-08-08 19:12:01.415	2026-08-08 20:49:31.965	\N
cmskuk8qr000q04i8axp65sl6	cmpg3u3kh000l04la6hj2e5r3	cmpefcqj2000104ladlx0ysjz	t	2026-08-08 20:49:31.761	2026-08-08 20:49:31.971	2026-08-08 20:49:31.971	\N
cmskuk8r6000r04i8m1h6maxv	cmpg3u3kh000l04la6hj2e5r3	cmpct2xp7000004jsv1ujpe1r	t	2026-08-08 20:49:31.761	2026-08-08 20:49:31.986	2026-08-08 20:49:31.986	\N
cmskuk8rd000s04i85v1fgryw	cmpg3u3kh000l04la6hj2e5r3	cmpn1o6et000004jrcnmw0gav	t	2026-08-08 20:49:31.761	2026-08-08 20:49:31.993	2026-08-08 20:49:31.993	\N
cmskuk8ri000t04i8mfoerwf6	cmpg3u3kh000l04la6hj2e5r3	cmrozuqv4000104l5tbza8qgy	t	2026-08-08 20:49:31.761	2026-08-08 20:49:31.998	2026-08-08 20:49:31.998	\N
cmskpx95n000204jvxpbl0ht5	cmpg3u3kh000l04la6hj2e5r3	cmpcoxez0000304l8g40zcfou	t	2026-08-08 18:39:40.954	2026-08-08 18:39:40.955	2026-08-08 20:49:32.004	\N
cmskpz40k000004l90mqr36gr	cmpg3u3kh000l04la6hj2e5r3	cmpcpt3n6000004l561lm2ja7	t	2026-08-08 18:41:07.583	2026-08-08 18:41:07.604	2026-08-08 20:49:32.01	\N
cmskr2adr000104jq9lqwkhed	cmpg3u3kh000l04la6hj2e5r3	cmsd6v73x000004jupd8tbvon	t	2026-08-08 19:11:35.438	2026-08-08 19:11:35.439	2026-08-08 20:49:32.015	\N
cmskr1f0q000304jvviay7x6c	cmpg3u3kh000l04la6hj2e5r3	cmpcsds4s000004jmgpwku1j2	t	2026-08-08 19:10:54.794	2026-08-08 19:10:54.794	2026-08-08 20:49:32.02	\N
cmt5xm17n000b04i5qz7a88jv	cmsx2wppc000004ldfwf8elsy	cmpfk8v2v000704jlp8siky9e	t	2026-08-23 14:58:04.058	2026-08-23 14:58:04.067	2026-08-23 14:58:04.067	\N
cmt5xm17w000c04i59dq1h0om	cmsx2wppc000004ldfwf8elsy	cmpefdkyx000304la3k3nq9p9	t	2026-08-23 14:58:04.076	2026-08-23 14:58:04.076	2026-08-23 14:58:04.076	\N
cmt5xm180000d04i5r2ror5es	cmsx2wppc000004ldfwf8elsy	cmpcqf47m000004l85vce0gfh	t	2026-08-23 14:58:04.08	2026-08-23 14:58:04.08	2026-08-23 14:58:04.08	\N
cmss81z8k000o04ldk5y554tl	cmsnjw3d4000004l73omej79w	cmpefcqj2000104ladlx0ysjz	t	2026-08-14 00:41:37.431	2026-08-14 00:41:37.7	2026-08-15 14:21:24.011	\N
cmss3ns1d000304ldk24fho6y	cmsnjw3d4000004l73omej79w	cmpfk8v2v000704jlp8siky9e	t	2026-08-13 22:38:36.72	2026-08-13 22:38:36.721	2026-08-15 14:21:24.029	\N
cmss30tqm000004l7cw9kxihe	cmsnjw3d4000004l73omej79w	cmpn1o6et000004jrcnmw0gav	t	2026-08-13 22:20:45.803	2026-08-13 22:20:45.838	2026-08-15 14:21:24.032	\N
cmss3fixp000104ldoi3b5dl3	cmsnjw3d4000004l73omej79w	cmpcoxez0000304l8g40zcfou	t	2026-08-13 22:32:11.677	2026-08-13 22:32:11.677	2026-08-15 14:21:24.049	\N
cmss47mgl000004jug6pet589	cmsnjw3d4000004l73omej79w	cmpefdkyx000304la3k3nq9p9	t	2026-08-13 22:54:02.59	2026-08-13 22:54:02.614	2026-08-15 14:21:24.053	\N
cmss2pdcy000004ldvz5976xz	cmsnjw3d4000004l73omej79w	cmpcpimjz000004jpcdqgfhfx	t	2026-08-13 22:11:51.383	2026-08-13 22:11:51.394	2026-08-15 14:21:24.055	\N
cmss3lkgf000204ld75e9swqd	cmsnjw3d4000004l73omej79w	cmpcsds4s000004jmgpwku1j2	t	2026-08-13 22:36:53.582	2026-08-13 22:36:53.583	2026-08-15 14:21:24.057	\N
cmss3ayb4000104l7h19aqtpx	cmsnjw3d4000004l73omej79w	cmpcsehq1000104ibueo8dlm5	t	2026-08-13 22:28:38.319	2026-08-13 22:28:38.32	2026-08-15 14:21:24.059	\N
cmss3lh2t000104jrvzh70xld	cmsnjw3d4000004l73omej79w	cmpcov8jd000004l8umh13pux	t	2026-08-13 22:36:49.205	2026-08-13 22:36:49.205	2026-08-15 14:21:24.061	\N
cmss81z99000s04ldvu9lw1m9	cmsnjw3d4000004l73omej79w	cmsd6v73x000004jupd8tbvon	t	2026-08-14 00:41:37.431	2026-08-14 00:41:37.725	2026-08-15 14:21:24.063	\N
cmss380y6000104ldkstghfkx	cmsnjw3d4000004l73omej79w	cmpcpt3n6000004l561lm2ja7	t	2026-08-13 22:26:21.774	2026-08-13 22:26:21.774	2026-08-15 14:21:24.065	\N
cmss81z9j000u04ldar28gwuy	cmsnjw3d4000004l73omej79w	cmpcqf47m000004l85vce0gfh	t	2026-08-14 00:41:37.431	2026-08-14 00:41:37.735	2026-08-15 14:21:24.067	\N
cmss2ywma000004ldocp9cxoc	cmsnjw3d4000004l73omej79w	cmpcm7sgp000004l1fp9o52ky	t	2026-08-13 22:19:16.236	2026-08-13 22:19:16.258	2026-08-15 14:21:24.068	\N
cmss81z8q000p04ldm9ytbap5	cmsnjw3d4000004l73omej79w	cmpcopzu6000004jro3prr7ca	t	2026-08-14 00:41:37.431	2026-08-14 00:41:37.706	2026-08-15 14:21:24.07	\N
cmss81za8000z04ldvh6bfz0q	cmsnjw3d4000004l73omej79w	cmpdz3jpw000004jvdohsd2ri	t	2026-08-14 00:41:37.431	2026-08-14 00:41:37.76	2026-08-15 14:21:24.072	\N
cmss81z7a000k04ldebw87etn	cmsnjw3d4000004l73omej79w	cmpefep0o000504laynrqmhnw	t	2026-08-14 00:41:37.431	2026-08-14 00:41:37.654	2026-08-15 14:21:24.074	\N
cmss3g4na000004jrcf0k814j	cmsnjw3d4000004l73omej79w	cmpefcd1z000004lasd2r1kdh	t	2026-08-13 22:32:39.803	2026-08-13 22:32:39.814	2026-08-15 14:21:24.076	\N
cmt5xm184000e04i5naxpq4r0	cmsx2wppc000004ldfwf8elsy	cmpcov8jd000004l8umh13pux	t	2026-08-23 14:58:04.084	2026-08-23 14:58:04.084	2026-08-23 14:58:04.084	\N
cmt5xm18a000f04i5muplq68b	cmsx2wppc000004ldfwf8elsy	cmpcsds4s000004jmgpwku1j2	t	2026-08-23 14:58:04.09	2026-08-23 14:58:04.09	2026-08-23 14:58:04.09	\N
cmt5xm18e000g04i5bty2su3e	cmsx2wppc000004ldfwf8elsy	cmpdz2mcq000104jr9xnhl4i0	t	2026-08-23 14:58:04.093	2026-08-23 14:58:04.094	2026-08-23 14:58:04.094	\N
cmt5xm18j000h04i5otwikib4	cmsx2wppc000004ldfwf8elsy	cmpefcd1z000004lasd2r1kdh	t	2026-08-23 14:58:04.098	2026-08-23 14:58:04.099	2026-08-23 14:58:04.099	\N
cmsweu8wl000i04junpmwl3ix	cmsd9fo2a000004l80caeqs67	cmrozuqv4000104l5tbza8qgy	t	2026-08-16 23:02:38.993	2026-08-16 23:02:38.997	2026-08-17 12:42:10.659	\N
cmsw9q5ov000104jlhf72jc5u	cmsd9fo2a000004l80caeqs67	cmpn1o6et000004jrcnmw0gav	t	2026-08-16 20:39:30.126	2026-08-16 20:39:30.127	2026-08-17 12:42:10.666	\N
cmsweu8x0000k04juzv723soc	cmsd9fo2a000004l80caeqs67	cmpct2xp7000004jsv1ujpe1r	t	2026-08-16 23:02:39.012	2026-08-16 23:02:39.012	2026-08-17 12:42:10.671	\N
cmsw9o6pi000004kzrnnk6uae	cmsd9fo2a000004l80caeqs67	cmpcoxez0000304l8g40zcfou	t	2026-08-16 20:37:58.125	2026-08-16 20:37:58.135	2026-08-17 12:42:10.68	\N
cmsw9oeyi000004jl8sk2z29n	cmsd9fo2a000004l80caeqs67	cmpefdkyx000304la3k3nq9p9	t	2026-08-16 20:38:08.816	2026-08-16 20:38:08.826	2026-08-17 12:42:10.685	\N
cmsw9oqld000104kzd7f7nwnz	cmsd9fo2a000004l80caeqs67	cmpcpimjz000004jpcdqgfhfx	t	2026-08-16 20:38:23.905	2026-08-16 20:38:23.905	2026-08-17 12:42:10.693	\N
cmsw9oici000004l41wduxhkz	cmsd9fo2a000004l80caeqs67	cmpcsds4s000004jmgpwku1j2	t	2026-08-16 20:38:13.21	2026-08-16 20:38:13.218	2026-08-17 12:42:10.698	\N
cmsweu8xn000p04jue8027h2v	cmsd9fo2a000004l80caeqs67	cmpcov8jd000004l8umh13pux	t	2026-08-16 23:02:39.035	2026-08-16 23:02:39.035	2026-08-17 12:42:10.704	\N
cmsweu8xq000q04jurui6nmlz	cmsd9fo2a000004l80caeqs67	cmsd6v73x000004jupd8tbvon	t	2026-08-16 23:02:39.038	2026-08-16 23:02:39.038	2026-08-17 12:42:10.711	\N
cmsw9p5km000204l49rqpzsd1	cmsd9fo2a000004l80caeqs67	cmpcpt3n6000004l561lm2ja7	t	2026-08-16 20:38:43.318	2026-08-16 20:38:43.318	2026-08-17 12:42:10.72	\N
cmsweu8xv000s04juund3gykl	cmsd9fo2a000004l80caeqs67	cmpefcqj2000104ladlx0ysjz	t	2026-08-16 23:02:39.043	2026-08-16 23:02:39.043	2026-08-17 12:42:10.725	\N
cmsweu8y4000t04jua2zmp6c5	cmsd9fo2a000004l80caeqs67	cmpcm7sgp000004l1fp9o52ky	t	2026-08-16 23:02:39.052	2026-08-16 23:02:39.052	2026-08-17 12:42:10.731	\N
cmsweu8y8000u04ju18l7ja4m	cmsd9fo2a000004l80caeqs67	cmpcopzu6000004jro3prr7ca	t	2026-08-16 23:02:39.056	2026-08-16 23:02:39.056	2026-08-17 12:42:10.737	\N
cmsweu8yb000v04juy083nti7	cmsd9fo2a000004l80caeqs67	cmpefep0o000504laynrqmhnw	t	2026-08-16 23:02:39.058	2026-08-16 23:02:39.059	2026-08-17 12:42:10.742	\N
cmsw9oycx000104l4esnfr5xk	cmsd9fo2a000004l80caeqs67	cmpefcd1z000004lasd2r1kdh	t	2026-08-16 20:38:33.969	2026-08-16 20:38:33.969	2026-08-17 12:42:10.748	\N
cmsweu8yg000x04ju5gcubel8	cmsd9fo2a000004l80caeqs67	cmpdz2mcq000104jr9xnhl4i0	t	2026-08-16 23:02:39.064	2026-08-16 23:02:39.064	2026-08-17 12:42:10.753	\N
cmsweu8yo000y04ju5dz9gq49	cmsd9fo2a000004l80caeqs67	cmst61960000104jvfkkcgzp4	t	2026-08-16 23:02:39.072	2026-08-16 23:02:39.072	2026-08-17 12:42:10.758	\N
cmt5xm18m000i04i5jijp1jwb	cmsx2wppc000004ldfwf8elsy	cmpcm7sgp000004l1fp9o52ky	t	2026-08-23 14:58:04.102	2026-08-23 14:58:04.102	2026-08-23 14:58:04.102	\N
cmt5xm18q000j04i5xsixlr6q	cmsx2wppc000004ldfwf8elsy	cmpcpimjz000004jpcdqgfhfx	t	2026-08-23 14:58:04.106	2026-08-23 14:58:04.106	2026-08-23 14:58:04.106	\N
cmt5xm18u000k04i5pm14hnds	cmsx2wppc000004ldfwf8elsy	cmpefcqj2000104ladlx0ysjz	t	2026-08-23 14:58:04.11	2026-08-23 14:58:04.11	2026-08-23 14:58:04.11	\N
cmt6fj1fd000p04jqdh1zvzky	cmt0aw2dv000004jyn5mtmejp	cmpn1o6et000004jrcnmw0gav	t	2026-08-23 23:19:37.456	2026-08-23 23:19:37.465	2026-08-25 14:24:51.788	\N
cmt6fj1fl000q04jqdwwcef62	cmt0aw2dv000004jyn5mtmejp	cmsd6v73x000004jupd8tbvon	t	2026-08-23 23:19:37.473	2026-08-23 23:19:37.473	2026-08-25 14:24:51.791	\N
cmt6fj1fo000r04jqvjk8lvzv	cmt0aw2dv000004jyn5mtmejp	cmpct2xp7000004jsv1ujpe1r	t	2026-08-23 23:19:37.475	2026-08-23 23:19:37.476	2026-08-25 14:24:51.805	\N
cmt6fj1fw000s04jq5c5b2oqj	cmt0aw2dv000004jyn5mtmejp	cmpcm7sgp000004l1fp9o52ky	t	2026-08-23 23:19:37.484	2026-08-23 23:19:37.484	2026-08-25 14:24:51.809	\N
cmt6fj1fz000t04jq4o1dihby	cmt0aw2dv000004jyn5mtmejp	cmpdz2mcq000104jr9xnhl4i0	t	2026-08-23 23:19:37.487	2026-08-23 23:19:37.487	2026-08-25 14:24:51.812	\N
cmt6fj1g1000u04jq11lrlk6a	cmt0aw2dv000004jyn5mtmejp	cmpcsds4s000004jmgpwku1j2	t	2026-08-23 23:19:37.489	2026-08-23 23:19:37.489	2026-08-25 14:24:51.815	\N
cmt6fj1g4000v04jqvyn867rh	cmt0aw2dv000004jyn5mtmejp	cmst61960000104jvfkkcgzp4	t	2026-08-23 23:19:37.492	2026-08-23 23:19:37.492	2026-08-25 14:24:51.825	\N
cmt6fj1g6000w04jqmhew2ba7	cmt0aw2dv000004jyn5mtmejp	cmpefep0o000504laynrqmhnw	t	2026-08-23 23:19:37.493	2026-08-23 23:19:37.494	2026-08-25 14:24:51.829	\N
cmt6fj1g8000x04jqby33sl45	cmt0aw2dv000004jyn5mtmejp	cmpcpimjz000004jpcdqgfhfx	t	2026-08-23 23:19:37.496	2026-08-23 23:19:37.496	2026-08-25 14:24:52.04	\N
cmt6a34le000004ib7tk8kx6y	cmt0aw2dv000004jyn5mtmejp	cmpcoxez0000304l8g40zcfou	t	2026-08-23 20:47:16.984	2026-08-23 20:47:16.994	2026-08-25 14:24:52.043	\N
cmt6fj1gc000z04jqupporomt	cmt0aw2dv000004jyn5mtmejp	cmpcopzu6000004jro3prr7ca	t	2026-08-23 23:19:37.499	2026-08-23 23:19:37.504	2026-08-25 14:24:52.046	\N
cmt6fj1gi001004jqk7avcm0e	cmt0aw2dv000004jyn5mtmejp	cmpefcd1z000004lasd2r1kdh	t	2026-08-23 23:19:37.506	2026-08-23 23:19:37.506	2026-08-25 14:24:52.049	\N
cmt6fj1gk001104jqvyot93y6	cmt0aw2dv000004jyn5mtmejp	cmpcov8jd000004l8umh13pux	t	2026-08-23 23:19:37.508	2026-08-23 23:19:37.508	2026-08-25 14:24:52.052	\N
cmt6fj1gm001204jqmlhpceyv	cmt0aw2dv000004jyn5mtmejp	cmpdz3jpw000004jvdohsd2ri	t	2026-08-23 23:19:37.51	2026-08-23 23:19:37.51	2026-08-25 14:24:52.055	\N
cmt6fj1go001304jq5fyouj6p	cmt0aw2dv000004jyn5mtmejp	cmpefcqj2000104ladlx0ysjz	t	2026-08-23 23:19:37.512	2026-08-23 23:19:37.512	2026-08-25 14:24:52.057	\N
cmt6fj1gr001404jqiazeljp7	cmt0aw2dv000004jyn5mtmejp	cmpct94t9000204jsxeeckk3m	t	2026-08-23 23:19:37.514	2026-08-23 23:19:37.515	2026-08-25 14:24:52.06	\N
cmt6fj1gt001504jq8w68b5bu	cmt0aw2dv000004jyn5mtmejp	cmpcqf47m000004l85vce0gfh	t	2026-08-23 23:19:37.516	2026-08-23 23:19:37.517	2026-08-25 14:24:52.063	\N
cmt6fj1gv001604jqd7m6479t	cmt0aw2dv000004jyn5mtmejp	cmpfk8v2v000704jlp8siky9e	t	2026-08-23 23:19:37.519	2026-08-23 23:19:37.519	2026-08-25 14:24:52.065	\N
cmtao2h6t000004jp0qh9kfol	cmskhxpbb000004jq77wb6pqt	cmpn1o6et000004jrcnmw0gav	t	2026-08-26 22:29:45.961	2026-08-26 22:29:45.989	2026-08-26 22:29:45.989	\N
cmtaowbe3000004k3cf3hn3oj	cmskhxpbb000004jq77wb6pqt	cmpcsds4s000004jmgpwku1j2	t	2026-08-26 22:52:58.14	2026-08-26 22:52:58.155	2026-08-26 22:52:58.155	\N
cmtap56b1000104k3zuzz094n	cmskhxpbb000004jq77wb6pqt	cmpefdkyx000304la3k3nq9p9	t	2026-08-26 22:59:51.469	2026-08-26 22:59:51.469	2026-08-26 22:59:51.469	\N
\.
COPY public.match_checklist_items (id, "matchId", label, "isChecked", "sortOrder", "createdAt", "updatedAt") FROM stdin;
8b3b919c-0933-4136-8d8b-0d3de40d0873	cmpr23ivg000204icrms1915w	Uniforme confirmado	t	0	2026-06-01 11:09:03.511	2026-06-01 11:09:03.511
e4992979-4419-4370-a18d-e2c12947de6a	cmpr23ivg000204icrms1915w	Bola disponivel	t	1	2026-06-01 11:09:03.511	2026-06-01 11:09:03.511
7925b9b1-3e38-4940-a274-b855a49fa442	cmpr23ivg000204icrms1915w	Coletes disponiveis	f	2	2026-06-01 11:09:03.511	2026-06-01 11:09:03.511
add2a439-6c8f-4527-9af8-8f58edd933e6	cmpr23ivg000204icrms1915w	Campo confirmado	t	3	2026-06-01 11:09:03.511	2026-06-01 11:09:03.511
a284c19e-d1d6-4b72-8f0d-9b85ee45b30e	cmpr23ivg000204icrms1915w	Arbitragem confirmada	t	4	2026-06-01 11:09:03.511	2026-06-01 11:09:03.511
57ab95eb-e59d-456c-8171-798a31ea4bdc	cmpr23ivg000204icrms1915w	Adversario confirmado	t	5	2026-06-01 11:09:03.511	2026-06-01 11:09:03.511
2fb93587-ce27-49cb-86af-ce2328144fae	cmpg3k0ot000004l5zes9kdtc	Uniforme confirmado	f	0	2026-06-06 18:49:38.857	2026-06-06 18:49:38.857
2f3530f3-8adf-4b6e-b67d-3745386b06f6	cmpg3k0ot000004l5zes9kdtc	Bola disponivel	f	1	2026-06-06 18:49:38.857	2026-06-06 18:49:38.857
9015dd99-f2b1-4d9f-b036-63791c3a6838	cmpg3k0ot000004l5zes9kdtc	Coletes disponiveis	f	2	2026-06-06 18:49:38.857	2026-06-06 18:49:38.857
ddb819eb-c572-469a-9883-03f4d072e5f2	cmpg3k0ot000004l5zes9kdtc	Campo confirmado	t	3	2026-06-06 18:49:38.857	2026-06-06 18:49:38.857
83da0b13-e6a4-411f-ae91-a00a2509238e	cmpg3k0ot000004l5zes9kdtc	Arbitragem confirmada	t	4	2026-06-06 18:49:38.857	2026-06-06 18:49:38.857
68bf376b-2b77-4348-a6a5-a7cfe613a58c	cmpg3k0ot000004l5zes9kdtc	Adversario confirmado	t	5	2026-06-06 18:49:38.857	2026-06-06 18:49:38.857
069992cb-1ef7-4032-ae7a-ac1eb2e55e2d	cmpg3rbz2000004la05x1z03i	Uniforme confirmado	f	0	2026-06-08 13:38:58.872	2026-06-08 13:38:58.872
bf609de1-56b4-43e8-bc60-4789b62fdd34	cmpg3rbz2000004la05x1z03i	Bola disponivel	f	1	2026-06-08 13:38:58.872	2026-06-08 13:38:58.872
62f3eef9-8ed2-4d96-8b8a-4b02dda3bf5c	cmpg3rbz2000004la05x1z03i	Coletes disponiveis	f	2	2026-06-08 13:38:58.872	2026-06-08 13:38:58.872
2053fd67-646f-47f8-8e39-fba9f994fd3f	cmpg3rbz2000004la05x1z03i	Campo confirmado	f	3	2026-06-08 13:38:58.872	2026-06-08 13:38:58.872
07ddd350-ea12-442f-960b-cf4b29906d59	cmpg3rbz2000004la05x1z03i	Arbitragem confirmada	f	4	2026-06-08 13:38:58.872	2026-06-08 13:38:58.872
e0adc661-923c-4d61-9e42-351466ab479a	cmpg3rbz2000004la05x1z03i	Adversario confirmado	f	5	2026-06-08 13:38:58.872	2026-06-08 13:38:58.872
b5d7a6b7-5075-4424-8136-a8fbec372f82	cmpfezhxy000004lblpwmx62l	Uniforme confirmado	t	0	2026-05-27 16:36:45.712	2026-05-27 16:36:45.712
8013cc38-0321-41dc-b039-ddafa9c3a838	cmpfezhxy000004lblpwmx62l	Bola disponivel	t	1	2026-05-27 16:36:45.712	2026-05-27 16:36:45.712
5c17166c-b9d8-4b86-a125-e4a0b86e6ec9	cmpfezhxy000004lblpwmx62l	Coletes disponiveis	f	2	2026-05-27 16:36:45.712	2026-05-27 16:36:45.712
cb23fed9-0bfc-4714-9a67-4ef1dac34116	cmpfezhxy000004lblpwmx62l	Campo confirmado	t	3	2026-05-27 16:36:45.712	2026-05-27 16:36:45.712
b2662b0a-c2e5-4771-8a07-1b81b2862301	cmpfezhxy000004lblpwmx62l	Arbitragem confirmada	t	4	2026-05-27 16:36:45.712	2026-05-27 16:36:45.712
72465c13-b008-4d34-9992-8b8424dd9e09	cmpfezhxy000004lblpwmx62l	Adversario confirmado	t	5	2026-05-27 16:36:45.712	2026-05-27 16:36:45.712
a095db82-11f5-4e42-a1c4-237c6bfaf3a9	cmq9kccux000004l58m8puvai	Uniforme confirmado	f	0	2026-06-11 14:00:26.784	2026-06-11 14:00:26.784
db9dcc14-9ef6-4d12-a57b-2f8d8596b2b7	cmq9kccux000004l58m8puvai	Bola disponivel	f	1	2026-06-11 14:00:26.784	2026-06-11 14:00:26.784
c6376b9e-bf3c-40f3-84c5-2e56ab7f723b	cmq9kccux000004l58m8puvai	Coletes disponiveis	f	2	2026-06-11 14:00:26.784	2026-06-11 14:00:26.784
252c6032-1eac-4f39-a8b8-bc97c5346122	cmq9kccux000004l58m8puvai	Campo confirmado	f	3	2026-06-11 14:00:26.784	2026-06-11 14:00:26.784
7098ff27-6d2e-4336-8b7f-58ccf11d3dfe	cmq9kccux000004l58m8puvai	Arbitragem confirmada	f	4	2026-06-11 14:00:26.784	2026-06-11 14:00:26.784
993264d8-0842-462b-b7dc-4afea698b521	cmq9kccux000004l58m8puvai	Adversario confirmado	f	5	2026-06-11 14:00:26.784	2026-06-11 14:00:26.784
674569a6-25ea-4ff1-8232-f11e53384474	cmqp5jh8b000004jp8k1q116l	Uniforme confirmado	f	0	2026-06-22 11:49:19.492	2026-06-22 11:49:19.492
0276f3b6-cd4a-4b85-b330-76dedb9d7ed7	cmqp5jh8b000004jp8k1q116l	Bola disponivel	f	1	2026-06-22 11:49:19.492	2026-06-22 11:49:19.492
e82421a1-7a86-4e1e-9812-3916f59b5b01	cmqp5jh8b000004jp8k1q116l	Coletes disponiveis	f	2	2026-06-22 11:49:19.492	2026-06-22 11:49:19.492
6f827754-28f5-48ca-a9eb-876372566e6a	cmqp5jh8b000004jp8k1q116l	Campo confirmado	f	3	2026-06-22 11:49:19.492	2026-06-22 11:49:19.492
66959e2e-fd2c-4838-8ddd-391ee6727bab	cmqp5jh8b000004jp8k1q116l	Arbitragem confirmada	f	4	2026-06-22 11:49:19.492	2026-06-22 11:49:19.492
d7fc7a22-51f8-4345-b2b7-a15721d7d637	cmqp5jh8b000004jp8k1q116l	Adversario confirmado	f	5	2026-06-22 11:49:19.492	2026-06-22 11:49:19.492
8fa5b5fa-c37c-4e9d-bdd2-efd488b06b25	cmq59e1vu000004juzmp8xftw	Uniforme confirmado	f	0	2026-07-03 11:39:05.431	2026-07-03 11:39:05.431
0c745c55-1040-49e1-8b60-6ec877120e2b	cmq59e1vu000004juzmp8xftw	Bola disponivel	f	1	2026-07-03 11:39:05.431	2026-07-03 11:39:05.431
09653630-a51f-4089-a5f6-f8f9e5a0b0a6	cmq59e1vu000004juzmp8xftw	Coletes disponiveis	f	2	2026-07-03 11:39:05.431	2026-07-03 11:39:05.431
2b25393d-e080-44d2-85cc-baeb2e48916f	cmq59e1vu000004juzmp8xftw	Campo confirmado	f	3	2026-07-03 11:39:05.431	2026-07-03 11:39:05.431
b9d1d751-0177-4e44-9202-6889226bf254	cmq59e1vu000004juzmp8xftw	Arbitragem confirmada	f	4	2026-07-03 11:39:05.431	2026-07-03 11:39:05.431
4ac73306-3457-4e82-9f1d-ccdd65f15adb	cmq59e1vu000004juzmp8xftw	Adversario confirmado	f	5	2026-07-03 11:39:05.431	2026-07-03 11:39:05.431
71cfb6d5-090f-4c9e-bf0d-36039df1423c	cmr4v6j8z000004jmrs48v3h3	Uniforme confirmado	f	0	2026-07-03 11:45:27.755	2026-07-03 11:45:27.755
5bf66358-36d4-4a9e-92c6-b61f1b02c42b	cmr4v6j8z000004jmrs48v3h3	Bola disponivel	f	1	2026-07-03 11:45:27.755	2026-07-03 11:45:27.755
952b7dec-7bc9-4e08-ae6e-916a8fde0809	cmr4v6j8z000004jmrs48v3h3	Coletes disponiveis	f	2	2026-07-03 11:45:27.755	2026-07-03 11:45:27.755
4837544f-ebc6-49a9-a5e1-27e5dd46fa74	cmr4v6j8z000004jmrs48v3h3	Campo confirmado	f	3	2026-07-03 11:45:27.755	2026-07-03 11:45:27.755
6afe5044-04ca-4f7a-ab3a-4c15696f908f	cmr4v6j8z000004jmrs48v3h3	Arbitragem confirmada	f	4	2026-07-03 11:45:27.755	2026-07-03 11:45:27.755
64bf7b8f-bb3a-4a32-a743-5f3a53eb6bbe	cmr4v6j8z000004jmrs48v3h3	Adversario confirmado	f	5	2026-07-03 11:45:27.755	2026-07-03 11:45:27.755
6247edc2-0339-4b25-9bdb-2f9929247158	cmqp62ilp000004jul47gswr8	Uniforme confirmado	f	0	2026-07-14 13:04:18.199	2026-07-14 13:04:18.199
5933c70e-84bf-4da8-8492-c0365b334d79	cmqp62ilp000004jul47gswr8	Bola disponivel	f	1	2026-07-14 13:04:18.199	2026-07-14 13:04:18.199
30719abc-faa7-4a9a-b639-a9d0c652d9ad	cmqp62ilp000004jul47gswr8	Coletes disponiveis	f	2	2026-07-14 13:04:18.199	2026-07-14 13:04:18.199
fa7591dd-c4da-437b-b90d-3d5cdcd8d2d1	cmqp62ilp000004jul47gswr8	Campo confirmado	f	3	2026-07-14 13:04:18.199	2026-07-14 13:04:18.199
bc7600a9-9108-46cd-a162-19a08523e3bc	cmqp62ilp000004jul47gswr8	Arbitragem confirmada	f	4	2026-07-14 13:04:18.199	2026-07-14 13:04:18.199
82a1dd45-efc4-4e38-9dc9-f136cfc2f5a8	cmpkl4qyr000004l41n642701	Uniforme confirmado	t	0	2026-05-27 22:34:02.596	2026-05-27 22:34:02.596
9aa44231-fedb-4cd1-bccd-3272f219d654	cmpkl4qyr000004l41n642701	Bola disponivel	t	1	2026-05-27 22:34:02.596	2026-05-27 22:34:02.596
50149b8a-8f20-4a8a-af3e-69f3a9fb86fd	cmpkl4qyr000004l41n642701	Coletes disponiveis	f	2	2026-05-27 22:34:02.596	2026-05-27 22:34:02.596
d9b38dd2-f69a-49aa-b94f-2e877e320c6a	cmpkl4qyr000004l41n642701	Campo confirmado	t	3	2026-05-27 22:34:02.596	2026-05-27 22:34:02.596
84a66613-63cf-4788-bb47-bcd30863c2c5	cmpkl4qyr000004l41n642701	Arbitragem confirmada	t	4	2026-05-27 22:34:02.596	2026-05-27 22:34:02.596
808e6447-a7f3-492e-8b5f-381c3ab699ec	cmpkl4qyr000004l41n642701	Adversario confirmado	t	5	2026-05-27 22:34:02.596	2026-05-27 22:34:02.596
ac8a72be-7df7-48ad-ab2b-7f144d6f8b17	cmqp62ilp000004jul47gswr8	Adversario confirmado	f	5	2026-07-14 13:04:18.199	2026-07-14 13:04:18.199
28614c43-c4be-4fb8-bc3a-7453e464ee63	cmrkxjsua000004jtqvbnfwac	Uniforme confirmado	f	0	2026-07-14 17:35:30.071	2026-07-14 17:35:30.071
5ffc5abb-d1e6-413d-8f75-704c6c334285	cmrkxjsua000004jtqvbnfwac	Bola disponivel	f	1	2026-07-14 17:35:30.071	2026-07-14 17:35:30.071
a6ba2a26-92a3-405c-9911-4509f2af3900	cmrkxjsua000004jtqvbnfwac	Coletes disponiveis	f	2	2026-07-14 17:35:30.071	2026-07-14 17:35:30.071
5a008483-4076-48ed-9238-5da059c8a64f	cmrkxjsua000004jtqvbnfwac	Campo confirmado	f	3	2026-07-14 17:35:30.071	2026-07-14 17:35:30.071
438b61a6-25a7-476a-a278-35fd465e8651	cmrkxjsua000004jtqvbnfwac	Arbitragem confirmada	f	4	2026-07-14 17:35:30.071	2026-07-14 17:35:30.071
d81c621c-d015-429f-b049-6f85acf7364d	cmrkxjsua000004jtqvbnfwac	Adversario confirmado	f	5	2026-07-14 17:35:30.071	2026-07-14 17:35:30.071
1035fbd8-2171-47ff-9378-032b03fd8e93	cmpe1azov000004l1iw95x1zw	Uniforme confirmado	f	0	2026-07-17 16:47:58.363	2026-07-17 16:47:58.363
1d25a7c7-0818-4184-9254-22fb29d47d41	cmpe1azov000004l1iw95x1zw	Bola disponivel	f	1	2026-07-17 16:47:58.363	2026-07-17 16:47:58.363
098991d9-f280-4991-97b2-1af4d8bd4efa	cmpe1azov000004l1iw95x1zw	Coletes disponiveis	f	2	2026-07-17 16:47:58.363	2026-07-17 16:47:58.363
89f98e57-75e9-4876-83dc-10833e4ca7f6	cmpe1azov000004l1iw95x1zw	Campo confirmado	f	3	2026-07-17 16:47:58.363	2026-07-17 16:47:58.363
b3cef696-1ade-4dca-b582-e9d473231e44	cmpe1azov000004l1iw95x1zw	Arbitragem confirmada	f	4	2026-07-17 16:47:58.363	2026-07-17 16:47:58.363
0de6f8f4-2175-429a-b98d-bc82fcf1494e	cmpe1azov000004l1iw95x1zw	Adversario confirmado	f	5	2026-07-17 16:47:58.363	2026-07-17 16:47:58.363
24af86ea-0fd5-43ee-b1d4-859f228b06a9	cmpg3xoab000e04jupuf15f34	Uniforme confirmado	f	0	2026-07-17 16:50:20.388	2026-07-17 16:50:20.388
ae63cd1c-9962-4499-8f93-29744298c412	cmpg3xoab000e04jupuf15f34	Bola disponivel	f	1	2026-07-17 16:50:20.388	2026-07-17 16:50:20.388
a8b49935-e427-43db-b9c1-bab58d72800a	cmpg3xoab000e04jupuf15f34	Coletes disponiveis	f	2	2026-07-17 16:50:20.388	2026-07-17 16:50:20.388
602bf60c-fa1c-4c7a-8161-72b1d957f16a	cmpg3xoab000e04jupuf15f34	Campo confirmado	f	3	2026-07-17 16:50:20.388	2026-07-17 16:50:20.388
9474754a-5f99-48d2-a7e6-5f70ca898633	cmpg3xoab000e04jupuf15f34	Arbitragem confirmada	f	4	2026-07-17 16:50:20.388	2026-07-17 16:50:20.388
2d312ad6-620e-4bc6-a126-92d5993ae0d0	cmpg3xoab000e04jupuf15f34	Adversario confirmado	f	5	2026-07-17 16:50:20.388	2026-07-17 16:50:20.388
683017bc-cca8-480c-a28d-8df8c91d7696	cmpgvy3i1000004jupkxo13f9	Uniforme confirmado	f	0	2026-07-17 17:13:47.265	2026-07-17 17:13:47.265
1c65f2f9-fa8e-47de-bf6d-bc3c2384c148	cmpgvy3i1000004jupkxo13f9	Bola disponivel	f	1	2026-07-17 17:13:47.265	2026-07-17 17:13:47.265
461e91ff-4f5c-47b9-aca2-2808464345cd	cmpgvy3i1000004jupkxo13f9	Coletes disponiveis	f	2	2026-07-17 17:13:47.265	2026-07-17 17:13:47.265
8ef3b494-a3a3-44ea-93c5-5476533304c0	cmpgvy3i1000004jupkxo13f9	Campo confirmado	f	3	2026-07-17 17:13:47.265	2026-07-17 17:13:47.265
5c19914e-51ea-4ab6-b1c2-65b9a2a77438	cmpgvy3i1000004jupkxo13f9	Arbitragem confirmada	f	4	2026-07-17 17:13:47.265	2026-07-17 17:13:47.265
b7853553-3871-4c7c-b756-600d654f1be8	cmpgvy3i1000004jupkxo13f9	Adversario confirmado	f	5	2026-07-17 17:13:47.265	2026-07-17 17:13:47.265
5dd44380-9b32-4bee-9d92-49afe30cf226	cmpgxpcmr000104l1gbglqrdc	Uniforme confirmado	f	0	2026-07-17 17:15:47.827	2026-07-17 17:15:47.827
957154c5-e5c4-4564-ac24-fe9f5a7b8570	cmpgxpcmr000104l1gbglqrdc	Bola disponivel	f	1	2026-07-17 17:15:47.827	2026-07-17 17:15:47.827
d0ef0fcf-4128-4fd3-a25c-6c6425381175	cmpgxpcmr000104l1gbglqrdc	Coletes disponiveis	f	2	2026-07-17 17:15:47.827	2026-07-17 17:15:47.827
e25ac1c6-14a3-4f7e-afb2-d3da11ce5f11	cmpgxpcmr000104l1gbglqrdc	Campo confirmado	f	3	2026-07-17 17:15:47.827	2026-07-17 17:15:47.827
d4a81197-4c7d-4996-a28b-898798e586de	cmpgxpcmr000104l1gbglqrdc	Arbitragem confirmada	f	4	2026-07-17 17:15:47.827	2026-07-17 17:15:47.827
9122b081-e13f-41f3-b412-feaf8d17b069	cmpgxpcmr000104l1gbglqrdc	Adversario confirmado	f	5	2026-07-17 17:15:47.827	2026-07-17 17:15:47.827
07c9a26c-682c-4645-95e3-f0035b138531	cmrp7l1ax000104l49nmc6qf9	Uniforme confirmado	f	0	2026-07-17 17:25:35.46	2026-07-17 17:25:35.46
ff06674d-9fde-410d-99a3-4d86e278d431	cmrp7l1ax000104l49nmc6qf9	Bola disponivel	f	1	2026-07-17 17:25:35.46	2026-07-17 17:25:35.46
3b4128ff-f95e-4dd8-a0d0-0b236b55a54e	cmrp7l1ax000104l49nmc6qf9	Coletes disponiveis	f	2	2026-07-17 17:25:35.46	2026-07-17 17:25:35.46
7b68dcdc-b8cb-4e80-b591-81541e4bc0e3	cmrp7l1ax000104l49nmc6qf9	Campo confirmado	f	3	2026-07-17 17:25:35.46	2026-07-17 17:25:35.46
1593291b-68be-42d0-acca-d7a063a80e17	cmrp7l1ax000104l49nmc6qf9	Arbitragem confirmada	f	4	2026-07-17 17:25:35.46	2026-07-17 17:25:35.46
8d91b802-6540-4c72-a215-a098e8aab7ae	cmrp7l1ax000104l49nmc6qf9	Adversario confirmado	f	5	2026-07-17 17:25:35.46	2026-07-17 17:25:35.46
f98a3251-e3ed-4743-996a-26c06dc8ec0a	cmrp8963m000004larspejvgr	Uniforme confirmado	f	0	2026-07-17 17:44:19.768	2026-07-17 17:44:19.768
a67f226f-1ebb-42c7-9819-c956d9127e70	cmrp8963m000004larspejvgr	Bola disponivel	f	1	2026-07-17 17:44:19.768	2026-07-17 17:44:19.768
ef0d21b9-5fe7-456a-9339-c3f623523141	cmrp8963m000004larspejvgr	Coletes disponiveis	f	2	2026-07-17 17:44:19.768	2026-07-17 17:44:19.768
8a968d52-d275-4579-8546-cb90cc942b9a	cmrp8963m000004larspejvgr	Campo confirmado	f	3	2026-07-17 17:44:19.768	2026-07-17 17:44:19.768
088530ff-49de-4250-ba9e-c4b4beb27e78	cmrp8963m000004larspejvgr	Arbitragem confirmada	f	4	2026-07-17 17:44:19.768	2026-07-17 17:44:19.768
49388676-4b22-4bab-aac4-14d2d28ef8a4	cmrp8963m000004larspejvgr	Adversario confirmado	f	5	2026-07-17 17:44:19.768	2026-07-17 17:44:19.768
e076ffa8-2b9f-41c9-ba08-4edfa352e5a8	cmrp9ms6u000004ldf8womoau	Uniforme confirmado	f	0	2026-07-17 18:23:04.327	2026-07-17 18:23:04.327
5a7b2342-cee5-4f0b-81c8-9824b3479e54	cmrp9ms6u000004ldf8womoau	Bola disponivel	f	1	2026-07-17 18:23:04.327	2026-07-17 18:23:04.327
25c0f575-8fdb-4df4-b31d-acadbe40e4fb	cmrp9ms6u000004ldf8womoau	Coletes disponiveis	f	2	2026-07-17 18:23:04.327	2026-07-17 18:23:04.327
a1f1c08a-db0b-400e-af1e-488b25c97fe6	cmrp9ms6u000004ldf8womoau	Campo confirmado	f	3	2026-07-17 18:23:04.327	2026-07-17 18:23:04.327
0f505ece-c027-4653-950f-ea0a7025a9e2	cmrp9ms6u000004ldf8womoau	Arbitragem confirmada	f	4	2026-07-17 18:23:04.327	2026-07-17 18:23:04.327
585aab4a-5085-40ef-a3c7-f0522606a195	cmrp9ms6u000004ldf8womoau	Adversario confirmado	f	5	2026-07-17 18:23:04.327	2026-07-17 18:23:04.327
1a72a3b2-1598-45d3-81c4-a62694782835	cmrp9yfic000004jpt8bwp440	Uniforme confirmado	f	0	2026-07-17 18:31:59.719	2026-07-17 18:31:59.719
fe9057a8-3d70-4964-ba49-69a2ab4bb941	cmrp9yfic000004jpt8bwp440	Bola disponivel	f	1	2026-07-17 18:31:59.719	2026-07-17 18:31:59.719
e342f438-c0b8-4cac-bd21-818715d4e259	cmrp9yfic000004jpt8bwp440	Coletes disponiveis	f	2	2026-07-17 18:31:59.719	2026-07-17 18:31:59.719
4767b802-f3b0-4324-89d7-3d800e7a9e06	cmrp9yfic000004jpt8bwp440	Campo confirmado	f	3	2026-07-17 18:31:59.719	2026-07-17 18:31:59.719
597e99e0-7596-4e5b-a7ab-afb60f7d353c	cmrp9yfic000004jpt8bwp440	Arbitragem confirmada	f	4	2026-07-17 18:31:59.719	2026-07-17 18:31:59.719
3b9b3781-f400-4d1d-a479-70c8e0acc5e1	cmrp9yfic000004jpt8bwp440	Adversario confirmado	f	5	2026-07-17 18:31:59.719	2026-07-17 18:31:59.719
6c17454d-154a-4312-9657-2d0b02e7838e	cmrpa59lt000p04jpzp8qdy4l	Uniforme confirmado	f	0	2026-07-17 18:37:22.005	2026-07-17 18:37:22.005
615b1025-11bf-4a08-a2a4-45a99ec93bb6	cmrpa59lt000p04jpzp8qdy4l	Bola disponivel	f	1	2026-07-17 18:37:22.005	2026-07-17 18:37:22.005
11f39aa4-2aae-4c03-acb4-181b28db8b4b	cmrpa59lt000p04jpzp8qdy4l	Coletes disponiveis	f	2	2026-07-17 18:37:22.005	2026-07-17 18:37:22.005
22e39d9b-9b5c-4743-81c3-aea6bb26fd16	cmrpa59lt000p04jpzp8qdy4l	Campo confirmado	f	3	2026-07-17 18:37:22.005	2026-07-17 18:37:22.005
9c0ec36f-e57f-4e7e-8f8f-243e6eba3cc1	cmrpa59lt000p04jpzp8qdy4l	Arbitragem confirmada	f	4	2026-07-17 18:37:22.005	2026-07-17 18:37:22.005
07015639-ca77-4e36-a130-886e1e1c3524	cmrpa59lt000p04jpzp8qdy4l	Adversario confirmado	f	5	2026-07-17 18:37:22.005	2026-07-17 18:37:22.005
c61fff2d-7022-4619-8707-126cd8c81e28	cmrpaz5ve001b04igete2fxqx	Uniforme confirmado	f	0	2026-07-17 19:00:35.26	2026-07-17 19:00:35.26
22fc6386-f7b6-483c-b083-86a584f848a1	cmrpaz5ve001b04igete2fxqx	Bola disponivel	f	1	2026-07-17 19:00:35.26	2026-07-17 19:00:35.26
cf395a81-6b17-408f-9082-1d781c1a7733	cmrpaz5ve001b04igete2fxqx	Coletes disponiveis	f	2	2026-07-17 19:00:35.26	2026-07-17 19:00:35.26
ccb29353-ebe3-4d5b-9084-e67915c6e40d	cmrpaz5ve001b04igete2fxqx	Campo confirmado	f	3	2026-07-17 19:00:35.26	2026-07-17 19:00:35.26
9be57842-4678-4147-9af6-0a795432766e	cmrpaz5ve001b04igete2fxqx	Arbitragem confirmada	f	4	2026-07-17 19:00:35.26	2026-07-17 19:00:35.26
e1c8c91b-c7a4-45a5-8152-07659afb2a53	cmrpaz5ve001b04igete2fxqx	Adversario confirmado	f	5	2026-07-17 19:00:35.26	2026-07-17 19:00:35.26
c99ef2de-0e38-4584-a4d1-bc50a8015f16	cmrpblr3f001r04ldzbbc1u6h	Uniforme confirmado	f	0	2026-07-17 19:18:06.662	2026-07-17 19:18:06.662
a3b2dbdf-b2d7-4532-842d-bd4009cb0a3f	cmrpblr3f001r04ldzbbc1u6h	Bola disponivel	f	1	2026-07-17 19:18:06.662	2026-07-17 19:18:06.662
9913cf0c-3673-47c3-912d-160aa7562257	cmrpblr3f001r04ldzbbc1u6h	Coletes disponiveis	f	2	2026-07-17 19:18:06.662	2026-07-17 19:18:06.662
3a2f53b5-418c-48dc-a084-8a3782c036b9	cmrpblr3f001r04ldzbbc1u6h	Campo confirmado	f	3	2026-07-17 19:18:06.662	2026-07-17 19:18:06.662
51b2286d-5135-4320-80c7-d60701712f17	cmrpblr3f001r04ldzbbc1u6h	Arbitragem confirmada	f	4	2026-07-17 19:18:06.662	2026-07-17 19:18:06.662
d5472e01-293e-491c-a678-be0ee3d5f396	cmrpblr3f001r04ldzbbc1u6h	Adversario confirmado	f	5	2026-07-17 19:18:06.662	2026-07-17 19:18:06.662
b14b9c68-4b85-4521-80f7-d1061e14be49	cmrpbrolu002f04ld1jou7dvp	Uniforme confirmado	f	0	2026-07-17 19:24:27.632	2026-07-17 19:24:27.632
88e1e7ab-8c12-49e7-b49e-5fb210120c53	cmrpbrolu002f04ld1jou7dvp	Bola disponivel	f	1	2026-07-17 19:24:27.632	2026-07-17 19:24:27.632
d85d2c1d-1b1c-4672-8c91-9b1102042929	cmrpbrolu002f04ld1jou7dvp	Coletes disponiveis	f	2	2026-07-17 19:24:27.632	2026-07-17 19:24:27.632
9cc4fc00-10fb-4587-901f-76522c40f8c3	cmrpbrolu002f04ld1jou7dvp	Campo confirmado	f	3	2026-07-17 19:24:27.632	2026-07-17 19:24:27.632
23f9febe-e311-42c5-ad4f-acd8cc7ba44f	cmrpbrolu002f04ld1jou7dvp	Arbitragem confirmada	f	4	2026-07-17 19:24:27.632	2026-07-17 19:24:27.632
2ce1b0a9-ca53-47da-b49b-25a1a62c752b	cmrpbrolu002f04ld1jou7dvp	Adversario confirmado	f	5	2026-07-17 19:24:27.632	2026-07-17 19:24:27.632
5ebd676e-41e1-4fbc-886c-73a0da141f37	cmrpcbynn003404ldris66yj1	Uniforme confirmado	f	0	2026-07-17 19:38:24.717	2026-07-17 19:38:24.717
a75137e2-a239-46cf-aa88-7a7ff5b8ddf9	cmrpcbynn003404ldris66yj1	Bola disponivel	f	1	2026-07-17 19:38:24.717	2026-07-17 19:38:24.717
072a736a-9eb9-4639-b3b2-aba178e36398	cmrpcbynn003404ldris66yj1	Coletes disponiveis	f	2	2026-07-17 19:38:24.717	2026-07-17 19:38:24.717
78895228-5224-4b50-b295-f947e89a7264	cmrpcbynn003404ldris66yj1	Campo confirmado	f	3	2026-07-17 19:38:24.717	2026-07-17 19:38:24.717
4673cc37-e795-432e-a70c-87302741e977	cmrpcbynn003404ldris66yj1	Arbitragem confirmada	f	4	2026-07-17 19:38:24.717	2026-07-17 19:38:24.717
76f3f77d-e9dd-4cfd-a322-eb5028df1019	cmrpcbynn003404ldris66yj1	Adversario confirmado	f	5	2026-07-17 19:38:24.717	2026-07-17 19:38:24.717
b27e0d83-77ca-446a-a378-7069a5138267	cmph7ki34000004ibhrgnxf2y	Uniforme confirmado	f	0	2026-07-17 19:43:16.133	2026-07-17 19:43:16.133
2f54d263-d53e-4fc7-8e9d-c468a56d90a9	cmph7ki34000004ibhrgnxf2y	Bola disponivel	f	1	2026-07-17 19:43:16.133	2026-07-17 19:43:16.133
188aa1ff-4688-43c6-bba3-d95825203b16	cmph7ki34000004ibhrgnxf2y	Coletes disponiveis	f	2	2026-07-17 19:43:16.133	2026-07-17 19:43:16.133
b9b71425-6aeb-47fe-9a3c-09caa4b97b90	cmph7ki34000004ibhrgnxf2y	Campo confirmado	f	3	2026-07-17 19:43:16.133	2026-07-17 19:43:16.133
9c0e40e5-deae-4be8-a457-b1df99e99305	cmph7ki34000004ibhrgnxf2y	Arbitragem confirmada	f	4	2026-07-17 19:43:16.133	2026-07-17 19:43:16.133
e6c3324b-ec80-489f-8854-7a7b52f9e4ed	cmph7ki34000004ibhrgnxf2y	Adversario confirmado	f	5	2026-07-17 19:43:16.133	2026-07-17 19:43:16.133
765dae3e-60cc-4b1a-95cb-edf3b70de47c	cmrpg2uyd000004l44co9je0h	Uniforme confirmado	f	0	2026-07-17 21:23:19.252	2026-07-17 21:23:19.252
d75fc97f-89cb-43aa-8eb7-27ba6c47deb5	cmrpg2uyd000004l44co9je0h	Bola disponivel	f	1	2026-07-17 21:23:19.252	2026-07-17 21:23:19.252
664acced-d4a4-4ac3-a126-013c3eac5fbe	cmrpg2uyd000004l44co9je0h	Coletes disponiveis	f	2	2026-07-17 21:23:19.252	2026-07-17 21:23:19.252
7fe01252-b2d2-4c52-bd14-2e4d452f76d5	cmrpg2uyd000004l44co9je0h	Campo confirmado	f	3	2026-07-17 21:23:19.252	2026-07-17 21:23:19.252
9faaad67-1ffa-44cc-b673-eae52a8f53a3	cmrpg2uyd000004l44co9je0h	Arbitragem confirmada	f	4	2026-07-17 21:23:19.252	2026-07-17 21:23:19.252
0ca7d446-7af4-47ff-a516-3e9699c4f25f	cmrpg2uyd000004l44co9je0h	Adversario confirmado	f	5	2026-07-17 21:23:19.252	2026-07-17 21:23:19.252
67eb3f2a-c24e-40c4-9ca8-fdb0f16a0ad7	cmrpgrdrs000o04jtnnx9wcf4	Uniforme confirmado	f	0	2026-07-17 21:42:24.387	2026-07-17 21:42:24.387
1f78b837-6e74-46c3-91e3-659ac7f85205	cmrpgrdrs000o04jtnnx9wcf4	Bola disponivel	f	1	2026-07-17 21:42:24.387	2026-07-17 21:42:24.387
b6449bc1-1f5e-483d-82fe-c2ae871319d8	cmrpgrdrs000o04jtnnx9wcf4	Coletes disponiveis	f	2	2026-07-17 21:42:24.387	2026-07-17 21:42:24.387
a4c6f3ae-58ad-4311-ac4a-1de13edbc097	cmrpgrdrs000o04jtnnx9wcf4	Campo confirmado	f	3	2026-07-17 21:42:24.387	2026-07-17 21:42:24.387
66fbdfa1-d014-4153-98fe-5e4312c3cfcc	cmrpgrdrs000o04jtnnx9wcf4	Arbitragem confirmada	f	4	2026-07-17 21:42:24.387	2026-07-17 21:42:24.387
d238e6f1-b53b-4426-abcd-2e44aa4ce189	cmrpgrdrs000o04jtnnx9wcf4	Adversario confirmado	f	5	2026-07-17 21:42:24.387	2026-07-17 21:42:24.387
61232476-d08c-448e-845b-5090a9ebe445	cmpg3u3kh000l04la6hj2e5r3	Uniforme confirmado	f	0	2026-07-18 16:21:42.904	2026-07-18 16:21:42.904
f9221b81-a2f2-4506-8c43-c5d4d66ef953	cmpg3u3kh000l04la6hj2e5r3	Bola disponivel	f	1	2026-07-18 16:21:42.904	2026-07-18 16:21:42.904
3d867bd8-68b5-421c-9d46-c342309f9b29	cmpg3u3kh000l04la6hj2e5r3	Coletes disponiveis	f	2	2026-07-18 16:21:42.904	2026-07-18 16:21:42.904
d7ce521e-2208-4c19-bfcf-ca65ac610d15	cmpg3u3kh000l04la6hj2e5r3	Campo confirmado	f	3	2026-07-18 16:21:42.904	2026-07-18 16:21:42.904
5615f815-c0ec-4641-8d73-a9e4af916c2c	cmpg3u3kh000l04la6hj2e5r3	Arbitragem confirmada	f	4	2026-07-18 16:21:42.904	2026-07-18 16:21:42.904
725ce1bc-0a8d-4fbb-8d07-9fb90f80706b	cmpg3u3kh000l04la6hj2e5r3	Adversario confirmado	f	5	2026-07-18 16:21:42.904	2026-07-18 16:21:42.904
f206f7e4-b340-460b-8c66-d1d4fb46d621	cmrqkwrev000004jpjug6t8wd	Uniforme confirmado	f	0	2026-07-18 16:26:17.698	2026-07-18 16:26:17.698
f22875b0-ccef-4b08-88db-b1e51a89d3eb	cmrqkwrev000004jpjug6t8wd	Bola disponivel	f	1	2026-07-18 16:26:17.698	2026-07-18 16:26:17.698
16b463f5-c116-4557-9c5a-0acf8c5a6fb9	cmrqkwrev000004jpjug6t8wd	Coletes disponiveis	f	2	2026-07-18 16:26:17.698	2026-07-18 16:26:17.698
d750bd44-4d7d-4354-99cc-61e15b4b4a9c	cmrqkwrev000004jpjug6t8wd	Campo confirmado	f	3	2026-07-18 16:26:17.698	2026-07-18 16:26:17.698
3d5c0633-e759-4873-904a-50ac1f593b06	cmrqkwrev000004jpjug6t8wd	Arbitragem confirmada	f	4	2026-07-18 16:26:17.698	2026-07-18 16:26:17.698
14e78a7c-06e4-4d0e-aa68-7205912d53c7	cmrqkwrev000004jpjug6t8wd	Adversario confirmado	f	5	2026-07-18 16:26:17.698	2026-07-18 16:26:17.698
5dcf5193-dd33-48b1-9ffa-f64713f0444b	cmrqld3kq000p04jp208zp47h	Uniforme confirmado	f	0	2026-07-18 16:39:04.68	2026-07-18 16:39:04.68
b716ba8e-b91d-4e7c-b918-4b22e96e620c	cmrqld3kq000p04jp208zp47h	Bola disponivel	f	1	2026-07-18 16:39:04.68	2026-07-18 16:39:04.68
ef37c988-b10a-4387-ba08-0bfaafa3c214	cmrqld3kq000p04jp208zp47h	Coletes disponiveis	f	2	2026-07-18 16:39:04.68	2026-07-18 16:39:04.68
5760dbc0-d006-4b5b-bf1e-297530f5d75b	cmrqld3kq000p04jp208zp47h	Campo confirmado	f	3	2026-07-18 16:39:04.68	2026-07-18 16:39:04.68
af9b4882-c30e-452a-9691-5c931ead6dcb	cmrqld3kq000p04jp208zp47h	Arbitragem confirmada	f	4	2026-07-18 16:39:04.68	2026-07-18 16:39:04.68
d56a8be8-5a6a-4994-86fd-0115c02fba4d	cmrqld3kq000p04jp208zp47h	Adversario confirmado	f	5	2026-07-18 16:39:04.68	2026-07-18 16:39:04.68
ade1feca-db6f-416f-afa2-a77b9db9fe55	cmrqlng1w000004junomwb3sz	Uniforme confirmado	f	0	2026-07-18 16:47:04.245	2026-07-18 16:47:04.245
09d201ca-950d-45fc-8a34-d1eda03bf3ee	cmrqlng1w000004junomwb3sz	Bola disponivel	f	1	2026-07-18 16:47:04.245	2026-07-18 16:47:04.245
a0af5150-61e2-459e-ba7c-5f89efda5259	cmrqlng1w000004junomwb3sz	Coletes disponiveis	f	2	2026-07-18 16:47:04.245	2026-07-18 16:47:04.245
849a89b2-3386-4121-8375-fc5fe710dac7	cmrqlng1w000004junomwb3sz	Campo confirmado	f	3	2026-07-18 16:47:04.245	2026-07-18 16:47:04.245
d6d7e8db-06e3-41b3-a9b3-a0b6da55b2b9	cmrqlng1w000004junomwb3sz	Arbitragem confirmada	f	4	2026-07-18 16:47:04.245	2026-07-18 16:47:04.245
e6c667c5-7259-4298-9da4-8e36b9fcc909	cmrqlng1w000004junomwb3sz	Adversario confirmado	f	5	2026-07-18 16:47:04.245	2026-07-18 16:47:04.245
18defa5f-02c6-4771-bdd7-dbf88d2153a4	cmrkxlng5000004jofpanlfev	Uniforme confirmado	f	0	2026-07-20 13:53:43.845	2026-07-20 13:53:43.845
f0a83b2e-d1b5-426b-9b1c-0aad69ea1ca6	cmrkxlng5000004jofpanlfev	Bola disponivel	f	1	2026-07-20 13:53:43.845	2026-07-20 13:53:43.845
a779728e-5384-4301-a303-686cb8c557ff	cmrkxlng5000004jofpanlfev	Coletes disponiveis	f	2	2026-07-20 13:53:43.845	2026-07-20 13:53:43.845
4d5c25ef-9ed0-4042-99e5-85cec3ed4d0d	cmrkxlng5000004jofpanlfev	Campo confirmado	f	3	2026-07-20 13:53:43.845	2026-07-20 13:53:43.845
c38cc603-0b4d-4578-b250-1696a24f600f	cmrkxlng5000004jofpanlfev	Arbitragem confirmada	f	4	2026-07-20 13:53:43.845	2026-07-20 13:53:43.845
4e059dca-9012-41ef-9183-a4baac7b0352	cmrkxlng5000004jofpanlfev	Adversario confirmado	f	5	2026-07-20 13:53:43.845	2026-07-20 13:53:43.845
7564d86f-7266-476e-bab5-a33a88c4e748	cmrpgk0qh000004jttg2q1s11	Uniforme confirmado	f	0	2026-07-20 14:06:08.476	2026-07-20 14:06:08.476
3046cc3a-9846-4b7f-9b26-796a15f5d9d5	cmrpgk0qh000004jttg2q1s11	Bola disponivel	f	1	2026-07-20 14:06:08.476	2026-07-20 14:06:08.476
9edac68e-7bdf-43cf-9502-69e67f5e1ecf	cmrpgk0qh000004jttg2q1s11	Coletes disponiveis	f	2	2026-07-20 14:06:08.476	2026-07-20 14:06:08.476
39708d54-5f90-4281-b921-6188fc1cea7d	cmrpgk0qh000004jttg2q1s11	Campo confirmado	f	3	2026-07-20 14:06:08.476	2026-07-20 14:06:08.476
651b5977-e670-4e4c-8847-f3902ab93ef6	cmrpgk0qh000004jttg2q1s11	Arbitragem confirmada	f	4	2026-07-20 14:06:08.476	2026-07-20 14:06:08.476
b1dff77c-562f-4b04-8327-ac3073bc1cfe	cmrpgk0qh000004jttg2q1s11	Adversario confirmado	f	5	2026-07-20 14:06:08.476	2026-07-20 14:06:08.476
867af229-32c5-45af-a0b6-5829f2b0ccf2	cmrqib170000004l7swe10dxz	Uniforme confirmado	f	0	2026-07-20 14:07:05.848	2026-07-20 14:07:05.848
b26464e5-5b3a-489d-a9ae-116954489850	cmrqib170000004l7swe10dxz	Bola disponivel	f	1	2026-07-20 14:07:05.848	2026-07-20 14:07:05.848
4c0cc013-6c17-4d4d-b7dc-3cb6a3eb26ac	cmrqib170000004l7swe10dxz	Coletes disponiveis	f	2	2026-07-20 14:07:05.848	2026-07-20 14:07:05.848
5683d249-f5a7-4981-bf01-0579c4deaf87	cmrqib170000004l7swe10dxz	Campo confirmado	f	3	2026-07-20 14:07:05.848	2026-07-20 14:07:05.848
fe244af8-afaa-42d9-ac6a-d38262a03fdc	cmrqib170000004l7swe10dxz	Arbitragem confirmada	f	4	2026-07-20 14:07:05.848	2026-07-20 14:07:05.848
ca08a64f-62c7-4b4a-b372-11b28eaf6906	cmrqib170000004l7swe10dxz	Adversario confirmado	f	5	2026-07-20 14:07:05.848	2026-07-20 14:07:05.848
252c669a-d7f8-453c-ac2f-7a79459569f0	cmrthsbf6000004kybfhn32yj	Uniforme confirmado	f	0	2026-07-20 17:53:03.512	2026-07-20 17:53:03.512
edbf70e0-92aa-443a-9f5a-46afc901a8f3	cmrthsbf6000004kybfhn32yj	Bola disponivel	f	1	2026-07-20 17:53:03.512	2026-07-20 17:53:03.512
141eeb00-8756-4207-b5a3-f3cf3d45de43	cmrthsbf6000004kybfhn32yj	Coletes disponiveis	f	2	2026-07-20 17:53:03.512	2026-07-20 17:53:03.512
dcdcd4c3-d9c5-4ec1-b54b-9ee5293a1b32	cmrthsbf6000004kybfhn32yj	Campo confirmado	f	3	2026-07-20 17:53:03.512	2026-07-20 17:53:03.512
f9fe5ee0-d4c1-42e7-94c0-a497ac7c71a6	cmrthsbf6000004kybfhn32yj	Arbitragem confirmada	f	4	2026-07-20 17:53:03.512	2026-07-20 17:53:03.512
93ebfe00-61cb-4ce4-add1-3cc155d058e9	cmrthsbf6000004kybfhn32yj	Adversario confirmado	f	5	2026-07-20 17:53:03.512	2026-07-20 17:53:03.512
d66558d6-914c-4728-8e2b-4ebdd9454ee6	cms390n9w000t04jol6dfwp3s	Uniforme confirmado	f	0	2026-07-27 13:14:24.712	2026-07-27 13:14:24.712
8eda5e94-be69-4c7e-b7e2-ec9e9842d7de	cms390n9w000t04jol6dfwp3s	Bola disponivel	f	1	2026-07-27 13:14:24.712	2026-07-27 13:14:24.712
18c1642c-0a4c-47d1-8792-a682cb1b9bfb	cms390n9w000t04jol6dfwp3s	Coletes disponiveis	f	2	2026-07-27 13:14:24.712	2026-07-27 13:14:24.712
3422d610-b3e9-437f-bf2c-7d09a4b11eee	cms390n9w000t04jol6dfwp3s	Campo confirmado	f	3	2026-07-27 13:14:24.712	2026-07-27 13:14:24.712
4bc5ea4a-4b17-463b-8324-7705a3d9f38d	cms390n9w000t04jol6dfwp3s	Arbitragem confirmada	f	4	2026-07-27 13:14:24.712	2026-07-27 13:14:24.712
57eae33d-5e39-4728-8985-576824ebc33d	cms390n9w000t04jol6dfwp3s	Adversario confirmado	f	5	2026-07-27 13:14:24.712	2026-07-27 13:14:24.712
99a41f19-d640-470a-9456-e633d8321767	cms3d5vfv000004jxuwwehm57	Uniforme confirmado	f	0	2026-07-27 15:10:28.011	2026-07-27 15:10:28.011
6918995f-3c9f-457c-837e-524b0ede6d88	cms3d5vfv000004jxuwwehm57	Bola disponivel	f	1	2026-07-27 15:10:28.011	2026-07-27 15:10:28.011
e8353cbf-468c-4fd1-aefc-7a0cc91b10be	cms3d5vfv000004jxuwwehm57	Coletes disponiveis	f	2	2026-07-27 15:10:28.011	2026-07-27 15:10:28.011
0201051d-e530-4042-bac0-0181b77995ad	cms3d5vfv000004jxuwwehm57	Campo confirmado	f	3	2026-07-27 15:10:28.011	2026-07-27 15:10:28.011
7194c5a0-8656-4f64-8a00-444b783a7463	cms3d5vfv000004jxuwwehm57	Arbitragem confirmada	f	4	2026-07-27 15:10:28.011	2026-07-27 15:10:28.011
1df33c29-9029-4109-8432-bcf110999d02	cms3d5vfv000004jxuwwehm57	Adversario confirmado	f	5	2026-07-27 15:10:28.011	2026-07-27 15:10:28.011
bfbfbb59-98f9-4866-879a-b99699179f77	cmsadtjr8000004joiy5e4pc7	Uniforme confirmado	f	0	2026-08-01 18:40:55.838	2026-08-01 18:40:55.838
8c4c838d-f22d-4f07-bc3a-776b8145cf90	cmsadtjr8000004joiy5e4pc7	Bola disponivel	f	1	2026-08-01 18:40:55.838	2026-08-01 18:40:55.838
50e019be-de63-4182-a0ce-dcc4aa5ec847	cmsadtjr8000004joiy5e4pc7	Coletes disponiveis	f	2	2026-08-01 18:40:55.838	2026-08-01 18:40:55.838
bdeeb49a-7526-48e6-aebb-c9c4931e46ee	cmsadtjr8000004joiy5e4pc7	Campo confirmado	f	3	2026-08-01 18:40:55.838	2026-08-01 18:40:55.838
360f1456-1554-4715-9fe4-118c21379296	cmsadtjr8000004joiy5e4pc7	Arbitragem confirmada	f	4	2026-08-01 18:40:55.838	2026-08-01 18:40:55.838
aaad205c-c7ce-4466-bef7-4a91007b2318	cmsadtjr8000004joiy5e4pc7	Adversario confirmado	f	5	2026-08-01 18:40:55.838	2026-08-01 18:40:55.838
bc95a90b-d955-4010-bd7d-67e92bd5916d	cmskhxpbb000004jq77wb6pqt	Uniforme confirmado	f	0	2026-08-08 14:56:20.778	2026-08-08 14:56:20.778
299be706-217f-49be-a29d-867257d45e8f	cmskhxpbb000004jq77wb6pqt	Bola disponivel	f	1	2026-08-08 14:56:20.778	2026-08-08 14:56:20.778
9dd34462-4720-4a70-9a94-176ab0881879	cmskhxpbb000004jq77wb6pqt	Coletes disponiveis	f	2	2026-08-08 14:56:20.778	2026-08-08 14:56:20.778
1963190d-0f7e-400f-8ae9-693131c82b20	cmskhxpbb000004jq77wb6pqt	Campo confirmado	f	3	2026-08-08 14:56:20.778	2026-08-08 14:56:20.778
b84c8879-3b58-4e08-b9b1-f73a44d104a8	cmskhxpbb000004jq77wb6pqt	Arbitragem confirmada	f	4	2026-08-08 14:56:20.778	2026-08-08 14:56:20.778
b9d0c662-0353-4314-bbb3-af6add36bca6	cmskhxpbb000004jq77wb6pqt	Adversario confirmado	f	5	2026-08-08 14:56:20.778	2026-08-08 14:56:20.778
1fb47c9e-bfcf-425f-8fd4-388cfd85e110	cmsd9fo2a000004l80caeqs67	Uniforme confirmado	f	0	2026-08-10 17:09:53.705	2026-08-10 17:09:53.705
50b1c519-08c2-4d90-a8bb-e73077e43942	cmsd9fo2a000004l80caeqs67	Bola disponivel	f	1	2026-08-10 17:09:53.705	2026-08-10 17:09:53.705
7ed200b4-4f3e-4aa7-8ef5-2f59f66e53a7	cmsd9fo2a000004l80caeqs67	Coletes disponiveis	f	2	2026-08-10 17:09:53.705	2026-08-10 17:09:53.705
e626041f-f000-49fc-9620-108e12a0dca4	cmsd9fo2a000004l80caeqs67	Campo confirmado	f	3	2026-08-10 17:09:53.705	2026-08-10 17:09:53.705
eed71f8d-b025-4579-bb73-e3995ae375d1	cmsd9fo2a000004l80caeqs67	Arbitragem confirmada	f	4	2026-08-10 17:09:53.705	2026-08-10 17:09:53.705
788038ad-06c3-41cd-bf76-bbe9fdf960d7	cmsd9fo2a000004l80caeqs67	Adversario confirmado	f	5	2026-08-10 17:09:53.705	2026-08-10 17:09:53.705
6543883a-df7e-42b0-a8f5-aacabe8172e5	cmsnjw3d4000004l73omej79w	Uniforme confirmado	f	0	2026-08-10 18:14:59.767	2026-08-10 18:14:59.767
b78de845-d902-4e92-b5ea-9cd5a3a64200	cmsnjw3d4000004l73omej79w	Bola disponivel	f	1	2026-08-10 18:14:59.767	2026-08-10 18:14:59.767
f69736e5-deb1-4b46-a321-1e0dc21c4f2d	cmsnjw3d4000004l73omej79w	Coletes disponiveis	f	2	2026-08-10 18:14:59.767	2026-08-10 18:14:59.767
dc3b07f9-9985-47db-96bb-21e0933c2041	cmsnjw3d4000004l73omej79w	Campo confirmado	f	3	2026-08-10 18:14:59.767	2026-08-10 18:14:59.767
0fae6e9f-bcb3-4bc3-8e55-919d876d9f87	cmsnjw3d4000004l73omej79w	Arbitragem confirmada	f	4	2026-08-10 18:14:59.767	2026-08-10 18:14:59.767
9b6174fd-482c-40b6-aef5-25f2b6753bb4	cmsnjw3d4000004l73omej79w	Adversario confirmado	f	5	2026-08-10 18:14:59.767	2026-08-10 18:14:59.767
fc24e424-5efd-4615-a0ef-6ce89c69f14a	cmsx2wppc000004ldfwf8elsy	Uniforme confirmado	f	0	2026-08-17 13:56:57.214	2026-08-17 13:56:57.214
fec65803-fe45-4acc-9140-13dfe3ab042f	cmsx2wppc000004ldfwf8elsy	Bola disponivel	f	1	2026-08-17 13:56:57.214	2026-08-17 13:56:57.214
c02a328b-0a05-45e7-a586-29354f49f363	cmsx2wppc000004ldfwf8elsy	Coletes disponiveis	f	2	2026-08-17 13:56:57.214	2026-08-17 13:56:57.214
89b9c2ba-686b-4edb-9764-7ae29db4b09f	cmsx2wppc000004ldfwf8elsy	Campo confirmado	f	3	2026-08-17 13:56:57.214	2026-08-17 13:56:57.214
2f417412-827c-4478-b756-e6c8d14bb41e	cmsx2wppc000004ldfwf8elsy	Arbitragem confirmada	f	4	2026-08-17 13:56:57.214	2026-08-17 13:56:57.214
59f26e6c-478c-4645-91c1-fe8cdb795554	cmsx2wppc000004ldfwf8elsy	Adversario confirmado	f	5	2026-08-17 13:56:57.214	2026-08-17 13:56:57.214
ee4f992b-65a5-4abc-a1b8-da1160933821	cmt0aw2dv000004jyn5mtmejp	Uniforme confirmado	f	0	2026-08-19 16:23:17.745	2026-08-19 16:23:17.745
4e19e804-8368-4963-9fb2-dedaab47b983	cmt0aw2dv000004jyn5mtmejp	Bola disponivel	f	1	2026-08-19 16:23:17.745	2026-08-19 16:23:17.745
1649b11f-5a3a-4c39-9479-f39ba7af356a	cmt0aw2dv000004jyn5mtmejp	Coletes disponiveis	f	2	2026-08-19 16:23:17.745	2026-08-19 16:23:17.745
6dfea35d-272e-42d3-a30d-3a9daf064513	cmt0aw2dv000004jyn5mtmejp	Campo confirmado	f	3	2026-08-19 16:23:17.745	2026-08-19 16:23:17.745
7ecfd2dc-9cb2-494b-8b7a-8f726bd28a00	cmt0aw2dv000004jyn5mtmejp	Arbitragem confirmada	f	4	2026-08-19 16:23:17.745	2026-08-19 16:23:17.745
dbd4c3ff-3c91-41c4-90d9-24ffc0fd2a4b	cmt0aw2dv000004jyn5mtmejp	Adversario confirmado	f	5	2026-08-19 16:23:17.745	2026-08-19 16:23:17.745
\.
COPY public.match_coach_evaluations (id, "reportId", "playerId", "guestPlayerId", rating, feedback, "createdAt", "updatedAt", "teamSide") FROM stdin;
cmsdk6yjx000104lezjaznujj	cmsdk6yhg000004letw60oywn	cmpefcd1z000004lasd2r1kdh	\N	6	Fez bem a função de Lateral Esquerdo. Apoiou bem o ataque. Porem acho que faltou um pouco na parte defensiva.	2026-08-03 18:24:52.845	2026-08-03 18:33:23.031	A
cmsdk6ykg000204lecbo4aajc	cmsdk6yhg000004letw60oywn	cmpcqf47m000004l85vce0gfh	\N	5	No geral bem estável . Foi muito acionado no jogo. Porém a tomada de decisões deixou a desejar.	2026-08-03 18:24:52.864	2026-08-03 18:33:23.05	A
cmsdk6ykp000304lefm9u17vg	cmsdk6yhg000004letw60oywn	cmpcm7sgp000004l1fp9o52ky	\N	4	Fez um bom jogo no geral. Falhou na reta final do jogo erros cruciais.	2026-08-03 18:24:52.873	2026-08-03 18:33:23.059	A
cmsdk6yky000404lef3a30h82	cmsdk6yhg000004letw60oywn	cmpcoxez0000304l8g40zcfou	\N	5	Não jogou	2026-08-03 18:24:52.882	2026-08-03 18:33:23.066	A
cmsdk6yl6000504lesmdyqezi	cmsdk6yhg000004letw60oywn	cmpcopzu6000004jro3prr7ca	\N	5	Primeiro tempo não conseguiu exercer a função pedida. Entretanto quando entrou no segundo tempo fez bem o que foi pedido ajudando a criar boas oportunidades e ajudou a recompor defensivamente	2026-08-03 18:24:52.89	2026-08-03 18:33:23.074	A
cmsdk6ylf000604le8kq033xu	cmsdk6yhg000004letw60oywn	cmpcsehq1000104ibueo8dlm5	\N	5	Voltando agora. Precisa recuperar o ritmo de jogo	2026-08-03 18:24:52.899	2026-08-03 18:33:23.081	A
cmsdk6ylo000704le1f8co7m2	cmsdk6yhg000004letw60oywn	cmpcpt3n6000004l561lm2ja7	\N	6	Bom jogo. Errou pouco e tentou criar. Recebeu poucas bolas que permitisse fazer mais	2026-08-03 18:24:52.908	2026-08-03 18:33:23.089	A
cmsdk6ylx000804leqx4egbjk	cmsdk6yhg000004letw60oywn	cmpefcqj2000104ladlx0ysjz	\N	7	Primeiro tempo não conseguiu fazer a função necessária. Melhorou a partir dos 30 minutos e principal referencia no ataque. Fez um belo gol de falta que empatou o jogo	2026-08-03 18:24:52.917	2026-08-03 18:33:23.095	A
cmsdk6ym5000904levavv4t96	cmsdk6yhg000004letw60oywn	cmpn1o6et000004jrcnmw0gav	\N	8	Muito bem em campo. Enquanto estava em campo correu muito e ajudou a pressionar quando teve mais liberdade para subir. Além do gol de falta que iniciou a reação.	2026-08-03 18:24:52.925	2026-08-03 18:33:23.102	A
cmsdk6ymc000a04leptn7g3v3	cmsdk6yhg000004letw60oywn	cmpcpimjz000004jpcdqgfhfx	\N	5	Apareceu menos do que o esperado. Teve bons momentos. Porem se espera mais do que pode fazer. Reclamou muito quando foi substituído	2026-08-03 18:24:52.932	2026-08-03 18:33:23.11	A
cmsdk6yml000b04lemuprl33h	cmsdk6yhg000004letw60oywn	cmpefdkyx000304la3k3nq9p9	\N	6	Bom jogo no geral. Mas também cometeu alguns erros na defesa que não pode acontecer. Primeiro gol que levamos estava perto da bola mas não conseguiu tirar e tomamos um gol que não pode acontecer.	2026-08-03 18:24:52.941	2026-08-03 18:33:23.117	A
cmsg87bip000304ji3yxwod39	cmsg87bfo000004jixt5rpi5b	cmpefcqj2000104ladlx0ysjz	\N	6	Boa aparição em campo, muito bem no drible, mas não devemos insistir apenas no drible, por exemplo, conseguiu o primeiro drible? Massa! Conseguiu o segundo? Massa! Já solta a bola, não tenta carregar toda hora, isso vale para o primeiro drible conseguido e querendo partir para o segundo. Mas sua jogada de levar na velocidade para a linha de fundo é ótima.	2026-08-05 15:12:32.785	2026-08-05 15:15:16.004	A
cmsg87biw000404jirq49m0sq	cmsg87bfo000004jixt5rpi5b	cmpcpt3n6000004l561lm2ja7	\N	7	Entrou bem em jogo, querendo mostrar serviço. Parabéns, bons passes e cruzamentos. Marcação ok.	2026-08-05 15:12:32.792	2026-08-05 15:15:16.01	A
cmsg87bj3000504ji9rkshoxm	cmsg87bfo000004jixt5rpi5b	cmpcsehq1000104ibueo8dlm5	\N	7	Entrou bem em jogo, participando na criação de dois gols da nossa equipe. Ainda em falta de ritmo, mas preciso de uma melhor aparição defensiva.	2026-08-05 15:12:32.799	2026-08-05 15:15:16.015	A
cmsg87bja000604jig0ipig2p	cmsg87bfo000004jixt5rpi5b	cmpcm7sgp000004l1fp9o52ky	\N	5	Um pouco abaixo do que esperamos, mas em questão tática fez muito bem com as instruções passadas de fora, solicitei que quando estivéssemos com bola abrisse como se fosse um lateral e isso foi exatamente feito. Bons toques quebrando linha pelo meio. Restando apenas o nosso meio campo aparecendo mais.	2026-08-05 15:12:32.806	2026-08-05 15:15:16.02	A
cmsg87bhz000104ji8kc3kt7i	cmsg87bfo000004jixt5rpi5b	cmpcopzu6000004jro3prr7ca	\N	6	Boa aparição em campo, contemplado com gol. Demonstrou vontade em retornar para marcação (ponto positivo), no ataque faltou em alguns momentos a centralização no ataque dentro da área quando o ataque estava sendo pela esquerda (ponto a melhorar).	2026-08-05 15:12:32.76	2026-08-05 15:15:15.995	A
cmsg87bij000204jiqpe95fqk	cmsg87bfo000004jixt5rpi5b	cmpcpimjz000004jpcdqgfhfx	\N	6	Uma partida ok. O que eu alertaria seria mais na questão de segurar a bola por muito tempo, apesar de em alguns jogos já não segurar tanto.	2026-08-05 15:12:32.779	2026-08-05 15:15:16	A
cmsg87bjh000704jids1fc29k	cmsg87bfo000004jixt5rpi5b	cmpefcd1z000004lasd2r1kdh	\N	6	Fez um jogo regular, qualidade técnica muito boa. Pecando apenas na questão física, recomendaria focar na questão física, ajudaria bastante, pois qualidade já tem.	2026-08-05 15:12:32.813	2026-08-05 15:15:16.025	A
cmsg87bjn000804jiw8z7uq7n	cmsg87bfo000004jixt5rpi5b	cmpct2xp7000004jsv1ujpe1r	\N	6	Um ótimo zagueiro, com boa saída de bola e boa marcação. Eu particularmente esperava mais.	2026-08-05 15:12:32.819	2026-08-05 15:15:16.03	A
cmsg87bjw000904ji0z6taiam	cmsg87bfo000004jixt5rpi5b	cmpdz3jpw000004jvdohsd2ri	\N	5	Ainda em falta de ritmo, deixou a desejar em algumas situações, mas precisa de minutagem em campo, assim como precisa aparecer mais nos jogos. Vejo pontos positivos no atleta: altura, força física e rápido (fora de ritmo acaba que atrapalhando na questão da velocidade).	2026-08-05 15:12:32.828	2026-08-05 15:15:16.035	A
cmsg87bkb000a04jizn4jp8nc	cmsg87bfo000004jixt5rpi5b	cmpct94t9000204jsxeeckk3m	\N	5	Partida regular, coloquei como atacante, mas quando vi estava de volante. Acabou se lesionando na partida e então não conseguimos avaliar melhor o atleta. Mas a força de vontade e garra de está em campo já é o suficiente para melhores aparições.	2026-08-05 15:12:32.843	2026-08-05 15:15:16.04	A
cmsg87bkj000b04ji7p4fr84c	cmsg87bfo000004jixt5rpi5b	cmpefep0o000504laynrqmhnw	\N	6	Um bom zagueiro, com capacidade técnica boas, tais como, passe, marcação, cabeceio e cobertura defensiva. Uma partida ok, tendo em vista que no segundo tempo teve que ir ao gol.	2026-08-05 15:12:32.851	2026-08-05 15:15:16.045	A
cmsg87bkq000c04jiwtb42xxn	cmsg87bfo000004jixt5rpi5b	cmpn1o6et000004jrcnmw0gav	\N	6	Boa aparição, algumas vezes indo buscar a bola no goleiro e acabando que perdendo um volante de saída mais à frente dos zagueiros. Bom na marcação e boa finalização ao gol. Aconselho que nos passes dê de chapa e com força, evitando passes de três dedos que acabam perdendo a força.	2026-08-05 15:12:32.858	2026-08-05 15:15:16.05	A
cmsg87bkw000d04jiqu4wrbu7	cmsg87bfo000004jixt5rpi5b	cmpfk8v2v000704jlp8siky9e	\N	6	Boa aparição, capacidade ofensiva ok com uma finalização, e defensivo ok com bom poder de marcação.	2026-08-05 15:12:32.864	2026-08-05 15:15:16.055	A
cmsg87bl3000e04jicphdb02v	cmsg87bfo000004jixt5rpi5b	cmpcsds4s000004jmgpwku1j2	\N	5	Jogou poucos minutos, teve uma atenção a mais no camisa 22 na qual foi instruído para uma marcação x1. Jogando como zagueiro.	2026-08-05 15:12:32.871	2026-08-05 15:15:16.06	A
cmssegj2a000104jugfpcme75	cmssbijjq000104ji6sbxlziv	\N	cmspgjypm000004kysmvkqplm	7		2026-08-14 03:40:54.274	2026-08-14 03:40:54.274	A
cmssegj2u000204juz7thra8p	cmssbijjq000104ji6sbxlziv	cmpefep0o000504laynrqmhnw	\N	7		2026-08-14 03:40:54.294	2026-08-14 03:40:54.294	A
cmssegj3c000304juwe24sgf4	cmssbijjq000104ji6sbxlziv	cmpcm7sgp000004l1fp9o52ky	\N	7		2026-08-14 03:40:54.312	2026-08-14 03:40:54.312	A
cmssegj3q000404jub2i09plt	cmssbijjq000104ji6sbxlziv	cmpefdkyx000304la3k3nq9p9	\N	7		2026-08-14 03:40:54.326	2026-08-14 03:40:54.326	A
cmssegj43000504jua1cbvcfn	cmssbijjq000104ji6sbxlziv	cmpn1o6et000004jrcnmw0gav	\N	7		2026-08-14 03:40:54.339	2026-08-14 03:40:54.339	A
cmssegj4h000604jua6ccl3z0	cmssbijjq000104ji6sbxlziv	\N	cmspxfiuv000004jxpaj9z2h4	7		2026-08-14 03:40:54.353	2026-08-14 03:40:54.353	A
cmssegj4u000704juiopcq3vq	cmssbijjq000104ji6sbxlziv	cmpefcqj2000104ladlx0ysjz	\N	7		2026-08-14 03:40:54.366	2026-08-14 03:40:54.366	A
cmssegj56000804ju7dha6rs5	cmssbijjq000104ji6sbxlziv	cmpcopzu6000004jro3prr7ca	\N	7		2026-08-14 03:40:54.378	2026-08-14 03:40:54.378	A
cmssegj5i000904jurc8wv1ir	cmssbijjq000104ji6sbxlziv	cmpefcd1z000004lasd2r1kdh	\N	7		2026-08-14 03:40:54.39	2026-08-14 03:40:54.39	A
cmssegj5u000a04jux4vd4xkr	cmssbijjq000104ji6sbxlziv	cmpcsehq1000104ibueo8dlm5	\N	7		2026-08-14 03:40:54.402	2026-08-14 03:40:54.402	A
cmssegj66000b04juxhnqfa9d	cmssbijjq000104ji6sbxlziv	cmsd6v73x000004jupd8tbvon	\N	7		2026-08-14 03:40:54.414	2026-08-14 03:40:54.414	A
cmssegj6i000c04juqczp3k6k	cmssbijjq000104ji6sbxlziv	cmpfk8v2v000704jlp8siky9e	\N	7		2026-08-14 03:40:54.427	2026-08-14 03:40:54.427	A
cmssegj6v000d04jum67z8u1b	cmssbijjq000104ji6sbxlziv	cmpcqf47m000004l85vce0gfh	\N	7		2026-08-14 03:40:54.439	2026-08-14 03:40:54.439	A
cmssegj78000e04ju5it29n2m	cmssbijjq000104ji6sbxlziv	cmpcpimjz000004jpcdqgfhfx	\N	7		2026-08-14 03:40:54.452	2026-08-14 03:40:54.452	A
cmssegj7k000f04jua1hm27fd	cmssbijjq000104ji6sbxlziv	cmpcov8jd000004l8umh13pux	\N	7		2026-08-14 03:40:54.464	2026-08-14 03:40:54.464	A
cmssegj7x000g04justdh19pj	cmssbijjq000104ji6sbxlziv	cmpcpt3n6000004l561lm2ja7	\N	7		2026-08-14 03:40:54.478	2026-08-14 03:40:54.478	A
cmssegj8a000h04ju4mxm5l4k	cmssbijjq000104ji6sbxlziv	cmpcoxez0000304l8g40zcfou	\N	5	Não jogou	2026-08-14 03:40:54.49	2026-08-14 03:40:54.49	A
cmssegj8n000i04juf0ao6e7c	cmssbijjq000104ji6sbxlziv	cmpdz3jpw000004jvdohsd2ri	\N	7		2026-08-14 03:40:54.503	2026-08-14 03:40:54.503	A
cmssegj8z000j04jug5h5f5m3	cmssbijjq000104ji6sbxlziv	cmpcsds4s000004jmgpwku1j2	\N	7		2026-08-14 03:40:54.515	2026-08-14 03:40:54.515	A
cmssegj9b000k04jucaegk7b0	cmssbijjq000104ji6sbxlziv	\N	cmsrtfetn000004kwf027gs36	7		2026-08-14 03:40:54.527	2026-08-14 03:40:54.527	A
cmswi3p2z000e04jx94fkhte1	cmswi3oyf000004jx1y3o0tij	cmpefep0o000504laynrqmhnw	\N	8	Boa aparição, tanto defensivo quanto ofensivo, coroado com um belo gol de fora da área. Foi acertado a permanência em jogo e virou a partida.	2026-08-17 00:33:58.715	2026-08-17 15:38:01.56	A
cmswi3p0a000404jxv5zli8w7	cmswi3oyf000004jx1y3o0tij	cmpcoxez0000304l8g40zcfou	\N	7	Boa aparição dentro de suas limitações. Fez algumas pressões que foi solicitado.	2026-08-17 00:33:58.618	2026-08-17 15:38:01.476	A
cmswi3p36000f04jx9w77xdhj	cmswi3oyf000004jx1y3o0tij	cmpefcd1z000004lasd2r1kdh	\N	7	Boa aparição, fez o que foi solicitado na marcação. Dobrada com o meia aberto foi fundamental para o seu jogo defensivo. Apareceu ofensivamente muito bem quando exigido.	2026-08-17 00:33:58.722	2026-08-17 15:38:01.568	A
cmswi3p3c000g04jxwtyu0l25	cmswi3oyf000004jx1y3o0tij	cmpdz2mcq000104jr9xnhl4i0	\N	7	Boa aparição, ditando o jogo como tinha que ser. Mentalidade forte no jogo de hoje, peço que mantenha essa mentalidade nos próximos.	2026-08-17 00:33:58.728	2026-08-17 15:38:01.576	A
cmswi3p3i000h04jxip3gj7cu	cmswi3oyf000004jx1y3o0tij	cmst61960000104jvfkkcgzp4	\N	8	Boa aparição defensiva, roubou, desarmou e matou os adversários. Boas viradas de jogo, ditando o meio campo.	2026-08-17 00:33:58.734	2026-08-17 15:38:01.584	A
cmswi3p3q000i04jxghkeo4vz	cmswi3oyf000004jx1y3o0tij	\N	cmsv0y7sj000004kzopwy8py9	7	Boa aparição, levando um gol de bola parada, mas não comprometeu o jogo. Deu firmeza.	2026-08-17 00:33:58.742	2026-08-17 15:38:01.595	A
cmswi3oz9000104jx6pnnbj2u	cmswi3oyf000004jx1y3o0tij	cmrozuqv4000104l5tbza8qgy	\N	8	Boa aparição, fez o que foi solicitado no primeiro tempo como volante, bons passes quebrando linha e recuperação de bola.	2026-08-17 00:33:58.581	2026-08-17 15:38:01.448	A
cmswi3ozm000204jxajo1ieu2	cmswi3oyf000004jx1y3o0tij	cmpn1o6et000004jrcnmw0gav	\N	8	Boa aparição, coroado com uma assistência. Dedicação e intensidade extrema para o time.	2026-08-17 00:33:58.594	2026-08-17 15:38:01.458	A
cmswi3p03000304jx3hy2yflc	cmswi3oyf000004jx1y3o0tij	cmpct2xp7000004jsv1ujpe1r	\N	7	Boa aparição tanto pelo lado quanto centralizado. Boa cobertura, bom passe e bom desarme.	2026-08-17 00:33:58.611	2026-08-17 15:38:01.467	A
cmswi3p0q000504jxs2jd23j6	cmswi3oyf000004jx1y3o0tij	cmpefdkyx000304la3k3nq9p9	\N	7	Boa aparição, fazendo cobertura certa do ala e lutando até o fim pela bola. Boa crescente.	2026-08-17 00:33:58.634	2026-08-17 15:38:01.484	A
cmswi3p17000604jx5d4jmfd8	cmswi3oyf000004jx1y3o0tij	cmpcpimjz000004jpcdqgfhfx	\N	8	Uma boa partida, dedicação extrema e muito intenso. Coroado com um gol.	2026-08-17 00:33:58.651	2026-08-17 15:38:01.493	A
cmswi3p1g000704jxmsid9rgn	cmswi3oyf000004jx1y3o0tij	cmpcsds4s000004jmgpwku1j2	\N	7	Boa aparição, fez a dobrada solicitada com o ala na marcação e anulou o ataque pela direita.	2026-08-17 00:33:58.66	2026-08-17 15:38:01.502	A
cmswi3p1t000804jxjqxo02z3	cmswi3oyf000004jx1y3o0tij	cmpcov8jd000004l8umh13pux	\N	7	Boa aparição tanto de ala quanto de meio campo. Jogou como tinha sido solicitado.	2026-08-17 00:33:58.673	2026-08-17 15:38:01.511	A
cmswi3p20000904jxtm2gq7t0	cmswi3oyf000004jx1y3o0tij	cmsd6v73x000004jupd8tbvon	\N	7	Boa aparição, apesar de ter tido 10/15min em campo. Ganhando minutagem para brigar por vaga.	2026-08-17 00:33:58.68	2026-08-17 15:38:01.52	A
cmswi3p26000a04jxn4264q0l	cmswi3oyf000004jx1y3o0tij	cmpcpt3n6000004l561lm2ja7	\N	8	Boa aparição fazendo dobradinha com o ala e participando muito do ataque. Boa crescente. Contemplado com uma assistência.	2026-08-17 00:33:58.686	2026-08-17 15:38:01.527	A
cmswi3p2e000b04jx2lu2pct1	cmswi3oyf000004jx1y3o0tij	cmpefcqj2000104ladlx0ysjz	\N	7	Boa aparição, fez pela primeira vez o que tem sido solicitado que é voltar para marcar, conseguiu recuperar algumas bolas e participou ofensivamente.	2026-08-17 00:33:58.694	2026-08-17 15:38:01.535	A
cmswi3p2l000c04jx66dno9l7	cmswi3oyf000004jx1y3o0tij	cmpcm7sgp000004l1fp9o52ky	\N	7	Boa aparição, seguro na zaga e nos passes diretos e curto.	2026-08-17 00:33:58.701	2026-08-17 15:38:01.543	A
cmswi3p2s000d04jxak21xzjy	cmswi3oyf000004jx1y3o0tij	cmpcopzu6000004jro3prr7ca	\N	7	Boa aparição com movimentações toda hora do jogo, trocando posição com o ponta e efetivo ofensivamente. Boa crescente.	2026-08-17 00:33:58.708	2026-08-17 15:38:01.552	A
\.
COPY public.match_coach_reports (id, "matchId", "coachPlayerId", summary, "createdAt", "updatedAt", improvements, "startingStrategy", status, strengths, "substitutionsNotes", formation, "starterPlayerIds", substitutions, "coachPlayerBId", "formationB", "improvementsB", "starterPlayerIdsB", "startingStrategyB", "strengthsB", "substitutionsB", "substitutionsNotesB", "summaryB") FROM stdin;
cmsdk6yhg000004letw60oywn	cmrpgk0qh000004jttg2q1s11	cmpcoxez0000304l8g40zcfou	No geral foi um jogo bom.\nOnde tivemos boas chances de fazer os gols e até sair com a vitória.\nPorem uma sucessão de erros individuais prejudicaram o desempenho geral	2026-08-03 18:24:52.771	2026-08-03 18:33:23.001	Erros de posicionamento tático.\nMuitos jogadores saindo de posição deixando buracos o que acabou prejudicando o time	Ideia de jogar em uma formação mais tradicional para entender o desempenho do time e dos atletas.\nConseguir entender como os adversários iriam jogar.	PUBLISHED	O time conseguiu se impor principalmente quando o time teve domínio do meio campo.\nEstivemos perdendo de 2x0 mas foi possível buscar o empate devido a entrega dos jogadores.\n	Depois foram feitas substituições com retorno de jogadores para poder manter o time o mais descansado possível. 	4-4-2 (Linhas Paralelas)	["cmpcqf47m000004l85vce0gfh", "cmpefdkyx000304la3k3nq9p9", "cmpcm7sgp000004l1fp9o52ky", "cmpefcd1z000004lasd2r1kdh", "cmpn1o6et000004jrcnmw0gav", "cmpefcqj2000104ladlx0ysjz", "cmpcpimjz000004jpcdqgfhfx", "cmpcsehq1000104ibueo8dlm5", "cmpcopzu6000004jro3prr7ca", "cmpcpt3n6000004l561lm2ja7", "cms8wyiin000004l5g27tpmk2"]	[{"minute": "18' 1ºT", "reason": "Marcos esta voltando a jogar. Faltava ritmo de jogo. Feita a troca para poder melhorar a movimentação do meio campo", "playerInId": "cms9gj2zl000004k15sk7bual", "playerOutId": "cmpcsehq1000104ibueo8dlm5"}, {"minute": "28' 1ºT", "reason": "Retirada de um atacante para aumentar a quantidade de meias e tentar pressionar a saída de bola do adversário .", "playerInId": "cms9gjsy7000004jpqr11nr9h", "playerOutId": "cmpcopzu6000004jro3prr7ca"}, {"minute": "0' 2ºT", "reason": "Troca de pontas para dar mais oxigênio ao time", "playerInId": "cms9gingl000004la9tsynrto", "playerOutId": "cmpcpt3n6000004l561lm2ja7"}]	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmswi3oyf000004jx1y3o0tij	cmsd9fo2a000004l80caeqs67	cmpcsds4s000004jmgpwku1j2	Jogo coletivo nota 9, peço que comprem a ideia passada para que possamos mudar nossa fase.	2026-08-17 00:33:58.551	2026-08-17 15:38:01.426	Trabalhar rondos 3x3, 4x4 para trabalhar a posse de bola e dominio.	A ideia foi defender como nunca no primeiro tempo e não levar gol infelizmente tomamos um gol de bola parada, mas com bola rolando não sofremos ameaças. Segundo tempo foi solicitado ofender como nunca, objetivo de não levar gols cumprida e de fazer 1/2 gols, fizemos 2.	PUBLISHED	Coletivo no jogo de hoje foi surreal de bom, tanto primeiro tempo quanto segundo tempo, espero e creio que permaneça como hoje.		5-4-1 (Linha Quinquenal)	["cmsv0y7sj000004kzopwy8py9", "cmpefdkyx000304la3k3nq9p9", "cmpct2xp7000004jsv1ujpe1r", "cmpefep0o000504laynrqmhnw", "cmpcov8jd000004l8umh13pux", "cmpefcd1z000004lasd2r1kdh", "cmrozuqv4000104l5tbza8qgy", "cmst61960000104jvfkkcgzp4", "cmpcsds4s000004jmgpwku1j2", "cmpcpt3n6000004l561lm2ja7", "cmpcoxez0000304l8g40zcfou"]	[]	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmssbijjq000104ji6sbxlziv	cmsnjw3d4000004l73omej79w	cmpcsds4s000004jmgpwku1j2	Jogo patético. Mais um jogo patético.	2026-08-14 02:18:29.366	2026-08-14 03:40:54.243	Coletivo tem que ser melhorado, e principalmente o pedido tático do jogo em questão que já está definido de momento.		PUBLISHED	Individualmente tiro vários pontos fortes observados	Alguns entraram novamente. (Joaquim, Kaian, Darlan, Matheus)	3-4-3 (Tripla de Ataque)	["cmspgjypm000004kysmvkqplm", "cmpcm7sgp000004l1fp9o52ky", "cmpefep0o000504laynrqmhnw", "cmpefdkyx000304la3k3nq9p9", "cmpefcd1z000004lasd2r1kdh", "cmpcsehq1000104ibueo8dlm5", "cmspxfiuv000004jxpaj9z2h4", "cmpn1o6et000004jrcnmw0gav", "cmpcpt3n6000004l561lm2ja7", "cmpcopzu6000004jro3prr7ca", "cmpfk8v2v000704jlp8siky9e"]	[{"minute": "15' 2ºT", "reason": "", "playerInId": "cmpefcqj2000104ladlx0ysjz", "playerOutId": "cmpcpt3n6000004l561lm2ja7"}, {"minute": "15' 2ºT", "reason": "", "playerInId": "cmpcqf47m000004l85vce0gfh", "playerOutId": "cmpcsehq1000104ibueo8dlm5"}, {"minute": "15' 2ºT", "reason": "", "playerInId": "cmpcsds4s000004jmgpwku1j2", "playerOutId": "cmpefep0o000504laynrqmhnw"}, {"minute": "15' 2ºT", "reason": "", "playerInId": "cmpcpimjz000004jpcdqgfhfx", "playerOutId": "cmpcopzu6000004jro3prr7ca"}, {"minute": "15' 2ºT", "reason": "", "playerInId": "cmpcov8jd000004l8umh13pux", "playerOutId": "cmpfk8v2v000704jlp8siky9e"}, {"minute": "15' 2ºT", "reason": "", "playerInId": "cmsd6v73x000004jupd8tbvon", "playerOutId": "cmpefdkyx000304la3k3nq9p9"}, {"minute": "15' 2ºT", "reason": "", "playerInId": "cmpdz3jpw000004jvdohsd2ri", "playerOutId": "cmpcm7sgp000004l1fp9o52ky"}]	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmsg87bfo000004jixt5rpi5b	cmsadtjr8000004joiy5e4pc7	cmpcsds4s000004jmgpwku1j2	Uma partida fraca coletivamente, moral precisa ser reconquistada.	2026-08-05 15:12:32.676	2026-08-05 15:15:15.99	O coletivo que está muito abaixo.		PUBLISHED	Algumas movimentações individuais.		3-5-2 (Com Alas Agressivos)	["cmpcm7sgp000004l1fp9o52ky", "cmpct2xp7000004jsv1ujpe1r", "cmpefep0o000504laynrqmhnw", "cmpfk8v2v000704jlp8siky9e", "cmpn1o6et000004jrcnmw0gav", "cmpcpimjz000004jpcdqgfhfx", "cmpefcqj2000104ladlx0ysjz", "cmpcopzu6000004jro3prr7ca", "cmsc66qh4000004kvzi0f1rz3", "cmpcsehq1000104ibueo8dlm5", "cmpefcd1z000004lasd2r1kdh"]	[]	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.
COPY public.match_equipments (id, "matchId", "equipmentId", name, "quantitySent", "quantityReturned", returned, notes, "createdAt", "updatedAt") FROM stdin;
\.
COPY public.match_lineup_selections (id, "matchId", "playerId", role, "sortOrder", "createdAt", "updatedAt", "fieldX", "fieldY", "guestPlayerId", "teamSide") FROM stdin;
cmrnyi69m000004jl5ddioxde	cmrkxjsua000004jtqvbnfwac	cmpcqf47m000004l85vce0gfh	STARTER	0	2026-07-16 20:23:30.106	2026-07-16 20:23:30.106	82	31	\N	A
cmrnyi69m000104jlfgpjwc7a	cmrkxjsua000004jtqvbnfwac	cmpefdkyx000304la3k3nq9p9	STARTER	1	2026-07-16 20:23:30.106	2026-07-16 20:23:30.106	61	31	\N	A
cmrnyi69m000204jlmmws2qay	cmrkxjsua000004jtqvbnfwac	cmpcov8jd000004l8umh13pux	STARTER	2	2026-07-16 20:23:30.106	2026-07-16 20:23:30.106	66	46	\N	A
cmrnyi69m000304jlsknwfm3y	cmrkxjsua000004jtqvbnfwac	cmpefcd1z000004lasd2r1kdh	STARTER	3	2026-07-16 20:23:30.106	2026-07-16 20:23:30.106	18	31	\N	A
cmrnyi69m000404jlgcqu5vxk	cmrkxjsua000004jtqvbnfwac	cmpdz2mcq000104jr9xnhl4i0	STARTER	4	2026-07-16 20:23:30.106	2026-07-16 20:23:30.106	66	60	\N	A
cmrnyi69m000504jl1t3087we	cmrkxjsua000004jtqvbnfwac	cmpcm7sgp000004l1fp9o52ky	STARTER	5	2026-07-16 20:23:30.106	2026-07-16 20:23:30.106	39	31	\N	A
cmrnyi69m000604jl13n6ycmv	cmrkxjsua000004jtqvbnfwac	cmpn1o6et000004jrcnmw0gav	STARTER	6	2026-07-16 20:23:30.106	2026-07-16 20:23:30.106	34	46	\N	A
cmrnyi69m000704jl415xpt1s	cmrkxjsua000004jtqvbnfwac	cmpefcqj2000104ladlx0ysjz	STARTER	7	2026-07-16 20:23:30.106	2026-07-16 20:23:30.106	34	60	\N	A
cmrnyi69m000804jl5kytz2ja	cmrkxjsua000004jtqvbnfwac	cmpct94t9000204jsxeeckk3m	STARTER	8	2026-07-16 20:23:30.106	2026-07-16 20:23:30.106	50	14	\N	A
cmrnyi69m000904jlo6mc7438	cmrkxjsua000004jtqvbnfwac	cmpcopzu6000004jro3prr7ca	STARTER	9	2026-07-16 20:23:30.106	2026-07-16 20:23:30.106	50	81	\N	A
cmrnyi69m000a04jlz4l6syq4	cmrkxjsua000004jtqvbnfwac	cmpcpimjz000004jpcdqgfhfx	STARTER	10	2026-07-16 20:23:30.106	2026-07-16 20:23:30.106	50	46	\N	A
cmrnyi69m000b04jl2h21h6ap	cmrkxjsua000004jtqvbnfwac	cmpfk8v2v000704jlp8siky9e	BENCH	0	2026-07-16 20:23:30.106	2026-07-16 20:23:30.106	\N	\N	\N	A
cmrnyi69m000c04jliybx61s4	cmrkxjsua000004jtqvbnfwac	\N	BENCH	1	2026-07-16 20:23:30.106	2026-07-16 20:23:30.106	\N	\N	cmrnwl1mg000104ldorxpquij	A
cmrnyi69m000d04jlufv0ecgo	cmrkxjsua000004jtqvbnfwac	\N	BENCH	2	2026-07-16 20:23:30.106	2026-07-16 20:23:30.106	\N	\N	cmrnwdiee000004ldvhn5k2ft	A
cmrnyi69m000e04jlia2crpoc	cmrkxjsua000004jtqvbnfwac	cmpcsds4s000004jmgpwku1j2	BENCH	3	2026-07-16 20:23:30.106	2026-07-16 20:23:30.106	\N	\N	\N	A
cmrnyi69m000f04jlogdjh5aa	cmrkxjsua000004jtqvbnfwac	cmpcoxez0000304l8g40zcfou	BENCH	4	2026-07-16 20:23:30.106	2026-07-16 20:23:30.106	\N	\N	\N	A
cmrnyi69m000g04jlnxu866tr	cmrkxjsua000004jtqvbnfwac	cmpefep0o000504laynrqmhnw	BENCH	5	2026-07-16 20:23:30.106	2026-07-16 20:23:30.106	\N	\N	\N	A
cmrnyi69m000h04jlv6v9q0sk	cmrkxjsua000004jtqvbnfwac	cmpcpt3n6000004l561lm2ja7	BENCH	6	2026-07-16 20:23:30.106	2026-07-16 20:23:30.106	\N	\N	\N	A
cmpijh3li000004i6o6gznj8r	cmpfezhxy000004lblpwmx62l	cmpefdukz000404lanevrsp34	STARTER	0	2026-05-23 16:04:30.198	2026-05-23 16:04:30.198	50	14	\N	A
cmpijh3li000104i67ha9z503	cmpfezhxy000004lblpwmx62l	cmpefdkyx000304la3k3nq9p9	STARTER	1	2026-05-23 16:04:30.198	2026-05-23 16:04:30.198	68	32	\N	A
cmpijh3li000204i6g4tp79ie	cmpfezhxy000004lblpwmx62l	cmpcm7sgp000004l1fp9o52ky	STARTER	2	2026-05-23 16:04:30.198	2026-05-23 16:04:30.198	50	30	\N	A
cmpijh3li000304i6es8nwkvg	cmpfezhxy000004lblpwmx62l	cmpefcd1z000004lasd2r1kdh	STARTER	3	2026-05-23 16:04:30.198	2026-05-23 16:04:30.198	14	41	\N	A
cmpijh3li000404i6liuww18r	cmpfezhxy000004lblpwmx62l	cmpcsds4s000004jmgpwku1j2	STARTER	4	2026-05-23 16:04:30.198	2026-05-23 16:04:30.198	86	41	\N	A
cmpijh3li000504i60yhyjuxd	cmpfezhxy000004lblpwmx62l	cmpdz2mcq000104jr9xnhl4i0	STARTER	5	2026-05-23 16:04:30.198	2026-05-23 16:04:30.198	66	60	\N	A
cmpijh3li000604i60gwvublv	cmpfezhxy000004lblpwmx62l	cmpefcqj2000104ladlx0ysjz	STARTER	6	2026-05-23 16:04:30.198	2026-05-23 16:04:30.198	22	60	\N	A
cmpijh3li000704i6shqbsrw6	cmpfezhxy000004lblpwmx62l	cmpcpt3n6000004l561lm2ja7	STARTER	7	2026-05-23 16:04:30.198	2026-05-23 16:04:30.198	58	46	\N	A
cmpijh3lv000804i6f0nd61hi	cmpfezhxy000004lblpwmx62l	cmpcpimjz000004jpcdqgfhfx	STARTER	8	2026-05-23 16:04:30.198	2026-05-23 16:04:30.198	34	46	\N	A
cmpijh3lv000904i6rc6a0vgu	cmpfezhxy000004lblpwmx62l	cmpfk8v2v000704jlp8siky9e	STARTER	9	2026-05-23 16:04:30.198	2026-05-23 16:04:30.198	42	74	\N	A
cmpijh3lv000a04i6bqyspj81	cmpfezhxy000004lblpwmx62l	cmpefep0o000504laynrqmhnw	STARTER	10	2026-05-23 16:04:30.198	2026-05-23 16:04:30.198	32	32	\N	A
cmpijh3lv000b04i6iif6dhpu	cmpfezhxy000004lblpwmx62l	cmpdz3jpw000004jvdohsd2ri	BENCH	0	2026-05-23 16:04:30.198	2026-05-23 16:04:30.198	\N	\N	\N	A
cmpijh3lv000c04i6vxiv8f9l	cmpfezhxy000004lblpwmx62l	cmpcoxez0000304l8g40zcfou	BENCH	1	2026-05-23 16:04:30.198	2026-05-23 16:04:30.198	\N	\N	\N	A
cmpol9ufs000104l78heb3m62	cmpkl4qyr000004l41n642701	\N	STARTER	0	2026-05-27 21:41:28.024	2026-05-27 21:41:28.024	50	14	cmpohz21c000004jx24id9rok	A
cmpol9ufs000204l7oswl3ool	cmpkl4qyr000004l41n642701	\N	STARTER	1	2026-05-27 21:41:28.024	2026-05-27 21:41:28.024	60	30	cmpol69a5000004l7wi5vd4ad	A
cmpol9ufs000304l7vfkwll35	cmpkl4qyr000004l41n642701	cmpcm7sgp000004l1fp9o52ky	STARTER	2	2026-05-27 21:41:28.024	2026-05-27 21:41:28.024	40	30	\N	A
cmpol9ufs000404l76qkqbbpx	cmpkl4qyr000004l41n642701	cmpcsds4s000004jmgpwku1j2	STARTER	3	2026-05-27 21:41:28.024	2026-05-27 21:41:28.024	86	41	\N	A
cmpol9ufs000504l7ybhbh0ac	cmpkl4qyr000004l41n642701	cmpefcd1z000004lasd2r1kdh	STARTER	4	2026-05-27 21:41:28.024	2026-05-27 21:41:28.024	20	38	\N	A
cmpol9ufs000604l7c81m4p3l	cmpkl4qyr000004l41n642701	cmpcqf47m000004l85vce0gfh	STARTER	5	2026-05-27 21:41:28.024	2026-05-27 21:41:28.024	76	30	\N	A
cmpol9ufs000704l7zhs8c3zh	cmpkl4qyr000004l41n642701	cmpcpimjz000004jpcdqgfhfx	STARTER	6	2026-05-27 21:41:28.024	2026-05-27 21:41:28.024	58	46	\N	A
cmpol9ufs000804l7jxxsg6t7	cmpkl4qyr000004l41n642701	cmpcov8jd000004l8umh13pux	STARTER	7	2026-05-27 21:41:28.024	2026-05-27 21:41:28.024	42	46	\N	A
cmpol9ufs000904l7deim2e7a	cmpkl4qyr000004l41n642701	cmpefcqj2000104ladlx0ysjz	STARTER	8	2026-05-27 21:41:28.024	2026-05-27 21:41:28.024	34	60	\N	A
cmpol9ufs000a04l7okd2t2oh	cmpkl4qyr000004l41n642701	cmpcopzu6000004jro3prr7ca	STARTER	9	2026-05-27 21:41:28.024	2026-05-27 21:41:28.024	50	81	\N	A
cmpol9ufs000b04l77te7vcel	cmpkl4qyr000004l41n642701	cmpdz2mcq000104jr9xnhl4i0	STARTER	10	2026-05-27 21:41:28.024	2026-05-27 21:41:28.024	66	60	\N	A
cmpol9ufs000c04l7swwvkyiw	cmpkl4qyr000004l41n642701	cmpct94t9000204jsxeeckk3m	BENCH	0	2026-05-27 21:41:28.024	2026-05-27 21:41:28.024	\N	\N	\N	A
cmpol9ufs000d04l71z39ezuy	cmpkl4qyr000004l41n642701	cmpn1o6et000004jrcnmw0gav	BENCH	1	2026-05-27 21:41:28.024	2026-05-27 21:41:28.024	\N	\N	\N	A
cmpol9ufs000e04l77vspojot	cmpkl4qyr000004l41n642701	cmpcsehq1000104ibueo8dlm5	BENCH	2	2026-05-27 21:41:28.024	2026-05-27 21:41:28.024	\N	\N	\N	A
cmpol9ufs000f04l7umuw06xk	cmpkl4qyr000004l41n642701	cmpdz3jpw000004jvdohsd2ri	BENCH	3	2026-05-27 21:41:28.024	2026-05-27 21:41:28.024	\N	\N	\N	A
cmpol9ufs000g04l73ytei9tu	cmpkl4qyr000004l41n642701	cmpefep0o000504laynrqmhnw	BENCH	4	2026-05-27 21:41:28.024	2026-05-27 21:41:28.024	\N	\N	\N	A
cmpol9ufs000h04l7y4ngqaag	cmpkl4qyr000004l41n642701	cmpg41k59000004l7521hfcn4	BENCH	5	2026-05-27 21:41:28.024	2026-05-27 21:41:28.024	\N	\N	\N	A
cmrw38cul000004kvd2wxddjx	cmrkxlng5000004jofpanlfev	cmpcpimjz000004jpcdqgfhfx	STARTER	0	2026-07-22 12:57:59.565	2026-07-22 12:57:59.565	66	60	\N	A
cmrw38cul000104kv8hvxt9gk	cmrkxlng5000004jofpanlfev	cmpefcqj2000104ladlx0ysjz	STARTER	1	2026-07-22 12:57:59.565	2026-07-22 12:57:59.565	50	74	\N	A
cmrw38cul000204kv0wzipkt6	cmrkxlng5000004jofpanlfev	cmpcsds4s000004jmgpwku1j2	STARTER	2	2026-07-22 12:57:59.565	2026-07-22 12:57:59.565	86	47	\N	A
cmrw38cul000304kvus9tfaxp	cmrkxlng5000004jofpanlfev	cmpefcd1z000004lasd2r1kdh	STARTER	3	2026-07-22 12:57:59.565	2026-07-22 12:57:59.565	14	47	\N	A
cmrw38cul000404kvzp72zflx	cmrkxlng5000004jofpanlfev	cmpcpt3n6000004l561lm2ja7	STARTER	4	2026-07-22 12:57:59.565	2026-07-22 12:57:59.565	68	38	\N	A
cmrw38cul000504kvfea6brj6	cmrkxlng5000004jofpanlfev	cmpcm7sgp000004l1fp9o52ky	STARTER	5	2026-07-22 12:57:59.565	2026-07-22 12:57:59.565	50	36	\N	A
cmrw38cul000604kvm7zogwtb	cmrkxlng5000004jofpanlfev	cmpefep0o000504laynrqmhnw	STARTER	6	2026-07-22 12:57:59.565	2026-07-22 12:57:59.565	32	38	\N	A
cmrw38cul000704kv2fn839mn	cmrkxlng5000004jofpanlfev	cmpdz2mcq000104jr9xnhl4i0	STARTER	7	2026-07-22 12:57:59.565	2026-07-22 12:57:59.565	22	60	\N	A
cmrw38cul000804kvskhu5b21	cmrkxlng5000004jofpanlfev	cmrozuqv4000104l5tbza8qgy	STARTER	8	2026-07-22 12:57:59.565	2026-07-22 12:57:59.565	34	46	\N	A
cmrw38cul000904kvw807o8ne	cmrkxlng5000004jofpanlfev	cmpn1o6et000004jrcnmw0gav	STARTER	9	2026-07-22 12:57:59.565	2026-07-22 12:57:59.565	58	47	\N	A
cmrw38cul000a04kvmaz5mal2	cmrkxlng5000004jofpanlfev	cmpcopzu6000004jro3prr7ca	BENCH	0	2026-07-22 12:57:59.565	2026-07-22 12:57:59.565	\N	\N	\N	A
cmrw38cum000b04kvpl8m2v58	cmrkxlng5000004jofpanlfev	cmpefdkyx000304la3k3nq9p9	BENCH	1	2026-07-22 12:57:59.565	2026-07-22 12:57:59.565	\N	\N	\N	A
cmrw38cum000c04kv85tz36rb	cmrkxlng5000004jofpanlfev	cmpcqf47m000004l85vce0gfh	BENCH	2	2026-07-22 12:57:59.565	2026-07-22 12:57:59.565	\N	\N	\N	A
cmrw38cum000d04kvsgzyog09	cmrkxlng5000004jofpanlfev	cmpct94t9000204jsxeeckk3m	BENCH	3	2026-07-22 12:57:59.565	2026-07-22 12:57:59.565	\N	\N	\N	A
cmrw38cum000e04kvlin2wxy5	cmrkxlng5000004jofpanlfev	cmpfk8v2v000704jlp8siky9e	BENCH	4	2026-07-22 12:57:59.565	2026-07-22 12:57:59.565	\N	\N	\N	A
cmsrth13h000004l4bie3cuc0	cmsnjw3d4000004l73omej79w	\N	STARTER	0	2026-08-13 17:53:25.709	2026-08-13 17:53:25.709	50	14	cmspgjypm000004kysmvkqplm	A
cmsrth13h000104l4r5a1136r	cmsnjw3d4000004l73omej79w	cmpefep0o000504laynrqmhnw	STARTER	1	2026-08-13 17:53:25.709	2026-08-13 17:53:25.709	32	32	\N	A
cmsrth13h000204l4lji090fw	cmsnjw3d4000004l73omej79w	cmpcm7sgp000004l1fp9o52ky	STARTER	2	2026-08-13 17:53:25.709	2026-08-13 17:53:25.709	50	30	\N	A
cmsrth13h000304l4q1kow0zf	cmsnjw3d4000004l73omej79w	cmpefdkyx000304la3k3nq9p9	STARTER	3	2026-08-13 17:53:25.709	2026-08-13 17:53:25.709	68	32	\N	A
cmsrth13h000404l4grg1zoed	cmsnjw3d4000004l73omej79w	cmpn1o6et000004jrcnmw0gav	STARTER	4	2026-08-13 17:53:25.709	2026-08-13 17:53:25.709	34	52	\N	A
cmsrth13h000504l4grinchcd	cmsnjw3d4000004l73omej79w	\N	STARTER	5	2026-08-13 17:53:25.709	2026-08-13 17:53:25.709	66	52	cmspxfiuv000004jxpaj9z2h4	A
cmsrth13h000604l4pssyc9lq	cmsnjw3d4000004l73omej79w	cmpefcqj2000104ladlx0ysjz	STARTER	6	2026-08-13 17:53:25.709	2026-08-13 17:53:25.709	34	74	\N	A
cmsrth13h000704l4jzw8p1gk	cmsnjw3d4000004l73omej79w	cmpcopzu6000004jro3prr7ca	STARTER	7	2026-08-13 17:53:25.709	2026-08-13 17:53:25.709	66	74	\N	A
cmsrth13h000804l4fdo2p08v	cmsnjw3d4000004l73omej79w	cmpefcd1z000004lasd2r1kdh	STARTER	8	2026-08-13 17:53:25.709	2026-08-13 17:53:25.709	14	41	\N	A
cmsrth13h000904l4ss2urch2	cmsnjw3d4000004l73omej79w	cmpcsehq1000104ibueo8dlm5	STARTER	9	2026-08-13 17:53:25.709	2026-08-13 17:53:25.709	86	41	\N	A
cmsrth13h000a04l4gl3i8x0d	cmsnjw3d4000004l73omej79w	cmsd6v73x000004jupd8tbvon	STARTER	10	2026-08-13 17:53:25.709	2026-08-13 17:53:25.709	50	80	\N	A
cmsrth13h000b04l4af1ww3in	cmsnjw3d4000004l73omej79w	cmpfk8v2v000704jlp8siky9e	BENCH	0	2026-08-13 17:53:25.709	2026-08-13 17:53:25.709	\N	\N	\N	A
cmsrth13h000c04l41nleu6tn	cmsnjw3d4000004l73omej79w	cmpcqf47m000004l85vce0gfh	BENCH	1	2026-08-13 17:53:25.709	2026-08-13 17:53:25.709	\N	\N	\N	A
cmsrth13h000d04l42rieyrxl	cmsnjw3d4000004l73omej79w	cmpcpimjz000004jpcdqgfhfx	BENCH	2	2026-08-13 17:53:25.709	2026-08-13 17:53:25.709	\N	\N	\N	A
cmsrth13h000e04l4lat3gtnr	cmsnjw3d4000004l73omej79w	cmpcov8jd000004l8umh13pux	BENCH	3	2026-08-13 17:53:25.709	2026-08-13 17:53:25.709	\N	\N	\N	A
cmsrth13h000f04l4yolb2h6b	cmsnjw3d4000004l73omej79w	cmpcpt3n6000004l561lm2ja7	BENCH	4	2026-08-13 17:53:25.709	2026-08-13 17:53:25.709	\N	\N	\N	A
cmsrth13h000g04l42xqb3ptz	cmsnjw3d4000004l73omej79w	cmpcoxez0000304l8g40zcfou	BENCH	5	2026-08-13 17:53:25.709	2026-08-13 17:53:25.709	\N	\N	\N	A
cmsrth13h000h04l4jml22vyb	cmsnjw3d4000004l73omej79w	cmpdz3jpw000004jvdohsd2ri	BENCH	6	2026-08-13 17:53:25.709	2026-08-13 17:53:25.709	\N	\N	\N	A
cmsrth13h000i04l41k513ktc	cmsnjw3d4000004l73omej79w	cmpcsds4s000004jmgpwku1j2	BENCH	7	2026-08-13 17:53:25.709	2026-08-13 17:53:25.709	\N	\N	\N	A
cmsrth13h000j04l4uem4qu6m	cmsnjw3d4000004l73omej79w	\N	BENCH	8	2026-08-13 17:53:25.709	2026-08-13 17:53:25.709	\N	\N	cmsrtfetn000004kwf027gs36	A
cmt5w4278000004lj4mnlcmiw	cmt0aw2dv000004jyn5mtmejp	cmsd6v73x000004jupd8tbvon	STARTER	0	2026-08-23 14:16:05.924	2026-08-23 14:16:05.924	\N	\N	\N	A
cmt5w4278000104ljyhnssvl5	cmt0aw2dv000004jyn5mtmejp	cmpcsds4s000004jmgpwku1j2	STARTER	1	2026-08-23 14:16:05.924	2026-08-23 14:16:05.924	\N	\N	\N	A
cmt5w4278000204lj43gvb0w5	cmt0aw2dv000004jyn5mtmejp	cmpefep0o000504laynrqmhnw	STARTER	2	2026-08-23 14:16:05.924	2026-08-23 14:16:05.924	\N	\N	\N	A
cmt5w4278000304lj3flyw02r	cmt0aw2dv000004jyn5mtmejp	cmpcpimjz000004jpcdqgfhfx	STARTER	3	2026-08-23 14:16:05.924	2026-08-23 14:16:05.924	\N	\N	\N	A
cmt5w4278000404ljw2d27ov8	cmt0aw2dv000004jyn5mtmejp	cmpcoxez0000304l8g40zcfou	STARTER	4	2026-08-23 14:16:05.924	2026-08-23 14:16:05.924	\N	\N	\N	A
cmt5w4278000504ljs272mfra	cmt0aw2dv000004jyn5mtmejp	cmpcopzu6000004jro3prr7ca	STARTER	5	2026-08-23 14:16:05.924	2026-08-23 14:16:05.924	\N	\N	\N	A
cmt5w4278000604lj47n83jgn	cmt0aw2dv000004jyn5mtmejp	cmpdz3jpw000004jvdohsd2ri	STARTER	6	2026-08-23 14:16:05.924	2026-08-23 14:16:05.924	\N	\N	\N	A
cmt5w4278000704lje0i0fzky	cmt0aw2dv000004jyn5mtmejp	cmpct94t9000204jsxeeckk3m	STARTER	7	2026-08-23 14:16:05.924	2026-08-23 14:16:05.924	\N	\N	\N	A
cmt5w4278000804lj86f1ynd2	cmt0aw2dv000004jyn5mtmejp	\N	STARTER	8	2026-08-23 14:16:05.924	2026-08-23 14:16:05.924	\N	\N	cmt55yeme000204jq2ea6h0tu	A
cmt5w4278000904ljdfibt1p5	cmt0aw2dv000004jyn5mtmejp	cmpcqf47m000004l85vce0gfh	STARTER	9	2026-08-23 14:16:05.924	2026-08-23 14:16:05.924	\N	\N	\N	A
cmt5w4278000a04ljc66cn5cx	cmt0aw2dv000004jyn5mtmejp	\N	STARTER	10	2026-08-23 14:16:05.924	2026-08-23 14:16:05.924	\N	\N	cmt5ve5xc000204juox35y5w2	A
cmt5w4278000b04ljx7hqmhz3	cmt0aw2dv000004jyn5mtmejp	\N	STARTER	11	2026-08-23 14:16:05.924	2026-08-23 14:16:05.924	\N	\N	cmt5vj0a7000004jv02xu8nzj	A
cmt5w4278000c04lj0uaojn7h	cmt0aw2dv000004jyn5mtmejp	\N	STARTER	12	2026-08-23 14:16:05.924	2026-08-23 14:16:05.924	\N	\N	cmt5vz0k9000004ldxwbo68sq	A
cmt5w4278000d04ljlskoibgt	cmt0aw2dv000004jyn5mtmejp	cmpn1o6et000004jrcnmw0gav	STARTER	13	2026-08-23 14:16:05.924	2026-08-23 14:16:05.924	\N	\N	\N	B
cmt5w4278000e04ljatpm8tom	cmt0aw2dv000004jyn5mtmejp	cmpct2xp7000004jsv1ujpe1r	STARTER	14	2026-08-23 14:16:05.924	2026-08-23 14:16:05.924	\N	\N	\N	B
cmt5w4278000f04ljr1xx767c	cmt0aw2dv000004jyn5mtmejp	cmpcm7sgp000004l1fp9o52ky	STARTER	15	2026-08-23 14:16:05.924	2026-08-23 14:16:05.924	\N	\N	\N	B
cmt5w4278000g04lj0ogq7614	cmt0aw2dv000004jyn5mtmejp	cmpdz2mcq000104jr9xnhl4i0	STARTER	16	2026-08-23 14:16:05.924	2026-08-23 14:16:05.924	\N	\N	\N	B
cmt5w4278000h04lju3le63ll	cmt0aw2dv000004jyn5mtmejp	cmst61960000104jvfkkcgzp4	STARTER	17	2026-08-23 14:16:05.924	2026-08-23 14:16:05.924	\N	\N	\N	B
cmt5w4278000i04ljastuejad	cmt0aw2dv000004jyn5mtmejp	cmpefcd1z000004lasd2r1kdh	STARTER	18	2026-08-23 14:16:05.924	2026-08-23 14:16:05.924	\N	\N	\N	B
cmt5w4278000j04ljd1wx9g4q	cmt0aw2dv000004jyn5mtmejp	cmpcov8jd000004l8umh13pux	STARTER	19	2026-08-23 14:16:05.924	2026-08-23 14:16:05.924	\N	\N	\N	B
cmt5w4278000k04lj2zhi1tde	cmt0aw2dv000004jyn5mtmejp	cmpefcqj2000104ladlx0ysjz	STARTER	20	2026-08-23 14:16:05.924	2026-08-23 14:16:05.924	\N	\N	\N	B
\.
COPY public.match_live_events (id, "matchLiveId", type, minute, half, "playerId", "guestPlayerId", description, "createdAt") FROM stdin;
cmpopsbey000004jv14lt3jcy	cmpo8ezg7000004jvpmvouw6q	GOAL	2	1	\N	\N	Após jogada pelo meio campo, o camisa 8 chutou, Aurélio defendeu e no rebote o atacante colocou a bola para o gol	2026-05-27 23:47:48.298
cmpoqdjt0000004jp4arwrxa5	cmpo8ezg7000004jvpmvouw6q	GOAL	19	1	\N	\N	Após cobrança de escanteio, o zagueiro do time de Iracema cabeceou para o gol	2026-05-28 00:04:18.948
cmpoqky9e000004kv0pifznsm	cmpo8ezg7000004jvpmvouw6q	GOAL	24	1	cmpefcd1z000004lasd2r1kdh	\N	Após dividida com goleiro Joaquim só teve o trabalho de mandar a bola para o fundo das redes	2026-05-28 00:10:04.274
cmpoqnlgi000004lb9mysq9hd	cmpo8ezg7000004jvpmvouw6q	YELLOW_CARD	26	1	cmpefcd1z000004lasd2r1kdh	\N	Amarelo para Joaquim	2026-05-28 00:12:07.65
cmpoqxcpv000004l2atsdu7pn	cmpo8ezg7000004jvpmvouw6q	YELLOW_CARD	34	1	cmpcsds4s000004jmgpwku1j2	\N	Cartão amarelo para ícaro por discutir com o juíz	2026-05-28 00:19:42.883
cmpor2vju000004jm6bvop88q	cmpo8ezg7000004jvpmvouw6q	YELLOW_CARD	38	1	\N	\N	Cartão amarelo para camisa 3 e 5 do time Iracema	2026-05-28 00:24:00.57
cmpor3ehz000104jm46v8roh3	cmpo8ezg7000004jvpmvouw6q	GOAL	39	1	cmpdz2mcq000104jr9xnhl4i0	\N	Após rebote do goleiro, Léo empurrou para os fundos das redes , é o empate do MCFC	2026-05-28 00:24:25.127
cmporc2q3000004l8cit7rmo2	cmpo8ezg7000004jvpmvouw6q	SUBSTITUTION	41	1	cmpcsds4s000004jmgpwku1j2	\N	Entrou: Vitão #21	2026-05-28 00:31:09.771
cmporck6e000004jxwnxs7457	cmpo8ezg7000004jvpmvouw6q	SUBSTITUTION	41	1	cmpcsehq1000104ibueo8dlm5	\N	Entrou: Juninho #2	2026-05-28 00:31:32.391
cmporn190000004l7aglxo7un	cmpo8ezg7000004jvpmvouw6q	RED_CARD	8	2	\N	\N	\N	2026-05-28 00:39:41.076
cmporw59x000004jr07exihdm	cmpo8ezg7000004jvpmvouw6q	YELLOW_CARD	15	2	cmpcqf47m000004l85vce0gfh	\N	\N	2026-05-28 00:46:46.197
cmpos0kjg000004lavwbs4fwa	cmpo8ezg7000004jvpmvouw6q	SUBSTITUTION	19	2	cmpcpimjz000004jpcdqgfhfx	\N	Entrou: Tales Laion #8	2026-05-28 00:50:12.604
cmpos152r000004js1zgq1wgg	cmpo8ezg7000004jvpmvouw6q	RED_CARD	19	2	cmpdz2mcq000104jr9xnhl4i0	\N	\N	2026-05-28 00:50:39.219
cmpos2mkz000104js9pkntodx	cmpo8ezg7000004jvpmvouw6q	SUBSTITUTION	20	2	cmpefcqj2000104ladlx0ysjz	\N	Entrou: Anderson #23	2026-05-28 00:51:48.563
cmpos4ak5000004i8xrti1318	cmpo8ezg7000004jvpmvouw6q	SUBSTITUTION	22	2	cmpdz2mcq000104jr9xnhl4i0	\N	Entrou: Ivis Silva #12	2026-05-28 00:53:06.293
cmqp57gib000104jrmi3h1fm0	cmqp56vvw000004jrvs7vb3fj	GOAL	1	1	\N	cmqp565iz000004l597qyl257	Falta Fora da Área	2026-06-22 11:39:11.315
cmr6rihr0000104jolwhgnxc8	cmr6rhyqb000004jo82y3hpkn	GOAL	1	1	\N	\N	\N	2026-07-04 19:35:42.684
cmr6rr708000204jowywbwtdd	cmr6rhyqb000004jo82y3hpkn	YELLOW_CARD	7	1	cmpcsds4s000004jmgpwku1j2	\N	\N	2026-07-04 19:42:28.664
cmr6s1mjd000104l4agq5xh7j	cmr6rhyqb000004jo82y3hpkn	YELLOW_CARD	15	1	cmpcpimjz000004jpcdqgfhfx	\N	Reclamação	2026-07-04 19:50:35.353
cmr6t7jcr000004jvi5yurzrm	cmr6rhyqb000004jo82y3hpkn	GOAL	14	2	cmpefcqj2000104ladlx0ysjz	\N	Depois de desatenção do goleiro o JR rouba a bola e chuta pro gol livre	2026-07-04 20:23:10.779
cmr6tazdn000104jvtz4h1vr1	cmr6rhyqb000004jo82y3hpkn	SUBSTITUTION	16	2	cmpcsds4s000004jmgpwku1j2	\N	Entrou: George (Convidado)	2026-07-04 20:25:51.515
cmr6tct6i000204jvejzn0pkr	cmr6rhyqb000004jo82y3hpkn	YELLOW_CARD	18	2	\N	\N	\N	2026-07-04 20:27:16.794
cmr6u50wy000004k06oqif3nb	cmr6rhyqb000004jo82y3hpkn	GOAL	40	2	cmpefcqj2000104ladlx0ysjz	\N	Disputa de bola no meio Dheryk cabeceia e JR sai livre	2026-07-04 20:49:13.186
cmr6u50xs000104k06el3mcpd	cmr6rhyqb000004jo82y3hpkn	ASSIST	40	2	cmpcoxez0000304l8g40zcfou	\N	Assistência para o gol	2026-07-04 20:49:13.216
cmr6u63u9000204k0xkol6i0f	cmr6rhyqb000004jo82y3hpkn	GOAL	41	2	\N	cmr6fbbr5000004jv15p6b2im	Linda jogada do JR na ponta e ajeita para o Henrique guarda	2026-07-04 20:50:03.634
cmr6u63ug000304k073z1u6s2	cmr6rhyqb000004jo82y3hpkn	ASSIST	41	2	cmpefcqj2000104ladlx0ysjz	\N	Assistência para o gol	2026-07-04 20:50:03.64
cmro7lm90000004lbr1d5igis	cmro6x5q2000004ju2ez1jq1d	YELLOW_CARD	19	1	cmpfk8v2v000704jlp8siky9e	\N	Darlan chega atrasado para o combate. Falta dura	2026-07-17 00:38:07.333
cmro8l10c000004kybf4u8tbz	cmro6x5q2000004ju2ez1jq1d	GOAL	1	2	\N	\N	\N	2026-07-17 01:05:39.42
cmro90s2r000104lb01sg0vsg	cmro6x5q2000004ju2ez1jq1d	GOAL	14	2	\N	\N	\N	2026-07-17 01:17:54.339
cmrrqz8wo000004jofe49fz3u	cmrrqy6i7000004lcukmuapap	GOAL	1	1	cmpefcqj2000104ladlx0ysjz	\N	\N	2026-07-19 12:03:54.456
cmrrrfxju000104lcojyv5g45	cmrrqy6i7000004lcukmuapap	GOAL	14	1	cmpcopzu6000004jro3prr7ca	\N	\N	2026-07-19 12:16:52.891
cmrrrfxlh000204lcbb4fpl9k	cmrrqy6i7000004lcukmuapap	ASSIST	14	1	\N	cmrquvpyi000004l7unpqoe7j	Assistência para o gol	2026-07-19 12:16:52.949
cms9kybz3000004jrogvbbopl	cms9kfgyn000004jjrlymoxx9	YELLOW_CARD	15	1	\N	\N	\N	2026-07-31 23:35:05.247
cms9l6l14000104jr8o503ix7	cms9kfgyn000004jjrlymoxx9	YELLOW_CARD	21	1	cmpefdkyx000304la3k3nq9p9	\N	Parou o contra-ataque	2026-07-31 23:41:30.232
cms9layzq000104jj2gayc4s5	cms9kfgyn000004jjrlymoxx9	GOAL	24	1	\N	\N	\N	2026-07-31 23:44:54.95
cms9mwf56000004l1osuzz36b	cms9kfgyn000004jjrlymoxx9	GOAL	22	2	cmpn1o6et000004jrcnmw0gav	\N	Cobrança de falta de grande categoria do volante	2026-08-01 00:29:35.274
cms9mxt8y000204jj5kxmpt94	cms9kfgyn000004jjrlymoxx9	GOAL	23	2	\N	\N	\N	2026-08-01 00:30:40.21
cms9n9ujg000304jjj15v5seb	cms9kfgyn000004jjrlymoxx9	GOAL	32	2	cmpefcqj2000104ladlx0ysjz	\N	Mais uma falta agora do nosso camisa 11 quase sem ângulo	2026-08-01 00:40:01.756
cms9nhu18000404jjmw0fobh5	cms9kfgyn000004jjrlymoxx9	GOAL	39	2	\N	\N	\N	2026-08-01 00:46:14.348
cms9nklyb000104l1vrmbt0js	cms9kfgyn000004jjrlymoxx9	GOAL	41	2	\N	\N	\N	2026-08-01 00:48:23.843
cms9nnjyi000504jj7bs2r73e	cms9kfgyn000004jjrlymoxx9	GOAL	43	2	\N	\N	\N	2026-08-01 00:50:41.226
cmskrpile000204jqefa50438	cmskrl2z7000404jv3lwm5cv4	GOAL	3	1	\N	\N	Erro na saída de bola gol do Porto	2026-08-08 19:29:39.17
cmskrzqol000304jqam1dhh5s	cmskrl2z7000404jv3lwm5cv4	GOAL	11	1	\N	\N	Outra saída errada e bola no pé do atacante	2026-08-08 19:37:36.213
cmsksh9xy000504jv852t4sm9	cmskrl2z7000404jv3lwm5cv4	GOAL	25	1	\N	\N	Lançamento na saída do goleiro. O atacante bateu por cima	2026-08-08 19:51:14.326
cmsktu0sv000004k1wkv43oug	cmskrl2z7000404jv3lwm5cv4	GOAL	19	2	\N	\N	\N	2026-08-08 20:29:08.623
cmskubpqx000104k1onsj6qv7	cmskrl2z7000404jv3lwm5cv4	GOAL	33	2	\N	\N	\N	2026-08-08 20:42:54.105
cmss5jxxe000104l3bz8j1rz7	cmss5cewy000004l3vgkv2yov	GOAL	6	1	\N	\N	\N	2026-08-13 23:31:36.962
cmss5tzax000004l59m9uxxzo	cmss5cewy000004l3vgkv2yov	GOAL	14	1	\N	\N	Gol contra	2026-08-13 23:39:25.305
cmss6e66y000004l26p29o2r5	cmss5cewy000004l3vgkv2yov	GOAL	29	1	\N	\N	\N	2026-08-13 23:55:07.354
cmss6fhvw000004l3z5v1p0gp	cmss5cewy000004l3vgkv2yov	YELLOW_CARD	30	1	cmpefcqj2000104ladlx0ysjz	\N	Substituição sem avisar	2026-08-13 23:56:09.164
cmss6s4e4000104l2zoko1mau	cmss5cewy000004l3vgkv2yov	GOAL	1	2	\N	\N	\N	2026-08-14 00:05:58.204
cmss6zpsn000004jqn1oy7jgq	cmss5cewy000004l3vgkv2yov	GOAL	7	2	\N	\N	\N	2026-08-14 00:11:52.535
cmss7ddvx000104l3xyh84p6s	cmss5cewy000004l3vgkv2yov	GOAL	17	2	cmpefcqj2000104ladlx0ysjz	\N	Depois de cobrança ensaiada entre Tales e JR um gol que o time adversário não entendeu nada	2026-08-14 00:22:30.285
cmss7hjfv000204l2e7eulwns	cmss5cewy000004l3vgkv2yov	GOAL	20	2	\N	\N	\N	2026-08-14 00:25:44.107
cmss7m0xc000004l75a71ppys	cmss5cewy000004l3vgkv2yov	GOAL	24	2	\N	\N	\N	2026-08-14 00:29:13.392
cmss7w9am000304l2p6yiwee9	cmss5cewy000004l3vgkv2yov	GOAL	32	2	\N	\N	Pênalti	2026-08-14 00:37:10.798
\.
COPY public.match_lives (id, "matchId", "liveStatus", "homeScore", "awayScore", "firstHalfStart", "firstHalfEnd", "secondHalfStart", "secondHalfEnd", "createdAt", "updatedAt") FROM stdin;
cms9kfgyn000004jjrlymoxx9	cmrpgk0qh000004jttg2q1s11	FINISHED	5	2	2026-07-31 23:20:25.24	2026-07-31 23:59:52.25	2026-08-01 00:07:36.593	2026-08-01 00:51:53.805	2026-07-31 23:20:25.247	2026-08-01 00:51:53.807
cmpo8ezg7000004jvpmvouw6q	cmpkl4qyr000004l41n642701	FINISHED	2	2	2026-05-27 23:45:42.728	2026-05-28 00:26:36.465	2026-05-28 00:31:35.146	2026-05-28 01:07:47.778	2026-05-27 15:41:32.791	2026-05-28 01:07:47.782
cmskrl2z7000404jv3lwm5cv4	cmpg3u3kh000l04la6hj2e5r3	FINISHED	5	0	2026-08-08 19:26:12.306	2026-08-08 20:03:11.05	2026-08-08 20:10:04.558	2026-08-08 20:49:31.761	2026-08-08 19:26:12.307	2026-08-08 20:49:31.766
cmqp56vvw000004jrvs7vb3fj	cmpg3rbz2000004la05x1z03i	FINISHED	1	0	2026-06-22 11:38:44.581	2026-06-22 11:38:46.229	2026-06-22 11:39:15.399	2026-06-22 11:39:16.797	2026-06-22 11:38:44.588	2026-06-22 11:39:22.493
cmr6rhyqb000004jo82y3hpkn	cmr4v6j8z000004jmrs48v3h3	FINISHED	1	3	2026-07-04 19:35:18.027	2026-07-04 20:07:14.544	2026-07-04 20:09:24.093	2026-07-04 20:50:45.251	2026-07-04 19:35:18.035	2026-07-04 20:50:45.255
cmro6x5q2000004ju2ez1jq1d	cmrkxjsua000004jtqvbnfwac	FINISHED	2	0	2026-07-17 00:19:06.162	2026-07-17 00:56:50.508	2026-07-17 01:04:19.578	2026-07-17 01:43:54.938	2026-07-17 00:19:06.171	2026-07-17 01:43:54.94
cmss5cewy000004l3vgkv2yov	cmsnjw3d4000004l73omej79w	FINISHED	8	1	2026-08-13 23:25:45.723	2026-08-13 23:57:51.162	2026-08-14 00:05:16.728	2026-08-14 00:41:37.431	2026-08-13 23:25:45.73	2026-08-14 00:41:37.437
cmrrqy6i7000004lcukmuapap	cmqp5jh8b000004jp8k1q116l	FINISHED	7	2	2026-07-19 12:03:04.679	2026-07-19 12:42:51.736	2026-07-19 12:53:34.791	2026-07-19 13:33:14.629	2026-07-19 12:03:04.687	2026-07-19 13:33:14.631
\.
COPY public.match_payments (id, "playerId", "matchId", "teamId", amount, "paidAt", "transactionId", "createdAt", "updatedAt", "receiptUrl", status) FROM stdin;
\.
COPY public.match_photos (id, "matchId", "teamId", url, caption, "uploadedById", "createdAt", "updatedAt") FROM stdin;
cmpfqvnbt000004la1if7jice	cmpfezhxy000004lblpwmx62l	cmpbkj695000004jxaktrnbvc	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/f4ae71fc-b9fe-4378-9234-9bb5f365b2a0.png	Foto do jogo contra SPORT CLUBE MONTESE	cmpcnpofw000004k4ig2qwx60	2026-05-21 17:08:27.737	2026-05-21 17:08:27.737
cmpjrig82000d04i9pg57u03c	cmpfezhxy000004lblpwmx62l	cmpbkj695000004jxaktrnbvc	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/ff526961-d4e8-484f-9a9b-ca06e6e60d1a.png	Foto do jogo contra SPORT CLUBE MONTESE	cmpcnpofw000004k4ig2qwx60	2026-05-24 12:37:16.322	2026-05-24 12:37:16.322
cmpoa48u6000104jpwuppycls	cmpkl4qyr000004l41n642701	cmpbkj695000004jxaktrnbvc	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/d1e8a146-6575-4905-a1a9-098ab1722f60.png	Foto do jogo contra Jardim Iracema	cmpcnpofw000004k4ig2qwx60	2026-05-27 16:29:10.974	2026-05-27 16:29:10.974
cmpoa5igd000004l4e8u4x9nw	cmpfezhxy000004lblpwmx62l	cmpbkj695000004jxaktrnbvc	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/c1303b8e-c1c5-414b-a04d-0d5de8430386.jpg	Foto do jogo contra Sport Clube Montese	cmpcnpofw000004k4ig2qwx60	2026-05-27 16:30:10.093	2026-05-27 16:30:10.093
cmppjbgs1000004juw0y7m41g	cmpkl4qyr000004l41n642701	cmpbkj695000004jxaktrnbvc	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/c4a98ea2-419a-4f2f-ab25-d6e262e8dc4a.png	Foto do jogo contra Jardim Iracema	cmpcnpofw000004k4ig2qwx60	2026-05-28 13:34:30.577	2026-05-28 13:34:30.577
cmppkh6j9000004l267rrdz86	cmpkl4qyr000004l41n642701	cmpbkj695000004jxaktrnbvc	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/962c4d4a-ff09-482c-9e42-047481b603d9.jpg	Foto do jogo contra Jardim Iracema	cmpcoy9by000504l8sw41rlak	2026-05-28 14:06:56.853	2026-05-28 14:06:56.853
cmpr3owxw000204i2z5j1myvg	cmpr23ivg000204icrms1915w	cmpbkj695000004jxaktrnbvc	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/b995deeb-5efe-4f08-9a2d-b626813d02ac.png	Foto do jogo contra Londrina	cmpcnpofw000004k4ig2qwx60	2026-05-29 15:52:36.548	2026-05-29 15:52:36.548
\.
COPY public.match_player_ratings (id, "matchId", "raterId", "ratedId", stars, "createdAt", "updatedAt", "ratedGuestId") FROM stdin;
cmpfw58h9000004juuo61pqtr	cmpe1azov000004l1iw95x1zw	cmpcrj7ws000004l8oescls0l	cmpcsds4s000004jmgpwku1j2	3	2026-05-21 19:35:53.133	2026-05-21 19:35:53.133	\N
cmpfw5bhj000104jua4jo1sg8	cmpe1azov000004l1iw95x1zw	cmpcrj7ws000004l8oescls0l	cmpct94t9000204jsxeeckk3m	2	2026-05-21 19:35:57.031	2026-05-21 19:35:57.031	\N
cmpfw5fc2000004jviu9ne1b1	cmpe1azov000004l1iw95x1zw	cmpcrj7ws000004l8oescls0l	cmpefcqj2000104ladlx0ysjz	4	2026-05-21 19:36:02.018	2026-05-21 19:36:02.018	\N
cmpfw5iwj000104jv3xbcx0fa	cmpe1azov000004l1iw95x1zw	cmpcrj7ws000004l8oescls0l	cmpefcd1z000004lasd2r1kdh	4	2026-05-21 19:36:06.643	2026-05-21 19:36:06.643	\N
cmpfw5siq000304jvsq8lkvm4	cmpe1azov000004l1iw95x1zw	cmpcrj7ws000004l8oescls0l	cmpdz2mcq000104jr9xnhl4i0	3	2026-05-21 19:36:19.106	2026-05-21 19:36:19.106	\N
cmpfw5wz0000404jvr49e7cdh	cmpe1azov000004l1iw95x1zw	cmpcrj7ws000004l8oescls0l	cmpefd4zq000204la3jqyndzz	2	2026-05-21 19:36:24.876	2026-05-21 19:36:24.876	\N
cmpfw5yw0000504jvff0kl2hu	cmpe1azov000004l1iw95x1zw	cmpcrj7ws000004l8oescls0l	cmpcov8jd000004l8umh13pux	4	2026-05-21 19:36:27.36	2026-05-21 19:36:28.845	\N
cmpfw68pe000204k1thqk8c3l	cmpe1azov000004l1iw95x1zw	cmpcrj7ws000004l8oescls0l	cmpcm7sgp000004l1fp9o52ky	3	2026-05-21 19:36:40.082	2026-05-21 19:36:40.082	\N
cmpfw6cia000204juyz1b8e5r	cmpe1azov000004l1iw95x1zw	cmpcrj7ws000004l8oescls0l	cmpefep0o000504laynrqmhnw	2	2026-05-21 19:36:45.01	2026-05-21 19:36:45.01	\N
cmpg36zqo000d04jubesg6nbo	cmpe1azov000004l1iw95x1zw	cmpcnpofw000004k4ig2qwx60	cmpefep0o000504laynrqmhnw	1	2026-05-21 22:53:12.432	2026-05-21 22:53:12.432	\N
cmpfw66rr000104k1fzbcekk1	cmpe1azov000004l1iw95x1zw	cmpcrj7ws000004l8oescls0l	cmpefdukz000404lanevrsp34	5	2026-05-21 19:36:37.575	2026-05-21 19:36:52.813	\N
cmpfw6lle000504ju0me8cs4h	cmpe1azov000004l1iw95x1zw	cmpcrj7ws000004l8oescls0l	cmpefdkyx000304la3k3nq9p9	3	2026-05-21 19:36:56.786	2026-05-21 19:36:56.786	\N
cmpfw638r000004k1chbm05wu	cmpe1azov000004l1iw95x1zw	cmpcrj7ws000004l8oescls0l	cmpct2xp7000004jsv1ujpe1r	4	2026-05-21 19:36:33.003	2026-05-21 19:44:21.669	\N
cmpjos6h4000304k1t3ztikdn	cmpfezhxy000004lblpwmx62l	cmpe0mtc4000004l1e0lft0uf	cmpcpt3n6000004l561lm2ja7	2	2026-05-24 11:20:51.4	2026-05-24 11:20:51.4	\N
cmpfw5oc1000204jvpwkzws21	cmpe1azov000004l1iw95x1zw	cmpcrj7ws000004l8oescls0l	cmpcqf47m000004l85vce0gfh	1	2026-05-21 19:36:13.681	2026-05-21 19:50:18.426	\N
cmpfyklw7000104lduwn2ls0c	cmpe1azov000004l1iw95x1zw	cmpe0mtc4000004l1e0lft0uf	cmpefdukz000404lanevrsp34	5	2026-05-21 20:43:49.591	2026-05-21 20:43:49.591	\N
cmpfykn9v000204ld0l3h6rpy	cmpe1azov000004l1iw95x1zw	cmpe0mtc4000004l1e0lft0uf	cmpefdkyx000304la3k3nq9p9	1	2026-05-21 20:43:51.379	2026-05-21 20:43:51.379	\N
cmpfykgzv000004ldhdaalav5	cmpe1azov000004l1iw95x1zw	cmpe0mtc4000004l1e0lft0uf	cmpefep0o000504laynrqmhnw	1	2026-05-21 20:43:43.243	2026-05-21 20:43:54.028	\N
cmpfyksfj000404ldmrw10o50	cmpe1azov000004l1iw95x1zw	cmpe0mtc4000004l1e0lft0uf	cmpcm7sgp000004l1fp9o52ky	2	2026-05-21 20:43:58.063	2026-05-21 20:43:58.063	\N
cmpfyky01000504ldc7p6mein	cmpe1azov000004l1iw95x1zw	cmpe0mtc4000004l1e0lft0uf	cmpcov8jd000004l8umh13pux	3	2026-05-21 20:44:05.281	2026-05-21 20:44:05.281	\N
cmpfyl74j000604ldtjs0c1hv	cmpe1azov000004l1iw95x1zw	cmpe0mtc4000004l1e0lft0uf	cmpct2xp7000004jsv1ujpe1r	3	2026-05-21 20:44:17.107	2026-05-21 20:44:17.107	\N
cmpfyla3x000704ldrvk6zi8g	cmpe1azov000004l1iw95x1zw	cmpe0mtc4000004l1e0lft0uf	cmpefd4zq000204la3jqyndzz	1	2026-05-21 20:44:20.973	2026-05-21 20:44:20.973	\N
cmpfylh52000804ldelpdoul4	cmpe1azov000004l1iw95x1zw	cmpe0mtc4000004l1e0lft0uf	cmpdz2mcq000104jr9xnhl4i0	3	2026-05-21 20:44:30.086	2026-05-21 20:44:30.086	\N
cmpfylkvi000904ld9dkibg63	cmpe1azov000004l1iw95x1zw	cmpe0mtc4000004l1e0lft0uf	cmpcqf47m000004l85vce0gfh	1	2026-05-21 20:44:34.926	2026-05-21 20:44:34.926	\N
cmpfylnzy000a04ldqeak7jnj	cmpe1azov000004l1iw95x1zw	cmpe0mtc4000004l1e0lft0uf	cmpefcqj2000104ladlx0ysjz	2	2026-05-21 20:44:38.974	2026-05-21 20:44:38.974	\N
cmpfylr2w000b04ldtdliiq42	cmpe1azov000004l1iw95x1zw	cmpe0mtc4000004l1e0lft0uf	cmpefcd1z000004lasd2r1kdh	3	2026-05-21 20:44:42.968	2026-05-21 20:44:44.411	\N
cmpfyltsz000d04ldkiqwng37	cmpe1azov000004l1iw95x1zw	cmpe0mtc4000004l1e0lft0uf	cmpct94t9000204jsxeeckk3m	1	2026-05-21 20:44:46.499	2026-05-21 20:44:46.499	\N
cmpfylzv0000e04ldvfyaeyer	cmpe1azov000004l1iw95x1zw	cmpe0mtc4000004l1e0lft0uf	cmpcpimjz000004jpcdqgfhfx	3	2026-05-21 20:44:54.348	2026-05-21 20:44:54.348	\N
cmpg34w8u000004ju2191vbhg	cmpe1azov000004l1iw95x1zw	cmpcnpofw000004k4ig2qwx60	cmpcpimjz000004jpcdqgfhfx	3	2026-05-21 22:51:34.59	2026-05-21 22:51:34.59	\N
cmpg350m6000104jut06zur44	cmpe1azov000004l1iw95x1zw	cmpcnpofw000004k4ig2qwx60	cmpcsds4s000004jmgpwku1j2	3	2026-05-21 22:51:40.254	2026-05-21 22:51:40.254	\N
cmpg35jrf000204ju5enq451r	cmpe1azov000004l1iw95x1zw	cmpcnpofw000004k4ig2qwx60	cmpct94t9000204jsxeeckk3m	1	2026-05-21 22:52:05.067	2026-05-21 22:52:05.067	\N
cmpg35py7000304juyd732cws	cmpe1azov000004l1iw95x1zw	cmpcnpofw000004k4ig2qwx60	cmpefcd1z000004lasd2r1kdh	3	2026-05-21 22:52:13.087	2026-05-21 22:52:13.087	\N
cmpg35slz000404jumywx437b	cmpe1azov000004l1iw95x1zw	cmpcnpofw000004k4ig2qwx60	cmpefcqj2000104ladlx0ysjz	3	2026-05-21 22:52:16.535	2026-05-21 22:52:16.535	\N
cmpg35va2000504jutldqtavw	cmpe1azov000004l1iw95x1zw	cmpcnpofw000004k4ig2qwx60	cmpcqf47m000004l85vce0gfh	1	2026-05-21 22:52:19.994	2026-05-21 22:52:19.994	\N
cmpg35zpe000604jud2f3wxl5	cmpe1azov000004l1iw95x1zw	cmpcnpofw000004k4ig2qwx60	cmpdz2mcq000104jr9xnhl4i0	2	2026-05-21 22:52:25.731	2026-05-21 22:52:25.731	\N
cmpg366rk000704ju3irq1cxz	cmpe1azov000004l1iw95x1zw	cmpcnpofw000004k4ig2qwx60	cmpefd4zq000204la3jqyndzz	2	2026-05-21 22:52:34.88	2026-05-21 22:52:34.88	\N
cmpg368it000804ju0l53k10z	cmpe1azov000004l1iw95x1zw	cmpcnpofw000004k4ig2qwx60	cmpcov8jd000004l8umh13pux	4	2026-05-21 22:52:37.157	2026-05-21 22:52:41.911	\N
cmpg36h80000a04juz7lz42v7	cmpe1azov000004l1iw95x1zw	cmpcnpofw000004k4ig2qwx60	cmpct2xp7000004jsv1ujpe1r	4	2026-05-21 22:52:48.432	2026-05-21 22:52:48.432	\N
cmpg36lrn000b04juufwzd8o8	cmpe1azov000004l1iw95x1zw	cmpcnpofw000004k4ig2qwx60	cmpefdkyx000304la3k3nq9p9	2	2026-05-21 22:52:54.323	2026-05-21 22:52:54.323	\N
cmpg36qkk000c04jug33w26jv	cmpe1azov000004l1iw95x1zw	cmpcnpofw000004k4ig2qwx60	cmpefdukz000404lanevrsp34	4	2026-05-21 22:53:00.548	2026-05-21 22:53:00.548	\N
cmpjos9bt000404k17ghtatai	cmpfezhxy000004lblpwmx62l	cmpe0mtc4000004l1e0lft0uf	cmpefep0o000504laynrqmhnw	4	2026-05-24 11:20:55.097	2026-05-24 11:20:55.097	\N
cmpjosdck000504k1dn6xe0un	cmpfezhxy000004lblpwmx62l	cmpe0mtc4000004l1e0lft0uf	cmpefdkyx000304la3k3nq9p9	2	2026-05-24 11:21:00.308	2026-05-24 11:21:00.308	\N
cmphg5mls000004lb3u8nrdwx	cmpgvy3i1000004jupkxo13f9	cmpe0mtc4000004l1e0lft0uf	cmpfk8v2v000704jlp8siky9e	5	2026-05-22 21:43:49.936	2026-05-22 21:44:07.003	\N
cmpjorri8000004k1801e3z3q	cmpfezhxy000004lblpwmx62l	cmpe0mtc4000004l1e0lft0uf	cmpfk8v2v000704jlp8siky9e	5	2026-05-24 11:20:32	2026-05-24 11:20:32	\N
cmpjorxim000104k12ijt9x3a	cmpfezhxy000004lblpwmx62l	cmpe0mtc4000004l1e0lft0uf	cmpefdukz000404lanevrsp34	3	2026-05-24 11:20:39.79	2026-05-24 11:20:39.79	\N
cmpjos2qs000204k15ekgral6	cmpfezhxy000004lblpwmx62l	cmpe0mtc4000004l1e0lft0uf	cmpefcqj2000104ladlx0ysjz	4	2026-05-24 11:20:46.565	2026-05-24 11:20:46.565	\N
cmpjosetp000604k1n5no0ynb	cmpfezhxy000004lblpwmx62l	cmpe0mtc4000004l1e0lft0uf	cmpdz2mcq000104jr9xnhl4i0	5	2026-05-24 11:21:02.221	2026-05-24 11:21:02.221	\N
cmpjoshcd000004l8ts0kp1et	cmpfezhxy000004lblpwmx62l	cmpe0mtc4000004l1e0lft0uf	cmpdz3jpw000004jvdohsd2ri	2	2026-05-24 11:21:05.485	2026-05-24 11:21:05.485	\N
cmpjosoqm000104l89j1l5i95	cmpfezhxy000004lblpwmx62l	cmpe0mtc4000004l1e0lft0uf	cmpefcd1z000004lasd2r1kdh	4	2026-05-24 11:21:15.07	2026-05-24 11:21:15.07	\N
cmpjosqab000204l8r6mydfvz	cmpfezhxy000004lblpwmx62l	cmpe0mtc4000004l1e0lft0uf	cmpcm7sgp000004l1fp9o52ky	4	2026-05-24 11:21:17.075	2026-05-24 11:21:17.075	\N
cmpjosrur000304l8s52pd8nq	cmpfezhxy000004lblpwmx62l	cmpe0mtc4000004l1e0lft0uf	cmpcpimjz000004jpcdqgfhfx	4	2026-05-24 11:21:19.107	2026-05-24 11:21:19.107	\N
cmpjosw91000404l8qbpstils	cmpfezhxy000004lblpwmx62l	cmpe0mtc4000004l1e0lft0uf	cmpcoxez0000304l8g40zcfou	2	2026-05-24 11:21:24.805	2026-05-24 11:21:24.805	\N
cmpjrbs57000004i9srbgvr2p	cmpfezhxy000004lblpwmx62l	cmpcnpofw000004k4ig2qwx60	cmpcpimjz000004jpcdqgfhfx	4	2026-05-24 12:32:05.179	2026-05-24 12:32:50.955	\N
cmpjrcva2000204i9elimerrm	cmpfezhxy000004lblpwmx62l	cmpcnpofw000004k4ig2qwx60	cmpcsds4s000004jmgpwku1j2	3	2026-05-24 12:32:55.898	2026-05-24 12:32:55.898	\N
cmpjrcymd000304i980dzk1o1	cmpfezhxy000004lblpwmx62l	cmpcnpofw000004k4ig2qwx60	cmpefcd1z000004lasd2r1kdh	4	2026-05-24 12:33:00.229	2026-05-24 12:33:00.229	\N
cmpjrd1se000404i908yii1fp	cmpfezhxy000004lblpwmx62l	cmpcnpofw000004k4ig2qwx60	cmpcoxez0000304l8g40zcfou	2	2026-05-24 12:33:04.334	2026-05-24 12:33:04.334	\N
cmpjrd3yz000504i98xphd9da	cmpfezhxy000004lblpwmx62l	cmpcnpofw000004k4ig2qwx60	cmpdz3jpw000004jvdohsd2ri	2	2026-05-24 12:33:07.163	2026-05-24 12:33:07.163	\N
cmpjrd86p000604i9vqhgfzcv	cmpfezhxy000004lblpwmx62l	cmpcnpofw000004k4ig2qwx60	cmpdz2mcq000104jr9xnhl4i0	4	2026-05-24 12:33:12.625	2026-05-24 12:33:12.625	\N
cmpjrddix000704i9hx44tl4g	cmpfezhxy000004lblpwmx62l	cmpcnpofw000004k4ig2qwx60	cmpefdkyx000304la3k3nq9p9	2	2026-05-24 12:33:19.545	2026-05-24 12:33:19.545	\N
cmpjrdie9000804i9rp2w35uq	cmpfezhxy000004lblpwmx62l	cmpcnpofw000004k4ig2qwx60	cmpefep0o000504laynrqmhnw	5	2026-05-24 12:33:25.857	2026-05-24 12:33:25.857	\N
cmpjrdl4d000904i9tdy2x9rf	cmpfezhxy000004lblpwmx62l	cmpcnpofw000004k4ig2qwx60	cmpcpt3n6000004l561lm2ja7	2	2026-05-24 12:33:29.389	2026-05-24 12:33:29.389	\N
cmpjrdpc3000a04i932edpjkv	cmpfezhxy000004lblpwmx62l	cmpcnpofw000004k4ig2qwx60	cmpefcqj2000104ladlx0ysjz	4	2026-05-24 12:33:34.851	2026-05-24 12:33:34.851	\N
cmpjrducc000b04i9upmcty1k	cmpfezhxy000004lblpwmx62l	cmpcnpofw000004k4ig2qwx60	cmpefdukz000404lanevrsp34	3	2026-05-24 12:33:41.34	2026-05-24 12:33:41.34	\N
cmpjrdvoj000c04i9b9ud9asl	cmpfezhxy000004lblpwmx62l	cmpcnpofw000004k4ig2qwx60	cmpfk8v2v000704jlp8siky9e	5	2026-05-24 12:33:43.075	2026-05-24 12:33:43.075	\N
cmpjrthq5000004jpolp8p2gn	cmpfezhxy000004lblpwmx62l	cmpcoy9by000504l8sw41rlak	cmpcpimjz000004jpcdqgfhfx	3	2026-05-24 12:45:51.485	2026-05-24 12:45:51.485	\N
cmpjrtlnc000104jpm1l6ecjc	cmpfezhxy000004lblpwmx62l	cmpcoy9by000504l8sw41rlak	cmpcsds4s000004jmgpwku1j2	3	2026-05-24 12:45:56.568	2026-05-24 12:45:56.568	\N
cmpjrtndh000204jpx5s5db8w	cmpfezhxy000004lblpwmx62l	cmpcoy9by000504l8sw41rlak	cmpcm7sgp000004l1fp9o52ky	3	2026-05-24 12:45:58.805	2026-05-24 12:45:58.805	\N
cmpjrtpt9000304jp1s14pwic	cmpfezhxy000004lblpwmx62l	cmpcoy9by000504l8sw41rlak	cmpefcd1z000004lasd2r1kdh	4	2026-05-24 12:46:01.965	2026-05-24 12:46:01.965	\N
cmpjrtvci000404jpgmz8rdph	cmpfezhxy000004lblpwmx62l	cmpcoy9by000504l8sw41rlak	cmpdz3jpw000004jvdohsd2ri	3	2026-05-24 12:46:09.138	2026-05-24 12:46:09.138	\N
cmpjru1q7000504jpd0bdu830	cmpfezhxy000004lblpwmx62l	cmpcoy9by000504l8sw41rlak	cmpdz2mcq000104jr9xnhl4i0	4	2026-05-24 12:46:17.407	2026-05-24 12:46:17.407	\N
cmpjru4m3000604jpb0ataewe	cmpfezhxy000004lblpwmx62l	cmpcoy9by000504l8sw41rlak	cmpefdkyx000304la3k3nq9p9	3	2026-05-24 12:46:21.147	2026-05-24 12:46:21.147	\N
cmpjru9ka000704jpek5rayzx	cmpfezhxy000004lblpwmx62l	cmpcoy9by000504l8sw41rlak	cmpefep0o000504laynrqmhnw	4	2026-05-24 12:46:27.562	2026-05-24 12:46:27.562	\N
cmpjrucao000004l152jf27v3	cmpfezhxy000004lblpwmx62l	cmpcoy9by000504l8sw41rlak	cmpcpt3n6000004l561lm2ja7	2	2026-05-24 12:46:31.104	2026-05-24 12:46:31.104	\N
cmpjrugpe000104l1annhqch2	cmpfezhxy000004lblpwmx62l	cmpcoy9by000504l8sw41rlak	cmpefcqj2000104ladlx0ysjz	4	2026-05-24 12:46:36.818	2026-05-24 12:46:36.818	\N
cmpjrumxw000204l16679oz67	cmpfezhxy000004lblpwmx62l	cmpcoy9by000504l8sw41rlak	cmpefdukz000404lanevrsp34	3	2026-05-24 12:46:44.9	2026-05-24 12:46:44.9	\N
cmpjruqr8000304l182xqo91y	cmpfezhxy000004lblpwmx62l	cmpcoy9by000504l8sw41rlak	cmpfk8v2v000704jlp8siky9e	4	2026-05-24 12:46:49.844	2026-05-24 12:46:49.844	\N
cmpli79c7000204ktv7yd4wpd	cmpfezhxy000004lblpwmx62l	cmpcrj7ws000004l8oescls0l	cmpcsds4s000004jmgpwku1j2	4	2026-05-25 17:52:09.991	2026-05-25 17:52:09.991	\N
cmpli7b6a000304ktwdstjywl	cmpfezhxy000004lblpwmx62l	cmpcrj7ws000004l8oescls0l	cmpcm7sgp000004l1fp9o52ky	4	2026-05-25 17:52:12.37	2026-05-25 17:52:12.37	\N
cmpli7cnn000404ktra4s15cb	cmpfezhxy000004lblpwmx62l	cmpcrj7ws000004l8oescls0l	cmpefcd1z000004lasd2r1kdh	4	2026-05-25 17:52:14.291	2026-05-25 17:52:14.291	\N
cmpli7kig000004jsbnqkj0fl	cmpfezhxy000004lblpwmx62l	cmpcrj7ws000004l8oescls0l	cmpcoxez0000304l8g40zcfou	2	2026-05-25 17:52:24.472	2026-05-25 17:52:24.472	\N
cmpli7v4a000104jscqidq5fn	cmpfezhxy000004lblpwmx62l	cmpcrj7ws000004l8oescls0l	cmpdz3jpw000004jvdohsd2ri	2	2026-05-25 17:52:38.218	2026-05-25 17:52:38.218	\N
cmpli7yh1000204jsw0b8dtxl	cmpfezhxy000004lblpwmx62l	cmpcrj7ws000004l8oescls0l	cmpdz2mcq000104jr9xnhl4i0	4	2026-05-25 17:52:42.565	2026-05-25 17:52:42.565	\N
cmpli8aq1000304jsb85qb1ts	cmpfezhxy000004lblpwmx62l	cmpcrj7ws000004l8oescls0l	cmpefdkyx000304la3k3nq9p9	2	2026-05-25 17:52:58.441	2026-05-25 17:52:58.441	\N
cmpli8dux000404jscfcjjt1i	cmpfezhxy000004lblpwmx62l	cmpcrj7ws000004l8oescls0l	cmpefep0o000504laynrqmhnw	3	2026-05-25 17:53:02.505	2026-05-25 17:53:02.505	\N
cmpli8gz6000504kttjyctxw8	cmpfezhxy000004lblpwmx62l	cmpcrj7ws000004l8oescls0l	cmpcpt3n6000004l561lm2ja7	2	2026-05-25 17:53:06.546	2026-05-25 17:53:06.546	\N
cmpli8k4j000604ktijt0plm5	cmpfezhxy000004lblpwmx62l	cmpcrj7ws000004l8oescls0l	cmpefcqj2000104ladlx0ysjz	4	2026-05-25 17:53:10.627	2026-05-25 17:53:10.627	\N
cmpli8ntp000704kt51tq1hm3	cmpfezhxy000004lblpwmx62l	cmpcrj7ws000004l8oescls0l	cmpefdukz000404lanevrsp34	4	2026-05-25 17:53:15.422	2026-05-25 17:53:15.422	\N
cmpli8p81000804kt7f0ucuqo	cmpfezhxy000004lblpwmx62l	cmpcrj7ws000004l8oescls0l	cmpfk8v2v000704jlp8siky9e	5	2026-05-25 17:53:17.234	2026-05-25 17:53:17.234	\N
cmpp9rm3l000004l27u299vqr	cmpkl4qyr000004l41n642701	cmpcrj7ws000004l8oescls0l	cmpefcd1z000004lasd2r1kdh	4	2026-05-28 09:07:07.81	2026-05-28 09:07:07.81	\N
cmpp9rngz000104l2jamh30iv	cmpkl4qyr000004l41n642701	cmpcrj7ws000004l8oescls0l	cmpcsds4s000004jmgpwku1j2	4	2026-05-28 09:07:09.587	2026-05-28 09:07:09.587	\N
cmpp9rtn3000304l2j4i5rnyd	cmpkl4qyr000004l41n642701	cmpcrj7ws000004l8oescls0l	cmpcsehq1000104ibueo8dlm5	3	2026-05-28 09:07:17.583	2026-05-28 09:07:17.583	\N
cmpp9rvge000404l2lwm4qmsf	cmpkl4qyr000004l41n642701	cmpcrj7ws000004l8oescls0l	cmpcqf47m000004l85vce0gfh	3	2026-05-28 09:07:19.934	2026-05-28 09:07:19.934	\N
cmpp9rz2a000504l2apl3tcxo	cmpkl4qyr000004l41n642701	cmpcrj7ws000004l8oescls0l	cmpefcqj2000104ladlx0ysjz	4	2026-05-28 09:07:24.61	2026-05-28 09:07:24.61	\N
cmpp9s5r9000804l2h70nm2j6	cmpkl4qyr000004l41n642701	cmpcrj7ws000004l8oescls0l	cmpcm7sgp000004l1fp9o52ky	4	2026-05-28 09:07:33.285	2026-05-28 09:07:33.285	\N
cmpp9s7dx000904l2vm603dcz	cmpkl4qyr000004l41n642701	cmpcrj7ws000004l8oescls0l	cmpcov8jd000004l8umh13pux	4	2026-05-28 09:07:35.397	2026-05-28 09:07:35.397	\N
cmpp9s8x6000a04l2815dlbsg	cmpkl4qyr000004l41n642701	cmpcrj7ws000004l8oescls0l	cmpcopzu6000004jro3prr7ca	4	2026-05-28 09:07:37.386	2026-05-28 09:07:37.386	\N
cmpp9sgy5000b04l240ekhu1x	cmpkl4qyr000004l41n642701	cmpcrj7ws000004l8oescls0l	cmpct94t9000204jsxeeckk3m	3	2026-05-28 09:07:47.789	2026-05-28 09:07:47.789	\N
cmpp9sklp000c04l2rrf17w6v	cmpkl4qyr000004l41n642701	cmpcrj7ws000004l8oescls0l	cmpn1o6et000004jrcnmw0gav	3	2026-05-28 09:07:52.525	2026-05-28 09:07:52.525	\N
cmpp9so2g000d04l2f5tdbo9f	cmpkl4qyr000004l41n642701	cmpcrj7ws000004l8oescls0l	cmpdz3jpw000004jvdohsd2ri	3	2026-05-28 09:07:57.016	2026-05-28 09:07:57.016	\N
cmpp9sq0c000e04l220o0lwhn	cmpkl4qyr000004l41n642701	cmpcrj7ws000004l8oescls0l	cmpefep0o000504laynrqmhnw	3	2026-05-28 09:07:59.532	2026-05-28 09:07:59.532	\N
cmpp9srmc000004ie3a64hm7l	cmpkl4qyr000004l41n642701	cmpcrj7ws000004l8oescls0l	cmpg41k59000004l7521hfcn4	3	2026-05-28 09:08:01.62	2026-05-28 09:08:01.62	\N
cmpp9rrwr000204l2qdbitmvg	cmpkl4qyr000004l41n642701	cmpcrj7ws000004l8oescls0l	cmpdz2mcq000104jr9xnhl4i0	4	2026-05-28 09:07:15.339	2026-05-28 19:55:21.897	\N
cmppwxssa000004ij8j4fe5v1	cmpkl4qyr000004l41n642701	cmpe0mtc4000004l1e0lft0uf	cmpcm7sgp000004l1fp9o52ky	4	2026-05-28 19:55:47.578	2026-05-28 19:55:50.115	\N
cmppwy07i000204ij3c3r13dv	cmpkl4qyr000004l41n642701	cmpe0mtc4000004l1e0lft0uf	cmpcopzu6000004jro3prr7ca	4	2026-05-28 19:55:57.198	2026-05-28 19:55:57.198	\N
cmppwy80r000104l2dl6mc3yb	cmpkl4qyr000004l41n642701	cmpe0mtc4000004l1e0lft0uf	cmpefep0o000504laynrqmhnw	3	2026-05-28 19:56:07.323	2026-05-28 19:56:07.323	\N
cmppwya0x000204l2egubse37	cmpkl4qyr000004l41n642701	cmpe0mtc4000004l1e0lft0uf	cmpcpimjz000004jpcdqgfhfx	4	2026-05-28 19:56:09.921	2026-05-28 19:56:09.921	\N
cmppwybhw000304l2rikqwwsl	cmpkl4qyr000004l41n642701	cmpe0mtc4000004l1e0lft0uf	cmpcov8jd000004l8umh13pux	4	2026-05-28 19:56:11.828	2026-05-28 19:56:11.828	\N
cmppwyf1g000404l2lkqn1oih	cmpkl4qyr000004l41n642701	cmpe0mtc4000004l1e0lft0uf	cmpdz3jpw000004jvdohsd2ri	3	2026-05-28 19:56:16.42	2026-05-28 19:56:16.42	\N
cmppwyhzg000504l22wje5lmf	cmpkl4qyr000004l41n642701	cmpe0mtc4000004l1e0lft0uf	cmpefcd1z000004lasd2r1kdh	4	2026-05-28 19:56:20.236	2026-05-28 19:56:20.236	\N
cmppwylpo000604l25c4n21yg	cmpkl4qyr000004l41n642701	cmpe0mtc4000004l1e0lft0uf	cmpct94t9000204jsxeeckk3m	3	2026-05-28 19:56:25.068	2026-05-28 19:56:25.068	\N
cmppwyngm000704l2wzi40zyg	cmpkl4qyr000004l41n642701	cmpe0mtc4000004l1e0lft0uf	cmpcqf47m000004l85vce0gfh	3	2026-05-28 19:56:27.334	2026-05-28 19:56:27.334	\N
cmppwyoh2000804l2lf5mwtlf	cmpkl4qyr000004l41n642701	cmpe0mtc4000004l1e0lft0uf	cmpg41k59000004l7521hfcn4	3	2026-05-28 19:56:28.646	2026-05-28 19:56:28.646	\N
cmppwyrtw000904l288acfy5m	cmpkl4qyr000004l41n642701	cmpe0mtc4000004l1e0lft0uf	cmpefcqj2000104ladlx0ysjz	4	2026-05-28 19:56:32.996	2026-05-28 19:56:32.996	\N
cmppwysss000a04l21lm38qmq	cmpkl4qyr000004l41n642701	cmpe0mtc4000004l1e0lft0uf	cmpn1o6et000004jrcnmw0gav	3	2026-05-28 19:56:34.252	2026-05-28 19:56:34.252	\N
cmppwy49u000304ijapvazght	cmpkl4qyr000004l41n642701	cmpe0mtc4000004l1e0lft0uf	cmpdz2mcq000104jr9xnhl4i0	4	2026-05-28 19:56:02.466	2026-05-28 19:57:17.866	\N
cmppwwmp5000704lh8iugch8d	cmpkl4qyr000004l41n642701	cmpe0mtc4000004l1e0lft0uf	cmpcsehq1000104ibueo8dlm5	3	2026-05-28 19:54:53.033	2026-05-28 19:58:36.95	\N
cmpr1rqaq000004l7u9cuwidd	cmpkl4qyr000004l41n642701	cmpcnpofw000004k4ig2qwx60	cmpcsehq1000104ibueo8dlm5	2	2026-05-29 14:58:48.674	2026-05-29 14:58:48.674	\N
cmpr1s2ag000004l53yiri9h8	cmpkl4qyr000004l41n642701	cmpcnpofw000004k4ig2qwx60	cmpcopzu6000004jro3prr7ca	4	2026-05-29 14:59:04.216	2026-05-29 14:59:04.216	\N
cmpr1s56b000104l5ccssx6om	cmpkl4qyr000004l41n642701	cmpcnpofw000004k4ig2qwx60	cmpdz2mcq000104jr9xnhl4i0	4	2026-05-29 14:59:07.956	2026-05-29 14:59:07.956	\N
cmpr1s847000204l5tmw3y65d	cmpkl4qyr000004l41n642701	cmpcnpofw000004k4ig2qwx60	cmpefep0o000504laynrqmhnw	3	2026-05-29 14:59:11.767	2026-05-29 14:59:11.767	\N
cmpr1s9j5000304l57d1pqc32	cmpkl4qyr000004l41n642701	cmpcnpofw000004k4ig2qwx60	cmpcpimjz000004jpcdqgfhfx	4	2026-05-29 14:59:13.601	2026-05-29 14:59:13.601	\N
cmpr1sb4u000404l5t1n4i8eb	cmpkl4qyr000004l41n642701	cmpcnpofw000004k4ig2qwx60	cmpcov8jd000004l8umh13pux	4	2026-05-29 14:59:15.678	2026-05-29 14:59:15.678	\N
cmpr1sclp000504l5mrsjv93t	cmpkl4qyr000004l41n642701	cmpcnpofw000004k4ig2qwx60	cmpdz3jpw000004jvdohsd2ri	3	2026-05-29 14:59:17.581	2026-05-29 14:59:17.581	\N
cmpr1sef2000604l5tl8z4kdr	cmpkl4qyr000004l41n642701	cmpcnpofw000004k4ig2qwx60	cmpefcd1z000004lasd2r1kdh	4	2026-05-29 14:59:19.934	2026-05-29 14:59:19.934	\N
cmpr1sfv8000704l59kqomd8n	cmpkl4qyr000004l41n642701	cmpcnpofw000004k4ig2qwx60	cmpcsds4s000004jmgpwku1j2	3	2026-05-29 14:59:21.812	2026-05-29 14:59:21.812	\N
cmpr1siio000804l59us9eg81	cmpkl4qyr000004l41n642701	cmpcnpofw000004k4ig2qwx60	cmpct94t9000204jsxeeckk3m	3	2026-05-29 14:59:25.248	2026-05-29 14:59:25.248	\N
cmpr1sjq0000904l5mckhpawh	cmpkl4qyr000004l41n642701	cmpcnpofw000004k4ig2qwx60	cmpcqf47m000004l85vce0gfh	3	2026-05-29 14:59:26.808	2026-05-29 14:59:26.808	\N
cmpr1sl38000a04l5dmxsuspk	cmpkl4qyr000004l41n642701	cmpcnpofw000004k4ig2qwx60	cmpg41k59000004l7521hfcn4	3	2026-05-29 14:59:28.58	2026-05-29 14:59:28.58	\N
cmpr1sorn000b04l58heb5lzs	cmpkl4qyr000004l41n642701	cmpcnpofw000004k4ig2qwx60	cmpefcqj2000104ladlx0ysjz	3	2026-05-29 14:59:33.347	2026-05-29 14:59:33.347	\N
cmpr1srzd000c04l5uz3cels8	cmpkl4qyr000004l41n642701	cmpcnpofw000004k4ig2qwx60	cmpn1o6et000004jrcnmw0gav	3	2026-05-29 14:59:37.513	2026-05-29 14:59:37.513	\N
cmpr6b67u000504ld5vqaxg1x	cmpkl4qyr000004l41n642701	cmpej13hk000004l9f9eng6ul	cmpdz3jpw000004jvdohsd2ri	2	2026-05-29 17:05:54.234	2026-05-29 17:05:55.833	\N
cmpr3agvl000004l2ts3k04s9	cmpkl4qyr000004l41n642701	cmpcoy9by000504l8sw41rlak	\N	3	2026-05-29 15:41:22.545	2026-05-29 15:41:27.558	cmpohz21c000004jx24id9rok
cmpr3dnsd000004i2j08epf7a	cmpkl4qyr000004l41n642701	cmpe0mtc4000004l1e0lft0uf	\N	5	2026-05-29 15:43:51.469	2026-05-29 15:43:51.469	cmpol69a5000004l7wi5vd4ad
cmpr3dolw000104i2gnmc5iq9	cmpkl4qyr000004l41n642701	cmpe0mtc4000004l1e0lft0uf	\N	5	2026-05-29 15:43:52.532	2026-05-29 15:43:52.532	cmpohz21c000004jx24id9rok
cmpr69wzs000004jm96469oyc	cmpkl4qyr000004l41n642701	cmpej13hk000004l9f9eng6ul	cmpcsehq1000104ibueo8dlm5	3	2026-05-29 17:04:55.624	2026-05-29 17:04:55.624	\N
cmpr6am53000004ldwv9w99xx	cmpkl4qyr000004l41n642701	cmpej13hk000004l9f9eng6ul	cmpcm7sgp000004l1fp9o52ky	4	2026-05-29 17:05:28.215	2026-05-29 17:05:28.215	\N
cmpr6aoq8000104ld97v85d5o	cmpkl4qyr000004l41n642701	cmpej13hk000004l9f9eng6ul	cmpcopzu6000004jro3prr7ca	4	2026-05-29 17:05:31.568	2026-05-29 17:05:31.568	\N
cmpr6auwh000204ld01p5d2kn	cmpkl4qyr000004l41n642701	cmpej13hk000004l9f9eng6ul	cmpefep0o000504laynrqmhnw	3	2026-05-29 17:05:39.569	2026-05-29 17:05:39.569	\N
cmpr6b2ny000304ldysjgp3rw	cmpkl4qyr000004l41n642701	cmpej13hk000004l9f9eng6ul	cmpcpimjz000004jpcdqgfhfx	3	2026-05-29 17:05:49.63	2026-05-29 17:05:49.63	\N
cmpr6b4uw000404ldq9zn6xbf	cmpkl4qyr000004l41n642701	cmpej13hk000004l9f9eng6ul	cmpcov8jd000004l8umh13pux	4	2026-05-29 17:05:52.473	2026-05-29 17:05:52.473	\N
cmpr6b9vb000704ldp69xgfou	cmpkl4qyr000004l41n642701	cmpej13hk000004l9f9eng6ul	cmpefcd1z000004lasd2r1kdh	4	2026-05-29 17:05:58.967	2026-05-29 17:05:58.967	\N
cmpr6bemu000004ifx3qvrxeg	cmpkl4qyr000004l41n642701	cmpej13hk000004l9f9eng6ul	cmpcsds4s000004jmgpwku1j2	4	2026-05-29 17:06:05.142	2026-05-29 17:06:05.142	\N
cmpr6bgr8000104ift6n2psyz	cmpkl4qyr000004l41n642701	cmpej13hk000004l9f9eng6ul	cmpct94t9000204jsxeeckk3m	2	2026-05-29 17:06:07.892	2026-05-29 17:06:13.13	\N
cmpr6blh8000304ifowzc3y0o	cmpkl4qyr000004l41n642701	cmpej13hk000004l9f9eng6ul	cmpcqf47m000004l85vce0gfh	2	2026-05-29 17:06:14.012	2026-05-29 17:06:14.839	\N
cmpr6bnyq000504ifm7rqyvqc	cmpkl4qyr000004l41n642701	cmpej13hk000004l9f9eng6ul	cmpg41k59000004l7521hfcn4	3	2026-05-29 17:06:17.234	2026-05-29 17:06:17.234	\N
cmpr6bq73000604if62bmwo4w	cmpkl4qyr000004l41n642701	cmpej13hk000004l9f9eng6ul	cmpefcqj2000104ladlx0ysjz	3	2026-05-29 17:06:20.127	2026-05-29 17:06:20.127	\N
cmpr6bsqx000704ifpc42qnxd	cmpkl4qyr000004l41n642701	cmpej13hk000004l9f9eng6ul	cmpn1o6et000004jrcnmw0gav	3	2026-05-29 17:06:23.433	2026-05-29 17:06:23.433	\N
cmpr6bulp000804if2g5kp5r6	cmpkl4qyr000004l41n642701	cmpej13hk000004l9f9eng6ul	\N	3	2026-05-29 17:06:25.837	2026-05-29 17:06:25.837	cmpohz21c000004jx24id9rok
cmpr6c38e000904if97kcwza8	cmpkl4qyr000004l41n642701	cmpej13hk000004l9f9eng6ul	\N	5	2026-05-29 17:06:37.022	2026-05-29 17:06:37.022	cmpol69a5000004l7wi5vd4ad
cmrkomeih000004jo104dob6q	cmr4v6j8z000004jmrs48v3h3	cmpcoy9by000504l8sw41rlak	cmpcov8jd000004l8umh13pux	4	2026-07-14 13:23:32.729	2026-07-14 13:23:32.729	\N
cmrkomncf000204josw2jqy0t	cmr4v6j8z000004jmrs48v3h3	cmpcoy9by000504l8sw41rlak	cmpcsehq1000104ibueo8dlm5	3	2026-07-14 13:23:44.175	2026-07-14 13:23:44.175	\N
cmrkomqg2000304josu67ef6a	cmr4v6j8z000004jmrs48v3h3	cmpcoy9by000504l8sw41rlak	cmpefcd1z000004lasd2r1kdh	4	2026-07-14 13:23:48.194	2026-07-14 13:23:48.194	\N
cmrkomiyt000104jo9d239sn8	cmr4v6j8z000004jmrs48v3h3	cmpcoy9by000504l8sw41rlak	cmpfk8v2v000704jlp8siky9e	3	2026-07-14 13:23:38.501	2026-07-14 13:23:53.982	\N
cmrkomvzs000504jotpl7gp4m	cmr4v6j8z000004jmrs48v3h3	cmpcoy9by000504l8sw41rlak	cmpcm7sgp000004l1fp9o52ky	5	2026-07-14 13:23:55.384	2026-07-14 13:23:55.384	\N
cmrkon052000604jokh9icmos	cmr4v6j8z000004jmrs48v3h3	cmpcoy9by000504l8sw41rlak	cmpcpimjz000004jpcdqgfhfx	3	2026-07-14 13:24:00.758	2026-07-14 13:24:00.758	\N
cmrkon2su000704joa6ktqgvk	cmr4v6j8z000004jmrs48v3h3	cmpcoy9by000504l8sw41rlak	cmpdz2mcq000104jr9xnhl4i0	3	2026-07-14 13:24:04.206	2026-07-14 13:24:04.206	\N
cmrkon4xh000804jo7xph0u8s	cmr4v6j8z000004jmrs48v3h3	cmpcoy9by000504l8sw41rlak	cmpct94t9000204jsxeeckk3m	3	2026-07-14 13:24:06.965	2026-07-14 13:24:06.965	\N
cmrkon6ys000904jobshindpi	cmr4v6j8z000004jmrs48v3h3	cmpcoy9by000504l8sw41rlak	cmpcsds4s000004jmgpwku1j2	2	2026-07-14 13:24:09.604	2026-07-14 13:24:09.604	\N
cmrkon9n3000a04jovy7a6czv	cmr4v6j8z000004jmrs48v3h3	cmpcoy9by000504l8sw41rlak	cmpcpt3n6000004l561lm2ja7	3	2026-07-14 13:24:13.071	2026-07-14 13:24:13.071	\N
cmrkonbwu000b04joozo1e1dm	cmr4v6j8z000004jmrs48v3h3	cmpcoy9by000504l8sw41rlak	cmpefcqj2000104ladlx0ysjz	5	2026-07-14 13:24:16.014	2026-07-14 13:24:16.014	\N
cmrkonfl0000c04joceshisbt	cmr4v6j8z000004jmrs48v3h3	cmpcoy9by000504l8sw41rlak	\N	4	2026-07-14 13:24:20.772	2026-07-14 13:24:20.772	cmr6fbbr5000004jv15p6b2im
cmrm0tk1k000104l2k8gnton1	cmr4v6j8z000004jmrs48v3h3	cmpe0mtc4000004l1e0lft0uf	cmpefcqj2000104ladlx0ysjz	5	2026-07-15 11:52:48.056	2026-07-15 11:52:48.056	\N
cmrm0tlyl000204l27zway7mu	cmr4v6j8z000004jmrs48v3h3	cmpe0mtc4000004l1e0lft0uf	cmpcpt3n6000004l561lm2ja7	4	2026-07-15 11:52:50.541	2026-07-15 11:52:50.541	\N
cmrm0tuoc000004i9kew36h4e	cmr4v6j8z000004jmrs48v3h3	cmpe0mtc4000004l1e0lft0uf	cmpct94t9000204jsxeeckk3m	3	2026-07-15 11:53:01.836	2026-07-15 11:53:01.836	\N
cmrm0twlm000104i96jao7ub4	cmr4v6j8z000004jmrs48v3h3	cmpe0mtc4000004l1e0lft0uf	cmpdz2mcq000104jr9xnhl4i0	3	2026-07-15 11:53:04.33	2026-07-15 11:53:04.33	\N
cmrm0txj1000204i9qsaqvcbz	cmr4v6j8z000004jmrs48v3h3	cmpe0mtc4000004l1e0lft0uf	cmpcpimjz000004jpcdqgfhfx	3	2026-07-15 11:53:05.533	2026-07-15 11:53:05.533	\N
cmrm0tzrr000304l2ma46qu7s	cmr4v6j8z000004jmrs48v3h3	cmpe0mtc4000004l1e0lft0uf	cmpefcd1z000004lasd2r1kdh	3	2026-07-15 11:53:08.439	2026-07-15 11:53:08.439	\N
cmrm0u1my000404l2x39mmlh7	cmr4v6j8z000004jmrs48v3h3	cmpe0mtc4000004l1e0lft0uf	cmpcsehq1000104ibueo8dlm5	3	2026-07-15 11:53:10.858	2026-07-15 11:53:10.858	\N
cmrm0u2rg000004js0rredf49	cmr4v6j8z000004jmrs48v3h3	cmpe0mtc4000004l1e0lft0uf	cmpfk8v2v000704jlp8siky9e	3	2026-07-15 11:53:12.316	2026-07-15 11:53:12.316	\N
cmrm0u7mo000104js64bd1cai	cmr4v6j8z000004jmrs48v3h3	cmpe0mtc4000004l1e0lft0uf	cmpcm7sgp000004l1fp9o52ky	4	2026-07-15 11:53:18.624	2026-07-15 11:53:20.222	\N
cmrm0uc0y000304jsxs3g4b0g	cmr4v6j8z000004jmrs48v3h3	cmpe0mtc4000004l1e0lft0uf	cmpcov8jd000004l8umh13pux	4	2026-07-15 11:53:24.322	2026-07-15 11:53:24.322	\N
cmrm0ueyr000404jsc4j0ydtr	cmr4v6j8z000004jmrs48v3h3	cmpe0mtc4000004l1e0lft0uf	cmpcoxez0000304l8g40zcfou	4	2026-07-15 11:53:28.131	2026-07-15 11:53:28.131	\N
cmrm0th55000004l2c1dsmky8	cmr4v6j8z000004jmrs48v3h3	cmpe0mtc4000004l1e0lft0uf	\N	4	2026-07-15 11:52:44.297	2026-07-15 11:53:36.536	cmr6fbbr5000004jv15p6b2im
cmrp2dfjq000704l7xibwcfu8	cmrkxjsua000004jtqvbnfwac	cmpe0mtc4000004l1e0lft0uf	cmpcov8jd000004l8umh13pux	4	2026-07-17 14:59:33.494	2026-07-17 14:59:33.494	\N
cmrp2dje6000804l7rebxakgb	cmrkxjsua000004jtqvbnfwac	cmpe0mtc4000004l1e0lft0uf	cmpefdkyx000304la3k3nq9p9	4	2026-07-17 14:59:38.478	2026-07-17 14:59:38.478	\N
cmrp2dlqp000904l7sqa627bs	cmrkxjsua000004jtqvbnfwac	cmpe0mtc4000004l1e0lft0uf	cmpcqf47m000004l85vce0gfh	3	2026-07-17 14:59:41.521	2026-07-17 14:59:41.521	\N
cmrp4k3gz000004i6dchsgs1t	cmrkxjsua000004jtqvbnfwac	cmpcoy9by000504l8sw41rlak	cmpcqf47m000004l85vce0gfh	3	2026-07-17 16:00:43.667	2026-07-17 16:00:43.667	\N
cmrp4k6i1000104i65dxigxb0	cmrkxjsua000004jtqvbnfwac	cmpcoy9by000504l8sw41rlak	cmpefdkyx000304la3k3nq9p9	4	2026-07-17 16:00:47.593	2026-07-17 16:00:47.593	\N
cmrp2btkm000004l7eebro26h	cmrkxjsua000004jtqvbnfwac	cmpe0mtc4000004l1e0lft0uf	cmpcpt3n6000004l561lm2ja7	4	2026-07-17 14:58:18.358	2026-07-17 14:58:51.577	\N
cmrp2bs0f000004ibqfmo2xis	cmrkxjsua000004jtqvbnfwac	cmpe0mtc4000004l1e0lft0uf	cmpct2xp7000004jsv1ujpe1r	4	2026-07-17 14:58:16.336	2026-07-17 14:58:52.494	\N
cmrp2cn86000a04ibwfvhi6pq	cmrkxjsua000004jtqvbnfwac	cmpe0mtc4000004l1e0lft0uf	\N	3	2026-07-17 14:58:56.79	2026-07-17 14:58:56.79	cmrnwl1mg000104ldorxpquij
cmrp2cooh000b04ibf8rk24kw	cmrkxjsua000004jtqvbnfwac	cmpe0mtc4000004l1e0lft0uf	cmpfk8v2v000704jlp8siky9e	3	2026-07-17 14:58:58.673	2026-07-17 14:58:58.673	\N
cmrp2csqt000c04ibdgh35t5g	cmrkxjsua000004jtqvbnfwac	cmpe0mtc4000004l1e0lft0uf	cmpcpimjz000004jpcdqgfhfx	4	2026-07-17 14:59:03.941	2026-07-17 14:59:03.941	\N
cmrp2cu1y000d04ib8s8ihslg	cmrkxjsua000004jtqvbnfwac	cmpe0mtc4000004l1e0lft0uf	cmpcopzu6000004jro3prr7ca	3	2026-07-17 14:59:05.638	2026-07-17 14:59:05.638	\N
cmrp2c7qi000304ibvgg24ffy	cmrkxjsua000004jtqvbnfwac	cmpe0mtc4000004l1e0lft0uf	\N	3	2026-07-17 14:58:36.714	2026-07-17 14:59:10.046	cmrnwdiee000004ldvhn5k2ft
cmrp2c0jn000204ib10442is5	cmrkxjsua000004jtqvbnfwac	cmpe0mtc4000004l1e0lft0uf	cmpcoxez0000304l8g40zcfou	3	2026-07-17 14:58:27.395	2026-07-17 14:59:11.578	\N
cmrp2d60g000104l76yokgf7m	cmrkxjsua000004jtqvbnfwac	cmpe0mtc4000004l1e0lft0uf	cmpct94t9000204jsxeeckk3m	3	2026-07-17 14:59:21.136	2026-07-17 14:59:21.136	\N
cmrp2d7lp000204l76abzh1ih	cmrkxjsua000004jtqvbnfwac	cmpe0mtc4000004l1e0lft0uf	cmpefcqj2000104ladlx0ysjz	3	2026-07-17 14:59:23.197	2026-07-17 14:59:23.197	\N
cmrp2d9nf000304l7gwdrw4bp	cmrkxjsua000004jtqvbnfwac	cmpe0mtc4000004l1e0lft0uf	cmpn1o6et000004jrcnmw0gav	3	2026-07-17 14:59:25.851	2026-07-17 14:59:25.851	\N
cmrp2daw2000404l7q8mr9ev5	cmrkxjsua000004jtqvbnfwac	cmpe0mtc4000004l1e0lft0uf	cmpcm7sgp000004l1fp9o52ky	3	2026-07-17 14:59:27.458	2026-07-17 14:59:27.458	\N
cmrp2dcfp000504l7un3bvsvr	cmrkxjsua000004jtqvbnfwac	cmpe0mtc4000004l1e0lft0uf	cmpdz2mcq000104jr9xnhl4i0	3	2026-07-17 14:59:29.461	2026-07-17 14:59:29.461	\N
cmrp2ddzh000604l7lds2coj1	cmrkxjsua000004jtqvbnfwac	cmpe0mtc4000004l1e0lft0uf	cmpefcd1z000004lasd2r1kdh	3	2026-07-17 14:59:31.469	2026-07-17 14:59:31.469	\N
cmrp4ka1u000204i6afndvog1	cmrkxjsua000004jtqvbnfwac	cmpcoy9by000504l8sw41rlak	cmpcov8jd000004l8umh13pux	4	2026-07-17 16:00:52.194	2026-07-17 16:00:52.194	\N
cmrp4kcai000304i6m5wxuhb5	cmrkxjsua000004jtqvbnfwac	cmpcoy9by000504l8sw41rlak	cmpefcd1z000004lasd2r1kdh	3	2026-07-17 16:00:55.098	2026-07-17 16:00:55.098	\N
cmrp4kf15000404i6whkk3c75	cmrkxjsua000004jtqvbnfwac	cmpcoy9by000504l8sw41rlak	cmpdz2mcq000104jr9xnhl4i0	3	2026-07-17 16:00:58.649	2026-07-17 16:00:58.649	\N
cmrp4khk8000504i6fxq0me56	cmrkxjsua000004jtqvbnfwac	cmpcoy9by000504l8sw41rlak	cmpcm7sgp000004l1fp9o52ky	3	2026-07-17 16:01:01.928	2026-07-17 16:01:01.928	\N
cmrp4kk8n000604i6508ukfm6	cmrkxjsua000004jtqvbnfwac	cmpcoy9by000504l8sw41rlak	cmpn1o6et000004jrcnmw0gav	3	2026-07-17 16:01:05.399	2026-07-17 16:01:05.399	\N
cmrp4kmqt000704i6tpgdeit1	cmrkxjsua000004jtqvbnfwac	cmpcoy9by000504l8sw41rlak	cmpefcqj2000104ladlx0ysjz	2	2026-07-17 16:01:08.645	2026-07-17 16:01:08.645	\N
cmrp4kqvt000804i6l17l64fb	cmrkxjsua000004jtqvbnfwac	cmpcoy9by000504l8sw41rlak	cmpct94t9000204jsxeeckk3m	3	2026-07-17 16:01:14.009	2026-07-17 16:01:14.009	\N
cmrp4kvx8000904i65v1kgfgb	cmrkxjsua000004jtqvbnfwac	cmpcoy9by000504l8sw41rlak	cmpcopzu6000004jro3prr7ca	2	2026-07-17 16:01:20.54	2026-07-17 16:01:20.54	\N
cmrp4kz7b000004la1qwiqog0	cmrkxjsua000004jtqvbnfwac	cmpcoy9by000504l8sw41rlak	cmpcpimjz000004jpcdqgfhfx	3	2026-07-17 16:01:24.791	2026-07-17 16:01:24.791	\N
cmrp4l3ff000a04i6nlaivtgr	cmrkxjsua000004jtqvbnfwac	cmpcoy9by000504l8sw41rlak	cmpfk8v2v000704jlp8siky9e	3	2026-07-17 16:01:30.267	2026-07-17 16:01:30.267	\N
cmrp4l5ef000b04i6shgyonxj	cmrkxjsua000004jtqvbnfwac	cmpcoy9by000504l8sw41rlak	\N	3	2026-07-17 16:01:32.823	2026-07-17 16:01:32.823	cmrnwl1mg000104ldorxpquij
cmrp4l7qx000c04i6yds7bkld	cmrkxjsua000004jtqvbnfwac	cmpcoy9by000504l8sw41rlak	\N	3	2026-07-17 16:01:35.865	2026-07-17 16:01:35.865	cmrnwdiee000004ldvhn5k2ft
cmrp4l9de000d04i6sc3p4qyy	cmrkxjsua000004jtqvbnfwac	cmpcoy9by000504l8sw41rlak	cmpcsds4s000004jmgpwku1j2	4	2026-07-17 16:01:37.97	2026-07-17 16:01:37.97	\N
cmrp4lhzd000104lae4pfnimz	cmrkxjsua000004jtqvbnfwac	cmpcoy9by000504l8sw41rlak	cmpcpt3n6000004l561lm2ja7	4	2026-07-17 16:01:49.129	2026-07-17 16:01:49.129	\N
cmrp4lloj000204larpk3pfy9	cmrkxjsua000004jtqvbnfwac	cmpcoy9by000504l8sw41rlak	cmpct2xp7000004jsv1ujpe1r	3	2026-07-17 16:01:53.923	2026-07-17 16:01:53.923	\N
cmrtc4o01000004iftqz15i71	cmqp5jh8b000004jp8k1q116l	cmpcrj7ws000004l8oescls0l	cmpcm7sgp000004l1fp9o52ky	2	2026-07-20 14:43:45.409	2026-07-20 14:43:45.409	\N
cms4oez2b000504ldg1bfh5wf	cmqp5jh8b000004jp8k1q116l	cmpcoy9by000504l8sw41rlak	cmpn1o6et000004jrcnmw0gav	3	2026-07-28 13:13:09.636	2026-07-28 13:13:09.636	\N
cmrtc4qwq000104if3cjzom8a	cmqp5jh8b000004jp8k1q116l	cmpcrj7ws000004l8oescls0l	cmpcopzu6000004jro3prr7ca	3	2026-07-20 14:43:49.178	2026-07-20 14:43:57.268	\N
cmrtc4ype000404ifegpn3410	cmqp5jh8b000004jp8k1q116l	cmpcrj7ws000004l8oescls0l	cmpn1o6et000004jrcnmw0gav	2	2026-07-20 14:43:59.282	2026-07-20 14:43:59.282	\N
cmrtc52pd000504if8p4v5lni	cmqp5jh8b000004jp8k1q116l	cmpcrj7ws000004l8oescls0l	cmpcsds4s000004jmgpwku1j2	3	2026-07-20 14:44:04.465	2026-07-20 14:44:04.465	\N
cmrtc5455000604ifu291ha9s	cmqp5jh8b000004jp8k1q116l	cmpcrj7ws000004l8oescls0l	cmpdz2mcq000104jr9xnhl4i0	3	2026-07-20 14:44:06.329	2026-07-20 14:44:06.329	\N
cmrtc56i9000704if8nuprxe1	cmqp5jh8b000004jp8k1q116l	cmpcrj7ws000004l8oescls0l	cmpefcqj2000104ladlx0ysjz	3	2026-07-20 14:44:09.393	2026-07-20 14:44:09.393	\N
cmrtc57z1000804ifsehuuj0m	cmqp5jh8b000004jp8k1q116l	cmpcrj7ws000004l8oescls0l	cmpcoxez0000304l8g40zcfou	2	2026-07-20 14:44:11.293	2026-07-20 14:44:11.293	\N
cmrtc5a3h000904if4lh5mfvh	cmqp5jh8b000004jp8k1q116l	cmpcrj7ws000004l8oescls0l	cmrozuqv4000104l5tbza8qgy	3	2026-07-20 14:44:14.045	2026-07-20 14:44:14.045	\N
cmrtc5bzp000a04iftaabwht8	cmqp5jh8b000004jp8k1q116l	cmpcrj7ws000004l8oescls0l	cmpcqf47m000004l85vce0gfh	2	2026-07-20 14:44:16.501	2026-07-20 14:44:16.501	\N
cmrtc5d5c000b04ifk6clhnsb	cmqp5jh8b000004jp8k1q116l	cmpcrj7ws000004l8oescls0l	\N	3	2026-07-20 14:44:18	2026-07-20 14:44:18	cmrquvpyi000004l7unpqoe7j
cmrtc6qm4000004l3wnrouaoz	cmrkxjsua000004jtqvbnfwac	cmpcrj7ws000004l8oescls0l	cmpcqf47m000004l85vce0gfh	3	2026-07-20 14:45:22.108	2026-07-20 14:45:22.108	\N
cmrtc6rvl000104l3hqm1ddwe	cmrkxjsua000004jtqvbnfwac	cmpcrj7ws000004l8oescls0l	cmpefdkyx000304la3k3nq9p9	4	2026-07-20 14:45:23.745	2026-07-20 14:45:24.65	\N
cmrtc6urg000c04ifiez9fi8f	cmrkxjsua000004jtqvbnfwac	cmpcrj7ws000004l8oescls0l	cmpcov8jd000004l8umh13pux	4	2026-07-20 14:45:27.484	2026-07-20 14:45:27.484	\N
cmrtc6w61000d04if1xqyq1md	cmrkxjsua000004jtqvbnfwac	cmpcrj7ws000004l8oescls0l	cmpefcd1z000004lasd2r1kdh	4	2026-07-20 14:45:29.305	2026-07-20 14:45:29.305	\N
cmrtc6y6v000e04ifc4s0s3nk	cmrkxjsua000004jtqvbnfwac	cmpcrj7ws000004l8oescls0l	cmpcm7sgp000004l1fp9o52ky	4	2026-07-20 14:45:31.927	2026-07-20 14:45:31.927	\N
cmrtc6zvj000f04iftnjky1uv	cmrkxjsua000004jtqvbnfwac	cmpcrj7ws000004l8oescls0l	cmpn1o6et000004jrcnmw0gav	3	2026-07-20 14:45:34.111	2026-07-20 14:45:34.111	\N
cmrtc723x000g04ifc8ego4wa	cmrkxjsua000004jtqvbnfwac	cmpcrj7ws000004l8oescls0l	cmpefcqj2000104ladlx0ysjz	3	2026-07-20 14:45:37.005	2026-07-20 14:45:37.005	\N
cmrtc77uf000h04ifbzjw7nxs	cmrkxjsua000004jtqvbnfwac	cmpcrj7ws000004l8oescls0l	cmpct94t9000204jsxeeckk3m	2	2026-07-20 14:45:44.439	2026-07-20 14:45:44.439	\N
cmrtc7bn7000i04if3fkacbtw	cmrkxjsua000004jtqvbnfwac	cmpcrj7ws000004l8oescls0l	cmpcopzu6000004jro3prr7ca	2	2026-07-20 14:45:49.363	2026-07-20 14:45:49.363	\N
cmrtc7iul000j04ifme4kqo1j	cmrkxjsua000004jtqvbnfwac	cmpcrj7ws000004l8oescls0l	cmpfk8v2v000704jlp8siky9e	3	2026-07-20 14:45:58.701	2026-07-20 14:45:58.701	\N
cmrtc7ovy000k04if2l988ic9	cmrkxjsua000004jtqvbnfwac	cmpcrj7ws000004l8oescls0l	cmpcsds4s000004jmgpwku1j2	3	2026-07-20 14:46:06.526	2026-07-20 14:46:06.526	\N
cmrtc7utq000204kzjagpb4d9	cmrkxjsua000004jtqvbnfwac	cmpcrj7ws000004l8oescls0l	cmpcpt3n6000004l561lm2ja7	3	2026-07-20 14:46:14.222	2026-07-20 14:46:14.222	\N
cmrtc7xw5000304kz94jl8y7m	cmrkxjsua000004jtqvbnfwac	cmpcrj7ws000004l8oescls0l	cmpct2xp7000004jsv1ujpe1r	3	2026-07-20 14:46:18.197	2026-07-20 14:46:18.197	\N
cms4odds5000104l4nqvol5zt	cmrthsbf6000004kybfhn32yj	cmpn1yeh5000104jrhfyq0v6c	cmpcm7sgp000004l1fp9o52ky	3	2026-07-28 13:11:55.397	2026-07-28 13:11:55.397	\N
cms4odfbk000204l4zxqyw4m7	cmrthsbf6000004kybfhn32yj	cmpn1yeh5000104jrhfyq0v6c	cmpefdkyx000304la3k3nq9p9	3	2026-07-28 13:11:57.392	2026-07-28 13:11:57.392	\N
cms4odhcm000304l4wd9f4ou0	cmrthsbf6000004kybfhn32yj	cmpn1yeh5000104jrhfyq0v6c	cmpcqf47m000004l85vce0gfh	3	2026-07-28 13:12:00.022	2026-07-28 13:12:00.022	\N
cms4odkpa000404l4vyj2yqsg	cmrthsbf6000004kybfhn32yj	cmpn1yeh5000104jrhfyq0v6c	cmpcpt3n6000004l561lm2ja7	3	2026-07-28 13:12:04.366	2026-07-28 13:12:04.366	\N
cms4odq1l000004jvwz9x2x6s	cmrthsbf6000004kybfhn32yj	cmpn1yeh5000104jrhfyq0v6c	cmph7t8a1000004l9n8uic25p	3	2026-07-28 13:12:11.289	2026-07-28 13:12:11.289	\N
cms4odo72000004kw4x6ing3f	cmrthsbf6000004kybfhn32yj	cmpn1yeh5000104jrhfyq0v6c	cmpdz2mcq000104jr9xnhl4i0	5	2026-07-28 13:12:08.894	2026-07-28 13:12:19.021	\N
cms4odyuk000004ldbdwu430v	cmrthsbf6000004kybfhn32yj	cmpn1yeh5000104jrhfyq0v6c	cmpcpimjz000004jpcdqgfhfx	4	2026-07-28 13:12:22.7	2026-07-28 13:12:22.7	\N
cms4oe0n4000104ld8x1m7ow0	cmrthsbf6000004kybfhn32yj	cmpn1yeh5000104jrhfyq0v6c	cmpct94t9000204jsxeeckk3m	3	2026-07-28 13:12:25.024	2026-07-28 13:12:25.024	\N
cms4oe2uu000204ld73lbe1i4	cmrthsbf6000004kybfhn32yj	cmpn1yeh5000104jrhfyq0v6c	cmpefcqj2000104ladlx0ysjz	5	2026-07-28 13:12:27.894	2026-07-28 13:12:27.894	\N
cms4oe65a000104kw78l9ga3t	cmrthsbf6000004kybfhn32yj	cmpn1yeh5000104jrhfyq0v6c	cmpcopzu6000004jro3prr7ca	3	2026-07-28 13:12:32.158	2026-07-28 13:12:32.158	\N
cms4oe9dr000204kwk76b8ybp	cmrthsbf6000004kybfhn32yj	cmpn1yeh5000104jrhfyq0v6c	\N	4	2026-07-28 13:12:36.351	2026-07-28 13:12:36.351	cmrzexgp2000004l78kqxjk6i
cms4oecci000504l47ps3u3gf	cmrthsbf6000004kybfhn32yj	cmpn1yeh5000104jrhfyq0v6c	\N	2	2026-07-28 13:12:40.194	2026-07-28 13:12:40.194	cmrzexwwc000004jswbo5x3tv
cms4oefqj000304ldf2fv5k3m	cmrthsbf6000004kybfhn32yj	cmpn1yeh5000104jrhfyq0v6c	\N	3	2026-07-28 13:12:44.587	2026-07-28 13:12:44.587	cms0jkysa000004l1f4w2tuwg
cms4oek61000404ldlihhm7dw	cmrthsbf6000004kybfhn32yj	cmpn1yeh5000104jrhfyq0v6c	\N	5	2026-07-28 13:12:50.329	2026-07-28 13:12:50.329	cms38trc5000004jxs9a018ai
cms4oeqb4000204jvoc7xzodv	cmrthsbf6000004kybfhn32yj	cmpn1yeh5000104jrhfyq0v6c	\N	3	2026-07-28 13:12:58.288	2026-07-28 13:12:58.288	cmrzf5nhj000004ktc5cfdvhn
cms4of3ae000604ldvaaaw931	cmqp5jh8b000004jp8k1q116l	cmpcoy9by000504l8sw41rlak	cmpcm7sgp000004l1fp9o52ky	3	2026-07-28 13:13:15.11	2026-07-28 13:13:15.11	\N
cms4ofd9n000704ldgpf9i1n6	cmqp5jh8b000004jp8k1q116l	cmpcoy9by000504l8sw41rlak	cmpcsds4s000004jmgpwku1j2	3	2026-07-28 13:13:28.043	2026-07-28 13:13:28.043	\N
cms4ofj79000804ldgl64j0qd	cmqp5jh8b000004jp8k1q116l	cmpcoy9by000504l8sw41rlak	cmpdz2mcq000104jr9xnhl4i0	3	2026-07-28 13:13:35.733	2026-07-28 13:13:35.733	\N
cms4ofsrj000904lddk2w5txr	cmqp5jh8b000004jp8k1q116l	cmpcoy9by000504l8sw41rlak	cmpefcqj2000104ladlx0ysjz	3	2026-07-28 13:13:48.127	2026-07-28 13:13:48.127	\N
cms4ofwzb000a04ldihygogy7	cmqp5jh8b000004jp8k1q116l	cmpcoy9by000504l8sw41rlak	cmrozuqv4000104l5tbza8qgy	3	2026-07-28 13:13:53.591	2026-07-28 13:13:53.591	\N
cms4ofyzh000b04ld7y3mi3ag	cmqp5jh8b000004jp8k1q116l	cmpcoy9by000504l8sw41rlak	cmpcqf47m000004l85vce0gfh	2	2026-07-28 13:13:56.189	2026-07-28 13:13:56.189	\N
cms4og0pm000c04ld6ougiuii	cmqp5jh8b000004jp8k1q116l	cmpcoy9by000504l8sw41rlak	\N	3	2026-07-28 13:13:58.426	2026-07-28 13:13:58.426	cmrquvpyi000004l7unpqoe7j
cms4og3k0000d04ldnj1bad2u	cmqp5jh8b000004jp8k1q116l	cmpcoy9by000504l8sw41rlak	cmpcopzu6000004jro3prr7ca	3	2026-07-28 13:14:02.112	2026-07-28 13:14:02.112	\N
cms4se3pu000004icjz6lh2vv	cmrthsbf6000004kybfhn32yj	cmpctqpqx000004jv6uocm5mt	cmpcpimjz000004jpcdqgfhfx	4	2026-07-28 15:04:27.474	2026-07-28 15:04:27.474	\N
cms4se65x000104icdge22ek4	cmrthsbf6000004kybfhn32yj	cmpctqpqx000004jv6uocm5mt	cmph7t8a1000004l9n8uic25p	3	2026-07-28 15:04:30.645	2026-07-28 15:04:30.645	\N
cms4sek57000004jtl3h2y2j7	cmrthsbf6000004kybfhn32yj	cmpctqpqx000004jv6uocm5mt	cmpefcqj2000104ladlx0ysjz	2	2026-07-28 15:04:48.763	2026-07-28 15:04:48.763	\N
cms4semuf000104jtnk2wz95v	cmrthsbf6000004kybfhn32yj	cmpctqpqx000004jv6uocm5mt	cmpct94t9000204jsxeeckk3m	3	2026-07-28 15:04:52.263	2026-07-28 15:04:52.263	\N
cms4sepmi000204jttds50jnx	cmrthsbf6000004kybfhn32yj	cmpctqpqx000004jv6uocm5mt	cmpdz2mcq000104jr9xnhl4i0	4	2026-07-28 15:04:55.866	2026-07-28 15:04:55.866	\N
cms4serem000304jt8w1iljw1	cmrthsbf6000004kybfhn32yj	cmpctqpqx000004jv6uocm5mt	cmpcpt3n6000004l561lm2ja7	3	2026-07-28 15:04:58.174	2026-07-28 15:04:58.174	\N
cms4sesw7000404jtehi0suq3	cmrthsbf6000004kybfhn32yj	cmpctqpqx000004jv6uocm5mt	cmpcqf47m000004l85vce0gfh	4	2026-07-28 15:05:00.103	2026-07-28 15:05:00.103	\N
cms4sev9a000504jt8exmxuyk	cmrthsbf6000004kybfhn32yj	cmpctqpqx000004jv6uocm5mt	cmpefdkyx000304la3k3nq9p9	3	2026-07-28 15:05:03.166	2026-07-28 15:05:03.166	\N
cms4sewu6000604jtgf1tky0u	cmrthsbf6000004kybfhn32yj	cmpctqpqx000004jv6uocm5mt	cmpcm7sgp000004l1fp9o52ky	2	2026-07-28 15:05:05.214	2026-07-28 15:05:05.214	\N
cms4sey3v000704jtzb3t0xbd	cmrthsbf6000004kybfhn32yj	cmpctqpqx000004jv6uocm5mt	cmpn1o6et000004jrcnmw0gav	5	2026-07-28 15:05:06.859	2026-07-28 15:05:06.859	\N
cms4sf7th000804jt2rey1ejw	cmrthsbf6000004kybfhn32yj	cmpctqpqx000004jv6uocm5mt	\N	3	2026-07-28 15:05:19.445	2026-07-28 15:05:19.445	cms38trc5000004jxs9a018ai
cms4sfcrj000904jtpls5kqxx	cmrthsbf6000004kybfhn32yj	cmpctqpqx000004jv6uocm5mt	\N	2	2026-07-28 15:05:25.855	2026-07-28 15:05:25.855	cms0jkysa000004l1f4w2tuwg
cms4sfe8p000a04jts0ip90fe	cmrthsbf6000004kybfhn32yj	cmpctqpqx000004jv6uocm5mt	\N	1	2026-07-28 15:05:27.769	2026-07-28 15:05:27.769	cmrzf5nhj000004ktc5cfdvhn
cms4sfiae000b04jt4fdhhgec	cmrthsbf6000004kybfhn32yj	cmpctqpqx000004jv6uocm5mt	\N	2	2026-07-28 15:05:33.014	2026-07-28 15:05:33.014	cmrzexwwc000004jswbo5x3tv
cms4sfkda000c04jtf8q3xf9b	cmrthsbf6000004kybfhn32yj	cmpctqpqx000004jv6uocm5mt	\N	2	2026-07-28 15:05:35.71	2026-07-28 15:05:35.71	cmrzexgp2000004l78kqxjk6i
cms4sgdzc000d04jtja8zptgc	cmqp5jh8b000004jp8k1q116l	cmpctqpqx000004jv6uocm5mt	cmpefcqj2000104ladlx0ysjz	1	2026-07-28 15:06:14.088	2026-07-28 15:06:14.088	\N
cms4sghwq000e04jtgwjba7os	cmqp5jh8b000004jp8k1q116l	cmpctqpqx000004jv6uocm5mt	cmpcoxez0000304l8g40zcfou	2	2026-07-28 15:06:19.178	2026-07-28 15:06:19.178	\N
cms4sgjuz000f04jtk4owv3q7	cmqp5jh8b000004jp8k1q116l	cmpctqpqx000004jv6uocm5mt	cmrozuqv4000104l5tbza8qgy	4	2026-07-28 15:06:21.707	2026-07-28 15:06:21.707	\N
cms4sglfy000g04jted7yz6ty	cmqp5jh8b000004jp8k1q116l	cmpctqpqx000004jv6uocm5mt	cmpcqf47m000004l85vce0gfh	3	2026-07-28 15:06:23.758	2026-07-28 15:06:23.758	\N
cms4sgnzo000h04jt4aq7pw3f	cmqp5jh8b000004jp8k1q116l	cmpctqpqx000004jv6uocm5mt	\N	3	2026-07-28 15:06:27.06	2026-07-28 15:06:27.06	cmrquvpyi000004l7unpqoe7j
cms4sgruo000i04jtxr1g38p2	cmqp5jh8b000004jp8k1q116l	cmpctqpqx000004jv6uocm5mt	cmpcpimjz000004jpcdqgfhfx	1	2026-07-28 15:06:32.064	2026-07-28 15:06:32.064	\N
cms4sgusp000j04jtzjqh99jb	cmqp5jh8b000004jp8k1q116l	cmpctqpqx000004jv6uocm5mt	cmpn1o6et000004jrcnmw0gav	4	2026-07-28 15:06:35.882	2026-07-28 15:06:35.882	\N
cms4sgvs8000k04jta2hur5qh	cmqp5jh8b000004jp8k1q116l	cmpctqpqx000004jv6uocm5mt	cmpcm7sgp000004l1fp9o52ky	2	2026-07-28 15:06:37.16	2026-07-28 15:06:37.16	\N
cms4sgyzp000l04jti0ltroyl	cmqp5jh8b000004jp8k1q116l	cmpctqpqx000004jv6uocm5mt	cmpcsds4s000004jmgpwku1j2	3	2026-07-28 15:06:41.317	2026-07-28 15:06:41.317	\N
cms4sh0ww000m04jtbupxtnfy	cmqp5jh8b000004jp8k1q116l	cmpctqpqx000004jv6uocm5mt	cmpdz2mcq000104jr9xnhl4i0	4	2026-07-28 15:06:43.808	2026-07-28 15:06:43.808	\N
cms4ufnrj000004la8anh9mkh	cmrthsbf6000004kybfhn32yj	cmpcrj7ws000004l8oescls0l	cmpn1o6et000004jrcnmw0gav	4	2026-07-28 16:01:39.343	2026-07-28 16:01:39.343	\N
cms4ufslw000104lanv1fe4rt	cmrthsbf6000004kybfhn32yj	cmpcrj7ws000004l8oescls0l	cmpcm7sgp000004l1fp9o52ky	3	2026-07-28 16:01:45.62	2026-07-28 16:01:45.62	\N
cms4ufvre000204laljlxg1fa	cmrthsbf6000004kybfhn32yj	cmpcrj7ws000004l8oescls0l	cmpefdkyx000304la3k3nq9p9	3	2026-07-28 16:01:49.706	2026-07-28 16:01:49.706	\N
cms4ufxw0000004kzr33ppjod	cmrthsbf6000004kybfhn32yj	cmpcrj7ws000004l8oescls0l	cmpcqf47m000004l85vce0gfh	3	2026-07-28 16:01:52.464	2026-07-28 16:01:52.464	\N
cms4ug0vt000004lcf3sfgq4r	cmrthsbf6000004kybfhn32yj	cmpcrj7ws000004l8oescls0l	cmpdz2mcq000104jr9xnhl4i0	3	2026-07-28 16:01:56.345	2026-07-28 16:01:56.345	\N
cms4ug47m000104kzl5vbd990	cmrthsbf6000004kybfhn32yj	cmpcrj7ws000004l8oescls0l	cmpcpt3n6000004l561lm2ja7	3	2026-07-28 16:02:00.658	2026-07-28 16:02:00.658	\N
cms4ug9i5000004l7b62dlw8i	cmrthsbf6000004kybfhn32yj	cmpcrj7ws000004l8oescls0l	cmph7t8a1000004l9n8uic25p	3	2026-07-28 16:02:07.517	2026-07-28 16:02:07.517	\N
cms4ugelz000104l7gpwx4w2g	cmrthsbf6000004kybfhn32yj	cmpcrj7ws000004l8oescls0l	cmpct94t9000204jsxeeckk3m	3	2026-07-28 16:02:14.135	2026-07-28 16:02:14.135	\N
cms4uggh9000204l7zvqb7lv2	cmrthsbf6000004kybfhn32yj	cmpcrj7ws000004l8oescls0l	cmpefcqj2000104ladlx0ysjz	4	2026-07-28 16:02:16.557	2026-07-28 16:02:16.557	\N
cms4ugiqn000104lc328xwz9o	cmrthsbf6000004kybfhn32yj	cmpcrj7ws000004l8oescls0l	cmpcopzu6000004jro3prr7ca	3	2026-07-28 16:02:19.487	2026-07-28 16:02:19.487	\N
cms4ugppe000304laijjw3a76	cmrthsbf6000004kybfhn32yj	cmpcrj7ws000004l8oescls0l	\N	2	2026-07-28 16:02:28.514	2026-07-28 16:02:28.514	cms0jkysa000004l1f4w2tuwg
cms4uiudb000304l7qnv1xhou	cmrkxlng5000004jofpanlfev	cmpcrj7ws000004l8oescls0l	cmpcm7sgp000004l1fp9o52ky	3	2026-07-28 16:04:07.871	2026-07-28 16:04:07.871	\N
cms4uiw12000204kz32fg7ozo	cmrkxlng5000004jofpanlfev	cmpcrj7ws000004l8oescls0l	cmpcopzu6000004jro3prr7ca	3	2026-07-28 16:04:10.022	2026-07-28 16:04:10.022	\N
cms4uixoz000304kz12gfanfr	cmrkxlng5000004jofpanlfev	cmpcrj7ws000004l8oescls0l	cmpcqf47m000004l85vce0gfh	2	2026-07-28 16:04:12.179	2026-07-28 16:04:12.179	\N
cms4uizv6000404kzz7isisrm	cmrkxlng5000004jofpanlfev	cmpcrj7ws000004l8oescls0l	cmpefdkyx000304la3k3nq9p9	4	2026-07-28 16:04:14.994	2026-07-28 16:04:14.994	\N
cms4uj1tf000504kzpmore0g5	cmrkxlng5000004jofpanlfev	cmpcrj7ws000004l8oescls0l	cmpefcqj2000104ladlx0ysjz	3	2026-07-28 16:04:17.523	2026-07-28 16:04:17.523	\N
cms4uj4lz000604kzck4sxcf3	cmrkxlng5000004jofpanlfev	cmpcrj7ws000004l8oescls0l	cmpefcd1z000004lasd2r1kdh	3	2026-07-28 16:04:21.143	2026-07-28 16:04:21.143	\N
cms4uj6o0000704kz4jy76a7r	cmrkxlng5000004jofpanlfev	cmpcrj7ws000004l8oescls0l	cmpn1o6et000004jrcnmw0gav	3	2026-07-28 16:04:23.808	2026-07-28 16:04:23.808	\N
cms4uj89s000804kzf2gj1dqz	cmrkxlng5000004jofpanlfev	cmpcrj7ws000004l8oescls0l	cmpct94t9000204jsxeeckk3m	2	2026-07-28 16:04:25.888	2026-07-28 16:04:25.888	\N
cms4uja9o000904kzk99r7j82	cmrkxlng5000004jofpanlfev	cmpcrj7ws000004l8oescls0l	cmpdz2mcq000104jr9xnhl4i0	2	2026-07-28 16:04:28.476	2026-07-28 16:04:28.476	\N
cms4ujegv000a04kzy00ea1u9	cmrkxlng5000004jofpanlfev	cmpcrj7ws000004l8oescls0l	cmpcsds4s000004jmgpwku1j2	2	2026-07-28 16:04:33.919	2026-07-28 16:04:33.919	\N
cms4ujid1000b04kzaq8enl3g	cmrkxlng5000004jofpanlfev	cmpcrj7ws000004l8oescls0l	cmpfk8v2v000704jlp8siky9e	3	2026-07-28 16:04:38.965	2026-07-28 16:04:38.965	\N
cms4ujlyr000c04kzagmmocdz	cmrkxlng5000004jofpanlfev	cmpcrj7ws000004l8oescls0l	cmrozuqv4000104l5tbza8qgy	3	2026-07-28 16:04:43.635	2026-07-28 16:04:43.635	\N
cms4ujryr000404l7fqmajtcv	cmrkxlng5000004jofpanlfev	cmpcrj7ws000004l8oescls0l	cmpcpt3n6000004l561lm2ja7	3	2026-07-28 16:04:51.411	2026-07-28 16:04:51.411	\N
cms4ujtfm000204lcd2gilxbg	cmrkxlng5000004jofpanlfev	cmpcrj7ws000004l8oescls0l	cmpefep0o000504laynrqmhnw	1	2026-07-28 16:04:53.314	2026-07-28 16:04:53.314	\N
cms50gn1b000004jum2o8ur8y	cmrkxlng5000004jofpanlfev	cmpe0mtc4000004l1e0lft0uf	cmpcm7sgp000004l1fp9o52ky	3	2026-07-28 18:50:22.751	2026-07-28 18:50:24.543	\N
cms50gqa7000204jubvy4rrew	cmrkxlng5000004jofpanlfev	cmpe0mtc4000004l1e0lft0uf	cmpcopzu6000004jro3prr7ca	2	2026-07-28 18:50:26.959	2026-07-28 18:50:26.959	\N
cms50gs13000304jup0ia53bk	cmrkxlng5000004jofpanlfev	cmpe0mtc4000004l1e0lft0uf	cmpcqf47m000004l85vce0gfh	2	2026-07-28 18:50:29.223	2026-07-28 18:50:29.223	\N
cms50gu0n000404juwws3z42o	cmrkxlng5000004jofpanlfev	cmpe0mtc4000004l1e0lft0uf	cmpcpimjz000004jpcdqgfhfx	2	2026-07-28 18:50:31.799	2026-07-28 18:50:36.414	\N
cms50h32x000604jurf6wxydq	cmrkxlng5000004jofpanlfev	cmpe0mtc4000004l1e0lft0uf	cmpefdkyx000304la3k3nq9p9	4	2026-07-28 18:50:43.545	2026-07-28 18:50:43.545	\N
cms50ha84000004jl4xdzslju	cmrkxlng5000004jofpanlfev	cmpe0mtc4000004l1e0lft0uf	cmpefcqj2000104ladlx0ysjz	3	2026-07-28 18:50:52.804	2026-07-28 18:50:52.804	\N
cms50hbkn000104jlo431g8ra	cmrkxlng5000004jofpanlfev	cmpe0mtc4000004l1e0lft0uf	cmpefcd1z000004lasd2r1kdh	3	2026-07-28 18:50:54.551	2026-07-28 18:50:54.551	\N
cms50hd3v000204jlhknwbn7s	cmrkxlng5000004jofpanlfev	cmpe0mtc4000004l1e0lft0uf	cmpn1o6et000004jrcnmw0gav	3	2026-07-28 18:50:56.54	2026-07-28 18:50:56.54	\N
cms50hesk000304jl3b373p1q	cmrkxlng5000004jofpanlfev	cmpe0mtc4000004l1e0lft0uf	cmpct94t9000204jsxeeckk3m	2	2026-07-28 18:50:58.724	2026-07-28 18:50:58.724	\N
cms50hfsy000404jl8hwqjl0s	cmrkxlng5000004jofpanlfev	cmpe0mtc4000004l1e0lft0uf	cmpdz2mcq000104jr9xnhl4i0	2	2026-07-28 18:51:00.034	2026-07-28 18:51:00.034	\N
cms50hjo3000504jle7scluu4	cmrkxlng5000004jofpanlfev	cmpe0mtc4000004l1e0lft0uf	cmpfk8v2v000704jlp8siky9e	3	2026-07-28 18:51:05.043	2026-07-28 18:51:05.043	\N
cms50hlap000604jlc1t9edzo	cmrkxlng5000004jofpanlfev	cmpe0mtc4000004l1e0lft0uf	cmrozuqv4000104l5tbza8qgy	3	2026-07-28 18:51:07.153	2026-07-28 18:51:07.153	\N
cms50hndq000004job2n0423p	cmrkxlng5000004jofpanlfev	cmpe0mtc4000004l1e0lft0uf	cmpcpt3n6000004l561lm2ja7	1	2026-07-28 18:51:09.855	2026-07-28 18:51:11.388	\N
cms50hq5v000204joneo9jw26	cmrkxlng5000004jofpanlfev	cmpe0mtc4000004l1e0lft0uf	cmpefep0o000504laynrqmhnw	1	2026-07-28 18:51:13.459	2026-07-28 18:51:13.459	\N
cms50ibg8000004lb1p2jpaqj	cmqp5jh8b000004jp8k1q116l	cmpe0mtc4000004l1e0lft0uf	cmpcm7sgp000004l1fp9o52ky	2	2026-07-28 18:51:41.049	2026-07-28 18:51:41.049	\N
cms50ict6000104lbancx4cms	cmqp5jh8b000004jp8k1q116l	cmpe0mtc4000004l1e0lft0uf	cmpn1o6et000004jrcnmw0gav	2	2026-07-28 18:51:42.81	2026-07-28 18:51:42.81	\N
cms50iell000204lb5lnvqks2	cmqp5jh8b000004jp8k1q116l	cmpe0mtc4000004l1e0lft0uf	cmpcopzu6000004jro3prr7ca	3	2026-07-28 18:51:45.13	2026-07-28 18:51:45.13	\N
cms50ig25000304lbvrezc1o1	cmqp5jh8b000004jp8k1q116l	cmpe0mtc4000004l1e0lft0uf	cmpcpimjz000004jpcdqgfhfx	1	2026-07-28 18:51:47.021	2026-07-28 18:51:47.021	\N
cms50ik3p000404lbx6xwbd3c	cmqp5jh8b000004jp8k1q116l	cmpe0mtc4000004l1e0lft0uf	cmpdz2mcq000104jr9xnhl4i0	2	2026-07-28 18:51:52.261	2026-07-28 18:51:53.443	\N
cms50ilym000604lbl095a71g	cmqp5jh8b000004jp8k1q116l	cmpe0mtc4000004l1e0lft0uf	cmpefcqj2000104ladlx0ysjz	3	2026-07-28 18:51:54.67	2026-07-28 18:51:56.205	\N
cms8c3npu000a04jy4p03x9ob	cms3d5vfv000004jxuwwehm57	cmpn1yeh5000104jrhfyq0v6c	cmpcopzu6000004jro3prr7ca	4	2026-07-31 02:39:31.026	2026-07-31 02:39:31.026	\N
cmsbqtdze000004l9jq1ra05c	cms3d5vfv000004jxuwwehm57	cmpe0mtc4000004l1e0lft0uf	cmpcopzu6000004jro3prr7ca	4	2026-08-02 11:54:44.618	2026-08-02 11:54:44.618	\N
cms50is6q000b04lbtoy0xvon	cmqp5jh8b000004jp8k1q116l	cmpe0mtc4000004l1e0lft0uf	cmrozuqv4000104l5tbza8qgy	1	2026-07-28 18:52:02.738	2026-07-28 18:52:02.738	\N
cms50ipor000804lbg7l8st82	cmqp5jh8b000004jp8k1q116l	cmpe0mtc4000004l1e0lft0uf	cmpcoxez0000304l8g40zcfou	1	2026-07-28 18:51:59.499	2026-07-28 18:52:03.85	\N
cms50iups000d04lbo2bam4uv	cmqp5jh8b000004jp8k1q116l	cmpe0mtc4000004l1e0lft0uf	cmpcqf47m000004l85vce0gfh	1	2026-07-28 18:52:06.016	2026-07-28 18:52:06.016	\N
cms50ivsj000e04lb4bo7u9hv	cmqp5jh8b000004jp8k1q116l	cmpe0mtc4000004l1e0lft0uf	\N	1	2026-07-28 18:52:07.411	2026-07-28 18:52:07.411	cmrquvpyi000004l7unpqoe7j
cms8c2sop000104ju563y7dw0	cms3d5vfv000004jxuwwehm57	cmpn1yeh5000104jrhfyq0v6c	cmpcm7sgp000004l1fp9o52ky	4	2026-07-31 02:38:50.809	2026-07-31 02:38:50.809	\N
cms8c2use000204juw2ima3e2	cms3d5vfv000004jxuwwehm57	cmpn1yeh5000104jrhfyq0v6c	cmpdz2mcq000104jr9xnhl4i0	4	2026-07-31 02:38:53.534	2026-07-31 02:38:53.534	\N
cms8c2w3h000304juv2bx02c6	cms3d5vfv000004jxuwwehm57	cmpn1yeh5000104jrhfyq0v6c	cmpefdkyx000304la3k3nq9p9	4	2026-07-31 02:38:55.229	2026-07-31 02:38:55.229	\N
cms8c2ybe000404juaq559fk7	cms3d5vfv000004jxuwwehm57	cmpn1yeh5000104jrhfyq0v6c	cmpefep0o000504laynrqmhnw	4	2026-07-31 02:38:58.106	2026-07-31 02:38:58.106	\N
cms8c2zt9000504ju6zjnw6w3	cms3d5vfv000004jxuwwehm57	cmpn1yeh5000104jrhfyq0v6c	cmpdz3jpw000004jvdohsd2ri	4	2026-07-31 02:39:00.045	2026-07-31 02:39:00.045	\N
cms8c31c2000604jubr8vc41h	cms3d5vfv000004jxuwwehm57	cmpn1yeh5000104jrhfyq0v6c	cmph7t8a1000004l9n8uic25p	4	2026-07-31 02:39:02.018	2026-07-31 02:39:02.018	\N
cms8c331a000704juhin4nffc	cms3d5vfv000004jxuwwehm57	cmpn1yeh5000104jrhfyq0v6c	cmpcpt3n6000004l561lm2ja7	4	2026-07-31 02:39:04.222	2026-07-31 02:39:04.222	\N
cms8c357f000004jyfzqupu1u	cms3d5vfv000004jxuwwehm57	cmpn1yeh5000104jrhfyq0v6c	cmpct2xp7000004jsv1ujpe1r	3	2026-07-31 02:39:07.035	2026-07-31 02:39:07.035	\N
cms8c36vg000104jyyyz5p6g0	cms3d5vfv000004jxuwwehm57	cmpn1yeh5000104jrhfyq0v6c	cmrozuqv4000104l5tbza8qgy	4	2026-07-31 02:39:09.196	2026-07-31 02:39:09.196	\N
cms8c39bg000204jyqsrkdkq1	cms3d5vfv000004jxuwwehm57	cmpn1yeh5000104jrhfyq0v6c	cmpcqf47m000004l85vce0gfh	4	2026-07-31 02:39:12.364	2026-07-31 02:39:13.525	\N
cms8c3cn4000404jybf0ggw7t	cms3d5vfv000004jxuwwehm57	cmpn1yeh5000104jrhfyq0v6c	cmpcov8jd000004l8umh13pux	4	2026-07-31 02:39:16.672	2026-07-31 02:39:18.077	\N
cms8c3fly000604jyt4sgs8ya	cms3d5vfv000004jxuwwehm57	cmpn1yeh5000104jrhfyq0v6c	cmpefcd1z000004lasd2r1kdh	4	2026-07-31 02:39:20.518	2026-07-31 02:39:20.518	\N
cms8c3h86000704jyz78wek0q	cms3d5vfv000004jxuwwehm57	cmpn1yeh5000104jrhfyq0v6c	cmpct94t9000204jsxeeckk3m	4	2026-07-31 02:39:22.614	2026-07-31 02:39:22.614	\N
cms8c3j1n000804jysaedmpgh	cms3d5vfv000004jxuwwehm57	cmpn1yeh5000104jrhfyq0v6c	cmpefcqj2000104ladlx0ysjz	4	2026-07-31 02:39:24.971	2026-07-31 02:39:24.971	\N
cms8c3mi8000904jyvffx9ldu	cms3d5vfv000004jxuwwehm57	cmpn1yeh5000104jrhfyq0v6c	cmpcpimjz000004jpcdqgfhfx	4	2026-07-31 02:39:29.456	2026-07-31 02:39:29.456	\N
cmsbqtf5g000104l9guxvpmv2	cms3d5vfv000004jxuwwehm57	cmpe0mtc4000004l1e0lft0uf	cmpcpimjz000004jpcdqgfhfx	4	2026-08-02 11:54:46.132	2026-08-02 11:54:46.132	\N
cmsbqthly000204l9f64tmsfg	cms3d5vfv000004jxuwwehm57	cmpe0mtc4000004l1e0lft0uf	cmpn1o6et000004jrcnmw0gav	4	2026-08-02 11:54:49.318	2026-08-02 11:54:49.318	\N
cmsbqtjni000004jpydoj3mt6	cms3d5vfv000004jxuwwehm57	cmpe0mtc4000004l1e0lft0uf	cmpefcqj2000104ladlx0ysjz	4	2026-08-02 11:54:51.966	2026-08-02 11:54:51.966	\N
cmsbqtkjo000104jp6fqii0hj	cms3d5vfv000004jxuwwehm57	cmpe0mtc4000004l1e0lft0uf	cmpct94t9000204jsxeeckk3m	4	2026-08-02 11:54:53.124	2026-08-02 11:54:53.124	\N
cmsbqtlkh000204jp7y7pid3a	cms3d5vfv000004jxuwwehm57	cmpe0mtc4000004l1e0lft0uf	cmpefcd1z000004lasd2r1kdh	4	2026-08-02 11:54:54.449	2026-08-02 11:54:54.449	\N
cmsbqtmrm000304jpaxnsvmtr	cms3d5vfv000004jxuwwehm57	cmpe0mtc4000004l1e0lft0uf	cmpcov8jd000004l8umh13pux	4	2026-08-02 11:54:56.002	2026-08-02 11:54:56.002	\N
cmsbqtofz000404jp59p9tcfh	cms3d5vfv000004jxuwwehm57	cmpe0mtc4000004l1e0lft0uf	cmpcqf47m000004l85vce0gfh	4	2026-08-02 11:54:58.175	2026-08-02 11:54:58.175	\N
cmsbqtpgo000504jp76g8nbfz	cms3d5vfv000004jxuwwehm57	cmpe0mtc4000004l1e0lft0uf	cmrozuqv4000104l5tbza8qgy	4	2026-08-02 11:54:59.496	2026-08-02 11:54:59.496	\N
cmsbqtqdw000604jp5um3uz4h	cms3d5vfv000004jxuwwehm57	cmpe0mtc4000004l1e0lft0uf	cmpct2xp7000004jsv1ujpe1r	3	2026-08-02 11:55:00.692	2026-08-02 11:55:01.921	\N
cmsbqtthn000804jp6wl4q2hr	cms3d5vfv000004jxuwwehm57	cmpe0mtc4000004l1e0lft0uf	cmpcpt3n6000004l561lm2ja7	3	2026-08-02 11:55:04.715	2026-08-02 11:55:04.715	\N
cmsbqtutq000304l92lei8741	cms3d5vfv000004jxuwwehm57	cmpe0mtc4000004l1e0lft0uf	cmph7t8a1000004l9n8uic25p	3	2026-08-02 11:55:06.446	2026-08-02 11:55:07.156	\N
cmsbqtxvc000a04jpzo90d3zm	cms3d5vfv000004jxuwwehm57	cmpe0mtc4000004l1e0lft0uf	cmpdz3jpw000004jvdohsd2ri	3	2026-08-02 11:55:10.392	2026-08-02 11:55:11.598	\N
cmsbqu111000c04jpz000izb7	cms3d5vfv000004jxuwwehm57	cmpe0mtc4000004l1e0lft0uf	cmpefep0o000504laynrqmhnw	3	2026-08-02 11:55:14.485	2026-08-02 11:55:14.485	\N
cmsbqu5pz000d04jprorig1pz	cms3d5vfv000004jxuwwehm57	cmpe0mtc4000004l1e0lft0uf	cmpefdkyx000304la3k3nq9p9	4	2026-08-02 11:55:20.567	2026-08-02 11:55:20.567	\N
cmsbqu70a000e04jp98yp7xi5	cms3d5vfv000004jxuwwehm57	cmpe0mtc4000004l1e0lft0uf	cmpdz2mcq000104jr9xnhl4i0	2	2026-08-02 11:55:22.234	2026-08-02 11:55:22.234	\N
cmsbqu8jc000f04jpc2k0ni1v	cms3d5vfv000004jxuwwehm57	cmpe0mtc4000004l1e0lft0uf	cmpcm7sgp000004l1fp9o52ky	4	2026-08-02 11:55:24.216	2026-08-02 11:55:24.216	\N
\.
COPY public.match_position_limits (id, "matchId", "position", "maxPlayers", "createdAt", "updatedAt") FROM stdin;
cmsc9wh5g000a04l9fsl99izw	cmsadtjr8000004joiy5e4pc7	GOALKEEPER	1	2026-08-02 20:49:01.396	2026-08-02 20:49:01.396
cmsc9wh5g000b04l9etceqd53	cmsadtjr8000004joiy5e4pc7	DEFENDER	5	2026-08-02 20:49:01.396	2026-08-02 20:49:01.396
cmsc9wh5g000c04l9khafgcmy	cmsadtjr8000004joiy5e4pc7	LEFT_WINGBACK	2	2026-08-02 20:49:01.396	2026-08-02 20:49:01.396
cmsc9wh5g000d04l9f8ea5ljp	cmsadtjr8000004joiy5e4pc7	RIGHT_WINGBACK	4	2026-08-02 20:49:01.396	2026-08-02 20:49:01.396
cmsc9wh5g000e04l9eaoekp4w	cmsadtjr8000004joiy5e4pc7	MIDFIELDER	5	2026-08-02 20:49:01.396	2026-08-02 20:49:01.396
cmsc9wh5g000f04l974k0yze5	cmsadtjr8000004joiy5e4pc7	DEFENSIVE_MIDFIELDER	2	2026-08-02 20:49:01.396	2026-08-02 20:49:01.396
cmsc9wh5g000g04l9gllagaaq	cmsadtjr8000004joiy5e4pc7	FORWARD	5	2026-08-02 20:49:01.396	2026-08-02 20:49:01.396
cmryy89yy000e04l27et4vai9	cmrpgk0qh000004jttg2q1s11	GOALKEEPER	1	2026-07-24 13:01:16.282	2026-07-24 13:01:16.282
cmryy89yy000f04l2udmtnjs8	cmrpgk0qh000004jttg2q1s11	DEFENDER	5	2026-07-24 13:01:16.282	2026-07-24 13:01:16.282
cmryy89yy000g04l2hcsshb8f	cmrpgk0qh000004jttg2q1s11	LEFT_WINGBACK	2	2026-07-24 13:01:16.282	2026-07-24 13:01:16.282
cmryy89yy000h04l2h09jgqz2	cmrpgk0qh000004jttg2q1s11	RIGHT_WINGBACK	2	2026-07-24 13:01:16.282	2026-07-24 13:01:16.282
cmryy89yz000i04l2gpmnn519	cmrpgk0qh000004jttg2q1s11	MIDFIELDER	6	2026-07-24 13:01:16.282	2026-07-24 13:01:16.282
cmryy89yz000j04l2fhuy44ci	cmrpgk0qh000004jttg2q1s11	DEFENSIVE_MIDFIELDER	2	2026-07-24 13:01:16.282	2026-07-24 13:01:16.282
cmryy89yz000k04l28a11ta83	cmrpgk0qh000004jttg2q1s11	FORWARD	4	2026-07-24 13:01:16.282	2026-07-24 13:01:16.282
cms4lv410000004ihbk89rdpd	cms3d5vfv000004jxuwwehm57	GOALKEEPER	1	2026-07-28 12:01:43.716	2026-07-28 12:01:43.716
cmskedraf000704ib5s70of20	cmpg3u3kh000l04la6hj2e5r3	GOALKEEPER	1	2026-08-08 13:16:35.559	2026-08-08 13:16:35.559
cmskedraf000804ib2kotffn4	cmpg3u3kh000l04la6hj2e5r3	DEFENDER	5	2026-08-08 13:16:35.559	2026-08-08 13:16:35.559
cmskedraf000904ibaq3coogs	cmpg3u3kh000l04la6hj2e5r3	LEFT_WINGBACK	2	2026-08-08 13:16:35.559	2026-08-08 13:16:35.559
cmskedraf000a04ibuntpwd2j	cmpg3u3kh000l04la6hj2e5r3	RIGHT_WINGBACK	3	2026-08-08 13:16:35.559	2026-08-08 13:16:35.559
cmskedraf000b04ibgog4elnu	cmpg3u3kh000l04la6hj2e5r3	MIDFIELDER	6	2026-08-08 13:16:35.559	2026-08-08 13:16:35.559
cmskedraf000c04ib9stq4cww	cmpg3u3kh000l04la6hj2e5r3	DEFENSIVE_MIDFIELDER	2	2026-08-08 13:16:35.559	2026-08-08 13:16:35.559
cmskedraf000d04ibsjso4157	cmpg3u3kh000l04la6hj2e5r3	FORWARD	4	2026-08-08 13:16:35.559	2026-08-08 13:16:35.559
cmrtatyjx000304jxcwe9lrli	cmrqib170000004l7swe10dxz	GOALKEEPER	1	2026-07-20 14:07:26.253	2026-07-20 14:07:26.253
cmrtatyjx000404jxwv7n482m	cmrqib170000004l7swe10dxz	DEFENDER	5	2026-07-20 14:07:26.253	2026-07-20 14:07:26.253
cmrtatyjx000504jxnymipq6o	cmrqib170000004l7swe10dxz	LEFT_WINGBACK	2	2026-07-20 14:07:26.253	2026-07-20 14:07:26.253
cmrtatyjx000604jxlgmhba8u	cmrqib170000004l7swe10dxz	RIGHT_WINGBACK	2	2026-07-20 14:07:26.253	2026-07-20 14:07:26.253
cmrtatyjx000704jxngwea4f0	cmrqib170000004l7swe10dxz	MIDFIELDER	6	2026-07-20 14:07:26.253	2026-07-20 14:07:26.253
cmrtatyjx000804jxdu2ts8o5	cmrqib170000004l7swe10dxz	DEFENSIVE_MIDFIELDER	2	2026-07-20 14:07:26.253	2026-07-20 14:07:26.253
cmrtatyjx000904jx9xvrce5p	cmrqib170000004l7swe10dxz	FORWARD	4	2026-07-20 14:07:26.253	2026-07-20 14:07:26.253
cms4lv410000104ih4tyx0tru	cms3d5vfv000004jxuwwehm57	DEFENDER	5	2026-07-28 12:01:43.716	2026-07-28 12:01:43.716
cms4lv411000204ihuakoytia	cms3d5vfv000004jxuwwehm57	LEFT_WINGBACK	2	2026-07-28 12:01:43.716	2026-07-28 12:01:43.716
cms4lv411000304ihx5yzlxva	cms3d5vfv000004jxuwwehm57	RIGHT_WINGBACK	2	2026-07-28 12:01:43.716	2026-07-28 12:01:43.716
cms4lv411000404ih0tbhhzj7	cms3d5vfv000004jxuwwehm57	MIDFIELDER	5	2026-07-28 12:01:43.716	2026-07-28 12:01:43.716
cms4lv411000504ihotztq5n4	cms3d5vfv000004jxuwwehm57	DEFENSIVE_MIDFIELDER	2	2026-07-28 12:01:43.716	2026-07-28 12:01:43.716
cms4lv411000604ihcub28wn8	cms3d5vfv000004jxuwwehm57	FORWARD	4	2026-07-28 12:01:43.716	2026-07-28 12:01:43.716
cmshn1bv8000o04l8phaacxmd	cmshn1bt0000004l8uazwx0nq	GOALKEEPER	1	2026-08-06 14:55:33.716	2026-08-06 14:55:33.716
cmrw181kj000004ju3699tmpm	cmrkxlng5000004jofpanlfev	GOALKEEPER	1	2026-07-22 12:01:45.716	2026-07-22 12:01:45.716
cmrw181kk000104ju3sfuqpqe	cmrkxlng5000004jofpanlfev	DEFENDER	5	2026-07-22 12:01:45.716	2026-07-22 12:01:45.716
cmrw181kk000204juzplkcuyf	cmrkxlng5000004jofpanlfev	LEFT_WINGBACK	2	2026-07-22 12:01:45.716	2026-07-22 12:01:45.716
cmrw181kk000304jugsplv0it	cmrkxlng5000004jofpanlfev	RIGHT_WINGBACK	3	2026-07-22 12:01:45.716	2026-07-22 12:01:45.716
cmrw181kk000404juffgzvooh	cmrkxlng5000004jofpanlfev	MIDFIELDER	6	2026-07-22 12:01:45.716	2026-07-22 12:01:45.716
cmrw181kk000504juunej142u	cmrkxlng5000004jofpanlfev	DEFENSIVE_MIDFIELDER	2	2026-07-22 12:01:45.716	2026-07-22 12:01:45.716
cmrw181kk000604ju72txrz7f	cmrkxlng5000004jofpanlfev	FORWARD	4	2026-07-22 12:01:45.716	2026-07-22 12:01:45.716
cmshn1bv8000p04l8num36jo2	cmshn1bt0000004l8uazwx0nq	DEFENDER	5	2026-08-06 14:55:33.716	2026-08-06 14:55:33.716
cmshn1bv8000q04l871chcbdo	cmshn1bt0000004l8uazwx0nq	LEFT_WINGBACK	2	2026-08-06 14:55:33.716	2026-08-06 14:55:33.716
cmshn1bv8000r04l8cair7gd0	cmshn1bt0000004l8uazwx0nq	RIGHT_WINGBACK	2	2026-08-06 14:55:33.716	2026-08-06 14:55:33.716
cmshn1bv8000s04l8hjt19yzb	cmshn1bt0000004l8uazwx0nq	MIDFIELDER	5	2026-08-06 14:55:33.716	2026-08-06 14:55:33.716
cmshn1bv8000t04l8uyj1v3x2	cmshn1bt0000004l8uazwx0nq	DEFENSIVE_MIDFIELDER	2	2026-08-06 14:55:33.716	2026-08-06 14:55:33.716
cmshn1bv8000u04l8pzpczvpf	cmshn1bt0000004l8uazwx0nq	FORWARD	4	2026-08-06 14:55:33.716	2026-08-06 14:55:33.716
cmspzbydk000204kzhe146wlm	cmsnjw3d4000004l73omej79w	GOALKEEPER	1	2026-08-12 11:01:54.248	2026-08-12 11:01:54.248
cmspzbydk000304kzah9o7pnm	cmsnjw3d4000004l73omej79w	DEFENDER	5	2026-08-12 11:01:54.248	2026-08-12 11:01:54.248
cmspzbydk000404kzcqkbjoy0	cmsnjw3d4000004l73omej79w	LEFT_WINGBACK	2	2026-08-12 11:01:54.248	2026-08-12 11:01:54.248
cmspzbydk000504kzi7h2wsvr	cmsnjw3d4000004l73omej79w	RIGHT_WINGBACK	2	2026-08-12 11:01:54.248	2026-08-12 11:01:54.248
cmspzbydk000604kze5anmsp1	cmsnjw3d4000004l73omej79w	MIDFIELDER	5	2026-08-12 11:01:54.248	2026-08-12 11:01:54.248
cmspzbydk000704kzecovsoha	cmsnjw3d4000004l73omej79w	DEFENSIVE_MIDFIELDER	2	2026-08-12 11:01:54.248	2026-08-12 11:01:54.248
cmspzbydk000804kz4ok1lsji	cmsnjw3d4000004l73omej79w	FORWARD	5	2026-08-12 11:01:54.248	2026-08-12 11:01:54.248
cmsw9o0xy000005l12whylkpr	cmsd9fo2a000004l80caeqs67	GOALKEEPER	1	2026-08-16 20:37:50.662	2026-08-16 20:37:50.662
cmsw9o0xy000105l1387kpr8m	cmsd9fo2a000004l80caeqs67	DEFENDER	5	2026-08-16 20:37:50.662	2026-08-16 20:37:50.662
cmsw9o0xy000205l14abwbbhy	cmsd9fo2a000004l80caeqs67	LEFT_WINGBACK	2	2026-08-16 20:37:50.662	2026-08-16 20:37:50.662
cmsw9o0xy000305l11pbkttw1	cmsd9fo2a000004l80caeqs67	RIGHT_WINGBACK	2	2026-08-16 20:37:50.662	2026-08-16 20:37:50.662
cmsw9o0xy000405l1nuq6j0ij	cmsd9fo2a000004l80caeqs67	MIDFIELDER	5	2026-08-16 20:37:50.662	2026-08-16 20:37:50.662
cmsw9o0xy000505l1rcrvlk2m	cmsd9fo2a000004l80caeqs67	DEFENSIVE_MIDFIELDER	3	2026-08-16 20:37:50.662	2026-08-16 20:37:50.662
cmsw9o0xy000605l1ps3xqlj8	cmsd9fo2a000004l80caeqs67	FORWARD	4	2026-08-16 20:37:50.662	2026-08-16 20:37:50.662
cmt94jnjz000004l4x5q73mn5	cmskhxpbb000004jq77wb6pqt	GOALKEEPER	1	2026-08-25 20:35:28.895	2026-08-25 20:35:28.895
cmt94jnjz000104l4oabpagnw	cmskhxpbb000004jq77wb6pqt	DEFENDER	5	2026-08-25 20:35:28.895	2026-08-25 20:35:28.895
cmt94jnjz000204l4a5p8zh2x	cmskhxpbb000004jq77wb6pqt	LEFT_WINGBACK	2	2026-08-25 20:35:28.895	2026-08-25 20:35:28.895
cmt94jnjz000304l442tblwdg	cmskhxpbb000004jq77wb6pqt	RIGHT_WINGBACK	2	2026-08-25 20:35:28.895	2026-08-25 20:35:28.895
cmt94jnjz000404l4hzgr6yf3	cmskhxpbb000004jq77wb6pqt	MIDFIELDER	5	2026-08-25 20:35:28.895	2026-08-25 20:35:28.895
cmt94jnjz000504l4aitbfiuj	cmskhxpbb000004jq77wb6pqt	DEFENSIVE_MIDFIELDER	2	2026-08-25 20:35:28.895	2026-08-25 20:35:28.895
cmt94jnjz000604l4f1esxnvh	cmskhxpbb000004jq77wb6pqt	FORWARD	4	2026-08-25 20:35:28.895	2026-08-25 20:35:28.895
\.
COPY public.match_stats (id, goals, assists, "yellowCards", "redCards", "playerId", "matchId", "createdAt", "updatedAt", "guestPlayerId") FROM stdin;
cmpefp1x9000604lafgwjbtel	0	0	0	0	cmpcpimjz000004jpcdqgfhfx	cmpe1azov000004l1iw95x1zw	2026-05-20 19:07:38.109	2026-05-20 19:07:38.109	\N
cmpefp1x9000704lajiywnu4y	0	0	0	0	cmpcsds4s000004jmgpwku1j2	cmpe1azov000004l1iw95x1zw	2026-05-20 19:07:38.109	2026-05-20 19:07:38.109	\N
cmpefp1x9000804lar21b7sso	0	0	0	0	cmpct94t9000204jsxeeckk3m	cmpe1azov000004l1iw95x1zw	2026-05-20 19:07:38.109	2026-05-20 19:07:38.109	\N
cmpefp1x9000904laiiucuze9	0	0	0	0	cmpefcd1z000004lasd2r1kdh	cmpe1azov000004l1iw95x1zw	2026-05-20 19:07:38.109	2026-05-20 19:07:38.109	\N
cmpefp1x9000a04la7lp0ctd4	0	0	0	0	cmpefcqj2000104ladlx0ysjz	cmpe1azov000004l1iw95x1zw	2026-05-20 19:07:38.109	2026-05-20 19:07:38.109	\N
cmpefp1x9000b04laf1cv6pzk	0	0	0	0	cmpcqf47m000004l85vce0gfh	cmpe1azov000004l1iw95x1zw	2026-05-20 19:07:38.109	2026-05-20 19:07:38.109	\N
cmpefp1x9000c04lackfqjon5	0	0	0	0	cmpdz2mcq000104jr9xnhl4i0	cmpe1azov000004l1iw95x1zw	2026-05-20 19:07:38.109	2026-05-20 19:07:38.109	\N
cmpefp1x9000d04la58z5p07a	0	0	0	0	cmpefd4zq000204la3jqyndzz	cmpe1azov000004l1iw95x1zw	2026-05-20 19:07:38.109	2026-05-20 19:07:38.109	\N
cmpefp1x9000e04lae7qnkx1g	0	0	0	0	cmpcov8jd000004l8umh13pux	cmpe1azov000004l1iw95x1zw	2026-05-20 19:07:38.109	2026-05-20 19:07:38.109	\N
cmpefp1x9000f04la368iqi77	0	0	0	0	cmpct2xp7000004jsv1ujpe1r	cmpe1azov000004l1iw95x1zw	2026-05-20 19:07:38.109	2026-05-20 19:07:38.109	\N
cmpefp1x9000g04lak6ksl4qn	0	0	0	0	cmpefdkyx000304la3k3nq9p9	cmpe1azov000004l1iw95x1zw	2026-05-20 19:07:38.109	2026-05-20 19:07:38.109	\N
cmpefp1x9000h04lai8xpjqa4	0	0	0	0	cmpefdukz000404lanevrsp34	cmpe1azov000004l1iw95x1zw	2026-05-20 19:07:38.109	2026-05-20 19:07:38.109	\N
cmpefp1x9000i04laz71kbuz6	0	0	1	0	cmpcm7sgp000004l1fp9o52ky	cmpe1azov000004l1iw95x1zw	2026-05-20 19:07:38.109	2026-05-20 19:07:38.109	\N
cmpefp1x9000j04las8wk82wf	0	0	0	0	cmpefep0o000504laynrqmhnw	cmpe1azov000004l1iw95x1zw	2026-05-20 19:07:38.109	2026-05-20 19:07:38.109	\N
cmpjn8s25000004kzom96bkg4	0	0	0	0	cmpcpimjz000004jpcdqgfhfx	cmpfezhxy000004lblpwmx62l	2026-05-24 10:37:46.637	2026-05-24 10:37:46.637	\N
cmpjn8s25000104kzd19w4bxi	0	0	1	0	cmpcsds4s000004jmgpwku1j2	cmpfezhxy000004lblpwmx62l	2026-05-24 10:37:46.637	2026-05-24 10:37:46.637	\N
cmpjn8s25000204kz04d9npx9	0	0	0	0	cmpcm7sgp000004l1fp9o52ky	cmpfezhxy000004lblpwmx62l	2026-05-24 10:37:46.637	2026-05-24 10:37:46.637	\N
cmpjn8s25000304kzgqs1dowx	1	0	0	0	cmpefcd1z000004lasd2r1kdh	cmpfezhxy000004lblpwmx62l	2026-05-24 10:37:46.637	2026-05-24 10:37:46.637	\N
cmpjn8s25000404kz6qcxq3df	0	0	0	0	cmpcoxez0000304l8g40zcfou	cmpfezhxy000004lblpwmx62l	2026-05-24 10:37:46.637	2026-05-24 10:37:46.637	\N
cmpjn8s25000504kzn157ok1y	0	0	0	0	cmpdz3jpw000004jvdohsd2ri	cmpfezhxy000004lblpwmx62l	2026-05-24 10:37:46.637	2026-05-24 10:37:46.637	\N
cmpjn8s25000604kzlnjtphuf	0	3	1	0	cmpdz2mcq000104jr9xnhl4i0	cmpfezhxy000004lblpwmx62l	2026-05-24 10:37:46.637	2026-05-24 10:37:46.637	\N
cmpg7c8k7000004jripvdef28	1	0	0	0	cmpg41k59000004l7521hfcn4	cmpg3xoab000e04jupuf15f34	2026-05-22 00:49:15.607	2026-05-22 00:49:15.607	\N
cmpg7c8k7000104jrd59gtt5k	0	1	0	0	cmpefcqj2000104ladlx0ysjz	cmpg3xoab000e04jupuf15f34	2026-05-22 00:49:15.607	2026-05-22 00:49:15.607	\N
cmpg7c8k7000204jrkgu58i5v	0	0	0	0	cmpfk8v2v000704jlp8siky9e	cmpg3xoab000e04jupuf15f34	2026-05-22 00:49:15.607	2026-05-22 00:49:15.607	\N
cmpg7c8k7000304jroqx54bz3	0	0	0	0	cmpefcd1z000004lasd2r1kdh	cmpg3xoab000e04jupuf15f34	2026-05-22 00:49:15.607	2026-05-22 00:49:15.607	\N
cmpg7c8k7000404jr1htdy2jj	0	0	0	0	cmpcqf47m000004l85vce0gfh	cmpg3xoab000e04jupuf15f34	2026-05-22 00:49:15.607	2026-05-22 00:49:15.607	\N
cmpg7c8k7000504jrlo07gwgj	0	0	0	0	cmpcpgupa000004l5ehnc0kjs	cmpg3xoab000e04jupuf15f34	2026-05-22 00:49:15.607	2026-05-22 00:49:15.607	\N
cmpg7c8k7000604jrrv2e8ep6	0	0	0	0	cmpefdukz000404lanevrsp34	cmpg3xoab000e04jupuf15f34	2026-05-22 00:49:15.607	2026-05-22 00:49:15.607	\N
cmpg7c8k7000704jrrjxjisq4	0	0	0	0	cmpefdkyx000304la3k3nq9p9	cmpg3xoab000e04jupuf15f34	2026-05-22 00:49:15.607	2026-05-22 00:49:15.607	\N
cmpg7c8k7000804jr56edb56i	0	0	0	0	cmpcopzu6000004jro3prr7ca	cmpg3xoab000e04jupuf15f34	2026-05-22 00:49:15.607	2026-05-22 00:49:15.607	\N
cmpg7c8k7000904jrqvvkjkvi	0	0	1	0	cmpcpt3n6000004l561lm2ja7	cmpg3xoab000e04jupuf15f34	2026-05-22 00:49:15.607	2026-05-22 00:49:15.607	\N
cmpjn8s25000704kz44ek4puv	0	0	0	0	cmpefdkyx000304la3k3nq9p9	cmpfezhxy000004lblpwmx62l	2026-05-24 10:37:46.637	2026-05-24 10:37:46.637	\N
cmpjn8s25000804kz5vrdqglb	0	0	0	0	cmpefep0o000504laynrqmhnw	cmpfezhxy000004lblpwmx62l	2026-05-24 10:37:46.637	2026-05-24 10:37:46.637	\N
cmpjn8s25000904kzz4jg27jd	0	0	0	0	cmpcpt3n6000004l561lm2ja7	cmpfezhxy000004lblpwmx62l	2026-05-24 10:37:46.637	2026-05-24 10:37:46.637	\N
cmpjn8s25000a04kz9xdt9f0f	2	1	0	0	cmpefcqj2000104ladlx0ysjz	cmpfezhxy000004lblpwmx62l	2026-05-24 10:37:46.637	2026-05-24 10:37:46.637	\N
cmpjn8s25000b04kzhwl4mwhk	0	0	0	0	cmpefdukz000404lanevrsp34	cmpfezhxy000004lblpwmx62l	2026-05-24 10:37:46.637	2026-05-24 10:37:46.637	\N
cmpjn8s25000c04kzgdcj2vt1	1	0	0	0	cmpfk8v2v000704jlp8siky9e	cmpfezhxy000004lblpwmx62l	2026-05-24 10:37:46.637	2026-05-24 10:37:46.637	\N
cmrpg5vbw000004i54lygz3ww	0	0	0	0	cmpfk8v2v000704jlp8siky9e	cmrpg2uyd000004l44co9je0h	2026-07-17 21:25:35.324	2026-07-17 21:25:35.324	\N
cmrpg5vbw000104i54qelai1j	0	0	0	0	cmpcpimjz000004jpcdqgfhfx	cmrpg2uyd000004l44co9je0h	2026-07-17 21:25:35.324	2026-07-17 21:25:35.324	\N
cmrpg5vbw000204i5q5npjv11	0	0	0	0	cmpcsds4s000004jmgpwku1j2	cmrpg2uyd000004l44co9je0h	2026-07-17 21:25:35.324	2026-07-17 21:25:35.324	\N
cmrpg5vbw000304i5pcxh9cq8	0	0	0	0	cmpct94t9000204jsxeeckk3m	cmrpg2uyd000004l44co9je0h	2026-07-17 21:25:35.324	2026-07-17 21:25:35.324	\N
cmrpg5vbw000404i50ccrivdq	0	0	0	0	cmpefcd1z000004lasd2r1kdh	cmrpg2uyd000004l44co9je0h	2026-07-17 21:25:35.324	2026-07-17 21:25:35.324	\N
cmrpg5vbw000504i5mzyuvs92	0	0	0	0	cmpefcqj2000104ladlx0ysjz	cmrpg2uyd000004l44co9je0h	2026-07-17 21:25:35.324	2026-07-17 21:25:35.324	\N
cmrpg5vbw000604i5b4sfa0vd	0	0	0	0	cmph7t8a1000004l9n8uic25p	cmrpg2uyd000004l44co9je0h	2026-07-17 21:25:35.324	2026-07-17 21:25:35.324	\N
cmrpg5vbw000704i54tuow2bz	0	0	0	0	cmpdz2mcq000104jr9xnhl4i0	cmrpg2uyd000004l44co9je0h	2026-07-17 21:25:35.324	2026-07-17 21:25:35.324	\N
cmrpg5vbw000804i57802var9	0	0	0	0	cmpefd4zq000204la3jqyndzz	cmrpg2uyd000004l44co9je0h	2026-07-17 21:25:35.324	2026-07-17 21:25:35.324	\N
cmrpg5vbw000904i5ngl0y7sz	0	0	0	0	cmpcov8jd000004l8umh13pux	cmrpg2uyd000004l44co9je0h	2026-07-17 21:25:35.324	2026-07-17 21:25:35.324	\N
cmrpg5vbw000a04i5mte4vbra	0	0	0	0	cmpct2xp7000004jsv1ujpe1r	cmrpg2uyd000004l44co9je0h	2026-07-17 21:25:35.324	2026-07-17 21:25:35.324	\N
cmrpg5vbw000b04i5kghieca9	0	0	0	0	cmpefdukz000404lanevrsp34	cmrpg2uyd000004l44co9je0h	2026-07-17 21:25:35.324	2026-07-17 21:25:35.324	\N
cmrpg5vbw000c04i5o1j7579u	0	0	0	0	cmpefdkyx000304la3k3nq9p9	cmrpg2uyd000004l44co9je0h	2026-07-17 21:25:35.324	2026-07-17 21:25:35.324	\N
cmrpg5vbw000d04i5j1twomms	0	0	0	0	cmpefep0o000504laynrqmhnw	cmrpg2uyd000004l44co9je0h	2026-07-17 21:25:35.324	2026-07-17 21:25:35.324	\N
cmrpg5vbw000e04i55b3sjo2z	0	0	0	0	cmpcm7sgp000004l1fp9o52ky	cmrpg2uyd000004l44co9je0h	2026-07-17 21:25:35.324	2026-07-17 21:25:35.324	\N
cmrpg5vbw000f04i5s606x6ey	0	0	1	0	cmpcqf47m000004l85vce0gfh	cmrpg2uyd000004l44co9je0h	2026-07-17 21:25:35.324	2026-07-17 21:25:35.324	\N
cmrql0svl000004la1b8rbpcu	2	0	0	0	cmpefcqj2000104ladlx0ysjz	cmrqkwrev000004jpjug6t8wd	2026-07-18 16:29:23.122	2026-07-18 16:29:23.122	\N
cmrql0svm000104laxj35nbe6	1	0	0	0	cmpg43u13000604l7y6t0hdtt	cmrqkwrev000004jpjug6t8wd	2026-07-18 16:29:23.122	2026-07-18 16:29:23.122	\N
cmrql0svm000204la2lxtvev8	1	0	1	0	cmpefd4zq000204la3jqyndzz	cmrqkwrev000004jpjug6t8wd	2026-07-18 16:29:23.122	2026-07-18 16:29:23.122	\N
cmrql0svm000304la9a3k7ska	0	1	0	0	cmpefcd1z000004lasd2r1kdh	cmrqkwrev000004jpjug6t8wd	2026-07-18 16:29:23.122	2026-07-18 16:29:23.122	\N
cmt8rb19d000004js140newwr	0	0	0	0	cmpn1o6et000004jrcnmw0gav	cmt0aw2dv000004jyn5mtmejp	2026-08-25 14:24:51.745	2026-08-25 14:24:51.745	\N
cmt8rb19d000104js97w1wemp	0	0	0	0	cmsd6v73x000004jupd8tbvon	cmt0aw2dv000004jyn5mtmejp	2026-08-25 14:24:51.745	2026-08-25 14:24:51.745	\N
cmt8rb19d000204jso3vjg2sb	0	0	0	0	cmpct2xp7000004jsv1ujpe1r	cmt0aw2dv000004jyn5mtmejp	2026-08-25 14:24:51.745	2026-08-25 14:24:51.745	\N
cmt8rb19d000304jsj0ljto2x	0	0	0	0	cmpcm7sgp000004l1fp9o52ky	cmt0aw2dv000004jyn5mtmejp	2026-08-25 14:24:51.745	2026-08-25 14:24:51.745	\N
cmppjmc22000204juvipc8w1i	0	0	0	0	cmpcsehq1000104ibueo8dlm5	cmpkl4qyr000004l41n642701	2026-05-28 13:42:57.674	2026-05-28 13:42:57.674	\N
cmppjmc22000304ju04ozhsp9	0	0	1	0	cmpcm7sgp000004l1fp9o52ky	cmpkl4qyr000004l41n642701	2026-05-28 13:42:57.674	2026-05-28 13:42:57.674	\N
cmppjmc22000404juqbgk4mc8	0	0	0	0	cmpcopzu6000004jro3prr7ca	cmpkl4qyr000004l41n642701	2026-05-28 13:42:57.674	2026-05-28 13:42:57.674	\N
cmppjmc22000504ju58b4zak3	1	0	0	1	cmpdz2mcq000104jr9xnhl4i0	cmpkl4qyr000004l41n642701	2026-05-28 13:42:57.674	2026-05-28 13:42:57.674	\N
cmppjmc22000604juj3biwpxm	0	0	1	0	cmpefep0o000504laynrqmhnw	cmpkl4qyr000004l41n642701	2026-05-28 13:42:57.674	2026-05-28 13:42:57.674	\N
cmppjmc23000704ju6ucelqfw	0	0	1	0	cmpcpimjz000004jpcdqgfhfx	cmpkl4qyr000004l41n642701	2026-05-28 13:42:57.674	2026-05-28 13:42:57.674	\N
cmppjmc23000804ju5x8flkwv	0	0	1	0	cmpcov8jd000004l8umh13pux	cmpkl4qyr000004l41n642701	2026-05-28 13:42:57.674	2026-05-28 13:42:57.674	\N
cmppjmc23000904juw1kq4g2f	0	0	0	0	cmpdz3jpw000004jvdohsd2ri	cmpkl4qyr000004l41n642701	2026-05-28 13:42:57.674	2026-05-28 13:42:57.674	\N
cmpgyc8pw000d04jrouq0ym4h	1	0	0	0	cmpfk8v2v000704jlp8siky9e	cmpgvy3i1000004jupkxo13f9	2026-05-22 13:25:05.444	2026-05-22 13:25:05.444	\N
cmpgyc8pw000e04jr2v6k5oky	0	1	0	0	cmpcopzu6000004jro3prr7ca	cmpgvy3i1000004jupkxo13f9	2026-05-22 13:25:05.444	2026-05-22 13:25:05.444	\N
cmpgyc8pw000f04jr06e8gzjo	0	0	0	0	cmpcpimjz000004jpcdqgfhfx	cmpgvy3i1000004jupkxo13f9	2026-05-22 13:25:05.444	2026-05-22 13:25:05.444	\N
cmpgyc8pw000g04jrb50c43ub	0	0	0	0	cmpcsds4s000004jmgpwku1j2	cmpgvy3i1000004jupkxo13f9	2026-05-22 13:25:05.444	2026-05-22 13:25:05.444	\N
cmpgyc8pw000h04jrkcck4xs1	0	0	0	0	cmpefcd1z000004lasd2r1kdh	cmpgvy3i1000004jupkxo13f9	2026-05-22 13:25:05.444	2026-05-22 13:25:05.444	\N
cmpgyc8pw000i04jrfx063lje	0	0	0	0	cmpefcqj2000104ladlx0ysjz	cmpgvy3i1000004jupkxo13f9	2026-05-22 13:25:05.444	2026-05-22 13:25:05.444	\N
cmpgyc8pw000j04jr2z1evzfh	0	0	0	0	cmpcqf47m000004l85vce0gfh	cmpgvy3i1000004jupkxo13f9	2026-05-22 13:25:05.444	2026-05-22 13:25:05.444	\N
cmpgyc8pw000k04jra7s5ehd0	0	0	0	0	cmpcpt3n6000004l561lm2ja7	cmpgvy3i1000004jupkxo13f9	2026-05-22 13:25:05.444	2026-05-22 13:25:05.444	\N
cmpgyc8pw000l04jr5ft765md	0	0	0	0	cmpcov8jd000004l8umh13pux	cmpgvy3i1000004jupkxo13f9	2026-05-22 13:25:05.444	2026-05-22 13:25:05.444	\N
cmpgyc8pw000m04jrgnvqsalm	0	0	0	0	cmpct2xp7000004jsv1ujpe1r	cmpgvy3i1000004jupkxo13f9	2026-05-22 13:25:05.444	2026-05-22 13:25:05.444	\N
cmpgyc8pw000n04jrx2v8pzfa	0	0	0	0	cmpcm7sgp000004l1fp9o52ky	cmpgvy3i1000004jupkxo13f9	2026-05-22 13:25:05.444	2026-05-22 13:25:05.444	\N
cmpgyc8pw000o04jr5ak8yzb6	0	0	0	0	cmpefep0o000504laynrqmhnw	cmpgvy3i1000004jupkxo13f9	2026-05-22 13:25:05.444	2026-05-22 13:25:05.444	\N
cmrql0svm000404lank9gtsl2	0	1	0	0	cmpcpt3n6000004l561lm2ja7	cmrqkwrev000004jpjug6t8wd	2026-07-18 16:29:23.122	2026-07-18 16:29:23.122	\N
cmrql0svm000504lazyicyn77	0	1	0	0	cmpdz2mcq000104jr9xnhl4i0	cmrqkwrev000004jpjug6t8wd	2026-07-18 16:29:23.122	2026-07-18 16:29:23.122	\N
cmrql0svm000604laomakhux2	0	0	0	0	cmpcpimjz000004jpcdqgfhfx	cmrqkwrev000004jpjug6t8wd	2026-07-18 16:29:23.122	2026-07-18 16:29:23.122	\N
cmrql0svm000704lahl4axxdz	0	0	0	0	cmph7s4ma000004l727k39xdv	cmrqkwrev000004jpjug6t8wd	2026-07-18 16:29:23.122	2026-07-18 16:29:23.122	\N
cmrql0svm000804lat34zbznq	0	0	0	0	cmpct94t9000204jsxeeckk3m	cmrqkwrev000004jpjug6t8wd	2026-07-18 16:29:23.122	2026-07-18 16:29:23.122	\N
cmrql0svm000904laijn54y4v	0	0	0	0	cmph7t8a1000004l9n8uic25p	cmrqkwrev000004jpjug6t8wd	2026-07-18 16:29:23.122	2026-07-18 16:29:23.122	\N
cmrql0svm000a04la1r3uqvvu	0	0	0	0	cmpcov8jd000004l8umh13pux	cmrqkwrev000004jpjug6t8wd	2026-07-18 16:29:23.122	2026-07-18 16:29:23.122	\N
cmrql0svm000b04layqjk838d	0	0	0	0	cmpct2xp7000004jsv1ujpe1r	cmrqkwrev000004jpjug6t8wd	2026-07-18 16:29:23.122	2026-07-18 16:29:23.122	\N
cmrql0svm000c04lanku9m56j	0	0	0	0	cmpcsehq1000104ibueo8dlm5	cmrqkwrev000004jpjug6t8wd	2026-07-18 16:29:23.122	2026-07-18 16:29:23.122	\N
cmrp8f2uv000e04jpw16vf3bc	0	0	0	0	cmpefcd1z000004lasd2r1kdh	cmrp8963m000004larspejvgr	2026-07-17 17:48:48.054	2026-07-17 17:48:48.054	\N
cmrp8f2uv000f04jppylbgge6	0	0	0	0	cmpcpt3n6000004l561lm2ja7	cmrp8963m000004larspejvgr	2026-07-17 17:48:48.054	2026-07-17 17:48:48.054	\N
cmrp8f2uv000g04jpocxw1dis	0	0	0	0	cmpefd4zq000204la3jqyndzz	cmrp8963m000004larspejvgr	2026-07-17 17:48:48.054	2026-07-17 17:48:48.054	\N
cmrp8f2uv000h04jp6crufwxc	0	0	0	0	cmpcov8jd000004l8umh13pux	cmrp8963m000004larspejvgr	2026-07-17 17:48:48.054	2026-07-17 17:48:48.054	\N
cmrp8f2uv000i04jpay2tc3nm	0	0	0	0	cmpct2xp7000004jsv1ujpe1r	cmrp8963m000004larspejvgr	2026-07-17 17:48:48.054	2026-07-17 17:48:48.054	\N
cmrp8f2uv000j04jp65apl4qe	0	0	0	0	cmpcopzu6000004jro3prr7ca	cmrp8963m000004larspejvgr	2026-07-17 17:48:48.054	2026-07-17 17:48:48.054	\N
cmrp8f2uv000k04jp5v5a5vq7	0	0	0	0	cmpefep0o000504laynrqmhnw	cmrp8963m000004larspejvgr	2026-07-17 17:48:48.054	2026-07-17 17:48:48.054	\N
cmph7ts3a000604l7o7hpcc00	1	1	1	0	cmpefcqj2000104ladlx0ysjz	cmph7ki34000004ibhrgnxf2y	2026-05-22 17:50:40.246	2026-05-22 17:50:40.246	\N
cmph7ts3a000704l77bim6di5	1	0	0	0	cmpdz2mcq000104jr9xnhl4i0	cmph7ki34000004ibhrgnxf2y	2026-05-22 17:50:40.246	2026-05-22 17:50:40.246	\N
cmph7ts3a000804l75e2lfsnl	0	0	0	0	cmpefdukz000404lanevrsp34	cmph7ki34000004ibhrgnxf2y	2026-05-22 17:50:40.246	2026-05-22 17:50:40.246	\N
cmph7ts3a000904l7r0i9i7y7	0	0	0	0	cmpfk8v2v000704jlp8siky9e	cmph7ki34000004ibhrgnxf2y	2026-05-22 17:50:40.246	2026-05-22 17:50:40.246	\N
cmph7ts3a000a04l742pon53h	0	0	0	0	cmpcpimjz000004jpcdqgfhfx	cmph7ki34000004ibhrgnxf2y	2026-05-22 17:50:40.246	2026-05-22 17:50:40.246	\N
cmph7ts3a000b04l746l3ayce	0	0	0	0	cmpcsds4s000004jmgpwku1j2	cmph7ki34000004ibhrgnxf2y	2026-05-22 17:50:40.246	2026-05-22 17:50:40.246	\N
cmph7ts3a000c04l7vo5ujn1k	0	0	0	0	cmpct94t9000204jsxeeckk3m	cmph7ki34000004ibhrgnxf2y	2026-05-22 17:50:40.246	2026-05-22 17:50:40.246	\N
cmph7ts3a000d04l7cfg95l82	0	0	0	0	cmpcpt3n6000004l561lm2ja7	cmph7ki34000004ibhrgnxf2y	2026-05-22 17:50:40.246	2026-05-22 17:50:40.246	\N
cmph7ts3a000e04l74fyawe9c	0	0	0	0	cmpefd4zq000204la3jqyndzz	cmph7ki34000004ibhrgnxf2y	2026-05-22 17:50:40.246	2026-05-22 17:50:40.246	\N
cmph7ts3a000f04l76bu722kl	0	0	0	0	cmpct2xp7000004jsv1ujpe1r	cmph7ki34000004ibhrgnxf2y	2026-05-22 17:50:40.246	2026-05-22 17:50:40.246	\N
cmph7ts3a000g04l7clhm1y2e	0	0	0	0	cmpcsehq1000104ibueo8dlm5	cmph7ki34000004ibhrgnxf2y	2026-05-22 17:50:40.246	2026-05-22 17:50:40.246	\N
cmph7ts3a000h04l7ei1sxrew	0	0	0	0	cmpg43u13000604l7y6t0hdtt	cmph7ki34000004ibhrgnxf2y	2026-05-22 17:50:40.246	2026-05-22 17:50:40.246	\N
cmph7ts3a000i04l78aqxal7i	0	0	0	0	cmpcopzu6000004jro3prr7ca	cmph7ki34000004ibhrgnxf2y	2026-05-22 17:50:40.246	2026-05-22 17:50:40.246	\N
cmph7ts3a000j04l7a9ylqlcj	0	0	0	0	cmpefep0o000504laynrqmhnw	cmph7ki34000004ibhrgnxf2y	2026-05-22 17:50:40.246	2026-05-22 17:50:40.246	\N
cmph7ts3a000k04l743msco4i	0	0	1	0	cmpefcd1z000004lasd2r1kdh	cmph7ki34000004ibhrgnxf2y	2026-05-22 17:50:40.246	2026-05-22 17:50:40.246	\N
cmph7ts3a000l04l7a82z7gfh	0	0	1	0	cmpcm7sgp000004l1fp9o52ky	cmph7ki34000004ibhrgnxf2y	2026-05-22 17:50:40.246	2026-05-22 17:50:40.246	\N
cmph7ts3a000m04l743cxq2p7	0	0	0	0	cmph7s4ma000004l727k39xdv	cmph7ki34000004ibhrgnxf2y	2026-05-22 17:50:40.246	2026-05-22 17:50:40.246	\N
cmph7ts3a000n04l78q8cw5ee	0	0	0	0	cmph7t8a1000004l9n8uic25p	cmph7ki34000004ibhrgnxf2y	2026-05-22 17:50:40.246	2026-05-22 17:50:40.246	\N
cmrp4bee6000u04ks6tk3kcpj	0	0	0	1	\N	cmq59e1vu000004juzmp8xftw	2026-07-17 15:53:57.918	2026-07-17 15:53:57.918	cmr4v31be000004l5cpda9y3t
cmrp4bee6000v04kszn9ahsaz	0	0	0	0	\N	cmq59e1vu000004juzmp8xftw	2026-07-17 15:53:57.918	2026-07-17 15:53:57.918	cmrp45iya000004l79ltrmhya
cmrp4bee6000w04ksi6u6ordh	0	0	0	0	\N	cmq59e1vu000004juzmp8xftw	2026-07-17 15:53:57.918	2026-07-17 15:53:57.918	cmrp45o8h000004ksdg2qpj8s
cmrp4bee6000x04ksqmrgd5ys	0	0	0	0	cmpfk8v2v000704jlp8siky9e	cmq59e1vu000004juzmp8xftw	2026-07-17 15:53:57.918	2026-07-17 15:53:57.918	\N
cmrp4bee6000y04kszbrak9wf	0	0	0	0	cmpcpimjz000004jpcdqgfhfx	cmq59e1vu000004juzmp8xftw	2026-07-17 15:53:57.918	2026-07-17 15:53:57.918	\N
cmrp4bee6000z04kse2ef7rt8	0	0	0	0	cmpcsds4s000004jmgpwku1j2	cmq59e1vu000004juzmp8xftw	2026-07-17 15:53:57.918	2026-07-17 15:53:57.918	\N
cmrp4bee6001004ksqn1f4q69	0	0	0	0	cmpefcd1z000004lasd2r1kdh	cmq59e1vu000004juzmp8xftw	2026-07-17 15:53:57.918	2026-07-17 15:53:57.918	\N
cmrp4bee6001104ksj9zejorz	0	0	0	0	cmpefcqj2000104ladlx0ysjz	cmq59e1vu000004juzmp8xftw	2026-07-17 15:53:57.918	2026-07-17 15:53:57.918	\N
cmrp4bee6001204kslyvszkx7	0	0	0	0	cmph7t8a1000004l9n8uic25p	cmq59e1vu000004juzmp8xftw	2026-07-17 15:53:57.918	2026-07-17 15:53:57.918	\N
cmrp4bee6001304ksx1be54vg	0	0	0	0	cmpcqf47m000004l85vce0gfh	cmq59e1vu000004juzmp8xftw	2026-07-17 15:53:57.918	2026-07-17 15:53:57.918	\N
cmppjmc23000a04jufgdfv0u3	1	0	1	0	cmpefcd1z000004lasd2r1kdh	cmpkl4qyr000004l41n642701	2026-05-28 13:42:57.674	2026-05-28 13:42:57.674	\N
cmppjmc23000b04juqdlirn0w	0	0	1	0	cmpcsds4s000004jmgpwku1j2	cmpkl4qyr000004l41n642701	2026-05-28 13:42:57.674	2026-05-28 13:42:57.674	\N
cmppjmc23000c04juouc9lfzt	0	0	0	0	cmpct94t9000204jsxeeckk3m	cmpkl4qyr000004l41n642701	2026-05-28 13:42:57.674	2026-05-28 13:42:57.674	\N
cmppjmc23000d04jufg5lgii0	0	0	0	0	cmpcqf47m000004l85vce0gfh	cmpkl4qyr000004l41n642701	2026-05-28 13:42:57.674	2026-05-28 13:42:57.674	\N
cmppjmc23000e04juch4e4297	0	0	0	0	cmpg41k59000004l7521hfcn4	cmpkl4qyr000004l41n642701	2026-05-28 13:42:57.674	2026-05-28 13:42:57.674	\N
cmppjmc23000f04jujengutz2	0	0	0	0	cmpefcqj2000104ladlx0ysjz	cmpkl4qyr000004l41n642701	2026-05-28 13:42:57.674	2026-05-28 13:42:57.674	\N
cmppjmc23000g04juvwszacvg	0	0	1	0	cmpn1o6et000004jrcnmw0gav	cmpkl4qyr000004l41n642701	2026-05-28 13:42:57.674	2026-05-28 13:42:57.674	\N
cmppjmc23000h04ju9hpbs8k4	0	0	0	0	\N	cmpkl4qyr000004l41n642701	2026-05-28 13:42:57.674	2026-05-28 13:42:57.674	cmpohz21c000004jx24id9rok
cmppjmc23000i04jupif9mftk	0	0	0	0	\N	cmpkl4qyr000004l41n642701	2026-05-28 13:42:57.674	2026-05-28 13:42:57.674	cmpol69a5000004l7wi5vd4ad
cmrp4bee6001404ksmiw29tzm	0	0	0	0	cmpdz2mcq000104jr9xnhl4i0	cmq59e1vu000004juzmp8xftw	2026-07-17 15:53:57.918	2026-07-17 15:53:57.918	\N
cmrp4bee6001504ks6tz9ras1	0	0	0	0	cmpcopzu6000004jro3prr7ca	cmq59e1vu000004juzmp8xftw	2026-07-17 15:53:57.918	2026-07-17 15:53:57.918	\N
cmrp4bee6001604kse2er0rod	0	0	0	0	cmpcm7sgp000004l1fp9o52ky	cmq59e1vu000004juzmp8xftw	2026-07-17 15:53:57.918	2026-07-17 15:53:57.918	\N
cmrp4bee6001704ksp1cahxjb	0	0	1	0	cmrozuqv4000104l5tbza8qgy	cmq59e1vu000004juzmp8xftw	2026-07-17 15:53:57.918	2026-07-17 15:53:57.918	\N
cmrp4bee6001804ksris9zrlo	0	0	1	0	cmpcov8jd000004l8umh13pux	cmq59e1vu000004juzmp8xftw	2026-07-17 15:53:57.918	2026-07-17 15:53:57.918	\N
cmrp4bee7001904ksx0hc1d67	0	0	1	0	cmpct2xp7000004jsv1ujpe1r	cmq59e1vu000004juzmp8xftw	2026-07-17 15:53:57.918	2026-07-17 15:53:57.918	\N
cmrp5peeo000104jrri89wk60	0	0	0	0	cmpcm7sgp000004l1fp9o52ky	cmpr23ivg000204icrms1915w	2026-07-17 16:32:50.736	2026-07-17 16:32:50.736	\N
cmrp5peep000204jrq3gxtf04	1	0	0	0	cmpefcd1z000004lasd2r1kdh	cmpr23ivg000204icrms1915w	2026-07-17 16:32:50.736	2026-07-17 16:32:50.736	\N
cmrp5peep000304jr4dorfezz	0	0	0	0	cmpefdkyx000304la3k3nq9p9	cmpr23ivg000204icrms1915w	2026-07-17 16:32:50.736	2026-07-17 16:32:50.736	\N
cmrp5peep000404jrcvn0mp1v	0	0	0	0	cmpcsds4s000004jmgpwku1j2	cmpr23ivg000204icrms1915w	2026-07-17 16:32:50.736	2026-07-17 16:32:50.736	\N
cmrp5peep000504jrgi7q5kql	0	0	0	0	cmpdz3jpw000004jvdohsd2ri	cmpr23ivg000204icrms1915w	2026-07-17 16:32:50.736	2026-07-17 16:32:50.736	\N
cmrp5peep000604jrj3wsy5do	0	0	0	0	cmpfk8v2v000704jlp8siky9e	cmpr23ivg000204icrms1915w	2026-07-17 16:32:50.736	2026-07-17 16:32:50.736	\N
cmrp5peep000704jrf37le3a8	0	0	0	0	cmpcpgupa000004l5ehnc0kjs	cmpr23ivg000204icrms1915w	2026-07-17 16:32:50.736	2026-07-17 16:32:50.736	\N
cmrp5peep000804jrkh88ggqg	0	0	0	0	cmpn1o6et000004jrcnmw0gav	cmpr23ivg000204icrms1915w	2026-07-17 16:32:50.736	2026-07-17 16:32:50.736	\N
cmrp5peeq000904jrhxkxe65q	0	0	0	0	\N	cmpr23ivg000204icrms1915w	2026-07-17 16:32:50.736	2026-07-17 16:32:50.736	cmpsgy3kr000004l76jl6gdk5
cmrp5peeq000a04jr83roitbs	1	0	0	0	\N	cmpr23ivg000204icrms1915w	2026-07-17 16:32:50.736	2026-07-17 16:32:50.736	cmpslxcyw000004l416kqdc9h
cmrp5peeq000b04jrzjr23n1f	0	0	0	0	\N	cmpr23ivg000204icrms1915w	2026-07-17 16:32:50.736	2026-07-17 16:32:50.736	cmrp5nm92000004l4y86d072u
cmrp8f2uv000l04jpgstqqvw7	0	0	0	0	cmpcm7sgp000004l1fp9o52ky	cmrp8963m000004larspejvgr	2026-07-17 17:48:48.054	2026-07-17 17:48:48.054	\N
cmq763cwv000004k0w3ez2z3t	0	0	1	0	cmpcm7sgp000004l1fp9o52ky	cmpg3k0ot000004l5zes9kdtc	2026-06-09 21:44:08.479	2026-06-09 21:44:08.479	\N
cmq763cwv000104k0jbeu8bcv	0	0	0	0	cmpcqf47m000004l85vce0gfh	cmpg3k0ot000004l5zes9kdtc	2026-06-09 21:44:08.479	2026-06-09 21:44:08.479	\N
cmq763cwv000204k0f0wo0f0t	0	0	0	0	cmpdz2mcq000104jr9xnhl4i0	cmpg3k0ot000004l5zes9kdtc	2026-06-09 21:44:08.479	2026-06-09 21:44:08.479	\N
cmq763cwv000304k0k7tygp8b	0	0	0	0	cmpefdukz000404lanevrsp34	cmpg3k0ot000004l5zes9kdtc	2026-06-09 21:44:08.479	2026-06-09 21:44:08.479	\N
cmq763cwv000404k0pskcrazq	0	0	0	0	cmpcpt3n6000004l561lm2ja7	cmpg3k0ot000004l5zes9kdtc	2026-06-09 21:44:08.479	2026-06-09 21:44:08.479	\N
cmq763cwv000504k01gz0kp4w	0	0	0	0	cmpct94t9000204jsxeeckk3m	cmpg3k0ot000004l5zes9kdtc	2026-06-09 21:44:08.479	2026-06-09 21:44:08.479	\N
cmq763cwv000604k005r5gtxk	0	0	0	0	cmpct2xp7000004jsv1ujpe1r	cmpg3k0ot000004l5zes9kdtc	2026-06-09 21:44:08.479	2026-06-09 21:44:08.479	\N
cmq763cwv000704k0jjz3m8gw	0	0	0	0	cmpefep0o000504laynrqmhnw	cmpg3k0ot000004l5zes9kdtc	2026-06-09 21:44:08.479	2026-06-09 21:44:08.479	\N
cmq763cwv000804k0a526kk3q	1	0	0	0	cmpcpimjz000004jpcdqgfhfx	cmpg3k0ot000004l5zes9kdtc	2026-06-09 21:44:08.479	2026-06-09 21:44:08.479	\N
cmq763cwv000904k0mhykzivg	0	0	0	0	cmpcov8jd000004l8umh13pux	cmpg3k0ot000004l5zes9kdtc	2026-06-09 21:44:08.479	2026-06-09 21:44:08.479	\N
cmq763cwv000a04k03yqeyrx8	1	0	0	0	cmpefcd1z000004lasd2r1kdh	cmpg3k0ot000004l5zes9kdtc	2026-06-09 21:44:08.479	2026-06-09 21:44:08.479	\N
cmrpa28t6000s04ig8xhxhhb1	0	0	0	0	\N	cmrp9yfic000004jpt8bwp440	2026-07-17 18:34:48.474	2026-07-17 18:34:48.474	cmrp9z1ns000o04jpjhiynaor
cmrpa28t6000t04ig2c389r5e	0	0	0	0	\N	cmrp9yfic000004jpt8bwp440	2026-07-17 18:34:48.474	2026-07-17 18:34:48.474	cmrp9z9ne000004jsrwa2hqde
cmrpa28t6000u04ig395a69lh	1	0	0	0	\N	cmrp9yfic000004jpt8bwp440	2026-07-17 18:34:48.474	2026-07-17 18:34:48.474	cmrp9zx9m000204kz1cbpv1rw
cmrpa28t6000v04igoeb6iho9	1	0	0	0	cmpcov8jd000004l8umh13pux	cmrp9yfic000004jpt8bwp440	2026-07-17 18:34:48.474	2026-07-17 18:34:48.474	\N
cmq763cwv000b04k0rrf238wb	1	0	0	0	cmpfk8v2v000704jlp8siky9e	cmpg3k0ot000004l5zes9kdtc	2026-06-09 21:44:08.479	2026-06-09 21:44:08.479	\N
cmq763cwv000c04k06chd5t8y	0	0	0	0	cmpefdkyx000304la3k3nq9p9	cmpg3k0ot000004l5zes9kdtc	2026-06-09 21:44:08.479	2026-06-09 21:44:08.479	\N
cmq763cwv000d04k05ry8vaw8	0	0	0	0	cmpcsds4s000004jmgpwku1j2	cmpg3k0ot000004l5zes9kdtc	2026-06-09 21:44:08.479	2026-06-09 21:44:08.479	\N
cmq763cwv000e04k0x8k6k3hl	0	0	0	0	cmpcsehq1000104ibueo8dlm5	cmpg3k0ot000004l5zes9kdtc	2026-06-09 21:44:08.479	2026-06-09 21:44:08.479	\N
cmq763cwv000f04k0680x87ne	0	2	0	0	cmpefcqj2000104ladlx0ysjz	cmpg3k0ot000004l5zes9kdtc	2026-06-09 21:44:08.479	2026-06-09 21:44:08.479	\N
cmq763cwv000g04k0d948q2ft	0	0	0	0	cmpg41k59000004l7521hfcn4	cmpg3k0ot000004l5zes9kdtc	2026-06-09 21:44:08.479	2026-06-09 21:44:08.479	\N
cmqi3egsc000004kyz82vnqa9	0	0	0	0	cmpcsehq1000104ibueo8dlm5	cmq9kccux000004l58m8puvai	2026-06-17 13:14:15.804	2026-06-17 13:14:15.804	\N
cmqi3egsc000104kymh1h99ja	0	0	0	0	cmpdz3jpw000004jvdohsd2ri	cmq9kccux000004l58m8puvai	2026-06-17 13:14:15.804	2026-06-17 13:14:15.804	\N
cmqi3egsc000204kymd4y3bmd	0	0	0	0	cmpct94t9000204jsxeeckk3m	cmq9kccux000004l58m8puvai	2026-06-17 13:14:15.804	2026-06-17 13:14:15.804	\N
cmqi3egsc000304ky6pd5d8yx	2	0	0	0	cmpcm7sgp000004l1fp9o52ky	cmq9kccux000004l58m8puvai	2026-06-17 13:14:15.804	2026-06-17 13:14:15.804	\N
cmqi3egsc000404ky57u8r1s7	0	0	0	0	cmpefep0o000504laynrqmhnw	cmq9kccux000004l58m8puvai	2026-06-17 13:14:15.804	2026-06-17 13:14:15.804	\N
cmqi3egsc000504kyzbxuwty0	0	0	0	0	cmpcpimjz000004jpcdqgfhfx	cmq9kccux000004l58m8puvai	2026-06-17 13:14:15.804	2026-06-17 13:14:15.804	\N
cmqi3egsc000604kyvruc2kms	0	0	0	0	cmpcopzu6000004jro3prr7ca	cmq9kccux000004l58m8puvai	2026-06-17 13:14:15.804	2026-06-17 13:14:15.804	\N
cmqi3egsc000704kyp8yaxl17	0	0	0	0	cmpcov8jd000004l8umh13pux	cmq9kccux000004l58m8puvai	2026-06-17 13:14:15.804	2026-06-17 13:14:15.804	\N
cmqi3egsc000804kyvxzfmqrx	0	0	0	0	cmpcsds4s000004jmgpwku1j2	cmq9kccux000004l58m8puvai	2026-06-17 13:14:15.804	2026-06-17 13:14:15.804	\N
cmqi3egsc000904ky1nx8xe2s	0	0	0	0	cmpefcd1z000004lasd2r1kdh	cmq9kccux000004l58m8puvai	2026-06-17 13:14:15.804	2026-06-17 13:14:15.804	\N
cmqi3egsc000a04kyyph7ck4p	0	0	0	0	\N	cmq9kccux000004l58m8puvai	2026-06-17 13:14:15.804	2026-06-17 13:14:15.804	cmqe5zpmt000204l25zy7ohyt
cmqi3egsc000b04ky3ue0rib0	0	0	0	0	\N	cmq9kccux000004l58m8puvai	2026-06-17 13:14:15.804	2026-06-17 13:14:15.804	cmqe5zzgb000304l21rk9ubv0
cmqi3egsc000c04kya2e5gn97	0	0	0	0	\N	cmq9kccux000004l58m8puvai	2026-06-17 13:14:15.804	2026-06-17 13:14:15.804	cmqe606p8000004l5j21svsoh
cmqi3egsc000d04kye5ov7qor	0	0	0	0	\N	cmq9kccux000004l58m8puvai	2026-06-17 13:14:15.804	2026-06-17 13:14:15.804	cmqe60f05000004ll8vlr1u74
cmqi3egsc000e04kyonzucw0b	0	0	0	0	\N	cmq9kccux000004l58m8puvai	2026-06-17 13:14:15.804	2026-06-17 13:14:15.804	cmqe60oyw000104ll0wy6aevp
cmqi3egsc000f04kycn084czj	0	1	0	0	cmpefcqj2000104ladlx0ysjz	cmq9kccux000004l58m8puvai	2026-06-17 13:14:15.804	2026-06-17 13:14:15.804	\N
cmrp4fvfk000004jv8r8bla5y	0	0	0	0	\N	cmpg3rbz2000004la05x1z03i	2026-07-17 15:57:26.624	2026-07-17 15:57:26.624	cmqp55dtw000004joj17g14h4
cmrpgwh12000004l1oiqtk1d5	0	0	0	0	\N	cmrpgrdrs000o04jtnnx9wcf4	2026-07-17 21:46:16.502	2026-07-17 21:46:16.502	cmrpgs5yy001c04jt1w2oexg8
cmrpgwh12000104l1iiuq2hsp	0	0	0	0	\N	cmrpgrdrs000o04jtnnx9wcf4	2026-07-17 21:46:16.502	2026-07-17 21:46:16.502	cmrpgsfkc000004jth6k035mr
cmrpgwh12000204l19bzkh550	0	1	0	0	cmpefcd1z000004lasd2r1kdh	cmrpgrdrs000o04jtnnx9wcf4	2026-07-17 21:46:16.502	2026-07-17 21:46:16.502	\N
cmrpgwh12000304l1tocao4qh	2	0	0	0	cmpefcqj2000104ladlx0ysjz	cmrpgrdrs000o04jtnnx9wcf4	2026-07-17 21:46:16.502	2026-07-17 21:46:16.502	\N
cmrpgwh12000404l1mqtffurl	0	0	0	0	cmpg41k59000004l7521hfcn4	cmrpgrdrs000o04jtnnx9wcf4	2026-07-17 21:46:16.502	2026-07-17 21:46:16.502	\N
cmrpgwh12000504l1up2gfyzk	0	0	0	0	cmpcsds4s000004jmgpwku1j2	cmrpgrdrs000o04jtnnx9wcf4	2026-07-17 21:46:16.502	2026-07-17 21:46:16.502	\N
cmrpgwh12000604l1mbnqbwrf	0	0	0	0	cmpcpimjz000004jpcdqgfhfx	cmrpgrdrs000o04jtnnx9wcf4	2026-07-17 21:46:16.502	2026-07-17 21:46:16.502	\N
cmrpgwh12000704l1yyfr43ep	0	0	0	0	cmpefdukz000404lanevrsp34	cmrpgrdrs000o04jtnnx9wcf4	2026-07-17 21:46:16.502	2026-07-17 21:46:16.502	\N
cmrpgwh12000804l1ngwc1wmy	0	0	0	0	cmpct94t9000204jsxeeckk3m	cmrpgrdrs000o04jtnnx9wcf4	2026-07-17 21:46:16.502	2026-07-17 21:46:16.502	\N
cmrpgwh12000904l1kjlodz65	0	0	0	0	cmpefd4zq000204la3jqyndzz	cmrpgrdrs000o04jtnnx9wcf4	2026-07-17 21:46:16.502	2026-07-17 21:46:16.502	\N
cmrpgwh12000a04l16zih3x6e	0	0	0	0	cmpcov8jd000004l8umh13pux	cmrpgrdrs000o04jtnnx9wcf4	2026-07-17 21:46:16.502	2026-07-17 21:46:16.502	\N
cmrpgwh12000b04l1kxflvl21	0	0	0	0	cmpct2xp7000004jsv1ujpe1r	cmrpgrdrs000o04jtnnx9wcf4	2026-07-17 21:46:16.502	2026-07-17 21:46:16.502	\N
cmrpgwh12000c04l1kvv2h3gs	0	0	0	0	cmpcsehq1000104ibueo8dlm5	cmrpgrdrs000o04jtnnx9wcf4	2026-07-17 21:46:16.502	2026-07-17 21:46:16.502	\N
cmrpgwh12000d04l1mnfic0bi	0	0	0	0	cmpefdkyx000304la3k3nq9p9	cmrpgrdrs000o04jtnnx9wcf4	2026-07-17 21:46:16.502	2026-07-17 21:46:16.502	\N
cmrp4fvfk000104jvvrpqddjg	0	0	0	0	\N	cmpg3rbz2000004la05x1z03i	2026-07-17 15:57:26.624	2026-07-17 15:57:26.624	cmqp55xex000104joppfgvf9t
cmrp4fvfk000204jvfs8r60p8	1	0	1	0	\N	cmpg3rbz2000004la05x1z03i	2026-07-17 15:57:26.624	2026-07-17 15:57:26.624	cmqp565iz000004l597qyl257
cmrp4fvfk000304jvn2pk6sor	0	0	0	0	cmpcqf47m000004l85vce0gfh	cmpg3rbz2000004la05x1z03i	2026-07-17 15:57:26.624	2026-07-17 15:57:26.624	\N
cmrp4fvfk000404jvijjkvufa	0	0	0	0	cmpcm7sgp000004l1fp9o52ky	cmpg3rbz2000004la05x1z03i	2026-07-17 15:57:26.624	2026-07-17 15:57:26.624	\N
cmrp4fvfk000504jvpz6esc1r	0	0	0	0	cmpcov8jd000004l8umh13pux	cmpg3rbz2000004la05x1z03i	2026-07-17 15:57:26.624	2026-07-17 15:57:26.624	\N
cmrp4fvfk000604jvbrlcz5b2	0	0	0	0	cmpefcd1z000004lasd2r1kdh	cmpg3rbz2000004la05x1z03i	2026-07-17 15:57:26.624	2026-07-17 15:57:26.624	\N
cmrp4fvfk000704jveh03v3ad	0	0	1	0	cmpdz2mcq000104jr9xnhl4i0	cmpg3rbz2000004la05x1z03i	2026-07-17 15:57:26.624	2026-07-17 15:57:26.624	\N
cmrp4fvfk000804jv11j18nkh	0	0	0	0	cmpefcqj2000104ladlx0ysjz	cmpg3rbz2000004la05x1z03i	2026-07-17 15:57:26.624	2026-07-17 15:57:26.624	\N
cmrp4fvfk000904jvet6fcbs2	0	0	1	0	cmpct2xp7000004jsv1ujpe1r	cmpg3rbz2000004la05x1z03i	2026-07-17 15:57:26.624	2026-07-17 15:57:26.624	\N
cmrp4fvfk000a04jv3mnavrl3	0	0	0	0	cmpcpimjz000004jpcdqgfhfx	cmpg3rbz2000004la05x1z03i	2026-07-17 15:57:26.624	2026-07-17 15:57:26.624	\N
cmrp4fvfk000b04jvwjhpz7ck	0	0	0	0	cmpefep0o000504laynrqmhnw	cmpg3rbz2000004la05x1z03i	2026-07-17 15:57:26.624	2026-07-17 15:57:26.624	\N
cmrp4fvfk000c04jv14cgyo85	0	0	0	0	cmpfk8v2v000704jlp8siky9e	cmpg3rbz2000004la05x1z03i	2026-07-17 15:57:26.624	2026-07-17 15:57:26.624	\N
cmro9y8cj000204lbl65ogklo	0	0	0	0	cmpcqf47m000004l85vce0gfh	cmrkxjsua000004jtqvbnfwac	2026-07-17 01:43:55.075	2026-07-17 01:43:55.075	\N
cmro9y8cj000304lbqi498uvy	0	0	0	0	cmpefdkyx000304la3k3nq9p9	cmrkxjsua000004jtqvbnfwac	2026-07-17 01:43:55.075	2026-07-17 01:43:55.075	\N
cmro9y8cj000404lbl25pxfgv	0	0	0	0	cmpcov8jd000004l8umh13pux	cmrkxjsua000004jtqvbnfwac	2026-07-17 01:43:55.075	2026-07-17 01:43:55.075	\N
cmro9y8cj000504lbyvvxkomm	0	0	0	0	cmpefcd1z000004lasd2r1kdh	cmrkxjsua000004jtqvbnfwac	2026-07-17 01:43:55.075	2026-07-17 01:43:55.075	\N
cmro9y8cj000604lb8d8qnk9q	0	0	0	0	cmpdz2mcq000104jr9xnhl4i0	cmrkxjsua000004jtqvbnfwac	2026-07-17 01:43:55.075	2026-07-17 01:43:55.075	\N
cmro9y8cj000704lby85lj7i0	0	0	0	0	cmpcm7sgp000004l1fp9o52ky	cmrkxjsua000004jtqvbnfwac	2026-07-17 01:43:55.075	2026-07-17 01:43:55.075	\N
cmro9y8cj000804lb00py0d1g	0	0	0	0	cmpn1o6et000004jrcnmw0gav	cmrkxjsua000004jtqvbnfwac	2026-07-17 01:43:55.075	2026-07-17 01:43:55.075	\N
cmro9y8cj000904lbtpz1adap	0	0	0	0	cmpefcqj2000104ladlx0ysjz	cmrkxjsua000004jtqvbnfwac	2026-07-17 01:43:55.075	2026-07-17 01:43:55.075	\N
cmro9y8cj000a04lb76iou59v	0	0	0	0	cmpct94t9000204jsxeeckk3m	cmrkxjsua000004jtqvbnfwac	2026-07-17 01:43:55.075	2026-07-17 01:43:55.075	\N
cmro9y8cj000b04lbmtdkcx5p	0	0	0	0	cmpcopzu6000004jro3prr7ca	cmrkxjsua000004jtqvbnfwac	2026-07-17 01:43:55.075	2026-07-17 01:43:55.075	\N
cmro9y8cj000c04lbg9rywp1y	0	0	0	0	cmpcpimjz000004jpcdqgfhfx	cmrkxjsua000004jtqvbnfwac	2026-07-17 01:43:55.075	2026-07-17 01:43:55.075	\N
cmro9y8cj000d04lby504m7ee	0	0	1	0	cmpfk8v2v000704jlp8siky9e	cmrkxjsua000004jtqvbnfwac	2026-07-17 01:43:55.075	2026-07-17 01:43:55.075	\N
cmro9y8cj000e04lb9mncouv7	0	0	0	0	\N	cmrkxjsua000004jtqvbnfwac	2026-07-17 01:43:55.075	2026-07-17 01:43:55.075	cmrnwl1mg000104ldorxpquij
cmro9y8cj000f04lbhefnxx4a	0	0	0	0	\N	cmrkxjsua000004jtqvbnfwac	2026-07-17 01:43:55.075	2026-07-17 01:43:55.075	cmrnwdiee000004ldvhn5k2ft
cmro9y8cj000g04lbe00dds9m	0	0	0	0	cmpcsds4s000004jmgpwku1j2	cmrkxjsua000004jtqvbnfwac	2026-07-17 01:43:55.075	2026-07-17 01:43:55.075	\N
cmro9y8cj000h04lbs7nuap68	0	0	0	0	cmpcoxez0000304l8g40zcfou	cmrkxjsua000004jtqvbnfwac	2026-07-17 01:43:55.075	2026-07-17 01:43:55.075	\N
cmro9y8cj000i04lb5pou3b9u	0	0	0	0	cmpefep0o000504laynrqmhnw	cmrkxjsua000004jtqvbnfwac	2026-07-17 01:43:55.075	2026-07-17 01:43:55.075	\N
cmro9y8cj000j04lbimf915ee	0	0	0	0	cmpcpt3n6000004l561lm2ja7	cmrkxjsua000004jtqvbnfwac	2026-07-17 01:43:55.075	2026-07-17 01:43:55.075	\N
cmro9y8cj000k04lbq27ykos8	0	0	0	0	cmpct2xp7000004jsv1ujpe1r	cmrkxjsua000004jtqvbnfwac	2026-07-17 01:43:55.075	2026-07-17 01:43:55.075	\N
cmrp4fvfk000d04jvq8afgqrh	0	0	0	0	cmph7t8a1000004l9n8uic25p	cmpg3rbz2000004la05x1z03i	2026-07-17 15:57:26.624	2026-07-17 15:57:26.624	\N
cmrpgwh12000e04l1mkfqcs2q	0	0	0	0	cmpcopzu6000004jro3prr7ca	cmrpgrdrs000o04jtnnx9wcf4	2026-07-17 21:46:16.502	2026-07-17 21:46:16.502	\N
cmrpgwh12000f04l1td3h1cp9	0	0	0	0	cmpefep0o000504laynrqmhnw	cmrpgrdrs000o04jtnnx9wcf4	2026-07-17 21:46:16.502	2026-07-17 21:46:16.502	\N
cmrpgwh12000g04l1bv0udlsz	0	0	0	0	cmpcm7sgp000004l1fp9o52ky	cmrpgrdrs000o04jtnnx9wcf4	2026-07-17 21:46:16.502	2026-07-17 21:46:16.502	\N
cmrp8f2uu000604jp7uacmo4w	0	0	0	0	\N	cmrp8963m000004larspejvgr	2026-07-17 17:48:48.054	2026-07-17 17:48:48.054	cmrp8ctgg000004lcwm8kpp5d
cmrp8f2uu000704jpo0m7ssp0	1	1	0	0	cmpfk8v2v000704jlp8siky9e	cmrp8963m000004larspejvgr	2026-07-17 17:48:48.054	2026-07-17 17:48:48.054	\N
cmrp8f2uu000804jp3iwdcw8h	1	0	0	0	cmpefcqj2000104ladlx0ysjz	cmrp8963m000004larspejvgr	2026-07-17 17:48:48.054	2026-07-17 17:48:48.054	\N
cmrp8f2uu000904jpgxa0vngj	0	1	0	0	cmpcpgupa000004l5ehnc0kjs	cmrp8963m000004larspejvgr	2026-07-17 17:48:48.054	2026-07-17 17:48:48.054	\N
cmrp8f2uu000a04jpfngebhvy	0	0	0	0	cmpefdukz000404lanevrsp34	cmrp8963m000004larspejvgr	2026-07-17 17:48:48.054	2026-07-17 17:48:48.054	\N
cmrp8f2uv000b04jp10xq58l8	0	0	0	0	cmpcpimjz000004jpcdqgfhfx	cmrp8963m000004larspejvgr	2026-07-17 17:48:48.054	2026-07-17 17:48:48.054	\N
cmrp8f2uv000c04jp88da7gax	0	0	0	0	cmph7s4ma000004l727k39xdv	cmrp8963m000004larspejvgr	2026-07-17 17:48:48.054	2026-07-17 17:48:48.054	\N
cmrp8f2uv000d04jpz4hpr2u3	0	0	0	0	cmpdz3jpw000004jvdohsd2ri	cmrp8963m000004larspejvgr	2026-07-17 17:48:48.054	2026-07-17 17:48:48.054	\N
cmrp3fha8000004l5j39yu7ym	0	0	0	0	\N	cmqp62ilp000004jul47gswr8	2026-07-17 15:29:08.672	2026-07-17 15:29:08.672	cmrp3cv27000004l2opjs1ij2
cmrp3fha8000104l5s8sb61hy	0	0	0	0	\N	cmqp62ilp000004jul47gswr8	2026-07-17 15:29:08.672	2026-07-17 15:29:08.672	cmrp3deel000004i3d7fks5ke
cmrp3fha8000204l544aqbh50	0	0	0	0	\N	cmqp62ilp000004jul47gswr8	2026-07-17 15:29:08.672	2026-07-17 15:29:08.672	cmrp3dmyb000104l2x24r6itt
cmrp3fha8000304l56o116y6s	1	0	0	0	cmpdz2mcq000104jr9xnhl4i0	cmqp62ilp000004jul47gswr8	2026-07-17 15:29:08.672	2026-07-17 15:29:08.672	\N
cmrp3fha8000404l5fe42i95o	0	0	0	0	cmpfk8v2v000704jlp8siky9e	cmqp62ilp000004jul47gswr8	2026-07-17 15:29:08.672	2026-07-17 15:29:08.672	\N
cmrp3fha8000504l5dnrhcuvi	0	0	0	0	cmpcpimjz000004jpcdqgfhfx	cmqp62ilp000004jul47gswr8	2026-07-17 15:29:08.672	2026-07-17 15:29:08.672	\N
cmrp3fha8000604l5remw9l5f	0	0	0	0	cmpcsds4s000004jmgpwku1j2	cmqp62ilp000004jul47gswr8	2026-07-17 15:29:08.672	2026-07-17 15:29:08.672	\N
cmrp3fha8000704l5x77g4p3y	0	0	0	0	cmpefcqj2000104ladlx0ysjz	cmqp62ilp000004jul47gswr8	2026-07-17 15:29:08.672	2026-07-17 15:29:08.672	\N
cmrp3fha8000804l57vx19mao	0	0	0	0	cmph7t8a1000004l9n8uic25p	cmqp62ilp000004jul47gswr8	2026-07-17 15:29:08.672	2026-07-17 15:29:08.672	\N
cmrp3fha8000904l5siots82s	0	0	0	0	cmpcpt3n6000004l561lm2ja7	cmqp62ilp000004jul47gswr8	2026-07-17 15:29:08.672	2026-07-17 15:29:08.672	\N
cmrp3fha8000a04l5bmhploej	0	0	0	0	cmpcov8jd000004l8umh13pux	cmqp62ilp000004jul47gswr8	2026-07-17 15:29:08.672	2026-07-17 15:29:08.672	\N
cmrp3fha8000b04l566f8bf08	0	0	0	0	cmpct2xp7000004jsv1ujpe1r	cmqp62ilp000004jul47gswr8	2026-07-17 15:29:08.672	2026-07-17 15:29:08.672	\N
cmrp3fha8000c04l52h43dkcr	0	0	0	0	cmpcsehq1000104ibueo8dlm5	cmqp62ilp000004jul47gswr8	2026-07-17 15:29:08.672	2026-07-17 15:29:08.672	\N
cmrp3fha8000d04l5nx820x7u	0	0	0	0	cmpcopzu6000004jro3prr7ca	cmqp62ilp000004jul47gswr8	2026-07-17 15:29:08.672	2026-07-17 15:29:08.672	\N
cmrp3fha8000e04l5paeaftgy	0	0	0	0	cmpcm7sgp000004l1fp9o52ky	cmqp62ilp000004jul47gswr8	2026-07-17 15:29:08.672	2026-07-17 15:29:08.672	\N
cmrp3z41t000004ldoweb2eiy	0	1	0	0	cmpcoxez0000304l8g40zcfou	cmr4v6j8z000004jmrs48v3h3	2026-07-17 15:44:24.642	2026-07-17 15:44:24.642	\N
cmrp3z41u000104ldlkl5bojy	0	0	0	0	cmpcov8jd000004l8umh13pux	cmr4v6j8z000004jmrs48v3h3	2026-07-17 15:44:24.642	2026-07-17 15:44:24.642	\N
cmrp3z41u000204ldqldji7g5	0	0	0	0	cmpcm7sgp000004l1fp9o52ky	cmr4v6j8z000004jmrs48v3h3	2026-07-17 15:44:24.642	2026-07-17 15:44:24.642	\N
cmrp3z41u000304ldq9osiplc	0	0	0	0	cmpfk8v2v000704jlp8siky9e	cmr4v6j8z000004jmrs48v3h3	2026-07-17 15:44:24.642	2026-07-17 15:44:24.642	\N
cmrp3z41u000404ldy74fsj55	0	0	0	0	cmpcsehq1000104ibueo8dlm5	cmr4v6j8z000004jmrs48v3h3	2026-07-17 15:44:24.642	2026-07-17 15:44:24.642	\N
cmrp3z41u000504ld33khg8h3	0	0	0	0	cmpefcd1z000004lasd2r1kdh	cmr4v6j8z000004jmrs48v3h3	2026-07-17 15:44:24.642	2026-07-17 15:44:24.642	\N
cmrp3z41u000604ldchx0tae1	0	0	1	0	cmpcpimjz000004jpcdqgfhfx	cmr4v6j8z000004jmrs48v3h3	2026-07-17 15:44:24.642	2026-07-17 15:44:24.642	\N
cmrp3z41u000704ldax0yobru	0	0	0	0	cmpdz2mcq000104jr9xnhl4i0	cmr4v6j8z000004jmrs48v3h3	2026-07-17 15:44:24.642	2026-07-17 15:44:24.642	\N
cmrp3z41u000804ld2icj7vau	0	0	0	0	cmpct94t9000204jsxeeckk3m	cmr4v6j8z000004jmrs48v3h3	2026-07-17 15:44:24.642	2026-07-17 15:44:24.642	\N
cmrp3z41u000904ld854w6z9n	0	0	1	0	cmpcsds4s000004jmgpwku1j2	cmr4v6j8z000004jmrs48v3h3	2026-07-17 15:44:24.642	2026-07-17 15:44:24.642	\N
cmrp3z41u000a04ldderkil1m	0	0	0	0	cmpcpt3n6000004l561lm2ja7	cmr4v6j8z000004jmrs48v3h3	2026-07-17 15:44:24.642	2026-07-17 15:44:24.642	\N
cmrp3z41u000b04ldk9e4mezi	2	1	0	0	cmpefcqj2000104ladlx0ysjz	cmr4v6j8z000004jmrs48v3h3	2026-07-17 15:44:24.642	2026-07-17 15:44:24.642	\N
cmrp3z41u000c04ldaplhnq0a	0	0	0	0	\N	cmr4v6j8z000004jmrs48v3h3	2026-07-17 15:44:24.642	2026-07-17 15:44:24.642	cmr6fb1io000004l4iyxqk8ns
cmrp3z41u000d04ld83l1t1v0	1	0	0	0	\N	cmr4v6j8z000004jmrs48v3h3	2026-07-17 15:44:24.642	2026-07-17 15:44:24.642	cmr6fbbr5000004jv15p6b2im
cmrp3z41u000e04ld5r7u8b0h	0	0	0	0	\N	cmr4v6j8z000004jmrs48v3h3	2026-07-17 15:44:24.642	2026-07-17 15:44:24.642	cmrp3ybfk000004l54dm1yosy
cmrpgwh12000h04l1eqnkcbgq	0	0	1	0	cmph7s4ma000004l727k39xdv	cmrpgrdrs000o04jtnnx9wcf4	2026-07-17 21:46:16.502	2026-07-17 21:46:16.502	\N
cmrql0svm000d04la2e37b3b8	0	0	0	0	cmpefdukz000404lanevrsp34	cmrqkwrev000004jpjug6t8wd	2026-07-18 16:29:23.122	2026-07-18 16:29:23.122	\N
cmrp7p7qs000x04l4br1hz3o7	1	0	0	0	cmpg41k59000004l7521hfcn4	cmrp7l1ax000104l49nmc6qf9	2026-07-17 17:28:41.332	2026-07-17 17:28:41.332	\N
cmrp7p7qs000y04l4tbnfwt6i	1	0	0	0	cmpefcqj2000104ladlx0ysjz	cmrp7l1ax000104l49nmc6qf9	2026-07-17 17:28:41.332	2026-07-17 17:28:41.332	\N
cmrp7p7qs000z04l4xbz62og9	0	1	0	0	cmpcm7sgp000004l1fp9o52ky	cmrp7l1ax000104l49nmc6qf9	2026-07-17 17:28:41.332	2026-07-17 17:28:41.332	\N
cmrp7p7qs001004l4htx7xtqj	0	1	0	0	cmpdz2mcq000104jr9xnhl4i0	cmrp7l1ax000104l49nmc6qf9	2026-07-17 17:28:41.332	2026-07-17 17:28:41.332	\N
cmrp7p7qs001104l4c6jpv0ss	0	0	0	0	cmpcoxez0000304l8g40zcfou	cmrp7l1ax000104l49nmc6qf9	2026-07-17 17:28:41.332	2026-07-17 17:28:41.332	\N
cmrp7p7qt001204l4u9g29vz7	0	0	0	0	cmpcpimjz000004jpcdqgfhfx	cmrp7l1ax000104l49nmc6qf9	2026-07-17 17:28:41.332	2026-07-17 17:28:41.332	\N
cmrp7p7qt001304l4mvx4t4v9	0	0	0	0	cmph7s4ma000004l727k39xdv	cmrp7l1ax000104l49nmc6qf9	2026-07-17 17:28:41.332	2026-07-17 17:28:41.332	\N
cmrp7p7qt001404l47qebmo8o	0	0	0	0	cmpct94t9000204jsxeeckk3m	cmrp7l1ax000104l49nmc6qf9	2026-07-17 17:28:41.332	2026-07-17 17:28:41.332	\N
cmrp7p7qt001504l42tyvva3v	0	0	0	0	cmpcpt3n6000004l561lm2ja7	cmrp7l1ax000104l49nmc6qf9	2026-07-17 17:28:41.332	2026-07-17 17:28:41.332	\N
cmrp7p7qt001604l4x6xjqlmv	0	0	0	0	cmpefd4zq000204la3jqyndzz	cmrp7l1ax000104l49nmc6qf9	2026-07-17 17:28:41.332	2026-07-17 17:28:41.332	\N
cmrp7p7qt001704l4pjmbclzn	0	0	0	0	cmpct2xp7000004jsv1ujpe1r	cmrp7l1ax000104l49nmc6qf9	2026-07-17 17:28:41.332	2026-07-17 17:28:41.332	\N
cmrp7p7qt001804l45cu79rzr	0	0	0	0	cmpefdukz000404lanevrsp34	cmrp7l1ax000104l49nmc6qf9	2026-07-17 17:28:41.332	2026-07-17 17:28:41.332	\N
cmrp7p7qt001904l42ug9i8nf	0	0	0	0	cmpcopzu6000004jro3prr7ca	cmrp7l1ax000104l49nmc6qf9	2026-07-17 17:28:41.332	2026-07-17 17:28:41.332	\N
cmrp7p7qt001a04l4td7emxcb	0	0	0	0	cmpefep0o000504laynrqmhnw	cmrp7l1ax000104l49nmc6qf9	2026-07-17 17:28:41.332	2026-07-17 17:28:41.332	\N
cmrql0svm000e04la3cg25vhg	0	0	0	0	cmpefdkyx000304la3k3nq9p9	cmrqkwrev000004jpjug6t8wd	2026-07-18 16:29:23.122	2026-07-18 16:29:23.122	\N
cmrql0svm000f04la3zmqp7c5	0	0	0	0	cmpcopzu6000004jro3prr7ca	cmrqkwrev000004jpjug6t8wd	2026-07-18 16:29:23.122	2026-07-18 16:29:23.122	\N
cmrql0svm000g04lant8rjkeo	0	0	0	0	cmpefep0o000504laynrqmhnw	cmrqkwrev000004jpjug6t8wd	2026-07-18 16:29:23.122	2026-07-18 16:29:23.122	\N
cmrp8gocg000804l5k8ejd76y	0	0	0	0	\N	cmpgxpcmr000104l1gbglqrdc	2026-07-17 17:50:02.56	2026-07-17 17:50:02.56	cmrp8g9ju000004l4vofclrlu
cmrp8gocg000904l5fjn9d1ag	0	2	0	0	cmpefcd1z000004lasd2r1kdh	cmpgxpcmr000104l1gbglqrdc	2026-07-17 17:50:02.56	2026-07-17 17:50:02.56	\N
cmrp8gocg000a04l5orqlcdav	1	0	0	0	cmpefcqj2000104ladlx0ysjz	cmpgxpcmr000104l1gbglqrdc	2026-07-17 17:50:02.56	2026-07-17 17:50:02.56	\N
cmrp8gocg000b04l5sn737f2j	1	0	1	0	cmpdz2mcq000104jr9xnhl4i0	cmpgxpcmr000104l1gbglqrdc	2026-07-17 17:50:02.56	2026-07-17 17:50:02.56	\N
cmrp8gocg000c04l5z2t823wu	0	0	0	0	cmpfk8v2v000704jlp8siky9e	cmpgxpcmr000104l1gbglqrdc	2026-07-17 17:50:02.56	2026-07-17 17:50:02.56	\N
cmrp8gocg000d04l5mersmf6u	0	0	0	0	cmpcpimjz000004jpcdqgfhfx	cmpgxpcmr000104l1gbglqrdc	2026-07-17 17:50:02.56	2026-07-17 17:50:02.56	\N
cmrp8gocg000e04l5259atea4	0	0	0	0	cmpcsds4s000004jmgpwku1j2	cmpgxpcmr000104l1gbglqrdc	2026-07-17 17:50:02.56	2026-07-17 17:50:02.56	\N
cmrp8gocg000f04l5f38rfsam	0	0	0	0	cmpct94t9000204jsxeeckk3m	cmpgxpcmr000104l1gbglqrdc	2026-07-17 17:50:02.56	2026-07-17 17:50:02.56	\N
cmrp8gocg000g04l5dbjv3ebl	0	0	0	0	cmpcqf47m000004l85vce0gfh	cmpgxpcmr000104l1gbglqrdc	2026-07-17 17:50:02.56	2026-07-17 17:50:02.56	\N
cmrp8gocg000h04l5bmwx0cs3	0	0	0	0	cmpcpgupa000004l5ehnc0kjs	cmpgxpcmr000104l1gbglqrdc	2026-07-17 17:50:02.56	2026-07-17 17:50:02.56	\N
cmrp8gocg000i04l51dpr4go9	0	0	0	0	cmpefdukz000404lanevrsp34	cmpgxpcmr000104l1gbglqrdc	2026-07-17 17:50:02.56	2026-07-17 17:50:02.56	\N
cmrp8gocg000j04l5aciguhis	0	0	0	0	cmpcm7sgp000004l1fp9o52ky	cmpgxpcmr000104l1gbglqrdc	2026-07-17 17:50:02.56	2026-07-17 17:50:02.56	\N
cmrp8goch000k04l5bqidspaw	0	0	0	0	cmpefd4zq000204la3jqyndzz	cmpgxpcmr000104l1gbglqrdc	2026-07-17 17:50:02.56	2026-07-17 17:50:02.56	\N
cmrp9r7j3000004ig72ac0mes	1	0	0	0	cmpefd4zq000204la3jqyndzz	cmrp9ms6u000004ldf8womoau	2026-07-17 18:26:13.599	2026-07-17 18:26:13.599	\N
cmrp9r7j3000104ig2stdez75	0	0	0	0	cmpefdukz000404lanevrsp34	cmrp9ms6u000004ldf8womoau	2026-07-17 18:26:13.599	2026-07-17 18:26:13.599	\N
cmrp9r7j3000204igmjjt1i32	0	0	0	0	cmpg41k59000004l7521hfcn4	cmrp9ms6u000004ldf8womoau	2026-07-17 18:26:13.599	2026-07-17 18:26:13.599	\N
cmrp9r7j3000304igk6qlyglr	0	0	0	0	cmpcpimjz000004jpcdqgfhfx	cmrp9ms6u000004ldf8womoau	2026-07-17 18:26:13.599	2026-07-17 18:26:13.599	\N
cmrp9r7j3000404igcw3eayyg	0	0	0	0	cmph7s4ma000004l727k39xdv	cmrp9ms6u000004ldf8womoau	2026-07-17 18:26:13.599	2026-07-17 18:26:13.599	\N
cmrp9r7j3000504ignkk4qng1	0	0	0	0	cmpcsds4s000004jmgpwku1j2	cmrp9ms6u000004ldf8womoau	2026-07-17 18:26:13.599	2026-07-17 18:26:13.599	\N
cmrp9r7j3000604igshxcnnc7	0	0	0	0	cmpefcqj2000104ladlx0ysjz	cmrp9ms6u000004ldf8womoau	2026-07-17 18:26:13.599	2026-07-17 18:26:13.599	\N
cmrp9r7j3000704igjg7fibbo	0	0	0	0	cmpcpt3n6000004l561lm2ja7	cmrp9ms6u000004ldf8womoau	2026-07-17 18:26:13.599	2026-07-17 18:26:13.599	\N
cmrp9r7j3000804igktb06iff	0	0	0	0	cmpdz3jpw000004jvdohsd2ri	cmrp9ms6u000004ldf8womoau	2026-07-17 18:26:13.599	2026-07-17 18:26:13.599	\N
cmrp9r7j3000904igqitu8503	0	0	0	0	cmpdz2mcq000104jr9xnhl4i0	cmrp9ms6u000004ldf8womoau	2026-07-17 18:26:13.599	2026-07-17 18:26:13.599	\N
cmrp9r7j3000a04iga15xwvyg	0	0	0	0	cmpcov8jd000004l8umh13pux	cmrp9ms6u000004ldf8womoau	2026-07-17 18:26:13.599	2026-07-17 18:26:13.599	\N
cmrp9r7j3000b04igucgrqocm	0	0	0	0	cmpct2xp7000004jsv1ujpe1r	cmrp9ms6u000004ldf8womoau	2026-07-17 18:26:13.599	2026-07-17 18:26:13.599	\N
cmrp9r7j3000c04ighxswysy9	0	0	0	0	cmpefep0o000504laynrqmhnw	cmrp9ms6u000004ldf8womoau	2026-07-17 18:26:13.599	2026-07-17 18:26:13.599	\N
cmrp9r7j3000d04igxv0k8oxk	0	0	0	0	cmpcm7sgp000004l1fp9o52ky	cmrp9ms6u000004ldf8womoau	2026-07-17 18:26:13.599	2026-07-17 18:26:13.599	\N
cmrpa28t6000w04ig49nwamm7	0	1	0	0	cmpefcqj2000104ladlx0ysjz	cmrp9yfic000004jpt8bwp440	2026-07-17 18:34:48.474	2026-07-17 18:34:48.474	\N
cmrpa28t6000x04ig15put7pm	0	0	0	0	cmpcpimjz000004jpcdqgfhfx	cmrp9yfic000004jpt8bwp440	2026-07-17 18:34:48.474	2026-07-17 18:34:48.474	\N
cmrpa28t6000y04ig0rw0pau7	0	0	0	0	cmph7s4ma000004l727k39xdv	cmrp9yfic000004jpt8bwp440	2026-07-17 18:34:48.474	2026-07-17 18:34:48.474	\N
cmrpa28t6000z04ige71ftt7y	0	0	0	0	cmpefcd1z000004lasd2r1kdh	cmrp9yfic000004jpt8bwp440	2026-07-17 18:34:48.474	2026-07-17 18:34:48.474	\N
cmrpa28t6001004igglszllka	0	0	0	0	cmpefd4zq000204la3jqyndzz	cmrp9yfic000004jpt8bwp440	2026-07-17 18:34:48.474	2026-07-17 18:34:48.474	\N
cmrpa28t6001104igxsxrbz3p	0	0	0	0	cmpcpgupa000004l5ehnc0kjs	cmrp9yfic000004jpt8bwp440	2026-07-17 18:34:48.474	2026-07-17 18:34:48.474	\N
cmrpa28t6001204ig7uq6ojye	0	0	0	0	cmpcopzu6000004jro3prr7ca	cmrp9yfic000004jpt8bwp440	2026-07-17 18:34:48.474	2026-07-17 18:34:48.474	\N
cmrpa95x8000304jmkkbbz97p	0	0	0	0	\N	cmrpa59lt000p04jpzp8qdy4l	2026-07-17 18:40:11.325	2026-07-17 18:40:11.325	cmrpa8uzp000304kzg6xickjp
cmrpa95x9000404jm3rnphya1	1	0	0	0	cmpdz2mcq000104jr9xnhl4i0	cmrpa59lt000p04jpzp8qdy4l	2026-07-17 18:40:11.325	2026-07-17 18:40:11.325	\N
cmrpa95x9000504jmcl4dqhfe	0	1	0	0	cmpefcqj2000104ladlx0ysjz	cmrpa59lt000p04jpzp8qdy4l	2026-07-17 18:40:11.325	2026-07-17 18:40:11.325	\N
cmrpa95x9000604jmphekzf4j	0	0	0	0	cmpcpimjz000004jpcdqgfhfx	cmrpa59lt000p04jpzp8qdy4l	2026-07-17 18:40:11.325	2026-07-17 18:40:11.325	\N
cmrpa95x9000704jmextexhng	0	0	0	0	cmph7s4ma000004l727k39xdv	cmrpa59lt000p04jpzp8qdy4l	2026-07-17 18:40:11.325	2026-07-17 18:40:11.325	\N
cmrpa95x9000804jm7j5u5siu	0	0	0	0	cmpcsds4s000004jmgpwku1j2	cmrpa59lt000p04jpzp8qdy4l	2026-07-17 18:40:11.325	2026-07-17 18:40:11.325	\N
cmrpa95x9000904jma78hejcp	0	0	0	0	cmpct94t9000204jsxeeckk3m	cmrpa59lt000p04jpzp8qdy4l	2026-07-17 18:40:11.325	2026-07-17 18:40:11.325	\N
cmrpa95x9000a04jmcuj9f5ix	0	0	0	0	cmpefcd1z000004lasd2r1kdh	cmrpa59lt000p04jpzp8qdy4l	2026-07-17 18:40:11.325	2026-07-17 18:40:11.325	\N
cmrpa95x9000b04jmuf76ibpo	0	0	0	0	cmpcpt3n6000004l561lm2ja7	cmrpa59lt000p04jpzp8qdy4l	2026-07-17 18:40:11.325	2026-07-17 18:40:11.325	\N
cmrpa95x9000c04jmmtyq05g3	0	0	0	0	cmpefd4zq000204la3jqyndzz	cmrpa59lt000p04jpzp8qdy4l	2026-07-17 18:40:11.325	2026-07-17 18:40:11.325	\N
cmrpa95x9000d04jmqetou6rz	0	0	0	0	cmpct2xp7000004jsv1ujpe1r	cmrpa59lt000p04jpzp8qdy4l	2026-07-17 18:40:11.325	2026-07-17 18:40:11.325	\N
cmrpa95x9000e04jm0rxmhmpg	0	0	0	0	cmpefdukz000404lanevrsp34	cmrpa59lt000p04jpzp8qdy4l	2026-07-17 18:40:11.325	2026-07-17 18:40:11.325	\N
cmrpa95x9000f04jmpc9he3w4	0	0	0	0	cmpefdkyx000304la3k3nq9p9	cmrpa59lt000p04jpzp8qdy4l	2026-07-17 18:40:11.325	2026-07-17 18:40:11.325	\N
cmrpa95x9000g04jmped4gq0m	0	0	0	0	cmpcopzu6000004jro3prr7ca	cmrpa59lt000p04jpzp8qdy4l	2026-07-17 18:40:11.325	2026-07-17 18:40:11.325	\N
cmrpa95x9000h04jmehjkvfui	0	0	0	0	cmpcm7sgp000004l1fp9o52ky	cmrpa59lt000p04jpzp8qdy4l	2026-07-17 18:40:11.325	2026-07-17 18:40:11.325	\N
cmrpb2wz6000v04ldh4ufty6v	1	0	0	0	cmph7t8a1000004l9n8uic25p	cmrpaz5ve001b04igete2fxqx	2026-07-17 19:03:19.41	2026-07-17 19:03:19.41	\N
cmrpb2wz6000w04ldbkyghbm3	1	0	0	0	cmpcov8jd000004l8umh13pux	cmrpaz5ve001b04igete2fxqx	2026-07-17 19:03:19.41	2026-07-17 19:03:19.41	\N
cmrpb2wz6000x04ldyr2s59lo	0	1	0	0	cmpdz2mcq000104jr9xnhl4i0	cmrpaz5ve001b04igete2fxqx	2026-07-17 19:03:19.41	2026-07-17 19:03:19.41	\N
cmrpb2wz6000y04ldnkp2dfy1	0	0	0	0	cmpefdukz000404lanevrsp34	cmrpaz5ve001b04igete2fxqx	2026-07-17 19:03:19.41	2026-07-17 19:03:19.41	\N
cmrpb2wz6000z04ldru4u85h3	0	0	0	0	cmpfk8v2v000704jlp8siky9e	cmrpaz5ve001b04igete2fxqx	2026-07-17 19:03:19.41	2026-07-17 19:03:19.41	\N
cmrpb2wz6001004ldizzxv7y2	0	0	0	0	cmpcpimjz000004jpcdqgfhfx	cmrpaz5ve001b04igete2fxqx	2026-07-17 19:03:19.41	2026-07-17 19:03:19.41	\N
cmrpb2wz6001104ld2lj8qm2l	0	0	0	0	cmph7s4ma000004l727k39xdv	cmrpaz5ve001b04igete2fxqx	2026-07-17 19:03:19.41	2026-07-17 19:03:19.41	\N
cmrpb2wz6001204ld2yyaalcg	0	0	0	0	cmpcsds4s000004jmgpwku1j2	cmrpaz5ve001b04igete2fxqx	2026-07-17 19:03:19.41	2026-07-17 19:03:19.41	\N
cmrpb2wz6001304ldb56x0pcw	0	0	0	0	cmpct94t9000204jsxeeckk3m	cmrpaz5ve001b04igete2fxqx	2026-07-17 19:03:19.41	2026-07-17 19:03:19.41	\N
cmrpb2wz6001404ldyynhfhjq	0	0	0	0	cmpefcd1z000004lasd2r1kdh	cmrpaz5ve001b04igete2fxqx	2026-07-17 19:03:19.41	2026-07-17 19:03:19.41	\N
cmrpb2wz6001504ldyptosecv	0	0	0	0	cmpefcqj2000104ladlx0ysjz	cmrpaz5ve001b04igete2fxqx	2026-07-17 19:03:19.41	2026-07-17 19:03:19.41	\N
cmrpb2wz6001604ldgbyzkuns	0	0	0	0	cmpefd4zq000204la3jqyndzz	cmrpaz5ve001b04igete2fxqx	2026-07-17 19:03:19.41	2026-07-17 19:03:19.41	\N
cmrpb2wz6001704ld2pj3gotu	0	0	0	0	cmpct2xp7000004jsv1ujpe1r	cmrpaz5ve001b04igete2fxqx	2026-07-17 19:03:19.41	2026-07-17 19:03:19.41	\N
cmrpb2wz6001804ldbnpxb0f5	0	0	0	0	cmpcpgupa000004l5ehnc0kjs	cmrpaz5ve001b04igete2fxqx	2026-07-17 19:03:19.41	2026-07-17 19:03:19.41	\N
cmrpb2wz6001904ldc8a2a10p	0	0	0	0	cmpcopzu6000004jro3prr7ca	cmrpaz5ve001b04igete2fxqx	2026-07-17 19:03:19.41	2026-07-17 19:03:19.41	\N
cmrpb2wz6001a04ldiqiw1uxw	0	0	0	0	cmpcm7sgp000004l1fp9o52ky	cmrpaz5ve001b04igete2fxqx	2026-07-17 19:03:19.41	2026-07-17 19:03:19.41	\N
cmrpbp5tj001z04igjb5egz0s	3	0	0	0	cmpefcqj2000104ladlx0ysjz	cmrpblr3f001r04ldzbbc1u6h	2026-07-17 19:20:37.303	2026-07-17 19:20:37.303	\N
cmrpbp5tj002004ig5ura0k6m	1	0	0	0	cmpefd4zq000204la3jqyndzz	cmrpblr3f001r04ldzbbc1u6h	2026-07-17 19:20:37.303	2026-07-17 19:20:37.303	\N
cmrpbp5tj002104ig6krlqmc9	1	0	0	0	cmpcov8jd000004l8umh13pux	cmrpblr3f001r04ldzbbc1u6h	2026-07-17 19:20:37.303	2026-07-17 19:20:37.303	\N
cmrpbp5tj002204igq1z6r2el	0	1	0	0	cmpg41k59000004l7521hfcn4	cmrpblr3f001r04ldzbbc1u6h	2026-07-17 19:20:37.303	2026-07-17 19:20:37.303	\N
cmrpbp5tj002304igc8duw91n	0	1	0	0	cmpcpgupa000004l5ehnc0kjs	cmrpblr3f001r04ldzbbc1u6h	2026-07-17 19:20:37.303	2026-07-17 19:20:37.303	\N
cmrpbp5tj002404igq2q6vf6h	0	0	0	0	cmpcpimjz000004jpcdqgfhfx	cmrpblr3f001r04ldzbbc1u6h	2026-07-17 19:20:37.303	2026-07-17 19:20:37.303	\N
cmrpbp5tj002504igxjksowpp	0	0	0	0	cmph7s4ma000004l727k39xdv	cmrpblr3f001r04ldzbbc1u6h	2026-07-17 19:20:37.303	2026-07-17 19:20:37.303	\N
cmrpbp5tj002604igb7qxmokx	0	0	0	0	cmpcsds4s000004jmgpwku1j2	cmrpblr3f001r04ldzbbc1u6h	2026-07-17 19:20:37.303	2026-07-17 19:20:37.303	\N
cmrpbp5tj002704ighioyvqcm	0	0	0	0	cmpct94t9000204jsxeeckk3m	cmrpblr3f001r04ldzbbc1u6h	2026-07-17 19:20:37.303	2026-07-17 19:20:37.303	\N
cmrpbp5tj002804ighwrm2839	0	0	0	0	cmpdz3jpw000004jvdohsd2ri	cmrpblr3f001r04ldzbbc1u6h	2026-07-17 19:20:37.303	2026-07-17 19:20:37.303	\N
cmrpbp5tj002904igkztdcjwe	0	0	0	0	cmpefcd1z000004lasd2r1kdh	cmrpblr3f001r04ldzbbc1u6h	2026-07-17 19:20:37.303	2026-07-17 19:20:37.303	\N
cmrpbp5tj002a04ig47y60sbg	0	0	0	0	cmph7t8a1000004l9n8uic25p	cmrpblr3f001r04ldzbbc1u6h	2026-07-17 19:20:37.303	2026-07-17 19:20:37.303	\N
cmrpbp5tm002b04igqecb1onn	0	0	0	0	cmpefdukz000404lanevrsp34	cmrpblr3f001r04ldzbbc1u6h	2026-07-17 19:20:37.303	2026-07-17 19:20:37.303	\N
cmrpbp5tm002c04ig4j9leym7	0	0	0	0	cmpefdkyx000304la3k3nq9p9	cmrpblr3f001r04ldzbbc1u6h	2026-07-17 19:20:37.303	2026-07-17 19:20:37.303	\N
cmrpbp5tm002d04igi7mtvhfp	0	0	0	0	cmpcopzu6000004jro3prr7ca	cmrpblr3f001r04ldzbbc1u6h	2026-07-17 19:20:37.303	2026-07-17 19:20:37.303	\N
cmrpbp5tm002e04igr3qb8l4b	0	0	0	0	cmpcm7sgp000004l1fp9o52ky	cmrpblr3f001r04ldzbbc1u6h	2026-07-17 19:20:37.303	2026-07-17 19:20:37.303	\N
cmrpbya1n000h04jsmoyg47uk	0	3	0	0	\N	cmrpbrolu002f04ld1jou7dvp	2026-07-17 19:27:42.683	2026-07-17 19:27:42.683	cmrpbusr5003304ldfdrzw9ub
cmrpbya1n000i04jsa55u7jnt	2	0	0	0	cmpefcqj2000104ladlx0ysjz	cmrpbrolu002f04ld1jou7dvp	2026-07-17 19:27:42.683	2026-07-17 19:27:42.683	\N
cmrpbya1n000j04jskmwz2hdt	1	0	0	0	cmpefcd1z000004lasd2r1kdh	cmrpbrolu002f04ld1jou7dvp	2026-07-17 19:27:42.683	2026-07-17 19:27:42.683	\N
cmrpbya1n000k04jsu1v3qwzu	1	0	0	0	cmph7t8a1000004l9n8uic25p	cmrpbrolu002f04ld1jou7dvp	2026-07-17 19:27:42.683	2026-07-17 19:27:42.683	\N
cmrpbya1n000l04jsp7dfecs5	1	0	0	0	cmpcov8jd000004l8umh13pux	cmrpbrolu002f04ld1jou7dvp	2026-07-17 19:27:42.683	2026-07-17 19:27:42.683	\N
cmrpbya1n000m04js3s4vy0bq	1	0	0	0	cmpg43u13000604l7y6t0hdtt	cmrpbrolu002f04ld1jou7dvp	2026-07-17 19:27:42.683	2026-07-17 19:27:42.683	\N
cmrpbya1n000n04js6arvgd3k	0	1	0	0	cmpcpt3n6000004l561lm2ja7	cmrpbrolu002f04ld1jou7dvp	2026-07-17 19:27:42.683	2026-07-17 19:27:42.683	\N
cmrpbya1n000o04jsmf1snkua	0	1	0	0	cmpdz2mcq000104jr9xnhl4i0	cmrpbrolu002f04ld1jou7dvp	2026-07-17 19:27:42.683	2026-07-17 19:27:42.683	\N
cmrpbya1n000p04jsezi6rcil	0	0	0	0	cmpfk8v2v000704jlp8siky9e	cmrpbrolu002f04ld1jou7dvp	2026-07-17 19:27:42.683	2026-07-17 19:27:42.683	\N
cmrpbya1n000q04jszux5kvdn	0	0	0	0	cmpcpimjz000004jpcdqgfhfx	cmrpbrolu002f04ld1jou7dvp	2026-07-17 19:27:42.683	2026-07-17 19:27:42.683	\N
cmrpbya1n000r04jsedw9ydj2	0	0	0	0	cmpcsds4s000004jmgpwku1j2	cmrpbrolu002f04ld1jou7dvp	2026-07-17 19:27:42.683	2026-07-17 19:27:42.683	\N
cmrpbya1n000s04jstzse85zd	0	0	0	0	cmpct94t9000204jsxeeckk3m	cmrpbrolu002f04ld1jou7dvp	2026-07-17 19:27:42.683	2026-07-17 19:27:42.683	\N
cmrpbya1n000t04jspzh76is4	0	0	0	0	cmpefd4zq000204la3jqyndzz	cmrpbrolu002f04ld1jou7dvp	2026-07-17 19:27:42.683	2026-07-17 19:27:42.683	\N
cmrpbya1n000u04js59nv41qu	0	0	0	0	cmpct2xp7000004jsv1ujpe1r	cmrpbrolu002f04ld1jou7dvp	2026-07-17 19:27:42.683	2026-07-17 19:27:42.683	\N
cmrpbya1n000v04jsc9mue192	0	0	0	0	cmpefdkyx000304la3k3nq9p9	cmrpbrolu002f04ld1jou7dvp	2026-07-17 19:27:42.683	2026-07-17 19:27:42.683	\N
cmrpbya1n000w04jsnehnlf88	0	0	0	0	cmpcopzu6000004jro3prr7ca	cmrpbrolu002f04ld1jou7dvp	2026-07-17 19:27:42.683	2026-07-17 19:27:42.683	\N
cmrpbya1n000x04js7yzv6h8s	0	0	0	0	cmpefep0o000504laynrqmhnw	cmrpbrolu002f04ld1jou7dvp	2026-07-17 19:27:42.683	2026-07-17 19:27:42.683	\N
cmrpbya1n000y04js7h3ngi87	0	0	0	0	cmpcm7sgp000004l1fp9o52ky	cmrpbrolu002f04ld1jou7dvp	2026-07-17 19:27:42.683	2026-07-17 19:27:42.683	\N
cmt8rb19d000404jstqea2rnz	0	0	0	0	cmpdz2mcq000104jr9xnhl4i0	cmt0aw2dv000004jyn5mtmejp	2026-08-25 14:24:51.745	2026-08-25 14:24:51.745	\N
cmt8rb19d000504js0w7anwtm	0	0	0	0	cmpcsds4s000004jmgpwku1j2	cmt0aw2dv000004jyn5mtmejp	2026-08-25 14:24:51.745	2026-08-25 14:24:51.745	\N
cmt8rb19d000604js010l1goj	0	0	0	0	cmst61960000104jvfkkcgzp4	cmt0aw2dv000004jyn5mtmejp	2026-08-25 14:24:51.745	2026-08-25 14:24:51.745	\N
cmrql0svm000h04lapqvtm4b9	0	0	0	0	cmpcm7sgp000004l1fp9o52ky	cmrqkwrev000004jpjug6t8wd	2026-07-18 16:29:23.122	2026-07-18 16:29:23.122	\N
cmrql0svm000i04la5f1u2nfm	0	0	2	1	cmpcsds4s000004jmgpwku1j2	cmrqkwrev000004jpjug6t8wd	2026-07-18 16:29:23.122	2026-07-18 16:29:23.122	\N
cmt8rb19d000704jsq8v8deg5	0	0	0	0	cmpefep0o000504laynrqmhnw	cmt0aw2dv000004jyn5mtmejp	2026-08-25 14:24:51.745	2026-08-25 14:24:51.745	\N
cmt8rb19d000804js4624weax	0	0	0	0	cmpcpimjz000004jpcdqgfhfx	cmt0aw2dv000004jyn5mtmejp	2026-08-25 14:24:51.745	2026-08-25 14:24:51.745	\N
cmrqls7og000104laa28nkohs	0	0	0	0	\N	cmrqlng1w000004junomwb3sz	2026-07-18 16:50:42.016	2026-07-18 16:50:42.016	cmrqlopou000004laqlusx2d1
cmrqls7og000204la25oi9ivz	1	0	1	0	cmpcov8jd000004l8umh13pux	cmrqlng1w000004junomwb3sz	2026-07-18 16:50:42.016	2026-07-18 16:50:42.016	\N
cmrqls7og000304la1buykpqr	0	0	0	0	cmpefdukz000404lanevrsp34	cmrqlng1w000004junomwb3sz	2026-07-18 16:50:42.016	2026-07-18 16:50:42.016	\N
cmrqls7og000404la77so1043	0	0	0	0	cmph7s4ma000004l727k39xdv	cmrqlng1w000004junomwb3sz	2026-07-18 16:50:42.016	2026-07-18 16:50:42.016	\N
cmrqls7og000504lau8c0c830	0	0	0	0	cmpcsds4s000004jmgpwku1j2	cmrqlng1w000004junomwb3sz	2026-07-18 16:50:42.016	2026-07-18 16:50:42.016	\N
cmrqls7og000604la6xuymunl	0	0	0	0	cmpct94t9000204jsxeeckk3m	cmrqlng1w000004junomwb3sz	2026-07-18 16:50:42.016	2026-07-18 16:50:42.016	\N
cmrqls7og000704la0vitfcuo	0	0	0	0	cmpdz3jpw000004jvdohsd2ri	cmrqlng1w000004junomwb3sz	2026-07-18 16:50:42.016	2026-07-18 16:50:42.016	\N
cmrqls7og000804lasq3n9wrn	0	0	0	0	cmpefcd1z000004lasd2r1kdh	cmrqlng1w000004junomwb3sz	2026-07-18 16:50:42.016	2026-07-18 16:50:42.016	\N
cmrqls7og000904lacppemuro	0	0	0	0	cmpefcqj2000104ladlx0ysjz	cmrqlng1w000004junomwb3sz	2026-07-18 16:50:42.016	2026-07-18 16:50:42.016	\N
cmrqls7og000a04labuon3l2h	0	0	0	0	cmpefd4zq000204la3jqyndzz	cmrqlng1w000004junomwb3sz	2026-07-18 16:50:42.016	2026-07-18 16:50:42.016	\N
cmrqls7og000b04lacuhw7jtd	0	0	0	0	cmpct2xp7000004jsv1ujpe1r	cmrqlng1w000004junomwb3sz	2026-07-18 16:50:42.016	2026-07-18 16:50:42.016	\N
cmrqls7og000c04la5byf6ntu	0	0	0	0	cmpcpgupa000004l5ehnc0kjs	cmrqlng1w000004junomwb3sz	2026-07-18 16:50:42.016	2026-07-18 16:50:42.016	\N
cmrqls7og000d04la4h2tgbet	0	0	0	0	cmpcopzu6000004jro3prr7ca	cmrqlng1w000004junomwb3sz	2026-07-18 16:50:42.016	2026-07-18 16:50:42.016	\N
cmrqls7og000e04lanr7a3jza	0	0	0	0	cmpcm7sgp000004l1fp9o52ky	cmrqlng1w000004junomwb3sz	2026-07-18 16:50:42.016	2026-07-18 16:50:42.016	\N
cmrqls7og000f04lab7o746om	0	0	1	0	cmpcpimjz000004jpcdqgfhfx	cmrqlng1w000004junomwb3sz	2026-07-18 16:50:42.016	2026-07-18 16:50:42.016	\N
cmrqls7og000g04labiqcg2t5	0	0	1	0	cmpdz2mcq000104jr9xnhl4i0	cmrqlng1w000004junomwb3sz	2026-07-18 16:50:42.016	2026-07-18 16:50:42.016	\N
cmrqls7og000h04lamd5c8txs	0	0	0	1	cmpcsehq1000104ibueo8dlm5	cmrqlng1w000004junomwb3sz	2026-07-18 16:50:42.016	2026-07-18 16:50:42.016	\N
cmt8rb19d000904jshnwkec7i	0	0	0	0	cmpcoxez0000304l8g40zcfou	cmt0aw2dv000004jyn5mtmejp	2026-08-25 14:24:51.745	2026-08-25 14:24:51.745	\N
cmt8rb19d000a04jsl2z3a2zh	0	0	0	0	cmpcopzu6000004jro3prr7ca	cmt0aw2dv000004jyn5mtmejp	2026-08-25 14:24:51.745	2026-08-25 14:24:51.745	\N
cmt8rb19d000b04jsj9cdpuqm	0	0	0	0	cmpefcd1z000004lasd2r1kdh	cmt0aw2dv000004jyn5mtmejp	2026-08-25 14:24:51.745	2026-08-25 14:24:51.745	\N
cmt8rb19d000c04jssqxkyxbw	0	0	0	0	cmpcov8jd000004l8umh13pux	cmt0aw2dv000004jyn5mtmejp	2026-08-25 14:24:51.745	2026-08-25 14:24:51.745	\N
cmt8rb19d000d04jszou1pfya	0	0	0	0	cmpdz3jpw000004jvdohsd2ri	cmt0aw2dv000004jyn5mtmejp	2026-08-25 14:24:51.745	2026-08-25 14:24:51.745	\N
cmt8rb19d000e04jse9u2o60x	1	0	0	0	cmpefcqj2000104ladlx0ysjz	cmt0aw2dv000004jyn5mtmejp	2026-08-25 14:24:51.745	2026-08-25 14:24:51.745	\N
cmt8rb19x000f04jsvdglpo1n	0	0	0	0	cmpct94t9000204jsxeeckk3m	cmt0aw2dv000004jyn5mtmejp	2026-08-25 14:24:51.745	2026-08-25 14:24:51.745	\N
cmt8rb19x000g04jskv2atm5q	0	0	0	0	cmpcqf47m000004l85vce0gfh	cmt0aw2dv000004jyn5mtmejp	2026-08-25 14:24:51.745	2026-08-25 14:24:51.745	\N
cmt8rb19x000h04js2b5xc2vw	0	0	0	0	\N	cmt0aw2dv000004jyn5mtmejp	2026-08-25 14:24:51.745	2026-08-25 14:24:51.745	cmt5ve5xc000204juox35y5w2
cmrpch7kr000s04l9c47vfiro	2	2	1	0	cmpefcqj2000104ladlx0ysjz	cmrpcbynn003404ldris66yj1	2026-07-17 19:42:25.947	2026-07-17 19:42:25.947	\N
cmrpch7kr000t04l9pij2fnyb	2	1	0	0	cmpg43u13000604l7y6t0hdtt	cmrpcbynn003404ldris66yj1	2026-07-17 19:42:25.947	2026-07-17 19:42:25.947	\N
cmrpch7kr000u04l9toazpcmb	1	0	0	0	cmpdz2mcq000104jr9xnhl4i0	cmrpcbynn003404ldris66yj1	2026-07-17 19:42:25.947	2026-07-17 19:42:25.947	\N
cmrpch7kr000v04l95rsi025d	0	1	0	0	cmpg41k59000004l7521hfcn4	cmrpcbynn003404ldris66yj1	2026-07-17 19:42:25.947	2026-07-17 19:42:25.947	\N
cmrpch7kr000w04l9vegsjaug	0	0	0	0	cmpfk8v2v000704jlp8siky9e	cmrpcbynn003404ldris66yj1	2026-07-17 19:42:25.947	2026-07-17 19:42:25.947	\N
cmrpch7kr000x04l9zmuns7ca	0	0	0	0	cmpcpimjz000004jpcdqgfhfx	cmrpcbynn003404ldris66yj1	2026-07-17 19:42:25.947	2026-07-17 19:42:25.947	\N
cmrpch7kr000y04l9ee7qumlz	0	0	0	0	cmpcsds4s000004jmgpwku1j2	cmrpcbynn003404ldris66yj1	2026-07-17 19:42:25.947	2026-07-17 19:42:25.947	\N
cmrpch7kr000z04l93cdyxepn	0	0	0	0	cmpefcd1z000004lasd2r1kdh	cmrpcbynn003404ldris66yj1	2026-07-17 19:42:25.947	2026-07-17 19:42:25.947	\N
cmrpch7kr001004l93tvxzh03	0	0	0	0	cmpefd4zq000204la3jqyndzz	cmrpcbynn003404ldris66yj1	2026-07-17 19:42:25.947	2026-07-17 19:42:25.947	\N
cmrpch7kr001104l9u9mw9ym8	0	0	0	0	cmpefdkyx000304la3k3nq9p9	cmrpcbynn003404ldris66yj1	2026-07-17 19:42:25.947	2026-07-17 19:42:25.947	\N
cmrpch7kr001204l9p7ftozhr	0	0	1	0	cmpct94t9000204jsxeeckk3m	cmrpcbynn003404ldris66yj1	2026-07-17 19:42:25.947	2026-07-17 19:42:25.947	\N
cmrpch7kr001304l9orwuy6ky	0	0	1	0	cmpcpt3n6000004l561lm2ja7	cmrpcbynn003404ldris66yj1	2026-07-17 19:42:25.947	2026-07-17 19:42:25.947	\N
cmrpch7kr001404l92u8cy5rd	0	0	1	0	cmpefep0o000504laynrqmhnw	cmrpcbynn003404ldris66yj1	2026-07-17 19:42:25.947	2026-07-17 19:42:25.947	\N
cmrpch7kr001504l9opm28s1b	0	0	0	1	cmpcov8jd000004l8umh13pux	cmrpcbynn003404ldris66yj1	2026-07-17 19:42:25.947	2026-07-17 19:42:25.947	\N
cmrpch7kr001604l9kevxzf3a	0	0	0	0	cmpcm7sgp000004l1fp9o52ky	cmrpcbynn003404ldris66yj1	2026-07-17 19:42:25.947	2026-07-17 19:42:25.947	\N
cmt8rb19x000i04js90q1szsb	0	0	0	0	\N	cmt0aw2dv000004jyn5mtmejp	2026-08-25 14:24:51.745	2026-08-25 14:24:51.745	cmt5zopwv000004jufwc47pxw
cmt8rb19x000j04js93u70fy6	0	0	0	0	\N	cmt0aw2dv000004jyn5mtmejp	2026-08-25 14:24:51.745	2026-08-25 14:24:51.745	cmt5zpeyn000104ju3scdov2h
cmt8rb19x000k04jsz3adtl7r	0	0	0	0	\N	cmt0aw2dv000004jyn5mtmejp	2026-08-25 14:24:51.745	2026-08-25 14:24:51.745	cmt55yeme000204jq2ea6h0tu
cmt8rb19x000l04jso3nd1rlb	0	0	0	0	\N	cmt0aw2dv000004jyn5mtmejp	2026-08-25 14:24:51.745	2026-08-25 14:24:51.745	cmt5vj0a7000004jv02xu8nzj
cmt8rb19x000m04jspfvpvck9	0	0	0	0	\N	cmt0aw2dv000004jyn5mtmejp	2026-08-25 14:24:51.745	2026-08-25 14:24:51.745	cmt5zozbq000004l3sl8s7mv0
cmt8rb19x000n04jsqymhuv4e	1	0	0	0	\N	cmt0aw2dv000004jyn5mtmejp	2026-08-25 14:24:51.745	2026-08-25 14:24:51.745	cmt5vz0k9000004ldxwbo68sq
cmrqlg0pv000004l97pnhj5sp	1	0	0	0	cmpefcqj2000104ladlx0ysjz	cmrqld3kq000p04jp208zp47h	2026-07-18 16:41:13.123	2026-07-18 16:41:13.123	\N
cmrqlg0pw000104l9eqv76it2	2	0	0	0	cmpefd4zq000204la3jqyndzz	cmrqld3kq000p04jp208zp47h	2026-07-18 16:41:13.123	2026-07-18 16:41:13.123	\N
cmrqlg0pw000204l9vc0meysu	0	0	0	0	cmpg41k59000004l7521hfcn4	cmrqld3kq000p04jp208zp47h	2026-07-18 16:41:13.123	2026-07-18 16:41:13.123	\N
cmrqlg0pw000304l9csgjpcbx	0	0	0	0	cmpfk8v2v000704jlp8siky9e	cmrqld3kq000p04jp208zp47h	2026-07-18 16:41:13.123	2026-07-18 16:41:13.123	\N
cmrqlg0pw000404l974ondsr2	0	0	0	0	cmpcpimjz000004jpcdqgfhfx	cmrqld3kq000p04jp208zp47h	2026-07-18 16:41:13.123	2026-07-18 16:41:13.123	\N
cmrqlg0pw000504l9smw5x3rb	0	0	0	0	cmph7s4ma000004l727k39xdv	cmrqld3kq000p04jp208zp47h	2026-07-18 16:41:13.123	2026-07-18 16:41:13.123	\N
cmrqlg0pw000604l97v2r05x2	0	0	0	0	cmpcsds4s000004jmgpwku1j2	cmrqld3kq000p04jp208zp47h	2026-07-18 16:41:13.123	2026-07-18 16:41:13.123	\N
cmrqlg0pw000704l925r1n456	0	0	0	0	cmpct94t9000204jsxeeckk3m	cmrqld3kq000p04jp208zp47h	2026-07-18 16:41:13.123	2026-07-18 16:41:13.123	\N
cmrqlg0pw000804l9ebp385bn	0	0	0	0	cmpefcd1z000004lasd2r1kdh	cmrqld3kq000p04jp208zp47h	2026-07-18 16:41:13.123	2026-07-18 16:41:13.123	\N
cmrqlg0pw000904l9khb83v2q	0	0	0	0	cmpcpt3n6000004l561lm2ja7	cmrqld3kq000p04jp208zp47h	2026-07-18 16:41:13.123	2026-07-18 16:41:13.123	\N
cmrqlg0pw000a04l9quzg7z0q	0	0	0	0	cmpdz2mcq000104jr9xnhl4i0	cmrqld3kq000p04jp208zp47h	2026-07-18 16:41:13.123	2026-07-18 16:41:13.123	\N
cmrqlg0pw000b04l97x2g43ra	0	0	0	0	cmpcov8jd000004l8umh13pux	cmrqld3kq000p04jp208zp47h	2026-07-18 16:41:13.123	2026-07-18 16:41:13.123	\N
cmrqlg0pw000c04l9ncs147hs	0	0	0	0	cmpcsehq1000104ibueo8dlm5	cmrqld3kq000p04jp208zp47h	2026-07-18 16:41:13.123	2026-07-18 16:41:13.123	\N
cmrqlg0pw000d04l9q79zngv9	0	0	0	0	cmpcpgupa000004l5ehnc0kjs	cmrqld3kq000p04jp208zp47h	2026-07-18 16:41:13.123	2026-07-18 16:41:13.123	\N
cmrqlg0pw000e04l9kzvvkvjf	0	0	0	0	cmpefdukz000404lanevrsp34	cmrqld3kq000p04jp208zp47h	2026-07-18 16:41:13.123	2026-07-18 16:41:13.123	\N
cmrqlg0pw000f04l96ime2mvk	0	0	0	0	cmpefdkyx000304la3k3nq9p9	cmrqld3kq000p04jp208zp47h	2026-07-18 16:41:13.123	2026-07-18 16:41:13.123	\N
cmrqlg0pw000g04l9kaymvtl7	0	0	0	0	cmpcopzu6000004jro3prr7ca	cmrqld3kq000p04jp208zp47h	2026-07-18 16:41:13.123	2026-07-18 16:41:13.123	\N
cmrqlg0pw000h04l9782bo3ev	0	0	0	0	cmpefep0o000504laynrqmhnw	cmrqld3kq000p04jp208zp47h	2026-07-18 16:41:13.123	2026-07-18 16:41:13.123	\N
cmrqlg0pw000i04l9xzmpqh7x	0	0	0	0	cmpcm7sgp000004l1fp9o52ky	cmrqld3kq000p04jp208zp47h	2026-07-18 16:41:13.123	2026-07-18 16:41:13.123	\N
cmrru64xl000004jyctzmrnk9	0	0	0	0	cmpcm7sgp000004l1fp9o52ky	cmqp5jh8b000004jp8k1q116l	2026-07-19 13:33:14.745	2026-07-19 13:33:14.745	\N
cmrru64xl000104jyz3uueril	0	0	0	0	cmpn1o6et000004jrcnmw0gav	cmqp5jh8b000004jp8k1q116l	2026-07-19 13:33:14.745	2026-07-19 13:33:14.745	\N
cmrru64xl000204jyf3xap1cz	1	0	0	0	cmpcopzu6000004jro3prr7ca	cmqp5jh8b000004jp8k1q116l	2026-07-19 13:33:14.745	2026-07-19 13:33:14.745	\N
cmrru64xl000304jy3ys3owcg	0	0	0	0	cmpcpimjz000004jpcdqgfhfx	cmqp5jh8b000004jp8k1q116l	2026-07-19 13:33:14.745	2026-07-19 13:33:14.745	\N
cmrru64xl000404jylveqeduf	0	0	0	0	cmpcsds4s000004jmgpwku1j2	cmqp5jh8b000004jp8k1q116l	2026-07-19 13:33:14.745	2026-07-19 13:33:14.745	\N
cmrru64xl000504jyilw4vnha	0	0	0	0	cmpdz2mcq000104jr9xnhl4i0	cmqp5jh8b000004jp8k1q116l	2026-07-19 13:33:14.745	2026-07-19 13:33:14.745	\N
cmrru64xl000604jy9fbb9m5u	1	0	0	0	cmpefcqj2000104ladlx0ysjz	cmqp5jh8b000004jp8k1q116l	2026-07-19 13:33:14.745	2026-07-19 13:33:14.745	\N
cmrru64xl000704jy7mcmqd9m	0	0	0	0	cmpcoxez0000304l8g40zcfou	cmqp5jh8b000004jp8k1q116l	2026-07-19 13:33:14.745	2026-07-19 13:33:14.745	\N
cmrru64xm000804jyfspr1mwd	0	0	0	0	cmrozuqv4000104l5tbza8qgy	cmqp5jh8b000004jp8k1q116l	2026-07-19 13:33:14.745	2026-07-19 13:33:14.745	\N
cmrru64xm000904jyrj1ibg1t	0	0	0	0	cmpcqf47m000004l85vce0gfh	cmqp5jh8b000004jp8k1q116l	2026-07-19 13:33:14.745	2026-07-19 13:33:14.745	\N
cmrru64xm000a04jymcoypgks	0	1	0	0	\N	cmqp5jh8b000004jp8k1q116l	2026-07-19 13:33:14.745	2026-07-19 13:33:14.745	cmrquvpyi000004l7unpqoe7j
cmt8rb19x000o04jssovdyxq8	1	0	0	0	cmpfk8v2v000704jlp8siky9e	cmt0aw2dv000004jyn5mtmejp	2026-08-25 14:24:51.745	2026-08-25 14:24:51.745	\N
cmrxlqdt4000004l1k6q1m6z0	1	0	0	0	cmpcm7sgp000004l1fp9o52ky	cmrkxlng5000004jofpanlfev	2026-07-23 14:23:39.88	2026-07-23 14:23:39.88	\N
cmrxlqdt4000104l1h0wockps	0	0	0	0	cmpcopzu6000004jro3prr7ca	cmrkxlng5000004jofpanlfev	2026-07-23 14:23:39.88	2026-07-23 14:23:39.88	\N
cmrxlqdt4000204l16whw0lnd	0	0	0	0	cmpcqf47m000004l85vce0gfh	cmrkxlng5000004jofpanlfev	2026-07-23 14:23:39.88	2026-07-23 14:23:39.88	\N
cmrxlqdt4000304l14cymxgju	0	1	0	0	cmpcpimjz000004jpcdqgfhfx	cmrkxlng5000004jofpanlfev	2026-07-23 14:23:39.88	2026-07-23 14:23:39.88	\N
cmrxlqdt4000404l1a7iofj4w	0	0	0	0	cmpefdkyx000304la3k3nq9p9	cmrkxlng5000004jofpanlfev	2026-07-23 14:23:39.88	2026-07-23 14:23:39.88	\N
cmrxlqdt4000504l1smuv4npe	0	0	0	0	cmpefcqj2000104ladlx0ysjz	cmrkxlng5000004jofpanlfev	2026-07-23 14:23:39.88	2026-07-23 14:23:39.88	\N
cmrxlqdt4000604l1zxeh6j7j	0	0	0	0	cmpefcd1z000004lasd2r1kdh	cmrkxlng5000004jofpanlfev	2026-07-23 14:23:39.88	2026-07-23 14:23:39.88	\N
cmrxlqdt4000704l137ulv8fa	0	0	0	0	cmpn1o6et000004jrcnmw0gav	cmrkxlng5000004jofpanlfev	2026-07-23 14:23:39.88	2026-07-23 14:23:39.88	\N
cmrxlqdt4000804l1ggikevdy	0	0	0	0	cmpct94t9000204jsxeeckk3m	cmrkxlng5000004jofpanlfev	2026-07-23 14:23:39.88	2026-07-23 14:23:39.88	\N
cmrxlqdt4000904l1qcwm8z0k	0	0	0	1	cmpdz2mcq000104jr9xnhl4i0	cmrkxlng5000004jofpanlfev	2026-07-23 14:23:39.88	2026-07-23 14:23:39.88	\N
cmrxlqdt4000a04l10lfn5ues	0	0	2	1	cmpcsds4s000004jmgpwku1j2	cmrkxlng5000004jofpanlfev	2026-07-23 14:23:39.88	2026-07-23 14:23:39.88	\N
cmrxlqdt4000b04l1h40xmsr5	0	0	0	0	cmpfk8v2v000704jlp8siky9e	cmrkxlng5000004jofpanlfev	2026-07-23 14:23:39.88	2026-07-23 14:23:39.88	\N
cmrxlqdt4000c04l1kruk5cjb	0	0	0	0	cmrozuqv4000104l5tbza8qgy	cmrkxlng5000004jofpanlfev	2026-07-23 14:23:39.88	2026-07-23 14:23:39.88	\N
cmrxlqe1u000q04l13mqk4kdb	0	0	0	0	cmpcpt3n6000004l561lm2ja7	cmrkxlng5000004jofpanlfev	2026-07-23 14:23:40.194	2026-07-23 14:23:40.194	\N
cmrxlqe1u000r04l1cl0o43n9	0	0	0	0	cmpefep0o000504laynrqmhnw	cmrkxlng5000004jofpanlfev	2026-07-23 14:23:40.194	2026-07-23 14:23:40.194	\N
cms38y4qe000004juvqmaoygv	1	0	0	0	cmpn1o6et000004jrcnmw0gav	cmrthsbf6000004kybfhn32yj	2026-07-27 13:12:23.414	2026-07-27 13:12:23.414	\N
cms38y4qe000104juqyb1vlq3	0	0	0	0	cmpcm7sgp000004l1fp9o52ky	cmrthsbf6000004kybfhn32yj	2026-07-27 13:12:23.414	2026-07-27 13:12:23.414	\N
cms38y4qe000204ju9t0hbexp	0	0	0	0	cmpefdkyx000304la3k3nq9p9	cmrthsbf6000004kybfhn32yj	2026-07-27 13:12:23.414	2026-07-27 13:12:23.414	\N
cms38y4qe000304ju850kk49d	0	0	0	0	cmpcqf47m000004l85vce0gfh	cmrthsbf6000004kybfhn32yj	2026-07-27 13:12:23.414	2026-07-27 13:12:23.414	\N
cms38y4qe000404jusnuoa3uf	0	0	0	0	cmpcpt3n6000004l561lm2ja7	cmrthsbf6000004kybfhn32yj	2026-07-27 13:12:23.414	2026-07-27 13:12:23.414	\N
cms38y4qe000504ju997h3dq0	1	0	0	0	cmpdz2mcq000104jr9xnhl4i0	cmrthsbf6000004kybfhn32yj	2026-07-27 13:12:23.414	2026-07-27 13:12:23.414	\N
cms38y4qe000604jurtrj24i6	1	0	0	0	cmph7t8a1000004l9n8uic25p	cmrthsbf6000004kybfhn32yj	2026-07-27 13:12:23.414	2026-07-27 13:12:23.414	\N
cms38y4qe000704jud0s4weyj	0	1	1	0	cmpcpimjz000004jpcdqgfhfx	cmrthsbf6000004kybfhn32yj	2026-07-27 13:12:23.414	2026-07-27 13:12:23.414	\N
cms38y4qe000804juvggflav6	0	0	0	0	cmpct94t9000204jsxeeckk3m	cmrthsbf6000004kybfhn32yj	2026-07-27 13:12:23.414	2026-07-27 13:12:23.414	\N
cms38y4qe000904jufxhhw1z4	0	1	1	0	cmpefcqj2000104ladlx0ysjz	cmrthsbf6000004kybfhn32yj	2026-07-27 13:12:23.414	2026-07-27 13:12:23.414	\N
cms38y4qe000a04juajoum8fm	0	0	0	0	cmpcopzu6000004jro3prr7ca	cmrthsbf6000004kybfhn32yj	2026-07-27 13:12:23.414	2026-07-27 13:12:23.414	\N
cms38y4qe000b04juiul6rmr9	0	0	0	0	\N	cmrthsbf6000004kybfhn32yj	2026-07-27 13:12:23.414	2026-07-27 13:12:23.414	cmrzexgp2000004l78kqxjk6i
cms38y4qe000c04juuq0j7f0l	0	0	0	0	\N	cmrthsbf6000004kybfhn32yj	2026-07-27 13:12:23.414	2026-07-27 13:12:23.414	cmrzexwwc000004jswbo5x3tv
cms38y4qe000d04ju2nmdgwma	0	0	0	0	\N	cmrthsbf6000004kybfhn32yj	2026-07-27 13:12:23.414	2026-07-27 13:12:23.414	cmrzf5nhj000004ktc5cfdvhn
cms38y4qe000e04ju8qx7em61	0	0	0	0	\N	cmrthsbf6000004kybfhn32yj	2026-07-27 13:12:23.414	2026-07-27 13:12:23.414	cms0jkysa000004l1f4w2tuwg
cms38y4qe000f04ju6tkkznf2	0	0	0	0	\N	cmrthsbf6000004kybfhn32yj	2026-07-27 13:12:23.414	2026-07-27 13:12:23.414	cms38trc5000004jxs9a018ai
cms39377e000004l4wgw3xj9v	0	0	0	0	cmpg41k59000004l7521hfcn4	cms390n9w000t04jol6dfwp3s	2026-07-27 13:16:19.898	2026-07-27 13:16:19.898	\N
cms39377e000104l4b55w3se7	0	0	0	0	cmpfk8v2v000704jlp8siky9e	cms390n9w000t04jol6dfwp3s	2026-07-27 13:16:19.898	2026-07-27 13:16:19.898	\N
cms39377e000204l4p9x4dmu4	0	0	0	0	cmpcpimjz000004jpcdqgfhfx	cms390n9w000t04jol6dfwp3s	2026-07-27 13:16:19.898	2026-07-27 13:16:19.898	\N
cms39377e000304l4xxswio3d	0	0	0	0	cmpcsds4s000004jmgpwku1j2	cms390n9w000t04jol6dfwp3s	2026-07-27 13:16:19.898	2026-07-27 13:16:19.898	\N
cms39377e000404l4ki4rhrs9	0	0	0	0	cmpct94t9000204jsxeeckk3m	cms390n9w000t04jol6dfwp3s	2026-07-27 13:16:19.898	2026-07-27 13:16:19.898	\N
cms39377e000504l4nrjbwz85	0	0	0	0	cmpdz3jpw000004jvdohsd2ri	cms390n9w000t04jol6dfwp3s	2026-07-27 13:16:19.898	2026-07-27 13:16:19.898	\N
cms39377e000604l4n8xo1db2	0	0	0	0	cmpefcd1z000004lasd2r1kdh	cms390n9w000t04jol6dfwp3s	2026-07-27 13:16:19.898	2026-07-27 13:16:19.898	\N
cms39377e000704l4y8onxh2e	0	0	0	0	cmpefcqj2000104ladlx0ysjz	cms390n9w000t04jol6dfwp3s	2026-07-27 13:16:19.898	2026-07-27 13:16:19.898	\N
cms39377e000804l4sik0c61c	0	0	0	0	cmpcqf47m000004l85vce0gfh	cms390n9w000t04jol6dfwp3s	2026-07-27 13:16:19.898	2026-07-27 13:16:19.898	\N
cms39377e000904l4996xqegt	0	0	0	0	cmpefd4zq000204la3jqyndzz	cms390n9w000t04jol6dfwp3s	2026-07-27 13:16:19.898	2026-07-27 13:16:19.898	\N
cms39377e000a04l433th6t3z	0	0	0	0	cmpcsehq1000104ibueo8dlm5	cms390n9w000t04jol6dfwp3s	2026-07-27 13:16:19.898	2026-07-27 13:16:19.898	\N
cms39377e000b04l4uj2qxq3w	0	0	0	0	cmpcpgupa000004l5ehnc0kjs	cms390n9w000t04jol6dfwp3s	2026-07-27 13:16:19.898	2026-07-27 13:16:19.898	\N
cms39377f000c04l4pw3yjzte	0	0	0	0	cmpefdkyx000304la3k3nq9p9	cms390n9w000t04jol6dfwp3s	2026-07-27 13:16:19.898	2026-07-27 13:16:19.898	\N
cms39377f000d04l4ggvofay4	0	0	0	0	cmpcopzu6000004jro3prr7ca	cms390n9w000t04jol6dfwp3s	2026-07-27 13:16:19.898	2026-07-27 13:16:19.898	\N
cms39377f000e04l4g1n64ljm	0	0	0	0	cmpcm7sgp000004l1fp9o52ky	cms390n9w000t04jol6dfwp3s	2026-07-27 13:16:19.898	2026-07-27 13:16:19.898	\N
cms6wsb4w000004ifuji4rwmq	0	0	0	0	cmpcm7sgp000004l1fp9o52ky	cms3d5vfv000004jxuwwehm57	2026-07-30 02:43:01.088	2026-07-30 02:43:01.088	\N
cms6wsb4w000104ifs9oz38y8	1	0	0	1	cmpdz2mcq000104jr9xnhl4i0	cms3d5vfv000004jxuwwehm57	2026-07-30 02:43:01.088	2026-07-30 02:43:01.088	\N
cms6wsb4w000204ifaenytb2e	0	0	0	0	cmpefdkyx000304la3k3nq9p9	cms3d5vfv000004jxuwwehm57	2026-07-30 02:43:01.088	2026-07-30 02:43:01.088	\N
cms6wsb4w000304ifpr8q1kv5	0	0	0	0	cmpefep0o000504laynrqmhnw	cms3d5vfv000004jxuwwehm57	2026-07-30 02:43:01.088	2026-07-30 02:43:01.088	\N
cms6wsb4w000404ifshgimc2b	0	0	0	0	cmpdz3jpw000004jvdohsd2ri	cms3d5vfv000004jxuwwehm57	2026-07-30 02:43:01.088	2026-07-30 02:43:01.088	\N
cms6wsb59000504ify5aqnj4l	0	0	0	0	cmph7t8a1000004l9n8uic25p	cms3d5vfv000004jxuwwehm57	2026-07-30 02:43:01.088	2026-07-30 02:43:01.088	\N
cms6wsb59000604ifcpzn2pj4	0	0	0	0	cmpcpt3n6000004l561lm2ja7	cms3d5vfv000004jxuwwehm57	2026-07-30 02:43:01.088	2026-07-30 02:43:01.088	\N
cms6wsb59000704ifdchkc6ty	0	0	0	0	cmpct2xp7000004jsv1ujpe1r	cms3d5vfv000004jxuwwehm57	2026-07-30 02:43:01.088	2026-07-30 02:43:01.088	\N
cms6wsb59000804ifqhlygupo	0	0	0	0	cmrozuqv4000104l5tbza8qgy	cms3d5vfv000004jxuwwehm57	2026-07-30 02:43:01.088	2026-07-30 02:43:01.088	\N
cms6wsb59000904ify68vtl1b	0	0	0	0	cmpcqf47m000004l85vce0gfh	cms3d5vfv000004jxuwwehm57	2026-07-30 02:43:01.088	2026-07-30 02:43:01.088	\N
cms6wsb59000a04iflqp7s0so	0	0	1	0	cmpcov8jd000004l8umh13pux	cms3d5vfv000004jxuwwehm57	2026-07-30 02:43:01.088	2026-07-30 02:43:01.088	\N
cms6wsb59000b04ifpkvycx84	0	0	0	0	cmpefcd1z000004lasd2r1kdh	cms3d5vfv000004jxuwwehm57	2026-07-30 02:43:01.088	2026-07-30 02:43:01.088	\N
cms6wsb59000c04ifa1va4gzb	0	0	1	0	cmpct94t9000204jsxeeckk3m	cms3d5vfv000004jxuwwehm57	2026-07-30 02:43:01.088	2026-07-30 02:43:01.088	\N
cms6wsb59000d04ifkgziv9ho	0	0	0	0	cmpefcqj2000104ladlx0ysjz	cms3d5vfv000004jxuwwehm57	2026-07-30 02:43:01.088	2026-07-30 02:43:01.088	\N
cms6wsb59000e04ifc20nuz7q	0	0	1	0	cmpn1o6et000004jrcnmw0gav	cms3d5vfv000004jxuwwehm57	2026-07-30 02:43:01.088	2026-07-30 02:43:01.088	\N
cms6wsb59000f04ifx6b0u9p9	0	0	0	0	cmpcpimjz000004jpcdqgfhfx	cms3d5vfv000004jxuwwehm57	2026-07-30 02:43:01.088	2026-07-30 02:43:01.088	\N
cms6wsb59000g04if3rbavg49	0	0	0	0	cmpcopzu6000004jro3prr7ca	cms3d5vfv000004jxuwwehm57	2026-07-30 02:43:01.088	2026-07-30 02:43:01.088	\N
cms9np447000204l13v32b4ss	0	0	0	0	cmpefcd1z000004lasd2r1kdh	cmrpgk0qh000004jttg2q1s11	2026-08-01 00:51:54.007	2026-08-01 00:51:54.007	\N
cms9np447000304l18trri75i	0	0	0	0	cmpcqf47m000004l85vce0gfh	cmrpgk0qh000004jttg2q1s11	2026-08-01 00:51:54.007	2026-08-01 00:51:54.007	\N
cms9np447000404l1e5jph6j9	0	0	0	0	cmpcm7sgp000004l1fp9o52ky	cmrpgk0qh000004jttg2q1s11	2026-08-01 00:51:54.007	2026-08-01 00:51:54.007	\N
cms9np447000504l1g2ayb6t6	0	0	0	0	cmpcoxez0000304l8g40zcfou	cmrpgk0qh000004jttg2q1s11	2026-08-01 00:51:54.007	2026-08-01 00:51:54.007	\N
cms9np447000604l1z6puljjp	0	0	0	0	cmpcopzu6000004jro3prr7ca	cmrpgk0qh000004jttg2q1s11	2026-08-01 00:51:54.007	2026-08-01 00:51:54.007	\N
cms9np447000704l1f6duinpd	0	0	0	0	cmpcsehq1000104ibueo8dlm5	cmrpgk0qh000004jttg2q1s11	2026-08-01 00:51:54.007	2026-08-01 00:51:54.007	\N
cms9np447000804l1bi2ex5e8	0	0	0	0	cmpcpt3n6000004l561lm2ja7	cmrpgk0qh000004jttg2q1s11	2026-08-01 00:51:54.007	2026-08-01 00:51:54.007	\N
cms9np447000904l1ancan3lp	1	0	0	0	cmpefcqj2000104ladlx0ysjz	cmrpgk0qh000004jttg2q1s11	2026-08-01 00:51:54.007	2026-08-01 00:51:54.007	\N
cms9np447000a04l1xnvcbkek	1	0	0	0	cmpn1o6et000004jrcnmw0gav	cmrpgk0qh000004jttg2q1s11	2026-08-01 00:51:54.007	2026-08-01 00:51:54.007	\N
cms9np447000b04l1aozvvjek	0	0	0	0	cmpcpimjz000004jpcdqgfhfx	cmrpgk0qh000004jttg2q1s11	2026-08-01 00:51:54.007	2026-08-01 00:51:54.007	\N
cms9np447000c04l1e4onub9a	0	0	1	0	cmpefdkyx000304la3k3nq9p9	cmrpgk0qh000004jttg2q1s11	2026-08-01 00:51:54.007	2026-08-01 00:51:54.007	\N
cmshmxhu8000004l9chky0apx	1	0	0	0	cmpcopzu6000004jro3prr7ca	cmsadtjr8000004joiy5e4pc7	2026-08-06 14:52:34.833	2026-08-06 14:52:34.833	\N
cmshmxhu9000104l9vdxzel2d	0	0	1	0	cmpcpimjz000004jpcdqgfhfx	cmsadtjr8000004joiy5e4pc7	2026-08-06 14:52:34.833	2026-08-06 14:52:34.833	\N
cmshmxhu9000204l90pe9jsx6	0	0	0	0	cmpefcqj2000104ladlx0ysjz	cmsadtjr8000004joiy5e4pc7	2026-08-06 14:52:34.833	2026-08-06 14:52:34.833	\N
cmshmxhu9000304l9qyj4fmz0	0	0	0	0	cmpcpt3n6000004l561lm2ja7	cmsadtjr8000004joiy5e4pc7	2026-08-06 14:52:34.833	2026-08-06 14:52:34.833	\N
cmshmxhu9000404l9lpwmdzme	0	0	0	0	cmpcsehq1000104ibueo8dlm5	cmsadtjr8000004joiy5e4pc7	2026-08-06 14:52:34.833	2026-08-06 14:52:34.833	\N
cmshmxhu9000504l948571sip	0	0	0	0	cmpcm7sgp000004l1fp9o52ky	cmsadtjr8000004joiy5e4pc7	2026-08-06 14:52:34.833	2026-08-06 14:52:34.833	\N
cmshmxhu9000604l9wx12hc2n	0	0	0	0	cmpefcd1z000004lasd2r1kdh	cmsadtjr8000004joiy5e4pc7	2026-08-06 14:52:34.833	2026-08-06 14:52:34.833	\N
cmshmxhu9000704l97oc2fcyp	0	0	0	0	cmpct2xp7000004jsv1ujpe1r	cmsadtjr8000004joiy5e4pc7	2026-08-06 14:52:34.833	2026-08-06 14:52:34.833	\N
cmshmxhu9000804l97rl0vj62	0	0	0	0	cmpdz3jpw000004jvdohsd2ri	cmsadtjr8000004joiy5e4pc7	2026-08-06 14:52:34.833	2026-08-06 14:52:34.833	\N
cmshmxhu9000904l9315yfy21	0	0	0	0	cmpct94t9000204jsxeeckk3m	cmsadtjr8000004joiy5e4pc7	2026-08-06 14:52:34.833	2026-08-06 14:52:34.833	\N
cmshmxhu9000a04l9an9ezt6f	0	0	0	0	cmpefep0o000504laynrqmhnw	cmsadtjr8000004joiy5e4pc7	2026-08-06 14:52:34.833	2026-08-06 14:52:34.833	\N
cmshmxhu9000b04l9g6p8m3fd	0	0	1	0	cmpn1o6et000004jrcnmw0gav	cmsadtjr8000004joiy5e4pc7	2026-08-06 14:52:34.833	2026-08-06 14:52:34.833	\N
cmshmxhu9000c04l9cfvix55a	0	0	0	0	cmpfk8v2v000704jlp8siky9e	cmsadtjr8000004joiy5e4pc7	2026-08-06 14:52:34.833	2026-08-06 14:52:34.833	\N
cmshmxhu9000d04l9zhi5gcsq	0	0	0	0	cmpcsds4s000004jmgpwku1j2	cmsadtjr8000004joiy5e4pc7	2026-08-06 14:52:34.833	2026-08-06 14:52:34.833	\N
cmshmxhu9000e04l9f1jn1ydb	0	0	0	0	\N	cmsadtjr8000004joiy5e4pc7	2026-08-06 14:52:34.833	2026-08-06 14:52:34.833	cmsc66qh4000004kvzi0f1rz3
cmshmxhu9000f04l9srf4w2pd	1	0	0	0	cmpdz2mcq000104jr9xnhl4i0	cmsadtjr8000004joiy5e4pc7	2026-08-06 14:52:34.833	2026-08-06 14:52:34.833	\N
cmshmxhu9000g04l9qyrxqy58	0	0	0	0	cmsd6v73x000004jupd8tbvon	cmsadtjr8000004joiy5e4pc7	2026-08-06 14:52:34.833	2026-08-06 14:52:34.833	\N
cmskuk8na000004i8wmscokut	0	0	0	0	cmpefdkyx000304la3k3nq9p9	cmpg3u3kh000l04la6hj2e5r3	2026-08-08 20:49:31.846	2026-08-08 20:49:31.846	\N
cmskuk8na000104i8fouxt57g	0	0	0	0	cmpcm7sgp000004l1fp9o52ky	cmpg3u3kh000l04la6hj2e5r3	2026-08-08 20:49:31.846	2026-08-08 20:49:31.846	\N
cmskuk8na000204i8x9rtkxss	0	0	0	0	cmpdz3jpw000004jvdohsd2ri	cmpg3u3kh000l04la6hj2e5r3	2026-08-08 20:49:31.846	2026-08-08 20:49:31.846	\N
cmskuk8na000304i8byynhbbp	0	0	0	0	cmpefep0o000504laynrqmhnw	cmpg3u3kh000l04la6hj2e5r3	2026-08-08 20:49:31.846	2026-08-08 20:49:31.846	\N
cmskuk8na000404i8qsqroj5y	0	0	0	0	cmpefcd1z000004lasd2r1kdh	cmpg3u3kh000l04la6hj2e5r3	2026-08-08 20:49:31.846	2026-08-08 20:49:31.846	\N
cmskuk8na000504i82kmlunhb	0	0	0	0	cmpcpimjz000004jpcdqgfhfx	cmpg3u3kh000l04la6hj2e5r3	2026-08-08 20:49:31.846	2026-08-08 20:49:31.846	\N
cmskuk8na000604i8w6sa63x0	0	0	0	0	cmpcsehq1000104ibueo8dlm5	cmpg3u3kh000l04la6hj2e5r3	2026-08-08 20:49:31.846	2026-08-08 20:49:31.846	\N
cmskuk8na000704i84qhyiisy	0	0	0	0	cmpdz2mcq000104jr9xnhl4i0	cmpg3u3kh000l04la6hj2e5r3	2026-08-08 20:49:31.846	2026-08-08 20:49:31.846	\N
cmskuk8na000804i8abmhbo1f	0	0	0	0	cmpct94t9000204jsxeeckk3m	cmpg3u3kh000l04la6hj2e5r3	2026-08-08 20:49:31.846	2026-08-08 20:49:31.846	\N
cmskuk8na000904i8n8vsc2tq	0	0	0	0	cmpefcqj2000104ladlx0ysjz	cmpg3u3kh000l04la6hj2e5r3	2026-08-08 20:49:31.846	2026-08-08 20:49:31.846	\N
cmskuk8na000a04i83ik76jaa	0	0	0	0	cmpct2xp7000004jsv1ujpe1r	cmpg3u3kh000l04la6hj2e5r3	2026-08-08 20:49:31.846	2026-08-08 20:49:31.846	\N
cmskuk8na000b04i8767sqc1u	0	0	0	0	cmpn1o6et000004jrcnmw0gav	cmpg3u3kh000l04la6hj2e5r3	2026-08-08 20:49:31.846	2026-08-08 20:49:31.846	\N
cmskuk8na000c04i8n5ruamic	0	0	0	0	cmrozuqv4000104l5tbza8qgy	cmpg3u3kh000l04la6hj2e5r3	2026-08-08 20:49:31.846	2026-08-08 20:49:31.846	\N
cmskuk8na000d04i85q4332nh	0	0	0	0	cmpcoxez0000304l8g40zcfou	cmpg3u3kh000l04la6hj2e5r3	2026-08-08 20:49:31.846	2026-08-08 20:49:31.846	\N
cmskuk8na000e04i86aqbhpvp	0	0	0	0	cmpcpt3n6000004l561lm2ja7	cmpg3u3kh000l04la6hj2e5r3	2026-08-08 20:49:31.846	2026-08-08 20:49:31.846	\N
cmskuk8na000f04i8a48kz0zs	0	0	0	0	cmsd6v73x000004jupd8tbvon	cmpg3u3kh000l04la6hj2e5r3	2026-08-08 20:49:31.846	2026-08-08 20:49:31.846	\N
cmskuk8na000g04i897w2uwji	0	0	0	0	cmpcsds4s000004jmgpwku1j2	cmpg3u3kh000l04la6hj2e5r3	2026-08-08 20:49:31.846	2026-08-08 20:49:31.846	\N
cmsugs29x000204jxu36uonua	1	0	1	0	cmpefcqj2000104ladlx0ysjz	cmsnjw3d4000004l73omej79w	2026-08-15 14:21:23.973	2026-08-15 14:21:23.973	\N
cmsugs29x000304jxvp4s3mkj	0	0	0	0	cmpfk8v2v000704jlp8siky9e	cmsnjw3d4000004l73omej79w	2026-08-15 14:21:23.973	2026-08-15 14:21:23.973	\N
cmsugs29x000404jx1mtoc7vl	0	0	0	0	cmpn1o6et000004jrcnmw0gav	cmsnjw3d4000004l73omej79w	2026-08-15 14:21:23.973	2026-08-15 14:21:23.973	\N
cmsugs29x000504jxp7ve9esj	0	0	0	0	cmpcoxez0000304l8g40zcfou	cmsnjw3d4000004l73omej79w	2026-08-15 14:21:23.973	2026-08-15 14:21:23.973	\N
cmsugs29x000604jx26a0y2ma	0	0	0	0	cmpefdkyx000304la3k3nq9p9	cmsnjw3d4000004l73omej79w	2026-08-15 14:21:23.973	2026-08-15 14:21:23.973	\N
cmsugs29x000704jxn7871acj	0	0	0	0	cmpcpimjz000004jpcdqgfhfx	cmsnjw3d4000004l73omej79w	2026-08-15 14:21:23.973	2026-08-15 14:21:23.973	\N
cmsugs29x000804jx9vdwyhu7	0	0	0	0	cmpcsds4s000004jmgpwku1j2	cmsnjw3d4000004l73omej79w	2026-08-15 14:21:23.973	2026-08-15 14:21:23.973	\N
cmsugs29x000904jxojaeqg0f	0	0	0	0	cmpcsehq1000104ibueo8dlm5	cmsnjw3d4000004l73omej79w	2026-08-15 14:21:23.973	2026-08-15 14:21:23.973	\N
cmsugs29x000a04jxpp1lnp5d	0	0	0	0	cmpcov8jd000004l8umh13pux	cmsnjw3d4000004l73omej79w	2026-08-15 14:21:23.973	2026-08-15 14:21:23.973	\N
cmsugs29x000b04jxwbx9bjsb	0	0	0	0	cmsd6v73x000004jupd8tbvon	cmsnjw3d4000004l73omej79w	2026-08-15 14:21:23.973	2026-08-15 14:21:23.973	\N
cmsugs29x000c04jxnv4moha5	0	0	0	0	cmpcpt3n6000004l561lm2ja7	cmsnjw3d4000004l73omej79w	2026-08-15 14:21:23.973	2026-08-15 14:21:23.973	\N
cmsugs29x000d04jxs9vo15av	0	0	0	0	cmpcqf47m000004l85vce0gfh	cmsnjw3d4000004l73omej79w	2026-08-15 14:21:23.973	2026-08-15 14:21:23.973	\N
cmsugs29x000e04jxbhwnr95c	0	0	0	0	cmpcm7sgp000004l1fp9o52ky	cmsnjw3d4000004l73omej79w	2026-08-15 14:21:23.973	2026-08-15 14:21:23.973	\N
cmsugs29x000f04jx157ga61z	0	0	0	0	cmpcopzu6000004jro3prr7ca	cmsnjw3d4000004l73omej79w	2026-08-15 14:21:23.973	2026-08-15 14:21:23.973	\N
cmsugs29x000g04jxq1x851xx	0	0	0	0	cmpdz3jpw000004jvdohsd2ri	cmsnjw3d4000004l73omej79w	2026-08-15 14:21:23.973	2026-08-15 14:21:23.973	\N
cmsugs29x000h04jxx22118g3	0	0	0	0	cmpefep0o000504laynrqmhnw	cmsnjw3d4000004l73omej79w	2026-08-15 14:21:23.973	2026-08-15 14:21:23.973	\N
cmsugs29x000i04jx84q8hwk6	0	0	0	0	cmpefcd1z000004lasd2r1kdh	cmsnjw3d4000004l73omej79w	2026-08-15 14:21:23.973	2026-08-15 14:21:23.973	\N
cmsugs29x000j04jxd8gxzuui	0	0	0	0	\N	cmsnjw3d4000004l73omej79w	2026-08-15 14:21:23.973	2026-08-15 14:21:23.973	cmspgjypm000004kysmvkqplm
cmsugs29x000k04jx5id8fwqq	0	0	0	0	\N	cmsnjw3d4000004l73omej79w	2026-08-15 14:21:23.973	2026-08-15 14:21:23.973	cmspxfiuv000004jxpaj9z2h4
cmsugs29x000l04jxpe6mya7f	0	0	0	0	\N	cmsnjw3d4000004l73omej79w	2026-08-15 14:21:23.973	2026-08-15 14:21:23.973	cmsrtfetn000004kwf027gs36
cmsx845z4000004jrmw74c8yl	0	0	0	0	cmrozuqv4000104l5tbza8qgy	cmsd9fo2a000004l80caeqs67	2026-08-17 12:42:10.625	2026-08-17 12:42:10.625	\N
cmsx845z5000104jrn50reiwv	0	1	0	0	cmpn1o6et000004jrcnmw0gav	cmsd9fo2a000004l80caeqs67	2026-08-17 12:42:10.625	2026-08-17 12:42:10.625	\N
cmsx845z5000204jrhlcg8s2u	0	0	0	0	cmpct2xp7000004jsv1ujpe1r	cmsd9fo2a000004l80caeqs67	2026-08-17 12:42:10.625	2026-08-17 12:42:10.625	\N
cmsx845z5000304jr9ref6ew4	0	0	0	0	cmpcoxez0000304l8g40zcfou	cmsd9fo2a000004l80caeqs67	2026-08-17 12:42:10.625	2026-08-17 12:42:10.625	\N
cmsx845z5000404jrd6x616lg	0	0	0	0	cmpefdkyx000304la3k3nq9p9	cmsd9fo2a000004l80caeqs67	2026-08-17 12:42:10.625	2026-08-17 12:42:10.625	\N
cmsx845z5000504jrn304z0h8	1	0	0	0	cmpcpimjz000004jpcdqgfhfx	cmsd9fo2a000004l80caeqs67	2026-08-17 12:42:10.625	2026-08-17 12:42:10.625	\N
cmsx845z5000604jrmlvpb7ba	0	0	0	0	cmpcsds4s000004jmgpwku1j2	cmsd9fo2a000004l80caeqs67	2026-08-17 12:42:10.625	2026-08-17 12:42:10.625	\N
cmsx845z5000704jr2bdo77bc	0	0	0	0	cmpcov8jd000004l8umh13pux	cmsd9fo2a000004l80caeqs67	2026-08-17 12:42:10.625	2026-08-17 12:42:10.625	\N
cmsx845z5000804jrxdal38jz	0	0	0	0	cmsd6v73x000004jupd8tbvon	cmsd9fo2a000004l80caeqs67	2026-08-17 12:42:10.625	2026-08-17 12:42:10.625	\N
cmsx845z5000904jre5qniz7f	0	1	0	0	cmpcpt3n6000004l561lm2ja7	cmsd9fo2a000004l80caeqs67	2026-08-17 12:42:10.625	2026-08-17 12:42:10.625	\N
cmsx845z5000a04jrfjslll1h	0	0	0	0	cmpefcqj2000104ladlx0ysjz	cmsd9fo2a000004l80caeqs67	2026-08-17 12:42:10.625	2026-08-17 12:42:10.625	\N
cmsx845z5000b04jreelxkuoz	0	0	0	0	cmpcm7sgp000004l1fp9o52ky	cmsd9fo2a000004l80caeqs67	2026-08-17 12:42:10.625	2026-08-17 12:42:10.625	\N
cmsx845z5000c04jr1tb9eyze	0	0	0	0	cmpcopzu6000004jro3prr7ca	cmsd9fo2a000004l80caeqs67	2026-08-17 12:42:10.625	2026-08-17 12:42:10.625	\N
cmsx845z5000d04jraeo5jsxw	1	0	0	0	cmpefep0o000504laynrqmhnw	cmsd9fo2a000004l80caeqs67	2026-08-17 12:42:10.625	2026-08-17 12:42:10.625	\N
cmsx845z5000e04jr7x1jkn52	0	0	0	0	cmpefcd1z000004lasd2r1kdh	cmsd9fo2a000004l80caeqs67	2026-08-17 12:42:10.625	2026-08-17 12:42:10.625	\N
cmsx845z5000f04jruqcozbav	0	0	0	0	cmpdz2mcq000104jr9xnhl4i0	cmsd9fo2a000004l80caeqs67	2026-08-17 12:42:10.625	2026-08-17 12:42:10.625	\N
cmsx845z5000g04jrh23xjk49	0	0	0	0	cmst61960000104jvfkkcgzp4	cmsd9fo2a000004l80caeqs67	2026-08-17 12:42:10.625	2026-08-17 12:42:10.625	\N
cmsx845z5000h04jrlozpcagm	0	0	0	0	\N	cmsd9fo2a000004l80caeqs67	2026-08-17 12:42:10.625	2026-08-17 12:42:10.625	cmsv0y7sj000004kzopwy8py9
cmt5xm16s000004i5bzd88hr5	0	0	0	0	cmpfk8v2v000704jlp8siky9e	cmsx2wppc000004ldfwf8elsy	2026-08-23 14:58:04.036	2026-08-23 14:58:04.036	\N
cmt5xm16s000104i527b09s1n	0	0	0	0	cmpefdkyx000304la3k3nq9p9	cmsx2wppc000004ldfwf8elsy	2026-08-23 14:58:04.036	2026-08-23 14:58:04.036	\N
cmt5xm16s000204i5p2grp8pg	0	0	0	0	cmpcqf47m000004l85vce0gfh	cmsx2wppc000004ldfwf8elsy	2026-08-23 14:58:04.036	2026-08-23 14:58:04.036	\N
cmt5xm16s000304i5b06xn9gm	0	0	0	0	cmpcov8jd000004l8umh13pux	cmsx2wppc000004ldfwf8elsy	2026-08-23 14:58:04.036	2026-08-23 14:58:04.036	\N
cmt5xm16s000404i5bok8fz7b	0	0	0	0	cmpcsds4s000004jmgpwku1j2	cmsx2wppc000004ldfwf8elsy	2026-08-23 14:58:04.036	2026-08-23 14:58:04.036	\N
cmt5xm16s000504i5qfed4tau	0	0	0	0	cmpdz2mcq000104jr9xnhl4i0	cmsx2wppc000004ldfwf8elsy	2026-08-23 14:58:04.036	2026-08-23 14:58:04.036	\N
cmt5xm16s000604i583shcpig	0	0	0	0	cmpefcd1z000004lasd2r1kdh	cmsx2wppc000004ldfwf8elsy	2026-08-23 14:58:04.036	2026-08-23 14:58:04.036	\N
cmt5xm16s000704i55n2rhlbu	0	0	0	0	cmpcm7sgp000004l1fp9o52ky	cmsx2wppc000004ldfwf8elsy	2026-08-23 14:58:04.036	2026-08-23 14:58:04.036	\N
cmt5xm16s000804i5e4cuztgh	0	0	0	0	cmpcpimjz000004jpcdqgfhfx	cmsx2wppc000004ldfwf8elsy	2026-08-23 14:58:04.036	2026-08-23 14:58:04.036	\N
cmt5xm16s000904i5ajtfhc2w	0	0	0	0	cmpefcqj2000104ladlx0ysjz	cmsx2wppc000004ldfwf8elsy	2026-08-23 14:58:04.036	2026-08-23 14:58:04.036	\N
cmt5xm16s000a04i5w6pg0wns	0	0	0	0	\N	cmsx2wppc000004ldfwf8elsy	2026-08-23 14:58:04.036	2026-08-23 14:58:04.036	cmt1fctcn000004lflaxol39d
\.
COPY public.match_votes (id, "matchId", "voterId", "votedId", "createdAt") FROM stdin;
cmrp59fib000004jruumq6x5q	cmrkxjsua000004jtqvbnfwac	cmpcoxez0000304l8g40zcfou	cmpcov8jd000004l8umh13pux	2026-07-17 16:20:25.668
cms4ocve2000004l4ljfgldhw	cmrthsbf6000004kybfhn32yj	cmpn1o6et000004jrcnmw0gav	cmpefcqj2000104ladlx0ysjz	2026-07-28 13:11:31.562
cms4oir2i000304jvu30xllmu	cmqp5jh8b000004jp8k1q116l	cmpcoxez0000304l8g40zcfou	cmpcopzu6000004jro3prr7ca	2026-07-28 13:16:05.898
cms8c2pbf000004juew7k3t4j	cms3d5vfv000004jxuwwehm57	cmpn1o6et000004jrcnmw0gav	cmpdz2mcq000104jr9xnhl4i0	2026-07-31 02:38:46.443
cmsdkzg8c000004kyj46desnx	cmsadtjr8000004joiy5e4pc7	cmpcopzu6000004jro3prr7ca	cmpdz2mcq000104jr9xnhl4i0	2026-08-03 18:47:02.124
cmsga6tba000104jxx93xkle3	cmsadtjr8000004joiy5e4pc7	cmpdz3jpw000004jvdohsd2ri	cmpcpimjz000004jpcdqgfhfx	2026-08-05 16:08:08.423
cmsl04pfh000004jvzpm9y1ap	cmpg3u3kh000l04la6hj2e5r3	cmpcsds4s000004jmgpwku1j2	cmpefdkyx000304la3k3nq9p9	2026-08-08 23:25:24.797
cmssal7vh000004jiahcvgb0w	cmsnjw3d4000004l73omej79w	cmpcsds4s000004jmgpwku1j2	cmpcopzu6000004jro3prr7ca	2026-08-14 01:52:34.589
cmssci03n000004jof7d985yc	cmsnjw3d4000004l73omej79w	cmpcoxez0000304l8g40zcfou	cmpefdkyx000304la3k3nq9p9	2026-08-14 02:46:03.779
cmst60plg000004jvdluak3jy	cmsnjw3d4000004l73omej79w	cmpcopzu6000004jro3prr7ca	cmpefdkyx000304la3k3nq9p9	2026-08-14 16:32:25.492
cmswfbwbb000004jt2ltlpczd	cmsd9fo2a000004l80caeqs67	cmpcsds4s000004jmgpwku1j2	cmpefep0o000504laynrqmhnw	2026-08-16 23:16:22.487
cmswj1b79000j04jpjhsymieq	cmsd9fo2a000004l80caeqs67	cmpn1o6et000004jrcnmw0gav	cmpefep0o000504laynrqmhnw	2026-08-17 01:00:07.03
cmswjdct3000j04la71yw2w9s	cmsd9fo2a000004l80caeqs67	cmpcov8jd000004l8umh13pux	cmpcpimjz000004jpcdqgfhfx	2026-08-17 01:09:28.983
cmswl3gvp000004lf8g61s5z9	cmsd9fo2a000004l80caeqs67	cmrozuqv4000104l5tbza8qgy	cmpefep0o000504laynrqmhnw	2026-08-17 01:57:46.933
cmswldepb000004l5j6veypli	cmsd9fo2a000004l80caeqs67	cmpcpimjz000004jpcdqgfhfx	cmpefep0o000504laynrqmhnw	2026-08-17 02:05:30.671
cmswn36y8000004lhyvl348xr	cmsd9fo2a000004l80caeqs67	cmpcoxez0000304l8g40zcfou	cmpcpimjz000004jpcdqgfhfx	2026-08-17 02:53:33.297
cmsxbnvvv000004l6dxpc54to	cmsd9fo2a000004l80caeqs67	cmpcopzu6000004jro3prr7ca	cmpefep0o000504laynrqmhnw	2026-08-17 14:21:29.515
cmt8pkvea000004jot63h8l72	cmt0aw2dv000004jyn5mtmejp	cmpcopzu6000004jro3prr7ca	cmpct94t9000204jsxeeckk3m	2026-08-25 13:36:31.474
\.
COPY public.matches (id, date, venue, opponent, type, "homeScore", "awayScore", status, "shareToken", "teamId", "createdAt", "updatedAt", "seasonId", "isHome", "lineupFormation", "lineupBlockPreset", "opponentBadgeUrl", "chargeAmount", "hasCharge", "pixKey", latitude, longitude, "requiresDocumentDetails", "coachPlayerId", "coachPlayerBId") FROM stdin;
cmph7ki34000004ibhrgnxf2y	2026-04-09 00:00:00	Areninha do Antônio Bezerra	É Noiz	FRIENDLY	2	2	COMPLETED	a7d749e2-2ee2-4a0c-9d2f-5c3124966c4f	cmpbkj695000004jxaktrnbvc	2026-05-22 17:43:27.377	2026-05-22 17:50:40.045	cmpftkvay000204lhym3kyidb	f	\N	\N	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/42650a14-7877-4135-b4e6-6db5f5af3f7e.jpg	\N	f	\N	\N	\N	f	\N	\N
cmpg3xoab000e04jupuf15f34	2026-05-02 19:00:00	Areninha do Parque Rio Branco	Roma	FRIENDLY	2	1	COMPLETED	edcd3652-df76-4ee7-837d-be419aa2b7bd	cmpbkj695000004jxaktrnbvc	2026-05-21 23:13:57.299	2026-05-22 00:49:15.446	cmpftkvay000204lhym3kyidb	f	\N	\N	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/42c025e3-a6c9-4810-9d9d-16b2e9b88746.jpg	\N	f	\N	\N	\N	f	\N	\N
cmpgvy3i1000004jupkxo13f9	2026-04-26 21:00:00	Areninha do Antônio Bezerra	Adidas	FRIENDLY	1	0	COMPLETED	26a83c64-e004-4b65-be26-680aae147064	cmpbkj695000004jxaktrnbvc	2026-05-22 12:18:06.266	2026-05-22 13:25:05.004	cmpftkvay000204lhym3kyidb	t	\N	\N	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/9b739b97-b737-42df-aa7e-fc7a73464721.jpg	\N	f	\N	\N	\N	f	\N	\N
cmrp7l1ax000104l49nmc6qf9	2026-01-04 21:00:00	Areninha do Antônio Bezerra	Vila Nova	FRIENDLY	2	0	COMPLETED	6f0d45f2-d0b6-4199-a84b-4942b297ace2	cmpbkj695000004jxaktrnbvc	2026-07-17 17:25:26.361	2026-07-17 17:28:41.052	cmpftkvay000204lhym3kyidb	t	\N	\N	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/23c51e59-291b-45a4-b04e-ad2046353e4c.png	\N	f	\N	\N	\N	f	\N	\N
cmpkl4qyr000004l41n642701	2026-05-27 23:00:00	Areninha do Jardim Iracema	Jardim Iracema	FRIENDLY	2	2	COMPLETED	ba73d217-6940-4b00-bbf0-477d682ddc14	cmpbkj695000004jxaktrnbvc	2026-05-25 02:26:25.539	2026-05-28 13:42:57.428	cmpftkvay000204lhym3kyidb	f	FIVE_FOUR_ONE	BALANCED	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/dc9dbbbd-3ad5-475f-9268-db9e89117705.jpg	\N	f	\N	\N	\N	f	\N	\N
cmq9kccux000004l58m8puvai	2026-06-14 21:00:00	Areninha do Antônio Bezerra	Unidos EC	FRIENDLY	2	2	COMPLETED	3e2bd5c4-88c3-4b2f-9752-0365b63846a2	cmpbkj695000004jxaktrnbvc	2026-06-11 13:58:35.289	2026-06-17 13:13:28.174	cmpftkvay000204lhym3kyidb	t	\N	\N	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/8caea509-3459-4eea-bfe8-e191ef6bff29.jpg	\N	f	\N	-3.7444582	-38.5903593	f	\N	\N
cmpg3k0ot000004l5zes9kdtc	2026-06-06 19:00:00	Areninha da Vila Olímpica da Messejana	Ajax	FRIENDLY	3	5	COMPLETED	d789eaff-80b8-423c-84cb-f07ee9ad0abe	cmpbkj695000004jxaktrnbvc	2026-05-21 23:03:20.19	2026-06-09 21:44:08.19	\N	t	\N	\N	\N	\N	f	\N	\N	\N	f	\N	\N
cmpfezhxy000004lblpwmx62l	2026-05-23 19:00:00	Areninha da Itaoca	Sport Clube Montese	FRIENDLY	8	4	COMPLETED	f7827b27-f197-426d-9309-5a7ff5991cfb	cmpbkj695000004jxaktrnbvc	2026-05-21 11:35:31.99	2026-07-17 16:41:56.712	cmpftkvay000204lhym3kyidb	f	FIVE_THREE_TWO	BALANCED	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/060ed45c-e535-44a5-8475-6025b429014d.jpg	\N	f	\N	\N	\N	f	\N	\N
cmqp62ilp000004jul47gswr8	2026-07-12 18:00:00	Areninha do Flamenguinho	Uz Cara lá	CHAMPIONSHIP	6	1	COMPLETED	32e8ada8-f5da-43b8-b516-7573eb7455b0	cmpbkj695000004jxaktrnbvc	2026-06-22 12:03:20.365	2026-07-17 15:29:05.315	cmpftkvay000204lhym3kyidb	f	\N	\N	\N	\N	f	\N	\N	\N	f	\N	\N
cmpr23ivg000204icrms1915w	2026-05-30 19:00:00	Areninha do Jereissati 2	Londrina	FRIENDLY	6	2	COMPLETED	edbd1067-39ab-4887-8530-27dfa633e33c	cmpbkj695000004jxaktrnbvc	2026-05-29 15:07:58.924	2026-07-17 16:32:50.345	cmpftkvay000204lhym3kyidb	f	\N	\N	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/6b3f8c55-988f-4352-8f52-462c88d38b7b.jpg	\N	f	\N	\N	\N	f	\N	\N
cmrkxjsua000004jtqvbnfwac	2026-07-17 00:00:00	Areninha do Antônio Bezerra	Kurikaka	FRIENDLY	2	0	COMPLETED	f91b506f-bb29-49de-8ad4-023dc660c421	cmpbkj695000004jxaktrnbvc	2026-07-14 17:33:27.874	2026-07-17 01:43:55.023	cmpftkvay000204lhym3kyidb	f	FOUR_TWO_THREE_ONE	BALANCED	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/4a38e2e6-fd06-42bd-ac22-700c74bbf8e0.jpg	\N	f	\N	-3.7444582	-38.5903593	f	\N	\N
cmr4v6j8z000004jmrs48v3h3	2026-07-04 19:00:00	Areninha Parque Dom Aloísio Lorscheider	Figueira	FRIENDLY	1	3	COMPLETED	c72b36b5-2e5e-4e2a-a35c-f8b2ac20e51d	cmpbkj695000004jxaktrnbvc	2026-07-03 11:42:50.868	2026-07-17 15:44:22.897	cmpftkvay000204lhym3kyidb	f	\N	\N	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/ba324d82-640e-4309-beb1-8fd2449ed8e4.jpg	\N	f	\N	\N	\N	f	\N	\N
cmq59e1vu000004juzmp8xftw	2026-06-28 19:00:00	Areninha do Flamenguinho	Cruzeiro Vila Velha	CHAMPIONSHIP	0	5	COMPLETED	d2fddbfb-65fe-40a5-b12c-7a2d93191bc5	cmpbkj695000004jxaktrnbvc	2026-06-08 13:40:53.898	2026-07-17 15:53:57.367	cmpftkvay000204lhym3kyidb	t	\N	\N	\N	\N	f	dheryk@gmail.com	\N	\N	f	\N	\N
cmpg3rbz2000004la05x1z03i	2026-06-21 20:00:00	Areninha do Flamenguinho	Adidas	CHAMPIONSHIP	1	0	COMPLETED	a1b541eb-5608-4311-a9e5-46e187d083a4	cmpbkj695000004jxaktrnbvc	2026-05-21 23:09:01.406	2026-07-17 15:57:26.013	cmpftkvay000204lhym3kyidb	t	\N	\N	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/81689677-9c2c-424b-b204-599948f54cd7.jpg	\N	f	\N	-3.7170171	-38.5426423	f	\N	\N
cmpgxpcmr000104l1gbglqrdc	2026-04-18 18:45:00	Arena do Flamenguinho	São Paulo	CHAMPIONSHIP	2	4	COMPLETED	6dac655d-d809-48e1-ab81-1fad9636e6a9	cmpbkj695000004jxaktrnbvc	2026-05-22 13:07:17.427	2026-07-17 17:50:02.187	cmpftkvay000204lhym3kyidb	t	\N	\N	https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Brasao_do_Sao_Paulo_Futebol_Clube.svg/960px-Brasao_do_Sao_Paulo_Futebol_Clube.svg.png	\N	f	\N	\N	\N	f	\N	\N
cmrp8963m000004larspejvgr	2026-01-08 23:00:00	Areninha do Pici	Benfica	FRIENDLY	4	2	COMPLETED	bfe04e30-6ebd-44ce-959f-086df327faca	cmpbkj695000004jxaktrnbvc	2026-07-17 17:44:12.322	2026-07-17 17:48:47.851	cmpftkvay000204lhym3kyidb	f	\N	\N	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/468c810b-7c7f-439f-aa77-27eca1d899e5.png	\N	f	\N	\N	\N	f	\N	\N
cmrkxlng5000004jofpanlfev	2026-07-22 23:00:00	Areninha do Parque Rio Branco	Cruzeiro LBA	FRIENDLY	6	1	COMPLETED	285d8bbf-98a3-4185-8da0-3ae055137121	cmpbkj695000004jxaktrnbvc	2026-07-14 17:34:54.209	2026-07-23 14:23:39.677	cmpftkvay000204lhym3kyidb	f	FIVE_FOUR_ONE	HIGH	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/7223bfd4-fd62-43e3-a571-9dfbbf5ca554.jpg	\N	f	\N	-3.7498426	-38.5226171	f	\N	\N
cmqp5jh8b000004jp8k1q116l	2026-07-19 11:30:00	Areninha do Novo Oriente	Novo Oriente	FRIENDLY	7	2	COMPLETED	c15e1585-aa71-4218-a0cb-a0cdb1bcabbe	cmpbkj695000004jxaktrnbvc	2026-06-22 11:48:32.124	2026-07-19 13:33:14.711	cmpftkvay000204lhym3kyidb	f	\N	\N	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/b0716e73-c6ac-4139-9b67-5ba169e69621.jpg	\N	f	\N	\N	\N	f	\N	\N
cmpg3u3kh000l04la6hj2e5r3	2026-08-08 19:00:00	Campo da UECE	Porto	FRIENDLY	5	0	COMPLETED	3966976f-eafa-4797-8291-649504b00821	cmpbkj695000004jxaktrnbvc	2026-05-21 23:11:10.481	2026-08-09 01:53:19.37	cmpftkvay000204lhym3kyidb	f	\N	\N	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/ba842b07-6a1b-4e0f-935a-ee12d0204748.jpg	\N	f	\N	-3.794631	-38.555891	t	cmpcsds4s000004jmgpwku1j2	\N
cmpe1azov000004l1iw95x1zw	2026-05-10 19:45:00	Arena do Flamenguinho	Irmandade	FRIENDLY	4	0	COMPLETED	19cd510c-72ad-4295-a3fb-cab05ee2aece	cmpbkj695000004jxaktrnbvc	2026-05-20 12:24:47.407	2026-07-28 13:24:40.726	cmpftkvay000204lhym3kyidb	f	\N	\N	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/d637a16e-e624-4934-8222-dfe4f488849d.jpg	\N	f	\N	\N	\N	f	\N	\N
cmrp9ms6u000004ldf8womoau	2026-01-10 19:00:00	Areninha do Parque Rio Branco	Tambaú	FRIENDLY	3	1	COMPLETED	e06f5987-abce-4e5a-98e2-48ec36106497	cmpbkj695000004jxaktrnbvc	2026-07-17 18:22:47.095	2026-07-17 18:26:13.308	cmpftkvay000204lhym3kyidb	f	\N	\N	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/f3868bc4-3a19-4bd5-afe7-30172d2f35d9.png	\N	f	\N	\N	\N	f	\N	\N
cmrp9yfic000004jpt8bwp440	2026-01-18 11:30:00	Areninha do Novo Oriente	Novo Oriente	FRIENDLY	3	2	COMPLETED	1302b6c5-32d7-4456-878f-eadaee316140	cmpbkj695000004jxaktrnbvc	2026-07-17 18:31:50.532	2026-07-17 18:34:48.178	cmpftkvay000204lhym3kyidb	f	\N	\N	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/0af549df-07dc-460f-9d74-47df9f71d5b8.jpg	\N	f	\N	\N	\N	f	\N	\N
cmrqlng1w000004junomwb3sz	2026-03-07 21:00:00	Areninha Parque Dom Aloísio Lorscheider	Redbull Itapery	FRIENDLY	2	1	COMPLETED	e739adb4-0492-43fb-99f8-6a612b0ffbe0	cmpbkj695000004jxaktrnbvc	2026-07-18 16:46:59.588	2026-07-18 16:52:02.438	cmpftkvay000204lhym3kyidb	f	\N	\N	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/99b39fa6-bfc2-4c06-ae25-33fc8f9496fb.jpg	\N	f	\N	\N	\N	f	\N	\N
cmrpa59lt000p04jpzp8qdy4l	2026-01-24 21:00:00	Areninha do Jardim União	Seleção	FRIENDLY	5	1	COMPLETED	bda84f3e-e737-4d01-82af-7595319901ba	cmpbkj695000004jxaktrnbvc	2026-07-17 18:37:09.473	2026-07-17 18:40:11.1	cmpftkvay000204lhym3kyidb	f	\N	\N	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/14bb2ac4-791c-4c20-a622-f5c30fd65df8.jpg	\N	f	\N	\N	\N	f	\N	\N
cmrqkwrev000004jpjug6t8wd	2026-03-22 21:00:00	Areninha do Antônio Bezerra	Azilados	FRIENDLY	4	4	COMPLETED	2075b2d4-f45a-44e1-9536-45b326b00550	cmpbkj695000004jxaktrnbvc	2026-07-18 16:26:14.599	2026-07-18 16:29:22.905	cmpftkvay000204lhym3kyidb	t	\N	\N	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/2c51eea0-dfc4-4eda-838d-fd4b63296e90.jpg	\N	f	\N	\N	\N	f	\N	\N
cmrpaz5ve001b04igete2fxqx	2026-02-01 21:00:00	Areninha do Antônio Bezerra	Açaí	FRIENDLY	2	1	COMPLETED	152a676b-41ce-4b35-a64c-23cfcf8bccd2	cmpbkj695000004jxaktrnbvc	2026-07-17 19:00:24.314	2026-07-17 19:03:19.198	cmpftkvay000204lhym3kyidb	t	\N	\N	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/f8e1c8e8-fc57-4d4f-90aa-2583d6bda389.jpg	\N	f	\N	\N	\N	f	\N	\N
cmrpcbynn003404ldris66yj1	2026-02-28 19:00:00	Areninha do Curió	Nascente Esporte Clube	FRIENDLY	5	5	COMPLETED	200abbd7-45b9-4776-9f17-cd8ac3b4a8da	cmpbkj695000004jxaktrnbvc	2026-07-17 19:38:21.107	2026-07-17 19:42:25.746	cmpftkvay000204lhym3kyidb	f	\N	\N	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/e2cb8e5e-1069-449d-a398-74c0193ef512.png	\N	f	\N	\N	\N	f	\N	\N
cmrpblr3f001r04ldzbbc1u6h	2026-02-10 23:00:00	Areninha da Vila Manoel Sátiro	União da Vila	FRIENDLY	2	5	COMPLETED	84a8454b-575d-45e0-bd63-f7a23a596d01	cmpbkj695000004jxaktrnbvc	2026-07-17 19:17:58.251	2026-07-17 19:20:37.104	cmpftkvay000204lhym3kyidb	f	\N	\N	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/4a72365c-ee9a-46a5-9d28-977329556f0b.png	\N	f	\N	\N	\N	f	\N	\N
cmrpbrolu002f04ld1jou7dvp	2026-02-22 21:00:00	Areninha do Antônio Bezerra	Lendários	FRIENDLY	6	0	COMPLETED	2ce92404-adbb-448f-bde4-4782812e5a58	cmpbkj695000004jxaktrnbvc	2026-07-17 19:22:34.962	2026-07-17 19:27:42.396	cmpftkvay000204lhym3kyidb	t	\N	\N	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/743a5a9e-de83-4c4b-8ac5-5dfc07719df0.jpg	\N	f	\N	\N	\N	f	\N	\N
cmrpg2uyd000004l44co9je0h	2026-03-28 17:00:00	Areninha do Flamenguinho	Cruzeiro Quintino Cunha	CHAMPIONSHIP	0	1	COMPLETED	954ec047-6a41-4034-ab18-174c440835c7	cmpbkj695000004jxaktrnbvc	2026-07-17 21:23:14.869	2026-07-17 21:25:34.966	cmpftkvay000204lhym3kyidb	t	\N	\N	\N	\N	f	\N	\N	\N	f	\N	\N
cmrpgrdrs000o04jtnnx9wcf4	2026-03-11 00:00:00	Areninha do Antônio Bezerra	Lendários	FRIENDLY	4	2	COMPLETED	15daf7c9-f53f-4787-8f13-e8eea4364219	cmpbkj695000004jxaktrnbvc	2026-07-17 21:42:19	2026-07-17 21:46:16.038	cmpftkvay000204lhym3kyidb	f	\N	\N	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/f1814cac-bd07-4ec6-9478-24925b8aca24.jpg	\N	f	\N	\N	\N	f	\N	\N
cmrqld3kq000p04jp208zp47h	2026-03-25 23:00:00	Areninha da Vila Manoel Sátiro	Kafofo's	FRIENDLY	8	3	COMPLETED	6670b26d-60b9-4a4a-a041-64b318ea9f36	cmpbkj695000004jxaktrnbvc	2026-07-18 16:38:56.858	2026-07-18 16:41:12.893	cmpftkvay000204lhym3kyidb	f	\N	\N	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/62352be9-5ee2-4e37-9e3d-1c9c01bfa68d.jpg	\N	f	\N	\N	\N	f	\N	\N
cmsadtjr8000004joiy5e4pc7	2026-08-02 21:00:00	Areninha do Antônio Bezerra	Azilados	FRIENDLY	2	6	COMPLETED	414c143d-662d-421c-9c66-482e484c63a4	cmpbkj695000004jxaktrnbvc	2026-08-01 13:03:10.916	2026-08-06 14:52:34.448	cmpftkvay000204lhym3kyidb	t	\N	\N	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/bacd780c-61ec-485d-a40e-a7d7c417cd61.jpg	\N	f	\N	\N	\N	f	cmpcsds4s000004jmgpwku1j2	\N
cmrqib170000004l7swe10dxz	2026-09-19 21:00:00	Areninha do Jardim União	Seleção	FRIENDLY	\N	\N	SCHEDULED	cae164b8-cf63-4f9f-8912-10348dfa1e6a	cmpbkj695000004jxaktrnbvc	2026-07-18 15:13:21.612	2026-07-20 14:07:26.268	cmpftkvay000204lhym3kyidb	f	\N	\N	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/0ae5df51-8b98-4b1c-9aca-94120c820512.jpg	\N	f	\N	\N	\N	f	\N	\N
cms390n9w000t04jol6dfwp3s	2026-04-01 23:00:00	Areninha do AEC	Mancha Amarela	FRIENDLY	2	0	COMPLETED	5c0ef6a4-36a0-470c-b987-d1a0eb453d6f	cmpbkj695000004jxaktrnbvc	2026-07-27 13:14:20.756	2026-07-27 13:16:19.307	cmpftkvay000204lhym3kyidb	f	\N	\N	\N	\N	f	\N	\N	\N	f	\N	\N
cmrpgk0qh000004jttg2q1s11	2026-07-31 23:00:00	Areninha do Parque Santo Antônio	Integral FC	FRIENDLY	5	2	COMPLETED	eb15ea52-65cf-4ec1-b0b2-df320948c6e5	cmpbkj695000004jxaktrnbvc	2026-07-17 21:36:35.513	2026-08-03 17:57:02.678	cmpftkvay000204lhym3kyidb	f	\N	\N	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/2e723a51-7a20-4ba2-acc9-0438253afa28.jpg	\N	f	\N	-3.8045093	-38.5857027	f	cmpcoxez0000304l8g40zcfou	\N
cms3d5vfv000004jxuwwehm57	2026-07-29 22:30:00	Areninha do Antonio Bezerra	Azulão da Quarta	FRIENDLY	1	1	COMPLETED	c9d3be6b-6e5c-470f-8034-a555bcb4ff54	cmpbkj695000004jxaktrnbvc	2026-07-27 15:10:23.083	2026-08-03 19:32:10.84	cmpftkvay000204lhym3kyidb	f	\N	\N	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/603866db-2e63-493f-aaff-41d850ede1b4.jpg	\N	f	\N	-3.7444582	-38.5903593	f	cmpdz2mcq000104jr9xnhl4i0	\N
cmrthsbf6000004kybfhn32yj	2026-07-25 19:00:00	Areninha do Vila União	Fluminense	FRIENDLY	6	3	COMPLETED	8f8acbd3-db28-402e-80c6-eccb1dbd937d	cmpbkj695000004jxaktrnbvc	2026-07-20 17:22:06.93	2026-08-03 19:32:33.644	cmpftkvay000204lhym3kyidb	f	\N	\N	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/bf152edb-056b-4dbe-864a-be5359e0a8d2.jpg	\N	f	\N	-3.7702307	-38.5370712	f	cmpdz2mcq000104jr9xnhl4i0	\N
cmshn1bt0000004l8uazwx0nq	2026-08-30 21:00:00	Areninha do Antonio Bezerra	Meninos D'Villa	FRIENDLY	\N	\N	SCHEDULED	b6bbf015-0b26-44ef-bd67-eb865a57bc58	cmpbkj695000004jxaktrnbvc	2026-08-06 14:55:33.636	2026-08-06 14:55:33.636	cmpftkvay000204lhym3kyidb	t	\N	\N	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/cf963b6e-d822-421b-88db-3a56f35b277e.jpg	\N	f	\N	-22.568827799999998	-48.6357383	f	\N	\N
cmskhxpbb000004jq77wb6pqt	2026-08-26 23:00:00	Areninha do Parque Rio Branco	Cruzeiro LBA	FRIENDLY	\N	\N	SCHEDULED	f837623c-7053-4535-9336-a02bc40bb6e3	cmpbkj695000004jxaktrnbvc	2026-08-08 14:56:04.967	2026-08-25 20:35:28.953	cmpftkvay000204lhym3kyidb	f	\N	\N	\N	\N	f	\N	-3.751177	-38.519885	f	\N	\N
cmsd9fo2a000004l80caeqs67	2026-08-16 21:00:00	Areninha do Antonio Bezerra	Metrópole City	FRIENDLY	2	1	COMPLETED	2e7a0e2c-2336-4070-84ef-8932f4f6fcd6	cmpbkj695000004jxaktrnbvc	2026-08-03 13:23:43.378	2026-08-17 12:42:10.402	cmpftkvay000204lhym3kyidb	t	\N	\N	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/a619518c-2d84-4346-b43b-44bbabc8ebe0.jpg	\N	f	\N	-3.7451008999999997	-38.5903	f	cmpcsds4s000004jmgpwku1j2	\N
cmsnjw3d4000004l73omej79w	2026-08-13 23:00:00	Areninha do Parque Santo Antônio	IEIS	FRIENDLY	8	1	COMPLETED	ecf1568f-4a47-49b9-bcc9-8c5912d2cd4e	cmpbkj695000004jxaktrnbvc	2026-08-10 18:14:07.624	2026-08-15 14:21:23.997	cmpftkvay000204lhym3kyidb	f	FIVE_THREE_TWO	BALANCED	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/eee8c7e3-5d00-4eb6-8134-dfbef788a775.jpg	\N	f	\N	-3.8045093	-38.5857027	f	cmpcsds4s000004jmgpwku1j2	\N
cmt0aw2dv000004jyn5mtmejp	2026-08-23 21:00:00	Areninha do Antônio Bezerra	Time B	TRAINING	2	3	COMPLETED	e27aeafe-25b6-409c-8813-a6b601f6a2d6	cmpbkj695000004jxaktrnbvc	2026-08-19 16:23:10.099	2026-08-25 14:24:51.327	cmpftkvay000204lhym3kyidb	t	\N	\N	\N	\N	f	\N	-3.744458	-38.590359	f	cmpcsds4s000004jmgpwku1j2	cmpn1o6et000004jrcnmw0gav
cmsx2wppc000004ldfwf8elsy	2026-08-22 18:00:00	Areninha do Flamenguinho	Real Sociedad	CHAMPIONSHIP	0	4	COMPLETED	4c42b42e-8dba-4efc-a2f8-49e7f2639d31	cmpbkj695000004jxaktrnbvc	2026-08-17 10:16:24.864	2026-08-23 14:58:19.701	cmpftkvay000204lhym3kyidb	t	\N	\N	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/3eefd767-25f9-4a6e-8f08-8e0b2969b2d7.png	\N	f	dheryk@gmail.com	-3.724419	-38.592702	f	cmpdz2mcq000104jr9xnhl4i0	\N
\.
COPY public.membership_payments (id, "playerId", "teamId", month, year, amount, "paidAt", "transactionId", "updatedAt") FROM stdin;
\.
COPY public.notification_preferences (id, "userId", category, enabled, "createdAt", "updatedAt") FROM stdin;
\.
COPY public.notifications (id, "userId", type, title, body, link, read, "createdAt", category, "entityId", "entityType", metadata, "readAt", "teamId") FROM stdin;
cmskhxpgi000v04jqbkttks9z	cmpho0wwq000004jspb58zuwi	match-scheduled-cmskhxpbb000004jq77wb6pqt	Nova partida agendada	vs Cruzeiro LBA em 26/08/2026, 23:00 · Areninha do Parque Rio Branco	/matches/cmskhxpbb000004jq77wb6pqt	f	2026-08-08 14:56:05.155	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskhxpgi001504jqjmi6i2os	cmpd7uwm8000004kyio7v783x	match-scheduled-cmskhxpbb000004jq77wb6pqt	Nova partida agendada	vs Cruzeiro LBA em 26/08/2026, 23:00 · Areninha do Parque Rio Branco	/matches/cmskhxpbb000004jq77wb6pqt	f	2026-08-08 14:56:05.155	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskhxpgi001604jqnk3emk36	cmpd6e4q8000004i63b1ut2sx	match-scheduled-cmskhxpbb000004jq77wb6pqt	Nova partida agendada	vs Cruzeiro LBA em 26/08/2026, 23:00 · Areninha do Parque Rio Branco	/matches/cmskhxpbb000004jq77wb6pqt	f	2026-08-08 14:56:05.155	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskhxpgi001704jqur17ygb6	cmsd7iqxr000004ky22nwg8cq	match-scheduled-cmskhxpbb000004jq77wb6pqt	Nova partida agendada	vs Cruzeiro LBA em 26/08/2026, 23:00 · Areninha do Parque Rio Branco	/matches/cmskhxpbb000004jq77wb6pqt	f	2026-08-08 14:56:05.155	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskhxpgi001404jqags2k4ga	cmpj3d4t9000004jvh7z169sm	match-scheduled-cmskhxpbb000004jq77wb6pqt	Nova partida agendada	vs Cruzeiro LBA em 26/08/2026, 23:00 · Areninha do Parque Rio Branco	/matches/cmskhxpbb000004jq77wb6pqt	f	2026-08-08 14:56:05.155	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskhxpgi000y04jqpf1qtfaw	cmpfmz33y000004lelcgdyt4f	match-scheduled-cmskhxpbb000004jq77wb6pqt	Nova partida agendada	vs Cruzeiro LBA em 26/08/2026, 23:00 · Areninha do Parque Rio Branco	/matches/cmskhxpbb000004jq77wb6pqt	f	2026-08-08 14:56:05.155	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskhxpgi001104jq2iwdcgnp	cmpcoy9by000504l8sw41rlak	match-scheduled-cmskhxpbb000004jq77wb6pqt	Nova partida agendada	vs Cruzeiro LBA em 26/08/2026, 23:00 · Areninha do Parque Rio Branco	/matches/cmskhxpbb000004jq77wb6pqt	f	2026-08-08 14:56:05.155	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskhxpgi000z04jqlkiia3ov	cmpn1yeh5000104jrhfyq0v6c	match-scheduled-cmskhxpbb000004jq77wb6pqt	Nova partida agendada	vs Cruzeiro LBA em 26/08/2026, 23:00 · Areninha do Parque Rio Branco	/matches/cmskhxpbb000004jq77wb6pqt	f	2026-08-08 14:56:05.155	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskhxpgi000w04jq4j01g5oz	cmphnuh3t000104larhmey34t	match-scheduled-cmskhxpbb000004jq77wb6pqt	Nova partida agendada	vs Cruzeiro LBA em 26/08/2026, 23:00 · Areninha do Parque Rio Branco	/matches/cmskhxpbb000004jq77wb6pqt	f	2026-08-08 14:56:05.155	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskhxpgi001204jqhc86k5i7	cmpfv2qt3000004jpb1uotoby	match-scheduled-cmskhxpbb000004jq77wb6pqt	Nova partida agendada	vs Cruzeiro LBA em 26/08/2026, 23:00 · Areninha do Parque Rio Branco	/matches/cmskhxpbb000004jq77wb6pqt	f	2026-08-08 14:56:05.155	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskhxpgj001b04jq2kpjoe15	cmpcnpofw000004k4ig2qwx60	match-scheduled-cmskhxpbb000004jq77wb6pqt	Nova partida agendada	vs Cruzeiro LBA em 26/08/2026, 23:00 · Areninha do Parque Rio Branco	/matches/cmskhxpbb000004jq77wb6pqt	f	2026-08-08 14:56:05.155	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskhxpgj001a04jqucbp0th3	cmpgvd0wc000004jnbt334ki3	match-scheduled-cmskhxpbb000004jq77wb6pqt	Nova partida agendada	vs Cruzeiro LBA em 26/08/2026, 23:00 · Areninha do Parque Rio Branco	/matches/cmskhxpbb000004jq77wb6pqt	f	2026-08-08 14:56:05.155	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskhxpgj001c04jqyckfekev	cmpctqpqx000004jv6uocm5mt	match-scheduled-cmskhxpbb000004jq77wb6pqt	Nova partida agendada	vs Cruzeiro LBA em 26/08/2026, 23:00 · Areninha do Parque Rio Branco	/matches/cmskhxpbb000004jq77wb6pqt	f	2026-08-08 14:56:05.155	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskhxpgj001d04jqsvq6sn32	cmpfrajwz000104ik62ehuwer	match-scheduled-cmskhxpbb000004jq77wb6pqt	Nova partida agendada	vs Cruzeiro LBA em 26/08/2026, 23:00 · Areninha do Parque Rio Branco	/matches/cmskhxpbb000004jq77wb6pqt	f	2026-08-08 14:56:05.155	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskhxpgj001e04jq8rhjuwwq	cmph1sypn000004ie5zqjr8k3	match-scheduled-cmskhxpbb000004jq77wb6pqt	Nova partida agendada	vs Cruzeiro LBA em 26/08/2026, 23:00 · Areninha do Parque Rio Branco	/matches/cmskhxpbb000004jq77wb6pqt	f	2026-08-08 14:56:05.155	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskhxpgj001f04jqpjsz6z8l	cmpfio3qi000104l5wxmm0bie	match-scheduled-cmskhxpbb000004jq77wb6pqt	Nova partida agendada	vs Cruzeiro LBA em 26/08/2026, 23:00 · Areninha do Parque Rio Branco	/matches/cmskhxpbb000004jq77wb6pqt	f	2026-08-08 14:56:05.155	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskhxpgj001g04jq9vuq2fqx	cmpej13hk000004l9f9eng6ul	match-scheduled-cmskhxpbb000004jq77wb6pqt	Nova partida agendada	vs Cruzeiro LBA em 26/08/2026, 23:00 · Areninha do Parque Rio Branco	/matches/cmskhxpbb000004jq77wb6pqt	f	2026-08-08 14:56:05.155	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskhxpgj001h04jq73mf48h6	cmpd8r2um000004jol7zvu96b	match-scheduled-cmskhxpbb000004jq77wb6pqt	Nova partida agendada	vs Cruzeiro LBA em 26/08/2026, 23:00 · Areninha do Parque Rio Branco	/matches/cmskhxpbb000004jq77wb6pqt	f	2026-08-08 14:56:05.155	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskhxpgi001004jqmhhwww14	cmpn5gh4a000004ju8klhbxmm	match-scheduled-cmskhxpbb000004jq77wb6pqt	Nova partida agendada	vs Cruzeiro LBA em 26/08/2026, 23:00 · Areninha do Parque Rio Branco	/matches/cmskhxpbb000004jq77wb6pqt	f	2026-08-08 14:56:05.155	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskhxpgi000x04jq6xgmuqsk	cmrqjkn0m000004l6bos51jnk	match-scheduled-cmskhxpbb000004jq77wb6pqt	Nova partida agendada	vs Cruzeiro LBA em 26/08/2026, 23:00 · Areninha do Parque Rio Branco	/matches/cmskhxpbb000004jq77wb6pqt	f	2026-08-08 14:56:05.155	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskuk8xi000y04i8c9t8pwew	cmpfv2qt3000004jpb1uotoby	match-result-cmpg3u3kh000l04la6hj2e5r3-cmpfv2qt3000004jpb1uotoby	Resultado registrado	vs Porto: 5 x 0	/matches/cmpg3u3kh000l04la6hj2e5r3	f	2026-08-08 20:49:32.215	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskuk8xi001004i8u95jp90r	cmpfrajwz000104ik62ehuwer	match-result-cmpg3u3kh000l04la6hj2e5r3-cmpfrajwz000104ik62ehuwer	Resultado registrado	vs Porto: 5 x 0	/matches/cmpg3u3kh000l04la6hj2e5r3	f	2026-08-08 20:49:32.215	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskuk8xi000z04i898lofjts	cmpcnpofw000004k4ig2qwx60	match-result-cmpg3u3kh000l04la6hj2e5r3-cmpcnpofw000004k4ig2qwx60	Resultado registrado	vs Porto: 5 x 0	/matches/cmpg3u3kh000l04la6hj2e5r3	f	2026-08-08 20:49:32.215	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskuk8xi001804i8x416dbmg	cmpj3d4t9000004jvh7z169sm	match-result-cmpg3u3kh000l04la6hj2e5r3-cmpj3d4t9000004jvh7z169sm	Resultado registrado	vs Porto: 5 x 0	/matches/cmpg3u3kh000l04la6hj2e5r3	f	2026-08-08 20:49:32.215	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskhxpgi001304jq2z03dqyf	cmpcrj7ws000004l8oescls0l	match-scheduled-cmskhxpbb000004jq77wb6pqt	Nova partida agendada	vs Cruzeiro LBA em 26/08/2026, 23:00 · Areninha do Parque Rio Branco	/matches/cmskhxpbb000004jq77wb6pqt	t	2026-08-08 14:56:05.155	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskhxpgi001804jq44ow78ax	cmphed7dz000104l1vt5dsakr	match-scheduled-cmskhxpbb000004jq77wb6pqt	Nova partida agendada	vs Cruzeiro LBA em 26/08/2026, 23:00 · Areninha do Parque Rio Branco	/matches/cmskhxpbb000004jq77wb6pqt	t	2026-08-08 14:56:05.155	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskuk8xi001904i872lpel7c	cmpn1yeh5000104jrhfyq0v6c	match-result-cmpg3u3kh000l04la6hj2e5r3-cmpn1yeh5000104jrhfyq0v6c	Resultado registrado	vs Porto: 5 x 0	/matches/cmpg3u3kh000l04la6hj2e5r3	f	2026-08-08 20:49:32.215	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskuk8xi001204i81yt7ak92	cmpfio3qi000104l5wxmm0bie	match-result-cmpg3u3kh000l04la6hj2e5r3-cmpfio3qi000104l5wxmm0bie	Resultado registrado	vs Porto: 5 x 0	/matches/cmpg3u3kh000l04la6hj2e5r3	f	2026-08-08 20:49:32.215	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskuk8xi001504i8ceiyvqlz	cmpej13hk000004l9f9eng6ul	match-result-cmpg3u3kh000l04la6hj2e5r3-cmpej13hk000004l9f9eng6ul	Resultado registrado	vs Porto: 5 x 0	/matches/cmpg3u3kh000l04la6hj2e5r3	f	2026-08-08 20:49:32.215	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskuk8xj001c04i8nb7cl8w4	cmphed7dz000104l1vt5dsakr	match-result-cmpg3u3kh000l04la6hj2e5r3-cmphed7dz000104l1vt5dsakr	Resultado registrado	vs Porto: 5 x 0	/matches/cmpg3u3kh000l04la6hj2e5r3	t	2026-08-08 20:49:32.215	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskuk8xj001e04i8u5vpz491	cmpe0mtc4000004l1e0lft0uf	match-result-cmpg3u3kh000l04la6hj2e5r3-cmpe0mtc4000004l1e0lft0uf	Resultado registrado	vs Porto: 5 x 0	/matches/cmpg3u3kh000l04la6hj2e5r3	t	2026-08-08 20:49:32.215	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskuk8xi001704i8q6vf7ive	cmpho0wwq000004jspb58zuwi	match-result-cmpg3u3kh000l04la6hj2e5r3-cmpho0wwq000004jspb58zuwi	Resultado registrado	vs Porto: 5 x 0	/matches/cmpg3u3kh000l04la6hj2e5r3	f	2026-08-08 20:49:32.215	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskuk8xi001a04i8vybxa5cc	cmrqjkn0m000004l6bos51jnk	match-result-cmpg3u3kh000l04la6hj2e5r3-cmrqjkn0m000004l6bos51jnk	Resultado registrado	vs Porto: 5 x 0	/matches/cmpg3u3kh000l04la6hj2e5r3	f	2026-08-08 20:49:32.215	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskuk8xj001d04i8ggejuune	cmsd7iqxr000004ky22nwg8cq	match-result-cmpg3u3kh000l04la6hj2e5r3-cmsd7iqxr000004ky22nwg8cq	Resultado registrado	vs Porto: 5 x 0	/matches/cmpg3u3kh000l04la6hj2e5r3	f	2026-08-08 20:49:32.215	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskuk8xi001604i8m8r15y5p	cmpd8r2um000004jol7zvu96b	match-result-cmpg3u3kh000l04la6hj2e5r3-cmpd8r2um000004jol7zvu96b	Resultado registrado	vs Porto: 5 x 0	/matches/cmpg3u3kh000l04la6hj2e5r3	f	2026-08-08 20:49:32.215	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskuk8xj001b04i85zyj76kr	cmpcoy9by000504l8sw41rlak	match-result-cmpg3u3kh000l04la6hj2e5r3-cmpcoy9by000504l8sw41rlak	Resultado registrado	vs Porto: 5 x 0	/matches/cmpg3u3kh000l04la6hj2e5r3	f	2026-08-08 20:49:32.215	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskuk8xi001104i8z9egpzxl	cmph1sypn000004ie5zqjr8k3	match-result-cmpg3u3kh000l04la6hj2e5r3-cmph1sypn000004ie5zqjr8k3	Resultado registrado	vs Porto: 5 x 0	/matches/cmpg3u3kh000l04la6hj2e5r3	f	2026-08-08 20:49:32.215	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskuk8xi001404i8gnzfjsc2	cmpd7uwm8000004kyio7v783x	match-result-cmpg3u3kh000l04la6hj2e5r3-cmpd7uwm8000004kyio7v783x	Resultado registrado	vs Porto: 5 x 0	/matches/cmpg3u3kh000l04la6hj2e5r3	f	2026-08-08 20:49:32.215	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskuk8xi001304i8jbzzhdv9	cmpcrj7ws000004l8oescls0l	match-result-cmpg3u3kh000l04la6hj2e5r3-cmpcrj7ws000004l8oescls0l	Resultado registrado	vs Porto: 5 x 0	/matches/cmpg3u3kh000l04la6hj2e5r3	f	2026-08-08 20:49:32.215	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsnjw3i4000v04l7jqr54r8o	cmpho0wwq000004jspb58zuwi	match-scheduled-cmsnjw3d4000004l73omej79w	Nova partida agendada	vs IEIS em 13/08/2026, 23:00 · Areninha do Parque Santo Antônio	/matches/cmsnjw3d4000004l73omej79w	f	2026-08-10 18:14:07.805	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsnjw3i4001604l7gh1wcs69	cmpd7uwm8000004kyio7v783x	match-scheduled-cmsnjw3d4000004l73omej79w	Nova partida agendada	vs IEIS em 13/08/2026, 23:00 · Areninha do Parque Santo Antônio	/matches/cmsnjw3d4000004l73omej79w	f	2026-08-10 18:14:07.805	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsnjw3i4001704l7li0irzn0	cmpd6e4q8000004i63b1ut2sx	match-scheduled-cmsnjw3d4000004l73omej79w	Nova partida agendada	vs IEIS em 13/08/2026, 23:00 · Areninha do Parque Santo Antônio	/matches/cmsnjw3d4000004l73omej79w	f	2026-08-10 18:14:07.805	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsnjw3i4001104l7wvg8avqi	cmpn5gh4a000004ju8klhbxmm	match-scheduled-cmsnjw3d4000004l73omej79w	Nova partida agendada	vs IEIS em 13/08/2026, 23:00 · Areninha do Parque Santo Antônio	/matches/cmsnjw3d4000004l73omej79w	f	2026-08-10 18:14:07.805	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsnjw3i4000y04l7i7deams5	cmpfmz33y000004lelcgdyt4f	match-scheduled-cmsnjw3d4000004l73omej79w	Nova partida agendada	vs IEIS em 13/08/2026, 23:00 · Areninha do Parque Santo Antônio	/matches/cmsnjw3d4000004l73omej79w	f	2026-08-10 18:14:07.805	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsnjw3i4001404l7sz2etoo2	cmpcrj7ws000004l8oescls0l	match-scheduled-cmsnjw3d4000004l73omej79w	Nova partida agendada	vs IEIS em 13/08/2026, 23:00 · Areninha do Parque Santo Antônio	/matches/cmsnjw3d4000004l73omej79w	f	2026-08-10 18:14:07.805	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsnjw3i4001304l7zqdvocez	cmpfv2qt3000004jpb1uotoby	match-scheduled-cmsnjw3d4000004l73omej79w	Nova partida agendada	vs IEIS em 13/08/2026, 23:00 · Areninha do Parque Santo Antônio	/matches/cmsnjw3d4000004l73omej79w	f	2026-08-10 18:14:07.805	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsnjw3i5001b04l77thiv8bd	cmpcnpofw000004k4ig2qwx60	match-scheduled-cmsnjw3d4000004l73omej79w	Nova partida agendada	vs IEIS em 13/08/2026, 23:00 · Areninha do Parque Santo Antônio	/matches/cmsnjw3d4000004l73omej79w	f	2026-08-10 18:14:07.805	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsnjw3i5001f04l7c9uy4fcf	cmpfio3qi000104l5wxmm0bie	match-scheduled-cmsnjw3d4000004l73omej79w	Nova partida agendada	vs IEIS em 13/08/2026, 23:00 · Areninha do Parque Santo Antônio	/matches/cmsnjw3d4000004l73omej79w	f	2026-08-10 18:14:07.805	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsnjw3i5001g04l73qjm287j	cmpej13hk000004l9f9eng6ul	match-scheduled-cmsnjw3d4000004l73omej79w	Nova partida agendada	vs IEIS em 13/08/2026, 23:00 · Areninha do Parque Santo Antônio	/matches/cmsnjw3d4000004l73omej79w	f	2026-08-10 18:14:07.805	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsnjw3i5001e04l7ys6x4b0o	cmph1sypn000004ie5zqjr8k3	match-scheduled-cmsnjw3d4000004l73omej79w	Nova partida agendada	vs IEIS em 13/08/2026, 23:00 · Areninha do Parque Santo Antônio	/matches/cmsnjw3d4000004l73omej79w	f	2026-08-10 18:14:07.805	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsnjw3i4001a04l7d56t8ws6	cmpgvd0wc000004jnbt334ki3	match-scheduled-cmsnjw3d4000004l73omej79w	Nova partida agendada	vs IEIS em 13/08/2026, 23:00 · Areninha do Parque Santo Antônio	/matches/cmsnjw3d4000004l73omej79w	f	2026-08-10 18:14:07.805	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsnjw3i5001h04l7qpbonhf1	cmpd8r2um000004jol7zvu96b	match-scheduled-cmsnjw3d4000004l73omej79w	Nova partida agendada	vs IEIS em 13/08/2026, 23:00 · Areninha do Parque Santo Antônio	/matches/cmsnjw3d4000004l73omej79w	f	2026-08-10 18:14:07.805	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsnjw3i5001d04l7a42nmk15	cmpfrajwz000104ik62ehuwer	match-scheduled-cmsnjw3d4000004l73omej79w	Nova partida agendada	vs IEIS em 13/08/2026, 23:00 · Areninha do Parque Santo Antônio	/matches/cmsnjw3d4000004l73omej79w	f	2026-08-10 18:14:07.805	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsnjw3i4001204l7oja0lkwb	cmpcoy9by000504l8sw41rlak	match-scheduled-cmsnjw3d4000004l73omej79w	Nova partida agendada	vs IEIS em 13/08/2026, 23:00 · Areninha do Parque Santo Antônio	/matches/cmsnjw3d4000004l73omej79w	f	2026-08-10 18:14:07.805	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsnjw3i4001004l7rk5cz8lh	cmpj3d4t9000004jvh7z169sm	match-scheduled-cmsnjw3d4000004l73omej79w	Nova partida agendada	vs IEIS em 13/08/2026, 23:00 · Areninha do Parque Santo Antônio	/matches/cmsnjw3d4000004l73omej79w	f	2026-08-10 18:14:07.805	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsnjw3i4000w04l7f46fjnrd	cmphnuh3t000104larhmey34t	match-scheduled-cmsnjw3d4000004l73omej79w	Nova partida agendada	vs IEIS em 13/08/2026, 23:00 · Areninha do Parque Santo Antônio	/matches/cmsnjw3d4000004l73omej79w	f	2026-08-10 18:14:07.805	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsnjw3i5001c04l7t70kbgtk	cmpctqpqx000004jv6uocm5mt	match-scheduled-cmsnjw3d4000004l73omej79w	Nova partida agendada	vs IEIS em 13/08/2026, 23:00 · Areninha do Parque Santo Antônio	/matches/cmsnjw3d4000004l73omej79w	f	2026-08-10 18:14:07.805	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsnjw3i4001804l7s0mt7v2h	cmsd7iqxr000004ky22nwg8cq	match-scheduled-cmsnjw3d4000004l73omej79w	Nova partida agendada	vs IEIS em 13/08/2026, 23:00 · Areninha do Parque Santo Antônio	/matches/cmsnjw3d4000004l73omej79w	t	2026-08-10 18:14:07.805	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsnjw3i4001904l7wwkcl3xo	cmphed7dz000104l1vt5dsakr	match-scheduled-cmsnjw3d4000004l73omej79w	Nova partida agendada	vs IEIS em 13/08/2026, 23:00 · Areninha do Parque Santo Antônio	/matches/cmsnjw3d4000004l73omej79w	t	2026-08-10 18:14:07.805	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmskhxpgi001904jq6pwbveek	cmpe0mtc4000004l1e0lft0uf	match-scheduled-cmskhxpbb000004jq77wb6pqt	Nova partida agendada	vs Cruzeiro LBA em 26/08/2026, 23:00 · Areninha do Parque Rio Branco	/matches/cmskhxpbb000004jq77wb6pqt	t	2026-08-08 14:56:05.155	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsnjw3i4000z04l7ap5nn9jv	cmpn1yeh5000104jrhfyq0v6c	match-scheduled-cmsnjw3d4000004l73omej79w	Nova partida agendada	vs IEIS em 13/08/2026, 23:00 · Areninha do Parque Santo Antônio	/matches/cmsnjw3d4000004l73omej79w	t	2026-08-10 18:14:07.805	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsnjw3i4000x04l7fey4l68h	cmrqjkn0m000004l6bos51jnk	match-scheduled-cmsnjw3d4000004l73omej79w	Nova partida agendada	vs IEIS em 13/08/2026, 23:00 · Areninha do Parque Santo Antônio	/matches/cmsnjw3d4000004l73omej79w	t	2026-08-10 18:14:07.805	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmss81zl5001104ldzfi0s4m5	cmph1sypn000004ie5zqjr8k3	match-result-cmsnjw3d4000004l73omej79w-cmph1sypn000004ie5zqjr8k3	Resultado registrado	vs IEIS: 8 x 1	/matches/cmsnjw3d4000004l73omej79w	f	2026-08-14 00:41:38.154	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmss81zl5001204ld1580ly21	cmpcnpofw000004k4ig2qwx60	match-result-cmsnjw3d4000004l73omej79w-cmpcnpofw000004k4ig2qwx60	Resultado registrado	vs IEIS: 8 x 1	/matches/cmsnjw3d4000004l73omej79w	f	2026-08-14 00:41:38.154	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmss81zl6001b04ldvefx0jwu	cmpgvd0wc000004jnbt334ki3	match-result-cmsnjw3d4000004l73omej79w-cmpgvd0wc000004jnbt334ki3	Resultado registrado	vs IEIS: 8 x 1	/matches/cmsnjw3d4000004l73omej79w	f	2026-08-14 00:41:38.154	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmss81zl6001c04ldc2fpr77y	cmpcrj7ws000004l8oescls0l	match-result-cmsnjw3d4000004l73omej79w-cmpcrj7ws000004l8oescls0l	Resultado registrado	vs IEIS: 8 x 1	/matches/cmsnjw3d4000004l73omej79w	f	2026-08-14 00:41:38.154	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmss81zl6001d04ldnm7s2dup	cmpd6e4q8000004i63b1ut2sx	match-result-cmsnjw3d4000004l73omej79w-cmpd6e4q8000004i63b1ut2sx	Resultado registrado	vs IEIS: 8 x 1	/matches/cmsnjw3d4000004l73omej79w	f	2026-08-14 00:41:38.154	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmss81zl6001f04lds0ezcvv9	cmpcoy9by000504l8sw41rlak	match-result-cmsnjw3d4000004l73omej79w-cmpcoy9by000504l8sw41rlak	Resultado registrado	vs IEIS: 8 x 1	/matches/cmsnjw3d4000004l73omej79w	f	2026-08-14 00:41:38.154	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmss81zl6001a04ldh475aaqh	cmpfmz33y000004lelcgdyt4f	match-result-cmsnjw3d4000004l73omej79w-cmpfmz33y000004lelcgdyt4f	Resultado registrado	vs IEIS: 8 x 1	/matches/cmsnjw3d4000004l73omej79w	f	2026-08-14 00:41:38.154	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmss81zl6001g04ldsizka4r7	cmpfrajwz000104ik62ehuwer	match-result-cmsnjw3d4000004l73omej79w-cmpfrajwz000104ik62ehuwer	Resultado registrado	vs IEIS: 8 x 1	/matches/cmsnjw3d4000004l73omej79w	f	2026-08-14 00:41:38.154	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmss81zl5001604ldkt76mas5	cmpctqpqx000004jv6uocm5mt	match-result-cmsnjw3d4000004l73omej79w-cmpctqpqx000004jv6uocm5mt	Resultado registrado	vs IEIS: 8 x 1	/matches/cmsnjw3d4000004l73omej79w	f	2026-08-14 00:41:38.154	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmss81zl5001504ldgpqyldar	cmpho0wwq000004jspb58zuwi	match-result-cmsnjw3d4000004l73omej79w-cmpho0wwq000004jspb58zuwi	Resultado registrado	vs IEIS: 8 x 1 · Sua atuação: 1 gol	/matches/cmsnjw3d4000004l73omej79w	f	2026-08-14 00:41:38.154	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmss81zl6001904ldfz2tufbh	cmsd7iqxr000004ky22nwg8cq	match-result-cmsnjw3d4000004l73omej79w-cmsd7iqxr000004ky22nwg8cq	Resultado registrado	vs IEIS: 8 x 1	/matches/cmsnjw3d4000004l73omej79w	f	2026-08-14 00:41:38.154	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmss81zl5001304ld5mz55015	cmpfv2qt3000004jpb1uotoby	match-result-cmsnjw3d4000004l73omej79w-cmpfv2qt3000004jpb1uotoby	Resultado registrado	vs IEIS: 8 x 1	/matches/cmsnjw3d4000004l73omej79w	f	2026-08-14 00:41:38.154	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmss81zl6001704ld272luxgo	cmpfio3qi000104l5wxmm0bie	match-result-cmsnjw3d4000004l73omej79w-cmpfio3qi000104l5wxmm0bie	Resultado registrado	vs IEIS: 8 x 1	/matches/cmsnjw3d4000004l73omej79w	f	2026-08-14 00:41:38.154	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmss81zl5001404ldjs8cpwvn	cmpn1yeh5000104jrhfyq0v6c	match-result-cmsnjw3d4000004l73omej79w-cmpn1yeh5000104jrhfyq0v6c	Resultado registrado	vs IEIS: 8 x 1	/matches/cmsnjw3d4000004l73omej79w	f	2026-08-14 00:41:38.154	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmss81zl6001804ldfrkxmbc7	cmpd7uwm8000004kyio7v783x	match-result-cmsnjw3d4000004l73omej79w-cmpd7uwm8000004kyio7v783x	Resultado registrado	vs IEIS: 8 x 1	/matches/cmsnjw3d4000004l73omej79w	t	2026-08-14 00:41:38.154	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsweu95k001204jut8fq5ohc	cmpn1yeh5000104jrhfyq0v6c	match-result-cmsd9fo2a000004l80caeqs67-cmpn1yeh5000104jrhfyq0v6c	Resultado registrado	vs Metrópole City: 2 x 1 · Sua atuação: 1 assistência	/matches/cmsd9fo2a000004l80caeqs67	f	2026-08-16 23:02:39.32	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsweu95k001b04jutk7q2pi3	cmpho0wwq000004jspb58zuwi	match-result-cmsd9fo2a000004l80caeqs67-cmpho0wwq000004jspb58zuwi	Resultado registrado	vs Metrópole City: 2 x 1	/matches/cmsd9fo2a000004l80caeqs67	f	2026-08-16 23:02:39.32	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsweu95k001c04juxgplmwff	cmpcnpofw000004k4ig2qwx60	match-result-cmsd9fo2a000004l80caeqs67-cmpcnpofw000004k4ig2qwx60	Resultado registrado	vs Metrópole City: 2 x 1	/matches/cmsd9fo2a000004l80caeqs67	f	2026-08-16 23:02:39.32	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsweu95k001d04juo4yw7cg8	cmpctqpqx000004jv6uocm5mt	match-result-cmsd9fo2a000004l80caeqs67-cmpctqpqx000004jv6uocm5mt	Resultado registrado	vs Metrópole City: 2 x 1	/matches/cmsd9fo2a000004l80caeqs67	f	2026-08-16 23:02:39.32	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsweu95k001e04jurxkk2dxl	cmph1sypn000004ie5zqjr8k3	match-result-cmsd9fo2a000004l80caeqs67-cmph1sypn000004ie5zqjr8k3	Resultado registrado	vs Metrópole City: 2 x 1 · Sua atuação: 1 gol	/matches/cmsd9fo2a000004l80caeqs67	f	2026-08-16 23:02:39.32	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsweu95k001f04ju5l822x6p	cmpfio3qi000104l5wxmm0bie	match-result-cmsd9fo2a000004l80caeqs67-cmpfio3qi000104l5wxmm0bie	Resultado registrado	vs Metrópole City: 2 x 1	/matches/cmsd9fo2a000004l80caeqs67	f	2026-08-16 23:02:39.32	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmss81zl6001e04ld0hjy5aja	cmphed7dz000104l1vt5dsakr	match-result-cmsnjw3d4000004l73omej79w-cmphed7dz000104l1vt5dsakr	Resultado registrado	vs IEIS: 8 x 1	/matches/cmsnjw3d4000004l73omej79w	t	2026-08-14 00:41:38.154	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsweu95k001a04ju3bqjq03x	cmphed7dz000104l1vt5dsakr	match-result-cmsd9fo2a000004l80caeqs67-cmphed7dz000104l1vt5dsakr	Resultado registrado	vs Metrópole City: 2 x 1	/matches/cmsd9fo2a000004l80caeqs67	t	2026-08-16 23:02:39.32	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsweu95j001104jup6cgx36j	cmrqjkn0m000004l6bos51jnk	match-result-cmsd9fo2a000004l80caeqs67-cmrqjkn0m000004l6bos51jnk	Resultado registrado	vs Metrópole City: 2 x 1	/matches/cmsd9fo2a000004l80caeqs67	t	2026-08-16 23:02:39.32	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmss81zl6001h04ldplkjh1oo	cmpe0mtc4000004l1e0lft0uf	match-result-cmsnjw3d4000004l73omej79w-cmpe0mtc4000004l1e0lft0uf	Resultado registrado	vs IEIS: 8 x 1	/matches/cmsnjw3d4000004l73omej79w	t	2026-08-14 00:41:38.154	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsweu95k001g04ju3t6fsjqf	cmpej13hk000004l9f9eng6ul	match-result-cmsd9fo2a000004l80caeqs67-cmpej13hk000004l9f9eng6ul	Resultado registrado	vs Metrópole City: 2 x 1	/matches/cmsd9fo2a000004l80caeqs67	f	2026-08-16 23:02:39.32	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsweu95k001404ju5kyciuyc	cmpcoy9by000504l8sw41rlak	match-result-cmsd9fo2a000004l80caeqs67-cmpcoy9by000504l8sw41rlak	Resultado registrado	vs Metrópole City: 2 x 1	/matches/cmsd9fo2a000004l80caeqs67	f	2026-08-16 23:02:39.32	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsweu95k001504ju1nfnhyn7	cmpfv2qt3000004jpb1uotoby	match-result-cmsd9fo2a000004l80caeqs67-cmpfv2qt3000004jpb1uotoby	Resultado registrado	vs Metrópole City: 2 x 1	/matches/cmsd9fo2a000004l80caeqs67	f	2026-08-16 23:02:39.32	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsweu95k001304jui84xyq8r	cmpj3d4t9000004jvh7z169sm	match-result-cmsd9fo2a000004l80caeqs67-cmpj3d4t9000004jvh7z169sm	Resultado registrado	vs Metrópole City: 2 x 1	/matches/cmsd9fo2a000004l80caeqs67	f	2026-08-16 23:02:39.32	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsweu95k001h04ju4gyelzcs	cmsthgz8f000004l7pd5vnm0o	match-result-cmsd9fo2a000004l80caeqs67-cmsthgz8f000004l7pd5vnm0o	Resultado registrado	vs Metrópole City: 2 x 1	/matches/cmsd9fo2a000004l80caeqs67	t	2026-08-16 23:02:39.32	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsweu95k001904juy4656wpx	cmsd7iqxr000004ky22nwg8cq	match-result-cmsd9fo2a000004l80caeqs67-cmsd7iqxr000004ky22nwg8cq	Resultado registrado	vs Metrópole City: 2 x 1	/matches/cmsd9fo2a000004l80caeqs67	f	2026-08-16 23:02:39.32	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsweu95k001604ju29estklf	cmpcrj7ws000004l8oescls0l	match-result-cmsd9fo2a000004l80caeqs67-cmpcrj7ws000004l8oescls0l	Resultado registrado	vs Metrópole City: 2 x 1 · Sua atuação: 1 gol	/matches/cmsd9fo2a000004l80caeqs67	f	2026-08-16 23:02:39.32	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsweu95k001804jug6b1yvac	cmpd6e4q8000004i63b1ut2sx	match-result-cmsd9fo2a000004l80caeqs67-cmpd6e4q8000004i63b1ut2sx	Resultado registrado	vs Metrópole City: 2 x 1	/matches/cmsd9fo2a000004l80caeqs67	t	2026-08-16 23:02:39.32	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsx2wptu000o04ldobxv907z	cmpho0wwq000004jspb58zuwi	match-scheduled-cmsx2wppc000004ldfwf8elsy	Nova partida agendada	vs Real Sociedad em 22/08/2026, 18:00 · Areninha do Flamenguinho	/matches/cmsx2wppc000004ldfwf8elsy	f	2026-08-17 10:16:25.028	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsx2wptv000y04ldvxxgl25q	cmpd7uwm8000004kyio7v783x	match-scheduled-cmsx2wppc000004ldfwf8elsy	Nova partida agendada	vs Real Sociedad em 22/08/2026, 18:00 · Areninha do Flamenguinho	/matches/cmsx2wppc000004ldfwf8elsy	f	2026-08-17 10:16:25.028	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsx2wptv000z04ldla12w4vc	cmpd6e4q8000004i63b1ut2sx	match-scheduled-cmsx2wppc000004ldfwf8elsy	Nova partida agendada	vs Real Sociedad em 22/08/2026, 18:00 · Areninha do Flamenguinho	/matches/cmsx2wppc000004ldfwf8elsy	f	2026-08-17 10:16:25.028	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsx2wptv001004lddj145gmm	cmsd7iqxr000004ky22nwg8cq	match-scheduled-cmsx2wppc000004ldfwf8elsy	Nova partida agendada	vs Real Sociedad em 22/08/2026, 18:00 · Areninha do Flamenguinho	/matches/cmsx2wppc000004ldfwf8elsy	f	2026-08-17 10:16:25.028	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsx2wptu000q04ldo2vavoyd	cmrqjkn0m000004l6bos51jnk	match-scheduled-cmsx2wppc000004ldfwf8elsy	Nova partida agendada	vs Real Sociedad em 22/08/2026, 18:00 · Areninha do Flamenguinho	/matches/cmsx2wppc000004ldfwf8elsy	f	2026-08-17 10:16:25.028	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsx2wptu000p04ldpct2u0ji	cmphnuh3t000104larhmey34t	match-scheduled-cmsx2wppc000004ldfwf8elsy	Nova partida agendada	vs Real Sociedad em 22/08/2026, 18:00 · Areninha do Flamenguinho	/matches/cmsx2wppc000004ldfwf8elsy	f	2026-08-17 10:16:25.028	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsx2wptv000t04ldzttgayet	cmpj3d4t9000004jvh7z169sm	match-scheduled-cmsx2wppc000004ldfwf8elsy	Nova partida agendada	vs Real Sociedad em 22/08/2026, 18:00 · Areninha do Flamenguinho	/matches/cmsx2wppc000004ldfwf8elsy	f	2026-08-17 10:16:25.028	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsx2wptw001504ld4vobya27	cmpctqpqx000004jv6uocm5mt	match-scheduled-cmsx2wppc000004ldfwf8elsy	Nova partida agendada	vs Real Sociedad em 22/08/2026, 18:00 · Areninha do Flamenguinho	/matches/cmsx2wppc000004ldfwf8elsy	f	2026-08-17 10:16:25.028	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsx2wptv000v04ldrpt7x2wt	cmpfv2qt3000004jpb1uotoby	match-scheduled-cmsx2wppc000004ldfwf8elsy	Nova partida agendada	vs Real Sociedad em 22/08/2026, 18:00 · Areninha do Flamenguinho	/matches/cmsx2wppc000004ldfwf8elsy	f	2026-08-17 10:16:25.028	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsx2wptw001604ldk3keyl8y	cmpfrajwz000104ik62ehuwer	match-scheduled-cmsx2wppc000004ldfwf8elsy	Nova partida agendada	vs Real Sociedad em 22/08/2026, 18:00 · Areninha do Flamenguinho	/matches/cmsx2wppc000004ldfwf8elsy	f	2026-08-17 10:16:25.028	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsx2wptw001904ldw7h5fdd2	cmpej13hk000004l9f9eng6ul	match-scheduled-cmsx2wppc000004ldfwf8elsy	Nova partida agendada	vs Real Sociedad em 22/08/2026, 18:00 · Areninha do Flamenguinho	/matches/cmsx2wppc000004ldfwf8elsy	f	2026-08-17 10:16:25.028	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsx2wptw001804ldlhozic2n	cmpfio3qi000104l5wxmm0bie	match-scheduled-cmsx2wppc000004ldfwf8elsy	Nova partida agendada	vs Real Sociedad em 22/08/2026, 18:00 · Areninha do Flamenguinho	/matches/cmsx2wppc000004ldfwf8elsy	f	2026-08-17 10:16:25.028	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsx2wptw001a04ldqhebtm3d	cmpd8r2um000004jol7zvu96b	match-scheduled-cmsx2wppc000004ldfwf8elsy	Nova partida agendada	vs Real Sociedad em 22/08/2026, 18:00 · Areninha do Flamenguinho	/matches/cmsx2wppc000004ldfwf8elsy	f	2026-08-17 10:16:25.028	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsx2wptu000r04ldpo5u639m	cmpfmz33y000004lelcgdyt4f	match-scheduled-cmsx2wppc000004ldfwf8elsy	Nova partida agendada	vs Real Sociedad em 22/08/2026, 18:00 · Areninha do Flamenguinho	/matches/cmsx2wppc000004ldfwf8elsy	f	2026-08-17 10:16:25.028	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsx2wptv000w04ldifayi6gj	cmpcrj7ws000004l8oescls0l	match-scheduled-cmsx2wppc000004ldfwf8elsy	Nova partida agendada	vs Real Sociedad em 22/08/2026, 18:00 · Areninha do Flamenguinho	/matches/cmsx2wppc000004ldfwf8elsy	f	2026-08-17 10:16:25.028	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsx2wptv001404ld4djvrryh	cmpcnpofw000004k4ig2qwx60	match-scheduled-cmsx2wppc000004ldfwf8elsy	Nova partida agendada	vs Real Sociedad em 22/08/2026, 18:00 · Areninha do Flamenguinho	/matches/cmsx2wppc000004ldfwf8elsy	f	2026-08-17 10:16:25.028	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsx2wptw001704ld8t3r56g4	cmph1sypn000004ie5zqjr8k3	match-scheduled-cmsx2wppc000004ldfwf8elsy	Nova partida agendada	vs Real Sociedad em 22/08/2026, 18:00 · Areninha do Flamenguinho	/matches/cmsx2wppc000004ldfwf8elsy	f	2026-08-17 10:16:25.028	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsx2wptv000u04ldp0phb24r	cmpcoy9by000504l8sw41rlak	match-scheduled-cmsx2wppc000004ldfwf8elsy	Nova partida agendada	vs Real Sociedad em 22/08/2026, 18:00 · Areninha do Flamenguinho	/matches/cmsx2wppc000004ldfwf8elsy	f	2026-08-17 10:16:25.028	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsx2wptv001204ld8r90wftc	cmsthgz8f000004l7pd5vnm0o	match-scheduled-cmsx2wppc000004ldfwf8elsy	Nova partida agendada	vs Real Sociedad em 22/08/2026, 18:00 · Areninha do Flamenguinho	/matches/cmsx2wppc000004ldfwf8elsy	t	2026-08-17 10:16:25.028	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsx2wptu000s04ldw6lx7k2s	cmpn1yeh5000104jrhfyq0v6c	match-scheduled-cmsx2wppc000004ldfwf8elsy	Nova partida agendada	vs Real Sociedad em 22/08/2026, 18:00 · Areninha do Flamenguinho	/matches/cmsx2wppc000004ldfwf8elsy	t	2026-08-17 10:16:25.028	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsx2wptv001104ldtoakjiz4	cmphed7dz000104l1vt5dsakr	match-scheduled-cmsx2wppc000004ldfwf8elsy	Nova partida agendada	vs Real Sociedad em 22/08/2026, 18:00 · Areninha do Flamenguinho	/matches/cmsx2wppc000004ldfwf8elsy	t	2026-08-17 10:16:25.028	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsweu95k001704jutig26bdc	cmpe0mtc4000004l1e0lft0uf	match-result-cmsd9fo2a000004l80caeqs67-cmpe0mtc4000004l1e0lft0uf	Resultado registrado	vs Metrópole City: 2 x 1	/matches/cmsd9fo2a000004l80caeqs67	t	2026-08-16 23:02:39.32	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsx2wptv001304ldvahtue4q	cmpgvd0wc000004jnbt334ki3	match-scheduled-cmsx2wppc000004ldfwf8elsy	Nova partida agendada	vs Real Sociedad em 22/08/2026, 18:00 · Areninha do Flamenguinho	/matches/cmsx2wppc000004ldfwf8elsy	f	2026-08-17 10:16:25.028	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt0aw2in000o04jy585o44rk	cmpho0wwq000004jspb58zuwi	match-scheduled-cmt0aw2dv000004jyn5mtmejp	Nova partida agendada	vs Time B em 23/08/2026, 21:00 · Areninha do Antônio Bezerra	/matches/cmt0aw2dv000004jyn5mtmejp	f	2026-08-19 16:23:10.28	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt0aw2in000y04jy3r34z6sm	cmpd7uwm8000004kyio7v783x	match-scheduled-cmt0aw2dv000004jyn5mtmejp	Nova partida agendada	vs Time B em 23/08/2026, 21:00 · Areninha do Antônio Bezerra	/matches/cmt0aw2dv000004jyn5mtmejp	f	2026-08-19 16:23:10.281	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt0aw2io000z04jyek4o2e1w	cmpd6e4q8000004i63b1ut2sx	match-scheduled-cmt0aw2dv000004jyn5mtmejp	Nova partida agendada	vs Time B em 23/08/2026, 21:00 · Areninha do Antônio Bezerra	/matches/cmt0aw2dv000004jyn5mtmejp	f	2026-08-19 16:23:10.281	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt0aw2io001004jy2y0cdcmi	cmsd7iqxr000004ky22nwg8cq	match-scheduled-cmt0aw2dv000004jyn5mtmejp	Nova partida agendada	vs Time B em 23/08/2026, 21:00 · Areninha do Antônio Bezerra	/matches/cmt0aw2dv000004jyn5mtmejp	f	2026-08-19 16:23:10.281	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt0aw2in000q04jyxh9d3irf	cmrqjkn0m000004l6bos51jnk	match-scheduled-cmt0aw2dv000004jyn5mtmejp	Nova partida agendada	vs Time B em 23/08/2026, 21:00 · Areninha do Antônio Bezerra	/matches/cmt0aw2dv000004jyn5mtmejp	f	2026-08-19 16:23:10.28	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt0aw2in000t04jytd58jlos	cmpj3d4t9000004jvh7z169sm	match-scheduled-cmt0aw2dv000004jyn5mtmejp	Nova partida agendada	vs Time B em 23/08/2026, 21:00 · Areninha do Antônio Bezerra	/matches/cmt0aw2dv000004jyn5mtmejp	f	2026-08-19 16:23:10.28	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt0aw2io001404jys3itbnv4	cmpcnpofw000004k4ig2qwx60	match-scheduled-cmt0aw2dv000004jyn5mtmejp	Nova partida agendada	vs Time B em 23/08/2026, 21:00 · Areninha do Antônio Bezerra	/matches/cmt0aw2dv000004jyn5mtmejp	f	2026-08-19 16:23:10.281	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt0aw2io001304jyivq6hw8o	cmpgvd0wc000004jnbt334ki3	match-scheduled-cmt0aw2dv000004jyn5mtmejp	Nova partida agendada	vs Time B em 23/08/2026, 21:00 · Areninha do Antônio Bezerra	/matches/cmt0aw2dv000004jyn5mtmejp	f	2026-08-19 16:23:10.281	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt0aw2io001504jydfvd12ik	cmpctqpqx000004jv6uocm5mt	match-scheduled-cmt0aw2dv000004jyn5mtmejp	Nova partida agendada	vs Time B em 23/08/2026, 21:00 · Areninha do Antônio Bezerra	/matches/cmt0aw2dv000004jyn5mtmejp	f	2026-08-19 16:23:10.281	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt0aw2io001604jy1xlx0db2	cmpfrajwz000104ik62ehuwer	match-scheduled-cmt0aw2dv000004jyn5mtmejp	Nova partida agendada	vs Time B em 23/08/2026, 21:00 · Areninha do Antônio Bezerra	/matches/cmt0aw2dv000004jyn5mtmejp	f	2026-08-19 16:23:10.281	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt0aw2in000w04jy1shi5g7k	cmpcrj7ws000004l8oescls0l	match-scheduled-cmt0aw2dv000004jyn5mtmejp	Nova partida agendada	vs Time B em 23/08/2026, 21:00 · Areninha do Antônio Bezerra	/matches/cmt0aw2dv000004jyn5mtmejp	f	2026-08-19 16:23:10.281	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt0aw2in000r04jy2024juok	cmpfmz33y000004lelcgdyt4f	match-scheduled-cmt0aw2dv000004jyn5mtmejp	Nova partida agendada	vs Time B em 23/08/2026, 21:00 · Areninha do Antônio Bezerra	/matches/cmt0aw2dv000004jyn5mtmejp	f	2026-08-19 16:23:10.28	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt0aw2io001704jyc1545ggi	cmph1sypn000004ie5zqjr8k3	match-scheduled-cmt0aw2dv000004jyn5mtmejp	Nova partida agendada	vs Time B em 23/08/2026, 21:00 · Areninha do Antônio Bezerra	/matches/cmt0aw2dv000004jyn5mtmejp	f	2026-08-19 16:23:10.281	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt0aw2iw001804jyp4z9pckw	cmpfio3qi000104l5wxmm0bie	match-scheduled-cmt0aw2dv000004jyn5mtmejp	Nova partida agendada	vs Time B em 23/08/2026, 21:00 · Areninha do Antônio Bezerra	/matches/cmt0aw2dv000004jyn5mtmejp	f	2026-08-19 16:23:10.281	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt0aw2in000u04jydgm49mji	cmpcoy9by000504l8sw41rlak	match-scheduled-cmt0aw2dv000004jyn5mtmejp	Nova partida agendada	vs Time B em 23/08/2026, 21:00 · Areninha do Antônio Bezerra	/matches/cmt0aw2dv000004jyn5mtmejp	f	2026-08-19 16:23:10.281	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt0aw2in000s04jyfu1iixth	cmpn1yeh5000104jrhfyq0v6c	match-scheduled-cmt0aw2dv000004jyn5mtmejp	Nova partida agendada	vs Time B em 23/08/2026, 21:00 · Areninha do Antônio Bezerra	/matches/cmt0aw2dv000004jyn5mtmejp	f	2026-08-19 16:23:10.28	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt0aw2iw001904jyx841vtd9	cmpej13hk000004l9f9eng6ul	match-scheduled-cmt0aw2dv000004jyn5mtmejp	Nova partida agendada	vs Time B em 23/08/2026, 21:00 · Areninha do Antônio Bezerra	/matches/cmt0aw2dv000004jyn5mtmejp	f	2026-08-19 16:23:10.281	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt0aw2iw001a04jyz0wzcs7a	cmpd8r2um000004jol7zvu96b	match-scheduled-cmt0aw2dv000004jyn5mtmejp	Nova partida agendada	vs Time B em 23/08/2026, 21:00 · Areninha do Antônio Bezerra	/matches/cmt0aw2dv000004jyn5mtmejp	f	2026-08-19 16:23:10.281	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt0aw2in000p04jy48src3ou	cmphnuh3t000104larhmey34t	match-scheduled-cmt0aw2dv000004jyn5mtmejp	Nova partida agendada	vs Time B em 23/08/2026, 21:00 · Areninha do Antônio Bezerra	/matches/cmt0aw2dv000004jyn5mtmejp	f	2026-08-19 16:23:10.28	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt0aw2in000v04jy3wt8q3jh	cmpfv2qt3000004jpb1uotoby	match-scheduled-cmt0aw2dv000004jyn5mtmejp	Nova partida agendada	vs Time B em 23/08/2026, 21:00 · Areninha do Antônio Bezerra	/matches/cmt0aw2dv000004jyn5mtmejp	f	2026-08-19 16:23:10.281	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt0aw2io001204jywnfvz5sk	cmsthgz8f000004l7pd5vnm0o	match-scheduled-cmt0aw2dv000004jyn5mtmejp	Nova partida agendada	vs Time B em 23/08/2026, 21:00 · Areninha do Antônio Bezerra	/matches/cmt0aw2dv000004jyn5mtmejp	t	2026-08-19 16:23:10.281	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt5xm1db000m04i5dirfxu0g	cmpfv2qt3000004jpb1uotoby	match-result-cmsx2wppc000004ldfwf8elsy-cmpfv2qt3000004jpb1uotoby	Resultado registrado	vs Real Sociedad: 0 x 4	/matches/cmsx2wppc000004ldfwf8elsy	f	2026-08-23 14:58:04.272	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt5xm1db000l04i5dpncg90q	cmpfmz33y000004lelcgdyt4f	match-result-cmsx2wppc000004ldfwf8elsy-cmpfmz33y000004lelcgdyt4f	Resultado registrado	vs Real Sociedad: 0 x 4	/matches/cmsx2wppc000004ldfwf8elsy	f	2026-08-23 14:58:04.272	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt5xm1dc000u04i5dkr5p6fw	cmpho0wwq000004jspb58zuwi	match-result-cmsx2wppc000004ldfwf8elsy-cmpho0wwq000004jspb58zuwi	Resultado registrado	vs Real Sociedad: 0 x 4	/matches/cmsx2wppc000004ldfwf8elsy	f	2026-08-23 14:58:04.272	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt0aw2in000x04jye1oe9ibz	cmpe0mtc4000004l1e0lft0uf	match-scheduled-cmt0aw2dv000004jyn5mtmejp	Nova partida agendada	vs Time B em 23/08/2026, 21:00 · Areninha do Antônio Bezerra	/matches/cmt0aw2dv000004jyn5mtmejp	t	2026-08-19 16:23:10.281	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt5xm1dc000s04i5y0lesdxr	cmpcnpofw000004k4ig2qwx60	match-result-cmsx2wppc000004ldfwf8elsy-cmpcnpofw000004k4ig2qwx60	Resultado registrado	vs Real Sociedad: 0 x 4	/matches/cmsx2wppc000004ldfwf8elsy	f	2026-08-23 14:58:04.272	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt5xm1db000n04i5n8bl9xvv	cmpgvd0wc000004jnbt334ki3	match-result-cmsx2wppc000004ldfwf8elsy-cmpgvd0wc000004jnbt334ki3	Resultado registrado	vs Real Sociedad: 0 x 4	/matches/cmsx2wppc000004ldfwf8elsy	f	2026-08-23 14:58:04.272	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt5xm1dc000r04i53prgj5qe	cmpfio3qi000104l5wxmm0bie	match-result-cmsx2wppc000004ldfwf8elsy-cmpfio3qi000104l5wxmm0bie	Resultado registrado	vs Real Sociedad: 0 x 4	/matches/cmsx2wppc000004ldfwf8elsy	f	2026-08-23 14:58:04.272	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt6fj1pc001i04jqy6jhn0t4	cmpcoy9by000504l8sw41rlak	match-result-cmt0aw2dv000004jyn5mtmejp-cmpcoy9by000504l8sw41rlak	Resultado registrado	vs Time B: 3 x 3	/matches/cmt0aw2dv000004jyn5mtmejp	f	2026-08-23 23:19:37.825	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt6fj1pc001l04jquwdl3gsg	cmpd6e4q8000004i63b1ut2sx	match-result-cmt0aw2dv000004jyn5mtmejp-cmpd6e4q8000004i63b1ut2sx	Resultado registrado	vs Time B: 3 x 3	/matches/cmt0aw2dv000004jyn5mtmejp	f	2026-08-23 23:19:37.825	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt6fj1pc001m04jqtwuv3gqk	cmpfrajwz000104ik62ehuwer	match-result-cmt0aw2dv000004jyn5mtmejp-cmpfrajwz000104ik62ehuwer	Resultado registrado	vs Time B: 3 x 3	/matches/cmt0aw2dv000004jyn5mtmejp	f	2026-08-23 23:19:37.825	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt6fj1pd001q04jq96moiz9b	cmpfmz33y000004lelcgdyt4f	match-result-cmt0aw2dv000004jyn5mtmejp-cmpfmz33y000004lelcgdyt4f	Resultado registrado	vs Time B: 3 x 3 · Sua atuação: 1 gol	/matches/cmt0aw2dv000004jyn5mtmejp	f	2026-08-23 23:19:37.825	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt6fj1p4001b04jqb3z0yt2l	cmpj3d4t9000004jvh7z169sm	match-result-cmt0aw2dv000004jyn5mtmejp-cmpj3d4t9000004jvh7z169sm	Resultado registrado	vs Time B: 3 x 3	/matches/cmt0aw2dv000004jyn5mtmejp	f	2026-08-23 23:19:37.825	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt6fj1pc001g04jq9r2w8bmt	cmph1sypn000004ie5zqjr8k3	match-result-cmt0aw2dv000004jyn5mtmejp-cmph1sypn000004ie5zqjr8k3	Resultado registrado	vs Time B: 3 x 3	/matches/cmt0aw2dv000004jyn5mtmejp	f	2026-08-23 23:19:37.825	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt0aw2io001104jyg7k339w6	cmphed7dz000104l1vt5dsakr	match-scheduled-cmt0aw2dv000004jyn5mtmejp	Nova partida agendada	vs Time B em 23/08/2026, 21:00 · Areninha do Antônio Bezerra	/matches/cmt0aw2dv000004jyn5mtmejp	t	2026-08-19 16:23:10.281	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt5xm1dc000t04i5btsguu7c	cmpcrj7ws000004l8oescls0l	match-result-cmsx2wppc000004ldfwf8elsy-cmpcrj7ws000004l8oescls0l	Resultado registrado	vs Real Sociedad: 0 x 4	/matches/cmsx2wppc000004ldfwf8elsy	f	2026-08-23 14:58:04.272	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt5xm1dc000q04i5d69tmqx7	cmpej13hk000004l9f9eng6ul	match-result-cmsx2wppc000004ldfwf8elsy-cmpej13hk000004l9f9eng6ul	Resultado registrado	vs Real Sociedad: 0 x 4	/matches/cmsx2wppc000004ldfwf8elsy	f	2026-08-23 14:58:04.272	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt5xm1dc000o04i5qydh7o07	cmpd6e4q8000004i63b1ut2sx	match-result-cmsx2wppc000004ldfwf8elsy-cmpd6e4q8000004i63b1ut2sx	Resultado registrado	vs Real Sociedad: 0 x 4	/matches/cmsx2wppc000004ldfwf8elsy	f	2026-08-23 14:58:04.272	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt6fj1pc001h04jq9calewe6	cmpcrj7ws000004l8oescls0l	match-result-cmt0aw2dv000004jyn5mtmejp-cmpcrj7ws000004l8oescls0l	Resultado registrado	vs Time B: 3 x 3	/matches/cmt0aw2dv000004jyn5mtmejp	f	2026-08-23 23:19:37.825	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt6fj1p4001c04jqszgqb1yt	cmpcnpofw000004k4ig2qwx60	match-result-cmt0aw2dv000004jyn5mtmejp-cmpcnpofw000004k4ig2qwx60	Resultado registrado	vs Time B: 3 x 3	/matches/cmt0aw2dv000004jyn5mtmejp	f	2026-08-23 23:19:37.825	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsnjw3i4001504l76kt2mdel	cmpe0mtc4000004l1e0lft0uf	match-scheduled-cmsnjw3d4000004l73omej79w	Nova partida agendada	vs IEIS em 13/08/2026, 23:00 · Areninha do Parque Santo Antônio	/matches/cmsnjw3d4000004l73omej79w	t	2026-08-10 18:14:07.805	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmsx2wptv000x04ldjmpbhp6l	cmpe0mtc4000004l1e0lft0uf	match-scheduled-cmsx2wppc000004ldfwf8elsy	Nova partida agendada	vs Real Sociedad em 22/08/2026, 18:00 · Areninha do Flamenguinho	/matches/cmsx2wppc000004ldfwf8elsy	t	2026-08-17 10:16:25.028	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt5xm1dc000p04i5hm8vs2iq	cmpe0mtc4000004l1e0lft0uf	match-result-cmsx2wppc000004ldfwf8elsy-cmpe0mtc4000004l1e0lft0uf	Resultado registrado	vs Real Sociedad: 0 x 4	/matches/cmsx2wppc000004ldfwf8elsy	t	2026-08-23 14:58:04.272	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt6fj1p3001a04jqbcc20ax9	cmsd7iqxr000004ky22nwg8cq	match-result-cmt0aw2dv000004jyn5mtmejp-cmsd7iqxr000004ky22nwg8cq	Resultado registrado	vs Time B: 3 x 3	/matches/cmt0aw2dv000004jyn5mtmejp	f	2026-08-23 23:19:37.825	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt6fj1p3001904jq1wjm4lma	cmpn1yeh5000104jrhfyq0v6c	match-result-cmt0aw2dv000004jyn5mtmejp-cmpn1yeh5000104jrhfyq0v6c	Resultado registrado	vs Time B: 3 x 3	/matches/cmt0aw2dv000004jyn5mtmejp	f	2026-08-23 23:19:37.825	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt6fj1pc001k04jqw4a537o2	cmpfio3qi000104l5wxmm0bie	match-result-cmt0aw2dv000004jyn5mtmejp-cmpfio3qi000104l5wxmm0bie	Resultado registrado	vs Time B: 3 x 3	/matches/cmt0aw2dv000004jyn5mtmejp	f	2026-08-23 23:19:37.825	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt6fj1pc001j04jqwja9fyfw	cmpctqpqx000004jv6uocm5mt	match-result-cmt0aw2dv000004jyn5mtmejp-cmpctqpqx000004jv6uocm5mt	Resultado registrado	vs Time B: 3 x 3	/matches/cmt0aw2dv000004jyn5mtmejp	f	2026-08-23 23:19:37.825	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt6fj1pd001n04jqjtxyag2f	cmpho0wwq000004jspb58zuwi	match-result-cmt0aw2dv000004jyn5mtmejp-cmpho0wwq000004jspb58zuwi	Resultado registrado	vs Time B: 3 x 3 · Sua atuação: 1 gol	/matches/cmt0aw2dv000004jyn5mtmejp	f	2026-08-23 23:19:37.825	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt6fj1pd001o04jqdxtmbxhz	cmpd8r2um000004jol7zvu96b	match-result-cmt0aw2dv000004jyn5mtmejp-cmpd8r2um000004jol7zvu96b	Resultado registrado	vs Time B: 3 x 3	/matches/cmt0aw2dv000004jyn5mtmejp	f	2026-08-23 23:19:37.825	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt6fj1pd001p04jq87irxc6r	cmpgvd0wc000004jnbt334ki3	match-result-cmt0aw2dv000004jyn5mtmejp-cmpgvd0wc000004jnbt334ki3	Resultado registrado	vs Time B: 3 x 3	/matches/cmt0aw2dv000004jyn5mtmejp	f	2026-08-23 23:19:37.825	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt6fj1p4001d04jq9jwdv8xl	cmpej13hk000004l9f9eng6ul	match-result-cmt0aw2dv000004jyn5mtmejp-cmpej13hk000004l9f9eng6ul	Resultado registrado	vs Time B: 3 x 3	/matches/cmt0aw2dv000004jyn5mtmejp	f	2026-08-23 23:19:37.825	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt6fj1pc001f04jqi9b9xu8g	cmsthgz8f000004l7pd5vnm0o	match-result-cmt0aw2dv000004jyn5mtmejp-cmsthgz8f000004l7pd5vnm0o	Resultado registrado	vs Time B: 3 x 3	/matches/cmt0aw2dv000004jyn5mtmejp	t	2026-08-23 23:19:37.825	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
cmt6fj1p4001e04jqdowolje1	cmpe0mtc4000004l1e0lft0uf	match-result-cmt0aw2dv000004jyn5mtmejp-cmpe0mtc4000004l1e0lft0uf	Resultado registrado	vs Time B: 3 x 3	/matches/cmt0aw2dv000004jyn5mtmejp	t	2026-08-23 23:19:37.825	\N	\N	\N	\N	\N	cmpbkj695000004jxaktrnbvc
\.
COPY public.open_match_slots (id, "teamId", date, "timeLabel", "venueLabel", notes, status, "createdAt", "updatedAt") FROM stdin;
\.
COPY public.player_availability_rules (id, "playerId", "dayOfWeek", "startMinutes", "endMinutes", frequency, availability, notes, "createdAt", "updatedAt") FROM stdin;
\.
COPY public.player_evaluations (id, "playerId", "evaluatorId", content, technical, tactical, physical, discipline, date, "teamId", "createdAt", "updatedAt") FROM stdin;
cmrtrk5el000004jms26qffht	cmrozuqv4000104l5tbza8qgy	cmpe0mtc4000004l1e0lft0uf	Ganho muito com sua função de Volante por saber sair jogando e realizar desafogamentos com lançamentos para o outro lado do campo. Você tem um papel de construtor de jogo recuado, que faz ligamento ao nosso meio campo e ala. Prezar pelos passes curtos para ditarmos o ritmo de jogo.	4	4	3	4	2026-07-20 00:00:00	cmpbkj695000004jxaktrnbvc	2026-07-20 21:55:42.045	2026-07-20 21:56:07.941
cmrtroptm000004jf0k9is7c7	cmpfk8v2v000704jlp8siky9e	cmpe0mtc4000004l1e0lft0uf	Jogador versátil que pretendo usá-lo de Ala em alguns jogos e dependendo da situação do jogo Atacante pela ponta. Boa velocidade, posicionamento correto no que se pede, espero mais ações no ataque sem medo. O ataque está sendo pelo lado esquerdo, pode progredir sem medo para entrar na área adversária e pegar uma possível sobra, no contrário, havendo perca de bola pelo ataque do lado esquerdo, volte rapidamente para fechar a linha defensiva.	3	3	4	3	2026-07-20 00:00:00	cmpbkj695000004jxaktrnbvc	2026-07-20 21:59:15.13	2026-07-20 21:59:15.13
cmrtrr443000104jmi0j22xys	cmpcoxez0000304l8g40zcfou	cmpe0mtc4000004l1e0lft0uf	Não vou exigir de mais, sabemos das suas limitações e ficamos felizes por também ter consciência. Ao entrar nos jogos espero bastante vontade, que nem no penúltimo jogo que realizou uma assistência e no último que jogou o jogo todo na função de zagueiro. Parabéns.	2	2	1	4	2026-07-20 00:00:00	cmpbkj695000004jxaktrnbvc	2026-07-20 22:01:06.963	2026-07-20 22:01:06.963
cmrtruxoh000204jm4kmjc5zc	cmpcpimjz000004jpcdqgfhfx	cmpe0mtc4000004l1e0lft0uf	Vem fazendo boas atuações no meio campo, faltando alguns ajustes como no caso de segurar muito a bola e acabar que trancando o jogo, mas fora isso não tenho no momento o que pedir para consertar. O que peço de você nos jogos é que faça uma posição de meio campo pela direita ou esquerda, ataque está sendo pela esquerda, você vai fazer a pressão. O ataque está do lado direito, você vem fechando mais centralizado sem ter necessidade de se mandar la para o outro lado e deixar sua posição sozinha.	4	3	3	4	2026-07-20 00:00:00	cmpbkj695000004jxaktrnbvc	2026-07-20 22:04:05.249	2026-07-20 22:04:05.249
cmrtrxb48000104jfpegzl9o2	cmpct94t9000204jsxeeckk3m	cmpe0mtc4000004l1e0lft0uf	Sua posição no mercado é a de Atacante, nos últimos jogos que jogou como Atacante veio fazendo o que foi pedido corretamente, fazendo a primeira pressão e caindo para os dois lados do campo.	3	3	3	4	2026-07-20 00:00:00	cmpbkj695000004jxaktrnbvc	2026-07-20 22:05:55.976	2026-07-20 22:05:55.976
cmrtrw1um000304jm6qihl0rh	cmpcsds4s000004jmgpwku1j2	cmpe0mtc4000004l1e0lft0uf	Mais movimentações ofensivas.	3	4	4	3	2026-07-20 00:00:00	cmpbkj695000004jxaktrnbvc	2026-07-20 22:04:57.311	2026-07-20 22:06:10.288
cmrts1ki6000204jfte01b4fj	cmpefcd1z000004lasd2r1kdh	cmpe0mtc4000004l1e0lft0uf	Sem muito o que observar, um do elenco que mais faz quase perfeitamente sua função. O que espero dos Alas é que participem bastante no ataque, e vimos com seus gols que está a vontade em campo para fazer o melhor que sabe. Continue fazendo essas movimentações ofensivas quando for do seu lado esquerdo construindo jogadas, caso o ataque esteja sendo do lado direito, se projete do lado esquerdo para uma possível virada de jogo, e se tivermos no último terço (ataque), ataque a área adeversária para uma bola sobrada ou cruzamento.	4	4	3	4	2026-07-20 00:00:00	cmpbkj695000004jxaktrnbvc	2026-07-20 22:09:14.766	2026-07-20 22:09:14.766
cmrts3wop000404jmxyomp5wl	cmpefcqj2000104ladlx0ysjz	cmpe0mtc4000004l1e0lft0uf	Um dos melhores jogadores ofensivos que temos no elenco e com um poder de fazer gol, deixando a desejar algumas vezes por falta de decisão no que fazer na cara do gol. Jogando de Meio campo e Atacante, peço que utilize os dois lados do campo, pois precisamos de opções no ataque, não só do lado esquerdo.	4	3	4	4	2026-07-20 00:00:00	cmpbkj695000004jxaktrnbvc	2026-07-20 22:11:03.865	2026-07-20 22:11:03.865
cmrts7y15000504jmgp7w79s1	cmpcqf47m000004l85vce0gfh	cmpe0mtc4000004l1e0lft0uf	Peço que faça mais movimentações ofensivas, o ataque está pelo seu lado, avance. O ataque está pelo lado esquerdo, projete-se ao ataque, em caso do nosso ataque está no último terço (ataque), entre na área para um possível cruzamento ou bola sobrada. Defensivamente peço que volte rapidamente para fechar a linha defensiva, pelo seu lado volte fazendo marcação pressão.	4	3	4	3	2026-07-20 00:00:00	cmpbkj695000004jxaktrnbvc	2026-07-20 22:14:12.233	2026-07-20 22:14:12.233
cmrts9u4n000304jfsa4t172o	cmpcpt3n6000004l561lm2ja7	cmpe0mtc4000004l1e0lft0uf	Descobrindo novas funções e como já disse você vem nos últimos jogos fazendo uma boa atuação como zagueiro pela esquerda, como também não deixou a desejar como Ala. De zagueiro você está fazendo corretamente o que está sendo pedido. Ganhando ponto positivo e uma vaga nesse elenco.	4	4	3	4	2026-07-20 00:00:00	cmpbkj695000004jxaktrnbvc	2026-07-20 22:15:40.488	2026-07-20 22:15:40.488
cmrtsc2vs000604jm8ffdu1fg	cmpdz2mcq000104jr9xnhl4i0	cmpe0mtc4000004l1e0lft0uf	Um dos melhores jogadores do time, faz uma boa movimentação ofensiva com bola e sem bola. Dita o ritmo de jogo, chama a responsabilidade e ofereça aos jogadores o estilo de jogo da posse de bola, peça mais vezes a bola e dite o jogo, assim podemos tentar construir aos poucos essa tática.	5	5	3	4	2026-07-20 00:00:00	cmpbkj695000004jxaktrnbvc	2026-07-20 22:17:25.144	2026-07-20 22:17:54.703
cmrtsekk3000704jmxeirwvm2	cmpcov8jd000004l8umh13pux	cmpe0mtc4000004l1e0lft0uf	Ótima função de meio campo, fazendo o que está sendo pedido corretamente, vamos ditar o ritmo de jogo com passes/lançamento ao ataque quando for oportuno, busque os passes no ala, volante, meio ofensivo e na zaga.	4	4	4	4	2026-07-20 00:00:00	cmpbkj695000004jxaktrnbvc	2026-07-20 22:19:21.363	2026-07-20 22:19:21.363
\.
COPY public.players (id, name, "position", "shirtNumber", "photoUrl", status, "teamId", "createdAt", "updatedAt", "fullName", age, phone, description, "secondaryPosition", cpf) FROM stdin;
cmpefcqj2000104ladlx0ysjz	JR	FORWARD	11	\N	ACTIVE	cmpbkj695000004jxaktrnbvc	2026-05-20 18:58:03.47	2026-08-05 01:09:25.61	José Alves Pineo Júnior	\N	\N	\N	MIDFIELDER	083.562.503-66
cmpcpgupa000004l5ehnc0kjs	Natan Cherki	MIDFIELDER	15	\N	INACTIVE	cmpbkj695000004jxaktrnbvc	2026-05-19 14:05:39.31	2026-07-27 12:33:30.076	\N	\N	\N	\N	\N	\N
cmrozuqv4000104l5tbza8qgy	Berg	DEFENSIVE_MIDFIELDER	28	\N	ACTIVE	cmpbkj695000004jxaktrnbvc	2026-07-17 13:49:02.464	2026-08-05 01:13:45.453	Francisco Lindemberg da Silva	\N	\N	\N	DEFENDER	015.443.043-90
cmpfk8v2v000704jlp8siky9e	Darlan Menezes	RIGHT_WINGBACK	22	\N	ACTIVE	cmpbkj695000004jxaktrnbvc	2026-05-21 14:02:46.999	2026-08-02 17:08:10.146	Darlan Menezes	25	85991072343	\N	FORWARD	\N
cmpefd4zq000204la3jqyndzz	LK	LEFT_WINGER	7	\N	INACTIVE	cmpbkj695000004jxaktrnbvc	2026-05-20 18:58:22.214	2026-05-21 13:54:02.01	\N	\N	\N	\N	\N	\N
cmpn1o6et000004jrcnmw0gav	Tales Laion	DEFENSIVE_MIDFIELDER	8	\N	ACTIVE	cmpbkj695000004jxaktrnbvc	2026-05-26 19:44:58.229	2026-08-05 01:22:55.948	Tales Laion Matos Lacerda Silva	\N	\N	\N	MIDFIELDER	102.132.766-23
cmpct2xp7000004jsv1ujpe1r	Lukas Araújo	DEFENDER	13	\N	ACTIVE	cmpbkj695000004jxaktrnbvc	2026-05-19 15:46:48.475	2026-08-08 18:36:46.455	Lucas de Araújo	\N	\N	\N	\N	604.442.003-08
cmph7s4ma000004l727k39xdv	Francisco	DEFENDER	25	\N	INACTIVE	cmpbkj695000004jxaktrnbvc	2026-05-22 17:49:23.171	2026-05-22 17:49:31.274	\N	\N	\N	\N	\N	\N
cmpcoxez0000304l8g40zcfou	Dheryk Medeiros	FORWARD	20	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/09fed1b9-0ccc-4821-895d-c1084853a9b0.png	ACTIVE	cmpbkj695000004jxaktrnbvc	2026-05-19 13:50:32.46	2026-08-03 14:29:15.737	Alfredo Dheryk do Nascimento Medeiros	33	85998416458	\N	\N	841.917.672-91
cmpefdkyx000304la3k3nq9p9	Ricardo Filho	DEFENDER	3	\N	ACTIVE	cmpbkj695000004jxaktrnbvc	2026-05-20 18:58:42.921	2026-08-03 14:43:44.996	Jose Ricardo Carneiro filho	\N	\N	\N	\N	613.664.743-50
cmpcpimjz000004jpcdqgfhfx	Fagner Oliveira	MIDFIELDER	16	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/be13e1e6-6268-417d-9bcc-2cd6c308dabf.png	ACTIVE	cmpbkj695000004jxaktrnbvc	2026-05-19 14:07:02.063	2026-08-03 19:27:44.798	Fagner de Oliveira Lucas Filho	25	\N	\N	DEFENSIVE_MIDFIELDER	621.133.673-00
cmpcsds4s000004jmgpwku1j2	Ícaro Sampaio	RIGHT_WINGBACK	14	\N	ACTIVE	cmpbkj695000004jxaktrnbvc	2026-05-19 15:27:14.86	2026-08-08 19:10:51.811	Ícaro Sampaio	\N	\N	\N	DEFENDER	078.027.603-56
cmpg43u13000604l7y6t0hdtt	Poze	DEFENSIVE_MIDFIELDER	24	\N	INACTIVE	cmpbkj695000004jxaktrnbvc	2026-05-21 23:18:44.679	2026-07-04 07:13:20.634	\N	\N	\N	\N	\N	\N
cmpg41k59000004l7521hfcn4	Anderson	MIDFIELDER	23	\N	INACTIVE	cmpbkj695000004jxaktrnbvc	2026-05-21 23:16:58.557	2026-07-17 13:47:39.343	\N	\N	\N	\N	\N	\N
cmpcsehq1000104ibueo8dlm5	Marcos Antônio	RIGHT_WINGBACK	17	\N	ACTIVE	cmpbkj695000004jxaktrnbvc	2026-05-19 15:27:48.025	2026-08-10 20:11:41.522	Marcos Antonio	\N	\N	\N	FORWARD	622.860.913-07
cmpcov8jd000004l8umh13pux	Lucas Soares	MIDFIELDER	5	\N	ACTIVE	cmpbkj695000004jxaktrnbvc	2026-05-19 13:48:50.81	2026-07-20 21:44:40.481	\N	\N	\N	\N	RIGHT_WINGBACK	\N
cmsd6v73x000004jupd8tbvon	Henrique Jorge	FORWARD	29	\N	ACTIVE	cmpbkj695000004jxaktrnbvc	2026-08-03 12:11:49.053	2026-08-04 14:34:26.592	Henrique Jorge	\N	\N	\N	\N	066.577.743-46
cmpcpt3n6000004l561lm2ja7	Kaian Freire	DEFENDER	27	\N	ACTIVE	cmpbkj695000004jxaktrnbvc	2026-05-19 14:15:10.77	2026-08-03 14:56:16.072	Francisco Kaian Moreira Vasconcelos Freire	\N	\N	\N	LEFT_WINGBACK	074.926.793-35
cmst61960000104jvfkkcgzp4	Luiz Gustavo	DEFENSIVE_MIDFIELDER	30	\N	ACTIVE	cmpbkj695000004jxaktrnbvc	2026-08-14 16:32:50.856	2026-08-14 16:32:50.856	\N	\N	\N	\N	RIGHT_WINGER	\N
cmpcqf47m000004l85vce0gfh	Juninho	RIGHT_WINGBACK	2	\N	ACTIVE	cmpbkj695000004jxaktrnbvc	2026-05-19 14:32:17.938	2026-08-03 14:59:49.223	josé adriano barros lemos junior	\N	\N	\N	LEFT_WINGBACK	081.034.143-36
cmph7t8a1000004l9n8uic25p	Juan	LEFT_WINGBACK	26	\N	INACTIVE	cmpbkj695000004jxaktrnbvc	2026-05-22 17:50:14.57	2026-08-15 14:06:59.304	\N	\N	\N	\N	LEFT_WINGBACK	\N
cmpcm7sgp000004l1fp9o52ky	Wesley	DEFENDER	4	\N	ACTIVE	cmpbkj695000004jxaktrnbvc	2026-05-19 12:34:37.657	2026-08-03 15:05:18.119	Francisco Wesley Cruz Santos	\N	\N	\N	\N	071.699.473-90
cmpcopzu6000004jro3prr7ca	Matheus Pereira	FORWARD	19	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/5ba5c34a-f74a-4c35-870b-76f6c209b19e.jpg	ACTIVE	cmpbkj695000004jxaktrnbvc	2026-05-19 13:44:46.254	2026-07-21 16:56:00.378	Lorde pereira	30	85985580570	\N	FORWARD	\N
cmpdz3jpw000004jvdohsd2ri	Jardel Borges	RIGHT_WINGBACK	18	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/513c5867-be9e-43c6-ae19-7b621906b368.png	ACTIVE	cmpbkj695000004jxaktrnbvc	2026-05-20 11:23:00.884	2026-08-03 15:48:21.54	Francisco Jardel de Souza Borges	30	\N	\N	LEFT_WINGBACK	603.668.453-30
cmpefep0o000504laynrqmhnw	Vitão	DEFENDER	21	\N	ACTIVE	cmpbkj695000004jxaktrnbvc	2026-05-20 18:59:34.824	2026-08-03 16:08:57.946	Victor Hugo de Oliveira Barreto	\N	\N	\N	\N	667.778.878-88
cmpefcd1z000004lasd2r1kdh	Joaquim	LEFT_WINGBACK	6	\N	ACTIVE	cmpbkj695000004jxaktrnbvc	2026-05-20 18:57:46.007	2026-08-03 17:10:21.514	Joaquim Luiz da Silva Neto	\N	\N	\N	LEFT_WINGBACK	055.666.823-59
cmpdz2mcq000104jr9xnhl4i0	Leonardo	MIDFIELDER	10	\N	ACTIVE	cmpbkj695000004jxaktrnbvc	2026-05-20 11:22:17.642	2026-08-04 15:22:52.119	Francisco Leonardo Vidal Lima	\N	\N	\N	\N	077.390.213-93
cmpefdukz000404lanevrsp34	Ricardo	GOALKEEPER	1	\N	INACTIVE	cmpbkj695000004jxaktrnbvc	2026-05-20 18:58:55.379	2026-08-23 11:40:24.662	\N	\N	\N	\N	GOALKEEPER	\N
cmpct94t9000204jsxeeckk3m	Ivis Silva	FORWARD	12	\N	ACTIVE	cmpbkj695000004jxaktrnbvc	2026-05-19 15:51:37.629	2026-08-04 22:21:03.874	Ivis Paula da Silva	\N	\N	\N	FORWARD	027.111.223-95
\.
COPY public.punishment_accumulation_rules (id, "teamId", "sourceTypeId", "accumulateCount", "targetTypeId", "targetMatches", "expiryDays", "createdAt", "updatedAt") FROM stdin;
cmpigr5zh000004lbyuosnwo0	cmpbkj695000004jxaktrnbvc	cmpignhkl000004lam2q231rt	3	cmpignhkl000104laff88exvy	1	60	2026-05-23 14:48:21.005	2026-05-23 14:48:21.005
cmpl5ijix000004jus02jnt2g	cmpbkj695000004jxaktrnbvc	cmpigtkya000204laljnrvmrb	3	cmpignhkl000104laff88exvy	1	30	2026-05-25 11:57:01.401	2026-05-25 11:57:01.401
\.
COPY public.punishment_types (id, name, description, severity, "teamId", "createdAt", "updatedAt") FROM stdin;
cmpignhkl000004lam2q231rt	Advertência	Advertência padrão por indisciplina	WARNING	cmpbkj695000004jxaktrnbvc	2026-05-23 14:45:29.397	2026-05-23 14:45:29.397
cmpignhkl000104laff88exvy	Suspensão	Suspensão padrão de partidas	SUSPENSION	cmpbkj695000004jxaktrnbvc	2026-05-23 14:45:29.397	2026-05-23 14:45:29.397
cmpigtkya000204laljnrvmrb	Perca de tempo jogado	Vai perder tempo em campo.	WARNING	cmpbkj695000004jxaktrnbvc	2026-05-23 14:50:13.714	2026-05-23 14:50:13.714
\.
COPY public.push_subscriptions (id, "userId", endpoint, p256dh, auth, "createdAt") FROM stdin;
\.
COPY public.recruitment_requests (id, "teamId", name, contact, "position", message, "createdAt") FROM stdin;
\.
COPY public.rsvp_status_logs (id, "rsvpId", "playerId", "matchId", "oldStatus", "newStatus", "createdAt") FROM stdin;
cmrozq704000104k4qcfqqjh1	cmqp5jh9a000104jpt4qb925q	cmpcm7sgp000004l1fp9o52ky	cmqp5jh8b000004jp8k1q116l	PENDING	CONFIRMED	2026-07-17 13:45:30.1
cmrpebkud000104l7g33860sj	cmqp5jh9b000n04jpk3u1ismm	cmpn1o6et000004jrcnmw0gav	cmqp5jh8b000004jp8k1q116l	PENDING	CONFIRMED	2026-07-17 20:34:02.437
cmrped5im000304l7p568i6u6	cmqp5jh9b000k04jp7l6rhsg0	cmpcopzu6000004jro3prr7ca	cmqp5jh8b000004jp8k1q116l	PENDING	CONFIRMED	2026-07-17 20:35:15.886
cmrpezt3p000104kz8gyprov8	cmqp5jh9a000904jp2iuj7bdj	cmpcpimjz000004jpcdqgfhfx	cmqp5jh8b000004jp8k1q116l	PENDING	CONFIRMED	2026-07-17 20:52:52.885
cmrpfg5kv000104leab9ok36x	cmqp5jh9a000d04jp74o92vgb	cmpefep0o000504laynrqmhnw	cmqp5jh8b000004jp8k1q116l	PENDING	DECLINED	2026-07-17 21:05:35.551
cmrpi578a000104lesnls1hzd	cmqp5jh9a000f04jp5leohwse	cmpcsehq1000104ibueo8dlm5	cmqp5jh8b000004jp8k1q116l	PENDING	DECLINED	2026-07-17 22:21:03.323
cmrpmgm83000104jvzq9f4m4k	cmqp5jh9b000l04jp2lxrke48	cmpcpt3n6000004l561lm2ja7	cmqp5jh8b000004jp8k1q116l	PENDING	DECLINED	2026-07-18 00:21:54.435
cmrqbunk0000104kzlhxnajei	cmqp5jh9a000704jpbs7du3ah	cmpct94t9000204jsxeeckk3m	cmqp5jh8b000004jp8k1q116l	PENDING	DECLINED	2026-07-18 12:12:39.744
cmrqcjog3000104jlt1eyywhn	cmqp5jh9a000504jpqavkxrwn	cmpcsds4s000004jmgpwku1j2	cmqp5jh8b000004jp8k1q116l	PENDING	CONFIRMED	2026-07-18 12:32:07.299
cmrqck09t000304jlt44dcwqi	cmqp5jh9a000a04jpqd017xq8	cmpefcd1z000004lasd2r1kdh	cmqp5jh8b000004jp8k1q116l	PENDING	DECLINED	2026-07-18 12:32:22.625
cmrqcklgt000104l7viul8ush	cmqp5jh9b000m04jpwkcub4sz	cmpdz3jpw000004jvdohsd2ri	cmqp5jh8b000004jp8k1q116l	PENDING	DECLINED	2026-07-18 12:32:50.093
cmrqcpi04000104laq9pe2jdx	cmqp5jh9a000604jpfej8pjun	cmpct2xp7000004jsv1ujpe1r	cmqp5jh8b000004jp8k1q116l	PENDING	DECLINED	2026-07-18 12:36:38.884
cmrqd08cj000304la1qe5arar	cmqp5jh9b000j04jpwzdiwh9i	cmpcpgupa000004l5ehnc0kjs	cmqp5jh8b000004jp8k1q116l	PENDING	DECLINED	2026-07-18 12:44:59.587
cmrqfktpv000104l06ral0cl9	cmqp5jh9a000404jpd2dc7ffo	cmpcqf47m000004l85vce0gfh	cmqp5jh8b000004jp8k1q116l	PENDING	CONFIRMED	2026-07-18 13:56:59.635
cmrqgfhys000104l7t3e34kjs	cmqp5jh9a000b04jpka1istpl	cmpefdkyx000304la3k3nq9p9	cmqp5jh8b000004jp8k1q116l	PENDING	DECLINED	2026-07-18 14:20:50.74
cmrqikn3y000104jvdm20dd97	cmqp5jh9b000i04jp8ati2dr1	cmph7t8a1000004l9n8uic25p	cmqp5jh8b000004jp8k1q116l	PENDING	DECLINED	2026-07-18 15:20:49.918
cmrql0gih000104js94rdna3d	cmqp5jh9a000804jpk3fjxj0m	cmpdz2mcq000104jr9xnhl4i0	cmqp5jh8b000004jp8k1q116l	PENDING	CONFIRMED	2026-07-18 16:29:07.097
cmrql32bf000d04jr1p45ix74	cmqp5jh9b000o04jpp8w3rz1u	cmpfk8v2v000704jlp8siky9e	cmqp5jh8b000004jp8k1q116l	PENDING	DECLINED	2026-07-18 16:31:08.667
cmrqp1o8a000104jo4sgln23x	cmqp5jh9a000e04jplydyr20i	cmpefcqj2000104ladlx0ysjz	cmqp5jh8b000004jp8k1q116l	PENDING	CONFIRMED	2026-07-18 18:22:02.218
cmrqu03sn000104lb2lbugc1z	cmrozuqw9000304l5k5b77pct	cmrozuqv4000104l5tbza8qgy	cmqp5jh8b000004jp8k1q116l	PENDING	CONFIRMED	2026-07-18 20:40:47.16
cmrreqxpg000104jrwsaryjrw	cmqp5jh9a000204jpjr22u3mh	cmpcov8jd000004l8umh13pux	cmqp5jh8b000004jp8k1q116l	PENDING	DECLINED	2026-07-19 06:21:31.3
cmrtach80000104jvu00viwgd	cmrkxlnhn000304jor38ixntv	cmpcoxez0000304l8g40zcfou	cmrkxlng5000004jofpanlfev	PENDING	DECLINED	2026-07-20 13:53:50.64
cmrtan102000104jxr0htddjm	cmrkxlnhn000k04jootx3fst5	cmpcpt3n6000004l561lm2ja7	cmrkxlng5000004jofpanlfev	PENDING	CONFIRMED	2026-07-20 14:02:02.834
cmrtapa4p000104l6b5l27c8a	cmrkxlnhn000104jo2aiou5rt	cmpcm7sgp000004l1fp9o52ky	cmrkxlng5000004jofpanlfev	PENDING	CONFIRMED	2026-07-20 14:03:47.977
cmrtav8hz000h04l6b2t8bp84	cmrkxlnhn000j04jofooterzb	cmpcopzu6000004jro3prr7ca	cmrkxlng5000004jofpanlfev	PENDING	CONFIRMED	2026-07-20 14:08:25.799
cmrtb02fo000h04jvm2c8sqb2	cmrkxlnhn000404joz0nbpvw6	cmpcqf47m000004l85vce0gfh	cmrkxlng5000004jofpanlfev	PENDING	CONFIRMED	2026-07-20 14:12:11.221
cmrtc0mli000104kzguw32275	cmrkxlnhn000d04jon8ia0366	cmpefep0o000504laynrqmhnw	cmrkxlng5000004jofpanlfev	PENDING	CONFIRMED	2026-07-20 14:40:36.966
cmrtc8uvd000404l3xi3o9xc4	cmrkxlnhn000904jof8wzor4z	cmpcpimjz000004jpcdqgfhfx	cmrkxlng5000004jofpanlfev	PENDING	CONFIRMED	2026-07-20 14:47:00.937
cmrtd93ko000m04if40knay31	cmrkxlnhn000b04jormsh5x4g	cmpefdkyx000304la3k3nq9p9	cmrkxlng5000004jofpanlfev	PENDING	CONFIRMED	2026-07-20 15:15:11.832
cmrtffnju000104l4fb3dsje7	cmrkxlnhn000e04jo1mqdk58e	cmpefcqj2000104ladlx0ysjz	cmrkxlng5000004jofpanlfev	PENDING	CONFIRMED	2026-07-20 16:16:16.89
cmrtpggmv000104ky8oak2c06	cmrkxlnhn000a04johs9tq2cy	cmpefcd1z000004lasd2r1kdh	cmrkxlng5000004jofpanlfev	PENDING	CONFIRMED	2026-07-20 20:56:50.743
cmrtprp4g000304ky0v462tei	cmrkxlnhn000504jo58qgyvqr	cmpcsds4s000004jmgpwku1j2	cmrkxlng5000004jofpanlfev	PENDING	CONFIRMED	2026-07-20 21:05:34.96
cmrtte4ho000104jlsbpuo8c4	cmrkxlnhn000m04joujnwrf58	cmpn1o6et000004jrcnmw0gav	cmrkxlng5000004jofpanlfev	PENDING	CONFIRMED	2026-07-20 22:47:00.157
cmrtx1rpj000104ik4wkwnrdv	cmrkxlnhn000704jo98qpcrr7	cmpct94t9000204jsxeeckk3m	cmrkxlng5000004jofpanlfev	PENDING	CONFIRMED	2026-07-21 00:29:22.183
cmrtyc4w6000104l4a58l6x6y	cmrkxlnhn000f04jo1mdvbp8b	cmpcsehq1000104ibueo8dlm5	cmrkxlng5000004jofpanlfev	PENDING	DECLINED	2026-07-21 01:05:25.446
cmrtzrgc8000104ldczc928dq	cmrkxlnhn000h04jobiv1ry4m	cmph7t8a1000004l9n8uic25p	cmrkxlng5000004jofpanlfev	PENDING	DECLINED	2026-07-21 01:45:19.736
cmrumswb9000104ibxqp2c7dd	cmrkxlnhn000204jo4p62aga6	cmpcov8jd000004l8umh13pux	cmrkxlng5000004jofpanlfev	PENDING	DECLINED	2026-07-21 12:30:18.261
cmrupaf4e000104joufwik0mm	cmrkxlnhn000804jocf8e54w6	cmpdz2mcq000104jr9xnhl4i0	cmrkxlng5000004jofpanlfev	PENDING	CONFIRMED	2026-07-21 13:39:55.022
cmruqm8up000304jon3wma7pt	cmrozuqw9000404l5bhrtpnkn	cmrozuqv4000104l5tbza8qgy	cmrkxlng5000004jofpanlfev	PENDING	CONFIRMED	2026-07-21 14:17:06.385
cmrux2prc000104ld3ikpyz3t	cmrkxlnhn000i04joijbiixpe	cmpcpgupa000004l5ehnc0kjs	cmrkxlng5000004jofpanlfev	PENDING	DECLINED	2026-07-21 17:17:52.488
cmruz0wxg000104ji8znhvp5j	cmrkxlnhn000l04jocr86ffo2	cmpdz3jpw000004jvdohsd2ri	cmrkxlng5000004jofpanlfev	PENDING	DECLINED	2026-07-21 18:12:27.7
cmrw17hjj000104jstdaxxqwh	cmrkxlnhn000504jo58qgyvqr	cmpcsds4s000004jmgpwku1j2	cmrkxlng5000004jofpanlfev	CONFIRMED	DECLINED	2026-07-22 12:01:19.759
cmrw19o6r000804ju6u557uu9	cmrkxlnhn000504jo58qgyvqr	cmpcsds4s000004jmgpwku1j2	cmrkxlng5000004jofpanlfev	DECLINED	CONFIRMED	2026-07-22 12:03:01.683
cmrw1bks7000104l8pqnhj389	cmrkxlnhn000n04jo8qwx6q8c	cmpfk8v2v000704jlp8siky9e	cmrkxlng5000004jofpanlfev	PENDING	CONFIRMED	2026-07-22 12:04:30.583
cmrwdpkyf000104l7d8s22v97	cmrkxlnhn000d04jon8ia0366	cmpefep0o000504laynrqmhnw	cmrkxlng5000004jofpanlfev	CONFIRMED	DECLINED	2026-07-22 17:51:19.383
cmrwmpcos000104k3vbabwzwe	cmrkxlnhn000604jotqh0nis4	cmpct2xp7000004jsv1ujpe1r	cmrkxlng5000004jofpanlfev	PENDING	DECLINED	2026-07-22 22:03:05.212
cmry4p290000104lcl72ykmgq	cmrthsbfs000i04kycwi5xev9	cmpn1o6et000004jrcnmw0gav	cmrthsbf6000004kybfhn32yj	PENDING	CONFIRMED	2026-07-23 23:14:30.948
cmry4rs9z000104l7rvzxi7dt	cmrthsbfr000104kysx3nulhn	cmpcm7sgp000004l1fp9o52ky	cmrthsbf6000004kybfhn32yj	PENDING	CONFIRMED	2026-07-23 23:16:37.991
cmry4rwld000104l7hsw0kphs	cmrthsbfs000904kyyv2fu7wz	cmpefdkyx000304la3k3nq9p9	cmrthsbf6000004kybfhn32yj	PENDING	CONFIRMED	2026-07-23 23:16:43.585
cmry4tyr7000304l76xgedwjm	cmrthsbfs000f04ky21xevxpe	cmpcopzu6000004jro3prr7ca	cmrthsbf6000004kybfhn32yj	PENDING	DECLINED	2026-07-23 23:18:19.699
cmry5ypun000104la1w7f1c8m	cmrthsbfs000b04kyw1911413	cmpefep0o000504laynrqmhnw	cmrthsbf6000004kybfhn32yj	PENDING	DECLINED	2026-07-23 23:50:01.055
cmry6hdnv000104l8883218cl	cmrthsbfs000n04kyk8vaxgjv	cmpcqf47m000004l85vce0gfh	cmrthsbf6000004kybfhn32yj	PENDING	CONFIRMED	2026-07-24 00:04:31.723
cmryanluw000104jlsgggkkxd	cmrthsbfs000l04ky2gmvzr3t	cmpcpgupa000004l5ehnc0kjs	cmrthsbf6000004kybfhn32yj	PENDING	DECLINED	2026-07-24 02:01:20.744
cmryvz1af000104l1mlhkc4mn	cmrthsbfs000g04kysehrdqb2	cmpcpt3n6000004l561lm2ja7	cmrthsbf6000004kybfhn32yj	PENDING	CONFIRMED	2026-07-24 11:58:05.896
cmryx8rtl000104jzr648e6fc	cmrthsbfs000604kym2d9cl2o	cmpdz2mcq000104jr9xnhl4i0	cmrthsbf6000004kybfhn32yj	PENDING	CONFIRMED	2026-07-24 12:33:39.801
cmryz8w6n000804l8wnh0mls8	cmrthsbfs000d04kyvnm3cbra	cmpcsehq1000104ibueo8dlm5	cmrthsbf6000004kybfhn32yj	PENDING	DECLINED	2026-07-24 13:29:44.687
cmryzntcx000104lferdddsbs	cmrthsbfs000h04ky2gh9866e	cmpdz3jpw000004jvdohsd2ri	cmrthsbf6000004kybfhn32yj	PENDING	DECLINED	2026-07-24 13:41:20.865
cmrz0hvl5000804l8x2ud1u22	cmrthsbfs000m04ky1m21igbq	cmrozuqv4000104l5tbza8qgy	cmrthsbf6000004kybfhn32yj	PENDING	DECLINED	2026-07-24 14:04:43.433
cmrz2h8tj000104jzfpyokyld	cmrthsbfs000j04ky706lvh50	cmpfk8v2v000704jlp8siky9e	cmrthsbf6000004kybfhn32yj	PENDING	DECLINED	2026-07-24 15:00:13.159
cmrzauhe0000104l2ekqkpphe	cmrthsbfs000804kytea6c4hv	cmpefcd1z000004lasd2r1kdh	cmrthsbf6000004kybfhn32yj	PENDING	DECLINED	2026-07-24 18:54:27.72
cmrzcclhf000104l727y26hqq	cmrthsbfr000204ky1p7h4k58	cmpcov8jd000004l8umh13pux	cmrthsbf6000004kybfhn32yj	PENDING	DECLINED	2026-07-24 19:36:32.451
cmrzcdd1s000104l6i60grqpt	cmrthsbfs000e04ky5s3arxnk	cmph7t8a1000004l9n8uic25p	cmrthsbf6000004kybfhn32yj	PENDING	CONFIRMED	2026-07-24 19:37:08.176
cmrze3xzy000104jtv37uecya	cmrthsbfs000704kyz3olj884	cmpcpimjz000004jpcdqgfhfx	cmrthsbf6000004kybfhn32yj	PENDING	CONFIRMED	2026-07-24 20:25:47.998
cmrzl276z000104juceuo5tj9	cmrthsbfs000504kymmk5hgkw	cmpct94t9000204jsxeeckk3m	cmrthsbf6000004kybfhn32yj	PENDING	CONFIRMED	2026-07-24 23:40:23.915
cmrzn9t4i000104l717gwnxl0	cmrthsbfs000c04kyovrfo81y	cmpefcqj2000104ladlx0ysjz	cmrthsbf6000004kybfhn32yj	PENDING	CONFIRMED	2026-07-25 00:42:18.162
cms0gpgbk000104l7kil1gpli	cmrthsbfs000304kynxxn1ph9	cmpcoxez0000304l8g40zcfou	cmrthsbf6000004kybfhn32yj	PENDING	DECLINED	2026-07-25 14:26:16.928
cms0k4mv0000104k0n0n11291	cmrthsbfs000f04ky21xevxpe	cmpcopzu6000004jro3prr7ca	cmrthsbf6000004kybfhn32yj	DECLINED	CONFIRMED	2026-07-25 16:02:04.092
cms0loxtq000104juq0ci3cv4	cmrthsbfs000k04ky0dnu15u8	cmpct2xp7000004jsv1ujpe1r	cmrthsbf6000004kybfhn32yj	PENDING	DECLINED	2026-07-25 16:45:51.038
cms0ow0qn000104lij60g4jsy	cmrthsbfs000404ky6zqva55e	cmpcsds4s000004jmgpwku1j2	cmrthsbf6000004kybfhn32yj	PENDING	DECLINED	2026-07-25 18:15:20.255
cms39ej8e000404jxtep34vm3	cmrpgk0rb000j04jtpotzt3k8	cmpn1o6et000004jrcnmw0gav	cmrpgk0qh000004jttg2q1s11	PENDING	CONFIRMED	2026-07-27 13:25:08.702
cms3d86lw000104juhaefjl0p	cms3d5vgs000l04jx3nlpks9t	cmpcpimjz000004jpcdqgfhfx	cms3d5vfv000004jxuwwehm57	PENDING	CONFIRMED	2026-07-27 15:12:10.868
cms3d8ghh000104l7c91hk8f9	cms3d5vgs000k04jxpuzu3ugj	cmpn1o6et000004jrcnmw0gav	cms3d5vfv000004jxuwwehm57	PENDING	CONFIRMED	2026-07-27 15:12:23.669
cms3dcehv000804jsj5ngpsdu	cms3d5vgs000e04jxq82ld8lr	cmpcqf47m000004l85vce0gfh	cms3d5vfv000004jxuwwehm57	PENDING	CONFIRMED	2026-07-27 15:15:27.715
cms3ddf6h000v04jxp1hphrkc	cms3d5vgr000104jx32aanrdc	cmpcm7sgp000004l1fp9o52ky	cms3d5vfv000004jxuwwehm57	PENDING	CONFIRMED	2026-07-27 15:16:15.257
cms3dum8t000104latiqpcz1o	cms3d5vgs000404jxa8zjjl1r	cmpefdkyx000304la3k3nq9p9	cms3d5vfv000004jxuwwehm57	PENDING	CONFIRMED	2026-07-27 15:29:37.565
cms3dwqxi000304laoru1spji	cms3d5vgs000f04jxl0dl6xxe	cmpcov8jd000004l8umh13pux	cms3d5vfv000004jxuwwehm57	PENDING	CONFIRMED	2026-07-27 15:31:16.95
cms3e03wg000204l7g1hii8pd	cms3d5vgs000804jxk2qtjqi7	cmpdz3jpw000004jvdohsd2ri	cms3d5vfv000004jxuwwehm57	PENDING	CONFIRMED	2026-07-27 15:33:53.728
cms3eylao000404l71y7w3oyn	cms3d5vgs000604jxx1rfv5pd	cmpefep0o000504laynrqmhnw	cms3d5vfv000004jxuwwehm57	PENDING	CONFIRMED	2026-07-27 16:00:42.576
cms3f4a69000604l73dxwbf07	cms3d5vgs000304jx3bskxq56	cmpdz2mcq000104jr9xnhl4i0	cms3d5vfv000004jxuwwehm57	PENDING	CONFIRMED	2026-07-27 16:05:08.097
cms3f9nne000104jui6zz8emj	cms3d5vgs000m04jxvx3d9t19	cmpcopzu6000004jro3prr7ca	cms3d5vfv000004jxuwwehm57	PENDING	CONFIRMED	2026-07-27 16:09:18.842
cms3fti6m000104jvpj0uqp8v	cms3d5vgs000d04jxbj8rnjq2	cmrozuqv4000104l5tbza8qgy	cms3d5vfv000004jxuwwehm57	PENDING	CONFIRMED	2026-07-27 16:24:44.878
cms3gru1o000304ju3qyp4mpc	cms3d5vgr000204jxzcghkoik	cmpcoxez0000304l8g40zcfou	cms3d5vfv000004jxuwwehm57	PENDING	DECLINED	2026-07-27 16:51:26.556
cms3ize4s000104lelgett251	cms3d5vgs000b04jxqdf5dnyn	cmpcpt3n6000004l561lm2ja7	cms3d5vfv000004jxuwwehm57	PENDING	CONFIRMED	2026-07-27 17:53:18.412
cms3lsqk8000104k3zj5j47f3	cms3d5vgs000g04jxglwg0i88	cmpefcd1z000004lasd2r1kdh	cms3d5vfv000004jxuwwehm57	PENDING	CONFIRMED	2026-07-27 19:12:06.776
cms3nl3in000304k35yy9bwsv	cms3d5vgs000j04jx2cv0nl6t	cmpefcqj2000104ladlx0ysjz	cms3d5vfv000004jxuwwehm57	PENDING	CONFIRMED	2026-07-27 20:02:09.552
cms3oyn86000104jregqj56u7	cms3d5vgs000h04jxhwyqjzlj	cmpct94t9000204jsxeeckk3m	cms3d5vfv000004jxuwwehm57	PENDING	CONFIRMED	2026-07-27 20:40:41.238
cms3uaav7000104jwp91rtmgm	cms3d5vgs000c04jxmpt5wuz0	cmpct2xp7000004jsv1ujpe1r	cms3d5vfv000004jxuwwehm57	PENDING	CONFIRMED	2026-07-27 23:09:43.171
cms4sn55w000104ldbbigarq6	cmrpgk0rb000g04jtq9o572o8	cmpcopzu6000004jro3prr7ca	cmrpgk0qh000004jttg2q1s11	PENDING	CONFIRMED	2026-07-28 15:11:29.252
cms5yjn7q000104jskb2gqg13	cms3d5vgs000a04jxvlol6s6w	cmph7t8a1000004l9n8uic25p	cms3d5vfv000004jxuwwehm57	PENDING	CONFIRMED	2026-07-29 10:44:29.894
cms6mpzh7000404l5eanis4k4	cms3d5vgs000i04jxhrwpynwn	cmpcsds4s000004jmgpwku1j2	cms3d5vfv000004jxuwwehm57	PENDING	DECLINED	2026-07-29 22:01:16.507
cms6wxsjd000104jui7fq8fgz	cmrpgk0ra000804jtgep8lh4q	cmpcpimjz000004jpcdqgfhfx	cmrpgk0qh000004jttg2q1s11	PENDING	CONFIRMED	2026-07-30 02:47:16.922
cms6x1i7a000104lahuj7iv0b	cmrpgk0ra000904jtp9t0nmab	cmpefcd1z000004lasd2r1kdh	cmrpgk0qh000004jttg2q1s11	PENDING	CONFIRMED	2026-07-30 02:50:10.15
cms7e5ajr000104jopwyrlp2q	cmrpgk0ra000204jtp9coo66y	cmpcov8jd000004l8umh13pux	cmrpgk0qh000004jttg2q1s11	PENDING	CONFIRMED	2026-07-30 10:49:00.327
cms7ewhmp000104liqz2ahnuu	cmrpgk0ra000a04jtct2jv0gh	cmpefdkyx000304la3k3nq9p9	cmrpgk0qh000004jttg2q1s11	PENDING	CONFIRMED	2026-07-30 11:10:09.218
cms7fcwp1000104l5l23zl0ze	cmrpgk0ra000404jty7qeto3i	cmpcqf47m000004l85vce0gfh	cmrpgk0qh000004jttg2q1s11	PENDING	CONFIRMED	2026-07-30 11:22:55.237
cms7gdbu0000104jy6zhhbzo6	cmrpgk0rb000e04jt4p756rvk	cmpcsehq1000104ibueo8dlm5	cmrpgk0qh000004jttg2q1s11	PENDING	CONFIRMED	2026-07-30 11:51:14.472
cms7jkgqa000104le6yze8x40	cmrpgk0rb000h04jt5euo8clx	cmpcpt3n6000004l561lm2ja7	cmrpgk0qh000004jttg2q1s11	PENDING	CONFIRMED	2026-07-30 13:20:46.258
cms7oxd88000104jrd736dhgp	cmrpgk0ra000104jt8b9bvda8	cmpcm7sgp000004l1fp9o52ky	cmrpgk0qh000004jttg2q1s11	PENDING	CONFIRMED	2026-07-30 15:50:46.328
cms7pfxyy000104jtfyzvktmd	cmrpgk0rb000f04jttvl18skc	cmph7t8a1000004l9n8uic25p	cmrpgk0qh000004jttg2q1s11	PENDING	DECLINED	2026-07-30 16:05:13.018
cms7zxwcu000104la6g2h9in6	cmrpgk0rb000d04jtmow1ndl0	cmpefcqj2000104ladlx0ysjz	cmrpgk0qh000004jttg2q1s11	PENDING	CONFIRMED	2026-07-30 20:59:06.894
cms8um80r000104jr63htvag2	cmrpgk0ra000304jtanfccn0y	cmpcoxez0000304l8g40zcfou	cmrpgk0qh000004jttg2q1s11	PENDING	CONFIRMED	2026-07-31 11:17:50.235
cms8v0nu7000104joi618rkpd	cmrpgk0ra000204jtp9coo66y	cmpcov8jd000004l8umh13pux	cmrpgk0qh000004jttg2q1s11	CONFIRMED	DECLINED	2026-07-31 11:29:03.92
cms8v3wmu000104ktow3039w7	cmrpgk0rb000n04jt5r3u1b3t	cmrozuqv4000104l5tbza8qgy	cmrpgk0qh000004jttg2q1s11	PENDING	DECLINED	2026-07-31 11:31:35.286
cms9dvca8000104lg5kvec99m	cmrpgk0rb000i04jt4ah64sxm	cmpdz3jpw000004jvdohsd2ri	cmrpgk0qh000004jttg2q1s11	PENDING	DECLINED	2026-07-31 20:16:48.368
cms9i69va000204l43srb7jx5	cmrpgk0rb000l04jtb40jrx76	cmpct2xp7000004jsv1ujpe1r	cmrpgk0qh000004jttg2q1s11	PENDING	DECLINED	2026-07-31 22:17:16.918
cmsapxcpl000104ieiokppj3u	cmsadtjrs000m04joxs20uz5y	cmpcopzu6000004jro3prr7ca	cmsadtjr8000004joiy5e4pc7	PENDING	CONFIRMED	2026-08-01 18:42:03.801
cmsaqfmfg000104jrevgn2hs4	cmsadtjrs000l04joyfx7oz34	cmpcpimjz000004jpcdqgfhfx	cmsadtjr8000004joiy5e4pc7	PENDING	CONFIRMED	2026-08-01 18:56:16.204
cmsaqfv5k000304iegejhaokh	cmsadtjrs000j04jop1l0imol	cmpefcqj2000104ladlx0ysjz	cmsadtjr8000004joiy5e4pc7	PENDING	CONFIRMED	2026-08-01 18:56:27.512
cmsaql4jv000104lcl0rpw72y	cmsadtjrs000b04joysy2euty	cmpcpt3n6000004l561lm2ja7	cmsadtjr8000004joiy5e4pc7	PENDING	CONFIRMED	2026-08-01 19:00:32.971
cmsaqon3t000104ldet0ncm2p	cmsadtjrs000704jol7z02kl5	cmpcsehq1000104ibueo8dlm5	cmsadtjr8000004joiy5e4pc7	PENDING	CONFIRMED	2026-08-01 19:03:16.985
cmsawwjni000104l488lvhiqs	cmsadtjrr000104jonl3w9dbh	cmpcm7sgp000004l1fp9o52ky	cmsadtjr8000004joiy5e4pc7	PENDING	CONFIRMED	2026-08-01 21:57:23.454
cmsb14a8i000104jus3f1l4hb	cmsadtjrs000g04jocuc8mdrx	cmpefcd1z000004lasd2r1kdh	cmsadtjr8000004joiy5e4pc7	PENDING	CONFIRMED	2026-08-01 23:55:22.962
cmsbroh8d000104jsogirvpib	cmsadtjrs000c04jo7pkl3cyi	cmpct2xp7000004jsv1ujpe1r	cmsadtjr8000004joiy5e4pc7	PENDING	CONFIRMED	2026-08-02 12:18:55.165
cmsbsmiyl000104lc5kpupk4w	cmsadtjrs000804jochdsdsz6	cmpdz3jpw000004jvdohsd2ri	cmsadtjr8000004joiy5e4pc7	PENDING	CONFIRMED	2026-08-02 12:45:23.709
cmsbsnta4000304lcdv3qgw5l	cmsadtjrs000h04jowd1m9vy7	cmpct94t9000204jsxeeckk3m	cmsadtjr8000004joiy5e4pc7	PENDING	CONFIRMED	2026-08-02 12:46:23.74
cmsbulcb2000104l4w5yxuvma	cmsadtjrs000f04jofyry8huq	cmpcov8jd000004l8umh13pux	cmsadtjr8000004joiy5e4pc7	PENDING	DECLINED	2026-08-02 13:40:27.662
cmsbuo34w000104ih5ovacvtk	cmsadtjrs000a04jo1mrrpgut	cmph7t8a1000004l9n8uic25p	cmsadtjr8000004joiy5e4pc7	PENDING	DECLINED	2026-08-02 13:42:35.744
cmsbvscnu000104ldu7jh7fry	cmsadtjrs000e04jo9rkh0035	cmpcqf47m000004l85vce0gfh	cmsadtjr8000004joiy5e4pc7	PENDING	DECLINED	2026-08-02 14:13:54.33
cmsbxr9qw000104joxo1mnk10	cmsadtjrr000304joufh2j7uv	cmpdz2mcq000104jr9xnhl4i0	cmsadtjr8000004joiy5e4pc7	PENDING	CONFIRMED	2026-08-02 15:09:03.128
cmsbz4h96000104jvofccbmr1	cmsadtjrs000604joyxxfz6au	cmpefep0o000504laynrqmhnw	cmsadtjr8000004joiy5e4pc7	PENDING	CONFIRMED	2026-08-02 15:47:19.002
cmsc015yv000104k1u82m8iqz	cmsadtjrr000304joufh2j7uv	cmpdz2mcq000104jr9xnhl4i0	cmsadtjr8000004joiy5e4pc7	CONFIRMED	DECLINED	2026-08-02 16:12:44.023
cmsc55ik2000104juv4a4yeuc	cmsadtjrs000i04jowizbigwf	cmpcsds4s000004jmgpwku1j2	cmsadtjr8000004joiy5e4pc7	PENDING	CONFIRMED	2026-08-02 18:36:05.042
cmsc67vd4000104l9d8ylpjao	cmsadtjrr000204jo6izl62pu	cmpcoxez0000304l8g40zcfou	cmsadtjr8000004joiy5e4pc7	PENDING	DECLINED	2026-08-02 19:05:54.568
cmsc68z3r000304l9k22bodzd	cmsadtjrs000k04joiy69p4b9	cmpn1o6et000004jrcnmw0gav	cmsadtjr8000004joiy5e4pc7	PENDING	CONFIRMED	2026-08-02 19:06:46.071
cmsc96vcl000104l9digsjd91	cmsadtjrs000904jo366b8kw4	cmpfk8v2v000704jlp8siky9e	cmsadtjr8000004joiy5e4pc7	PENDING	CONFIRMED	2026-08-02 20:29:06.741
cmsd6f5b6000104jvs8oncrrw	cmpg3u3ld000o04las9ge6dd8	cmpcoxez0000304l8g40zcfou	cmpg3u3kh000l04la6hj2e5r3	PENDING	CONFIRMED	2026-08-03 11:59:20.226
cmsd6v1az000104l7zhf1gp5b	cmpg3u3ld001504la2fzq6awd	cmpcopzu6000004jro3prr7ca	cmpg3u3kh000l04la6hj2e5r3	PENDING	DECLINED	2026-08-03 12:11:41.531
cmsdaohhe000104jofudob2gi	cmpg3u3ld000v04lak8l08b7v	cmpdz3jpw000004jvdohsd2ri	cmpg3u3kh000l04la6hj2e5r3	PENDING	CONFIRMED	2026-08-03 13:58:34.37
cmsdatg9j000104l8j606zjyk	cmpg3u3ld000p04la0qn3qlfd	cmpcpt3n6000004l561lm2ja7	cmpg3u3kh000l04la6hj2e5r3	PENDING	CONFIRMED	2026-08-03 14:02:26.071
cmsdblnkf000104ju5ixlcmca	cmpg3u3ld000o04las9ge6dd8	cmpcoxez0000304l8g40zcfou	cmpg3u3kh000l04la6hj2e5r3	CONFIRMED	DECLINED	2026-08-03 14:24:21.903
cmsdbryc2000104ky9xzc92b7	cmpg3u3ld000o04las9ge6dd8	cmpcoxez0000304l8g40zcfou	cmpg3u3kh000l04la6hj2e5r3	DECLINED	CONFIRMED	2026-08-03 14:29:15.794
cmsdc0tv9000104kzfck3l9q7	cmpg3u3ld000p04la0qn3qlfd	cmpcpt3n6000004l561lm2ja7	cmpg3u3kh000l04la6hj2e5r3	CONFIRMED	PENDING	2026-08-03 14:36:09.909
cmsdc0w4f000104jrtedlpg8z	cmpg3u3ld000v04lak8l08b7v	cmpdz3jpw000004jvdohsd2ri	cmpg3u3kh000l04la6hj2e5r3	CONFIRMED	PENDING	2026-08-03 14:36:12.831
cmsdcal25000104l4r5dq8qxi	cmpg3u3ld000y04ladeaakhc5	cmpefdkyx000304la3k3nq9p9	cmpg3u3kh000l04la6hj2e5r3	PENDING	CONFIRMED	2026-08-03 14:43:45.053
cmsdco5p3000104jt5ifvcliq	cmpg3u3ld000p04la0qn3qlfd	cmpcpt3n6000004l561lm2ja7	cmpg3u3kh000l04la6hj2e5r3	PENDING	CONFIRMED	2026-08-03 14:54:18.327
cmsdcv930000104l45n3vjvqm	cmpg3u3ld000q04la1y6lf1w3	cmpcqf47m000004l85vce0gfh	cmpg3u3kh000l04la6hj2e5r3	PENDING	CONFIRMED	2026-08-03 14:59:49.308
cmsdd1sgu000104k20cpfj8hi	cmpg3u3ld000m04laubb2bf1h	cmpcm7sgp000004l1fp9o52ky	cmpg3u3kh000l04la6hj2e5r3	PENDING	CONFIRMED	2026-08-03 15:04:54.366
cmsdelo8b000104l4g7zpjqt7	cmpg3u3ld000v04lak8l08b7v	cmpdz3jpw000004jvdohsd2ri	cmpg3u3kh000l04la6hj2e5r3	PENDING	CONFIRMED	2026-08-03 15:48:21.611
cmsdfc68q000104l9sgdaoqmn	cmpg3u3ld001004la047wd2n5	cmpefep0o000504laynrqmhnw	cmpg3u3kh000l04la6hj2e5r3	PENDING	CONFIRMED	2026-08-03 16:08:58.01
cmsdhj4hn000104kyesv1i6ce	cmpg3u3ld000x04lanfpd6ako	cmpefcd1z000004lasd2r1kdh	cmpg3u3kh000l04la6hj2e5r3	PENDING	CONFIRMED	2026-08-03 17:10:21.563
cmsdmft34000104l5bj005m5j	cmpg3u3ld000w04lad9dw7hb8	cmpcpimjz000004jpcdqgfhfx	cmpg3u3kh000l04la6hj2e5r3	PENDING	CONFIRMED	2026-08-03 19:27:44.896
cmsdrm2dx000104jz1npswxm5	cmpg3u3ld001204la1beyvwtv	cmpcsehq1000104ibueo8dlm5	cmpg3u3kh000l04la6hj2e5r3	PENDING	CONFIRMED	2026-08-03 21:52:34.965
cmseregwu000104l4y1o9iqui	cmselxq94000004icny6d3mzd	cmsd6v73x000004jupd8tbvon	cmpg3u3kh000l04la6hj2e5r3	PENDING	CONFIRMED	2026-08-04 14:34:26.718
cmset4qtk000104l1yvhn4q65	cmpg3u3ld000u04las8f7rp2b	cmpdz2mcq000104jr9xnhl4i0	cmpg3u3kh000l04la6hj2e5r3	PENDING	CONFIRMED	2026-08-04 15:22:52.232
cmsf4uz56000104l4rzi9ls6z	cmpg3u3ld000r04lad6q4fb0r	cmpcsds4s000004jmgpwku1j2	cmpg3u3kh000l04la6hj2e5r3	PENDING	DECLINED	2026-08-04 20:51:11.85
cmsf82jqd000104k06p16bed5	cmpg3u3ld000t04lawn0d7m43	cmpct94t9000204jsxeeckk3m	cmpg3u3kh000l04la6hj2e5r3	PENDING	CONFIRMED	2026-08-04 22:21:03.973
cmsf96eg9000104juqwvp41t4	cmpg3u3ld000n04layam1mlj3	cmpcov8jd000004l8umh13pux	cmpg3u3kh000l04la6hj2e5r3	PENDING	DECLINED	2026-08-04 22:52:03.369
cmsfe3297000104i8n0my0393	cmpg3u3ld001104lazxa71fse	cmpefcqj2000104ladlx0ysjz	cmpg3u3kh000l04la6hj2e5r3	PENDING	CONFIRMED	2026-08-05 01:09:25.675
cmsfe8ms4000104lhts5zfryy	cmrozuqw9000204l5ysolywin	cmrozuqv4000104l5tbza8qgy	cmpg3u3kh000l04la6hj2e5r3	PENDING	CONFIRMED	2026-08-05 01:13:45.556
cmsfekfjf000104l7052usjvf	cmpn1o6fp000204jrv4toax73	cmpn1o6et000004jrcnmw0gav	cmpg3u3kh000l04la6hj2e5r3	PENDING	CONFIRMED	2026-08-05 01:22:56.043
cmsisfy7t000104l58eg639s0	cmpg3u3ld000q04la1y6lf1w3	cmpcqf47m000004l85vce0gfh	cmpg3u3kh000l04la6hj2e5r3	CONFIRMED	DECLINED	2026-08-07 10:14:40.121
cmskmyxjm000104l6fdvl9tk5	cmpg3u3ld000s04lacj526wmo	cmpct2xp7000004jsv1ujpe1r	cmpg3u3kh000l04la6hj2e5r3	PENDING	DECLINED	2026-08-08 17:17:00.37
cmskptim7000104jvv5k3eh8e	cmpg3u3ld000s04lacj526wmo	cmpct2xp7000004jsv1ujpe1r	cmpg3u3kh000l04la6hj2e5r3	DECLINED	CONFIRMED	2026-08-08 18:36:46.591
cmskr0odu000104kz38fi73ed	cmpg3u3ld000r04lad6q4fb0r	cmpcsds4s000004jmgpwku1j2	cmpg3u3kh000l04la6hj2e5r3	DECLINED	PENDING	2026-08-08 19:10:20.275
cmskr1crc000204jokvoamr6h	cmpg3u3ld000r04lad6q4fb0r	cmpcsds4s000004jmgpwku1j2	cmpg3u3kh000l04la6hj2e5r3	PENDING	CONFIRMED	2026-08-08 19:10:51.864
cmsl4o3tb000104jo2hkmamj3	cmsd9fo3d000m04l8xxda22kq	cmpcpimjz000004jpcdqgfhfx	cmsd9fo2a000004l80caeqs67	PENDING	CONFIRMED	2026-08-09 01:32:28.367
cmsnhlkya000104jox190jpeg	cmsd9fo3d000204l8lud44cx7	cmpcoxez0000304l8g40zcfou	cmsd9fo2a000004l80caeqs67	PENDING	CONFIRMED	2026-08-10 17:09:57.97
cmsnjxbbd000104jojqs47y4g	cmsnjw3dz000804l7kylxq2f1	cmpcoxez0000304l8g40zcfou	cmsnjw3d4000004l73omej79w	PENDING	CONFIRMED	2026-08-10 18:15:04.585
cmsnjyf05001j04l7r4hws1gf	cmsnjw3dz000904l74yabewpu	cmpefdkyx000304la3k3nq9p9	cmsnjw3d4000004l73omej79w	PENDING	CONFIRMED	2026-08-10 18:15:56.021
cmsnk10v6000304jotmioc8kl	cmsnjw3dz000g04l7wg3m9qsy	cmpcqf47m000004l85vce0gfh	cmsnjw3d4000004l73omej79w	PENDING	CONFIRMED	2026-08-10 18:17:57.666
cmsnk5esi000104jr516afeeh	cmsnjw3dz000i04l7pkr8c0u8	cmpcopzu6000004jro3prr7ca	cmsnjw3d4000004l73omej79w	PENDING	CONFIRMED	2026-08-10 18:21:22.338
cmsnkldzd001m04l78g4vr8df	cmsnjw3dz000j04l775j67n8u	cmpdz3jpw000004jvdohsd2ri	cmsnjw3d4000004l73omej79w	PENDING	CONFIRMED	2026-08-10 18:33:47.785
cmsnlouv2000104lajsidg7vf	cmsnjw3dz000k04l788362gbr	cmpefep0o000504laynrqmhnw	cmsnjw3d4000004l73omej79w	PENDING	CONFIRMED	2026-08-10 19:04:29.246
cmsnn75iw000304lax0kjrjjw	cmsnjw3dz000d04l7xd2tg6th	cmpcov8jd000004l8umh13pux	cmsnjw3d4000004l73omej79w	PENDING	CONFIRMED	2026-08-10 19:46:42.488
cmsnnh5g0000504lal0oawt0y	cmsnjw3dz000a04l727e2x46i	cmpcpimjz000004jpcdqgfhfx	cmsnjw3d4000004l73omej79w	PENDING	CONFIRMED	2026-08-10 19:54:28.944
cmsnod2a5000104l9nu2kk372	cmsnjw3dz000c04l7hfdzh0ah	cmpcsehq1000104ibueo8dlm5	cmsnjw3d4000004l73omej79w	PENDING	CONFIRMED	2026-08-10 20:19:17.837
cmsnotbfa000104kvj3698nx0	cmsnjw3dz000d04l7xd2tg6th	cmpcov8jd000004l8umh13pux	cmsnjw3d4000004l73omej79w	CONFIRMED	DECLINED	2026-08-10 20:31:56.182
cmsnou3uo000304kvcdcpbku1	cmsnjw3dz000d04l7xd2tg6th	cmpcov8jd000004l8umh13pux	cmsnjw3d4000004l73omej79w	DECLINED	CONFIRMED	2026-08-10 20:32:33.024
cmsnwb8lr000104ia3yh4r1p8	cmsnjw3dz000504l76ouiwfh2	cmpn1o6et000004jrcnmw0gav	cmsnjw3d4000004l73omej79w	PENDING	CONFIRMED	2026-08-11 00:01:49.647
cmso21lvr000104jy7bl1y4ht	cmsd9fo3d000n04l8t6nz74z9	cmpcopzu6000004jro3prr7ca	cmsd9fo2a000004l80caeqs67	PENDING	CONFIRMED	2026-08-11 02:42:17.991
cmsoi6j5s000104ldtz5jry1q	cmsnjw3dz000h04l72q6ahvfp	cmpcm7sgp000004l1fp9o52ky	cmsnjw3d4000004l73omej79w	PENDING	DECLINED	2026-08-11 10:14:01.6
cmsok3wgz000104l2uwuhnvkm	cmsnjw3dz000e04l7amci5hgf	cmsd6v73x000004jupd8tbvon	cmsnjw3d4000004l73omej79w	PENDING	CONFIRMED	2026-08-11 11:07:58.115
cmsonk3e4000104jwfd1o6dc3	cmsnjw3dz000n04l7w484zp7e	cmpct94t9000204jsxeeckk3m	cmsnjw3d4000004l73omej79w	PENDING	DECLINED	2026-08-11 12:44:32.428
cmspfw8rs000104jykqen16g9	cmsnjw3dz000f04l70n8pe53w	cmpcpt3n6000004l561lm2ja7	cmsnjw3d4000004l73omej79w	PENDING	CONFIRMED	2026-08-12 01:57:48.52
cmspxd2h9000104ksgpkqjjdq	cmsnjw3dy000104l7uw98933i	cmpefcqj2000104ladlx0ysjz	cmsnjw3d4000004l73omej79w	PENDING	CONFIRMED	2026-08-12 10:06:46.989
cmspxd84d000104jzxn2b5hvf	cmsnjw3dz000404l7waic5kjc	cmpfk8v2v000704jlp8siky9e	cmsnjw3d4000004l73omej79w	PENDING	CONFIRMED	2026-08-12 10:06:54.301
cmspz9kvb000104kz5syuv5sx	cmsnjw3dz000h04l72q6ahvfp	cmpcm7sgp000004l1fp9o52ky	cmsnjw3d4000004l73omej79w	DECLINED	CONFIRMED	2026-08-12 11:00:03.431
cmsq4dkse000104k3baltsiao	cmsnjw3dz000l04l7jr8p8u95	cmpefcd1z000004lasd2r1kdh	cmsnjw3d4000004l73omej79w	PENDING	CONFIRMED	2026-08-12 13:23:08.03
cmsqdcqoe000104lc0dqcusep	cmsnjw3dz000b04l7co3uvah7	cmpcsds4s000004jmgpwku1j2	cmsnjw3d4000004l73omej79w	PENDING	CONFIRMED	2026-08-12 17:34:25.55
cmss1sa1i000104l45yjuvvam	cmsnjw3dz000604l758p2c3a2	cmpct2xp7000004jsv1ujpe1r	cmsnjw3d4000004l73omej79w	PENDING	DECLINED	2026-08-13 21:46:07.446
cmssbnegx000104iazj4aawqa	cmsd9fo3d000404l8pnz8opce	cmpefdkyx000304la3k3nq9p9	cmsd9fo2a000004l80caeqs67	PENDING	CONFIRMED	2026-08-14 02:22:16.065
cmst8arue000104l7l3qco3nh	cmsd9fo3d000904l8jzdjvgqz	cmpdz3jpw000004jvdohsd2ri	cmsd9fo2a000004l80caeqs67	PENDING	CONFIRMED	2026-08-14 17:36:14.198
cmstgk9qn000104ldbp5209qf	cmsd9fo3d000j04l8c3y5n8vs	cmpcsds4s000004jmgpwku1j2	cmsd9fo2a000004l80caeqs67	PENDING	CONFIRMED	2026-08-14 21:27:34.223
cmsub4fj5000104jpo3gluhbo	cmsd9fo3d000a04l8ipzdg660	cmsd6v73x000004jupd8tbvon	cmsd9fo2a000004l80caeqs67	PENDING	CONFIRMED	2026-08-15 11:43:03.329
cmsucblkn000104lamfon4s9q	cmsd9fo3d000c04l87y4t4mw3	cmpcpt3n6000004l561lm2ja7	cmsd9fo2a000004l80caeqs67	PENDING	CONFIRMED	2026-08-15 12:16:37.367
cmsuccimh000304lafk8n1xne	cmst6197i000404jvkosjq7o9	cmst61960000104jvfkkcgzp4	cmsd9fo2a000004l80caeqs67	PENDING	CONFIRMED	2026-08-15 12:17:20.201
cmsud8k4r000104kyer4imufd	cmsd9fo3d000604l8352ora1b	cmpefep0o000504laynrqmhnw	cmsd9fo2a000004l80caeqs67	PENDING	CONFIRMED	2026-08-15 12:42:15.147
cmsudf5rn000104jo6ez6uzz7	cmsd9fo3d000h04l83acnqzgb	cmpefcd1z000004lasd2r1kdh	cmsd9fo2a000004l80caeqs67	PENDING	CONFIRMED	2026-08-15 12:47:23.123
cmsuem7my000104l4ohhwctwk	cmsd9fo3d000g04l8n7ptvmvt	cmpcov8jd000004l8umh13pux	cmsd9fo2a000004l80caeqs67	PENDING	CONFIRMED	2026-08-15 13:20:51.754
cmsugfzkp000104jxw02jla3b	cmsd9fo3d000104l8dzivyjt3	cmpcm7sgp000004l1fp9o52ky	cmsd9fo2a000004l80caeqs67	PENDING	CONFIRMED	2026-08-15 14:12:00.601
cmsuh4o7f000104js1dem2ejj	cmsd9fo3d000d04l8iv40mvsp	cmpct2xp7000004jsv1ujpe1r	cmsd9fo2a000004l80caeqs67	PENDING	CONFIRMED	2026-08-15 14:31:12.267
cmsukir6x000104kyfvqdjam7	cmsd9fo3d000l04l84gevusb5	cmpn1o6et000004jrcnmw0gav	cmsd9fo2a000004l80caeqs67	PENDING	CONFIRMED	2026-08-15 16:06:08.169
cmsuksfdl000304kyijexzj5m	cmsd9fo3d000304l8q679s9g0	cmpdz2mcq000104jr9xnhl4i0	cmsd9fo2a000004l80caeqs67	PENDING	CONFIRMED	2026-08-15 16:13:39.417
cmsul25pk000104jyyjwxlfy3	cmsd9fo3d000704l8bb9l4813	cmpcsehq1000104ibueo8dlm5	cmsd9fo2a000004l80caeqs67	PENDING	CONFIRMED	2026-08-15 16:21:13.448
cmsulqggc000104i88t9211ly	cmsd9fo3d000k04l8mpo5helc	cmpefcqj2000104ladlx0ysjz	cmsd9fo2a000004l80caeqs67	PENDING	CONFIRMED	2026-08-15 16:40:07.116
cmsuwj774000104jgwvj7dq1p	cmsd9fo3d000704l8bb9l4813	cmpcsehq1000104ibueo8dlm5	cmsd9fo2a000004l80caeqs67	CONFIRMED	DECLINED	2026-08-15 21:42:24.304
cmsv1n7eh000104lewd068faw	cmsd9fo3d000e04l8gas2bfbu	cmrozuqv4000104l5tbza8qgy	cmsd9fo2a000004l80caeqs67	PENDING	CONFIRMED	2026-08-16 00:05:29.273
cmsvl6fm7000104ieulopsgtx	cmsd9fo3d000904l8jzdjvgqz	cmpdz3jpw000004jvdohsd2ri	cmsd9fo2a000004l80caeqs67	CONFIRMED	DECLINED	2026-08-16 09:12:19.087
cmsvw7gge000104l3m4kz275f	cmsd9fo3d000f04l89jmzpzsu	cmpcqf47m000004l85vce0gfh	cmsd9fo2a000004l80caeqs67	PENDING	DECLINED	2026-08-16 14:21:02.606
cmsw5f6ru000104laftyq3rd2	cmsd9fo3d000804l8hq2obfzw	cmpfk8v2v000704jlp8siky9e	cmsd9fo2a000004l80caeqs67	PENDING	DECLINED	2026-08-16 18:38:59.85
cmt0jjf5c000104jq2m0t2kx6	cmt0aw2fe000704jyopu2jfd7	cmpcoxez0000304l8g40zcfou	cmt0aw2dv000004jyn5mtmejp	PENDING	CONFIRMED	2026-08-19 20:25:16.656
cmt0jl87l000104k0e9crpxkt	cmt0aw2fe000i04jy69qsnkbx	cmpcopzu6000004jro3prr7ca	cmt0aw2dv000004jyn5mtmejp	PENDING	CONFIRMED	2026-08-19 20:26:40.977
cmt0jzl8k000104lcyfimja42	cmt0aw2fe000l04jy21askhkx	cmpefcd1z000004lasd2r1kdh	cmt0aw2dv000004jyn5mtmejp	PENDING	CONFIRMED	2026-08-19 20:37:51.044
cmt0kuj5t000104jwmhe1o435	cmt0aw2fe000c04jybei2t6w2	cmpcov8jd000004l8umh13pux	cmt0aw2dv000004jyn5mtmejp	PENDING	CONFIRMED	2026-08-19 21:01:54.689
cmt0nml2w000104jsiwqr7dht	cmt0aw2fe000j04jyze5z33hb	cmpdz3jpw000004jvdohsd2ri	cmt0aw2dv000004jyn5mtmejp	PENDING	CONFIRMED	2026-08-19 22:19:42.776
cmt1fbcvt000104l4t7gemvwq	cmsx2wpqf000m04ldr2dr3knf	cmpdz2mcq000104jr9xnhl4i0	cmsx2wppc000004ldfwf8elsy	PENDING	CONFIRMED	2026-08-20 11:14:48.186
cmt1fbdx2000104juqhsztczq	cmsx2wpqf000l04lduwf1vrxx	cmpefcd1z000004lasd2r1kdh	cmsx2wppc000004ldfwf8elsy	PENDING	CONFIRMED	2026-08-20 11:14:49.526
cmt1fbfec000304jutadgejgr	cmsx2wpqf000h04ldtzs3osgf	cmpcm7sgp000004l1fp9o52ky	cmsx2wppc000004ldfwf8elsy	PENDING	CONFIRMED	2026-08-20 11:14:51.444
cmt1fbg8k000304l4yb67368t	cmsx2wpqf000g04ldxws3yfg8	cmpcqf47m000004l85vce0gfh	cmsx2wppc000004ldfwf8elsy	PENDING	CONFIRMED	2026-08-20 11:14:52.532
cmt1fbi9d000504juf9i6by9x	cmsx2wpq8000c04ld0xl65m4d	cmpcov8jd000004l8umh13pux	cmsx2wppc000004ldfwf8elsy	PENDING	CONFIRMED	2026-08-20 11:14:55.153
cmt1fbk2h000704jujwdqwlhf	cmsx2wpq8000a04ld44a0rb17	cmpcsds4s000004jmgpwku1j2	cmsx2wppc000004ldfwf8elsy	PENDING	CONFIRMED	2026-08-20 11:14:57.497
cmt1fblly000504l4oorjc529	cmsx2wpq8000904ldfva1gmts	cmpcpimjz000004jpcdqgfhfx	cmsx2wppc000004ldfwf8elsy	PENDING	CONFIRMED	2026-08-20 11:14:59.494
cmt1fbmi3000904jujzz2qncf	cmsx2wpq8000804ld0qbe1cce	cmpefdkyx000304la3k3nq9p9	cmsx2wppc000004ldfwf8elsy	PENDING	CONFIRMED	2026-08-20 11:15:00.651
cmt1fbo6o000b04jumaitg97k	cmsx2wpq8000404ld3yg84ap2	cmpfk8v2v000704jlp8siky9e	cmsx2wppc000004ldfwf8elsy	PENDING	CONFIRMED	2026-08-20 11:15:02.832
cmt1fbs11000704l4rbg5ov58	cmsx2wpq8000104ld9n15ixu0	cmpefcqj2000104ladlx0ysjz	cmsx2wppc000004ldfwf8elsy	PENDING	CONFIRMED	2026-08-20 11:15:07.813
cmt1ko02w000104jwi5o0axbe	cmt0aw2fe000504jylavpo2bl	cmpn1o6et000004jrcnmw0gav	cmt0aw2dv000004jyn5mtmejp	PENDING	CONFIRMED	2026-08-20 13:44:36.2
cmt20waae000104jx5qkqqd0x	cmt0aw2fe000d04jyhuv0q20u	cmsd6v73x000004jupd8tbvon	cmt0aw2dv000004jyn5mtmejp	PENDING	CONFIRMED	2026-08-20 21:18:56.534
cmt2vhege000104leioksbfrk	cmt0aw2fe000604jyd6jtq5ea	cmpct2xp7000004jsv1ujpe1r	cmt0aw2dv000004jyn5mtmejp	PENDING	CONFIRMED	2026-08-21 11:35:10.19
cmt2w3tqu000104kysvlqrpwc	cmt0aw2fe000h04jychvzryhs	cmpcm7sgp000004l1fp9o52ky	cmt0aw2dv000004jyn5mtmejp	PENDING	CONFIRMED	2026-08-21 11:52:36.438
cmt2xbzuk000304le859w8fsv	cmt0aw2fe000m04jyl3steukb	cmpdz2mcq000104jr9xnhl4i0	cmt0aw2dv000004jyn5mtmejp	PENDING	CONFIRMED	2026-08-21 12:26:57.212
cmt31kgpq000104jr7bfzcf49	cmt0aw2fe000a04jyi1q4d6a5	cmpcsds4s000004jmgpwku1j2	cmt0aw2dv000004jyn5mtmejp	PENDING	CONFIRMED	2026-08-21 14:25:30.782
cmt4y3yg4000104kz1wayx4g5	cmt0aw2fe000f04jy6xrasz71	cmst61960000104jvfkkcgzp4	cmt0aw2dv000004jyn5mtmejp	PENDING	CONFIRMED	2026-08-22 22:24:14.116
cmt4ycb29000304kzjq5gfsne	cmt0aw2fe000k04jy6sdwu39w	cmpefep0o000504laynrqmhnw	cmt0aw2dv000004jyn5mtmejp	PENDING	CONFIRMED	2026-08-22 22:30:43.713
cmt55ugxi000104jqof04gekn	cmt0aw2fe000904jy09sjqnho	cmpcpimjz000004jpcdqgfhfx	cmt0aw2dv000004jyn5mtmejp	PENDING	CONFIRMED	2026-08-23 02:00:48.438
cmt55w92l000104l93f8dov7h	cmt0aw2fd000104jyooi9cbnl	cmpefcqj2000104ladlx0ysjz	cmt0aw2dv000004jyn5mtmejp	PENDING	CONFIRMED	2026-08-23 02:02:11.565
cmt576zbi000104jvqseo3u6y	cmt0aw2fe000n04jykjbuthh3	cmpct94t9000204jsxeeckk3m	cmt0aw2dv000004jyn5mtmejp	PENDING	CONFIRMED	2026-08-23 02:38:31.758
cmt5p8xnu000104jjb1mh87ko	cmt0aw2fe000e04jyuqfz61kp	cmpcpt3n6000004l561lm2ja7	cmt0aw2dv000004jyn5mtmejp	PENDING	DECLINED	2026-08-23 11:03:56.01
cmt5r94ii000104jxw32gb176	cmt0aw2fe000804jyc4fh7jh8	cmpefdkyx000304la3k3nq9p9	cmt0aw2dv000004jyn5mtmejp	PENDING	DECLINED	2026-08-23 12:00:04.122
cmt5vbfjf000104ju490y3drn	cmt0aw2fe000g04jyarso44f2	cmpcqf47m000004l85vce0gfh	cmt0aw2dv000004jyn5mtmejp	PENDING	CONFIRMED	2026-08-23 13:53:50.187
cmt8p3b40000104jw12w22gmr	cmskhxpco000504jqqegn8qyw	cmpn1o6et000004jrcnmw0gav	cmskhxpbb000004jq77wb6pqt	PENDING	CONFIRMED	2026-08-25 13:22:52.032
cmt8p6rub000104juv1yk2y7p	cmskhxpco000l04jqvkllvjgu	cmpefcd1z000004lasd2r1kdh	cmskhxpbb000004jq77wb6pqt	PENDING	CONFIRMED	2026-08-25 13:25:33.683
cmt8pfvkw000304jwp8y0fdet	cmskhxpco000904jqj4fipwk0	cmpcpimjz000004jpcdqgfhfx	cmskhxpbb000004jq77wb6pqt	PENDING	CONFIRMED	2026-08-25 13:32:38.432
cmt8pk4ut000104l7p98l0n0a	cmskhxpco000i04jqmw0ui3gj	cmpcopzu6000004jro3prr7ca	cmskhxpbb000004jq77wb6pqt	PENDING	CONFIRMED	2026-08-25 13:35:57.077
cmt8qzibq000104l9f3ncjxym	cmskhxpco000d04jqh56l40sa	cmsd6v73x000004jupd8tbvon	cmskhxpbb000004jq77wb6pqt	PENDING	CONFIRMED	2026-08-25 14:15:53.99
cmt8vlqb6000104i4n9419mbz	cmskhxpco000f04jqaufeqlbf	cmpcsds4s000004jmgpwku1j2	cmskhxpbb000004jq77wb6pqt	PENDING	CONFIRMED	2026-08-25 16:25:09.234
cmt934pe8000104jmvx14rs66	cmskhxpco000j04jqcjkxcr7b	cmpdz3jpw000004jvdohsd2ri	cmskhxpbb000004jq77wb6pqt	PENDING	CONFIRMED	2026-08-25 19:55:51.824
cmt934qoz000304jmxuaut3jr	cmskhxpco000804jq9ukv42us	cmpefdkyx000304la3k3nq9p9	cmskhxpbb000004jq77wb6pqt	PENDING	CONFIRMED	2026-08-25 19:55:53.507
cmt93k6q7000104l3h1l4yz53	cmskhxpco000h04jq563suie9	cmpcm7sgp000004l1fp9o52ky	cmskhxpbb000004jq77wb6pqt	PENDING	DECLINED	2026-08-25 20:07:54.127
cmt93t47l000104lh71m8flql	cmskhxpco000g04jqnb8hqhj5	cmpcqf47m000004l85vce0gfh	cmskhxpbb000004jq77wb6pqt	PENDING	CONFIRMED	2026-08-25 20:14:50.769
cmt93t7so000304lhluqo0rbk	cmskhxpco000704jqzehf6a17	cmpcoxez0000304l8g40zcfou	cmskhxpbb000004jq77wb6pqt	PENDING	DECLINED	2026-08-25 20:14:55.416
cmt95bug8000104l2krdplbac	cmskhxpco000104jq53oks16o	cmpefcqj2000104ladlx0ysjz	cmskhxpbb000004jq77wb6pqt	PENDING	CONFIRMED	2026-08-25 20:57:24.2
cmt9cwu2w000104ldnrqsla05	cmst6197i000604jvy85i026h	cmst61960000104jvfkkcgzp4	cmskhxpbb000004jq77wb6pqt	PENDING	CONFIRMED	2026-08-26 00:29:40.808
cmt9d1jj5000104jon78riwo2	cmskhxpco000c04jqbqkwbu1a	cmpcov8jd000004l8umh13pux	cmskhxpbb000004jq77wb6pqt	PENDING	CONFIRMED	2026-08-26 00:33:20.417
cmt9d3m4r000304lde3s3bjky	cmskhxpco000n04jqn3chisz1	cmpct94t9000204jsxeeckk3m	cmskhxpbb000004jq77wb6pqt	PENDING	DECLINED	2026-08-26 00:34:57.099
cmt9ej6q5000104ju5y2b8quy	cmskhxpco000k04jqw697n0rg	cmpefep0o000504laynrqmhnw	cmskhxpbb000004jq77wb6pqt	PENDING	CONFIRMED	2026-08-26 01:15:03.245
cmt9g7a2l000104la8hq2x8t7	cmskhxpco000b04jq77txmmva	cmpcsehq1000104ibueo8dlm5	cmskhxpbb000004jq77wb6pqt	PENDING	DECLINED	2026-08-26 02:01:46.941
cmtae64au000104kzc94cgpia	cmskhxpco000e04jqpw2z7wre	cmpcpt3n6000004l561lm2ja7	cmskhxpbb000004jq77wb6pqt	PENDING	CONFIRMED	2026-08-26 17:52:39.75
cmtajf2ex000104i87dqmcgst	cmskhxpco000m04jq36ssf4z4	cmpdz2mcq000104jr9xnhl4i0	cmskhxpbb000004jq77wb6pqt	PENDING	CONFIRMED	2026-08-26 20:19:35.289
cmtajoqn5000304i8ykibkrv4	cmskhxpco000404jq2iucz1py	cmpfk8v2v000704jlp8siky9e	cmskhxpbb000004jq77wb6pqt	PENDING	CONFIRMED	2026-08-26 20:27:06.593
cmtak0cxb000104i9l057h0dn	cmskhxpco000a04jqapeowbed	cmpct2xp7000004jsv1ujpe1r	cmskhxpbb000004jq77wb6pqt	PENDING	CONFIRMED	2026-08-26 20:36:08.687
\.
COPY public.rsvps (id, status, "playerId", "matchId", "respondedAt", "createdAt", "updatedAt", summoned) FROM stdin;
cmpe1azqw000104l1ehtbsj1w	PENDING	cmpcm7sgp000004l1fp9o52ky	cmpe1azov000004l1iw95x1zw	\N	2026-05-20 12:24:47.48	2026-05-20 12:24:47.48	t
cmpe1azqw000204l1ykcw9m8v	PENDING	cmpcopzu6000004jro3prr7ca	cmpe1azov000004l1iw95x1zw	\N	2026-05-20 12:24:47.48	2026-05-20 12:24:47.48	t
cmpe1azqw000304l10ipka8uq	PENDING	cmpcov8jd000004l8umh13pux	cmpe1azov000004l1iw95x1zw	\N	2026-05-20 12:24:47.48	2026-05-20 12:24:47.48	t
cmpe1azqw000404l1w9ka199n	PENDING	cmpcoxez0000304l8g40zcfou	cmpe1azov000004l1iw95x1zw	\N	2026-05-20 12:24:47.48	2026-05-20 12:24:47.48	t
cmpe1azqw000504l147tnud7h	PENDING	cmpcpgupa000004l5ehnc0kjs	cmpe1azov000004l1iw95x1zw	\N	2026-05-20 12:24:47.48	2026-05-20 12:24:47.48	t
cmpe1azqw000604l1eomsxuuy	PENDING	cmpcpt3n6000004l561lm2ja7	cmpe1azov000004l1iw95x1zw	\N	2026-05-20 12:24:47.48	2026-05-20 12:24:47.48	t
cmpe1azqw000704l111es5mkk	PENDING	cmpcqf47m000004l85vce0gfh	cmpe1azov000004l1iw95x1zw	\N	2026-05-20 12:24:47.48	2026-05-20 12:24:47.48	t
cmpe1azqw000804l1u4rjwf1x	PENDING	cmpcsds4s000004jmgpwku1j2	cmpe1azov000004l1iw95x1zw	\N	2026-05-20 12:24:47.48	2026-05-20 12:24:47.48	t
cmpe1azqw000904l1xt275ebe	PENDING	cmpcsehq1000104ibueo8dlm5	cmpe1azov000004l1iw95x1zw	\N	2026-05-20 12:24:47.48	2026-05-20 12:24:47.48	t
cmpe1azqw000a04l18a2ofq6a	PENDING	cmpct2xp7000004jsv1ujpe1r	cmpe1azov000004l1iw95x1zw	\N	2026-05-20 12:24:47.48	2026-05-20 12:24:47.48	t
cmpe1azqw000b04l1fl450g7u	PENDING	cmpct94t9000204jsxeeckk3m	cmpe1azov000004l1iw95x1zw	\N	2026-05-20 12:24:47.48	2026-05-20 12:24:47.48	t
cmpe1azqw000c04l1t13ivs95	PENDING	cmpdz2mcq000104jr9xnhl4i0	cmpe1azov000004l1iw95x1zw	\N	2026-05-20 12:24:47.48	2026-05-20 12:24:47.48	t
cmpe1azqw000d04l1hyt1ovzm	PENDING	cmpdz3jpw000004jvdohsd2ri	cmpe1azov000004l1iw95x1zw	\N	2026-05-20 12:24:47.48	2026-05-20 12:24:47.48	t
cmpe1azqw000e04l1r4cc5moi	PENDING	cmpcpimjz000004jpcdqgfhfx	cmpe1azov000004l1iw95x1zw	\N	2026-05-20 12:24:47.48	2026-05-20 12:24:47.48	t
cmskhxpco000704jqzehf6a17	DECLINED	cmpcoxez0000304l8g40zcfou	cmskhxpbb000004jq77wb6pqt	2026-08-26 20:19:39.51	2026-08-08 14:56:05.016	2026-08-26 20:19:39.527	t
cmpfezhz0000704lbyjm7o35a	PENDING	cmpcqf47m000004l85vce0gfh	cmpfezhxy000004lblpwmx62l	\N	2026-05-21 11:35:32.028	2026-05-21 11:35:32.028	t
cmpfezhz0000904lb2w91ro6p	PENDING	cmpcsehq1000104ibueo8dlm5	cmpfezhxy000004lblpwmx62l	\N	2026-05-21 11:35:32.028	2026-05-21 11:35:32.028	t
cmpfezhz0000a04lb2ru16l4k	PENDING	cmpct2xp7000004jsv1ujpe1r	cmpfezhxy000004lblpwmx62l	\N	2026-05-21 11:35:32.028	2026-05-21 11:35:32.028	t
cmqp5jh9a000c04jpl2q6m9a7	PENDING	cmpefdukz000404lanevrsp34	cmqp5jh8b000004jp8k1q116l	\N	2026-06-22 11:48:32.158	2026-06-22 11:48:32.158	t
cmpfezhz0000h04lbhrenja83	PENDING	cmpefd4zq000204la3jqyndzz	cmpfezhxy000004lblpwmx62l	\N	2026-05-21 11:35:32.028	2026-05-21 11:35:32.028	t
cmqp5jh9a000g04jptwxwep3v	PENDING	cmpg41k59000004l7521hfcn4	cmqp5jh8b000004jp8k1q116l	\N	2026-06-22 11:48:32.158	2026-06-22 11:48:32.158	t
cmpfezhz0000304lbdvnp1cej	DECLINED	cmpcov8jd000004l8umh13pux	cmpfezhxy000004lblpwmx62l	2026-05-22 13:31:31.314	2026-05-21 11:35:32.028	2026-05-22 13:31:31.317	t
cmpfezhz0000104lbpanasply	CONFIRMED	cmpcm7sgp000004l1fp9o52ky	cmpfezhxy000004lblpwmx62l	2026-05-21 13:05:40.356	2026-05-21 11:35:32.028	2026-05-21 13:05:40.366	t
cmpfezhz0000f04lbbkr5indb	CONFIRMED	cmpefcd1z000004lasd2r1kdh	cmpfezhxy000004lblpwmx62l	2026-05-21 13:20:35.42	2026-05-21 11:35:32.028	2026-05-21 13:20:35.431	t
cmpfezhz0000404lbr2ysiq6z	CONFIRMED	cmpcoxez0000304l8g40zcfou	cmpfezhxy000004lblpwmx62l	2026-05-21 14:12:27.319	2026-05-21 11:35:32.028	2026-05-21 14:12:27.329	t
cmqp5jh9a000h04jpmbkca5xw	PENDING	cmpg43u13000604l7y6t0hdtt	cmqp5jh8b000004jp8k1q116l	\N	2026-06-22 11:48:32.158	2026-06-22 11:48:32.158	t
cmpfezhz0000204lb74825n37	DECLINED	cmpcopzu6000004jro3prr7ca	cmpfezhxy000004lblpwmx62l	2026-05-21 14:24:55.453	2026-05-21 11:35:32.028	2026-05-21 14:24:55.465	t
cmpfezhz0000d04lbljm5lc33	CONFIRMED	cmpdz3jpw000004jvdohsd2ri	cmpfezhxy000004lblpwmx62l	2026-05-21 17:27:44.803	2026-05-21 11:35:32.028	2026-05-21 17:27:44.814	t
cmpfezhz0000c04lbtegb3l2m	CONFIRMED	cmpdz2mcq000104jr9xnhl4i0	cmpfezhxy000004lblpwmx62l	2026-05-21 17:40:55.117	2026-05-21 11:35:32.028	2026-05-21 17:40:55.127	t
cmpfezhz0000i04lbxylzxhom	CONFIRMED	cmpefdkyx000304la3k3nq9p9	cmpfezhxy000004lblpwmx62l	2026-05-21 19:07:29.229	2026-05-21 11:35:32.028	2026-05-21 19:07:29.242	t
cmpfezhz0000e04lb6s5rrd9z	CONFIRMED	cmpcpimjz000004jpcdqgfhfx	cmpfezhxy000004lblpwmx62l	2026-05-21 19:12:06.498	2026-05-21 11:35:32.028	2026-05-21 19:12:06.509	t
cmqp5jh9b000n04jpk3u1ismm	CONFIRMED	cmpn1o6et000004jrcnmw0gav	cmqp5jh8b000004jp8k1q116l	2026-07-17 20:34:09.693	2026-06-22 11:48:32.158	2026-07-17 20:34:09.713	t
cmqp5jh9b000k04jp7l6rhsg0	CONFIRMED	cmpcopzu6000004jro3prr7ca	cmqp5jh8b000004jp8k1q116l	2026-07-17 20:35:15.842	2026-06-22 11:48:32.158	2026-07-17 20:35:15.842	t
cmqp5jh9a000904jp2iuj7bdj	CONFIRMED	cmpcpimjz000004jpcdqgfhfx	cmqp5jh8b000004jp8k1q116l	2026-07-17 20:52:52.847	2026-06-22 11:48:32.158	2026-07-17 20:52:52.858	t
cmpfezhz1000k04lbkpvo0xir	CONFIRMED	cmpefep0o000504laynrqmhnw	cmpfezhxy000004lblpwmx62l	2026-05-22 15:04:55.66	2026-05-21 11:35:32.028	2026-05-22 15:04:55.671	t
cmpfezhz0000504lbbvq60us0	DECLINED	cmpcpgupa000004l5ehnc0kjs	cmpfezhxy000004lblpwmx62l	2026-05-22 18:17:15.278	2026-05-21 11:35:32.028	2026-05-22 18:17:15.282	t
cmpfezhz0000604lbeojcmyyj	CONFIRMED	cmpcpt3n6000004l561lm2ja7	cmpfezhxy000004lblpwmx62l	2026-05-23 00:36:56.916	2026-05-21 11:35:32.028	2026-05-23 00:36:56.927	t
cmpfezhz0000g04lbxu1ki09i	CONFIRMED	cmpefcqj2000104ladlx0ysjz	cmpfezhxy000004lblpwmx62l	2026-05-23 01:27:26.314	2026-05-21 11:35:32.028	2026-05-23 01:27:26.324	t
cmqp5jh9a000d04jp74o92vgb	DECLINED	cmpefep0o000504laynrqmhnw	cmqp5jh8b000004jp8k1q116l	2026-07-17 21:05:35.493	2026-06-22 11:48:32.158	2026-07-17 21:05:35.527	t
cmpfezhz0000b04lb5cvdy8ml	DECLINED	cmpct94t9000204jsxeeckk3m	cmpfezhxy000004lblpwmx62l	2026-05-23 15:00:26.026	2026-05-21 11:35:32.028	2026-05-23 15:00:26.048	t
cmpfezhz1000j04lbitj3zl3k	CONFIRMED	cmpefdukz000404lanevrsp34	cmpfezhxy000004lblpwmx62l	2026-05-23 15:51:26.544	2026-05-21 11:35:32.028	2026-05-23 15:51:26.553	t
cmpfezhz0000804lb26t40c8z	CONFIRMED	cmpcsds4s000004jmgpwku1j2	cmpfezhxy000004lblpwmx62l	2026-05-23 16:09:22.537	2026-05-21 11:35:32.028	2026-05-23 16:09:22.547	t
cmqp5jh9a000f04jp5leohwse	DECLINED	cmpcsehq1000104ibueo8dlm5	cmqp5jh8b000004jp8k1q116l	2026-07-17 22:21:09.416	2026-06-22 11:48:32.158	2026-07-17 22:21:09.425	t
cmqp5jh9b000l04jp2lxrke48	DECLINED	cmpcpt3n6000004l561lm2ja7	cmqp5jh8b000004jp8k1q116l	2026-07-18 00:21:54.396	2026-06-22 11:48:32.158	2026-07-18 00:21:54.414	t
cmqp5jh9a000704jpbs7du3ah	DECLINED	cmpct94t9000204jsxeeckk3m	cmqp5jh8b000004jp8k1q116l	2026-07-18 12:12:39.713	2026-06-22 11:48:32.158	2026-07-18 12:12:39.725	t
cmqp5jh9a000504jpqavkxrwn	CONFIRMED	cmpcsds4s000004jmgpwku1j2	cmqp5jh8b000004jp8k1q116l	2026-07-18 12:32:07.268	2026-06-22 11:48:32.158	2026-07-18 12:32:07.279	t
cmqp5jh9a000a04jpqd017xq8	DECLINED	cmpefcd1z000004lasd2r1kdh	cmqp5jh8b000004jp8k1q116l	2026-07-18 12:32:22.616	2026-06-22 11:48:32.158	2026-07-18 12:32:22.618	t
cmqp5jh9b000m04jpwkcub4sz	DECLINED	cmpdz3jpw000004jvdohsd2ri	cmqp5jh8b000004jp8k1q116l	2026-07-18 12:32:50.076	2026-06-22 11:48:32.158	2026-07-18 12:32:50.086	t
cmqp5jh9a000604jpfej8pjun	DECLINED	cmpct2xp7000004jsv1ujpe1r	cmqp5jh8b000004jp8k1q116l	2026-07-18 12:36:38.851	2026-06-22 11:48:32.158	2026-07-18 12:36:38.865	t
cmqp5jh9b000j04jpwzdiwh9i	DECLINED	cmpcpgupa000004l5ehnc0kjs	cmqp5jh8b000004jp8k1q116l	2026-07-18 12:44:59.56	2026-06-22 11:48:32.158	2026-07-18 12:44:59.56	t
cmqp5jh9a000b04jpka1istpl	DECLINED	cmpefdkyx000304la3k3nq9p9	cmqp5jh8b000004jp8k1q116l	2026-07-18 14:20:54.077	2026-06-22 11:48:32.158	2026-07-18 14:20:54.087	t
cmqp5jh9b000i04jp8ati2dr1	DECLINED	cmph7t8a1000004l9n8uic25p	cmqp5jh8b000004jp8k1q116l	2026-07-18 15:20:49.885	2026-06-22 11:48:32.158	2026-07-18 15:20:49.895	t
cmqp5jh9b000o04jpp8w3rz1u	DECLINED	cmpfk8v2v000704jlp8siky9e	cmqp5jh8b000004jp8k1q116l	2026-07-18 16:31:08.408	2026-06-22 11:48:32.158	2026-07-18 16:31:08.41	t
cmqp5jh9a000804jpk3fjxj0m	CONFIRMED	cmpdz2mcq000104jr9xnhl4i0	cmqp5jh8b000004jp8k1q116l	2026-07-18 16:33:19.078	2026-06-22 11:48:32.158	2026-07-18 16:33:19.083	t
cmqp5jh9a000e04jplydyr20i	CONFIRMED	cmpefcqj2000104ladlx0ysjz	cmqp5jh8b000004jp8k1q116l	2026-07-18 18:22:02.164	2026-06-22 11:48:32.158	2026-07-18 18:22:02.198	t
cmqp5jh9a000204jpjr22u3mh	DECLINED	cmpcov8jd000004l8umh13pux	cmqp5jh8b000004jp8k1q116l	2026-07-19 06:21:31.25	2026-06-22 11:48:32.158	2026-07-19 06:21:31.277	t
cmqp5jh9a000104jpt4qb925q	CONFIRMED	cmpcm7sgp000004l1fp9o52ky	cmqp5jh8b000004jp8k1q116l	2026-07-19 11:20:49.493	2026-06-22 11:48:32.158	2026-07-19 11:20:49.504	t
cmqp62ims000104jud5zfklnp	PENDING	cmpcm7sgp000004l1fp9o52ky	cmqp62ilp000004jul47gswr8	\N	2026-06-22 12:03:20.404	2026-06-22 12:03:20.404	f
cmqp62ims000204ju8c8jb0b9	PENDING	cmpcov8jd000004l8umh13pux	cmqp62ilp000004jul47gswr8	\N	2026-06-22 12:03:20.404	2026-06-22 12:03:20.404	f
cmqp62ims000304julfu8umt0	PENDING	cmpcoxez0000304l8g40zcfou	cmqp62ilp000004jul47gswr8	\N	2026-06-22 12:03:20.404	2026-06-22 12:03:20.404	f
cmqp62ims000404juulfarwvw	PENDING	cmpcqf47m000004l85vce0gfh	cmqp62ilp000004jul47gswr8	\N	2026-06-22 12:03:20.404	2026-06-22 12:03:20.404	f
cmqp62ims000504juv4cbmuzg	PENDING	cmpcsds4s000004jmgpwku1j2	cmqp62ilp000004jul47gswr8	\N	2026-06-22 12:03:20.404	2026-06-22 12:03:20.404	f
cmqp62ims000604jusxfqdiyl	PENDING	cmpct2xp7000004jsv1ujpe1r	cmqp62ilp000004jul47gswr8	\N	2026-06-22 12:03:20.404	2026-06-22 12:03:20.404	f
cmqp62ims000704juw4vus8qd	PENDING	cmpct94t9000204jsxeeckk3m	cmqp62ilp000004jul47gswr8	\N	2026-06-22 12:03:20.404	2026-06-22 12:03:20.404	f
cmqp62ims000804ju51xlooft	PENDING	cmpdz2mcq000104jr9xnhl4i0	cmqp62ilp000004jul47gswr8	\N	2026-06-22 12:03:20.404	2026-06-22 12:03:20.404	f
cmqp62ims000904jurbi09nu9	PENDING	cmpcpimjz000004jpcdqgfhfx	cmqp62ilp000004jul47gswr8	\N	2026-06-22 12:03:20.404	2026-06-22 12:03:20.404	f
cmqp62ims000a04junltvk6wo	PENDING	cmpefcd1z000004lasd2r1kdh	cmqp62ilp000004jul47gswr8	\N	2026-06-22 12:03:20.404	2026-06-22 12:03:20.404	f
cmqp62ims000b04juugz0fl0k	PENDING	cmpefdkyx000304la3k3nq9p9	cmqp62ilp000004jul47gswr8	\N	2026-06-22 12:03:20.404	2026-06-22 12:03:20.404	f
cmqp62ims000c04jud5gg24zd	PENDING	cmpefdukz000404lanevrsp34	cmqp62ilp000004jul47gswr8	\N	2026-06-22 12:03:20.404	2026-06-22 12:03:20.404	f
cmqp62ims000d04ju3003ufan	PENDING	cmpefep0o000504laynrqmhnw	cmqp62ilp000004jul47gswr8	\N	2026-06-22 12:03:20.404	2026-06-22 12:03:20.404	f
cmqp62imt000e04jucouz0h6i	PENDING	cmpefcqj2000104ladlx0ysjz	cmqp62ilp000004jul47gswr8	\N	2026-06-22 12:03:20.404	2026-06-22 12:03:20.404	f
cmqp62imt000f04juzc5r1y8g	PENDING	cmpcsehq1000104ibueo8dlm5	cmqp62ilp000004jul47gswr8	\N	2026-06-22 12:03:20.404	2026-06-22 12:03:20.404	f
cmpfkmyrz000004latuc7rnny	CONFIRMED	cmpfk8v2v000704jlp8siky9e	cmpfezhxy000004lblpwmx62l	2026-05-21 15:20:45.873	2026-05-21 14:13:44.975	2026-05-21 15:20:45.893	t
cmqp62imt000g04ju7el2z8zg	PENDING	cmpg41k59000004l7521hfcn4	cmqp62ilp000004jul47gswr8	\N	2026-06-22 12:03:20.404	2026-06-22 12:03:20.404	f
cmqp62imt000h04juww6lolf6	PENDING	cmpg43u13000604l7y6t0hdtt	cmqp62ilp000004jul47gswr8	\N	2026-06-22 12:03:20.404	2026-06-22 12:03:20.404	f
cmqp62imt000i04jug8jwuix9	PENDING	cmph7t8a1000004l9n8uic25p	cmqp62ilp000004jul47gswr8	\N	2026-06-22 12:03:20.404	2026-06-22 12:03:20.404	f
cmqp62imt000j04juntm3dccg	PENDING	cmpcpgupa000004l5ehnc0kjs	cmqp62ilp000004jul47gswr8	\N	2026-06-22 12:03:20.404	2026-06-22 12:03:20.404	f
cmqp62imt000k04junwu75cb2	PENDING	cmpcopzu6000004jro3prr7ca	cmqp62ilp000004jul47gswr8	\N	2026-06-22 12:03:20.404	2026-06-22 12:03:20.404	f
cmqp62imt000l04ju495fpm6s	PENDING	cmpcpt3n6000004l561lm2ja7	cmqp62ilp000004jul47gswr8	\N	2026-06-22 12:03:20.404	2026-06-22 12:03:20.404	f
cmpg3rc02000104lavmoyhml4	PENDING	cmpcm7sgp000004l1fp9o52ky	cmpg3rbz2000004la05x1z03i	\N	2026-05-21 23:09:01.443	2026-05-21 23:09:01.443	t
cmpg3rc03000204la0yx4nhhr	PENDING	cmpcov8jd000004l8umh13pux	cmpg3rbz2000004la05x1z03i	\N	2026-05-21 23:09:01.443	2026-05-21 23:09:01.443	t
cmpg3rc03000304lak5thkv39	PENDING	cmpcoxez0000304l8g40zcfou	cmpg3rbz2000004la05x1z03i	\N	2026-05-21 23:09:01.443	2026-05-21 23:09:01.443	t
cmpg3rc03000404lafmqwltn1	PENDING	cmpcpt3n6000004l561lm2ja7	cmpg3rbz2000004la05x1z03i	\N	2026-05-21 23:09:01.443	2026-05-21 23:09:01.443	t
cmpg3rc03000504la8midnx6n	PENDING	cmpcqf47m000004l85vce0gfh	cmpg3rbz2000004la05x1z03i	\N	2026-05-21 23:09:01.443	2026-05-21 23:09:01.443	t
cmpg3rc03000604la5lu639qr	PENDING	cmpcsds4s000004jmgpwku1j2	cmpg3rbz2000004la05x1z03i	\N	2026-05-21 23:09:01.443	2026-05-21 23:09:01.443	t
cmpg3rc03000704lalqhrcwza	PENDING	cmpct2xp7000004jsv1ujpe1r	cmpg3rbz2000004la05x1z03i	\N	2026-05-21 23:09:01.443	2026-05-21 23:09:01.443	t
cmpg3rc03000804lareommg56	PENDING	cmpct94t9000204jsxeeckk3m	cmpg3rbz2000004la05x1z03i	\N	2026-05-21 23:09:01.443	2026-05-21 23:09:01.443	t
cmpg3rc03000904la09x4hnhk	PENDING	cmpdz2mcq000104jr9xnhl4i0	cmpg3rbz2000004la05x1z03i	\N	2026-05-21 23:09:01.443	2026-05-21 23:09:01.443	t
cmpg3rc03000a04la0adzsb37	PENDING	cmpdz3jpw000004jvdohsd2ri	cmpg3rbz2000004la05x1z03i	\N	2026-05-21 23:09:01.443	2026-05-21 23:09:01.443	t
cmpg3rc03000b04laicmhqlyu	PENDING	cmpcpimjz000004jpcdqgfhfx	cmpg3rbz2000004la05x1z03i	\N	2026-05-21 23:09:01.443	2026-05-21 23:09:01.443	t
cmpg3rc03000c04lanacws0to	PENDING	cmpefcd1z000004lasd2r1kdh	cmpg3rbz2000004la05x1z03i	\N	2026-05-21 23:09:01.443	2026-05-21 23:09:01.443	t
cmpg3rc03000d04laf9r4d4el	PENDING	cmpefdkyx000304la3k3nq9p9	cmpg3rbz2000004la05x1z03i	\N	2026-05-21 23:09:01.443	2026-05-21 23:09:01.443	t
cmpg3k0qd000104l5tbn2fqh1	CONFIRMED	cmpcm7sgp000004l1fp9o52ky	cmpg3k0ot000004l5zes9kdtc	2026-06-05 13:30:18.175	2026-05-21 23:03:20.245	2026-06-05 13:30:18.187	t
cmpg3k0qd000504l5d7knvg30	CONFIRMED	cmpcqf47m000004l85vce0gfh	cmpg3k0ot000004l5zes9kdtc	2026-06-05 13:32:16.356	2026-05-21 23:03:20.245	2026-06-05 13:32:16.357	t
cmpg3k0qd000904l5bpuftpkv	CONFIRMED	cmpdz2mcq000104jr9xnhl4i0	cmpg3k0ot000004l5zes9kdtc	2026-06-05 13:48:59.789	2026-05-21 23:03:20.245	2026-06-05 13:48:59.79	t
cmpg3k0qd000k04l5y79ngzun	DECLINED	cmpcopzu6000004jro3prr7ca	cmpg3k0ot000004l5zes9kdtc	2026-06-05 13:52:47.849	2026-05-21 23:03:20.245	2026-06-05 13:52:47.858	t
cmpg3k0qd000e04l5ox807mo5	CONFIRMED	cmpefdukz000404lanevrsp34	cmpg3k0ot000004l5zes9kdtc	2026-06-05 13:55:46.638	2026-05-21 23:03:20.245	2026-06-05 13:55:46.649	t
cmpg3k0qd000404l5cejiz6ir	CONFIRMED	cmpcpt3n6000004l561lm2ja7	cmpg3k0ot000004l5zes9kdtc	2026-06-05 13:56:44.543	2026-05-21 23:03:20.245	2026-06-05 13:56:44.543	t
cmpg3k0qd000804l5kavzw1cj	CONFIRMED	cmpct94t9000204jsxeeckk3m	cmpg3k0ot000004l5zes9kdtc	2026-06-05 13:57:52.012	2026-05-21 23:03:20.245	2026-06-05 13:57:52.013	t
cmpg3k0qd000704l52dvdxapb	CONFIRMED	cmpct2xp7000004jsv1ujpe1r	cmpg3k0ot000004l5zes9kdtc	2026-06-05 14:03:10.399	2026-05-21 23:03:20.245	2026-06-05 14:03:10.399	t
cmpg3k0qd000f04l5ebo8vc59	CONFIRMED	cmpefep0o000504laynrqmhnw	cmpg3k0ot000004l5zes9kdtc	2026-06-05 14:03:49.866	2026-05-21 23:03:20.245	2026-06-05 14:03:49.868	t
cmpg3k0qd000b04l51ys3slnv	CONFIRMED	cmpcpimjz000004jpcdqgfhfx	cmpg3k0ot000004l5zes9kdtc	2026-06-05 15:04:36.633	2026-05-21 23:03:20.245	2026-06-05 15:04:36.642	t
cmpg3k0qd000204l5otqfd94p	CONFIRMED	cmpcov8jd000004l8umh13pux	cmpg3k0ot000004l5zes9kdtc	2026-06-05 15:10:55.162	2026-05-21 23:03:20.245	2026-06-05 15:10:55.179	t
cmpg3k0qd000c04l54zvo6l6s	CONFIRMED	cmpefcd1z000004lasd2r1kdh	cmpg3k0ot000004l5zes9kdtc	2026-06-05 15:17:47.372	2026-05-21 23:03:20.245	2026-06-05 15:17:47.381	t
cmpg3k0qd000i04l5hox790mk	CONFIRMED	cmpfk8v2v000704jlp8siky9e	cmpg3k0ot000004l5zes9kdtc	2026-06-05 19:00:08.379	2026-05-21 23:03:20.245	2026-06-05 19:00:08.392	t
cmpg3k0qd000304l5yt0j0gja	DECLINED	cmpcoxez0000304l8g40zcfou	cmpg3k0ot000004l5zes9kdtc	2026-06-05 20:04:57.572	2026-05-21 23:03:20.245	2026-06-05 20:04:57.592	t
cmpg3k0qd000d04l5uh2th61k	CONFIRMED	cmpefdkyx000304la3k3nq9p9	cmpg3k0ot000004l5zes9kdtc	2026-06-06 01:32:07.698	2026-05-21 23:03:20.245	2026-06-06 01:32:07.709	t
cmpg3k0qd000604l5gdpbro6g	CONFIRMED	cmpcsds4s000004jmgpwku1j2	cmpg3k0ot000004l5zes9kdtc	2026-06-06 12:20:54.76	2026-05-21 23:03:20.245	2026-06-06 12:20:54.771	t
cmpg3k0qd000j04l53pji1d5s	DECLINED	cmpcpgupa000004l5ehnc0kjs	cmpg3k0ot000004l5zes9kdtc	2026-06-06 12:31:41.015	2026-05-21 23:03:20.245	2026-06-06 12:31:41.026	t
cmpg3k0qd000h04l5i3gweizc	CONFIRMED	cmpcsehq1000104ibueo8dlm5	cmpg3k0ot000004l5zes9kdtc	2026-06-06 14:13:36.323	2026-05-21 23:03:20.245	2026-06-06 14:13:36.335	t
cmpg3k0qd000a04l5jb3dzqdl	DECLINED	cmpdz3jpw000004jvdohsd2ri	cmpg3k0ot000004l5zes9kdtc	2026-06-06 15:18:34.783	2026-05-21 23:03:20.245	2026-06-06 15:18:34.794	t
cmpg3k0qd000g04l5xx7dslou	CONFIRMED	cmpefcqj2000104ladlx0ysjz	cmpg3k0ot000004l5zes9kdtc	2026-06-06 15:20:31.541	2026-05-21 23:03:20.245	2026-06-06 15:20:31.552	t
cmq59e1wz000104ju4nimwejv	PENDING	cmpcm7sgp000004l1fp9o52ky	cmq59e1vu000004juzmp8xftw	\N	2026-06-08 13:40:53.939	2026-06-08 13:40:53.939	f
cmq59e1wz000204juel18gg2p	PENDING	cmpcov8jd000004l8umh13pux	cmq59e1vu000004juzmp8xftw	\N	2026-06-08 13:40:53.939	2026-06-08 13:40:53.939	f
cmpg3rc03000e04la4a07fqjl	PENDING	cmpefdukz000404lanevrsp34	cmpg3rbz2000004la05x1z03i	\N	2026-05-21 23:09:01.443	2026-05-21 23:09:01.443	t
cmpg3rc03000f04ladg3ocj6m	PENDING	cmpefep0o000504laynrqmhnw	cmpg3rbz2000004la05x1z03i	\N	2026-05-21 23:09:01.443	2026-05-21 23:09:01.443	t
cmpg3rc03000g04la3dz120qb	PENDING	cmpefcqj2000104ladlx0ysjz	cmpg3rbz2000004la05x1z03i	\N	2026-05-21 23:09:01.443	2026-05-21 23:09:01.443	t
cmpg3rc03000h04lagn2kt0gc	PENDING	cmpcsehq1000104ibueo8dlm5	cmpg3rbz2000004la05x1z03i	\N	2026-05-21 23:09:01.443	2026-05-21 23:09:01.443	t
cmpg3rc03000i04labe0idoby	PENDING	cmpfk8v2v000704jlp8siky9e	cmpg3rbz2000004la05x1z03i	\N	2026-05-21 23:09:01.443	2026-05-21 23:09:01.443	t
cmpg3rc03000j04laj79zegvn	PENDING	cmpcpgupa000004l5ehnc0kjs	cmpg3rbz2000004la05x1z03i	\N	2026-05-21 23:09:01.443	2026-05-21 23:09:01.443	t
cmpg3rc03000k04la7fbolqhu	PENDING	cmpcopzu6000004jro3prr7ca	cmpg3rbz2000004la05x1z03i	\N	2026-05-21 23:09:01.443	2026-05-21 23:09:01.443	t
cmpg3u3ld000z04lancxw17z0	PENDING	cmpefdukz000404lanevrsp34	cmpg3u3kh000l04la6hj2e5r3	\N	2026-05-21 23:11:10.513	2026-05-21 23:11:10.513	t
cmpg3u3ld001304lar84hc1wn	PENDING	cmpfk8v2v000704jlp8siky9e	cmpg3u3kh000l04la6hj2e5r3	\N	2026-05-21 23:11:10.513	2026-05-21 23:11:10.513	t
cmpg3u3ld001404lalrhl05x5	PENDING	cmpcpgupa000004l5ehnc0kjs	cmpg3u3kh000l04la6hj2e5r3	\N	2026-05-21 23:11:10.513	2026-05-21 23:11:10.513	t
cmpg3xobf000f04ju9bpnjpyh	PENDING	cmpcm7sgp000004l1fp9o52ky	cmpg3xoab000e04jupuf15f34	\N	2026-05-21 23:13:57.339	2026-05-21 23:13:57.339	t
cmpg3xobf000g04ju0x96a21f	PENDING	cmpcov8jd000004l8umh13pux	cmpg3xoab000e04jupuf15f34	\N	2026-05-21 23:13:57.339	2026-05-21 23:13:57.339	t
cmpg3xobf000h04ju5lxoyrx2	PENDING	cmpcoxez0000304l8g40zcfou	cmpg3xoab000e04jupuf15f34	\N	2026-05-21 23:13:57.339	2026-05-21 23:13:57.339	t
cmpg3xobf000i04jucxgq3whi	PENDING	cmpcpt3n6000004l561lm2ja7	cmpg3xoab000e04jupuf15f34	\N	2026-05-21 23:13:57.339	2026-05-21 23:13:57.339	t
cmpg3xobf000j04ju1bwjdcv7	PENDING	cmpcqf47m000004l85vce0gfh	cmpg3xoab000e04jupuf15f34	\N	2026-05-21 23:13:57.339	2026-05-21 23:13:57.339	t
cmpg3xobf000k04ju01an8fpa	PENDING	cmpcsds4s000004jmgpwku1j2	cmpg3xoab000e04jupuf15f34	\N	2026-05-21 23:13:57.339	2026-05-21 23:13:57.339	t
cmpg3xobg000l04juz863jdsy	PENDING	cmpct2xp7000004jsv1ujpe1r	cmpg3xoab000e04jupuf15f34	\N	2026-05-21 23:13:57.339	2026-05-21 23:13:57.339	t
cmpg3xobg000m04juji5s8rkt	PENDING	cmpct94t9000204jsxeeckk3m	cmpg3xoab000e04jupuf15f34	\N	2026-05-21 23:13:57.339	2026-05-21 23:13:57.339	t
cmpg3xobg000n04jubuljd9ex	PENDING	cmpdz2mcq000104jr9xnhl4i0	cmpg3xoab000e04jupuf15f34	\N	2026-05-21 23:13:57.339	2026-05-21 23:13:57.339	t
cmpg3xobg000o04juho51v0rw	PENDING	cmpdz3jpw000004jvdohsd2ri	cmpg3xoab000e04jupuf15f34	\N	2026-05-21 23:13:57.339	2026-05-21 23:13:57.339	t
cmpg3xobg000p04jum2oppw3g	PENDING	cmpcpimjz000004jpcdqgfhfx	cmpg3xoab000e04jupuf15f34	\N	2026-05-21 23:13:57.339	2026-05-21 23:13:57.339	t
cmpg3xobg000q04juyekau5jg	PENDING	cmpefcd1z000004lasd2r1kdh	cmpg3xoab000e04jupuf15f34	\N	2026-05-21 23:13:57.339	2026-05-21 23:13:57.339	t
cmpg3xobg000r04ju73cj0gau	PENDING	cmpefdkyx000304la3k3nq9p9	cmpg3xoab000e04jupuf15f34	\N	2026-05-21 23:13:57.339	2026-05-21 23:13:57.339	t
cmpg3xobg000s04juexb2o6dd	PENDING	cmpefdukz000404lanevrsp34	cmpg3xoab000e04jupuf15f34	\N	2026-05-21 23:13:57.339	2026-05-21 23:13:57.339	t
cmpg3xobg000t04jul6ipk92v	PENDING	cmpefep0o000504laynrqmhnw	cmpg3xoab000e04jupuf15f34	\N	2026-05-21 23:13:57.339	2026-05-21 23:13:57.339	t
cmpg3xobg000u04juz7pvwqpr	PENDING	cmpefcqj2000104ladlx0ysjz	cmpg3xoab000e04jupuf15f34	\N	2026-05-21 23:13:57.339	2026-05-21 23:13:57.339	t
cmpg3xobg000v04jut9wh8wjf	PENDING	cmpcsehq1000104ibueo8dlm5	cmpg3xoab000e04jupuf15f34	\N	2026-05-21 23:13:57.339	2026-05-21 23:13:57.339	t
cmpg3xobg000w04junf36omdk	PENDING	cmpfk8v2v000704jlp8siky9e	cmpg3xoab000e04jupuf15f34	\N	2026-05-21 23:13:57.339	2026-05-21 23:13:57.339	t
cmpg3xobg000x04jusimy1sxm	PENDING	cmpcpgupa000004l5ehnc0kjs	cmpg3xoab000e04jupuf15f34	\N	2026-05-21 23:13:57.339	2026-05-21 23:13:57.339	t
cmpg3xobg000y04julxlye46u	PENDING	cmpcopzu6000004jro3prr7ca	cmpg3xoab000e04jupuf15f34	\N	2026-05-21 23:13:57.339	2026-05-21 23:13:57.339	t
cmpg41k60000104l73zigyfvf	PENDING	cmpg41k59000004l7521hfcn4	cmpg3rbz2000004la05x1z03i	\N	2026-05-21 23:16:58.584	2026-05-21 23:16:58.584	t
cmpg41k60000204l70dnpbx2v	PENDING	cmpg41k59000004l7521hfcn4	cmpg3u3kh000l04la6hj2e5r3	\N	2026-05-21 23:16:58.584	2026-05-21 23:16:58.584	t
cmpg41k60000304l7lpp7ntqn	PENDING	cmpg41k59000004l7521hfcn4	cmpfezhxy000004lblpwmx62l	\N	2026-05-21 23:16:58.584	2026-05-21 23:16:58.584	t
cmqp62imt000m04juexjkvu5f	PENDING	cmpdz3jpw000004jvdohsd2ri	cmqp62ilp000004jul47gswr8	\N	2026-06-22 12:03:20.404	2026-06-22 12:03:20.404	f
cmqp62imt000n04jufa0zvlxt	PENDING	cmpn1o6et000004jrcnmw0gav	cmqp62ilp000004jul47gswr8	\N	2026-06-22 12:03:20.404	2026-06-22 12:03:20.404	f
cmpg43u1x000704l7vxaeevf9	PENDING	cmpg43u13000604l7y6t0hdtt	cmpg3rbz2000004la05x1z03i	\N	2026-05-21 23:18:44.709	2026-05-21 23:18:44.709	t
cmpg43u1x000804l7xoqd3imj	PENDING	cmpg43u13000604l7y6t0hdtt	cmpg3u3kh000l04la6hj2e5r3	\N	2026-05-21 23:18:44.709	2026-05-21 23:18:44.709	t
cmpg43u1x000904l7fwyu525z	PENDING	cmpg43u13000604l7y6t0hdtt	cmpfezhxy000004lblpwmx62l	\N	2026-05-21 23:18:44.709	2026-05-21 23:18:44.709	t
cmqp62imt000o04ju02vcbmrl	PENDING	cmpfk8v2v000704jlp8siky9e	cmqp62ilp000004jul47gswr8	\N	2026-06-22 12:03:20.404	2026-06-22 12:03:20.404	f
cmpg43u1x000b04l7pq0vfto4	PENDING	cmpg43u13000604l7y6t0hdtt	cmpg3k0ot000004l5zes9kdtc	\N	2026-05-21 23:18:44.709	2026-05-21 23:18:44.709	t
cmpgvy3is000104jupsvsrcoe	PENDING	cmpcm7sgp000004l1fp9o52ky	cmpgvy3i1000004jupkxo13f9	\N	2026-05-22 12:18:06.292	2026-05-22 12:18:06.292	t
cmpgvy3is000204jun2m5qvim	PENDING	cmpcov8jd000004l8umh13pux	cmpgvy3i1000004jupkxo13f9	\N	2026-05-22 12:18:06.292	2026-05-22 12:18:06.292	t
cmpgvy3is000304juru0r1ab6	PENDING	cmpcoxez0000304l8g40zcfou	cmpgvy3i1000004jupkxo13f9	\N	2026-05-22 12:18:06.292	2026-05-22 12:18:06.292	t
cmpgvy3is000404jufr4nw8xf	PENDING	cmpcpt3n6000004l561lm2ja7	cmpgvy3i1000004jupkxo13f9	\N	2026-05-22 12:18:06.292	2026-05-22 12:18:06.292	t
cmpg3u3ld001504la2fzq6awd	DECLINED	cmpcopzu6000004jro3prr7ca	cmpg3u3kh000l04la6hj2e5r3	2026-08-03 12:11:41.503	2026-05-21 23:11:10.513	2026-08-03 12:11:41.514	t
cmpg3u3ld000y04ladeaakhc5	CONFIRMED	cmpefdkyx000304la3k3nq9p9	cmpg3u3kh000l04la6hj2e5r3	2026-08-03 14:43:45.031	2026-05-21 23:11:10.513	2026-08-03 14:43:45.042	t
cmpg3u3ld000m04laubb2bf1h	CONFIRMED	cmpcm7sgp000004l1fp9o52ky	cmpg3u3kh000l04la6hj2e5r3	2026-08-03 15:05:18.152	2026-05-21 23:11:10.513	2026-08-03 15:05:18.153	t
cmpg3u3ld000v04lak8l08b7v	CONFIRMED	cmpdz3jpw000004jvdohsd2ri	cmpg3u3kh000l04la6hj2e5r3	2026-08-03 15:48:21.59	2026-05-21 23:11:10.513	2026-08-03 15:48:21.598	t
cmpg3u3ld001004la047wd2n5	CONFIRMED	cmpefep0o000504laynrqmhnw	cmpg3u3kh000l04la6hj2e5r3	2026-08-03 16:08:57.989	2026-05-21 23:11:10.513	2026-08-03 16:08:57.997	t
cmpg3u3ld000x04lanfpd6ako	CONFIRMED	cmpefcd1z000004lasd2r1kdh	cmpg3u3kh000l04la6hj2e5r3	2026-08-03 17:10:21.543	2026-05-21 23:11:10.513	2026-08-03 17:10:21.549	t
cmpg3u3ld000w04lad9dw7hb8	CONFIRMED	cmpcpimjz000004jpcdqgfhfx	cmpg3u3kh000l04la6hj2e5r3	2026-08-03 19:27:44.873	2026-05-21 23:11:10.513	2026-08-03 19:27:44.881	t
cmpg3u3ld001204la1beyvwtv	CONFIRMED	cmpcsehq1000104ibueo8dlm5	cmpg3u3kh000l04la6hj2e5r3	2026-08-03 21:52:34.945	2026-05-21 23:11:10.513	2026-08-03 21:52:34.953	t
cmpg3u3ld000u04las8f7rp2b	CONFIRMED	cmpdz2mcq000104jr9xnhl4i0	cmpg3u3kh000l04la6hj2e5r3	2026-08-04 15:22:52.211	2026-05-21 23:11:10.513	2026-08-04 15:22:52.218	t
cmpg3u3ld000t04lawn0d7m43	CONFIRMED	cmpct94t9000204jsxeeckk3m	cmpg3u3kh000l04la6hj2e5r3	2026-08-04 22:21:03.915	2026-05-21 23:11:10.513	2026-08-04 22:21:03.953	t
cmpg3u3ld000n04layam1mlj3	DECLINED	cmpcov8jd000004l8umh13pux	cmpg3u3kh000l04la6hj2e5r3	2026-08-04 22:52:03.327	2026-05-21 23:11:10.513	2026-08-04 22:52:03.35	t
cmpg3u3ld001104lazxa71fse	CONFIRMED	cmpefcqj2000104ladlx0ysjz	cmpg3u3kh000l04la6hj2e5r3	2026-08-05 01:09:25.657	2026-05-21 23:11:10.513	2026-08-05 01:09:25.663	t
cmpg3u3ld000q04la1y6lf1w3	DECLINED	cmpcqf47m000004l85vce0gfh	cmpg3u3kh000l04la6hj2e5r3	2026-08-07 10:14:40.082	2026-05-21 23:11:10.513	2026-08-07 10:14:40.103	t
cmpg3u3ld000s04lacj526wmo	CONFIRMED	cmpct2xp7000004jsv1ujpe1r	cmpg3u3kh000l04la6hj2e5r3	2026-08-08 18:36:46.509	2026-05-21 23:11:10.513	2026-08-08 18:36:46.553	t
cmpgvy3is000504jushz0hd25	PENDING	cmpcqf47m000004l85vce0gfh	cmpgvy3i1000004jupkxo13f9	\N	2026-05-22 12:18:06.292	2026-05-22 12:18:06.292	t
cmpgvy3it000604juwi9vg2el	PENDING	cmpcsds4s000004jmgpwku1j2	cmpgvy3i1000004jupkxo13f9	\N	2026-05-22 12:18:06.292	2026-05-22 12:18:06.292	t
cmpgvy3it000704juiay0a2ah	PENDING	cmpct2xp7000004jsv1ujpe1r	cmpgvy3i1000004jupkxo13f9	\N	2026-05-22 12:18:06.292	2026-05-22 12:18:06.292	t
cmpgvy3it000804ju67mpd64t	PENDING	cmpct94t9000204jsxeeckk3m	cmpgvy3i1000004jupkxo13f9	\N	2026-05-22 12:18:06.292	2026-05-22 12:18:06.292	t
cmpgvy3it000904jupn5xwht6	PENDING	cmpdz2mcq000104jr9xnhl4i0	cmpgvy3i1000004jupkxo13f9	\N	2026-05-22 12:18:06.292	2026-05-22 12:18:06.292	t
cmpgvy3it000a04ju24kkdqjo	PENDING	cmpdz3jpw000004jvdohsd2ri	cmpgvy3i1000004jupkxo13f9	\N	2026-05-22 12:18:06.292	2026-05-22 12:18:06.292	t
cmpgvy3it000b04ju8fbyxb50	PENDING	cmpcpimjz000004jpcdqgfhfx	cmpgvy3i1000004jupkxo13f9	\N	2026-05-22 12:18:06.292	2026-05-22 12:18:06.292	t
cmpgvy3it000c04jukv4al28z	PENDING	cmpefcd1z000004lasd2r1kdh	cmpgvy3i1000004jupkxo13f9	\N	2026-05-22 12:18:06.292	2026-05-22 12:18:06.292	t
cmpgvy3it000d04jurvbm27mm	PENDING	cmpefdkyx000304la3k3nq9p9	cmpgvy3i1000004jupkxo13f9	\N	2026-05-22 12:18:06.292	2026-05-22 12:18:06.292	t
cmpgvy3it000e04ju4du7amqg	PENDING	cmpefdukz000404lanevrsp34	cmpgvy3i1000004jupkxo13f9	\N	2026-05-22 12:18:06.292	2026-05-22 12:18:06.292	t
cmpgvy3it000f04jurfmk2i4h	PENDING	cmpefep0o000504laynrqmhnw	cmpgvy3i1000004jupkxo13f9	\N	2026-05-22 12:18:06.292	2026-05-22 12:18:06.292	t
cmpgvy3it000g04ju6le1cftd	PENDING	cmpefcqj2000104ladlx0ysjz	cmpgvy3i1000004jupkxo13f9	\N	2026-05-22 12:18:06.292	2026-05-22 12:18:06.292	t
cmpgvy3it000h04ju5v0w4q34	PENDING	cmpcsehq1000104ibueo8dlm5	cmpgvy3i1000004jupkxo13f9	\N	2026-05-22 12:18:06.292	2026-05-22 12:18:06.292	t
cmpgvy3it000i04ju3egfrsx7	PENDING	cmpfk8v2v000704jlp8siky9e	cmpgvy3i1000004jupkxo13f9	\N	2026-05-22 12:18:06.292	2026-05-22 12:18:06.292	t
cmpgvy3it000j04ju2wgfktig	PENDING	cmpcpgupa000004l5ehnc0kjs	cmpgvy3i1000004jupkxo13f9	\N	2026-05-22 12:18:06.292	2026-05-22 12:18:06.292	t
cmpgvy3it000k04juf48909d7	PENDING	cmpcopzu6000004jro3prr7ca	cmpgvy3i1000004jupkxo13f9	\N	2026-05-22 12:18:06.292	2026-05-22 12:18:06.292	t
cmpgvy3it000l04ju3ca3jovw	PENDING	cmpg41k59000004l7521hfcn4	cmpgvy3i1000004jupkxo13f9	\N	2026-05-22 12:18:06.292	2026-05-22 12:18:06.292	t
cmpgvy3it000m04ju0d2dzvhc	PENDING	cmpg43u13000604l7y6t0hdtt	cmpgvy3i1000004jupkxo13f9	\N	2026-05-22 12:18:06.292	2026-05-22 12:18:06.292	t
cmpgxpcnu000204l1gsnj53sg	PENDING	cmpcm7sgp000004l1fp9o52ky	cmpgxpcmr000104l1gbglqrdc	\N	2026-05-22 13:07:17.466	2026-05-22 13:07:17.466	t
cmpgxpcnu000304l1l6ff0dsg	PENDING	cmpcov8jd000004l8umh13pux	cmpgxpcmr000104l1gbglqrdc	\N	2026-05-22 13:07:17.466	2026-05-22 13:07:17.466	t
cmpgxpcnu000404l120thkleh	PENDING	cmpcoxez0000304l8g40zcfou	cmpgxpcmr000104l1gbglqrdc	\N	2026-05-22 13:07:17.466	2026-05-22 13:07:17.466	t
cmpgxpcnu000504l1ih2gege6	PENDING	cmpcpt3n6000004l561lm2ja7	cmpgxpcmr000104l1gbglqrdc	\N	2026-05-22 13:07:17.466	2026-05-22 13:07:17.466	t
cmpgxpcnu000604l1y9ba33yg	PENDING	cmpcqf47m000004l85vce0gfh	cmpgxpcmr000104l1gbglqrdc	\N	2026-05-22 13:07:17.466	2026-05-22 13:07:17.466	t
cmpgxpcnu000704l16gj4dfbz	PENDING	cmpcsds4s000004jmgpwku1j2	cmpgxpcmr000104l1gbglqrdc	\N	2026-05-22 13:07:17.466	2026-05-22 13:07:17.466	t
cmpgxpcnu000804l1fn181idp	PENDING	cmpct2xp7000004jsv1ujpe1r	cmpgxpcmr000104l1gbglqrdc	\N	2026-05-22 13:07:17.466	2026-05-22 13:07:17.466	t
cmpgxpcnu000904l1b2x03959	PENDING	cmpct94t9000204jsxeeckk3m	cmpgxpcmr000104l1gbglqrdc	\N	2026-05-22 13:07:17.466	2026-05-22 13:07:17.466	t
cmpgxpcnu000a04l1270voxtl	PENDING	cmpdz2mcq000104jr9xnhl4i0	cmpgxpcmr000104l1gbglqrdc	\N	2026-05-22 13:07:17.466	2026-05-22 13:07:17.466	t
cmpgxpcnu000b04l1dwrmrwpi	PENDING	cmpdz3jpw000004jvdohsd2ri	cmpgxpcmr000104l1gbglqrdc	\N	2026-05-22 13:07:17.466	2026-05-22 13:07:17.466	t
cmpgxpcnu000c04l16ort8js5	PENDING	cmpcpimjz000004jpcdqgfhfx	cmpgxpcmr000104l1gbglqrdc	\N	2026-05-22 13:07:17.466	2026-05-22 13:07:17.466	t
cmpgxpcnu000d04l1kgoq1hnh	PENDING	cmpefcd1z000004lasd2r1kdh	cmpgxpcmr000104l1gbglqrdc	\N	2026-05-22 13:07:17.466	2026-05-22 13:07:17.466	t
cmpgxpcnu000e04l1ttsbet3t	PENDING	cmpefdkyx000304la3k3nq9p9	cmpgxpcmr000104l1gbglqrdc	\N	2026-05-22 13:07:17.466	2026-05-22 13:07:17.466	t
cmpgxpcnu000f04l1jwzgh1sx	PENDING	cmpefdukz000404lanevrsp34	cmpgxpcmr000104l1gbglqrdc	\N	2026-05-22 13:07:17.466	2026-05-22 13:07:17.466	t
cmpgxpcnu000g04l1ohxapt3v	PENDING	cmpefep0o000504laynrqmhnw	cmpgxpcmr000104l1gbglqrdc	\N	2026-05-22 13:07:17.466	2026-05-22 13:07:17.466	t
cmpgxpcnu000h04l1k3xphlny	PENDING	cmpefcqj2000104ladlx0ysjz	cmpgxpcmr000104l1gbglqrdc	\N	2026-05-22 13:07:17.466	2026-05-22 13:07:17.466	t
cmpgxpcnu000i04l1hrhbcd6b	PENDING	cmpcsehq1000104ibueo8dlm5	cmpgxpcmr000104l1gbglqrdc	\N	2026-05-22 13:07:17.466	2026-05-22 13:07:17.466	t
cmpgxpcnu000j04l10zxdfo9m	PENDING	cmpfk8v2v000704jlp8siky9e	cmpgxpcmr000104l1gbglqrdc	\N	2026-05-22 13:07:17.466	2026-05-22 13:07:17.466	t
cmpgxpcnu000k04l1ig2zfzwi	PENDING	cmpcpgupa000004l5ehnc0kjs	cmpgxpcmr000104l1gbglqrdc	\N	2026-05-22 13:07:17.466	2026-05-22 13:07:17.466	t
cmpgxpcnu000l04l1evyqzu1h	PENDING	cmpcopzu6000004jro3prr7ca	cmpgxpcmr000104l1gbglqrdc	\N	2026-05-22 13:07:17.466	2026-05-22 13:07:17.466	t
cmpgxpcnu000m04l1gmacjzss	PENDING	cmpg41k59000004l7521hfcn4	cmpgxpcmr000104l1gbglqrdc	\N	2026-05-22 13:07:17.466	2026-05-22 13:07:17.466	t
cmpgxpcnu000n04l1qa5ae6jy	PENDING	cmpg43u13000604l7y6t0hdtt	cmpgxpcmr000104l1gbglqrdc	\N	2026-05-22 13:07:17.466	2026-05-22 13:07:17.466	t
cmph7ki4v000104ib0knpng02	PENDING	cmpcm7sgp000004l1fp9o52ky	cmph7ki34000004ibhrgnxf2y	\N	2026-05-22 17:43:27.439	2026-05-22 17:43:27.439	t
cmph7ki4v000204ibq94q83c5	PENDING	cmpcov8jd000004l8umh13pux	cmph7ki34000004ibhrgnxf2y	\N	2026-05-22 17:43:27.439	2026-05-22 17:43:27.439	t
cmph7ki4v000304ib2x369owq	PENDING	cmpcoxez0000304l8g40zcfou	cmph7ki34000004ibhrgnxf2y	\N	2026-05-22 17:43:27.439	2026-05-22 17:43:27.439	t
cmph7ki4v000404ibmux7ucst	PENDING	cmpcpt3n6000004l561lm2ja7	cmph7ki34000004ibhrgnxf2y	\N	2026-05-22 17:43:27.439	2026-05-22 17:43:27.439	t
cmph7ki4v000504ibxrbmbfxd	PENDING	cmpcqf47m000004l85vce0gfh	cmph7ki34000004ibhrgnxf2y	\N	2026-05-22 17:43:27.439	2026-05-22 17:43:27.439	t
cmph7ki4v000604ibyxvmerdo	PENDING	cmpcsds4s000004jmgpwku1j2	cmph7ki34000004ibhrgnxf2y	\N	2026-05-22 17:43:27.439	2026-05-22 17:43:27.439	t
cmph7ki4v000704ibs3gpc7rm	PENDING	cmpct2xp7000004jsv1ujpe1r	cmph7ki34000004ibhrgnxf2y	\N	2026-05-22 17:43:27.439	2026-05-22 17:43:27.439	t
cmph7ki4v000804ibl028xxn5	PENDING	cmpct94t9000204jsxeeckk3m	cmph7ki34000004ibhrgnxf2y	\N	2026-05-22 17:43:27.439	2026-05-22 17:43:27.439	t
cmph7ki4v000904ibei8zfnvy	PENDING	cmpdz2mcq000104jr9xnhl4i0	cmph7ki34000004ibhrgnxf2y	\N	2026-05-22 17:43:27.439	2026-05-22 17:43:27.439	t
cmph7ki4v000a04ib1swhlukq	PENDING	cmpcpimjz000004jpcdqgfhfx	cmph7ki34000004ibhrgnxf2y	\N	2026-05-22 17:43:27.439	2026-05-22 17:43:27.439	t
cmph7ki4v000b04ib9yuwnn0e	PENDING	cmpefcd1z000004lasd2r1kdh	cmph7ki34000004ibhrgnxf2y	\N	2026-05-22 17:43:27.439	2026-05-22 17:43:27.439	t
cmph7ki4v000c04ib2t5t9q0f	PENDING	cmpefdkyx000304la3k3nq9p9	cmph7ki34000004ibhrgnxf2y	\N	2026-05-22 17:43:27.439	2026-05-22 17:43:27.439	t
cmph7ki4v000d04ibupdk6fl9	PENDING	cmpefdukz000404lanevrsp34	cmph7ki34000004ibhrgnxf2y	\N	2026-05-22 17:43:27.439	2026-05-22 17:43:27.439	t
cmph7ki4v000e04ib9dymeew3	PENDING	cmpefep0o000504laynrqmhnw	cmph7ki34000004ibhrgnxf2y	\N	2026-05-22 17:43:27.439	2026-05-22 17:43:27.439	t
cmph7ki4v000f04ibqb457nxr	PENDING	cmpefcqj2000104ladlx0ysjz	cmph7ki34000004ibhrgnxf2y	\N	2026-05-22 17:43:27.439	2026-05-22 17:43:27.439	t
cmph7ki4v000g04ibtx6lc5y8	PENDING	cmpcsehq1000104ibueo8dlm5	cmph7ki34000004ibhrgnxf2y	\N	2026-05-22 17:43:27.439	2026-05-22 17:43:27.439	t
cmph7ki4v000h04ibzs4pwaln	PENDING	cmpfk8v2v000704jlp8siky9e	cmph7ki34000004ibhrgnxf2y	\N	2026-05-22 17:43:27.439	2026-05-22 17:43:27.439	t
cmph7ki4v000i04iblauoc5uq	PENDING	cmpcpgupa000004l5ehnc0kjs	cmph7ki34000004ibhrgnxf2y	\N	2026-05-22 17:43:27.439	2026-05-22 17:43:27.439	t
cmph7ki4v000j04ibfslqno6n	PENDING	cmpcopzu6000004jro3prr7ca	cmph7ki34000004ibhrgnxf2y	\N	2026-05-22 17:43:27.439	2026-05-22 17:43:27.439	t
cmph7ki4v000k04ibmzbllax3	PENDING	cmpg41k59000004l7521hfcn4	cmph7ki34000004ibhrgnxf2y	\N	2026-05-22 17:43:27.439	2026-05-22 17:43:27.439	t
cmph7ki4v000l04ibxe9r75t9	PENDING	cmpg43u13000604l7y6t0hdtt	cmph7ki34000004ibhrgnxf2y	\N	2026-05-22 17:43:27.439	2026-05-22 17:43:27.439	t
cmph7ki4v000m04ib856mq8cu	PENDING	cmpdz3jpw000004jvdohsd2ri	cmph7ki34000004ibhrgnxf2y	\N	2026-05-22 17:43:27.439	2026-05-22 17:43:27.439	t
cmph7s4o1000104l7a3p1k2ux	PENDING	cmph7s4ma000004l727k39xdv	cmpg3rbz2000004la05x1z03i	\N	2026-05-22 17:49:23.233	2026-05-22 17:49:23.233	t
cmph7s4o1000204l7d79s5ng1	PENDING	cmph7s4ma000004l727k39xdv	cmpg3u3kh000l04la6hj2e5r3	\N	2026-05-22 17:49:23.233	2026-05-22 17:49:23.233	t
cmph7s4o1000304l715139qew	PENDING	cmph7s4ma000004l727k39xdv	cmpfezhxy000004lblpwmx62l	\N	2026-05-22 17:49:23.233	2026-05-22 17:49:23.233	t
cmph7s4o1000504l7opjhujni	PENDING	cmph7s4ma000004l727k39xdv	cmpg3k0ot000004l5zes9kdtc	\N	2026-05-22 17:49:23.233	2026-05-22 17:49:23.233	t
cmph7t8b3000104l93qjnzyxh	PENDING	cmph7t8a1000004l9n8uic25p	cmpg3rbz2000004la05x1z03i	\N	2026-05-22 17:50:14.607	2026-05-22 17:50:14.607	t
cmph7t8b4000204l93sz1qbdg	PENDING	cmph7t8a1000004l9n8uic25p	cmpg3u3kh000l04la6hj2e5r3	\N	2026-05-22 17:50:14.607	2026-05-22 17:50:14.607	t
cmph7t8b4000304l9iklw3xev	PENDING	cmph7t8a1000004l9n8uic25p	cmpfezhxy000004lblpwmx62l	\N	2026-05-22 17:50:14.607	2026-05-22 17:50:14.607	t
cmpr23iw7000a04icynmna7hd	DECLINED	cmpdz2mcq000104jr9xnhl4i0	cmpr23ivg000204icrms1915w	2026-05-30 14:13:59.492	2026-05-29 15:07:58.951	2026-05-30 14:13:59.51	t
cmpr23iw7000904ic4kxw518r	DECLINED	cmpct94t9000204jsxeeckk3m	cmpr23ivg000204icrms1915w	2026-05-30 15:30:44.942	2026-05-29 15:07:58.951	2026-05-30 15:30:44.954	t
cmph7t8b4000504l9qbe3z4cx	DECLINED	cmph7t8a1000004l9n8uic25p	cmpg3k0ot000004l5zes9kdtc	2026-06-06 11:48:21.639	2026-05-22 17:50:14.607	2026-06-06 11:48:21.651	t
cmq59e1wz000304jun65ai117	PENDING	cmpcoxez0000304l8g40zcfou	cmq59e1vu000004juzmp8xftw	\N	2026-06-08 13:40:53.939	2026-06-08 13:40:53.939	f
cmq59e1wz000404ju5lvvgahh	PENDING	cmpcqf47m000004l85vce0gfh	cmq59e1vu000004juzmp8xftw	\N	2026-06-08 13:40:53.939	2026-06-08 13:40:53.939	f
cmq59e1x0000504juedzkb5ou	PENDING	cmpcsds4s000004jmgpwku1j2	cmq59e1vu000004juzmp8xftw	\N	2026-06-08 13:40:53.939	2026-06-08 13:40:53.939	f
cmq59e1x0000604ju77vbp830	PENDING	cmpct2xp7000004jsv1ujpe1r	cmq59e1vu000004juzmp8xftw	\N	2026-06-08 13:40:53.939	2026-06-08 13:40:53.939	f
cmq59e1x0000704juula9byp7	PENDING	cmpct94t9000204jsxeeckk3m	cmq59e1vu000004juzmp8xftw	\N	2026-06-08 13:40:53.939	2026-06-08 13:40:53.939	f
cmq59e1x0000804ju95pxi46a	PENDING	cmpdz2mcq000104jr9xnhl4i0	cmq59e1vu000004juzmp8xftw	\N	2026-06-08 13:40:53.939	2026-06-08 13:40:53.939	f
cmr4v6j9r000304jmo1x2tb21	CONFIRMED	cmpcoxez0000304l8g40zcfou	cmr4v6j8z000004jmrs48v3h3	2026-07-04 13:24:42.41	2026-07-03 11:42:50.895	2026-07-04 13:24:42.422	t
cmr4v6j9r000204jmakh0gls3	CONFIRMED	cmpcov8jd000004l8umh13pux	cmr4v6j8z000004jmrs48v3h3	2026-07-04 14:52:03.583	2026-07-03 11:42:50.895	2026-07-04 14:52:03.594	t
cmr4v6j9r000404jm9pcuh6jp	DECLINED	cmpcqf47m000004l85vce0gfh	cmr4v6j8z000004jmrs48v3h3	2026-07-04 15:55:31.102	2026-07-03 11:42:50.895	2026-07-04 15:55:31.113	t
cmpkl4qzi000h04l4g4wra2lf	PENDING	cmpfk8v2v000704jlp8siky9e	cmpkl4qyr000004l41n642701	\N	2026-05-25 02:26:25.565	2026-05-25 02:26:25.565	t
cmpn1o6fp000204jrv4toax73	CONFIRMED	cmpn1o6et000004jrcnmw0gav	cmpg3u3kh000l04la6hj2e5r3	2026-08-05 01:22:56.01	2026-05-26 19:44:58.261	2026-08-05 01:22:56.022	t
cmpkl4qzi000l04l49uciqp70	PENDING	cmpg43u13000604l7y6t0hdtt	cmpkl4qyr000004l41n642701	\N	2026-05-25 02:26:25.565	2026-05-25 02:26:25.565	t
cmpkl4qzh000104l47lrqen45	CONFIRMED	cmpcm7sgp000004l1fp9o52ky	cmpkl4qyr000004l41n642701	2026-05-25 16:57:50.608	2026-05-25 02:26:25.565	2026-05-25 16:57:50.619	t
cmpkl4qzi000j04l4utu6vvb5	CONFIRMED	cmpcopzu6000004jro3prr7ca	cmpkl4qyr000004l41n642701	2026-05-25 17:07:39.385	2026-05-25 02:26:25.565	2026-05-25 17:07:39.397	t
cmpkl4qzi000904l41982eyf1	CONFIRMED	cmpdz2mcq000104jr9xnhl4i0	cmpkl4qyr000004l41n642701	2026-05-25 17:17:37.372	2026-05-25 02:26:25.565	2026-05-25 17:17:37.382	t
cmpkl4qzi000i04l4mobnziy5	DECLINED	cmpcpgupa000004l5ehnc0kjs	cmpkl4qyr000004l41n642701	2026-05-25 17:26:58.902	2026-05-25 02:26:25.565	2026-05-25 17:26:58.904	t
cmpkl4qzi000e04l4xcl1fmjs	CONFIRMED	cmpefep0o000504laynrqmhnw	cmpkl4qyr000004l41n642701	2026-05-25 17:46:05.212	2026-05-25 02:26:25.565	2026-05-25 17:46:05.212	t
cmpn1o6fp000104jrojhuevgr	PENDING	cmpn1o6et000004jrcnmw0gav	cmpg3rbz2000004la05x1z03i	\N	2026-05-26 19:44:58.261	2026-05-26 19:44:58.261	t
cmpkl4qzh000204l4wl5yc9gv	CONFIRMED	cmpcov8jd000004l8umh13pux	cmpkl4qyr000004l41n642701	2026-05-25 18:08:54.352	2026-05-25 02:26:25.565	2026-05-25 18:08:54.368	t
cmpkl4qzi000n04l4twfhxa64	CONFIRMED	cmpdz3jpw000004jvdohsd2ri	cmpkl4qyr000004l41n642701	2026-05-25 19:01:52.402	2026-05-25 02:26:25.565	2026-05-25 19:01:52.413	t
cmpkl4qzi000b04l45rei2mwx	CONFIRMED	cmpefcd1z000004lasd2r1kdh	cmpkl4qyr000004l41n642701	2026-05-25 19:14:33.473	2026-05-25 02:26:25.565	2026-05-25 19:14:33.473	t
cmpkl4qzi000604l4mkltpa8f	CONFIRMED	cmpcsds4s000004jmgpwku1j2	cmpkl4qyr000004l41n642701	2026-05-25 23:24:36.497	2026-05-25 02:26:25.565	2026-05-25 23:24:36.508	t
cmpkl4qzi000804l4akknd3x0	CONFIRMED	cmpct94t9000204jsxeeckk3m	cmpkl4qyr000004l41n642701	2026-05-26 14:57:06.966	2026-05-25 02:26:25.565	2026-05-26 14:57:06.996	t
cmpkl4qzi000a04l4beax6eer	CONFIRMED	cmpcpimjz000004jpcdqgfhfx	cmpkl4qyr000004l41n642701	2026-05-26 16:14:21.654	2026-05-25 02:26:25.565	2026-05-26 16:14:21.665	t
cmpkl4qzh000304l41wc4ielx	DECLINED	cmpcoxez0000304l8g40zcfou	cmpkl4qyr000004l41n642701	2026-05-26 16:59:00.591	2026-05-25 02:26:25.565	2026-05-26 16:59:00.602	t
cmpkl4qzi000504l4etef2kn5	CONFIRMED	cmpcqf47m000004l85vce0gfh	cmpkl4qyr000004l41n642701	2026-05-26 17:08:06.036	2026-05-25 02:26:25.565	2026-05-26 17:08:06.047	t
cmpn1o6fp000404jrvvxarrss	PENDING	cmpn1o6et000004jrcnmw0gav	cmpg3k0ot000004l5zes9kdtc	\N	2026-05-26 19:44:58.261	2026-05-26 19:44:58.261	t
cmpkl4qzi000k04l41wiejtee	CONFIRMED	cmpg41k59000004l7521hfcn4	cmpkl4qyr000004l41n642701	2026-05-26 20:20:06.36	2026-05-25 02:26:25.565	2026-05-26 20:20:06.369	t
cmpkl4qzi000m04l47036bimk	DECLINED	cmph7t8a1000004l9n8uic25p	cmpkl4qyr000004l41n642701	2026-05-26 21:31:35.431	2026-05-25 02:26:25.565	2026-05-26 21:31:35.436	t
cmpn1o6fp000504jr4v731ymb	CONFIRMED	cmpn1o6et000004jrcnmw0gav	cmpkl4qyr000004l41n642701	2026-05-26 21:50:03.74	2026-05-26 19:44:58.261	2026-05-26 21:50:03.758	t
cmpkl4qzi000d04l4go5543nm	DECLINED	cmpefdukz000404lanevrsp34	cmpkl4qyr000004l41n642701	2026-05-27 02:20:44.787	2026-05-25 02:26:25.565	2026-05-27 02:20:44.796	t
cmpkl4qzi000f04l4u98jauru	CONFIRMED	cmpefcqj2000104ladlx0ysjz	cmpkl4qyr000004l41n642701	2026-05-27 02:33:40.208	2026-05-25 02:26:25.565	2026-05-27 02:33:40.218	t
cmpkl4qzi000c04l472rm7ec0	DECLINED	cmpefdkyx000304la3k3nq9p9	cmpkl4qyr000004l41n642701	2026-05-27 13:09:23.926	2026-05-25 02:26:25.565	2026-05-27 13:09:23.937	t
cmpkl4qzi000704l41pvyzwjt	DECLINED	cmpct2xp7000004jsv1ujpe1r	cmpkl4qyr000004l41n642701	2026-05-27 13:14:43.891	2026-05-25 02:26:25.565	2026-05-27 13:14:43.899	t
cmpkl4qzh000404l4je89oq2b	DECLINED	cmpcpt3n6000004l561lm2ja7	cmpkl4qyr000004l41n642701	2026-05-27 14:18:57.491	2026-05-25 02:26:25.565	2026-05-27 14:18:57.503	t
cmpkl4qzi000g04l41msvf6sn	CONFIRMED	cmpcsehq1000104ibueo8dlm5	cmpkl4qyr000004l41n642701	2026-05-27 16:57:52.097	2026-05-25 02:26:25.565	2026-05-27 16:57:52.108	t
cmpr23iw7000504icckl2e1qy	DECLINED	cmpcoxez0000304l8g40zcfou	cmpr23ivg000204icrms1915w	2026-05-29 15:50:52.439	2026-05-29 15:07:58.951	2026-05-29 15:50:52.45	t
cmpr23iw7000304ic5ugjjs58	CONFIRMED	cmpcm7sgp000004l1fp9o52ky	cmpr23ivg000204icrms1915w	2026-05-29 15:51:59.251	2026-05-29 15:07:58.951	2026-05-29 15:51:59.254	t
cmpr23iw7000c04ic10u965qr	CONFIRMED	cmpefcd1z000004lasd2r1kdh	cmpr23ivg000204icrms1915w	2026-05-29 16:04:14.207	2026-05-29 15:07:58.951	2026-05-29 16:04:14.208	t
cmpr23iw7000404ic7jm5mb6c	DECLINED	cmpcov8jd000004l8umh13pux	cmpr23ivg000204icrms1915w	2026-05-29 16:35:11.759	2026-05-29 15:07:58.951	2026-05-29 16:35:11.772	t
cmpr23iw7000604ics82qoiqi	DECLINED	cmpcqf47m000004l85vce0gfh	cmpr23ivg000204icrms1915w	2026-05-29 21:49:31.433	2026-05-29 15:07:58.951	2026-05-29 21:49:31.433	t
cmpr23iw7000804icmg3zau98	DECLINED	cmpct2xp7000004jsv1ujpe1r	cmpr23ivg000204icrms1915w	2026-05-30 00:11:38.805	2026-05-29 15:07:58.951	2026-05-30 00:11:38.816	t
cmpr23iw7000d04icc2pp7qo1	CONFIRMED	cmpefdkyx000304la3k3nq9p9	cmpr23ivg000204icrms1915w	2026-05-30 00:55:59.45	2026-05-29 15:07:58.951	2026-05-30 00:55:59.46	t
cmpr23iw7000b04icu2ku5kqk	DECLINED	cmpcpimjz000004jpcdqgfhfx	cmpr23ivg000204icrms1915w	2026-05-30 03:20:43.364	2026-05-29 15:07:58.951	2026-05-30 03:20:43.373	t
cmpr23iw7000704icz4o79qni	CONFIRMED	cmpcsds4s000004jmgpwku1j2	cmpr23ivg000204icrms1915w	2026-05-30 12:30:48.341	2026-05-29 15:07:58.951	2026-05-30 12:30:48.352	t
cmpr23iw7000e04icxjtzx36t	PENDING	cmpefdukz000404lanevrsp34	cmpr23ivg000204icrms1915w	\N	2026-05-29 15:07:58.951	2026-05-29 15:07:58.951	t
cmpr23iw7000p04icnahtkxfx	CONFIRMED	cmpdz3jpw000004jvdohsd2ri	cmpr23ivg000204icrms1915w	2026-05-30 13:41:00.288	2026-05-29 15:07:58.951	2026-05-30 13:41:00.297	t
cmpg41k60000504l7oj4y4h00	CONFIRMED	cmpg41k59000004l7521hfcn4	cmpg3k0ot000004l5zes9kdtc	2026-06-06 11:47:18.417	2026-05-21 23:16:58.584	2026-06-06 11:47:18.426	t
cmpr23iw7000h04iccog3wgfs	PENDING	cmpcsehq1000104ibueo8dlm5	cmpr23ivg000204icrms1915w	\N	2026-05-29 15:07:58.951	2026-05-29 15:07:58.951	t
cmq59e1x0000904ju2b4zb41k	PENDING	cmpcpimjz000004jpcdqgfhfx	cmq59e1vu000004juzmp8xftw	\N	2026-06-08 13:40:53.939	2026-06-08 13:40:53.939	f
cmq59e1x0000a04jufild9ae9	PENDING	cmpefcd1z000004lasd2r1kdh	cmq59e1vu000004juzmp8xftw	\N	2026-06-08 13:40:53.939	2026-06-08 13:40:53.939	f
cmpr23iw7000k04ic22brgvuh	PENDING	cmpg43u13000604l7y6t0hdtt	cmpr23ivg000204icrms1915w	\N	2026-05-29 15:07:58.951	2026-05-29 15:07:58.951	t
cmq59e1x0000b04jus5o6ifcb	PENDING	cmpefdkyx000304la3k3nq9p9	cmq59e1vu000004juzmp8xftw	\N	2026-06-08 13:40:53.939	2026-06-08 13:40:53.939	f
cmq59e1x0000c04jup8kwlltf	PENDING	cmpefdukz000404lanevrsp34	cmq59e1vu000004juzmp8xftw	\N	2026-06-08 13:40:53.939	2026-06-08 13:40:53.939	f
cmq59e1x0000d04ju585bce0d	PENDING	cmpefep0o000504laynrqmhnw	cmq59e1vu000004juzmp8xftw	\N	2026-06-08 13:40:53.939	2026-06-08 13:40:53.939	f
cmq59e1x0000e04jumvhgwlt8	PENDING	cmpefcqj2000104ladlx0ysjz	cmq59e1vu000004juzmp8xftw	\N	2026-06-08 13:40:53.939	2026-06-08 13:40:53.939	f
cmq9kccvt000b04l56bsv6zdz	DECLINED	cmpefdkyx000304la3k3nq9p9	cmq9kccux000004l58m8puvai	2026-06-14 14:58:10.168	2026-06-11 13:58:35.321	2026-06-14 14:58:10.178	t
cmq59e1x0000f04ju9l1qj5uy	PENDING	cmpcsehq1000104ibueo8dlm5	cmq59e1vu000004juzmp8xftw	\N	2026-06-08 13:40:53.939	2026-06-08 13:40:53.939	f
cmpr23iw7000f04icavctx9mz	DECLINED	cmpefep0o000504laynrqmhnw	cmpr23ivg000204icrms1915w	2026-05-29 16:03:13.558	2026-05-29 15:07:58.951	2026-05-29 16:03:13.56	t
cmpr23iw7000m04ichfkqamjb	CONFIRMED	cmpcpgupa000004l5ehnc0kjs	cmpr23ivg000204icrms1915w	2026-05-29 17:39:41.171	2026-05-29 15:07:58.951	2026-05-29 17:39:41.189	t
cmpr23iw7000o04icipp6wu6p	DECLINED	cmpcpt3n6000004l561lm2ja7	cmpr23ivg000204icrms1915w	2026-05-29 20:26:51.987	2026-05-29 15:07:58.951	2026-05-29 20:26:52.004	t
cmpr23iw7000l04ic0oin9xir	DECLINED	cmph7t8a1000004l9n8uic25p	cmpr23ivg000204icrms1915w	2026-05-29 21:50:09.175	2026-05-29 15:07:58.951	2026-05-29 21:50:09.195	t
cmq59e1x0000g04juvdahwvq7	PENDING	cmpg41k59000004l7521hfcn4	cmq59e1vu000004juzmp8xftw	\N	2026-06-08 13:40:53.939	2026-06-08 13:40:53.939	f
cmpr23iw7000q04iczttcedx6	CONFIRMED	cmpn1o6et000004jrcnmw0gav	cmpr23ivg000204icrms1915w	2026-05-30 00:40:08.66	2026-05-29 15:07:58.951	2026-05-30 00:40:08.672	t
cmpr23iw7000n04icged2moba	DECLINED	cmpcopzu6000004jro3prr7ca	cmpr23ivg000204icrms1915w	2026-05-30 01:15:49.476	2026-05-29 15:07:58.951	2026-05-30 01:15:49.498	t
cmpr23iw7000g04icrmvsiy5i	DECLINED	cmpefcqj2000104ladlx0ysjz	cmpr23ivg000204icrms1915w	2026-05-30 11:55:08.639	2026-05-29 15:07:58.951	2026-05-30 11:55:08.65	t
cmpr23iw7000i04icd1a92yeq	CONFIRMED	cmpfk8v2v000704jlp8siky9e	cmpr23ivg000204icrms1915w	2026-05-30 12:18:56.494	2026-05-29 15:07:58.951	2026-05-30 12:18:56.509	t
cmpr23iw7000j04ic3mvfegdt	DECLINED	cmpg41k59000004l7521hfcn4	cmpr23ivg000204icrms1915w	2026-05-30 13:30:52.203	2026-05-29 15:07:58.951	2026-05-30 13:30:52.218	t
cmq59e1x0000h04ju4gfx02la	PENDING	cmpg43u13000604l7y6t0hdtt	cmq59e1vu000004juzmp8xftw	\N	2026-06-08 13:40:53.939	2026-06-08 13:40:53.939	f
cmq59e1x0000i04jumw0hdjgo	PENDING	cmph7t8a1000004l9n8uic25p	cmq59e1vu000004juzmp8xftw	\N	2026-06-08 13:40:53.939	2026-06-08 13:40:53.939	f
cmq59e1x0000j04jue3lm1dm6	PENDING	cmpcpgupa000004l5ehnc0kjs	cmq59e1vu000004juzmp8xftw	\N	2026-06-08 13:40:53.939	2026-06-08 13:40:53.939	f
cmq59e1x0000k04ju2cvp3z2y	PENDING	cmpcopzu6000004jro3prr7ca	cmq59e1vu000004juzmp8xftw	\N	2026-06-08 13:40:53.939	2026-06-08 13:40:53.939	f
cmq59e1x0000l04judkwvozym	PENDING	cmpcpt3n6000004l561lm2ja7	cmq59e1vu000004juzmp8xftw	\N	2026-06-08 13:40:53.939	2026-06-08 13:40:53.939	f
cmq59e1x0000m04juxk2mwtcr	PENDING	cmpdz3jpw000004jvdohsd2ri	cmq59e1vu000004juzmp8xftw	\N	2026-06-08 13:40:53.939	2026-06-08 13:40:53.939	f
cmq59e1x0000n04ju1osbxdoz	PENDING	cmpn1o6et000004jrcnmw0gav	cmq59e1vu000004juzmp8xftw	\N	2026-06-08 13:40:53.939	2026-06-08 13:40:53.939	f
cmq59e1x0000o04ju7syt7jvr	PENDING	cmpfk8v2v000704jlp8siky9e	cmq59e1vu000004juzmp8xftw	\N	2026-06-08 13:40:53.939	2026-06-08 13:40:53.939	f
cmq9kccvt000m04l5fxcgo65y	CONFIRMED	cmpdz3jpw000004jvdohsd2ri	cmq9kccux000004l58m8puvai	2026-06-14 17:37:37.828	2026-06-11 13:58:35.321	2026-06-14 17:37:37.848	t
cmq9kccvt000f04l57a1x73id	CONFIRMED	cmpcsehq1000104ibueo8dlm5	cmq9kccux000004l58m8puvai	2026-06-14 16:50:11.024	2026-06-11 13:58:35.321	2026-06-14 16:50:11.025	t
cmskhxpco000404jq2iucz1py	CONFIRMED	cmpfk8v2v000704jlp8siky9e	cmskhxpbb000004jq77wb6pqt	2026-08-26 20:27:12.452	2026-08-08 14:56:05.016	2026-08-26 20:27:12.452	t
cmq9kccvt000504l566yolhfg	CONFIRMED	cmpcsds4s000004jmgpwku1j2	cmq9kccux000004l58m8puvai	2026-06-14 18:36:05.883	2026-06-11 13:58:35.321	2026-06-14 18:36:05.898	t
cmq9kccvt000804l54on9tiqv	PENDING	cmpdz2mcq000104jr9xnhl4i0	cmq9kccux000004l58m8puvai	\N	2026-06-11 13:58:35.321	2026-06-11 13:58:35.321	t
cmq9kccvt000404l56vkl4u29	DECLINED	cmpcqf47m000004l85vce0gfh	cmq9kccux000004l58m8puvai	2026-06-14 19:04:58.631	2026-06-11 13:58:35.321	2026-06-14 19:04:58.652	t
cmq9kccvt000c04l588ythxe2	PENDING	cmpefdukz000404lanevrsp34	cmq9kccux000004l58m8puvai	\N	2026-06-11 13:58:35.321	2026-06-11 13:58:35.321	t
cmq9kccvt000i04l5p85q5tsm	DECLINED	cmph7t8a1000004l9n8uic25p	cmq9kccux000004l58m8puvai	2026-06-14 19:12:16.688	2026-06-11 13:58:35.321	2026-06-14 19:12:16.69	t
cmq9kccvt000e04l52rwj4n72	PENDING	cmpefcqj2000104ladlx0ysjz	cmq9kccux000004l58m8puvai	\N	2026-06-11 13:58:35.321	2026-06-11 13:58:35.321	t
cmq9kccvt000904l5pqzcg0sl	CONFIRMED	cmpcpimjz000004jpcdqgfhfx	cmq9kccux000004l58m8puvai	2026-06-14 20:20:39.831	2026-06-11 13:58:35.321	2026-06-14 20:20:39.846	t
cmq9kccvt000h04l5tt4pvzu6	PENDING	cmpg43u13000604l7y6t0hdtt	cmq9kccux000004l58m8puvai	\N	2026-06-11 13:58:35.321	2026-06-11 13:58:35.321	t
cmq9kccvt000704l50kfnd0e0	CONFIRMED	cmpct94t9000204jsxeeckk3m	cmq9kccux000004l58m8puvai	2026-06-14 20:25:27.151	2026-06-11 13:58:35.321	2026-06-14 20:25:27.153	t
cmq9kccvt000104l5xpqxrimq	CONFIRMED	cmpcm7sgp000004l1fp9o52ky	cmq9kccux000004l58m8puvai	2026-06-14 20:28:17.868	2026-06-11 13:58:35.321	2026-06-14 20:28:17.903	t
cmq9kccvt000n04l5jg10a1jy	PENDING	cmpn1o6et000004jrcnmw0gav	cmq9kccux000004l58m8puvai	\N	2026-06-11 13:58:35.321	2026-06-11 13:58:35.321	t
cmq9kccvt000o04l52un9b7gu	PENDING	cmpfk8v2v000704jlp8siky9e	cmq9kccux000004l58m8puvai	\N	2026-06-11 13:58:35.321	2026-06-11 13:58:35.321	t
cmq9kccvt000d04l5nldvo8ra	CONFIRMED	cmpefep0o000504laynrqmhnw	cmq9kccux000004l58m8puvai	2026-06-11 16:05:27.127	2026-06-11 13:58:35.321	2026-06-11 16:05:27.127	t
cmq9kccvt000l04l5mx8k3j8p	DECLINED	cmpcpt3n6000004l561lm2ja7	cmq9kccux000004l58m8puvai	2026-06-11 16:31:51.967	2026-06-11 13:58:35.321	2026-06-11 16:31:51.984	t
cmq9kccvt000604l52q5qoc8f	DECLINED	cmpct2xp7000004jsv1ujpe1r	cmq9kccux000004l58m8puvai	2026-06-11 17:02:40.454	2026-06-11 13:58:35.321	2026-06-11 17:02:40.46	t
cmq9kccvt000g04l53jin77af	DECLINED	cmpg41k59000004l7521hfcn4	cmq9kccux000004l58m8puvai	2026-06-11 17:02:49.742	2026-06-11 13:58:35.321	2026-06-11 17:02:49.758	t
cmq9kccvt000204l5wxyb7s7n	CONFIRMED	cmpcov8jd000004l8umh13pux	cmq9kccux000004l58m8puvai	2026-06-11 17:25:10.959	2026-06-11 13:58:35.321	2026-06-11 17:25:10.97	t
cmq9kccvt000k04l5fb1ye468	CONFIRMED	cmpcopzu6000004jro3prr7ca	cmq9kccux000004l58m8puvai	2026-06-11 17:53:28.815	2026-06-11 13:58:35.321	2026-06-11 17:53:28.834	t
cmq9kccvt000j04l53qcz3a3f	DECLINED	cmpcpgupa000004l5ehnc0kjs	cmq9kccux000004l58m8puvai	2026-06-11 20:33:17.313	2026-06-11 13:58:35.321	2026-06-11 20:33:17.324	t
cmq9kccvt000304l504bmap03	DECLINED	cmpcoxez0000304l8g40zcfou	cmq9kccux000004l58m8puvai	2026-06-13 14:12:47.97	2026-06-11 13:58:35.321	2026-06-13 14:12:47.979	t
cmq9kccvt000a04l5znorm6mg	CONFIRMED	cmpefcd1z000004lasd2r1kdh	cmq9kccux000004l58m8puvai	2026-06-13 14:26:03.233	2026-06-11 13:58:35.321	2026-06-13 14:26:03.247	t
cmr4v6j9r000c04jmk9snq32l	PENDING	cmpefdukz000404lanevrsp34	cmr4v6j8z000004jmrs48v3h3	\N	2026-07-03 11:42:50.895	2026-07-03 11:42:50.895	t
cmr4v6j9r000d04jm5c5znjox	PENDING	cmpefep0o000504laynrqmhnw	cmr4v6j8z000004jmrs48v3h3	\N	2026-07-03 11:42:50.895	2026-07-03 11:42:50.895	t
cmr4v6j9r000h04jmo3y0dv22	PENDING	cmpg43u13000604l7y6t0hdtt	cmr4v6j8z000004jmrs48v3h3	\N	2026-07-03 11:42:50.895	2026-07-03 11:42:50.895	t
cmr4v6j9r000i04jmmczk5nb4	PENDING	cmph7t8a1000004l9n8uic25p	cmr4v6j8z000004jmrs48v3h3	\N	2026-07-03 11:42:50.895	2026-07-03 11:42:50.895	t
cmr4v6j9r000n04jmhranuwu1	PENDING	cmpn1o6et000004jrcnmw0gav	cmr4v6j8z000004jmrs48v3h3	\N	2026-07-03 11:42:50.895	2026-07-03 11:42:50.895	t
cmr4v6j9r000104jmxjj7no0d	CONFIRMED	cmpcm7sgp000004l1fp9o52ky	cmr4v6j8z000004jmrs48v3h3	2026-07-03 11:45:38.626	2026-07-03 11:42:50.895	2026-07-03 11:45:38.631	t
cmrkxjsvw000104jtemarw1h0	CONFIRMED	cmpcm7sgp000004l1fp9o52ky	cmrkxjsua000004jtqvbnfwac	2026-07-14 17:35:46.483	2026-07-14 17:33:27.932	2026-07-14 17:35:46.487	t
cmr4v6j9r000o04jm0shugfmt	CONFIRMED	cmpfk8v2v000704jlp8siky9e	cmr4v6j8z000004jmrs48v3h3	2026-07-03 12:27:17.43	2026-07-03 11:42:50.895	2026-07-03 12:27:17.437	t
cmr4v6j9r000f04jmi9enoxyf	CONFIRMED	cmpcsehq1000104ibueo8dlm5	cmr4v6j8z000004jmrs48v3h3	2026-07-03 14:06:14.835	2026-07-03 11:42:50.895	2026-07-03 14:06:14.847	t
cmr4v6j9r000a04jm95uiuf4g	CONFIRMED	cmpefcd1z000004lasd2r1kdh	cmr4v6j8z000004jmrs48v3h3	2026-07-03 14:09:31.512	2026-07-03 11:42:50.895	2026-07-03 14:09:31.522	t
cmr4v6j9r000b04jmae6zb74l	DECLINED	cmpefdkyx000304la3k3nq9p9	cmr4v6j8z000004jmrs48v3h3	2026-07-04 01:45:54.461	2026-07-03 11:42:50.895	2026-07-04 01:45:54.472	t
cmr4v6j9r000604jmast11mj1	DECLINED	cmpct2xp7000004jsv1ujpe1r	cmr4v6j8z000004jmrs48v3h3	2026-07-04 02:46:32.396	2026-07-03 11:42:50.895	2026-07-04 02:46:32.406	t
cmr4v6j9r000904jmfemb9qa1	CONFIRMED	cmpcpimjz000004jpcdqgfhfx	cmr4v6j8z000004jmrs48v3h3	2026-07-04 12:49:07.606	2026-07-03 11:42:50.895	2026-07-04 12:49:07.624	t
cmr4v6j9r000804jmblshzccc	CONFIRMED	cmpdz2mcq000104jr9xnhl4i0	cmr4v6j8z000004jmrs48v3h3	2026-07-04 13:14:16.644	2026-07-03 11:42:50.895	2026-07-04 13:14:16.66	t
cmr4v6j9r000704jmm54g7wkb	CONFIRMED	cmpct94t9000204jsxeeckk3m	cmr4v6j8z000004jmrs48v3h3	2026-07-04 13:15:47.508	2026-07-03 11:42:50.895	2026-07-04 13:15:47.519	t
cmr4v6j9r000k04jmnvp4xv9o	DECLINED	cmpcopzu6000004jro3prr7ca	cmr4v6j8z000004jmrs48v3h3	2026-07-04 13:27:22.365	2026-07-03 11:42:50.895	2026-07-04 13:27:22.367	t
cmr4v6j9r000504jmje7gvch5	CONFIRMED	cmpcsds4s000004jmgpwku1j2	cmr4v6j8z000004jmrs48v3h3	2026-07-04 13:36:35.016	2026-07-03 11:42:50.895	2026-07-04 13:36:35.016	t
cmr4v6j9r000j04jmb83td3nv	DECLINED	cmpcpgupa000004l5ehnc0kjs	cmr4v6j8z000004jmrs48v3h3	2026-07-04 13:59:41.592	2026-07-03 11:42:50.895	2026-07-04 13:59:41.601	t
cmr4v6j9r000g04jm4djnh1d4	DECLINED	cmpg41k59000004l7521hfcn4	cmr4v6j8z000004jmrs48v3h3	2026-07-04 13:59:53.721	2026-07-03 11:42:50.895	2026-07-04 13:59:53.743	t
cmr4v6j9r000l04jm2fy141bd	CONFIRMED	cmpcpt3n6000004l561lm2ja7	cmr4v6j8z000004jmrs48v3h3	2026-07-04 16:48:26.621	2026-07-03 11:42:50.895	2026-07-04 16:48:26.63	t
cmr4v6j9r000e04jmodl7mmyx	CONFIRMED	cmpefcqj2000104ladlx0ysjz	cmr4v6j8z000004jmrs48v3h3	2026-07-04 17:26:01.061	2026-07-03 11:42:50.895	2026-07-04 17:26:01.073	t
cmr4v6j9r000m04jmaqng203u	DECLINED	cmpdz3jpw000004jvdohsd2ri	cmr4v6j8z000004jmrs48v3h3	2026-07-04 18:44:01.853	2026-07-03 11:42:50.895	2026-07-04 18:44:01.874	t
cmrkxjsvx000c04jto522leh9	PENDING	cmpefdukz000404lanevrsp34	cmrkxjsua000004jtqvbnfwac	\N	2026-07-14 17:33:27.932	2026-07-14 17:33:27.932	t
cmrkxjsvx000b04jtm88toalh	CONFIRMED	cmpefdkyx000304la3k3nq9p9	cmrkxjsua000004jtqvbnfwac	2026-07-14 17:37:07.667	2026-07-14 17:33:27.932	2026-07-14 17:37:07.676	t
cmrkxjsvw000404jtu5ci6xi1	CONFIRMED	cmpcqf47m000004l85vce0gfh	cmrkxjsua000004jtqvbnfwac	2026-07-14 17:37:28.9	2026-07-14 17:33:27.932	2026-07-14 17:37:28.925	t
cmrkxjsvw000304jt2pw6ordr	CONFIRMED	cmpcoxez0000304l8g40zcfou	cmrkxjsua000004jtqvbnfwac	2026-07-14 17:39:43.443	2026-07-14 17:33:27.932	2026-07-14 17:39:43.443	t
cmrkxjsvx000804jte1p7ou3h	CONFIRMED	cmpdz2mcq000104jr9xnhl4i0	cmrkxjsua000004jtqvbnfwac	2026-07-14 17:53:04.298	2026-07-14 17:33:27.932	2026-07-14 17:53:04.307	t
cmrkxjsvx000a04jt8pgimy7c	CONFIRMED	cmpefcd1z000004lasd2r1kdh	cmrkxjsua000004jtqvbnfwac	2026-07-14 20:10:03.832	2026-07-14 17:33:27.932	2026-07-14 20:10:03.844	t
cmrkxjsvx000704jtgosmj9sr	CONFIRMED	cmpct94t9000204jsxeeckk3m	cmrkxjsua000004jtqvbnfwac	2026-07-14 20:45:05.18	2026-07-14 17:33:27.932	2026-07-14 20:45:05.191	t
cmrkxjsvw000504jtmxu21xy7	CONFIRMED	cmpcsds4s000004jmgpwku1j2	cmrkxjsua000004jtqvbnfwac	2026-07-15 11:27:09.877	2026-07-14 17:33:27.932	2026-07-15 11:27:09.888	t
cmrkxjsvx000904jt0vd2wzhx	CONFIRMED	cmpcpimjz000004jpcdqgfhfx	cmrkxjsua000004jtqvbnfwac	2026-07-15 12:00:36.465	2026-07-14 17:33:27.932	2026-07-15 12:00:36.482	t
cmrkxjsvw000204jtxlxe34na	CONFIRMED	cmpcov8jd000004l8umh13pux	cmrkxjsua000004jtqvbnfwac	2026-07-16 19:21:52.816	2026-07-14 17:33:27.932	2026-07-16 19:21:52.827	t
cmrkxjsvx000d04jto609d7zx	DECLINED	cmpefep0o000504laynrqmhnw	cmrkxjsua000004jtqvbnfwac	2026-07-16 21:56:43.014	2026-07-14 17:33:27.932	2026-07-16 21:56:43.025	t
cmrkxjsvw000604jt66zjheww	CONFIRMED	cmpct2xp7000004jsv1ujpe1r	cmrkxjsua000004jtqvbnfwac	2026-07-16 22:52:52.53	2026-07-14 17:33:27.932	2026-07-16 22:52:52.541	t
cmrkxjsvx000g04jtguo2umxx	PENDING	cmpg41k59000004l7521hfcn4	cmrkxjsua000004jtqvbnfwac	\N	2026-07-14 17:33:27.932	2026-07-14 17:33:27.932	t
cmrkxlnhn000c04jo6e7jk99n	PENDING	cmpefdukz000404lanevrsp34	cmrkxlng5000004jofpanlfev	\N	2026-07-14 17:34:54.251	2026-07-14 17:34:54.251	t
cmrkxlnhn000g04joa6003x8d	PENDING	cmpg41k59000004l7521hfcn4	cmrkxlng5000004jofpanlfev	\N	2026-07-14 17:34:54.251	2026-07-14 17:34:54.251	t
cmrkxjsvx000m04jtj5m1djt3	CONFIRMED	cmpn1o6et000004jrcnmw0gav	cmrkxjsua000004jtqvbnfwac	2026-07-14 17:42:04.759	2026-07-14 17:33:27.932	2026-07-14 17:42:04.76	t
cmrkxjsvx000f04jthyzt9yvy	DECLINED	cmpcsehq1000104ibueo8dlm5	cmrkxjsua000004jtqvbnfwac	2026-07-14 18:28:38.462	2026-07-14 17:33:27.932	2026-07-14 18:28:38.473	t
cmrkxjsvx000j04jt0iw2ynyl	CONFIRMED	cmpcopzu6000004jro3prr7ca	cmrkxjsua000004jtqvbnfwac	2026-07-15 00:12:16.76	2026-07-14 17:33:27.932	2026-07-15 00:12:16.791	t
cmrkxjsvx000i04jt3rtllehy	DECLINED	cmpcpgupa000004l5ehnc0kjs	cmrkxjsua000004jtqvbnfwac	2026-07-15 11:54:22.895	2026-07-14 17:33:27.932	2026-07-15 11:54:22.897	t
cmrkxjsvx000e04jt1v0hic8j	CONFIRMED	cmpefcqj2000104ladlx0ysjz	cmrkxjsua000004jtqvbnfwac	2026-07-15 14:39:55.309	2026-07-14 17:33:27.932	2026-07-15 14:39:55.321	t
cmrkxjsvx000k04jtfghnmir1	CONFIRMED	cmpcpt3n6000004l561lm2ja7	cmrkxjsua000004jtqvbnfwac	2026-07-15 19:47:16.348	2026-07-14 17:33:27.932	2026-07-15 19:47:16.358	t
cmrkxjsvx000l04jtw4g0m2oi	DECLINED	cmpdz3jpw000004jvdohsd2ri	cmrkxjsua000004jtqvbnfwac	2026-07-15 21:59:55.55	2026-07-14 17:33:27.932	2026-07-15 21:59:55.562	t
cmrkxjsvx000n04jt019g0l6p	CONFIRMED	cmpfk8v2v000704jlp8siky9e	cmrkxjsua000004jtqvbnfwac	2026-07-16 17:17:46.464	2026-07-14 17:33:27.932	2026-07-16 17:17:46.477	t
cmrkxjsvx000h04jtp79vlwwg	DECLINED	cmph7t8a1000004l9n8uic25p	cmrkxjsua000004jtqvbnfwac	2026-07-16 19:41:58.961	2026-07-14 17:33:27.932	2026-07-16 19:41:58.971	t
cmqp5jh9a000304jpqscibc7n	CONFIRMED	cmpcoxez0000304l8g40zcfou	cmqp5jh8b000004jp8k1q116l	2026-07-17 11:53:30.676	2026-06-22 11:48:32.158	2026-07-17 11:53:30.701	t
cmrp7l1bv000204l4xrzu1vpi	PENDING	cmpcm7sgp000004l1fp9o52ky	cmrp7l1ax000104l49nmc6qf9	\N	2026-07-17 17:25:26.395	2026-07-17 17:25:26.395	t
cmrp7l1bv000304l4isgsp45l	PENDING	cmpcov8jd000004l8umh13pux	cmrp7l1ax000104l49nmc6qf9	\N	2026-07-17 17:25:26.395	2026-07-17 17:25:26.395	t
cmrp7l1bv000404l4wa8dlgaj	PENDING	cmpcoxez0000304l8g40zcfou	cmrp7l1ax000104l49nmc6qf9	\N	2026-07-17 17:25:26.395	2026-07-17 17:25:26.395	t
cmrp7l1bv000504l4h4t1njyb	PENDING	cmpcqf47m000004l85vce0gfh	cmrp7l1ax000104l49nmc6qf9	\N	2026-07-17 17:25:26.395	2026-07-17 17:25:26.395	t
cmrp7l1bv000604l426notop1	PENDING	cmpcsds4s000004jmgpwku1j2	cmrp7l1ax000104l49nmc6qf9	\N	2026-07-17 17:25:26.395	2026-07-17 17:25:26.395	t
cmrp7l1bv000704l4c0rvsaj6	PENDING	cmpct94t9000204jsxeeckk3m	cmrp7l1ax000104l49nmc6qf9	\N	2026-07-17 17:25:26.395	2026-07-17 17:25:26.395	t
cmrp7l1bw000804l4dewtfxh0	PENDING	cmpdz2mcq000104jr9xnhl4i0	cmrp7l1ax000104l49nmc6qf9	\N	2026-07-17 17:25:26.395	2026-07-17 17:25:26.395	t
cmrp7l1bw000904l45d9w91hl	PENDING	cmpcpimjz000004jpcdqgfhfx	cmrp7l1ax000104l49nmc6qf9	\N	2026-07-17 17:25:26.395	2026-07-17 17:25:26.395	t
cmrp7l1bw000a04l4mk0rvzcd	PENDING	cmpefcd1z000004lasd2r1kdh	cmrp7l1ax000104l49nmc6qf9	\N	2026-07-17 17:25:26.395	2026-07-17 17:25:26.395	t
cmrp7l1bw000b04l4a03ysqu9	PENDING	cmpefdkyx000304la3k3nq9p9	cmrp7l1ax000104l49nmc6qf9	\N	2026-07-17 17:25:26.395	2026-07-17 17:25:26.395	t
cmrozuqw9000304l5k5b77pct	CONFIRMED	cmrozuqv4000104l5tbza8qgy	cmqp5jh8b000004jp8k1q116l	2026-07-18 20:40:47.127	2026-07-17 13:49:02.505	2026-07-18 20:40:47.137	t
cmrkxlnhn000k04jootx3fst5	CONFIRMED	cmpcpt3n6000004l561lm2ja7	cmrkxlng5000004jofpanlfev	2026-07-20 14:02:04.559	2026-07-14 17:34:54.251	2026-07-20 14:02:04.559	t
cmrkxlnhn000104jo2aiou5rt	CONFIRMED	cmpcm7sgp000004l1fp9o52ky	cmrkxlng5000004jofpanlfev	2026-07-20 14:03:47.889	2026-07-14 17:34:54.251	2026-07-20 14:03:47.916	t
cmrkxlnhn000404joz0nbpvw6	CONFIRMED	cmpcqf47m000004l85vce0gfh	cmrkxlng5000004jofpanlfev	2026-07-20 14:12:11.197	2026-07-14 17:34:54.251	2026-07-20 14:12:11.199	t
cmrozuqw9000204l5ysolywin	CONFIRMED	cmrozuqv4000104l5tbza8qgy	cmpg3u3kh000l04la6hj2e5r3	2026-08-05 01:13:45.538	2026-07-17 13:49:02.505	2026-08-05 01:13:45.544	t
cmrkxlnhn000904jof8wzor4z	CONFIRMED	cmpcpimjz000004jpcdqgfhfx	cmrkxlng5000004jofpanlfev	2026-07-20 14:47:00.916	2026-07-14 17:34:54.251	2026-07-20 14:47:00.918	t
cmrkxlnhn000e04jo1mqdk58e	CONFIRMED	cmpefcqj2000104ladlx0ysjz	cmrkxlng5000004jofpanlfev	2026-07-20 16:16:16.858	2026-07-14 17:34:54.251	2026-07-20 16:16:16.869	t
cmrkxlnhn000a04johs9tq2cy	CONFIRMED	cmpefcd1z000004lasd2r1kdh	cmrkxlng5000004jofpanlfev	2026-07-20 20:56:50.707	2026-07-14 17:34:54.251	2026-07-20 20:56:50.718	t
cmrkxlnhn000m04joujnwrf58	CONFIRMED	cmpn1o6et000004jrcnmw0gav	cmrkxlng5000004jofpanlfev	2026-07-20 22:47:00.12	2026-07-14 17:34:54.251	2026-07-20 22:47:00.133	t
cmrkxlnhn000704jo98qpcrr7	CONFIRMED	cmpct94t9000204jsxeeckk3m	cmrkxlng5000004jofpanlfev	2026-07-21 00:29:22.144	2026-07-14 17:34:54.251	2026-07-21 00:29:22.166	t
cmrkxlnhn000f04jo1mdvbp8b	DECLINED	cmpcsehq1000104ibueo8dlm5	cmrkxlng5000004jofpanlfev	2026-07-21 01:05:25.416	2026-07-14 17:34:54.251	2026-07-21 01:05:25.427	t
cmrkxlnhn000h04jobiv1ry4m	DECLINED	cmph7t8a1000004l9n8uic25p	cmrkxlng5000004jofpanlfev	2026-07-21 01:45:19.711	2026-07-14 17:34:54.251	2026-07-21 01:45:19.72	t
cmrkxlnhn000204jo4p62aga6	DECLINED	cmpcov8jd000004l8umh13pux	cmrkxlng5000004jofpanlfev	2026-07-21 12:30:18.227	2026-07-14 17:34:54.251	2026-07-21 12:30:18.244	t
cmrkxlnhn000804jocf8e54w6	CONFIRMED	cmpdz2mcq000104jr9xnhl4i0	cmrkxlng5000004jofpanlfev	2026-07-21 13:39:54.973	2026-07-14 17:34:54.251	2026-07-21 13:39:55.003	t
cmrozuqw9000404l5bhrtpnkn	CONFIRMED	cmrozuqv4000104l5tbza8qgy	cmrkxlng5000004jofpanlfev	2026-07-21 14:17:06.368	2026-07-17 13:49:02.505	2026-07-21 14:17:06.368	t
cmrkxlnhn000j04jofooterzb	CONFIRMED	cmpcopzu6000004jro3prr7ca	cmrkxlng5000004jofpanlfev	2026-07-21 16:51:40.252	2026-07-14 17:34:54.251	2026-07-21 16:51:40.274	t
cmrkxlnhn000i04joijbiixpe	DECLINED	cmpcpgupa000004l5ehnc0kjs	cmrkxlng5000004jofpanlfev	2026-07-21 17:17:52.457	2026-07-14 17:34:54.251	2026-07-21 17:17:52.465	t
cmrkxlnhn000l04jocr86ffo2	DECLINED	cmpdz3jpw000004jvdohsd2ri	cmrkxlng5000004jofpanlfev	2026-07-21 18:12:27.668	2026-07-14 17:34:54.251	2026-07-21 18:12:27.68	t
cmrkxlnhn000504jo58qgyvqr	CONFIRMED	cmpcsds4s000004jmgpwku1j2	cmrkxlng5000004jofpanlfev	2026-07-22 12:03:01.666	2026-07-14 17:34:54.251	2026-07-22 12:03:01.67	t
cmrkxlnhn000n04jo8qwx6q8c	CONFIRMED	cmpfk8v2v000704jlp8siky9e	cmrkxlng5000004jofpanlfev	2026-07-22 12:04:30.55	2026-07-14 17:34:54.251	2026-07-22 12:04:30.561	t
cmrkxlnhn000304jor38ixntv	DECLINED	cmpcoxez0000304l8g40zcfou	cmrkxlng5000004jofpanlfev	2026-07-22 12:54:31.683	2026-07-14 17:34:54.251	2026-07-22 12:54:31.695	t
cmrkxlnhn000d04jon8ia0366	DECLINED	cmpefep0o000504laynrqmhnw	cmrkxlng5000004jofpanlfev	2026-07-22 17:51:19.345	2026-07-14 17:34:54.251	2026-07-22 17:51:19.357	t
cmrkxlnhn000604jotqh0nis4	DECLINED	cmpct2xp7000004jsv1ujpe1r	cmrkxlng5000004jofpanlfev	2026-07-22 22:03:05.179	2026-07-14 17:34:54.251	2026-07-22 22:03:05.19	t
cmrkxlnhn000b04jormsh5x4g	CONFIRMED	cmpefdkyx000304la3k3nq9p9	cmrkxlng5000004jofpanlfev	2026-07-22 22:41:01.764	2026-07-14 17:34:54.251	2026-07-22 22:41:01.766	t
cmrp7l1bw000c04l4ynamxpbc	PENDING	cmpefdukz000404lanevrsp34	cmrp7l1ax000104l49nmc6qf9	\N	2026-07-17 17:25:26.395	2026-07-17 17:25:26.395	t
cmrp7l1bw000d04l4ono7rfwf	PENDING	cmpefep0o000504laynrqmhnw	cmrp7l1ax000104l49nmc6qf9	\N	2026-07-17 17:25:26.395	2026-07-17 17:25:26.395	t
cmrp7l1bw000e04l47srba9p8	PENDING	cmpefcqj2000104ladlx0ysjz	cmrp7l1ax000104l49nmc6qf9	\N	2026-07-17 17:25:26.395	2026-07-17 17:25:26.395	t
cmrp7l1bw000f04l44quf0i7w	PENDING	cmpcsehq1000104ibueo8dlm5	cmrp7l1ax000104l49nmc6qf9	\N	2026-07-17 17:25:26.395	2026-07-17 17:25:26.395	t
cmrp7l1bw000g04l488krlt0r	PENDING	cmph7t8a1000004l9n8uic25p	cmrp7l1ax000104l49nmc6qf9	\N	2026-07-17 17:25:26.395	2026-07-17 17:25:26.395	t
cmrp7l1bw000h04l4dndytwcx	PENDING	cmpcopzu6000004jro3prr7ca	cmrp7l1ax000104l49nmc6qf9	\N	2026-07-17 17:25:26.395	2026-07-17 17:25:26.395	t
cmrp7l1bw000i04l4umhjuus0	PENDING	cmpcpt3n6000004l561lm2ja7	cmrp7l1ax000104l49nmc6qf9	\N	2026-07-17 17:25:26.395	2026-07-17 17:25:26.395	t
cmrp7l1bw000j04l4sbeyr2nd	PENDING	cmpdz3jpw000004jvdohsd2ri	cmrp7l1ax000104l49nmc6qf9	\N	2026-07-17 17:25:26.395	2026-07-17 17:25:26.395	t
cmrp7l1bw000k04l4fisk2si4	PENDING	cmpn1o6et000004jrcnmw0gav	cmrp7l1ax000104l49nmc6qf9	\N	2026-07-17 17:25:26.395	2026-07-17 17:25:26.395	t
cmrp7l1bw000l04l4dhuobyp7	PENDING	cmpfk8v2v000704jlp8siky9e	cmrp7l1ax000104l49nmc6qf9	\N	2026-07-17 17:25:26.395	2026-07-17 17:25:26.395	t
cmrp7l1bw000m04l4pohdmdjg	PENDING	cmpct2xp7000004jsv1ujpe1r	cmrp7l1ax000104l49nmc6qf9	\N	2026-07-17 17:25:26.395	2026-07-17 17:25:26.395	t
cmrp7l1bw000n04l4utrf7zxr	PENDING	cmpcpgupa000004l5ehnc0kjs	cmrp7l1ax000104l49nmc6qf9	\N	2026-07-17 17:25:26.395	2026-07-17 17:25:26.395	t
cmrp7l1bw000o04l4fhm7zfh6	PENDING	cmrozuqv4000104l5tbza8qgy	cmrp7l1ax000104l49nmc6qf9	\N	2026-07-17 17:25:26.395	2026-07-17 17:25:26.395	t
cmrp8964w000104la76hga6tj	PENDING	cmpcm7sgp000004l1fp9o52ky	cmrp8963m000004larspejvgr	\N	2026-07-17 17:44:12.368	2026-07-17 17:44:12.368	t
cmrp8964w000204la5e223iaw	PENDING	cmpcov8jd000004l8umh13pux	cmrp8963m000004larspejvgr	\N	2026-07-17 17:44:12.368	2026-07-17 17:44:12.368	t
cmrp8964w000304lamoy4axsz	PENDING	cmpcoxez0000304l8g40zcfou	cmrp8963m000004larspejvgr	\N	2026-07-17 17:44:12.368	2026-07-17 17:44:12.368	t
cmrp8964w000404la1tpzt028	PENDING	cmpcqf47m000004l85vce0gfh	cmrp8963m000004larspejvgr	\N	2026-07-17 17:44:12.368	2026-07-17 17:44:12.368	t
cmrp8964w000504la8i0t4xjd	PENDING	cmpcsds4s000004jmgpwku1j2	cmrp8963m000004larspejvgr	\N	2026-07-17 17:44:12.368	2026-07-17 17:44:12.368	t
cmrp8964w000604laxa4z8i0g	PENDING	cmpct94t9000204jsxeeckk3m	cmrp8963m000004larspejvgr	\N	2026-07-17 17:44:12.368	2026-07-17 17:44:12.368	t
cmrp8964w000704lasn2ykppm	PENDING	cmpdz2mcq000104jr9xnhl4i0	cmrp8963m000004larspejvgr	\N	2026-07-17 17:44:12.368	2026-07-17 17:44:12.368	t
cmrp8964w000804lark17ux3i	PENDING	cmpcpimjz000004jpcdqgfhfx	cmrp8963m000004larspejvgr	\N	2026-07-17 17:44:12.368	2026-07-17 17:44:12.368	t
cmrp8964w000904lanfv0ta8g	PENDING	cmpefcd1z000004lasd2r1kdh	cmrp8963m000004larspejvgr	\N	2026-07-17 17:44:12.368	2026-07-17 17:44:12.368	t
cmrp8964w000a04la2nv8b6rf	PENDING	cmpefdkyx000304la3k3nq9p9	cmrp8963m000004larspejvgr	\N	2026-07-17 17:44:12.368	2026-07-17 17:44:12.368	t
cmrp8964w000b04lajb5ounae	PENDING	cmpefdukz000404lanevrsp34	cmrp8963m000004larspejvgr	\N	2026-07-17 17:44:12.368	2026-07-17 17:44:12.368	t
cmrp8964w000c04laldm9m286	PENDING	cmpefep0o000504laynrqmhnw	cmrp8963m000004larspejvgr	\N	2026-07-17 17:44:12.368	2026-07-17 17:44:12.368	t
cmrp8964w000d04lah316dmf4	PENDING	cmpefcqj2000104ladlx0ysjz	cmrp8963m000004larspejvgr	\N	2026-07-17 17:44:12.368	2026-07-17 17:44:12.368	t
cmrp8964w000e04lam98braqn	PENDING	cmpcsehq1000104ibueo8dlm5	cmrp8963m000004larspejvgr	\N	2026-07-17 17:44:12.368	2026-07-17 17:44:12.368	t
cmrp8964w000f04la6mmqaa4n	PENDING	cmph7t8a1000004l9n8uic25p	cmrp8963m000004larspejvgr	\N	2026-07-17 17:44:12.368	2026-07-17 17:44:12.368	t
cmrp8964w000g04la9dcmm6w5	PENDING	cmpcopzu6000004jro3prr7ca	cmrp8963m000004larspejvgr	\N	2026-07-17 17:44:12.368	2026-07-17 17:44:12.368	t
cmrp8964w000h04layeppajli	PENDING	cmpcpt3n6000004l561lm2ja7	cmrp8963m000004larspejvgr	\N	2026-07-17 17:44:12.368	2026-07-17 17:44:12.368	t
cmrp8964w000i04lawgknle3g	PENDING	cmpdz3jpw000004jvdohsd2ri	cmrp8963m000004larspejvgr	\N	2026-07-17 17:44:12.368	2026-07-17 17:44:12.368	t
cmrp8964w000j04laevnw3tpy	PENDING	cmpn1o6et000004jrcnmw0gav	cmrp8963m000004larspejvgr	\N	2026-07-17 17:44:12.368	2026-07-17 17:44:12.368	t
cmrp8964w000k04la31zs3tmi	PENDING	cmpfk8v2v000704jlp8siky9e	cmrp8963m000004larspejvgr	\N	2026-07-17 17:44:12.368	2026-07-17 17:44:12.368	t
cmrp8964w000l04lay2qpk4jw	PENDING	cmpct2xp7000004jsv1ujpe1r	cmrp8963m000004larspejvgr	\N	2026-07-17 17:44:12.368	2026-07-17 17:44:12.368	t
cmrp8964w000m04labtduowsd	PENDING	cmpcpgupa000004l5ehnc0kjs	cmrp8963m000004larspejvgr	\N	2026-07-17 17:44:12.368	2026-07-17 17:44:12.368	t
cmrp8964w000n04lah2vffj28	PENDING	cmrozuqv4000104l5tbza8qgy	cmrp8963m000004larspejvgr	\N	2026-07-17 17:44:12.368	2026-07-17 17:44:12.368	t
cmrp9ms7x000104ld0ncud6k6	PENDING	cmpcm7sgp000004l1fp9o52ky	cmrp9ms6u000004ldf8womoau	\N	2026-07-17 18:22:47.133	2026-07-17 18:22:47.133	t
cmrp9ms7x000204ldievx02st	PENDING	cmpcov8jd000004l8umh13pux	cmrp9ms6u000004ldf8womoau	\N	2026-07-17 18:22:47.133	2026-07-17 18:22:47.133	t
cmrp9ms7x000304ldw5nrve03	PENDING	cmpcoxez0000304l8g40zcfou	cmrp9ms6u000004ldf8womoau	\N	2026-07-17 18:22:47.133	2026-07-17 18:22:47.133	t
cmrp9ms7x000404lde3m83bul	PENDING	cmpcqf47m000004l85vce0gfh	cmrp9ms6u000004ldf8womoau	\N	2026-07-17 18:22:47.133	2026-07-17 18:22:47.133	t
cmrp9ms7x000504ldk1pgrpya	PENDING	cmpcsds4s000004jmgpwku1j2	cmrp9ms6u000004ldf8womoau	\N	2026-07-17 18:22:47.133	2026-07-17 18:22:47.133	t
cmrp9ms7x000604ldybnpxqbx	PENDING	cmpct94t9000204jsxeeckk3m	cmrp9ms6u000004ldf8womoau	\N	2026-07-17 18:22:47.133	2026-07-17 18:22:47.133	t
cmrp9ms7x000704ldfmc3qpvy	PENDING	cmpdz2mcq000104jr9xnhl4i0	cmrp9ms6u000004ldf8womoau	\N	2026-07-17 18:22:47.133	2026-07-17 18:22:47.133	t
cmrp9ms7x000804ld52ixx42i	PENDING	cmpcpimjz000004jpcdqgfhfx	cmrp9ms6u000004ldf8womoau	\N	2026-07-17 18:22:47.133	2026-07-17 18:22:47.133	t
cmrp9ms7x000904ldx5i5h22e	PENDING	cmpefcd1z000004lasd2r1kdh	cmrp9ms6u000004ldf8womoau	\N	2026-07-17 18:22:47.133	2026-07-17 18:22:47.133	t
cmrp9ms7x000a04ld0hbwojep	PENDING	cmpefdkyx000304la3k3nq9p9	cmrp9ms6u000004ldf8womoau	\N	2026-07-17 18:22:47.133	2026-07-17 18:22:47.133	t
cmrp9ms7x000b04ldoh1835jz	PENDING	cmpefdukz000404lanevrsp34	cmrp9ms6u000004ldf8womoau	\N	2026-07-17 18:22:47.133	2026-07-17 18:22:47.133	t
cmrp9ms7x000c04lddjl8b1fv	PENDING	cmpefep0o000504laynrqmhnw	cmrp9ms6u000004ldf8womoau	\N	2026-07-17 18:22:47.133	2026-07-17 18:22:47.133	t
cmrp9ms7x000d04ld3pqgq15e	PENDING	cmpefcqj2000104ladlx0ysjz	cmrp9ms6u000004ldf8womoau	\N	2026-07-17 18:22:47.133	2026-07-17 18:22:47.133	t
cmrp9ms7x000e04ldovmzs6wk	PENDING	cmpcsehq1000104ibueo8dlm5	cmrp9ms6u000004ldf8womoau	\N	2026-07-17 18:22:47.133	2026-07-17 18:22:47.133	t
cmrp9ms7x000f04ldfh3qqwev	PENDING	cmph7t8a1000004l9n8uic25p	cmrp9ms6u000004ldf8womoau	\N	2026-07-17 18:22:47.133	2026-07-17 18:22:47.133	t
cmrp9ms7x000g04ldyw7kanad	PENDING	cmpcopzu6000004jro3prr7ca	cmrp9ms6u000004ldf8womoau	\N	2026-07-17 18:22:47.133	2026-07-17 18:22:47.133	t
cmrp9ms7x000h04ldx5695q9u	PENDING	cmpcpt3n6000004l561lm2ja7	cmrp9ms6u000004ldf8womoau	\N	2026-07-17 18:22:47.133	2026-07-17 18:22:47.133	t
cmrp9ms7x000i04ldumgqiu3r	PENDING	cmpdz3jpw000004jvdohsd2ri	cmrp9ms6u000004ldf8womoau	\N	2026-07-17 18:22:47.133	2026-07-17 18:22:47.133	t
cmrp9ms7x000j04lddxgsmrgb	PENDING	cmpn1o6et000004jrcnmw0gav	cmrp9ms6u000004ldf8womoau	\N	2026-07-17 18:22:47.133	2026-07-17 18:22:47.133	t
cmrp9ms7x000k04ldolnibndy	PENDING	cmpfk8v2v000704jlp8siky9e	cmrp9ms6u000004ldf8womoau	\N	2026-07-17 18:22:47.133	2026-07-17 18:22:47.133	t
cmrp9ms7x000l04ldzw3w03r5	PENDING	cmpct2xp7000004jsv1ujpe1r	cmrp9ms6u000004ldf8womoau	\N	2026-07-17 18:22:47.133	2026-07-17 18:22:47.133	t
cmrp9ms7x000m04ldd0c7h0sh	PENDING	cmpcpgupa000004l5ehnc0kjs	cmrp9ms6u000004ldf8womoau	\N	2026-07-17 18:22:47.133	2026-07-17 18:22:47.133	t
cmrp9ms7x000n04ld89uquri9	PENDING	cmrozuqv4000104l5tbza8qgy	cmrp9ms6u000004ldf8womoau	\N	2026-07-17 18:22:47.133	2026-07-17 18:22:47.133	t
cmrp9yfjj000104jpjt55clos	PENDING	cmpcm7sgp000004l1fp9o52ky	cmrp9yfic000004jpt8bwp440	\N	2026-07-17 18:31:50.575	2026-07-17 18:31:50.575	t
cmrp9yfjj000204jpdxv8nooc	PENDING	cmpcov8jd000004l8umh13pux	cmrp9yfic000004jpt8bwp440	\N	2026-07-17 18:31:50.575	2026-07-17 18:31:50.575	t
cmrp9yfjj000304jpk46ksyaz	PENDING	cmpcoxez0000304l8g40zcfou	cmrp9yfic000004jpt8bwp440	\N	2026-07-17 18:31:50.575	2026-07-17 18:31:50.575	t
cmrp9yfjj000404jp5pm33rg8	PENDING	cmpcqf47m000004l85vce0gfh	cmrp9yfic000004jpt8bwp440	\N	2026-07-17 18:31:50.575	2026-07-17 18:31:50.575	t
cmrp9yfjj000504jpo3nwy43b	PENDING	cmpcsds4s000004jmgpwku1j2	cmrp9yfic000004jpt8bwp440	\N	2026-07-17 18:31:50.575	2026-07-17 18:31:50.575	t
cmrp9yfjj000604jprguvp0dn	PENDING	cmpct94t9000204jsxeeckk3m	cmrp9yfic000004jpt8bwp440	\N	2026-07-17 18:31:50.575	2026-07-17 18:31:50.575	t
cmrp9yfjj000704jpqzvf24f0	PENDING	cmpdz2mcq000104jr9xnhl4i0	cmrp9yfic000004jpt8bwp440	\N	2026-07-17 18:31:50.575	2026-07-17 18:31:50.575	t
cmrp9yfjj000804jp93rs07i1	PENDING	cmpcpimjz000004jpcdqgfhfx	cmrp9yfic000004jpt8bwp440	\N	2026-07-17 18:31:50.575	2026-07-17 18:31:50.575	t
cmrp9yfjj000904jp64chf1no	PENDING	cmpefcd1z000004lasd2r1kdh	cmrp9yfic000004jpt8bwp440	\N	2026-07-17 18:31:50.575	2026-07-17 18:31:50.575	t
cmrp9yfjj000a04jpxlmgd25v	PENDING	cmpefdkyx000304la3k3nq9p9	cmrp9yfic000004jpt8bwp440	\N	2026-07-17 18:31:50.575	2026-07-17 18:31:50.575	t
cmrp9yfjj000b04jp557evcxu	PENDING	cmpefdukz000404lanevrsp34	cmrp9yfic000004jpt8bwp440	\N	2026-07-17 18:31:50.575	2026-07-17 18:31:50.575	t
cmrp9yfjj000c04jpsk1mfmzz	PENDING	cmpefep0o000504laynrqmhnw	cmrp9yfic000004jpt8bwp440	\N	2026-07-17 18:31:50.575	2026-07-17 18:31:50.575	t
cmrp9yfjj000d04jpusf8yucd	PENDING	cmpefcqj2000104ladlx0ysjz	cmrp9yfic000004jpt8bwp440	\N	2026-07-17 18:31:50.575	2026-07-17 18:31:50.575	t
cmrp9yfjj000e04jp0fla1t80	PENDING	cmpcsehq1000104ibueo8dlm5	cmrp9yfic000004jpt8bwp440	\N	2026-07-17 18:31:50.575	2026-07-17 18:31:50.575	t
cmrp9yfjj000f04jpuyt8ku89	PENDING	cmph7t8a1000004l9n8uic25p	cmrp9yfic000004jpt8bwp440	\N	2026-07-17 18:31:50.575	2026-07-17 18:31:50.575	t
cmrp9yfjj000g04jp2yngqatb	PENDING	cmpcopzu6000004jro3prr7ca	cmrp9yfic000004jpt8bwp440	\N	2026-07-17 18:31:50.575	2026-07-17 18:31:50.575	t
cmrp9yfjj000h04jpabyz8bg8	PENDING	cmpcpt3n6000004l561lm2ja7	cmrp9yfic000004jpt8bwp440	\N	2026-07-17 18:31:50.575	2026-07-17 18:31:50.575	t
cmrp9yfjj000i04jpeckjx69b	PENDING	cmpdz3jpw000004jvdohsd2ri	cmrp9yfic000004jpt8bwp440	\N	2026-07-17 18:31:50.575	2026-07-17 18:31:50.575	t
cmrp9yfjj000j04jpeuuwas5k	PENDING	cmpn1o6et000004jrcnmw0gav	cmrp9yfic000004jpt8bwp440	\N	2026-07-17 18:31:50.575	2026-07-17 18:31:50.575	t
cmrp9yfjj000k04jpljsb47w8	PENDING	cmpfk8v2v000704jlp8siky9e	cmrp9yfic000004jpt8bwp440	\N	2026-07-17 18:31:50.575	2026-07-17 18:31:50.575	t
cmrp9yfjj000l04jpn8tkn7ye	PENDING	cmpct2xp7000004jsv1ujpe1r	cmrp9yfic000004jpt8bwp440	\N	2026-07-17 18:31:50.575	2026-07-17 18:31:50.575	t
cmrp9yfjj000m04jp3w18s6d8	PENDING	cmpcpgupa000004l5ehnc0kjs	cmrp9yfic000004jpt8bwp440	\N	2026-07-17 18:31:50.575	2026-07-17 18:31:50.575	t
cmrp9yfjj000n04jplqopekxx	PENDING	cmrozuqv4000104l5tbza8qgy	cmrp9yfic000004jpt8bwp440	\N	2026-07-17 18:31:50.575	2026-07-17 18:31:50.575	t
cmrpa59mg000q04jpdb9nheib	PENDING	cmpcm7sgp000004l1fp9o52ky	cmrpa59lt000p04jpzp8qdy4l	\N	2026-07-17 18:37:09.496	2026-07-17 18:37:09.496	t
cmrpa59mg000r04jpvvyhpvmq	PENDING	cmpcov8jd000004l8umh13pux	cmrpa59lt000p04jpzp8qdy4l	\N	2026-07-17 18:37:09.496	2026-07-17 18:37:09.496	t
cmrpa59mg000s04jpj8w286pv	PENDING	cmpcoxez0000304l8g40zcfou	cmrpa59lt000p04jpzp8qdy4l	\N	2026-07-17 18:37:09.496	2026-07-17 18:37:09.496	t
cmrpa59mg000t04jp10m8dl69	PENDING	cmpcqf47m000004l85vce0gfh	cmrpa59lt000p04jpzp8qdy4l	\N	2026-07-17 18:37:09.496	2026-07-17 18:37:09.496	t
cmrpa59mg000u04jphbxuwkxp	PENDING	cmpcsds4s000004jmgpwku1j2	cmrpa59lt000p04jpzp8qdy4l	\N	2026-07-17 18:37:09.496	2026-07-17 18:37:09.496	t
cmrpa59mg000v04jp7uorj55u	PENDING	cmpct94t9000204jsxeeckk3m	cmrpa59lt000p04jpzp8qdy4l	\N	2026-07-17 18:37:09.496	2026-07-17 18:37:09.496	t
cmrpa59mg000w04jp8euq8rpd	PENDING	cmpdz2mcq000104jr9xnhl4i0	cmrpa59lt000p04jpzp8qdy4l	\N	2026-07-17 18:37:09.496	2026-07-17 18:37:09.496	t
cmrpa59mg000x04jph9c5yi9n	PENDING	cmpcpimjz000004jpcdqgfhfx	cmrpa59lt000p04jpzp8qdy4l	\N	2026-07-17 18:37:09.496	2026-07-17 18:37:09.496	t
cmrpa59mg000y04jpt3j4enqh	PENDING	cmpefcd1z000004lasd2r1kdh	cmrpa59lt000p04jpzp8qdy4l	\N	2026-07-17 18:37:09.496	2026-07-17 18:37:09.496	t
cmrpa59mg000z04jpf8nx289h	PENDING	cmpefdkyx000304la3k3nq9p9	cmrpa59lt000p04jpzp8qdy4l	\N	2026-07-17 18:37:09.496	2026-07-17 18:37:09.496	t
cmrpa59mg001004jp7dtqb2cp	PENDING	cmpefdukz000404lanevrsp34	cmrpa59lt000p04jpzp8qdy4l	\N	2026-07-17 18:37:09.496	2026-07-17 18:37:09.496	t
cmrpa59mg001104jpnr1oqazc	PENDING	cmpefep0o000504laynrqmhnw	cmrpa59lt000p04jpzp8qdy4l	\N	2026-07-17 18:37:09.496	2026-07-17 18:37:09.496	t
cmrpa59mg001204jpzqjq6vby	PENDING	cmpefcqj2000104ladlx0ysjz	cmrpa59lt000p04jpzp8qdy4l	\N	2026-07-17 18:37:09.496	2026-07-17 18:37:09.496	t
cmrpa59mg001304jpmkh8luri	PENDING	cmpcsehq1000104ibueo8dlm5	cmrpa59lt000p04jpzp8qdy4l	\N	2026-07-17 18:37:09.496	2026-07-17 18:37:09.496	t
cmrpa59mg001404jp5jz4xk2h	PENDING	cmph7t8a1000004l9n8uic25p	cmrpa59lt000p04jpzp8qdy4l	\N	2026-07-17 18:37:09.496	2026-07-17 18:37:09.496	t
cmrpa59mg001504jpu2wasazy	PENDING	cmpcopzu6000004jro3prr7ca	cmrpa59lt000p04jpzp8qdy4l	\N	2026-07-17 18:37:09.496	2026-07-17 18:37:09.496	t
cmrpa59mg001604jp9dygx7vg	PENDING	cmpcpt3n6000004l561lm2ja7	cmrpa59lt000p04jpzp8qdy4l	\N	2026-07-17 18:37:09.496	2026-07-17 18:37:09.496	t
cmrpa59mg001704jp83fwhrkx	PENDING	cmpdz3jpw000004jvdohsd2ri	cmrpa59lt000p04jpzp8qdy4l	\N	2026-07-17 18:37:09.496	2026-07-17 18:37:09.496	t
cmrpa59mg001804jpvhq16hpt	PENDING	cmpn1o6et000004jrcnmw0gav	cmrpa59lt000p04jpzp8qdy4l	\N	2026-07-17 18:37:09.496	2026-07-17 18:37:09.496	t
cmrpa59mh001904jpgsh6zf4m	PENDING	cmpfk8v2v000704jlp8siky9e	cmrpa59lt000p04jpzp8qdy4l	\N	2026-07-17 18:37:09.496	2026-07-17 18:37:09.496	t
cmrpa59mh001a04jp7sn001hk	PENDING	cmpct2xp7000004jsv1ujpe1r	cmrpa59lt000p04jpzp8qdy4l	\N	2026-07-17 18:37:09.496	2026-07-17 18:37:09.496	t
cmrpa59mh001b04jpxoy3siaa	PENDING	cmpcpgupa000004l5ehnc0kjs	cmrpa59lt000p04jpzp8qdy4l	\N	2026-07-17 18:37:09.496	2026-07-17 18:37:09.496	t
cmrpa59mh001c04jpr1i7p4qx	PENDING	cmrozuqv4000104l5tbza8qgy	cmrpa59lt000p04jpzp8qdy4l	\N	2026-07-17 18:37:09.496	2026-07-17 18:37:09.496	t
cmrpaz5wh001c04igx5ymsnxi	PENDING	cmpcm7sgp000004l1fp9o52ky	cmrpaz5ve001b04igete2fxqx	\N	2026-07-17 19:00:24.353	2026-07-17 19:00:24.353	t
cmrpaz5wh001d04igodrkyrx9	PENDING	cmpcov8jd000004l8umh13pux	cmrpaz5ve001b04igete2fxqx	\N	2026-07-17 19:00:24.353	2026-07-17 19:00:24.353	t
cmrpaz5wh001e04igib871act	PENDING	cmpcoxez0000304l8g40zcfou	cmrpaz5ve001b04igete2fxqx	\N	2026-07-17 19:00:24.353	2026-07-17 19:00:24.353	t
cmrpaz5wh001f04igfc60vagj	PENDING	cmpcqf47m000004l85vce0gfh	cmrpaz5ve001b04igete2fxqx	\N	2026-07-17 19:00:24.353	2026-07-17 19:00:24.353	t
cmrpaz5wh001g04ig1eeihy2v	PENDING	cmpcsds4s000004jmgpwku1j2	cmrpaz5ve001b04igete2fxqx	\N	2026-07-17 19:00:24.353	2026-07-17 19:00:24.353	t
cmrpaz5wh001h04igc9a5a0rb	PENDING	cmpct94t9000204jsxeeckk3m	cmrpaz5ve001b04igete2fxqx	\N	2026-07-17 19:00:24.353	2026-07-17 19:00:24.353	t
cmrpaz5wh001i04ig3anmvrpo	PENDING	cmpdz2mcq000104jr9xnhl4i0	cmrpaz5ve001b04igete2fxqx	\N	2026-07-17 19:00:24.353	2026-07-17 19:00:24.353	t
cmrpaz5wh001j04igae3k3mcl	PENDING	cmpcpimjz000004jpcdqgfhfx	cmrpaz5ve001b04igete2fxqx	\N	2026-07-17 19:00:24.353	2026-07-17 19:00:24.353	t
cmrpaz5wh001k04ig19r6qav8	PENDING	cmpefcd1z000004lasd2r1kdh	cmrpaz5ve001b04igete2fxqx	\N	2026-07-17 19:00:24.353	2026-07-17 19:00:24.353	t
cmrpaz5wh001l04ig51m1744p	PENDING	cmpefdkyx000304la3k3nq9p9	cmrpaz5ve001b04igete2fxqx	\N	2026-07-17 19:00:24.353	2026-07-17 19:00:24.353	t
cmrpaz5wh001m04ig1ee6azx8	PENDING	cmpefdukz000404lanevrsp34	cmrpaz5ve001b04igete2fxqx	\N	2026-07-17 19:00:24.353	2026-07-17 19:00:24.353	t
cmrpaz5wh001n04ignngh5pwl	PENDING	cmpefep0o000504laynrqmhnw	cmrpaz5ve001b04igete2fxqx	\N	2026-07-17 19:00:24.353	2026-07-17 19:00:24.353	t
cmrpaz5wh001o04igg1rsup7f	PENDING	cmpefcqj2000104ladlx0ysjz	cmrpaz5ve001b04igete2fxqx	\N	2026-07-17 19:00:24.353	2026-07-17 19:00:24.353	t
cmrpaz5wh001p04ig37xe6oni	PENDING	cmpcsehq1000104ibueo8dlm5	cmrpaz5ve001b04igete2fxqx	\N	2026-07-17 19:00:24.353	2026-07-17 19:00:24.353	t
cmrpaz5wh001q04igva8950tq	PENDING	cmph7t8a1000004l9n8uic25p	cmrpaz5ve001b04igete2fxqx	\N	2026-07-17 19:00:24.353	2026-07-17 19:00:24.353	t
cmrpaz5wh001r04ig6x7c6irp	PENDING	cmpcopzu6000004jro3prr7ca	cmrpaz5ve001b04igete2fxqx	\N	2026-07-17 19:00:24.353	2026-07-17 19:00:24.353	t
cmrpaz5wh001s04igr5ofmihy	PENDING	cmpcpt3n6000004l561lm2ja7	cmrpaz5ve001b04igete2fxqx	\N	2026-07-17 19:00:24.353	2026-07-17 19:00:24.353	t
cmrpaz5wh001t04igfz4t1zra	PENDING	cmpdz3jpw000004jvdohsd2ri	cmrpaz5ve001b04igete2fxqx	\N	2026-07-17 19:00:24.353	2026-07-17 19:00:24.353	t
cmrpaz5wh001u04igziv04cm9	PENDING	cmpn1o6et000004jrcnmw0gav	cmrpaz5ve001b04igete2fxqx	\N	2026-07-17 19:00:24.353	2026-07-17 19:00:24.353	t
cmrpaz5wh001v04ignxqp1j40	PENDING	cmpfk8v2v000704jlp8siky9e	cmrpaz5ve001b04igete2fxqx	\N	2026-07-17 19:00:24.353	2026-07-17 19:00:24.353	t
cmrpaz5wh001w04ig79cryxex	PENDING	cmpct2xp7000004jsv1ujpe1r	cmrpaz5ve001b04igete2fxqx	\N	2026-07-17 19:00:24.353	2026-07-17 19:00:24.353	t
cmrpaz5wi001x04iglrwr20tz	PENDING	cmpcpgupa000004l5ehnc0kjs	cmrpaz5ve001b04igete2fxqx	\N	2026-07-17 19:00:24.353	2026-07-17 19:00:24.353	t
cmrpaz5wi001y04igz78smv4z	PENDING	cmrozuqv4000104l5tbza8qgy	cmrpaz5ve001b04igete2fxqx	\N	2026-07-17 19:00:24.353	2026-07-17 19:00:24.353	t
cmrpblr43001s04ld7322wop9	PENDING	cmpcm7sgp000004l1fp9o52ky	cmrpblr3f001r04ldzbbc1u6h	\N	2026-07-17 19:17:58.275	2026-07-17 19:17:58.275	t
cmrpblr43001t04ldvehoda5w	PENDING	cmpcov8jd000004l8umh13pux	cmrpblr3f001r04ldzbbc1u6h	\N	2026-07-17 19:17:58.275	2026-07-17 19:17:58.275	t
cmrpblr43001u04ldrqfyml7y	PENDING	cmpcoxez0000304l8g40zcfou	cmrpblr3f001r04ldzbbc1u6h	\N	2026-07-17 19:17:58.275	2026-07-17 19:17:58.275	t
cmrpblr43001v04ldqyudiro0	PENDING	cmpcqf47m000004l85vce0gfh	cmrpblr3f001r04ldzbbc1u6h	\N	2026-07-17 19:17:58.275	2026-07-17 19:17:58.275	t
cmrpblr43001w04ld9v600sy9	PENDING	cmpcsds4s000004jmgpwku1j2	cmrpblr3f001r04ldzbbc1u6h	\N	2026-07-17 19:17:58.275	2026-07-17 19:17:58.275	t
cmrpblr43001x04ldwx38tqcf	PENDING	cmpct94t9000204jsxeeckk3m	cmrpblr3f001r04ldzbbc1u6h	\N	2026-07-17 19:17:58.275	2026-07-17 19:17:58.275	t
cmrpblr43001y04ldbbw9fpde	PENDING	cmpdz2mcq000104jr9xnhl4i0	cmrpblr3f001r04ldzbbc1u6h	\N	2026-07-17 19:17:58.275	2026-07-17 19:17:58.275	t
cmrpblr43001z04ldm9ihrh5h	PENDING	cmpcpimjz000004jpcdqgfhfx	cmrpblr3f001r04ldzbbc1u6h	\N	2026-07-17 19:17:58.275	2026-07-17 19:17:58.275	t
cmrpblr43002004ld7btrwvth	PENDING	cmpefcd1z000004lasd2r1kdh	cmrpblr3f001r04ldzbbc1u6h	\N	2026-07-17 19:17:58.275	2026-07-17 19:17:58.275	t
cmrpblr43002104ld8ihpmt4p	PENDING	cmpefdkyx000304la3k3nq9p9	cmrpblr3f001r04ldzbbc1u6h	\N	2026-07-17 19:17:58.275	2026-07-17 19:17:58.275	t
cmrpblr43002204ld54k55ssc	PENDING	cmpefdukz000404lanevrsp34	cmrpblr3f001r04ldzbbc1u6h	\N	2026-07-17 19:17:58.275	2026-07-17 19:17:58.275	t
cmrpblr43002304ldsrcl6psw	PENDING	cmpefep0o000504laynrqmhnw	cmrpblr3f001r04ldzbbc1u6h	\N	2026-07-17 19:17:58.275	2026-07-17 19:17:58.275	t
cmrpblr43002404ld4d08uztz	PENDING	cmpefcqj2000104ladlx0ysjz	cmrpblr3f001r04ldzbbc1u6h	\N	2026-07-17 19:17:58.275	2026-07-17 19:17:58.275	t
cmrpblr43002504ldau1lx4z2	PENDING	cmpcsehq1000104ibueo8dlm5	cmrpblr3f001r04ldzbbc1u6h	\N	2026-07-17 19:17:58.275	2026-07-17 19:17:58.275	t
cmrpblr43002604ldixb5nvp2	PENDING	cmph7t8a1000004l9n8uic25p	cmrpblr3f001r04ldzbbc1u6h	\N	2026-07-17 19:17:58.275	2026-07-17 19:17:58.275	t
cmrpblr43002704ldyzp0lq6r	PENDING	cmpcopzu6000004jro3prr7ca	cmrpblr3f001r04ldzbbc1u6h	\N	2026-07-17 19:17:58.275	2026-07-17 19:17:58.275	t
cmrpblr43002804ldq92rnxr9	PENDING	cmpcpt3n6000004l561lm2ja7	cmrpblr3f001r04ldzbbc1u6h	\N	2026-07-17 19:17:58.275	2026-07-17 19:17:58.275	t
cmrpblr43002904ld2k9p5mep	PENDING	cmpdz3jpw000004jvdohsd2ri	cmrpblr3f001r04ldzbbc1u6h	\N	2026-07-17 19:17:58.275	2026-07-17 19:17:58.275	t
cmrpblr43002a04ldq5g90rqu	PENDING	cmpn1o6et000004jrcnmw0gav	cmrpblr3f001r04ldzbbc1u6h	\N	2026-07-17 19:17:58.275	2026-07-17 19:17:58.275	t
cmrpblr43002b04ldhvjl4gbg	PENDING	cmpfk8v2v000704jlp8siky9e	cmrpblr3f001r04ldzbbc1u6h	\N	2026-07-17 19:17:58.275	2026-07-17 19:17:58.275	t
cmrpblr43002c04ldkwad51lm	PENDING	cmpct2xp7000004jsv1ujpe1r	cmrpblr3f001r04ldzbbc1u6h	\N	2026-07-17 19:17:58.275	2026-07-17 19:17:58.275	t
cmrpblr43002d04ldk955lrxi	PENDING	cmpcpgupa000004l5ehnc0kjs	cmrpblr3f001r04ldzbbc1u6h	\N	2026-07-17 19:17:58.275	2026-07-17 19:17:58.275	t
cmrpblr43002e04ldr4lqb3xd	PENDING	cmrozuqv4000104l5tbza8qgy	cmrpblr3f001r04ldzbbc1u6h	\N	2026-07-17 19:17:58.275	2026-07-17 19:17:58.275	t
cmrpbromz002g04ld0kffycf1	PENDING	cmpcm7sgp000004l1fp9o52ky	cmrpbrolu002f04ld1jou7dvp	\N	2026-07-17 19:22:35.003	2026-07-17 19:22:35.003	t
cmrpbromz002h04ld5o4plnv2	PENDING	cmpcov8jd000004l8umh13pux	cmrpbrolu002f04ld1jou7dvp	\N	2026-07-17 19:22:35.003	2026-07-17 19:22:35.003	t
cmrpbromz002i04ld0fbvybcs	PENDING	cmpcoxez0000304l8g40zcfou	cmrpbrolu002f04ld1jou7dvp	\N	2026-07-17 19:22:35.003	2026-07-17 19:22:35.003	t
cmrpbromz002j04ldzq6ph3rk	PENDING	cmpcqf47m000004l85vce0gfh	cmrpbrolu002f04ld1jou7dvp	\N	2026-07-17 19:22:35.003	2026-07-17 19:22:35.003	t
cmrpbromz002k04ldyhe1s2fp	PENDING	cmpcsds4s000004jmgpwku1j2	cmrpbrolu002f04ld1jou7dvp	\N	2026-07-17 19:22:35.003	2026-07-17 19:22:35.003	t
cmrpbromz002l04ldadbq4kd4	PENDING	cmpct94t9000204jsxeeckk3m	cmrpbrolu002f04ld1jou7dvp	\N	2026-07-17 19:22:35.003	2026-07-17 19:22:35.003	t
cmrpbromz002m04ldm0if8bg1	PENDING	cmpdz2mcq000104jr9xnhl4i0	cmrpbrolu002f04ld1jou7dvp	\N	2026-07-17 19:22:35.003	2026-07-17 19:22:35.003	t
cmrpbromz002n04ldaijbyd8j	PENDING	cmpcpimjz000004jpcdqgfhfx	cmrpbrolu002f04ld1jou7dvp	\N	2026-07-17 19:22:35.003	2026-07-17 19:22:35.003	t
cmrpbromz002o04ld2vuc3vst	PENDING	cmpefcd1z000004lasd2r1kdh	cmrpbrolu002f04ld1jou7dvp	\N	2026-07-17 19:22:35.003	2026-07-17 19:22:35.003	t
cmrpbromz002p04ldk98mearj	PENDING	cmpefdkyx000304la3k3nq9p9	cmrpbrolu002f04ld1jou7dvp	\N	2026-07-17 19:22:35.003	2026-07-17 19:22:35.003	t
cmrpbromz002q04ldr6ufu0fw	PENDING	cmpefdukz000404lanevrsp34	cmrpbrolu002f04ld1jou7dvp	\N	2026-07-17 19:22:35.003	2026-07-17 19:22:35.003	t
cmrpbromz002r04ldjrkm6zg2	PENDING	cmpefep0o000504laynrqmhnw	cmrpbrolu002f04ld1jou7dvp	\N	2026-07-17 19:22:35.003	2026-07-17 19:22:35.003	t
cmrpbromz002s04lde0vlx9sd	PENDING	cmpefcqj2000104ladlx0ysjz	cmrpbrolu002f04ld1jou7dvp	\N	2026-07-17 19:22:35.003	2026-07-17 19:22:35.003	t
cmrpbromz002t04ldup2sqqw0	PENDING	cmpcsehq1000104ibueo8dlm5	cmrpbrolu002f04ld1jou7dvp	\N	2026-07-17 19:22:35.003	2026-07-17 19:22:35.003	t
cmrpbromz002u04ldvbqj9fho	PENDING	cmph7t8a1000004l9n8uic25p	cmrpbrolu002f04ld1jou7dvp	\N	2026-07-17 19:22:35.003	2026-07-17 19:22:35.003	t
cmrpbromz002v04ld6qkfx8cb	PENDING	cmpcopzu6000004jro3prr7ca	cmrpbrolu002f04ld1jou7dvp	\N	2026-07-17 19:22:35.003	2026-07-17 19:22:35.003	t
cmrpbromz002w04ld9trtbbtj	PENDING	cmpcpt3n6000004l561lm2ja7	cmrpbrolu002f04ld1jou7dvp	\N	2026-07-17 19:22:35.003	2026-07-17 19:22:35.003	t
cmrpbromz002x04ldpcjp16al	PENDING	cmpdz3jpw000004jvdohsd2ri	cmrpbrolu002f04ld1jou7dvp	\N	2026-07-17 19:22:35.003	2026-07-17 19:22:35.003	t
cmrpbromz002y04ldszm8pt0w	PENDING	cmpn1o6et000004jrcnmw0gav	cmrpbrolu002f04ld1jou7dvp	\N	2026-07-17 19:22:35.003	2026-07-17 19:22:35.003	t
cmrpbromz002z04ld04gcnf1s	PENDING	cmpfk8v2v000704jlp8siky9e	cmrpbrolu002f04ld1jou7dvp	\N	2026-07-17 19:22:35.003	2026-07-17 19:22:35.003	t
cmrpbromz003004ld6hum4ras	PENDING	cmpct2xp7000004jsv1ujpe1r	cmrpbrolu002f04ld1jou7dvp	\N	2026-07-17 19:22:35.003	2026-07-17 19:22:35.003	t
cmrpbromz003104ldygrjswl4	PENDING	cmpcpgupa000004l5ehnc0kjs	cmrpbrolu002f04ld1jou7dvp	\N	2026-07-17 19:22:35.003	2026-07-17 19:22:35.003	t
cmrpbromz003204ldas4ocqbz	PENDING	cmrozuqv4000104l5tbza8qgy	cmrpbrolu002f04ld1jou7dvp	\N	2026-07-17 19:22:35.003	2026-07-17 19:22:35.003	t
cmrpcbyo9003504ldq38slava	PENDING	cmpcm7sgp000004l1fp9o52ky	cmrpcbynn003404ldris66yj1	\N	2026-07-17 19:38:21.129	2026-07-17 19:38:21.129	t
cmrpcbyo9003604ldvvrd84y4	PENDING	cmpcov8jd000004l8umh13pux	cmrpcbynn003404ldris66yj1	\N	2026-07-17 19:38:21.129	2026-07-17 19:38:21.129	t
cmrpcbyo9003704ld7kfqe35o	PENDING	cmpcoxez0000304l8g40zcfou	cmrpcbynn003404ldris66yj1	\N	2026-07-17 19:38:21.129	2026-07-17 19:38:21.129	t
cmrpcbyo9003804ld5hvyfos5	PENDING	cmpcqf47m000004l85vce0gfh	cmrpcbynn003404ldris66yj1	\N	2026-07-17 19:38:21.129	2026-07-17 19:38:21.129	t
cmrpcbyo9003904ldddaib582	PENDING	cmpcsds4s000004jmgpwku1j2	cmrpcbynn003404ldris66yj1	\N	2026-07-17 19:38:21.129	2026-07-17 19:38:21.129	t
cmrpcbyo9003a04ld9tkqhvw7	PENDING	cmpct94t9000204jsxeeckk3m	cmrpcbynn003404ldris66yj1	\N	2026-07-17 19:38:21.129	2026-07-17 19:38:21.129	t
cmrpcbyo9003b04ldmgpoujub	PENDING	cmpdz2mcq000104jr9xnhl4i0	cmrpcbynn003404ldris66yj1	\N	2026-07-17 19:38:21.129	2026-07-17 19:38:21.129	t
cmrpcbyo9003c04ldupq86xye	PENDING	cmpcpimjz000004jpcdqgfhfx	cmrpcbynn003404ldris66yj1	\N	2026-07-17 19:38:21.129	2026-07-17 19:38:21.129	t
cmrpcbyo9003d04lddt62zimp	PENDING	cmpefcd1z000004lasd2r1kdh	cmrpcbynn003404ldris66yj1	\N	2026-07-17 19:38:21.129	2026-07-17 19:38:21.129	t
cmrpcbyo9003e04ld8hkjmulk	PENDING	cmpefdkyx000304la3k3nq9p9	cmrpcbynn003404ldris66yj1	\N	2026-07-17 19:38:21.129	2026-07-17 19:38:21.129	t
cmrpcbyo9003f04ldga6at8rq	PENDING	cmpefdukz000404lanevrsp34	cmrpcbynn003404ldris66yj1	\N	2026-07-17 19:38:21.129	2026-07-17 19:38:21.129	t
cmrpcbyo9003g04ldu2tofd29	PENDING	cmpefep0o000504laynrqmhnw	cmrpcbynn003404ldris66yj1	\N	2026-07-17 19:38:21.129	2026-07-17 19:38:21.129	t
cmrpcbyo9003h04ld07lozr6v	PENDING	cmpefcqj2000104ladlx0ysjz	cmrpcbynn003404ldris66yj1	\N	2026-07-17 19:38:21.129	2026-07-17 19:38:21.129	t
cmrpcbyo9003i04ld2zyigwgb	PENDING	cmpcsehq1000104ibueo8dlm5	cmrpcbynn003404ldris66yj1	\N	2026-07-17 19:38:21.129	2026-07-17 19:38:21.129	t
cmrpcbyo9003j04ldjsjykidp	PENDING	cmph7t8a1000004l9n8uic25p	cmrpcbynn003404ldris66yj1	\N	2026-07-17 19:38:21.129	2026-07-17 19:38:21.129	t
cmrpcbyo9003k04ld7vjrqbp5	PENDING	cmpcopzu6000004jro3prr7ca	cmrpcbynn003404ldris66yj1	\N	2026-07-17 19:38:21.129	2026-07-17 19:38:21.129	t
cmrpcbyo9003l04ldop2tvj4f	PENDING	cmpcpt3n6000004l561lm2ja7	cmrpcbynn003404ldris66yj1	\N	2026-07-17 19:38:21.129	2026-07-17 19:38:21.129	t
cmrpcbyo9003m04ld9p89xtts	PENDING	cmpdz3jpw000004jvdohsd2ri	cmrpcbynn003404ldris66yj1	\N	2026-07-17 19:38:21.129	2026-07-17 19:38:21.129	t
cmrpcbyoa003n04lddcdmps6q	PENDING	cmpn1o6et000004jrcnmw0gav	cmrpcbynn003404ldris66yj1	\N	2026-07-17 19:38:21.129	2026-07-17 19:38:21.129	t
cmrpcbyoa003o04ldjelmc53y	PENDING	cmpfk8v2v000704jlp8siky9e	cmrpcbynn003404ldris66yj1	\N	2026-07-17 19:38:21.129	2026-07-17 19:38:21.129	t
cmrpcbyoa003p04ldpptbqmac	PENDING	cmpct2xp7000004jsv1ujpe1r	cmrpcbynn003404ldris66yj1	\N	2026-07-17 19:38:21.129	2026-07-17 19:38:21.129	t
cmrpcbyoa003q04ld5d7gp9vj	PENDING	cmpcpgupa000004l5ehnc0kjs	cmrpcbynn003404ldris66yj1	\N	2026-07-17 19:38:21.129	2026-07-17 19:38:21.129	t
cmrpcbyoa003r04ld4pap2d6o	PENDING	cmrozuqv4000104l5tbza8qgy	cmrpcbynn003404ldris66yj1	\N	2026-07-17 19:38:21.129	2026-07-17 19:38:21.129	t
cmrpg2uz8000104l4ydft5mps	PENDING	cmpcm7sgp000004l1fp9o52ky	cmrpg2uyd000004l44co9je0h	\N	2026-07-17 21:23:14.9	2026-07-17 21:23:14.9	f
cmrpg2uz8000204l4lon71gho	PENDING	cmpcov8jd000004l8umh13pux	cmrpg2uyd000004l44co9je0h	\N	2026-07-17 21:23:14.9	2026-07-17 21:23:14.9	f
cmrpg2uz8000304l4zymzu2k4	PENDING	cmpcoxez0000304l8g40zcfou	cmrpg2uyd000004l44co9je0h	\N	2026-07-17 21:23:14.9	2026-07-17 21:23:14.9	f
cmrpg2uz8000404l4pjlc502r	PENDING	cmpcqf47m000004l85vce0gfh	cmrpg2uyd000004l44co9je0h	\N	2026-07-17 21:23:14.9	2026-07-17 21:23:14.9	f
cmrpg2uz8000504l4i8w7prq3	PENDING	cmpcsds4s000004jmgpwku1j2	cmrpg2uyd000004l44co9je0h	\N	2026-07-17 21:23:14.9	2026-07-17 21:23:14.9	f
cmrpg2uz8000604l4wpsfq8yg	PENDING	cmpct94t9000204jsxeeckk3m	cmrpg2uyd000004l44co9je0h	\N	2026-07-17 21:23:14.9	2026-07-17 21:23:14.9	f
cmrpg2uz8000704l4b0tod98r	PENDING	cmpdz2mcq000104jr9xnhl4i0	cmrpg2uyd000004l44co9je0h	\N	2026-07-17 21:23:14.9	2026-07-17 21:23:14.9	f
cmrpg2uz8000804l4qe6be312	PENDING	cmpcpimjz000004jpcdqgfhfx	cmrpg2uyd000004l44co9je0h	\N	2026-07-17 21:23:14.9	2026-07-17 21:23:14.9	f
cmrpg2uz8000904l4qx8ygjwz	PENDING	cmpefcd1z000004lasd2r1kdh	cmrpg2uyd000004l44co9je0h	\N	2026-07-17 21:23:14.9	2026-07-17 21:23:14.9	f
cmrpg2uz8000a04l45kxan2a5	PENDING	cmpefdkyx000304la3k3nq9p9	cmrpg2uyd000004l44co9je0h	\N	2026-07-17 21:23:14.9	2026-07-17 21:23:14.9	f
cmrpg2uz8000b04l4l3dnh0xa	PENDING	cmpefdukz000404lanevrsp34	cmrpg2uyd000004l44co9je0h	\N	2026-07-17 21:23:14.9	2026-07-17 21:23:14.9	f
cmrpg2uz8000c04l4ak8x12pk	PENDING	cmpefep0o000504laynrqmhnw	cmrpg2uyd000004l44co9je0h	\N	2026-07-17 21:23:14.9	2026-07-17 21:23:14.9	f
cmrpg2uz8000d04l4lth75xpv	PENDING	cmpefcqj2000104ladlx0ysjz	cmrpg2uyd000004l44co9je0h	\N	2026-07-17 21:23:14.9	2026-07-17 21:23:14.9	f
cmrpg2uz8000e04l4q2qujqty	PENDING	cmpcsehq1000104ibueo8dlm5	cmrpg2uyd000004l44co9je0h	\N	2026-07-17 21:23:14.9	2026-07-17 21:23:14.9	f
cmrpg2uz8000f04l4lqult6xp	PENDING	cmph7t8a1000004l9n8uic25p	cmrpg2uyd000004l44co9je0h	\N	2026-07-17 21:23:14.9	2026-07-17 21:23:14.9	f
cmrpg2uz8000g04l4j36x7iwx	PENDING	cmpcopzu6000004jro3prr7ca	cmrpg2uyd000004l44co9je0h	\N	2026-07-17 21:23:14.9	2026-07-17 21:23:14.9	f
cmrpg2uz8000h04l4mq67l2p0	PENDING	cmpcpt3n6000004l561lm2ja7	cmrpg2uyd000004l44co9je0h	\N	2026-07-17 21:23:14.9	2026-07-17 21:23:14.9	f
cmrpg2uz8000i04l47qhruazs	PENDING	cmpdz3jpw000004jvdohsd2ri	cmrpg2uyd000004l44co9je0h	\N	2026-07-17 21:23:14.9	2026-07-17 21:23:14.9	f
cmrpg2uz8000j04l42kytn0n0	PENDING	cmpn1o6et000004jrcnmw0gav	cmrpg2uyd000004l44co9je0h	\N	2026-07-17 21:23:14.9	2026-07-17 21:23:14.9	f
cmrpg2uz8000k04l4ib4onk3f	PENDING	cmpfk8v2v000704jlp8siky9e	cmrpg2uyd000004l44co9je0h	\N	2026-07-17 21:23:14.9	2026-07-17 21:23:14.9	f
cmrpg2uz8000l04l42l4eyj39	PENDING	cmpct2xp7000004jsv1ujpe1r	cmrpg2uyd000004l44co9je0h	\N	2026-07-17 21:23:14.9	2026-07-17 21:23:14.9	f
cmrpg2uz8000m04l4hvcmq1me	PENDING	cmpcpgupa000004l5ehnc0kjs	cmrpg2uyd000004l44co9je0h	\N	2026-07-17 21:23:14.9	2026-07-17 21:23:14.9	f
cmrpg2uz8000n04l42hutpqz0	PENDING	cmrozuqv4000104l5tbza8qgy	cmrpg2uyd000004l44co9je0h	\N	2026-07-17 21:23:14.9	2026-07-17 21:23:14.9	f
cmrpgk0ra000504jttbfn9qcz	PENDING	cmpcsds4s000004jmgpwku1j2	cmrpgk0qh000004jttg2q1s11	\N	2026-07-17 21:36:35.542	2026-07-17 21:36:35.542	t
cmrpgk0ra000604jtpirbu9pz	PENDING	cmpct94t9000204jsxeeckk3m	cmrpgk0qh000004jttg2q1s11	\N	2026-07-17 21:36:35.542	2026-07-17 21:36:35.542	t
cmrpgk0ra000704jtmbiucnhg	PENDING	cmpdz2mcq000104jr9xnhl4i0	cmrpgk0qh000004jttg2q1s11	\N	2026-07-17 21:36:35.542	2026-07-17 21:36:35.542	t
cmrpgk0rb000b04jt1qo2n1hp	PENDING	cmpefdukz000404lanevrsp34	cmrpgk0qh000004jttg2q1s11	\N	2026-07-17 21:36:35.542	2026-07-17 21:36:35.542	t
cmrpgk0rb000c04jt6dfrsnqy	PENDING	cmpefep0o000504laynrqmhnw	cmrpgk0qh000004jttg2q1s11	\N	2026-07-17 21:36:35.542	2026-07-17 21:36:35.542	t
cmrpgk0ra000904jtp9t0nmab	CONFIRMED	cmpefcd1z000004lasd2r1kdh	cmrpgk0qh000004jttg2q1s11	2026-07-30 02:50:13.81	2026-07-17 21:36:35.542	2026-07-30 02:50:13.829	t
cmrpgk0ra000404jty7qeto3i	CONFIRMED	cmpcqf47m000004l85vce0gfh	cmrpgk0qh000004jttg2q1s11	2026-07-30 11:22:55.209	2026-07-17 21:36:35.542	2026-07-30 11:22:55.22	t
cmrpgk0ra000104jt8b9bvda8	CONFIRMED	cmpcm7sgp000004l1fp9o52ky	cmrpgk0qh000004jttg2q1s11	2026-07-30 15:50:46.3	2026-07-17 21:36:35.542	2026-07-30 15:50:46.311	t
cmrpgk0ra000304jtanfccn0y	CONFIRMED	cmpcoxez0000304l8g40zcfou	cmrpgk0qh000004jttg2q1s11	2026-07-31 11:17:50.187	2026-07-17 21:36:35.542	2026-07-31 11:17:50.205	t
cmrpgk0ra000204jtp9coo66y	DECLINED	cmpcov8jd000004l8umh13pux	cmrpgk0qh000004jttg2q1s11	2026-07-31 11:29:03.881	2026-07-17 21:36:35.542	2026-07-31 11:29:03.891	t
cmrpgk0rb000k04jtugrxn5kv	PENDING	cmpfk8v2v000704jlp8siky9e	cmrpgk0qh000004jttg2q1s11	\N	2026-07-17 21:36:35.542	2026-07-17 21:36:35.542	t
cmrpgk0rb000m04jtleewsqbt	PENDING	cmpcpgupa000004l5ehnc0kjs	cmrpgk0qh000004jttg2q1s11	\N	2026-07-17 21:36:35.542	2026-07-17 21:36:35.542	t
cmrpgrdsc000p04jtg1q11gu9	PENDING	cmpcm7sgp000004l1fp9o52ky	cmrpgrdrs000o04jtnnx9wcf4	\N	2026-07-17 21:42:19.02	2026-07-17 21:42:19.02	t
cmrpgrdsc000q04jtuk31abdj	PENDING	cmpcov8jd000004l8umh13pux	cmrpgrdrs000o04jtnnx9wcf4	\N	2026-07-17 21:42:19.02	2026-07-17 21:42:19.02	t
cmrpgrdsc000r04jtgr7ievsb	PENDING	cmpcoxez0000304l8g40zcfou	cmrpgrdrs000o04jtnnx9wcf4	\N	2026-07-17 21:42:19.02	2026-07-17 21:42:19.02	t
cmrpgrdsc000s04jtdho5eum9	PENDING	cmpcqf47m000004l85vce0gfh	cmrpgrdrs000o04jtnnx9wcf4	\N	2026-07-17 21:42:19.02	2026-07-17 21:42:19.02	t
cmrpgrdsc000t04jt4jsz8nwc	PENDING	cmpcsds4s000004jmgpwku1j2	cmrpgrdrs000o04jtnnx9wcf4	\N	2026-07-17 21:42:19.02	2026-07-17 21:42:19.02	t
cmrpgrdsc000u04jt73g24nwq	PENDING	cmpct94t9000204jsxeeckk3m	cmrpgrdrs000o04jtnnx9wcf4	\N	2026-07-17 21:42:19.02	2026-07-17 21:42:19.02	t
cmrpgrdsc000v04jtpxo06sva	PENDING	cmpdz2mcq000104jr9xnhl4i0	cmrpgrdrs000o04jtnnx9wcf4	\N	2026-07-17 21:42:19.02	2026-07-17 21:42:19.02	t
cmrpgrdsc000w04jt8exws5j1	PENDING	cmpcpimjz000004jpcdqgfhfx	cmrpgrdrs000o04jtnnx9wcf4	\N	2026-07-17 21:42:19.02	2026-07-17 21:42:19.02	t
cmrpgrdsc000x04jt4fyoubo0	PENDING	cmpefcd1z000004lasd2r1kdh	cmrpgrdrs000o04jtnnx9wcf4	\N	2026-07-17 21:42:19.02	2026-07-17 21:42:19.02	t
cmrpgrdsc000y04jtseh6fqc0	PENDING	cmpefdkyx000304la3k3nq9p9	cmrpgrdrs000o04jtnnx9wcf4	\N	2026-07-17 21:42:19.02	2026-07-17 21:42:19.02	t
cmrpgrdsc000z04jtzj1d4yqs	PENDING	cmpefdukz000404lanevrsp34	cmrpgrdrs000o04jtnnx9wcf4	\N	2026-07-17 21:42:19.02	2026-07-17 21:42:19.02	t
cmrpgrdsc001004jtguzlr7r0	PENDING	cmpefep0o000504laynrqmhnw	cmrpgrdrs000o04jtnnx9wcf4	\N	2026-07-17 21:42:19.02	2026-07-17 21:42:19.02	t
cmrpgrdsc001104jtxzkuz8rt	PENDING	cmpefcqj2000104ladlx0ysjz	cmrpgrdrs000o04jtnnx9wcf4	\N	2026-07-17 21:42:19.02	2026-07-17 21:42:19.02	t
cmrpgrdsc001204jt8y5y4mp3	PENDING	cmpcsehq1000104ibueo8dlm5	cmrpgrdrs000o04jtnnx9wcf4	\N	2026-07-17 21:42:19.02	2026-07-17 21:42:19.02	t
cmrpgrdsc001304jtvkgftfqq	PENDING	cmph7t8a1000004l9n8uic25p	cmrpgrdrs000o04jtnnx9wcf4	\N	2026-07-17 21:42:19.02	2026-07-17 21:42:19.02	t
cmrpgrdsc001404jtv60kirmf	PENDING	cmpcopzu6000004jro3prr7ca	cmrpgrdrs000o04jtnnx9wcf4	\N	2026-07-17 21:42:19.02	2026-07-17 21:42:19.02	t
cmrpgrdsc001504jtoshlpscr	PENDING	cmpcpt3n6000004l561lm2ja7	cmrpgrdrs000o04jtnnx9wcf4	\N	2026-07-17 21:42:19.02	2026-07-17 21:42:19.02	t
cmrpgrdsc001604jtvux94atp	PENDING	cmpdz3jpw000004jvdohsd2ri	cmrpgrdrs000o04jtnnx9wcf4	\N	2026-07-17 21:42:19.02	2026-07-17 21:42:19.02	t
cmrpgrdsc001704jtscsxng6w	PENDING	cmpn1o6et000004jrcnmw0gav	cmrpgrdrs000o04jtnnx9wcf4	\N	2026-07-17 21:42:19.02	2026-07-17 21:42:19.02	t
cmrpgrdsc001804jtkkuhhy9g	PENDING	cmpfk8v2v000704jlp8siky9e	cmrpgrdrs000o04jtnnx9wcf4	\N	2026-07-17 21:42:19.02	2026-07-17 21:42:19.02	t
cmrpgrdsc001904jt9z7nxfqa	PENDING	cmpct2xp7000004jsv1ujpe1r	cmrpgrdrs000o04jtnnx9wcf4	\N	2026-07-17 21:42:19.02	2026-07-17 21:42:19.02	t
cmrpgrdsc001a04jt5cogyjd0	PENDING	cmpcpgupa000004l5ehnc0kjs	cmrpgrdrs000o04jtnnx9wcf4	\N	2026-07-17 21:42:19.02	2026-07-17 21:42:19.02	t
cmrpgrdsc001b04jtx1pn87rr	PENDING	cmrozuqv4000104l5tbza8qgy	cmrpgrdrs000o04jtnnx9wcf4	\N	2026-07-17 21:42:19.02	2026-07-17 21:42:19.02	t
cmqp5jh9a000404jpd2dc7ffo	CONFIRMED	cmpcqf47m000004l85vce0gfh	cmqp5jh8b000004jp8k1q116l	2026-07-18 13:56:59.597	2026-06-22 11:48:32.158	2026-07-18 13:56:59.607	t
cmrqib187000104l7nh604coq	PENDING	cmpcm7sgp000004l1fp9o52ky	cmrqib170000004l7swe10dxz	\N	2026-07-18 15:13:21.655	2026-07-18 15:13:21.655	t
cmrqib187000204l7su2s666u	PENDING	cmpcov8jd000004l8umh13pux	cmrqib170000004l7swe10dxz	\N	2026-07-18 15:13:21.655	2026-07-18 15:13:21.655	t
cmrqib187000304l7jzwks6ex	PENDING	cmpcoxez0000304l8g40zcfou	cmrqib170000004l7swe10dxz	\N	2026-07-18 15:13:21.655	2026-07-18 15:13:21.655	t
cmrqib187000404l7psxdr0lv	PENDING	cmpcqf47m000004l85vce0gfh	cmrqib170000004l7swe10dxz	\N	2026-07-18 15:13:21.655	2026-07-18 15:13:21.655	t
cmrqib187000504l7q0g54ntr	PENDING	cmpcsds4s000004jmgpwku1j2	cmrqib170000004l7swe10dxz	\N	2026-07-18 15:13:21.655	2026-07-18 15:13:21.655	t
cmrqib187000604l70p45fo83	PENDING	cmpct94t9000204jsxeeckk3m	cmrqib170000004l7swe10dxz	\N	2026-07-18 15:13:21.655	2026-07-18 15:13:21.655	t
cmrqib187000704l7qeickgf4	PENDING	cmpdz2mcq000104jr9xnhl4i0	cmrqib170000004l7swe10dxz	\N	2026-07-18 15:13:21.655	2026-07-18 15:13:21.655	t
cmrqib187000804l71enw1tq1	PENDING	cmpcpimjz000004jpcdqgfhfx	cmrqib170000004l7swe10dxz	\N	2026-07-18 15:13:21.655	2026-07-18 15:13:21.655	t
cmrqib187000904l735opfiwl	PENDING	cmpefcd1z000004lasd2r1kdh	cmrqib170000004l7swe10dxz	\N	2026-07-18 15:13:21.655	2026-07-18 15:13:21.655	t
cmrqib187000a04l7492joctw	PENDING	cmpefdkyx000304la3k3nq9p9	cmrqib170000004l7swe10dxz	\N	2026-07-18 15:13:21.655	2026-07-18 15:13:21.655	t
cmrqib187000b04l7841bn3zy	PENDING	cmpefdukz000404lanevrsp34	cmrqib170000004l7swe10dxz	\N	2026-07-18 15:13:21.655	2026-07-18 15:13:21.655	t
cmrqib187000c04l7pu9i4py2	PENDING	cmpefep0o000504laynrqmhnw	cmrqib170000004l7swe10dxz	\N	2026-07-18 15:13:21.655	2026-07-18 15:13:21.655	t
cmrqib187000d04l72ulzfgz9	PENDING	cmpefcqj2000104ladlx0ysjz	cmrqib170000004l7swe10dxz	\N	2026-07-18 15:13:21.655	2026-07-18 15:13:21.655	t
cmrqib187000e04l7fzg3v4lc	PENDING	cmpcsehq1000104ibueo8dlm5	cmrqib170000004l7swe10dxz	\N	2026-07-18 15:13:21.655	2026-07-18 15:13:21.655	t
cmrqib187000f04l7pvypnqj9	PENDING	cmph7t8a1000004l9n8uic25p	cmrqib170000004l7swe10dxz	\N	2026-07-18 15:13:21.655	2026-07-18 15:13:21.655	t
cmrqib187000g04l74aman5wr	PENDING	cmpcopzu6000004jro3prr7ca	cmrqib170000004l7swe10dxz	\N	2026-07-18 15:13:21.655	2026-07-18 15:13:21.655	t
cmrqib187000h04l78nk9ojcc	PENDING	cmpcpt3n6000004l561lm2ja7	cmrqib170000004l7swe10dxz	\N	2026-07-18 15:13:21.655	2026-07-18 15:13:21.655	t
cmrqib187000i04l72fcuk56y	PENDING	cmpdz3jpw000004jvdohsd2ri	cmrqib170000004l7swe10dxz	\N	2026-07-18 15:13:21.655	2026-07-18 15:13:21.655	t
cmrqib187000j04l71aoiqoid	PENDING	cmpn1o6et000004jrcnmw0gav	cmrqib170000004l7swe10dxz	\N	2026-07-18 15:13:21.655	2026-07-18 15:13:21.655	t
cmrqib187000k04l7b9xdv7p1	PENDING	cmpfk8v2v000704jlp8siky9e	cmrqib170000004l7swe10dxz	\N	2026-07-18 15:13:21.655	2026-07-18 15:13:21.655	t
cmrqib187000l04l7gpuu348d	PENDING	cmpct2xp7000004jsv1ujpe1r	cmrqib170000004l7swe10dxz	\N	2026-07-18 15:13:21.655	2026-07-18 15:13:21.655	t
cmrqib187000m04l7klrxssj3	PENDING	cmpcpgupa000004l5ehnc0kjs	cmrqib170000004l7swe10dxz	\N	2026-07-18 15:13:21.655	2026-07-18 15:13:21.655	t
cmrqib187000n04l79bai1t5y	PENDING	cmrozuqv4000104l5tbza8qgy	cmrqib170000004l7swe10dxz	\N	2026-07-18 15:13:21.655	2026-07-18 15:13:21.655	t
cmrpgk0rb000g04jtq9o572o8	CONFIRMED	cmpcopzu6000004jro3prr7ca	cmrpgk0qh000004jttg2q1s11	2026-07-28 15:11:29.22	2026-07-17 21:36:35.542	2026-07-28 15:11:29.232	t
cmrpgk0rb000e04jt4p756rvk	CONFIRMED	cmpcsehq1000104ibueo8dlm5	cmrpgk0qh000004jttg2q1s11	2026-07-30 11:51:14.438	2026-07-17 21:36:35.542	2026-07-30 11:51:14.455	t
cmrpgk0rb000h04jt5euo8clx	CONFIRMED	cmpcpt3n6000004l561lm2ja7	cmrpgk0qh000004jttg2q1s11	2026-07-30 13:20:46.232	2026-07-17 21:36:35.542	2026-07-30 13:20:46.243	t
cmrpgk0rb000d04jtmow1ndl0	CONFIRMED	cmpefcqj2000104ladlx0ysjz	cmrpgk0qh000004jttg2q1s11	2026-07-30 20:59:06.851	2026-07-17 21:36:35.542	2026-07-30 20:59:06.876	t
cmrpgk0rb000n04jt5r3u1b3t	DECLINED	cmrozuqv4000104l5tbza8qgy	cmrpgk0qh000004jttg2q1s11	2026-07-31 11:31:35.244	2026-07-17 21:36:35.542	2026-07-31 11:31:35.266	t
cmrpgk0rb000i04jt4ah64sxm	DECLINED	cmpdz3jpw000004jvdohsd2ri	cmrpgk0qh000004jttg2q1s11	2026-07-31 20:16:48.338	2026-07-17 21:36:35.542	2026-07-31 20:16:48.348	t
cmrpgk0rb000l04jtb40jrx76	DECLINED	cmpct2xp7000004jsv1ujpe1r	cmrpgk0qh000004jttg2q1s11	2026-07-31 22:17:16.896	2026-07-17 21:36:35.542	2026-07-31 22:17:16.898	t
cmrqkwrfu000104jpfot6143w	PENDING	cmpcm7sgp000004l1fp9o52ky	cmrqkwrev000004jpjug6t8wd	\N	2026-07-18 16:26:14.634	2026-07-18 16:26:14.634	t
cmrqkwrfu000204jpeym7nzck	PENDING	cmpcov8jd000004l8umh13pux	cmrqkwrev000004jpjug6t8wd	\N	2026-07-18 16:26:14.634	2026-07-18 16:26:14.634	t
cmrqkwrfu000304jpoet61afg	PENDING	cmpcoxez0000304l8g40zcfou	cmrqkwrev000004jpjug6t8wd	\N	2026-07-18 16:26:14.634	2026-07-18 16:26:14.634	t
cmrqkwrfu000404jp4ydu20uh	PENDING	cmpcqf47m000004l85vce0gfh	cmrqkwrev000004jpjug6t8wd	\N	2026-07-18 16:26:14.634	2026-07-18 16:26:14.634	t
cmrqkwrfu000504jpwgvhbh42	PENDING	cmpcsds4s000004jmgpwku1j2	cmrqkwrev000004jpjug6t8wd	\N	2026-07-18 16:26:14.634	2026-07-18 16:26:14.634	t
cmrqkwrfu000604jpt2gsjv1b	PENDING	cmpct94t9000204jsxeeckk3m	cmrqkwrev000004jpjug6t8wd	\N	2026-07-18 16:26:14.634	2026-07-18 16:26:14.634	t
cmrqkwrfu000704jpd9e3gwpo	PENDING	cmpdz2mcq000104jr9xnhl4i0	cmrqkwrev000004jpjug6t8wd	\N	2026-07-18 16:26:14.634	2026-07-18 16:26:14.634	t
cmrqkwrfu000804jp46zx49p5	PENDING	cmpcpimjz000004jpcdqgfhfx	cmrqkwrev000004jpjug6t8wd	\N	2026-07-18 16:26:14.634	2026-07-18 16:26:14.634	t
cmrqkwrfu000904jpfjz8lubl	PENDING	cmpefcd1z000004lasd2r1kdh	cmrqkwrev000004jpjug6t8wd	\N	2026-07-18 16:26:14.634	2026-07-18 16:26:14.634	t
cmrqkwrfu000a04jpcwnavrs2	PENDING	cmpefdkyx000304la3k3nq9p9	cmrqkwrev000004jpjug6t8wd	\N	2026-07-18 16:26:14.634	2026-07-18 16:26:14.634	t
cmrqkwrfu000b04jplhosxulm	PENDING	cmpefdukz000404lanevrsp34	cmrqkwrev000004jpjug6t8wd	\N	2026-07-18 16:26:14.634	2026-07-18 16:26:14.634	t
cmrqkwrfu000c04jpy61761o7	PENDING	cmpefep0o000504laynrqmhnw	cmrqkwrev000004jpjug6t8wd	\N	2026-07-18 16:26:14.634	2026-07-18 16:26:14.634	t
cmrqkwrfu000d04jp1i6mbk15	PENDING	cmpefcqj2000104ladlx0ysjz	cmrqkwrev000004jpjug6t8wd	\N	2026-07-18 16:26:14.634	2026-07-18 16:26:14.634	t
cmrqkwrfu000e04jp4npokdpb	PENDING	cmpcsehq1000104ibueo8dlm5	cmrqkwrev000004jpjug6t8wd	\N	2026-07-18 16:26:14.634	2026-07-18 16:26:14.634	t
cmrqkwrfu000f04jpsnhvvtlj	PENDING	cmph7t8a1000004l9n8uic25p	cmrqkwrev000004jpjug6t8wd	\N	2026-07-18 16:26:14.634	2026-07-18 16:26:14.634	t
cmrqkwrfu000g04jpgstkmhtn	PENDING	cmpcopzu6000004jro3prr7ca	cmrqkwrev000004jpjug6t8wd	\N	2026-07-18 16:26:14.634	2026-07-18 16:26:14.634	t
cmrqkwrfu000h04jpocy4t1z5	PENDING	cmpcpt3n6000004l561lm2ja7	cmrqkwrev000004jpjug6t8wd	\N	2026-07-18 16:26:14.634	2026-07-18 16:26:14.634	t
cmrqkwrfu000i04jp7egof2fv	PENDING	cmpdz3jpw000004jvdohsd2ri	cmrqkwrev000004jpjug6t8wd	\N	2026-07-18 16:26:14.634	2026-07-18 16:26:14.634	t
cmrqkwrfu000j04jp4fosl83m	PENDING	cmpn1o6et000004jrcnmw0gav	cmrqkwrev000004jpjug6t8wd	\N	2026-07-18 16:26:14.634	2026-07-18 16:26:14.634	t
cmrqkwrfu000k04jp79srx66m	PENDING	cmpfk8v2v000704jlp8siky9e	cmrqkwrev000004jpjug6t8wd	\N	2026-07-18 16:26:14.634	2026-07-18 16:26:14.634	t
cmrqkwrfu000l04jpw5ving6n	PENDING	cmpct2xp7000004jsv1ujpe1r	cmrqkwrev000004jpjug6t8wd	\N	2026-07-18 16:26:14.634	2026-07-18 16:26:14.634	t
cmrqkwrfu000m04jpxndn2lsh	PENDING	cmpcpgupa000004l5ehnc0kjs	cmrqkwrev000004jpjug6t8wd	\N	2026-07-18 16:26:14.634	2026-07-18 16:26:14.634	t
cmrqkwrfu000n04jplxy5bwjm	PENDING	cmrozuqv4000104l5tbza8qgy	cmrqkwrev000004jpjug6t8wd	\N	2026-07-18 16:26:14.634	2026-07-18 16:26:14.634	t
cmrqld3lf000q04jpfwx49gfy	PENDING	cmpcm7sgp000004l1fp9o52ky	cmrqld3kq000p04jp208zp47h	\N	2026-07-18 16:38:56.884	2026-07-18 16:38:56.884	t
cmrqld3lg000r04jptvf9yng8	PENDING	cmpcov8jd000004l8umh13pux	cmrqld3kq000p04jp208zp47h	\N	2026-07-18 16:38:56.884	2026-07-18 16:38:56.884	t
cmrqld3lg000s04jpf190df0d	PENDING	cmpcoxez0000304l8g40zcfou	cmrqld3kq000p04jp208zp47h	\N	2026-07-18 16:38:56.884	2026-07-18 16:38:56.884	t
cmrqld3lg000t04jpg3ty81i3	PENDING	cmpcqf47m000004l85vce0gfh	cmrqld3kq000p04jp208zp47h	\N	2026-07-18 16:38:56.884	2026-07-18 16:38:56.884	t
cmrqld3lg000u04jp3lqpxnzh	PENDING	cmpcsds4s000004jmgpwku1j2	cmrqld3kq000p04jp208zp47h	\N	2026-07-18 16:38:56.884	2026-07-18 16:38:56.884	t
cmrqld3lg000v04jpjevr0lbp	PENDING	cmpct94t9000204jsxeeckk3m	cmrqld3kq000p04jp208zp47h	\N	2026-07-18 16:38:56.884	2026-07-18 16:38:56.884	t
cmrqld3lg000w04jpxubgdqw4	PENDING	cmpdz2mcq000104jr9xnhl4i0	cmrqld3kq000p04jp208zp47h	\N	2026-07-18 16:38:56.884	2026-07-18 16:38:56.884	t
cmrqld3lg000x04jp4hujww7j	PENDING	cmpcpimjz000004jpcdqgfhfx	cmrqld3kq000p04jp208zp47h	\N	2026-07-18 16:38:56.884	2026-07-18 16:38:56.884	t
cmrqld3lg000y04jpikflyril	PENDING	cmpefcd1z000004lasd2r1kdh	cmrqld3kq000p04jp208zp47h	\N	2026-07-18 16:38:56.884	2026-07-18 16:38:56.884	t
cmrqld3lg000z04jp1di0mmyc	PENDING	cmpefdkyx000304la3k3nq9p9	cmrqld3kq000p04jp208zp47h	\N	2026-07-18 16:38:56.884	2026-07-18 16:38:56.884	t
cmrqld3lg001004jpz4odpxsp	PENDING	cmpefdukz000404lanevrsp34	cmrqld3kq000p04jp208zp47h	\N	2026-07-18 16:38:56.884	2026-07-18 16:38:56.884	t
cmrqld3lg001104jp5u4huxra	PENDING	cmpefep0o000504laynrqmhnw	cmrqld3kq000p04jp208zp47h	\N	2026-07-18 16:38:56.884	2026-07-18 16:38:56.884	t
cmrqld3lg001204jppeeu8dvm	PENDING	cmpefcqj2000104ladlx0ysjz	cmrqld3kq000p04jp208zp47h	\N	2026-07-18 16:38:56.884	2026-07-18 16:38:56.884	t
cmrqld3lg001304jplcbrkzdr	PENDING	cmpcsehq1000104ibueo8dlm5	cmrqld3kq000p04jp208zp47h	\N	2026-07-18 16:38:56.884	2026-07-18 16:38:56.884	t
cmrqld3lg001404jpcngobs02	PENDING	cmph7t8a1000004l9n8uic25p	cmrqld3kq000p04jp208zp47h	\N	2026-07-18 16:38:56.884	2026-07-18 16:38:56.884	t
cmrqld3lg001504jpa0uxlwxx	PENDING	cmpcopzu6000004jro3prr7ca	cmrqld3kq000p04jp208zp47h	\N	2026-07-18 16:38:56.884	2026-07-18 16:38:56.884	t
cmrqld3lg001604jpzr0ar52w	PENDING	cmpcpt3n6000004l561lm2ja7	cmrqld3kq000p04jp208zp47h	\N	2026-07-18 16:38:56.884	2026-07-18 16:38:56.884	t
cmrqld3lg001704jpdxdxk88i	PENDING	cmpdz3jpw000004jvdohsd2ri	cmrqld3kq000p04jp208zp47h	\N	2026-07-18 16:38:56.884	2026-07-18 16:38:56.884	t
cmrqld3lg001804jp6wk7u7qw	PENDING	cmpn1o6et000004jrcnmw0gav	cmrqld3kq000p04jp208zp47h	\N	2026-07-18 16:38:56.884	2026-07-18 16:38:56.884	t
cmrqld3lg001904jpvqvs54eq	PENDING	cmpfk8v2v000704jlp8siky9e	cmrqld3kq000p04jp208zp47h	\N	2026-07-18 16:38:56.884	2026-07-18 16:38:56.884	t
cmrqld3lg001a04jpnew5npu6	PENDING	cmpct2xp7000004jsv1ujpe1r	cmrqld3kq000p04jp208zp47h	\N	2026-07-18 16:38:56.884	2026-07-18 16:38:56.884	t
cmrqld3lg001b04jpptidvk39	PENDING	cmpcpgupa000004l5ehnc0kjs	cmrqld3kq000p04jp208zp47h	\N	2026-07-18 16:38:56.884	2026-07-18 16:38:56.884	t
cmrqld3lg001c04jp4oxu1sjw	PENDING	cmrozuqv4000104l5tbza8qgy	cmrqld3kq000p04jp208zp47h	\N	2026-07-18 16:38:56.884	2026-07-18 16:38:56.884	t
cmrqlng56000104jux798hr5p	PENDING	cmpcm7sgp000004l1fp9o52ky	cmrqlng1w000004junomwb3sz	\N	2026-07-18 16:46:59.706	2026-07-18 16:46:59.706	t
cmrqlng56000204juaagn2ed7	PENDING	cmpcov8jd000004l8umh13pux	cmrqlng1w000004junomwb3sz	\N	2026-07-18 16:46:59.706	2026-07-18 16:46:59.706	t
cmrqlng56000304ju6cue8dm5	PENDING	cmpcoxez0000304l8g40zcfou	cmrqlng1w000004junomwb3sz	\N	2026-07-18 16:46:59.706	2026-07-18 16:46:59.706	t
cmrqlng56000404jus18t36en	PENDING	cmpcqf47m000004l85vce0gfh	cmrqlng1w000004junomwb3sz	\N	2026-07-18 16:46:59.706	2026-07-18 16:46:59.706	t
cmrqlng56000504jurlyewxnv	PENDING	cmpcsds4s000004jmgpwku1j2	cmrqlng1w000004junomwb3sz	\N	2026-07-18 16:46:59.706	2026-07-18 16:46:59.706	t
cmrqlng56000604juu6eqn3vn	PENDING	cmpct94t9000204jsxeeckk3m	cmrqlng1w000004junomwb3sz	\N	2026-07-18 16:46:59.706	2026-07-18 16:46:59.706	t
cmrqlng56000704ju26hpivtt	PENDING	cmpdz2mcq000104jr9xnhl4i0	cmrqlng1w000004junomwb3sz	\N	2026-07-18 16:46:59.706	2026-07-18 16:46:59.706	t
cmrqlng56000804ju4d1b3an6	PENDING	cmpcpimjz000004jpcdqgfhfx	cmrqlng1w000004junomwb3sz	\N	2026-07-18 16:46:59.706	2026-07-18 16:46:59.706	t
cmrqlng56000904jutit57due	PENDING	cmpefcd1z000004lasd2r1kdh	cmrqlng1w000004junomwb3sz	\N	2026-07-18 16:46:59.706	2026-07-18 16:46:59.706	t
cmrqlng56000a04juhcwdn2pu	PENDING	cmpefdkyx000304la3k3nq9p9	cmrqlng1w000004junomwb3sz	\N	2026-07-18 16:46:59.706	2026-07-18 16:46:59.706	t
cmrqlng56000b04juck4koq25	PENDING	cmpefdukz000404lanevrsp34	cmrqlng1w000004junomwb3sz	\N	2026-07-18 16:46:59.706	2026-07-18 16:46:59.706	t
cmrqlng56000c04juxnapcace	PENDING	cmpefep0o000504laynrqmhnw	cmrqlng1w000004junomwb3sz	\N	2026-07-18 16:46:59.706	2026-07-18 16:46:59.706	t
cmrqlng56000d04ju36p5dond	PENDING	cmpefcqj2000104ladlx0ysjz	cmrqlng1w000004junomwb3sz	\N	2026-07-18 16:46:59.706	2026-07-18 16:46:59.706	t
cmrqlng56000e04jurhtqclrd	PENDING	cmpcsehq1000104ibueo8dlm5	cmrqlng1w000004junomwb3sz	\N	2026-07-18 16:46:59.706	2026-07-18 16:46:59.706	t
cmrqlng56000f04ju0n55hwa2	PENDING	cmph7t8a1000004l9n8uic25p	cmrqlng1w000004junomwb3sz	\N	2026-07-18 16:46:59.706	2026-07-18 16:46:59.706	t
cmrqlng56000g04juy32qpsxx	PENDING	cmpcopzu6000004jro3prr7ca	cmrqlng1w000004junomwb3sz	\N	2026-07-18 16:46:59.706	2026-07-18 16:46:59.706	t
cmrqlng56000h04jujk62bm1o	PENDING	cmpcpt3n6000004l561lm2ja7	cmrqlng1w000004junomwb3sz	\N	2026-07-18 16:46:59.706	2026-07-18 16:46:59.706	t
cmrqlng57000i04jupgyksj1m	PENDING	cmpdz3jpw000004jvdohsd2ri	cmrqlng1w000004junomwb3sz	\N	2026-07-18 16:46:59.706	2026-07-18 16:46:59.706	t
cmrqlng57000j04juheb54jm2	PENDING	cmpn1o6et000004jrcnmw0gav	cmrqlng1w000004junomwb3sz	\N	2026-07-18 16:46:59.706	2026-07-18 16:46:59.706	t
cmrqlng57000k04juq1ibjy9n	PENDING	cmpfk8v2v000704jlp8siky9e	cmrqlng1w000004junomwb3sz	\N	2026-07-18 16:46:59.706	2026-07-18 16:46:59.706	t
cmrqlng57000l04jubvncug9o	PENDING	cmpct2xp7000004jsv1ujpe1r	cmrqlng1w000004junomwb3sz	\N	2026-07-18 16:46:59.706	2026-07-18 16:46:59.706	t
cmrqlng57000m04julommeq9u	PENDING	cmpcpgupa000004l5ehnc0kjs	cmrqlng1w000004junomwb3sz	\N	2026-07-18 16:46:59.706	2026-07-18 16:46:59.706	t
cmrqlng57000n04juem01z62z	PENDING	cmrozuqv4000104l5tbza8qgy	cmrqlng1w000004junomwb3sz	\N	2026-07-18 16:46:59.706	2026-07-18 16:46:59.706	t
cmrthsbfs000a04ky8ivrxfzj	PENDING	cmpefdukz000404lanevrsp34	cmrthsbf6000004kybfhn32yj	\N	2026-07-20 17:22:06.951	2026-07-20 17:22:06.951	t
cmrthsbfs000i04kycwi5xev9	CONFIRMED	cmpn1o6et000004jrcnmw0gav	cmrthsbf6000004kybfhn32yj	2026-07-23 23:14:30.907	2026-07-20 17:22:06.951	2026-07-23 23:14:30.928	t
cmrthsbfr000104kysx3nulhn	CONFIRMED	cmpcm7sgp000004l1fp9o52ky	cmrthsbf6000004kybfhn32yj	2026-07-23 23:16:37.965	2026-07-20 17:22:06.951	2026-07-23 23:16:37.976	t
cmrthsbfs000904kyyv2fu7wz	CONFIRMED	cmpefdkyx000304la3k3nq9p9	cmrthsbf6000004kybfhn32yj	2026-07-23 23:16:43.549	2026-07-20 17:22:06.951	2026-07-23 23:16:43.567	t
cmrthsbfs000b04kyw1911413	DECLINED	cmpefep0o000504laynrqmhnw	cmrthsbf6000004kybfhn32yj	2026-07-23 23:50:00.959	2026-07-20 17:22:06.951	2026-07-23 23:50:00.983	t
cmrthsbfs000n04kyk8vaxgjv	CONFIRMED	cmpcqf47m000004l85vce0gfh	cmrthsbf6000004kybfhn32yj	2026-07-24 00:04:31.699	2026-07-20 17:22:06.951	2026-07-24 00:04:31.708	t
cmrthsbfs000l04ky2gmvzr3t	DECLINED	cmpcpgupa000004l5ehnc0kjs	cmrthsbf6000004kybfhn32yj	2026-07-24 02:01:20.703	2026-07-20 17:22:06.951	2026-07-24 02:01:20.719	t
cmrthsbfs000g04kysehrdqb2	CONFIRMED	cmpcpt3n6000004l561lm2ja7	cmrthsbf6000004kybfhn32yj	2026-07-24 11:58:05.851	2026-07-20 17:22:06.951	2026-07-24 11:58:05.862	t
cmrthsbfs000604kym2d9cl2o	CONFIRMED	cmpdz2mcq000104jr9xnhl4i0	cmrthsbf6000004kybfhn32yj	2026-07-24 12:33:39.765	2026-07-20 17:22:06.951	2026-07-24 12:33:39.783	t
cmrthsbfs000d04kyvnm3cbra	DECLINED	cmpcsehq1000104ibueo8dlm5	cmrthsbf6000004kybfhn32yj	2026-07-24 13:29:44.654	2026-07-20 17:22:06.951	2026-07-24 13:29:44.659	t
cmrthsbfs000h04ky2gh9866e	DECLINED	cmpdz3jpw000004jvdohsd2ri	cmrthsbf6000004kybfhn32yj	2026-07-24 13:41:20.842	2026-07-20 17:22:06.951	2026-07-24 13:41:20.847	t
cmrthsbfs000m04ky1m21igbq	DECLINED	cmrozuqv4000104l5tbza8qgy	cmrthsbf6000004kybfhn32yj	2026-07-24 14:04:43.409	2026-07-20 17:22:06.951	2026-07-24 14:04:43.413	t
cmrthsbfs000j04ky706lvh50	DECLINED	cmpfk8v2v000704jlp8siky9e	cmrthsbf6000004kybfhn32yj	2026-07-24 15:00:13.126	2026-07-20 17:22:06.951	2026-07-24 15:00:13.135	t
cmrthsbfs000804kytea6c4hv	DECLINED	cmpefcd1z000004lasd2r1kdh	cmrthsbf6000004kybfhn32yj	2026-07-24 18:54:27.679	2026-07-20 17:22:06.951	2026-07-24 18:54:27.697	t
cmrthsbfs000e04ky5s3arxnk	CONFIRMED	cmph7t8a1000004l9n8uic25p	cmrthsbf6000004kybfhn32yj	2026-07-24 19:37:08.15	2026-07-20 17:22:06.951	2026-07-24 19:37:08.165	t
cmrthsbfr000204ky1p7h4k58	DECLINED	cmpcov8jd000004l8umh13pux	cmrthsbf6000004kybfhn32yj	2026-07-24 19:40:58.136	2026-07-20 17:22:06.951	2026-07-24 19:40:58.146	t
cmrthsbfs000704kyz3olj884	CONFIRMED	cmpcpimjz000004jpcdqgfhfx	cmrthsbf6000004kybfhn32yj	2026-07-24 20:25:47.967	2026-07-20 17:22:06.951	2026-07-24 20:25:47.978	t
cmrthsbfs000504kymmk5hgkw	CONFIRMED	cmpct94t9000204jsxeeckk3m	cmrthsbf6000004kybfhn32yj	2026-07-24 23:40:23.884	2026-07-20 17:22:06.951	2026-07-24 23:40:23.895	t
cmrthsbfs000c04kyovrfo81y	CONFIRMED	cmpefcqj2000104ladlx0ysjz	cmrthsbf6000004kybfhn32yj	2026-07-25 00:42:18.102	2026-07-20 17:22:06.951	2026-07-25 00:42:18.136	t
cmrthsbfs000304kynxxn1ph9	DECLINED	cmpcoxez0000304l8g40zcfou	cmrthsbf6000004kybfhn32yj	2026-07-25 14:26:16.891	2026-07-20 17:22:06.951	2026-07-25 14:26:16.902	t
cmrthsbfs000f04ky21xevxpe	CONFIRMED	cmpcopzu6000004jro3prr7ca	cmrthsbf6000004kybfhn32yj	2026-07-25 16:02:04.057	2026-07-20 17:22:06.951	2026-07-25 16:02:04.067	t
cmrthsbfs000k04ky0dnu15u8	DECLINED	cmpct2xp7000004jsv1ujpe1r	cmrthsbf6000004kybfhn32yj	2026-07-25 16:45:50.992	2026-07-20 17:22:06.951	2026-07-25 16:45:51.014	t
cmrthsbfs000404ky6zqva55e	DECLINED	cmpcsds4s000004jmgpwku1j2	cmrthsbf6000004kybfhn32yj	2026-07-25 18:15:20.229	2026-07-20 17:22:06.951	2026-07-25 18:15:20.241	t
cms390nak000u04jotr66k0jp	PENDING	cmpcm7sgp000004l1fp9o52ky	cms390n9w000t04jol6dfwp3s	\N	2026-07-27 13:14:20.78	2026-07-27 13:14:20.78	t
cms390nak000v04jo2ga1rjdp	PENDING	cmpcoxez0000304l8g40zcfou	cms390n9w000t04jol6dfwp3s	\N	2026-07-27 13:14:20.78	2026-07-27 13:14:20.78	t
cms390nak000w04jonx5nd4ck	PENDING	cmpdz2mcq000104jr9xnhl4i0	cms390n9w000t04jol6dfwp3s	\N	2026-07-27 13:14:20.78	2026-07-27 13:14:20.78	t
cms390nak000x04jo3wdt0nvs	PENDING	cmpefdkyx000304la3k3nq9p9	cms390n9w000t04jol6dfwp3s	\N	2026-07-27 13:14:20.78	2026-07-27 13:14:20.78	t
cms390nak000y04joutl7bxpj	PENDING	cmpefdukz000404lanevrsp34	cms390n9w000t04jol6dfwp3s	\N	2026-07-27 13:14:20.78	2026-07-27 13:14:20.78	t
cms390nak000z04jowbbe67gc	PENDING	cmpefep0o000504laynrqmhnw	cms390n9w000t04jol6dfwp3s	\N	2026-07-27 13:14:20.78	2026-07-27 13:14:20.78	t
cms390nak001004jodaybkd23	PENDING	cmpcsehq1000104ibueo8dlm5	cms390n9w000t04jol6dfwp3s	\N	2026-07-27 13:14:20.78	2026-07-27 13:14:20.78	t
cms390nak001104jocoibh6qu	PENDING	cmpdz3jpw000004jvdohsd2ri	cms390n9w000t04jol6dfwp3s	\N	2026-07-27 13:14:20.78	2026-07-27 13:14:20.78	t
cms390nak001204jo2lih68fp	PENDING	cmpfk8v2v000704jlp8siky9e	cms390n9w000t04jol6dfwp3s	\N	2026-07-27 13:14:20.78	2026-07-27 13:14:20.78	t
cms390nak001304jo0j6ffclz	PENDING	cmph7t8a1000004l9n8uic25p	cms390n9w000t04jol6dfwp3s	\N	2026-07-27 13:14:20.78	2026-07-27 13:14:20.78	t
cms390nal001404jo2a8i3952	PENDING	cmpcpt3n6000004l561lm2ja7	cms390n9w000t04jol6dfwp3s	\N	2026-07-27 13:14:20.78	2026-07-27 13:14:20.78	t
cms390nal001504jo69a5om9i	PENDING	cmpct2xp7000004jsv1ujpe1r	cms390n9w000t04jol6dfwp3s	\N	2026-07-27 13:14:20.78	2026-07-27 13:14:20.78	t
cms390nal001604jore86lhrt	PENDING	cmrozuqv4000104l5tbza8qgy	cms390n9w000t04jol6dfwp3s	\N	2026-07-27 13:14:20.78	2026-07-27 13:14:20.78	t
cms390nal001704jo9f2y1dtw	PENDING	cmpcqf47m000004l85vce0gfh	cms390n9w000t04jol6dfwp3s	\N	2026-07-27 13:14:20.78	2026-07-27 13:14:20.78	t
cms390nal001804jox8vsf2a2	PENDING	cmpcov8jd000004l8umh13pux	cms390n9w000t04jol6dfwp3s	\N	2026-07-27 13:14:20.78	2026-07-27 13:14:20.78	t
cms390nal001904jonmu8hvm9	PENDING	cmpefcd1z000004lasd2r1kdh	cms390n9w000t04jol6dfwp3s	\N	2026-07-27 13:14:20.78	2026-07-27 13:14:20.78	t
cms390nal001a04jobkav2iit	PENDING	cmpct94t9000204jsxeeckk3m	cms390n9w000t04jol6dfwp3s	\N	2026-07-27 13:14:20.78	2026-07-27 13:14:20.78	t
cms390nal001b04joe2qfnruz	PENDING	cmpcsds4s000004jmgpwku1j2	cms390n9w000t04jol6dfwp3s	\N	2026-07-27 13:14:20.78	2026-07-27 13:14:20.78	t
cms390nal001c04joc99fjih3	PENDING	cmpefcqj2000104ladlx0ysjz	cms390n9w000t04jol6dfwp3s	\N	2026-07-27 13:14:20.78	2026-07-27 13:14:20.78	t
cms390nal001d04jo975nh9pt	PENDING	cmpn1o6et000004jrcnmw0gav	cms390n9w000t04jol6dfwp3s	\N	2026-07-27 13:14:20.78	2026-07-27 13:14:20.78	t
cms390nal001e04jolt224hw8	PENDING	cmpcpimjz000004jpcdqgfhfx	cms390n9w000t04jol6dfwp3s	\N	2026-07-27 13:14:20.78	2026-07-27 13:14:20.78	t
cms390nal001f04jo9i64x5y2	PENDING	cmpcopzu6000004jro3prr7ca	cms390n9w000t04jol6dfwp3s	\N	2026-07-27 13:14:20.78	2026-07-27 13:14:20.78	t
cmrpgk0rb000j04jtpotzt3k8	CONFIRMED	cmpn1o6et000004jrcnmw0gav	cmrpgk0qh000004jttg2q1s11	2026-07-27 13:25:08.683	2026-07-17 21:36:35.542	2026-07-27 13:25:08.687	t
cms3d5vgs000504jxg6eqd7zz	PENDING	cmpefdukz000404lanevrsp34	cms3d5vfv000004jxuwwehm57	\N	2026-07-27 15:10:23.115	2026-07-27 15:10:23.115	t
cms3d5vgs000704jxkn0fh010	PENDING	cmpcsehq1000104ibueo8dlm5	cms3d5vfv000004jxuwwehm57	\N	2026-07-27 15:10:23.115	2026-07-27 15:10:23.115	t
cms3d5vgs000904jxcbkub1cq	PENDING	cmpfk8v2v000704jlp8siky9e	cms3d5vfv000004jxuwwehm57	\N	2026-07-27 15:10:23.115	2026-07-27 15:10:23.115	t
cms3d5vgs000l04jx3nlpks9t	CONFIRMED	cmpcpimjz000004jpcdqgfhfx	cms3d5vfv000004jxuwwehm57	2026-07-27 15:12:10.841	2026-07-27 15:10:23.115	2026-07-27 15:12:10.853	t
cms3d5vgs000k04jxpuzu3ugj	CONFIRMED	cmpn1o6et000004jrcnmw0gav	cms3d5vfv000004jxuwwehm57	2026-07-27 15:12:23.644	2026-07-27 15:10:23.115	2026-07-27 15:12:23.656	t
cms3d5vgs000e04jxq82ld8lr	CONFIRMED	cmpcqf47m000004l85vce0gfh	cms3d5vfv000004jxuwwehm57	2026-07-27 15:15:27.696	2026-07-27 15:10:23.115	2026-07-27 15:15:27.7	t
cms3d5vgr000104jx32aanrdc	CONFIRMED	cmpcm7sgp000004l1fp9o52ky	cms3d5vfv000004jxuwwehm57	2026-07-27 15:16:15.243	2026-07-27 15:10:23.115	2026-07-27 15:16:15.248	t
cms3d5vgs000404jxa8zjjl1r	CONFIRMED	cmpefdkyx000304la3k3nq9p9	cms3d5vfv000004jxuwwehm57	2026-07-27 15:29:37.535	2026-07-27 15:10:23.115	2026-07-27 15:29:37.546	t
cms3d5vgs000f04jxl0dl6xxe	CONFIRMED	cmpcov8jd000004l8umh13pux	cms3d5vfv000004jxuwwehm57	2026-07-27 15:31:20.659	2026-07-27 15:10:23.115	2026-07-27 15:31:20.67	t
cms3d5vgs000804jxk2qtjqi7	CONFIRMED	cmpdz3jpw000004jvdohsd2ri	cms3d5vfv000004jxuwwehm57	2026-07-27 15:33:53.702	2026-07-27 15:10:23.115	2026-07-27 15:33:53.703	t
cms3d5vgs000604jxx1rfv5pd	CONFIRMED	cmpefep0o000504laynrqmhnw	cms3d5vfv000004jxuwwehm57	2026-07-27 16:00:42.557	2026-07-27 15:10:23.115	2026-07-27 16:00:42.557	t
cms3d5vgs000304jx3bskxq56	CONFIRMED	cmpdz2mcq000104jr9xnhl4i0	cms3d5vfv000004jxuwwehm57	2026-07-27 16:05:08.071	2026-07-27 15:10:23.115	2026-07-27 16:05:08.072	t
cms3d5vgs000m04jxvx3d9t19	CONFIRMED	cmpcopzu6000004jro3prr7ca	cms3d5vfv000004jxuwwehm57	2026-07-27 16:09:18.8	2026-07-27 15:10:23.115	2026-07-27 16:09:18.811	t
cms3d5vgs000d04jxbj8rnjq2	CONFIRMED	cmrozuqv4000104l5tbza8qgy	cms3d5vfv000004jxuwwehm57	2026-07-27 16:24:44.84	2026-07-27 15:10:23.115	2026-07-27 16:24:44.859	t
cms3d5vgr000204jxzcghkoik	DECLINED	cmpcoxez0000304l8g40zcfou	cms3d5vfv000004jxuwwehm57	2026-07-27 16:51:26.536	2026-07-27 15:10:23.115	2026-07-27 16:51:26.538	t
cms3d5vgs000b04jxqdf5dnyn	CONFIRMED	cmpcpt3n6000004l561lm2ja7	cms3d5vfv000004jxuwwehm57	2026-07-27 17:53:18.375	2026-07-27 15:10:23.115	2026-07-27 17:53:18.388	t
cms3d5vgs000g04jxglwg0i88	CONFIRMED	cmpefcd1z000004lasd2r1kdh	cms3d5vfv000004jxuwwehm57	2026-07-27 19:12:06.737	2026-07-27 15:10:23.115	2026-07-27 19:12:06.755	t
cms3d5vgs000j04jx2cv0nl6t	CONFIRMED	cmpefcqj2000104ladlx0ysjz	cms3d5vfv000004jxuwwehm57	2026-07-27 20:02:09.461	2026-07-27 15:10:23.115	2026-07-27 20:02:09.461	t
cms3d5vgs000h04jxhwyqjzlj	CONFIRMED	cmpct94t9000204jsxeeckk3m	cms3d5vfv000004jxuwwehm57	2026-07-27 20:40:41.207	2026-07-27 15:10:23.115	2026-07-27 20:40:41.216	t
cms3d5vgs000c04jxmpt5wuz0	CONFIRMED	cmpct2xp7000004jsv1ujpe1r	cms3d5vfv000004jxuwwehm57	2026-07-27 23:09:46.888	2026-07-27 15:10:23.115	2026-07-27 23:09:46.942	t
cms3d5vgs000a04jxvlol6s6w	CONFIRMED	cmph7t8a1000004l9n8uic25p	cms3d5vfv000004jxuwwehm57	2026-07-29 10:44:29.841	2026-07-27 15:10:23.115	2026-07-29 10:44:29.863	t
cms3d5vgs000i04jxhrwpynwn	DECLINED	cmpcsds4s000004jmgpwku1j2	cms3d5vfv000004jxuwwehm57	2026-07-29 22:01:16.473	2026-07-27 15:10:23.115	2026-07-29 22:01:16.475	t
cmrpgk0ra000804jtgep8lh4q	CONFIRMED	cmpcpimjz000004jpcdqgfhfx	cmrpgk0qh000004jttg2q1s11	2026-07-30 02:47:16.864	2026-07-17 21:36:35.542	2026-07-30 02:47:16.899	t
cmrpgk0ra000a04jtct2jv0gh	CONFIRMED	cmpefdkyx000304la3k3nq9p9	cmrpgk0qh000004jttg2q1s11	2026-07-30 11:10:27.449	2026-07-17 21:36:35.542	2026-07-30 11:10:27.458	t
cmrpgk0rb000f04jttvl18skc	DECLINED	cmph7t8a1000004l9n8uic25p	cmrpgk0qh000004jttg2q1s11	2026-07-30 16:05:12.967	2026-07-17 21:36:35.542	2026-07-30 16:05:12.985	t
cmsadtjrr000404jovjlq3goq	PENDING	cmpefdkyx000304la3k3nq9p9	cmsadtjr8000004joiy5e4pc7	\N	2026-08-01 13:03:10.935	2026-08-01 13:03:10.935	t
cmsadtjrr000504jokwevx1ie	PENDING	cmpefdukz000404lanevrsp34	cmsadtjr8000004joiy5e4pc7	\N	2026-08-01 13:03:10.935	2026-08-01 13:03:10.935	t
cmsadtjrs000d04jow9zdpk4r	PENDING	cmrozuqv4000104l5tbza8qgy	cmsadtjr8000004joiy5e4pc7	\N	2026-08-01 13:03:10.935	2026-08-01 13:03:10.935	t
cmsadtjrs000m04joxs20uz5y	CONFIRMED	cmpcopzu6000004jro3prr7ca	cmsadtjr8000004joiy5e4pc7	2026-08-01 18:42:03.767	2026-08-01 13:03:10.935	2026-08-01 18:42:03.786	t
cmsadtjrs000j04jop1l0imol	CONFIRMED	cmpefcqj2000104ladlx0ysjz	cmsadtjr8000004joiy5e4pc7	2026-08-01 18:56:27.505	2026-08-01 13:03:10.935	2026-08-01 18:56:27.507	t
cmsadtjrs000b04joysy2euty	CONFIRMED	cmpcpt3n6000004l561lm2ja7	cmsadtjr8000004joiy5e4pc7	2026-08-02 20:31:07.385	2026-08-01 13:03:10.935	2026-08-02 20:31:07.386	t
cmsadtjrs000g04jocuc8mdrx	CONFIRMED	cmpefcd1z000004lasd2r1kdh	cmsadtjr8000004joiy5e4pc7	2026-08-01 23:55:26.545	2026-08-01 13:03:10.935	2026-08-01 23:55:26.555	t
cmsadtjrs000c04jo7pkl3cyi	CONFIRMED	cmpct2xp7000004jsv1ujpe1r	cmsadtjr8000004joiy5e4pc7	2026-08-02 12:18:55.124	2026-08-01 13:03:10.935	2026-08-02 12:18:55.14	t
cmsadtjrs000804jochdsdsz6	CONFIRMED	cmpdz3jpw000004jvdohsd2ri	cmsadtjr8000004joiy5e4pc7	2026-08-02 12:45:23.683	2026-08-01 13:03:10.935	2026-08-02 12:45:23.696	t
cmsadtjrs000h04jowd1m9vy7	CONFIRMED	cmpct94t9000204jsxeeckk3m	cmsadtjr8000004joiy5e4pc7	2026-08-02 12:46:23.717	2026-08-01 13:03:10.935	2026-08-02 12:46:23.718	t
cmsadtjrs000f04jofyry8huq	DECLINED	cmpcov8jd000004l8umh13pux	cmsadtjr8000004joiy5e4pc7	2026-08-02 13:40:27.615	2026-08-01 13:03:10.935	2026-08-02 13:40:27.633	t
cmsadtjrs000a04jo1mrrpgut	DECLINED	cmph7t8a1000004l9n8uic25p	cmsadtjr8000004joiy5e4pc7	2026-08-02 13:42:35.71	2026-08-01 13:03:10.935	2026-08-02 13:42:35.725	t
cmsadtjrs000e04jo9rkh0035	DECLINED	cmpcqf47m000004l85vce0gfh	cmsadtjr8000004joiy5e4pc7	2026-08-02 14:13:54.296	2026-08-01 13:03:10.935	2026-08-02 14:13:54.305	t
cmsadtjrs000604joyxxfz6au	CONFIRMED	cmpefep0o000504laynrqmhnw	cmsadtjr8000004joiy5e4pc7	2026-08-02 15:47:18.968	2026-08-01 13:03:10.935	2026-08-02 15:47:18.984	t
cmsadtjrr000304joufh2j7uv	DECLINED	cmpdz2mcq000104jr9xnhl4i0	cmsadtjr8000004joiy5e4pc7	2026-08-02 16:12:43.992	2026-08-01 13:03:10.935	2026-08-02 16:12:44	t
cmsadtjrr000204jo6izl62pu	DECLINED	cmpcoxez0000304l8g40zcfou	cmsadtjr8000004joiy5e4pc7	2026-08-02 19:05:54.537	2026-08-01 13:03:10.935	2026-08-02 19:05:54.548	t
cmsadtjrs000l04joyfx7oz34	CONFIRMED	cmpcpimjz000004jpcdqgfhfx	cmsadtjr8000004joiy5e4pc7	2026-08-02 20:31:59.094	2026-08-01 13:03:10.935	2026-08-02 20:31:59.094	t
cmsadtjrs000704jol7z02kl5	CONFIRMED	cmpcsehq1000104ibueo8dlm5	cmsadtjr8000004joiy5e4pc7	2026-08-02 20:31:25.857	2026-08-01 13:03:10.935	2026-08-02 20:31:25.857	t
cmsadtjrr000104jonl3w9dbh	CONFIRMED	cmpcm7sgp000004l1fp9o52ky	cmsadtjr8000004joiy5e4pc7	2026-08-02 20:36:57.128	2026-08-01 13:03:10.935	2026-08-02 20:36:57.139	t
cmsadtjrs000904jo366b8kw4	CONFIRMED	cmpfk8v2v000704jlp8siky9e	cmsadtjr8000004joiy5e4pc7	2026-08-02 20:43:56.656	2026-08-01 13:03:10.935	2026-08-02 20:43:56.675	t
cmsadtjrs000k04joiy69p4b9	CONFIRMED	cmpn1o6et000004jrcnmw0gav	cmsadtjr8000004joiy5e4pc7	2026-08-02 20:47:33.249	2026-08-01 13:03:10.935	2026-08-02 20:47:33.264	t
cmsadtjrs000i04jowizbigwf	CONFIRMED	cmpcsds4s000004jmgpwku1j2	cmsadtjr8000004joiy5e4pc7	2026-08-02 18:36:08.392	2026-08-01 13:03:10.935	2026-08-02 18:36:08.402	t
cmskhxpco000504jqqegn8qyw	CONFIRMED	cmpn1o6et000004jrcnmw0gav	cmskhxpbb000004jq77wb6pqt	2026-08-25 13:22:52	2026-08-08 14:56:05.016	2026-08-25 13:22:52.016	t
cmskhxpco000104jq53oks16o	CONFIRMED	cmpefcqj2000104ladlx0ysjz	cmskhxpbb000004jq77wb6pqt	2026-08-25 20:57:24.17	2026-08-08 14:56:05.016	2026-08-25 20:57:24.181	t
cmsd9fo3d000504l809acrvrg	PENDING	cmpefdukz000404lanevrsp34	cmsd9fo2a000004l80caeqs67	\N	2026-08-03 13:23:43.417	2026-08-03 13:23:43.417	t
cmsd9fo3d000b04l8e0wnv6cd	PENDING	cmph7t8a1000004l9n8uic25p	cmsd9fo2a000004l80caeqs67	\N	2026-08-03 13:23:43.417	2026-08-03 13:23:43.417	t
cmsd9fo3d000i04l8ua6pa18p	PENDING	cmpct94t9000204jsxeeckk3m	cmsd9fo2a000004l80caeqs67	\N	2026-08-03 13:23:43.417	2026-08-03 13:23:43.417	t
cmpg3u3ld000o04las9ge6dd8	CONFIRMED	cmpcoxez0000304l8g40zcfou	cmpg3u3kh000l04la6hj2e5r3	2026-08-03 14:29:15.776	2026-05-21 23:11:10.513	2026-08-03 14:29:15.783	t
cmpg3u3ld000p04la0qn3qlfd	CONFIRMED	cmpcpt3n6000004l561lm2ja7	cmpg3u3kh000l04la6hj2e5r3	2026-08-03 14:56:16.111	2026-05-21 23:11:10.513	2026-08-03 14:56:16.118	t
cmselxq94000104ic24d7vxj2	PENDING	cmsd6v73x000004jupd8tbvon	cmrqib170000004l7swe10dxz	\N	2026-08-04 12:01:27.592	2026-08-04 12:01:27.592	t
cmselxq94000004icny6d3mzd	CONFIRMED	cmsd6v73x000004jupd8tbvon	cmpg3u3kh000l04la6hj2e5r3	2026-08-04 14:34:26.698	2026-08-04 12:01:27.592	2026-08-04 14:34:26.706	t
cmshn1bu5000104l8e16zjlac	PENDING	cmpefcqj2000104ladlx0ysjz	cmshn1bt0000004l8uazwx0nq	\N	2026-08-06 14:55:33.677	2026-08-06 14:55:33.677	t
cmshn1bu5000204l8pskf8b6n	PENDING	cmpefdukz000404lanevrsp34	cmshn1bt0000004l8uazwx0nq	\N	2026-08-06 14:55:33.677	2026-08-06 14:55:33.677	t
cmshn1bu5000304l8yx5mo7jw	PENDING	cmrozuqv4000104l5tbza8qgy	cmshn1bt0000004l8uazwx0nq	\N	2026-08-06 14:55:33.677	2026-08-06 14:55:33.677	t
cmshn1bu5000404l81e55gc6a	PENDING	cmpfk8v2v000704jlp8siky9e	cmshn1bt0000004l8uazwx0nq	\N	2026-08-06 14:55:33.677	2026-08-06 14:55:33.677	t
cmshn1bu5000504l8izri2ict	PENDING	cmpn1o6et000004jrcnmw0gav	cmshn1bt0000004l8uazwx0nq	\N	2026-08-06 14:55:33.677	2026-08-06 14:55:33.677	t
cmshn1bu5000604l8idzq862o	PENDING	cmph7t8a1000004l9n8uic25p	cmshn1bt0000004l8uazwx0nq	\N	2026-08-06 14:55:33.677	2026-08-06 14:55:33.677	t
cmshn1bu5000704l82h0qmdiu	PENDING	cmpcoxez0000304l8g40zcfou	cmshn1bt0000004l8uazwx0nq	\N	2026-08-06 14:55:33.677	2026-08-06 14:55:33.677	t
cmshn1bu5000804l81q8v5ree	PENDING	cmpefdkyx000304la3k3nq9p9	cmshn1bt0000004l8uazwx0nq	\N	2026-08-06 14:55:33.677	2026-08-06 14:55:33.677	t
cmshn1bu5000904l8xnzhkdya	PENDING	cmpcpimjz000004jpcdqgfhfx	cmshn1bt0000004l8uazwx0nq	\N	2026-08-06 14:55:33.677	2026-08-06 14:55:33.677	t
cmshn1bu5000a04l8odh9pw4b	PENDING	cmpct2xp7000004jsv1ujpe1r	cmshn1bt0000004l8uazwx0nq	\N	2026-08-06 14:55:33.677	2026-08-06 14:55:33.677	t
cmshn1bu5000b04l8qlie6t7e	PENDING	cmpcsehq1000104ibueo8dlm5	cmshn1bt0000004l8uazwx0nq	\N	2026-08-06 14:55:33.677	2026-08-06 14:55:33.677	t
cmshn1bu5000c04l8gbntwdrp	PENDING	cmpcov8jd000004l8umh13pux	cmshn1bt0000004l8uazwx0nq	\N	2026-08-06 14:55:33.677	2026-08-06 14:55:33.677	t
cmshn1bu5000d04l85m3sof1m	PENDING	cmsd6v73x000004jupd8tbvon	cmshn1bt0000004l8uazwx0nq	\N	2026-08-06 14:55:33.677	2026-08-06 14:55:33.677	t
cmshn1bu5000e04l8d52xohhj	PENDING	cmpcpt3n6000004l561lm2ja7	cmshn1bt0000004l8uazwx0nq	\N	2026-08-06 14:55:33.677	2026-08-06 14:55:33.677	t
cmshn1bu5000f04l80e7ijfc4	PENDING	cmpcsds4s000004jmgpwku1j2	cmshn1bt0000004l8uazwx0nq	\N	2026-08-06 14:55:33.677	2026-08-06 14:55:33.677	t
cmshn1bu5000g04l8boq8wskw	PENDING	cmpcqf47m000004l85vce0gfh	cmshn1bt0000004l8uazwx0nq	\N	2026-08-06 14:55:33.677	2026-08-06 14:55:33.677	t
cmshn1bu5000h04l8m737d20v	PENDING	cmpcm7sgp000004l1fp9o52ky	cmshn1bt0000004l8uazwx0nq	\N	2026-08-06 14:55:33.677	2026-08-06 14:55:33.677	t
cmshn1bu5000i04l8uw62inx8	PENDING	cmpcopzu6000004jro3prr7ca	cmshn1bt0000004l8uazwx0nq	\N	2026-08-06 14:55:33.677	2026-08-06 14:55:33.677	t
cmshn1bu5000j04l84cr8gfej	PENDING	cmpdz3jpw000004jvdohsd2ri	cmshn1bt0000004l8uazwx0nq	\N	2026-08-06 14:55:33.677	2026-08-06 14:55:33.677	t
cmshn1bu5000k04l883hbubpi	PENDING	cmpefep0o000504laynrqmhnw	cmshn1bt0000004l8uazwx0nq	\N	2026-08-06 14:55:33.677	2026-08-06 14:55:33.677	t
cmshn1bu5000l04l8ja9s1crk	PENDING	cmpefcd1z000004lasd2r1kdh	cmshn1bt0000004l8uazwx0nq	\N	2026-08-06 14:55:33.677	2026-08-06 14:55:33.677	t
cmshn1bu5000m04l8vxupn0ef	PENDING	cmpdz2mcq000104jr9xnhl4i0	cmshn1bt0000004l8uazwx0nq	\N	2026-08-06 14:55:33.677	2026-08-06 14:55:33.677	t
cmshn1bu5000n04l8eua56hne	PENDING	cmpct94t9000204jsxeeckk3m	cmshn1bt0000004l8uazwx0nq	\N	2026-08-06 14:55:33.677	2026-08-06 14:55:33.677	t
cmskhxpco000204jqy714gfll	PENDING	cmpefdukz000404lanevrsp34	cmskhxpbb000004jq77wb6pqt	\N	2026-08-08 14:56:05.016	2026-08-08 14:56:05.016	t
cmskhxpco000304jqcf1slitq	PENDING	cmrozuqv4000104l5tbza8qgy	cmskhxpbb000004jq77wb6pqt	\N	2026-08-08 14:56:05.016	2026-08-08 14:56:05.016	t
cmsd9fo3d000204l8lud44cx7	CONFIRMED	cmpcoxez0000304l8g40zcfou	cmsd9fo2a000004l80caeqs67	2026-08-10 17:09:57.931	2026-08-03 13:23:43.417	2026-08-10 17:09:57.951	t
cmsd9fo3d000404l8pnz8opce	CONFIRMED	cmpefdkyx000304la3k3nq9p9	cmsd9fo2a000004l80caeqs67	2026-08-14 02:22:16.043	2026-08-03 13:23:43.417	2026-08-14 02:22:16.051	t
cmsd9fo3d000m04l8xxda22kq	CONFIRMED	cmpcpimjz000004jpcdqgfhfx	cmsd9fo2a000004l80caeqs67	2026-08-14 16:37:01.565	2026-08-03 13:23:43.417	2026-08-14 16:37:01.581	t
cmsd9fo3d000n04l8t6nz74z9	CONFIRMED	cmpcopzu6000004jro3prr7ca	cmsd9fo2a000004l80caeqs67	2026-08-14 16:31:14.318	2026-08-03 13:23:43.417	2026-08-14 16:31:14.319	t
cmsd9fo3d000j04l8c3y5n8vs	CONFIRMED	cmpcsds4s000004jmgpwku1j2	cmsd9fo2a000004l80caeqs67	2026-08-14 21:27:34.185	2026-08-03 13:23:43.417	2026-08-14 21:27:34.2	t
cmsd9fo3d000a04l8ipzdg660	CONFIRMED	cmsd6v73x000004jupd8tbvon	cmsd9fo2a000004l80caeqs67	2026-08-15 11:43:03.301	2026-08-03 13:23:43.417	2026-08-15 11:43:03.312	t
cmsd9fo3d000c04l87y4t4mw3	CONFIRMED	cmpcpt3n6000004l561lm2ja7	cmsd9fo2a000004l80caeqs67	2026-08-15 12:16:37.338	2026-08-03 13:23:43.417	2026-08-15 12:16:37.347	t
cmsd9fo3d000604l8352ora1b	CONFIRMED	cmpefep0o000504laynrqmhnw	cmsd9fo2a000004l80caeqs67	2026-08-15 12:42:15.113	2026-08-03 13:23:43.417	2026-08-15 12:42:15.126	t
cmsd9fo3d000h04l83acnqzgb	CONFIRMED	cmpefcd1z000004lasd2r1kdh	cmsd9fo2a000004l80caeqs67	2026-08-15 12:47:23.089	2026-08-03 13:23:43.417	2026-08-15 12:47:23.102	t
cmsd9fo3d000g04l8n7ptvmvt	CONFIRMED	cmpcov8jd000004l8umh13pux	cmsd9fo2a000004l80caeqs67	2026-08-15 13:20:51.718	2026-08-03 13:23:43.417	2026-08-15 13:20:51.734	t
cmsd9fo3d000d04l8iv40mvsp	CONFIRMED	cmpct2xp7000004jsv1ujpe1r	cmsd9fo2a000004l80caeqs67	2026-08-15 14:31:18.19	2026-08-03 13:23:43.417	2026-08-15 14:31:18.201	t
cmsd9fo3d000l04l84gevusb5	CONFIRMED	cmpn1o6et000004jrcnmw0gav	cmsd9fo2a000004l80caeqs67	2026-08-15 16:06:13.924	2026-08-03 13:23:43.417	2026-08-15 16:06:13.936	t
cmsd9fo3d000304l8q679s9g0	CONFIRMED	cmpdz2mcq000104jr9xnhl4i0	cmsd9fo2a000004l80caeqs67	2026-08-15 16:13:39.401	2026-08-03 13:23:43.417	2026-08-15 16:13:39.402	t
cmsd9fo3d000k04l8mpo5helc	CONFIRMED	cmpefcqj2000104ladlx0ysjz	cmsd9fo2a000004l80caeqs67	2026-08-15 16:40:07.085	2026-08-03 13:23:43.417	2026-08-15 16:40:07.094	t
cmsd9fo3d000704l8bb9l4813	DECLINED	cmpcsehq1000104ibueo8dlm5	cmsd9fo2a000004l80caeqs67	2026-08-15 21:42:24.242	2026-08-03 13:23:43.417	2026-08-15 21:42:24.265	t
cmsd9fo3d000e04l8gas2bfbu	CONFIRMED	cmrozuqv4000104l5tbza8qgy	cmsd9fo2a000004l80caeqs67	2026-08-16 00:05:37.384	2026-08-03 13:23:43.417	2026-08-16 00:05:37.401	t
cmsd9fo3d000904l8jzdjvgqz	DECLINED	cmpdz3jpw000004jvdohsd2ri	cmsd9fo2a000004l80caeqs67	2026-08-16 09:12:19.057	2026-08-03 13:23:43.417	2026-08-16 09:12:19.068	t
cmsd9fo3d000f04l89jmzpzsu	DECLINED	cmpcqf47m000004l85vce0gfh	cmsd9fo2a000004l80caeqs67	2026-08-16 14:21:02.566	2026-08-03 13:23:43.417	2026-08-16 14:21:02.589	t
cmsd9fo3d000804l8hq2obfzw	DECLINED	cmpfk8v2v000704jlp8siky9e	cmsd9fo2a000004l80caeqs67	2026-08-16 18:38:59.821	2026-08-03 13:23:43.417	2026-08-16 18:38:59.83	t
cmskhxpco000604jqs616g6f3	PENDING	cmph7t8a1000004l9n8uic25p	cmskhxpbb000004jq77wb6pqt	\N	2026-08-08 14:56:05.016	2026-08-08 14:56:05.016	t
cmpg3u3ld000r04lad6q4fb0r	CONFIRMED	cmpcsds4s000004jmgpwku1j2	cmpg3u3kh000l04la6hj2e5r3	2026-08-08 19:10:51.856	2026-05-21 23:11:10.513	2026-08-08 19:10:51.858	t
cmskhxpco000l04jqvkllvjgu	CONFIRMED	cmpefcd1z000004lasd2r1kdh	cmskhxpbb000004jq77wb6pqt	2026-08-25 13:25:39.214	2026-08-08 14:56:05.016	2026-08-25 13:25:39.249	t
cmsnjw3dz000204l7n9ge0h8z	PENDING	cmpefdukz000404lanevrsp34	cmsnjw3d4000004l73omej79w	\N	2026-08-10 18:14:07.655	2026-08-10 18:14:07.655	t
cmsnjw3dz000304l76ffldved	PENDING	cmrozuqv4000104l5tbza8qgy	cmsnjw3d4000004l73omej79w	\N	2026-08-10 18:14:07.655	2026-08-10 18:14:07.655	t
cmskhxpco000904jqj4fipwk0	CONFIRMED	cmpcpimjz000004jpcdqgfhfx	cmskhxpbb000004jq77wb6pqt	2026-08-25 13:32:38.415	2026-08-08 14:56:05.016	2026-08-25 13:32:38.415	t
cmskhxpco000i04jqmw0ui3gj	CONFIRMED	cmpcopzu6000004jro3prr7ca	cmskhxpbb000004jq77wb6pqt	2026-08-25 13:35:57.055	2026-08-08 14:56:05.016	2026-08-25 13:35:57.063	t
cmskhxpco000d04jqh56l40sa	CONFIRMED	cmsd6v73x000004jupd8tbvon	cmskhxpbb000004jq77wb6pqt	2026-08-25 14:15:53.931	2026-08-08 14:56:05.016	2026-08-25 14:15:53.953	t
cmsnjw3dz000704l72fgkswjo	PENDING	cmph7t8a1000004l9n8uic25p	cmsnjw3d4000004l73omej79w	\N	2026-08-10 18:14:07.655	2026-08-10 18:14:07.655	t
cmskhxpco000f04jqaufeqlbf	CONFIRMED	cmpcsds4s000004jmgpwku1j2	cmskhxpbb000004jq77wb6pqt	2026-08-25 16:25:09.187	2026-08-08 14:56:05.016	2026-08-25 16:25:09.207	t
cmskhxpco000j04jqcjkxcr7b	CONFIRMED	cmpdz3jpw000004jvdohsd2ri	cmskhxpbb000004jq77wb6pqt	2026-08-25 19:55:51.786	2026-08-08 14:56:05.016	2026-08-25 19:55:51.809	t
cmskhxpco000804jq9ukv42us	CONFIRMED	cmpefdkyx000304la3k3nq9p9	cmskhxpbb000004jq77wb6pqt	2026-08-25 19:56:03.995	2026-08-08 14:56:05.016	2026-08-25 19:56:04.01	t
cmskhxpco000h04jq563suie9	DECLINED	cmpcm7sgp000004l1fp9o52ky	cmskhxpbb000004jq77wb6pqt	2026-08-25 20:07:54.102	2026-08-08 14:56:05.016	2026-08-25 20:07:54.113	t
cmskhxpco000g04jqnb8hqhj5	CONFIRMED	cmpcqf47m000004l85vce0gfh	cmskhxpbb000004jq77wb6pqt	2026-08-25 20:14:50.725	2026-08-08 14:56:05.016	2026-08-25 20:14:50.757	t
cmst6197i000604jvy85i026h	CONFIRMED	cmst61960000104jvfkkcgzp4	cmskhxpbb000004jq77wb6pqt	2026-08-26 00:29:48.655	2026-08-14 16:32:50.91	2026-08-26 00:29:48.665	t
cmskhxpco000c04jqbqkwbu1a	CONFIRMED	cmpcov8jd000004l8umh13pux	cmskhxpbb000004jq77wb6pqt	2026-08-26 00:33:20.319	2026-08-08 14:56:05.016	2026-08-26 00:33:20.396	t
cmskhxpco000n04jqn3chisz1	DECLINED	cmpct94t9000204jsxeeckk3m	cmskhxpbb000004jq77wb6pqt	2026-08-26 00:34:57.087	2026-08-08 14:56:05.016	2026-08-26 00:34:57.088	t
cmskhxpco000k04jqw697n0rg	CONFIRMED	cmpefep0o000504laynrqmhnw	cmskhxpbb000004jq77wb6pqt	2026-08-26 01:15:03.204	2026-08-08 14:56:05.016	2026-08-26 01:15:03.227	t
cmskhxpco000b04jq77txmmva	DECLINED	cmpcsehq1000104ibueo8dlm5	cmskhxpbb000004jq77wb6pqt	2026-08-26 02:01:46.91	2026-08-08 14:56:05.016	2026-08-26 02:01:46.922	t
cmskhxpco000e04jqpw2z7wre	CONFIRMED	cmpcpt3n6000004l561lm2ja7	cmskhxpbb000004jq77wb6pqt	2026-08-26 17:52:39.717	2026-08-08 14:56:05.016	2026-08-26 17:52:39.727	t
cmsnjw3dz000m04l7t4ptfr6j	PENDING	cmpdz2mcq000104jr9xnhl4i0	cmsnjw3d4000004l73omej79w	\N	2026-08-10 18:14:07.655	2026-08-10 18:14:07.655	t
cmskhxpco000m04jq36ssf4z4	CONFIRMED	cmpdz2mcq000104jr9xnhl4i0	cmskhxpbb000004jq77wb6pqt	2026-08-26 20:19:35.259	2026-08-08 14:56:05.016	2026-08-26 20:19:35.27	t
cmsnjw3dz000804l7kylxq2f1	CONFIRMED	cmpcoxez0000304l8g40zcfou	cmsnjw3d4000004l73omej79w	2026-08-10 18:15:04.56	2026-08-10 18:14:07.655	2026-08-10 18:15:04.571	t
cmsnjw3dz000904l74yabewpu	CONFIRMED	cmpefdkyx000304la3k3nq9p9	cmsnjw3d4000004l73omej79w	2026-08-10 18:15:56.006	2026-08-10 18:14:07.655	2026-08-10 18:15:56.011	t
cmsnjw3dz000g04l7wg3m9qsy	CONFIRMED	cmpcqf47m000004l85vce0gfh	cmsnjw3d4000004l73omej79w	2026-08-10 18:18:03.966	2026-08-10 18:14:07.655	2026-08-10 18:18:03.966	t
cmsnjw3dz000i04l7pkr8c0u8	CONFIRMED	cmpcopzu6000004jro3prr7ca	cmsnjw3d4000004l73omej79w	2026-08-10 18:21:38.755	2026-08-10 18:14:07.655	2026-08-10 18:21:38.756	t
cmsnjw3dz000j04l775j67n8u	CONFIRMED	cmpdz3jpw000004jvdohsd2ri	cmsnjw3d4000004l73omej79w	2026-08-10 18:33:47.772	2026-08-10 18:14:07.655	2026-08-10 18:33:47.772	t
cmsnjw3dz000k04l788362gbr	CONFIRMED	cmpefep0o000504laynrqmhnw	cmsnjw3d4000004l73omej79w	2026-08-10 19:04:29.205	2026-08-10 18:14:07.655	2026-08-10 19:04:29.223	t
cmskhxpco000a04jqapeowbed	CONFIRMED	cmpct2xp7000004jsv1ujpe1r	cmskhxpbb000004jq77wb6pqt	2026-08-26 20:36:08.635	2026-08-08 14:56:05.016	2026-08-26 20:36:08.651	t
cmsnjw3dz000a04l727e2x46i	CONFIRMED	cmpcpimjz000004jpcdqgfhfx	cmsnjw3d4000004l73omej79w	2026-08-10 19:54:28.932	2026-08-10 18:14:07.655	2026-08-10 19:54:28.932	t
cmsnjw3dz000c04l7hfdzh0ah	CONFIRMED	cmpcsehq1000104ibueo8dlm5	cmsnjw3d4000004l73omej79w	2026-08-10 20:19:17.803	2026-08-10 18:14:07.655	2026-08-10 20:19:17.815	t
cmsnjw3dz000d04l7xd2tg6th	CONFIRMED	cmpcov8jd000004l8umh13pux	cmsnjw3d4000004l73omej79w	2026-08-10 20:32:33.011	2026-08-10 18:14:07.655	2026-08-10 20:32:33.013	t
cmsnjw3dz000504l76ouiwfh2	CONFIRMED	cmpn1o6et000004jrcnmw0gav	cmsnjw3d4000004l73omej79w	2026-08-11 00:01:49.628	2026-08-10 18:14:07.655	2026-08-11 00:01:49.635	t
cmsnjw3dz000e04l7amci5hgf	CONFIRMED	cmsd6v73x000004jupd8tbvon	cmsnjw3d4000004l73omej79w	2026-08-11 11:07:58.075	2026-08-10 18:14:07.655	2026-08-11 11:07:58.09	t
cmsnjw3dz000n04l7w484zp7e	DECLINED	cmpct94t9000204jsxeeckk3m	cmsnjw3d4000004l73omej79w	2026-08-11 12:44:32.402	2026-08-10 18:14:07.655	2026-08-11 12:44:32.411	t
cmsnjw3dz000f04l70n8pe53w	CONFIRMED	cmpcpt3n6000004l561lm2ja7	cmsnjw3d4000004l73omej79w	2026-08-12 01:57:56.717	2026-08-10 18:14:07.655	2026-08-12 01:57:56.731	t
cmsnjw3dy000104l7uw98933i	CONFIRMED	cmpefcqj2000104ladlx0ysjz	cmsnjw3d4000004l73omej79w	2026-08-12 10:06:46.953	2026-08-10 18:14:07.655	2026-08-12 10:06:46.962	t
cmsnjw3dz000404l7waic5kjc	CONFIRMED	cmpfk8v2v000704jlp8siky9e	cmsnjw3d4000004l73omej79w	2026-08-12 10:06:54.282	2026-08-10 18:14:07.655	2026-08-12 10:06:54.292	t
cmsnjw3dz000h04l72q6ahvfp	CONFIRMED	cmpcm7sgp000004l1fp9o52ky	cmsnjw3d4000004l73omej79w	2026-08-12 11:00:07.546	2026-08-10 18:14:07.655	2026-08-12 11:00:07.556	t
cmsnjw3dz000l04l7jr8p8u95	CONFIRMED	cmpefcd1z000004lasd2r1kdh	cmsnjw3d4000004l73omej79w	2026-08-12 13:23:21.065	2026-08-10 18:14:07.655	2026-08-12 13:23:21.076	t
cmsnjw3dz000b04l7co3uvah7	CONFIRMED	cmpcsds4s000004jmgpwku1j2	cmsnjw3d4000004l73omej79w	2026-08-12 17:34:25.516	2026-08-10 18:14:07.655	2026-08-12 17:34:25.534	t
cmsnjw3dz000604l758p2c3a2	DECLINED	cmpct2xp7000004jsv1ujpe1r	cmsnjw3d4000004l73omej79w	2026-08-13 21:46:07.414	2026-08-10 18:14:07.655	2026-08-13 21:46:07.423	t
cmst6197i000304jvlinqm6n3	PENDING	cmst61960000104jvfkkcgzp4	cmrqib170000004l7swe10dxz	\N	2026-08-14 16:32:50.91	2026-08-14 16:32:50.91	t
cmst6197i000504jvro3rhnbn	PENDING	cmst61960000104jvfkkcgzp4	cmshn1bt0000004l8uazwx0nq	\N	2026-08-14 16:32:50.91	2026-08-14 16:32:50.91	t
cmst6197i000404jvkosjq7o9	CONFIRMED	cmst61960000104jvfkkcgzp4	cmsd9fo2a000004l80caeqs67	2026-08-15 12:17:20.195	2026-08-14 16:32:50.91	2026-08-15 12:17:20.196	t
cmsd9fo3d000104l8dzivyjt3	CONFIRMED	cmpcm7sgp000004l1fp9o52ky	cmsd9fo2a000004l80caeqs67	2026-08-15 14:12:00.582	2026-08-03 13:23:43.417	2026-08-15 14:12:00.588	t
cmsx2wpq8000304ldc4pn5w50	PENDING	cmrozuqv4000104l5tbza8qgy	cmsx2wppc000004ldfwf8elsy	\N	2026-08-17 10:16:24.896	2026-08-17 10:16:24.896	f
cmsx2wpq8000504ldlqiogxh7	PENDING	cmpn1o6et000004jrcnmw0gav	cmsx2wppc000004ldfwf8elsy	\N	2026-08-17 10:16:24.896	2026-08-17 10:16:24.896	f
cmsx2wpq8000604ldli3n8jw8	PENDING	cmpct2xp7000004jsv1ujpe1r	cmsx2wppc000004ldfwf8elsy	\N	2026-08-17 10:16:24.896	2026-08-17 10:16:24.896	f
cmsx2wpq8000704ld7et7gllz	PENDING	cmpcoxez0000304l8g40zcfou	cmsx2wppc000004ldfwf8elsy	\N	2026-08-17 10:16:24.896	2026-08-17 10:16:24.896	f
cmsx2wpq8000204ldbp6v39pj	PENDING	cmpefdukz000404lanevrsp34	cmsx2wppc000004ldfwf8elsy	\N	2026-08-17 10:16:24.896	2026-08-20 11:15:06.071	f
cmsx2wpq8000404ld3yg84ap2	CONFIRMED	cmpfk8v2v000704jlp8siky9e	cmsx2wppc000004ldfwf8elsy	2026-08-20 11:15:02.826	2026-08-17 10:16:24.896	2026-08-20 11:15:02.826	t
cmsx2wpq8000804ld0qbe1cce	CONFIRMED	cmpefdkyx000304la3k3nq9p9	cmsx2wppc000004ldfwf8elsy	2026-08-20 11:15:00.643	2026-08-17 10:16:24.896	2026-08-20 11:15:00.643	t
cmt0aw2fe000504jylavpo2bl	CONFIRMED	cmpn1o6et000004jrcnmw0gav	cmt0aw2dv000004jyn5mtmejp	2026-08-20 13:44:36.173	2026-08-19 16:23:10.153	2026-08-20 13:44:36.184	t
cmsx2wpq8000b04ld2qq5j1cp	PENDING	cmpcsehq1000104ibueo8dlm5	cmsx2wppc000004ldfwf8elsy	\N	2026-08-17 10:16:24.896	2026-08-17 10:16:24.896	f
cmt0aw2fe000d04jyhuv0q20u	CONFIRMED	cmsd6v73x000004jupd8tbvon	cmt0aw2dv000004jyn5mtmejp	2026-08-20 21:19:08.842	2026-08-19 16:23:10.153	2026-08-20 21:19:08.842	t
cmsx2wpq8000d04ld5c118ir9	PENDING	cmsd6v73x000004jupd8tbvon	cmsx2wppc000004ldfwf8elsy	\N	2026-08-17 10:16:24.896	2026-08-17 10:16:24.896	f
cmsx2wpq8000e04ldvf878eg1	PENDING	cmpcpt3n6000004l561lm2ja7	cmsx2wppc000004ldfwf8elsy	\N	2026-08-17 10:16:24.896	2026-08-17 10:16:24.896	f
cmsx2wpq8000f04ld98vor8fs	PENDING	cmst61960000104jvfkkcgzp4	cmsx2wppc000004ldfwf8elsy	\N	2026-08-17 10:16:24.896	2026-08-17 10:16:24.896	f
cmt0aw2fe000604jyd6jtq5ea	CONFIRMED	cmpct2xp7000004jsv1ujpe1r	cmt0aw2dv000004jyn5mtmejp	2026-08-21 11:35:10.156	2026-08-19 16:23:10.153	2026-08-21 11:35:10.167	t
cmt0aw2fe000h04jychvzryhs	CONFIRMED	cmpcm7sgp000004l1fp9o52ky	cmt0aw2dv000004jyn5mtmejp	2026-08-21 11:52:36.406	2026-08-19 16:23:10.153	2026-08-21 11:52:36.416	t
cmsx2wpqf000i04ldzjbypoxs	PENDING	cmpcopzu6000004jro3prr7ca	cmsx2wppc000004ldfwf8elsy	\N	2026-08-17 10:16:24.896	2026-08-17 10:16:24.896	f
cmsx2wpqf000j04ldrpv36gkq	PENDING	cmpdz3jpw000004jvdohsd2ri	cmsx2wppc000004ldfwf8elsy	\N	2026-08-17 10:16:24.896	2026-08-17 10:16:24.896	f
cmsx2wpqf000k04ldwfk9dwo6	PENDING	cmpefep0o000504laynrqmhnw	cmsx2wppc000004ldfwf8elsy	\N	2026-08-17 10:16:24.896	2026-08-17 10:16:24.896	f
cmt0aw2fe000m04jyl3steukb	CONFIRMED	cmpdz2mcq000104jr9xnhl4i0	cmt0aw2dv000004jyn5mtmejp	2026-08-21 12:26:57.189	2026-08-19 16:23:10.153	2026-08-21 12:26:57.189	t
cmt0aw2fe000a04jyi1q4d6a5	CONFIRMED	cmpcsds4s000004jmgpwku1j2	cmt0aw2dv000004jyn5mtmejp	2026-08-21 14:25:30.733	2026-08-19 16:23:10.153	2026-08-21 14:25:30.75	t
cmsx2wpqf000n04ld28b2mc05	PENDING	cmpct94t9000204jsxeeckk3m	cmsx2wppc000004ldfwf8elsy	\N	2026-08-17 10:16:24.896	2026-08-17 10:16:24.896	f
cmt0aw2fd000204jyevzdcvfn	PENDING	cmpefdukz000404lanevrsp34	cmt0aw2dv000004jyn5mtmejp	\N	2026-08-19 16:23:10.153	2026-08-19 16:23:10.153	t
cmt0aw2fe000304jy8kgjjvx2	PENDING	cmrozuqv4000104l5tbza8qgy	cmt0aw2dv000004jyn5mtmejp	\N	2026-08-19 16:23:10.153	2026-08-19 16:23:10.153	t
cmt0aw2fe000404jync5d5jyl	PENDING	cmpfk8v2v000704jlp8siky9e	cmt0aw2dv000004jyn5mtmejp	\N	2026-08-19 16:23:10.153	2026-08-19 16:23:10.153	t
cmt0aw2fe000c04jybei2t6w2	CONFIRMED	cmpcov8jd000004l8umh13pux	cmt0aw2dv000004jyn5mtmejp	2026-08-22 20:58:38.873	2026-08-19 16:23:10.153	2026-08-22 20:58:38.887	t
cmt0aw2fe000b04jyo42ghxz3	PENDING	cmpcsehq1000104ibueo8dlm5	cmt0aw2dv000004jyn5mtmejp	\N	2026-08-19 16:23:10.153	2026-08-19 16:23:10.153	t
cmt0aw2fe000f04jy6xrasz71	CONFIRMED	cmst61960000104jvfkkcgzp4	cmt0aw2dv000004jyn5mtmejp	2026-08-22 22:24:26.225	2026-08-19 16:23:10.153	2026-08-22 22:24:26.235	t
cmt0aw2fe000k04jy6sdwu39w	CONFIRMED	cmpefep0o000504laynrqmhnw	cmt0aw2dv000004jyn5mtmejp	2026-08-22 22:30:43.697	2026-08-19 16:23:10.153	2026-08-22 22:30:43.698	t
cmt0aw2fe000904jy09sjqnho	CONFIRMED	cmpcpimjz000004jpcdqgfhfx	cmt0aw2dv000004jyn5mtmejp	2026-08-23 02:00:48.406	2026-08-19 16:23:10.153	2026-08-23 02:00:48.421	t
cmt0aw2fe000704jyopu2jfd7	CONFIRMED	cmpcoxez0000304l8g40zcfou	cmt0aw2dv000004jyn5mtmejp	2026-08-19 20:25:16.602	2026-08-19 16:23:10.153	2026-08-19 20:25:16.621	t
cmt0aw2fe000i04jy69qsnkbx	CONFIRMED	cmpcopzu6000004jro3prr7ca	cmt0aw2dv000004jyn5mtmejp	2026-08-19 20:26:40.944	2026-08-19 16:23:10.153	2026-08-19 20:26:40.957	t
cmt0aw2fe000l04jy21askhkx	CONFIRMED	cmpefcd1z000004lasd2r1kdh	cmt0aw2dv000004jyn5mtmejp	2026-08-19 20:37:51.004	2026-08-19 16:23:10.153	2026-08-19 20:37:51.024	t
cmt0aw2fe000j04jyze5z33hb	CONFIRMED	cmpdz3jpw000004jvdohsd2ri	cmt0aw2dv000004jyn5mtmejp	2026-08-19 22:19:42.741	2026-08-19 16:23:10.153	2026-08-19 22:19:42.76	t
cmsx2wpqf000g04ldxws3yfg8	CONFIRMED	cmpcqf47m000004l85vce0gfh	cmsx2wppc000004ldfwf8elsy	2026-08-20 11:14:52.515	2026-08-17 10:16:24.896	2026-08-20 11:14:52.515	t
cmsx2wpq8000c04ld0xl65m4d	CONFIRMED	cmpcov8jd000004l8umh13pux	cmsx2wppc000004ldfwf8elsy	2026-08-20 11:14:55.147	2026-08-17 10:16:24.896	2026-08-20 11:14:55.147	t
cmsx2wpq8000a04ld44a0rb17	CONFIRMED	cmpcsds4s000004jmgpwku1j2	cmsx2wppc000004ldfwf8elsy	2026-08-20 11:14:57.49	2026-08-17 10:16:24.896	2026-08-20 11:14:57.49	t
cmt0aw2fd000104jyooi9cbnl	CONFIRMED	cmpefcqj2000104ladlx0ysjz	cmt0aw2dv000004jyn5mtmejp	2026-08-23 02:02:11.527	2026-08-19 16:23:10.153	2026-08-23 02:02:11.545	t
cmt0aw2fe000n04jykjbuthh3	CONFIRMED	cmpct94t9000204jsxeeckk3m	cmt0aw2dv000004jyn5mtmejp	2026-08-23 02:38:31.72	2026-08-19 16:23:10.153	2026-08-23 02:38:31.735	t
cmt0aw2fe000e04jyuqfz61kp	DECLINED	cmpcpt3n6000004l561lm2ja7	cmt0aw2dv000004jyn5mtmejp	2026-08-23 11:03:55.973	2026-08-19 16:23:10.153	2026-08-23 11:03:55.984	t
cmt0aw2fe000804jyc4fh7jh8	DECLINED	cmpefdkyx000304la3k3nq9p9	cmt0aw2dv000004jyn5mtmejp	2026-08-23 12:00:04.089	2026-08-19 16:23:10.153	2026-08-23 12:00:04.1	t
cmsx2wpqf000m04ldr2dr3knf	CONFIRMED	cmpdz2mcq000104jr9xnhl4i0	cmsx2wppc000004ldfwf8elsy	2026-08-20 11:14:48.166	2026-08-17 10:16:24.896	2026-08-20 11:14:48.17	t
cmsx2wpqf000l04lduwf1vrxx	CONFIRMED	cmpefcd1z000004lasd2r1kdh	cmsx2wppc000004ldfwf8elsy	2026-08-20 11:14:49.505	2026-08-17 10:16:24.896	2026-08-20 11:14:49.51	t
cmsx2wpqf000h04ldtzs3osgf	CONFIRMED	cmpcm7sgp000004l1fp9o52ky	cmsx2wppc000004ldfwf8elsy	2026-08-20 11:14:51.436	2026-08-17 10:16:24.896	2026-08-20 11:14:51.437	t
cmsx2wpq8000904ldfva1gmts	CONFIRMED	cmpcpimjz000004jpcdqgfhfx	cmsx2wppc000004ldfwf8elsy	2026-08-20 11:14:59.488	2026-08-17 10:16:24.896	2026-08-20 11:14:59.488	t
cmsx2wpq8000104ld9n15ixu0	CONFIRMED	cmpefcqj2000104ladlx0ysjz	cmsx2wppc000004ldfwf8elsy	2026-08-20 11:15:07.805	2026-08-17 10:16:24.896	2026-08-20 11:15:07.806	t
cmt0aw2fe000g04jyarso44f2	CONFIRMED	cmpcqf47m000004l85vce0gfh	cmt0aw2dv000004jyn5mtmejp	2026-08-23 13:53:50.16	2026-08-19 16:23:10.153	2026-08-23 13:53:50.17	t
\.
COPY public.rules (id, title, description, "teamId", "createdAt", "updatedAt", "defaultMatches", severity, "punishmentTypeId") FROM stdin;
cmpcm65mx000204jl2sw5w1l9	Falta de respeito	Faltar com respeito com companheiros ou com técnico.\nCada situação será avaliada podendo ir de advertência a suspensão.	cmpbkj695000004jxaktrnbvc	2026-05-19 12:33:21.417	2026-05-19 12:33:21.417	\N	WARNING	\N
cmpcm4ifg000104jlejhv167q	Faltar ao jogo estando confirmado	Faltar ao jogo estando com o nome confirmado para a partida	cmpbkj695000004jxaktrnbvc	2026-05-19 12:32:04.684	2026-05-21 22:59:01.406	1	SUSPENSION	\N
cmpcm3peo000004jlou84ub6l	Atraso por jogo	Chegar pelo menos 45 minutos antes da partida com tolerância de 15 minutos	cmpbkj695000004jxaktrnbvc	2026-05-19 12:31:27.072	2026-05-23 15:51:49.142	\N	WARNING	cmpigtkya000204laljnrvmrb
cmq55o0kl000004k01yubq61b	Faltar ao jogo estando confirmado com aviso prévio	Faltou ao jogo porém avisou pouco tempo antes do jogo que não poderia ir	cmpbkj695000004jxaktrnbvc	2026-06-08 11:56:40.293	2026-06-08 11:56:40.293	\N	WARNING	cmpignhkl000004lam2q231rt
\.
COPY public.seasons (id, "teamId", name, type, "startDate", "endDate", status, "createdAt", "updatedAt") FROM stdin;
cmpftkvay000204lhym3kyidb	cmpbkj695000004jxaktrnbvc	2026	LEAGUE	2026-01-01 00:00:00	2026-12-31 00:00:00	ACTIVE	2026-05-21 18:24:03.706	2026-05-21 18:24:03.706
\.
COPY public.tactical_plays (id, name, description, category, movements, "teamId", "createdById", "createdAt", "updatedAt") FROM stdin;
cmsgcmwuh000004junvigmbko	Escanteio Padrão Dheryk	Quero que nos jogos onde Eu(Dheryk) Esteja a frente a equipe se comporte dessa maneira nos escanteios	CORNER_KICK	{"players": [{"endX": 10, "endY": 50, "role": "runner", "label": "#2 GK", "startX": 10, "startY": 50, "position": "GOALKEEPER", "waypoints": []}, {"endX": 49, "endY": 28, "role": "runner", "label": "#3 ZAG", "startX": 49, "startY": 28, "position": "MIDFIELDER", "waypoints": []}, {"endX": 56, "endY": 50, "role": "runner", "label": "#4 ZAG", "startX": 56, "startY": 50, "position": "MIDFIELDER", "waypoints": []}, {"endX": 76, "endY": 27, "role": "runner", "label": "#5 LAT", "startX": 76, "startY": 27, "position": "MIDFIELDER", "waypoints": []}, {"endX": 50, "endY": 72, "role": "runner", "label": "#6 LAT", "startX": 50, "startY": 72, "position": "MIDFIELDER", "waypoints": []}, {"endX": 81, "endY": 50, "role": "runner", "label": "#7 VOL", "startX": 81, "startY": 50, "position": "MIDFIELDER", "waypoints": []}, {"endX": 89, "endY": 50, "role": "runner", "label": "#8 MEI", "startX": 89, "startY": 50, "position": "MIDFIELDER", "waypoints": []}, {"endX": 94, "endY": 43, "role": "runner", "label": "#9 MEI", "startX": 94, "startY": 43, "position": "MIDFIELDER", "waypoints": []}, {"endX": 98, "endY": 3, "role": "runner", "label": "#10 ATA", "startX": 98, "startY": 3, "position": "MIDFIELDER", "waypoints": []}, {"endX": 95, "endY": 58, "role": "runner", "label": "#11 ATA", "startX": 95, "startY": 58, "position": "MIDFIELDER", "waypoints": []}, {"endX": 93, "endY": 32, "role": "runner", "label": "#12 PON", "startX": 93, "startY": 32, "position": "MIDFIELDER", "waypoints": []}], "formation": "4-4-2"}	cmpbkj695000004jxaktrnbvc	cmpcoy9by000504l8sw41rlak	2026-08-05 17:16:38.729	2026-08-05 17:16:38.729
cmsno67mi000004l5k13bqppv	Saida de jogo	\N	GENERAL	{"players": [{"endX": 10, "endY": 50, "role": "runner", "label": "#2 GK", "startX": 10, "startY": 50, "position": "GOALKEEPER", "waypoints": []}, {"endX": 40, "endY": 24, "role": "runner", "label": "#3 ZAG", "startX": 23, "startY": 36, "position": "MIDFIELDER", "waypoints": []}, {"endX": 39, "endY": 78, "role": "runner", "label": "#4 ZAG", "startX": 22, "startY": 64, "position": "MIDFIELDER", "waypoints": []}, {"endX": 87, "endY": 17, "role": "runner", "label": "#5 LAT", "startX": 41, "startY": 11, "position": "MIDFIELDER", "waypoints": []}, {"endX": 87, "endY": 75, "role": "runner", "label": "#6 LAT", "startX": 47, "startY": 89, "position": "MIDFIELDER", "waypoints": []}, {"endX": 46, "endY": 50, "role": "runner", "label": "#7 VOL", "startX": 32, "startY": 52, "position": "MIDFIELDER", "waypoints": []}, {"endX": 59, "endY": 36, "role": "runner", "label": "#8 MEI", "startX": 47, "startY": 35, "position": "MIDFIELDER", "waypoints": []}, {"endX": 61, "endY": 61, "role": "runner", "label": "#9 MEI", "startX": 46, "startY": 65, "position": "MIDFIELDER", "waypoints": []}, {"endX": 80, "endY": 50, "role": "runner", "label": "#10 ATA", "startX": 80, "startY": 50, "position": "MIDFIELDER", "waypoints": []}, {"endX": 90, "endY": 58, "role": "runner", "label": "#11 ATA", "startX": 75, "startY": 65, "position": "MIDFIELDER", "waypoints": []}, {"endX": 88, "endY": 38, "role": "runner", "label": "#12 PON", "startX": 75, "startY": 29, "position": "MIDFIELDER", "waypoints": []}], "formation": "5-4-1"}	cmpbkj695000004jxaktrnbvc	cmpcoy9by000504l8sw41rlak	2026-08-10 20:13:58.17	2026-08-10 20:13:58.17
\.
COPY public.team_message_reactions (id, "messageId", "userId", emoji, "createdAt") FROM stdin;
\.
COPY public.team_messages (id, "teamId", "authorId", content, pinned, "createdAt", "updatedAt") FROM stdin;
\.
COPY public.teams (id, name, slug, "badgeUrl", description, "primaryColor", "secondaryColor", "defaultVenue", "createdAt", "updatedAt", city, region, "fieldType", "competitiveLevel", "publicDirectoryOptIn", "shortName", "defaultBlockPreset", "defaultFormation", "foundedYear", "kitAwayUrl", "kitGkUrl", "kitHomeUrl", "monthlyFeesEnabled", "defaultPositionLimits", "defaultPositionLimitsEnabled") FROM stdin;
cmpbkj695000004jxaktrnbvc	Mercado Central Futebol Clube	mercado-central-futebol-clube	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/5775b171-c9f8-4ddd-a963-322df87c96c3.png	Fundação em 2022.\nSempre em frente Mercado	#ffffff	#ff0000	Areninha do Antonio Bezerra	2026-05-18 18:59:43.337	2026-07-20 13:56:23.594	Fortaleza	Antonio Bezerra	SYNTHETIC	INTERMEDIATE	t	MCFC	BALANCED	THREE_FIVE_TWO	\N	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/ae511924-b192-4cfc-8968-0d91a7c4d072.png	\N	https://bjikegeirtjeqbzwnznk.storage.supabase.co/storage/v1/object/public/projeto_times/uploads/5326f3dd-982e-4403-b001-f2acd1b2d01b.png	f	{"FORWARD": 4, "DEFENDER": 5, "GOALKEEPER": 1, "MIDFIELDER": 5, "LEFT_WINGBACK": 2, "RIGHT_WINGBACK": 2, "DEFENSIVE_MIDFIELDER": 2}	t
cmsop2ds70000xkt8o2d6xzm7	Azilados FC	azilados-fc	\N	Portal oficial da equipe Azilados FC.	#10b981	#0b0f11	\N	2026-08-11 13:26:45.319	2026-08-11 13:26:45.319	Fortaleza	São Gerardo	SOCIETY	INTERMEDIATE	t	\N	\N	\N	\N	\N	\N	\N	t	\N	f
\.
COPY public.transactions (id, type, amount, description, category, date, "teamId", "createdAt", "updatedAt", "matchId", "externalId", status) FROM stdin;
6617cbd2-2668-4389-8383-f0edc5cfa469	INCOME	609.60	Caixa do time	OTHER	2026-05-21 00:00:00	cmpbkj695000004jxaktrnbvc	2026-05-21 18:20:34.465	2026-05-21 18:20:34.465	\N	\N	PAID
3f1541d7-61d1-4b75-9678-51dd7b302be0	INCOME	120.00	Cota do jogo	MEMBERSHIP	2026-05-23 00:00:00	cmpbkj695000004jxaktrnbvc	2026-05-23 21:44:56.868	2026-05-23 21:44:56.868	\N	\N	PAID
ea3fb6a7-1998-4e5b-aa39-e93486f9c700	EXPENSE	20.00	Água e gelo	MEMBERSHIP	2026-05-23 00:00:00	cmpbkj695000004jxaktrnbvc	2026-05-23 21:45:24.908	2026-05-23 21:45:24.908	\N	\N	PAID
b03cd183-9bea-4e8d-bffd-e958761ea5e5	EXPENSE	24.00	Coca cola	MEMBERSHIP	2026-05-23 00:00:00	cmpbkj695000004jxaktrnbvc	2026-05-23 21:47:02.051	2026-05-23 21:47:02.051	\N	\N	PAID
5c0e062d-4237-4de9-86a1-e917fcc59aef	INCOME	140.00	Cota jogo campeonato	FRIENDLY_FEE	2026-05-10 00:00:00	cmpbkj695000004jxaktrnbvc	2026-05-24 13:23:38.031	2026-05-24 13:23:38.031	\N	\N	PAID
92c3b337-7c7e-4795-baa1-2ebffe16f40a	INCOME	60.00	Cota de amistoso	FRIENDLY_FEE	2026-05-29 00:00:00	cmpbkj695000004jxaktrnbvc	2026-05-29 15:44:36.729	2026-05-29 15:44:36.729	\N	\N	PAID
5fc1730c-cf4a-411f-b58d-5e12f4acc023	EXPENSE	20.00	Água e Gelo	MEMBERSHIP	2026-05-27 00:00:00	cmpbkj695000004jxaktrnbvc	2026-06-01 11:07:00.908	2026-06-01 11:07:00.908	\N	\N	PAID
984dfa55-333d-49db-98f4-61809b15814d	INCOME	150.00	Cota de amistoso	FRIENDLY_FEE	2026-05-30 00:00:00	cmpbkj695000004jxaktrnbvc	2026-06-01 11:07:36.185	2026-06-01 11:07:36.185	\N	\N	PAID
5c3f11d8-d54e-4cd7-8ce2-155fd6c13655	EXPENSE	20.00	Água e gelo	OTHER	2026-05-30 00:00:00	cmpbkj695000004jxaktrnbvc	2026-06-01 11:07:52.071	2026-06-01 11:07:52.071	\N	\N	PAID
d5c7a03a-d095-4fc9-9adb-6fba121f42f0	INCOME	130.00	Cota (Ajax x Mercado)	FRIENDLY_FEE	2026-06-07 00:00:00	cmpbkj695000004jxaktrnbvc	2026-06-07 21:16:18.457	2026-06-07 21:16:18.457	\N	\N	PAID
4e2b3ffa-bcff-4197-b8b4-16940d19f511	EXPENSE	20.00	Água + Gelo	OTHER	2026-06-07 00:00:00	cmpbkj695000004jxaktrnbvc	2026-06-07 21:16:34.31	2026-06-07 21:16:34.31	\N	\N	PAID
ccecba56-d5a5-42e1-a712-82eb49de56ce	EXPENSE	689.40	Uniformes	EQUIPMENT	2026-06-10 00:00:00	cmpbkj695000004jxaktrnbvc	2026-06-10 16:57:06.506	2026-06-10 16:57:06.506	\N	\N	PAID
0ce5db37-a6d3-4617-a2fc-9df73f4c2d6e	INCOME	100.00	Pagamento uniforme Ricardo	EQUIPMENT	2026-06-10 00:00:00	cmpbkj695000004jxaktrnbvc	2026-06-10 20:45:19.182	2026-06-10 20:45:19.182	\N	\N	PAID
67c2f722-c5b8-4c39-ad61-f2b7f222b9f7	EXPENSE	20.00	Água + Gelo	OTHER	2026-06-14 00:00:00	cmpbkj695000004jxaktrnbvc	2026-06-15 10:53:04.188	2026-06-15 10:53:04.188	\N	\N	PAID
24ebcd52-ce88-4d34-bd91-7e4b321c859d	EXPENSE	100.00	Compra Uniforme Ricardo	OTHER	2026-06-10 00:00:00	cmpbkj695000004jxaktrnbvc	2026-06-15 10:56:20.645	2026-06-15 10:56:20.645	\N	\N	PAID
4dca8dc8-f3ff-468b-9100-899fa1e9cfbd	EXPENSE	80.00	Arbitragem do campeonato	REFEREE	2026-06-21 00:00:00	cmpbkj695000004jxaktrnbvc	2026-06-26 13:00:53.513	2026-06-26 13:00:53.513	\N	\N	PAID
c30f52f6-7feb-45e0-8500-bdbb44c40d56	EXPENSE	50.00	Arbitragem campeonato	REFEREE	2026-06-28 00:00:00	cmpbkj695000004jxaktrnbvc	2026-07-07 18:18:08.184	2026-07-07 18:18:08.184	\N	\N	PAID
32e03c70-3f0a-4d75-9b39-b6de90856903	INCOME	120.00	amistoso	FRIENDLY_FEE	2026-07-04 00:00:00	cmpbkj695000004jxaktrnbvc	2026-07-07 18:19:17.713	2026-07-07 18:19:17.713	\N	\N	PAID
72003f73-eebd-49a9-9df7-fac10fda2c72	EXPENSE	20.00	Gelo e agua	OTHER	2026-06-28 00:00:00	cmpbkj695000004jxaktrnbvc	2026-07-07 18:20:02.085	2026-07-07 18:20:02.085	\N	\N	PAID
671861a6-a9f5-4fa7-83cf-e44908bf110c	EXPENSE	20.00	Agua e gelo	OTHER	2026-07-04 00:00:00	cmpbkj695000004jxaktrnbvc	2026-07-07 18:20:37.684	2026-07-07 18:20:37.684	\N	\N	PAID
e0fc30f3-e98c-4780-8d99-fadb0193ad77	INCOME	150.00	Cota Novo Oriente	FRIENDLY_FEE	2026-07-19 00:00:00	cmpbkj695000004jxaktrnbvc	2026-07-20 13:31:43.222	2026-07-20 13:31:43.222	\N	\N	PAID
72b63815-3690-416a-ac72-59207fac0f08	EXPENSE	28.00	Refrigerante pos jogo	OTHER	2026-07-19 00:00:00	cmpbkj695000004jxaktrnbvc	2026-07-20 13:32:24.912	2026-07-20 13:32:24.912	\N	\N	PAID
d28d5b7f-5a3c-4771-b994-3e4b411f3d0f	EXPENSE	25.00	Arbitragem Kurikaka	REFEREE	2026-07-16 00:00:00	cmpbkj695000004jxaktrnbvc	2026-07-20 13:49:41.766	2026-07-20 13:49:41.766	\N	\N	PAID
685f91a6-8299-4217-badb-2d7d986372db	INCOME	25.00	Ficha extra Kaian	OTHER	2026-07-20 00:00:00	cmpbkj695000004jxaktrnbvc	2026-07-20 13:58:11.594	2026-07-20 13:58:11.594	\N	\N	PAID
27ee38a2-4d13-41b3-8367-e26053cd137e	INCOME	100.00	Cota jogo Cruzeiro LBA	FRIENDLY_FEE	2026-07-22 00:00:00	cmpbkj695000004jxaktrnbvc	2026-07-27 11:00:34.455	2026-07-27 11:00:34.455	\N	\N	PAID
8bc94999-87d7-484d-8c6d-6f3728cb4a3d	EXPENSE	200.00	Em mãos do Joaquim para custo de agua e gelo	OTHER	2026-07-22 00:00:00	cmpbkj695000004jxaktrnbvc	2026-07-27 11:01:57.787	2026-07-27 11:01:57.787	\N	\N	PAID
bc6df6c8-e1bd-42d6-8b04-65cf79c15e58	INCOME	110.00	Cota jogo contra o Fluminense	FRIENDLY_FEE	2026-07-25 00:00:00	cmpbkj695000004jxaktrnbvc	2026-07-27 11:02:36.674	2026-07-27 11:02:36.674	\N	\N	PAID
103020d5-0f71-481e-88b9-4a94c1f2493d	EXPENSE	70.00	Gasto com arbitragem campeonato	REFEREE	2026-07-12 00:00:00	cmpbkj695000004jxaktrnbvc	2026-07-27 11:03:32.843	2026-07-27 11:03:32.843	\N	\N	PAID
1c870d9c-ef87-4df3-a1b5-66b832cacb29	INCOME	5.00	Recebido do Wesley	OTHER	2026-07-19 00:00:00	cmpbkj695000004jxaktrnbvc	2026-07-27 11:04:35.904	2026-07-27 11:04:35.904	\N	\N	PAID
570d91d2-4220-41ac-b7f4-fc3f2bad9dd0	EXPENSE	6.00	Gelo	OTHER	2026-07-29 12:00:00	cmpbkj695000004jxaktrnbvc	2026-07-30 20:20:51.796	2026-07-30 20:20:51.796	\N	\N	PAID
6cef809a-9a05-41f0-b289-cba2846639fc	EXPENSE	10.00	Gelo	OTHER	2026-07-31 12:00:00	cmpbkj695000004jxaktrnbvc	2026-08-03 13:23:45.113	2026-08-03 13:23:45.113	\N	\N	PAID
6ef1b0df-2070-44b2-a643-0441ed1abda1	EXPENSE	35.00	Arbitragem contra Azilados	REFEREE	2026-08-02 12:00:00	cmpbkj695000004jxaktrnbvc	2026-08-03 13:24:09.66	2026-08-03 13:24:09.66	\N	\N	PAID
a38293cb-7c22-4532-8002-ed19b60eafce	EXPENSE	6.00	Gelo	OTHER	2026-08-02 12:00:00	cmpbkj695000004jxaktrnbvc	2026-08-03 13:24:20.7	2026-08-03 13:24:20.7	\N	\N	PAID
441773c9-5775-4f94-be1b-201dc5a5bad7	INCOME	95.00	Cota jogo contra Integral	FRIENDLY_FEE	2026-07-31 12:00:00	cmpbkj695000004jxaktrnbvc	2026-08-03 13:24:54.029	2026-08-03 13:24:54.029	\N	\N	PAID
f33206a1-6d71-4909-b537-da10ba8b30f3	INCOME	100.00	Cota do jogo contra o porto	FRIENDLY_FEE	2026-08-08 12:00:00	cmpbkj695000004jxaktrnbvc	2026-08-10 17:10:27.284	2026-08-10 17:10:27.284	\N	\N	PAID
840d53fe-e8f8-4e1c-91a0-e29655850053	EXPENSE	12.00	Gelo	OTHER	2026-08-08 12:00:00	cmpbkj695000004jxaktrnbvc	2026-08-10 17:10:39.01	2026-08-10 17:10:39.01	\N	\N	PAID
8b9e5414-1ca6-4d6c-9729-86a5234c177c	INCOME	100.00	Cota amistoso	FRIENDLY_FEE	2026-08-13 12:00:00	cmpbkj695000004jxaktrnbvc	2026-08-14 01:47:06.722	2026-08-14 01:47:06.722	\N	\N	PAID
514e35c2-a10f-4f0f-8317-86c39e1bbf7c	EXPENSE	10.00	Gelo	OTHER	2026-08-13 12:00:00	cmpbkj695000004jxaktrnbvc	2026-08-14 01:47:21.926	2026-08-14 01:47:21.926	\N	\N	PAID
c74b685a-afee-4274-865d-ec15c716a7a0	EXPENSE	141.00	Inscrição campeonato,\nGelo,\nArbitragem	OTHER	2026-08-17 12:00:00	cmpbkj695000004jxaktrnbvc	2026-08-17 16:19:50.801	2026-08-17 16:19:50.801	\N	\N	PAID
bdf20d57-d948-4319-8770-44ea826af073	EXPENSE	200.00	Arbitragem campeonato	OTHER	2026-08-22 12:00:00	cmpbkj695000004jxaktrnbvc	2026-08-22 22:52:28.378	2026-08-22 22:52:28.378	\N	\N	PAID
8a6381ac-5e09-4de5-8cb9-cbecf658752e	EXPENSE	40.00	Goleiro campeonato	OTHER	2026-08-22 12:00:00	cmpbkj695000004jxaktrnbvc	2026-08-22 22:52:51.742	2026-08-22 22:52:51.742	\N	\N	PAID
edd494f4-4513-4ba8-b0ee-ddfc3c980ddd	EXPENSE	35.00	Arbitragem	REFEREE	2026-08-23 12:00:00	cmpbkj695000004jxaktrnbvc	2026-08-25 23:38:34.059	2026-08-25 23:38:34.059	\N	\N	PAID
4b03c751-fa6e-4b82-b93c-776b547979be	EXPENSE	30.00	Goleiro	OTHER	2026-08-23 12:00:00	cmpbkj695000004jxaktrnbvc	2026-08-25 23:39:01.219	2026-08-25 23:39:01.219	\N	\N	PAID
a2fab880-2e7a-4ee6-99c3-771db09e022a	INCOME	120.00	Contribuição jogadores	REFEREE	2026-08-22 12:00:00	cmpbkj695000004jxaktrnbvc	2026-08-25 23:43:26.21	2026-08-25 23:43:26.21	\N	\N	PAID
\.
COPY public.users (id, email, "passwordHash", name, role, "teamId", "playerId", "createdAt", "updatedAt", "mustChangePassword") FROM stdin;
cmpfio3qi000104l5wxmm0bie	joaquim.lsn@gmail.com	$2b$12$akpXmOC0dswTs05wRgy1nubx76ja2O2N9wUkk..MwX4rCIoH08E0S	Joaquim	ADMIN	cmpbkj695000004jxaktrnbvc	cmpefcd1z000004lasd2r1kdh	2026-05-21 13:18:38.826	2026-05-29 14:38:26.538	f
cmpcrj7ws000004l8oescls0l	fagneroliveiralucasfilho@gmail.com	$2b$12$LizQMgbNCFP0E3bCMmUrheAiSjOxud1zgqtW.etJrh/kQdvki7nGq	Fagner	PLAYER	cmpbkj695000004jxaktrnbvc	cmpcpimjz000004jpcdqgfhfx	2026-05-19 15:03:28.973	2026-05-19 15:03:28.973	f
cmpcrkdw6000104l84mvuzgyb	naellean407@gmail.com	$2b$12$L1bqbq1xE1wpgnBpxudJL.wN0dXwOUiPerClwuaZ/pZGyCfUZbJFq	Natan Cherki 🦆	PLAYER	cmpbkj695000004jxaktrnbvc	cmpcpgupa000004l5ehnc0kjs	2026-05-19 15:04:23.382	2026-05-19 15:04:23.382	f
cmpbj9qd90000s4t86d3f4avs	admin@admin.com	$2b$12$qriO2Sq92PIsXpX47L1nh.fDFRse.VVwpfj6twTE4JXA/4HuEZUUi	Administrador Geral	ADMIN	cmpbkj695000004jxaktrnbvc	\N	2026-05-18 18:24:23.229	2026-05-18 18:59:43.361	f
cmpd6e4q8000004i63b1ut2sx	lucassiqueira2908@gmail.com	$2b$12$i8R6LodEz7SOKMeSVgp9VeubhBJDou.4zwzuIP4MbUAAGfdkqdq5u	Lucas Soares	PLAYER	cmpbkj695000004jxaktrnbvc	cmpcov8jd000004l8umh13pux	2026-05-19 21:59:25.808	2026-05-19 21:59:25.808	f
cmpd7uwm8000004kyio7v783x	marcos.susuke@gmail.com	$2b$12$6iH/UH978PaMT9ENX5aQ4u38tiIwkzhMkNCC6kp3s1Lh4hp7HruWy	Marcos antonio	PLAYER	cmpbkj695000004jxaktrnbvc	cmpcsehq1000104ibueo8dlm5	2026-05-19 22:40:28.065	2026-05-19 22:40:28.065	f
cmpd8r2um000004jol7zvu96b	ivis.p.silva@gmail.com	$2b$12$7SsgdTWbvASRzB3SL.s2uuMHdmQYfnJsbGVw.n7kq4QlOyRmzFOum	Ivis Silva	PLAYER	cmpbkj695000004jxaktrnbvc	cmpct94t9000204jsxeeckk3m	2026-05-19 23:05:29.134	2026-05-19 23:05:29.134	f
cmpe0mtc4000004l1e0lft0uf	joaoicarosam@gmail.com	$2b$12$Z9vC8X6s/r1KyZkZEz0oRuviyWyEZSOgTaVVuqlQ1KKwSLl3ReWne	Ícaro Sampaio	COACH	cmpbkj695000004jxaktrnbvc	cmpcsds4s000004jmgpwku1j2	2026-05-20 12:05:59.428	2026-05-21 11:31:13.976	f
cmpej13hk000004l9f9eng6ul	fleonardovlima@gmail.com	$2b$12$/RyMwKFgNxfynf/1QMcz..2otXTZtTK1gfyEPcXEpjRqxIYE2bwyW	FRANCISCO LEONARDO VIDAL LIMA	COACH	cmpbkj695000004jxaktrnbvc	cmpdz2mcq000104jr9xnhl4i0	2026-05-20 20:40:58.857	2026-05-21 11:31:42.166	f
cmpfmz33y000004lelcgdyt4f	darlanmenezesandrade@gmail.com	$2b$12$1bAiIQUBvejlTa7rWrlWn.aiS0cTAG/WblTRAa6LB85wyI5RFRdAO	Darlan Menezes	PLAYER	cmpbkj695000004jxaktrnbvc	cmpfk8v2v000704jlp8siky9e	2026-05-21 15:19:09.694	2026-05-21 15:19:09.694	f
cmpfrajwz000104ik62ehuwer	jardeldesouzaborges@yahoo.com.br	$2b$12$p8bE1RM6n3vB/vT05kzf6en.yu.kR6mVEfNIcDZL9OdLEKXLeiZgu	jardeldesouzaborges@yahoo.com.br	PLAYER	cmpbkj695000004jxaktrnbvc	cmpdz3jpw000004jvdohsd2ri	2026-05-21 17:20:03.155	2026-05-21 17:20:03.155	f
cmrqjkn0m000004l6bos51jnk	berg14lindemberg@gmail.com	$2b$12$6lioD0oIlxm7e1QGlKlEYeNc65rctoddd.elwGXBs8Xn7RjXiO6Qy	Berg	PLAYER	cmpbkj695000004jxaktrnbvc	cmrozuqv4000104l5tbza8qgy	2026-07-18 15:48:49.414	2026-07-18 15:48:49.414	f
cmpfv2qt3000004jpb1uotoby	ricardofilho719@gmail.com	$2b$12$eQCmlYw8PW3/vuByyFjo4eO4BDqnV12Hv94fJD1.DDwwwdpF5tcQa	Ricardo filho	PLAYER	cmpbkj695000004jxaktrnbvc	cmpefdkyx000304la3k3nq9p9	2026-05-21 19:05:57.303	2026-05-21 19:05:57.303	f
cmpgvd0wc000004jnbt334ki3	joseadrianobarrosjr@gmail.com	$2b$12$1Mxncp2HAyioVmuxt1N9eunzMMESWezruE6Wn.nkO5E2nVxTcBTqi	juninho	PLAYER	cmpbkj695000004jxaktrnbvc	cmpcqf47m000004l85vce0gfh	2026-05-22 12:01:43.117	2026-05-22 12:01:43.117	f
cmpgxornn000104laq0eiwjrs	andersonportugaall@gmail.com	$2b$12$L0oATCmazDURFTzJl65doe4T8Kr85Xc0Bb7Dgjh04WMRDodoKo9jC	Anderson cesar	PLAYER	cmpbkj695000004jxaktrnbvc	cmpg41k59000004l7521hfcn4	2026-05-22 13:06:50.243	2026-05-22 13:06:50.243	f
cmphed7dz000104l1vt5dsakr	freirekaian01@gmail.com	$2b$12$IKz94Dl0X4afpLojcCTbd.FEeEC8Cey1MC61kRBsIOEtj3AdDyks2	Kaian	PLAYER	cmpbkj695000004jxaktrnbvc	cmpcpt3n6000004l561lm2ja7	2026-05-22 20:53:44.231	2026-05-22 20:53:44.231	f
cmphnuh3t000104larhmey34t	ricardorodoficial@gmail.com	$2b$12$wtogh5YpIqjDWt94vhOHeuuPMZqLw2B1J2dlPCH2hL9Esjm6uXsbO	Ricardo rodrigues	PLAYER	cmpbkj695000004jxaktrnbvc	cmpefdukz000404lanevrsp34	2026-05-23 01:19:06.521	2026-05-23 01:19:06.521	f
cmpho0wwq000004jspb58zuwi	jralves596@gmail.com	$2b$12$KSJRDnnECW8cs.MY8YQ30OmpHh/6HNxwSoH2qcjrsksg0nEFdUGwe	Jralves	PLAYER	cmpbkj695000004jxaktrnbvc	cmpefcqj2000104ladlx0ysjz	2026-05-23 01:24:06.938	2026-05-23 01:24:06.938	f
cmpj3d4t9000004jvh7z169sm	lucas_araujo_alves01@outlook.com	$2b$12$QVhg08vIG2wl3uKVdZ0hte5b4kjfgCjsT85XGnuIjwK.BVsUo8FJ.	Lukas de Araujo	PLAYER	cmpbkj695000004jxaktrnbvc	cmpct2xp7000004jsv1ujpe1r	2026-05-24 01:21:17.469	2026-05-24 01:21:17.469	f
cmpn5gh4a000004ju8klhbxmm	ruanpablo1028@gmail.com	$2b$12$l9hvcFniAtsd5aGpC9JnQer2Rcep0MYJr9Dmb077iQu8U2yJ6mUMi	Juan	PLAYER	cmpbkj695000004jxaktrnbvc	cmph7t8a1000004l9n8uic25p	2026-05-26 21:30:57.322	2026-05-26 21:30:57.322	f
cmpn1yeh5000104jrhfyq0v6c	taleslaionpiloto@gmail.com	$2b$12$WyTNteqo5yYGQi3JjJdaBug/gqBlvDlOxqqkQe8sHGGW.1oq0wazu	Tales laion	ADMIN	cmpbkj695000004jxaktrnbvc	cmpn1o6et000004jrcnmw0gav	2026-05-26 19:52:55.241	2026-05-27 16:13:25.191	f
cmpcoy9by000504l8sw41rlak	dheryk@gmail.com	$2b$12$x572UN6TDwaRDF/sFY9VgukHc0HhfsGzQJ8.9GC4MKnAaz56pXfD.	Dheryk Medeiros	ADMIN	cmpbkj695000004jxaktrnbvc	cmpcoxez0000304l8g40zcfou	2026-05-19 13:51:11.806	2026-07-20 14:36:00.998	f
cmsd7iqxr000004ky22nwg8cq	henryque_jorge618@hotmail.com	$2b$12$4FZ8JByINPW7x/CcG44jJuinFnqrbdOw3PyrN4CtCRQBZwkKy4mQ2	Henrique Jorge	PLAYER	cmpbkj695000004jxaktrnbvc	cmsd6v73x000004jupd8tbvon	2026-08-03 12:30:07.839	2026-08-03 12:30:07.839	f
cmpcnpofw000004k4ig2qwx60	fcowesley2303@gmail.com	$2b$12$GXROV9gZUAXF8Oaz2QYNTO2sQpvyv37n/Qqeeh3T/rIwCW1E8H5gG	Wesley	ADMIN	cmpbkj695000004jxaktrnbvc	cmpcm7sgp000004l1fp9o52ky	2026-05-19 13:16:31.869	2026-07-14 17:23:01.198	f
cmph1sypn000004ie5zqjr8k3	olivera123vbb@gmail.com	$2b$12$iGmVJqI/n3MyZrJX7u9zUOfONrMZVvbdqP5tkQwByJNV6QZhxBYTu	Victor Hugo	PLAYER	cmpbkj695000004jxaktrnbvc	cmpefep0o000504laynrqmhnw	2026-05-22 15:02:04.475	2026-07-15 17:52:21.897	f
cmpctqpqx000004jv6uocm5mt	matheuspereiracampos@outlook.com	$2b$12$kcjTlob6YNPJDJVQamrAWOLVaHvqfRIAfWiClDFWBquTDYwxtQNFa	Matheus pereira	PLAYER	cmpbkj695000004jxaktrnbvc	cmpcopzu6000004jro3prr7ca	2026-05-19 16:05:17.913	2026-08-17 14:20:38.658	f
cmsop2e350001xkt8beathtg7	admin@azilados.com	$2b$12$CnBKIJXmhovqNmO/e9hq6.6h.fj9imWJNbxAtoE9.LWl/5kR7fDwy	Felipe	ADMIN	cmsop2ds70000xkt8o2d6xzm7	\N	2026-08-11 13:26:45.713	2026-08-11 13:26:45.713	f
cmsthgz8f000004l7pd5vnm0o	luizgusttavo845@gmail.com	$2b$12$AQI.YfGlWB7FfYUYRrKbweSudJuEJMyMVrUGNSnArJXXgHrW0uggi	Luiz Gustavo	PLAYER	cmpbkj695000004jxaktrnbvc	cmst61960000104jvfkkcgzp4	2026-08-14 21:53:00.255	2026-08-14 21:53:00.255	f
\.
SET session_replication_role = origin;
COMMIT;
