file dove scriviamo il planing del progetto (do's, do not's and tech stack/ apis)

Denise:
Cosa fa la web app
parte da una pagina randomica e ha come obbiettivo finale una pagina wiki compresa in un grupo legato da un senso logico. ci si muove usando gli hyperlink di wikipedia

Calcola tempo totale da partenza ad arrivo e numero di pagine visitate
suono finale vittoria happy wheels

could
possibilità di fare un a sfida "locale" condividendo il punto di partenza per vedere chi arriva prima (comunque i due giocatori sono in due sessioni locali diverse)
checkpoint che se sono raggiunti ti fanno guadagnare tempo/score
rate us page
light/dark mode
possibilità di livelli

possibili idee
hitler very easy
la madonna easy
kevin spazioso
michele figlio giacomo slightly less easy (i'm kinda stupid - Gabriele)
waldo extreme

Cosa non fa la web app

Non sfide tra più persone online ma solo partite locali con uno score
non ha un punto di fine randomico
non esce da wikipedia/pagine diverse da articoli

identità

Come farla

3 pagine HTML:
pagina iniziale con navbar, titolo, bottone per avvio gioco, (forse impostazioni) footer
pagina 2 con navbar con pagine visitate e tempo e div vuoto che viene riempito con JSON della pagina wikipedia corrente
pagina finale con risultato finale e complimenti

CSS → decidere design: colori, font, mobile first, font montserrat per <p> e testi vari, font secondario da capire per il nome della webapp, partiamo da una light mode

Javascript → localStorage, filtrare (rimuovere infobox, note, immagini, template, e lasciare solo il testo + i link [[interni]] (quelli verso altri articoli, non sezioni o file))

Presentazione finale → presentazione di google

Piattaforme di lavoro → Github, trello

Hosting – GitHub Web
