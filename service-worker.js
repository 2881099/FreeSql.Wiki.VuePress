if(!self.define){let e,s={};const a=(a,t)=>(a=new URL(a+".js",t).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(t,r)=>{const d=e||("document"in self?document.currentScript.src:"")||location.href;if(s[d])return;let i={};const c=e=>a(e,d),f={module:{uri:d},exports:i,require:c};s[d]=Promise.all(t.map((e=>f[e]||c(e)))).then((e=>(r(...e),i)))}}define(["./workbox-91fa23da"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.clientsClaim(),e.precacheAndRoute([{url:"assets/404.html-5d2282d4.js",revision:"96780ee576082df1847bf965354749c2"},{url:"assets/404.html-86b43cf4.js",revision:"99271ac6ee8e1ed9bdacc87ac839aa0c"},{url:"assets/ado.html-11ab0760.js",revision:"2525cc1330e80c5936c87948ac2002c2"},{url:"assets/ado.html-a8a56a08.js",revision:"4524b4148ce668ec875a20c02367811e"},{url:"assets/aggregateroot.html-80a6c31f.js",revision:"90fa0bcdd0cc1166e57e059ba50dbab5"},{url:"assets/aggregateroot.html-b5118785.js",revision:"19ccc230fb59bb0282073a9b3277a1c1"},{url:"assets/aop-freesql-autofac.html-b0df6633.js",revision:"94c5d19e0721967608f8dfa19a9f29f3"},{url:"assets/aop-freesql-autofac.html-ecd85b67.js",revision:"b583327f27fb3990d1c7507846ebdfd8"},{url:"assets/aop.html-7adc48ff.js",revision:"20f6dbc21b9a737d8e09ec10c3c99875"},{url:"assets/aop.html-cf84b2ff.js",revision:"63101d66ce96a974c10153842f9fc45d"},{url:"assets/api.html-34490d04.js",revision:"e4fd7272c7ad5b30b21f06c9c72b426b"},{url:"assets/api.html-870692b7.js",revision:"b4594d2b99cae937aaf70741e5b3656d"},{url:"assets/app-024400a8.js",revision:"504dab22beb59b84868ced22bd61b21d"},{url:"assets/awesome-freesql.html-1652f3c3.js",revision:"0d5a67de49ef6423ffbba31e8874f647"},{url:"assets/awesome-freesql.html-92fca2e4.js",revision:"c77487b0156a4b61c6aeb9e2101776e6"},{url:"assets/BaseEntity.html-6a75917c.js",revision:"ca83a9c68d0ed5cfba64bc0be7f61a52"},{url:"assets/BaseEntity.html-91c72035.js",revision:"534b5526fb1ba2af62eebbcfa2db562d"},{url:"assets/cascade-delete.html-71ff3c17.js",revision:"09fada133fbd54c723c888ffdb7f1b6e"},{url:"assets/cascade-delete.html-b67281fc.js",revision:"ac3e9c44873d8dddacbee5ca54e7643d"},{url:"assets/cascade-saving.html-09c81426.js",revision:"bacd77f0f89c984bb75245e26a793294"},{url:"assets/Cascade-Saving.html-b8feeef5.js",revision:"fa840d139378c79fc1cd712ace315b73"},{url:"assets/Cascade-Saving.html-e70d6281.js",revision:"48eae7269fffc952a8a3ac816e673f6c"},{url:"assets/cascade-saving.html-ecb64b65.js",revision:"fbe519be872ef23e8040f454dc33f26b"},{url:"assets/change-log.html-55b42caf.js",revision:"1efee70362976511f315d80e384045fc"},{url:"assets/change-log.html-6225f943.js",revision:"3f83f74ba739dae0162ef9fbe32fa16a"},{url:"assets/code-first.html-487be93d.js",revision:"68c70ec8864c02cee62af42babe33ad7"},{url:"assets/code-first.html-c25e1305.js",revision:"3729e29c6a00c94c38640d7e9eb06546"},{url:"assets/CodeFirst-Mode.html-54d1cbb5.js",revision:"ebd420c4e400ad91bd3db6efa9241a7c"},{url:"assets/CodeFirst-Mode.html-853d1744.js",revision:"081a2f5260f78391183d468860dab2bb"},{url:"assets/config-entity-from-db-first.html-66bb64af.js",revision:"35ad647d4b72100d4ba2bf5ee302958b"},{url:"assets/config-entity-from-db-first.html-f77cef3f.js",revision:"49c409f2e2c5c5e46717bc77a3f1fa14"},{url:"assets/contributing.html-b5f5aa79.js",revision:"1273b405b868216371c8e0995c740263"},{url:"assets/contributing.html-de91468c.js",revision:"5401a9218271477ea96951a05d2e96d3"},{url:"assets/custom-attribute.html-92e10fc8.js",revision:"26a71c3b90b678dd8ab3b88ce21c6302"},{url:"assets/custom-attribute.html-cd7cd242.js",revision:"11068dfe1c492b846f22ada1f4fa24b8"},{url:"assets/db-context.html-38f62261.js",revision:"8367204077fd382bac97896d5546adc9"},{url:"assets/db-context.html-4fede4eb.js",revision:"e1a4ec8b1f62f0726c93e4ebcb30f160"},{url:"assets/db-first.html-c05e892b.js",revision:"a0b9f2c0fedd25ab6133f50893eeb743"},{url:"assets/db-first.html-c47e1db4.js",revision:"54a56d75c01d7876bf823d87f62f083a"},{url:"assets/Delete-Data.html-1e3561c8.js",revision:"35f4aa03c2c3a60087385160fbab0691"},{url:"assets/Delete-Data.html-d4f639b4.js",revision:"fe77116e5a316c00bb25a30424aaff52"},{url:"assets/delete.html-6835bb85.js",revision:"b9b8ef3aceb4eee5c64123afa8b05390"},{url:"assets/delete.html-758769f5.js",revision:"406d0372f2d5b60479db7d61a5adfc0a"},{url:"assets/docsearch-1d421ddb.js",revision:"582ce23a3b7a09735ae2e462904b2e3a"},{url:"assets/donation.html-45f7f5a6.js",revision:"12b32db0e3321f46083ad96def08ea8e"},{url:"assets/donation.html-7dedc3a2.js",revision:"39c3f4f5fa6b3d211679d65fb61a4b50"},{url:"assets/dynamic.html-84857319.js",revision:"e99e3186bf2681edcf3bc2f91d335b65"},{url:"assets/dynamic.html-8b9a17ea.js",revision:"a74a498573b3b21aff23f3153ee96a43"},{url:"assets/entity-attribute.html-5bda7b31.js",revision:"4314ccc5806a4547b2fc17cc83ba6f51"},{url:"assets/entity-attribute.html-fa8356a7.js",revision:"a7a008526b066a9bbb3514d28279547c"},{url:"assets/Entity-Relationship.html-12fa2327.js",revision:"b1989ade72cf172a3363a6ea7eaf95f9"},{url:"assets/Entity-Relationship.html-e4f58063.js",revision:"fa1e500729b467253e981eab6db27a87"},{url:"assets/expression-function.html-159d1b22.js",revision:"0e3e8c60bc97aecc37ef4ac1461a4206"},{url:"assets/expression-function.html-18ebd5df.js",revision:"8a88b55d1ab368c5abdf59ed53d0e8dd"},{url:"assets/faq.html-0a628a88.js",revision:"ae2ec23284b06d8db3534b6649aa2a55"},{url:"assets/faq.html-6a06d446.js",revision:"44d79628b22a38b544be9fb30fdd0a0e"},{url:"assets/filters.html-4f350b21.js",revision:"dee43840db3572b4c2a8e567a0d354d4"},{url:"assets/filters.html-ea442fb5.js",revision:"690afc125fbb28dd78fca050569ac391"},{url:"assets/fluent-api.html-502ea164.js",revision:"126efffa679e9ff4b8b0f97106cd80ba"},{url:"assets/fluent-api.html-52149959.js",revision:"15668f910f9a5ac58247123aac0654b1"},{url:"assets/freeim.html-0be48049.js",revision:"037b7b943ad02bacf6c62f88ce2967af"},{url:"assets/freeim.html-766278e8.js",revision:"3a69580e3a4b293b32a5f42cd7bbb5fd"},{url:"assets/freeredis.html-1355d9b4.js",revision:"5b44cc453d09c7ef2f0a8f3ea8a1a375"},{url:"assets/freeredis.html-4d491342.js",revision:"c826d3a11d011f4eb283e5c6f0c3da1d"},{url:"assets/freescheduler.html-142372a9.js",revision:"a2b3df99e8fd4122c539991a568b725f"},{url:"assets/freescheduler.html-9817f4e8.js",revision:"2d2a0a18363f7e23664b5d056a5611df"},{url:"assets/freesql-auditlog.html-a6301efb.js",revision:"0a0f5e091664faeed24988f6622dc850"},{url:"assets/freesql-auditlog.html-e13aaec8.js",revision:"d6398eb1ade03fe9df3812263c52d3cb"},{url:"assets/freesql-cap.html-1c0f07b1.js",revision:"5538d33e1ffc5b6096e2ac906a9d844b"},{url:"assets/freesql-cap.html-f53bf6ab.js",revision:"000c53161367e0a4e6abc236d55076d0"},{url:"assets/freesql-docker.html-313fa95c.js",revision:"5d07a862361f41957a15684060faab4c"},{url:"assets/freesql-docker.html-a243f90f.js",revision:"5ae4b9626caed5b4519651aa2e138782"},{url:"assets/freeSql-extensions-baseentity.html-ac7419c3.js",revision:"8de6963a6312b8da2a8578dd006706af"},{url:"assets/freeSql-extensions-baseentity.html-c0d62104.js",revision:"47212cb5ddb13afdd30e784f298f741c"},{url:"assets/freesql-extensions-jsonmap.html-aadf97a4.js",revision:"1158f381084dd83316f3571c59c08f97"},{url:"assets/freesql-extensions-jsonmap.html-e87eb7f2.js",revision:"b1a74a0d193c95a575ea9ff24647a325"},{url:"assets/freesql-provider-custom.html-e8dee0a7.js",revision:"4df67b579584bbaa258931cf74f6d407"},{url:"assets/freesql-provider-custom.html-f943d531.js",revision:"5cfdec82f0e26d30593669e4bf059cf5"},{url:"assets/freesql-provider-mysqlconnector.html-3b3bb1dc.js",revision:"802b8e531c0018b6802eba6da84575bc"},{url:"assets/freesql-provider-mysqlconnector.html-a40c3bf3.js",revision:"e9b088d1283dd5965010d4c48c6cb2e2"},{url:"assets/freesql-provider-odbc.html-6a407bca.js",revision:"01f1ac06b4bdd8416071466dda40c803"},{url:"assets/freesql-provider-odbc.html-84e73519.js",revision:"681d2d93b27d6b1fe20f8d32252aeaf0"},{url:"assets/freesql-provider-oracle.html-a7c1535c.js",revision:"b4f39dae674d1fc6242e94c933f1e99b"},{url:"assets/freesql-provider-oracle.html-f3d00d86.js",revision:"626b2620028cc6a302662f51cf7385db"},{url:"assets/freesql-provider-postgresql.html-1ce4832a.js",revision:"c394ce70623eadbde8ae8da392c4c405"},{url:"assets/freesql-provider-postgresql.html-4f0a1100.js",revision:"a009c61cefca8e8fd88b3a3466501857"},{url:"assets/freesql-provider-questdb.html-22334034.js",revision:"fc5725609ea49234af71288fa630442b"},{url:"assets/freesql-provider-questdb.html-5ed7bd81.js",revision:"c0aeaecac4cf72eabcc5eb8fa0c61e25"},{url:"assets/freesql-provider-sqlitecore.html-4dffe6f1.js",revision:"ea0e52d7b136562158c67508d8d6bad5"},{url:"assets/freesql-provider-sqlitecore.html-7533dd88.js",revision:"0599bc135adb60082283022de49af2c0"},{url:"assets/freesqladminlte.html-79ad6087.js",revision:"7fa2077d8810132f10c80769e81ee6c7"},{url:"assets/freesqladminlte.html-e30a14fd.js",revision:"93b936537c08d4e12a0beccf38262858"},{url:"assets/getting-started.html-2ee7af6c.js",revision:"b8a7fb48c336b285869196d740c29189"},{url:"assets/getting-started.html-54b72249.js",revision:"b645b51ba5256927c2a203c558ec9ccd"},{url:"assets/getting-started.html-8a517457.js",revision:"7e24ae50f8f7d1f725d67f5ba349db76"},{url:"assets/getting-started.html-f4792f5d.js",revision:"b91a0e0305060fd096242ab59b9e6b9c"},{url:"assets/Greed-Loading.html-9d0efa67.js",revision:"8591b908b245129ddbbb8683914095f7"},{url:"assets/Greed-Loading.html-f3e53460.js",revision:"dc2d44f6534e5e991cf3fb56463f89c2"},{url:"assets/Group-Aggregation-Query.html-67d02a75.js",revision:"d1739c10c30fe6da26cbe28abf353527"},{url:"assets/Group-Aggregation-Query.html-d024140b.js",revision:"dd2ea4870c0b7326a8b2cc442463cfb4"},{url:"assets/idlebus-freesql.html-3db93d96.js",revision:"9aeebd5eb84957341cb183a1faad1f12"},{url:"assets/idlebus-freesql.html-53cb61e7.js",revision:"bb30f05012b9f0630d0b24749d807093"},{url:"assets/ifreesql-context.html-4a484f12.js",revision:"02ad816de8446e4299b22ced88946cd7"},{url:"assets/ifreesql-context.html-fef42a58.js",revision:"7b25318e90596c646454a7f75bf81e72"},{url:"assets/index-d2e5859f.js",revision:"33bfc9f9df9ffd7833bc6f13e2eccee1"},{url:"assets/index-e32a7948.js",revision:"46a193641571106d3b7b43f9bc2a2735"},{url:"assets/index.html-092d8efe.js",revision:"66529bd1d8dbc4f78a93381e26952b46"},{url:"assets/index.html-1344bd39.js",revision:"a62bb8cee0bc655c3646b9bdeea56812"},{url:"assets/index.html-1e46dfd2.js",revision:"59d5926d5d7b5df77e8c86d0bee2a54e"},{url:"assets/index.html-6a77f979.js",revision:"332f4c9dc8fbca1f1a53b08a65ebcccf"},{url:"assets/index.html-6f4db597.js",revision:"66b0cd81e500a76128321e1f3620085e"},{url:"assets/index.html-78252159.js",revision:"5e018a4ab36bcdb6b7763c48ecc294c3"},{url:"assets/index.html-7abc81d6.js",revision:"41c06f77ac9a88640831813576e93d3d"},{url:"assets/index.html-83b4c2ca.js",revision:"82fd8dc667886d0a838d55a0fe511996"},{url:"assets/index.html-8dd14ce0.js",revision:"a69b2e4453a65a8f92329f4fe3099d28"},{url:"assets/index.html-a3d471bf.js",revision:"f8f6e045025fc03672238cb4bc0ecfae"},{url:"assets/index.html-c1af74a8.js",revision:"4cb69fcb93fba82c75867205f0fedf5c"},{url:"assets/index.html-c30901ee.js",revision:"4c5de4321b0645b52a62079d4dbae33d"},{url:"assets/Insert-Data.html-471033c2.js",revision:"28dac5742f3668753fe9b56796e5a26b"},{url:"assets/Insert-Data.html-57625caf.js",revision:"fc121e71c962d1a670b83fae7dd6682d"},{url:"assets/insert-or-update.html-9c97ada2.js",revision:"b95e62afcc5112bf9b988aa92680c8db"},{url:"assets/insert-or-update.html-a5a8b30c.js",revision:"dfc9185c672463584dc3a9dff13cb272"},{url:"assets/insert-or-update.html-c1c1b061.js",revision:"f431041fbe801312788d2c87e72fcc0d"},{url:"assets/insert-or-update.html-d026283b.js",revision:"fd39e421b62446978f87b99cf6485842"},{url:"assets/insert.html-d25d3d61.js",revision:"80812f2a9fd14d73cf2918470eac25f6"},{url:"assets/insert.html-f52b160d.js",revision:"a0688c22efcde5b2c985c2f279bb1537"},{url:"assets/install.html-a3910478.js",revision:"c56bd985f5bd4cdf0d7cab135cbcf242"},{url:"assets/install.html-baf03616.js",revision:"91456fb88d2950e56158c013d3767dbe"},{url:"assets/install.html-db52d19f.js",revision:"826a0f9423c0b133f524f85f795ea9ab"},{url:"assets/install.html-e9a430b1.js",revision:"8163e8cb4d29a44940fbba7631b02566"},{url:"assets/iselect-depcopy.html-8b822fd1.js",revision:"d54e1b1199c7e440ff4611fcf5e7d0e6"},{url:"assets/iselect-depcopy.html-aa07f456.js",revision:"4b3c52265a0926475ba9f0059376d39d"},{url:"assets/issues-expression-groupbysum.html-1d0ac83d.js",revision:"d9d561cd31aaf26ed726dc9e4f391044"},{url:"assets/issues-expression-groupbysum.html-e04a623c.js",revision:"9d805a0b76d4de19434479cbf6231135"},{url:"assets/issues-in-valuetype.html-0dff5302.js",revision:"e5d8197433980d04fc884f7b200bcb2a"},{url:"assets/issues-in-valuetype.html-e0d57c1b.js",revision:"22a9ef332ca8f7230e32ba3a5b79f70b"},{url:"assets/issues-mysql5_5.html-60a1cbb2.js",revision:"1e3b61f57499a4b7063e125b828a5b44"},{url:"assets/issues-mysql5_5.html-c4a6aa43.js",revision:"558d88284a2e5c1783bb8ce81c8bf09c"},{url:"assets/Lazy-Loading.html-3acf9766.js",revision:"2dc15e21aa2d10979b43ee1c1de3a8d8"},{url:"assets/Lazy-Loading.html-e28291b4.js",revision:"29fb8e019c4bdcaf41ebbaded57f0036"},{url:"assets/Linq-to-Sql.html-94c8517c.js",revision:"eb168e5f67a899481bee0ff75b34489e"},{url:"assets/linq-to-sql.html-9f075b8f.js",revision:"6f3c01a52b683e70c2fba7c1538d2e59"},{url:"assets/linq-to-sql.html-e02c1866.js",revision:"e9f5abe7c17504aa8681b460ae5d5534"},{url:"assets/Linq-to-Sql.html-f22ea998.js",revision:"f1e970fc1cc0a1e427fef01cca2adca3"},{url:"assets/more.html-2257b9da.js",revision:"d2c1cadbaf52237ae284033d953bf96c"},{url:"assets/more.html-8a0109a7.js",revision:"d02850513d5155028994b2d2849157ac"},{url:"assets/multi-tenancy.html-9fac47b0.js",revision:"1bad78d2b389d47340bd88ab85acb742"},{url:"assets/multi-tenancy.html-c135a01a.js",revision:"d6586fb772659c8aac5e6565841c057a"},{url:"assets/navigate-attribute.html-0026618c.js",revision:"72e938c6200b94ab5f3fd60a8312472b"},{url:"assets/navigate-attribute.html-601bf70f.js",revision:"4de13ced9882a6c81e1aa139325e4f81"},{url:"assets/otherworks.html-69bb946f.js",revision:"81dab7e3a1baf71e928748a2a6c90832"},{url:"assets/otherworks.html-f2685b42.js",revision:"d0567a9e8a94fedb54a809b1fa4c76fd"},{url:"assets/Pagination.html-566d0f94.js",revision:"cced9e471b2cae887cf6a816f838c0d0"},{url:"assets/Pagination.html-abd95b4f.js",revision:"73c258125af4dad33c89cad8972a5403"},{url:"assets/paging.html-45b8613e.js",revision:"2262eaa7a8f414bdfbd1e4a97b86babe"},{url:"assets/paging.html-e77e0d2c.js",revision:"17e1c10fbd6382e8db03a3080761e0f7"},{url:"assets/Parent-Child-Relationship-Query.html-2354d08a.js",revision:"8c3d3522462ab06824ce9d205a709343"},{url:"assets/Parent-Child-Relationship-Query.html-9cbf4cc1.js",revision:"06f7f5d33b20684dec9a353f3f18ca7a"},{url:"assets/performance.html-a4ad55e2.js",revision:"7977f28258f4f4f4bfcd0b031b00db24"},{url:"assets/performance.html-e1d09f35.js",revision:"616756942a2b1e0ff5b48d14c964e835"},{url:"assets/photoswipe.esm-2450701e.js",revision:"55b8097e827163367e1bb02833c0acec"},{url:"assets/plugin-vue_export-helper-c27b6911.js",revision:"25e3a5dcaf00fb2b1ba0c8ecea6d2560"},{url:"assets/Query-Data.html-bbcfbaa2.js",revision:"b890a2b576ece64947b816d7b9094462"},{url:"assets/Query-Data.html-d34ed4ec.js",revision:"e9844f8db010c7152128944e21f1b603"},{url:"assets/Query-from-Multi-Table.html-099b374e.js",revision:"79e4cf3c44d763e2f1c7518e29cab2dc"},{url:"assets/Query-from-Multi-Table.html-fe438cc2.js",revision:"da15d66cf42117b4aef0cbec96d4cd53"},{url:"assets/Query-from-Single-Table.html-95568861.js",revision:"dc95d8ee84b29111342f5746b2b9ab6a"},{url:"assets/Query-from-Single-Table.html-e399d391.js",revision:"2683de66b6b8d6e0c7cf0efbcac96ec2"},{url:"assets/read-write-splitting.html-4cbfe958.js",revision:"f3cc9307b088ecc91a4789aff9804388"},{url:"assets/read-write-splitting.html-7783d46d.js",revision:"4dcf33237e2d03f2e5fdf3af34d4105d"},{url:"assets/Repository-Layer.html-aae5a1a1.js",revision:"57d996a7ea2fd8a8a84bb94bd94a6c44"},{url:"assets/Repository-Layer.html-c728ec36.js",revision:"ece2e10b8e9cae9ff9db545a02c56b3e"},{url:"assets/repository.html-10c7a1ae.js",revision:"696448dcc59b54b880741f1ce9b5a3c7"},{url:"assets/repository.html-2378ff8c.js",revision:"7969e9a49ecfcaf153d62f5dc4551808"},{url:"assets/Return-Data.html-4a7e42f0.js",revision:"19cfc52072e02735c50efe9417a52fcf"},{url:"assets/Return-Data.html-c1421e41.js",revision:"a78450b5016d1f8ca9680af00b1ac143"},{url:"assets/select-as-tree.html-1a9e7d57.js",revision:"210a8aad52ccd573808cff6a9644add0"},{url:"assets/select-as-tree.html-aa1b1964.js",revision:"d60b98cd7133b3eae350b25c1d8cfa72"},{url:"assets/select-group-by.html-0735ffec.js",revision:"06d7e5b3cb224cf3346458f376247bd6"},{url:"assets/select-group-by.html-412dbf18.js",revision:"de1b067245481864b9be98399b607169"},{url:"assets/select-include.html-054095b8.js",revision:"4f235d3cf2447894b4c7c6353ca02722"},{url:"assets/select-include.html-1822017c.js",revision:"edc1b0c3f6fe393a5dbb9b5acde78766"},{url:"assets/select-lazy-loading.html-0671bf45.js",revision:"e2098d32aa090cd72386040b74bb5dc2"},{url:"assets/select-lazy-loading.html-dcb7bd8f.js",revision:"d0190c6aa3f5b190f92d773d095cce61"},{url:"assets/select-multi-table.html-9636543d.js",revision:"81f6fbf088e1dc5142a8e5511f006534"},{url:"assets/select-multi-table.html-a52084d0.js",revision:"dd18c178d360361fc6285fbce972542d"},{url:"assets/select-return-data.html-96380762.js",revision:"99d87884b9b830cc63b7cf6d3b6bdd62"},{url:"assets/select-return-data.html-9efbcf2e.js",revision:"a48db63276fce58da91e0ce46a846d03"},{url:"assets/select-single-table.html-29825ba8.js",revision:"019411594579c2e9b50cbffa288a6af2"},{url:"assets/select-single-table.html-7d195265.js",revision:"30c0034a6d86edd148b01d129a63726e"},{url:"assets/select.html-6ce0d86d.js",revision:"320b0c0814fe15d3b14e991dda5c7710"},{url:"assets/select.html-88031f9d.js",revision:"fad959901050cb53bcddf120b782baaa"},{url:"assets/service-support.html-395c213a.js",revision:"2a3f65304faa8423772213a2bb79d28f"},{url:"assets/service-support.html-d1180e3e.js",revision:"0366b40c8dad7e92cb9e43cf31d31410"},{url:"assets/sharding.html-d85f5e79.js",revision:"587dbf2a564b27f74a9345c9172d0700"},{url:"assets/sharding.html-df31a987.js",revision:"bb6729810fd27d6632cce5dde599c997"},{url:"assets/style-327aa9a6.css",revision:"ec2c0462b19f292afc0808346f9cddad"},{url:"assets/style-e9220a04.js",revision:"b40fc755bce11d2ee5ec6b814c802a65"},{url:"assets/transaction.html-05361d5d.js",revision:"f9b4d868a22dafeb16b5b45793c5290e"},{url:"assets/transaction.html-b160c89e.js",revision:"515441ae18dda12859fa96808516e5a5"},{url:"assets/type-mapping.html-a3647a0b.js",revision:"829d39a295b9e461bce151a7ed2a7d80"},{url:"assets/type-mapping.html-d98c3950.js",revision:"11ceafab54dacbb3cb2ca8f9e6cecec6"},{url:"assets/unionall.html-4d582416.js",revision:"c4ae91f48563716630c77403d172c766"},{url:"assets/unionall.html-866484b3.js",revision:"bb5c0a25d3fe2f5a6d0a869c2a20ef7d"},{url:"assets/Unit-of-Work-Manager.html-7e6e5a70.js",revision:"f6fd3abc4736b33fa57012c5c2fa1231"},{url:"assets/Unit-of-Work-Manager.html-eb8d0845.js",revision:"94bd5b66f5b02c4c94bd2f1b365c7505"},{url:"assets/unit-of-work.html-79ae925b.js",revision:"baebccd9a6c1ed261944b9c55f3a4632"},{url:"assets/Unit-of-Work.html-97e9830b.js",revision:"ce9972547b49511b148fb34afda0a8b2"},{url:"assets/unit-of-work.html-e1d52599.js",revision:"f5523643807e49329c2376a32e831c33"},{url:"assets/Unit-of-Work.html-ea9eae67.js",revision:"67c0faa18a7997a2b06414cbb6dd37c7"},{url:"assets/unitofwork-manager.html-7f496bac.js",revision:"b5c12ffab84624ad549f25897702155a"},{url:"assets/unitofwork-manager.html-e2704004.js",revision:"52953030f6b827381d0607c1459a0510"},{url:"assets/Update-Data.html-17b46e6d.js",revision:"f8ade1aaa0d5bde02c9663325f790588"},{url:"assets/Update-Data.html-1f238376.js",revision:"ed3dfadb324f80caf36a514985ec19bb"},{url:"assets/update.html-11c6c719.js",revision:"e6ddf77dfa0f969fa234ea302c84d7e5"},{url:"assets/update.html-c6316e20.js",revision:"f0f9c6b6248a70d4893a88d0d816d000"},{url:"assets/vs-dapper.html-88e1dadf.js",revision:"af10023217d362e210cb517a33bc9ac3"},{url:"assets/vs-dapper.html-9093c505.js",revision:"05a0ff1bfdee9083932da559fddcf828"},{url:"assets/vs-entity-framework.html-89ec9b17.js",revision:"d5bb5ab037d7b6f5dea5acdfeb89c1a4"},{url:"assets/vs-entity-framework.html-8e7b1b85.js",revision:"5d3325b42c8193d9d17ad6b258d77bd7"},{url:"assets/With-Sql.html-70018459.js",revision:"a363e828041013404ff465a6f478f5ec"},{url:"assets/With-Sql.html-f77d96e5.js",revision:"467e4bd8420c3512a68ef9c5c5c0f69a"},{url:"assets/withsql.html-62b35a55.js",revision:"ccc3787aa1bd5e81f32e48540e86ae41"},{url:"assets/withsql.html-691111f7.js",revision:"cdd6d1cade4380e4f3a4eefc6db35cb0"},{url:"assets/withtempquery.html-0852bab6.js",revision:"d59091cdb560c577856f2fe170a47c9b"},{url:"assets/withtempquery.html-d441bdce.js",revision:"bd9cf25a37e0eb40b9f3522853b3d3c9"},{url:"js/base.js",revision:"e0eaa312c6884ef5f8a21a0ecf300b49"},{url:"logo.svg",revision:"1a8e6bd1f66927a7dcfeb4b22f33ffde"},{url:"index.html",revision:"d4fe652dbbfb7911b6f45ec70066fbda"},{url:"404.html",revision:"3478bdd355132489fc63c7abae6686d7"}],{}),e.cleanupOutdatedCaches()}));
//# sourceMappingURL=service-worker.js.map
