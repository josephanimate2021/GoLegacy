const loadPost = require("../misc/post_body");
const folder = process.env.CACHÉ_FOLDER;
const http = require("http");
const fs = require("fs");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	if (req.method != "POST") return;
	switch (url.pathname) {
		case "/goapi/saveWaveform/": {
			loadPost(req, res).then(([data]) => {
				res.end(fs.writeFileSync(`${folder}/${data.ut}.${data.wfid.slice(0, -8)}.wf`, data.waveform));
			});
			return true;
		}
		case "/goapi/getWaveform/": {
			loadPost(req, res).then(([data]) => {
				const wfFolder = `${folder}/${data.ut}.${data.wfid.slice(0, -8)}.wf`;
				const wfMp3Folder = `${folder}/${data.ut}.${data.wfId}`;
				if (fs.existsSync(wfFolder)) res.end(fs.readFileSync(wfFolder));
				else if (fs.existsSync(wfMp3Folder)) res.end(fs.readFileSync(wfMp3Folder));
				else res.end('00.9533660347057853,0.9961007157284003,0.7274075379698095,0.6611393599148045,0.6642229228701122,0.37234751698410373,0.1665845960335075,0.39507020303434937,0.26490915396273595,0.19445420392292667,0.2558464051285889,0.5675986865371367,0.20259450558717407,0.36855435222034827,0.1491486186460269,0.528887390657677,0.04709084950041165,0.11039466744405657,0.9817341468844027,0.5681845501035783,0.3865406554287325,0.30864557461565556,0.5170545175979613,0.162963496014231,0.3798596620699466,0.14638929718127858,0.19985049564089863,0.41628032771758616,0.7175030624900176,0.9003634728747576,0.4927455410157018,0.6271437671213704,0.4493258808206948,0.7229242821240556,0.9368121799854867,0.5602820933235253,0.07895868483111745,0.17734214209123134,0.6737241247498817,0.6215154072352138,0.1379830912633837,0.36306725476033774,0.6742094546714803,0.24138281384193672,0.6385784382766173,0.526307713267604,0.061419387574963125,0.587884679194622,0.615555526841395,0.5367710006017239,0.6124696173757957,0.747564991360361,0.3733473402553873,0.05685555119588126,0.2878817434813328,0.39294900169788693,0.12921929929554832,0.05639985761956723,0.5107756469635261,0.8361996834344225,0.5881809900751178,0.6478414411447388,0.1774945399879042,0.32410619888193604,0.38857881946601314,0.5690964722015768,0.5188940121441665,0.30832521409342006,0.2987645297615298,0.10062433562273165,0.7354402439608818,0.5896358729614335,0.5359197424362743,0.969231951923484,0.38238704986311234,0.11746305595767126,0.7452493613791895,0.10085102591922435,0.7584113354070872,0.456814132179326,0.6220771267959626,0.23261139553080534,0.3150994723656626,0.3168795379915659,0.25501599954058785,0.16980305089874093,0.9335004709598345,0.5321188334951834,0.9421972743929812,0.34272112637615715,0.8482505677564294,0.6515981146749648,0.1218752119945754,0.8831620644389264,0.15996859494421356,0.5516378022095758,0.8952131573595592,0.09045892918395815,0.5937276361402275,0.9309797801582294,0.5559438429633095,0.18151298837886665,0.234259558779345,0.9640415773113391,0.8791731801504314,0.9526723493914737,0.2820021336709173,0.4105672625767989,0.2666212792591929,0.13514304895045215,0.06987469979966465,0.24941754929431648,0.16601526936113875,0.5291577069161086,0.44159708731931024,0.2569874188410979,0.44346395193802923,0.7964111546438497,0.5385384800514861,0.0070580560470585585,0.13527878126981618,0.4916465723430492,0.22165589396071894,0.6882955978344194,0.270497298663662,0.1499769480141513,0.39012587094628937,0.39755775057315024,0.7704184866374344,0.9719819681963013,0.6223982138263418,0.8775503072568167,0.43864513175763564,0.14517351508845922,0.6333330828987025,0.8769090657394107,0.544047806924195,0.22800365900534025,0.9550249899695673,0.19872605660410847,0.6605426593341757,0.20375629511538085,0.9473624749627716,0.46815844693332687,0.4125138431657036,0.46615569716652283,0.4388423481005692,0.9912735199433795,0.35745284988957193,0.9268216243988545,0.888167182726866,0.7869972919040897,0.9045328859522896,0.5102076141250793,0.6989698223699019,0.09398462273407437,0.47441730814889493,0.4273845013616102,0.9849415906925321,0.5768346800014919,0.1839579644615177,0.898110192892065,0.3686789966241715,0.27252578656647364,0.3489278866743146,0.403885779877625,0.33991294037479935,0.5785966685497732,0.4070154033400497,0.16330538219130886,0.04341224342619365,0.2408361581402716,0.6169702612309653,0.7946230672433336,0.5798493339325679,0.3618097321647509,0.6677613715230359,0.5679579260908203,0.4221709182104496,0.8274672248559127,0.16060478559434466,0.1419393860849114,0.4790982566436157,0.6008965704322244,0.2996315582543305,0.7500536541393952,0.3857557691945228,0.4609354544607749,0.7897510365913425,0.8952415413151689,0.802196727307599,0.7925727230400577,0.670604116939929,0.7344763592024983,0.2041318583867815,0.9046993776528054,0.4873878579210644,0.5171359922903209,0.342856608046491,0.362254686236424,0.9457739560892982,0.26306366081360255,0.7265075485813706,0.4539075561759891,0.910370605417979,0.6505776921718045,0.31664420596997833,0.4408920441599986,0.2547512505673595,0.09341587406231167,0.8865109329038925,0.7649301545652063,0.5430359440586083,0.013220941510154738,0.7829668820319671,0.612476032157538,0.2563339570270846,0.16102635321530423,0.33949139635436065,0.9611070798033514,0.7562104917390675,0.6517261943290793,0.3971667303340951,0.7636663913817365,0.6654028950808257,0.681132767100274,0.5559003997005949,0.28404562578166104,0.902608410414252,0.8573999949015385,0.6927675666354509,0.8972444010839653,0.7210544256956237,0.2992563330243765,0.278361642401894,0.02315462296944748,0.6751830496198887,0.18348044520367401,0.5364786439871796,0.13427049198418128,0.04603500699432894,0.13771737126461803,0.1264898818484499,0.759577602765561,0.7429264020794624,0.725480171842596,0.03672123650891557,0.010917031243796727,0.8171410386526581,0.9931575273015572,0.8149669168888753,0.46355132395798937,0.364053962388593,0.032497184249726585,0.8755237708126515,0.5437618956209598,0.7100390111928643,0.6851631583397069,0.3262884957447232,0.6150690771540501,0.05878135654826999,0.6236261193932817,0.10180742048027702,0.6364847604510515,0.295009964795546,0.5563935521546866,0.538322722608295,0.3011651387084924,0.9985462704034092,0.36990224385251014,0.7028029053397451,0.13707718918890688,0.7373874393392552,0.7433896221274825,0.9547393279543612,0.8314289594993747,0.16162753562310184,0.2523340867490056,0.4725495656051466,0.8863274876633991,0.76812986970478,0.7607678046984874,0.7801189133030699,0.6321172288846777,0.4362561748312128,0.9548990996703426,0.09048265821850987,0.9767643331157454,0.31767174436843226,0.10367282565458114,0.9041940777711137,0.47528737986999614,0.9580114388761554,0.07104439975934906,0.16696057367214046,0.5919335703855759,0.7002849646099092,0.372301874453427,0.7437007810978453,0.756825581460608,0.7896052254360506,0.8046486109409823,0.2565977901368064,0.9462605111538223,0.18799680642873207,0.9687425149046232,0.41821952760621084,0.585337881564721,0.7078231926921219,0.38104036514526984,0.47969647425124884,0.80614350228616,0.651751884396423,0.7994048167668286,0.8746289860489969,0.3578558307456001,0.2754763080702127,0.609187069775178,0.9387912960428102,0.33033278548017186,0.04275012507875786,0.26156401456976686,0.0021967033601797414,0.5324382531540817,0.3063384027597975,0.6076509196692514,0.5711986161064389,0.4948940831317552,0.15687713242753665,0.22000985536353546,0.912110683500178,0.9173740423501295,0.6012235408140549,0.4018249613854352,0.8202359894299516,0.6112928592357854,0.42456401941183697,0.8311066795406115,0.6304497835629248,0.58786033273004,0.1866679307173087,0.9465246554324813,0.15734111785769533,0.7257194983546689,0.25910733074819614,0.6541459993067775,0.07737302357419851,0.9799974329542747,0.15210566663832203,0.657379919828798,0.5904549479348602,0.49199989557685186,0.18717584255692743,0.5558949542873797,0.32970571041033137,0.040983654713705686,0.9725633444681281,0.9929068147527256,0.5329369971154925,0.06550710206740562,0.6711969615285076,0.8838260589776874,0.23355000575286589,0.40195378634530154,0.8130886019373664,0.9776741622634095,0.26056509132144146,0.8146894464509766,0.5256854391918964,0.6490902827186047,0.5849983345178118,0.6852646602877455,0.12069024345397406,0.3104672427044781,0.17731207468605392,0.6290253117211471,0.1305410475633424,0.3598691058810981,0.978287759808931,0.47123406778683896,0.9545206383498706,0.8251622169121877,0.3911626652216946,0.23481160914922383,0.6277140022563719,0.45918241865873166,0.9561098972314086,0.3706149904460003,0.10529812464578181,0.27093863546963926,0.6572567186835505,0.16743025544751866,0.013735712085932938,0.6058296795511726,0.4162212545611361,0.9766240174043208,0.1255536902125478,0.8752193721853423,0.1499209284293026,0.34189993977262834,0.905660580026173,0.22322172367928084,0.26682407907113137,0.7413896027138733,0.05685853541055286,0.7042213711000738,0.286430114695998,0.6163009855976731,0.19247983666841506,0.8740790426969598,0.1183286834552868,0.18961214321352404,0.08152797544551826,0.09059741505934826,0.8385599652642404,0.8560797100414206,0.6506141028611709,0.28545024465317637,0.25092550349871856,0.7215573422583703,0.1699661999187465,0.4972004799598333,0.08807841049204868,0.18587950166182443,0.5511465911084761,0.27656828067712014,0.3768180216095234,0.4009411633561466,0.372967404156896,0.1658076139512794,0.7439121955424748,0.3948193719005706,0.34964722529173886,0.7283043297404936,0.10633551738442404,0.3937754358718011,0.17178730110166773,0.07230739189012092,0.3111069755911178,0.6028936837994603,0.8583357400639757,0.5367630461800328,0.5353190730532691,0.850118738487307,0.9613759101909605,0.9484102565162305,0.7042601930986603,0.7039445576755292,0.40319246645481943,0.9636498975334782,0.18761356245048577,0.15204785780642038,0.07284748754639692,0.9619191596483916,0.825813915374167,0.6911043626114006,0.9995206130626682,0.4358729275879505,0.9963758510566514,0.42171823766479877,0.7526705657520261,0.6066990122386118,0.2609802601802125,0.31995946563173727,0.3982108192693252,0.49153307536652924,0.10227382278147301,0.17257956221440884,0.9109266843640009,0.5535861592140991,0.6791230185747057,0.5078025616596331,0.9427697497832621,0.8162228615651785,0.7229517217382206,0.4125365021089682,0.7079953428908938,0.4941978017577777,0.9294846236266494,0.041053247614781574,0.607577978157751,0.33901068929369327,0.44569870799469924,0.03718402112439523,0.4276672708329894,0.6932931940626028,0.4829165523992094,0.9586313067474912,0.8588788905609359,0.6289902402535761,0.17287008027044481,0.43866073947152184,0.05271235921014683,0.6813912183807131,0.6253988757004878,0.22161426712081922,0.4490477937890054,0.4296153968682488,0.006475462883615668,0.2554048510231013,0.4697294498515019,0.8126805914395123,0.9578656393516598,0.49232284501652734,0.11630470630200751,0.5753245281643842,0.3672426718067643,0.9304651187148543,0.956931027016916,0.21736492842080524,0.5371015417100145,0.604399698036856,0.03758060406506325,0.7538828706035972,0.531559020958768,0.6697928773311959,0.3152574840194988,0.1593260555725311,0.7394109690632502,0.945715356432075,0.054318816735064335,0.5965073589640857,0.6480852592426531,0.464095031643742,0.5686112952952269,0.5269265629953519,0.5635277662504081,0.3793402275687776,0.7854954266393372,0.965901538408247,0.17379082095972342,0.9811357409108104,0.13003015058339495,0.908708476816876,0.019965744091030357,0.5254068873982898,0.37458084359547494,0.2503847598505684,0.7042944038714452,0.8536483267623411,0.6840996453047541,0.2577761655342192,0.6545510633375642,0.5786742504255571,0.8085184084634451,0.02669279093523591,0.7863278395433704,0.7038735727127778,0.12241761487390068,0.18740731692824775,0.1224155649426264,0.7518713403659865,0.46853061433275855,0.16473837087537158,0.9539880351612016,0.7189362524525191,0.5185334424204926,0.4137603442041178,0.8075140881917504,0.3289952219572041,0.7166376327911952,0.19014964433383996,0.7963010426648545,0.8695914921885828,0.24259414307972849,0.9526394695994074,0.48178776664394607,0.0201605025779803,0.9921302215721843,0.2430306407081826,0.7136323999066259,0.8124993180252709,0.26965668624220407,0.8579812428563487,0.27876530305722746,0.6752873883350297,0.6242581711121296,0.3409455712355669,0.30943018556332924,0.7378288081903368,0.2925763992584005,0.4846325563640492,0.5147112259631854,0.2786985303033216,0.7232376922523593,0.30860801855718,0.8061310315826298,0.7229014897278032,0.19230464401393732,0.1394447887288499,0.5858495866167714,0.7746040150608715,0.9012742885671472,0.08641007119777289,0.5181636158399081,0.6231707395944701,0.13561013042832704,0.8858361691112595,0.042183135980986775,0.38001865579684746,0.7187415196006048,0.7507398233419873,0.32764484183233855,0.09708720959685402,0.5790716256089004,0.49669443991233986,0.7306145802443738,0.43609758258871634,0.6004766584758636,0.7817932657183106,0.10854462269879073,0.49402638411791777,0.6384107800545742,0.08276638768100408,0.7269206104282173,0.9145306671156044,0.7091408844639728,0.19862287365721776,0.9658898637107876,0.46182163974651513,0.4639450273100947,0.15117599363941725,0.026625912008492625,0.9796044652553588,0.3368956642973051,0.8656292489616135,0.9260823012824957,0.9685108398445113,0.46776061382261114,0.968911703802658,0.606997976461229,0.4312768043141184,0.7244331000694628,0.542790814259942,0.37233310044579393,0.6858354183931135,0.08748661291279558,0.11743076516859596,0.8336305455354636,0.15723239032236824,0.646950226688618,0.41721486172938227,0.1346682222391138,0.605355718318108,0.18738658329271507,0.9378958070186381,0.2090417046034625,0.35917945132220996,0.13042060242860987,0.28211071465969795,0.7334040191985869,0.7730250610560778,0.02018671997653665,0.2967962674824485,0.8469799263469446,0.7332717369399815,0.19223073978018768,0.24782511123436857,0.14871980638048887,0.5435025180941055,0.17543751087456472,0.8524451842277556,0.012299890613230113,0.5844537375985723,0.9050814439760224,0.030742461769802665');
			});
			return true;
		}
	}
};
