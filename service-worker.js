if(!self.define){let s,e={};const a=(a,t)=>(a=new URL(a+".js",t).href,e[a]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=a,s.onload=e,document.head.appendChild(s)}else s=a,importScripts(a),e()})).then((()=>{let s=e[a];if(!s)throw new Error(`Module ${a} didn’t register its module`);return s})));self.define=(t,r)=>{const i=s||("document"in self?document.currentScript.src:"")||location.href;if(e[i])return;let c={};const l=s=>a(s,i),d={module:{uri:i},exports:c,require:l};e[i]=Promise.all(t.map((s=>d[s]||l(s)))).then((s=>(r(...s),c)))}}define(["./workbox-84c915bb"],(function(s){"use strict";self.addEventListener("message",(s=>{s.data&&"SKIP_WAITING"===s.data.type&&self.skipWaiting()})),s.clientsClaim(),s.precacheAndRoute([{url:"assets/404.html-DZsfVDta.js",revision:"97f56925e8c35e2a10f5e333773c3a26"},{url:"assets/AdminBlazor.html-B9CqqbUO.js",revision:"2bc66610754d5ed50255a3c9a3299546"},{url:"assets/ado.html-Bs5NpNub.js",revision:"b0c3bc9a99b3b08e09eed9ec439e11e2"},{url:"assets/ado.html-BT6BW4kQ.js",revision:"1d0be314c86c1aa4c3528c99d6758f17"},{url:"assets/aggregateroot.html-2gPlq4J5.js",revision:"e3527d4302e357fd82618ed371b8dd8e"},{url:"assets/aggregateroot.html-DQRdmbAG.js",revision:"2a3f70916ea581b0ab688a7d28c61260"},{url:"assets/aop-freesql-autofac.html-CcHPc6mc.js",revision:"a87041abbcedeaceb7427ec61a1b267b"},{url:"assets/aop.html-DUHDDWpc.js",revision:"c2b02180b7158f58814640c424e456f9"},{url:"assets/aop.html-Dzy3p2Pq.js",revision:"44876da33284bbd6d25d653245038059"},{url:"assets/api.html-BnYZ1tAm.js",revision:"37c6931da25cd1cd5b143178b09f8aa8"},{url:"assets/app-CVs7fA3m.js",revision:"23ff5adc52bfdc8bdc2e61433cd11e8d"},{url:"assets/awesome-freesql.html-Dl_VD0MZ.js",revision:"2944b9c862bb8e45387a8e699bb4caf6"},{url:"assets/barcode_2x1-BKjlga-s.js",revision:"7ca67cc59c4fb1b4ffce362db6dbc9fc"},{url:"assets/BaseEntity.html-BriUpoTc.js",revision:"7b887558885f95d1189e78fcc6bc9716"},{url:"assets/BaseEntity.html-DezRAh2h.js",revision:"92d7c5dd9003fdc05c473f4f836478dc"},{url:"assets/cascade-delete.html-Bt7DmSQq.js",revision:"26432cdc0dd0a4aed478810fec8ac648"},{url:"assets/cascade-delete.html-DoMK26uw.js",revision:"e9a62e57962d1ce18ecf7277e0619c8b"},{url:"assets/cascade-saving.html-D20A376T.js",revision:"2e0ef8e181f15c5a0699cb1d6fcf4fc3"},{url:"assets/cascade-saving.html-DE6IqtjT.js",revision:"40448ba974899d4a1da706886cb14f97"},{url:"assets/change-log.html-BXG3PgQl.js",revision:"538d49389a3d61c524ee32cebf0a68f7"},{url:"assets/code-first.html-B9pnrqJL.js",revision:"fa112e2fa59eb54717cc7413edb748d0"},{url:"assets/code-first.html-CqO6bKDp.js",revision:"0ca5a56f0c923492241637bdc694174e"},{url:"assets/config-entity-from-db-first.html-CHK4JL02.js",revision:"e77d60f60dfd5b9edbcd6b9beeeda3d8"},{url:"assets/contributing.html-CJuW5_vC.js",revision:"eb6c332a9ef5feeb669777b3d3d71c33"},{url:"assets/custom-attribute.html-BSIfeV4l.js",revision:"a061289e08984b6dd56d0ea3eee1ed0d"},{url:"assets/db-context.html-CHk-pK_i.js",revision:"6167153c721345d852111ddc0874e849"},{url:"assets/db-first.html-5nSHPS0h.js",revision:"3226363d440351fb0770aff4f0873665"},{url:"assets/db-first.html-BdaSRaxL.js",revision:"1ae1cb5f9ad053d68048e044e3362141"},{url:"assets/delete.html-D87NjyWH.js",revision:"67f7021436a15e6e876161a9a1896edf"},{url:"assets/delete.html-VnqKH0dH.js",revision:"5acae118c082e5741424072d93e83ef1"},{url:"assets/donation.html-DsaWwEQL.js",revision:"4a6ed55120c52f213871ffbc663f37ae"},{url:"assets/dynamic.html-BGYs2p5f.js",revision:"b590efbbb08d6570a1c7f14ba216ec3e"},{url:"assets/dynamic.html-ByZZyzKV.js",revision:"18da31e03b314c82bdbc1fc4af2f4d5d"},{url:"assets/entity-attribute.html-DROha6K8.js",revision:"6cfcc44290d1a1888c12ee99395946fa"},{url:"assets/entity-attribute.html-DsIrI-96.js",revision:"e1e59b4bdbea174b6e026a7d27370c9c"},{url:"assets/expression-function.html-BCGGJhGO.js",revision:"08fe498a4004550b6fbf3ba18855ddbf"},{url:"assets/expression-function.html-vd0FNSa6.js",revision:"e0513c08f5ded6cab7c4100c79d992a2"},{url:"assets/faq.html-DzcOKlKM.js",revision:"0fd9514bb0fa4679f0d2a28250239fcf"},{url:"assets/filters.html-Clt_lsSm.js",revision:"2994704c46a0cfff8afa8b0b0ccf0682"},{url:"assets/filters.html-CXQEal_8.js",revision:"7bf44d6047fab06f089375bdc089dc3f"},{url:"assets/fluent-api.html-DNqy9F_p.js",revision:"8fff2e6bd6f41db925931d7c73b61373"},{url:"assets/fluent-api.html-jZGD8aMd.js",revision:"a0ce8057e6c6f1d5a77c3121ae86fef9"},{url:"assets/freeim.html-DTYAwO_h.js",revision:"bc5d4bfccd898ba3b628855dc589a756"},{url:"assets/freeredis.html-DMZeGpfA.js",revision:"5567ae28d6faf6d3d8300d3353b9af32"},{url:"assets/freescheduler.html-MH3kVRK3.js",revision:"40d92e9c174fb51d15094c1d790d06f2"},{url:"assets/freesql-auditlog.html-DACN-QD6.js",revision:"f7c9b2a860d09a5ad207975821d12859"},{url:"assets/freesql-cap.html-DowkkcVI.js",revision:"de2519779494bc8b0f2ab6ac3b10aa4d"},{url:"assets/freesql-docker.html-DkxqvkHN.js",revision:"6b49443679c0c2883eae16a6e1cbacaf"},{url:"assets/freesql-extensions-baseentity.html-9ZvJXAje.js",revision:"f3d923f5a0d6c327727e5639b3e55894"},{url:"assets/freesql-provider-clickhouse.html-BxOsMnAo.js",revision:"2f9e96a99f6dcfc0f81289c8df53e6f5"},{url:"assets/freesql-provider-custom.html-Dbt-y-Cs.js",revision:"7996bcda915c3d75416bace3c739ec6c"},{url:"assets/freesql-provider-duckdb.html-C5DLsoGA.js",revision:"a6053504556651070e6ecaf1768c48b3"},{url:"assets/freesql-provider-firebird.html-C0qx9xbp.js",revision:"160b518da0baf2021595d26ee8032d07"},{url:"assets/freesql-provider-mysqlconnector.html-Bm4RSvqC.js",revision:"d0843ebe78b2ae049e1a6fceabc9736f"},{url:"assets/freesql-provider-odbc.html-ZSwNxFSi.js",revision:"41dea16a84a72d08e05beed29e64fb90"},{url:"assets/freesql-provider-oracle.html-CN-3_nrq.js",revision:"18cda4903cb8395b54d9257dc4056c7a"},{url:"assets/freesql-provider-postgresql.html-DwH6sNqr.js",revision:"c4cfed5c7ed4891ae32a8d3ff4d82c11"},{url:"assets/freesql-provider-questdb.html--GRmiO-H.js",revision:"91866ac7211289ba82b95309704db8c2"},{url:"assets/freesql-provider-sqlitecore.html-n0G-Wgog.js",revision:"da7c15c650112fbe2b9c7ef3e2596939"},{url:"assets/freesql-provider-sqlserver.html-BE7lMBWA.js",revision:"0a14f674ed0dd1b810483e2ad4d7dd9b"},{url:"assets/freesql-provider-tdengine.html-DLlbEJ4v.js",revision:"a191f36a56924ed60c4eadf9ed9d0b84"},{url:"assets/freesqladminlte.html-CJaOLma7.js",revision:"5fc341ea8bb51f1716f69a59469cf52a"},{url:"assets/idlebus-freesql.html-Dksb8tyO.js",revision:"04506609d71ad2bae1a2dbbdbc92c9e6"},{url:"assets/ifreesql-context.html-bHoHeqiq.js",revision:"a6ca3bdf143215feb8f5842920c84beb"},{url:"assets/index-Cc8Ec0XB.js",revision:"17f91d68b3c225c9f43d412f97812057"},{url:"assets/index-DGYl2PJE.js",revision:"b74447eb9dc821f0b71fbd6e80220e62"},{url:"assets/index.html-BYO-1iip.js",revision:"ca65d1c20439f164754b99fe4c54724c"},{url:"assets/index.html-CHo5hLBy.js",revision:"acf147011a38c442cc798754842d3d15"},{url:"assets/index.html-CKTLCqIG.js",revision:"48c1d42db970ad0696b973b6a4e0f654"},{url:"assets/index.html-H84OAaCS.js",revision:"49263a34ccb97f5cbe0bc346417437aa"},{url:"assets/index.html-iC9V4VtX.js",revision:"ce5c4cc9c5c734449c2362c958bd7dfa"},{url:"assets/index.html-OB84L-bK.js",revision:"9e9d3d5a0a1457051d9d5c5191c84c16"},{url:"assets/insert-or-update.html-DOI-TP4J.js",revision:"e2ee02d05243661c94dbf80136cbc314"},{url:"assets/insert-or-update.html-DTF-EsNZ.js",revision:"2f42aa44c1c163f1af67825ba76d9143"},{url:"assets/insert.html-B_zz1mvU.js",revision:"801cf5cfc70024b779a02d0fbab2eca4"},{url:"assets/insert.html-BfPM9hnK.js",revision:"1accc31662ecdd5c044bf41881a5e22b"},{url:"assets/iselect-depcopy.html-BdG3dX3_.js",revision:"047e5697a1ceb1009e117ea62eac26d7"},{url:"assets/issues-expression-groupbysum.html-Czbzl3UE.js",revision:"0b21250d168db5ffd31bcf8310fab33b"},{url:"assets/issues-in-valuetype.html-Dn8VzNgZ.js",revision:"aba39e0d887ce11bba7a9f3bf763c4a0"},{url:"assets/issues-mysql5_5.html-DFdfifkT.js",revision:"378dee6292f9a9acfdff55c4c8b3c1b6"},{url:"assets/linq-to-sql.html-FBvvsCWS.js",revision:"59633651edeff74ee3b04f1fab4d9d2b"},{url:"assets/lowcode.html-DDp2L2si.js",revision:"6e58410ed2e13ffd476f29388468e75f"},{url:"assets/lowcode.html-Nm_5oK3F.js",revision:"9f1df77ffd253c069057a648d4735120"},{url:"assets/more.html-DpTI3FG8.js",revision:"14805e3d0d168d8d4071b601aca925e3"},{url:"assets/multi-tenancy.html-BRLeEMnL.js",revision:"ce99eb082c7e110c2507fb764d9bbdf1"},{url:"assets/multi-tenancy.html-DHHlneRy.js",revision:"eed21fc871555570ac9be5ce94d6edd9"},{url:"assets/navigate-attribute.html-B0WXX9py.js",revision:"b23e0b4ca60ccdb3926e10333cdf3c22"},{url:"assets/navigate-attribute.html-C_6LH2EU.js",revision:"ae42afbcfa55937006d034e2338fb5bd"},{url:"assets/otherworks.html-DIzZlY15.js",revision:"e170c7d49f31d80a62c970ecee121f76"},{url:"assets/paging.html-DGSTzj95.js",revision:"7abb81097b7a384b9260c4a0890838fb"},{url:"assets/paging.html-mFQFO9tX.js",revision:"c188158b380a1d34c6fdd34eb31e3b56"},{url:"assets/performance.html-CIh_zaW3.js",revision:"d0e1a3b446ac4dfcb6ce31df2488688a"},{url:"assets/performance.html-DyK5yB25.js",revision:"40e2bd4b3d24643bf7c1079f4c9b9ec6"},{url:"assets/photoswipe.esm-CMg0yb1C.js",revision:"db710d3cad6b3910c961f69d701b069a"},{url:"assets/plugin-vue_export-helper-DlAUqK2U.js",revision:"25e3a5dcaf00fb2b1ba0c8ecea6d2560"},{url:"assets/read-write-splitting.html-CKQ0d5ut.js",revision:"84dd998713ae10809a8ab0fb7f9a3f05"},{url:"assets/read-write-splitting.html-DJTxxdwg.js",revision:"c219c7c591f4b0a42e8aa1d609d46d4e"},{url:"assets/repository.html-CBJUb2s7.js",revision:"396fc8cf1a9d76d48bf5550dd495d453"},{url:"assets/repository.html-WgR2Ob6e.js",revision:"511a89b9d934c59090e944cc6d0929a0"},{url:"assets/select-as-tree.html-BSuYJFCr.js",revision:"257fe8319f18f34c2a0ca4c0f5bc670b"},{url:"assets/select-as-tree.html-ffy0IjnM.js",revision:"90cac7230a0be3175e75d2ff57b960a5"},{url:"assets/select-group-by.html-Ce6dMHi4.js",revision:"29ad1f8c89f02d4e4466ef80f0235302"},{url:"assets/select-group-by.html-DtTW6T6Y.js",revision:"29c4f6e3302edda2ca7489abe6906f5b"},{url:"assets/select-include.html-DRxhQaeH.js",revision:"dbe80d19f9915850d94e199393ed9716"},{url:"assets/select-include.html-lnqAD0ZK.js",revision:"a71c4aea695bc42db4cc64dc224b2247"},{url:"assets/select-lazy-loading.html-BBP__AFg.js",revision:"952ff9ba5f4c7028e6a2a204730c542f"},{url:"assets/select-lazy-loading.html-BRR2yjJ9.js",revision:"e0efc994761f9323968fd81389f790db"},{url:"assets/select-multi-table.html-92ZH5bKE.js",revision:"bf14d6f952f5c43b73bea942e4de7be9"},{url:"assets/select-multi-table.html-Bi6Gw1Wu.js",revision:"e12f6084e5fbf852325a6ffc51df29c6"},{url:"assets/select-return-data.html-BvrqMvs3.js",revision:"1c765ac926054d0be371a452a2359424"},{url:"assets/select-return-data.html-Cnw_C3-f.js",revision:"082b0d591869a21e8b12acaa2f3d489b"},{url:"assets/select-single-table.html-C5ualBLg.js",revision:"2fb23fab71db7d589239b879d59950be"},{url:"assets/select-single-table.html-DUa8Zxcc.js",revision:"4626974a20824856acd621f2a49fe699"},{url:"assets/select.html-C6gtQM-g.js",revision:"4ef0101e4bf58e3b2ec662302080a50f"},{url:"assets/select.html-CCLiZX0W.js",revision:"a99c3441c7a6962d385a1246c17d8537"},{url:"assets/service-support.html-BXNkcFW3.js",revision:"250eb9dc6a2788fb05f086d53d629333"},{url:"assets/setupDevtools-7MC2TMWH-Dw0vOzuJ.js",revision:"5334c4ef1cd02a73c6e295d1a5737bbb"},{url:"assets/sharding.html-Ct93r7Ee.js",revision:"2b6d224e89eeb37c07acf02298114cb6"},{url:"assets/sharding.html-DIVrwD2Q.js",revision:"3609a8e01fda23cb370c9161ff77b66a"},{url:"assets/style-BNuLJv4o.css",revision:"56579e148e15e40fe0c43d8517ecfc30"},{url:"assets/transaction.html-CwcuJs0c.js",revision:"525e4bc6236ec7b19994afb1ea09b234"},{url:"assets/transaction.html-hJ_OmlRA.js",revision:"b6a118d5dc05da82a1aa1132cb3ac7ae"},{url:"assets/type-mapping.html-CJ57SY3M.js",revision:"fe6c1d7f6fd6443c1e688a705fdcbddb"},{url:"assets/type-mapping.html-CPr_Cnu-.js",revision:"8471eadeac8817b1d3dafc1b5e75c354"},{url:"assets/unionall.html-2ZiHnO-s.js",revision:"c9b2f1ce2bf2d29d390258d6a3d0fd01"},{url:"assets/unionall.html-BoOTfRaM.js",revision:"81a022b723b8474622f37149b93a2cdc"},{url:"assets/unit-of-work.html-CEoij6e6.js",revision:"3a72b2c814c1ddda32304184d59c4a72"},{url:"assets/unit-of-work.html-DDVfbSW9.js",revision:"20352d20b0ca6616faf727f771eca4dc"},{url:"assets/unitofwork-manager.html-5tAUtGS0.js",revision:"268c418f5fc5b1d052d3d79811699248"},{url:"assets/unitofwork-manager.html-T1jh37TO.js",revision:"95a55f5ba49bf425b8c7a4e6c3b30532"},{url:"assets/update.html-B6yWG6qc.js",revision:"2b8e5b7e41658816b9261b8c6c279702"},{url:"assets/update.html-C8nYHUSo.js",revision:"2b484e0348b899a158b7aa4abe05ad77"},{url:"assets/vs-dapper.html-1SoeG9Sm.js",revision:"97b74e365a89234d1b75fe6f1a5c3f15"},{url:"assets/vs-entity-framework.html-Bv9npukm.js",revision:"4ca2c41f2517437a12947f86aec83ddb"},{url:"assets/withsql.html-bAXlREbZ.js",revision:"416d18864388a2712dd17f4378e05948"},{url:"assets/withtempquery.html-C8fAD4Wv.js",revision:"297d25e3ffe8d876f5062f072abbca66"},{url:"assets/withtempquery.html-DLPC9LZL.js",revision:"7b77fc35e77e2f8a50138c3cb5f5267c"},{url:"logo.svg",revision:"1a8e6bd1f66927a7dcfeb4b22f33ffde"},{url:"index.html",revision:"c6133d506f3a38969306e71b938201f2"},{url:"404.html",revision:"b982000581eedc7b07464b744debf037"}],{}),s.cleanupOutdatedCaches()}));
