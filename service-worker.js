if(!self.define){let e,s={};const a=(a,r)=>(a=new URL(a+".js",r).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(r,t)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let l={};const d=e=>a(e,i),c={module:{uri:i},exports:l,require:d};s[i]=Promise.all(r.map((e=>c[e]||d(e)))).then((e=>(t(...e),l)))}}define(["./workbox-84c915bb"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.clientsClaim(),e.precacheAndRoute([{url:"assets/404.html-DSkL2kMk.js",revision:"2d03d7fdf8af83c38b34eca2e8dc84c8"},{url:"assets/AdminBlazor.html-CFWVAO_m.js",revision:"6af3b45d12e7de5436ec06b0c7d227af"},{url:"assets/ado.html-BpPsFwNN.js",revision:"1b9f5b8de65a8b93b570a6040f5a718e"},{url:"assets/ado.html-DBRXIcDZ.js",revision:"d1595118d8c56ce17c0d9822022be3f2"},{url:"assets/aggregateroot.html-DDfOD8RA.js",revision:"20f3161763175737e32ea07b4f64f52a"},{url:"assets/aggregateroot.html-DPehAQXO.js",revision:"3903e984031acd1835ae0701d1387e21"},{url:"assets/aop-freesql-autofac.html-OqEsAaCg.js",revision:"faceb84a702b89735601a445d2e5d3d8"},{url:"assets/aop.html-BQlp9pH1.js",revision:"4ad2e019851792eefad5d2dbaaa9040d"},{url:"assets/aop.html-DsDo2LSw.js",revision:"7c26cb3af7ca7ffba55ce34ef5047e8e"},{url:"assets/api.html-CLw1wImW.js",revision:"53517ca24ff0cf7af3bc8f24b7d4b754"},{url:"assets/app-DBq_qZ6z.js",revision:"59dd5dbc92bec0380855de2388c2f453"},{url:"assets/awesome-freesql.html-BADMjUun.js",revision:"c09aa6096b08fe6ba6e32c717d8d7eca"},{url:"assets/barcode_2x1-BKjlga-s.js",revision:"7ca67cc59c4fb1b4ffce362db6dbc9fc"},{url:"assets/BaseEntity.html-BITVwpom.js",revision:"ead6721b0100c7ba1e3ad72e29b016d4"},{url:"assets/BaseEntity.html-BXTG9fFK.js",revision:"c8bd64bcbf761520700152baebc2971e"},{url:"assets/cascade-delete.html-CUFlx2FW.js",revision:"53d9e0c0353c976f9466392d6f8d58f2"},{url:"assets/cascade-delete.html-DSTQDp9U.js",revision:"da8c1b2942c96c27002c6509d86c861e"},{url:"assets/cascade-saving.html-Bk9HJPuu.js",revision:"1010938d35f9e46bd9a5a56322cadd5a"},{url:"assets/cascade-saving.html-D5ye9dGJ.js",revision:"9dff75cb89399bdaeb7d41f57a4f3002"},{url:"assets/change-log.html-Jz3BJfg9.js",revision:"877e25bb8899a061616a988d8ef6cd82"},{url:"assets/code-first.html-1ejcFQLK.js",revision:"4ffaed49f5add32f4b6ae1346a10bddf"},{url:"assets/code-first.html-CGHl8rBC.js",revision:"595703af815f9bc304fea4d124ae2868"},{url:"assets/config-entity-from-db-first.html-DQNBrwry.js",revision:"8686157df831fcaa0eb39edda599c110"},{url:"assets/contributing.html-CB5cHXb4.js",revision:"5424af72cbe75f2244ca11533651f5d9"},{url:"assets/custom-attribute.html-aH21snH1.js",revision:"6b1a8ee6409c7ef7ce91aa65de958f39"},{url:"assets/db-context.html-BYTbrouh.js",revision:"c1c5a4c65d82bd73c026b7994b7d960f"},{url:"assets/db-first.html-B0AX0CQu.js",revision:"b11f195c23ea48a7cdab7e05e7fb704f"},{url:"assets/db-first.html-CJ8FB2i_.js",revision:"fed6c18dda673fb50e6bd7b8194e90ab"},{url:"assets/delete.html-CiWiJSSY.js",revision:"cdb948a526e231f7e719c12ff901bbf6"},{url:"assets/delete.html-t-o3BmAl.js",revision:"4250116334c7dd74a5843049ed44a223"},{url:"assets/donation.html-Ca5zWCVj.js",revision:"4d252695fea77a9bc0b5e1afad8c1e73"},{url:"assets/dynamic.html-C0MgrcMf.js",revision:"a772e46577d69b5a6ce200a586a626e3"},{url:"assets/dynamic.html-DI1LJ2zk.js",revision:"dcf2cd55d539273c0e4b48378852e0b7"},{url:"assets/entity-attribute.html-B9CXP9LB.js",revision:"f43ad9ae560049b5da5097f1568f4e96"},{url:"assets/entity-attribute.html-G6ic6xFm.js",revision:"e3eb6eaaf57b44faf6e93dc2846eaad5"},{url:"assets/expression-function.html-C0VwL2Z5.js",revision:"815cfba698ea7ac24a72ca0c822adc0b"},{url:"assets/expression-function.html-DJwmzXXp.js",revision:"1e39f14f386580530f93aa72851dacd0"},{url:"assets/faq.html-F5youjbs.js",revision:"96090b4c28eb78c7d85e0151a2d0231d"},{url:"assets/filters.html-Bk20WLfx.js",revision:"a0a67c4503bcadd29edc9d965183ea72"},{url:"assets/filters.html-MCmLS-Ys.js",revision:"1c5825d924a22e5f621f2d609b03d605"},{url:"assets/fluent-api.html-BQEvJbJZ.js",revision:"e91c9fd0a93d2de96590f7407a42eb8f"},{url:"assets/fluent-api.html-DK0K1wb3.js",revision:"b9240d029baf3294b2f5060e030bcd9a"},{url:"assets/freeim.html-j5Lf5z4S.js",revision:"f6a100645a922a5f3678243a44d69b33"},{url:"assets/freeredis.html-OB3S55OY.js",revision:"b95c5fd158fb4b64f6ba02fb59436c7c"},{url:"assets/freescheduler.html-D7kek55c.js",revision:"3ed19523000406919aed0003c32335cf"},{url:"assets/freesql-auditlog.html-Dmyky6po.js",revision:"4dd71283ee5374abe38686bfcc5b893e"},{url:"assets/freesql-cap.html-CmPSlM-V.js",revision:"dcda5c09b75639042b4b2f97a1054cbe"},{url:"assets/freesql-docker.html-BO9-V6By.js",revision:"30feb9510a078254a8bbb536fda41c3b"},{url:"assets/freesql-extensions-baseentity.html-DJQNFLa4.js",revision:"836e0771986167d032718d9e4db546f8"},{url:"assets/freesql-provider-clickhouse.html-DTobTCPU.js",revision:"9849bfdcc7c9d2d482038d839ac9c4ed"},{url:"assets/freesql-provider-custom.html-DJhmeVqG.js",revision:"e3242f760b867870b564575366707fe5"},{url:"assets/freesql-provider-duckdb.html-BEsbhARH.js",revision:"135ff282eb387a11f3892e26c32384e6"},{url:"assets/freesql-provider-firebird.html-D5PmMJV9.js",revision:"585d8d7db02dbc150579a90d69d970bf"},{url:"assets/freesql-provider-mysqlconnector.html-BX8t1nkZ.js",revision:"1deb8781f5863f4aa4b2990e07275652"},{url:"assets/freesql-provider-odbc.html-2Wl8Tk81.js",revision:"5687d680ee006779585d4837a71daeb6"},{url:"assets/freesql-provider-oracle.html-BoUcD44S.js",revision:"8f1fbfd282b31b8aba138c192dd18d0a"},{url:"assets/freesql-provider-postgresql.html-BBgWymXk.js",revision:"ef89f6bd57cf8968eaee332aada751ea"},{url:"assets/freesql-provider-questdb.html-DxNzJz0G.js",revision:"887793acdc62734c18a330b3b043b5ea"},{url:"assets/freesql-provider-sqlitecore.html-xMpNNYph.js",revision:"e9652462243fc9af4b379be0ef1b0c7f"},{url:"assets/freesql-provider-sqlserver.html-BIGSenGC.js",revision:"e2aade8a45a23d649ed477bc9a7a0547"},{url:"assets/freesql-provider-tdengine.html-DLBQXyhg.js",revision:"d5c3919a42d4b104cb86a3df5915bf82"},{url:"assets/freesqladminlte.html-C4RSfF4m.js",revision:"a82f3e87e79692e39aeee8b8218f150c"},{url:"assets/idlebus-freesql.html-C_RD8xir.js",revision:"01143f0ceb1225fa6ae18ae0e786f76a"},{url:"assets/ifreesql-context.html-Ca24Uf-p.js",revision:"9078d334a98997724df592c120108b7a"},{url:"assets/index-Cc8Ec0XB.js",revision:"17f91d68b3c225c9f43d412f97812057"},{url:"assets/index-DGYl2PJE.js",revision:"b74447eb9dc821f0b71fbd6e80220e62"},{url:"assets/index.html-BAg5xGBo.js",revision:"3b8b17314e6f4451fbe8cf4da8c44502"},{url:"assets/index.html-Bwzu0OUJ.js",revision:"ddde500c1f1b8230bda860414c27aca5"},{url:"assets/index.html-CdwCZnXL.js",revision:"115b41aaa0c972ec85c7b8e5052bd694"},{url:"assets/index.html-CghaF0e7.js",revision:"02ab92a76078ed9ae9689b3981c77d24"},{url:"assets/index.html-DRgoURZ7.js",revision:"da4888adcde20f577e61aeb17db3ea16"},{url:"assets/index.html-n6VLOaTw.js",revision:"88f9be642435fb02f2ef909b73998303"},{url:"assets/insert-or-update.html-C3G6mYK0.js",revision:"eb16f7887d80008785c4753b57962437"},{url:"assets/insert-or-update.html-DhMr5CNh.js",revision:"e4fb4e727e36147bd7625dbd54cd0b95"},{url:"assets/insert.html-050jsYwU.js",revision:"8c8b6d5b5241e6fc2810bef49e631c6c"},{url:"assets/insert.html-DFxPr6d6.js",revision:"888650195509ac2ad148dd0c6268662f"},{url:"assets/iselect-depcopy.html-BPuZHgiW.js",revision:"1117f244e58b56d13c0f22b722f3a777"},{url:"assets/issues-expression-groupbysum.html-DysImPvI.js",revision:"aca23a4d1a6e2a3b3b4db4d3695f93cd"},{url:"assets/issues-in-valuetype.html-pzJ4ZSyR.js",revision:"b6f5133ea24bdf513575330de9dcef1a"},{url:"assets/issues-mysql5_5.html-CoXaJjFo.js",revision:"a183835e817256598947e2961eac0f3a"},{url:"assets/linq-to-sql.html-CIB-XbCC.js",revision:"54d5ec6de2c5e1c168436bebb0da41ad"},{url:"assets/lowcode.html-DC27avkE.js",revision:"ce6565a96ec85a079942e444cf816acb"},{url:"assets/lowcode.html-tnoGFXmk.js",revision:"30144932a7111b211aea34e22cdba98b"},{url:"assets/more.html-BJJgBhk7.js",revision:"a608aa1700a1a0e182b9e99a0ed65189"},{url:"assets/multi-tenancy.html-BI448VhG.js",revision:"545c3b65eff0151d0aa5be5db0a1a745"},{url:"assets/multi-tenancy.html-CrwPlZ4p.js",revision:"0da0275ce492cd8396b432255591e91a"},{url:"assets/navigate-attribute.html-CBdZ1xp6.js",revision:"e84d546862f05fd5b32ff23d310e6c64"},{url:"assets/navigate-attribute.html-CXvNkbAW.js",revision:"42d6cd4d734ebeab3e2458095cdc8f66"},{url:"assets/otherworks.html-9bAmUKXJ.js",revision:"24740bfa66fbd0de360dec90783b4964"},{url:"assets/paging.html-DpGy9qUX.js",revision:"0cd295414d278dbb21f8610eb110973c"},{url:"assets/paging.html-LHYTJGEC.js",revision:"d498760a2b5d742e9a1c627f69825ba7"},{url:"assets/performance.html-CjHccyTH.js",revision:"4cdf87c168a117ce762c0be82d53db46"},{url:"assets/performance.html-DMx-ZSil.js",revision:"9183e5f8613f1a3af1a63fbbcb20df46"},{url:"assets/photoswipe.esm-CMg0yb1C.js",revision:"db710d3cad6b3910c961f69d701b069a"},{url:"assets/plugin-vue_export-helper-DlAUqK2U.js",revision:"25e3a5dcaf00fb2b1ba0c8ecea6d2560"},{url:"assets/read-write-splitting.html-BxMiveKY.js",revision:"61a0ef97455e48b3968833b633187c92"},{url:"assets/read-write-splitting.html-CUYF5e9H.js",revision:"9dda6846710918983e7e9672ce4db154"},{url:"assets/repository.html-Bf8qc8su.js",revision:"391f5cea2083ecc622019a11517be39e"},{url:"assets/repository.html-DBnIYDNe.js",revision:"98b2b537d72d74773ffef1dfb34ffbe7"},{url:"assets/select-as-tree.html-B44dn8ZF.js",revision:"f3c6be4500968a80bd07342d42317a39"},{url:"assets/select-as-tree.html-BOdrWWKc.js",revision:"d1a619e8f93b7c34ca762ca1b437b070"},{url:"assets/select-group-by.html-CnrTve7A.js",revision:"0f80c10193cd0de2a689d8e5c713ea9f"},{url:"assets/select-group-by.html-DR2sP8Za.js",revision:"34f40840cd31747c26e1e827a87a8899"},{url:"assets/select-include.html-BVOgTjHi.js",revision:"75b8d2fc96470e4cce6d4df7d2e6079d"},{url:"assets/select-include.html-oxlowGNa.js",revision:"d43f67c7162ee29030b297e2966ab0a8"},{url:"assets/select-lazy-loading.html-LW8RX9NT.js",revision:"c5846582c8367073ae46cfc3af74c6da"},{url:"assets/select-lazy-loading.html-PV00Ljrn.js",revision:"b89ebb764144bfc8863644b72671165c"},{url:"assets/select-multi-table.html-B0qVWCGu.js",revision:"da569e14431c385ed32c292b67338aa6"},{url:"assets/select-multi-table.html-Ck5KEMYD.js",revision:"239dbdaf22dcafd05a5f2b99e55c9073"},{url:"assets/select-return-data.html-BzIxA-QF.js",revision:"59ab5906faa7d1f20416db769cbae5ec"},{url:"assets/select-return-data.html-CqPSRVJU.js",revision:"29d495031545f38e9e6d1fd42ef4489e"},{url:"assets/select-single-table.html-CP68OrSz.js",revision:"a74c69499c61a044a1f7b79d1074af8c"},{url:"assets/select-single-table.html-Rhgh70x_.js",revision:"7d3e08b9cc198aafa83c2788623f854d"},{url:"assets/select.html-DAGaopjf.js",revision:"0c6645b08e81eac499e6745c1b615256"},{url:"assets/select.html-jbOZKLb0.js",revision:"ca0fe58602a3da6b2ce0d0eb65702e9e"},{url:"assets/service-support.html-Jk4TWWLK.js",revision:"f55919716a185e68f162f2a94ab6eab9"},{url:"assets/setupDevtools-7MC2TMWH-Dz57JVY7.js",revision:"b75faa5c4ec070890a46f8b8f1acd163"},{url:"assets/sharding.html-B4dWNLS3.js",revision:"81c795917aae402fed493c5dc783dee7"},{url:"assets/sharding.html-D8dKvFYI.js",revision:"09c7178db0f47c912ed381373279a433"},{url:"assets/style-BNuLJv4o.css",revision:"56579e148e15e40fe0c43d8517ecfc30"},{url:"assets/transaction.html-B0eBSLoN.js",revision:"a00cd336d924c949da89247892913296"},{url:"assets/transaction.html-Ck_Cu2fJ.js",revision:"1064429d669533f18b96ad810d104882"},{url:"assets/type-mapping.html-CdTr9Fdy.js",revision:"9e58533748024ed0c949b299afb7d9b0"},{url:"assets/type-mapping.html-DpklBIZo.js",revision:"cd0e5bd255eb824a366a711e69db3231"},{url:"assets/unionall.html-C8HsQxao.js",revision:"cc2f66a7f322ee3908a171171ef1d02f"},{url:"assets/unionall.html-D1P2yJ8w.js",revision:"08d9135025efc29d9547690880bf9000"},{url:"assets/unit-of-work.html-DxvsGtnC.js",revision:"5ab9f1f05ff282bfa6a0cc81a9f4dd5e"},{url:"assets/unit-of-work.html-tjZvbBYf.js",revision:"edaf51913b6d5ecd2999226623a1a026"},{url:"assets/unitofwork-manager.html-BSZiQpEi.js",revision:"956ba3600f6afa886b3a1b8e789e154d"},{url:"assets/unitofwork-manager.html-CXNGPRNh.js",revision:"b0fce50de795889ae36ccdb062622a86"},{url:"assets/update.html-B7QfiYM8.js",revision:"ac08bec5af4f6c92f4be7023d8e21953"},{url:"assets/update.html-D7V-rnvf.js",revision:"fbd82012a6348b797b52a59630e3fca4"},{url:"assets/vs-dapper.html-CSk8loW9.js",revision:"1690732c7253cb30bdd6e1761ee0ea16"},{url:"assets/vs-entity-framework.html-yxlO7MJQ.js",revision:"ccb011e2f41c55e025e2dd7a2c337436"},{url:"assets/withsql.html-BGm3cQJY.js",revision:"d78f8ec111b3f733cc83635e9d7c0db9"},{url:"assets/withtempquery.html-C9AD5eIG.js",revision:"b49fd47e0ce5af2ff69e3cfaab6c2c2c"},{url:"assets/withtempquery.html-D2BCCbt8.js",revision:"e0557e24ae9f00acc1772c45982e6f45"},{url:"logo.svg",revision:"1a8e6bd1f66927a7dcfeb4b22f33ffde"},{url:"index.html",revision:"67603740558cddf8125abc2a7fc8f585"},{url:"404.html",revision:"665f39c96f83b75f577d8bf5cca0e7a5"}],{}),e.cleanupOutdatedCaches()}));
