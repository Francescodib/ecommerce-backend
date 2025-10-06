# Guida Docker per ShopSphere

## 📚 Indice
1. [Cos'è Docker?](#cosè-docker)
2. [Installazione Docker](#installazione-docker)
3. [Comandi Base Docker](#comandi-base-docker)
4. [Gestione Progetto ShopSphere](#gestione-progetto-shopsphere)
5. [Troubleshooting](#troubleshooting)
6. [FAQ](#faq)

---

## Cos'è Docker?

**Docker** è una piattaforma che ti permette di eseguire applicazioni in "container" isolati.

### Perché lo usiamo?

✅ **Non devi installare MySQL e MongoDB** sul tuo computer
✅ **Ambiente identico** per tutti (evita "funziona sul mio computer")
✅ **Facile da avviare/fermare** con un comando
✅ **Dati persistenti** anche se fermi i container
✅ **Ideale per sviluppo** e testing

### Concetti Chiave

- **Container**: Un ambiente isolato che contiene un'applicazione (es. MySQL)
- **Immagine**: Il "template" usato per creare un container (es. `mysql:8.0`)
- **Volume**: Spazio disco persistente per salvare i dati
- **docker-compose**: Strumento per gestire più container insieme

---

## Installazione Docker

### macOS

1. **Scarica Docker Desktop**
   - Vai su: https://www.docker.com/products/docker-desktop
   - Clicca su "Download for Mac"
   - Scegli la versione per il tuo processore:
     - **Apple Silicon (M1/M2/M3)**: versione ARM
     - **Intel**: versione Intel

2. **Installa**
   - Apri il file `.dmg` scaricato
   - Trascina Docker nelle Applicazioni
   - Apri Docker Desktop dalle Applicazioni

3. **Primo Avvio**
   - Accetta i termini di servizio
   - Docker ti chiederà la password (serve per configurazione)
   - Aspetta che l'icona Docker in alto diventi verde

4. **Verifica Installazione**
   ```bash
   docker --version
   docker-compose --version
   ```

   Dovresti vedere qualcosa tipo:
   ```
   Docker version 24.0.6
   Docker Compose version v2.23.0
   ```

### Windows

1. **Requisiti**
   - Windows 10/11 (versione Pro, Enterprise o Education)
   - WSL 2 abilitato

2. **Installa WSL 2** (se non lo hai già)
   ```powershell
   wsl --install
   ```
   Riavvia il computer.

3. **Scarica Docker Desktop**
   - Vai su: https://www.docker.com/products/docker-desktop
   - Download for Windows
   - Esegui l'installer

4. **Configura Docker**
   - Al primo avvio, seleziona "Use WSL 2 based engine"
   - Completa il setup

5. **Verifica**
   ```bash
   docker --version
   docker-compose --version
   ```

### Linux (Ubuntu/Debian)

```bash
# Rimuovi vecchie versioni
sudo apt-get remove docker docker-engine docker.io containerd runc

# Installa dipendenze
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg lsb-release

# Aggiungi repository Docker
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Installa Docker
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Verifica
docker --version
docker compose version
```

---

## Comandi Base Docker

### Gestione Container

```bash
# Lista container attivi
docker ps

# Lista TUTTI i container (anche fermati)
docker ps -a

# Ferma un container
docker stop <container_name>

# Avvia un container
docker start <container_name>

# Riavvia un container
docker restart <container_name>

# Rimuovi un container (deve essere fermato)
docker rm <container_name>
```

### Gestione Immagini

```bash
# Lista immagini scaricate
docker images

# Scarica un'immagine
docker pull mysql:8.0

# Rimuovi un'immagine
docker rmi <image_name>

# Pulisci immagini inutilizzate
docker image prune
```

### Logs e Debug

```bash
# Vedi i log di un container
docker logs <container_name>

# Segui i log in tempo reale (-f = follow)
docker logs -f <container_name>

# Ultimi 100 log
docker logs --tail 100 <container_name>

# Entra dentro un container (shell interattiva)
docker exec -it <container_name> bash

# Esegui un comando in un container
docker exec <container_name> <comando>
```

### Docker Compose

```bash
# Avvia tutti i servizi (da cartella con docker-compose.yml)
docker-compose up

# Avvia in background (-d = detached)
docker-compose up -d

# Ferma i servizi
docker-compose down

# Ferma E rimuove i volumi (ATTENZIONE: perdi i dati!)
docker-compose down -v

# Riavvia i servizi
docker-compose restart

# Vedi i log di tutti i servizi
docker-compose logs -f

# Vedi log di un servizio specifico
docker-compose logs -f mysql

# Ricostruisci i container (dopo modifiche a docker-compose.yml)
docker-compose up -d --build
```

---

## Gestione Progetto ShopSphere

### 1. Avvio Iniziale

**Prima volta:**

```bash
# Vai nella cartella del progetto
cd /percorso/progetto

# Avvia Docker Desktop (icona verde in alto)

# Avvia i container
docker-compose up -d
```

**Cosa succede:**
- Docker scarica le immagini MySQL e MongoDB (solo la prima volta)
- Crea i container `shopsphere-mysql` e `shopsphere-mongodb`
- Crea i volumi per persistenza dati
- Esegue automaticamente gli script SQL in `database/sql/`

**Output atteso:**
```
✔ Container shopsphere-mysql    Started
✔ Container shopsphere-mongodb  Started
```

### 2. Verifica Stato

```bash
# Controlla che i container siano healthy
docker ps
```

Dovresti vedere:
```
CONTAINER ID   IMAGE       STATUS                 NAMES
76dd68fc80cb   mysql:8.0   Up (healthy)          shopsphere-mysql
37b936ea2373   mongo:7.0   Up (healthy)          shopsphere-mongodb
```

### 3. Test Connessioni

**MySQL:**
```bash
# Test rapido
docker exec shopsphere-mysql mysql -u shopsphere_user -pshopsphere_pass -e "SELECT 'OK' as status;"

# Accedi a MySQL
docker exec -it shopsphere-mysql mysql -u shopsphere_user -pshopsphere_pass
```

Comandi utili dentro MySQL:
```sql
-- Vedi database
SHOW DATABASES;

-- Usa database shopsphere
USE shopsphere;

-- Vedi tabelle
SHOW TABLES;

-- Vedi struttura tabella
DESCRIBE users;

-- Query dati
SELECT * FROM users LIMIT 5;

-- Esci
EXIT;
```

**MongoDB:**
```bash
# Test rapido
docker exec shopsphere-mongodb mongosh --quiet --eval "db.adminCommand('ping')" mongodb://root:root123@localhost:27017/admin

# Accedi a MongoDB
docker exec -it shopsphere-mongodb mongosh -u root -p root123
```

Comandi utili dentro MongoDB:
```javascript
// Vedi database
show dbs

// Usa database shopsphere
use shopsphere

// Vedi collections
show collections

// Query documenti
db.reviews.find().limit(5)

// Conta documenti
db.reviews.countDocuments()

// Esci
exit
```

### 4. Gestione Quotidiana

**All'inizio della giornata:**
```bash
# Avvia Docker Desktop

# Avvia i container (se non sono già running)
docker-compose up -d
```

**Durante lo sviluppo:**
```bash
# Vedi i log in tempo reale
docker-compose logs -f

# Solo MySQL
docker-compose logs -f mysql

# Solo MongoDB
docker-compose logs -f mongodb
```

**Alla fine della giornata:**
```bash
# OPZIONE 1: Lascia running (consigliato)
# Non fare nulla, i container continuano a girare

# OPZIONE 2: Ferma i container
docker-compose down

# I dati rimangono salvati nei volumi
```

### 5. Reset Database

**Reset completo (cancella tutti i dati):**
```bash
# ATTENZIONE: Perdi tutti i dati!
docker-compose down -v

# Riavvia da zero
docker-compose up -d
```

**Reset solo MySQL:**
```bash
# Ferma tutto
docker-compose down

# Rimuovi solo volume MySQL
docker volume rm progetto_mysql_data

# Riavvia
docker-compose up -d
```

**Re-import schema SQL:**
```bash
# Copia schema nel container
docker cp database/sql/schema.sql shopsphere-mysql:/tmp/

# Esegui import
docker exec shopsphere-mysql mysql -u shopsphere_user -pshopsphere_pass shopsphere < /tmp/schema.sql
```

### 6. Backup e Restore

**Backup MySQL:**
```bash
# Crea backup
docker exec shopsphere-mysql mysqldump -u root -proot123 shopsphere > backup_$(date +%Y%m%d).sql

# Il file viene salvato nella cartella corrente
```

**Restore MySQL:**
```bash
# Restore da backup
docker exec -i shopsphere-mysql mysql -u root -proot123 shopsphere < backup_20251004.sql
```

**Backup MongoDB:**
```bash
# Backup completo database
docker exec shopsphere-mongodb mongodump --username root --password root123 --authenticationDatabase admin --db shopsphere --out /tmp/backup

# Copia backup fuori dal container
docker cp shopsphere-mongodb:/tmp/backup ./mongodb_backup
```

**Restore MongoDB:**
```bash
# Copia backup dentro container
docker cp ./mongodb_backup shopsphere-mongodb:/tmp/

# Restore
docker exec shopsphere-mongodb mongorestore --username root --password root123 --authenticationDatabase admin /tmp/mongodb_backup
```

---

## Troubleshooting

### ❌ "Cannot connect to Docker daemon"

**Problema**: Docker Desktop non è avviato

**Soluzione**:
1. Apri Docker Desktop
2. Aspetta che l'icona diventi verde
3. Riprova

---

### ❌ "Port is already allocated"

**Problema**: La porta 3306 o 27017 è già usata

**Soluzione 1** - Ferma il servizio che usa la porta:
```bash
# macOS/Linux - trova processo sulla porta 3306
lsof -i :3306
# Termina processo
kill -9 <PID>
```

**Soluzione 2** - Cambia porta in docker-compose.yml:
```yaml
ports:
  - "3307:3306"  # Usa 3307 invece di 3306
```

---

### ❌ Container si ferma subito

**Problema**: Errore di configurazione

**Soluzione**:
```bash
# Vedi i log per capire l'errore
docker-compose logs mysql

# O
docker logs shopsphere-mysql
```

Errori comuni:
- Password root mancante → controlla `MYSQL_ROOT_PASSWORD`
- File SQL malformato → controlla sintassi in `database/sql/schema.sql`

---

### ❌ "Access denied for user"

**Problema**: Credenziali sbagliate

**Verifica credenziali** nel file `.env`:
```
DB_USER=shopsphere_user
DB_PASSWORD=shopsphere_pass
```

**Reset password** (se necessario):
```bash
# Ferma container
docker-compose down

# Rimuovi volume
docker volume rm progetto_mysql_data

# Riavvia (ricrea con nuove credenziali)
docker-compose up -d
```

---

### ❌ Container healthy ma connessione fallisce

**Problema**: Container running ma database non risponde

**Soluzione**:
```bash
# Aspetta qualche secondo in più
sleep 10

# Controlla healthcheck
docker inspect shopsphere-mysql | grep -A 10 Health

# Riavvia container
docker-compose restart mysql
```

---

### ❌ Spazio disco esaurito

**Problema**: Docker occupa troppo spazio

**Soluzione**:
```bash
# Vedi spazio usato
docker system df

# Pulisci container/immagini/volumi inutilizzati
docker system prune -a

# ATTENZIONE: Conferma prima di procedere!
```

---

### ❌ Prestazioni lente (macOS/Windows)

**Problema**: Docker Desktop su Mac/Windows usa virtualizzazione

**Ottimizzazioni**:
1. **Aumenta risorse** in Docker Desktop:
   - Apri Docker Desktop
   - Settings → Resources
   - Aumenta CPU e RAM

2. **Disabilita file watching** eccessivo

3. **Usa volumi named** invece di bind mounts (già fatto nel progetto)

---

## FAQ

### Q: Devo lasciare Docker sempre running?

**R**: No, puoi fermarlo quando non lavori al progetto. I dati rimangono salvati.

```bash
# Fine giornata
docker-compose down

# Prossima giornata
docker-compose up -d
```

---

### Q: Come vedo quanto spazio occupa Docker?

**R**:
```bash
docker system df
```

---

### Q: Posso usare un client grafico (es. MySQL Workbench)?

**R**: Sì! I database sono esposti sulle porte locali.

**MySQL Workbench:**
- Host: `localhost` o `127.0.0.1`
- Port: `3306`
- User: `shopsphere_user`
- Password: `shopsphere_pass`

**MongoDB Compass:**
- Connection String: `mongodb://root:root123@localhost:27017/shopsphere?authSource=admin`

---

### Q: I dati vengono persi se aggiorno Docker?

**R**: No, i dati sono salvati in volumi separati che sopravvivono agli aggiornamenti.

---

### Q: Posso cambiare le password?

**R**: Sì, ma devi:
1. Modificare `docker-compose.yml`
2. Modificare `.env`
3. Fare reset completo: `docker-compose down -v && docker-compose up -d`

---

### Q: Come importo un dump SQL?

**R**:
```bash
# Metti il file nella cartella database/sql/
# Verrà eseguito automaticamente al prossimo reset

# O manualmente:
docker exec -i shopsphere-mysql mysql -u root -proot123 shopsphere < database/sql/dump.sql
```

---

### Q: Docker consuma batteria?

**R**: Sì, i container attivi consumano risorse. Fermali quando non servono:
```bash
docker-compose down
```

---

### Q: Posso eseguire comandi npm dentro container?

**R**: In questo progetto no, Node.js gira in locale. Docker è solo per i database.

---

## 🎯 Quick Reference - Comandi Essenziali

| Azione | Comando |
|--------|---------|
| Avvia tutto | `docker-compose up -d` |
| Ferma tutto | `docker-compose down` |
| Vedi stato | `docker ps` |
| Vedi log | `docker-compose logs -f` |
| Reset completo | `docker-compose down -v && docker-compose up -d` |
| MySQL shell | `docker exec -it shopsphere-mysql mysql -u shopsphere_user -pshopsphere_pass` |
| MongoDB shell | `docker exec -it shopsphere-mongodb mongosh -u root -p` |
| Backup MySQL | `docker exec shopsphere-mysql mysqldump -u root -proot123 shopsphere > backup.sql` |

---

## 📖 Risorse Utili

- **Documentazione Ufficiale**: https://docs.docker.com/
- **Docker Compose Reference**: https://docs.docker.com/compose/compose-file/
- **MySQL Docker Image**: https://hub.docker.com/_/mysql
- **MongoDB Docker Image**: https://hub.docker.com/_/mongo

---

**Ultimo aggiornamento**: 2025-10-04
**Progetto**: ShopSphere Backend API
