# websida
Ett litet fullstack-projekt med en blogg där man kan rita i sina inlägg. Syftet är framförallt att leka med canvas och SVG, och att experimentera med säkerhet och kryptering.

## Utseendet
Det proffsiga utseendet står Bootstrap för. Jag hittade en fin template, och tweakade lite bara. Framförallt tog jag bort Bootstraps en miljon div-ar för att göra sajten lite mer handikappvänlig. Bilderna är gratis stock-foton från [pixabay](pixabay.com).

## Ritandet
Jag har använt jQuery-pluginsen [svgjs](http://svgjs.com/) och [svg.draw.js](http://svgjs.com/svg.draw.js/) för lite enkla rit-funktioner. Såhär i efterhand, när jag fattat vad det är som pågår bakom kulisserna, inser jag att jag enkelt hade kunna implementera det hela själv. Lite onClick hit och lite pageX/pageY dit bara.

Grafiken sparas som SVG, eftersom det är XML och därmed ett väldigt behändigt format för mig att hantera.

## Säkerhet/kryptering i front-end
Jag har inte använt några färdiga paket för säkerheten (så för guds skull lita inte på säkerheten här, det är en sandlåda :smiley:.) Istället har jag testat lite själv.

Säkerheten i front-end handlar hur lösenordet ska skickas. I korthet så saltas och hashas det lokalt, och skickas sen i klartext. I detalj så har varje användare ett unikt salt i databasen. Varje gång koden skickas från klient till server så hämtas det, lösenordet saltas och hashas med md5 (med [denna](https://github.com/placemarker/jQuery-MD5) jQuery-plugin) och skickas till server. Vän av ordning noterar två saker:

#### SSL saknas
Det saltade + hashade lösenordet skickas i klartext. Ingen SSL, och inget försök att själv implementera något liknande. Så om någon sniffar upp trafiken har de lösenordet och kan attackera. I denna aspekt är sajten helt klart inte färdig. Däremot är det uppsniffade lösenordet oanvändbart på andra sajter där användaren har använt samma lösenord, pga. salt+hash. Utan saltet hade det fortfarande kunnat användas på sajter som också använder md5.

Ett annat problem är att även saltet skickas i klartext, utan SSL. I samband med problemet som beskrivs under rubriken nedan blir detta allvarligt.

#### MD5 är en dålig hashning för lösenord.
MD5 är en dålig algoritm för ändamålet. Du kanske har hört talas om att "MD5 är preimage-crackat" men det är på sin höjd en halvsanning: Attacken som upptäcktes 2009 är betydligt snabbare än brute force, men fortfarande oanvändbart långsam i praktiken. Nej, det är hastigheten som är problemet! MD5 går riktigt, riktigt snabbt nuförtiden, vilket betyder att med dåligt salt kan man använda lookup tables över vanliga ord för att brute-forcea preimage-attacker fort som tusan, om inte lösenordet är galet bra (inte mitt-bästa-lösenord-bra, utan typ 60 slumpmässiga tecken bra.) Mitt salt är rätt långt och motstår iaf enkla crackningsförsök, men detta är naturligtvis inte bra ändå. Men eftersom saltet inte skickas krypterat från servern, skulle en anfallare kunna få tag i det och helt omintetgöra effekten av salt.

Andra problem med MD5 är också kända sedan länge att MD5, bl.a. att det inte är kollisionsresistent. Så även om mina lösenord _antagligen_ inte kan crackas, finns det tillräckligt med problem med MD5 för att det inte skall räknas som användbart för ändamålet. En enkel googling visar också att MD5 allmänt räknas som oanvändbart för krypteringsändamål.

Alternativ är SHA-2 och SHA-3, men dessa anses också vara för snabba för att kunna motstå brute-forceade preimage-attacker på ett bra sätt. För hashning av lösenord rekommenderas i allmänhet [Blowfish](https://sv.wikipedia.org/wiki/Blowfish). Eller så kan man bara hasha en miljon gånger om eller så, för att sakta ner processen.

## Säkerhet/kryptering i back-end
Ingen mer kryptering sker i back-end. Det hashade lösenordet från klienten sparas direkt i databasen. Detta bör naturligtvis fixas, lösenordet bör krypteras igen på servern för att stulna lösenord inte skall gå att använda.

All användarinput i textformat kodas med htmlentitities för att undvika XSS, och databas-queriet görs med prepared statements för att undvika kodinjketion.
