if(!self.define){let s,e={};const a=(a,t)=>(a=new URL(a+".js",t).href,e[a]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=a,s.onload=e,document.head.appendChild(s)}else s=a,importScripts(a),e()})).then((()=>{let s=e[a];if(!s)throw new Error(`Module ${a} didn’t register its module`);return s})));self.define=(t,r)=>{const i=s||("document"in self?document.currentScript.src:"")||location.href;if(e[i])return;let c={};const l=s=>a(s,i),d={module:{uri:i},exports:c,require:l};e[i]=Promise.all(t.map((s=>d[s]||l(s)))).then((s=>(r(...s),c)))}}define(["./workbox-84c915bb"],(function(s){"use strict";self.addEventListener("message",(s=>{s.data&&"SKIP_WAITING"===s.data.type&&self.skipWaiting()})),s.clientsClaim(),s.precacheAndRoute([{url:"assets/404.html-CJyLTmUI.js",revision:"dd5ddc0bf79f716d015dd9f3319ddf41"},{url:"assets/AdminBlazor.html-CD8TTvNv.js",revision:"6d9597a20ccf9b52b038f844ddc156f2"},{url:"assets/ado.html-Cn3OIrqq.js",revision:"c28039dd82e4bacba6e526d0a4604600"},{url:"assets/ado.html-pTRCdSAe.js",revision:"3aec0e9bc8329ceea94124b385709c9d"},{url:"assets/aggregateroot.html-B-jt8MA_.js",revision:"77a9dc48f29e1a0e7e2a4e867a8b2faa"},{url:"assets/aggregateroot.html-BSU9QCr6.js",revision:"68e0142cd511791245208b0014ecfdc5"},{url:"assets/aop-freesql-autofac.html-DgB5qi3M.js",revision:"800e08e4d1e77cadd65bef4bd63c5c9f"},{url:"assets/aop.html-Bwo0wh7z.js",revision:"1ead452f420028cfd306f9e87876ceb3"},{url:"assets/aop.html-DzE5bihe.js",revision:"7359489273b5d55fba26ba1ea4af2712"},{url:"assets/api.html-C0ukRvkt.js",revision:"fddaf5870191cbd822cc60db8c68e648"},{url:"assets/app-C_szjB8m.js",revision:"71d457a4857d04528f9e93335b985508"},{url:"assets/awesome-freesql.html-D3XdEEXU.js",revision:"e9bd3da73e615c93065143a961fe1a78"},{url:"assets/barcode_2x1-BKjlga-s.js",revision:"7ca67cc59c4fb1b4ffce362db6dbc9fc"},{url:"assets/BaseEntity.html-BDSN_A7F.js",revision:"a29e60b9ed2cac1efd335dc42ef8a785"},{url:"assets/BaseEntity.html-C3vCyB2e.js",revision:"81b381346c602cc6700ed129effc7a97"},{url:"assets/cascade-delete.html-DeOqyLCz.js",revision:"b23c6a7f2023adacaaac39e747e5f26c"},{url:"assets/cascade-delete.html-szWdeOO9.js",revision:"d48f3284cdfdf056558a7545d504f207"},{url:"assets/cascade-saving.html-B0E6YBFj.js",revision:"11cce06823baa59230039a79e4407206"},{url:"assets/cascade-saving.html-Cavf97gC.js",revision:"9f027dfd045bed3eb4f1121c3ffaae50"},{url:"assets/change-log.html-CKa_abVu.js",revision:"6973075f767e706bbce9e867a03992fb"},{url:"assets/code-first.html-DcY55Ema.js",revision:"05cdf8b663e66ce359a3560acbda4716"},{url:"assets/code-first.html-WOCCV1cG.js",revision:"586df1852a737a3a08a0394d101ad753"},{url:"assets/config-entity-from-db-first.html-CmI_oZMI.js",revision:"07eb50715536b3c2845581b7f74e0b59"},{url:"assets/contributing.html-DgN5ntxY.js",revision:"8503cebdf28db6b5e5fdc05d3bacc4e1"},{url:"assets/custom-attribute.html-BxD4nJDz.js",revision:"3ca3ae90f11434146a71528a6b4c46fd"},{url:"assets/db-context.html-BkPj2fDt.js",revision:"b030d78b51165fc1f60dee0f61316453"},{url:"assets/db-first.html-DGwDCBt_.js",revision:"2f49484e74201ce53de2b864f8f3312b"},{url:"assets/db-first.html-ex1Wkg7G.js",revision:"da265cbfa686897a3db6a6f224ce6edd"},{url:"assets/delete.html-BgfC-g3a.js",revision:"24669719b542ba838cd3dd387c914180"},{url:"assets/delete.html-BOqlPTm4.js",revision:"681d2d25792159553155366c19eec3f8"},{url:"assets/donation.html-wVOQaQG5.js",revision:"cf154029d6fed13cb8e8aac9e04f478a"},{url:"assets/dynamic.html-EoaBUo1g.js",revision:"0210e87db7d182dff5d9a5354dd6f171"},{url:"assets/dynamic.html-MUsxYHZQ.js",revision:"1a34ab4797197eb5243a0e85c3850004"},{url:"assets/entity-attribute.html-BvnB8Xpl.js",revision:"fbeebb137cb6af83161055f753a23caa"},{url:"assets/entity-attribute.html-Jn3cYqEJ.js",revision:"1c55960f49e1f194d53b225c70697f06"},{url:"assets/expression-function.html-CHAGodD4.js",revision:"f9238c1d9b500b429bf6aee2282351d9"},{url:"assets/expression-function.html-D1ht3z4K.js",revision:"850af5e679608474f010453189aebe66"},{url:"assets/faq.html-B-qAmdqS.js",revision:"154c87c5a6f0678ec01e2807b027ef70"},{url:"assets/filters.html-Bw0aeWuE.js",revision:"e871b48795b3e7ee03a54bbfc56c2900"},{url:"assets/filters.html-UVLavcvk.js",revision:"36b4c60a06be906c83367fba83f4b23a"},{url:"assets/fluent-api.html-1y8u4Mht.js",revision:"c4c2b016c208f670035dede1fc9c8f6b"},{url:"assets/fluent-api.html-BHmfHaaK.js",revision:"254dae12fe4c61b0c469c5779731a007"},{url:"assets/freeim.html-DL6RGXIc.js",revision:"c0153ecd30cc1d474c21fa5abf3d6e50"},{url:"assets/freeredis.html-DlzAk99B.js",revision:"e4ea4a034c470c0c71538104d79ca104"},{url:"assets/freescheduler.html-D3fOQWte.js",revision:"4a30ddaeb92c8dbf60cc02e460006cae"},{url:"assets/freesql-auditlog.html-CUZO1AAU.js",revision:"b2b95d4cf8bcfba600e7022cb8b29f0b"},{url:"assets/freesql-cap.html-CCsgYz5T.js",revision:"cf42cca81d84a41f3ead1211b7990a74"},{url:"assets/freesql-docker.html-CsHNraPO.js",revision:"014be8615e1b50868a7cf4c0f04a8249"},{url:"assets/freesql-extensions-baseentity.html-CVtByTJK.js",revision:"ca2b5c1906f4a99b7250aba81e303551"},{url:"assets/freesql-provider-clickhouse.html-Dta9PMCa.js",revision:"b6a56c3ea02e2a7a35a38238bee64fd1"},{url:"assets/freesql-provider-custom.html-LggHbk-9.js",revision:"e1549349cc98867fb2fd1291182e258a"},{url:"assets/freesql-provider-duckdb.html-DLsSGAmI.js",revision:"b2b129f3b72c3672b209216f8f295a23"},{url:"assets/freesql-provider-firebird.html-CWw9LXpn.js",revision:"a68f5a25bd28ab1184e56cadc6f474ad"},{url:"assets/freesql-provider-mysqlconnector.html-1pcla5BW.js",revision:"65d686b47ce7abcc7b3d5e77dbb0c21c"},{url:"assets/freesql-provider-odbc.html-DdVp_VAO.js",revision:"bfcb95268b167881c6abfcc5d6dcda9c"},{url:"assets/freesql-provider-oracle.html-niAgy4a9.js",revision:"c2efc80c738c0051d784c9534ce870d6"},{url:"assets/freesql-provider-postgresql.html-oyOA56QQ.js",revision:"e7114378f78e5364a88ebb12dbe275ca"},{url:"assets/freesql-provider-questdb.html-SnjFSGQz.js",revision:"ded2a0d9c97dedfd628109091f368c81"},{url:"assets/freesql-provider-sqlitecore.html-B33vlLyo.js",revision:"fbed9d35f3c421e6cc767d83c66a9051"},{url:"assets/freesql-provider-sqlserver.html-CG8nM_fO.js",revision:"a9f61470fd31fcee78796d653cba90f4"},{url:"assets/freesql-provider-tdengine.html-CPStj9K4.js",revision:"8f44156e6a579b84df4b1f88ab84bbfa"},{url:"assets/freesqladminlte.html-DXL_DYtW.js",revision:"47d4cb7d69d88032624cbbde631373ff"},{url:"assets/idlebus-freesql.html-DdThExe6.js",revision:"d3358eca76c67e3808a58304cb2d7165"},{url:"assets/ifreesql-context.html-Ciywl9w7.js",revision:"65faf3f8056e3c5056098aef6f353ebe"},{url:"assets/index-Cc8Ec0XB.js",revision:"17f91d68b3c225c9f43d412f97812057"},{url:"assets/index-DGYl2PJE.js",revision:"b74447eb9dc821f0b71fbd6e80220e62"},{url:"assets/index.html--KeEDomP.js",revision:"7a839678aa80bb56885d6ccf00d150bf"},{url:"assets/index.html-3bhR37Nf.js",revision:"eb43c752b12d5372d0ea47ebf009f38a"},{url:"assets/index.html-BUetRalD.js",revision:"55bda63b24e76f8570110c0ac2ef8525"},{url:"assets/index.html-Ck06Anz5.js",revision:"5887b20c1fe03171326e0d514c573123"},{url:"assets/index.html-CqVTa0e-.js",revision:"705b61d78bd649dd7430f59a9d24c91f"},{url:"assets/index.html-rOMMFTSx.js",revision:"3d198444706c67c0fb6ffaad0db180b3"},{url:"assets/insert-or-update.html-Dgb4tzsp.js",revision:"4bc57cb37a46b74e7484575a04eecdc5"},{url:"assets/insert-or-update.html-uawgARpR.js",revision:"47f553b5572f4b4059d38777840c9b0b"},{url:"assets/insert.html-C8hMDW-e.js",revision:"079fba37117077c3f558d39731dce684"},{url:"assets/insert.html-DLtyaYEf.js",revision:"a6c6ef93614161206d9965e43c5b0c8d"},{url:"assets/iselect-depcopy.html-DIUXbcto.js",revision:"98fdcec7f10f36522b958acad545dfb8"},{url:"assets/issues-expression-groupbysum.html-Bnsy-uoL.js",revision:"d0ae7d44aed5d1f2e2a87381fdf9758d"},{url:"assets/issues-in-valuetype.html-CORcfGwK.js",revision:"d8023fb1f26f031067cf4e44d8f04147"},{url:"assets/issues-mysql5_5.html-CWmxBDvF.js",revision:"025cd4facac17a67b039dcfd69a31f52"},{url:"assets/linq-to-sql.html-ChzcQFzO.js",revision:"72932b7328b67e7a77ff2286805006cf"},{url:"assets/lowcode.html-39N6DkOh.js",revision:"a1ad3940f54277da10aa82965dcb59e3"},{url:"assets/lowcode.html-CXMRMHst.js",revision:"2ae138a6dcab7f1a868bed47ebf7fff2"},{url:"assets/more.html-BQzm4BKs.js",revision:"7f55cfc986ee977e01794e266dd3bc30"},{url:"assets/multi-tenancy.html-8DowUWxX.js",revision:"37505e230ca82939de6eead6159abcd4"},{url:"assets/multi-tenancy.html-DHEFJ0Zl.js",revision:"02e10f5977856785286d9713e725b783"},{url:"assets/navigate-attribute.html-BSt-U0At.js",revision:"c31438b8a57720ef3f5b9ced0764615c"},{url:"assets/navigate-attribute.html-DzZgWh_t.js",revision:"8ed8da40a08e0e70c74abf4c06962d38"},{url:"assets/otherworks.html-BILfQVjC.js",revision:"d0419ba7dc0299953a42820953ea5676"},{url:"assets/paging.html-BvdXeU_m.js",revision:"3e5f17163dc898b9cfc11aaf1ed05399"},{url:"assets/paging.html-C1U7ZjgE.js",revision:"9b0175d6bbff7cdce6b3b5df491faa42"},{url:"assets/performance.html-BLxzWJuB.js",revision:"0ddad9f4405ea3cc3d5d722ad205565d"},{url:"assets/performance.html-DPBDgDdt.js",revision:"7cdd490e1974c542ed43d1f72faeb69c"},{url:"assets/photoswipe.esm-CMg0yb1C.js",revision:"db710d3cad6b3910c961f69d701b069a"},{url:"assets/plugin-vue_export-helper-DlAUqK2U.js",revision:"25e3a5dcaf00fb2b1ba0c8ecea6d2560"},{url:"assets/read-write-splitting.html-MrA0fb-O.js",revision:"8c6b04f2334e6a8a41f995f32eb41784"},{url:"assets/read-write-splitting.html-R1D6Rlnh.js",revision:"33fa308a812b74a66af2cbebe5c6ba3c"},{url:"assets/repository.html-D1ZSSjFA.js",revision:"47fa6a308adaf4d63c4f68acf8f939fc"},{url:"assets/repository.html-kCm9wA1x.js",revision:"d192bc13ff7954351291768b87e290ef"},{url:"assets/select-as-tree.html-BGLIinat.js",revision:"32d867c1a9422080e4b5f8d1caba74fc"},{url:"assets/select-as-tree.html-C6dmJhF-.js",revision:"8a1618a1f0c0c9ceaf2343929b5fae8a"},{url:"assets/select-group-by.html-7Y23j4az.js",revision:"5aa27f7d50091b76059e0e918f2beaf8"},{url:"assets/select-group-by.html-DNTy8e4t.js",revision:"4ffc49530c8e92973f4c8ad8e8037b5e"},{url:"assets/select-include.html-CNSKvUR9.js",revision:"99682ee3bdc2574716227faf50710693"},{url:"assets/select-include.html-p-u01z4U.js",revision:"825a6e9085ef99c6f064dce2ff19c835"},{url:"assets/select-lazy-loading.html-D19EPZpo.js",revision:"faf53727800305a67347b22b3faf9670"},{url:"assets/select-lazy-loading.html-phn8YK_R.js",revision:"944784a9aaedb92942600ebfe1893a68"},{url:"assets/select-multi-table.html-CGRh6bEv.js",revision:"79ee02b6c0578741087db19c20a1dca3"},{url:"assets/select-multi-table.html-CJKdBOxs.js",revision:"40e673fb730414dbc99262b5982e08ac"},{url:"assets/select-return-data.html-C4jMzkf5.js",revision:"b91dd853d61cec9d7a5f87c329f7cbd0"},{url:"assets/select-return-data.html-HHdyDMaE.js",revision:"27a34382a43ea7866bf625fa045dae6f"},{url:"assets/select-single-table.html-BETNknUY.js",revision:"d8967bb98db7b6d9ebca4cb6fa8b6111"},{url:"assets/select-single-table.html-gTcGkVxw.js",revision:"b258d94a152df3dc534e2ef8f2dd0f0d"},{url:"assets/select.html-92bHdEk4.js",revision:"1113d8505ac6d41182ab2a71f89bb5de"},{url:"assets/select.html-BKodacfi.js",revision:"3816d1f545d60c4bb8b254f53cf1768f"},{url:"assets/service-support.html-DEjDn_ij.js",revision:"6e867fff006765f0cd1897ac2613351a"},{url:"assets/setupDevtools-7MC2TMWH-DikLQagE.js",revision:"bb4f67229a5275c598c598ad0e152964"},{url:"assets/sharding.html-CQ340A7G.js",revision:"027315c5f17559e21c7bd757d6f79817"},{url:"assets/sharding.html-DrX08cgN.js",revision:"9752aef7ad96032c58dab096ebcb991b"},{url:"assets/style-BNuLJv4o.css",revision:"56579e148e15e40fe0c43d8517ecfc30"},{url:"assets/transaction.html-B8vECYAb.js",revision:"752ac130f7d863b36229cbe963ede201"},{url:"assets/transaction.html-BhOvqrRr.js",revision:"65db5f9c6a1e839dd3e974c410c73322"},{url:"assets/type-mapping.html-aEaZWW7F.js",revision:"a714339c354fb86032ca79dbc85aac9f"},{url:"assets/type-mapping.html-DCZVFE-i.js",revision:"2b49fb19dc4065eeff315e8370b46c00"},{url:"assets/unionall.html-1wFHEjmO.js",revision:"3e74a7636c1868d213cf014ecf2f7a1f"},{url:"assets/unionall.html-CKxtLgD8.js",revision:"83326da094b507016142849fbbb285d8"},{url:"assets/unit-of-work.html-CVvT_AB3.js",revision:"61bd831920cd273b6b38b0269d728440"},{url:"assets/unit-of-work.html-zKt9zLTR.js",revision:"fc865a1c871a02a3d0bfa8913b2e97f7"},{url:"assets/unitofwork-manager.html-BmlYdFj8.js",revision:"7f6726328479bb7fe4171cb01fddfd17"},{url:"assets/unitofwork-manager.html-CfDY9G9g.js",revision:"a3a75f6599847cbc0777486b7cb81475"},{url:"assets/update.html-CGWk5TIo.js",revision:"106e1e058c0ef800c640d3273d23c2a5"},{url:"assets/update.html-FyZI5SOq.js",revision:"e00382d8fbada5648210c4675c600f8b"},{url:"assets/vs-dapper.html-CGAUkhsj.js",revision:"37e8dfac55b4c47e327515f2b4f8195e"},{url:"assets/vs-entity-framework.html-B72ulX2-.js",revision:"7daee683dd0d7f841d3ef51b9311cb77"},{url:"assets/withsql.html-BBnjk02p.js",revision:"a955ba8ae1200e21c04cbc24377bfb53"},{url:"assets/withtempquery.html-CIhTcEB0.js",revision:"2d37f9e30fd6e19f8c2ee838f3c8ce44"},{url:"assets/withtempquery.html-d8-OR7L5.js",revision:"b7fe75a0f6473baab32bc6a55c61df0b"},{url:"logo.svg",revision:"1a8e6bd1f66927a7dcfeb4b22f33ffde"},{url:"index.html",revision:"c19c40f01c5736f3af22d06e47eed250"},{url:"404.html",revision:"4ac466f6dde3bfaf56a833fdd0013089"}],{}),s.cleanupOutdatedCaches()}));
