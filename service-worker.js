if(!self.define){let e,s={};const a=(a,r)=>(a=new URL(a+".js",r).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(r,t)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let l={};const d=e=>a(e,i),c={module:{uri:i},exports:l,require:d};s[i]=Promise.all(r.map((e=>c[e]||d(e)))).then((e=>(t(...e),l)))}}define(["./workbox-84c915bb"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.clientsClaim(),e.precacheAndRoute([{url:"assets/404.html-DgUR9_0z.js",revision:"24eb69bf4df9e644ad575107ef6f3ee7"},{url:"assets/AdminBlazor.html-D2Tlctk6.js",revision:"1781402df75be628e3a0e36f4e151053"},{url:"assets/ado.html-1g7fiCqW.js",revision:"4e8e3de77b42a3d4e9f1c207f38eef36"},{url:"assets/ado.html-BDNnD-Z3.js",revision:"8207413cbc02ab2dd04550451a8086f1"},{url:"assets/aggregateroot.html-CG2y6USo.js",revision:"df4aa2a62d43e9ae9679c6a53b69890b"},{url:"assets/aggregateroot.html-DHf14ek6.js",revision:"0b9bfff962b183748890f1365e8067a0"},{url:"assets/aop-freesql-autofac.html-SdP3in3r.js",revision:"e537cb2380672fb5839cfbbe6fd4e007"},{url:"assets/aop.html-921Y43wh.js",revision:"af768326f4101bd90347b4d3cedfaf16"},{url:"assets/aop.html-BQo0irXE.js",revision:"4c2274ee5b3ef64447c4daf9a596f5ee"},{url:"assets/api.html-BDQiByqW.js",revision:"55ba85c43a2262ec73325123fd696bfb"},{url:"assets/app-CMxakAQu.js",revision:"b00504388269a996e068056c3518a802"},{url:"assets/awesome-freesql.html-C5dTAHh2.js",revision:"d7b7158f3b06e7c006deebb0f81ecab4"},{url:"assets/barcode_2x1-BKjlga-s.js",revision:"7ca67cc59c4fb1b4ffce362db6dbc9fc"},{url:"assets/BaseEntity.html-DDb3QZ44.js",revision:"90987fd34551fa07975a6c13836dc690"},{url:"assets/BaseEntity.html-DZqq0pI2.js",revision:"6950d6be51c66c5692edf82c6aeee9c8"},{url:"assets/cascade-delete.html-BfaPBa9l.js",revision:"24557ea075ff7e48b12162c1f7385c43"},{url:"assets/cascade-delete.html-ctMpPZP6.js",revision:"1ff3d2d8169fc5927c42a94748d8fb69"},{url:"assets/cascade-saving.html-COG7LVaS.js",revision:"aac077dcb22488d391ee550638e60fad"},{url:"assets/cascade-saving.html-CT9aYAq6.js",revision:"30058c51e5c32eb09bbb2160801f185b"},{url:"assets/change-log.html-iACpuCVZ.js",revision:"d4f3217df96e5c9cd1a793e516e3604b"},{url:"assets/code-first.html-BnZrpqPo.js",revision:"3e39ad57383b91596c63d0d878d7ea97"},{url:"assets/code-first.html-us1bn61o.js",revision:"e68578e0b0cb8ba14f597c1f54d62388"},{url:"assets/config-entity-from-db-first.html-THvCCxp5.js",revision:"0715952c69fda5c711334972d1cbb7c5"},{url:"assets/contributing.html-DFpc8owJ.js",revision:"cd8ce3016082baab9a7c3a4c917e063e"},{url:"assets/custom-attribute.html-vPSjvECj.js",revision:"56cce37f7ea74372802fe5064a48232d"},{url:"assets/db-context.html-DmizkleP.js",revision:"d519446f919ea6a3cebae00e25f18668"},{url:"assets/db-first.html-BKRCaNBc.js",revision:"3bdf7dd695c1b6349027d7079533f878"},{url:"assets/db-first.html-DmFgZz9S.js",revision:"288212d670030997450bf56014516642"},{url:"assets/delete.html-B_lIenr8.js",revision:"0bb0340f33f87911418b2d77b48573dd"},{url:"assets/delete.html-CKjM_9mA.js",revision:"917ab284a3558b8b52fc91ffe3678e6c"},{url:"assets/donation.html-CLoy2uW1.js",revision:"0e976532b3d359ede1feba2bd5c421d6"},{url:"assets/dynamic.html--IQc7HeT.js",revision:"a5db315efa0e77960ec30edff2a2ecb3"},{url:"assets/dynamic.html-BFGXwnLj.js",revision:"991a3ababc1b17f1759e203cd79ca921"},{url:"assets/entity-attribute.html-DOYy1y5a.js",revision:"b2d57b004bdfe176cbf6eae985bbedf0"},{url:"assets/entity-attribute.html-Dtyz9b22.js",revision:"f8835c4546c9a480c89a7ad0a0c5f4de"},{url:"assets/expression-function.html-7KCeZi4e.js",revision:"cc764dc7356a8faf3736a023516d7bba"},{url:"assets/expression-function.html-YRK6Lx6l.js",revision:"79fb78473b2c50ba231e6dfcdac8f2cf"},{url:"assets/faq.html-C6ZNYrS7.js",revision:"22f332ba559521402c6268d50c11d7e1"},{url:"assets/filters.html-BiLcUTQB.js",revision:"8ab4a19da6b27a124bbe66130336b2a9"},{url:"assets/filters.html-CPILm_r_.js",revision:"67241eee5733b15ed6c8b54100b2f7e5"},{url:"assets/fluent-api.html-BoLDdHTG.js",revision:"e9ebf0db24ae912112a850d32e98ed91"},{url:"assets/fluent-api.html-JxrhG1zk.js",revision:"03ff40c5d8dcb5cd8bec44f7496a4933"},{url:"assets/freeim.html-08b3ee0y.js",revision:"15975b43f975bcb1a9738b018527ec90"},{url:"assets/freeredis.html-DcFm-NsE.js",revision:"478837179277eb54244adeb5dbf3d4db"},{url:"assets/freescheduler.html-lrwkMVTO.js",revision:"253b7b54ca3933b55f483597dd7edc33"},{url:"assets/freesql-auditlog.html-DXlUT773.js",revision:"e75b4d2b4d6d7f706aa932dbedbd3d63"},{url:"assets/freesql-cap.html-DAoq4J7Y.js",revision:"20b47393452794a83c6439390e2bb8e5"},{url:"assets/freesql-docker.html-CGe-d1H5.js",revision:"192dcaee6c938a5f3df6ab0531a2ab51"},{url:"assets/freesql-extensions-baseentity.html-THQHujLg.js",revision:"ba9f7041bfa34a6d0ef6811dcc4e2dbb"},{url:"assets/freesql-provider-clickhouse.html-D50oD4ZC.js",revision:"5c90996989cc1df48f39a72ad8eb9cd7"},{url:"assets/freesql-provider-custom.html-Baqvt6ua.js",revision:"26312a93198ea6f0fbaad346fd8dcfc4"},{url:"assets/freesql-provider-duckdb.html-CMrm53X9.js",revision:"770fa5ea0be4a3f45a9df7dad73750b3"},{url:"assets/freesql-provider-firebird.html-BwM_Y2zm.js",revision:"e23b0ad3af538e36c290c55f7cc8c013"},{url:"assets/freesql-provider-mysqlconnector.html-BnJyQf3_.js",revision:"921f7480f6060b6ee6cbc9cb98625cbc"},{url:"assets/freesql-provider-odbc.html-CEKTVqe-.js",revision:"83c84b82f0e8bf86eb28688da9ea3938"},{url:"assets/freesql-provider-oracle.html-B4AMlYJ6.js",revision:"35ecb0605b99a1c1d7b3079a73e8ce4b"},{url:"assets/freesql-provider-postgresql.html-Bl0oNwRD.js",revision:"247800578536a232bb9a84ddc8409cd4"},{url:"assets/freesql-provider-questdb.html-BSC7t95D.js",revision:"951b0e1697dd5ba293ef3428ceecee7a"},{url:"assets/freesql-provider-sqlitecore.html-0SGtjOLb.js",revision:"debcf28433952316d1e6b189cc5703be"},{url:"assets/freesql-provider-sqlserver.html-CKuugdit.js",revision:"e07690c746412bf8dd8b82ae995ffdc5"},{url:"assets/freesql-provider-tdengine.html-Ddg9om4B.js",revision:"d65261697e1feb206d5f1e183287018a"},{url:"assets/freesqladminlte.html-YofB2ajc.js",revision:"9ed69293198067d324738c4c43a61533"},{url:"assets/idlebus-freesql.html-DWykbaaf.js",revision:"193f57764b918dffc73242864989df7c"},{url:"assets/ifreesql-context.html-BtNF5wYW.js",revision:"6365c7c629001bdc02b08a7b5ecffe80"},{url:"assets/index-Cc8Ec0XB.js",revision:"17f91d68b3c225c9f43d412f97812057"},{url:"assets/index-DGYl2PJE.js",revision:"b74447eb9dc821f0b71fbd6e80220e62"},{url:"assets/index.html-BhCIRzxe.js",revision:"28c15424ea69bdc9f541e682b2f04cfe"},{url:"assets/index.html-CPdRI7un.js",revision:"48d408005393d2bd72e00d356a5501ee"},{url:"assets/index.html-CSLw69F_.js",revision:"fbe4066dc2c9b35683685154b8bce62b"},{url:"assets/index.html-CxsgVfEW.js",revision:"b02a6f940e535793e0e057d67e61a09c"},{url:"assets/index.html-DRpXj_eR.js",revision:"2f2161c60df27ff9132a545e084f2b8e"},{url:"assets/index.html-pKzBdz35.js",revision:"c37909c049f97398a1742e88db69d926"},{url:"assets/insert-or-update.html-BbR9BQOv.js",revision:"c43078a7615e7ae81b4dd80c33e5fa68"},{url:"assets/insert-or-update.html-DAe7HVBQ.js",revision:"ec7b0b0832294dfc6b42a154337f85f1"},{url:"assets/insert.html-BIMbf8x7.js",revision:"ddee1d5d07958df3537d3a6f56d85cb3"},{url:"assets/insert.html-DVpElXoJ.js",revision:"77fb4060fc40b86ad8dacabdb402dda2"},{url:"assets/iselect-depcopy.html-fOC_axwA.js",revision:"f9854d260131916e9b4399e07760e79c"},{url:"assets/issues-expression-groupbysum.html-lupNh3nf.js",revision:"2429e38b7a05fd70ebdc592d300ba1e4"},{url:"assets/issues-in-valuetype.html-CLlFnAWX.js",revision:"d87450f39e20d45c5d0554da011e1db7"},{url:"assets/issues-mysql5_5.html-BvzO0OHi.js",revision:"601e80680878762f45e28946a65e84ef"},{url:"assets/linq-to-sql.html-fr82CnmO.js",revision:"f28ad13900da062203c132b7596eabd4"},{url:"assets/lowcode.html-3C7SDPuy.js",revision:"e2d31edcc2c971ed2ac9f489519ed8b5"},{url:"assets/lowcode.html-CMRexMIO.js",revision:"33fc2af346eb1884136ac3330202f8bf"},{url:"assets/more.html-BwiFLYiV.js",revision:"c2cb9a857f9cfcda850f1072b1b70aef"},{url:"assets/multi-tenancy.html-B791P83H.js",revision:"7b762f8e9bdfeba1b29e3ca4a7307c4c"},{url:"assets/multi-tenancy.html-Q4LePSbJ.js",revision:"b9afbabb58113fa3d49864ca6e1b4264"},{url:"assets/navigate-attribute.html-C36vvaez.js",revision:"4be3f282105e3f4321eff9302497ff2a"},{url:"assets/navigate-attribute.html-DyXgFhtx.js",revision:"ac5ab031dffd3b615d50d9d32ad6388e"},{url:"assets/otherworks.html-BPhUm5AD.js",revision:"5bb809f9487910d639fe3177ca807777"},{url:"assets/paging.html-63j6ZXOn.js",revision:"9516188ff3e32ccd3db4b87bebb6a177"},{url:"assets/paging.html-uI6x_Dpm.js",revision:"1993a7f6f0127b99892bd7ee81825154"},{url:"assets/performance.html-CA1MBxCi.js",revision:"c59ff9a01cf8806d949eb88aa5e4cd4a"},{url:"assets/performance.html-CkXtwlrx.js",revision:"03dc6e2b5740f604c8f56d2193f18f5a"},{url:"assets/photoswipe.esm-CMg0yb1C.js",revision:"db710d3cad6b3910c961f69d701b069a"},{url:"assets/plugin-vue_export-helper-DlAUqK2U.js",revision:"25e3a5dcaf00fb2b1ba0c8ecea6d2560"},{url:"assets/read-write-splitting.html-CQ5t3m_Z.js",revision:"a5bedd9dd6d7379d23c689d5b5aef762"},{url:"assets/read-write-splitting.html-HCCm--Sn.js",revision:"af5fb4772cf9cf873687ce7b246b8b64"},{url:"assets/repository.html-DqADoUEW.js",revision:"086477afd13edb38d63db667f2487d31"},{url:"assets/repository.html-DYzvuWP_.js",revision:"253c93a5e958ae5c006d0b4cd1a00f80"},{url:"assets/select-as-tree.html-BS1bWChA.js",revision:"0cb9447f3dbd39d66af4e1ebbf8d2803"},{url:"assets/select-as-tree.html-DCkQsiO3.js",revision:"9fd87bf7b8c00bbd699600d3184c0b20"},{url:"assets/select-group-by.html-BiqQ2xzl.js",revision:"3a732d2ea2a43265c77219980a792f92"},{url:"assets/select-group-by.html-CtfY5-v9.js",revision:"1056da19a49930deb55651de8049bbb6"},{url:"assets/select-include.html-CFl6Ckik.js",revision:"e1dab4dbafb8541d3407587d5bb7f7c0"},{url:"assets/select-include.html-CkdRL0An.js",revision:"d4e4b33aa868cae759a50acd3724b182"},{url:"assets/select-lazy-loading.html-2XMj3SEb.js",revision:"e092f2577e5570f539317b34a852ddbb"},{url:"assets/select-lazy-loading.html-lGlNycYr.js",revision:"d8bb81b604be8ea2ba453643be03cf15"},{url:"assets/select-multi-table.html-_WTJKLeN.js",revision:"a291993afb0995613ce048b9263c0478"},{url:"assets/select-multi-table.html-o0KH8esR.js",revision:"abf92b8fad9f2ee1b4bef6f4255a19e0"},{url:"assets/select-return-data.html-B173ruF7.js",revision:"e0a69a3708f007fad25cdf7365bae7b3"},{url:"assets/select-return-data.html-BpeYrkBG.js",revision:"be46e147067b5fccd017d23b77ae41d2"},{url:"assets/select-single-table.html-DF5-i3Te.js",revision:"1fa4e722545b9b6f27a2bd67a661fba2"},{url:"assets/select-single-table.html-DfWbpM0Y.js",revision:"55799fc7b1819db0bdd9950b48693c0f"},{url:"assets/select.html-BQNetKd_.js",revision:"69b0e82a5433c5c7ad1011f243a22f74"},{url:"assets/select.html-DqeC-J8n.js",revision:"cab40375c473ec87819008546e88b34a"},{url:"assets/service-support.html-CjkdBfri.js",revision:"395d06647648c4b2a207f41cf7cfcfc9"},{url:"assets/setupDevtools-7MC2TMWH-DEYsI3jK.js",revision:"310d604a36f20964ba95c933b937a318"},{url:"assets/sharding.html-Cy87J8vh.js",revision:"5fc3a97d2af0612404ca35b9d1a13360"},{url:"assets/sharding.html-D_j4mU3V.js",revision:"3678b433d75276945d7fdbdc28d66325"},{url:"assets/style-BNuLJv4o.css",revision:"56579e148e15e40fe0c43d8517ecfc30"},{url:"assets/transaction.html-BjSELhQX.js",revision:"1524308438564f3cc6d8e85e074dc137"},{url:"assets/transaction.html-C4w0OBT2.js",revision:"a0ef75d686ec2ed673513b016d25523f"},{url:"assets/type-mapping.html-DV6iL9vU.js",revision:"2e7c62a7c5c0e9c17019ca66741ae10e"},{url:"assets/type-mapping.html-EbX4w3GD.js",revision:"a1c0695266d665d8f434821971bc37e0"},{url:"assets/unionall.html-CFfdpq1o.js",revision:"01ed498cfed1ecf35e9379592cf42415"},{url:"assets/unionall.html-DOXpB8-G.js",revision:"1d8094950261e5da229c91ec5697b56b"},{url:"assets/unit-of-work.html-DqTj2ZcA.js",revision:"6c09849a678f503dcf83074d1a8a0d31"},{url:"assets/unit-of-work.html-DRsLl2Pf.js",revision:"a808c52ec6731429ab63fdb6f92165d5"},{url:"assets/unitofwork-manager.html-B48nZar-.js",revision:"adff2411941d45842c6f08752ab92514"},{url:"assets/unitofwork-manager.html-CEPnWpLr.js",revision:"5cd7b27ed57011d01220ee695f9ce75c"},{url:"assets/update.html-j2kvfoO7.js",revision:"412d3e874f9c8bde4c2bca705fc9035b"},{url:"assets/update.html-ZpBb-Gdc.js",revision:"b9849b36be4800c95d8211f2ea48f7c2"},{url:"assets/vs-dapper.html-gOuAGaOd.js",revision:"139c5e261b6c800aefa383e2007e9be8"},{url:"assets/vs-entity-framework.html-D8RGpPcz.js",revision:"43dac5664d3d104a7f1d6dd3b49292e5"},{url:"assets/withsql.html-CMWMTfch.js",revision:"7a2adbfea94fc2782bac84f2a101de74"},{url:"assets/withtempquery.html-BsR0U_N1.js",revision:"5f74540ead1731bc5883fc2d8f63a173"},{url:"assets/withtempquery.html-DYDrkmTx.js",revision:"396c03bf9d4c2e4ac999672ff2335167"},{url:"logo.svg",revision:"1a8e6bd1f66927a7dcfeb4b22f33ffde"},{url:"index.html",revision:"207d54c7f3eb7d73247e4b86ef3106d1"},{url:"404.html",revision:"84059a4c27b04b7a69b235cd259c1fdd"}],{}),e.cleanupOutdatedCaches()}));
