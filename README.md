# crypto exchange

Da bi se uradio build, mozete koristiti postman okruzenje ili browser. 
Postman okruzenje za testiranje API requestova, namestimo koji tip requesta ocemo (u nasem slucaju get, post ili delete) i ukucamo url sa tim requestom. Ako je post request, znaci da menjamo neko stanje, i u polju body(raw) unosimo podatke u obliku json poruke

U polju za url unosimo neku od putanja pozivanjem https://localhost:8080/ruta

Aplikaciju pokrecemo pokretanjem servera. Da bi se server pokrenuo, prvo je potrebno locirati 'glavni' fajl aplikacije folderu, zatim rutu do tog fajla treba otvoriti pomocu konzole, i na kraju pozvati komandu: node index.js . Ova komanda pokrece server 

Koriscene tehnologije: JavaScript, NodeJS, ExpressJS, JSON, fs.

NodeJS - za razliku od JS, mozemo ga koristiti i van browsera, open-source je i ne low-level je(koristimo framework ExpressJS)
ExpresJS - NodeJS framework, koristi se na server strani i pomocu njega se lako kreiraju API-ji
JSON - format za razmenu podataka, lak za citanje i pisanje
fs - file system, sluzi za rad sa fajlovima 
