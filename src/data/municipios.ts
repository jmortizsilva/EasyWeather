// GENERADO por herramientas/generar-municipios.mjs. No editar a mano.
//
// Relación de municipios y códigos por comunidades autónomas y provincias a 1 de enero de 2026
// Nombres oficiales y codigos: INE (https://www.ine.es/daco/daco42/codmun/diccionario26.xlsx).
// Coordenadas y nombres alternativos: Wikidata, CC0.
// Generado el 2026-09-26 con 8132 municipios.

/** Provincia y comunidad de cada codigo de provincia, que son los dos primeros digitos del INE. */
export const PROVINCIAS: Record<string, [provincia: string, comunidad: string]> = {
  '01': ['Araba/Álava', 'País Vasco'],
  '02': ['Albacete', 'Castilla-La Mancha'],
  '03': ['Alicante/Alacant', 'Comunitat Valenciana'],
  '04': ['Almería', 'Andalucía'],
  '05': ['Ávila', 'Castilla y León'],
  '06': ['Badajoz', 'Extremadura'],
  '07': ['Illes Balears', 'Illes Balears'],
  '08': ['Barcelona', 'Cataluña'],
  '09': ['Burgos', 'Castilla y León'],
  '10': ['Cáceres', 'Extremadura'],
  '11': ['Cádiz', 'Andalucía'],
  '12': ['Castellón/Castelló', 'Comunitat Valenciana'],
  '13': ['Ciudad Real', 'Castilla-La Mancha'],
  '14': ['Córdoba', 'Andalucía'],
  '15': ['A Coruña', 'Galicia'],
  '16': ['Cuenca', 'Castilla-La Mancha'],
  '17': ['Girona', 'Cataluña'],
  '18': ['Granada', 'Andalucía'],
  '19': ['Guadalajara', 'Castilla-La Mancha'],
  '20': ['Gipuzkoa', 'País Vasco'],
  '21': ['Huelva', 'Andalucía'],
  '22': ['Huesca', 'Aragón'],
  '23': ['Jaén', 'Andalucía'],
  '24': ['León', 'Castilla y León'],
  '25': ['Lleida', 'Cataluña'],
  '26': ['La Rioja', 'La Rioja'],
  '27': ['Lugo', 'Galicia'],
  '28': ['Madrid', 'Comunidad de Madrid'],
  '29': ['Málaga', 'Andalucía'],
  '30': ['Murcia', 'Región de Murcia'],
  '31': ['Navarra', 'Comunidad Foral de Navarra'],
  '32': ['Ourense', 'Galicia'],
  '33': ['Asturias', 'Principado de Asturias'],
  '34': ['Palencia', 'Castilla y León'],
  '35': ['Las Palmas', 'Canarias'],
  '36': ['Pontevedra', 'Galicia'],
  '37': ['Salamanca', 'Castilla y León'],
  '38': ['Santa Cruz de Tenerife', 'Canarias'],
  '39': ['Cantabria', 'Cantabria'],
  '40': ['Segovia', 'Castilla y León'],
  '41': ['Sevilla', 'Andalucía'],
  '42': ['Soria', 'Castilla y León'],
  '43': ['Tarragona', 'Cataluña'],
  '44': ['Teruel', 'Aragón'],
  '45': ['Toledo', 'Castilla-La Mancha'],
  '46': ['Valencia/València', 'Comunitat Valenciana'],
  '47': ['Valladolid', 'Castilla y León'],
  '48': ['Bizkaia', 'País Vasco'],
  '49': ['Zamora', 'Castilla y León'],
  '50': ['Zaragoza', 'Aragón'],
  '51': ['Ceuta', 'Ceuta'],
  '52': ['Melilla', 'Melilla'],
};

/**
 * Un municipio por linea, con los campos separados por barra:
 *
 *   codigo INE | nombre oficial | latitud | longitud | habitantes | nombres alternativos...
 *
 * Es un texto y no una estructura, a proposito: pesa menos en el paquete, en los diff de git se lee
 * una linea por municipio, y no cuesta nada arrancar la app porque no se interpreta hasta la primera
 * busqueda. Los nombres alternativos NO se enseñan nunca (ver src/utils/municipios.ts).
 */
export const MUNICIPIOS = `
01051|Agurain/Salvatierra|42.8493|-2.3891|5189
01001|Alegría-Dulantzi|42.8442|-2.5119|2955|Alegría de Álava|Dulantzi
01002|Amurrio|43.0525|-3.0009|10364
01049|Añana|42.8019|-2.9864|141
01003|Aramaio|43.0352|-2.5857|1354|Aramayona
01006|Armiñón|42.7226|-2.8722|236
01037|Arraia-Maeztu|42.7407|-2.4480|812|Arraya-Maestu
01008|Arratzua-Ubarrundia|42.8903|-2.6392|1056|Arrazua-Ubarrundia|Arratzu-Ubarrundia|Arratzu Ubarrundia
01004|Artziniega|43.1299|-3.1410|1868|Arceniega
01009|Asparrena|42.8861|-2.2848|1609
01010|Ayala/Aiara|43.0766|-3.0789|2921
01011|Baños de Ebro/Mañueta|42.5300|-2.6794|286
01013|Barrundia|42.9153|-2.5030|882
01014|Berantevilla|42.6829|-2.8589|461
01016|Bernedo|42.6267|-2.4981|541
01017|Campezo/Kanpezu|42.6868|-2.3699|1073
01021|Elburgo/Burgelu|42.8495|-2.5457|642|Burgu
01022|Elciego|42.5148|-2.6183|971|Eltziego
01023|Elvillar/Bilar|42.5706|-2.5450|315
01046|Erriberagoitia/Ribera Alta|42.7982|-2.9044|839
01056|Harana/Valle de Arana|42.7566|-2.3206|212
01901|Iruña Oka/Iruña de Oca|42.8192|-2.8128|3704
01027|Iruraiz-Gauna|42.8167|-2.5000|559|Iruraitz-Gauna
01019|Kripan|42.5917|-2.5161|174|Cripán
01020|Kuartango|42.8862|-2.9275|402|Cuartango
01028|Labastida/Bastida|42.5904|-2.7929|1558
01030|Lagrán|42.6256|-2.5844|177
01031|Laguardia|42.5500|-2.5831|1459|Guardia
01032|Lanciego/Lantziego|42.5628|-2.5126|700
01902|Lantarón|42.7469|-2.9947|929
01033|Lapuebla de Labarca|42.4958|-2.5711|895|Lapuebla Labarka
01036|Laudio/Llodio|43.1511|-2.9561|18077
01058|Legutio|42.9810|-2.6467|2094|Villarreal de Álava
01034|Leza|42.5661|-2.6336|205
01039|Moreda de Álava/Moreda Araba|42.5250|-2.4081|218
01041|Navaridas|42.5461|-2.6233|192
01042|Okondo|43.1622|-3.0189|1184|Oquendo
01043|Oyón-Oion|42.5059|-2.4364|3476|Oion
01044|Peñacerrada-Urizaharra|42.6443|-2.7135|332|Urizaharra
01047|Ribera Baja/Erriberabeitia|42.7398|-2.8913|1477|Erribera Beitia|Ribera Baixa
01052|Samaniego|42.5682|-2.6791|292
01053|San Millán/Donemiliaga|42.8747|-2.3761|701
01054|Urkabustaiz|42.9547|-2.9033|1470|Urcabustaiz
01055|Valdegovía/Gaubea|42.8547|-3.0609|1064
01057|Villabuena de Álava/Eskuernaga|42.5470|-2.6654|276
01059|Vitoria-Gasteiz|42.8467|-2.6731|260699|Gasteiz
01060|Yécora/Iekora|42.5678|-2.4704|278|Ekora
01061|Zalduondo|42.8858|-2.3471|195|Zalduendo de Álava|Zalduendo d'Álava
01062|Zambrana|42.6617|-2.8789|452|Zanbrana
01018|Zigoitia|42.9683|-2.7282|1845|Cigoitia
01063|Zuia|42.9819|-2.8325|2350|Zuya
02001|Abengibre|39.2129|-1.5383|753
02002|Alatoz|39.0944|-1.3617|504
02003|Albacete|38.9956|-1.8558|175400|Albacet
02004|Albatana|38.5697|-1.5242|644
02005|Alborea|39.3007|-1.3843|672
02006|Alcadozo|38.6489|-1.9804|635
02007|Alcalá del Júcar|39.1929|-1.4292|1130|Alcalá del Xúcar
02008|Alcaraz|38.6660|-2.4905|1283
02009|Almansa|38.8682|-1.0979|24615
02010|Alpera|38.9589|-1.2311|2278
02011|Ayna|38.5531|-2.0708|577
02012|Balazote|38.8850|-2.1525|2356
02014|El Ballestero|38.8417|-2.4553|411
02013|Balsa de Ves|39.2644|-1.1953|121
02015|Barrax|39.0460|-2.2004|1838
02016|Bienservida|38.5157|-2.6114|548
02017|Bogarra|38.5819|-2.2131|727
02018|Bonete|38.8717|-1.3481|950|Bonet
02019|El Bonillo|38.9500|-2.5331|2645
02020|Carcelén|39.1028|-1.3083|483
02021|Casas de Juan Núñez|39.1020|-1.5570|1409
02022|Casas de Lázaro|38.7739|-2.2614|298
02023|Casas de Ves|39.2461|-1.3206|519
02024|Casas-Ibáñez|39.3081|-1.4724|4616
02025|Caudete|38.7000|-0.9831|10439|Cabdet|Caudet
02026|Cenizate|39.2958|-1.6531|1163
02029|Chinchilla de Monte-Aragón|38.9196|-1.7264|4614|Chinchilla de Montearagón|Chinchiella de Mont Aragón
02027|Corral-Rubio|38.8350|-1.4611|303
02028|Cotillas|38.4311|-2.5069|123
02030|Elche de la Sierra|38.4484|-2.0490|3603
02031|Férez|38.3561|-2.0103|604
02032|Fuensanta|39.2414|-2.0673|282
02033|Fuente-Álamo|38.6925|-1.4317|2422
02034|Fuentealbilla|39.2667|-1.5492|1804
02035|La Gineta|39.1152|-1.9962|2656
02036|Golosalvo|39.2400|-1.6367|79
02037|Hellín|38.5122|-1.7033|30836
02038|La Herrera|38.9629|-2.1267|308
02039|Higueruela|38.9644|-1.4444|1133
02040|Hoya-Gonzalo|38.9578|-1.5561|582
02041|Jorquera|39.1753|-1.5211|356|Exorquera
02042|Letur|38.3663|-2.1007|911
02043|Lezuza|38.9494|-2.3547|1281
02044|Liétor|38.5423|-1.9558|1052
02045|Madrigueras|39.2371|-1.8001|4670
02046|Mahora|39.2128|-1.7253|1465
02047|Masegoso|38.7293|-2.3073|117
02048|Minaya|39.2705|-2.3218|1381
02049|Molinicos|38.4663|-2.2406|754
02050|Montalvos|39.1671|-2.0275|74
02051|Montealegre del Castillo|38.7874|-1.3248|2051
02052|Motilleja|39.1806|-1.7919|673
02053|Munera|39.0392|-2.4820|3351
02054|Navas de Jorquera|39.2831|-1.7167|521|Navas d'Exorquera
02055|Nerpio|38.1481|-2.3019|1136
02056|Ontur|38.6148|-1.4978|1895
02057|Ossa de Montiel|38.9624|-2.7453|2233
02058|Paterna del Madera|38.5972|-2.3458|328
02060|Peñas de San Pedro|38.7266|-2.0020|1488
02059|Peñascosa|38.6711|-2.4108|329
02061|Pétrola|38.8264|-1.5563|660
02062|Povedilla|38.7003|-2.6036|374
02901|Pozo Cañada|38.8048|-1.7358|2704
02063|Pozohondo|38.7207|-1.9117|1544
02064|Pozo-Lorente|39.0767|-1.5067|398
02065|Pozuelo|38.8157|-2.0790|455
02066|La Recueja|39.1753|-1.4908|215
02067|Riópar|38.4985|-2.4179|1344
02068|Robledo|38.7592|-2.4489|382
02069|La Roda|39.2070|-2.1604|15643
02070|Salobre|38.5780|-2.5434|442
02071|San Pedro|38.7911|-2.1885|1155
02072|Socovos|38.3336|-1.9836|1643
02073|Tarazona de la Mancha|39.2650|-1.9128|6100
02074|Tobarra|38.5831|-1.6831|8006
02075|Valdeganga|39.1126|-1.6727|1970
02076|Vianos|38.5919|-2.4932|317
02077|Villa de Ves|39.2224|-1.2602|51
02078|Villalgordo del Júcar|39.2960|-2.0631|1159
02079|Villamalea|39.3619|-1.5398|4083
02080|Villapalacios|38.5748|-2.6346|539
02081|Villarrobledo|39.2667|-2.6000|25400
02082|Villatoya|39.3339|-1.3386|114
02083|Villavaliente|39.1262|-1.4565|190
02084|Villaverde de Guadalimar|38.4569|-2.5167|325
02085|Viveros|38.7727|-2.5750|293
02086|Yeste|38.3653|-2.3214|2471
03002|Agost|38.4392|-0.6394|5225
03003|Agres|38.7797|-0.5161|623
03004|Aigües|38.4989|-0.3628|1199|Aguas de Busot
03014|Alacant/Alicante|38.3453|-0.4831|366221|Alicant
03005|Albatera|38.1786|-0.8681|13566
03006|Alcalalí|38.7494|-0.0417|1428
03009|Alcoi/Alcoy|38.6983|-0.4736|61468
03008|Alcoleja|38.6754|-0.3319|184|Alcolecha
03007|Alcosser|38.7944|-0.4025|263|Alcocer de Planes
03010|Alfafara|38.7725|-0.5561|419
03011|l'Alfàs del Pi|38.5794|-0.1019|21080|Alfaz del Pi
03012|Algorfa|38.0858|-0.7969|3788
03013|Algueña|38.3378|-1.0036|1328|l'Alguenya|L'Alguenya
03015|Almoradí|38.1097|-0.7894|22965
03016|Almudaina|38.7611|-0.3544|128
03017|l'Alqueria d'Asnar|38.7722|-0.4250|519|Alquería de Aznar
03018|Altea|38.6000|-0.0489|24592|Alteya
03019|Aspe|38.3458|-0.7689|22397|Asp
03001|l'Atzúbia|38.8469|-0.1519|589|Adsubia|L'Atzúvia
03020|Balones|38.7367|-0.3431|132
03021|Banyeres de Mariola|38.7158|-0.6572|7347
03022|Benasau|38.6897|-0.3433|174
03023|Beneixama|38.7000|-0.7672|1696|Benejama
03024|Benejúzar|38.0778|-0.8386|5811|Benejússer
03025|Benferri|38.1417|-0.9625|2099
03026|Beniarbeig|38.8217|-0.0017|2499
03027|Beniardà|38.6835|-0.2165|226
03028|Beniarrés|38.8200|-0.3794|1117
03030|Benidoleig|38.7917|-0.0325|1245
03031|Benidorm|38.5342|-0.1314|77327
03032|Benifallim|38.6628|-0.3997|130
03033|Benifato|38.6733|-0.2294|162
03029|Benigembla|38.7558|-0.1103|590|Benichembla
03034|Benijófar|38.0806|-0.7386|3679|Benijòfer
03035|Benilloba|38.6992|-0.3911|744
03036|Benillup|38.7533|-0.3794|110
03037|Benimantell|38.6764|-0.2100|548
03038|Benimarfull|38.7831|-0.3831|465
03039|Benimassot|38.7500|-0.2831|85|Benimasot
03040|Benimeli|38.8228|-0.0414|474
03041|Benissa|38.7153|0.0500|12471|Benisa
03043|Biar|38.6331|-0.7667|3677
03044|Bigastro|38.0631|-0.8956|7537|Bigastre
03045|Bolulla|38.6764|-0.1122|490
03046|Busot|38.4814|-0.4203|3782
03049|Callosa de Segura|38.1225|-0.8797|19988
03048|Callosa d'en Sarrià|38.6514|-0.1228|8182|Callosa de Ensarriá
03047|Calp|38.6444|0.0461|27616|Calpe
03051|el Camp de Mirra/Campo de Mirra|38.6867|-0.7803|447|Campu de Mirra
03050|el Campello|38.4275|-0.4011|31419
03052|Cañada|38.6750|-0.8103|1213|la Canyada|La Canyada de Biar|La Canyada
03053|Castalla|38.5967|-0.6708|11908
03054|Castell de Castells|38.7247|-0.1944|443
03075|el Castell de Guadalest|38.6764|-0.1986|284|Guadalest
03055|Catral|38.1594|-0.8050|9600
03056|Cocentaina|38.7442|-0.4400|11498
03057|Confrides|38.6833|-0.2686|293
03058|Cox|38.1394|-0.8847|7722|Coix
03059|Crevillent|38.2486|-0.8089|30921|Crevillente
03061|Daya Nueva|38.1136|-0.7614|1885|Daia Nova
03062|Daya Vieja|38.1047|-0.7383|698|Daia Vella|Daya Vieya
03063|Dénia|38.8403|0.1086|47261|Denya
03064|Dolores|38.1389|-0.7700|8326|Dolors
03066|Elda|38.4813|-0.7903|55222
03065|Elx/Elche|38.2669|-0.6983|245557|Elch
03067|Fageca|38.7344|-0.2683|100|Facheca
03068|Famorca|38.7319|-0.2467|44
03069|Finestrat|38.5669|-0.2125|9919
03077|el Fondó de les Neus/Hondón de las Nieves|38.3081|-0.8539|2738
03070|Formentera del Segura|38.0842|-0.7469|4868
03072|Gaianes|38.8128|-0.4083|577|Gayanes
03071|Gata de Gorgos|38.7747|0.0853|6773
03073|Gorga|38.7181|-0.3572|286
03074|Granja de Rocamora|38.1525|-0.8897|2728|la Granja de Rocamora
03076|Guardamar del Segura|38.0897|-0.6550|18564
03078|Hondón de los Frailes|38.2733|-0.9275|1334|el Fondó dels Frares|El Fondó dels Frares
03079|Ibi|38.6272|-0.5753|24500
03080|Jacarilla|38.0606|-0.8667|2176|Xacarella|Xacariella
03085|Llíber|38.7433|-0.0058|882
03086|Millena|38.7306|-0.3639|265
03088|Monforte del Cid|38.3792|-0.7303|9283|Montfort|Mont-fort
03089|Monòver/Monóvar|38.4369|-0.8338|13116
03903|Los Montesinos|38.0281|-0.7419|5786|Els Montesinos
03091|Murla|38.7594|-0.0839|574
03092|Muro de Alcoy|38.7797|-0.4361|9372|Muro d'Alcoi|Muro de Alcói
03090|Mutxamel|38.4136|-0.4456|28621|Muchamiel
03093|Novelda|38.3861|-0.7653|26606
03094|la Nucia|38.6172|-0.1231|19121
03095|Ondara|38.8282|0.0171|7717
03096|Onil|38.6294|-0.6739|8114
03097|Orba|38.7800|-0.0644|2399
03099|Orihuela|38.0856|-0.9469|84560|Oriola|Oriuela
03084|l'Orxa/Lorcha|38.8436|-0.3286|589
03098|Orxeta|38.5631|-0.2619|906|Orcheta
03100|Parcent|38.7456|-0.0650|1037
03101|Pedreguer|38.7933|0.0342|8849
03102|Pego|38.8431|-0.1175|10791
03103|Penàguila|38.6792|-0.3592|305
03104|Petrer|38.4845|-0.7696|34022
03902|Pilar de la Horadada|37.8675|-0.7926|24316|el Pilar de la Foradada|El Pilar de la Foradada
03105|el Pinós/Pinoso|38.4035|-1.0411|8523
03106|Planes|38.7853|-0.3450|697
03042|el Poble Nou de Benitatxell/Benitachell|38.7328|0.1442|4911
03901|els Poblets|38.8490|0.0174|2757
03107|Polop|38.6222|-0.1272|5828
03060|Quatretondeta|38.7236|-0.3169|130|Cuatretondeta
03109|Rafal|38.1047|-0.8492|4849
03110|el Ràfol d'Almúnia|38.8203|-0.0531|734|Ráfol de Almunia
03111|Redován|38.1139|-0.9056|8283|Redovà
03112|Relleu|38.5872|-0.3114|1375
03113|Rojales|38.0886|-0.7236|17652|Rojals
03114|la Romana|38.3669|-0.8969|2729
03115|Sagra|38.8108|-0.0656|441
03116|Salinas|38.5211|-0.9117|1828|Salines
03118|San Fulgencio|38.1119|-0.7192|9769|Sant Fulgenci
03904|San Isidro|38.1669|-0.8400|2337|Sant Isidre
03120|San Miguel de Salinas|37.9806|-0.7897|7177|Sant Miquel de les Salines|Sant Miquel de Salines
03117|Sanet y Negrals|38.8186|-0.0342|712|Sanet i els Negrals
03119|Sant Joan d'Alacant|38.4014|-0.4367|26834|San Juan de Alicante
03122|Sant Vicent del Raspeig/San Vicente del Raspeig|38.3964|-0.5253|60247
03121|Santa Pola|38.1897|-0.5556|39709
03123|Sax|38.5394|-0.8161|10346|Saix|Xaix
03124|Sella|38.6083|-0.2728|621
03125|Senija|38.7281|0.0414|698
03127|Tàrbena|38.6950|-0.1008|662
03128|Teulada|38.7292|0.1019|12912
03129|Tibi|38.5309|-0.5775|1757
03130|Tollos|38.7569|-0.2750|32
03131|Tormos|38.8017|-0.0725|323
03132|la Torre de les Maçanes/Torremanzanas|38.6067|-0.4192|749
03133|Torrevieja|37.9778|-0.6833|98533|Torrevella
03134|la Vall d'Alcalà|38.7944|-0.2528|159|Vall de Alcalá|Valle de Alcalá
03136|la Vall de Gallinera|38.8222|-0.2222|583|Vall de Gallinera
03137|la Vall de Laguar|38.7769|-0.1100|905|Vall de Laguart
03135|la Vall d'Ebo|38.8056|-0.1608|231|Vall de Ebo
03138|el Verger|38.8471|0.0104|5508|Vergel
03139|la Vila Joiosa/Villajoyosa|38.5053|-0.2328|37449
03140|Villena|38.6350|-0.8658|34712
03082|Xàbia/Jávea|38.7892|0.1631|30642
03081|Xaló|38.7406|-0.0122|3104|Jalón
03083|Xixona/Jijona|38.5392|-0.5081|7669
04001|Abla|37.1422|-2.7772|1268
04002|Abrucena|37.1333|-2.7833|1241
04003|Adra|36.7500|-3.0167|25501
04004|Albanchez|37.2869|-2.1814|688
04005|Alboloduy|37.0335|-2.6216|579
04006|Albox|37.3833|-2.1333|12799
04007|Alcolea|36.9667|-2.9500|829
04008|Alcóntar|37.3361|-2.5972|545
04009|Alcudia de Monteagud|37.2360|-2.2672|115
04010|Alhabia|36.9898|-2.5868|743
04011|Alhama de Almería|36.9575|-2.5668|3975
04012|Alicún|36.9664|-2.6019|206
04013|Almería|36.8417|-2.4639|205468
04014|Almócita|37.0025|-2.7899|208
04015|Alsodux|37.0026|-2.5941|126
04016|Antas|37.2452|-1.9182|3472
04017|Arboleas|37.3511|-2.0743|4215
04018|Armuña de Almanzora|37.3502|-2.4151|371
04019|Bacares|37.2606|-2.4547|226
04904|Balanegra|36.7467|-2.9083|3055
04020|Bayárcal|37.0301|-2.9953|294
04021|Bayarque|37.3307|-2.4359|215
04022|Bédar|37.1910|-1.9806|953
04023|Beires|37.0121|-2.7909|140
04024|Benahadux|36.9252|-2.4602|4901
04026|Benitagla|37.2318|-2.2388|63
04027|Benizalón|37.2121|-2.2419|242
04028|Bentarique|36.9866|-2.6196|223
04029|Berja|36.8452|-2.9470|13120
04030|Canjáyar|37.0104|-2.7406|1139
04031|Cantoria|37.3525|-2.1935|3592
04032|Carboneras|37.0005|-1.8919|8458
04033|Castro de Filabres|37.1850|-2.4400|101
04036|Chercos|37.2668|-2.2582|301
04037|Chirivel|37.5960|-2.2679|1619
04034|Cóbdar|37.2616|-2.2100|169
04035|Cuevas del Almanzora|37.2969|-1.8797|15526
04038|Dalías|36.8208|-2.8711|4196
04902|El Ejido|36.7831|-2.8167|91440
04041|Enix|36.8769|-2.6019|612
04043|Felix|36.8687|-2.6577|771
04044|Fines|37.3586|-2.2628|2404
04045|Fiñana|37.1710|-2.8397|1956
04046|Fondón|36.9792|-2.8583|1152
04047|Gádor|36.9531|-2.4916|3130
04048|Los Gallardos|37.1672|-1.9394|3110
04049|Garrucha|37.1831|-1.8167|10845
04050|Gérgal|37.1186|-2.5396|1211
04051|Huécija|36.9677|-2.6091|526
04052|Huércal de Almería|36.8824|-2.4408|18660
04053|Huércal-Overa|37.3899|-1.9435|20860
04054|Íllar|36.9851|-2.6391|492
04055|Instinción|36.9929|-2.6596|507
04056|Laroya|37.2959|-2.3319|197
04057|Laujar de Andarax|36.9940|-2.8968|1674
04058|Líjar|37.2949|-2.2185|378
04059|Lubrín|37.2162|-2.0670|1434
04060|Lucainena de las Torres|37.0410|-2.1997|722
04061|Lúcar|37.4009|-2.4242|829
04062|Macael|37.3333|-2.3000|5436
04063|María|37.7000|-2.1500|1202
04064|Mojácar|37.1406|-1.8506|7680
04903|La Mojonera|36.7523|-2.6838|8793
04065|Nacimiento|37.1059|-2.6484|485
04066|Níjar|36.9658|-2.2067|33319
04067|Ohanes|37.0383|-2.7453|553
04068|Olula de Castro|37.1752|-2.4750|175
04069|Olula del Río|37.3553|-2.2966|6506
04070|Oria|37.4840|-2.2923|2219
04071|Padules|36.9978|-2.7732|438
04072|Partaloa|37.4060|-2.2263|836
04073|Paterna del Río|37.0217|-2.9526|399
04074|Pechina|36.9151|-2.4407|4552
04075|Pulpí|37.4018|-1.7508|12214
04076|Purchena|37.3481|-2.3606|1563
04077|Rágol|36.9950|-2.6812|297
04078|Rioja|36.9451|-2.4627|1609
04079|Roquetas de Mar|36.7814|-2.6147|111240
04080|Santa Cruz de Marchena|37.0172|-2.6036|236
04081|Santa Fe de Mondújar|36.9738|-2.5308|503
04082|Senés|37.2025|-2.3437|279
04083|Serón|37.3520|-2.5395|2151
04084|Sierro|37.3214|-2.3986|364
04085|Somontín|37.3920|-2.3880|497
04086|Sorbas|37.0982|-2.1239|2564
04087|Suflí|37.3388|-2.3889|224
04088|Tabernas|37.0499|-2.3914|3991
04089|Taberno|37.4682|-2.0781|955
04090|Tahal|37.2280|-2.2855|355
04091|Terque|36.9843|-2.5985|393
04092|Tíjola|37.3465|-2.4365|3573
04901|Las Tres Villas|37.1594|-2.7216|547
04093|Turre|37.1524|-1.8945|4361
04094|Turrillas|37.0301|-2.2633|256
04095|Uleila del Campo|37.1853|-2.2035|815
04096|Urrácal|37.3723|-2.3229|340
04097|Velefique|37.1939|-2.4029|230
04098|Vélez-Blanco|37.6925|-2.0953|1928
04099|Vélez-Rubio|37.6490|-2.0764|6685
04100|Vera|37.2475|-1.8678|20282
04101|Viator|36.8887|-2.4251|6339
04102|Vícar|36.8317|-2.6430|29342
04103|Zurgena|37.3422|-2.0393|3059
05001|Adanero|40.9458|-4.6067|207
05002|La Adrada|40.3078|-4.6553|2853
05005|Albornos|40.8379|-4.8813|170
05007|Aldeanueva de Santa Cruz|40.3819|-5.4214|100
05008|Aldeaseca|41.0494|-4.8175|211
05010|La Aldehuela|40.4108|-5.4092|141
05012|Amavida|40.5733|-5.0667|131
05013|El Arenal|40.2647|-5.0872|961
05014|Arenas de San Pedro|40.2089|-5.0911|6460
05015|Arevalillo|40.5872|-5.3744|58
05016|Arévalo|41.0667|-4.7167|7851
05017|Aveinte|40.7822|-4.8375|67
05018|Avellaneda|40.3886|-5.3881|23
05019|Ávila|40.6543|-4.6962|59107
05021|El Barco de Ávila|40.3597|-5.5236|2308
05022|El Barraco|40.4753|-4.6419|2086
05023|Barromán|41.0650|-4.9314|174
05024|Becedas|40.4050|-5.6347|146
05025|Becedillas|40.5372|-5.3250|70
05026|Bercial de Zapardiel|41.0464|-4.9692|166
05027|Las Berlanas|40.8045|-4.7660|323
05029|Bernuy-Zapardiel|40.9761|-4.9439|79
05030|Berrocalejo de Aragona|40.6942|-4.5969|55
05033|Blascomillán|40.8014|-5.0886|169
05034|Blasconuño de Matacabras|41.1233|-4.9903|14
05035|Blascosancho|40.8774|-4.6374|85
05036|El Bohodón|40.9173|-4.7310|104
05037|Bohoyo|40.3150|-5.4411|205
05038|Bonilla de la Sierra|40.5289|-5.2642|139
05039|Brabos|40.7783|-4.9378|34
05040|Bularros|40.7260|-4.8666|55
05041|Burgohondo|40.4136|-4.7864|1269
05042|Cabezas de Alambre|40.9403|-4.8425|152
05043|Cabezas del Pozo|41.0006|-4.9521|80
05044|Cabezas del Villar|40.7153|-5.2083|217
05045|Cabizuela|40.9011|-4.8003|89
05046|Canales|41.0028|-4.8998|42
05047|Candeleda|40.1557|-5.2410|5003
05048|Cantiveros|40.9528|-4.9544|102
05049|Cardeñosa|40.7417|-4.7453|430
05051|La Carrera|40.3478|-5.5547|155
05052|Casas del Puerto|40.5276|-5.1941|80
05053|Casasola|40.6689|-4.8267|67
05054|Casavieja|40.2811|-4.7667|1362
05055|Casillas|40.3242|-4.5725|673
05056|Castellanos de Zapardiel|41.0853|-4.9097|106
05057|Cebreros|40.4550|-4.4647|3345
05058|Cepeda la Mora|40.4578|-5.0483|63
05067|Chamartín|40.7011|-4.9581|61
05059|Cillán|40.7050|-4.9781|84
05060|Cisla|40.9647|-5.0122|107
05061|La Colilla|40.6461|-4.7658|375
05062|Collado de Contreras|40.8867|-4.9278|147
05063|Collado del Mirón|40.5528|-5.3539|18
05064|Constanzana|40.9382|-4.8751|104
05065|Crespos|40.8709|-4.9702|463
05066|Cuevas del Valle|40.2936|-5.0089|506
05903|Diego del Carpio|40.6686|-5.3342|107
05069|Donjimeno|40.9597|-4.8453|69
05070|Donvidas|41.0892|-4.8078|31
05072|Espinosa de los Caballeros|41.0089|-4.6534|104
05073|Flores de Ávila|40.9333|-5.0789|262
05074|Fontiveros|40.9295|-4.9646|715
05075|Fresnedilla|40.2336|-4.6206|92
05076|El Fresno|40.6136|-4.7575|579
05077|Fuente el Saúz|40.9775|-4.9089|146
05078|Fuentes de Año|41.0171|-4.8987|90
05079|Gallegos de Altamiros|40.7097|-4.8988|61
05080|Gallegos de Sobrinos|40.7164|-5.1119|42
05081|Garganta del Villar|40.4489|-5.1042|37
05082|Gavilanes|40.2775|-4.8511|523
05083|Gemuño|40.5931|-4.7822|147
05085|Gil García|40.2978|-5.5942|45
05084|Gilbuena|40.4153|-5.6053|45
05086|Gimialcón|40.8775|-5.1222|73
05087|Gotarrendura|40.8267|-4.7392|173
05088|Grandes y San Martín|40.7558|-4.9556|34
05089|Guisando|40.2217|-5.1397|458
05090|Gutierre-Muñoz|40.9833|-4.6386|63
05092|Hernansancho|40.8575|-4.7305|140
05093|Herradón de Pinares|40.5633|-4.5583|526
05094|Herreros de Suso|40.8019|-5.0383|141
05095|Higuera de las Dueñas|40.2397|-4.6017|250
05096|La Hija de Dios|40.5299|-4.9676|79
05097|La Horcajada|40.4365|-5.4663|434
05099|Horcajo de las Torres|41.0650|-5.0908|425
05100|El Hornillo|40.2623|-5.1240|263
05102|El Hoyo de Pinares|40.5008|-4.4239|2179
05101|Hoyocasero|40.3989|-4.9758|294
05103|Hoyorredondo|40.4622|-5.4100|57
05106|Hoyos de Miguel Muñoz|40.3922|-5.0671|24
05104|Hoyos del Collado|40.3594|-5.2011|28
05105|Hoyos del Espino|40.3562|-5.1750|350
05107|Hurtumpascual|40.6922|-5.1125|41
05108|Junciana|40.4100|-5.5578|40
05109|Langa|41.0078|-4.8594|441
05110|Lanzahíta|40.1905|-4.9334|771
05113|Los Llanos de Tormes|40.3282|-5.5002|57
05112|El Losar del Barco|40.3925|-5.5394|99
05114|Madrigal de las Altas Torres|41.0894|-4.9989|1281
05115|Maello|40.8111|-4.5089|713
05116|Malpartida de Corneja|40.5211|-5.3511|89
05117|Mamblas|41.0194|-5.0111|191
05118|Mancera de Arriba|40.7911|-5.1472|66
05119|Manjabálago y Ortigosa de Rioalmar|40.6644|-5.0761|22
05120|Marlín|40.7114|-4.8297|29
05121|Martiherrero|40.6741|-4.7811|372
05122|Martínez|40.6308|-5.3483|109
05123|Mediana de Voltoya|40.7006|-4.5639|117
05124|Medinilla|40.4394|-5.6175|79
05125|Mengamuñoz|40.5000|-5.0000|60
05126|Mesegar de Corneja|40.5028|-5.3017|62
05127|Mijares|40.2975|-4.8367|718
05128|Mingorría|40.7508|-4.6653|422
05129|El Mirón|40.5319|-5.4053|93
05130|Mironcillo|40.5550|-4.8256|110
05131|Mirueña de los Infanzones|40.7375|-5.0908|86
05132|Mombeltrán|40.2600|-5.0178|922
05133|Monsalupe|40.7686|-4.7811|64
05134|Moraleja de Matacabras|41.1072|-4.9575|55
05135|Muñana|40.5904|-5.0145|499
05136|Muñico|40.7047|-5.0267|77
05138|Muñogalindo|40.6025|-4.8950|299
05139|Muñogrande|40.8211|-4.9219|76
05140|Muñomer del Peco|40.8586|-4.8803|113
05141|Muñopepe|40.6356|-4.8181|95
05142|Muñosancho|40.9219|-5.0358|87
05143|Muñotello|40.5431|-5.0408|50
05144|Narrillos del Álamo|40.5669|-5.4669|56
05145|Narrillos del Rebollar|40.6644|-4.9647|34
05149|Narros de Saldueña|40.8753|-4.8694|102
05147|Narros del Castillo|40.8586|-5.0586|151
05148|Narros del Puerto|40.5417|-4.9919|26
05152|Nava de Arévalo|40.9783|-4.7758|647
05153|Nava del Barco|40.2925|-5.5403|81
05151|Navacepedilla de Corneja|40.4858|-5.1843|99
05154|Navadijos|40.4258|-5.0836|29
05155|Navaescurial|40.4719|-5.2778|54
05156|Navahondilla|40.3253|-4.4944|359
05157|Navalacruz|40.4403|-4.9325|192
05158|Navalmoral|40.4597|-4.7686|445
05159|Navalonguilla|40.2783|-5.5019|182
05160|Navalosa|40.4014|-4.9314|314
05161|Navalperal de Pinares|40.5944|-4.4108|840
05162|Navalperal de Tormes|40.3528|-5.3006|73
05163|Navaluenga|40.4111|-4.7078|2135
05164|Navaquesera|40.4250|-4.9086|38
05165|Navarredonda de Gredos|40.3625|-5.1336|451
05166|Navarredondilla|40.4536|-4.8214|146
05167|Navarrevisca|40.3642|-4.8950|281
05168|Las Navas del Marqués|40.5950|-4.3463|5670
05169|Navatalgordo|40.4100|-4.8722|230
05170|Navatejares|40.3356|-5.5308|48
05171|Neila de San Miguel|40.4234|-5.6508|66
05172|Niharra|40.5894|-4.8397|167
05173|Ojos-Albos|40.7067|-4.5164|89
05174|Orbita|40.9986|-4.6475|70
05175|El Oso|40.8417|-4.7706|125
05176|Padiernos|40.6217|-4.8456|277
05177|Pajares de Adaja|40.9236|-4.6406|123
05178|Palacios de Goda|41.1172|-4.7842|396
05179|Papatrigo|40.8672|-4.8319|215
05180|El Parral|40.7936|-4.9864|64
05181|Pascualcobo|40.6569|-5.2769|38
05182|Pedro Bernardo|40.2428|-4.9147|743
05183|Pedro-Rodríguez|40.9369|-4.7850|131
05184|Peguerinos|40.6272|-4.2328|283
05185|Peñalba de Ávila|40.7719|-4.7461|104
05186|Piedrahíta|40.4635|-5.3276|1637
05187|Piedralaves|40.3172|-4.6981|2183
05188|Poveda|40.5669|-5.0797|30
05189|Poyales del Hoyo|40.1717|-5.1569|498
05190|Pozanco|40.8014|-4.6672|57
05191|Pradosegar|40.5508|-5.0711|109
05192|Puerto Castilla|40.2894|-5.6297|99
05193|Rasueros|41.0231|-5.0744|150
05194|Riocabado|40.8300|-4.8031|129
05195|Riofrío|40.5486|-4.7781|188
05196|Rivilla de Barajas|40.9019|-4.9881|59
05197|Salobral|40.6117|-4.8111|109
05198|Salvadiós|40.8769|-5.0964|67
05199|San Bartolomé de Béjar|40.4081|-5.6631|44
05200|San Bartolomé de Corneja|40.4928|-5.3853|32
05201|San Bartolomé de Pinares|40.5425|-4.5425|479
05206|San Esteban de los Patos|40.7458|-4.6250|19
05208|San Esteban de Zapardiel|41.0931|-4.9008|40
05207|San Esteban del Valle|40.2753|-4.9800|735
05209|San García de Ingelmos|40.7691|-5.1152|64
05901|San Juan de Gredos|40.3561|-5.2422|219
05210|San Juan de la Encinilla|40.8300|-4.8383|70
05211|San Juan de la Nava|40.4792|-4.6819|422
05212|San Juan del Molinillo|40.4589|-4.8181|238
05213|San Juan del Olmo|40.6528|-5.0497|73
05214|San Lorenzo de Tormes|40.3703|-5.4881|32
05215|San Martín de la Vega del Alberche|40.4311|-5.1567|163
05216|San Martín del Pimpollar|40.3687|-5.0541|221
05217|San Miguel de Corneja|40.4867|-5.2875|65
05218|San Miguel de Serrezuela|40.6703|-5.2875|103
05219|San Pascual|40.8822|-4.7561|44
05220|San Pedro del Arroyo|40.8023|-4.8709|516
05231|San Vicente de Arévalo|40.9678|-4.8000|171
05204|Sanchidrián|40.8919|-4.5814|720
05205|Sanchorreja|40.6647|-4.9153|77
05222|Santa Cruz de Pinares|40.5427|-4.5804|169
05221|Santa Cruz del Valle|40.2508|-5.0039|295
05226|Santa María de los Caballeros|40.3889|-5.4517|53
05224|Santa María del Arroyo|40.6003|-4.9222|103
05225|Santa María del Berrocal|40.5094|-5.4064|372
05902|Santa María del Cubillo|40.7178|-4.4617|308
05227|Santa María del Tiétar|40.3043|-4.5542|582
05228|Santiago del Collado|40.4333|-5.3563|161
05904|Santiago del Tormes|40.3456|-5.3800|104|Santiago de Tormes
05229|Santo Domingo de las Posadas|40.8122|-4.6336|71
05230|Santo Tomé de Zabarcos|40.7861|-4.9100|70
05232|La Serrada|40.6314|-4.7922|132
05233|Serranillos|40.3358|-4.9117|247
05234|Sigeres|40.7994|-4.9325|41
05235|Sinlabajos|41.0772|-4.8319|134
05236|Solana de Ávila|40.3147|-5.6158|95
05237|Solana de Rioalmar|40.7372|-5.0106|141
05238|Solosancho|40.5536|-4.9061|750
05239|Sotalbo|40.5419|-4.8484|234
05240|Sotillo de la Adrada|40.2934|-4.5827|5081
05241|El Tiemblo|40.4143|-4.5001|4582
05242|Tiñosillos|40.9342|-4.7275|732
05243|Tolbaños|40.7511|-4.5814|87
05244|Tormellas|40.3042|-5.5117|35
05245|Tornadizos de Ávila|40.6261|-4.6153|458
05247|La Torre|40.5892|-4.9653|209
05246|Tórtoles|40.5608|-5.2617|37
05249|Umbrías|40.3131|-5.5781|100
05251|Vadillo de la Sierra|40.6064|-5.1249|50
05252|Valdecasa|40.6595|-5.0118|54
05253|Vega de Santa María|40.8362|-4.6429|88
05254|Velayos|40.8416|-4.6232|203
05256|Villaflor|40.7583|-4.8742|100
05257|Villafranca de la Sierra|40.4985|-5.2313|128
05905|Villanueva de Ávila|40.3797|-4.8219|202
05258|Villanueva de Gómez|40.8839|-4.7153|119
05259|Villanueva del Aceral|41.0410|-4.8542|86
05260|Villanueva del Campillo|40.5783|-5.1800|107
05261|Villar de Corneja|40.4753|-5.4292|31
05262|Villarejo del Valle|40.2858|-4.9975|304
05263|Villatoro|40.5561|-5.1111|150
05264|Viñegra de Moraña|40.8492|-4.9222|49
05265|Vita|40.8119|-5.0047|81
05266|Zapardiel de la Cañada|40.6058|-5.3400|83
05267|Zapardiel de la Ribera|40.3556|-5.3286|90
06001|Acedera|39.0769|-5.5722|815
06002|Aceuchal|38.6500|-6.4831|5307
06003|Ahillones|38.2596|-5.8642|793
06004|Alange|38.7858|-6.2456|1802
06005|La Albuera|38.7161|-6.8240|1995
06006|Alburquerque|39.2192|-7.0011|4928
06007|Alconchel|38.5167|-7.0710|1592
06008|Alconera|38.3973|-6.4767|748
06009|Aljucén|39.0444|-6.3303|252
06010|Almendral|38.6141|-6.8209|1202
06011|Almendralejo|38.6831|-6.4092|34587|Almendralexo
06012|Arroyo de San Serván|38.8531|-6.4553|4001
06013|Atalaya|38.3330|-6.4746|258
06014|Azuaga|38.2589|-5.6778|7587
06015|Badajoz|38.8779|-6.9706|150209|Badaxoz|Badayoz
06016|Barcarrota|38.5148|-6.8486|3456
06017|Baterno|38.9567|-4.9114|231
06018|Benquerencia de la Serena|38.6994|-5.4945|771
06019|Berlanga|38.2828|-5.8292|2175
06020|Bienvenida|38.2992|-6.2093|1999
06021|Bodonal de la Sierra|38.1483|-6.5600|982
06022|Burguillos del Cerro|38.3800|-6.5905|2940
06023|Cabeza del Buey|38.7211|-5.2194|4489
06024|Cabeza la Vaca|38.0867|-6.4211|1257
06025|Calamonte|38.8900|-6.3850|6104
06026|Calera de León|38.1063|-6.3377|912
06027|Calzadilla de los Barros|38.3006|-6.3175|679
06028|Campanario|38.8637|-5.6174|4702
06029|Campillo de Llerena|38.5007|-5.8324|1321
06030|Capilla|38.8167|-5.0831|142
06031|Carmonita|39.1536|-6.3382|514
06032|El Carrascalejo|39.0227|-6.3372|80
06033|Casas de Don Pedro|39.1056|-5.3308|1375
06034|Casas de Reina|38.2022|-5.9697|200
06035|Castilblanco|39.3056|-5.1103|820
06036|Castuera|38.7230|-5.5443|5457
06042|Cheles|38.5122|-7.2803|1175
06037|La Codosera|39.2086|-7.1733|1983
06038|Cordobilla de Lácara|39.1482|-6.4374|815
06039|La Coronada|38.9196|-5.6707|2136
06040|Corte de Peleas|38.7253|-6.6708|1153
06041|Cristina|38.8375|-6.1003|549
06043|Don Álvaro|38.8472|-6.2758|841
06044|Don Benito|38.9500|-5.8500|37986
06045|Entrín Bajo|38.7189|-6.7133|548
06046|Esparragalejo|38.9436|-6.4367|1506
06047|Esparragosa de la Serena|38.6498|-5.6062|912
06048|Esparragosa de Lares|38.9756|-5.2703|839
06049|Feria|38.5129|-6.5638|1054
06050|Fregenal de la Sierra|38.1667|-6.6500|4715
06051|Fuenlabrada de los Montes|39.1317|-4.9356|1693
06052|Fuente de Cantos|38.2467|-6.3092|4583
06053|Fuente del Arco|38.1525|-5.8967|648
06054|Fuente del Maestre|38.5289|-6.4500|6499
06055|Fuentes de León|38.0686|-6.5386|2118
06056|Garbayuela|39.0489|-5.0006|450
06057|Garlitos|38.8800|-5.0481|510
06058|La Garrovilla|38.9211|-6.4758|2310
06059|Granja de Torrehermosa|38.3099|-5.5952|1913
06903|Guadiana|38.9303|-6.6908|2444
06060|Guareña|38.8601|-6.1018|6665
06061|La Haba|38.9195|-5.8019|1184
06062|Helechosa de los Montes|39.3117|-4.9092|556
06063|Herrera del Duque|39.1686|-5.0511|3385
06064|Higuera de la Serena|38.6450|-5.7414|881
06065|Higuera de Llerena|38.3772|-5.9994|343
06066|Higuera de Vargas|38.4461|-6.9739|1830
06067|Higuera la Real|38.1333|-6.6833|2186
06068|Hinojosa del Valle|38.4836|-6.1846|472
06069|Hornachos|38.5556|-6.0697|3375
06070|Jerez de los Caballeros|38.3208|-6.7730|9095
06071|La Lapa|38.4539|-6.5192|298
06073|Llera|38.4486|-6.0572|781
06074|Llerena|38.2375|-6.0153|5642
06072|Lobón|38.8500|-6.6242|2756
06075|Magacela|38.8956|-5.7344|502
06076|Maguilla|38.3676|-5.8376|919
06077|Malcocinado|38.1262|-5.7130|343
06078|Malpartida de la Serena|38.6744|-5.6399|508
06079|Manchita|38.8153|-6.0228|741
06080|Medellín|38.9630|-5.9581|2241
06081|Medina de las Torres|38.3436|-6.4117|1160
06082|Mengabril|38.9364|-5.9331|504
06083|Mérida|38.9158|-6.3333|60225
06084|Mirandilla|39.0016|-6.2875|1232
06085|Monesterio|38.0875|-6.2744|4245
06086|Montemolín|38.1543|-6.2123|1231
06087|Monterrubio de la Serena|38.5900|-5.4433|2157
06088|Montijo|38.9100|-6.6175|15198
06089|La Morera|38.5469|-6.6542|698
06090|La Nava de Santiago|39.0697|-6.5135|914
06091|Navalvillar de Pela|39.0833|-5.4667|4303
06092|Nogales|38.5961|-6.9072|632
06093|Oliva de la Frontera|38.2764|-6.9200|4907
06094|Oliva de Mérida|38.7900|-6.1243|1660
06095|Olivenza|38.6857|-7.1007|11742|Olivença
06096|Orellana de la Sierra|39.0308|-5.4978|250
06097|Orellana la Vieja|39.0053|-5.5342|2580
06098|Palomas|38.6925|-6.1342|651
06099|La Parra|38.5212|-6.6229|1297
06100|Peñalsordo|38.8197|-5.1125|805
06101|Peraleda del Zaucejo|38.4744|-5.5658|465
06102|Puebla de Alcocer|38.9850|-5.2578|1091
06103|Puebla de la Calzada|38.8942|-6.6275|5815
06104|Puebla de la Reina|38.6644|-6.1039|689
06107|Puebla de Obando|39.1776|-6.6286|1809
06108|Puebla de Sancho Pérez|38.3981|-6.4000|2634
06105|Puebla del Maestre|38.0844|-6.0794|653
06106|Puebla del Prior|38.5700|-6.1969|462
06902|Pueblonuevo del Guadiana|38.9233|-6.7556|1955
06109|Quintana de la Serena|38.7417|-5.6722|4429
06110|Reina|38.1878|-5.9494|144
06111|Rena|39.0536|-5.8086|605
06112|Retamal de Llerena|38.5786|-5.8383|428
06113|Ribera del Fresno|38.5521|-6.2387|3130
06114|Risco|38.9106|-5.1231|126
06115|La Roca de la Sierra|39.1091|-6.6902|1454
06116|Salvaleón|38.5103|-6.7867|1645
06117|Salvatierra de los Barros|38.4911|-6.6853|1546
06119|San Pedro de Mérida|38.9500|-6.1859|859
06123|San Vicente de Alcántara|39.3603|-7.1369|5227
06118|Sancti-Spíritus|38.9253|-5.1464|141
06120|Santa Amalia|39.0112|-6.0099|3881
06121|Santa Marta|38.6153|-6.6259|4201
06122|Los Santos de Maimona|38.4489|-6.3839|8088
06124|Segura de León|38.1199|-6.5290|1758
06125|Siruela|38.9776|-5.0492|1766
06126|Solana de los Barros|38.7245|-6.5378|2522
06127|Talarrubias|39.0342|-5.2361|3251
06128|Talavera la Real|38.8764|-6.7736|5288
06129|Táliga|38.5273|-7.0141|650
06130|Tamurejo|38.9916|-4.9475|190
06131|Torre de Miguel Sesmero|38.6189|-6.7961|1234
06132|Torremayor|38.9000|-6.5331|992
06133|Torremejía|38.7892|-6.3767|2238
06134|Trasierra|38.1917|-5.9953|590
06135|Trujillanos|38.9511|-6.2588|1397
06136|Usagre|38.3572|-6.1642|1698
06137|Valdecaballeros|39.2464|-5.1919|1036
06901|Valdelacalzada|38.8897|-6.7014|2743
06138|Valdetorres|38.9161|-6.0686|1105
06139|Valencia de las Torres|38.4035|-6.0029|486
06140|Valencia del Mombuey|38.2416|-7.1190|703
06141|Valencia del Ventoso|38.2653|-6.4744|1870
06146|Valle de la Serena|38.7006|-5.7997|1075
06147|Valle de Matamoros|38.3787|-6.8035|337
06148|Valle de Santa Ana|38.3656|-6.7881|1090
06142|Valverde de Burguillos|38.3272|-6.5361|260
06143|Valverde de Leganés|38.6733|-6.9819|4230
06144|Valverde de Llerena|38.2167|-5.8167|560
06145|Valverde de Mérida|38.9108|-6.2203|1002
06149|Villafranca de los Barros|38.5613|-6.3392|12284
06150|Villagarcía de la Torre|38.2958|-6.0803|909
06151|Villagonzalo|38.8631|-6.1969|1226
06152|Villalba de los Barros|38.6132|-6.5091|1429
06153|Villanueva de la Serena|38.9739|-5.8003|25773
06154|Villanueva del Fresno|38.3754|-7.1656|3247
06156|Villar de Rena|39.0771|-5.8107|1326
06155|Villar del Rey|39.1325|-6.8478|2064
06157|Villarta de los Montes|39.2142|-4.7922|375
06158|Zafra|38.4259|-6.4162|16735
06159|Zahínos|38.3305|-6.9547|2766
06160|Zalamea de la Serena|38.6497|-5.6569|3371
06162|La Zarza|38.8181|-6.2181|3339
06161|Zarza-Capilla|38.8070|-5.1574|295
07002|Alaior|39.9342|4.1400|10217|Alayor
07001|Alaró|39.7067|2.7908|6121
07003|Alcúdia|39.8525|3.1192|21907
07004|Algaida|39.5592|2.8947|6357
07005|Andratx|39.5746|2.4206|12195|Andrach
07901|Ariany|39.6494|3.1108|1072
07006|Artà|39.6952|3.3512|8629
07007|Banyalbufar|39.6875|2.5148|913|Bañalbufar
07008|Binissalem|39.6831|2.8333|9350|Binisalem
07009|Búger|39.7591|2.9856|1215
07010|Bunyola|39.6967|2.6997|7642|Buñola
07011|Calvià|39.5667|2.5167|53793
07012|Campanet|39.7667|2.9667|2859
07013|Campos|39.4306|3.0194|12485
07014|Capdepera|39.7000|3.4333|13135
07064|Es Castell|39.8803|4.2908|7774|Villacarlos
07015|Ciutadella de Menorca|40.0014|3.8364|32431|Ciudadela
07016|Consell|39.6691|2.8122|4521
07017|Costitx|39.6575|2.9500|1591
07018|Deià|39.7500|2.6331|741|Deyá
07026|Eivissa|38.9089|1.4328|55337|Ibiza
07019|Escorca|39.8333|2.9167|199
07020|Esporles|39.6662|2.5799|5264|Esporlas
07021|Estellencs|39.6535|2.4810|369|Estellenchs
07022|Felanitx|39.4692|3.1481|19146|Felanich
07023|Ferreries|39.9833|4.0108|5170|Ferrerías
07024|Formentera|38.7000|1.4500|11661
07025|Fornalutx|39.7827|2.7409|743|Fornaluch
07027|Inca|39.7167|2.9167|36262
07028|Lloret de Vistalegre|39.6179|2.9752|1691|Lloret de Vista Alegre
07029|Lloseta|39.7179|2.8667|6463
07030|Llubí|39.6991|3.0049|2589
07031|Llucmajor|39.4900|2.8898|40502
07033|Manacor|39.5700|3.2089|49153
07034|Mancor de la Vall|39.7501|2.8710|1692|Mancor del Valle
07032|Maó|39.8894|4.2642|30666|Mahón
07035|Maria de la Salut|39.6645|3.0747|2461|María de la Salud
07036|Marratxí|39.6421|2.7527|40422|Marrachí
07037|Es Mercadal|39.9872|4.0933|6459|Mercadal
07902|Es Migjorn Gran|39.9453|4.0489|1765
07038|Montuïri|39.5700|2.9841|3289
07039|Muro|39.7345|3.0554|8398
07040|Palma|39.5667|2.6497|434786
07041|Petra|39.6142|3.1118|3231
07044|Sa Pobla|39.7693|3.0225|14990|La Puebla
07042|Pollença|39.8772|3.0164|17807|Pollensa
07043|Porreres|39.5144|3.0237|5892|Porreras
07045|Puigpunyent|39.6226|2.5275|2049|Puigpuñent
07059|Ses Salines|39.3386|3.0536|5248|Las Salinas
07046|Sant Antoni de Portmany|38.9808|1.3006|29132|San Antonio Abad|San Antonio Abá
07049|Sant Joan|39.5943|3.0401|2336|San Juan
07050|Sant Joan de Labritja|39.0781|1.5119|7046|San Juan Bautista
07048|Sant Josep de sa Talaia|38.9217|1.2933|29761|San José
07051|Sant Llorenç des Cardassar|39.6090|3.2853|9231|San Lorenzo del Cardezar
07052|Sant Lluís|39.8494|4.2581|7312|San Luis
07053|Santa Eugènia|39.6237|2.8392|1902
07054|Santa Eulària des Riu|38.9847|1.5336|42479|Santa Eulalia del Río
07055|Santa Margalida|39.7033|3.1036|14056|Santa Margarita
07056|Santa María del Camí|39.6511|2.7731|7744|Santa María del Camino
07057|Santanyí|39.3542|3.1283|13067|Santañí
07058|Selva|39.7545|2.9007|4326
07047|Sencelles|39.6464|2.8978|3973
07060|Sineu|39.6431|3.0116|4537
07061|Sóller|39.7663|2.7153|13882
07062|Son Servera|39.6208|3.3600|12417
07063|Valldemossa|39.7117|2.6226|2038|Valldemosa
07065|Vilafranca de Bonany|39.5699|3.0880|3929|Villafranca de Bonany
08001|Abrera|41.5165|1.9024|13227
08002|Aguilar de Segarra|41.7408|1.6319|292
08014|Aiguafreda|41.7681|2.2515|2569
08003|Alella|41.4953|2.2958|10262
08004|Alpens|42.1206|2.1022|267
08005|L'Ametlla del Vallès|41.6681|2.2607|9474|La Ametlla
08006|Arenys de Mar|41.5819|2.5503|17042
08007|Arenys de Munt|41.6128|2.5403|9558
08008|Argençola|41.5997|1.4458|245|Argensola
08009|Argentona|41.5558|2.4025|12891
08010|Artés|41.7981|1.9552|6225
08011|Avià|42.0797|1.8183|2267
08012|Avinyó|41.8630|1.9707|2322
08013|Avinyonet del Penedès|41.3631|1.7789|1782
08015|Badalona|41.4333|2.2333|231542
08904|Badia del Vallès|41.5080|2.1140|13060
08016|Bagà|42.2547|1.8636|2161
08017|Balenyà|41.8129|2.2348|4021
08018|Balsareny|41.8658|1.8769|3380
08252|Barberà del Vallès|41.5164|2.1244|33987
08019|Barcelona|41.3825|2.1769|1731649|Bartzelona
08020|Begues|41.3319|1.9228|7561|Begas
08021|Bellprat|41.5189|1.4353|69
08022|Berga|42.1000|1.8456|17473
08023|Bigues i Riells del Fai|41.6786|2.2236|10139|Bigas
08024|Borredà|42.1381|1.9958|433
08025|El Bruc|41.5825|1.7811|2290
08026|El Brull|41.8186|2.3069|296|Brull
08027|Les Cabanyes|41.3731|1.6903|1060
08028|Cabrera d'Anoia|41.4794|1.7047|1772|Cabrera de Igualada
08029|Cabrera de Mar|41.5275|2.3956|5045
08030|Cabrils|41.5283|2.3692|7765
08031|Calaf|41.7327|1.5148|3644
08034|Calders|41.7906|1.9878|1122
08033|Caldes de Montbui|41.6328|2.1675|18567|Caldas de Montbuy
08032|Caldes d'Estrac|41.5719|2.5286|3356|Caldetas
08035|Calella|41.6169|2.6642|20864
08037|Calldetenes|41.9275|2.2856|2733
08038|Callús|41.7825|1.7838|2180
08036|Calonge de Segarra|41.7658|1.4825|179
08039|Campins|41.7264|2.4650|586
08040|Canet de Mar|41.5911|2.5828|15198
08041|Canovelles|41.6176|2.2814|17473|Canovellas
08042|Cànoves i Samalús|41.6940|2.3530|3399
08043|Canyelles|41.2829|1.7229|5505|Canyellas
08044|Capellades|41.5319|1.6867|5608
08045|Capolat|42.0784|1.7529|93
08046|Cardedeu|41.6406|2.3594|19046
08047|Cardona|41.9141|1.6810|4553
08048|Carme|41.5314|1.6211|847
08049|Casserres|42.0150|1.8433|1660|Caserras
08057|Castell de l'Areny|42.1747|1.9469|68|Castell del Areny
08052|Castellar de n'Hug|42.2850|2.0189|166|Castellar de Nuch
08050|Castellar del Riu|42.1331|1.7100|151
08051|Castellar del Vallès|41.6185|2.0878|25422
08053|Castellbell i el Vilar|41.6339|1.8636|4159|Castellbell y Vilar
08054|Castellbisbal|41.4767|1.9822|13061
08055|Castellcir|41.7619|2.1497|804
08056|Castelldefels|41.2800|1.9767|70057
08058|Castellet i la Gornal|41.2543|1.5928|2776|Castellet y Gornal
08060|Castellfollit de Riubregós|41.7762|1.4384|153
08059|Castellfollit del Boix|41.6657|1.6847|467|Castellfullit del Boix
08061|Castellgalí|41.6733|1.8378|2413
08062|Castellnou de Bages|41.8348|1.8365|1473
08063|Castellolí|41.5982|1.7002|669
08064|Castellterçol|41.7519|2.1225|2754|Castelltersol
08065|Castellví de la Marca|41.3281|1.6197|1721
08066|Castellví de Rosanes|41.4517|1.9006|2171
08067|Centelles|41.7994|2.2217|7864
08268|Cercs|42.1481|1.8619|1236|Serchs
08266|Cerdanyola del Vallès|41.4919|2.1389|58528|Sardañola del Vallés
08068|Cervelló|41.3962|1.9589|9743
08069|Collbató|41.5708|1.8303|4828
08070|Collsuspina|41.8278|2.1761|391
08071|Copons|41.6383|1.5194|352
08072|Corbera de Llobregat|41.4169|1.9314|16010
08073|Cornellà de Llobregat|41.3550|2.0711|92237
08074|Cubelles|41.2100|1.6736|17673|Cubellas
08075|Dosrius|41.5942|2.4072|6287
08076|Esparreguera|41.5381|1.8692|22665|Esparraguera
08077|Esplugues de Llobregat|41.3767|2.0858|48221|Esplugas de Llobregat
08078|L'Espunyola|42.0547|1.7708|260|Espunyola
08254|L'Esquirol|42.0349|2.3690|2301
08079|L'Estany|41.8683|2.1116|390
08134|Figaró-Montmany|41.7228|2.2750|1195|el Figaró-Montmany
08080|Fígols|42.1809|1.8368|40
08082|Fogars de la Selva|41.7281|2.6811|1704|Fogás de Tordera
08081|Fogars de Montclús|41.7286|2.4444|494
08083|Folgueroles|41.9401|2.3163|2262|Folgarolas
08084|Fonollosa|41.7632|1.6690|1570
08085|Font-rubí|41.4153|1.6519|1441|Fontrubí
08086|Les Franqueses del Vallès|41.6364|2.2963|20881
08090|Gaià|41.9250|1.9103|172|Gayá
08087|Gallifa|41.6942|2.1156|171
08088|La Garriga|41.6804|2.2833|17426
08089|Gavà|41.3072|2.0039|48243
08091|Gelida|41.4409|1.8647|8198
08092|Gironella|42.0375|1.8831|5083
08093|Gisclareny|42.2519|1.7875|28
08094|La Granada|41.3772|1.7199|2287
08095|Granera|41.7306|2.0594|84
08096|Granollers|41.6083|2.2889|65341
08097|Gualba|41.7322|2.5047|1766
08099|Guardiola de Berguedà|42.2333|1.8793|1020
08100|Gurb|41.9575|2.2339|2741
08101|L'Hospitalet de Llobregat|41.3589|2.0992|289510|Hospitalet de Llobregat
08162|Els Hostalets de Pierola|41.5356|1.7719|3258
08102|Igualada|41.5814|1.6208|42085
08103|Jorba|41.6036|1.5489|850
08104|La Llacuna|41.4742|1.5342|959
08105|La Llagosta|41.5156|2.1928|13280
08107|Lliçà d'Amunt|41.6105|2.2397|16540|Llissá de Munt
08108|Lliçà de Vall|41.5936|2.2431|6903|Llissá de Vall
08106|Llinars del Vallès|41.6406|2.4022|10956|Llinás del Vallés
08109|Lluçà|42.0700|2.0744|281|Llusá
08110|Malgrat de Mar|41.6456|2.7428|19714
08111|Malla|41.8889|2.2358|285
08112|Manlleu|42.0000|2.2836|21425
08113|Manresa|41.7264|1.8292|80974
08242|Marganell|41.6406|1.7908|309
08114|Martorell|41.4744|1.9305|29175
08115|Martorelles|41.5279|2.2375|4992|Martorellas
08116|Les Masies de Roda|41.9901|2.3067|758|Masías de Roda
08117|Les Masies de Voltregà|42.0242|2.2361|3345|Las Masías de Voltregá
08118|El Masnou|41.4817|2.3178|24761
08119|Masquefa|41.5036|1.8136|10120
08120|Matadepera|41.6036|2.0244|9776
08121|Mataró|41.5333|2.4500|131683
08122|Mediona|41.4797|1.6125|2658
08138|Moià|41.8131|2.0971|6828|Moyá
08123|Molins de Rei|41.4139|2.0158|27300|Molins de Rey
08124|Mollet del Vallès|41.5356|2.2107|52990
08128|Monistrol de Calders|41.7564|2.0140|764
08127|Monistrol de Montserrat|41.6094|1.8419|3250
08125|Montcada i Reixac|41.4867|2.1879|37460|Moncada y Reixach
08130|Montclar|42.0181|1.7650|132
08131|Montesquiu|42.1111|2.2106|1131
08126|Montgat|41.4667|2.2790|12879
08132|Montmajor|42.0178|1.7354|473
08133|Montmaneu|41.6272|1.4172|181
08135|Montmeló|41.5547|2.2500|8886
08136|Montornès del Vallès|41.5444|2.2670|17102
08137|Montseny|41.7593|2.3949|388
08129|Muntanyola|41.8803|2.1797|697
08139|Mura|41.6998|1.9765|235
08140|Navarcles|41.7532|1.9034|6276
08141|Navàs|41.8997|1.8786|6238
08142|La Nou de Berguedà|42.1678|1.8861|163
08143|Òdena|41.6081|1.6419|3760
08145|Olèrdola|41.3217|1.7231|3945
08146|Olesa de Bonesvalls|41.3553|1.8506|2135
08147|Olesa de Montserrat|41.5450|1.8944|24966
08148|Olivella|41.3104|1.8109|4435
08149|Olost|41.9878|2.0969|1209
08144|Olvan|42.0586|1.9061|924
08150|Orís|42.0600|2.2403|355
08151|Oristà|41.9347|2.0619|555
08152|Orpí|41.5308|1.6081|175
08153|Òrrius|41.5575|2.3558|812
08154|Pacs del Penedès|41.3642|1.6708|932|Pachs del Panadés
08155|Palafolls|41.6692|2.7506|10038
08156|Palau-solità i Plegamans|41.5876|2.1785|15614|Paláu Solitar y Plegamans
08157|Pallejà|41.4242|1.9978|12006
08905|La Palma de Cervelló|41.4130|1.9687|3056
08158|El Papiol|41.4392|2.0106|4404
08159|Parets del Vallès|41.5733|2.2337|18885
08160|Perafita|42.0433|2.1089|433
08161|Piera|41.5222|1.7494|17880
08163|Pineda de Mar|41.6272|2.6911|30108
08164|El Pla del Penedès|41.4176|1.7128|1393|Pla del Penedés
08165|La Pobla de Claramunt|41.5544|1.6797|2350
08166|La Pobla de Lillet|42.2444|1.9744|1105
08167|Polinyà|41.5575|2.1562|8581
08182|El Pont de Vilomara i Rocafort|41.7049|1.9076|4193
08168|Pontons|41.4175|1.5178|516
08169|El Prat de Llobregat|41.3246|2.0953|66338
08171|Prats de Lluçanès|42.0108|2.0308|2761|Prats de Llusanés
08170|Els Prats de Rei|41.7075|1.5422|554
08230|Premià de Dalt|41.5081|2.3458|10632
08172|Premià de Mar|41.4920|2.3620|29431
08174|Puigdàlber|41.4061|1.7014|621|Puigdalba
08175|Puig-reig|41.9742|1.8806|4565|Puigreig
08176|Pujalt|41.7183|1.4217|204
08177|La Quar|42.1069|1.9817|41|La Quartera
08178|Rajadell|41.7292|1.7056|597
08179|Rellinars|41.6375|1.9108|926
08180|Ripollet|41.4965|2.1534|39897
08181|La Roca del Vallès|41.5827|2.3247|11014
08183|Roda de Ter|41.9801|2.3091|6937
08184|Rubí|41.4933|2.0325|82823
08185|Rubió|41.6464|1.5714|225
08901|Rupit i Pruit|42.0258|2.4669|280|Rupit y Pruït
08187|Sabadell|41.5483|2.1075|225368
08188|Sagàs|42.0525|1.9636|154
08190|Saldes|42.2314|1.7381|302
08191|Sallent|41.8259|1.8949|7030
08194|Sant Adrià de Besòs|41.4305|2.2183|39323|San Adrián de Besós
08195|Sant Agustí de Lluçanès|42.0869|2.1283|106|San Agustín de Llusanés
08196|Sant Andreu de la Barca|41.4478|1.9769|27094|San Andrés de la Barca
08197|Sant Andreu de Llavaneres|41.5733|2.4828|11938|San Andrés de Llavaneras
08198|Sant Antoni de Vilamajor|41.6726|2.4000|6724|San Antonio Vilamajor
08199|Sant Bartomeu del Grau|41.9856|2.1719|933|San Bartolomé del Grau
08200|Sant Boi de Llobregat|41.3458|2.0417|85610|San Baudilio de Llobregat
08201|Sant Boi de Lluçanès|42.0597|2.1525|602|San Baudilio de Llusanés
08203|Sant Cebrià de Vallalta|41.6214|2.6006|3872|San Cipriano de Vallalta
08202|Sant Celoni|41.6895|2.4897|18977|San Celoni
08204|Sant Climent de Llobregat|41.3381|1.9983|4187|San Clemente de Llobregat
08205|Sant Cugat del Vallès|41.4735|2.0852|97983|San Cugat del Vallés
08206|Sant Cugat Sesgarrigues|41.3661|1.7542|1038|San Cugat Sasgarrigas
08207|Sant Esteve de Palautordera|41.7061|2.4319|3099|San Esteban de Palautordera
08208|Sant Esteve Sesrovires|41.4950|1.8744|8121|San Esteban  Sasroviras
08210|Sant Feliu de Codines|41.6885|2.1647|6827|San Felíu de Codinas
08211|Sant Feliu de Llobregat|41.3833|2.0439|46781|San Feliú de Llobregat
08212|Sant Feliu Sasserra|41.9460|2.0230|633|San Felíu Saserra
08209|Sant Fost de Campsentelles|41.5061|2.2400|9419|San Fausto de Campcentellas
08213|Sant Fruitós de Bages|41.7507|1.8727|9333|San Fructuoso de Bages
08215|Sant Hipòlit de Voltregà|42.0172|2.2389|3666|San Hipólito de Voltregá
08193|Sant Iscle de Vallalta|41.6247|2.5703|1477|San Acisclo de Vallalta
08216|Sant Jaume de Frontanyà|42.1889|2.0258|25|San Jaime de Frontanya
08218|Sant Joan de Vilatorrada|41.7456|1.8056|11133|San Juan de Torruella
08217|Sant Joan Despí|41.3668|2.0570|35926|San Juan Despí
08903|Sant Julià de Cerdanyola|42.2256|1.8939|234|San Julián de Cerdañola
08220|Sant Julià de Vilatorta|41.9230|2.3251|3323|San Julián de Vilatorta
08221|Sant Just Desvern|41.3833|2.0750|21037|San Justo Desvern
08222|Sant Llorenç d'Hortons|41.4697|1.8256|2627|San Lorenzo de Hortóns
08223|Sant Llorenç Savall|41.6789|2.0586|2587|San Lorenzo Savall
08225|Sant Martí d'Albars|42.0297|2.0753|135|San Martín del Bas
08224|Sant Martí de Centelles|41.7653|2.2517|1263|San Martín de Centellas
08226|Sant Martí de Tous|41.5619|1.5247|1269|San Martín de Tous
08227|Sant Martí Sarroca|41.3872|1.6119|3485|San Martín Sarroca
08228|Sant Martí Sesgueioles|41.7031|1.4903|353|San Martín Sasgayolas
08229|Sant Mateu de Bages|41.7970|1.7327|641|San Mateo de Bages
08231|Sant Pere de Ribes|41.2592|1.7730|32705|San Pedro de Ribas
08232|Sant Pere de Riudebitlles|41.4525|1.7047|2516|San Pedro de Riudevitlles
08233|Sant Pere de Torelló|42.0748|2.2968|2596|San Pedro de Torelló
08234|Sant Pere de Vilamajor|41.6834|2.3930|5074|San Pedro de Vilamajor
08189|Sant Pere Sallavinera|41.7383|1.5756|177|Salavinera
08235|Sant Pol de Mar|41.6033|2.6244|5793|San Pol de Mar
08236|Sant Quintí de Mediona|41.4644|1.6650|2580|San Quintín de Mediona
08237|Sant Quirze de Besora|42.1033|2.2203|2164|San Quirico de Besora
08238|Sant Quirze del Vallès|41.5301|2.0820|20209|San Quirico del Vallés
08239|Sant Quirze Safaja|41.7303|2.1544|663|San Quirico Safaja
08240|Sant Sadurní d'Anoia|41.4261|1.7850|12911|San Sadurní de Noya
08241|Sant Sadurní d'Osormort|41.9036|2.3825|89|San Saturnino de Osormot
08098|Sant Salvador de Guardiola|41.6798|1.7671|3612|Guardiola
08262|Sant Vicenç de Castellet|41.6655|1.8641|10164|San Vicente de Castellet
08264|Sant Vicenç de Montalt|41.5803|2.5086|6802|San Vicente de Montalt
08265|Sant Vicenç de Torelló|42.0622|2.2728|2117|San Vicente de Torelló
08263|Sant Vicenç dels Horts|41.3932|2.0097|28746|San Vicente dels Horts
08243|Santa Cecília de Voltregà|41.9947|2.2233|197
08244|Santa Coloma de Cervelló|41.3687|2.0175|8273
08245|Santa Coloma de Gramenet|41.4539|2.2111|123981|Santa Coloma de Gramanet
08246|Santa Eugènia de Berga|41.9022|2.2842|2348
08247|Santa Eulàlia de Riuprimer|41.9128|2.1897|1516
08248|Santa Eulàlia de Ronçana|41.6531|2.2261|7953|Santa Eulalia de Ronsana
08249|Santa Fe del Penedès|41.3869|1.7217|365|Santa Fe del Panadés
08250|Santa Margarida de Montbui|41.5756|1.6092|10631|Santa Margarita de Montbuy
08251|Santa Margarida i els Monjos|41.3231|1.6647|7806|Santa Margarita y Monjós
08253|Santa Maria de Besora|42.1294|2.2589|164
08256|Santa Maria de Martorelles|41.5214|2.2550|868|Santa María de Martorellas de Arriba
08255|Santa Maria de Merlès|42.0017|1.9792|179|Santa María de Marlés
08257|Santa Maria de Miralles|41.5197|1.5278|144
08259|Santa Maria de Palautordera|41.6953|2.4458|10080
08258|Santa Maria d'Oló|41.8747|2.0349|1099|Santa María de Oló
08260|Santa Perpètua de Mogoda|41.5375|2.1819|26130|Santa Perpetua de Moguda
08261|Santa Susanna|41.6367|2.7081|4099
08192|Santpedor|41.7836|1.8392|7744|Sampedor
08267|Sentmenat|41.6086|2.1358|9548|Senmanat
08269|Seva|41.8406|2.2853|3808
08270|Sitges|41.2339|1.8042|32609
08271|Sobremunt|42.0378|2.1664|90
08272|Sora|42.1144|2.1608|225
08273|Subirats|41.3847|1.7981|3288
08274|Súria|41.8311|1.7526|6200
08276|Tagamanent|41.7387|2.2678|328
08277|Talamanca|41.7333|1.9833|209
08278|Taradell|41.8737|2.2874|6854
08275|Tavèrnoles|41.9536|2.3278|354|Tabérnolas
08280|Tavertet|41.9953|2.4178|128
08281|Teià|41.4986|2.3242|6898|Teyá
08279|Terrassa|41.5611|2.0081|233270|Tarrasa|Terrasa
08282|Tiana|41.4831|2.2697|9331
08283|Tona|41.8506|2.2292|8527
08284|Tordera|41.7008|2.7200|19039
08285|Torelló|42.0492|2.2629|15334
08286|La Torre de Claramunt|41.5353|1.6608|4158|Torre de Claramunt
08287|Torrelavit|41.4494|1.7300|1572|Terrassola i Lavit
08288|Torrelles de Foix|41.3900|1.5706|2746|Torrellas de Foix
08289|Torrelles de Llobregat|41.3565|1.9816|6170|Torrellas de Llobregat
08290|Ullastrell|41.5263|1.9587|2171
08291|Vacarisses|41.6063|1.9182|7729
08292|Vallbona d'Anoia|41.5208|1.7089|1424
08293|Vallcebre|42.2056|1.8194|260
08294|Vallgorguina|41.6479|2.5104|3261
08295|Vallirana|41.3878|1.9321|16245
08296|Vallromanes|41.5318|2.2982|2778
08297|Veciana|41.6583|1.4894|168
08298|Vic|41.9304|2.2546|50796
08299|Vilada|42.1386|1.9311|432
08301|Viladecans|41.3158|2.0194|67587
08300|Viladecavalls|41.5578|1.9558|7817|Viladecaballs
08305|Vilafranca del Penedès|41.3447|1.6994|42607|Villafranca del Panadés
08306|Vilalba Sasserra|41.6539|2.4422|794|Villalba Saserra
08303|Vilanova de Sau|41.9489|2.3858|325
08302|Vilanova del Camí|41.5733|1.6381|12936
08902|Vilanova del Vallès|41.5542|2.2886|5693
08307|Vilanova i la Geltrú|41.2243|1.7259|71641|Villanueva y Geltrú
08214|Vilassar de Dalt|41.5164|2.3593|9404|Vilasar de Dalt
08219|Vilassar de Mar|41.5053|2.3928|21227|Vilasar de Mar
08304|Vilobí del Penedès|41.3906|1.6625|1154|Viloví
08308|Viver i Serrateix|41.9500|1.7822|178|Viver y Serrateix
09001|Abajas|42.6233|-3.5800|28
09003|Adrada de Haza|41.5942|-3.8217|200
09006|Aguas Cándidas|42.7158|-3.5017|61
09007|Aguilar de Bureba|42.5900|-3.3286|46
09009|Albillos|42.2764|-3.7931|220
09010|Alcocero de Mola|42.4747|-3.3569|40
09011|Alfoz de Bricia|42.8967|-3.8792|68
09907|Alfoz de Quintanadueñas|42.3833|-3.7333|2158
09012|Alfoz de Santa Gadea|42.9556|-3.9506|102
09013|Altable|42.6033|-3.0769|44
09014|Los Altos|42.8086|-3.6317|177
09016|Ameyugo|42.6556|-3.0614|107
09017|Anguix|41.7535|-3.9322|166
09018|Aranda de Duero|41.6714|-3.6864|33956
09019|Arandilla|41.7375|-3.4286|157
09020|Arauzo de Miel|41.8600|-3.3878|260
09021|Arauzo de Salce|41.8197|-3.4122|44
09022|Arauzo de Torre|41.7983|-3.4225|55
09023|Arcos|42.2644|-3.7541|1823
09024|Arenillas de Riopisuerga|42.3567|-4.2331|156
09025|Arija|42.9942|-3.9444|115
09026|Arlanzón|42.3228|-3.4581|425
09027|Arraya de Oca|42.4153|-3.3978|49
09029|Atapuerca|42.3767|-3.5092|178
09030|Los Ausines|42.2256|-3.5975|143
09032|Avellanosa de Muñó|41.9836|-3.8244|95
09033|Bahabón de Esgueva|41.8619|-3.7292|80
09034|Los Balbases|42.2150|-4.0622|298
09035|Baños de Valdearados|41.7697|-3.5561|322
09036|Bañuelos de Bureba|42.5008|-3.2806|32
09037|Barbadillo de Herreros|42.1500|-3.1667|103
09038|Barbadillo del Mercado|42.0392|-3.3583|134
09039|Barbadillo del Pez|42.1194|-3.2283|64
09041|Barrio de Muñó|42.1750|-4.0069|32
09043|Los Barrios de Bureba|42.6458|-3.3908|179
09044|Barrios de Colina|42.3961|-3.4597|55
09045|Basconcillos del Tozo|42.7025|-3.9894|276
09046|Bascuñana|42.4253|-3.0819|20
09047|Belbimbre|42.1686|-4.0122|53
09048|Belorado|42.4205|-3.1902|1823|Bilforato
09050|Berberana|42.9197|-3.0600|52
09051|Berlangas de Roa|41.6892|-3.8742|204
09052|Berzosa de Bureba|42.6267|-3.2661|26
09054|Bozoó|42.7264|-3.0853|101
09055|Brazacorta|41.7169|-3.3669|43
09056|Briviesca|42.5491|-3.3239|6728
09057|Bugedo|42.6492|-3.0178|193
09058|Buniel|42.3094|-3.8236|632
09059|Burgos|42.3408|-3.6997|177402
09060|Busto de Bureba|42.6592|-3.2644|140
09061|Cabañes de Esgueva|41.8311|-3.7853|145
09062|Cabezón de la Sierra|41.9344|-3.2419|33
09064|Caleruega|41.8254|-3.4870|385
09065|Campillo de Aranda|41.6100|-3.7303|175
09066|Campolara|42.1194|-3.4272|46
09067|Canicosa de la Sierra|41.9358|-3.0419|410
09068|Cantabrana|42.7344|-3.4669|22
09070|Carazo|41.9694|-3.3539|42
09071|Carcedo de Bureba|42.5781|-3.4983|36
09072|Carcedo de Burgos|42.2858|-3.6228|513
09073|Cardeñadijo|42.3013|-3.6669|1445
09074|Cardeñajimeno|42.3308|-3.6217|1185
09075|Cardeñuela Riopico|42.3597|-3.5578|106
09076|Carrias|42.4817|-3.2831|26
09077|Cascajares de Bureba|42.6789|-3.2372|25
09078|Cascajares de la Sierra|42.0617|-3.3994|25
09079|Castellanos de Castro|42.3283|-4.0336|48
09083|Castil de Peones|42.4831|-3.3844|26
09082|Castildelgado|42.4372|-3.0844|34
09084|Castrillo de la Reina|41.9872|-3.2369|159
09085|Castrillo de la Vega|41.6506|-3.7814|626
09088|Castrillo de Riopisuerga|42.5147|-4.2522|56
09086|Castrillo del Val|42.3142|-3.5847|858
09090|Castrillo Mota de Judíos|42.3080|-4.1731|48
09091|Castrojeriz|42.2878|-4.1389|794
09063|Cavia|42.2836|-3.8450|246
09093|Cayuela|42.2725|-3.8194|186
09094|Cebrecos|41.9831|-3.5964|60
09095|Celada del Camino|42.2625|-3.9336|91
09098|Cerezo de Río Tirón|42.4911|-3.1356|467
09100|Cerratón de Juarros|42.4219|-3.3739|42
09101|Ciadoncha|42.1606|-3.9347|77
09102|Cillaperlata|42.7825|-3.3583|31
09103|Cilleruelo de Abajo|41.8842|-3.7956|209
09104|Cilleruelo de Arriba|41.9047|-3.6603|52
09105|Ciruelos de Cervera|41.9056|-3.5300|90
09108|Cogollos|42.2008|-3.6989|687
09109|Condado de Treviño|42.7347|-2.7472|1468|Trebiñu
09110|Contreras|42.0214|-3.4100|81
09112|Coruña del Conde|41.7658|-3.3917|95
09113|Covarrubias|42.0592|-3.5200|501
09114|Cubillo del Campo|42.1683|-3.6103|103
09115|Cubo de Bureba|42.6403|-3.2067|102
09117|La Cueva de Roa|41.6664|-3.9394|82
09119|Cuevas de San Clemente|42.1297|-3.5683|52
09120|Encío|42.6675|-3.0844|37
09122|Espinosa de Cervera|41.8961|-3.4683|81
09124|Espinosa de los Monteros|43.0667|-3.5333|1627
09123|Espinosa del Camino|42.4064|-3.2811|43
09125|Estépar|42.2767|-3.8983|646
09127|Fontioso|41.9425|-3.7389|52
09128|Frandovínez|42.3092|-3.8381|95
09129|Fresneda de la Sierra Tirón|42.3150|-3.1350|98
09130|Fresneña|42.4142|-3.1347|68
09131|Fresnillo de las Dueñas|41.6467|-3.6444|703
09132|Fresno de Río Tirón|42.4600|-3.1747|156
09133|Fresno de Rodilla|42.4200|-3.4850|49
09134|Frías|42.7614|-3.2942|258
09135|Fuentebureba|42.6339|-3.2347|58
09136|Fuentecén|41.6283|-3.8694|246
09137|Fuentelcésped|41.5911|-3.6406|290
09138|Fuentelisendo|41.6222|-3.9019|96
09139|Fuentemolinos|41.6053|-3.8497|89
09140|Fuentenebro|41.5253|-3.7536|137
09141|Fuentespina|41.6319|-3.6853|833
09143|Galbarros|42.5278|-3.4378|28
09144|La Gallega|41.8986|-3.2639|34
09148|Grijalba|42.4297|-4.1189|114
09149|Grisaleña|42.5908|-3.2639|58
09151|Gumiel de Izán|41.7736|-3.6881|587
09152|Gumiel de Mercado|41.7558|-3.8019|376
09154|Hacinas|41.9850|-3.2869|145
09155|Haza|41.6214|-3.8294|33
09159|Hontanas|42.3128|-4.0458|69
09160|Hontangas|41.5825|-3.7961|92
09162|Hontoria de la Cantera|42.1889|-3.6433|172
09164|Hontoria de Valdearados|41.7444|-3.5200|152
09163|Hontoria del Pinar|41.8483|-3.1622|613
09166|Las Hormazas|42.5275|-3.9267|93
09167|Hornillos del Camino|42.3381|-3.9253|44
09168|La Horra|41.7408|-3.8750|295
09169|Hortigüela|42.0681|-3.4253|103
09170|Hoyales de Roa|41.6589|-3.8628|208
09172|Huérmeces|42.5217|-3.7714|159
09173|Huerta de Arriba|42.1161|-3.0819|121
09174|Huerta de Rey|41.8401|-3.3480|889
09175|Humada|42.6681|-4.0833|114
09176|Hurones|42.4061|-3.6139|59
09177|Ibeas de Juarros|42.3311|-3.5356|1492
09178|Ibrillos|42.4539|-3.0831|30
09179|Iglesiarrubia|41.9742|-3.8467|45
09180|Iglesias|42.2978|-3.9900|136
09181|Isar|42.3617|-3.9303|279
09182|Itero del Castillo|42.2892|-4.2442|74
09183|Jaramillo de la Fuente|42.1147|-3.3125|45
09184|Jaramillo Quemado|42.0847|-3.3608|12
09189|Junta de Traslaloma|43.0369|-3.3894|118
09190|Junta de Villalba de Losa|42.9353|-3.0869|79
09191|Jurisdicción de Lara|42.1347|-3.4497|39
09192|Jurisdicción de San Zadornil|42.8428|-3.1564|62
09194|Lerma|42.0264|-3.7556|2629
09195|Llano de Bureba|42.6242|-3.4589|45
09196|Madrigal del Monte|42.1444|-3.6753|141
09197|Madrigalejo del Monte|42.1244|-3.7250|160
09198|Mahamud|42.1197|-3.9408|107
09199|Mambrilla de Castrejón|41.6669|-3.9847|105
09200|Mambrillas de Lara|42.0942|-3.4617|54
09201|Mamolar|41.9267|-3.3617|27
09202|Manciles|42.4556|-3.9442|21
09206|Mazuela|42.2067|-3.9328|55
09208|Mecerreyes|42.0953|-3.5736|176
09209|Medina de Pomar|42.9278|-3.4867|6190
09211|Melgar de Fernamental|42.4033|-4.2444|1496
09213|Merindad de Cuesta-Urria|42.8619|-3.4211|263
09214|Merindad de Montija|43.0656|-3.4739|723
09906|Merindad de Río Ubierna|42.6167|-3.6500|1400
09215|Merindad de Sotoscueva|43.0586|-3.6419|399
09216|Merindad de Valdeporres|43.0106|-3.7406|412
09217|Merindad de Valdivielso|42.8248|-3.5468|384
09218|Milagros|41.5753|-3.6992|409
09219|Miranda de Ebro|42.6833|-2.9333|36622|Miranda Ebro|Miranda d'Ebro
09220|Miraveche|42.6744|-3.1994|92|Mirabetxe
09221|Modúbar de la Emparedada|42.2600|-3.6597|773
09223|Monasterio de la Sierra|42.0511|-3.1933|38
09224|Monasterio de Rodilla|42.4575|-3.4689|171
09225|Moncalvillo|41.9544|-3.1994|77
09226|Monterrubio de la Demanda|42.1481|-3.1125|55
09227|Montorio|42.5844|-3.7764|138
09228|Moradillo de Roa|41.5519|-3.7917|167
09229|Nava de Roa|41.6136|-3.9650|202
09230|Navas de Bureba|42.6822|-3.3267|24
09231|Nebreda|41.9689|-3.6347|50
09232|Neila|42.0597|-2.9969|113
09235|Olmedillo de Roa|41.7831|-3.9339|188
09236|Olmillos de Muñó|42.2025|-3.9403|38
09238|Oña|42.7343|-3.4118|938
09239|Oquillas|41.8317|-3.7036|52
09241|Orbaneja Riopico|42.3600|-3.5833|341
09242|Padilla de Abajo|42.4078|-4.1767|71
09243|Padilla de Arriba|42.4381|-4.1947|86
09244|Padrones de Bureba|42.7047|-3.5319|49
09246|Palacios de la Sierra|41.9633|-3.1261|662
09247|Palacios de Riopisuerga|42.3436|-4.2569|19
09248|Palazuelos de la Sierra|42.2117|-3.4597|95
09249|Palazuelos de Muñó|42.1964|-3.9883|52
09250|Pampliega|42.2058|-3.9875|281
09251|Pancorbo|42.6350|-3.1106|431
09253|Pardilla|41.5506|-3.7100|109
09255|Partido de la Sierra en Tobalina|42.7167|-3.2333|75
09256|Pedrosa de Duero|41.7117|-3.9869|458
09259|Pedrosa de Río Úrbel|42.4094|-3.8211|262
09257|Pedrosa del Páramo|42.4422|-3.9725|88
09258|Pedrosa del Príncipe|42.2492|-4.1989|155
09261|Peñaranda de Duero|41.6872|-3.4775|470
09262|Peral de Arlanza|42.0758|-4.0775|169
09265|Piérnigas|42.5900|-3.4128|43
09266|Pineda de la Sierra|42.2158|-3.2972|92
09267|Pineda Trasmonte|41.9086|-3.6956|95
09268|Pinilla de los Barruecos|41.9189|-3.3050|100
09269|Pinilla de los Moros|42.0678|-3.3272|30
09270|Pinilla Trasmonte|41.8733|-3.6200|152
09272|Poza de la Sal|42.6664|-3.5017|278
09273|Prádanos de Bureba|42.5022|-3.3475|54
09274|Pradoluengo|42.3250|-3.1986|1090
09275|Presencio|42.1872|-3.9003|212
09276|La Puebla de Arganzón|42.7661|-2.8314|565|Argantzun|Argantzon
09277|Puentedura|42.0417|-3.5828|117
09279|Quemada|41.7003|-3.5747|242
09281|Quintana del Pidio|41.7594|-3.7514|150
09280|Quintanabureba|42.5867|-3.3667|29
09283|Quintanaélez|42.6686|-3.2992|44
09287|Quintanaortuño|42.4497|-3.6836|297
09288|Quintanapalla|42.4083|-3.5342|123
09289|Quintanar de la Sierra|41.9814|-3.0394|1474
09292|Quintanavides|42.4814|-3.4247|65
09294|Quintanilla de la Mata|41.9886|-3.7678|109
09901|Quintanilla del Agua y Tordueles|42.0408|-3.6519|336
09295|Quintanilla del Coco|41.9792|-3.5167|50
09298|Quintanilla San García|42.5492|-3.1939|66
09301|Quintanilla Vivar|42.4144|-3.6889|890
09297|Las Quintanillas|42.3725|-3.8439|386
09302|Rabanera del Pinar|41.8925|-3.1942|94
09303|Rábanos|42.3197|-3.2700|73
09304|Rabé de las Calzadas|42.3400|-3.8342|259
09306|Rebolledo de la Torre|42.6869|-4.2272|100
09307|Redecilla del Camino|42.4381|-3.0650|98
09308|Redecilla del Campo|42.4667|-3.1150|65
09309|Regumiel de la Sierra|41.9558|-2.9878|304
09310|Reinoso|42.5111|-3.3819|21
09311|Retuerta|42.0297|-3.5075|56
09314|Revilla del Campo|42.2114|-3.5372|96
09316|Revilla Vallejera|42.1469|-4.1342|112
09312|La Revilla y Ahedo|42.0125|-3.3308|97
09315|Revillarruz|42.2317|-3.6514|621
09317|Rezmondo|42.5158|-4.2386|18
09318|Riocavado de la Sierra|42.1519|-3.1981|54
09321|Roa|41.6983|-3.9267|2276
09323|Rojas|42.5775|-3.4408|62
09325|Royuela de Río Franco|41.9967|-3.9567|169
09326|Rubena|42.3878|-3.5742|207
09327|Rublacedo de Abajo|42.5531|-3.5022|37
09328|Rucandio|42.7517|-3.5422|72
09329|Salas de Bureba|42.6917|-3.4739|129
09330|Salas de los Infantes|42.0231|-3.2814|1959
09332|Saldaña de Burgos|42.2576|-3.6846|203
09334|Salinillas de Bureba|42.5531|-3.3867|55
09335|San Adrián de Juarros|42.2742|-3.4750|84
09337|San Juan del Monte|41.6842|-3.5211|163
09338|San Mamés de Burgos|42.3372|-3.7939|323
09339|San Martín de Rubiales|41.6425|-3.9933|137|Sant Martín de Rubiales
09340|San Millán de Lara|42.1364|-3.3456|61
09360|San Vicente del Valle|42.3369|-3.1619|26
09343|Santa Cecilia|42.0519|-3.8031|107
09345|Santa Cruz de la Salceda|41.5947|-3.5947|148
09346|Santa Cruz del Valle Urbión|42.3028|-3.2217|94
09347|Santa Gadea del Cid|42.7147|-3.0589|180
09348|Santa Inés|42.0394|-3.7025|153
09350|Santa María del Campo|42.1319|-3.9742|508
09351|Santa María del Invierno|42.4428|-3.4375|70
09352|Santa María del Mercadillo|41.8597|-3.5589|119
09353|Santa María Ribarredonda|42.6433|-3.1781|97|Santa María Rivarredonda
09354|Santa Olalla de Bureba|42.4761|-3.4408|38
09355|Santibáñez de Esgueva|41.8333|-3.7586|72
09356|Santibáñez del Val|41.9739|-3.4806|64
09358|Santo Domingo de Silos|41.9625|-3.4197|251
09361|Sargentes de la Lora|42.7692|-3.8728|130
09362|Sarracín|42.2597|-3.6978|261
09363|Sasamón|42.4181|-4.0417|898
09365|La Sequera de Haza|41.5636|-3.8169|28
09366|Solarana|41.9700|-3.6600|73
09368|Sordillos|42.4617|-4.1069|23
09369|Sotillo de la Ribera|41.7767|-3.8261|468
09372|Sotragero|42.4097|-3.7131|300
09373|Sotresgudo|42.5781|-4.1769|413
09374|Susinos del Páramo|42.4711|-3.9250|115
09375|Tamarón|42.2725|-3.9908|52
09377|Tardajos|42.3472|-3.8192|862
09378|Tejada|41.9522|-3.5361|35
09380|Terradillos de Esgueva|41.8192|-3.8428|58
09381|Tinieblas de la Sierra|42.1725|-3.3631|20
09382|Tobar|42.4836|-3.9383|27
09384|Tordómar|42.0458|-3.8647|290
09386|Torrecilla del Monte|42.0936|-3.6942|79
09387|Torregalindo|41.5822|-3.7533|130
09388|Torrelara|42.1658|-3.5164|34
09389|Torrepadre|42.0436|-3.9369|68
09390|Torresandino|41.8294|-3.9100|565
09391|Tórtoles de Esgueva|41.8164|-4.0208|362
09392|Tosantos|42.4136|-3.2433|48
09394|Trespaderne|42.8022|-3.3900|721
09395|Tubilla del Agua|42.7092|-3.8028|126
09396|Tubilla del Lago|41.8014|-3.5864|164
09398|Úrbel del Castillo|42.6200|-3.8436|53
09400|Vadocondes|41.6394|-3.5736|368
09403|Valdeande|41.8342|-3.5278|103
09405|Valdezate|41.6014|-3.9306|115
09406|Valdorros|42.1719|-3.7089|377
09408|Vallarta de Bureba|42.5881|-3.2047|41
09904|Valle de las Navas|42.4547|-3.6367|549
09908|Valle de Losa|42.9867|-3.2192|486|Lausa Harana
09409|Valle de Manzanedo|42.8989|-3.6906|115
09410|Valle de Mena|43.1000|-3.2833|4155|Mena Harana
09411|Valle de Oca|42.4331|-3.3167|160
09902|Valle de Santibáñez|42.4802|-3.7830|482
09905|Valle de Sedano|42.7169|-3.7489|402
09412|Valle de Tobalina|42.7933|-3.2703|877
09413|Valle de Valdebezana|42.9708|-3.7611|479
09414|Valle de Valdelaguna|42.0925|-3.1325|187
09415|Valle de Valdelucio|42.7181|-4.0922|342
09416|Valle de Zamanzas|42.8533|-3.7497|46
09417|Vallejera|42.1822|-4.1514|38
09418|Valles de Palenzuela|42.1194|-4.0764|74
09419|Valluércanes|42.5728|-3.1189|70
09407|Valmala|42.3053|-3.2550|24
09422|La Vid de Bureba|42.6308|-3.3006|26
09421|La Vid y Barrios|41.6294|-3.4903|237
09423|Vileña|42.6219|-3.3233|23
09427|Villadiego|42.5158|-4.0100|1453
09428|Villaescusa de Roa|41.7333|-4.0167|95
09429|Villaescusa la Sombría|42.4150|-3.4189|61
09430|Villaespasa|42.0989|-3.4022|21
09431|Villafranca Montes de Oca|42.3864|-3.3092|117
09432|Villafruela|41.9164|-3.9131|140
09433|Villagalijo|42.3486|-3.1917|52
09434|Villagonzalo Pedernales|42.3014|-3.7364|1903
09437|Villahoz|42.0783|-3.9119|262
09438|Villalba de Duero|41.6822|-3.7450|720
09439|Villalbilla de Burgos|42.3469|-3.7792|1554
09440|Villalbilla de Gumiel|41.8064|-3.6261|73
09441|Villaldemiro|42.2469|-3.9847|92
09442|Villalmanzo|42.0477|-3.7440|409
09443|Villamayor de los Montes|42.1056|-3.7661|157
09444|Villamayor de Treviño|42.4594|-4.1197|59
09445|Villambistia|42.4061|-3.2619|44
09446|Villamedianilla|42.1606|-4.1461|9
09447|Villamiel de la Sierra|42.1914|-3.4175|43
09448|Villangómez|42.1786|-3.7761|229
09449|Villanueva de Argaño|42.3797|-3.9328|117
09450|Villanueva de Carazo|41.9831|-3.3244|24
09451|Villanueva de Gumiel|41.7372|-3.6261|281
09454|Villanueva de Teba|42.6489|-3.1625|43
09455|Villaquirán de la Puebla|42.2831|-4.1014|45
09456|Villaquirán de los Infantes|42.2269|-4.0083|154
09903|Villarcayo de Merindad de Castilla la Vieja|42.9392|-3.5719|4103
09458|Villariezo|42.2694|-3.7328|731
09460|Villasandino|42.3733|-4.1075|179
09463|Villasur de Herreros|42.3081|-3.3950|269
09464|Villatuelda|41.8150|-3.8819|41
09466|Villaverde del Monte|42.1606|-3.8144|112
09467|Villaverde-Mogina|42.1600|-4.0506|68
09471|Villayerno Morquillas|42.3953|-3.6394|208
09472|Villazopeque|42.1986|-4.0164|51
09473|Villegas|42.4694|-4.0153|83
09476|Villoruebo|42.1683|-3.4414|62
09424|Viloria de Rioja|42.4256|-3.1003|38
09425|Vilviestre del Pinar|41.9519|-3.0781|511
09478|Vizcaínos|42.1014|-3.2669|41
09480|Zael|42.1094|-3.8239|117
09482|Zarzosa de Río Pisuerga|42.5361|-4.2686|29
09483|Zazuar|41.6958|-3.5550|198
09485|Zuñeda|42.6044|-3.2261|58
10001|Abadía|40.2575|-5.9755|337
10002|Abertura|39.2439|-5.8136|362
10003|Acebo|40.2000|-6.7167|567
10004|Acehúche|39.8027|-6.6334|808
10005|Aceituna|40.1494|-6.3322|569
10006|Ahigal|40.1833|-6.1833|1340
10903|Alagón del Río|39.9733|-6.3171|919
10007|Albalá|39.2564|-6.1860|647
10008|Alcántara|39.7186|-6.8839|1329
10009|Alcollarín|39.2445|-5.7381|259
10010|Alcuéscar|39.1811|-6.2294|2447
10012|Aldea del Cano|39.2878|-6.3189|609
10013|La Aldea del Obispo|39.5636|-5.9114|290
10011|Aldeacentenera|39.5271|-5.6297|603
10014|Aldeanueva de la Vera|40.1292|-5.7003|1966
10015|Aldeanueva del Camino|40.2584|-5.9300|696
10016|Aldehuela del Jerte|40.0120|-6.2394|348|Aldehuela de Jerte
10017|Alía|39.4486|-5.2175|722
10018|Aliseda|39.4225|-6.6929|1726
10019|Almaraz|39.8143|-5.6779|1594
10020|Almoharín|39.1764|-6.0440|1771
10021|Arroyo de la Luz|39.4840|-6.5846|5495
10023|Arroyomolinos|39.1856|-6.1631|816
10022|Arroyomolinos de la Vera|40.0533|-5.8537|424
10024|Baños de Montemayor|40.3183|-5.8572|738
10025|Barrado|40.0842|-5.8814|383
10026|Belvís de Monroy|39.8192|-5.6092|774
10027|Benquerencia|39.3106|-6.0844|74
10028|Berrocalejo|39.8200|-5.3503|120
10029|Berzocana|39.4378|-5.4619|375
10030|Bohonal de Ibor|39.7844|-5.4842|488
10031|Botija|39.3453|-6.0731|184
10032|Brozas|39.6125|-6.7781|1718
10033|Cabañas del Castillo|39.5474|-5.5117|406
10034|Cabezabellosa|40.1331|-6.0000|317
10035|Cabezuela del Valle|40.1927|-5.8064|2049
10036|Cabrero|40.1128|-5.8924|353
10037|Cáceres|39.4731|-6.3711|96651
10038|Cachorrilla|39.9158|-6.6691|83
10039|Cadalso|40.2378|-6.5405|394
10040|Calzadilla|40.0598|-6.5325|450
10041|Caminomorisco|40.3264|-6.2906|1097
10042|Campillo de Deleitosa|39.7035|-5.5750|82
10043|Campo Lugar|39.1958|-5.7711|790
10044|Cañamero|39.3797|-5.3888|1578
10045|Cañaveral|39.7900|-6.3941|995
10046|Carbajo|39.6032|-7.1971|183
10047|Carcaboso|40.0495|-6.2124|1076
10048|Carrascalejo|39.6458|-5.2168|223
10049|Casar de Cáceres|39.5615|-6.4171|4511
10050|Casar de Palomero|40.2950|-6.2566|991
10051|Casares de las Hurdes|40.4401|-6.2883|362
10052|Casas de Don Antonio|39.2364|-6.2908|167
10053|Casas de Don Gómez|40.0081|-6.6000|342
10056|Casas de Millán|39.8176|-6.3290|536
10057|Casas de Miravete|39.7276|-5.7436|106
10054|Casas del Castañar|40.1073|-5.9064|583
10055|Casas del Monte|40.2024|-5.9604|761
10058|Casatejada|39.8855|-5.6814|1393
10059|Casillas de Coria|39.9652|-6.6356|354
10060|Castañar de Ibor|39.6262|-5.4170|1020
10061|Ceclavín|39.8214|-6.7736|1769
10062|Cedillo|39.6514|-7.5028|453
10063|Cerezo|40.2369|-6.2275|147
10064|Cilleros|40.1158|-6.7961|1547
10065|Collado de la Vera|40.0573|-5.7209|274
10066|Conquista de la Sierra|39.3510|-5.7343|193
10067|Coria|39.9819|-6.5372|12001
10068|Cuacos de Yuste|40.1045|-5.7240|809
10069|La Cumbre|39.4050|-5.9771|815
10070|Deleitosa|39.6436|-5.6458|681
10071|Descargamaría|40.3039|-6.4864|105
10072|Eljas|40.2158|-6.8461|827|As Ellas
10073|Escurial|39.1694|-5.8856|855
10075|Fresnedoso de Ibor|39.6844|-5.5092|236
10076|Galisteo|39.9760|-6.2678|849
10077|Garciaz|39.4136|-5.6267|666
10079|Garganta la Olla|40.1107|-5.7764|874
10078|La Garganta|40.3284|-5.8229|353
10080|Gargantilla|40.2483|-5.9202|346
10081|Gargüera|40.0612|-5.9275|187
10082|Garrovillas de Alconétar|39.7131|-6.5495|1941
10083|Garvín|39.7197|-5.3465|101
10084|Gata|40.2389|-6.5958|1335
10085|El Gordo|39.8650|-5.3432|363
10086|La Granja|40.2393|-5.9946|313
10087|Guadalupe|39.4523|-5.3272|1722
10088|Guijo de Coria|40.1012|-6.4632|180
10089|Guijo de Galisteo|40.0937|-6.4117|1460
10090|Guijo de Granadilla|40.1938|-6.1633|497
10091|Guijo de Santa Bárbara|40.1538|-5.6554|386
10092|Herguijuela|39.3745|-5.7595|264
10093|Hernán-Pérez|40.2122|-6.4640|401
10094|Herrera de Alcántara|39.6388|-7.4062|225
10095|Herreruela|39.4629|-6.9058|322
10096|Hervás|40.2739|-5.8658|3898
10097|Higuera de Albalat|39.7261|-5.6668|102
10098|Hinojal|39.7070|-6.3585|391
10099|Holguera|39.9002|-6.3493|588
10100|Hoyos|40.1692|-6.7214|848
10101|Huélaga|40.0571|-6.6151|203
10102|Ibahernando|39.3167|-5.9167|538
10103|Jaraicejo|39.6678|-5.8131|418
10104|Jaraíz de la Vera|40.0603|-5.7550|6831
10105|Jarandilla de la Vera|40.1269|-5.6583|2894
10106|Jarilla|40.1719|-6.0033|127
10107|Jerte|40.2228|-5.7522|1189
10108|Ladrillar|40.4656|-6.2250|177
10109|Logrosán|39.3372|-5.4922|1852
10110|Losar de la Vera|40.1219|-5.6000|2799
10111|Madrigal de la Vera|40.1475|-5.3668|1536
10112|Madrigalejo|39.1369|-5.6266|1710
10113|Madroñera|39.4254|-5.7572|2349
10114|Majadas|39.9423|-5.7474|1281
10115|Malpartida de Cáceres|39.4456|-6.5059|4027
10116|Malpartida de Plasencia|39.9812|-6.0438|4666
10117|Marchagaz|40.2678|-6.2746|231
10118|Mata de Alcántara|39.7186|-6.8198|300
10119|Membrío|39.5268|-7.0543|587
10120|Mesas de Ibor|39.7554|-5.5462|146
10121|Miajadas|39.1528|-5.9081|9396
10122|Millanes|39.8489|-5.5808|239
10123|Mirabel|39.8617|-6.2337|620
10124|Mohedas de Granadilla|40.2683|-6.2017|817
10125|Monroy|39.6375|-6.2135|909
10126|Montánchez|39.2250|-6.1525|1597
10127|Montehermoso|40.0884|-6.3496|5552
10128|Moraleja|40.0695|-6.6572|6562
10129|Morcillo|40.0200|-6.3950|378
10130|Navaconcejo|40.1783|-5.8317|2037
10131|Navalmoral de la Mata|39.8928|-5.5403|17352
10132|Navalvillar de Ibor|39.5850|-5.4142|374
10133|Navas del Madroño|39.6233|-6.6511|1254
10134|Navezuelas|39.5117|-5.4386|668
10135|Nuñomoral|40.4075|-6.2461|1196
10136|Oliva de Plasencia|40.1122|-6.0869|290
10137|Palomero|40.2464|-6.2764|450
10138|Pasarón de la Vera|40.0521|-5.8210|588
10139|Pedroso de Acim|39.8255|-6.4123|90
10140|Peraleda de la Mata|39.8531|-5.4596|1444
10141|Peraleda de San Román|39.7412|-5.3871|268
10142|Perales del Puerto|40.1546|-6.6822|874
10143|Pescueza|39.9173|-6.6482|150
10144|La Pesga|40.3260|-6.1763|950
10145|Piedras Albas|39.7842|-6.9262|125
10146|Pinofranqueado|40.3039|-6.3314|1783
10147|Piornal|40.1178|-5.8486|1443
10148|Plasencia|40.0275|-6.0908|40132
10149|Plasenzuela|39.3810|-6.0469|536
10150|Portaje|39.9184|-6.5615|379
10151|Portezuelo|39.8131|-6.4748|196
10152|Pozuelo de Zarzón|40.1483|-6.4160|430
10905|Pueblonuevo de Miramontes|40.0605|-5.3790|762
10153|Puerto de Santa Cruz|39.3163|-5.8588|268
10154|Rebollar|40.1538|-5.8983|203
10155|Riolobos|39.9208|-6.3040|1173
10156|Robledillo de Gata|40.3227|-6.4709|91
10157|Robledillo de la Vera|40.1006|-5.5887|252
10158|Robledillo de Trujillo|39.2704|-5.9814|394
10159|Robledollano|39.6099|-5.5081|325
10160|Romangordo|39.7421|-5.7012|240
10901|Rosalejo|39.9934|-5.4568|1268
10161|Ruanes|39.3279|-6.0132|82
10162|Salorino|39.4781|-7.0103|522
10163|Salvatierra de Santiago|39.3022|-6.0335|229
10164|San Martín de Trevejo|40.2128|-6.7963|693|San Martiño de Trebello
10165|Santa Ana|39.3090|-5.9902|302
10166|Santa Cruz de la Sierra|39.3361|-5.8458|317
10167|Santa Cruz de Paniagua|40.1925|-6.3397|286
10168|Santa Marta de Magasca|39.5109|-6.0997|291
10169|Santiago de Alcántara|39.6061|-7.2445|454
10170|Santiago del Campo|39.6287|-6.3645|250
10171|Santibáñez el Alto|40.1857|-6.5475|386
10172|Santibáñez el Bajo|40.1764|-6.2232|711
10173|Saucedilla|39.8500|-5.6667|1002
10174|Segura de Toro|40.2234|-5.9478|190
10175|Serradilla|39.8295|-6.1399|1448
10176|Serrejón|39.8170|-5.8028|410
10177|Sierra de Fuentes|39.4372|-6.2740|2081
10178|Talaván|39.7157|-6.2812|775
10179|Talaveruela de la Vera|40.1219|-5.5191|303
10180|Talayuela|39.9860|-5.6096|7439
10181|Tejeda de Tiétar|40.0180|-5.8674|761
10904|Tiétar|40.0297|-5.4819|835
10182|Toril|39.8972|-5.7806|157
10183|Tornavacas|40.2557|-5.6885|989
10184|El Torno|40.1356|-5.9453|805
10187|Torre de Don Miguel|40.2240|-6.5771|481
10188|Torre de Santa María|39.2528|-6.1148|508
10185|Torrecilla de los Ángeles|40.2462|-6.4151|642
10186|Torrecillas de la Tiesa|39.5694|-5.7420|1038
10190|Torrejón el Rubio|39.7713|-6.0133|537
10189|Torrejoncillo|39.8965|-6.4663|2743
10191|Torremenga|40.0466|-5.7747|620
10192|Torremocha|39.3457|-6.1729|742
10193|Torreorgaz|39.3821|-6.2501|1641
10194|Torrequemada|39.3659|-6.2210|564
10195|Trujillo|39.4653|-5.8789|8611
10196|Valdastillas|40.1329|-5.8791|332
10197|Valdecañas de Tajo|39.7591|-5.6200|96
10198|Valdefuentes|39.2750|-6.1200|1074
10199|Valdehúncar|39.8366|-5.5230|188
10200|Valdelacasa de Tajo|39.7257|-5.2828|338
10201|Valdemorales|39.2050|-6.0675|218
10202|Valdeobispo|40.0815|-6.2485|617
10203|Valencia de Alcántara|39.4133|-7.2436|5150
10204|Valverde de la Vera|40.1225|-5.4944|428
10205|Valverde del Fresno|40.2239|-6.8798|2143|Valverde do Fresno
10902|Vegaviana|40.0404|-6.7178|837
10206|Viandar de la Vera|40.1217|-5.5364|216
10207|Villa del Campo|40.1407|-6.4271|435
10208|Villa del Rey|39.6595|-6.8211|118
10209|Villamesías|39.2447|-5.8729|271
10210|Villamiel|40.1871|-6.7848|379
10211|Villanueva de la Sierra|40.2024|-6.4068|478
10212|Villanueva de la Vera|40.1306|-5.4639|2108
10214|Villar de Plasencia|40.1380|-6.0278|224
10213|Villar del Pedroso|39.7048|-5.1983|547
10215|Villasbuenas de Gata|40.1789|-6.6259|481
10216|Zarza de Granadilla|40.2381|-6.0475|1815
10217|Zarza de Montánchez|39.2575|-6.0336|504
10218|Zarza la Mayor|39.8772|-6.8622|1096
10219|Zorita|39.2853|-5.7003|1223
11001|Alcalá de los Gazules|36.4619|-5.7239|5230
11002|Alcalá del Valle|36.9051|-5.1726|4864
11003|Algar|36.6556|-5.6574|1452
11004|Algeciras|36.1275|-5.4539|126589|Algesires|Alxeciras|Alchezira|Alxecires
11005|Algodonales|36.8811|-5.4056|5425
11006|Arcos de la Frontera|36.7483|-5.8063|31267
11007|Barbate|36.1900|-5.9201|22635
11008|Los Barrios|36.1834|-5.4928|24449
11901|Benalup-Casas Viejas|36.3428|-5.8092|7236
11009|Benaocaz|36.7000|-5.4167|742
11010|Bornos|36.8212|-5.7435|7506
11011|El Bosque|36.7573|-5.5067|2242
11012|Cádiz|36.5350|-6.2975|109950|Cadis
11013|Castellar de la Frontera|36.3068|-5.4476|2984
11015|Chiclana de la Frontera|36.4167|-6.1500|90864
11016|Chipiona|36.7357|-6.4348|20076
11014|Conil de la Frontera|36.2756|-6.0877|24102
11017|Espera|36.8722|-5.8043|3755
11018|El Gastor|36.8548|-5.3218|1675
11019|Grazalema|36.7586|-5.3692|1977
11020|Jerez de la Frontera|36.7000|-6.1167|213634|Xerez da Fronteira|Xerez de la Frontera
11021|Jimena de la Frontera|36.4333|-5.4500|6719
11022|La Línea de la Concepción|36.1611|-5.3486|64499
11023|Medina Sidonia|36.4577|-5.9273|11838
11024|Olvera|36.9346|-5.2599|7842
11025|Paterna de Rivera|36.5218|-5.8672|5539
11026|Prado del Rey|36.7876|-5.5564|5692
11027|El Puerto de Santa María|36.6015|-6.2381|89983
11028|Puerto Real|36.5292|-6.1919|42527
11029|Puerto Serrano|36.9233|-5.5450|6877
11030|Rota|36.6229|-6.3600|29289
11031|San Fernando|36.4666|-6.2010|93338
11902|San José del Valle|36.6063|-5.7997|4419
11903|San Martín del Tesorillo|36.3442|-5.3203|2735
11033|San Roque|36.2097|-5.3844|34310
11032|Sanlúcar de Barrameda|36.7789|-6.3539|70012
11034|Setenil de las Bodegas|36.8642|-5.1814|2634
11035|Tarifa|36.0153|-5.6057|18613
11036|Torre Alháquime|36.9152|-5.2360|781
11037|Trebujena|36.8695|-6.1755|6999
11038|Ubrique|36.6797|-5.4452|16615
11039|Vejer de la Frontera|36.2522|-5.9633|13131
11040|Villaluenga del Rosario|36.6969|-5.3836|463
11041|Villamartín|36.8592|-5.6435|12184
11042|Zahara|36.8333|-5.3833|1344
12002|Aín|39.9005|-0.3412|133|Ahín
12003|Albocàsser|40.3572|0.0245|1370|Albocácer|Albocázar
12004|Alcalà de Xivert|40.3042|0.2251|7349|Alcalá de Chivert|Alcalá d'Exibert
12005|l'Alcora|40.0744|-0.2139|10664|Alcora
12006|Alcudia de Veo|39.9158|-0.3546|200|l'Alcúdia de Veo|L'Alcúdia de Veo|L'Alcudia de Veyo
12007|Alfondeguilla|39.8377|-0.2690|881|Fondeguilla|Alfandaguella
12008|Algimia de Almonacid|39.9144|-0.4422|254|Algímia d'Almonesir|Alchimia d'Almonecir
12009|Almassora|39.9436|-0.0635|29159|Almazora
12010|Almedíjar|39.8719|-0.4097|288|Almedíxer|Almedíxar
12011|Almenara|39.7533|-0.2256|6813
12901|les Alqueries/Alquerías del Niño Perdido|39.8964|-0.1136|4605
12012|Altura|39.8512|-0.5129|3849
12013|Arañuel|40.0714|-0.4813|148|Aranyuel
12014|Ares del Maestrat|40.4564|-0.1320|181|Ares del Maestre|Aras
12015|Argelita|40.0541|-0.3500|139|Argeleta|Archelita
12016|Artana|39.8911|-0.2577|1993
12001|Atzeneta del Maestrat|40.2164|-0.1706|1284|Adzaneta
12017|Ayódar|40.0000|-0.3761|176|Aiòder
12018|Azuébar|39.8342|-0.3706|359|Assuévar
12020|Barracas|40.0162|-0.6976|188|Barraques
12022|Bejís|39.9094|-0.7092|400|Begís|Beixix
12024|Benafer|39.9350|-0.5776|168
12025|Benafigos|40.2766|-0.2090|121
12026|Benassal|40.3798|-0.1408|1048|Benasal|Benazal
12027|Benicarló|40.4186|0.4231|30296
12028|Benicàssim/Benicasim|40.0553|0.0642|20539
12029|Benlloc|40.2106|0.0269|1143|Bell-lloc
12021|Betxí|39.9288|-0.1974|5659|Bechí|Bechín
12032|Borriana/Burriana|39.8896|-0.0839|37915
12031|Borriol|40.0422|-0.0715|6018
12033|Cabanes|40.1547|0.0453|3475
12034|Càlig|40.4620|0.3549|2042|Cálich
12036|Canet lo Roig|40.5515|0.2432|715|Caneto
12037|Castell de Cabres|40.6500|0.0333|21|Castiel de Crabas
12038|Castellfort|40.5025|-0.1914|178
12039|Castellnovo|39.8621|-0.4575|912|Castellnou
12040|Castelló de la Plana/Castellón de la Plana|39.9860|-0.0374|183711
12041|Castillo de Villamalefa|40.1305|-0.3804|110|el Castell de Vilamalefa|Castiello de Villamalefa
12042|Catí|40.4708|0.0222|719|Catín
12043|Caudiel|39.9473|-0.5684|735
12044|Cervera del Maestre|40.4546|0.2765|617|Cervera del Maestrat
12053|Chilches/Xilxes|39.7824|-0.1878|3199
12056|Chóvar|39.8511|-0.3207|316|Xóvar
12045|Cinctorres|40.5826|-0.2161|433
12046|Cirat|40.0547|-0.4633|220
12048|Cortes de Arenoso|40.1869|-0.5422|308|Cortes d'Arenós|Cortz d'Arenoso
12049|Costur|40.1201|-0.1735|511
12050|les Coves de Vinromà|40.3078|0.1225|1888|Cuevas de Vinromá|Las Cuevas d'Abinromán
12051|Culla|40.3374|-0.1651|503|Cuéllar
12057|Eslida|39.8794|-0.3079|815
12058|Espadilla|40.0264|-0.3556|101|Espadella|Espadiella
12059|Fanzara|40.0194|-0.3154|295
12060|Figueroles|40.1176|-0.2379|525|Figueruelas
12061|Forcall|40.6461|-0.1996|475|el Forcall|Forcallo
12063|Fuente la Reina|40.0639|-0.6090|55|la Font de la Reina|Fuent la Reina
12064|Fuentes de Ayódar|40.0209|-0.4198|98|les Fonts d'Aiòder|Fuents d'Ayódar
12065|Gaibiel|39.9258|-0.4958|200
12067|Geldo|39.8375|-0.4672|665|Xeldo
12068|Herbers|40.7209|-0.0040|68|Herbés
12069|Higueras|39.9843|-0.5017|54|Figueres|Figueras
12070|la Jana|40.5000|0.2500|679|La Chana
12071|Jérica|39.9117|-0.5719|1764|Xèrica|Exerica
12074|la Llosa|39.7683|-0.2050|1033
12072|Llucena/Lucena del Cid|40.1373|-0.2808|1421
12073|Ludiente|40.0869|-0.3717|162|Lludient|Ludient
12075|la Mata de Morella|40.6164|-0.2795|196
12076|Matet|39.9377|-0.4687|94
12077|Moncofa|39.8025|-0.1339|8339|Moncófar
12078|Montán|40.0353|-0.5550|429|Montant
12079|Montanejos|40.0680|-0.5232|649|Montanellos
12080|Morella|40.6192|-0.1006|2501|Moriella
12081|Navajas|39.8783|-0.5075|906|Navaixes|Navachas
12082|Nules|39.8533|-0.1550|14315
12083|Olocau del Rey|40.6380|-0.3403|135|Olocau del Rei
12084|Onda|39.9630|-0.2652|26190
12085|Orpesa/Oropesa del Mar|40.0922|0.1339|12640
12087|Palanques|40.7175|-0.1792|34
12088|Pavías|39.9731|-0.4825|72|Pavies
12089|Peníscola/Peñíscola|40.3585|0.4068|8774
12090|Pina de Montalgrao|40.0211|-0.6550|121
12093|la Pobla de Benifassà|40.6563|0.1566|229|Puebla de Benifasar|La Puebla de Benifazán
12094|la Pobla Tornesa|40.1011|-0.0014|1322|Puebla Tornesa
12091|Portell de Morella|40.5325|-0.2625|155|Lo Portiel
12092|Puebla de Arenoso|40.1049|-0.5928|169|la Pobla d'Arenós|Puebla d'Arenoso|Pobla d'Arenós
12095|Ribesalbes|40.0219|-0.2778|1191
12096|Rossell|40.6183|0.2214|910|Rosell
12097|Sacañet|39.8522|-0.7144|67|Sacanyet
12098|la Salzadella|40.4175|0.1747|671|Salsadella|La Salcediella
12101|San Rafael del Río|40.6065|0.3487|532|Sant Rafel del Riu|Sant Rafael del Río
12902|Sant Joan de Moró|40.0609|-0.1371|3695|San Juan de Moró
12099|Sant Jordi/San Jorge|40.5099|0.3309|1554
12100|Sant Mateu|40.4650|0.1793|2021|San Mateo
12102|Santa Magdalena de Pulpis|40.3564|0.3032|771|Santa Magdalena de Polpís|Santa Malena de Polpiz
12104|Segorbe|39.8519|-0.4896|9805|Sogorb|Segorb
12103|la Serratella|40.3130|0.0305|113|Sarratella
12105|Sierra Engarcerán|40.2696|-0.0190|1039|la Serra d'en Galceran
12106|Soneja|39.8153|-0.4311|1521|Soneixa|Sonecha
12107|Sot de Ferrer|39.8054|-0.4105|492
12108|Suera/Sueras|39.9519|-0.3317|593|Zuera
12109|Tales|39.9492|-0.3072|827|Talas
12110|Teresa|39.9003|-0.6577|254
12111|Tírig|40.4236|0.0772|417|Térich
12112|Todolella|40.6470|-0.2468|136|la Todolella|La Todolella|La Todoliella
12113|Toga|40.0422|-0.3667|106|Tuega
12114|Torás|39.9195|-0.6857|271
12115|El Toro|39.9825|-0.7484|256|Lo Toro
12116|Torralba del Pinar|39.9886|-0.4383|57
12119|la Torre d'en Besora|40.3268|-0.0796|164|Torre Embesora
12120|la Torre d'en Doménec|40.2639|0.0694|177|Torre Endoménech
12117|Torreblanca|40.2206|0.1953|5744
12118|Torrechiva|40.0498|-0.3980|106|Torre-xiva
12121|Traiguera|40.5247|0.2900|1302
12122|les Useres/Useras|40.1849|-0.1313|954|Useres|Las Useras
12124|Vall d'Alba|40.1759|-0.0351|3218|la Vall d'Alba|La Vall d'Alba
12125|Vall de Almonacid|39.9033|-0.4564|284|la Vall d'Almonesir|Val d'Almonecir
12126|la Vall d'Uixó|39.8236|-0.2317|32242|Vall de Uxó|La Val d'Uixón
12123|Vallat|40.0305|-0.3369|66
12127|Vallibona|40.6031|0.0466|63|Vallibana
12128|Vilafamés|40.1126|-0.0541|1962|Villafamés|Villafamez
12129|Vilafranca/Villafranca del Cid|40.4269|-0.2576|2115
12132|Vilanova d'Alcolea|40.2317|0.0736|584|Villanueva de Alcolea|Villanueva d'Alcoleya
12134|Vilar de Canes|40.3579|-0.0658|156|Villar de Canes
12135|Vila-real|39.9378|-0.1014|53623|Villarreal|Villa-reyal
12136|la Vilavella|39.8588|-0.1835|3054|Villavieja
12130|Villahermosa del Río|40.2030|-0.4183|473|Vilafermosa|Villafermosa
12131|Villamalur|39.9639|-0.3947|99|Vilamalur
12133|Villanueva de Viver|40.0593|-0.6474|94|Vilanova de Viver|Villanueva de Vivel
12137|Villores|40.6758|-0.2008|51
12138|Vinaròs|40.4704|0.4754|30529|Vinaroz
12139|Vistabella del Maestrat|40.3000|-0.2833|354|Vistabella del Maestrazgo
12140|Viver|39.9214|-0.5972|1729|Vivel
12052|Xert|40.5186|0.1586|702|Chert
12055|Xodos/Chodos|40.2325|-0.2932|107
12141|Zorita del Maestrazgo|40.7283|-0.1661|118|Sorita|Zurita
12142|Zucaina|40.1320|-0.4189|171|Sucaina
13001|Abenójar|38.8792|-4.3578|1309
13002|Agudo|38.9792|-4.8731|1605
13003|Alamillo|38.6769|-4.7894|450
13004|Albaladejo|38.6181|-2.8061|984
13005|Alcázar de San Juan|39.3901|-3.2102|31914
13006|Alcoba|39.2608|-4.4767|558
13007|Alcolea de Calatrava|38.9867|-4.1153|1360
13008|Alcubillas|38.7519|-3.1347|417
13009|Aldea del Rey|38.7380|-3.8391|1565
13010|Alhambra|38.8983|-3.0536|946
13011|Almadén|38.7667|-4.8167|4855
13012|Almadenejos|38.7378|-4.7103|384
13013|Almagro|38.8882|-3.7118|9190
13014|Almedina|38.6239|-2.9545|475
13015|Almodóvar del Campo|38.7186|-4.1667|5637
13016|Almuradiel|38.5131|-3.4969|744
13017|Anchuras|39.4794|-4.8364|267
13903|Arenales de San Gregorio|39.3097|-3.0256|626
13018|Arenas de San Juan|39.2175|-3.5031|1013
13019|Argamasilla de Alba|39.1292|-3.0889|6777
13020|Argamasilla de Calatrava|38.7269|-4.0800|5847
13021|Arroba de los Montes|39.1539|-4.5439|388
13022|Ballesteros de Calatrava|38.8372|-3.9433|363
13023|Bolaños de Calatrava|38.9056|-3.6664|12153
13024|Brazatortas|38.6608|-4.2961|1007
13025|Cabezarados|38.8458|-4.2969|279
13026|Cabezarrubias del Puerto|38.6150|-4.1842|483
13027|Calzada de Calatrava|38.7039|-3.7764|3668
13028|Campo de Criptana|39.4067|-3.1250|12868
13029|Cañada de Calatrava|38.8553|-4.0211|99
13030|Caracuel de Calatrava|38.8458|-4.0636|140
13031|Carrión de Calatrava|39.0183|-3.8178|3239
13032|Carrizosa|38.8417|-2.9928|1097
13033|Castellar de Santiago|38.5353|-3.2833|1714
13038|Chillón|38.7969|-4.8669|1752
13034|Ciudad Real|38.9833|-3.9167|76217|Cidade Real|Ciudá Real
13035|Corral de Calatrava|38.8586|-4.0808|1154
13036|Los Cortijos|39.3142|-4.0519|848
13037|Cózar|38.6597|-3.0725|903
13039|Daimiel|39.0722|-3.6144|17722
13040|Fernán Caballero|39.1247|-3.9025|965
13041|Fontanarejo|39.2167|-4.5167|223
13042|Fuencaliente|38.4053|-4.3053|1007
13043|Fuenllana|38.7500|-2.9500|189
13044|Fuente el Fresno|39.2276|-3.7741|3011
13045|Granátula de Calatrava|38.8000|-3.7333|683
13046|Guadalmez|38.7272|-4.9708|709
13047|Herencia|39.3669|-3.3550|8661
13048|Hinojosas de Calatrava|38.6167|-4.1333|506
13049|Horcajo de los Montes|39.3264|-4.6501|798
13050|Las Labores|39.2744|-3.5186|550
13904|Llanos del Caudillo|39.1183|-3.3517|651
13051|Luciana|38.9851|-4.2932|350
13052|Malagón|39.1717|-3.8547|7827
13053|Manzanares|38.9961|-3.3724|17728
13054|Membrilla|38.9722|-3.3483|5793
13055|Mestanza|38.5744|-4.0714|634
13056|Miguelturra|38.9647|-3.8911|15924
13057|Montiel|38.6964|-2.8622|1167
13058|Moral de Calatrava|38.8303|-3.5806|5184
13059|Navalpino|39.2250|-4.5917|193
13060|Navas de Estena|39.4953|-4.5208|269
13061|Pedro Muñoz|39.4000|-2.9500|7585
13062|Picón|39.0497|-4.0603|690
13063|Piedrabuena|39.0325|-4.1731|4305
13064|Poblete|38.9358|-3.9814|2998
13065|Porzuna|39.1461|-4.1533|3529
13066|Pozuelo de Calatrava|38.9122|-3.8378|4055
13067|Los Pozuelos de Calatrava|38.9011|-4.1694|326
13068|Puebla de Don Rodrigo|39.0864|-4.6206|1148
13069|Puebla del Príncipe|38.5689|-2.9256|648
13070|Puerto Lápice|39.3244|-3.4811|824
13071|Puertollano|38.6852|-4.1112|45565
13072|Retuerta del Bullaque|39.4614|-4.4097|854
13901|El Robledo|39.2176|-4.2811|1078
13902|Ruidera|38.9800|-2.8931|529
13073|Saceruela|38.9434|-4.6083|520
13074|San Carlos del Valle|38.8444|-3.2414|1055
13075|San Lorenzo de Calatrava|38.4769|-3.8247|189
13076|Santa Cruz de los Cáñamos|38.6378|-2.8683|463
13077|Santa Cruz de Mudela|38.6453|-3.4672|3881
13078|Socuéllamos|39.2933|-2.7942|12172
13080|Solana del Pino|38.4667|-4.0728|333
13079|La Solana|38.9414|-3.2394|15242
13081|Terrinches|38.6100|-2.8414|574
13082|Tomelloso|39.1578|-3.0208|37060
13083|Torralba de Calatrava|39.0164|-3.7500|3068
13084|Torre de Juan Abad|38.5847|-3.0603|928
13085|Torrenueva|38.6398|-3.3648|2645
13086|Valdemanco del Esteras|38.9384|-4.8291|157
13087|Valdepeñas|38.7664|-3.3997|30782
13088|Valenzuela de Calatrava|38.8528|-3.7723|638
13089|Villahermosa|38.7490|-2.8716|1712
13090|Villamanrique|38.5458|-2.9979|1050
13091|Villamayor de Calatrava|38.7853|-4.1333|611
13092|Villanueva de la Fuente|38.6927|-2.6937|1831
13093|Villanueva de los Infantes|38.7342|-3.0167|4733
13094|Villanueva de San Carlos|38.6219|-3.9090|261
13095|Villar del Pozo|38.8509|-3.9636|45
13096|Villarrubia de los Ojos|39.2179|-3.6075|9512
13097|Villarta de San Juan|39.2377|-3.4219|2681
13098|Viso del Marqués|38.5217|-3.5627|2091
14001|Adamuz|38.0278|-4.5222|4100
14002|Aguilar de la Frontera|37.5167|-4.6500|13130
14003|Alcaracejos|38.3893|-4.9674|1512
14004|Almedinilla|37.4391|-4.0913|2302
14005|Almodóvar del Río|37.8110|-5.0194|8040
14006|Añora|38.4124|-4.8976|1487
14007|Baena|37.6144|-4.3256|18386
14008|Belalcázar|38.5753|-5.1674|3093
14009|Belmez|38.2722|-5.2086|2833
14010|Benamejí|37.2672|-4.5399|4895
14011|Los Blázquez|38.4067|-5.4381|619
14012|Bujalance|37.8940|-4.3787|7065
14013|Cabra|37.4718|-4.4336|19995
14014|Cañete de las Torres|37.8658|-4.3184|2766
14015|Carcabuey|37.4437|-4.2734|2302
14016|Cardeña|38.2703|-4.3227|1387
14017|La Carlota|37.6749|-4.9296|14503
14018|El Carpio|37.9399|-4.4987|4327
14019|Castro del Río|37.6912|-4.4827|7597
14020|Conquista|38.4081|-4.5007|367
14021|Córdoba|37.8900|-4.7800|323262|Còrdova|Kordoba
14022|Doña Mencía|37.5522|-4.3556|4465
14023|Dos Torres|38.4442|-4.8958|2340
14024|Encinas Reales|37.2734|-4.4873|2208
14025|Espejo|37.6789|-4.5538|3175
14026|Espiel|38.1877|-5.0204|2326
14027|Fernán-Núñez|37.6699|-4.7253|9670
14901|Fuente Carreteros|37.6700|-5.1550|1073
14028|Fuente la Lancha|38.4221|-5.0489|330
14029|Fuente Obejuna|38.2671|-5.4197|4309
14030|Fuente Palmera|37.7032|-5.1041|9883
14031|Fuente-Tójar|37.5107|-4.1459|666
14032|La Granjuela|38.3706|-5.3516|412
14033|Guadalcázar|37.7579|-4.9442|1589
14902|La Guijarrosa|37.6379|-4.8645|1358
14034|El Guijo|38.4960|-4.7831|342
14035|Hinojosa del Duque|38.4984|-5.1450|6534
14036|Hornachuelos|37.8323|-5.2482|4383
14037|Iznájar|37.2567|-4.3101|3676
14038|Lucena|37.4089|-4.4853|43408
14039|Luque|37.5577|-4.2784|2796
14040|Montalbán de Córdoba|37.5829|-4.7494|4401
14041|Montemayor|37.6486|-4.6989|3859
14042|Montilla|37.5866|-4.6386|22305
14043|Montoro|38.0217|-4.3828|9004
14044|Monturque|37.4733|-4.5815|1929
14045|Moriles|37.4356|-4.6094|3667
14046|Nueva Carteya|37.5833|-4.4667|5235
14047|Obejo|38.1326|-4.8000|2101
14048|Palenciana|37.2488|-4.5825|1431
14049|Palma del Río|37.6950|-5.2804|20438
14050|Pedro Abad|37.9663|-4.4552|2794
14051|Pedroche|38.4333|-4.7667|1441
14052|Peñarroya-Pueblonuevo|38.3026|-5.2715|10244
14053|Posadas|37.8004|-5.1072|7273
14054|Pozoblanco|38.3780|-4.8486|16931
14055|Priego de Córdoba|37.4384|-4.1980|21764
14056|Puente Genil|37.3886|-4.7698|29963
14057|La Rambla|37.6062|-4.7396|7412
14058|Rute|37.3253|-4.3702|9824
14059|San Sebastián de los Ballesteros|37.6535|-4.8241|865
14061|Santa Eufemia|38.5966|-4.9042|685
14060|Santaella|37.5675|-4.8466|4641
14062|Torrecampo|38.4750|-4.6790|992
14063|Valenzuela|37.7751|-4.2197|1030
14064|Valsequillo|38.4047|-5.3515|351
14065|La Victoria|37.6815|-4.8531|2320
14066|Villa del Río|37.9811|-4.2918|6852
14067|Villafranca de Córdoba|37.9624|-4.5425|4895
14068|Villaharta|38.1397|-4.9031|630
14069|Villanueva de Córdoba|38.3222|-4.6290|8328
14070|Villanueva del Duque|38.3927|-5.0000|1409
14071|Villanueva del Rey|38.1973|-5.1546|1031
14072|Villaralto|38.4554|-4.9842|1059
14073|Villaviciosa de Córdoba|38.0758|-5.0144|3043
14074|El Viso|38.4828|-4.9553|2499
14075|Zuheros|37.5434|-4.3149|596
15001|Abegondo|43.2275|-8.2883|5631
15002|Ames|42.8600|-8.6500|33276
15003|Aranga|43.2339|-8.0158|1793
15004|Ares|43.4264|-8.2443|6275
15005|Arteixo|43.3000|-8.5000|34403|Arteijo
15006|Arzúa|42.9300|-8.1600|5916
15007|A Baña|42.9667|-8.7667|3239|La Baña
15008|Bergondo|43.3194|-8.2339|7135
15009|Betanzos|43.2792|-8.2106|13533
15010|Boimorto|43.0075|-8.1269|1803
15011|Boiro|42.6500|-8.8833|18967
15012|Boqueixón|42.8167|-8.4167|4219|Boqueijón
15013|Brión|42.8667|-8.6783|8192
15014|Cabana de Bergantiños|43.1898|-8.9142|4067
15015|Cabanas|43.4218|-8.1638|3287
15016|Camariñas|43.1300|-9.1850|5075
15017|Cambre|43.2833|-8.3333|24765
15018|A Capela|43.4344|-8.0714|1165|Capela
15019|Carballo|43.2167|-8.6833|32120
15901|Cariño|43.7414|-7.8692|3661
15020|Carnota|42.8211|-9.0872|3780
15021|Carral|43.2296|-8.3560|6840
15022|Cedeira|43.6500|-8.0500|6547
15023|Cee|42.9556|-9.1900|7731
15024|Cerceda|43.1886|-8.4703|5116
15025|Cerdido|43.6121|-7.9520|1006
15027|Coirós|43.2462|-8.1471|1945
15028|Corcubión|42.9458|-9.1933|1659
15029|Coristanco|43.1863|-8.7404|5710
15030|A Coruña|43.3711|-8.3961|251543|La Coruña|la Corunya|Coruña
15031|Culleredo|43.2777|-8.4119|31254
15032|Curtis|43.1392|-8.0356|4242
15033|Dodro|42.7155|-8.7148|2589
15034|Dumbría|43.0104|-9.1180|2716
15035|Fene|43.4667|-8.1667|12467
15036|Ferrol|43.4844|-8.2328|64367
15037|Fisterra|42.9086|-9.2628|4666|Finisterre
15038|Frades|43.0495|-8.2837|2117
15039|Irixoa|43.2877|-8.0487|1343|Irijoa
15041|A Laracha|43.2486|-8.5833|11781|Laracha
15040|Laxe|43.2197|-9.0050|2883|Lage
15042|Lousame|42.7589|-8.8294|3056
15043|Malpica de Bergantiños|43.2984|-8.8246|5232
15044|Mañón|43.7361|-7.7056|1218
15045|Mazaricos|42.9361|-8.9914|3721
15046|Melide|42.9146|-8.0136|7817|Mellid
15047|Mesía|43.0891|-8.2156|2367
15048|Miño|43.3475|-8.2064|7108
15049|Moeche|43.5637|-8.0109|1194
15050|Monfero|43.3268|-8.0494|1816
15051|Mugardos|43.4606|-8.2536|5203
15053|Muros|42.7744|-9.0575|8173
15052|Muxía|43.1062|-9.2175|4326|Mugía
15054|Narón|43.5011|-8.1926|39953
15055|Neda|43.5000|-8.1585|4925
15056|Negreira|42.9110|-8.7350|6969
15057|Noia|42.7850|-8.8878|14123|Noya
15058|Oleiros|43.3548|-8.3287|38793
15059|Ordes|43.0767|-8.4072|12990|Órdenes
15060|Oroso|43.0000|-8.3799|7776
15061|Ortigueira|43.6831|-7.8500|5384
15062|Outes|42.8511|-8.9264|5998
15902|Oza-Cesuras|43.1667|-8.2000|5159
15064|Paderne|43.2833|-8.1744|2450
15065|Padrón|42.7390|-8.6603|8334
15066|O Pino|42.9047|-8.3622|4589|El Pino
15067|A Pobra do Caramiñal|42.6000|-8.9333|9126|Puebla del Caramiñal
15068|Ponteceso|43.2429|-8.9005|5268|Puenteceso
15069|Pontedeume|43.4073|-8.1719|7431|Puentedeume
15070|As Pontes de García Rodríguez|43.4502|-7.8531|9796|Puentes de García Rodríguez
15071|Porto do Son|42.7246|-9.0059|9060|Puerto del Son|O Porto do Son
15072|Rianxo|42.6489|-8.8174|10758|Rianjo
15073|Ribeira|42.5565|-8.9922|27102
15074|Rois|42.7623|-8.7071|4358
15075|Sada|43.3473|-8.2769|17421
15076|San Sadurniño|43.5327|-8.0727|2738|San Saturnino
15077|Santa Comba|43.0384|-8.8142|9442
15078|Santiago de Compostela|42.8833|-8.5333|100965|Santiago de Compostel·la
15079|Santiso|42.8715|-8.0646|1430
15080|Sobrado|43.0419|-8.0275|1830
15081|As Somozas|43.5330|-7.9441|1042
15082|Teo|42.7949|-8.5621|18968
15083|Toques|42.9690|-7.9557|1056
15084|Tordoia|43.0881|-8.5597|3152|Tordoya
15085|Touro|42.8667|-8.2833|3342
15086|Trazo|43.0192|-8.5333|2986
15088|Val do Dubra|43.0225|-8.6381|3680|Valle del Dubra
15087|Valdoviño|43.6000|-8.1331|6818
15089|Vedra|42.7833|-8.4667|4903
15091|Vilarmaior|43.3551|-8.1388|1242|Villarmayor
15090|Vilasantar|43.0758|-8.0958|1233
15092|Vimianzo|43.1100|-9.0344|6768
15093|Zas|43.0953|-8.9242|4199
16001|Abia de la Obispalía|40.0167|-2.4000|68
16002|El Acebrón|39.9000|-2.9833|234
16003|Alarcón|39.5500|-2.0833|173
16004|Albaladejo del Cuende|39.8076|-2.2278|196
16005|Albalate de las Nogueras|40.3672|-2.2781|261|Albalat de las Nogueras
16006|Albendea|40.4879|-2.4171|132
16007|La Alberca de Záncara|39.5083|-2.5056|1504
16008|Alcalá de la Vega|40.0186|-1.4932|80
16009|Alcantud|40.5486|-2.3328|59
16010|Alcázar del Rey|40.0622|-2.8094|171
16011|Alcohujate|40.4169|-2.6172|25
16012|Alconchel de la Estrella|39.7192|-2.5739|75
16013|Algarra|40.0022|-1.4356|25
16014|Aliaguilla|39.7417|-1.3278|594
16015|La Almarcha|39.6867|-2.3797|469
16016|Almendros|39.9206|-2.8849|240
16017|Almodóvar del Pinar|39.7250|-1.9014|401
16018|Almonacid del Marquesado|39.8233|-2.7669|412
16019|Altarejos|39.9128|-2.3552|193
16020|Arandilla del Arroyo|40.5109|-2.3844|14
16905|Arcas|39.9897|-2.1136|2332
16022|Arcos de la Sierra|40.3468|-2.1131|77
16024|Arguisuelas|39.8323|-1.8210|127
16025|Arrancacepas|40.3037|-2.3590|14
16026|Atalaya del Cañavate|39.5181|-2.2520|91
16027|Barajas de Melo|40.1235|-2.9169|1011
16029|Barchín del Hoyo|39.6647|-2.0694|104
16030|Bascuñana de San Pedro|40.2134|-2.2281|23
16031|Beamud|40.1833|-1.8333|45
16032|Belinchón|40.0500|-3.0500|453
16033|Belmonte|39.5593|-2.7038|1751
16034|Belmontejo|39.8228|-2.3443|122
16035|Beteta|40.5667|-2.0667|253
16036|Boniches|39.9519|-1.6242|135
16038|Buciegas|40.3366|-2.4630|36
16039|Buenache de Alarcón|39.6577|-2.1592|447
16040|Buenache de la Sierra|40.1356|-2.0008|112
16041|Buendía|40.3672|-2.7573|422
16042|Campillo de Altobuey|39.6101|-1.7933|1312
16043|Campillos-Paravientos|39.9734|-1.5465|112
16044|Campillos-Sierra|40.1008|-1.6969|28
16901|Campos del Paraíso|40.0157|-2.7028|646
16045|Canalejas del Arroyo|40.3689|-2.4942|153
16046|Cañada del Hoyo|39.9697|-1.8992|221
16047|Cañada Juncosa|39.5501|-2.2512|213
16048|Cañamares|40.4502|-2.2401|457
16049|El Cañavate|39.5442|-2.3036|125
16050|Cañaveras|40.3764|-2.3986|230
16051|Cañaveruelas|40.4003|-2.6369|110
16052|Cañete|40.0418|-1.6490|877|Canyet
16053|Cañizares|40.5186|-2.1913|441
16055|Carboneras de Guadazaón|39.8961|-1.8101|797
16056|Cardenete|39.7662|-1.6887|479|Cardenet
16057|Carrascosa|40.5936|-2.1631|69
16058|Carrascosa de Haro|39.5973|-2.5411|87
16060|Casas de Benítez|39.3614|-2.1308|872
16061|Casas de Fernando Alonso|39.3506|-2.3294|1041
16062|Casas de Garcimolina|39.9969|-1.4172|30
16063|Casas de Guijarro|39.3458|-2.1641|105
16064|Casas de Haro|39.3333|-2.2725|812
16065|Casas de los Pinos|39.3339|-2.3717|374
16066|Casasimarro|39.3919|-2.0389|3177
16067|Castejón|40.3816|-2.5202|120
16068|Castillejo de Iniesta|39.5262|-1.7620|94
16070|Castillejo-Sierra|40.3752|-2.1406|31
16072|Castillo de Garcimuñoz|39.6603|-2.3800|129
16071|Castillo-Albaráñez|40.2992|-2.3930|17
16073|Cervera del Llano|39.7825|-2.4172|220
16023|Chillarón de Cuenca|40.1047|-2.2214|907
16081|Chumillas|39.7711|-2.0323|49
16074|La Cierva|40.0504|-1.8643|39
16078|Cuenca|40.0717|-2.1350|53600|Conca
16079|Cueva del Hierro|40.5828|-2.0361|27
16082|Enguídanos|39.6737|-1.6063|274
16083|Fresneda de Altarejos|39.9262|-2.3139|35
16084|Fresneda de la Sierra|40.3915|-2.1416|42
16085|La Frontera|40.4022|-2.2208|155
16086|Fuente de Pedro Naharro|39.9244|-3.0094|1290
16087|Fuentelespino de Haro|39.6908|-2.6686|230
16088|Fuentelespino de Moya|39.9205|-1.4708|101
16904|Fuentenava de Jábaga|40.0864|-2.2639|634
16089|Fuentes|39.9494|-2.0206|462
16091|Fuertescusa|40.4754|-2.1758|65
16092|Gabaldón|39.6262|-1.9450|146
16093|Garaballa|39.8125|-1.3747|58
16094|Gascueña|40.2983|-2.5181|132
16095|Graja de Campalbo|39.8991|-1.2714|85
16096|Graja de Iniesta|39.5174|-1.6706|343
16097|Henarejos|39.8647|-1.4864|134
16098|El Herrumblar|39.4019|-1.6242|800
16099|La Hinojosa|39.7283|-2.4151|184
16100|Los Hinojosos|39.6042|-2.8258|702
16101|El Hito|39.8447|-2.7228|118
16102|Honrubia|39.6125|-2.2847|1529
16103|Hontanaya|39.7163|-2.8361|255
16104|Hontecillas|39.6928|-2.1869|54
16106|Horcajo de Santiago|39.8421|-2.9971|3894
16107|Huélamo|40.2775|-1.8114|68
16108|Huelves|40.0436|-2.8836|105
16109|Huérguina|40.0406|-1.6089|41
16110|Huerta de la Obispalía|39.9889|-2.4789|126
16111|Huerta del Marquesado|40.1625|-1.6883|155
16112|Huete|40.1475|-2.6889|1814|Huet
16113|Iniesta|39.4446|-1.7487|4567
16115|Laguna del Marquesado|40.1777|-1.6715|54|Laguna de Bernaldet
16116|Lagunaseca|40.5308|-2.0178|50
16117|Landete|39.9078|-1.3644|1175|Landet
16118|Ledaña|39.3558|-1.7161|1552
16119|Leganiel|40.1628|-2.9503|223
16121|Las Majadas|40.2976|-2.0224|214
16122|Mariana|40.1666|-2.1452|332
16123|Masegosa|40.5473|-2.0258|58
16124|Las Mesas|39.3880|-2.7645|2234
16125|Minglanilla|39.5347|-1.5944|2388
16126|Mira|39.7186|-1.4389|917
16128|Monreal del Llano|39.5690|-2.7603|44
16129|Montalbanejo|39.7347|-2.4992|82
16130|Montalbo|39.8819|-2.6689|703
16131|Monteagudo de las Salinas|39.8047|-1.9000|126
16132|Mota de Altarejos|39.8817|-2.3098|25
16133|Mota del Cuervo|39.5003|-2.8682|6089
16134|Motilla del Palancar|39.5630|-1.9120|6432
16135|Moya|39.9483|-1.3653|133
16137|Narboneta|39.7508|-1.4747|42
16139|Olivares de Júcar|39.7603|-2.3534|290
16140|Olmeda de la Cuesta|40.3115|-2.4763|16
16141|Olmeda del Rey|39.8081|-2.0828|129
16142|Olmedilla de Alarcón|39.6136|-2.1064|128
16143|Olmedilla de Eliz|40.3027|-2.4192|20
16145|Osa de la Vega|39.6614|-2.7575|450
16146|Pajarón|39.9575|-1.7831|71
16147|Pajaroncillo|39.9463|-1.7343|59
16148|Palomares del Campo|39.9478|-2.5997|556
16149|Palomera|40.0675|-2.0506|187
16150|Paracuellos|39.7175|-1.7883|105
16151|Paredes|40.0659|-2.8544|61
16152|La Parra de las Vegas|39.8683|-2.2044|36
16153|El Pedernoso|39.4839|-2.7444|1113
16154|Las Pedroñeras|39.4477|-2.6718|6416
16155|El Peral|39.5000|-1.8994|660
16156|La Peraleja|40.2364|-2.5533|77
16157|La Pesquera|39.5747|-1.5831|228
16158|El Picazo|39.4467|-2.0889|693
16159|Pinarejo|39.6156|-2.4233|172
16160|Pineda de Gigüela|40.0855|-2.5431|58
16161|Piqueras del Castillo|39.7206|-2.0825|36
16162|Portalrubio de Guadamejud|40.2721|-2.6044|35
16163|Portilla|40.2886|-2.0828|58
16165|Poyatos|40.4228|-2.0493|70
16166|Pozoamargo|39.3674|-2.1964|255
16908|Pozorrubielos de la Mancha|39.4779|-2.0385|166
16167|Pozorrubio de Santiago|39.8163|-2.9509|307
16169|El Pozuelo|40.6203|-2.2769|47
16170|Priego|40.4488|-2.3135|912
16171|El Provencio|39.3770|-2.5741|2327
16172|Puebla de Almenara|39.7867|-2.8131|294
16174|Puebla del Salvador|39.5664|-1.6736|190
16175|Quintanar del Rey|39.3457|-1.9281|7508
16176|Rada de Haro|39.5693|-2.6205|49
16177|Reíllo|39.9052|-1.8722|106
16181|Rozalén del Monte|39.9908|-2.8044|48
16185|Saceda-Trasierra|40.1543|-2.8535|33
16186|Saelices|39.9194|-2.8033|475
16187|Salinas del Manzano|40.0886|-1.5542|86
16188|Salmeroncillos|40.5022|-2.5152|106
16189|Salvacañete|40.1000|-1.5000|300|Salvacanyet
16190|San Clemente|39.4039|-2.4294|6797|Sant Clemente
16191|San Lorenzo de la Parrilla|39.8494|-2.3578|1119
16192|San Martín de Boniches|39.8864|-1.5731|43
16193|San Pedro Palmiches|40.4298|-2.4062|54
16194|Santa Cruz de Moya|39.9561|-1.2586|233|Santa Creu de Moia
16196|Santa María de los Llanos|39.4900|-2.8083|660
16195|Santa María del Campo Rus|39.5581|-2.4250|527
16197|Santa María del Val|40.5046|-2.0413|55
16198|Sisante|39.4108|-2.2028|1640|Sisant
16199|Solera de Gabaldón|39.7493|-1.9773|32
16909|Sotorribas|40.1944|-2.1628|711
16202|Talayuelas|39.8494|-1.2837|873
16203|Tarancón|40.0086|-3.0102|16748
16204|Tébar|39.4958|-2.1631|300
16205|Tejadillos|40.1401|-1.6347|102
16206|Tinajas|40.3258|-2.5833|184
16209|Torralba|40.3022|-2.2864|107
16211|Torrejoncillo del Rey|40.0075|-2.5700|341
16212|Torrubia del Campo|39.8972|-2.9614|312
16213|Torrubia del Castillo|39.6585|-2.3117|42
16215|Tragacete|40.3511|-1.8497|263|Tragacet
16216|Tresjuncos|39.7014|-2.7558|258
16217|Tribaldos|39.9728|-2.8994|101
16218|Uclés|39.9819|-2.8622|230
16219|Uña|40.2236|-1.9794|90
16906|Los Valdecolmenas|40.1194|-2.4972|69
16224|Valdemeca|40.2241|-1.7434|83
16225|Valdemorillo de la Sierra|40.0390|-1.7805|49
16227|Valdemoro-Sierra|40.1006|-1.7668|96
16228|Valdeolivas|40.5044|-2.4467|206
16902|Valdetórtola|39.9217|-2.1853|115
16903|Las Valeras|39.7686|-2.1581|1528
16231|Valhermoso de la Fuente|39.5524|-2.0165|61
16173|El Valle de Altomira|40.2253|-2.7600|191
16234|Valsalobre|40.6174|-2.0930|17
16236|Valverde de Júcar|39.7192|-2.2197|1118
16237|Valverdejo|39.6160|-2.0238|86
16238|Vara de Rey|39.4258|-2.2939|466
16239|Vega del Codorno|40.4325|-1.9289|141
16240|Vellisca|40.1294|-2.8142|128
16242|Villaconejos de Trabaque|40.4000|-2.3183|325|Villaconejos de Trabac
16243|Villaescusa de Haro|39.5975|-2.6735|480
16244|Villagarcía del Llano|39.3264|-1.8464|763
16245|Villalba de la Sierra|40.2354|-2.0895|569
16246|Villalba del Rey|40.3443|-2.6397|468
16247|Villalgordo del Marquesado|39.6824|-2.5090|59
16248|Villalpardo|39.4719|-1.6247|979
16249|Villamayor de Santiago|39.7287|-2.9270|2336
16250|Villanueva de Guadamejud|40.2248|-2.5049|59
16251|Villanueva de la Jara|39.4399|-1.9535|2396
16253|Villar de Cañas|39.7789|-2.5661|389
16254|Villar de Domingo García|40.2383|-2.2942|217
16255|Villar de la Encina|39.6369|-2.5217|146
16263|Villar de Olalla|40.0136|-2.1972|1575
16258|Villar del Humo|39.8717|-1.6273|182
16259|Villar del Infantado|40.4558|-2.4792|34
16910|Villar y Velasco|40.1402|-2.4163|91
16264|Villarejo de Fuentes|39.7884|-2.6954|387
16265|Villarejo de la Peñuela|40.0879|-2.4098|16
16266|Villarejo-Periesteban|39.8712|-2.4410|375
16269|Villares del Saz|39.8404|-2.5032|499
16270|Villarrubio|39.9458|-2.8944|211
16271|Villarta|39.4464|-1.6444|853
16272|Villas de la Ventosa|40.2050|-2.4322|225
16273|Villaverde y Pasaconsol|39.7708|-2.2650|318
16274|Víllora|39.7522|-1.5892|120
16275|Vindel|40.5868|-2.3804|19
16276|Yémeda|39.7629|-1.7224|18
16277|Zafra de Záncara|39.8920|-2.5580|92
16278|Zafrilla|40.1944|-1.6181|59|La Zafriella
16279|Zarza de Tajo|40.0179|-3.1305|320
16280|Zarzuela|40.2544|-2.1364|174
17001|Agullana|42.3938|2.8467|880
17002|Aiguaviva|41.9385|2.7624|804
17003|Albanyà|42.3050|2.7201|157|Albañá
17004|Albons|42.1086|3.0811|845
17006|Alp|42.3753|1.8886|1724
17007|Amer|42.0092|2.6030|2422
17008|Anglès|41.9574|2.6400|5944
17009|Arbúcies|41.8161|2.5142|6665|Arbucias
17010|Argelaguer|42.2145|2.6415|468
17011|L'Armentera|42.1739|3.0761|1080|La Armentera
17012|Avinyonet de Puigventós|42.2505|2.9120|1671|Aviñonet de Puig Ventós
17015|Banyoles|42.1194|2.7664|20865|Bañolas|Banyolas
17016|Bàscara|42.1622|2.9111|1049
17013|Begur|41.9542|3.2088|4291|Bagur
17018|Bellcaire d'Empordà|42.0808|3.0961|723
17019|Besalú|42.1989|2.6986|2592
17020|Bescanó|41.9649|2.7370|5088
17021|Beuda|42.2371|2.7097|203
17022|La Bisbal d'Empordà|41.9590|3.0378|11757|La Bisbal del Ampurdán
17234|Biure|42.3380|2.8950|226|Viure
17023|Blanes|41.6740|2.7921|42699
17029|Boadella i les Escaules|42.3314|2.8569|262
17024|Bolvir|42.4203|1.8822|493
17025|Bordils|42.0456|2.9133|1841
17026|Borrassà|42.2250|2.9272|804
17027|Breda|41.7486|2.5573|3969
17028|Brunyola i Sant Martí Sapresa|41.9045|2.6842|401|Bruñola
17031|Cabanelles|42.2305|2.8199|286|Cabanellas
17030|Cabanes|42.3111|2.9769|995|Cabanas
17032|Cadaqués|42.2886|3.2778|2918
17033|Caldes de Malavella|41.8387|2.8089|8673|Caldas de Malavella
17034|Calonge i Sant Antoni|41.8625|3.0764|12335
17035|Camós|42.0944|2.7672|701
17036|Campdevànol|42.2258|2.1694|3241
17037|Campelles|42.2969|2.1411|163|Campellas
17038|Campllong|41.8956|2.8319|534|Camplloch
17039|Camprodon|42.3118|2.3648|2570
17040|Canet d'Adri|42.0334|2.7371|744|Canet de Adri
17041|Cantallops|42.4244|2.9261|366
17042|Capmany|42.3761|2.9214|680|Campmany
17044|Cassà de la Selva|41.8893|2.8742|11131
17048|Castell d'Aro, Platja d'Aro i s'Agaró|41.8192|3.0683|12982|Castillo de Aro, Playa de Aro y S'Agaró
17046|Castellfollit de la Roca|42.2214|2.5508|966|Castellfullit de la Roca
17047|Castelló d'Empúries|42.2582|3.0747|12201|Castellón de Ampurias
17189|La Cellera de Ter|41.9683|2.6207|2027|La Sellera de Ter
17049|Celrà|42.0247|2.8789|5621
17050|Cervià de Ter|42.0692|2.9117|1029
17051|Cistella|42.2687|2.8474|283
17054|Colera|42.4064|3.1544|494
17055|Colomers|42.0842|2.9869|208|Colomés
17057|Corçà|41.9872|3.0146|1283|Corsá
17056|Cornellà del Terri|42.0914|2.8178|2414
17058|Crespià|42.1897|2.8003|254
17901|Cruïlles, Monells i Sant Sadurní de l'Heura|41.9564|2.9913|1350|Cruilles, Monells y San Sadurní
17060|Darnius|42.3647|2.8333|563
17061|Das|42.3633|1.8711|261
17062|L'Escala|42.1136|3.1350|10374|La Escala
17063|Espinelves|41.8706|2.4183|261|Espinelvas
17064|Espolla|42.3931|3.0019|398
17065|Esponellà|42.1789|2.7951|446
17005|El Far d'Empordà|42.2536|2.9964|628|Alfar
17066|Figueres|42.2667|2.9500|49689|Figueras
17067|Flaçà|42.0506|2.9556|1175|Flassá
17068|Foixà|42.0433|2.9978|298
17069|Fontanals de Cerdanya|42.3867|1.9017|516|Fontanals de Cerdaña
17070|Fontanilles|42.0119|3.1081|171|Fontanillas
17071|Fontcoberta|42.1444|2.7911|1483|Fontcuberta
17902|Forallac|41.9601|3.0543|1790|Vulpellac, Fonteta i Peratallada
17073|Fornells de la Selva|41.9361|2.8131|2818
17074|Fortià|42.2450|3.0400|793
17075|Garrigàs|42.1934|2.9540|480
17076|Garrigoles|42.1097|3.0328|182|Garrigolas
17077|Garriguella|42.3453|3.0578|989
17078|Ger|42.4131|1.8458|501
17079|Girona|41.9833|2.8167|108666|Gerona|Xirona|Chirona
17080|Gombrèn|42.2497|2.0919|206|Gombreny
17081|Gualta|42.0303|3.1047|438
17082|Guils de Cerdanya|42.4506|1.8797|557|Guils de Cerdaña
17083|Hostalric|41.7481|2.6361|4493
17084|Isòvol|42.3994|1.8392|314|Isóbol
17085|Jafre|42.0750|3.0117|386
17086|La Jonquera|42.4197|2.8753|3420|La Junquera
17087|Juià|42.0175|2.9075|319
17088|Lladó|42.2494|2.8144|822|Lledó
17089|Llagostera|41.8292|2.8933|9585
17090|Llambilles|41.9207|2.8589|737|Llambillas
17091|Llanars|42.3228|2.3453|516|Llanás
17092|Llançà|42.3667|3.1525|4892|Llansá
17093|Llers|42.2972|2.9133|1269
17094|Llívia|42.4639|1.9791|1562
17095|Lloret de Mar|41.7000|2.8333|43000
17096|Les Llosses|42.1510|2.1200|197|Las Llosas
17102|Maçanet de Cabrenys|42.3886|2.7519|761|Massanet de Cabrenys
17103|Maçanet de la Selva|41.7774|2.7308|8071|Massanet de la Selva
17097|Madremanya|41.9899|2.9572|280|Madremaña
17098|Maià de Montcal|42.2222|2.7424|498|Mayá de Moncal
17100|Masarac i Vilarnadal|42.3528|2.9736|287|Masarach
17101|Massanes|41.7678|2.6525|882|Massanas|Maçanes
17099|Meranges|42.4456|1.7875|111|Maranges
17105|Mieres|42.1244|2.6401|369|Mieras
17106|Mollet de Peralada|42.3600|3.0006|202
17107|Molló|42.3494|2.4061|351
17109|Montagut i Oix|42.2313|2.5955|1011|Montagut y Oix
17110|Mont-ras|41.9080|3.1447|1690|Montrás
17111|Navata|42.2240|2.8614|1507
17112|Ogassa|42.2658|2.2778|222
17114|Olot|42.1822|2.4890|39519
17115|Ordis|42.2187|2.9067|409
17116|Osor|41.9454|2.5565|430
17117|Palafrugell|41.9182|3.1630|24543
17118|Palamós|41.8458|3.1289|18933
17119|Palau de Santa Eulàlia|42.1734|2.9647|124
17121|Palau-sator|41.9898|3.1104|311
17120|Palau-saverdera|42.3079|3.1471|1535|Palau Sabardera
17123|Palol de Revardit|42.0719|2.7972|459
17124|Pals|41.9717|3.1500|2534
17125|Pardines|42.3124|2.2138|168|Pardinas
17126|Parlavà|42.0230|3.0311|432|Parlabá
17128|Pau|42.3158|3.1164|560
17129|Pedret i Marzà|42.3080|3.0705|208|Pedret y Marsá
17130|La Pera|42.0204|2.9734|447
17132|Peralada|42.3085|3.0090|2077|Perelada
17133|Les Planes d'Hostoles|42.0566|2.5384|1746
17134|Planoles|42.3163|2.1038|313|Planolas
17135|Pont de Molins|42.3148|2.9304|585
17136|Pontós|42.1860|2.9170|296
17137|Porqueres|42.1221|2.7480|4811|Porqueras
17140|El Port de la Selva|42.3375|3.2042|1053|Puerto de la Selva
17138|Portbou|42.4267|3.1594|1131
17139|Les Preses|42.1464|2.4594|1948|Las Presas
17141|Puigcerdà|42.4317|1.9283|10035|Puicerdán
17142|Quart|41.9399|2.8399|4165
17043|Queralbs|42.3487|2.1627|202
17143|Rabós|42.3787|3.0283|232
17144|Regencós|41.9544|3.1714|275
17145|Ribes de Freser|42.3062|2.1676|1841|Ribas de Freser
17146|Riells i Viabrea|41.7250|2.5582|4635
17147|Ripoll|42.2011|2.1903|10665
17148|Riudarenes|41.8239|2.7175|2532|Riudarenas
17149|Riudaura|42.1887|2.4094|526
17150|Riudellots de la Selva|41.8956|2.8064|2125
17151|Riumors|42.2289|3.0428|253
17152|Roses|42.2633|3.1750|20365|Rosas
17153|Rupià|42.0204|3.0107|325
17154|Sales de Llierca|42.2361|2.6501|164
17155|Salt|41.9761|2.7881|34491
17157|Sant Andreu Salou|41.8750|2.8267|161|San Andrés Salou
17183|Sant Aniol de Finestres|42.0722|2.6156|382|Sant Aniol de Finestrás
17158|Sant Climent Sescebes|42.3708|2.9811|690|San Clemente Sasebas
17159|Sant Feliu de Buixalleu|41.7909|2.5861|882|San Felíu de Buxalleu
17160|Sant Feliu de Guíxols|41.7806|3.0306|23141|San Feliu de Guíxols
17161|Sant Feliu de Pallerols|42.0758|2.5078|1700|San Feliu de Pallarols
17162|Sant Ferriol|42.1946|2.7143|245|San Ferreol
17163|Sant Gregori|41.9893|2.7597|4191|San Gregorio
17164|Sant Hilari Sacalm|41.8786|2.5079|6069|San Hilario Sacalm
17165|Sant Jaume de Llierca|42.2120|2.6074|863|San Jaime de Llierca
17167|Sant Joan de les Abadesses|42.2361|2.2867|3393|San Juan de las Abadesas
17168|Sant Joan de Mollet|42.0461|2.9419|536|San Juan de Mollet
17185|Sant Joan les Fonts|42.2125|2.5117|3167|San Juan les Fonts
17166|Sant Jordi Desvalls|42.0731|2.9547|880|San Jordi Desvalls
17169|Sant Julià de Ramis|42.0347|2.8394|3715|San Julián de Ramis
17903|Sant Julià del Llor i Bonmatí|41.9692|2.6519|1457
17171|Sant Llorenç de la Muga|42.3201|2.7888|247|San Lorenzo de la Muga
17172|Sant Martí de Llémena|42.0381|2.6489|726|San Martín de Liémana
17173|Sant Martí Vell|42.0219|2.9317|271|San Martivell
17174|Sant Miquel de Campmajor|42.1360|2.6791|258|San Miguel de Campmajor
17175|Sant Miquel de Fluvià|42.1772|2.9928|860|San Miguel de Fluviá
17176|Sant Mori|42.1558|2.9897|163|San Mori
17177|Sant Pau de Segúries|42.2636|2.3667|719|San Pablo de Seguríes
17178|Sant Pere Pescador|42.1900|3.0837|2290|San Pedro Pescador
17180|Santa Coloma de Farners|41.8624|2.6654|13993|Santa Coloma de Farnés
17181|Santa Cristina d'Aro|41.8139|2.9974|5987|Santa Cristina de Aro
17182|Santa Llogaia d'Àlguema|42.2334|2.9524|396|Santa Leocadia de Algama
17184|Santa Pau|42.1458|2.5722|1579
17186|Sarrià de Ter|42.0181|2.8261|5406
17187|Saus, Camallera i Llampaies|42.1319|2.9809|897
17188|La Selva de Mar|42.3242|3.1868|223
17190|Serinyà|42.1703|2.7442|1228|Seriñá
17191|Serra de Daró|42.0294|3.0736|240
17192|Setcases|42.3749|2.3015|195|Setcasas
17193|Sils|41.8094|2.7435|6920
17052|Siurana|42.2095|2.9940|188
17194|Susqueda|42.0150|2.5475|103
17195|La Tallada d'Empordà|42.0814|3.0558|490
17196|Terrades|42.3119|2.8400|337|Terradas
17197|Torrent|41.9525|3.1278|182
17198|Torroella de Fluvià|42.1764|3.0417|778
17199|Torroella de Montgrí|42.0439|3.1286|12570
17200|Tortellà|42.2353|2.6314|849
17201|Toses|42.3217|2.0170|198|San Cristóbal de Tosas
17202|Tossa de Mar|41.7206|2.9319|6347|Tosa de Mar
17204|Ullà|42.0525|3.1092|1258
17205|Ullastret|42.0022|3.0697|249
17203|Ultramort|42.0374|3.0345|218
17206|Urús|42.3525|1.8533|201
17014|La Vajol|42.4053|2.8003|112
17208|La Vall de Bianya|42.2413|2.4326|1347|Vall de Vianya
17207|La Vall d'en Bas|42.1178|2.4588|3269|Vall de Bas
17170|Vallfogona de Ripollès|42.1966|2.3035|225
17209|Vall-llobrega|41.8831|3.1272|891
17210|Ventalló|42.1488|3.0269|914
17211|Verges|42.0612|3.0461|1167
17212|Vidrà|42.1247|2.3117|167
17213|Vidreres|41.7889|2.7793|8862|Vidreras
17214|Vilabertran|42.2827|2.9815|961
17215|Vilablareix|41.9525|2.7937|4077
17217|Viladamat|42.1353|3.0761|500
17216|Viladasens|42.0969|2.9317|206
17218|Vilademuls|42.1406|2.8900|898
17220|Viladrau|41.8477|2.3903|1184
17221|Vilafant|42.2468|2.9379|5663
17223|Vilajuïga|42.3281|3.0953|1177
17224|Vilallonga de Ter|42.3313|2.3119|395
17225|Vilamacolum|42.1966|3.0571|406
17226|Vilamalla|42.2166|2.9708|1205
17227|Vilamaniscle|42.3772|3.0689|185
17228|Vilanant|42.2548|2.8893|406
17230|Vila-sacra|42.2668|3.0170|878|Vilasacra
17222|Vilaür|42.1450|2.9569|164|Vilahur
17233|Vilobí d'Onyar|41.8889|2.7425|3297|Viloví de Oñar
17232|Vilopriu|42.1075|2.9944|209
18001|Agrón|37.0300|-3.8292|247
18002|Alamedilla|37.5805|-3.2447|518
18003|Albolote|37.2306|-3.6572|19768
18004|Albondón|36.8273|-3.2109|703
18005|Albuñán|37.2271|-3.1332|422
18006|Albuñol|36.7914|-3.2033|7388
18007|Albuñuelas|36.9281|-3.6317|794
18010|Aldeire|37.1604|-3.0716|597
18011|Alfacar|37.2367|-3.5708|5834
18012|Algarinejo|37.3250|-4.1586|2335
18013|Alhama de Granada|37.0026|-3.9881|5544
18014|Alhendín|37.1078|-3.6458|10475
18015|Alicún de Ortega|37.6081|-3.1375|461
18016|Almegíjar|36.9030|-3.3001|327
18017|Almuñécar|36.7339|-3.6911|27544
18904|Alpujarra de la Sierra|36.9826|-3.1570|933
18018|Alquife|37.1800|-3.1159|543
18020|Arenas del Rey|36.9578|-3.8942|608
18021|Armilla|37.1428|-3.6278|25300
18022|Atarfe|37.2228|-3.6864|20914
18023|Baza|37.4889|-2.7710|20587
18024|Beas de Granada|37.2186|-3.4811|1007
18025|Beas de Guadix|37.2797|-3.2057|318
18027|Benalúa|37.3497|-3.1686|3381
18028|Benalúa de las Villas|37.4317|-3.6825|1028
18029|Benamaurel|37.6084|-2.6972|2235
18030|Bérchules|36.9754|-3.1901|688
18032|Bubión|36.9491|-3.3561|305
18033|Busquístar|36.9375|-3.2944|313
18034|Cacín|37.0600|-3.9169|549
18035|Cádiar|36.9461|-3.1803|1491
18036|Cájar|37.1339|-3.5697|5511
18114|La Calahorra|37.1794|-3.0622|680
18037|Calicasas|37.2733|-3.6186|687
18038|Campotéjar|37.4814|-3.6167|1218
18039|Caniles|37.4342|-2.7245|3929
18040|Cáñar|36.9264|-3.4278|424
18042|Capileira|36.9614|-3.3586|590
18043|Carataunas|36.9231|-3.4088|207
18044|Cástaras|36.9314|-3.2536|178
18045|Castilléjar|37.7147|-2.6431|1284
18046|Castril|37.7958|-2.7789|1927
18047|Cenes de la Vega|37.1594|-3.5386|8254
18059|Chauchina|37.2014|-3.7725|5817
18061|Chimeneas|37.1312|-3.8236|1265
18062|Churriana de la Vega|37.1478|-3.6461|16878
18048|Cijuela|37.2000|-3.8106|3827
18049|Cogollos de Guadix|37.2244|-3.1608|614
18050|Cogollos de la Vega|37.2747|-3.5731|2119|Cogollos Vega
18051|Colomera|37.3717|-3.7142|1278
18053|Cortes de Baza|37.6544|-2.7702|1769
18054|Cortes y Graena|37.3036|-3.2189|949|Cortes eta Graena
18912|Cuevas del Campo|37.6068|-2.9291|1841
18056|Cúllar|37.5836|-2.5764|3978
18057|Cúllar Vega|37.1531|-3.6706|7947
18063|Darro|37.3494|-3.2939|1700
18064|Dehesas de Guadix|37.5900|-3.1028|382
18065|Dehesas Viejas|37.4736|-3.5519|635
18066|Deifontes|37.3264|-3.5944|2612
18067|Diezma|37.3208|-3.3317|829
18068|Dílar|37.0761|-3.6022|2384
18069|Dólar|37.1800|-2.9897|600
18915|Domingo Pérez de Granada|37.4972|-3.5083|822
18070|Dúdar|37.1858|-3.4847|382
18071|Dúrcal|36.9877|-3.5659|7234
18072|Escúzar|37.0619|-3.7611|826
18074|Ferreira|37.1722|-3.0361|297
18076|Fonelas|37.4125|-3.1761|965
18077|Fornes|36.9544|-3.8553|526
18078|Freila|37.5287|-2.9081|960
18079|Fuente Vaqueros|37.2194|-3.7831|4743
18905|Las Gabias|37.1364|-3.6692|23584
18082|Galera|37.7431|-2.5514|1139
18083|Gobernador|37.4772|-3.3206|231
18084|Gójar|37.1044|-3.6031|6371
18085|Gor|37.3694|-2.9694|766
18086|Gorafe|37.4790|-3.0424|368
18087|Granada|37.1750|-3.6000|233975
18088|Guadahortuna|37.5581|-3.3992|1829
18089|Guadix|37.3006|-3.1350|18881
18906|Los Guájares|36.8417|-3.5842|1081
18093|Gualchos|36.7436|-3.3897|5284
18094|Güéjar Sierra|37.1600|-3.4386|2915
18095|Güevéjar|37.2569|-3.5978|2723
18096|Huélago|37.4200|-3.2615|343
18097|Huéneja|37.1769|-2.9486|1180
18098|Huéscar|37.8094|-2.5394|7241
18099|Huétor de Santillán|37.2186|-3.5172|1964|Huétor Santillán
18100|Huétor Tájar|37.1965|-4.0469|10749
18101|Huétor Vega|37.1453|-3.5694|12285
18102|Íllora|37.2883|-3.8797|9923
18103|Ítrabo|36.7994|-3.6386|1022
18105|Iznalloz|37.3925|-3.5225|5179
18106|Játar|36.9347|-3.9100|631
18107|Jayena|36.9489|-3.8228|979
18108|Jérez del Marquesado|37.1853|-3.1578|955
18109|Jete|36.7972|-3.6681|990
18111|Jun|37.2206|-3.5944|4103
18112|Juviles|36.9481|-3.2251|140
18115|Láchar|37.1950|-3.8339|3892
18116|Lanjarón|36.9189|-3.4833|3708
18117|Lanteira|37.1689|-3.1386|533
18119|Lecrín|36.9477|-3.5511|2244
18120|Lentegí|36.8344|-3.6744|368
18121|Lobras|36.9294|-3.2128|139
18122|Loja|37.1667|-4.1500|20951
18123|Lugros|37.2302|-3.2407|306
18124|Lújar|36.7878|-3.4028|491
18126|La Malahá|37.1014|-3.7231|1928
18127|Maracena|37.2075|-3.6331|22294
18128|Marchal|37.2961|-3.2025|437
18132|Moclín|37.3400|-3.7858|3503
18133|Molvízar|36.7869|-3.6075|2689
18134|Monachil|37.1322|-3.5397|8664
18135|Montefrío|37.3211|-4.0111|5283
18136|Montejícar|37.5719|-3.5044|1989
18137|Montillana|37.5031|-3.6711|1054
18138|Moraleda de Zafayona|37.1697|-3.9650|3214
18909|Morelábor|37.4397|-3.3319|588
18140|Motril|36.7453|-3.5206|59862
18141|Murtas|36.8867|-3.1089|431
18903|Nevada|37.0083|-3.0147|1086
18143|Nigüelas|36.9764|-3.5406|1229
18144|Nívar|37.2578|-3.5781|1093
18145|Ogíjares|37.1200|-3.6069|15239
18146|Orce|37.7214|-2.4794|1116
18147|Órgiva|36.9003|-3.4239|5728
18148|Otívar|36.8133|-3.6794|1011
18150|Padul|37.0242|-3.6267|9667
18151|Pampaneira|36.9400|-3.3606|312
18152|Pedro Martínez|37.5017|-3.2306|1166
18153|Peligros|37.2308|-3.6286|11725
18154|La Peza|37.2753|-3.2850|1104
18910|El Pinar|36.9103|-3.5550|867
18157|Pinos Genil|37.1636|-3.5019|1642
18158|Pinos Puente|37.2517|-3.7494|9807
18159|Píñar|37.4425|-3.4406|1040
18161|Polícar|37.2578|-3.2331|252
18162|Polopos|36.7956|-3.2972|1682
18163|Pórtugos|36.9422|-3.3103|372
18164|Puebla de Don Fadrique|37.9581|-2.4350|2195
18165|Pulianas|37.2228|-3.6081|5659
18167|Purullena|37.3147|-3.1894|2409
18168|Quéntar|37.1922|-3.4667|952
18170|Rubite|36.8089|-3.3481|419
18171|Salar|37.1522|-4.0669|2582
18173|Salobreña|36.7467|-3.5869|12760
18174|Santa Cruz del Comercio|37.0608|-3.9764|523
18175|Santa Fe|37.1894|-3.7181|15494
18176|Soportújar|36.9281|-3.4053|260
18177|Sorvilán|36.7944|-3.2675|521
18901|La Taha|36.9361|-3.3256|777
18178|Torre-Cardela|37.5044|-3.3558|700
18916|Torrenueva Costa|36.7019|-3.4858|3207
18179|Torvizcón|36.8786|-3.2986|608
18180|Trevélez|37.0025|-3.2669|698
18181|Turón|36.8636|-3.0575|203
18182|Ugíjar|36.9606|-3.0547|2574
18914|Valderrubio|37.2344|-3.8236|2069
18907|Valle del Zalabí|37.2622|-3.1006|2128
18902|El Valle|36.9292|-3.5828|941
18183|Válor|36.9961|-3.0826|658
18911|Vegas del Genil|37.1717|-3.6675|12424
18184|Vélez de Benaudalla|36.8319|-3.5161|3108
18185|Ventas de Huelma|37.0669|-3.8211|667
18149|Villa de Otura|37.0942|-3.6347|7696|Otura
18908|Villamena|36.9903|-3.5889|1029
18187|Villanueva de las Torres|37.5567|-3.0897|491
18188|Villanueva Mesía|37.2147|-4.0128|1965
18189|Víznar|37.2311|-3.5539|1006
18192|Zafarraya|36.9736|-4.1414|2244
18913|Zagra|37.2536|-4.1681|845
18193|La Zubia|37.1206|-3.5850|20389
18194|Zújar|37.5414|-2.8417|2655
19001|Abánades|40.8939|-2.4839|64
19002|Ablanque|40.8981|-2.2292|70
19003|Adobes|40.6758|-1.6786|28
19004|Alaminos|40.8639|-2.7247|54
19005|Alarilla|40.8489|-3.1056|144
19006|Albalate de Zorita|40.3089|-2.8419|1148
19007|Albares|40.3008|-3.0108|610
19008|Albendiego|41.2272|-3.0517|50
19009|Alcocer|40.4711|-2.6097|319
19010|Alcolea de las Peñas|41.2106|-2.7836|7
19011|Alcolea del Pinar|41.0369|-2.4656|357
19013|Alcoroches|40.6281|-1.7450|117
19015|Aldeanueva de Guadalajara|40.6831|-3.0458|107
19016|Algar de Mesa|41.1353|-1.9581|44
19017|Algora|40.9642|-2.6653|89
19018|Alhóndiga|40.5269|-2.8217|185
19019|Alique|40.5875|-2.6425|15
19020|Almadrones|40.9022|-2.7722|67
19021|Almoguera|40.2989|-2.9811|1379
19022|Almonacid de Zorita|40.3289|-2.8483|667
19023|Alocén|40.5758|-2.7489|151
19024|Alovera|40.5967|-3.2481|14526
19027|Alustante|40.6164|-1.6575|152
19031|Angón|41.0681|-2.8531|8
19032|Anguita|41.0258|-2.3686|150
19033|Anquela del Ducado|40.9717|-2.1289|46
19034|Anquela del Pedregal|40.7444|-1.7356|28
19036|Aranzueque|40.4933|-3.0767|411
19037|Arbancón|40.9658|-3.1136|157
19038|Arbeteta|40.6706|-2.4017|16
19039|Argecilla|40.8833|-2.8178|74
19040|Armallones|40.7378|-2.3025|52
19041|Armuña de Tajuña|40.5319|-3.0303|280
19042|Arroyo de las Fraguas|41.1042|-3.1303|32
19043|Atanzón|40.6675|-2.9967|83
19044|Atienza|41.1992|-2.8700|406
19045|Auñón|40.5169|-2.7917|156
19046|Azuqueca de Henares|40.5647|-3.2681|35924
19047|Baides|41.0069|-2.7761|46
19048|Baños de Tajo|40.7197|-1.9700|13
19049|Bañuelos|41.2833|-2.9167|10
19050|Barriopedro|40.7908|-2.7511|26
19051|Berninches|40.5728|-2.7997|51
19052|La Bodera|41.1212|-2.8900|19
19053|Brihuega|40.7606|-2.8692|2826
19054|Budia|40.6331|-2.7500|226
19055|Bujalaro|40.9378|-2.8817|59
19057|Bustares|41.1367|-3.0714|62
19058|Cabanillas del Campo|40.6383|-3.2353|11572
19059|Campillo de Dueñas|40.8850|-1.6836|71
19060|Campillo de Ranas|41.0856|-3.3142|150
19061|Campisábalos|41.2672|-3.1456|72
19064|Canredondo|40.8125|-2.4933|81
19065|Cantalojas|41.2344|-3.2464|121
19066|Cañizar|40.7708|-3.0656|78
19067|El Cardoso de la Sierra|41.0925|-3.4636|49
19070|Casa de Uceda|40.8442|-3.3700|128
19071|El Casar|40.7033|-3.4264|13962
19073|Casas de San Galindo|40.8731|-2.9564|24
19074|Caspueñas|40.6931|-2.9786|120
19075|Castejón de Henares|40.9386|-2.7850|62
19076|Castellar de la Muela|40.8189|-1.7594|22
19078|Castilforte|40.5586|-2.4308|57
19079|Castilnuevo|40.8156|-1.8564|8
19080|Cendejas de Enmedio|40.9833|-2.8714|68
19081|Cendejas de la Torre|40.9803|-2.8500|23
19082|Centenera|40.6539|-3.0533|158
19103|Checa|40.5864|-1.7897|268
19104|Chequilla|40.6072|-1.8267|13
19106|Chillarón del Rey|40.5983|-2.6900|76
19105|Chiloeches|40.5742|-3.1614|4117
19086|Cifuentes|40.7864|-2.6214|1731
19087|Cincovillas|41.2053|-2.8194|20
19088|Ciruelas|40.7539|-3.0881|136
19089|Ciruelos del Pinar|41.0086|-2.2225|23
19090|Cobeta|40.8667|-2.1411|100
19091|Cogollor|40.8492|-2.7433|19
19092|Cogolludo|40.9483|-3.0875|574
19095|Condemios de Abajo|41.2194|-3.1061|14
19096|Condemios de Arriba|41.2169|-3.1244|101
19097|Congostrina|41.0383|-2.9844|18
19098|Copernal|40.8681|-3.0558|44
19099|Corduente|40.8433|-1.9789|297
19102|El Cubillo de Uceda|40.8250|-3.4047|120
19107|Driebes|40.2461|-3.0408|331
19108|Durón|40.6264|-2.7247|108
19109|Embid|40.9731|-1.7108|37|Embit
19110|Escamilla|40.5508|-2.5614|65
19111|Escariche|40.4092|-3.0550|186
19112|Escopete|40.4164|-3.0064|80
19113|Espinosa de Henares|40.9056|-3.0706|715
19114|Esplegares|40.8581|-2.3692|30
19115|Establés|41.0092|-2.0228|35
19116|Estriégana|41.0592|-2.5225|13
19117|Fontanar|40.7269|-3.1769|2630
19118|Fuembellida|40.7569|-1.9975|13
19119|Fuencemillán|40.9244|-3.0994|81
19120|Fuentelahiguera de Albatages|40.7867|-3.3067|121
19121|Fuentelencina|40.5172|-2.8806|324
19122|Fuentelsaz|41.0747|-1.8294|82
19123|Fuentelviejo|40.5258|-2.9836|61
19124|Fuentenovilla|40.3656|-3.0942|621
19125|Gajanejos|40.8433|-2.8911|51
19126|Galápagos|40.6953|-3.3381|2802
19127|Galve de Sorbe|41.2236|-3.1819|97
19129|Gascueña de Bornova|41.1431|-3.0183|22
19130|Guadalajara|40.6333|-3.1667|92834|Guadalaxara|Guadalachara
19132|Henche|40.7158|-2.7061|73
19133|Heras de Ayuso|40.7908|-3.0989|248
19134|Herrería|40.8889|-1.9589|13|Ferrería
19135|Hiendelaencina|41.0847|-3.0022|107
19136|Hijes|41.2525|-2.9983|24
19138|Hita|40.8247|-3.0494|336
19139|Hombrados|40.8014|-1.6854|44
19142|Hontoba|40.4558|-3.0411|475
19143|Horche|40.5667|-3.0631|3119
19145|Hortezuela de Océn|40.9522|-2.4162|32
19146|La Huerce|41.1536|-3.1689|52
19147|Huérmeces del Cerro|41.0539|-2.7953|43
19148|Huertahernando|40.8244|-2.2856|51
19150|Hueva|40.4625|-2.9606|113
19151|Humanes|40.8272|-3.1553|1841
19152|Illana|40.1853|-2.9069|938
19153|Iniéstola|40.9950|-2.3692|19
19154|Las Inviernas|40.8718|-2.6702|60
19155|Irueste|40.6128|-2.8892|93
19156|Jadraque|40.9267|-2.9236|1522
19157|Jirueque|40.9658|-2.9011|44
19159|Ledanca|40.8697|-2.8425|98
19160|Loranca de Tajuña|40.4469|-3.1139|1624
19161|Lupiana|40.6114|-3.0519|344
19162|Luzaga|40.9744|-2.4442|65
19163|Luzón|41.0269|-2.2756|50
19165|Majaelrayo|41.1122|-3.3019|60
19166|Málaga del Fresno|40.7903|-3.2461|187
19167|Malaguilla|40.8225|-3.2556|218
19168|Mandayona|40.9575|-2.7483|285
19169|Mantiel|40.6293|-2.6644|28
19170|Maranchón|41.0486|-2.2036|225
19171|Marchamalo|40.6689|-3.2022|8714
19172|Masegoso de Tajuña|40.8251|-2.6961|84
19173|Matarrubia|40.8683|-3.2908|99
19174|Matillas|40.9522|-2.8431|111
19175|Mazarete|41.0009|-2.1591|25
19176|Mazuecos|40.2639|-3.0092|267
19177|Medranda|40.9839|-2.9361|83
19178|Megina|40.6403|-1.8689|25
19179|Membrillera|40.9492|-2.9786|95
19181|Miedes de Atienza|41.2672|-2.9636|60
19182|La Mierla|40.9375|-3.2364|44
19184|Millana|40.5086|-2.5697|126
19183|Milmarcos|41.0875|-1.8753|63
19185|La Miñosa|41.1803|-2.9308|31
19186|Mirabueno|40.9439|-2.7250|86
19187|Miralrío|40.8900|-2.9419|56
19188|Mochales|41.0961|-2.0147|36
19189|Mohernando|40.8039|-3.1739|190
19190|Molina de Aragón|40.8439|-1.8886|3281|Molina d'Aragón
19191|Monasterio|40.9861|-3.0961|13
19192|Mondéjar|40.3239|-3.1083|2918
19193|Montarrón|40.9103|-3.1161|31
19194|Moratilla de los Meleros|40.5014|-2.9433|106
19195|Morenilla|40.7861|-1.7076|53
19196|Muduex|40.8308|-2.9581|104
19197|Las Navas de Jadraque|41.1048|-3.0875|37
19198|Negredo|41.0269|-2.8586|12
19199|Ocentejo|40.7719|-2.3978|15
19200|El Olivar|40.6067|-2.7522|68
19201|Olmeda de Cobeta|40.8606|-2.1811|56
19202|La Olmeda de Jadraque|41.1275|-2.7394|18
19203|El Ordial|41.1295|-3.1156|45
19204|Orea|40.5581|-1.7261|191
19208|Pálmaces de Jadraque|41.0561|-2.9106|54
19209|Pardos|40.9489|-1.9242|33
19210|Paredes de Sigüenza|41.2433|-2.7336|21
19211|Pareja|40.5564|-2.6494|493
19212|Pastrana|40.4178|-2.9225|971
19213|El Pedregal|40.7795|-1.5709|60
19214|Peñalén|40.6667|-2.0689|72
19215|Peñalver|40.5828|-2.8881|172
19216|Peralejos de las Truchas|40.5928|-1.9092|148
19217|Peralveche|40.6117|-2.4492|52
19218|Pinilla de Jadraque|41.0214|-2.9417|47
19219|Pinilla de Molina|40.6800|-1.8802|13
19220|Pioz|40.4636|-3.1756|5261
19221|Piqueras|40.6636|-1.7206|33
19222|El Pobo de Dueñas|40.7762|-1.6500|102
19223|Poveda de la Sierra|40.6439|-2.0272|99
19224|Pozo de Almoguera|40.3436|-3.0281|110
19225|Pozo de Guadalajara|40.4950|-3.1819|1739
19226|Prádena de Atienza|41.1736|-3.0053|45
19227|Prados Redondos|40.7847|-1.7935|45
19228|Puebla de Beleña|40.8894|-3.2194|57
19229|Puebla de Valles|40.9275|-3.3036|59
19230|Quer|40.6078|-3.2767|1080
19231|Rebollosa de Jadraque|41.0902|-2.8416|11
19232|El Recuenco|40.6167|-2.3383|80
19233|Renera|40.4922|-3.0153|100
19234|Retiendas|40.9706|-3.2753|52
19235|Riba de Saelices|40.9122|-2.2956|113
19237|Rillo de Gallo|40.8672|-1.9361|37
19238|Riofrío del Llano|41.1389|-2.8206|49
19239|Robledillo de Mohernando|40.8547|-3.2339|200
19240|Robledo de Corpes|41.1181|-2.9492|39
19241|Romanillos de Atienza|41.2758|-2.8944|37
19242|Romanones|40.5706|-2.9928|127
19243|Rueda de la Sierra|40.9183|-1.8537|38
19244|Sacecorbo|40.8326|-2.4171|90
19245|Sacedón|40.4822|-2.7317|1623
19246|Saelices de la Sal|40.9081|-2.3211|41
19247|Salmerón|40.5456|-2.4931|147
19248|San Andrés del Congosto|40.9995|-3.0269|63
19249|San Andrés del Rey|40.6400|-2.8189|35
19250|Santiuste|41.0853|-2.8078|15
19251|Saúca|41.0325|-2.5281|47
19252|Sayatón|40.3772|-2.8519|64
19254|Selas|40.9509|-2.1013|33
19901|Semillas|41.0597|-3.1183|25
19255|Setiles|40.7336|-1.6167|78
19256|Sienes|41.2014|-2.6522|38
19257|Sigüenza|41.0692|-2.6392|4911
19258|Solanillos del Extremo|40.7510|-2.6980|72
19259|Somolinos|41.2451|-3.0577|26
19260|El Sotillo|40.8819|-2.6328|28
19261|Sotodosos|40.9227|-2.3928|30
19262|Tamajón|41.0011|-3.2489|153
19263|Taragudo|40.8228|-3.0808|45
19264|Taravilla|40.6973|-1.9689|38
19265|Tartanedo|40.9942|-1.9222|143
19266|Tendilla|40.5444|-2.9592|353
19267|Terzaga|40.6945|-1.9044|24
19268|Tierzo|40.7492|-1.9305|32
19269|La Toba|41.0042|-2.9819|70
19271|Tordellego|40.7211|-1.6702|38
19270|Tordelrábano|41.2186|-2.7580|8
19272|Tordesilos|40.6705|-1.5924|78
19274|Torija|40.7433|-3.0314|1877
19279|Torre del Burgo|40.7942|-3.0800|494
19277|Torrecuadrada de Molina|40.7498|-1.8066|20
19278|Torrecuadradilla|40.8536|-2.5319|26
19280|Torrejón del Rey|40.6458|-3.3356|6435
19281|Torremocha de Jadraque|41.0203|-2.8981|23
19282|Torremocha del Campo|40.9792|-2.6175|193
19283|Torremocha del Pinar|40.8908|-2.0436|32
19284|Torremochuela|40.7657|-1.8414|6
19285|Torrubia|40.9657|-1.9004|28
19286|Tórtola de Henares|40.7064|-3.1242|1439
19287|Tortuera|40.9731|-1.7969|157
19288|Tortuero|40.9375|-3.3522|19
19289|Traíd|40.6687|-1.8095|18
19290|Trijueque|40.7778|-2.9944|1737
19291|Trillo|40.7028|-2.5914|1406
19293|Uceda|40.8422|-3.4625|3400
19294|Ujados|41.2351|-3.0057|20
19296|Utande|40.8500|-2.9267|31
19297|Valdarachas|40.5178|-3.1253|67
19298|Valdearenas|40.8111|-2.9908|88
19299|Valdeavellano|40.6661|-2.9681|101
19300|Valdeaveruelo|40.6381|-3.3156|1317
19301|Valdeconcha|40.4561|-2.8767|42
19302|Valdegrudas|40.7147|-3.0133|49
19303|Valdelcubo|41.2272|-2.6742|42
19304|Valdenuño Fernández|40.7628|-3.3786|359
19305|Valdepeñas de la Sierra|40.9081|-3.3875|151
19306|Valderrebollo|40.8104|-2.7294|25
19307|Valdesotos|40.9572|-3.3283|35
19308|Valfermoso de Tajuña|40.6211|-2.9536|77|Valfermoso de las Monjas
19309|Valhermoso|40.7831|-1.9667|15
19310|Valtablado del Río|40.7156|-2.4011|7
19311|Valverde de los Arroyos|41.1292|-3.2333|85
19314|Viana de Jadraque|41.0267|-2.7681|41
19317|Villanueva de Alcorón|40.6800|-2.2519|140
19318|Villanueva de Argecilla|40.9031|-2.9128|30
19319|Villanueva de la Torre|40.5842|-3.3025|6666
19321|Villares de Jadraque|41.1028|-3.0244|39
19322|Villaseca de Henares|40.9605|-2.7980|22
19323|Villaseca de Uceda|40.8219|-3.3503|59
19324|Villel de Mesa|41.1266|-1.9901|163
19325|Viñuelas|40.7949|-3.3440|181
19326|Yebes|40.5347|-3.1097|5637
19327|Yebra|40.3567|-2.9667|489
19329|Yélamos de Abajo|40.6319|-2.8544|57
19330|Yélamos de Arriba|40.6411|-2.8417|97
19331|Yunquera de Henares|40.7542|-3.1667|4706
19332|La Yunta|40.9142|-1.6834|86
19333|Zaorejas|40.7611|-2.2022|117
19334|Zarzuela de Jadraque|41.0694|-3.0425|49
19335|Zorita de los Canes|40.3328|-2.8875|72
20001|Abaltzisketa|43.0478|-2.1052|321|Abalcisqueta
20002|Aduna|43.2038|-2.0501|500
20016|Aia|43.2365|-2.1487|2148|Aya
20003|Aizarnazabal|43.2558|-2.2363|822
20004|Albiztur|43.1294|-2.1373|328
20005|Alegia|43.1004|-2.0984|1813
20006|Alkiza|43.1726|-2.1090|352|Alquiza
20906|Altzaga|43.0642|-2.1547|165|Alzaga
20007|Altzo|43.1004|-2.0842|447|Alzo
20008|Amezketa|43.0493|-2.0881|956|Amézqueta|Amezqueta
20009|Andoain|43.2183|-2.0199|14517
20010|Anoeta|43.1622|-2.0700|2112
20011|Antzuola|43.0991|-2.3806|2045
20012|Arama|43.0635|-2.1656|173
20013|Aretxabaleta|43.0361|-2.5044|7178|Arechavaleta
20055|Arrasate/Mondragón|43.0656|-2.4900|22450
20014|Asteasu|43.1928|-2.0954|1566
20903|Astigarraga|43.2816|-1.9475|7812
20015|Ataun|42.9781|-2.1813|1714
20017|Azkoitia|43.1792|-2.3106|11774|Azcoitia
20018|Azpeitia|43.1819|-2.2653|15301
20904|Baliarrain|43.0694|-2.1284|152
20019|Beasain|43.0473|-2.2033|14048
20020|Beizama|43.1342|-2.2003|128
20021|Belauntza|43.1350|-2.0503|291|Belaunza
20022|Berastegi|43.1241|-1.9792|1114|Berástegui
20074|Bergara|43.1175|-2.4133|14404|Vergara
20023|Berrobi|43.1456|-2.0266|551
20024|Bidania-Goiatz|43.1408|-2.1583|530|Bidegoyan|Bidegoian
20029|Deba|43.2953|-2.3500|5362|Deva
20069|Donostia/San Sebastián|43.3200|-1.9800|189866|Sant Sebastià|Sant Sabastián
20030|Eibar|43.1843|-2.4733|27484
20031|Elduain|43.1407|-2.0007|248|Elduayen
20033|Elgeta|43.1366|-2.4877|1133|Elgueta
20032|Elgoibar|43.2142|-2.4169|11705
20067|Errenteria|43.3125|-1.8986|39363|Rentería|La Rentería
20066|Errezil|43.1650|-2.1742|588|Régil
20034|Eskoriatza|43.0168|-2.5283|4215|Escoriaza
20035|Ezkio-Itsaso|43.0819|-2.2742|604|Ezquioga-Ichaso|Ichaso|Itsaso|Itsaso (Gipuzkoa)|Ezquioga
20038|Gabiria|43.0503|-2.2791|519|Gaviria
20037|Gaintza|43.0531|-2.1325|122|Gaínza
20907|Gaztelu|43.1164|-2.0228|171
20039|Getaria|43.3045|-2.2037|2887|Guetaria
20040|Hernani|43.2662|-1.9749|20375
20041|Hernialde|43.1545|-2.0852|326
20036|Hondarribia|43.3624|-1.7915|16788|Fuenterrabía|Fontarrabia
20042|Ibarra|43.1308|-2.0617|4114
20043|Idiazabal|43.0107|-2.2336|2217
20044|Ikaztegieta|43.0947|-2.1253|498|Icazteguieta
20045|Irun|43.3378|-1.7888|63835
20046|Irura|43.1675|-2.0672|1885
20047|Itsasondo|43.0678|-2.1672|687|Isasondo
20048|Larraul|43.1879|-2.1024|263
20902|Lasarte-Oria|43.2678|-2.0200|19435
20049|Lazkao|43.0347|-2.1875|6087|Lazcano
20050|Leaburu|43.1236|-2.0500|390
20051|Legazpi|43.0550|-2.3350|8384|Legazpia
20052|Legorreta|43.0849|-2.1486|1457
20068|Leintz-Gatzaga|42.9869|-2.5687|205|Salinas de Léniz
20053|Lezo|43.3211|-1.8989|6184|Lezon
20054|Lizartza|43.1036|-2.0342|672|Lizarza
20901|Mendaro|43.2526|-2.3864|2028
20057|Mutiloa|43.0220|-2.2728|261|Motiloa
20056|Mutriku|43.3072|-2.3850|5238|Motrico
20063|Oiartzun|43.2992|-1.8578|10480|Oyarzun
20058|Olaberria|43.0269|-2.2037|938
20059|Oñati|43.0328|-2.4117|11480|Oñate
20076|Ordizia|43.0547|-2.1783|10815|Villafranca de Ordizia
20905|Orendain|43.0795|-2.1141|245
20060|Orexa|43.0942|-2.0113|103|Oreja
20061|Orio|43.2760|-2.1273|6184
20062|Ormaiztegi|43.0431|-2.2548|1293|Ormáiztegui
20064|Pasaia|43.3264|-1.9192|15820|Pasajes
20070|Segura|43.0091|-2.2528|1496
20065|Soraluze-Placencia de las Armas|43.1748|-2.4117|3857|Placencia de las Armas
20071|Tolosa|43.1386|-2.0724|20070
20072|Urnieta|43.2469|-1.9917|6327
20077|Urretxu|43.0917|-2.3139|6730|Villarreal de Urrechua
20073|Usurbil|43.2667|-2.0500|6488
20075|Villabona|43.1881|-2.0525|5900
20078|Zaldibia|43.0364|-2.1497|1761|Zaldivia
20079|Zarautz|43.2863|-2.1748|23496|Zarauz
20025|Zegama|42.9758|-2.2904|1543|Cegama
20026|Zerain|43.0125|-2.2734|284|Ceráin
20027|Zestoa|43.2401|-2.2586|3933|Cestona
20028|Zizurkil|43.2000|-2.0772|2976|Cizúrquil
20081|Zumaia|43.2833|-2.2500|10160|Zumaya
20080|Zumarraga|43.0831|-2.3167|9678
21001|Alájar|37.8746|-6.6651|793
21002|Aljaraque|37.2665|-7.0247|22737
21003|El Almendro|37.5072|-7.2694|862
21004|Almonaster la Real|37.8733|-6.7861|1759
21005|Almonte|37.2612|-6.5176|24864
21006|Alosno|37.5497|-7.1158|3986
21007|Aracena|37.8911|-6.5611|8425
21008|Aroche|37.9437|-6.9537|2991
21009|Arroyomolinos de León|38.0019|-6.4246|907
21010|Ayamonte|37.2136|-7.4031|22001
21011|Beas|37.4258|-6.7928|4414
21012|Berrocal|37.6089|-6.5425|283
21013|Bollullos Par del Condado|37.3397|-6.5372|14314
21014|Bonares|37.3219|-6.6805|6125
21015|Cabezas Rubias|37.7259|-7.0868|694
21016|Cala|37.9674|-6.3156|1106
21017|Calañas|37.6536|-6.8789|2749
21018|El Campillo|37.6932|-6.6300|2003
21019|Campofrío|37.7656|-6.5767|728
21020|Cañaveral de León|38.0148|-6.5284|389
21021|Cartaya|37.2832|-7.1549|21471
21022|Castaño del Robledo|37.8957|-6.7058|217
21023|El Cerro de Andévalo|37.7346|-6.9376|2246
21030|Chucena|37.3616|-6.3939|2306
21024|Corteconcepción|37.8965|-6.5075|581
21025|Cortegana|37.9093|-6.8196|4617
21026|Cortelazor|37.9356|-6.6244|302
21027|Cumbres de Enmedio|38.0732|-6.6932|54
21028|Cumbres de San Bartolomé|38.0772|-6.7432|354
21029|Cumbres Mayores|38.0623|-6.6466|1708
21031|Encinasola|38.1360|-6.8710|1232
21032|Escacena del Campo|37.4088|-6.3896|2327
21033|Fuenteheridos|37.9035|-6.6617|804
21034|Galaroza|37.9278|-6.7083|1366
21035|Gibraleón|37.3751|-6.9694|13261
21036|La Granada de Río-Tinto|37.7667|-6.5000|235|La Granada de Riotinto
21037|El Granado|37.5207|-7.4164|480
21038|Higuera de la Sierra|37.8365|-6.4479|1292
21039|Hinojales|38.0082|-6.5914|314
21040|Hinojos|37.2918|-6.3786|4097
21041|Huelva|37.2500|-6.9500|143215|Uelba
21042|Isla Cristina|37.1994|-7.3253|21525
21043|Jabugo|37.9167|-6.7285|2183
21044|Lepe|37.2500|-7.2000|29677
21045|Linares de la Sierra|37.8796|-6.6211|279
21046|Lucena del Puerto|37.3040|-6.7291|3390
21047|Manzanilla|37.3887|-6.4316|2214
21048|Los Marines|37.9038|-6.6212|436
21049|Minas de Riotinto|37.6947|-6.5940|3698
21050|Moguer|37.2747|-6.8386|24083
21051|La Nava|37.9628|-6.7450|271
21052|Nerva|37.6955|-6.5489|5087
21053|Niebla|37.3614|-6.6779|4268
21054|La Palma del Condado|37.3842|-6.5518|10841
21055|Palos de la Frontera|37.2278|-6.8932|12938
21056|Paterna del Campo|37.4188|-6.4025|3382
21057|Paymogo|37.7406|-7.3462|1132
21058|Puebla de Guzmán|37.6128|-7.2479|3071
21059|Puerto Moral|37.8917|-6.4796|276
21060|Punta Umbría|37.1822|-6.9669|16281
21061|Rociana del Condado|37.3082|-6.5979|8024
21062|Rosal de la Frontera|37.9685|-7.2196|1676
21063|San Bartolomé de la Torre|37.4462|-7.1068|4072
21064|San Juan del Puerto|37.3142|-6.8408|9969
21066|San Silvestre de Guzmán|37.3894|-7.3479|649
21065|Sanlúcar de Guadiana|37.4720|-7.4659|418
21067|Santa Ana la Real|37.8639|-6.7244|466
21068|Santa Bárbara de Casa|37.7957|-7.1886|1144
21069|Santa Olalla del Cala|37.9067|-6.2293|2039
21070|Trigueros|37.3831|-6.8336|8159
21071|Valdelarco|37.9506|-6.6832|239
21072|Valverde del Camino|37.5740|-6.7544|12631
21073|Villablanca|37.3040|-7.3410|2939
21074|Villalba del Alcor|37.3964|-6.4757|3303
21075|Villanueva de las Cruces|37.6286|-7.0246|379
21076|Villanueva de los Castillejos|37.4992|-7.2725|2967
21077|Villarrasa|37.3880|-6.6054|2103
21078|Zalamea la Real|37.6803|-6.6591|2968
21902|La Zarza-Perrunal|37.7137|-6.8559|1181
21079|Zufre|37.8339|-6.3389|736
22001|Abiego|42.1199|-0.0681|259
22002|Abizanda|42.2439|0.1986|162|L'Abizanda
22003|Adahuesca|42.1444|-0.0075|196|Avosca|Adauesca
22004|Agüero|42.3564|-0.7931|142
22907|Aínsa-Sobrarbe|42.4172|0.1375|2335|l'Aïnsa-Sobrarb|L'Aínsa-Sobrarbe
22006|Aisa|42.6828|-0.6169|326
22007|Albalate de Cinca|41.7236|0.1464|1080|Albalat de Cinca|Albalat d'a Cinca
22008|Albalatillo|41.7378|-0.1494|220|Albalatiello
22009|Albelda|41.8667|0.4619|728
22011|Albero Alto|42.0501|-0.3368|123|Albero d'Alto
22012|Albero Bajo|42.0250|-0.3778|109|Albero Baixo
22013|Alberuela de Tubo|41.9094|-0.2131|270|Abaruela de Tubo
22014|Alcalá de Gurrea|42.0678|-0.6844|265
22015|Alcalá del Obispo|42.0783|-0.2908|394|Alcalá d'o Bispe
22016|Alcampell|41.9067|0.4347|650|el Campell
22017|Alcolea de Cinca|41.7219|0.1175|1127|Alcoleya d'a Cinca|Alcoleya de Cinca
22018|Alcubierre|41.8083|-0.4517|401
22019|Alerre|42.1667|-0.4667|224
22020|Alfántega|41.8297|0.1486|125
22021|Almudévar|42.0442|-0.5806|2462|Almudébar
22022|Almunia de San Juan|41.9372|0.2464|733|l'Almúnia de Sant Joan|L'Almunia de Sant Chuan
22023|Almuniente|41.9508|-0.4103|448|Almunient
22024|Alquézar|42.1739|0.0272|328|Alquèssar|Alquezra
22025|Altorricón|41.8042|0.4147|1504|el Torricó|El Torricó
22027|Angüés|42.1167|-0.1500|350
22028|Ansó|42.7500|-0.8167|409|Valle de Ansó
22029|Antillón|42.0333|-0.1667|127
22032|Aragüés del Puerto|42.7069|-0.6697|123|Aragüés del Port|Aragüés de lo Puerto
22035|Arén|42.2600|0.7222|309|Areny de Noguera
22036|Argavieso|42.0542|-0.2772|109
22037|Arguis|42.3161|-0.4378|167
22039|Ayerbe|42.2767|-0.6892|1050
22040|Azanuy-Alins|41.9742|0.3122|184|Sanui i Alins|Zanui-Alins
22041|Azara|42.0667|-0.0333|167
22042|Azlor|42.0972|-0.0436|155|Aflor
22043|Baélls|41.9540|0.4589|89
22044|Bailo|42.5108|-0.8100|265|Baillo
22045|Baldellou|41.9189|0.5481|81|Valldellou|Valdellou
22046|Ballobar|41.6205|0.1920|862|Vallobar
22047|Banastás|42.1833|-0.4500|335
22048|Barbastro|42.0365|0.1272|17807|Barbastre|Balbastro
22049|Barbués|41.9833|-0.4167|97
22050|Barbuñales|42.0167|-0.0833|93|Barbunyals
22051|Bárcabo|42.2436|0.0711|116
22052|Belver de Cinca|41.6833|0.2139|1298|Bellver de Cinca|Belver d'a Cinca
22053|Benabarre|42.1167|0.4833|1142|Benavarri
22054|Benasque|42.6047|0.5233|2359|Benasc|Benás
22246|Beranuy|42.3683|0.5928|68|Beranui
22055|Berbegal|41.9500|0.0000|321
22057|Bielsa|42.6336|0.2183|479
22058|Bierge|42.1667|-0.0833|243|Biarche
22059|Biescas|42.6283|-0.3211|1640
22060|Binaced|41.8256|0.2023|1694|Binacet|Binazet
22061|Binéfar|41.8500|0.2833|10235
22062|Bisaurri|42.4966|0.5066|177|Bissaürri|Bisagorri
22063|Biscarrués|42.2272|-0.7511|188
22064|Blecua y Torres|42.0686|-0.1988|175|Blecua-Torres
22066|Boltaña|42.4462|0.0674|1089|Boltanya
22067|Bonansa|42.4272|0.6681|85
22068|Borau|42.6417|-0.5872|77
22069|Broto|42.6038|-0.1190|615
22072|Caldearenas|42.3969|-0.4987|220|Candarenas
22074|Campo|42.4098|0.3972|491
22075|Camporrélls|41.9599|0.5234|153
22076|Canal de Berdún|42.5985|-0.8541|322|A Canal de Berdún
22077|Candasnos|41.5021|0.0622|478
22078|Canfranc|42.7167|-0.5252|633
22079|Capdesaso|41.8425|-0.1825|190|Cabosaso
22080|Capella|42.1977|0.3955|361
22081|Casbas de Huesca|42.1544|-0.1403|287|Casbas de Uesca
22083|Castejón de Monegros|41.6188|-0.2342|459|Castillón de Monegros
22084|Castejón de Sos|42.5125|0.4918|840|Castilló de Sos
22082|Castejón del Puente|41.9635|0.1547|359|Castillón d'o Puent
22085|Castelflorite|41.8036|-0.0222|102|Castiflorit
22086|Castiello de Jaca|42.6307|-0.5506|280|Castiello de Chaca
22087|Castigaleu|42.2050|0.5811|80
22088|Castillazuelo|42.0684|0.0645|164
22089|Castillonroy|41.8850|0.5136|334|Castellonroi|Castillón Roi
22094|Chalamera|41.6648|0.1629|120|Xalamera
22095|Chía|42.5208|0.4656|90|Gia
22096|Chimillas|42.1706|-0.4523|407|Chimiellas
22090|Colungo|42.1725|0.0642|124
22099|Esplús|41.7983|0.2744|676|Esplucs
22102|Estada|42.0719|0.2339|215
22103|Estadilla|42.0575|0.2436|810|Estadella
22105|Estopiñán del Castillo|41.9960|0.5429|147|Estopanyà|Estupinyán
22106|Fago|42.7353|-0.8656|24
22107|Fanlo|42.5869|-0.0219|114
22109|Fiscal|42.4967|-0.1206|358
22110|Fonz|42.0098|0.2583|886|Fonts
22111|Foradada del Toscar|42.4103|0.3506|163|la Foradada del Toscar|La Foradada d'el Toscar
22112|Fraga|41.5207|0.3516|15576
22113|La Fueva|42.3697|0.2722|597|La Fova|A Fueva
22114|Gistaín|42.5911|0.3342|114|Chistén
22115|El Grado|42.1514|0.2231|383|Lo Grau
22116|Grañén|41.9417|-0.3697|1718|Granyén
22117|Graus|42.1906|0.3383|3400
22119|Gurrea de Gállego|42.0125|-0.7614|1430|Gurrea de Galligo
22122|Hoz de Jaca|42.6911|-0.3061|81|Oz de Tena
22908|Hoz y Costean|42.1278|0.1188|225|Oz y Costeán
22124|Huerto|41.9325|-0.1661|216
22125|Huesca|42.1401|-0.4089|55454|Osca|Uesca
22126|Ibieca|42.1667|-0.2000|110
22127|Igriés|42.2146|-0.4304|727
22128|Ilche|41.9571|0.0567|183
22129|Isábena|42.3028|0.5397|234|Isàvena|Isabana
22130|Jaca|42.5500|-0.5500|14024|Jaka|Chaca
22131|Jasa|42.6933|-0.6668|90|Chasa
22133|Labuerda|42.4510|0.1354|179|A Buerda
22135|Laluenga|42.0058|-0.0461|198|A Luenga
22136|Lalueza|41.8419|-0.2556|849|A Lueza
22137|Lanaja|41.7728|-0.3283|1140|Lanacha
22139|Laperdiguera|41.9900|-0.0447|87|A Perdiguera
22141|Lascellas-Ponzano|42.0675|-0.0750|138|Ascellas-Ponzano
22142|Lascuarre|42.1992|0.5169|139|Lasquarri|Llascuarre
22143|Laspaúles|42.4717|0.5994|255|les Paüls|Las Pauls
22144|Laspuña|42.5042|0.1553|277|A Espunya
22149|Loarre|42.3156|-0.6242|358|Lobarre
22150|Loporzano|42.1625|-0.3222|576
22151|Loscorrales|42.2553|-0.6411|98|Os Corrals
22905|Lupiñén-Ortilla|42.1761|-0.5811|359|Lopinyén-Ortiella
22155|Monesma y Cajigar|42.2614|0.5983|68|Monesma i Queixigar|Monesma y Caixigar
22156|Monflorite-Lascasas|42.0956|-0.3550|475|Monflorite-As Casas
22157|Montanuy|42.4667|0.6958|230|Montanui
22158|Monzón|41.9000|0.1833|18525|Montsó
22160|Naval|42.1950|0.1528|281
22162|Novales|42.0322|-0.2867|154|Novals
22163|Nueno|42.2678|-0.4381|568
22164|Olvena|42.1086|0.2617|63|Olbena
22165|Ontiñena|41.6762|0.0892|502|Ontinyena
22167|Osso de Cinca|41.6650|0.1908|644|Osso d'a Cinca
22168|Palo|42.3242|0.2447|31
22170|Panticosa|42.7242|-0.2844|910|Pandicosa
22172|Peñalba|41.5008|-0.0403|657|Penyalba
22173|Las Peñas de Riglos|42.3489|-0.7267|263|As Penyas de Riglos
22174|Peralta de Alcofea|41.9314|-0.0672|576|Peralta d'Alcofeya
22175|Peralta de Calasanz|41.9925|0.3856|206|Peralta i Calassanç|Peralta y Calasanz
22176|Peraltilla|42.0553|-0.0181|212|Peraltiella
22177|Perarrúa|42.2672|0.3514|116|Perarruga
22178|Pertusa|42.0019|-0.1275|129
22181|Piracés|42.0050|-0.3161|92
22182|Plan|42.5814|0.3378|272
22184|Poleñino|41.8697|-0.3097|184|Polinyino
22186|Pozán de Vero|42.0814|0.0319|228
22187|La Puebla de Castro|42.1444|0.2875|430|la Pobla de Castre
22188|Puente de Montañana|42.1511|0.6947|87|el Pont de Montanyana|Puent de Montanyana
22902|Puente la Reina de Jaca|42.5568|-0.7864|248|Puent d'a Reina de Chaca
22189|Puértolas|42.5481|0.1325|217
22190|El Pueyo de Araguás|42.4413|0.1617|180|O Pueyo d'Araguás
22193|Pueyo de Santa Cruz|41.8578|0.1564|332|Puidemoros
22195|Quicena|42.1475|-0.3600|391
22197|Robres|41.8664|-0.4608|524
22199|Sabiñánigo|42.5186|-0.3643|9695|Samianigo
22200|Sahún|42.5767|0.4658|320|Saünc|Saúnc
22201|Salas Altas|42.1153|0.0714|301
22202|Salas Bajas|42.1003|0.0842|184|Salas Baixas
22203|Salillas|41.9939|-0.2239|94|Saliellas
22204|Sallent de Gállego|42.7719|-0.3328|1505|Sallent de Galligo
22205|San Esteban de Litera|41.9050|0.3269|672|Sant Esteve de Llitera|Sant Isteban de Litera
22207|San Juan de Plan|42.5881|0.3450|145|San Chuan de Plan|Sant Chuan de Plan
22903|San Miguel del Cinca|41.8288|0.0912|775|Sant Miquel del Cinca|Sant Miguel d'a Cinca
22206|Sangarrén|42.0175|-0.4317|233
22208|Santa Cilia|42.5606|-0.7144|244
22209|Santa Cruz de la Serós|42.5231|-0.6744|193|Santa Creu de la Serós|Santa Cruz d'as Serors
22906|Santa María de Dulcis|42.1117|0.0161|206
22212|Santaliestra y San Quílez|42.3069|0.3644|78|Santa Llestra i Sant Quilis|Santa Llestra y Sant Quílez
22213|Sariñena|41.7934|-0.1574|4113|Sarinyena
22214|Secastilla|42.1811|0.2667|142|Secastella|Secastiella
22215|Seira|42.4803|0.4300|149
22217|Sena|41.7156|-0.0436|490
22218|Senés de Alcubierre|41.9075|-0.4903|49|Senés d'Alcubierre
22220|Sesa|41.9957|-0.2440|167
22221|Sesué|42.5508|0.4720|120|Sessué
22222|Siétamo|42.1245|-0.2825|697|Sietemo
22223|Sopeira|42.3161|0.7456|84
22904|La Sotonera|42.2594|-0.5528|879|A Sotonera
22225|Tamarite de Litera|41.8667|0.4333|3464|Tamarit de Llitera|Tamarit de Litera
22226|Tardienta|41.9789|-0.5372|952
22227|Tella-Sin|42.5439|0.1972|208|Tella-Ensin
22228|Tierz|42.1322|-0.3536|821
22229|Tolva|42.1147|0.5650|130|Tolba
22230|Torla-Ordesa|42.6278|-0.1122|342
22232|Torralba de Aragón|41.9347|-0.5108|105|Torralba d'Aragón
22233|Torre la Ribera|42.3542|0.5503|102|Tor-la-ribera|Torlarribera|Tor-la-Ribera
22234|Torrente de Cinca|41.4667|0.3333|1037|Torrent de Cinca|Torrent d'a Cinca
22235|Torres de Alcanadre|41.9676|-0.1110|91|Torres d'Alcanadre
22236|Torres de Barbués|41.9614|-0.4308|271
22239|Tramaced|41.9739|-0.2958|108|Tramacet
22242|Valfarta|41.5589|-0.1319|54|Val Farta
22243|Valle de Bardají|42.4364|0.4658|52|La Vall de Bardaixí|Val de Bardaixí
22901|Valle de Hecho|42.7389|-0.7503|813|Val d'Echo|Echo Ibarra
22244|Valle de Lierp|42.3797|0.4764|52|la Vall de Lierp|Val de Lierp
22245|Velilla de Cinca|41.5868|0.2620|505|Vilella de Cinca|Viliella d'a Cinca
22909|Vencillón|41.7050|0.3219|402|Vensilló
22247|Viacamp y Litera|42.1283|0.6147|40|Viacamp i Lliterà
22248|Vicién|42.0564|-0.4408|149|Bizién
22249|Villanova|42.5478|0.4611|171|Vilanova d'Éssera|Vilanova
22250|Villanúa|42.6744|-0.5306|569|Villanuga
22251|Villanueva de Sigena|41.7153|-0.0089|340|Vilanova de Sixena|Villanueva de Sixena
22252|Yebra de Basa|42.4875|-0.2808|155
22253|Yésero|42.6189|-0.2500|60
22254|Zaidín|41.6000|0.2667|1807|Saidí
23001|Albanchez de Mágina|37.7920|-3.4679|903
23002|Alcalá la Real|37.4625|-3.9228|21496
23003|Alcaudete|37.5881|-4.0813|10129
23004|Aldeaquemada|38.4107|-3.3715|446
23005|Andújar|38.0392|-4.0506|35610|Andúchar
23006|Arjona|37.9350|-4.0569|5330
23007|Arjonilla|37.9742|-4.1074|3520
23008|Arquillos|38.1810|-3.4271|1682
23905|Arroyo del Ojanco|38.3208|-2.8947|2158
23009|Baeza|37.9833|-3.4667|15575
23010|Bailén|38.0968|-3.7766|17119
23011|Baños de la Encina|38.1667|-3.7667|2542
23012|Beas de Segura|38.2519|-2.8917|4983
23902|Bedmar y Garcíez|37.8323|-3.4235|2567|Bedmar eta Garcíez
23014|Begíjar|37.9853|-3.5342|2908
23015|Bélmez de la Moraleda|37.7232|-3.3829|1504
23016|Benatae|38.3529|-2.6518|423
23017|Cabra del Santo Cristo|37.7035|-3.2871|1639
23018|Cambil|37.6768|-3.5649|2654
23019|Campillo de Arenas|37.5553|-3.6355|1711
23020|Canena|38.0475|-3.4795|1717
23021|Carboneros|38.2304|-3.6310|624
23901|Cárcheles|37.6446|-3.6386|1291
23024|La Carolina|38.2742|-3.6153|14677
23025|Castellar|38.2517|-3.1315|3147
23026|Castillo de Locubín|37.5280|-3.9422|3805
23027|Cazalilla|37.9841|-3.8819|762
23028|Cazorla|37.9136|-3.0041|6930
23029|Chiclana de Segura|38.3122|-3.0424|859
23030|Chilluévar|38.0019|-3.0310|1309
23031|Escañuela|37.8790|-4.0337|902
23032|Espeluy|38.0323|-3.8624|596
23033|Frailes|37.4864|-3.8373|1565
23034|Fuensanta de Martos|37.6465|-3.9107|3030
23035|Fuerte del Rey|37.8746|-3.8843|1348
23037|Génave|38.4300|-2.7330|548
23038|La Guardia de Jaén|37.7419|-3.6925|5212
23039|Guarromán|38.1840|-3.6852|2703
23041|Higuera de Calatrava|37.7987|-4.1579|590
23042|Hinojares|37.7155|-2.9991|335
23043|Hornos|38.2167|-2.7192|561
23044|Huelma|37.6481|-3.4560|5485
23045|Huesa|37.7645|-3.0774|2411
23046|Ibros|38.0205|-3.5028|2773
23047|La Iruela|37.9204|-2.9941|1819
23048|Iznatoraf|38.1577|-3.0320|874
23049|Jabalquinto|38.0195|-3.7256|1939
23050|Jaén|37.7697|-3.7889|112235|Xaén|Chaén
23051|Jamilena|37.7466|-3.9110|3319
23052|Jimena|37.8418|-3.4797|1219
23053|Jódar|37.8407|-3.3549|11285
23040|Lahiguera|37.9710|-3.9915|1560
23054|Larva|37.7597|-3.2017|435
23055|Linares|38.1000|-3.6333|55633
23056|Lopera|37.9458|-4.2150|3502
23057|Lupión|38.0159|-3.5710|801
23058|Mancha Real|37.7864|-3.6124|11481
23059|Marmolejo|38.0797|-4.1647|6412
23060|Martos|37.7228|-3.9658|24462
23061|Mengíbar|37.9683|-3.8089|10250
23062|Montizón|38.3911|-3.1007|1574
23063|Navas de San Juan|38.1836|-3.3138|4345
23064|Noalejo|37.5294|-3.6536|1721
23065|Orcera|38.3178|-2.6612|1715
23066|Peal de Becerro|37.9121|-3.1241|5290
23067|Pegalajar|37.7380|-3.6509|2830
23069|Porcuna|37.8697|-4.1872|5936
23070|Pozo Alcón|37.7050|-2.9342|4514
23071|Puente de Génave|38.3546|-2.8032|2191
23072|La Puerta de Segura|38.3497|-2.7366|2223
23073|Quesada|37.8430|-3.0669|4901
23074|Rus|38.0477|-3.4618|3386
23075|Sabiote|38.0689|-3.3114|3742
23076|Santa Elena|38.3434|-3.5396|863
23077|Santiago de Calatrava|37.7531|-4.1695|660
23904|Santiago-Pontones|38.0988|-2.6566|2629
23079|Santisteban del Puerto|38.2490|-3.2050|4451
23080|Santo Tomé|38.0274|-3.0999|2029
23081|Segura de la Sierra|38.2982|-2.6521|1711
23082|Siles|38.3879|-2.5826|2067
23084|Sorihuela del Guadalimar|38.2400|-3.0543|1000
23085|Torreblascopedro|37.9974|-3.6363|2382
23086|Torredelcampo|37.8346|-3.9038|13888
23087|Torredonjimeno|37.7614|-3.9510|13213
23088|Torreperogil|38.0343|-3.2917|7107
23090|Torres|37.7861|-3.5100|1328|Cervo
23091|Torres de Albánchez|38.4150|-2.6772|735
23092|Úbeda|38.0117|-3.3717|33588
23093|Valdepeñas de Jaén|37.5906|-3.8197|3469
23094|Vilches|38.2108|-3.5131|4191
23095|Villacarrillo|38.1153|-3.0872|10342
23096|Villanueva de la Reina|38.0051|-3.9146|2941
23097|Villanueva del Arzobispo|38.1689|-3.0078|7703
23098|Villardompardo|37.8381|-4.0017|893
23099|Los Villares|37.6892|-3.8183|6111
23101|Villarrodrigo|38.4871|-2.6361|371
23903|Villatorres|37.9278|-3.6944|4259
24001|Acebedo|43.0392|-5.1161|181|Acebéu
24002|Algadefe|42.2186|-5.5831|312
24003|Alija del Infantado|42.1411|-5.8367|554|Alixa
24004|Almanza|42.6589|-5.0358|570
24005|La Antigua|42.1792|-5.6894|324|Antigua|L'Antigua
24006|Ardón|42.4372|-5.5625|533
24007|Arganza|42.6403|-6.6858|800
24008|Astorga|42.4575|-6.0569|10305|Estorga
24009|Balboa|42.7064|-6.9231|269|Valvoa|Valboa
24010|La Bañeza|42.2975|-5.9017|10195|Bañeza
24011|Barjas|42.6111|-6.9786|140|Barxas
24012|Los Barrios de Luna|42.8451|-5.8614|300|Barrios de Ḷḷuna
24014|Bembibre|42.6154|-6.4170|8041
24015|Benavides|42.5020|-5.8959|2321
24016|Benuza|42.3983|-6.7111|457
24017|Bercianos del Páramo|42.3806|-5.7033|513|Bercianos del Páramu
24018|Bercianos del Real Camino|42.3875|-5.1442|179
24019|Berlanga del Bierzo|42.7311|-6.6042|311
24020|Boca de Huérgano|42.9736|-4.9275|412
24021|Boñar|42.8667|-5.3228|1732|Boñare
24022|Borrenes|42.4914|-6.7261|297|Borrés
24023|Brazuelo|42.4972|-6.1569|304
24024|El Burgo Ranero|42.4228|-5.2214|697
24025|Burón|43.0233|-5.0511|282
24026|Bustillo del Páramo|42.4411|-5.7917|1057
24027|Cabañas Raras|42.6200|-6.6403|1286
24028|Cabreros del Río|42.4011|-5.5406|406
24029|Cabrillanes|42.9530|-6.1492|687|Cabrichanes
24030|Cacabelos|42.5997|-6.7256|4734
24031|Calzada del Coto|42.3875|-5.0806|217
24032|Campazas|42.1419|-5.4917|110
24033|Campo de Villavidel|42.4397|-5.5261|209
24034|Camponaraya|42.5806|-6.6703|4060|Camponaraia
24037|Cármenes|42.9589|-5.5744|356
24038|Carracedelo|42.5547|-6.7339|3423
24039|Carrizo|42.5850|-5.8314|2242
24040|Carrocera|42.7958|-5.7431|437
24041|Carucedo|42.4903|-6.7625|479
24042|Castilfalé|42.2194|-5.4222|58
24043|Castrillo de Cabrera|42.3403|-6.5442|100|Castriellu|Castriellu de Cabreira
24044|Castrillo de la Valduerna|42.3242|-6.1347|136
24046|Castrocalbón|42.1958|-5.9786|898
24047|Castrocontrigo|42.1828|-6.1883|623|Castrocontrigu
24049|Castropodame|42.5800|-6.4672|1570
24050|Castrotierra de Valmadrigal|42.3442|-5.2519|106
24051|Cea|42.4625|-5.0128|373
24052|Cebanico|42.7253|-5.0253|146
24053|Cebrones del Río|42.2578|-5.8250|439
24065|Chozas de Abajo|42.5072|-5.6864|2699
24054|Cimanes de la Vega|42.1172|-5.5994|431
24055|Cimanes del Tejar|42.6183|-5.8056|710
24056|Cistierna|42.8028|-5.1253|2857
24057|Congosto|42.6178|-6.5200|1418|Congostu
24058|Corbillos de los Oteros|42.4064|-5.4589|174
24059|Corullón|42.5781|-6.8192|789
24060|Crémenes|42.9028|-5.1431|497
24061|Cuadros|42.7103|-5.6389|2075
24062|Cubillas de los Oteros|42.3728|-5.5075|140
24063|Cubillas de Rueda|42.6553|-5.1742|376
24064|Cubillos del Sil|42.6236|-6.5636|1746|Cubiellos del Sil
24066|Destriana|42.3275|-6.0967|422
24067|Encinedo|42.2708|-6.5942|621|Encinéu
24068|La Ercina|42.8122|-5.2181|412|Ercina
24069|Escobar de Campos|42.3136|-4.9669|32
24070|Fabero|42.7631|-6.6281|3998|el Fabeiru|Fabeiro|El Fabeiru
24071|Folgoso de la Ribera|42.6433|-6.3192|973|Felgosu de la Ribera
24073|Fresno de la Vega|42.3453|-5.5336|483
24074|Fuentes de Carbajal|42.1772|-5.4464|71|Fontes de Carbayal
24076|Garrafe de Torío|42.7328|-5.5239|1649
24077|Gordaliza del Pino|42.3436|-5.1572|238
24078|Gordoncillo|42.1342|-5.4028|312
24079|Gradefes|42.6238|-5.2263|882
24080|Grajal de Campos|42.3203|-5.0206|200|Grayal de Campos
24081|Gusendos de los Oteros|42.3778|-5.4297|123
24082|Hospital de Órbigo|42.4611|-5.8842|948|Hospital d'Órbigu
24083|Igüeña|42.7289|-6.2764|1012
24084|Izagre|42.2242|-5.2572|133
24086|Joarilla de las Matas|42.2883|-5.1772|241
24087|Laguna Dalga|42.3319|-5.7503|608|Llaguna Dalga
24088|Laguna de Negrillos|42.2394|-5.6617|1056
24089|León|42.5989|-5.5669|123446|Lleó|Leyón|Lleón
24092|Llamas de la Ribera|42.6350|-5.8253|783
24090|Lucillo|42.4106|-6.3044|360
24091|Luyego|42.3764|-6.2361|537
24093|Magaz de Cepeda|42.5389|-6.0731|345
24094|Mansilla de las Mulas|42.4975|-5.4164|1706
24095|Mansilla Mayor|42.5089|-5.4419|316
24096|Maraña|43.0489|-5.1769|103
24097|Matadeón de los Oteros|42.3383|-5.3711|212
24098|Matallana de Torío|42.8661|-5.5200|1214|Matachana de Toríu
24099|Matanza|42.2403|-5.3761|157|Matancia
24100|Molinaseca|42.5381|-6.5197|870
24101|Murias de Paredes|42.8489|-6.1911|337
24102|Noceda del Bierzo|42.7103|-6.3978|603
24103|Oencia|42.5464|-6.9706|267
24104|Las Omañas|42.6831|-5.8694|267|Omañas
24105|Onzonilla|42.5247|-5.5833|1974
24106|Oseja de Sajambre|43.1381|-5.0367|214|Oseya de Sayambre
24107|Pajares de los Oteros|42.3297|-5.4725|245
24108|Palacios de la Valduerna|42.3278|-5.9383|341
24109|Palacios del Sil|42.8764|-6.4328|862
24110|Páramo del Sil|42.8200|-6.4881|1141|Páramu del Sil
24112|Peranzanes|42.8767|-6.6342|276|Peranzáis|Peranzais
24113|Pobladura de Pelayo García|42.3061|-5.6856|364
24114|La Pola de Gordón|42.8547|-5.6700|2833|Pola de Gordón
24115|Ponferrada|42.5461|-6.5908|63186
24116|Posada de Valdeón|43.1517|-4.9194|392|Valdión
24117|Pozuelo del Páramo|42.1703|-5.7686|374
24118|Prado de la Guzpeña|42.7836|-5.0264|108
24119|Priaranza del Bierzo|42.5106|-6.6681|672|Priaranza do Bierzo
24120|Prioro|42.8942|-4.9617|340|Prioru
24121|Puebla de Lillo|43.0064|-5.2758|641
24122|Puente de Domingo Flórez|42.4142|-6.8239|1348|A Ponte de Domingos Flórez|Ponte de Domingos Flórez|Ponte de Domingo Flórez
24123|Quintana del Castillo|42.6614|-6.0450|699|Quintana'l Castiellu
24124|Quintana del Marco|42.2061|-5.8511|299
24125|Quintana y Congosto|42.2558|-6.0372|402
24127|Regueras de Arriba|42.2928|-5.8603|263
24129|Reyero|42.9492|-5.1994|120
24130|Riaño|42.9747|-5.0119|476|Riañu
24131|Riego de la Vega|42.3892|-5.9822|697
24132|Riello|42.7728|-5.9447|570
24133|Rioseco de Tapia|42.7294|-5.7900|409
24134|La Robla|42.8014|-5.6289|3574|Robla
24136|Roperuelos del Páramo|42.2369|-5.7828|502
24137|Sabero|42.8361|-5.1503|1020
24139|Sahagún|42.3711|-5.0331|2380|Safagún
24141|San Adrián del Valle|42.1311|-5.7300|82
24142|San Andrés del Rabanedo|42.6111|-5.6194|29944
24144|San Cristóbal de la Polantera|42.3911|-5.9086|611
24145|San Emiliano|42.9717|-6.0006|585|Santu Michanu
24146|San Esteban de Nogales|42.1622|-5.9306|239
24148|San Justo de la Vega|42.4542|-6.0147|1750
24149|San Millán de los Caballeros|42.2858|-5.5622|191
24150|San Pedro Bercianos|42.3914|-5.7094|218
24143|Sancedo|42.6678|-6.6328|532|Sancéu
24151|Santa Colomba de Curueño|42.7505|-5.4126|502
24152|Santa Colomba de Somoza|42.4425|-6.2425|472
24153|Santa Cristina de Valmadrigal|42.3564|-5.3103|278
24154|Santa Elena de Jamuz|42.2600|-5.8867|1021
24155|Santa María de la Isla|42.3550|-5.9292|429
24158|Santa María de Ordás|42.7272|-5.8225|327
24156|Santa María del Monte de Cea|42.4917|-5.1175|207
24157|Santa María del Páramo|42.3533|-5.7492|2994
24159|Santa Marina del Rey|42.5133|-5.8583|1718
24160|Santas Martas|42.4325|-5.3719|763
24161|Santiago Millas|42.3822|-6.1056|350
24162|Santovenia de la Valdoncina|42.5431|-5.6217|2058
24163|Sariegos|42.6475|-5.6314|5456
24164|Sena de Luna|42.9297|-5.9519|373|Sena de Ḷḷuna
24165|Sobrado|42.5189|-6.8536|275
24166|Soto de la Vega|42.3311|-5.8825|1481
24167|Soto y Amío|42.7797|-5.8864|706|Soutu y Amíu
24168|Toral de los Guzmanes|42.2428|-5.5681|486
24206|Toral de los Vados|42.5428|-6.7761|1751|Toural dos Vaos|Toural dos Vados
24169|Toreno|42.7006|-6.5097|2833|Torenu
24170|Torre del Bierzo|42.5944|-6.3247|1929
24171|Trabadelo|42.6494|-6.8819|321
24172|Truchas|42.2608|-6.4350|371|Trueitas
24173|Turcia|42.5347|-5.8761|974
24174|Urdiales del Páramo|42.3703|-5.7731|445
24185|Val de San Lorenzo|42.4169|-6.1203|480
24175|Valdefresno|42.5936|-5.4919|2362
24176|Valdefuentes del Páramo|42.3233|-5.8300|304
24177|Valdelugueros|42.9736|-5.4128|484
24178|Valdemora|42.1947|-5.4272|58
24179|Valdepiélago|42.8686|-5.3981|306
24180|Valdepolo|42.5761|-5.2261|1177
24181|Valderas|42.0775|-5.4425|1479
24182|Valderrey|42.3947|-6.0186|424
24183|Valderrueda|42.8153|-4.9344|817
24184|Valdesamario|42.7214|-5.9519|167|Valdesamariu
24187|Valdevimbre|42.4206|-5.6222|892|Valdebimbre
24188|Valencia de Don Juan|42.2939|-5.5197|5103|Coyanza
24036|Valle de Ancares|42.8167|-6.7281|256|Candín|Ancares|Val de Ancares
24191|Vallecillo|42.3564|-5.2117|99
24189|Valverde de la Virgen|42.5686|-5.6836|7936
24190|Valverde-Enrique|42.3050|-5.2997|148
24193|La Vecilla|42.8487|-5.4057|383|Veciella
24196|Vega de Espinareda|42.7258|-6.6550|2006|A Veiga de Espiñareda
24197|Vega de Infanzones|42.4825|-5.5333|837
24198|Vega de Valcarce|42.6639|-6.9458|555|A Veiga do Valcarce|A Veiga de Valcarce
24194|Vegacervera|42.8861|-5.5347|246
24199|Vegaquemada|42.8183|-5.3328|418
24201|Vegas del Condado|42.6844|-5.3645|1165
24202|Villablino|42.9397|-6.3169|7585|Viḷḷablinu
24203|Villabraz|42.2458|-5.4469|82
24205|Villadangos del Páramo|42.5175|-5.7664|1268
24207|Villademor de la Vega|42.2703|-5.5689|289
24209|Villafranca del Bierzo|42.6060|-6.8107|2591|Vilafranca do Bierzo
24210|Villagatón|42.6347|-6.1619|611
24211|Villamandos|42.1797|-5.5906|272
24901|Villamanín|42.9383|-5.6556|863|Viḷḷamanín
24212|Villamañán|42.3217|-5.5822|1084
24213|Villamartín de Don Sancho|42.5683|-5.0583|130
24214|Villamejil|42.5622|-6.0231|653|Villamegil
24215|Villamol|42.4333|-5.0500|134
24216|Villamontán de la Valduerna|42.3097|-5.9958|678
24217|Villamoratiel de las Matas|42.3978|-5.3006|121
24218|Villanueva de las Manzanas|42.4706|-5.4794|484
24219|Villaobispo de Otero|42.4997|-6.0583|514
24902|Villaornate y Castro|42.1847|-5.5497|348
24221|Villaquejida|42.1450|-5.5975|763
24222|Villaquilambre|42.6461|-5.5586|18905
24223|Villarejo de Órbigo|42.4450|-5.9036|2856|Villareyu d'Órbigu
24224|Villares de Órbigo|42.4706|-5.9089|557|Villares d'Órbigu
24225|Villasabariego|42.5333|-5.4147|1155
24226|Villaselán|42.5608|-5.0478|180
24227|Villaturiel|42.5183|-5.4853|1812
24228|Villazala|42.3611|-5.8561|560
24229|Villazanzo de Valderaduey|42.5347|-4.9647|360
24230|Zotes del Páramo|42.2722|-5.7361|384
25001|Abella de la Conca|42.1616|1.0920|156
25002|Àger|41.9998|0.7628|637
25003|Agramunt|41.7863|1.0964|5653
25038|Aitona|41.4945|0.4594|2591
25004|Els Alamús|41.6178|0.7406|835|Alamús
25005|Alàs i Cerc|42.3536|1.5092|320|Alás Serch
25006|L'Albagés|41.4506|0.7403|339|Albagés
25007|Albatàrrec|41.5750|0.6064|2331
25008|Albesa|41.7539|0.6617|1584
25009|L'Albi|41.4250|0.9386|764|Albí
25010|Alcanó|41.4828|0.6189|244
25011|Alcarràs|41.5638|0.5241|10256
25012|Alcoletge|41.6474|0.6942|3640
25013|Alfarràs|41.8328|0.5722|2805
25014|Alfés|41.5225|0.6214|284
25015|Algerri|41.8175|0.6394|424
25016|Alguaire|41.7363|0.5838|3060
25017|Alins|42.5506|1.3197|269
25019|Almacelles|41.7317|0.4371|7018|Almacellas
25020|Almatret|41.3054|0.4227|292
25021|Almenar|41.7986|0.5689|3369
25022|Alòs de Balaguer|41.9136|0.9622|118
25023|Alpicat|41.6681|0.5561|6515
25024|Alt Àneu|42.6353|1.1111|453|Alto Aneu
25027|Anglesola|41.6590|1.0814|1389
25029|Arbeca|41.5417|0.9237|2163
25031|Arres|42.7569|0.7122|58
25032|Arsèguel|42.3502|1.5828|87|Arseguell
25033|Artesa de Lleida|41.5547|0.7039|1543|Artesa de Lérida
25034|Artesa de Segre|41.8954|1.0454|3559
25036|Aspa|41.4975|0.6733|233
25037|Les Avellanes i Santa Linya|41.9079|0.7639|434|Avellanes-Santa Liña
25039|Baix Pallars|42.3256|1.0656|345|Bajo Pallars
25040|Balaguer|41.7904|0.8056|17729
25041|Barbens|41.6797|1.0181|929
25042|La Baronia de Rialb|41.9279|1.1980|216
25044|Bassella|42.0058|1.2946|216|Basella
25045|Bausen|42.8367|0.7175|62
25046|Belianes|41.5625|1.0181|514
25170|Bellaguarda|41.3394|0.7369|278
25047|Bellcaire d'Urgell|41.7591|0.9051|1275
25048|Bell-lloc d'Urgell|41.6328|0.7814|2364|Bell Lloch
25049|Bellmunt d'Urgell|41.7758|0.9533|174|Bellmunt de Urgel
25050|Bellpuig|41.6267|1.0133|5510
25051|Bellver de Cerdanya|42.3708|1.7780|2289|Bellver de Cerdaña
25052|Bellvís|41.6956|0.8328|2249
25053|Benavent de Segrià|41.6975|0.6344|1571|Benavent de Lérida
25055|Biosca|41.8423|1.3589|185
25057|Es Bòrdes|42.7397|0.7208|281|Las Bordas
25058|Les Borges Blanques|41.5194|0.8683|6482
25059|Bossòst|42.7875|0.6936|1189|Bosost
25056|Bovera|41.3283|0.6400|244
25060|Cabanabona|41.8525|1.2161|70
25061|Cabó|42.2392|1.2470|85
25062|Camarasa|41.8761|0.8786|788
25063|Canejan|42.8403|0.7394|95
25904|Castell de Mur|42.0920|0.8771|159
25064|Castellar de la Ribera|42.0225|1.4158|131
25067|Castelldans|41.5003|0.7669|952
25068|Castellnou de Seana|41.6497|0.9717|726
25069|Castelló de Farfanya|41.8211|0.7292|548|Castellón de Farfaña
25070|Castellserà|41.7483|0.9892|993
25071|Cava|42.3250|1.6055|38
25072|Cervera|41.6657|1.2710|9603
25073|Cervià de les Garrigues|41.4269|0.8617|641
25074|Ciutadilla|41.5628|1.1414|186
25075|Clariana de Cardener|41.9341|1.6251|160
25076|El Cogul|41.4670|0.6897|163
25077|Coll de Nargó|42.1738|1.3162|585
25163|La Coma i la Pedra|42.1760|1.5906|277
25161|Conca de Dalt|42.2496|0.9685|438
25078|Corbins|41.6906|0.6931|1502
25079|Cubells|41.8536|0.9597|354
25081|L'Espluga Calba|41.4967|1.0058|324|Espluga Calva
25082|Espot|42.5786|1.0881|377
25088|Estamariu|42.3753|1.5239|135
25085|Estaràs|41.6917|1.3781|161
25086|Esterri d'Àneu|42.6300|1.1244|917|Esterri de Aneu
25087|Esterri de Cardós|42.5942|1.2631|63
25089|Farrera|42.5042|1.2724|118
25908|Fígols i Alinyà|42.2047|1.3417|234|Fígols y Aliñá
25092|La Floresta|41.5117|0.9208|159
25093|Fondarella|41.6364|0.8747|823
25094|Foradada|41.8789|1.0139|193
25096|La Fuliola|41.7153|1.0192|1262
25097|Fulleda|41.4650|1.0253|87
25098|Gavet de la Conca|42.1229|0.9211|252
25912|Gimenells i el Pla de la Font|41.6536|0.3908|1069
25099|Golmés|41.6358|0.9319|1909
25100|Gósol|42.2371|1.6598|205
25101|La Granadella|41.3569|0.6664|748
25102|La Granja d'Escarp|41.4189|0.3525|994
25103|Granyanella|41.6487|1.2230|154|Grañanella
25105|Granyena de les Garrigues|41.4350|0.6506|174|Grañena de las Garrigas
25104|Granyena de Segarra|41.6235|1.2468|149|Grañena
25109|Guimerà|41.5645|1.1854|250
25903|La Guingueta d'Àneu|42.5951|1.1313|278
25110|Guissona|41.7847|1.2880|7774|Guisona
25111|Guixers|42.1339|1.6678|125|Guixes
25115|Isona i Conca Dellà|42.1173|1.0443|1038|Isona y Conca Dellá
25112|Ivars de Noguera|41.8519|0.5878|317|Ibars de Noguera
25113|Ivars d'Urgell|41.6808|0.9859|1578|Ibars de Urgel
25114|Ivorra|41.7717|1.3954|100|Iborra
25910|Josa i Tuixén|42.2328|1.5683|110|Josá Tuixent
25118|Juncosa|41.3709|0.7753|377
25119|Juneda|41.5492|0.8251|3453
25121|Les|42.8103|0.7099|1036
25122|Linyola|41.7122|0.9056|2762|Liñola
25123|Lladorre|42.6213|1.2491|246
25124|Lladurs|42.0447|1.5086|186
25125|Llardecans|41.3761|0.5508|444
25126|Llavorsí|42.4957|1.2105|342
25120|Lleida|41.6167|0.6333|146266|Lérida|Leida
25127|Lles de Cerdanya|42.3903|1.6873|290
25128|Llimiana|42.0751|0.9160|130
25129|Llobera|41.9510|1.4725|201
25133|Maials|41.3658|0.5053|951|Mayals
25130|Maldà|41.5528|1.0394|239
25131|Massalcoreig|41.4611|0.3603|592|Masalcorreig
25132|Massoteres|41.7976|1.3107|227|Masoteras
25134|Menàrguens|41.7319|0.7453|798
25135|Miralcamp|41.6064|0.8814|1369
25137|Mollerussa|41.6317|0.8961|15763|Mollerusa
25136|La Molsosa|41.7857|1.5439|100|Molsosa
25139|Montellà i Martinet|42.3625|1.6964|598|Montellá Martinet
25140|Montferrer i Castellbò|42.3431|1.4292|1161|Montferrer Castellbó
25138|Montgai|41.8002|0.9613|640
25142|Montoliu de Lleida|41.5614|0.5908|488
25141|Montoliu de Segarra|41.5902|1.2698|180|Montolíu de Cervera
25143|Montornès de Segarra|41.6009|1.2307|87
25145|Nalec|41.5617|1.1164|91|Nalech
25025|Naut Aran|42.7092|0.9028|1902|Alto Arán
25146|Navès|41.9917|1.6350|292
25148|Odèn|42.1329|1.4550|231
25149|Oliana|42.0671|1.3142|1874
25150|Oliola|41.8775|1.1758|192
25151|Olius|41.9778|1.5549|990
25152|Les Oluges|41.6973|1.3192|167|Olujas
25153|Els Omellons|41.5036|0.9614|187
25154|Els Omells de na Gaia|41.5022|1.0769|126|Omélls de Nagaya
25155|Organyà|42.2128|1.3294|853|Orgañá
25156|Os de Balaguer|41.8717|0.7186|1088
25157|Ossó de Sió|41.7551|1.1592|198
25158|El Palau d'Anglesola|41.6525|0.8833|2232|Palau de Anglesola|Lo Palau d'Anglesola
25164|Penelles|41.7583|0.9651|431
25165|Peramola|42.0578|1.2674|339
25166|Pinell de Solsonès|41.9500|1.4182|198
25167|Pinós|41.8273|1.5419|274
25911|Els Plans de Sió|41.7615|1.1973|506
25168|El Poal|41.6808|0.8572|649|Poal|Lo Poal
25169|La Pobla de Cérvoles|41.3692|0.9164|208|Pobla de Ciérvoles
25171|La Pobla de Segur|42.2474|0.9673|3143|Puebla de Segur
25030|El Pont de Bar|42.3742|1.6061|162
25173|El Pont de Suert|42.4082|0.7417|2381
25172|Ponts|41.9160|1.1883|2653
25174|La Portella|41.7411|0.6417|731|Portella
25175|Prats i Sansor|42.3681|1.8406|252|Prats y Sampsor
25176|Preixana|41.6083|1.0403|401
25177|Preixens|41.7958|1.0519|399
25179|Prullans|42.3811|1.7372|270
25180|Puiggròs|41.5522|0.8900|269|Puig Gros
25181|Puigverd d'Agramunt|41.7797|1.1233|231|Puigvert de Agramunt
25182|Puigverd de Lleida|41.5456|0.7347|1409|Puigvert de Lérida
25183|Rialp|42.4458|1.1353|654|Rialb
25905|Ribera d'Ondara|41.6280|1.3419|437|Ribera del Ondara
25185|Ribera d'Urgellet|42.3144|1.3836|989|Ribera de Urgellet
25186|Riner|41.9414|1.5637|269
25913|Riu de Cerdanya|42.3475|1.8275|96
25189|Rosselló|41.6959|0.5960|3416|Roselló
25190|Salàs de Pallars|42.2129|0.9311|365
25191|Sanaüja|41.8762|1.3105|385|Sanahúja
25196|Sant Esteve de la Sarga|42.0796|0.7639|121
25192|Sant Guim de Freixenet|41.6556|1.4194|1235|San Guim de Freixanet
25197|Sant Guim de la Plana|41.7626|1.3237|190
25193|Sant Llorenç de Morunys|42.1372|1.5901|983|San Lorenzo de Morunys
25902|Sant Martí de Riucorb|41.5603|1.0553|668|Sant Martí de Río Corb
25194|Sant Ramon|41.7260|1.3629|483|San Ramón
25201|Sarroca de Bellera|42.3595|0.8812|111
25200|Sarroca de Lleida|41.4608|0.5628|383
25202|Senterada|42.3249|0.9377|160
25035|La Sentiu de Sió|41.8047|0.8785|448
25204|Seròs|41.4617|0.4119|1954
25203|La Seu d'Urgell|42.3578|1.4586|13009|Seo de Urgel|Seu d'Urchel
25205|Sidamon|41.6280|0.8324|760|Sidamunt
25206|El Soleràs|41.4130|0.6833|308|Solerás
25207|Solsona|41.9944|1.5178|9717
25208|Soriguera|42.3800|1.1622|446
25209|Sort|42.4101|1.1287|2236
25210|Soses|41.5350|0.4878|1892
25211|Sudanell|41.5583|0.5681|915
25212|Sunyer|41.5247|0.5936|310|Suñer
25215|Talarn|42.1858|0.9004|555
25216|Talavera|41.5820|1.3385|280
25217|Tàrrega|41.6464|1.1394|19057
25218|Tarrés|41.4247|1.0211|126
25219|Tarroja de Segarra|41.7305|1.2747|164
25220|Térmens|41.7194|0.7617|1350
25221|Tírvia|42.5169|1.2439|141
25222|Tiurana|41.9778|1.2558|69
25223|Torà|41.8129|1.4029|1190
25224|Els Torms|41.3958|0.7214|135|Torms
25225|Tornabous|41.7031|1.0556|832
25227|La Torre de Cabdella|42.4220|0.9825|758
25226|Torrebesses|41.4281|0.5950|278|Torrebeses
25228|Torrefarrera|41.6750|0.6081|4900
25907|Torrefeta i Florejacs|41.7541|1.2734|589|Torreflor
25230|Torregrossa|41.5817|0.8300|2248|Torregrosa
25231|Torrelameu|41.7067|0.7031|788
25232|Torres de Segre|41.5342|0.5143|2317
25233|Torre-serona|41.6742|0.6319|405
25234|Tremp|42.1667|0.8946|6123
25043|La Vall de Boí|42.5072|0.8017|1122|Valle de Bohí
25901|Vall de Cardós|42.5656|1.2267|388
25238|Vallbona de les Monges|41.5251|1.0887|223|Vallbona de las Monjas
25240|Vallfogona de Balaguer|41.7539|0.8156|2009
25906|Les Valls d'Aguilar|42.2958|1.3431|253|Valls d'Aguilar
25239|Les Valls de Valira|42.3791|1.4567|845
25909|La Vansa i Fórnols|42.2353|1.4833|187|La Vansa Fornols
25242|Verdú|41.6095|1.1409|876
25243|Vielha e Mijaran|42.7350|0.7953|5865|Viella y Medio Arán
25244|Vilagrassa|41.6503|1.1067|627|Vilagrasa
25245|Vilaller|42.4766|0.7174|496|Vidallé
25247|Vilamòs|42.7494|0.7275|174
25248|Vilanova de Bellpuig|41.6156|0.9650|1150
25254|Vilanova de la Barca|41.6911|0.7286|1163
25249|Vilanova de l'Aguda|41.9131|1.2539|192
25250|Vilanova de Meià|41.9953|1.0228|479
25251|Vilanova de Segrià|41.7139|0.6197|1094
25252|Vila-sana|41.6642|0.9300|753|Vilasana
25253|El Vilosell|41.3839|0.9467|177
25255|Vinaixa|41.4303|0.9761|437
26001|Ábalos|42.5717|-2.7103|256
26002|Agoncillo|42.4464|-2.2906|1464|Agonciello
26003|Aguilar del Río Alhama|41.9617|-1.9944|421
26004|Ajamil de Cameros|42.1669|-2.4872|79
26005|Albelda de Iregua|42.3575|-2.4728|3930
26006|Alberite|42.4058|-2.4403|2743|Alberit
26007|Alcanadre|42.4056|-2.1183|685
26008|Aldeanueva de Ebro|42.2297|-1.8878|2753
26009|Alesanco|42.4142|-2.8167|486
26010|Alesón|42.4047|-2.6900|92
26011|Alfaro|42.1783|-1.7475|9923
26012|Almarza de Cameros|42.2161|-2.5981|41
26013|Anguciana|42.5753|-2.9025|450
26014|Anguiano|42.2611|-2.7639|488
26015|Arenzana de Abajo|42.3864|-2.7189|257
26016|Arenzana de Arriba|42.3875|-2.6939|37
26017|Arnedillo|42.2119|-2.2358|433|Arnediello
26018|Arnedo|42.2278|-2.1000|15140
26019|Arrúbal|42.4353|-2.2511|566
26020|Ausejo|42.3453|-2.1694|774
26021|Autol|42.2139|-2.0069|4958
26022|Azofra|42.4239|-2.8008|188
26023|Badarán|42.3669|-2.8075|474
26024|Bañares|42.4694|-2.9103|198
26026|Baños de Río Tobía|42.3350|-2.7608|1589
26025|Baños de Rioja|42.5119|-2.9450|86
26027|Berceo|42.3381|-2.8519|143
26028|Bergasa|42.2525|-2.1306|172
26029|Bergasillas Bajera|42.2447|-2.1586|31
26030|Bezares|42.3703|-2.6708|19
26031|Bobadilla|42.3175|-2.7592|103
26032|Brieva de Cameros|42.1647|-2.7947|38
26033|Briñas|42.6011|-2.8314|191
26034|Briones|42.5442|-2.7850|752
26035|Cabezón de Cameros|42.1967|-2.5189|23
26036|Calahorra|42.3033|-1.9647|25367|Calagorra
26037|Camprovín|42.3539|-2.7225|158
26038|Canales de la Sierra|42.1411|-3.0242|84
26039|Canillas de Río Tuerto|42.3983|-2.8403|43
26040|Cañas|42.3917|-2.8464|95
26041|Cárdenas|42.3742|-2.7672|132
26042|Casalarreina|42.5475|-2.9125|1094|Nafarruri
26043|Castañares de Rioja|42.5117|-2.9317|440
26044|Castroviejo|42.3297|-2.6617|57|Castroviello
26045|Cellorigo|42.6272|-2.9994|15
26046|Cenicero|42.4811|-2.6414|2173
26047|Cervera del Río Alhama|42.0069|-1.9519|2237
26048|Cidamón|42.4942|-2.8792|18
26049|Cihuri|42.5644|-2.9219|205|Zihuri
26050|Cirueña|42.4111|-2.8958|194
26051|Clavijo|42.3494|-2.4261|294|Clavillo
26052|Cordovín|42.3847|-2.8142|154
26053|Corera|42.3428|-2.2192|281
26054|Cornago|42.0656|-2.0944|298
26055|Corporales|42.4325|-2.9950|40
26056|Cuzcurrita de Río Tirón|42.5414|-2.9628|565
26057|Daroca de Rioja|42.3717|-2.5811|63|Daroca de Riocha
26058|Enciso|42.1489|-2.2692|167
26059|Entrena|42.3833|-2.5333|1660
26060|Estollo|42.3292|-2.8503|90
26061|Ezcaray|42.3267|-3.0133|2067|Ezkarai
26062|Foncea|42.6153|-3.0378|86
26063|Fonzaleche|42.5811|-3.0117|138
26064|Fuenmayor|42.4667|-2.5600|3281
26065|Galbárruli|42.6225|-2.9611|70
26066|Galilea|42.3481|-2.2358|419
26067|Gallinero de Cameros|42.1722|-2.6178|16
26068|Gimileo|42.5492|-2.8225|122
26069|Grañón|42.4503|-3.0264|209
26070|Grávalos|42.1081|-2.0008|196
26071|Haro|42.5769|-2.8461|12167
26072|Herce|42.2142|-2.1647|340
26073|Herramélluri|42.5019|-3.0197|111
26074|Hervías|42.4478|-2.8872|138
26075|Hormilla|42.4378|-2.7742|442
26076|Hormilleja|42.4556|-2.7308|153
26077|Hornillos de Cameros|42.2100|-2.4194|14
26078|Hornos de Moncalvillo|42.3917|-2.5850|92|Fornos|Fornos de Moncalvillo
26079|Huércanos|42.4286|-2.6942|856
26080|Igea|42.0706|-2.0100|638
26081|Jalón de Cameros|42.2181|-2.4883|23
26082|Laguna de Cameros|42.1750|-2.5425|109
26083|Lagunilla del Jubera|42.3336|-2.3206|385|Lacuniella de Chubera
26084|Lardero|42.4261|-2.4614|12060
26086|Ledesma de la Cogolla|42.3197|-2.7181|16
26087|Leiva|42.5036|-3.0464|235
26088|Leza de Río Leza|42.3292|-2.4058|40
26089|Logroño|42.4700|-2.4456|152150|Logronyo
26091|Lumbreras de Cameros|42.1050|-2.6239|144
26092|Manjarrés|42.3758|-2.6750|97
26093|Mansilla de la Sierra|42.1533|-2.9450|57
26094|Manzanares de Rioja|42.3961|-2.8950|68
26095|Matute|42.2986|-2.7951|88|Matut
26096|Medrano|42.3825|-2.5539|350
26098|Munilla|42.1886|-2.2953|93|Muniella
26099|Murillo de Río Leza|42.4028|-2.3244|1656|Muriello de Río Leza
26100|Muro de Aguas|42.1342|-2.1106|57
26101|Muro en Cameros|42.2247|-2.5294|40|Muriu en Cameros
26102|Nájera|42.4158|-2.7342|8336|Naiara|Nachera
26103|Nalda|42.3339|-2.4869|1307
26104|Navajún|41.9639|-2.0986|8
26105|Navarrete|42.4292|-2.5611|3061|Navarret
26106|Nestares|42.2694|-2.6192|85
26107|Nieva de Cameros|42.2178|-2.6667|87
26109|Ochánduri|42.5249|-3.0030|78|Otxanduri
26108|Ocón|42.2975|-2.2450|312
26110|Ojacastro|42.3464|-3.0050|199
26111|Ollauri|42.5419|-2.8331|319
26112|Ortigosa de Cameros|42.1758|-2.7050|214
26113|Pazuengos|42.3183|-2.9256|24
26114|Pedroso|42.3003|-2.7186|89
26115|Pinillos|42.1994|-2.5958|18
26117|Pradejón|42.3344|-2.0681|3742
26118|Pradillo|42.1769|-2.6403|64
26119|Préjano|42.1861|-2.1800|206|Preixano
26120|Quel|42.2289|-2.0497|2128
26121|Rabanera|42.1894|-2.4867|29
26122|El Rasillo de Cameros|42.1944|-2.6981|149
26123|El Redal|42.3378|-2.2014|138
26124|Ribafrecha|42.3547|-2.3869|1076|Ribafreta
26125|Rincón de Soto|42.2344|-1.8508|4041
26126|Robres del Castillo|42.2736|-2.2917|21
26127|Rodezno|42.5236|-2.8444|230
26128|Sajazarra|42.5883|-2.9614|123
26129|San Asensio|42.4975|-2.7489|1088
26130|San Millán de la Cogolla|42.3292|-2.8622|214|Donemiliaga Kukula
26131|San Millán de Yécora|42.5464|-3.0967|35
26132|San Román de Cameros|42.2322|-2.4739|127
26139|San Torcuato|42.4819|-2.8900|62
26142|San Vicente de la Sonsierra|42.5622|-2.7592|1054
26134|Santa Coloma|42.3669|-2.6556|104
26135|Santa Engracia del Jubera|42.3147|-2.3061|188
26136|Santa Eulalia Bajera|42.2097|-2.1906|112
26138|Santo Domingo de la Calzada|42.4419|-2.9525|6441
26140|Santurde de Rioja|42.3896|-2.9797|260
26141|Santurdejo|42.3781|-2.9547|95
26143|Sojuela|42.3700|-2.5450|690
26144|Sorzano|42.3425|-2.5281|233
26145|Sotés|42.4003|-2.6008|261
26146|Soto en Cameros|42.2861|-2.4250|82
26147|Terroba|42.2583|-2.4439|31
26148|Tirgo|42.5456|-2.9486|167
26149|Tobía|42.2981|-2.8153|41
26150|Tormantos|42.4942|-3.0739|124
26153|Torre en Cameros|42.2414|-2.5181|8
26151|Torrecilla en Cameros|42.2561|-2.6303|474|Torreciella en Cameros
26152|Torrecilla sobre Alesanco|42.4081|-2.8344|58
26154|Torremontalbo|42.5003|-2.6850|7
26155|Treviana|42.5575|-3.0511|142
26157|Tricio|42.4011|-2.7189|376
26158|Tudelilla|42.2994|-2.1161|360|Tudeliella
26160|Uruñuela|42.4422|-2.7072|1007
26161|Valdemadera|41.9839|-2.0739|15
26162|Valgañón|42.3175|-3.0672|133
26163|Ventosa|42.4039|-2.6264|196
26164|Ventrosa|42.1567|-2.8508|48
26165|Viguera|42.3081|-2.5336|377
26166|Villalba de Rioja|42.6089|-2.8878|155
26167|Villalobar de Rioja|42.4919|-2.9619|84
26168|Villamediana de Iregua|42.4264|-2.4181|9263
26169|Villanueva de Cameros|42.1678|-2.6500|68
26170|El Villar de Arnedo|42.3206|-2.0953|645
26171|Villar de Torre|42.3706|-2.8656|143
26172|Villarejo|42.3728|-2.8875|30
26173|Villarroya|42.1319|-2.0669|9
26174|Villarta-Quintana|42.4297|-3.0492|129
26175|Villavelayo|42.1306|-2.9844|43
26176|Villaverde de Rioja|42.3200|-2.8139|65
26177|Villoslada de Cameros|42.1139|-2.6733|351
26178|Viniegra de Abajo|42.1517|-2.8881|81
26179|Viniegra de Arriba|42.0953|-2.8342|40
26180|Zarratón|42.5156|-2.8822|254
26181|Zarzosa|42.1814|-2.3419|14
26183|Zorraquín|42.3258|-3.0392|88
27001|Abadín|43.3636|-7.4750|2239
27002|Alfoz|43.5283|-7.4139|1493
27003|Antas de Ulla|42.7823|-7.8897|1822
27004|Baleira|43.0017|-7.2392|1093
27901|Baralla|42.8936|-7.2501|2396
27005|Barreiros|43.5344|-7.2397|3036
27006|Becerreá|42.8511|-7.1731|2836
27007|Begonte|43.1344|-7.6897|2886
27008|Bóveda|42.6241|-7.4847|1369
27902|Burela|43.6605|-7.3582|9630
27009|Carballedo|42.5307|-7.8055|1987
27010|Castro de Rei|43.2081|-7.3986|5001|Castro de Rey
27011|Castroverde|43.0306|-7.3250|2478
27012|Cervantes|42.8678|-7.0731|1142
27013|Cervo|43.6697|-7.4095|4137
27016|Chantada|42.6083|-7.7689|8171
27014|O Corgo|42.9428|-7.4298|3366|Corgo
27015|Cospeito|43.2361|-7.5583|4172
27017|Folgoso do Courel|42.5889|-7.1953|921|Folgoso de Caurel
27018|A Fonsagrada|43.1333|-7.0667|3073|Fonsagrada
27019|Foz|43.5689|-7.2550|10329
27020|Friol|43.0289|-7.7908|3608
27022|Guitiriz|43.1819|-7.8953|5180
27023|Guntín|42.9007|-7.6583|2501
27024|O Incio|42.6567|-7.3636|1513|Incio
27026|Láncara|42.8637|-7.3373|2489
27027|Lourenzá|43.4711|-7.2994|2083|Lorenzana
27028|Lugo|43.0117|-7.5572|100143
27029|Meira|43.2133|-7.2942|1773
27030|Mondoñedo|43.4281|-7.3628|3303
27031|Monforte de Lemos|42.5164|-7.5161|18933
27032|Monterroso|42.7925|-7.8361|3744
27033|Muras|43.4678|-7.7231|577
27034|Navia de Suarna|42.9650|-7.0039|971
27035|Negueira de Muñiz|43.1317|-6.8909|236
27037|As Nogais|42.8178|-7.0897|914|Los Nogales
27038|Ourol|43.5619|-7.6420|965|Orol
27039|Outeiro de Rei|43.1025|-7.6136|5420|Otero de Rey
27040|Palas de Rei|42.8736|-7.8694|3227|Palas de Rey
27041|Pantón|42.5088|-7.6425|2350
27042|Paradela|42.7640|-7.5674|1557
27043|O Páramo|42.8276|-7.5149|1265|Páramo
27044|A Pastoriza|43.3004|-7.3512|2794|Pastoriza
27045|Pedrafita do Cebreiro|42.7266|-7.0217|868|Piedrafita
27047|A Pobra do Brollón|42.5571|-7.3919|1610|Puebla del Brollón
27046|Pol|43.1297|-7.3600|1550
27048|A Pontenova|43.3481|-7.1925|2106|Puente Nuevo
27049|Portomarín|42.8072|-7.6158|1277|Puertomarín
27050|Quiroga|42.4758|-7.2717|3040
27056|Rábade|43.1220|-7.6230|1514
27051|Ribadeo|43.5372|-7.0431|10022
27052|Ribas de Sil|42.4294|-7.2646|894|Ribas del Sil
27053|Ribeira de Piquín|43.1986|-7.2003|549|Ribera de Piquín|A Ribeira de Piquín
27054|Riotorto|43.3256|-7.2733|1182
27055|Samos|42.7307|-7.3266|1158
27057|Sarria|42.7778|-7.4144|13726
27058|O Saviñao|42.6449|-7.6395|3470|Saviñao
27059|Sober|42.4618|-7.5870|2090
27060|Taboada|42.7157|-7.7629|2617
27061|Trabada|43.4472|-7.1943|1070
27062|Triacastela|42.7563|-7.2397|589
27063|O Valadouro|43.5345|-7.4843|1845|Valle de Oro
27064|O Vicedo|43.7325|-7.6734|1553|Vicedo
27065|Vilalba|43.2963|-7.6786|13852|Villalba
27066|Viveiro|43.6481|-7.5900|15120|Vivero
27021|Xermade|43.3551|-7.8122|1665|Germade
27025|Xove|43.6858|-7.5089|3269
28001|La Acebeda|41.0831|-3.6167|70
28002|Ajalvir|40.5342|-3.4808|4868
28003|Alameda del Valle|40.9219|-3.8458|267
28004|El Álamo|40.2317|-3.9886|10594
28005|Alcalá de Henares|40.4818|-3.3643|203208
28006|Alcobendas|40.5333|-3.6333|123342
28007|Alcorcón|40.3493|-3.8284|175719
28008|Aldea del Fresno|40.3239|-4.2031|3503
28009|Algete|40.5978|-3.5003|21144
28010|Alpedrete|40.6583|-4.0322|15686
28011|Ambite|40.3264|-3.1831|732
28012|Anchuelo|40.4658|-3.2692|1414
28013|Aranjuez|40.0333|-3.6028|63040
28014|Arganda del Rey|40.2994|-3.4408|60419
28015|Arroyomolinos|40.2692|-3.9200|38075
28016|El Atazar|40.9344|-3.4719|110
28017|Batres|40.2094|-3.9225|1976
28018|Becerril de la Sierra|40.7075|-3.9928|6737
28019|Belmonte de Tajo|40.1325|-3.3397|1955
28021|El Berrueco|40.8881|-3.5606|795
28020|Berzosa del Lozoya|40.9753|-3.5244|242
28022|Boadilla del Monte|40.4069|-3.8750|66349
28023|El Boalo|40.7189|-3.9206|8770
28024|Braojos|41.0400|-3.6431|233
28025|Brea de Tajo|40.2292|-3.1111|577
28026|Brunete|40.4000|-3.9936|11287
28027|Buitrago del Lozoya|40.9919|-3.6389|2034
28028|Bustarviejo|40.8589|-3.7100|2870
28029|Cabanillas de la Sierra|40.8214|-3.6258|961
28030|La Cabrera|40.8639|-3.6133|2889
28031|Cadalso de los Vidrios|40.3003|-4.4433|3372
28032|Camarma de Esteruelas|40.5489|-3.3786|8331
28033|Campo Real|40.3382|-3.3814|6974
28034|Canencia|40.9094|-3.7375|475
28035|Carabaña|40.2569|-3.2344|2451
28036|Casarrubuelos|40.1711|-3.8331|4323
28037|Cenicientos|40.2656|-4.4683|2152
28038|Cercedilla|40.7375|-4.0631|7772
28039|Cervera de Buitrago|40.9206|-3.5306|165
28051|Chapinería|40.3817|-4.2097|2705
28052|Chinchón|40.1394|-3.4264|5800
28040|Ciempozuelos|40.1592|-3.6181|26350
28041|Cobeña|40.5669|-3.5069|7670
28046|Collado Mediano|40.6939|-4.0233|7722
28047|Collado Villalba|40.6453|-3.9914|67274
28043|Colmenar de Oreja|40.1092|-3.3869|9127
28042|Colmenar del Arroyo|40.4206|-4.1983|2044
28045|Colmenar Viejo|40.6588|-3.7663|58730
28044|Colmenarejo|40.5597|-4.0117|9640
28048|Corpa|40.4256|-3.2597|832
28049|Coslada|40.4261|-3.5650|80512
28050|Cubas de la Sagra|40.1922|-3.8392|7238
28053|Daganzo de Arriba|40.5433|-3.4572|10764
28054|El Escorial|40.5816|-4.1251|17171|O Escorial
28055|Estremera|40.1878|-3.1100|1473
28056|Fresnedillas de la Oliva|40.4881|-4.1697|1883
28057|Fresno de Torote|40.5922|-3.4128|2561
28058|Fuenlabrada|40.2833|-3.8000|190076
28059|Fuente el Saz de Jarama|40.6325|-3.5111|7413
28060|Fuentidueña de Tajo|40.1181|-3.1603|2372
28061|Galapagar|40.5764|-4.0019|36758
28062|Garganta de los Montes|40.9217|-3.6867|441
28063|Gargantilla del Lozoya y Pinilla de Buitrago|40.9656|-3.7169|396
28064|Gascones|41.0175|-3.6422|252
28065|Getafe|40.3000|-3.7167|193238|Xetafe
28066|Griñón|40.2144|-3.8583|10799
28067|Guadalix de la Sierra|40.7850|-3.6950|6993
28068|Guadarrama|40.6728|-4.0889|17547
28069|La Hiruela|41.0786|-3.4544|88
28070|Horcajo de la Sierra-Aoslos|41.0681|-3.5858|219
28071|Horcajuelo de la Sierra|41.0600|-3.5453|104
28072|Hoyo de Manzanares|40.6216|-3.9091|9310
28073|Humanes de Madrid|40.2539|-3.8278|20500
28074|Leganés|40.3282|-3.7654|195734
28075|Loeches|40.3847|-3.4117|9261
28076|Lozoya|40.9558|-3.7967|598
28901|Lozoyuela-Navas-Sieteiglesias|40.9286|-3.6206|1468
28078|Madarcos|41.0472|-3.5819|69
28079|Madrid|40.4169|-3.7033|3506730|Madril|Madrit
28080|Majadahonda|40.4728|-3.8722|73625
28082|Manzanares el Real|40.7272|-3.8611|9648
28083|Meco|40.5539|-3.3261|15922
28084|Mejorada del Campo|40.3967|-3.4842|25049
28085|Miraflores de la Sierra|40.8114|-3.7686|7350
28086|El Molar|40.7350|-3.5814|9999
28087|Los Molinos|40.7111|-4.0744|4781
28088|Montejo de la Sierra|41.0592|-3.5300|404
28089|Moraleja de Enmedio|40.2606|-3.8522|5580
28090|Moralzarzal|40.6750|-3.9694|14772
28091|Morata de Tajuña|40.2294|-3.4364|8397
28092|Móstoles|40.3333|-3.8667|214817
28093|Navacerrada|40.7300|-4.0153|3311
28094|Navalafuente|40.8231|-3.6731|1693
28095|Navalagamella|40.4683|-4.1239|3169
28096|Navalcarnero|40.2847|-4.0136|33331
28097|Navarredonda y San Mamés|40.9927|-3.7088|163
28099|Navas del Rey|40.3861|-4.2514|3420
28100|Nuevo Baztán|40.3647|-3.2433|7429
28101|Olmeda de las Fuentes|40.3689|-3.2206|429
28102|Orusco de Tajuña|40.2847|-3.2108|1531
28104|Paracuellos de Jarama|40.5047|-3.5300|27650
28106|Parla|40.2372|-3.7742|137471
28107|Patones|40.8547|-3.4853|617
28108|Pedrezuela|40.7439|-3.6008|6606
28109|Pelayos de la Presa|40.3606|-4.3303|3195
28110|Perales de Tajuña|40.2336|-3.3522|3260
28111|Pezuela de las Torres|40.4194|-3.1786|1008
28112|Pinilla del Valle|40.9281|-3.8244|200
28113|Pinto|40.2411|-3.6994|56651
28114|Piñuécar-Gandullas|41.0331|-3.5978|183
28115|Pozuelo de Alarcón|40.4408|-3.8147|89770
28116|Pozuelo del Rey|40.3653|-3.3208|1302
28117|Prádena del Rincón|41.0439|-3.5400|146
28118|Puebla de la Sierra|41.0125|-3.4447|98
28902|Puentes Viejas|40.9650|-3.5842|759
28119|Quijorna|40.4264|-4.0561|4044
28120|Rascafría|40.9047|-3.8794|1704
28121|Redueña|40.8164|-3.6036|288
28122|Ribatejada|40.6706|-3.3889|905
28123|Rivas-Vaciamadrid|40.3394|-3.5181|103148
28124|Robledillo de la Jara|40.9525|-3.5256|118
28125|Robledo de Chavela|40.4983|-4.2389|4818
28126|Robregordo|41.1044|-3.5950|79
28127|Las Rozas de Madrid|40.4917|-3.8733|99037
28128|Rozas de Puerto Real|40.3092|-4.4914|579
28129|San Agustín del Guadalix|40.6781|-3.6150|13825
28130|San Fernando de Henares|40.4256|-3.5353|39059
28131|San Lorenzo de El Escorial|40.5936|-4.1428|18872
28132|San Martín de la Vega|40.2094|-3.5722|21010
28133|San Martín de Valdeiglesias|40.3625|-4.4081|9324
28134|San Sebastián de los Reyes|40.5469|-3.6258|96992
28135|Santa María de la Alameda|40.5983|-4.2589|1584
28136|Santorcaz|40.4747|-3.2300|1011
28137|Los Santos de la Humosa|40.5017|-3.2561|2867
28138|La Serna del Monte|41.0314|-3.6247|110
28140|Serranillos del Valle|40.2053|-3.8861|4670
28141|Sevilla la Nueva|40.3475|-4.0286|9802
28143|Somosierra|41.1325|-3.5817|93
28144|Soto del Real|40.7542|-3.7833|9400
28145|Talamanca de Jarama|40.7444|-3.5081|4607
28146|Tielmes|40.2447|-3.3142|2964
28147|Titulcia|40.1367|-3.5700|1389
28148|Torrejón de Ardoz|40.4500|-3.4831|143526
28149|Torrejón de la Calzada|40.2014|-3.8011|10653
28150|Torrejón de Velasco|40.1875|-3.7789|4900
28151|Torrelaguna|40.8261|-3.5389|5081
28152|Torrelodones|40.5764|-3.9300|25433
28153|Torremocha de Jarama|40.8344|-3.4969|1157
28154|Torres de la Alameda|40.4047|-3.3600|7824
28903|Tres Cantos|40.6066|-3.7065|54592
28155|Valdaracete|40.2111|-3.1944|658
28156|Valdeavero|40.6317|-3.3331|1896
28157|Valdelaguna|40.1617|-3.3681|1122
28158|Valdemanco|40.8725|-3.6631|1097
28159|Valdemaqueda|40.5114|-4.2958|870
28160|Valdemorillo|40.5022|-4.0658|14420
28161|Valdemoro|40.1908|-3.6742|85972
28162|Valdeolmos-Alalpardo|40.6373|-3.4586|4626
28163|Valdepiélagos|40.7606|-3.4644|612
28164|Valdetorres de Jarama|40.6953|-3.5136|5175
28165|Valdilecha|40.2956|-3.3039|3289
28166|Valverde de Alcalá|40.4167|-3.3000|565
28167|Velilla de San Antonio|40.3669|-3.4881|14468
28168|El Vellón|40.7661|-3.5819|2281
28169|Venturada|40.7988|-3.6218|2622
28171|Villa del Prado|40.2765|-4.3048|7743
28170|Villaconejos|40.1042|-3.4850|3569
28172|Villalbilla|40.4322|-3.3011|18687
28173|Villamanrique de Tajo|40.0681|-3.2406|859
28174|Villamanta|40.2997|-4.1100|2899
28175|Villamantilla|40.3381|-4.1306|1660
28176|Villanueva de la Cañada|40.4467|-4.0050|24028
28178|Villanueva de Perales|40.3458|-4.1017|1715
28177|Villanueva del Pardillo|40.4903|-3.9639|18466
28179|Villar del Olmo|40.3367|-3.2356|2341
28180|Villarejo de Salvanés|40.1689|-3.2761|8042
28181|Villaviciosa de Odón|40.3583|-3.9033|30127
28182|Villavieja del Lozoya|41.0058|-3.6711|332
28183|Zarzalejo|40.5483|-4.1826|1946
29001|Alameda|37.2085|-4.6606|5426
29002|Alcaucín|36.9030|-4.1189|2671
29003|Alfarnate|36.9943|-4.2604|1034
29004|Alfarnatejo|36.9791|-4.2726|358
29005|Algarrobo|36.7726|-4.0371|7103
29006|Algatocín|36.5727|-5.2755|816
29007|Alhaurín de la Torre|36.6618|-4.5650|45066
29008|Alhaurín el Grande|36.6331|-4.6831|27552
29009|Almáchar|36.8092|-4.2159|1959
29010|Almargen|37.0021|-5.0211|1876
29011|Almogía|36.8268|-4.5367|4269
29012|Álora|36.8232|-4.7020|13650
29013|Alozaina|36.7258|-4.8581|2127
29014|Alpandeire|36.6343|-5.2029|242
29015|Antequera|37.0184|-4.5597|41849
29016|Árchez|36.8388|-3.9905|441
29017|Archidona|37.0954|-4.3906|8105
29018|Ardales|36.8778|-4.8447|2524
29019|Arenas|36.8154|-4.0442|1291
29020|Arriate|36.7991|-5.1407|4049
29021|Atajate|36.6401|-5.2455|168
29022|Benadalid|36.6063|-5.2691|226
29023|Benahavís|36.5223|-5.0441|9472
29024|Benalauría|36.5937|-5.2612|460
29025|Benalmádena|36.5969|-4.5535|78338
29026|Benamargosa|36.8353|-4.1936|1560
29027|Benamocarra|36.7909|-4.1610|3200
29028|Benaoján|36.7196|-5.2517|1427
29029|Benarrabá|36.5508|-5.2757|457
29030|El Borge|36.8146|-4.2353|958
29031|El Burgo|36.7897|-4.9478|1761
29032|Campillos|37.0476|-4.8626|8561
29033|Canillas de Aceituno|36.8726|-4.0819|1801
29034|Canillas de Albaida|36.8500|-3.9831|807
29035|Cañete la Real|36.9535|-5.0254|1569
29036|Carratraca|36.8515|-4.8191|801
29037|Cartajima|36.6445|-5.1506|234
29038|Cártama|36.7113|-4.6306|29333
29039|Casabermeja|36.8785|-4.4349|4214
29040|Casarabonela|36.7847|-4.8333|2800
29041|Casares|36.4444|-5.2728|9009
29042|Coín|36.6589|-4.7570|26574
29043|Colmenar|36.9052|-4.3363|3626
29044|Comares|36.8494|-4.2482|1354
29045|Cómpeta|36.8329|-3.9747|3824
29046|Cortes de la Frontera|36.6169|-5.3428|3048
29047|Cuevas Bajas|37.2336|-4.4853|1341
29049|Cuevas de San Marcos|37.2669|-4.4176|3647
29048|Cuevas del Becerro|36.8759|-5.0441|1617
29050|Cútar|36.8312|-4.2279|603
29051|Estepona|36.4244|-5.1494|79621
29052|Faraján|36.6165|-5.1889|285
29053|Frigiliana|36.7909|-3.8953|3383
29054|Fuengirola|36.5417|-4.6250|85211
29055|Fuente de Piedra|37.1353|-4.7276|3045
29056|Gaucín|36.5192|-5.3178|1620
29057|Genalguacil|36.5465|-5.2334|352
29058|Guaro|36.6589|-4.8369|2638
29059|Humilladero|37.1146|-4.7028|3373
29060|Igualeja|36.6315|-5.1212|733
29061|Istán|36.5824|-4.9477|1707
29062|Iznate|36.7758|-4.1851|940
29063|Jimera de Líbar|36.6507|-5.2749|399
29064|Jubrique|36.5643|-5.2146|585
29065|Júzcar|36.6254|-5.1702|208
29066|Macharaviaya|36.7619|-4.2142|518
29067|Málaga|36.7167|-4.4167|599063
29068|Manilva|36.3764|-5.2504|18165
29069|Marbella|36.5114|-4.8834|159786
29070|Mijas|36.5956|-4.6372|95104
29071|Moclinejo|36.7716|-4.2554|1222
29072|Mollina|37.1231|-4.6560|5528
29073|Monda|36.6303|-4.8277|2984
29903|Montecorto|36.8153|-5.2967|585
29074|Montejaque|36.7374|-5.2500|945
29075|Nerja|36.7469|-3.8790|22132
29076|Ojén|36.5651|-4.8524|4755
29077|Parauta|36.6563|-5.1295|271
29079|Periana|36.9286|-4.1909|3367
29080|Pizarra|36.7657|-4.7085|10334
29081|Pujerra|36.6133|-5.1497|285
29082|Rincón de la Victoria|36.7162|-4.2794|52454
29083|Riogordo|36.9150|-4.2936|2839
29084|Ronda|36.7372|-5.1647|33671
29085|Salares|36.8549|-4.0244|194
29086|Sayalonga|36.7981|-4.0119|1672
29087|Sedella|36.8623|-4.0330|607
29904|Serrato|36.8861|-4.9811|457
29088|Sierra de Yeguas|37.1240|-4.8686|3418
29089|Teba|36.9833|-4.9184|3708
29090|Tolox|36.6864|-4.9044|2468
29901|Torremolinos|36.6245|-4.4996|71329
29091|Torrox|36.7607|-3.9524|23
29092|Totalán|36.7656|-4.2970|797
29093|Valle de Abdalajís|36.9339|-4.6810|2439
29094|Vélez-Málaga|36.7821|-4.0993|86048
29095|Villanueva de Algaidas|37.1831|-4.4500|4084
29902|Villanueva de la Concepción|36.9311|-4.5317|3296
29098|Villanueva de Tapia|37.1819|-4.3353|1391
29096|Villanueva del Rosario|36.9986|-4.3660|3470
29097|Villanueva del Trabuco|37.0286|-4.3382|5521
29099|Viñuela|36.8621|-4.1411|2044|La Viñuela
29100|Yunquera|36.7368|-4.9205|2828
30001|Abanilla|38.2072|-1.0414|6256|Favanella|Fabaniella
30002|Abarán|38.2031|-1.4003|13228|Fabarán
30003|Águilas|37.4042|-1.5819|37811|Àguiles
30004|Albudeite|38.0283|-1.3853|1395
30005|Alcantarilla|37.9722|-1.2094|43876|Alcantariella
30902|Los Alcázares|37.7436|-0.8497|20408
30006|Aledo|37.7958|-1.5733|1123
30007|Alguazas|38.0514|-1.2414|10431
30008|Alhama de Murcia|37.8514|-1.4264|24163|Alfama de Murcia
30009|Archena|38.1150|-1.2992|20908
30010|Beniel|38.0464|-1.0014|11582
30011|Blanca|38.1792|-1.3761|6882
30012|Bullas|38.0497|-1.6706|12027|Bulles
30013|Calasparra|38.2311|-1.6978|10391
30014|Campos del Río|38.0408|-1.3517|2159
30015|Caravaca de la Cruz|38.1075|-1.8600|26126
30016|Cartagena|37.6019|-0.9842|220704|Cartaxena|Cartachena
30017|Cehegín|38.0925|-1.7988|14506
30018|Ceutí|38.0789|-1.2722|13089
30019|Cieza|38.2391|-1.4190|35577
30020|Fortuna|38.1789|-1.1233|11437
30021|Fuente Álamo de Murcia|37.7393|-1.1882|19171
30022|Jumilla|38.4792|-1.3250|27574|Jumella|Chumiella
30023|Librilla|37.8831|-1.3500|5854|Libriella
30024|Lorca|37.6833|-1.7000|98969|Llorca
30025|Lorquí|38.0817|-1.2550|7946|Llorquí
30026|Mazarrón|37.5984|-1.3139|35449|Massarró
30027|Molina de Segura|38.0548|-1.2131|78458
30028|Moratalla|38.1864|-1.8906|7518
30029|Mula|38.0419|-1.4907|17937
30030|Murcia|37.9833|-1.1303|479405|Murtzia
30031|Ojós|38.1478|-1.3422|548|Oxóx
30032|Pliego|37.9900|-1.5061|4003
30033|Puerto Lumbreras|37.5635|-1.8072|18006
30034|Ricote|38.1500|-1.3667|1197|Ricot
30035|San Javier|37.8037|-0.8343|36524
30036|San Pedro del Pinatar|37.8363|-0.7886|29674|Sant Pere del Pinatar
30901|Santomera|38.0616|-1.0491|16443
30037|Torre-Pacheco|37.7431|-0.9539|41479
30038|Las Torres de Cotillas|38.0264|-1.2436|22676|Las Torres de Cotiellas
30039|Totana|37.7710|-1.5002|33358
30040|Ulea|38.1408|-1.3297|926
30041|La Unión|37.6191|-0.8755|21380
30042|Villanueva del Río Segura|38.1356|-1.3242|4111
30043|Yecla|38.6100|-1.1145|36453|Iecla
31001|Abáigar|42.6472|-2.1417|74
31002|Abárzuza/Abartzuza|42.7264|-2.0225|510
31003|Abaurregaina/Abaurrea Alta|42.9014|-1.1956|121|Abaurrea de Suso
31004|Abaurrepea/Abaurrea Baja|42.9044|-1.2031|30|Abaurrea de Chuso
31005|Aberin|42.6192|-2.0072|410
31006|Ablitas|41.9736|-1.6386|2657
31007|Adiós|42.6974|-1.7385|194
31008|Aguilar de Codés|42.6128|-2.3892|74|Aguilar Kodes
31009|Aibar/Oibar|42.5895|-1.3612|754
31011|Allín/Allin|42.7089|-2.0756|881
31012|Allo|42.5672|-2.0192|1028
31010|Altsasu/Alsasua|42.9000|-2.1652|7717
31013|Améscoa Baja|42.7709|-2.1317|729|Ameskoabarren|Ameskoabarrena|Améscua la Baixa
31014|Ancín/Antzin|42.6594|-2.1892|363
31015|Andosilla|42.3769|-1.9419|2925|Andosiella
31016|Ansoáin/Antsoain|42.8356|-1.6394|10663
31017|Anue|42.9779|-1.6006|501
31018|Añorbe|42.6584|-1.7143|622
31019|Aoiz/Agoitz|42.7828|-1.3532|3083
31020|Araitz|43.0369|-1.9872|506|Araiz
31025|Arakil|42.9125|-1.8650|990|Araquil
31021|Aranarache/Aranaratxe|42.7794|-2.2283|70|Aranarach
31023|Aranguren|42.7719|-1.5748|13216
31024|Arano|43.1997|-1.8953|108
31022|Arantza|43.1961|-1.7247|628|Aranaz
31026|Aras|42.5619|-2.3550|150
31027|Arbizu|42.9147|-2.0394|1107
31028|Arce/Artzi|42.8896|-1.3380|290|Artzibar
31029|Los Arcos|42.5695|-2.1923|1177
31030|Arellano|42.6061|-2.0469|165
31031|Areso|43.0667|-1.9500|260
31032|Arguedas|42.1769|-1.5983|2309
31033|Aria|42.9688|-1.2733|51
31034|Aribe|42.9447|-1.2658|34|Arive
31035|Armañanzas|42.5600|-2.2850|47|Armañantzas
31036|Arróniz|42.5888|-2.0913|1064|Arroitz
31037|Arruazu|42.9220|-1.9990|121
31038|Artajona|42.5833|-1.7598|1783|Artaxoa|Artaxona
31039|Artazu|42.6840|-1.8399|125
31040|Atetz|42.9394|-1.7097|227|Atez
31058|Auritz/Burguete|42.9908|-1.3346|235|Burguet
31041|Ayegui/Aiegi|42.6567|-2.0383|2589
31042|Azagra|42.2952|-1.8788|3746
31043|Azuelo|42.6083|-2.3492|29
31044|Bakaiku|42.8906|-2.1021|342|Bacáicoa
31901|Barañáin/Barañain|42.8042|-1.6833|19642
31045|Barásoain|42.6151|-1.6710|601
31046|Barbarin|42.6019|-2.1014|46
31047|Bargota|42.5611|-2.3119|237
31048|Barillas|41.9710|-1.6627|240|Bariellas
31049|Basaburua|43.0014|-1.8017|819
31050|Baztan|43.1468|-1.5172|7851
31137|Beintza-Labaien|43.0872|-1.7389|228|Beinza-Labayen|Labaien
31051|Beire|42.4615|-1.5915|274
31052|Belascoáin|42.7561|-1.8325|124|Belaskoain|Beraskoain
31250|Bera|43.2783|-1.6825|3779|Vera de Bidasoa|Vera
31053|Berbinzana|42.5184|-1.8367|670|Berbintzana
31905|Beriáin|42.7336|-1.6444|4195
31902|Berrioplano/Berriobeiti|42.8525|-1.6925|7645|Berrio Plano
31903|Berriozar|42.8361|-1.6714|11361
31054|Bertizarana|43.1336|-1.6273|668
31055|Betelu|43.0257|-1.9795|375
31253|Bidaurreta|42.7767|-1.8328|181|Vidaurreta
31056|Biurrun-Olcoz|42.6740|-1.6848|227|Biurrun-Olkotz
31057|Buñuel|41.9814|-1.4408|2318|Bunyuel
31059|Burgui/Burgi|42.7368|-0.9868|187
31060|Burlada/Burlata|42.8265|-1.6156|21280
31061|El Busto|42.5489|-2.2417|55
31062|Cabanillas|42.0314|-1.5269|1373|Cabaniellas
31063|Cabredo|42.6293|-2.4146|73
31064|Cadreita|42.2247|-1.6852|2187
31065|Caparroso|42.3279|-1.6519|2882
31066|Cárcar|42.3889|-1.9700|1156
31067|Carcastillo|42.3512|-1.4151|2408|Zarrakaztelu|Carcastiello
31068|Cascante|41.9992|-1.6789|4231|Cascant
31069|Cáseda|42.4707|-1.3637|912|Kaseda
31070|Castejón|42.1678|-1.6906|4725|Castellón
31071|Castillonuevo/Gazteluberri|42.6778|-1.0444|14|Castiello Nuevo
31193|Cendea de Olza/Oltza Zendea|42.8225|-1.7539|1874|Olza
31072|Cintruénigo|42.0800|-1.8050|8565
31074|Cirauqui/Zirauki|42.6756|-1.8903|473
31075|Ciriza/Ziritza|42.7906|-1.8267|170|Ziriza
31076|Cizur|42.7919|-1.7178|3949|Cendea de Cizur|Zizur Zendea|Zizur|Zendea de Zizur
31077|Corella|42.1147|-1.7867|8756
31078|Cortes|41.9228|-1.4219|3165|Cortz
31079|Desojo|42.5881|-2.2757|68|Desoio|Desollo
31080|Dicastillo|42.5958|-2.0284|562|Dicastiello
31081|Donamaria|43.1112|-1.6728|446
31221|Doneztebe/Santesteban|43.1310|-1.6687|1854
31083|Echarri/Etxarri|42.7806|-1.8253|78
31087|Elgorriaga|43.1389|-1.6869|210
31089|Enériz/Eneritz|42.6646|-1.7437|328
31090|Eratsun|43.0833|-1.7967|155|Erasun
31091|Ergoiena|42.8789|-2.0239|392|Ergoyena
31092|Erro|42.9571|-1.4281|812|Erroibar
31094|Eslava|42.5639|-1.4583|97|Eslaba
31095|Esparza de Salazar/Espartza Zaraitzu|42.8605|-1.0926|75
31096|Espronceda|42.5981|-2.3025|102|Esprontzeda
31097|Estella-Lizarra|42.6705|-2.0306|14317|Lizarra
31098|Esteribar|42.9496|-1.5338|2918
31099|Etayo|42.6167|-2.1539|72|Etaio|Etaiu
31082|Etxalar|43.2336|-1.6372|807|Echalar
31084|Etxarri Aranatz|42.9073|-2.0650|2551|Echarri Aranaz|Echarri-Aranaz
31085|Etxauri|42.7939|-1.7900|671|Echauri
31100|Eulate|42.7764|-2.2062|278
31101|Ezcabarte|42.8726|-1.6327|1901|Ezkabarte
31093|Ezcároz/Ezkaroze|42.8967|-1.0664|298
31102|Ezkurra|43.0847|-1.8622|125|Ezcurra
31103|Ezprogui|42.6045|-1.4490|48|Ezporogi
31104|Falces|42.4187|-1.8085|2389|Faltzes
31105|Fitero|42.0581|-1.8572|2370
31106|Fontellas|42.0283|-1.5761|1050
31107|Funes|42.2843|-1.8010|2537
31108|Fustiñana|42.0197|-1.4861|2445|Fustinyana
31109|Galar|42.7503|-1.6716|2427
31110|Gallipienzo/Galipentzu|42.4814|-1.4155|100
31111|Gallués/Galoze|42.7839|-1.1003|91
31112|Garaioa|42.9162|-1.2372|92|Garayoa
31113|Garde|42.7834|-0.8967|132
31114|Garínoain|42.5938|-1.6608|527
31115|Garralda|42.9595|-1.3047|183
31116|Genevilla|42.6447|-2.3917|69
31117|Goizueta|43.1711|-1.8642|681
31119|Güesa/Gorza|42.8064|-1.0947|36
31120|Guesálaz/Gesalatz|42.7500|-1.9167|462
31121|Guirguillano|42.7223|-1.8649|75|Girgillao
31256|Hiriberri/Villanueva de Aezkoa|42.9454|-1.2310|96|Villanueva de Aézcoa|Villanueva d'Ezcua
31122|Huarte/Uharte|42.8314|-1.5908|7900|Uhart
31124|Ibargoiti|42.6755|-1.4605|279
31259|Igantzi|43.2246|-1.7000|578|Yanci|Iganzi
31125|Igúzquiza|42.6464|-2.0853|307|Iguzkitza
31126|Imotz|42.9560|-1.8016|433|Imoz
31127|Irañeta|42.9229|-1.9452|172
31904|Irurtzun|42.9183|-1.8285|2296|Irurzun
31128|Isaba/Izaba|42.8614|-0.9225|384
31129|Ituren|43.1289|-1.7072|543
31130|Iturmendi|42.8894|-2.1186|428
31131|Iza/Itza|42.8825|-1.7675|1459
31132|Izagaondoa|42.7291|-1.4339|153|Itzagaondoa
31133|Izalzu/Itzaltzu|42.9135|-1.0567|36
31134|Jaurrieta|42.9070|-1.1587|179|Chaurrieta
31135|Javier|42.5916|-1.2092|106|Xabier
31136|Juslapeña/Txulapain|42.8978|-1.7043|562|Chus la Penya
31138|Lakuntza|42.9231|-2.0214|1338|Lacunza
31139|Lana|42.7061|-2.2469|149
31140|Lantz|43.0105|-1.6098|150|Lanz
31141|Lapoblación|42.6047|-2.4742|123|La Población
31142|Larraga|42.5474|-1.8548|2158
31143|Larraona|42.7806|-2.2561|100|Larragoa
31144|Larraun|43.0056|-1.8964|918
31145|Lazagurría|42.4936|-2.2389|170|Elizagorria
31146|Leache/Leatxe|42.6172|-1.4109|38|Liach
31147|Legarda|42.7170|-1.7755|143
31148|Legaria|42.6486|-2.1733|111
31149|Leitza|43.0789|-1.9147|3011|Leiza
31908|Lekunberri|43.0033|-1.8939|1746|Lecumberri
31150|Leoz/Leotz|42.6009|-1.5665|202
31151|Lerga|42.5663|-1.5017|44
31152|Lerín|42.4814|-1.9737|1821
31153|Lesaka|43.2492|-1.7039|2721|Lesaca
31154|Lezaun|42.7803|-1.9942|248
31155|Liédena|42.6132|-1.2649|354|Ledea
31156|Lizoain-Arriasgoiti/Lizoainibar-Arriasgoiti|42.8299|-1.4632|287|Lintzoain
31157|Lodosa|42.4242|-2.0783|4964
31158|Lónguida/Longida|42.7760|-1.3623|308
31159|Lumbier|42.6508|-1.3090|1330|Irunberri
31160|Luquin|42.6117|-2.0992|135|Lukin
31248|Luzaide/Valcarlos|43.0917|-1.3013|336|La Val de Carlos
31161|Mañeru|42.6697|-1.8624|452
31162|Marañón|42.6285|-2.4416|50|Maranyón
31163|Marcilla|42.3514|-1.7281|2938|Martzilla|Marciella
31164|Mélida|42.3433|-1.5149|739
31165|Mendavia|42.4443|-2.2004|3588|Mendabia
31166|Mendaza|42.6428|-2.2347|284
31167|Mendigorria|42.6282|-1.8345|1261
31168|Metauten|42.6786|-2.1253|263
31169|Milagro|42.2408|-1.7680|3741|Miraglo
31170|Mirafuentes|42.6231|-2.2767|56
31171|Miranda de Arga|42.4803|-1.8245|903|Miranda Arga|Miranda d'Arga
31172|Monreal/Elo|42.7061|-1.5230|511|Mont-reyal
31173|Monteagudo|41.9639|-1.6903|1073|Mont Agut
31174|Morentin|42.6142|-2.0125|110
31175|Mues|42.6061|-2.2264|80
31176|Murchante|42.0300|-1.6558|4230|Murchant
31177|Murieta|42.6594|-2.1564|345
31178|Murillo el Cuende|42.3501|-1.5917|701|Murelu Konde|Moriello del Cuende
31179|Murillo el Fruto|42.3984|-1.4658|665|Murelu Hautsi|Moriello Freito|Murillo el Frutu
31180|Muruzábal|42.6900|-1.7580|283
31181|Navascués/Nabaskoze|42.7318|-1.1177|114
31182|Nazar|42.6375|-2.2789|40
31183|Obanos|42.6803|-1.7858|924
31185|Ochagavía/Otsagabia|42.9056|-1.0911|492|Ochogabia
31184|Oco|42.6397|-2.1636|65|Oko
31186|Odieta|42.9330|-1.6427|367
31187|Oiz|43.1106|-1.6856|129|Oitz
31188|Olaibar|42.8962|-1.6061|399
31189|Olazti/Olazagutía|42.8778|-2.1944|1444|Olatzagutia
31190|Olejua|42.6242|-2.1403|49|Olexoa
31191|Olite/Erriberri|42.4457|-1.6796|4069|Olit
31192|Olóriz/Oloritz|42.6407|-1.6060|210
31195|Orbaizeta|43.0029|-1.2218|186|Orbaiceta
31196|Orbara|42.9752|-1.2497|28
31197|Orísoain|42.5991|-1.5914|72
31906|Orkoien|42.8239|-1.6992|4098|Orcoyen
31198|Oronz/Orontze|42.8756|-1.0677|51
31199|Oroz-Betelu/Orotz-Betelu|42.9064|-1.3017|143
31211|Orreaga/Roncesvalles|43.0085|-1.3186|25|Roncesvalls|Roncesvales|Roncesvals
31200|Oteiza|42.6186|-1.9533|972|Oteitza
31201|Pamplona/Iruña|42.8167|-1.6500|209094|Iruñea
31202|Peralta/Azkoien|42.3569|-1.8016|6071
31203|Petilla de Aragón|42.4436|-1.1195|29|Petilla Aragoi|Petiella d'Aragón
31204|Piedramillera|42.6328|-2.2028|46|Piedra Millera
31205|Pitillas|42.4220|-1.6210|520|Pitiellas
31206|Puente la Reina/Gares|42.6715|-1.8150|2972|Puent de la Reina
31207|Pueyo/Puiu|42.5643|-1.6605|384
31208|Ribaforada|41.9972|-1.5108|3697|Riba Forada
31209|Romanzado/Erromantzatua|42.6908|-1.1919|180
31210|Roncal/Erronkari|42.8119|-0.9279|206
31212|Sada|42.5732|-1.3935|130|Zare
31213|Saldías|43.0883|-1.7808|125
31214|Salinas de Oro/Jaitz|42.7753|-1.8881|110|Salinas d'Oro
31215|San Adrián|42.3325|-1.9333|6504|Sant Hadrián
31217|San Martín de Unx|42.5186|-1.5737|352|San Martin Unx
31216|Sangüesa/Zangoza|42.5764|-1.2828|4883
31219|Sansol|42.5540|-2.2661|89|Santsol
31220|Santacara|42.3899|-1.5472|874|Santakara|Santa Cara
31222|Sarriés/Sartze|42.8455|-1.0971|57
31223|Sartaguda|42.3814|-2.0586|1349
31224|Sesma|42.4778|-2.0833|1248
31225|Sorlada|42.6150|-2.2153|39
31226|Sunbilla|43.1644|-1.6683|672|Sumbilla
31227|Tafalla|42.5132|-1.7047|10854
31228|Tiebas-Muruarte de Reta|42.6931|-1.6403|693|Tiebas-Muru Artederreta|Tebas-Muru Artederreta
31229|Tirapu|42.6451|-1.6956|49
31230|Torralba del Río|42.6086|-2.3297|96
31231|Torres del Río|42.5513|-2.2713|116
31232|Tudela|42.0653|-1.6067|38903|Tutera
31233|Tulebras|41.9767|-1.6764|159
31234|Ucar|42.6910|-1.7038|194|Ukar
31123|Uharte Arakil|42.9209|-1.9691|770|Huarte-Araquil|Uhart de Val d'Araquil
31235|Ujué/Uxue|42.4798|-1.4971|168
31236|Ultzama|43.0000|-1.6781|1599|Ulzama|Uzama
31237|Unciti|42.7245|-1.4670|257|Untziti|Untzitibar|Unzit
31238|Unzué/Untzue|42.6634|-1.6199|164
31239|Urdazubi/Urdax|43.2664|-1.5039|354
31240|Urdiain|42.8831|-2.1331|647
31241|Urraul Alto|42.7832|-1.2208|136|Urraulgoiti|Urraúl Alta
31242|Urraul Bajo|42.6863|-1.3204|330|Urraulbeiti|Urraúl Baixa
31244|Urroz|43.1014|-1.7061|175|Urrotz
31243|Urroz-Villa|42.7781|-1.4594|403|Urrotz
31245|Urzainqui/Urzainki|42.8407|-0.9225|76
31246|Uterga|42.7100|-1.7595|177
31247|Uztárroz/Uztarroze|42.8928|-0.9401|136
31118|Val de Goñi/Goñerri|42.8323|-1.8879|166|Goñi
31086|Valle de Egüés/Eguesibar|42.8237|-1.5574|22825|Egüés
31088|Valle de Elorz/Elortzibar|42.7297|-1.5916|8486|lortzibar
31194|Valle de Ollo/Ollaran|42.8590|-1.8571|453|Val d'Ollo
31260|Valle de Yerri/Deierri|42.7333|-2.0000|1549|Deyerri
31249|Valtierra|42.1953|-1.6342|2505|Val Tierra
31251|Viana|42.5151|-2.3718|4441
31252|Vidángoz/Bidankoze|42.8011|-1.0136|74|Bidángoz
31254|Villafranca|42.2739|-1.7256|3163|Alesbes
31255|Villamayor de Monjardín|42.6292|-2.1038|115|Villamayor de Mont Chardín
31257|Villatuerta|42.6595|-1.9934|1256
31258|Villava/Atarrabia|42.8308|-1.6086|9928
31261|Yesa|42.6259|-1.2004|297|Esa
31262|Zabalza/Zabaltza|42.7676|-1.8063|285
31073|Ziordia|42.8706|-2.2270|359|Ciordia
31907|Zizur Mayor/Zizur Nagusia|42.7867|-1.6908|16510
31263|Zubieta|43.1249|-1.7424|292
31264|Zugarramurdi|43.2693|-1.5416|213
31265|Zúñiga|42.6930|-2.3004|78|Estuniga
32001|Allariz|42.1901|-7.8018|6497
32002|Amoeiro|42.4100|-7.9533|2443
32003|A Arnoia|42.2503|-8.1331|949|Arnoya
32004|Avión|42.3883|-8.2728|1719
32005|Baltar|41.9500|-7.7158|849
32006|Bande|42.0306|-7.9753|1460
32007|Baños de Molgas|42.2411|-7.6728|1471
32008|Barbadás|42.3003|-7.9064|11201|Barbadanes
32009|O Barco de Valdeorras|42.4167|-6.9831|13368|El Barco de Valdeorras
32010|Beade|42.3347|-8.1456|363
32011|Beariz|42.4662|-8.2704|901
32012|Os Blancos|42.0047|-7.7169|696|Blancos
32013|Boborás|42.4328|-8.1433|2167
32014|A Bola|42.1517|-7.9147|1139|La Bola
32015|O Bolo|42.3067|-7.0989|789|El Bollo
32016|Calvos de Randín|41.9047|-7.8756|650
32018|Carballeda de Avia|42.3214|-8.1653|1172
32017|Carballeda de Valdeorras|42.3761|-6.8775|1311
32019|O Carballiño|42.4296|-8.0775|14249|Carballino
32020|Cartelle|42.2492|-8.0689|2466
32022|Castrelo de Miño|42.2944|-8.0667|1289
32021|Castrelo do Val|41.9906|-7.4242|947|Castrelo del Valle
32023|Castro Caldelas|42.3750|-7.4156|1244|O Castro de Caldelas
32024|Celanova|42.1508|-7.9567|5723
32025|Cenlle|42.3425|-8.0878|1066
32029|Chandrexa de Queixa|42.2403|-7.4261|467|Chandreja de Queija
32026|Coles|42.4122|-7.8397|3228
32027|Cortegada|42.2069|-8.1692|1027
32028|Cualedro|41.9831|-7.5831|1538
32030|Entrimo|41.9408|-8.1408|1093
32031|Esgos|42.3250|-7.6972|1103
32033|Gomesende|42.1878|-8.0992|646
32034|A Gudiña|42.0608|-7.1378|1197|La Gudiña
32035|O Irixo|42.5119|-8.1183|1340|Irijo
32038|Larouco|42.3466|-7.1632|484|Laroco
32039|Laza|42.0606|-7.4614|1156
32040|Leiro|42.3692|-8.1247|1517
32041|Lobeira|41.9989|-8.0431|703|Lobera
32042|Lobios|41.8753|-8.0844|1776
32043|Maceda|42.2708|-7.6508|2874
32044|Manzaneda|42.3094|-7.2333|767
32045|Maside|42.4131|-8.0242|2768
32046|Melón|42.2575|-8.2172|1079
32047|A Merca|42.2231|-7.9053|1962|La Merca
32048|A Mezquita|42.0115|-7.0451|996|La Mezquita
32049|Montederramo|42.2767|-7.5042|660
32050|Monterrei|41.9468|-7.4491|2403|Monterrey
32051|Muíños|41.9542|-7.9856|1385
32052|Nogueira de Ramuín|42.4197|-7.7531|2074
32053|Oímbra|41.8853|-7.4725|1689
32054|Ourense|42.3356|-7.8641|105769|Orense
32055|Paderne de Allariz|42.2775|-7.7458|1346
32056|Padrenda|42.1394|-8.1583|1555
32057|Parada de Sil|42.3831|-7.5689|500|Parada del Sil
32058|O Pereiro de Aguiar|42.3463|-7.8003|6794|Pereiro de Aguiar
32059|A Peroxa|42.4389|-7.7933|1793|La Peroja
32060|Petín|42.3822|-7.1258|856
32061|Piñor|42.4978|-8.0050|1103
32063|A Pobra de Trives|42.3394|-7.2531|1929|Puebla de Trives
32064|Pontedeva|42.1686|-8.1392|458|Puentedeva
32062|Porqueira|42.0178|-7.8444|806|Porquera
32065|Punxín|42.3703|-8.0119|748|Pungín
32066|Quintela de Leirado|42.1383|-8.1017|587
32067|Rairiz de Veiga|42.0831|-7.8322|1154
32068|Ramirás|42.1853|-8.0253|1485|Ramiranes
32069|Ribadavia|42.2882|-8.1431|4895
32071|Riós|41.9742|-7.2825|1379|O Riós
32072|A Rúa|42.3938|-7.1143|4214|Rúa
32073|Rubiá|42.4497|-6.9489|1391|Rubiana
32074|San Amaro|42.3731|-8.0731|1030
32075|San Cibrao das Viñas|42.2969|-7.8714|5751|San Ciprián de Viñas
32076|San Cristovo de Cea|42.4750|-7.9860|1963|San Cristóbal de Cea
32070|San Xoán de Río|42.3844|-7.3142|510|Río
32077|Sandiás|42.1111|-7.7567|1086|Sandianes
32078|Sarreaus|42.0867|-7.6033|1068
32079|Taboadela|42.2408|-7.8250|1480
32080|A Teixeira|42.3917|-7.4742|328|La Teijeira
32081|Toén|42.3147|-7.9539|2327
32082|Trasmiras|42.0228|-7.6167|1216
32083|A Veiga|42.2501|-7.0262|873|La Vega
32084|Verea|42.0939|-7.9936|974
32085|Verín|41.9408|-7.4358|13956
32086|Viana do Bolo|42.1794|-7.1111|2715|Viana del Bollo
32087|Vilamarín|42.4642|-7.8900|1836|Villamarín
32088|Vilamartín de Valdeorras|42.4156|-7.0592|1817|Villamartín de Valdeorras
32089|Vilar de Barrio|42.1597|-7.6117|1178|Villar de Barrio
32090|Vilar de Santos|42.0856|-7.7967|784|Villar de Santos
32091|Vilardevós|41.9069|-7.3131|1616|Villardevós
32092|Vilariño de Conso|42.1769|-7.1711|501|Villarino de Conso
32032|Xinzo de Limia|42.0636|-7.7239|9699|Ginzo de Limia
32036|Xunqueira de Ambía|42.2043|-7.7350|1346|Junquera de Ambía
32037|Xunqueira de Espadanedo|42.3175|-7.6286|696|Junquera de Espadañedo
33001|Allande|43.2722|-6.6089|1506
33002|Aller|43.1058|-5.5805|10011|Ayer
33003|Amieva|43.2450|-5.0731|591
33004|Avilés|43.5561|-5.9222|75517
33005|Belmonte de Miranda|43.2723|-6.2610|1366|Miranda
33006|Bimenes|43.3252|-5.5673|1639
33007|Boal|43.4290|-6.8172|1372|Bual
33008|Cabrales|43.3161|-4.8458|1884
33009|Cabranes|43.4071|-5.4239|1094
33010|Candamo|43.4556|-6.0567|1902|Candamu
33012|Cangas de Onís|43.3504|-5.1305|6344|Cangues d'Onís
33011|Cangas del Narcea|43.1762|-6.5489|11282
33013|Caravia|43.4586|-5.1894|486
33014|Carreño|43.5516|-5.7894|10292
33015|Caso|43.1772|-5.3334|1437|Casu
33016|Castrillón|43.5459|-5.9925|21998
33017|Castropol|43.5277|-7.0301|3202
33018|Coaña|43.5145|-6.7510|3321|Cuaña
33019|Colunga|43.4862|-5.2704|3143
33020|Corvera de Asturias|43.5178|-5.8878|15785
33021|Cudillero|43.5633|-6.1458|4867|Cuideiru
33022|Degaña|42.9407|-6.5712|768
33023|El Franco|43.5093|-6.8341|3728
33024|Gijón|43.5293|-5.6773|269894|Xixón
33025|Gozón|43.6062|-5.8473|10407
33026|Grado|43.3134|-6.0998|9681|Grau
33027|Grandas de Salime|43.2177|-6.8757|767
33028|Ibias|43.0003|-6.8219|1084
33029|Illano|43.3334|-6.8643|277|Eilao
33030|Illas|43.4959|-5.9681|1048
33031|Langreo|43.2916|-5.6994|38612|Llangréu|Langreu
33032|Laviana|43.2321|-5.5477|12352|Llaviana
33033|Lena|43.0831|-5.7922|10382|Ḷḷena
33035|Llanera|43.4545|-5.8521|14020
33036|Llanes|43.4211|-4.7531|13486
33037|Mieres|43.2500|-5.7767|36373
33038|Morcín|43.2668|-5.9008|2460
33039|Muros de Nalón|43.5430|-6.1046|1955
33040|Nava|43.3582|-5.5057|5244
33041|Navia|43.5392|-6.7236|8031
33042|Noreña|43.3940|-5.7067|5131
33043|Onís|43.2959|-4.9718|739
33044|Oviedo|43.3625|-5.8503|223968|Uviéu
33045|Parres|43.3587|-5.1846|5150
33046|Peñamellera Alta|43.3106|-4.7123|500|El Valle Altu de Peñamellera
33047|Peñamellera Baja|43.3075|-4.5866|1194|El Valle Baju de Peñamellera|Peñamellera Baxa
33048|Pesoz|43.2734|-6.8619|134|Pezós
33049|Piloña|43.3343|-5.3308|6716
33050|Ponga|43.1870|-5.1538|576
33051|Pravia|43.4897|-6.1139|7792
33052|Proaza|43.2508|-6.0169|686
33053|Quirós|43.1523|-5.9725|1142
33054|Las Regueras|43.4214|-5.9734|1892|Les Regueres
33055|Ribadedeva|43.3718|-4.5695|1693|Ribadeva|Ribedeva
33056|Ribadesella|43.4459|-5.0835|5591|Ribeseya
33057|Ribera de Arriba|43.3046|-5.9105|1852|La Ribera|Ribera d'Arriba
33058|Riosa|43.2089|-5.8901|1686
33059|Salas|43.4082|-6.2569|4771
33061|San Martín de Oscos|43.2654|-6.9617|337|Samartín d'Ozcos|San Martín de Ozcos
33060|San Martín del Rey Aurelio|43.2750|-5.6138|15531|Samartín del Rei Aurelio
33063|San Tirso de Abres|43.4033|-7.1323|396|San Tiso d'Abres|Santiso de Abres
33062|Santa Eulalia de Oscos|43.2587|-7.0204|420|Santalla d'Ozcos|Santalla de Ozcos
33064|Santo Adriano|43.2883|-5.9798|281|Santu Adrianu
33065|Sariego|43.4161|-5.5500|1252|Sariegu
33066|Siero|43.3915|-5.6609|53049
33067|Sobrescobio|43.1939|-5.4622|838|Sobrescobiu
33068|Somiedo|43.1028|-6.2515|1031|Somiedu
33069|Soto del Barco|43.5257|-6.0521|3801|Sotu'l Barcu
33070|Tapia de Casariego|43.5692|-6.9437|3538|Tapia de Casarego
33071|Taramundi|43.3604|-7.1081|545
33072|Teverga|43.1451|-6.1202|1495|Teberga
33073|Tineo|43.3095|-6.4922|8679|Tinéu
33034|Valdés|43.4847|-6.4712|10776
33074|Vegadeo|43.4157|-6.9992|3928|A Veiga
33075|Villanueva de Oscos|43.3114|-6.9863|244|Vilanova d'Ozcos|Vilanova de Ozcos
33076|Villaviciosa|43.4813|-5.4335|15379
33077|Villayón|43.4484|-6.7053|1054|Villaión
33078|Yernes y Tameza|43.2604|-6.1056|134|Tameza
34001|Abarca de Campos|42.0603|-4.8433|38
34003|Abia de las Torres|42.4200|-4.4211|165
34004|Aguilar de Campoo|42.7925|-4.2603|6916
34005|Alar del Rey|42.6603|-4.3086|910
34006|Alba de Cerrato|41.8125|-4.3661|80
34009|Amayuelas de Arriba|42.2167|-4.4831|36
34010|Ampudia|41.9149|-4.7792|588
34011|Amusco|42.1756|-4.4669|417
34012|Antigüedad|41.9467|-4.1186|329
34015|Arconada|42.3276|-4.4953|45
34017|Astudillo|42.1920|-4.2945|1041
34018|Autilla del Pino|41.9831|-4.6331|223
34019|Autillo de Campos|42.0881|-4.8311|125
34020|Ayuela|42.6322|-4.6678|48
34022|Baltanás|41.9383|-4.2464|1226
34024|Baquerín de Campos|42.0167|-4.7831|20
34025|Bárcena de Campos|42.4834|-4.4988|53
34027|Barruelo de Santullán|42.9075|-4.2833|1164
34028|Báscones de Ojeda|42.6667|-4.5167|136
34029|Becerril de Campos|42.1083|-4.6417|737
34031|Belmonte de Campos|41.9331|-4.9831|28
34032|Berzosilla|42.7831|-4.0331|45
34033|Boada de Campos|41.9831|-4.8667|17
34035|Boadilla de Rioseco|42.1781|-4.9683|95
34034|Boadilla del Camino|42.2500|-4.3500|111
34036|Brañosera|42.9358|-4.3078|253
34037|Buenavista de Valdavia|42.6381|-4.6146|290
34038|Bustillo de la Vega|42.4558|-4.7406|259
34039|Bustillo del Páramo de Carrión|42.3558|-4.7381|58
34041|Calahorra de Boedo|42.5667|-4.3831|82
34042|Calzada de los Molinos|42.3331|-4.6500|305
34045|Capillas|42.0133|-4.8908|68
34046|Cardeñosa de Volpejera|42.2319|-4.7017|64
34047|Carrión de los Condes|42.3389|-4.6019|1997
34048|Castil de Vela|41.9839|-4.9586|54
34049|Castrejón de la Peña|42.8083|-4.6031|322
34050|Castrillo de Don Juan|41.7919|-4.0694|177
34051|Castrillo de Onielo|41.8587|-4.3020|91
34052|Castrillo de Villavega|42.4500|-4.4831|167
34053|Castromocho|42.0331|-4.8167|193
34055|Cervatos de la Cueza|42.2831|-4.7667|241
34056|Cervera de Pisuerga|42.8636|-4.4972|2272
34057|Cevico de la Torre|41.8522|-4.4106|464
34058|Cevico Navero|41.8611|-4.1842|175
34059|Cisneros|42.2203|-4.8569|426
34060|Cobos de Cerrato|42.0275|-4.0028|129
34061|Collazos de Boedo|42.6189|-4.4833|89
34062|Congosto de Valdavia|42.7156|-4.6336|132
34063|Cordovilla la Real|42.0796|-4.2599|130
34066|Cubillas de Cerrato|41.8000|-4.4667|60
34067|Dehesa de Montejo|42.8167|-4.5167|130
34068|Dehesa de Romanos|42.6414|-4.4322|39
34069|Dueñas|41.8769|-4.5469|2605
34070|Espinosa de Cerrato|41.9681|-3.9517|119
34071|Espinosa de Villagonzalo|42.4831|-4.3667|164
34072|Frechilla|42.1381|-4.8403|138
34073|Fresno del Río|42.6811|-4.8178|169
34074|Frómista|42.2672|-4.4067|727
34076|Fuentes de Nava|42.0831|-4.7831|581
34077|Fuentes de Valdepero|42.0667|-4.5000|489
34079|Grijota|42.0525|-4.5823|2839
34080|Guardo|42.7895|-4.8463|5502
34081|Guaza de Campos|42.1331|-4.9097|57
34082|Hérmedes de Cerrato|41.8192|-4.1750|72
34083|Herrera de Pisuerga|42.5931|-4.3322|1875
34084|Herrera de Valdecañas|42.0500|-4.2000|148
34086|Hontoria de Cerrato|41.9106|-4.4411|108
34087|Hornillos de Cerrato|41.9883|-4.2725|171
34088|Husillos|42.0831|-4.5167|413
34089|Itero de la Vega|42.2864|-4.2586|147
34091|Lagartos|42.4056|-4.9044|117
34092|Lantadilla|42.3406|-4.2767|277
34094|Ledigos|42.3547|-4.8647|59
34903|Loma de Ucieza|42.4414|-4.5792|186
34096|Lomas|42.2667|-4.5500|40
34098|Magaz de Pisuerga|41.9819|-4.4294|1065
34099|Manquillos|42.2047|-4.5678|62
34100|Mantinos|42.7536|-4.8425|142
34101|Marcilla de Campos|42.3167|-4.4000|60
34102|Mazariegos|42.0269|-4.7156|202
34103|Mazuecos de Valdeginate|42.1683|-4.8400|78
34104|Melgar de Yuso|42.2533|-4.2544|269
34106|Meneses de Campos|41.9417|-4.9200|109
34107|Micieces de Ojeda|42.6906|-4.4619|67
34108|Monzón de Campos|42.1167|-4.4944|608
34109|Moratinos|42.3606|-4.9267|55
34110|Mudá|42.8758|-4.3944|81
34112|Nogal de las Huertas|42.3922|-4.6414|46
34113|Olea de Boedo|42.6089|-4.4497|38
34114|Olmos de Ojeda|42.7236|-4.4244|166
34116|Osornillo|42.3667|-4.2831|57
34901|Osorno la Mayor|42.4100|-4.3614|1180
34120|Palencia|42.0167|-4.5333|77466|Palentzia
34121|Palenzuela|42.0953|-4.1292|212
34122|Páramo de Boedo|42.5775|-4.4000|103
34123|Paredes de Nava|42.1528|-4.6944|1927
34124|Payo de Ojeda|42.7167|-4.4831|59
34125|Pedraza de Campos|41.9839|-4.7347|73
34126|Pedrosa de la Vega|42.4822|-4.7458|277
34127|Perales|42.1939|-4.5803|112
34904|La Pernía|42.9647|-4.4981|297
34129|Pino del Río|42.6442|-4.8078|162
34130|Piña de Campos|42.2136|-4.4369|185
34131|Población de Arroyo|42.3364|-4.8739|44
34132|Población de Campos|42.2697|-4.4469|119
34133|Población de Cerrato|41.7928|-4.4283|102
34134|Polentinos|42.9389|-4.5269|41
34135|Pomar de Valdivia|42.7739|-4.1694|488
34136|Poza de la Vega|42.5783|-4.7967|160
34137|Pozo de Urama|42.2542|-4.8947|21
34139|Prádanos de Ojeda|42.6822|-4.3478|181
34140|La Puebla de Valdavia|42.6736|-4.6097|79
34141|Quintana del Puente|42.0836|-4.2064|248
34143|Quintanilla de Onsoña|42.4692|-4.6636|167
34146|Reinoso de Cerrato|41.9758|-4.3831|58
34147|Renedo de la Vega|42.4536|-4.7028|193
34149|Requena de Campos|42.3078|-4.3436|27
34151|Respenda de la Peña|42.7642|-4.6867|140
34152|Revenga de Campos|42.2839|-4.4825|127
34154|Revilla de Collazos|42.6297|-4.5042|75
34155|Ribas de Campos|42.1539|-4.5167|150
34156|Riberos de la Cueza|42.2783|-4.7253|52
34157|Saldaña|42.5202|-4.7373|2844|Saldanya
34158|Salinas de Pisuerga|42.8486|-4.3781|348
34159|San Cebrián de Campos|42.2014|-4.5308|400
34160|San Cebrián de Mudá|42.8917|-4.3861|142|67
34161|San Cristóbal de Boedo|42.5417|-4.3531|20
34163|San Mamés de Campos|42.3547|-4.5658|44
34165|San Román de la Cuba|42.2628|-4.8572|53
34167|Santa Cecilia del Alcor|41.9339|-4.6589|91
34168|Santa Cruz de Boedo|42.5244|-4.3736|51
34169|Santervás de la Vega|42.5064|-4.7992|392
34170|Santibáñez de Ecla|42.7067|-4.3750|42
34171|Santibáñez de la Peña|42.8100|-4.7292|892
34174|Santoyo|42.2147|-4.3433|187
34175|La Serna|42.4167|-4.6667|90
34177|Soto de Cerrato|41.9533|-4.4297|166
34176|Sotobañado y Priorato|42.5911|-4.4417|154
34178|Tabanera de Cerrato|42.0253|-4.1231|133
34179|Tabanera de Valdavia|42.6464|-4.6919|20
34180|Támara de Campos|42.2033|-4.3936|70
34181|Tariego de Cerrato|41.9044|-4.4800|504
34182|Torquemada|42.0341|-4.3189|964
34184|Torremormojón|41.9611|-4.7775|41
34185|Triollo|42.9242|-4.6808|73
34186|Valbuena de Pisuerga|42.1453|-4.2389|49
34189|Valdeolmillos|42.0411|-4.4003|56
34190|Valderrábano|42.6058|-4.6547|47
34192|Valde-Ucieza|42.4000|-4.5667|77
34196|Valle de Cerrato|41.8797|-4.3619|77
34902|Valle del Retortillo|42.2353|-4.7900|155
34199|Velilla del Río Carrión|42.8261|-4.8458|1104
34023|Venta de Baños|41.9214|-4.4945|6372
34201|Vertavillo|41.8319|-4.3272|162
34093|La Vid de Ojeda|42.6608|-4.3831|82
34202|Villabasta de Valdavia|42.5608|-4.6025|33
34204|Villacidaler|42.2217|-4.9742|44
34205|Villaconancio|41.8719|-4.2239|48
34206|Villada|42.2489|-4.9678|863
34208|Villaeles de Valdavia|42.5653|-4.5844|47
34210|Villahán|42.0508|-4.1311|96
34211|Villaherreros|42.3892|-4.4611|211
34213|Villalaco|42.1550|-4.2594|67
34214|Villalba de Guardo|42.7222|-4.8222|194
34215|Villalcázar de Sirga|42.3167|-4.5431|160
34216|Villalcón|42.2931|-4.8550|45
34217|Villalobón|42.0294|-4.5039|1955
34218|Villaluenga de la Vega|42.5239|-4.7653|519
34220|Villamartín de Campos|42.0150|-4.6636|170
34221|Villamediana|42.0497|-4.3614|177
34222|Villameriel|42.5283|-4.4756|109
34223|Villamoronta|42.4025|-4.6986|236
34224|Villamuera de la Cueza|42.2586|-4.6878|36
34225|Villamuriel de Cerrato|41.9500|-4.5155|6501
34227|Villanueva del Rebollar|42.2408|-4.7422|67
34228|Villanuño de Valdavia|42.5089|-4.5175|91
34229|Villaprovedo|42.5156|-4.3956|46
34230|Villarmentero de Campos|42.2972|-4.5000|26
34231|Villarrabé|42.4207|-4.7841|170
34232|Villarramiel|42.0425|-4.9131|782
34233|Villasarracino|42.4119|-4.4964|125
34234|Villasila de Valdavia|42.5322|-4.5572|64
34236|Villaturde|42.3764|-4.6711|148
34237|Villaumbrales|42.0889|-4.6131|627
34238|Villaviudas|41.9614|-4.3425|356
34240|Villerías de Campos|41.9444|-4.8556|71
34241|Villodre|42.2117|-4.2453|22
34242|Villodrigo|42.1444|-4.0947|96
34243|Villoldo|42.2450|-4.5958|333
34245|Villota del Páramo|42.5517|-4.8481|295
34246|Villovieco|42.2950|-4.4819|62
35001|Agaete|28.1017|-15.7007|5683
35002|Agüimes|27.8833|-15.4333|33800
35020|La Aldea de San Nicolás|27.9826|-15.7799|7401
35003|Antigua|28.4160|-14.0118|14164
35004|Arrecife|28.9625|-13.5506|70811
35005|Artenara|28.0202|-15.6457|1024
35006|Arucas|28.1184|-15.5232|39232
35007|Betancuria|28.4247|-14.0572|801
35008|Firgas|28.1000|-15.5500|7728
35009|Gáldar|28.1439|-15.6503|25108
35010|Haría|29.1468|-13.4982|5623
35011|Ingenio|27.9214|-15.4324|32905
35012|Mogán|27.8667|-15.7167|21172
35013|Moya|28.1108|-15.5832|8007
35014|La Oliva|28.6167|-13.9333|30022
35015|Pájara|28.3500|-14.1000|21570
35016|Las Palmas de Gran Canaria|28.1272|-15.4314|381868|Las Palmas Kanaria Handikoa|As Palmas de Gran Canaria|Les Palmes de Gran Canaria
35017|Puerto del Rosario|28.5000|-13.8667|46150
35018|San Bartolomé|29.0016|-13.6139|19551
35019|San Bartolomé de Tirajana|27.9254|-15.5726|54291
35021|Santa Brígida|28.0338|-15.4998|18766
35022|Santa Lucía de Tirajana|27.9121|-15.5407|78584
35023|Santa María de Guía de Gran Canaria|28.1389|-15.6328|14311
35024|Teguise|29.0611|-13.5597|24027
35025|Tejeda|27.9974|-15.6139|1806
35026|Telde|27.9985|-15.4167|104168
35027|Teror|28.0590|-15.5476|13211
35028|Tías|28.9531|-13.6531|21613
35029|Tinajo|29.0500|-13.6500|6939
35030|Tuineje|28.3167|-14.0500|16834
35032|Valleseco|28.0499|-15.5749|3775
35031|Valsequillo de Gran Canaria|27.9808|-15.4989|9869
35033|Vega de San Mateo|28.0106|-15.5325|7899
35034|Yaiza|28.9550|-13.7667|18842
36020|Agolada|42.7622|-8.0197|2225|Golada
36001|Arbo|42.1123|-8.3124|2603
36003|Baiona|42.1199|-8.8501|12361|Bayona
36002|Barro|42.5250|-8.6472|3674
36004|Bueu|42.3249|-8.7859|11836
36005|Caldas de Reis|42.6028|-8.6383|9615
36006|Cambados|42.5144|-8.8138|13863
36007|Campo Lameiro|42.5379|-8.5100|1667|O Campo Lameiro
36008|Cangas|42.2779|-8.7898|26711
36009|A Cañiza|42.2128|-8.2744|4990|La Cañiza
36010|Catoira|42.6611|-8.7149|3274|Catoria
36902|Cerdedo-Cotobade|42.4719|-8.4819|5671
36013|Covelo|42.2314|-8.3632|2472
36014|Crecente|42.1525|-8.2225|1921|Creciente
36015|Cuntis|42.6353|-8.5618|4469
36016|Dozón|42.5953|-8.0467|961
36017|A Estrada|42.6892|-8.4872|20112|La Estrada
36018|Forcarei|42.5922|-8.3501|3067|Forcarey
36019|Fornelos de Montes|42.3403|-8.4514|1614
36021|Gondomar|42.1108|-8.7614|15066
36022|O Grove|42.4953|-8.8641|10877|El Grove|Grove
36023|A Guarda|41.9016|-8.8754|9970|La Guardia
36901|A Illa de Arousa|42.5544|-8.8639|4813|Isla de Arosa
36024|Lalín|42.6614|-8.1110|20292
36025|A Lama|42.3969|-8.4423|2437|La Lama
36026|Marín|42.3928|-8.6989|23991
36027|Meaño|42.4452|-8.7825|5235
36028|Meis|42.4997|-8.7249|4682
36029|Moaña|42.3072|-8.7375|19320
36030|Mondariz|42.2391|-8.4532|4456
36031|Mondariz-Balneario|42.2197|-8.4714|742
36032|Moraña|42.5627|-8.5856|4131
36033|Mos|42.2138|-8.6312|15233
36034|As Neves|42.0881|-8.4150|3657
36035|Nigrán|42.1416|-8.8066|18174
36036|Oia|42.0325|-8.8442|3062|Oya
36037|Pazos de Borbén|42.2934|-8.5321|3046
36041|Poio|42.4408|-8.7014|17434|Poyo
36043|Ponte Caldelas|42.3888|-8.5022|5609|Puentecaldelas
36042|Ponteareas|42.1753|-8.5049|23211|Puenteareas
36044|Pontecesures|42.7208|-8.6530|3076|Puentecesures
36038|Pontevedra|42.4336|-8.6475|83316
36039|O Porriño|42.1619|-8.6202|20965|Porriño
36040|Portas|42.5640|-8.6571|2748|Portes
36045|Redondela|42.2833|-8.6000|28874
36046|Ribadumia|42.5148|-8.7588|5171
36047|Rodeiro|42.6493|-7.9472|2232
36048|O Rosal|41.9357|-8.8251|6548|El Rosal
36049|Salceda de Caselas|42.1022|-8.5578|9409
36050|Salvaterra de Miño|42.0831|-8.4981|10617|Salvatierra de Miño
36051|Sanxenxo|42.3995|-8.8068|17990|Sangenjo
36052|Silleda|42.6980|-8.2466|8917
36053|Soutomaior|42.3386|-8.5727|7589|Sotomayor
36054|Tomiño|41.9961|-8.7314|13738
36055|Tui|42.0481|-8.6444|17468|Tuy
36056|Valga|42.6893|-8.6481|5779
36057|Vigo|42.2358|-8.7267|294489
36059|Vila de Cruces|42.7951|-8.1683|4967|Villa de Cruces
36058|Vilaboa|42.3597|-8.6381|5856
36060|Vilagarcía de Arousa|42.5951|-8.7431|37975|Villagarcía de Arosa
36061|Vilanova de Arousa|42.5626|-8.8299|10182|Villanueva de Arosa
37001|Abusejo|40.7097|-6.1400|148
37002|Agallas|40.4486|-6.4422|122
37003|Ahigal de los Aceiteros|40.8753|-6.7478|93|La Figal de los Aceiteros
37004|Ahigal de Villarino|41.1583|-6.3811|30|La Figal de Villarinu
37005|La Alameda de Gardón|40.6508|-6.7586|67
37006|La Alamedilla|40.4719|-6.8269|94
37007|Alaraz|40.7475|-5.2881|444
37008|Alba de Tormes|40.8247|-5.5161|5099
37009|Alba de Yeltes|40.6711|-6.3186|205
37010|La Alberca|40.4892|-6.1111|1034
37011|La Alberguería de Argañán|40.4119|-6.8142|94
37012|Alconada|40.9114|-5.3633|130
37015|Aldea del Obispo|40.7072|-6.7922|245
37013|Aldeacipreste|40.3806|-5.8961|89
37014|Aldeadávila de la Ribera|41.2185|-6.6199|1094|Aldegadávila de la Rivera
37016|Aldealengua|40.9822|-5.5500|730
37017|Aldeanueva de Figueroa|41.1478|-5.5247|238
37018|Aldeanueva de la Sierra|40.6147|-6.0958|88
37019|Aldearrodrigo|41.1106|-5.8064|143
37020|Aldearrubia|41.0081|-5.4975|518
37021|Aldeaseca de Alba|40.8186|-5.4486|65
37022|Aldeaseca de la Frontera|40.9417|-5.2078|241
37023|Aldeatejada|40.9233|-5.6925|2662
37024|Aldeavieja de Tormes|40.5833|-5.6172|100
37025|Aldehuela de la Bóveda|40.8444|-6.0486|260
37026|Aldehuela de Yeltes|40.6633|-6.2439|176
37027|Almenara de Tormes|41.0642|-5.8233|302
37028|Almendra|41.2297|-6.3411|129
37029|Anaya de Alba|40.7286|-5.4922|190
37030|Añover de Tormes|41.1361|-5.9150|84
37031|Arabayona de Mógica|41.0472|-5.3861|318
37032|Arapiles|40.8942|-5.6447|744
37033|Arcediano|41.0933|-5.5603|89
37034|El Arco|41.1132|-5.8256|85
37035|Armenteros|40.5939|-5.4494|156
37037|La Atalaya|40.5025|-6.4142|102
37038|Babilafuente|40.9772|-5.4256|924
37039|Bañobárez|40.8511|-6.6128|277
37040|Barbadillo|40.9319|-5.8814|391
37041|Barbalos|40.6769|-5.9431|70
37042|Barceo|41.0611|-6.4519|45
37044|Barruecopardo|41.0725|-6.6628|409|Berruecupardo
37045|La Bastida|40.5850|-6.0586|22
37046|Béjar|40.3847|-5.7619|11993
37047|Beleña|40.7511|-5.6275|258
37049|Bermellar|40.9986|-6.6711|129
37050|Berrocal de Huebra|40.7178|-5.9994|75
37051|Berrocal de Salvatierra|40.6333|-5.6894|74
37052|Boada|40.8161|-6.3058|259
37054|El Bodón|40.4878|-6.5764|247
37055|Bogajo|40.9067|-6.5308|124|Bogayu
37056|La Bouza|40.8353|-6.7953|48
37057|Bóveda del Río Almar|40.8567|-5.2106|186
37058|Brincones|41.1117|-6.3492|56
37059|Buenamadre|40.8575|-6.2497|108|Bonamadre
37060|Buenavista|40.7681|-5.6111|368
37061|El Cabaco|40.5658|-6.1286|227
37063|La Cabeza de Béjar|40.4956|-5.6629|55
37065|Cabeza del Caballo|41.1300|-6.5593|224|Cabeza'l Caballu
37062|Cabezabellosa de la Calzada|41.0436|-5.4903|73
37067|Cabrerizos|40.9792|-5.6128|4218
37068|Cabrillas|40.7414|-6.1803|316
37069|Calvarrasa de Abajo|40.9458|-5.5539|1240
37070|Calvarrasa de Arriba|40.9267|-5.5556|604
37071|La Calzada de Béjar|40.4117|-5.8172|80
37072|Calzada de Don Diego|40.9061|-5.9022|127
37073|Calzada de Valdunciel|41.0864|-5.7025|717
37074|Campillo de Azaba|40.5111|-6.6886|146
37077|El Campo de Peñaranda|40.9836|-5.2500|241
37078|Candelario|40.3681|-5.7444|832
37079|Canillas de Abajo|40.9289|-5.9289|64
37080|Cantagallo|40.3731|-5.8197|281
37081|Cantalapiedra|41.1253|-5.1833|884
37082|Cantalpino|41.0528|-5.3281|802
37083|Cantaracillo|40.9025|-5.1636|188
37085|Carbajosa de la Sagrada|40.9331|-5.6514|7791
37086|Carpio de Azaba|40.5958|-6.6467|110
37087|Carrascal de Barregas|40.9781|-5.7625|1456
37088|Carrascal del Obispo|40.7636|-5.9992|185
37089|Casafranca|40.5919|-5.7586|69
37090|Las Casas del Conde|40.5075|-6.0417|63
37091|Casillas de Flores|40.3836|-6.7500|171
37092|Castellanos de Moriscos|41.0197|-5.5925|3149
37185|Castellanos de Villiquera|41.0497|-5.6394|727
37096|Castillejo de Martín Viejo|40.7006|-6.6458|193
37097|Castraz|40.7056|-6.3347|33
37098|Cepeda|40.4653|-6.0414|287
37099|Cereceda de la Sierra|40.5663|-6.0917|55
37100|Cerezal de Peñahorcada|41.1304|-6.6536|64|Zrezal de Peñaenforcada
37101|Cerralbo|40.9747|-6.5858|105
37102|El Cerro|40.3169|-5.9167|363
37103|Cespedosa de Tormes|40.5433|-5.5811|480
37114|Chagarcía Medianero|40.6486|-5.3822|68
37104|Cilleros de la Bastida|40.5761|-6.0611|21
37106|Cipérez|40.9628|-6.2639|233
37107|Ciudad Rodrigo|40.5992|-6.5289|11750
37108|Coca de Alba|40.8772|-5.3622|96
37109|Colmenar de Montemayor|40.3994|-5.9594|177
37110|Cordovilla|40.9508|-5.4058|105
37112|Cristóbal|40.4694|-5.8896|158
37113|El Cubo de Don Sancho|40.8917|-6.3072|373
37115|Dios le Guarde|40.6425|-6.3144|116
37116|Doñinos de Ledesma|41.0128|-6.0333|62
37117|Doñinos de Salamanca|40.9608|-5.7467|2273
37118|Éjeme|40.7664|-5.5389|139
37120|Encina de San Silvestre|41.0139|-6.0931|111
37119|La Encina|40.4989|-6.5317|95
37121|Encinas de Abajo|40.9350|-5.4708|615
37122|Encinas de Arriba|40.7714|-5.5586|223
37123|Encinasola de los Comendadores|41.0306|-6.5325|146
37124|Endrinal|40.5911|-5.8047|201
37125|Escurial de la Sierra|40.6172|-5.9556|233
37126|Espadaña|41.0625|-6.2858|32
37127|Espeja|40.5636|-6.7167|212
37128|Espino de la Orbada|41.1072|-5.4244|238
37129|Florida de Liébana|41.0267|-5.7508|248|Florida de Llébana
37130|Forfoleda|41.0953|-5.7606|207
37131|Frades de la Sierra|40.6589|-5.7775|163
37132|La Fregeneda|40.9878|-6.8672|296|La Freisneda
37133|Fresnedoso|40.4361|-5.7103|94
37134|Fresno Alhándiga|40.7128|-5.6161|194
37135|La Fuente de San Esteban|40.8003|-6.2500|1293
37136|Fuenteguinaldo|40.4289|-6.6767|635
37137|Fuenteliante|40.8739|-6.5731|80
37138|Fuenterroble de Salvatierra|40.5647|-5.7339|260
37139|Fuentes de Béjar|40.5083|-5.6926|239
37140|Fuentes de Oñoro|40.5883|-6.8131|1012
37141|Gajates|40.7828|-5.3669|135
37142|Galindo y Perahuy|40.9433|-5.8717|713
37143|Galinduste|40.6631|-5.5419|401
37144|Galisancho|40.7422|-5.5547|320
37145|Gallegos de Argañán|40.6311|-6.7047|259
37146|Gallegos de Solmirón|40.5367|-5.4478|109
37147|Garcibuey|40.5167|-5.9833|186
37148|Garcihernández|40.8603|-5.4325|412
37149|Garcirrey|40.9008|-6.1300|52
37150|Gejuelo del Barro|41.0772|-6.1236|31
37151|Golpejas|40.9997|-5.9067|139|Golpeyas
37152|Gomecello|41.0431|-5.5344|411
37154|Guadramiro|41.0175|-6.4933|120|Guadramiru
37155|Guijo de Ávila|40.5317|-5.6400|81
37156|Guijuelo|40.5575|-5.6714|5427
37157|Herguijuela de Ciudad Rodrigo|40.4472|-6.5181|65
37158|Herguijuela de la Sierra|40.4456|-6.0742|222
37159|Herguijuela del Campo|40.6336|-5.8667|60
37160|Hinojosa de Duero|40.9861|-6.7961|562
37161|Horcajo de Montemayor|40.4214|-5.8936|107
37162|Horcajo Medianero|40.6403|-5.4064|199
37163|La Hoya|40.4069|-5.6992|32
37164|Huerta|40.9681|-5.4689|282
37165|Iruelos|41.1400|-6.3289|29
37166|Ituero de Azaba|40.4844|-6.6917|189
37167|Juzbado|41.0778|-5.8614|176
37168|Lagunilla|40.3250|-5.9717|414
37169|Larrodrigo|40.7367|-5.4492|178
37170|Ledesma|41.0875|-6.0000|1480
37171|Ledrada|40.4694|-5.7200|476
37172|Linares de Riofrío|40.5842|-5.9208|924|Llinares de Riofrío
37173|Lumbrales|40.9356|-6.7178|1507|Llimiares
37175|Machacón|40.9267|-5.5244|442
37174|Macotera|40.8311|-5.2869|1009
37176|Madroñal|40.4644|-6.0619|128
37177|El Maíllo|40.5661|-6.1808|282
37178|Malpartida|40.7628|-5.2333|74
37179|Mancera de Abajo|40.8400|-5.1983|192
37180|El Manzano|41.1742|-6.2878|54
37181|Martiago|40.4525|-6.4900|252
37183|Martín de Yeltes|40.7744|-6.2906|383
37182|Martinamor|40.8064|-5.6000|91
37184|Masueco|41.2034|-6.5889|240
37186|La Mata de Ledesma|41.0006|-5.9708|98
37187|Matilla de los Caños del Río|40.8261|-5.9431|607
37188|La Maya|40.6875|-5.6136|163
37189|Membribe de la Sierra|40.6898|-5.8068|101
37190|Mieza|41.1631|-6.6902|170
37191|El Milano|41.0925|-6.5987|88
37192|Miranda de Azán|40.8872|-5.6814|451
37193|Miranda del Castañar|40.4842|-5.9972|361
37194|Mogarraz|40.4919|-6.0528|236
37195|Molinillo|40.4689|-5.9450|43
37196|Monforte de la Sierra|40.4819|-6.0619|50
37197|Monleón|40.5858|-5.8472|88
37198|Monleras|41.1858|-6.2269|241
37199|Monsagro|40.5047|-6.2717|129
37200|Montejo|40.6317|-5.6236|186
37201|Montemayor del Río|40.3486|-5.8953|245
37202|Monterrubio de Armuña|41.0281|-5.6425|1321
37203|Monterrubio de la Sierra|40.7578|-5.6928|150
37204|Morasverdes|40.6017|-6.2756|230
37205|Morille|40.8061|-5.6975|221
37206|Moríñigo|40.9694|-5.4139|93
37207|Moriscos|41.0083|-5.5833|577
37208|Moronta|40.9781|-6.4322|73
37209|Mozárbez|40.8578|-5.6514|510
37211|Narros de Matalayegua|40.6986|-5.9278|187
37213|Nava de Béjar|40.4750|-5.6778|74|Nava de Béxar
37214|Nava de Francia|40.5356|-6.1169|116
37215|Nava de Sotrobal|40.8894|-5.2864|147
37212|Navacarros|40.3969|-5.7144|141
37216|Navales|40.7889|-5.4800|312
37217|Navalmoral de Béjar|40.4219|-5.7828|57|Navalmoral de Béxar
37218|Navamorales|40.4761|-5.4761|45
37219|Navarredonda de la Rinconada|40.6067|-6.0067|153
37221|Navasfrías|40.2964|-6.8200|365
37222|Negrilla de Palencia|41.0919|-5.5933|78
37223|Olmedo de Camaces|40.8792|-6.6236|87
37224|La Orbada|41.1033|-5.4853|177
37225|Pajares de la Laguna|41.1047|-5.5094|110
37226|Palacios del Arzobispo|41.1656|-5.8900|141
37228|Palaciosrubios|41.0525|-5.1953|283
37229|Palencia de Negrilla|41.0939|-5.6022|140
37230|Parada de Arriba|40.9869|-5.7928|264
37231|Parada de Rubiales|41.1472|-5.4342|237
37232|Paradinas de San Juan|40.9836|-5.1533|380
37233|Pastores|40.5150|-6.5094|52
37234|El Payo|40.2875|-6.7267|302
37235|Pedraza de Alba|40.7542|-5.3750|214
37236|Pedrosillo de Alba|40.8227|-5.3954|123
37237|Pedrosillo de los Aires|40.7144|-5.7050|312|Pedrosieḷḷu de los Aires
37238|Pedrosillo el Ralo|41.0628|-5.5497|147|Pedrosieḷḷu
37239|El Pedroso de la Armuña|41.0803|-5.3997|202
37240|Pelabravo|40.9367|-5.5781|1427
37241|Pelarrodríguez|40.8875|-6.2128|161
37242|Pelayos|40.6492|-5.5747|72
37243|La Peña|41.1748|-6.5193|69
37244|Peñacaballera|40.3442|-5.8606|149
37245|Peñaparda|40.3208|-6.6703|298
37246|Peñaranda de Bracamonte|40.9017|-5.1980|6162
37247|Peñarandilla|40.8822|-5.3919|171
37248|Peralejos de Abajo|41.0056|-6.3644|162
37249|Peralejos de Arriba|41.0056|-6.3558|38
37250|Pereña de la Ribera|41.2400|-6.5242|300|Pereña de la Rivera
37251|Peromingo|40.4644|-5.7725|121
37252|Pinedas|40.4453|-5.9600|88
37253|El Pino de Tormes|41.0400|-5.7928|147
37254|Pitiegua|41.0625|-5.4661|173
37255|Pizarral|40.6161|-5.6528|70
37256|Poveda de las Cintas|41.0475|-5.2622|197
37257|Pozos de Hinojo|40.9122|-6.4111|48
37258|Puebla de Azaba|40.4475|-6.7478|145
37259|Puebla de San Medel|40.5114|-5.7364|32
37260|Puebla de Yeltes|40.6264|-6.1822|136
37261|Puente del Congosto|40.4895|-5.5253|236
37262|Puertas|41.0969|-6.2881|66
37263|Puerto de Béjar|40.3514|-5.8375|342
37264|Puerto Seguro|40.8264|-6.7611|52
37265|Rágama|40.9969|-5.1278|196
37266|La Redonda|40.9089|-6.7492|61
37267|Retortillo|40.8017|-6.3597|172
37268|La Rinconada de la Sierra|40.6169|-6.0167|97
37269|Robleda|40.3850|-6.6083|453|Robrea
37270|Robliza de Cojos|40.8675|-5.9769|185
37271|Rollán|40.9617|-5.9381|317
37272|Saelices el Chico|40.6683|-6.6342|175
37273|La Sagrada|40.7450|-6.0725|78
37303|El Sahugo|40.4142|-6.5442|178
37274|Salamanca|40.9650|-5.6642|146110
37275|Saldeana|41.0206|-6.6400|96
37276|Salmoral|40.8014|-5.2203|107
37277|Salvatierra de Tormes|40.5894|-5.5964|66
37278|San Cristóbal de la Cuesta|41.0303|-5.6186|1169
37284|San Esteban de la Sierra|40.5068|-5.9057|343
37285|San Felices de los Gallegos|40.8500|-6.7087|355
37286|San Martín del Castañar|40.5231|-6.0647|233|Samartín del Castañar
37287|San Miguel de Valero|40.5428|-5.9223|308
37036|San Miguel del Robledo|40.5370|-6.0455|52
37288|San Morales|40.9931|-5.5028|346
37289|San Muñoz|40.7822|-6.1272|192
37291|San Pedro de Rozados|40.7903|-5.7375|273
37290|San Pedro del Valle|41.0331|-5.8603|143
37292|San Pelayo de Guareña|41.1158|-5.8603|86
37280|Sanchón de la Ribera|41.0878|-6.4133|66
37281|Sanchón de la Sagrada|40.7447|-6.0247|43
37282|Sanchotello|40.4381|-5.7528|206
37279|Sancti-Spíritus|40.7053|-6.4008|713
37283|Sando|40.9672|-6.1114|111
37293|Santa María de Sando|40.9783|-6.1133|91
37294|Santa Marta de Tormes|40.9494|-5.6325|14976
37296|Santiago de la Puebla|40.8019|-5.2786|280
37297|Santibáñez de Béjar|40.4881|-5.6117|448
37298|Santibáñez de la Sierra|40.4948|-5.9155|142
37299|Santiz|41.2056|-5.8936|225
37300|Los Santos|40.5452|-5.7979|570
37301|Sardón de los Frailes|41.2119|-6.2708|98
37302|Saucelle|41.0475|-6.7531|242|Sauciellu de la Rivera
37304|Sepulcro-Hilario|40.6981|-6.1881|153|Sepulcru-Hilario
37305|Sequeros|40.5164|-6.0244|216
37306|Serradilla del Arroyo|40.5214|-6.3600|239
37307|Serradilla del Llano|40.5006|-6.3558|136
37309|La Sierpe|40.6450|-5.8556|41
37310|Sieteiglesias de Tormes|40.7417|-5.5775|193
37311|Sobradillo|40.9169|-6.7994|170
37312|Sorihuela|40.4444|-5.6778|255
37313|Sotoserrano|40.4353|-6.0325|498
37314|Tabera de Abajo|40.9103|-6.0011|97
37315|La Tala|40.5897|-5.5375|77
37316|Tamames|40.6569|-6.1042|781
37317|Tarazona de Guareña|41.1708|-5.2497|261
37318|Tardáguila|41.1147|-5.5756|193
37319|El Tejado|40.4425|-5.5390|83
37320|Tejeda y Segoyuela|40.6322|-6.0225|97
37321|Tenebrón|40.6239|-6.3550|123
37322|Terradillos|40.8397|-5.5425|3314
37323|Topas|41.1569|-5.6339|518
37324|Tordillos|40.8542|-5.3525|306
37325|El Tornadizo|40.5428|-5.8925|88
37327|Torresmenudas|41.1022|-5.7861|192
37328|Trabanca|41.2331|-6.3847|159
37329|Tremedal de Tormes|41.0756|-6.1814|34
37330|Valdecarros|40.7696|-5.4224|296
37331|Valdefuentes de Sangusín|40.4653|-5.8297|182
37332|Valdehijaderos|40.4188|-5.8485|84
37333|Valdelacasa|40.5063|-5.7635|187
37334|Valdelageve|40.3692|-5.9894|66
37335|Valdelosa|41.1708|-5.7828|386
37336|Valdemierque|40.8214|-5.5833|58
37337|Valderrodrigo|41.0656|-6.5086|129
37338|Valdunciel|41.0853|-5.6714|125
37339|Valero|40.5356|-5.9425|269
37343|Vallejera de Riofrío|40.4092|-5.7214|67
37340|Valsalabroso|41.1092|-6.5014|120
37341|Valverde de Valdelacasa|40.4814|-5.7817|57
37342|Valverdón|41.0475|-5.7703|266
37344|Vecinos|40.7794|-5.8769|231
37345|Vega de Tirados|41.0253|-5.8869|139
37346|Las Veguillas|40.7164|-5.8311|275
37347|La Vellés|41.0739|-5.5681|566
37348|Ventosa del Río Almar|40.9289|-5.3481|97
37349|La Vídola|41.1533|-6.4878|95
37351|Villaflores|41.0839|-5.2333|255|Vilaflores
37352|Villagonzalo de Tormes|40.8925|-5.4981|212
37353|Villalba de los Llanos|40.8008|-5.9731|107
37354|Villamayor|41.0008|-5.6897|7728
37355|Villanueva del Conde|40.5103|-6.0103|172
37356|Villar de Argañán|40.6778|-6.7075|95
37357|Villar de Ciervo|40.7336|-6.7333|253
37358|Villar de Gallimazo|40.9542|-5.2889|192
37359|Villar de la Yegua|40.7169|-6.7000|151
37360|Villar de Peralonso|41.0336|-6.2167|212
37361|Villar de Samaniego|41.1169|-6.4333|79
37362|Villares de la Reina|41.0028|-5.6333|6784
37363|Villares de Yeltes|40.8808|-6.4203|102
37364|Villarino de los Aires|41.2692|-6.4692|727
37365|Villarmayor|41.0147|-5.9719|139
37366|Villarmuerto|41.0564|-6.3622|38
37367|Villasbuenas|41.0622|-6.5958|158
37368|Villasdardo|41.0044|-6.1631|22
37369|Villaseco de los Gamitos|41.0361|-6.1358|138
37370|Villaseco de los Reyes|41.1500|-6.1831|296
37371|Villasrubias|40.3381|-6.6403|231
37372|Villaverde de Guareña|41.0639|-5.5264|128
37373|Villavieja de Yeltes|40.8669|-6.4667|676
37374|Villoria|40.9944|-5.3747|1239
37375|Villoruela|41.0081|-5.3944|729
37350|Vilvestre|41.1031|-6.7186|374|Vilviestri de la Rivera
37376|Vitigudino|41.0100|-6.4333|2344
37377|Yecla de Yeltes|40.9806|-6.4389|223
37378|Zamarra|40.5183|-6.4539|70
37379|Zamayón|41.1483|-5.8303|192
37380|Zarapicos|41.0597|-5.8311|50
37381|La Zarza de Pumareda|41.1630|-6.6268|131
37382|Zorita de la Frontera|41.0139|-5.1963|140
38001|Adeje|28.1167|-16.7167|50021
38002|Agulo|28.1882|-17.1946|1078
38003|Alajeró|28.0620|-17.2384|2061
38004|Arafo|28.3404|-16.4173|5945
38005|Arico|28.1904|-16.4977|9505
38006|Arona|28.0996|-16.6809|87793
38007|Barlovento|28.8272|-17.8038|2108
38008|Breña Alta|28.6615|-17.7851|7487
38009|Breña Baja|28.6443|-17.7733|6159
38010|Buenavista del Norte|28.3721|-16.8514|4695
38011|Candelaria|28.3547|-16.3710|29023
38012|Fasnia|28.2401|-16.4400|3145
38013|Frontera|27.7535|-18.0108|4660|La Frontera
38014|Fuencaliente de la Palma|28.4934|-17.8450|1965
38015|Garachico|28.3737|-16.7640|4940
38016|Garafía|28.8042|-17.9167|2015
38017|Granadilla de Abona|28.1167|-16.5833|58752
38018|La Guancha|28.3738|-16.6516|5667
38019|Guía de Isora|28.2110|-16.7784|22654
38020|Güímar|28.3150|-16.4100|22009
38021|Hermigua|28.1630|-17.1985|1961
38022|Icod de los Vinos|28.3500|-16.7000|24616
38024|Los Llanos de Aridane|28.6582|-17.9142|20582
38025|La Matanza de Acentejo|28.4403|-16.4389|9089
38026|La Orotava|28.3667|-16.5167|42514
38027|El Paso|28.6513|-17.8806|8290
38901|El Pinar de El Hierro|27.7014|-17.9800|2042
38028|Puerto de la Cruz|28.4167|-16.5500|31137
38029|Puntagorda|28.7733|-17.9882|2345
38030|Puntallana|28.7388|-17.7453|2790
38031|Los Realejos|28.3500|-16.6000|37867
38032|El Rosario|28.4328|-16.3682|17958
38033|San Andrés y Sauces|28.8045|-17.7742|4350
38023|San Cristóbal de La Laguna|28.4853|-16.3167|161108
38034|San Juan de la Rambla|28.3931|-16.6492|4987
38035|San Miguel de Abona|28.0975|-16.6172|23960
38036|San Sebastián de la Gomera|28.0922|-17.1100|9574
38037|Santa Cruz de la Palma|28.6825|-17.7650|15690
38038|Santa Cruz de Tenerife|28.4667|-16.2500|211957|Santa Cruz Tenerifekoa
38039|Santa Úrsula|28.4253|-16.4917|15429
38040|Santiago del Teide|28.2957|-16.8145|12582
38041|El Sauzal|28.4799|-16.4357|9345
38042|Los Silos|28.3658|-16.8167|4773
38043|Tacoronte|28.4805|-16.4138|24619
38044|El Tanque|28.3563|-16.7798|2787
38045|Tazacorte|28.6425|-17.9318|4549
38046|Tegueste|28.5233|-16.3408|11490
38047|Tijarafe|28.7130|-17.9568|2733
38049|Valle Gran Rey|28.1167|-17.3167|4830
38050|Vallehermoso|28.1799|-17.2647|2938
38048|Valverde|27.8097|-17.9151|5338
38051|La Victoria de Acentejo|28.4348|-16.4682|9448
38052|Vilaflor de Chasna|28.1591|-16.6365|1930
38053|Villa de Mazo|28.6049|-17.7770|5131
39001|Alfoz de Lloredo|43.3792|-4.1756|2500
39002|Ampuero|43.3447|-3.4144|4518
39003|Anievas|43.2031|-4.0006|274
39004|Arenas de Iguña|43.1881|-4.0483|1735
39005|Argoños|43.4600|-3.4914|1884
39006|Arnuero|43.4731|-3.5631|2300
39007|Arredondo|43.2758|-3.6006|478
39008|El Astillero|43.4017|-3.8194|18448
39009|Bárcena de Cicero|43.4250|-3.5211|4907
39010|Bárcena de Pie de Concha|43.1267|-4.0547|675
39011|Bareyo|43.4822|-3.6108|2124
39012|Cabezón de la Sal|43.3075|-4.2325|8226
39013|Cabezón de Liébana|43.1356|-4.5750|530
39014|Cabuérniga|43.2278|-4.3003|976
39015|Camaleño|43.1519|-4.6922|964
39016|Camargo|43.4267|-3.8553|30577
39027|Campoo de Enmedio|42.9817|-4.1472|3729
39017|Campoo de Yuso|43.0172|-4.0036|680
39018|Cartes|43.3256|-4.0681|5874
39019|Castañeda|43.3114|-3.9281|3290
39020|Castro-Urdiales|43.3844|-3.2150|33450
39021|Cieza|43.2222|-4.0875|528
39022|Cillorigo de Liébana|43.1783|-4.5992|1386
39023|Colindres|43.3950|-3.4498|8570
39024|Comillas|43.3869|-4.2894|2075
39025|Los Corrales de Buelna|43.2617|-4.0653|10958
39026|Corvera de Toranzo|43.2103|-3.9372|2204
39028|Entrambasaguas|43.3778|-3.6767|5693
39029|Escalante|43.4356|-3.5131|716
39030|Guriezo|43.3419|-3.3267|2496
39031|Hazas de Cesto|43.3969|-3.5897|1957
39032|Hermandad de Campoo de Suso|43.0225|-4.2244|1619
39033|Herrerías|43.3156|-4.4647|570
39034|Lamasón|43.2536|-4.4819|237
39035|Laredo|43.4144|-3.4100|10698|Santoña
39036|Liendo|43.3950|-3.3789|1218
39037|Liérganes|43.3433|-3.7411|2365
39038|Limpias|43.3628|-3.4247|1983
39039|Luena|43.0958|-3.9003|600
39040|Marina de Cudeyo|43.4206|-3.7542|5221
39041|Mazcuerras|43.2986|-4.2067|2068
39042|Medio Cudeyo|43.3814|-3.7317|7775
39043|Meruelo|43.4569|-3.5739|2321
39044|Miengo|43.4281|-3.9911|5265
39045|Miera|43.2756|-3.7119|397
39046|Molledo|43.1542|-4.0408|1482
39047|Noja|43.4814|-3.5186|2661
39048|Penagos|43.3378|-3.8081|2253
39049|Peñarrubia|43.2558|-4.5786|301
39050|Pesaguero|43.0775|-4.5394|275
39051|Pesquera|43.0836|-4.0756|72
39052|Piélagos|43.3578|-3.9581|26901
39053|Polaciones|43.1019|-4.4131|209
39054|Polanco|43.3858|-4.0150|6304
39055|Potes|43.1536|-4.6233|1323
39056|Puente Viesgo|43.3006|-3.9631|2893
39057|Ramales de la Victoria|43.2589|-3.4639|3099
39058|Rasines|43.3081|-3.4247|980
39059|Reinosa|43.0019|-4.1378|8570
39060|Reocín|43.3599|-4.0876|8389
39061|Ribamontán al Mar|43.4556|-3.6700|4605
39062|Ribamontán al Monte|43.4081|-3.6614|2535
39063|Rionansa|43.2547|-4.4025|1022
39064|Riotuerto|43.3533|-3.7047|1682
39065|Las Rozas de Valdearroyo|42.9739|-4.0269|258
39066|Ruente|43.2594|-4.2661|1083
39067|Ruesga|43.2825|-3.5600|810
39068|Ruiloba|43.3817|-4.2508|769
39069|San Felices de Buelna|43.2753|-4.0486|2379
39070|San Miguel de Aguayo|43.0572|-4.0208|164
39071|San Pedro del Romeral|43.1167|-3.8172|432
39072|San Roque de Riomiera|43.2358|-3.7003|333
39080|San Vicente de la Barquera|43.3832|-4.4003|3995
39073|Santa Cruz de Bezana|43.4442|-3.9031|13904
39074|Santa María de Cayón|43.3114|-3.8525|9538
39075|Santander|43.4667|-3.8000|175425
39076|Santillana del Mar|43.3933|-4.1047|4189
39077|Santiurde de Reinosa|43.0622|-4.0817|254
39078|Santiurde de Toranzo|43.2397|-3.9378|1726
39079|Santoña|43.4414|-3.4575|10835
39081|Saro|43.2625|-3.8283|480
39082|Selaya|43.2183|-3.8056|1868
39083|Soba|43.1881|-3.5172|1057
39084|Solórzano|43.3869|-3.5864|1144
39085|Suances|43.4283|-4.0436|9034
39086|Los Tojos|43.1561|-4.2517|369
39087|Torrelavega|43.3506|-4.0492|51796
39088|Tresviso|43.2583|-4.6667|52|Tresvisu
39089|Tudanca|43.1628|-4.3689|154
39090|Udías|43.3383|-4.2469|960
39095|Val de San Vicente|43.3775|-4.4836|2775
39091|Valdáliga|43.3292|-4.3492|2135
39092|Valdeolea|42.8778|-4.1622|869
39093|Valdeprado del Río|42.9106|-4.0756|306
39094|Valderredible|42.8072|-3.9392|922
39101|Valle de Villaverde|43.2323|-3.2824|249|Villaverde Turtzioz
39096|Vega de Liébana|43.0994|-4.6456|676
39097|Vega de Pas|43.1594|-3.7811|776
39098|Villacarriedo|43.2294|-3.8092|1670
39099|Villaescusa|42.9630|-4.1666|3970
39100|Villafufre|43.2672|-3.8919|1022
39102|Voto|43.3558|-3.4956|2971
40001|Abades|40.9150|-4.2683|849
40002|Adrada de Pirón|41.0519|-4.0508|39
40003|Adrados|41.3683|-4.1128|113
40004|Aguilafuente|41.2264|-4.1128|564
40005|Alconada de Maderuelo|41.4500|-3.4858|23
40012|Aldea Real|41.1850|-4.1656|275
40006|Aldealcorvo|41.2439|-3.7919|15
40007|Aldealengua de Pedraza|41.0644|-3.8061|78
40008|Aldealengua de Santa María|41.4619|-3.4667|50
40009|Aldeanueva de la Serrezuela|41.4603|-3.7811|42
40010|Aldeanueva del Codonal|41.0833|-4.5433|105
40013|Aldeasoña|41.4725|-4.0561|61
40014|Aldehorno|41.5128|-3.7781|64
40015|Aldehuela del Codonal|41.0550|-4.5378|24
40016|Aldeonte|41.3508|-3.6778|55
40017|Anaya|40.9914|-4.3086|111
40018|Añe|41.0383|-4.2964|67
40019|Arahuetes|41.1378|-3.8567|31
40020|Arcones|41.1186|-3.7242|179
40021|Arevalillo de Cega|41.1614|-3.8886|18
40022|Armuña|41.0772|-4.3192|253
40024|Ayllón|41.4194|-3.3764|1110
40025|Barbolla|41.3258|-3.6725|142
40026|Basardilla|41.0272|-4.0247|136
40028|Bercial|40.9061|-4.4364|102
40029|Bercimuel|41.3989|-3.5700|34
40030|Bernardos|41.1278|-4.3511|462
40031|Bernuy de Porreros|40.9997|-4.1167|1342
40032|Boceguillas|41.3375|-3.6400|746
40033|Brieva|41.0344|-4.0533|93
40034|Caballar|41.1208|-3.9650|78
40035|Cabañas de Polendos|41.0669|-4.1100|202
40036|Cabezuela|41.2353|-3.9328|655
40037|Calabazas de Fuentidueña|41.4456|-4.0103|23
40039|Campo de San Pedro|41.4294|-3.5456|257
40040|Cantalejo|41.2589|-3.9286|3619
40041|Cantimpalos|41.0739|-4.1589|1533
40161|Carabias|41.4419|-3.6732|55
40043|Carbonero el Mayor|41.1225|-4.2661|2463
40044|Carrascal del Río|41.3675|-3.8975|143
40045|Casla|41.1658|-3.6564|155
40046|Castillejo de Mesleón|41.2806|-3.6014|119
40047|Castro de Fuentidueña|41.4203|-3.8544|41
40048|Castrojimeno|41.3969|-3.8458|27
40049|Castroserna de Abajo|41.2072|-3.7350|31
40051|Castroserracín|41.3936|-3.8025|24
40052|Cedillo de la Torre|41.4250|-3.6047|80
40053|Cerezo de Abajo|41.2178|-3.5922|150
40054|Cerezo de Arriba|41.2378|-3.5575|119
40065|Chañe|41.3375|-4.4289|739
40055|Cilleruelo de San Mamés|41.4319|-3.5664|41
40056|Cobos de Fuentidueña|41.3828|-3.9272|25
40057|Coca|41.2178|-4.5222|1706
40058|Codorniz|41.0667|-4.5994|294
40059|Collado Hermoso|41.0392|-3.9183|116
40060|Condado de Castilnovo|41.2381|-3.7417|74
40061|Corral de Ayllón|41.3913|-3.4593|76
40902|Cozuelos de Fuentidueña|41.3914|-4.0956|102
40062|Cubillo|41.1214|-3.9086|74
40063|Cuéllar|41.4009|-4.3136|9527
40905|Cuevas de Provanco|41.5422|-3.9622|131
40068|Domingo García|41.1156|-4.3789|29
40069|Donhierro|41.1161|-4.6961|73
40070|Duruelo|41.2358|-3.6486|172
40071|Encinas|41.3756|-3.6672|39
40072|Encinillas|41.0178|-4.1581|358
40073|Escalona del Prado|41.1667|-4.1228|475
40074|Escarabajosa de Cabezas|41.1044|-4.1933|269
40075|Escobar de Polendos|41.0906|-4.1308|172
40076|El Espinar|40.7186|-4.2478|10409
40077|Espirdo|40.9975|-4.0733|1613
40078|Fresneda de Cuéllar|41.3186|-4.4492|162
40079|Fresno de Cantespino|41.3694|-3.4972|290
40080|Fresno de la Fuente|41.3925|-3.6442|75
40081|Frumales|41.3836|-4.1861|120
40082|Fuente de Santa Cruz|41.2092|-4.6344|105
40083|Fuente el Olmo de Fuentidueña|41.3800|-4.0000|396
40084|Fuente el Olmo de Íscar|41.2803|-4.4944|51
40086|Fuentepelayo|41.2217|-4.1758|764
40087|Fuentepiñel|41.3997|-4.0422|63
40088|Fuenterrebollo|41.2969|-3.9303|313
40089|Fuentesaúco de Fuentidueña|41.4245|-4.0625|216
40091|Fuentesoto|41.4564|-3.9183|96
40092|Fuentidueña|41.4422|-3.9800|125
40093|Gallegos|41.0744|-3.7858|96
40094|Garcillán|40.9781|-4.2661|513
40095|Gomezserracín|41.2886|-4.3264|614
40097|Grajera|41.3728|-3.6128|252
40099|Honrubia de la Cuesta|41.5106|-3.7044|49
40100|Hontalbilla|41.3450|-4.1214|277
40101|Hontanares de Eresma|40.9828|-4.2033|1680
40103|Los Huertos|41.0103|-4.2189|173
40104|Ituero y Lama|40.8006|-4.3783|492
40105|Juarros de Riomoros|40.9461|-4.3086|53
40106|Juarros de Voltoya|41.0306|-4.5189|185
40107|Labajos|40.8431|-4.5197|105
40108|Laguna de Contreras|41.4944|-4.0289|111
40109|Languilla|41.4500|-3.4250|79
40110|Lastras de Cuéllar|41.2972|-4.1075|295
40111|Lastras del Pozo|40.8792|-4.3458|55
40112|La Lastrilla|40.9689|-4.1033|4781
40113|La Losa|40.8544|-4.1631|543
40115|Maderuelo|41.4872|-3.5208|100
40903|Marazoleja|40.9608|-4.3386|98
40118|Marazuela|40.9778|-4.3653|58
40119|Martín Miguel|40.9511|-4.2731|276
40120|Martín Muñoz de la Dehesa|41.0661|-4.6867|309
40121|Martín Muñoz de las Posadas|40.9961|-4.5958|251
40122|Marugán|40.8960|-4.3843|775
40124|Mata de Cuéllar|41.3964|-4.4714|261
40123|Matabuena|41.0958|-3.7572|204
40125|La Matilla|41.1911|-3.7950|72
40126|Melque de Cercos|41.0511|-4.4694|58
40127|Membibre de la Hoz|41.4497|-4.0950|42
40128|Migueláñez|41.1217|-4.3642|136
40129|Montejo de Arévalo|41.1400|-4.6647|158
40130|Montejo de la Vega de la Serrezuela|41.5481|-3.6525|121
40131|Monterrubio|40.8486|-4.3508|51
40132|Moral de Hornuez|41.4644|-3.6167|38
40134|Mozoncillo|41.1478|-4.1861|916
40135|Muñopedro|40.8881|-4.4717|298
40136|Muñoveros|41.1722|-3.9517|138
40138|Nava de la Asunción|41.1556|-4.4869|2806
40139|Navafría|41.0547|-3.8225|282
40140|Navalilla|41.3406|-3.9325|90
40141|Navalmanzano|41.2156|-4.2572|1041
40142|Navares de Ayuso|41.3728|-3.7064|58
40143|Navares de Enmedio|41.3811|-3.7231|90
40144|Navares de las Cuevas|41.4142|-3.7506|22
40145|Navas de Oro|41.1961|-4.4397|1305
40904|Navas de Riofrío|40.8642|-4.1378|430
40146|Navas de San Antonio|40.7611|-4.3300|368
40148|Nieva|41.0806|-4.4264|256
40149|Olombrada|41.4167|-4.1583|490
40150|Orejana|41.1633|-3.7783|61
40151|Ortigosa de Pestaño|41.0875|-4.3950|51
40901|Ortigosa del Monte|40.8431|-4.1764|608
40152|Otero de Herreros|40.8197|-4.2092|987
40154|Pajarejos|41.3903|-3.5903|22
40155|Palazuelos de Eresma|40.9303|-4.0611|6107
40156|Pedraza|41.1303|-3.8111|335
40157|Pelayos del Arroyo|41.0511|-3.9394|45
40158|Perosillo|41.3928|-4.1417|21
40159|Pinarejos|41.2597|-4.2936|205
40160|Pinarnegrillo|41.1903|-4.2069|98
40162|Prádena|41.1389|-3.6883|473
40163|Puebla de Pedraza|41.2044|-3.9136|56
40164|Rapariegos|41.0939|-4.6522|187
40181|Real Sitio de San Ildefonso|40.9008|-4.0053|5217|San Ildefonso
40165|Rebollo|41.1928|-3.8578|70
40166|Remondo|41.3417|-4.4833|329
40168|Riaguas de San Bartolomé|41.4267|-3.4897|28
40170|Riaza|41.2797|-3.4773|2128
40171|Ribota|41.3653|-3.4289|40
40172|Riofrío de Riaza|41.2472|-3.4503|29
40173|Roda de Eresma|41.0281|-4.1817|260
40174|Sacramenia|41.4947|-3.9633|324
40176|Samboal|41.2583|-4.4172|459
40177|San Cristóbal de Cuéllar|41.4053|-4.4042|161
40178|San Cristóbal de la Vega|41.1128|-4.6467|81
40906|San Cristóbal de Segovia|40.9519|-4.0756|3161
40182|San Martín y Mudrián|41.2232|-4.3318|263
40183|San Miguel de Bernuy|41.3994|-3.9531|119
40184|San Pedro de Gaíllos|41.2269|-3.8092|315
40179|Sanchonuño|41.3233|-4.3050|1053
40180|Sangarcía|40.9472|-4.4142|281
40185|Santa María la Real de Nieva|41.0705|-4.4064|906
40186|Santa Marta del Cerro|41.2183|-3.6850|45
40188|Santiuste de Pedraza|41.0906|-3.8864|81
40189|Santiuste de San Juan Bautista|41.1569|-4.5719|534
40190|Santo Domingo de Pirón|41.0411|-3.9894|51
40191|Santo Tomé del Puerto|41.1942|-3.5772|230
40192|Sauquillo de Cabezas|41.1942|-4.0681|135
40193|Sebúlcor|41.2711|-3.8842|239
40194|Segovia|40.9481|-4.1183|52375
40195|Sepúlveda|41.2974|-3.7494|979|Sepulvega
40196|Sequera de Fresno|41.3667|-3.5461|42
40198|Sotillo|41.2583|-3.6367|31
40199|Sotosalbos|41.0344|-3.9411|132
40200|Tabanera la Luenga|41.0969|-4.2394|51
40201|Tolocirio|41.1339|-4.6500|38
40206|Torre Val de San Pedro|41.0739|-3.8711|165
40202|Torreadrada|41.4442|-3.8397|53
40203|Torrecaballeros|40.9919|-4.0239|1505
40204|Torrecilla del Pinar|41.3742|-4.0378|188
40205|Torreiglesias|41.1019|-4.0325|257
40207|Trescasas|40.9585|-4.0378|1130
40208|Turégano|41.1553|-4.0072|1007
40210|Urueñas|41.3558|-3.7750|105
40211|Valdeprados|40.8175|-4.2569|63
40212|Valdevacas de Montejo|41.5208|-3.6361|29
40213|Valdevacas y Guijar|41.1365|-3.9127|83
40218|Valle de Tabladillo|41.3631|-3.8397|78
40219|Vallelado|41.4056|-4.4264|750
40220|Valleruela de Pedraza|41.1794|-3.8064|61
40221|Valleruela de Sepúlveda|41.1878|-3.7728|48
40214|Valseca|40.9997|-4.1744|208
40215|Valtiendas|41.4783|-3.9172|75
40216|Valverde del Majano|40.9567|-4.2347|1097
40222|Veganzones|41.1928|-3.9939|211
40223|Vegas de Matute|40.7950|-4.2778|370
40224|Ventosilla y Tejadilla|41.1819|-3.6942|17
40225|Villacastín|40.7806|-4.4136|1567
40228|Villaverde de Íscar|41.3064|-4.5267|579
40229|Villaverde de Montejo|41.5225|-3.6553|22
40230|Villeguillo|41.2517|-4.5783|129
40231|Yanguas de Eresma|41.0725|-4.2400|117
40233|Zarzuela del Monte|40.8086|-4.3364|507
40234|Zarzuela del Pinar|41.2603|-4.1844|408
41001|Aguadulce|37.2522|-4.9925|2109
41002|Alanís|38.0375|-5.7153|1638
41003|Albaida del Aljarafe|37.4255|-6.1651|3220
41004|Alcalá de Guadaíra|37.3333|-5.8500|77474
41005|Alcalá del Río|37.5183|-5.9783|12335
41006|Alcolea del Río|37.6146|-5.6684|3265
41007|La Algaba|37.4617|-6.0136|16803
41008|Algámitas|37.0165|-5.1489|1258
41009|Almadén de la Plata|37.8736|-6.0805|1328
41010|Almensilla|37.3100|-6.1131|6646
41011|Arahal|37.2625|-5.5453|19546
41012|Aznalcázar|37.3040|-6.2509|4875
41013|Aznalcóllar|37.5196|-6.2716|6096
41014|Badolatosa|37.3086|-4.6728|3058
41015|Benacazón|37.3526|-6.1967|7363
41016|Bollullos de la Mitación|37.3399|-6.1377|11431
41017|Bormujos|37.3708|-6.0708|23071
41018|Brenes|37.5506|-5.8731|12975
41019|Burguillos|37.5858|-5.9673|7448
41020|Las Cabezas de San Juan|36.9800|-5.9367|16388
41021|Camas|37.4020|-6.0332|29089
41022|La Campana|37.5671|-5.4275|5122
41023|Cantillana|37.6089|-5.8244|10780|Sevilla
41901|Cañada Rosal|37.5972|-5.2097|3481
41024|Carmona|37.4711|-5.6422|30240
41025|Carrión de los Céspedes|37.3681|-6.3294|2647
41026|Casariche|37.2939|-4.7594|5291
41027|Castilblanco de los Arroyos|37.6717|-5.9885|5145
41028|Castilleja de Guzmán|37.4089|-6.0575|2843
41029|Castilleja de la Cuesta|37.3864|-6.0517|17074
41030|Castilleja del Campo|37.3862|-6.3346|611
41031|El Castillo de las Guardas|37.6936|-6.3139|1501
41032|Cazalla de la Sierra|37.9320|-5.7596|4626
41033|Constantina|37.8776|-5.6219|5745
41034|Coria del Río|37.2850|-6.0517|31278
41035|Coripe|36.9703|-5.4414|1218
41036|El Coronil|37.0823|-5.6334|4659
41037|Los Corrales|37.0992|-4.9831|4021
41903|El Cuervo de Sevilla|36.8511|-6.0417|8783
41038|Dos Hermanas|37.2836|-5.9222|142519
41039|Écija|37.5411|-5.0794|39659
41040|Espartinas|37.3815|-6.1259|16479
41041|Estepa|37.2917|-4.8792|12430
41042|Fuentes de Andalucía|37.4633|-5.3444|7247
41043|El Garrobo|37.6245|-6.1711|800
41044|Gelves|37.3396|-6.0260|10548
41045|Gerena|37.5291|-6.1539|7971
41046|Gilena|37.2514|-4.9136|3647
41047|Gines|37.3875|-6.0780|13634
41048|Guadalcanal|38.0919|-5.8211|2544
41049|Guillena|37.5465|-6.0571|14260
41050|Herrera|37.3617|-4.8500|6575
41051|Huévar del Aljarafe|37.3561|-6.2767|3388
41902|Isla Mayor|37.1325|-6.1648|5748
41052|Lantejuela|37.3536|-5.2228|3857|La Lantejuela
41053|Lebrija|36.9194|-6.0781|27788
41054|Lora de Estepa|37.2686|-4.8278|890
41055|Lora del Río|37.6572|-5.5267|18122
41056|La Luisiana|37.5261|-5.2492|4618
41057|El Madroño|37.6453|-6.5103|286
41058|Mairena del Alcor|37.3731|-5.7475|24339
41059|Mairena del Aljarafe|37.3444|-6.0653|48017
41060|Marchena|37.3297|-5.4164|19405
41061|Marinaleda|37.3711|-4.9581|2562
41062|Martín de la Jara|37.1067|-4.9622|2627
41063|Los Molares|37.1553|-5.7194|3659
41064|Montellano|36.9956|-5.5722|7032
41065|Morón de la Frontera|37.1222|-5.4517|27210
41066|Las Navas de la Concepción|37.9331|-5.4658|1501
41067|Olivares|37.4186|-6.1558|9537
41068|Osuna|37.2372|-5.1031|17396
41069|Los Palacios y Villafranca|37.1600|-5.9236|38761
41904|El Palmar de Troya|37.0633|-5.8063|2301
41070|Palomares del Río|37.3222|-6.0578|9421
41071|Paradas|37.2903|-5.4967|6762
41072|Pedrera|37.2231|-4.8967|5057
41073|El Pedroso|37.8422|-5.7636|2062
41074|Peñaflor|37.7072|-5.3469|3628
41075|Pilas|37.3017|-6.3025|14222
41076|Pruna|36.9736|-5.2231|2461
41077|La Puebla de Cazalla|37.2231|-5.3106|10830
41078|La Puebla de los Infantes|37.7786|-5.3892|2949
41079|La Puebla del Río|37.2672|-6.0625|11903
41080|El Real de la Jara|37.9503|-6.1553|1517
41081|La Rinconada|37.4878|-5.9789|40724
41082|La Roda de Andalucía|37.2008|-4.7792|4168
41083|El Ronquillo|37.7256|-6.1769|1453
41084|El Rubio|37.3556|-4.9889|3287
41085|Salteras|37.4183|-6.1114|5604
41086|San Juan de Aznalfarache|37.3597|-6.0278|23408
41088|San Nicolás del Puerto|37.9936|-5.6531|604
41087|Sanlúcar la Mayor|37.3858|-6.2017|14648
41089|Santiponce|37.4386|-6.0383|8634
41090|El Saucejo|37.0700|-5.0967|4189
41091|Sevilla|37.3886|-5.9950|689423
41092|Tocina|37.6097|-5.7333|9431
41093|Tomares|37.3739|-6.0450|25432
41094|Umbrete|37.3700|-6.1578|9455
41095|Utrera|37.1825|-5.7818|52403
41096|Valencina de la Concepción|37.4161|-6.0767|8050
41097|Villamanrique de la Condesa|37.2464|-6.3064|4694
41100|Villanueva de San Juan|37.0503|-5.1756|986
41098|Villanueva del Ariscal|37.3958|-6.1414|6965
41099|Villanueva del Río y Minas|37.6600|-5.7139|5073
41101|Villaverde del Río|37.5881|-5.8733|7885
41102|El Viso del Alcor|37.3886|-5.7189|19458
42001|Abejar|41.8075|-2.7856|287
42003|Adradas|41.3506|-2.4733|65
42004|Ágreda|41.8550|-1.9203|3133
42006|Alconaba|41.7236|-2.3853|198
42007|Alcubilla de Avellaneda|41.7250|-3.3047|111
42008|Alcubilla de las Peñas|41.2511|-2.5269|61
42009|Aldealafuente|41.6714|-2.3250|85
42010|Aldealices|41.9019|-2.3094|22
42011|Aldealpozo|41.7828|-2.2053|18
42012|Aldealseñor|41.8789|-2.3156|29
42013|Aldehuela de Periáñez|41.8076|-2.3068|27
42014|Las Aldehuelas|41.9944|-2.3642|58
42015|Alentisque|41.4197|-2.3319|23
42016|Aliud|41.6544|-2.2531|20
42017|Almajano|41.8506|-2.3378|179
42018|Almaluez|41.2892|-2.2692|113
42019|Almarza|41.9464|-2.4689|601
42020|Almazán|41.4858|-2.5331|5544
42021|Almazul|41.5736|-2.1464|61
42022|Almenar de Soria|41.6822|-2.1997|233
42023|Alpanseque|41.2653|-2.6708|52
42024|Arancón|41.8006|-2.2814|73
42025|Arcos de Jalón|41.2139|-2.2708|1531|Arcos de Xalón
42026|Arenillas|41.3472|-2.8453|29
42027|Arévalo de la Sierra|41.9472|-2.4000|71
42028|Ausejo de la Sierra|41.8947|-2.3739|113
42029|Baraona|41.2953|-2.6572|117
42030|Barca|41.4553|-2.6217|116
42031|Barcones|41.2917|-2.8164|25
42032|Bayubas de Abajo|41.5264|-2.8958|148
42033|Bayubas de Arriba|41.5572|-2.8861|56
42034|Beratón|41.7161|-1.8108|38
42035|Berlanga de Duero|41.4650|-2.8611|810
42036|Blacos|41.6808|-2.8581|36
42037|Bliecos|41.5281|-2.2714|25
42038|Borjabad|41.5531|-2.3656|29
42039|Borobia|41.6647|-1.8967|218
42041|Buberos|41.6472|-2.1953|27
42042|Buitrago|41.8478|-2.4075|68
42043|Burgo de Osma-Ciudad de Osma|41.5867|-3.0672|5283|El Burgo de Osma-Ciudad de Osma|El Burgo de Osma
42044|Cabrejas del Campo|41.6811|-2.2694|48
42045|Cabrejas del Pinar|41.7986|-2.8467|288
42046|Calatañazor|41.6994|-2.8175|43
42048|Caltojar|41.4036|-2.7631|53
42049|Candilichera|41.7042|-2.3014|99
42050|Cañamaque|41.4447|-2.2361|29|Canyamac
42051|Carabantes|41.5519|-1.9967|21
42052|Caracena|41.3831|-3.0911|13
42053|Carrascosa de Abajo|41.4231|-3.0900|18
42054|Carrascosa de la Sierra|41.8953|-2.2806|19
42055|Casarejos|41.7964|-3.0325|145
42056|Castilfrío de la Sierra|41.9197|-2.3056|35
42058|Castillejo de Robledo|41.5581|-3.4964|100
42057|Castilruiz|41.8767|-2.0603|170
42059|Centenera de Andaluz|41.5069|-2.7181|19
42060|Cerbón|41.9292|-2.1694|27
42061|Cidones|41.8144|-2.6397|313
42062|Cigudosa|41.9358|-2.0558|14
42063|Cihuela|41.4064|-1.9986|35
42064|Ciria|41.6181|-1.9658|67
42065|Cirujales del Río|41.8667|-2.3258|21
42068|Coscurita|41.4347|-2.4756|69
42069|Covaleda|41.9342|-2.8831|1560
42070|Cubilla|41.7347|-2.9408|22
42071|Cubo de la Solana|41.6025|-2.4208|177
42073|Cueva de Ágreda|41.7639|-1.8872|67
42075|Dévanos|41.9033|-1.9472|72
42076|Deza|41.4628|-2.0192|162
42078|Duruelo de la Sierra|41.9556|-2.9311|1035
42079|Escobosa de Almazán|41.4853|-2.3717|19
42080|Espeja de San Marcelino|41.8025|-3.2219|160
42081|Espejón|41.8308|-3.2594|122
42082|Estepa de San Juan|41.9264|-2.3336|13
42083|Frechilla de Almazán|41.4258|-2.5153|20
42084|Fresno de Caracena|41.4525|-3.0906|16
42085|Fuentearmegil|41.7144|-3.1828|148
42086|Fuentecambrón|41.5053|-3.3281|29
42087|Fuentecantos|41.8497|-2.4281|65
42088|Fuentelmonge|41.4203|-2.1861|58
42089|Fuentelsaz de Soria|41.8661|-2.4147|65
42090|Fuentepinilla|41.5658|-2.7631|73
42092|Fuentes de Magaña|41.9350|-2.1800|47
42093|Fuentestrún|41.8744|-2.0817|55
42094|Garray|41.8144|-2.4478|794
42095|Golmayo|41.7667|-2.5167|3085
42096|Gómara|41.6231|-2.2256|286
42097|Gormaz|41.4922|-3.0039|18
42098|Herrera de Soria|41.7628|-3.0122|12
42100|Hinojosa del Campo|41.7389|-2.0986|24
42103|Langa de Duero|41.6100|-3.4014|696
42105|Liceras|41.3792|-3.2431|49
42106|La Losilla|41.8722|-2.2786|12
42107|Magaña|41.8994|-2.1617|61
42108|Maján|41.4689|-2.3031|10
42110|Matalebreras|41.8406|-2.0467|81
42111|Matamala de Almazán|41.5064|-2.6400|251
42113|Medinaceli|41.1722|-2.4353|686
42115|Miño de Medinaceli|41.1897|-2.5181|73
42116|Miño de San Esteban|41.5358|-3.3453|43
42117|Molinos de Duero|41.8853|-2.7875|162
42118|Momblona|41.4439|-2.3464|19
42119|Monteagudo de las Vicarías|41.3650|-2.1692|169
42120|Montejo de Tiermes|41.3683|-3.1986|134
42121|Montenegro de Cameros|42.0892|-2.7539|43
42123|Morón de Almazán|41.4147|-2.4128|196
42124|Muriel de la Fuente|41.7244|-2.8597|53
42125|Muriel Viejo|41.7825|-2.9153|73
42127|Nafría de Ucero|41.7225|-3.0947|35
42128|Narros|41.8486|-2.2944|68
42129|Navaleno|41.8383|-3.0047|698
42130|Nepas|41.5264|-2.3997|49
42131|Nolay|41.5269|-2.3514|45
42132|Noviercas|41.7114|-2.0350|156
42134|Ólvega|41.7792|-1.9856|3782
42135|Oncala|41.9700|-2.3139|61
42139|Pinilla del Campo|41.7172|-2.0833|17
42140|Portillo de Soria|41.6353|-2.1211|11
42141|La Póveda de Soria|42.0122|-2.5031|108
42142|Pozalmuro|41.7744|-2.1019|49
42144|Quintana Redonda|41.6400|-2.6153|499
42145|Quintanas de Gormaz|41.5081|-2.9758|119
42148|Quiñonería|41.5682|-2.0378|10
42149|Los Rábanos|41.7164|-2.4764|470
42151|Rebollar|41.9139|-2.5055|36
42152|Recuerda|41.4753|-2.9947|61
42153|Rello|41.3328|-2.7497|21
42154|Renieblas|41.8214|-2.3703|107
42155|Retortillo de Soria|41.3111|-2.9808|126
42156|Reznos|41.5914|-2.0269|21
42157|La Riba de Escalote|41.3517|-2.7969|9
42158|Rioseco de Soria|41.6419|-2.8408|123
42159|Rollamienta|41.9292|-2.5358|49
42160|El Royo|41.9083|-2.6444|248
42161|Salduero|41.8900|-2.7992|148
42162|San Esteban de Gormaz|41.5733|-3.2050|2962
42163|San Felices|41.9369|-2.0269|55
42164|San Leonardo de Yagüe|41.8281|-3.0669|1954
42165|San Pedro Manrique|42.0311|-2.2317|626
42166|Santa Cruz de Yanguas|42.0611|-2.4486|56
42167|Santa María de Huerta|41.2647|-2.1758|239
42168|Santa María de las Hoyas|41.7714|-3.1428|112
42171|Serón de Nágima|41.4956|-2.2014|125
42172|Soliedra|41.4697|-2.3819|37
42173|Soria|41.7667|-2.4667|41025
42174|Sotillo del Rincón|41.9331|-2.5997|171
42175|Suellacabras|41.8525|-2.2233|32
42176|Tajahuerce|41.7406|-2.1503|22
42177|Tajueco|41.5364|-2.8489|61
42178|Talveila|41.7839|-2.9667|105
42181|Tardelcuende|41.5936|-2.6444|414
42182|Taroda|41.3483|-2.4336|45
42183|Tejado|41.5889|-2.2669|100
42184|Torlengua|41.4536|-2.1628|43
42185|Torreblacos|41.6695|-2.8786|28
42187|Torrubia de Soria|41.6297|-2.0914|52
42188|Trévago|41.8739|-2.1022|47
42189|Ucero|41.7171|-3.0514|80
42190|Vadillo|41.7911|-3.0078|81
42191|Valdeavellano de Tera|41.9425|-2.5750|222
42192|Valdegeña|41.8167|-2.1739|36
42193|Valdelagua del Cerro|41.8878|-2.1164|13
42194|Valdemaluque|41.6733|-3.0453|139
42195|Valdenebro|41.5708|-2.9639|85
42196|Valdeprado|41.9378|-2.1081|8
42197|Valderrodilla|41.5639|-2.8081|59
42198|Valtajeros|41.9383|-2.2225|16
42200|Velamazán|41.4500|-2.6983|66
42201|Velilla de la Sierra|41.8089|-2.4014|26
42202|Velilla de los Ajos|41.4906|-2.2547|15
42204|Viana de Duero|41.5336|-2.4606|47
42205|Villaciervos|41.7619|-2.6264|86
42206|Villanueva de Gormaz|41.4675|-3.0622|6
42207|Villar del Ala|41.9175|-2.5661|50
42208|Villar del Campo|41.7869|-2.1483|29
42209|Villar del Río|42.0756|-2.3499|155
42211|Los Villares de Soria|41.8644|-2.3556|72
42212|Villasayas|41.3525|-2.6106|59
42213|Villaseca de Arciel|41.6244|-2.1608|23
42215|Vinuesa|41.9114|-2.7628|826
42216|Vizmanos|42.0236|-2.4075|31
42217|Vozmediano|41.8392|-1.8569|29
42218|Yanguas|42.1014|-2.3394|104
42219|Yelo|41.2103|-2.5278|40
43001|Aiguamúrcia|41.3293|1.3585|987
43002|Albinyana|41.2455|1.4867|2718|Albiñana
43003|L'Albiol|41.2518|1.0896|557|Albiol
43004|Alcanar|40.5430|0.4808|10104
43005|Alcover|41.2621|1.1711|5362
43904|L'Aldea|40.7417|0.6119|4657|La Aldea
43006|Aldover|40.8817|0.5011|901
43007|L'Aleixar|41.2016|1.0458|1009|Aleixar
43008|Alfara de Carles|40.8756|0.4014|355
43009|Alforja|41.2114|0.9755|2024
43010|Alió|41.2961|1.3078|496
43011|Almoster|41.1977|1.1128|1384
43012|Altafulla|41.1433|1.3769|5870
43013|L'Ametlla de Mar|40.8839|0.8025|7446|La Ametlla de Mar
43906|L'Ampolla|40.8142|0.7100|3785|La Ampolla|Ampolla
43014|Amposta|40.7106|0.5808|23080
43016|L'Arboç|41.2676|1.6043|5721|Arbós
43015|Arbolí|41.2425|0.9488|138
43017|L'Argentera|41.1379|0.9092|139
43018|Arnes|40.9107|0.2610|461
43019|Ascó|41.1808|0.5672|1589|Azcón
43020|Banyeres del Penedès|41.2796|1.5833|3395|Bañeras
43021|Barberà de la Conca|41.4111|1.2270|476|Barbará
43022|Batea|41.0941|0.3120|1875
43023|Bellmunt del Priorat|41.1638|0.7655|290|Bellmunt del Priorato
43024|Bellvei|41.2413|1.5766|2460|Bellvey
43025|Benifallet|40.9758|0.5178|706
43026|Benissanet|41.0569|0.6347|1186|Benisanet
43027|La Bisbal de Montsant|41.2801|0.7230|214
43028|La Bisbal del Penedès|41.2808|1.4879|4278|La Bisbal del Panadés
43029|Blancafort|41.4379|1.1591|392
43030|Bonastre|41.2210|1.4398|777
43031|Les Borges del Camp|41.1722|1.0204|2319|Borjas del Campo
43032|Bot|41.0108|0.3858|548
43033|Botarell|41.1362|0.9890|1161
43034|Bràfim|41.2706|1.3417|697
43035|Cabacés|41.2474|0.7336|296|Cabassers
43036|Cabra del Camp|41.3954|1.2764|1388|Cabra del Campo
43037|Calafell|41.2004|1.5693|32624
43903|Camarles|40.7736|0.6725|3465
43038|Cambrils|41.0670|1.0564|37042
43907|La Canonja|41.1191|1.1830|6001
43039|Capafonts|41.2954|1.0269|101
43040|Capçanes|41.1006|0.7814|444|Capsanes
43041|Caseres|41.0395|0.2505|250
43042|Castellvell del Camp|41.1801|1.0987|3002
43043|El Catllar|41.1754|1.3264|5375
43045|Colldejou|41.0995|0.8875|155
43046|Conesa|41.5192|1.2914|111
43047|Constantí|41.1532|1.2143|7108
43048|Corbera d'Ebre|41.0773|0.4769|1023|Corbera de Ebro
43049|Cornudella de Montsant|41.2657|0.9050|999
43050|Creixell|41.1659|1.4366|4261
43051|Cunit|41.1976|1.6345|16385
43901|Deltebre|40.7194|0.7083|12041
43053|Duesaigües|41.1456|0.9301|217|Dosaiguas
43054|L'Espluga de Francolí|41.3972|1.1029|3863|Espluga de Francolí
43055|Falset|41.1462|0.8201|2890
43056|La Fatarella|41.1623|0.4734|840
43057|La Febró|41.2774|1.0046|35
43058|La Figuera|41.2166|0.7312|115
43059|Figuerola del Camp|41.3714|1.2650|342
43060|Flix|41.2310|0.5501|3340
43061|Forès|41.4941|1.2379|38
43062|Freginals|40.6716|0.5197|443
43063|La Galera|40.6818|0.4632|726
43064|Gandesa|41.0521|0.4389|3150
43065|Garcia|41.1367|0.6502|551
43066|Els Garidells|41.2075|1.2475|211|Garidells
43067|Ginestar|41.0422|0.6326|800
43068|Godall|40.6553|0.4694|591
43069|Gratallops|41.1931|0.7764|226
43070|Els Guiamets|41.1015|0.7525|254|Guiamets
43071|Horta de Sant Joan|40.9556|0.3151|1150|Horta de San Juan
43072|El Lloar|41.1863|0.7504|99|Lloá
43073|Llorac|41.5566|1.3072|105|Llorach
43074|Llorenç del Penedès|41.2820|1.5537|2425|Lloréns
43076|Marçà|41.1267|0.8008|623|Marsá
43075|Margalef|41.2848|0.7537|106
43077|Mas de Barberans|40.7347|0.3733|535
43078|Masdenverge|40.7146|0.5313|1138
43079|Masllorenç|41.2697|1.4150|573|Maslloréns
43080|La Masó|41.2346|1.2210|307
43081|Maspujols|41.1821|1.0459|915
43082|El Masroig|41.1260|0.7322|473|Masroig
43083|El Milà|41.2479|1.2067|194|Milá
43084|Miravet|41.0374|0.5978|703
43085|El Molar|41.1635|0.7060|295
43086|Montblanc|41.3764|1.1639|7542|Montblanch
43088|Montbrió del Camp|41.1208|1.0035|3157|Montbrió de Tarragona
43089|Montferri|41.2654|1.3658|502
43090|El Montmell|41.3154|1.4538|1958
43091|Mont-ral|41.2869|1.0979|174
43092|Mont-roig del Camp|41.0882|0.9578|14615|Montroig
43093|Móra d'Ebre|41.0930|0.6412|5811|Mora de Ebro
43094|Móra la Nova|41.1003|0.6508|3350|Mora la Nueva
43095|El Morell|41.1922|1.2087|3811|Morell
43096|La Morera de Montsant|41.2650|0.8417|150
43097|La Nou de Gaià|41.1830|1.3734|603|La Nou de Gaya
43098|Nulles|41.2494|1.2952|551
43100|Els Pallaresos|41.1752|1.2695|5028
43099|La Palma d'Ebre|41.2829|0.6657|333|La Palma de Ebro
43101|Passanant i Belltall|41.5317|1.1969|149|Pasanant
43102|Paüls|40.9242|0.4003|558
43103|Perafort|41.1911|1.2557|1342
43104|El Perelló|40.8751|0.7124|3005|Perelló
43105|Les Piles|41.5039|1.3422|229|Las Pilas
43106|El Pinell de Brai|41.0155|0.5144|948|Pinell de Bray|Lo Pinell de Brai
43107|Pira|41.4227|1.2027|512
43108|El Pla de Santa Maria|41.3639|1.2893|2408|Pla de Santa María
43109|La Pobla de Mafumet|41.1866|1.2083|4175|Pobla de Mafumet
43110|La Pobla de Massaluca|41.1805|0.3536|344|Puebla de Masaluca
43111|La Pobla de Montornès|41.1789|1.4145|3440|Puebla de Montornés
43112|Poboleda|41.2346|0.8458|345
43113|El Pont d'Armentera|41.3830|1.3628|500|Puente de Armentera
43141|Pontils|41.4772|1.3880|124
43114|Porrera|41.1890|0.8565|405
43115|Pradell de la Teixeta|41.1566|0.8756|182
43116|Prades|41.3095|0.9877|629
43117|Prat de Comte|40.9837|0.4052|174|Prat de Compte
43118|Pratdip|41.0513|0.8713|781
43119|Puigpelat|41.2780|1.2971|1222
43120|Querol|41.4230|1.3970|611
43136|La Ràpita|40.6203|0.5927|16119|San Carlos de la Rápita
43121|Rasquera|41.0015|0.5975|786
43122|Renau|41.2250|1.3113|165
43123|Reus|41.1549|1.1087|111601
43124|La Riba|41.3187|1.1781|574
43125|Riba-roja d'Ebre|41.2514|0.4856|1132|Ribarroja de Ebro|Ribarroya d'Ebro
43126|La Riera de Gaià|41.1650|1.3616|1834
43127|Riudecanyes|41.1302|0.9607|1362|Riudecañas
43128|Riudecols|41.1681|0.9763|1264
43129|Riudoms|41.1391|1.0520|6891
43130|Rocafort de Queralt|41.4783|1.2813|247
43131|Roda de Berà|41.1857|1.4568|8260|Roda de Bará
43132|Rodonyà|41.2799|1.3991|519|Rodoñá
43133|Roquetes|40.8206|0.5025|8607|Roquetas
43134|El Rourell|41.2239|1.2182|385|Rourell
43135|Salomó|41.2304|1.3753|519
43905|Salou|41.0796|1.1316|31491
43137|Sant Jaume dels Domenys|41.2999|1.5596|2819|San Jaime dels Domenys
43902|Sant Jaume d'Enveja|40.7057|0.7178|3745|San Jaime de Enveija
43138|Santa Bàrbara|40.7146|0.4929|3871
43139|Santa Coloma de Queralt|41.5324|1.3839|2795
43140|Santa Oliva|41.2533|1.5522|3711
43142|Sarral|41.4446|1.2489|1644
43143|Savallà del Comtat|41.5431|1.2990|49|Savallá del Condado
43144|La Secuita|41.2032|1.2794|1845
43145|La Selva del Camp|41.2155|1.1373|5732|La Selva del Campo
43146|Senan|41.4699|1.0883|47
43044|La Sénia|40.6336|0.2853|5516|Cenia
43147|Solivella|41.4560|1.1776|633
43148|Tarragona|41.1175|1.2528|143649
43149|Tivenys|40.9094|0.5133|948
43150|Tivissa|41.0423|0.7331|1658|Tivisa
43151|La Torre de Fontaubella|41.1248|0.8643|124|Torre de Fontaubella
43152|La Torre de l'Espanyol|41.1919|0.6260|641|Torre del Español
43153|Torredembarra|41.1457|1.3957|18237
43154|Torroja del Priorat|41.2135|0.8104|129
43155|Tortosa|40.8125|0.5211|35997
43156|Ulldecona|40.5981|0.4482|6714
43157|Ulldemolins|41.3226|0.8764|389
43158|Vallclara|41.3771|0.9815|91
43159|Vallfogona de Riucorb|41.5631|1.2370|95
43160|Vallmoll|41.2459|1.2497|1997
43161|Valls|41.2883|1.2508|25518
43162|Vandellòs i l'Hospitalet de l'Infant|41.0214|0.8319|7143|Vandellós y Hospitalet del Infante
43163|El Vendrell|41.2201|1.5348|41133|Vendrell
43164|Vespella de Gaià|41.2054|1.3595|502
43165|Vilabella|41.2484|1.3308|724
43175|Vilalba dels Arcs|41.1208|0.4096|611|Villalba de los Arcos
43166|Vilallonga del Camp|41.2115|1.2059|2495|Vilallonga del Campo
43168|Vilanova de Prades|41.3478|0.9567|111
43167|Vilanova d'Escornalbou|41.1137|0.9367|614|Vilanova de Escornalbou
43169|Vilaplana|41.2286|1.0330|549
43170|Vila-rodona|41.3105|1.3580|1382|Vilarrodona
43171|Vila-seca|41.1110|1.1450|23917|Vilaseca
43172|Vilaverd|41.3341|1.1775|493|Vilavert
43173|La Vilella Alta|41.2254|0.7802|127|Vilella Alta
43174|La Vilella Baixa|41.2208|0.7616|201|Vilella Baja
43176|Vimbodí i Poblet|41.4006|1.0499|887|Vimbodí y Poblet
43177|Vinebre|41.1838|0.5899|427
43178|Vinyols i els Arcs|41.1137|1.0393|2450|Viñols y Archs
43052|Xerta|40.9094|0.4917|1180|Cherta
44001|Ababuj|40.5483|-0.8078|73|Fababuix
44002|Abejuela|39.9097|-0.8931|62|Abechuela
44003|Aguatón|40.6715|-1.2344|18
44004|Aguaviva|40.8236|-0.1975|562|Aiguaviva de Bergantes|Auguaviva
44005|Aguilar del Alfambra|40.5886|-0.7942|82|Aguilar d'Alfambra
44006|Alacón|41.0232|-0.6967|204
44007|Alba|40.6187|-1.3456|186
44008|Albalate del Arzobispo|41.1228|-0.5094|1936|Albalat de l'Arzebispe|Albalat de l'Arcebispe
44009|Albarracín|40.4053|-1.4440|998|Albarrasí|Albarrazín
44010|Albentosa|40.1022|-0.7686|290|Alventosa
44011|Alcaine|40.9539|-0.7061|38|Arcaine
44012|Alcalá de la Selva|40.3722|-0.7197|382
44013|Alcañiz|41.0503|-0.1330|16505|Alcanyís|Alcanyiz
44014|Alcorisa|40.8922|-0.3813|3243
44016|Alfambra|40.5471|-1.0332|485
44017|Aliaga|40.6739|-0.7031|344
44021|Allepuz|40.4925|-0.7291|123|Allepús
44022|Alloza|40.9691|-0.5299|556
44023|Allueva|40.9856|-1.0425|31
44018|Almohaja|40.6051|-1.4385|10|Almofalla
44019|Alobras|40.1793|-1.3886|63
44020|Alpeñés|40.7991|-1.0656|27|Alpenyés
44024|Anadón|40.9822|-0.9831|35
44025|Andorra|40.9772|-0.4447|7223
44026|Arcos de las Salinas|39.9914|-1.0400|105
44027|Arens de Lledó|40.9921|0.2706|181|Arenys de Lledó|Arens de Ledón
44028|Argente|40.6883|-1.1625|204|Archent
44029|Ariño|41.0331|-0.6000|605|Arinyo
44031|Azaila|41.2912|-0.4943|94|Zaila
44032|Bádenas|41.0919|-1.1219|28
44033|Báguena|41.0409|-1.3570|278
44034|Bañón|40.8396|-1.1912|152|Banyón
44035|Barrachina|40.8961|-1.1386|113
44036|Bea|41.0358|-1.1472|30|Beya
44037|Beceite|40.8319|0.1827|572|Beseit|Bezeit
44039|Bello|40.9167|-1.5000|204
44038|Belmonte de San José|40.8761|-0.0636|114|Bellmunt de Mesquí|Belmont de Sant Chusé
44040|Berge|40.8581|-0.4261|218|Berche
44041|Bezas|40.3308|-1.3245|73
44042|Blancas|40.8139|-1.4818|132
44043|Blesa|41.0511|-0.8862|74
44044|Bordón|40.6867|-0.3221|116|Bordó
44045|Bronchales|40.5090|-1.5885|465|Bronchals
44046|Bueña|40.7085|-1.2672|65|Buenya
44047|Burbáguena|41.0176|-1.3386|396
44048|Cabra de Mora|40.3175|-0.8072|66
44049|Calaceite|41.0158|0.1894|961|Calaceit|Calazeit
44050|Calamocha|40.9200|-1.3008|4655
44051|Calanda|40.9395|-0.2316|3745
44052|Calomarde|40.3733|-1.5753|76|Calomart
44053|Camañas|40.6430|-1.1376|136|Camanyas
44054|Camarena de la Sierra|40.1481|-1.0408|137
44055|Camarillas|40.6123|-0.7539|100|Camariellas
44056|Caminreal|40.8386|-1.3208|606|Camín Reyal
44059|Cantavieja|40.5254|-0.4053|729|Cantavella|Cantaviella
44060|Cañada de Benatanduz|40.5783|-0.5361|40|Canyada de Benatanduz
44061|La Cañada de Verich|40.8658|-0.0990|72|la Canyada de Beric|La Canyada de Beric
44062|Cañada Vellida|40.7082|-0.9150|36|Canyada Vellida
44063|Cañizar del Olivar|40.8166|-0.6449|112|Canyizar de l'Olivar
44064|Cascante del Río|40.1959|-1.1142|73|Cascant
44065|Castejón de Tornos|40.9975|-1.4268|64|Castellón de Tornos
44066|Castel de Cabra|40.8040|-0.6980|79|Cabra
44070|El Castellar|40.3653|-0.8172|54|Lo Castellar
44071|Castellote|40.7996|-0.3197|665|Castellot
44067|Castelnou|41.2333|-0.3667|94|Casterló
44068|Castelserás|40.9809|-0.1470|804|Castellseràs
44074|Cedrillas|40.4367|-0.8533|652|Cedriellas
44075|Celadas|40.4746|-1.1501|331
44076|Cella|40.4500|-1.2833|2702
44077|La Cerollera|40.8399|-0.0551|77|la Sorollera
44080|La Codoñera|40.9334|-0.0864|312|la Codonyera|La Codonyera
44082|Corbalán|40.4035|-0.9859|117
44084|Cortes de Aragón|40.9737|-0.8353|62|Cortz d'Aragón
44085|Cosa|40.8340|-1.1353|63
44086|Cretas|40.9278|0.2100|559|Queretes
44087|Crivillén|40.8832|-0.5768|92
44088|La Cuba|40.5915|-0.2980|53
44089|Cubla|40.2107|-1.0787|56
44090|Cucalón|41.0857|-1.2144|77
44092|El Cuervo|40.1511|-1.3258|88|Lo Cuervo
44093|Cuevas de Almudén|40.7129|-0.8284|119|Cuevas d'Almudén|Cueves de Almudén
44094|Cuevas Labradas|40.4536|-1.0510|126
44096|Ejulve|40.7751|-0.5529|172|Exulv
44097|Escorihuela|40.5453|-0.9710|130|Escoriuela
44099|Escucha|40.7941|-0.8101|788|Escuita
44100|Estercuel|40.8553|-0.6319|198
44101|Ferreruela de Huerva|41.0626|-1.2331|81|Ferreruela de la Uerva
44102|Fonfría|40.9959|-1.0844|35|Fuent Frida
44103|Formiche Alto|40.3250|-0.8933|156|Formich Susano
44105|Fórnoles|40.8942|-0.0038|71|Fórnols de Matarranya|Fórnols
44106|Fortanete|40.5058|-0.5208|195|Fortanet
44107|Foz-Calanda|40.9224|-0.2658|272
44108|La Fresneda|40.9279|0.0743|459|la Freixneda|La Fraixneda
44109|Frías de Albarracín|40.3378|-1.6153|109|Fridas d'Albarrazín
44110|Fuenferrada|40.8689|-1.0119|38|Fuent Ferrada
44111|Fuentes Calientes|40.7003|-0.9787|89|Fuents Calients|Fontes Calientes
44112|Fuentes Claras|40.8636|-1.3236|428|Fuents Claras
44113|Fuentes de Rubielos|40.1692|-0.6192|148|Fonts de Rubiols|Fuents de Rubielos
44114|Fuentespalda|40.8068|0.0647|305|Fondespatla|Foz Espalda
44115|Galve|40.6552|-0.8813|149|Galv
44116|Gargallo|40.8360|-0.5838|88
44117|Gea de Albarracín|40.4110|-1.3467|459|Exeya d'Albarrazín
44118|La Ginebrosa|40.8701|-0.1349|188|La Chinebrosa
44119|Griegos|40.4294|-1.7119|154
44120|Guadalaviar|40.3892|-1.7175|238
44121|Gúdar|40.4415|-0.7202|73
44122|Híjar|41.1747|-0.4516|1766|Híxar|Íxar
44123|Hinojosa de Jarque|40.6911|-0.7858|104|Finollosa d'Exarc
44124|La Hoz de la Vieja|40.9238|-0.8434|85|La Foz de la Viella
44125|Huesa del Común|41.0105|-0.9198|55|Uesa
44126|La Iglesuela del Cid|40.4815|-0.3194|357|L'Anglesola
44127|Jabaloyas|40.2401|-1.4101|66|Chabaloyas
44128|Jarque de la Val|40.7028|-0.8011|66|Exarc de la Val
44129|Jatiel|41.2192|-0.3812|48|Exatiel
44130|Jorcas|40.5431|-0.7527|42|Exorcas
44131|Josa|40.9556|-0.7668|34|Chosa
44132|Lagueruela|41.0416|-1.1915|73
44133|Lanzuela|41.0986|-1.2057|24
44135|Libros|40.1630|-1.2328|102
44136|Lidón|40.7175|-1.1125|56
44137|Linares de Mora|40.3217|-0.5750|242|Linars de Mora
44141|Lledó|40.9560|0.2776|150|Ledón
44138|Loscos|41.0812|-1.0448|121
44142|Maicas|40.9663|-0.8901|35
44143|Manzanera|40.0578|-0.8303|530
44144|Martín del Río|40.8445|-0.8956|367
44145|Mas de las Matas|40.8346|-0.2431|1230|El Mas de les Mates|Lo Mas de las Matas|Mas de los Matos
44146|La Mata de los Olmos|40.8656|-0.5211|255
44147|Mazaleón|41.0498|0.1042|474|Massalió|Mazalión
44148|Mezquita de Jarque|40.7219|-0.8686|83|Mezquita d'Exarc
44149|Mirambel|40.5868|-0.3424|110|Mirambell
44150|Miravete de la Sierra|40.5771|-0.6940|31|Miravet de la Sierra
44151|Molinos|40.8198|-0.4500|232|Molins
44152|Monforte de Moyuela|41.0548|-1.0143|84|Mont-fort
44153|Monreal del Campo|40.7895|-1.3535|2578|Mont-reyal
44154|Monroyo|40.7880|-0.0325|324|Mont-roig de Tastavins|Mont-royo
44155|Montalbán|40.8324|-0.7994|1162|Mont Albán
44156|Monteagudo del Castillo|40.4569|-0.8176|43|Mont Agut
44157|Monterde de Albarracín|40.4974|-1.4919|62|Monterd d'Albarrazín
44158|Mora de Rubielos|40.2531|-0.7525|1752|Móra de Rubiols
44159|Moscardón|40.3322|-1.5369|62
44160|Mosqueruela|40.3614|-0.4489|563|Mosquerola
44161|Muniesa|41.0316|-0.8100|575
44163|Noguera de Albarracín|40.4589|-1.5977|131|Noguera d'Albarrazín
44164|Nogueras|41.1346|-1.0670|36
44165|Nogueruelas|40.2378|-0.6362|188
44167|Obón|40.9047|-0.7231|35
44168|Odón|40.8844|-1.5682|191
44169|Ojos Negros|40.7377|-1.4982|321|Uellos Negros
44171|Olba|40.1326|-0.6250|286
44172|Oliete|40.9935|-0.6796|351|Oliet
44173|Los Olmos|40.8769|-0.4866|111
44174|Orihuela del Tremedal|40.5501|-1.6504|450|Oriuela
44175|Orrios|40.5872|-0.9873|112
44176|Palomar de Arroyos|40.7797|-0.7502|166
44177|Pancrudo|40.7621|-1.0293|118
44178|Las Parras de Castellote|40.7754|-0.2436|61|Les Parres de Castellot|Las Parras de Castellot
44179|Peñarroya de Tastavins|40.7550|0.0397|467|Pena-roja|Penyarroya de Tastavins
44180|Peracense|40.6412|-1.4705|68|Peracens
44181|Peralejos|40.4837|-1.0329|89|Peralellos
44182|Perales del Alfambra|40.6344|-1.0019|293|Perals
44183|Pitarque|40.6469|-0.5950|62|Pitarc
44184|Plou|40.9923|-0.8539|42
44185|El Pobo|40.5079|-0.8609|97|Lo Pobo
44187|La Portellada|40.8822|0.0556|249
44189|Pozondón|40.5610|-1.4699|53
44190|Pozuel del Campo|40.7717|-1.5056|76
44191|La Puebla de Híjar|41.2132|-0.4456|935|La Puebla d'Íxar
44192|La Puebla de Valverde|40.2245|-0.9302|485|la Pobla de Valverde
44193|Puertomingalvo|40.2647|-0.4595|135
44194|Ráfales|40.8378|0.0207|149|Ràfels|Ráfals
44195|Rillo|40.7229|-0.9962|95|Riello
44196|Riodeva|40.1176|-1.1471|113|Río Deva
44197|Ródenas|40.6395|-1.5159|57
44198|Royuela|40.3775|-1.5119|229
44199|Rubiales|40.2764|-1.2712|43|Rubials
44200|Rubielos de la Cérida|40.7704|-1.2122|20|Rubiuelos
44201|Rubielos de Mora|40.1904|-0.6519|600|Rubiols|Rubiuelos de Mora
44203|Salcedillo|40.9619|-1.0054|14|Salcediello
44204|Saldón|40.3250|-1.4283|32
44205|Samper de Calanda|41.1891|-0.3879|734|Sant Per de Calanda
44206|San Agustín|40.0591|-0.6930|132|Sant Agostín
44207|San Martín del Río|41.0656|-1.3870|135|Sant Martín del Río
44208|Santa Cruz de Nogueras|41.1146|-1.0892|24
44209|Santa Eulalia|40.5688|-1.3145|1004|Santa Olalia
44210|Sarrión|40.1415|-0.8143|1261|Sarrió
44211|Segura de los Baños|40.9403|-0.9505|55|Segura de los Banyos
44212|Seno|40.8126|-0.3377|39
44213|Singra|40.6556|-1.3119|76|Cingla
44215|Terriente|40.2972|-1.5042|198|Terrient
44216|Teruel|40.3436|-1.1072|36655|Terol
44217|Toril y Masegoso|40.2335|-1.5129|31
44218|Tormón|40.2025|-1.3536|29
44219|Tornos|40.9622|-1.4333|175
44220|Torralba de los Sisones|40.8910|-1.4585|145|Torralba de los Sisons
44223|Torre de Arcas|40.7517|-0.0684|76|Torredarques|Torre d'Arcas
44224|Torre de las Arcas|40.8421|-0.7183|19|Torre de les Arques
44225|Torre del Compte|40.9359|0.1093|120|la Torre del Comte|Torrelconte
44227|Torre los Negros|40.8532|-1.0970|77
44221|Torrecilla de Alcañiz|40.9600|-0.0917|436|la Torrocella d'Alcanyís|Torrociella d'Alcanyiz
44222|Torrecilla del Rebollar|40.9101|-1.0720|114|Torreciella
44226|Torrelacárcel|40.6142|-1.3019|131|Torre la Cárcel
44228|Torremocha de Jiloca|40.5896|-1.2956|115|Torremocha de Xiloca
44229|Torres de Albarracín|40.4276|-1.5316|187|Torres d'Albarrazín
44230|Torrevelilla|40.9016|-0.1083|161|la Torre de Vilella|La Torre de Viliella
44231|Torrijas|40.0223|-0.9576|36|Torrillas
44232|Torrijo del Campo|40.8250|-1.3377|501|Torrillo
44234|Tramacastiel|40.1892|-1.2398|62
44235|Tramacastilla|40.4308|-1.5741|133|Tramacastiella
44236|Tronchón|40.6212|-0.3985|56|Tronxó
44237|Urrea de Gaén|41.1600|-0.4703|455|Urreya de Gayén
44238|Utrillas|40.8167|-0.8500|3069|Utriellas
44239|Valacloche|40.1907|-1.0908|33|Valacroch
44240|Valbona|40.2288|-0.8107|187
44241|Valdealgorfa|40.9908|-0.0351|581|Val d'Algorfa
44243|Valdecuenca|40.2978|-1.4082|33|Val de Cuenca
44244|Valdelinares|40.3914|-0.6059|82|Val de Linars
44245|Valdeltormo|40.9868|0.0837|304|la Vall de Tormo|Val d'el Tormo
44246|Valderrobres|40.8833|0.1500|2555|Vall-de-roures|Val de Robres
44247|Valjunquera|40.9527|0.0260|336|Valljunquera|Val Chunquera
44249|El Vallecillo|40.2344|-1.5666|40|Val Longuiello
44250|Veguillas de la Sierra|40.1542|-1.4059|27|Veguiellas de la Sierra
44251|Villafranca del Campo|40.6942|-1.3460|290
44252|Villahermosa del Campo|41.1096|-1.2461|91|Villafermosa
44256|Villanueva del Rebollar de la Sierra|40.8914|-1.0092|49
44257|Villar del Cobo|40.3956|-1.6739|158|Villar d'el Cobo
44258|Villar del Salz|40.6820|-1.4998|58|Villar d'el Salz
44260|Villarluengo|40.6485|-0.5310|159|Villar Luengo
44261|Villarquemado|40.5171|-1.2651|901|Villar Cremato
44262|Villarroya de los Pinares|40.5292|-0.6694|160|Villarroya de los Pinars
44263|Villastar|40.2811|-1.1512|566|Bellestar
44264|Villel|40.2335|-1.1873|336
44265|Vinaceite|41.2660|-0.5793|176|Binazeit
44266|Visiedo|40.6857|-1.0976|132
44267|Vivel del Río Martín|40.8701|-0.9405|63
44268|La Zoma|40.7843|-0.6195|28
45001|Ajofrín|39.7125|-3.9819|2379
45002|Alameda de la Sagra|40.0119|-3.7950|4350
45003|Albarreal de Tajo|39.8967|-4.2283|804
45004|Alcabón|40.0017|-4.3672|792
45005|Alcañizo|39.9044|-5.1058|259
45006|Alcaudete de la Jara|39.7903|-4.8722|1720
45007|Alcolea de Tajo|39.8094|-5.1464|839
45008|Aldea en Cabo|40.1861|-4.4547|184
45009|Aldeanueva de Barbarroya|39.7622|-5.0200|456
45010|Aldeanueva de San Bartolomé|39.6372|-5.1108|404
45011|Almendral de la Cañada|40.1864|-4.7425|341
45012|Almonacid de Toledo|39.7550|-3.8544|991
45013|Almorox|40.2325|-4.3919|2569
45014|Añover de Tajo|39.9878|-3.7622|5454
45015|Arcicóllar|40.0556|-4.1133|1089
45016|Argés|39.8050|-4.0572|7178
45017|Azután|39.7842|-5.1264|286
45018|Barcience|39.9831|-4.2339|1110
45019|Bargas|39.9400|-4.0194|11274
45020|Belvís de la Jara|39.7594|-4.9495|1475
45021|Borox|40.0697|-3.7400|4306
45022|Buenaventura|40.1789|-4.8514|386
45023|Burguillos de Toledo|39.7967|-3.9914|3872
45024|Burujón|39.9017|-4.3000|1344
45025|Cabañas de la Sagra|40.0047|-3.9508|2177
45026|Cabañas de Yepes|39.8900|-3.5317|316
45027|Cabezamesada|39.8147|-3.1003|343
45028|Calera y Chozas|39.8853|-4.9825|4834
45029|Caleruela|39.8736|-5.2586|203
45030|Calzada de Oropesa|39.8981|-5.2786|514|La Calzada de Oropesa
45031|Camarena|40.0875|-4.1175|4848
45032|Camarenilla|40.0161|-4.0711|606
45033|El Campillo de la Jara|39.5883|-5.0578|326
45034|Camuñas|39.4289|-3.4589|1742
45035|Cardiel de los Montes|40.0636|-4.6569|406
45036|Carmena|39.9578|-4.4011|771
45037|El Carpio de Tajo|39.8875|-4.4544|1948
45038|Carranque|40.1708|-3.8969|5469
45039|Carriches|39.9617|-4.4578|260
45040|El Casar de Escalona|40.0467|-4.5242|2280
45041|Casarrubios del Monte|40.1881|-4.0394|7424
45042|Casasbuenas|39.7592|-4.1269|210
45043|Castillo de Bayuela|40.0994|-4.6842|889
45045|Cazalegas|40.0078|-4.6750|2195
45046|Cebolla|39.9506|-4.5686|3270
45047|Cedillo del Condado|40.1139|-3.9256|4525
45048|Los Cerralbos|39.9831|-4.5736|452
45049|Cervera de los Montes|40.0528|-4.8103|513
45056|Chozas de Canales|40.0983|-4.0428|5044
45057|Chueca|39.7325|-3.9433|252
45050|Ciruelos|39.9372|-3.6153|723
45051|Cobeja|40.0250|-3.8578|2719
45052|Cobisa|39.8047|-4.0250|4550
45053|Consuegra|39.4619|-3.6064|9767
45054|Corral de Almaguer|39.7600|-3.1667|5280
45055|Cuerva|39.6636|-4.2117|1226
45058|Domingo Pérez|39.9769|-4.5047|418
45059|Dosbarrios|39.8831|-3.4811|2228
45060|Erustes|39.9572|-4.4969|220
45061|Escalona|40.1708|-4.4053|3987
45062|Escalonilla|39.9264|-4.3494|1545
45063|Espinoso del Rey|39.6550|-4.7836|420
45064|Esquivias|40.1031|-3.7647|5833
45065|La Estrella|39.6894|-5.0919|251
45066|Fuensalida|40.0564|-4.1989|12669
45067|Gálvez|39.7025|-4.2758|3044
45068|Garciotum|40.0969|-4.6456|220
45069|Gerindote|39.9678|-4.3025|2828
45070|Guadamur|39.8114|-4.1492|1796
45071|La Guardia|39.7858|-3.4772|2200
45072|Las Herencias|39.8708|-4.9183|821
45073|Herreruela de Oropesa|39.8892|-5.2447|323
45074|Hinojosa de San Vicente|40.1025|-4.7231|363
45075|Hontanar|39.6150|-4.5000|139
45076|Hormigos|40.0972|-4.4489|1035
45077|Huecas|40.0114|-4.1953|890
45078|Huerta de Valdecarábanos|39.8608|-3.6161|1836
45079|La Iglesuela del Tiétar|40.2331|-4.7489|448
45080|Illán de Vacas|39.9694|-4.5575|8
45081|Illescas|40.1228|-3.8456|33301
45082|Lagartera|39.9125|-5.2022|1294
45083|Layos|39.7772|-4.0647|931
45084|Lillo|39.7214|-3.3047|2519
45085|Lominchar|40.0886|-3.9631|2989
45086|Lucillos|39.9867|-4.6125|666
45087|Madridejos|39.4658|-3.5297|10088
45088|Magán|39.9600|-3.9319|4384
45089|Malpica de Tajo|39.9000|-4.5494|1655
45090|Manzaneque|39.6356|-3.7917|407
45091|Maqueda|40.0647|-4.3717|548
45092|Marjaliza|39.5614|-3.9342|258
45093|Marrupe|40.0894|-4.7939|166
45094|Mascaraque|39.7178|-3.8133|441
45095|La Mata|39.9436|-4.4381|910
45096|Mazarambroz|39.6928|-4.0175|1251
45097|Mejorada|40.0097|-4.8819|1387
45098|Menasalbas|39.6361|-4.2858|2465
45099|Méntrida|40.2344|-4.1950|6495
45100|Mesegar de Tajo|39.9275|-4.5025|199
45101|Miguel Esteban|39.5281|-3.0783|4751
45102|Mocejón|39.9369|-3.9194|5188
45103|Mohedas de la Jara|39.6058|-5.1417|384
45104|Montearagón|39.9642|-4.6342|598
45105|Montesclaros|40.1044|-4.9378|377
45106|Mora|39.6832|-3.7728|10064
45107|Nambroca|39.7944|-3.9428|5263
45108|La Nava de Ricomalillo|39.6503|-4.9906|514
45109|Navahermosa|39.6367|-4.4856|3587
45110|Navalcán|40.0681|-5.0928|1859
45111|Navalmoralejo|39.7392|-5.1433|56
45112|Los Navalmorales|39.7286|-4.6447|2074
45113|Los Navalucillos|39.6714|-4.6425|1889
45114|Navamorcuende|40.1547|-4.7897|581
45115|Noblejas|39.9775|-3.4389|3998
45116|Noez|39.7419|-4.1839|1058
45117|Nombela|40.1542|-4.5069|904
45118|Novés|40.0483|-4.2706|3564
45119|Numancia de la Sagra|40.0756|-3.8550|5674
45120|Nuño Gómez|40.1136|-4.6211|178
45121|Ocaña|39.9569|-3.4967|15560
45122|Olías del Rey|39.9433|-3.9878|9174
45123|Ontígola|40.0056|-3.5731|5101
45124|Orgaz|39.6467|-3.8772|2639
45125|Oropesa|39.9192|-5.1778|2587
45126|Otero|39.9992|-4.5128|436
45127|Palomeque|40.1194|-3.9611|1213
45128|Pantoja|40.0417|-3.8328|3536
45129|Paredes de Escalona|40.2056|-4.4289|133
45130|Parrillas|40.0608|-5.0628|323
45131|Pelahustán|40.1772|-4.5978|335
45132|Pepino|40.0314|-4.8033|3421
45133|Polán|39.7883|-4.1667|3941
45134|Portillo de Toledo|40.0594|-4.2239|2384
45135|La Puebla de Almoradiel|39.5989|-3.1173|4950
45136|La Puebla de Montalbán|39.8630|-4.3592|8144
45137|La Pueblanueva|39.9144|-4.6764|2139
45138|El Puente del Arzobispo|39.8025|-5.1719|1143
45139|Puerto de San Vicente|39.5219|-5.1164|141
45140|Pulgar|39.6947|-4.1522|1608
45141|Quero|39.5081|-3.2469|1006
45142|Quintanar de la Orden|39.5958|-3.0469|11355
45143|Quismondo|40.1053|-4.3236|1857
45144|El Real de San Vicente|40.1392|-4.6903|966
45145|Recas|40.0528|-3.9847|5037
45146|Retamoso de la Jara|39.7419|-4.7539|109
45147|Rielves|39.9592|-4.1925|900
45148|Robledo del Mazo|39.6092|-4.9050|249
45149|El Romeral|39.7061|-3.4325|518
45150|San Bartolomé de las Abiertas|39.8300|-4.7156|637
45151|San Martín de Montalbán|39.7019|-4.3872|778
45152|San Martín de Pusa|39.7831|-4.6325|623
45153|San Pablo de los Montes|39.5456|-4.3281|1627
45154|San Román de los Montes|40.0714|-4.7314|2191
45155|Santa Ana de Pusa|39.7636|-4.7158|345
45156|Santa Cruz de la Zarza|39.9767|-3.1908|4180
45157|Santa Cruz del Retamar|40.1206|-4.2381|4194|Santa Cruz de Retamar
45158|Santa Olalla|40.0236|-4.4358|3571
45901|Santo Domingo-Caudilla|40.0119|-4.3256|1299
45159|Sartajada|40.2114|-4.7914|104
45160|Segurilla|40.0197|-4.8656|1412
45161|Seseña|40.1050|-3.7022|30907
45162|Sevilleja de la Jara|39.5736|-4.9644|635
45163|Sonseca|39.6798|-3.9776|11452
45164|Sotillo de las Palomas|40.1053|-4.8264|184
45165|Talavera de la Reina|39.9667|-4.8333|83803
45166|Tembleque|39.6947|-3.5042|1992
45167|El Toboso|39.5181|-2.9981|1702
45168|Toledo|39.8667|-4.0333|87216
45169|Torralba de Oropesa|39.9333|-5.1533|186
45171|La Torre de Esteban Hambrán|40.1686|-4.2186|1946
45170|Torrecilla de la Jara|39.7031|-4.7742|227
45172|Torrico|39.8283|-5.2233|688
45173|Torrijos|39.9833|-4.2814|14307
45174|Totanés|39.7114|-4.2267|361
45175|Turleque|39.6028|-3.6114|702
45176|Ugena|40.1578|-3.8769|5988
45177|Urda|39.4139|-3.7217|2454
45179|Valdeverdeja|39.7989|-5.2467|598
45180|Valmojado|40.2044|-4.0911|4898
45181|Velada|39.9781|-4.9731|2899
45182|Las Ventas con Peña Aguilera|39.6128|-4.2286|1090
45183|Las Ventas de Retamosa|40.1550|-4.1122|4206
45184|Las Ventas de San Julián|40.0083|-5.2933|239
45186|La Villa de Don Fadrique|39.6150|-3.2233|3519
45185|Villacañas|39.6158|-3.3397|9411
45187|Villafranca de los Caballeros|39.4261|-3.3575|4884
45188|Villaluenga de la Sagra|40.0303|-3.9103|4308
45189|Villamiel de Toledo|39.9811|-4.1258|1097
45190|Villaminaya|39.7119|-3.8711|518
45191|Villamuelas|39.8172|-3.7322|587
45192|Villanueva de Alcardete|39.6733|-3.0128|2910
45193|Villanueva de Bogas|39.7222|-3.6558|657
45194|Villarejo de Montalbán|39.7683|-4.5725|83
45195|Villarrubia de Santiago|39.9836|-3.3686|2583
45196|Villaseca de la Sagra|39.9581|-3.8819|1910
45197|Villasequilla|39.8772|-3.7294|2673
45198|Villatobas|39.9011|-3.3214|2964
45199|El Viso de San Juan|40.1417|-3.9172|6380
45200|Los Yébenes|39.5789|-3.8694|5787
45201|Yeles|40.1222|-3.8058|6514
45202|Yepes|39.9000|-3.6289|5820
45203|Yuncler|40.0406|-3.9036|5275
45204|Yunclillos|40.0217|-3.9864|819
45205|Yuncos|40.0867|-3.8722|13189
46001|Ademuz|40.0633|-1.2862|1015|Ademús
46002|Ador|38.9181|-0.2253|1755
46004|Agullent|38.8214|-0.5489|2438
46042|Aielo de Malferit|38.8798|-0.5909|4624|Ayelo de Malferit
46043|Aielo de Rugat|38.8819|-0.3442|160|Ayelo de Rugat
46005|Alaquàs|39.4583|-0.4628|30166|Alacuás
46006|Albaida|38.8369|-0.5156|6322
46007|Albal|39.3956|-0.4151|17365
46008|Albalat de la Ribera|39.2014|-0.3867|3523
46009|Albalat dels Sorells|39.5437|-0.3462|4368
46010|Albalat dels Tarongers|39.7028|-0.3378|1574|Albalat de Taronchers
46011|Alberic|39.1167|-0.5211|11099|Alberique
46012|Alborache|39.3929|-0.7741|1568|Alboraig
46013|Alboraia/Alboraya|39.5010|-0.3495|26273
46014|Albuixech|39.5449|-0.3242|4482|Albuixec
46016|Alcàntera de Xúquer|39.0678|-0.5611|1468|Alcántara de Júcar
46015|Alcàsser|39.3677|-0.4447|10772|Alcácer
46018|Alcublas|39.7972|-0.7022|710|les Alcubles
46020|l'Alcúdia de Crespins|38.9708|-0.5908|5548|Alcudia de Crespins
46019|l'Alcúdia|39.1958|-0.5072|12587|La Alcudia
46021|Aldaia|39.4647|-0.4608|34630|Aldaya
46022|Alfafar|39.4222|-0.3897|22270
46024|Alfara de la Baronia|39.7589|-0.3528|624
46025|Alfara del Patriarca|39.5441|-0.3857|3740
46026|Alfarb|39.2760|-0.5612|1763
46027|Alfarrasí|38.9031|-0.4952|1173
46023|Alfauir|38.9283|-0.2517|515|Alfahuir
46028|Algar de Palància|39.7811|-0.3675|565
46029|Algemesí|39.1897|-0.4378|28306
46030|Algímia d'Alfara|39.7531|-0.3617|1115|Algimia de Alfara
46031|Alginet|39.2651|-0.4717|14844
46032|Almàssera|39.5117|-0.3561|7887|Almácera
46033|Almiserà|38.9153|-0.2858|278|Almiserat
46034|Almoines|38.9433|-0.1822|2664
46035|Almussafes|39.2924|-0.4139|9070|Almusafes
46036|Alpuente|39.8756|-1.0136|688|Alpont|Alpuent
46037|l'Alqueria de la Comtessa|38.9365|-0.1536|1547|Alquería de la Condesa
46017|Alzira|39.1500|-0.4350|48236|Alcira|Alchezira
46038|Andilla|39.8358|-0.8136|338
46039|Anna|39.0222|-0.6447|2600
46040|Antella|39.0792|-0.5925|1130
46041|Aras de los Olmos|39.9256|-1.1336|401|Ares dels Oms
46003|Atzeneta d'Albaida|38.8347|-0.4975|1193|Adzaneta de Albaida
46044|Ayora|39.0597|-1.0558|5282|Aiora
46046|Barx|39.0134|-0.3001|1501|Bárig
46045|Barxeta|39.0211|-0.4158|1578|Barcheta
46047|Bèlgida|38.8596|-0.4747|651
46048|Bellreguard|38.9462|-0.1623|5032|Bellreguart
46049|Bellús|38.9453|-0.4872|317
46050|Benagéber|39.7367|-1.1000|176|Benaixeve|Benaixep
46051|Benaguasil|39.5933|-0.5864|12668|Benaguacil|Benaguacir
46052|Benavites|39.7407|-0.2585|652
46053|Beneixida|39.0583|-0.5489|659|Benegida
46054|Benetússer|39.4227|-0.3972|16734|Benetúser
46055|Beniarjó|38.9323|-0.1863|1964
46056|Beniatjar|38.8479|-0.4170|209
46057|Benicolet|38.9194|-0.3461|610
46904|Benicull de Xúquer|39.1856|-0.3836|1179
46060|Benifaió|39.2854|-0.4263|12262|Benifayó
46059|Benifairó de la Valldigna|39.0533|-0.3031|1588
46058|Benifairó de les Valls|39.7277|-0.2686|2359|Benifairó de los Valles
46061|Beniflá|38.9281|-0.1886|505
46062|Benigànim|38.9436|-0.4439|5759
46063|Benimodo|39.2139|-0.5281|2332
46064|Benimuslem|39.1306|-0.4933|674
46065|Beniparrell|39.3806|-0.4114|2108
46066|Benirredrà|38.9618|-0.1924|1576
46067|Benissanó|39.6133|-0.5753|2449|Benisanó
46068|Benissoda|38.8325|-0.5308|494|Benisoda
46069|Benissuera|38.9131|-0.4781|196|Benisuera
46070|Bétera|39.5922|-0.4625|28560
46071|Bicorp|39.1319|-0.7878|546|Bicorb
46072|Bocairent|38.7658|-0.6128|4130|Bocairente
46073|Bolbaite|39.0628|-0.6747|1320|Bolbait
46074|Bonrepòs i Mirambell|39.5174|-0.3653|4115|Bonrepós y Mirambell
46075|Bufali|38.8678|-0.5144|162
46076|Bugarra|39.6097|-0.7733|774
46077|Buñol|39.4194|-0.7906|9858|Bunyol
46078|Burjassot|39.5091|-0.4109|41299|Burjasot|Burchazot
46079|Calles|39.7256|-0.9738|465
46080|Camporrobles|39.6333|-1.3833|1183|Camporrobres
46081|Canals|38.9623|-0.5847|13746
46082|Canet d'En Berenguer|39.6794|-0.2206|8297|Canet de Berenguer
46083|Carcaixent|39.1227|-0.4512|21934|Carcagente
46084|Càrcer|39.0689|-0.5663|1795
46085|Carlet|39.2252|-0.5202|16857
46086|Carrícola|38.8406|-0.4714|97
46087|Casas Altas|40.0395|-1.2630|118|Cases Altes
46088|Casas Bajas|40.0238|-1.2611|158|Cases Baixes|Casas Baixas
46089|Casinos|39.7016|-0.7093|3153
46257|Castelló|39.0781|-0.5125|6972|Castellón|Castellón d'Exativa
46090|Castelló de Rugat|38.8758|-0.3831|2345|Castellón de Rugat
46091|Castellonet de la Conquesta|38.9155|-0.2631|159
46092|Castielfabib|40.1304|-1.3041|284|Castellfabib|Castiel Fabib
46093|Catadau|39.2758|-0.5697|3005
46094|Catarroja|39.4034|-0.4029|30604|Catarroya
46095|Caudete de las Fuentes|39.5591|-1.2803|725|Caudet
46096|Cerdà|38.9856|-0.5739|370
46107|Chella|39.0444|-0.6606|2452|Xella
46106|Chelva|39.7487|-0.9977|1863|Xelva
46108|Chera|39.5931|-0.9729|508|Xera
46109|Cheste|39.4939|-0.6836|8951|Xest|Chest
46111|Chiva|39.4714|-0.7197|17951|Xiva|Chiba
46112|Chulilla|39.6556|-0.8956|710|Xulilla|Chuliella
46097|Cofrentes|39.2297|-1.0614|1113|Cofrents
46098|Corbera|39.1581|-0.3556|3266
46099|Cortes de Pallás|39.2431|-0.9425|727|Cortes de Pallars|Cortz de Pallars
46100|Cotes|39.0708|-0.5742|314
46105|Cullera|39.1660|-0.2527|24702
46113|Daimús|38.9700|-0.1539|3524|Daimuz
46114|Domeño|39.6597|-0.6728|723|Domenyo
46115|Dos Aguas|39.2875|-0.8003|340|Dosaigües
46116|l'Eliana|39.5661|-0.5281|19839|La Eliana
46117|Emperador|39.5541|-0.3389|700
46118|Enguera|38.9802|-0.6892|4807
46119|l'Énova|39.0444|-0.4822|952|Énova
46120|Estivella|39.7134|-0.3485|1710
46121|Estubeny|39.0175|-0.6236|110
46122|Faura|39.7258|-0.2636|3753
46123|Favara|39.1278|-0.2906|2776|Favareta
46126|Foios|39.5386|-0.3567|7995|Foyos
46128|la Font de la Figuera|38.8056|-0.8794|2022|Fuente la Higuera
46127|la Font d'en Carròs|38.9167|-0.1700|4020|Fuente Encarroz
46124|Fontanars dels Alforins|38.7833|-0.7850|936|Fontanares
46125|Fortaleny|39.1838|-0.3149|1024
46129|Fuenterrobles|39.5853|-1.3686|678|Fuenterrobres
46131|Gandia|38.9667|-0.1822|83135
46902|Gátova|39.7694|-0.5206|452
46130|Gavarda|39.0914|-0.5597|1023|Gabarda
46132|el Genovés|38.9885|-0.4703|2822|Genovés
46133|Gestalgar|39.6045|-0.8338|587|Xestalgar|Chestalgar
46134|Gilet|39.6786|-0.3251|4011
46135|Godella|39.5184|-0.4103|13533
46136|Godelleta|39.4250|-0.6861|4266
46137|la Granja de la Costera|38.9962|-0.5561|306|Granja de la Costera|La Granxa de la Costera
46138|Guadasséquies|38.9239|-0.4861|478|Guadasequies
46139|Guadassuar|39.1833|-0.4781|6039|Guadasuar
46140|Guardamar de la Safor|38.9624|-0.1491|622
46141|Higueruelas|39.7901|-0.8617|567|Figueroles de Domenyo|Figueruelas
46142|Jalance|39.1922|-1.0767|808|Xalans
46144|Jarafuel|39.1399|-1.0728|788|Xarafull
46154|Llanera de Ranes|38.9917|-0.5713|1062
46155|Llaurí|39.1472|-0.3294|1226
46147|Llíria|39.6258|-0.5961|25333|Liria
46152|Llocnou de la Corona|39.4205|-0.3821|132|Lugar Nuevo de la Corona
46153|Llocnou de Sant Jeroni|38.9130|-0.2841|594|Lugar Nuevo de San Jerónimo|Llugar Nuevu de San Jerónimo
46151|Llocnou d'En Fenollet|39.0136|-0.4675|944|Lugar Nuevo de Fellonet
46156|Llombai|39.2814|-0.5719|2791|Llombay
46157|la Llosa de Ranes|39.0186|-0.5336|3765|Llosa de Ranes
46150|Llutxent|38.9425|-0.3564|2314|Luchente|Luchent
46148|Loriguilla|39.4902|-0.5714|2188|Loriguiella
46149|Losa del Obispo|39.6958|-0.8711|531|la Llosa del Bisbe
46158|Macastre|39.3828|-0.7860|1461
46159|Manises|39.4920|-0.4587|32609
46160|Manuel|39.0513|-0.4909|2560
46161|Marines|39.6751|-0.5611|1967
46162|Massalavés|39.1435|-0.5216|1905|Masalavés
46163|Massalfassar|39.5500|-0.3167|2716|Masalfasar
46164|Massamagrell|39.5692|-0.3330|17566|Masamagrell
46165|Massanassa|39.4083|-0.3989|10607|Masanasa
46166|Meliana|39.5272|-0.3492|11055
46167|Millares|39.2375|-0.7736|321|Millars
46168|Miramar|38.9505|-0.1415|3143
46169|Mislata|39.4747|-0.4160|47079|Mizlata
46170|Moixent/Mogente|38.8756|-0.7531|4401
46171|Montcada/Moncada|39.5456|-0.3956|22213
46173|Montaverner|38.8883|-0.4961|1624|Montaberner
46174|Montesa|38.9497|-0.6511|1128
46175|Montitxelvo/Montichelvo|38.8911|-0.3389|556
46176|Montroi/Montroy|39.3394|-0.6139|3792|Mont-royo
46172|Montserrat|39.3579|-0.6031|10062|Monserrat
46177|Museros|39.5658|-0.3411|6871
46178|Nàquera/Náquera|39.6589|-0.4263|8556
46179|Navarrés|39.1014|-0.6933|3027
46180|Novetlè|38.9806|-0.5475|872|Novelé
46181|Oliva|38.9194|-0.1211|26813
46183|l'Olleria|38.9142|-0.5494|8818|Ollería
46182|Olocau|39.7000|-0.5317|2534
46184|Ontinyent|38.8222|-0.6072|37012|Onteniente|Ontenyent
46185|Otos|38.8542|-0.4450|442
46186|Paiporta|39.4278|-0.4183|28136
46187|Palma de Gandía|38.9245|-0.2206|1897
46188|Palmera|38.9415|-0.1532|1038
46189|el Palomar|38.8536|-0.5028|593|Palomar
46190|Paterna|39.5028|-0.4406|76019
46191|Pedralba|39.6054|-0.7260|3225
46192|Petrés|39.6840|-0.3102|1124
46193|Picanya|39.4356|-0.4359|11901|Picaña
46194|Picassent|39.3617|-0.4618|23202|Picasent
46195|Piles|38.9411|-0.1322|3151
46196|Pinet|38.9833|-0.3381|156
46199|la Pobla de Farnals|39.5775|-0.3266|9255|Puebla de Farnals
46202|la Pobla de Vallbona|39.5917|-0.5530|27471|Puebla de Vallbona
46200|la Pobla del Duc|38.9033|-0.4172|2451|Puebla del Duc
46203|la Pobla Llarga|39.0855|-0.4772|4665|Puebla Larga
46197|Polinyà de Xúquer|39.1961|-0.3697|2577|Poliñá de Júcar
46198|Potries|38.9153|-0.1944|1135
46205|Puçol|39.6167|-0.3011|21659|Puzol|Pozuel
46201|Puebla de San Miguel|40.0451|-1.1448|53|la Pobla de Sant Miquel|La Puebla de Sant Miguel
46204|el Puig de Santa Maria|39.5895|-0.3058|9490|Pueyo de Cebolla
46101|Quart de les Valls|39.7399|-0.2728|1029|Cuart de les Valls
46102|Quart de Poblet|39.4833|-0.4428|26967|Cuart de Poblet
46103|Quartell|39.7374|-0.2640|1810|Cuartell
46104|Quatretonda|38.9458|-0.4031|2174|Cuatretonda
46206|Quesa|39.1196|-0.7403|691
46207|Rafelbunyol|39.5922|-0.3342|9974|Rafelbuñol
46208|Rafelcofer|38.9333|-0.1661|1409
46209|Rafelguaraf|39.0516|-0.4550|2395
46210|Ráfol de Salem|38.8647|-0.3964|463|el Ràfol de Salem|El Ràfol de Salem
46212|Real|39.3358|-0.6094|2497
46211|el Real de Gandia|38.9482|-0.1916|2722|Real de Gandía|Real de Gandia
46213|Requena|39.4885|-1.1023|20982
46214|Riba-roja de Túria|39.5475|-0.5683|24616|Ribarroja del Turia|Ribarroya
46215|Riola|39.1974|-0.3349|1820
46216|Rocafort|39.5308|-0.4103|7751
46217|Rotglà i Corberà|39.0039|-0.5653|1171|Rotglá y Corbera
46218|Ròtova|38.9326|-0.2581|1283
46219|Rugat|38.8800|-0.3628|165
46220|Sagunt/Sagunto|39.6800|-0.2783|73031|Murviedro|Saguntu
46221|Salem|38.8550|-0.3811|407
46903|San Antonio de Benagéber|39.5619|-0.5001|11192|Sant Antoni de Benaixeve|Sant Antonio de Benagéber
46222|Sant Joanet|39.0717|-0.4881|527|San Juan de Énova|Sant Joan de l'Ènova
46223|Sedaví|39.4271|-0.3849|10837
46224|Segart|39.6833|-0.3736|180
46225|Sellent|39.0317|-0.5873|383|Sallent d'Eixativa
46226|Sempere|38.9194|-0.4808|33|Sant Pere d'Albaida
46227|Senyera|39.0640|-0.5100|1114|Señera
46228|Serra|39.6854|-0.4285|3767
46229|Siete Aguas|39.4718|-0.9169|1289|Setaigües
46230|Silla|39.3618|-0.4103|20482
46231|Simat de la Valldigna|39.0437|-0.3104|3311|Simat de Valldigna
46232|Sinarcas|39.7339|-1.2317|1176|Sinarques
46233|Sollana|39.2785|-0.3818|5089
46234|Sot de Chera|39.6212|-0.9100|427|Sot de Xera
46235|Sueca|39.2026|-0.3112|29194
46236|Sumacàrcer|39.0961|-0.6297|1013|Sumacárcel
46237|Tavernes Blanques|39.5064|-0.3626|9824|Tabernes Blanques
46238|Tavernes de la Valldigna|39.0722|-0.2658|17866|Tabernes de Valldigna
46239|Teresa de Cofrentes|39.1060|-1.0515|620|Teresa de Cofrents
46240|Terrateig|38.8942|-0.3206|290
46241|Titaguas|39.8655|-1.0816|517|Titaigües
46242|Torrebaja|40.0962|-1.2563|398|Torre Baixa|Torre Chusana
46243|Torrella|38.9889|-0.5717|151
46244|Torrent|39.4365|-0.4679|90928|Torrente
46245|Torres Torres|39.7435|-0.3578|808
46246|Tous|39.1381|-0.5867|1354
46247|Tuéjar|39.7625|-1.0386|1278|Toixa|Tueixa
46248|Turís|39.3899|-0.7105|7717|Torís
46249|Utiel|39.5672|-1.2067|11663
46250|València|39.4700|-0.3764|840792|Valentzia
46251|Vallada|38.8958|-0.6919|3091
46252|Vallanca|40.0629|-1.3390|128
46253|Vallés|38.9856|-0.5564|161
46254|Venta del Moro|39.4839|-1.3569|1143
46255|Vilallonga/Villalonga|38.8833|-0.2000|4865
46256|Vilamarxant|39.5678|-0.6225|11403|Villamarchante|Villamarchent
46258|Villar del Arzobispo|39.7314|-0.8258|3862|el Villar|Lo Villar
46259|Villargordo del Cabriel|39.5414|-1.4411|588|Villargordo del Cabriol
46260|Vinalesa|39.5379|-0.3708|3572
46145|Xàtiva|38.9887|-0.5192|31008|Játiva|Exativa
46143|Xeraco|39.0320|-0.2147|6149|Jaraco
46146|Xeresa|39.0092|-0.2181|2418|Jeresa
46110|Xirivella|39.4656|-0.4267|32093|Chirivella|Chilviella
46261|Yátova|39.3849|-0.8085|2325|Iàtova
46262|La Yesa|39.8914|-0.9616|246|la Iessa
46263|Zarra|39.0917|-1.0767|374
47001|Adalia|41.6486|-5.1189|50
47002|Aguasal|41.2753|-4.6533|18
47003|Aguilar de Campos|41.9828|-5.1839|258
47004|Alaejos|41.3072|-5.2156|1427
47005|Alcazarén|41.3697|-4.6764|623
47006|Aldea de San Miguel|41.4603|-4.6169|212
47007|Aldeamayor de San Martín|41.5119|-4.6394|6290
47008|Almenara de Adaja|41.2136|-4.6769|24
47009|Amusquillo|41.7486|-4.3011|95
47010|Arroyo de la Encomienda|41.6128|-4.7917|23304
47011|Ataquines|41.1828|-4.8025|580
47012|Bahabón|41.4814|-4.2817|97
47013|Barcial de la Loma|41.9503|-5.2844|98
47014|Barruelo del Valle|41.6742|-5.0692|51
47015|Becilla de Valderaduey|42.0987|-5.2176|206
47016|Benafarces|41.6217|-5.2919|68
47017|Bercero|41.5636|-5.0559|170
47018|Berceruelo|41.5802|-5.0326|36
47019|Berrueces|41.9456|-5.0969|85
47020|Bobadilla del Campo|41.2043|-5.0229|279
47021|Bocigas|41.2286|-4.6811|75
47022|Bocos de Duero|41.6244|-4.0675|79
47023|Boecillo|41.5408|-4.6996|4446
47024|Bolaños de Campos|42.0064|-5.2844|244
47025|Brahojos de Medina|41.2311|-5.0431|96
47026|Bustillo de Chaves|42.1308|-5.0911|66
47027|Cabezón de Pisuerga|41.7340|-4.6458|3910
47028|Cabezón de Valderaduey|42.1672|-5.1586|24
47029|Cabreros del Monte|41.8486|-5.2697|64
47030|Campaspero|41.4917|-4.1944|1001
47031|El Campillo|41.2578|-5.0142|204
47032|Camporredondo|41.4737|-4.5053|143
47033|Canalejas de Peñafiel|41.5247|-4.1150|248
47034|Canillas de Esgueva|41.7500|-4.1167|71
47035|Carpio|41.2127|-5.1091|923
47036|Casasola de Arión|41.5775|-5.2406|205
47037|Castrejón de Trabancos|41.2528|-5.1706|171
47038|Castrillo de Duero|41.5756|-4.0142|108
47039|Castrillo-Tejeriego|41.7031|-4.3711|157
47040|Castrobol|42.1369|-5.3147|43
47041|Castrodeza|41.6481|-4.9606|148
47042|Castromembibre|41.6733|-5.3053|49
47043|Castromonte|41.7736|-5.0408|319
47044|Castronuevo de Esgueva|41.6814|-4.5883|412
47045|Castronuño|41.3888|-5.2633|737
47046|Castroponce|42.1264|-5.1825|128
47047|Castroverde de Cerrato|41.7556|-4.2208|192
47048|Ceinos de Campos|42.0325|-5.1492|172
47049|Cervillego de la Cruz|41.1867|-4.9492|87
47050|Cigales|41.7581|-4.6997|5454
47051|Ciguñuela|41.6406|-4.8569|361
47052|Cistérniga|41.6121|-4.6852|9489|La Cistérniga
47053|Cogeces de Íscar|41.4058|-4.5447|143
47054|Cogeces del Monte|41.5111|-4.3161|640
47055|Corcos|41.8103|-4.6928|203
47056|Corrales de Duero|41.6722|-4.0478|104
47057|Cubillas de Santa Marta|41.8317|-4.5992|394
47058|Cuenca de Campos|42.0583|-5.0553|179
47059|Curiel de Duero|41.6392|-4.1000|111
47060|Encinas de Esgueva|41.7570|-4.1035|214
47061|Esguevillas de Esgueva|41.7511|-4.3794|257
47062|Fombellida|41.7667|-4.1847|169
47063|Fompedraza|41.5361|-4.1458|113
47064|Fontihoyuelo|42.1619|-5.0572|29
47065|Fresno el Viejo|41.1983|-5.1423|825
47066|Fuensaldaña|41.7072|-4.7653|2146
47067|Fuente el Sol|41.1756|-4.9353|150
47068|Fuente-Olmedo|41.2433|-4.6472|42
47069|Gallegos de Hornija|41.6097|-5.0983|104
47070|Gatón de Campos|42.0489|-4.9808|46
47071|Geria|41.5786|-4.8764|492
47073|Herrín de Campos|42.1244|-4.9531|111
47074|Hornillos de Eresma|41.3672|-4.7178|182
47075|Íscar|41.3615|-4.5339|6493
47076|Laguna de Duero|41.5831|-4.7167|22965
47077|Langayo|41.5694|-4.1978|246
47079|Llano de Olmedo|41.2669|-4.6144|49
47078|Lomoviejo|41.1489|-4.9172|155
47080|Manzanillo|41.5893|-4.2081|48
47081|Marzales|41.5869|-5.1336|45
47082|Matapozuelos|41.4141|-4.7904|977
47083|Matilla de los Caños|41.5461|-4.9697|116
47084|Mayorga|42.1666|-5.2627|1354
47086|Medina de Rioseco|41.8831|-5.0428|4617
47085|Medina del Campo|41.3085|-4.9151|20215
47087|Megeces|41.4072|-4.5667|419
47088|Melgar de Abajo|42.2432|-5.1422|117
47089|Melgar de Arriba|42.2681|-5.0975|161
47090|Mojados|41.4306|-4.6644|3415
47091|Monasterio de Vega|42.2300|-5.1808|79
47092|Montealegre de Campos|41.9025|-4.8994|105
47093|Montemayor de Pililla|41.5091|-4.4593|837
47094|Moral de la Reina|41.9856|-5.0731|129
47095|Moraleja de las Panaderas|41.2764|-4.8247|42
47096|Morales de Campos|41.8597|-5.1719|128
47097|Mota del Marqués|41.6314|-5.1756|342
47098|Mucientes|41.7433|-4.7619|690
47099|La Mudarra|41.7794|-4.9440|167
47100|Muriel|41.1222|-4.8425|106
47101|Nava del Rey|41.3304|-5.0809|1924
47102|Nueva Villa de las Torres|41.2678|-5.0564|265
47103|Olivares de Duero|41.6376|-4.3649|328
47104|Olmedo|41.2871|-4.6867|3592
47105|Olmos de Esgueva|41.6883|-4.5231|187
47106|Olmos de Peñafiel|41.5719|-4.0425|35
47109|Palazuelo de Vedija|41.9296|-5.1450|164
47110|La Parrilla|41.5361|-4.5303|471
47111|La Pedraja de Portillo|41.4714|-4.6469|1186
47112|Pedrajas de San Esteban|41.3420|-4.5807|3434
47113|Pedrosa del Rey|41.5561|-5.2061|147
47114|Peñafiel|41.5975|-4.1228|5143
47115|Peñaflor de Hornija|41.7114|-4.9839|350
47116|Pesquera de Duero|41.6428|-4.1575|403
47117|Piña de Esgueva|41.7289|-4.4272|313
47118|Piñel de Abajo|41.6744|-4.1472|165
47119|Piñel de Arriba|41.6994|-4.1278|81
47121|Pollos|41.4447|-5.1275|565
47122|Portillo|41.4788|-4.5888|2377
47123|Pozal de Gallinas|41.3183|-4.8361|556
47124|Pozaldez|41.3721|-4.8446|503
47125|Pozuelo de la Orden|41.8214|-5.2594|56
47126|Puras|41.1836|-4.6492|44
47127|Quintanilla de Arriba|41.6203|-4.2156|161
47129|Quintanilla de Onésimo|41.6272|-4.3636|1043
47130|Quintanilla de Trigueros|41.8547|-4.6589|100
47128|Quintanilla del Molar|41.9890|-5.4493|43
47131|Rábano|41.5328|-4.0606|169
47132|Ramiro|41.2286|-4.7861|44
47133|Renedo de Esgueva|41.6540|-4.6276|3993
47134|Roales de Campos|42.0303|-5.4756|155
47135|Robladillo|41.6083|-4.9097|86
47137|Roturas|41.6678|-4.1189|26
47138|Rubí de Bracamonte|41.2142|-4.9249|207
47139|Rueda|41.4139|-4.9597|1118
47140|Saelices de Mayorga|42.2111|-5.2067|116
47141|Salvador de Zapardiel|41.1167|-4.8747|99
47142|San Cebrián de Mazote|41.6799|-5.1479|99
47143|San Llorente|41.6869|-4.0647|93
47144|San Martín de Valvení|41.7528|-4.5664|78
47145|San Miguel del Arroyo|41.4422|-4.4575|641
47146|San Miguel del Pino|41.5092|-4.9111|365
47147|San Pablo de la Moraleja|41.1603|-4.7775|113
47148|San Pedro de Latarce|41.7356|-5.3256|429
47149|San Pelayo|41.6797|-5.0336|42
47150|San Román de Hornija|41.4817|-5.2828|295
47151|San Salvador|41.6208|-5.0881|20
47156|San Vicente del Palacio|41.2192|-4.8514|155
47152|Santa Eufemia del Arroyo|41.8947|-5.2667|78
47153|Santervás de Campos|42.2169|-5.1008|100
47154|Santibáñez de Valcorba|41.5700|-4.4514|195
47155|Santovenia de Pisuerga|41.6964|-4.6883|4762
47157|Sardón de Duero|41.6092|-4.4336|600
47158|La Seca|41.4144|-4.9069|1015
47159|Serrada|41.4592|-4.8611|1117
47160|Siete Iglesias de Trabancos|41.3517|-5.1844|413
47161|Simancas|41.5904|-4.8268|5533
47162|Tamariz de Campos|41.9775|-5.0247|85
47163|Tiedra|41.6517|-5.2669|273
47164|Tordehumos|41.8147|-5.1611|362
47165|Tordesillas|41.5009|-5.0005|8773
47169|Torre de Esgueva|41.7681|-4.1997|60
47170|Torre de Peñafiel|41.5364|-4.0886|57
47166|Torrecilla de la Abadesa|41.4850|-5.0892|237
47167|Torrecilla de la Orden|41.2178|-5.2236|226
47168|Torrecilla de la Torre|41.6658|-5.0486|27
47171|Torrelobatón|41.6478|-5.0253|387
47172|Torrescárcela|41.4844|-4.3181|162
47173|Traspinedo|41.5758|-4.4722|1308
47174|Trigueros del Valle|41.8300|-4.6506|320
47175|Tudela de Duero|41.5847|-4.5803|8861
47176|La Unión de Campos|42.0769|-5.3253|210
47177|Urones de Castroponce|42.0986|-5.2817|94
47178|Urueña|41.7269|-5.2033|200
47179|Valbuena de Duero|41.6425|-4.2911|385
47180|Valdearcos de la Vega|41.6428|-4.0475|56
47181|Valdenebro de los Valles|41.8550|-4.9694|187
47182|Valdestillas|41.4769|-4.7708|1634
47183|Valdunquillo|42.0414|-5.3094|111
47186|Valladolid|41.6520|-4.7286|302614|Valladolit
47184|Valoria la Buena|41.8000|-4.5319|740
47185|Valverde de Campos|41.8347|-5.0369|89
47187|Vega de Ruiponce|42.1883|-5.1150|81
47188|Vega de Valdetronco|41.5928|-5.1139|88
47189|Velascálvaro|41.2286|-4.9725|156
47190|Velilla|41.5561|-5.0042|109
47191|Velliza|41.5794|-4.9464|121
47192|Ventosa de la Cuesta|41.4125|-4.8311|110
47193|Viana de Cega|41.5331|-4.7500|2282
47195|Villabáñez|41.6306|-4.5206|516
47196|Villabaruz de Campos|42.0097|-4.9953|31
47197|Villabrágima|41.8253|-5.1114|1075
47198|Villacarralón|42.1895|-5.0425|71
47199|Villacid de Campos|42.0817|-5.1244|83
47200|Villaco|41.7389|-4.2689|72
47203|Villafrades de Campos|42.0775|-4.9706|59
47204|Villafranca de Duero|41.4331|-5.3000|247
47205|Villafrechós|41.8933|-5.2186|473
47206|Villafuerte|41.7322|-4.3222|80
47207|Villagarcía de Campos|41.7814|-5.1931|297
47208|Villagómez la Nueva|42.1561|-5.1425|46
47209|Villalán de Campos|42.0139|-5.2367|36
47210|Villalar de los Comuneros|41.5494|-5.1386|469
47211|Villalba de la Loma|42.1756|-5.1917|56
47212|Villalba de los Alcores|41.8633|-4.8592|383
47213|Villalbarba|41.6031|-5.2131|96
47214|Villalón de Campos|42.0984|-5.0347|1473
47215|Villamuriel de Campos|41.9472|-5.2075|55
47216|Villán de Tordesillas|41.5925|-4.9214|122
47217|Villanubla|41.7114|-4.8447|2903
47218|Villanueva de Duero|41.5186|-4.8658|1263
47219|Villanueva de la Condesa|42.1492|-5.0961|64
47220|Villanueva de los Caballeros|41.7589|-5.2486|147
47221|Villanueva de los Infantes|41.7022|-4.4833|116
47222|Villanueva de San Mancio|41.9281|-5.0122|96
47223|Villardefrades|41.7233|-5.2547|145
47224|Villarmentero de Esgueva|41.6847|-4.5436|99
47225|Villasexmir|41.6389|-5.0647|67
47226|Villavaquerín|41.6631|-4.4622|155
47227|Villavellid|41.6921|-5.2767|51
47228|Villaverde de Medina|41.3069|-5.0281|497
47229|Villavicencio de los Caballeros|42.0594|-5.2372|215
47194|Viloria|41.4454|-4.3827|338
47230|Wamba|41.6764|-4.9175|289
47231|Zaratán|41.6597|-4.7842|6386
47232|La Zarza|41.2614|-4.7708|109
48001|Abadiño|43.1525|-2.6075|7768|Abadiano
48002|Abanto y Ciérvana-Abanto Zierbena|43.3147|-3.0719|9379|Abanto-Zierbena|Abanto y Ciérbana-Abanto Zierbena
48911|Ajangiz|43.2998|-2.6699|458|Ajánguiz
48912|Alonsotegi|43.2467|-2.9878|2991|Alonsótegui
48003|Amorebieta-Etxano|43.2192|-2.7342|19660|Amorebieta-Echano|Zornotza
48004|Amoroto|43.3268|-2.5133|390
48005|Arakaldo|43.1531|-2.9354|156|Aracaldo
48006|Arantzazu|43.1575|-2.7892|411|Aránzazu
48093|Areatza|43.1216|-2.7682|1292|Villaro
48009|Arrankudiaga-Zollo|43.1725|-2.9201|1018|Arrancudiaga
48914|Arratzu|43.3117|-2.6386|417|Arrazua
48010|Arrieta|43.3403|-2.7697|582
48011|Arrigorriaga|43.2078|-2.8861|11939
48023|Artea|43.1334|-2.7843|743|Castillo y Elejabeitia|Arteaga
48008|Artzentales|43.2405|-3.2280|754|Arcentales
48091|Atxondo|43.1300|-2.5836|1342|Valle de Achondo
48070|Aulesti|43.2964|-2.5628|639|Murélaga
48012|Bakio|43.4278|-2.8114|2857|Baquio
48090|Balmaseda|43.1914|-3.1936|7718|Valmaseda
48013|Barakaldo|43.2972|-2.9917|102986|Baracaldo
48014|Barrika|43.4066|-2.9610|1513|Barrica
48015|Basauri|43.2367|-2.8900|40274
48092|Bedia|43.2084|-2.8020|1111
48016|Berango|43.3650|-2.9950|8242
48017|Bermeo|43.4208|-2.7214|17038|Bermeu
48018|Berriatua|43.3097|-2.4672|1224
48019|Berriz|43.1758|-2.5756|4533
48020|Bilbao|43.2631|-2.9350|351124|Bilbo|Bilbau
48021|Busturia|43.3828|-2.6967|1693
48901|Derio|43.2917|-2.8859|7294
48026|Dima|43.1093|-2.7084|1531
48027|Durango|43.1670|-2.6321|30192
48028|Ea|43.3811|-2.5836|824
48031|Elantxobe|43.4039|-2.6386|320|Elanchove
48032|Elorrio|43.1305|-2.5426|7277
48902|Erandio|43.3047|-2.9731|24659
48033|Ereño|43.3511|-2.6159|275
48034|Ermua|43.1867|-2.5025|15516
48079|Errigoiti|43.3200|-2.7239|499|Rigoitia
48029|Etxebarri|43.2472|-2.8917|12038|Echévarri
48030|Etxebarria|43.2542|-2.4772|791|Echevarría
48906|Forua|43.3373|-2.6755|928
48035|Fruiz|43.3277|-2.7895|591|Frúniz
48036|Galdakao|43.2306|-2.8458|24776|Galdácano
48037|Galdames|43.2661|-3.0956|829
48038|Gamiz-Fika|43.3141|-2.8251|1414|Gámiz-Fica
48039|Garai|43.1947|-2.6097|332|Garay
48040|Gatika|43.3639|-2.8719|1633|Gatica
48041|Gautegiz Arteaga|43.3682|-2.6522|866|Gautéguiz de Arteaga
48046|Gernika-Lumo|43.3169|-2.6767|17129|Guernica y Luno|Guernica
48044|Getxo|43.3442|-3.0064|75752|Guecho
48047|Gizaburuaga|43.3309|-2.5379|196|Guizaburuaga
48042|Gordexola|43.1814|-3.0728|1720|Gordejuela
48043|Gorliz|43.4161|-2.9328|6034
48045|Güeñes|43.2139|-3.0942|6817
48048|Ibarrangelu|43.3896|-2.6311|669|Ibarranguelua
48094|Igorre|43.1642|-2.7783|4344|Yurre
48049|Ispaster|43.3628|-2.5431|721
48910|Iurreta|43.1778|-2.6317|3897|Yurreta
48050|Izurtza|43.1550|-2.6389|224|Izurza
48022|Karrantza Harana/Valle de Carranza|43.2057|-3.3633|2715|Carranza
48907|Kortezubi|43.3407|-2.6551|447|Cortézubi
48051|Lanestosa|43.2156|-3.4373|244
48052|Larrabetzu|43.2609|-2.7960|2039|Larrabezúa
48053|Laukiz|43.3497|-2.9144|1239|Lauquíniz
48054|Leioa|43.3289|-2.9847|32748|Lejona
48057|Lekeitio|43.3639|-2.5049|7211|Lequeitio
48055|Lemoa|43.2099|-2.7788|3614|Lemona
48056|Lemoiz|43.4114|-2.9023|1347|Lemóniz
48081|Lezama|43.2747|-2.8333|2430
48903|Loiu|43.3148|-2.9389|2364|Lujua
48058|Mallabia|43.1897|-2.5289|1106|Mallavia
48059|Mañaria|43.1392|-2.6597|539
48060|Markina-Xemein|43.2689|-2.4964|5089|Marquina-Jeméin
48061|Maruri-Jatabe|43.3964|-2.8688|1129|Jatabe
48062|Mendata|43.2879|-2.6324|382
48063|Mendexa|43.3458|-2.4858|426|Mendeja
48064|Meñaka|43.3647|-2.8017|789|Meñaca
48066|Morga|43.2833|-2.7500|416
48068|Mundaka|43.4072|-2.6983|1816|Mundaca
48069|Mungia|43.3547|-2.8472|18129|Munguía
48007|Munitibar-Arbatzegi Gerrikaitz|43.2564|-2.5948|467|Arbácegui y Guerricaiz
48908|Murueta|43.3528|-2.6806|311
48071|Muskiz|43.3233|-3.1217|7465|Musques
48067|Muxika|43.2888|-2.6914|1546|Múgica
48909|Nabarniz|43.3208|-2.5836|264|Navárniz
48073|Ondarroa|43.3219|-2.4194|8060
48075|Orozko|43.1086|-2.9111|2666|Orozco
48083|Ortuella|43.3103|-3.0569|8735
48072|Otxandio|43.0411|-2.6533|1322|Ochandiano
48077|Plentzia|43.4058|-2.9464|4407|Plencia
48078|Portugalete|43.3194|-3.0196|44843
48082|Santurtzi|43.3303|-3.0314|46442|Santurce
48084|Sestao|43.3108|-3.0056|28512
48904|Sondika|43.2991|-2.9261|4670|Sondica
48085|Sopela|43.3814|-2.9822|15048|Sopelana
48086|Sopuerta|43.2628|-3.1525|2820
48076|Sukarrieta|43.3961|-2.6950|362|Pedernales
48087|Trucios-Turtzioz|43.2838|-3.2803|515|Turtzioz
48088|Ubide|43.0242|-2.6889|167|Ubidea
48065|Ugao-Miraballes|43.1814|-2.9003|4213|Miravalles
48089|Urduliz|43.3726|-2.9492|6128
48074|Urduña/Orduña|42.9958|-3.0112|4247
48916|Usansolo|43.2219|-2.8186|4565
48080|Valle de Trápaga-Trapagaran|43.3061|-3.0356|11797|Trapagaran
48095|Zaldibar|43.1725|-2.5453|3066|Zaldívar
48096|Zalla|43.2140|-3.1310|8334
48905|Zamudio|43.2828|-2.8624|3442
48097|Zaratamo|43.2128|-2.8722|1609
48024|Zeanuri|43.0989|-2.7494|1234|Ceánuri
48025|Zeberio|43.1468|-2.8524|1087|Ceberio
48913|Zierbena|43.3518|-3.0820|1512|Ciérvana
48915|Ziortza-Bolibar|43.2450|-2.5558|401|Cenarruza
49002|Abezames|41.6251|-5.4266|58
49003|Alcañices|41.6989|-6.3479|1062
49004|Alcubilla de Nogales|42.1272|-5.9222|108|Alcubilla de Nozales
49005|Alfaraz de Sayago|41.2273|-5.9834|120
49006|Algodre|41.5667|-5.6037|131
49007|Almaraz de Duero|41.4667|-5.9167|386
49008|Almeida de Sayago|41.2672|-6.0728|411
49009|Andavías|41.5980|-5.8555|404
49010|Arcenillas|41.4560|-5.6857|450
49011|Arcos de la Polvorosa|41.9444|-5.6975|211
49012|Argañín|41.4397|-6.2100|79
49013|Argujillo|41.3111|-5.5875|215
49014|Arquillinos|41.7089|-5.6561|105
49015|Arrabalde|42.1078|-5.8953|186
49016|Aspariegos|41.6736|-5.5986|223
49017|Asturianos|42.0531|-6.4866|252|Esturianos
49018|Ayoó de Vidriales|42.1286|-6.0667|264
49019|Barcial del Barco|41.9342|-5.6642|254
49020|Belver de los Montes|41.7230|-5.4498|252
49021|Benavente|42.0049|-5.6756|17309|Benavent
49022|Benegiles|41.6267|-5.6353|266
49023|Bermillo de Sayago|41.3658|-6.1119|1028|Bermiellu de Seyagu
49024|La Bóveda de Toro|41.3424|-5.4095|682
49025|Bretó|41.8819|-5.7383|163
49026|Bretocino|41.8833|-5.7550|192
49027|Brime de Sog|42.0614|-6.0475|114
49028|Brime de Urz|42.0381|-5.8733|96
49029|Burganes de Valverde|41.9220|-5.7808|593
49030|Bustillo del Oro|41.6744|-5.4614|75
49031|Cabañas de Sayago|41.3331|-5.7906|143
49032|Calzadilla de Tera|41.9800|-6.0825|278
49033|Camarzana de Tera|41.9946|-6.0264|740
49034|Cañizal|41.1672|-5.3677|410
49035|Cañizo|41.7683|-5.5033|197
49036|Carbajales de Alba|41.6544|-5.9969|463
49037|Carbellino|41.2297|-6.1481|174|Carbellinu
49038|Casaseca de Campeán|41.3755|-5.7462|88
49039|Casaseca de las Chanas|41.4394|-5.6756|373
49040|Castrillo de la Guareña|41.2300|-5.3249|133
49041|Castrogonzalo|41.9911|-5.6036|432
49042|Castronuevo|41.7217|-5.5433|216
49043|Castroverde de Campos|41.9700|-5.3033|240
49044|Cazurra|41.4156|-5.7036|72
49046|Cerecinos de Campos|41.9008|-5.4872|231
49047|Cerecinos del Carrizal|41.6833|-5.6531|111
49048|Cernadilla|42.0203|-6.4173|105
49050|Cobreros|42.0756|-6.7014|543
49052|Coomonte|42.1155|-5.8132|180
49053|Coreses|41.5481|-5.6222|1054
49054|Corrales del Vino|41.3578|-5.7275|930
49055|Cotanes del Monte|41.8169|-5.2898|79
49056|Cubillos|41.5750|-5.7394|294
49057|Cubo de Benavente|42.1236|-6.1631|115
49058|El Cubo de Tierra del Vino|41.2550|-5.7108|294|El Cubo del Vino
49059|Cuelgamures|41.3068|-5.6575|77
49061|Entrala|41.4312|-5.7547|133
49062|Espadañedo|42.1161|-6.3936|109
49063|Faramontanos de Tábara|41.8342|-5.8933|318
49064|Fariza|41.4181|-6.2667|487
49065|Fermoselle|41.3174|-6.3949|1131
49066|Ferreras de Abajo|41.8969|-6.0781|461
49067|Ferreras de Arriba|41.8986|-6.1944|350
49068|Ferreruela|41.7658|-6.0719|409
49069|Figueruela de Arriba|41.8686|-6.4431|310
49071|Fonfría|41.6356|-6.1404|794
49075|Fresno de la Polvorosa|42.0836|-5.7700|117
49076|Fresno de la Ribera|41.5283|-5.5694|326|Freisnu de la Ribera
49077|Fresno de Sayago|41.3184|-5.9708|137|Fresnu de Sayago
49078|Friera de Valverde|41.9132|-5.8416|121
49079|Fuente Encalada|42.1106|-5.9933|92|Fonte Encalada
49080|Fuentelapeña|41.2527|-5.3824|589
49082|Fuentes de Ropel|42.0026|-5.5458|369
49081|Fuentesaúco|41.2317|-5.4974|1593
49083|Fuentesecas|41.6306|-5.4725|43
49084|Fuentespreadas|41.3267|-5.6271|267
49085|Galende|42.1052|-6.6622|1019
49086|Gallegos del Pan|41.5981|-5.5833|118
49087|Gallegos del Río|41.7352|-6.1735|455
49088|Gamones|41.4670|-6.1778|89
49090|Gema|41.4183|-5.6494|201
49091|Granja de Moreruela|41.8103|-5.7389|228
49092|Granucillo|42.0519|-5.9275|105
49093|Guarrate|41.2888|-5.4418|313
49094|Hermisende|41.9687|-6.8953|207
49095|La Hiniesta|41.5525|-5.7988|293
49096|Jambrina|41.3938|-5.6638|149
49097|Justel|42.1501|-6.2943|75
49098|Losacino|41.6811|-6.0794|189
49099|Losacio|41.7109|-6.0399|90
49100|Lubián|42.0350|-6.9069|296
49101|Luelmo|41.4396|-6.1327|148|Luelmu
49102|El Maderal|41.2820|-5.6228|172
49103|Madridanos|41.4803|-5.6041|461
49104|Mahide|41.8692|-6.3772|299
49105|Maire de Castroponce|42.1117|-5.7842|138
49107|Malva|41.6544|-5.4864|92
49108|Manganeses de la Lampreana|41.7503|-5.7089|438
49109|Manganeses de la Polvorosa|42.0362|-5.7464|637
49110|Manzanal de Arriba|41.9915|-6.4398|332
49112|Manzanal de los Infantes|42.0550|-6.3828|133
49111|Manzanal del Barco|41.6362|-5.9461|118
49113|Matilla de Arzón|42.1061|-5.6419|150
49114|Matilla la Seca|41.5792|-5.5000|33
49115|Mayalde|41.2511|-5.7975|140
49116|Melgar de Tera|41.9658|-6.0141|331
49117|Micereces de Tera|41.9887|-5.8713|404
49118|Milles de la Polvorosa|41.9232|-5.7330|206
49119|Molacillos|41.5828|-5.6592|223
49120|Molezuelas de la Carballeda|42.0828|-6.1862|47
49121|Mombuey|42.0241|-6.3290|395
49122|Monfarracinos|41.5539|-5.7063|998
49123|Montamarta|41.6470|-5.8049|549
49124|Moral de Sayago|41.4725|-6.1011|265
49126|Moraleja de Sayago|41.1710|-6.0015|300
49125|Moraleja del Vino|41.4646|-5.6554|1796
49128|Morales de Rey|42.0678|-5.7856|529|Morales del Rey
49129|Morales de Toro|41.5367|-5.3086|918
49130|Morales de Valverde|41.9400|-5.8900|156
49127|Morales del Vino|41.4464|-5.7319|3040
49131|Moralina|41.4894|-6.1383|211
49132|Moreruela de los Infanzones|41.6314|-5.7069|318
49133|Moreruela de Tábara|41.7989|-5.8711|290
49134|Muelas de los Caballeros|42.1300|-6.3353|184|Mueles de los Caballeros
49135|Muelas del Pan|41.5212|-5.9673|592
49136|Muga de Sayago|41.3874|-6.1984|313
49137|Navianos de Valverde|41.9536|-5.8167|157
49138|Olmillos de Castro|41.7317|-5.9689|182
49139|Otero de Bodas|41.9392|-6.1508|164
49141|Pajares de la Lampreana|41.7153|-5.6933|282|Payares de la Lampreana
49143|Palacios de Sanabria|42.0550|-6.5269|233
49142|Palacios del Pan|41.6040|-5.8767|249
49145|Pedralba de la Pradería|42.0245|-6.6938|198
49146|El Pego|41.3348|-5.4685|268
49147|Peleagonzalo|41.4819|-5.4819|286
49148|Peleas de Abajo|41.3921|-5.6899|248
49149|Peñausende|41.2873|-5.8667|386
49150|Peque|42.0729|-6.2748|111
49151|El Perdigón|41.4111|-5.7539|673
49152|Pereruela|41.4159|-5.8774|499
49153|Perilla de Castro|41.7264|-5.8764|150
49154|Pías|42.0861|-6.9994|91
49155|Piedrahita de Castro|41.6808|-5.7289|104
49156|Pinilla de Toro|41.6278|-5.3647|186
49157|Pino del Oro|41.5761|-6.1208|173
49158|El Piñero|41.3541|-5.5874|210
49160|Pobladura de Valderaduey|41.6997|-5.5425|34
49159|Pobladura del Valle|42.1025|-5.7335|269
49162|Porto|42.1672|-6.8994|147
49163|Pozoantiguo|41.5953|-5.4344|188
49164|Pozuelo de Tábara|41.7853|-5.8917|150
49165|Prado|41.9206|-5.4189|53
49166|Puebla de Sanabria|42.0553|-6.6336|1378|Pobra de Seabra|La Puebla de Senabria
49167|Pueblica de Valverde|41.9192|-5.8983|172
49170|Quintanilla de Urz|42.0329|-5.8487|98
49168|Quintanilla del Monte|41.8678|-5.3494|93
49169|Quintanilla del Olmo|41.9051|-5.4065|38
49171|Quiruelas de Vidriales|42.0206|-5.8306|615
49172|Rabanales|41.7417|-6.2758|497
49173|Rábano de Aliste|41.7450|-6.4331|313
49174|Requejo|42.0306|-6.7425|107|Requeixo de Seabra
49175|Revellinos|41.8914|-5.5686|223
49176|Riofrío de Aliste|41.8153|-6.1772|589
49177|Rionegro del Puente|42.0067|-6.2264|224
49178|Roales|41.5517|-5.7728|1019
49179|Robleda-Cervantes|42.0836|-6.5914|375
49180|Roelos de Sayago|41.2519|-6.1715|133
49181|Rosinos de la Requejada|42.0892|-6.5343|292
49183|Salce|41.2713|-6.2168|83
49184|Samir de los Caños|41.6731|-6.1636|158
49185|San Agustín del Pozo|41.8856|-5.5942|163
49186|San Cebrián de Castro|41.7053|-5.7564|250
49187|San Cristóbal de Entreviñas|42.0468|-5.6345|1328
49188|San Esteban del Molar|41.9372|-5.5518|117
49189|San Justo|42.1350|-6.6244|207
49190|San Martín de Valderaduey|41.8136|-5.4717|47
49191|San Miguel de la Ribera|41.3338|-5.5771|244
49192|San Miguel del Valle|42.0294|-5.4969|123
49193|San Pedro de Ceque|42.0431|-6.0736|417
49194|San Pedro de la Nave-Almendra|41.5917|-5.9225|313|San Pedru de la Nave-Almendra
49208|San Vicente de la Cabeza|41.8054|-6.2523|309
49209|San Vitero|41.7755|-6.3483|419
49197|Santa Clara de Avedillo|41.3394|-5.6769|153
49199|Santa Colomba de las Monjas|41.9592|-5.6861|236
49200|Santa Cristina de la Polvorosa|41.9999|-5.7132|1034|Santo Cristina de la Polvorosa
49201|Santa Croya de Tera|41.9837|-5.9752|253
49202|Santa Eufemia del Barco|41.6778|-5.8994|169
49203|Santa María de la Vega|42.0856|-5.8097|259
49204|Santa María de Valverde|41.9353|-5.9344|50
49205|Santibáñez de Tera|41.9848|-5.9227|351
49206|Santibáñez de Vidriales|42.0717|-6.0146|846
49207|Santovenia|41.8786|-5.7092|219
49210|Sanzoles|41.4322|-5.5669|454
49214|Tábara|41.8261|-5.9589|743
49216|Tapioles|41.8575|-5.4964|128
49219|Toro|41.5200|-5.3947|8336
49220|La Torre del Valle|42.0916|-5.7223|122
49221|Torregamones|41.4881|-6.1785|225
49222|Torres del Carrizal|41.6161|-5.6703|413
49223|Trabazos|41.7472|-6.4931|848
49224|Trefacio|42.1222|-6.6525|163
49225|Uña de Quintana|42.0864|-6.1444|119
49226|Vadillo de la Guareña|41.2818|-5.3529|240
49227|Valcabado|41.5492|-5.7492|414
49228|Valdefinjas|41.4522|-5.4522|60
49229|Valdescorriel|42.0225|-5.5106|131
49230|Vallesa de la Guareña|41.1354|-5.3262|67
49231|Vega de Tera|41.9979|-6.1247|265
49232|Vega de Villalobos|41.9700|-5.4631|88
49233|Vegalatrave|41.7003|-6.1067|79
49234|Venialbo|41.3894|-5.5386|439
49235|Vezdemarbán|41.6542|-5.3669|423
49236|Vidayanes|41.9083|-5.5750|74
49237|Videmala|41.6131|-6.0419|131
49238|Villabrázaro|42.0528|-5.7289|255
49239|Villabuena del Puente|41.3799|-5.4085|574
49240|Villadepera|41.5486|-6.1333|165
49241|Villaescusa|41.2062|-5.4641|237
49242|Villafáfila|41.8486|-5.6150|429
49243|Villaferrueña|42.0989|-5.8583|105
49244|Villageriz|42.1189|-5.9555|63
49245|Villalazán|41.4944|-5.5892|241
49246|Villalba de la Lampreana|41.7433|-5.6414|212
49247|Villalcampo|41.5218|-6.0486|380
49248|Villalobos|41.9458|-5.4747|200
49249|Villalonso|41.5972|-5.2978|80
49250|Villalpando|41.8647|-5.4131|1433
49251|Villalube|41.6106|-5.5456|143
49252|Villamayor de Campos|41.8989|-5.3592|330
49255|Villamor de los Escuderos|41.2527|-5.5737|362
49256|Villanázar|41.9750|-5.7803|256
49257|Villanueva de Azoague|41.9744|-5.6644|398
49258|Villanueva de Campeán|41.3536|-5.7686|115
49259|Villanueva de las Peras|41.9358|-5.9789|85
49260|Villanueva del Campo|41.9856|-5.4075|736
49263|Villar de Fallaves|41.9253|-5.3447|50|Villardefallaves
49264|Villar del Buey|41.3281|-6.1874|483
49261|Villaralbo|41.4922|-5.6847|1782
49262|Villardeciervos|41.9412|-6.2869|383
49265|Villardiegua de la Ribera|41.5361|-6.1822|106
49266|Villárdiga|41.8192|-5.4639|60
49267|Villardondiego|41.5844|-5.3767|110
49268|Villarrín de Campos|41.7961|-5.6400|387
49269|Villaseco del Pan|41.4689|-5.9636|201
49270|Villavendimio|41.5783|-5.3436|150
49272|Villaveza de Valverde|41.9447|-5.8500|72
49271|Villaveza del Agua|41.9189|-5.6800|162
49273|Viñas|41.7733|-6.4714|148
49275|Zamora|41.5033|-5.7556|59815
50001|Abanto|41.1369|-1.6987|78
50002|Acered|41.1705|-1.6043|131|Aceret
50003|Agón|41.8564|-1.4533|135
50004|Aguarón|41.3389|-1.2697|602
50005|Aguilón|41.2950|-1.0467|265
50006|Ainzón|41.8161|-1.5197|1036
50007|Aladrén|41.2492|-1.1560|62
50008|Alagón|41.7711|-1.1189|7532|Alagó
50009|Alarba|41.2046|-1.6129|91|Alfarba
50010|Alberite de San Juan|41.8203|-1.4710|79|Alberit de Sant Chuan
50011|Albeta|41.8269|-1.5003|138
50012|Alborge|41.3347|-0.3575|104|Alborche
50013|Alcalá de Ebro|41.8140|-1.1941|244|Alcalá d'Ebro
50014|Alcalá de Moncayo|41.7862|-1.6969|147
50015|Alconchel de Ariza|41.2041|-2.1221|79|Alconchel de Fariza
50016|Aldehuela de Liestos|41.0642|-1.7006|48|L'Aldeyuela de Tiestos
50017|Alfajarín|41.6138|-0.7037|2423|Alfacharín
50018|Alfamén|41.4384|-1.2432|1470
50019|Alforque|41.3299|-0.3853|57|Alforc
50020|Alhama de Aragón|41.2965|-1.8950|917|Alfama d'Aragón
50021|Almochuel|41.2802|-0.5496|22
50022|La Almolda|41.5519|-0.2073|521|L'Almolda
50023|Almonacid de la Cuba|41.2795|-0.7924|220|Almonecir de la Cuba
50024|Almonacid de la Sierra|41.3974|-1.3239|756|Almonecir de la Sierra
50025|La Almunia de Doña Godina|41.4833|-1.3833|8080|L'Almunia de Donya Godina
50026|Alpartir|41.4222|-1.3804|599|Alpartil
50027|Ambel|41.7954|-1.6156|253
50028|Anento|41.0700|-1.3330|117
50029|Aniñón|41.4459|-1.7048|678|Aninyón
50030|Añón de Moncayo|41.7786|-1.7210|207|Anyón de Moncayo
50031|Aranda de Moncayo|41.5782|-1.7921|112
50032|Arándiga|41.5093|-1.4998|279
50033|Ardisa|42.2009|-0.7582|73
50034|Ariza|41.3105|-2.0553|1096|Fariza
50035|Artieda|42.5866|-0.9837|90
50036|Asín|42.2837|-1.0466|88
50037|Atea|41.1601|-1.5546|142
50038|Ateca|41.3308|-1.7929|1785
50039|Azuara|41.2573|-0.8714|548
50040|Badules|41.1380|-1.2518|83|Baduls
50041|Bagüés|42.5493|-0.9459|16
50042|Balconchán|41.0875|-1.4605|19|Val Conchán
50043|Bárboles|41.7124|-1.1878|277|Bárbols
50044|Bardallur|41.6839|-1.2123|242
50045|Belchite|41.3065|-0.7546|1495|Belchit
50046|Belmonte de Gracián|41.3125|-1.5374|183|Belmont de Gracián
50047|Berdejo|41.5614|-1.9441|40|Verdello
50048|Berrueco|40.9906|-1.4669|32
50901|Biel|42.3869|-0.9357|166
50050|Bijuesca|41.5405|-1.9204|93|Bichuesca
50051|Biota|42.2613|-1.1885|832
50052|Bisimbre|41.8560|-1.4433|98
50053|Boquiñeni|41.8481|-1.2516|743|Boquinyeni
50054|Bordalba|41.4167|-2.0785|47
50055|Borja|41.8348|-1.5338|5202|Borcha
50056|Botorrita|41.5067|-1.0301|587
50057|Brea de Aragón|41.5243|-1.6007|1517|Ebreya
50058|Bubierca|41.3143|-1.8538|66
50059|Bujaraloz|41.4973|-0.1537|938|Burcharaloz
50060|Bulbuente|41.8193|-1.6024|250|Bulbuent
50061|Bureta|41.8162|-1.4883|210
50062|El Burgo de Ebro|41.5722|-0.7424|2750|Lo Burgo d'Ebro
50063|El Buste|41.8859|-1.6017|60|Lo Bust
50064|Cabañas de Ebro|41.7946|-1.1625|473|Cabanyas d'Ebro
50065|Cabolafuente|41.2113|-2.0399|50|Cabrafuent
50066|Cadrete|41.5557|-0.9612|4688|Cadret
50067|Calatayud|41.3500|-1.6333|20158|Calataiud|Calatayú
50068|Calatorao|41.5222|-1.3466|2970|Calatorau
50069|Calcena|41.6554|-1.7181|65
50070|Calmarza|41.1578|-1.9117|57
50071|Campillo de Aragón|41.1266|-1.8431|111|Campiello d'Aragón
50072|Carenas|41.2778|-1.7975|169
50073|Cariñena|41.3374|-1.2249|3530|Carinyena
50074|Caspe|41.2367|-0.0396|10365|Casp
50075|Castejón de Alarba|41.1832|-1.6360|75|Castellón d'Alfarba
50076|Castejón de las Armas|41.3098|-1.8112|87|Castellón de las Armas
50077|Castejón de Valdejasa|41.9823|-0.9941|188|Castellón de Val de Chasa
50078|Castiliscar|42.3764|-1.2736|219
50079|Cervera de la Cañada|41.4322|-1.7353|263|Cervera de la Canyada
50080|Cerveruela|41.2156|-1.2152|38
50081|Cetina|41.2916|-1.9618|534
50092|Chiprana|41.2624|-0.1272|496|Xiprana
50093|Chodes|41.4868|-1.4800|98
50082|Cimballa|41.1025|-1.7750|70
50083|Cinco Olivas|41.3393|-0.3716|97
50084|Clarés de Ribota|41.5297|-1.8377|73
50085|Codo|41.3334|-0.6994|204
50086|Codos|41.2935|-1.3745|237|Coldos
50087|Contamina|41.3057|-1.9176|34
50088|Cosuenda|41.3640|-1.2983|344
50089|Cuarte de Huerva|41.5936|-0.9389|15408|Quart de la Uerva
50090|Cubel|41.0975|-1.6348|145
50091|Las Cuerlas|40.9595|-1.5495|44
50094|Daroca|41.1132|-1.4170|1899
50095|Ejea de los Caballeros|42.1273|-1.1384|17129|Eixea|Exeya d'os Caballers
50096|Embid de Ariza|41.3797|-1.9725|28|Embit de Fariza
50098|Encinacorba|41.2845|-1.2754|176|Lecinacorba
50099|Épila|41.5985|-1.2796|4704
50100|Erla|42.1150|-0.9476|374
50101|Escatrón|41.2870|-0.3251|1189
50102|Fabara|41.1779|0.1676|1063|Favara de Matarranya|Favara
50104|Farlete|41.6810|-0.5072|372|Farlet
50105|Fayón|41.2403|0.3329|448|Faió
50106|Los Fayos|41.8800|-1.7829|135
50107|Figueruelas|41.7661|-1.1752|1303
50108|Fombuena|41.1440|-1.1923|59|Fuent Buena
50109|El Frago|42.2715|-0.9313|129|O Frago
50110|El Frasno|41.4139|-1.4950|370|Lo Fraixno
50111|Fréscano|41.8743|-1.4495|196
50113|Fuendejalón|41.7608|-1.4720|774|Fuent de Xalón
50114|Fuendetodos|41.3413|-0.9595|130|Fuent de Totz
50115|Fuentes de Ebro|41.5114|-0.6287|4862|Fuents d'Ebro
50116|Fuentes de Jiloca|41.2290|-1.5376|209|Fuents de Xiloca
50117|Gallocanta|40.9950|-1.5069|128
50118|Gallur|41.8692|-1.3161|2642
50119|Gelsa|41.4072|-0.4603|996|Exelsa
50120|Godojos|41.2686|-1.8644|55|Godollo
50121|Gotor|41.5453|-1.6500|309
50122|Grisel|41.8708|-1.7283|101
50123|Grisén|41.7443|-1.1642|630
50124|Herrera de los Navarros|41.2094|-1.0808|495|Ferrera de los Navarros
50125|Ibdes|41.2176|-1.8336|351
50126|Illueca|41.5380|-1.6284|2782
50128|Isuerre|42.4881|-1.0560|32
50129|Jaraba|41.1901|-1.8841|294|Charava
50130|Jarque de Moncayo|41.5561|-1.6783|373|Exarc de Moncayo
50131|Jaulín|41.4521|-0.9925|305|Exaulín
50132|La Joyosa|41.7448|-1.0729|1156|La Choyosa
50133|Lagata|41.2398|-0.8047|113
50134|Langa del Castillo|41.2108|-1.3981|110
50135|Layana|42.2968|-1.2450|95
50136|Lécera|41.2032|-0.7107|578
50138|Lechón|41.0865|-1.2842|39
50137|Leciñena|41.7928|-0.6139|1087|Lecinyena
50139|Letux|41.2545|-0.8027|349|Letuix
50140|Litago|41.8139|-1.7536|173
50141|Lituénigo|41.8358|-1.7608|123
50142|Lobera de Onsella|42.4787|-1.0216|28|Lobera d'Onsella
50143|Longares|41.4019|-1.1678|802|Longars
50144|Longás|42.4803|-0.9351|45|Longars
50146|Lucena de Jalón|41.5531|-1.3140|223|Lucena de Xalón
50147|Luceni|41.8286|-1.2392|1003
50148|Luesia|42.3697|-1.0232|332
50149|Luesma|41.1663|-1.1462|42
50150|Lumpiaque|41.6298|-1.3026|889|Lumpiac
50151|Luna|42.1675|-0.9326|674
50152|Maella|41.1222|0.1394|2158
50153|Magallón|41.8326|-1.4609|1108
50154|Mainar|41.1922|-1.3042|162
50155|Malanquilla|41.5694|-1.8758|71|Malanquiella
50156|Maleján|41.8284|-1.5489|282|Maleixán
50160|Mallén|41.9006|-1.4189|2951
50157|Malón|41.9533|-1.6708|474
50159|Maluenda|41.2831|-1.6167|895
50161|Manchones|41.1494|-1.4658|91|Manchons
50162|Mara|41.2890|-1.5181|161
50163|María de Huerva|41.5412|-0.9947|6558|María de la Uerva
50902|Marracos|42.0907|-0.7777|82
50164|Mediana de Aragón|41.4667|-0.7074|469|Mediana d'Aragón
50165|Mequinenza|41.3742|0.3025|2236|Mequinensa
50166|Mesones de Isuela|41.5514|-1.5384|270|Mesons d'Isuela
50167|Mezalocha|41.4260|-1.0832|197
50168|Mianos|42.5838|-0.9541|25|Mians
50169|Miedes de Aragón|41.2574|-1.4916|408|Miedes d'Aragón
50170|Monegrillo|41.6387|-0.4158|378|Monegriello
50171|Moneva|41.1272|-0.8298|107
50172|Monreal de Ariza|41.2909|-2.1051|175|Mont-reyal de Fariza
50173|Monterde|41.1742|-1.7351|143|Monterd
50174|Montón|41.2067|-1.5152|89
50175|Morata de Jalón|41.4733|-1.4749|1100|Morata de Xalón
50176|Morata de Jiloca|41.2480|-1.5869|285|Morata de Xiloca
50177|Morés|41.4733|-1.5653|303
50178|Moros|41.3989|-1.8261|274
50179|Moyuela|41.1321|-0.9247|221
50180|Mozota|41.4830|-1.0695|130
50181|Muel|41.4655|-1.0858|1540
50182|La Muela|41.5808|-1.1161|6737
50183|Munébrega|41.2515|-1.7052|351
50184|Murero|41.1581|-1.4822|85
50185|Murillo de Gállego|42.3363|-0.7529|194|Morillo de Galligo
50186|Navardún|42.5128|-1.1460|35
50187|Nigüella|41.5381|-1.5250|58
50188|Nombrevilla|41.1070|-1.3588|40
50189|Nonaspe|41.2091|0.2475|997|Nonasp
50190|Novallas|41.9467|-1.6942|859
50191|Novillas|41.9342|-1.3950|508|Noviellas
50192|Nuévalos|41.2125|-1.7886|318
50193|Nuez de Ebro|41.5953|-0.6826|886|Nuez d'Ebro
50194|Olvés|41.2393|-1.6466|107|Olbés
50195|Orcajo|41.1089|-1.4894|65|Forcallo
50196|Orera|41.2987|-1.4795|103
50197|Orés|42.2791|-0.9997|72
50198|Oseja|41.5956|-1.7001|43|Osella|Oseya
50199|Osera de Ebro|41.5344|-0.5806|442|Osera d'Ebro
50200|Paniza|41.2840|-1.2122|574
50201|Paracuellos de Jiloca|41.3151|-1.6421|610|Paracuellos de Xiloca
50202|Paracuellos de la Ribera|41.4231|-1.5629|111
50203|Pastriz|41.6189|-0.7843|1316
50204|Pedrola|41.7874|-1.2142|3842
50205|Las Pedrosas|42.0377|-0.8765|118|As Pedrosas
50206|Perdiguera|41.7544|-0.6298|559
50207|Piedratajada|42.1202|-0.8065|96|Piedratallada
50208|Pina de Ebro|41.4890|-0.5260|2478|Pina d'Ebro
50209|Pinseque|41.7378|-1.1014|4601|Pinsequet|Pinsec
50210|Los Pintanos|42.5292|-1.0219|37|Pintano|Os Pintanos
50211|Plasencia de Jalón|41.6811|-1.2297|378|Placiencia de Xalón
50212|Pleitas|41.7113|-1.2028|29
50213|Plenas|41.1121|-0.9641|110|Plenes
50214|Pomer|41.6378|-1.8408|23
50215|Pozuel de Ariza|41.3522|-2.1556|15|Pozuel de Fariza
50216|Pozuelo de Aragón|41.7649|-1.4238|247|Pozuelo d'Aragón
50217|Pradilla de Ebro|41.8604|-1.2632|553|Pratiella d'Ebro
50218|Puebla de Albortón|41.3849|-0.8552|133|La Puebla de Albortón|Puebla d'Albortón
50219|La Puebla de Alfindén|41.6316|-0.7509|6550|Puebla d'Alfindén
50220|Puendeluna|42.1532|-0.7599|42|Puent de Luna
50221|Purujosa|41.6825|-1.7641|29|Purullosa
50222|Quinto|41.4248|-0.4975|1882
50223|Remolinos|41.8373|-1.1754|1018
50224|Retascón|41.1442|-1.3811|77
50225|Ricla|41.5036|-1.4028|3019
50227|Romanos|41.1270|-1.2760|140
50228|Rueda de Jalón|41.6331|-1.2747|325|Rueda de Xalón
50229|Ruesca|41.2825|-1.4817|69
50241|Sabiñán|41.4486|-1.5609|697|Sabinyán
50230|Sádaba|42.2821|-1.2718|1278
50231|Salillas de Jalón|41.5670|-1.3243|372|Saliellas de Xalón
50232|Salvatierra de Esca|42.6680|-1.0038|187|Salbaterra Ezka|Salvatierra d'Esca
50233|Samper del Salz|41.2347|-0.8246|79|Sant Per de Lagata
50234|San Martín de la Virgen de Moncayo|41.8383|-1.7920|266|Sant Martín de la Virchen de Moncayo|San Martín de la Virxe de Moncayo
50235|San Mateo de Gállego|41.8314|-0.7662|3489|Sant Mateu de Galligo
50236|Santa Cruz de Grío|41.3700|-1.4308|95|Santa Cruz de Griu
50237|Santa Cruz de Moncayo|41.8824|-1.7573|123
50238|Santa Eulalia de Gállego|42.2861|-0.7611|101|Santolaria de Galligo
50239|Santed|41.0328|-1.5068|72|Santet
50240|Sástago|41.3234|-0.3456|1067
50242|Sediles|41.3464|-1.5302|109|Sedils
50243|Sestrica|41.4870|-1.5949|329
50244|Sierra de Luna|42.0490|-0.9098|269
50245|Sigüés|42.6303|-1.0125|72|Zigoze
50246|Sisamón|41.1708|-2.0043|50
50247|Sobradiel|41.7389|-1.0369|1110
50248|Sos del Rey Católico|42.4973|-1.2157|582|Sause|Sos d'o Rei Catolico
50249|Tabuenca|41.6953|-1.5435|305
50250|Talamantes|41.7303|-1.6782|68|Talamants
50251|Tarazona|41.9044|-1.7242|10873|Tarassona
50252|Tauste|41.9203|-1.2547|6838|Taüst|Deustia|Taust
50253|Terrer|41.3267|-1.7122|580
50254|Tierga|41.6065|-1.6061|170
50255|Tobed|41.3384|-1.4001|196|Tobet
50256|Torralba de los Frailes|41.0367|-1.6610|65|Torralba de los Fraires
50257|Torralba de Ribota|41.4167|-1.6858|157
50258|Torralbilla|41.2100|-1.3381|38|Torralbiella
50259|Torrehermosa|41.2384|-2.1275|69|Torre Fermosa
50260|Torrelapaja|41.5819|-1.9500|30|Torre la Palla
50261|Torrellas|41.8950|-1.7692|249
50262|Torres de Berrellén|41.7573|-1.0645|1515
50263|Torrijo de la Cañada|41.4728|-1.8736|187|Turrillo
50264|Tosos|41.3154|-1.0726|176
50265|Trasmoz|41.8264|-1.7236|88
50266|Trasobares|41.6439|-1.6408|124|Trasobars
50267|Uncastillo|42.3605|-1.1310|594|Uncastiello
50268|Undués de Lerda|42.5655|-1.1692|60|Undoze Lerda
50269|Urrea de Jalón|41.6683|-1.2350|434|Urreya de Xalón
50270|Urriés|42.5192|-1.1290|50
50271|Used|41.0561|-1.5611|250|Fuset
50272|Utebo|41.7141|-0.9944|19116|Utevo
50274|Val de San Martín|41.0573|-1.4466|55|Val de Sant Martín
50273|Valdehorna|41.0726|-1.4229|29|Val de Forna
50275|Valmadrid|41.4434|-0.8845|112|Val Madriz
50276|Valpalmas|42.1582|-0.8548|122|Val Palmas
50277|Valtorres|41.2987|-1.7407|65|Val Torres
50278|Velilla de Ebro|41.3736|-0.4372|208|Viliella d'Ebro
50279|Velilla de Jiloca|41.2746|-1.6040|90|Viliella de Xiloca
50280|Vera de Moncayo|41.8249|-1.6875|317
50281|Vierlas|41.9267|-1.6802|88
50283|Villadoz|41.1626|-1.2872|80|Villadolz
50284|Villafeliche|41.1958|-1.5105|163|Villafelich
50285|Villafranca de Ebro|41.5745|-0.6503|828|Villafranca d'Ebro
50286|Villalba de Perejil|41.3276|-1.5489|86
50287|Villalengua|41.4353|-1.8403|295|Villa Luenga
50903|Villamayor de Gállego|41.6856|-0.7739|2841|Villamayor de Galligo
50288|Villanueva de Gállego|41.7683|-0.8264|4852|Villanueva de Galligo
50290|Villanueva de Huerva|41.3544|-1.0358|360|Villanueva de la Uerva
50289|Villanueva de Jiloca|41.0753|-1.3925|73|Villanueva de Xiloca
50291|Villar de los Navarros|41.1587|-1.0430|147
50292|Villarreal de Huerva|41.1902|-1.2895|270|Villa-reyal de la Uerva
50293|Villarroya de la Sierra|41.4636|-1.7837|397
50294|Villarroya del Campo|41.1432|-1.3256|70|Villarroya del Campu
50282|La Vilueña|41.2728|-1.7252|59|La Viluenya
50295|Vistabella|41.2183|-1.1544|51
50296|La Zaida|41.3223|-0.4252|433
50297|Zaragoza|41.6500|-0.8833|693091|Saragossa
50298|Zuera|41.8692|-0.7881|8766
51001|Ceuta|35.8867|-5.3000|83595
52001|Melilla|35.2825|-2.9475|86780
`;
