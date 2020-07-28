# Déploiement de l'application sur un serveur privé

## Choisir un serveur et un nom de domaine 

* Le choix du provider est libre, cependant il est recommandé de disposer d'au moins un 1 Go de Ram et 30 Go d'espace de stockage . [La procédure suivante a été testée sur ce VPS](https://us.ovh.com/us/order/vps/?v=3#/vps/build?selection=~(range~'Essential~pricingMode~'default~flavor~'vps-essential-2-4-80~os~'ubuntu_20_04~datacenters~(SBG~1)))
* Acheter un nom de domaine et le faire pointer sur l'adresse du serveur (il sera référencé dans ce document sous l'alias [NOM DE DOMAINE])


## Installer docker sur le serveur :

Mise en place de docker sur un VPS ubuntu 20.04 vierge

```bash
sudo apt-get update
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo apt-key fingerprint 0EBFCD88
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
sudo usermod -aG docker $USER
newgrp docker 
```

## Installation [Caprover](https://caprover.com/docs/get-started.html) :

```bash
sudo ufw allow 80,443,3000,996,7946,4789,2377/tcp; sudo ufw allow 7946,4789,2377/udp;
docker run -p 80:80 -p 443:443 -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain caprover/caprover
```

Attendre 60 secondes

* Aller à l'adresse : http://[NOM DE DOMAINE]:3000/
* Mot de passe : captain42
* Aller à "settings" -> change password
* Aller sur le dashboard, section "CapRover Root Domain Configurations", mettre dans le champ le nom de domaine du site et cliquer sur "update domain", se relogger et cliquer sur "enable https" puis "Force https".

### STEP 1 : créer la base de donnée
  - Caprover > Apps > One-Click Apps/Databases > MySQL
  - app name : Healthymood-api
  - MySQL Root password : [DB_PASS]
  - Deploy

### STEP 2 : créer l'interface d'admin de la base de donnée
  - Caprover > Apps > One-Click Apps/Databases > PHPMyAdmin
  - app name : db-admin
  - Deploy
  - Caprover > Apps > db-admin > Enable HTTPS et cocher Force HTTPS by redirecting all HTTP traffic to HTTPS et "Save & Update"
  - aller à https://<span>db-admin.[NOM DOMAINE]/</span>
  - serveur : srv-captain--healthymood-db
  - utilisateur : root
  - mot de passe : [DB_PASS]
  - Aller sur l'onglet importer
  - Sélectionner votre dump sql dans choisir un ficher
  - Décocher "Acitiver la vérifications des clés étrangères dans "Autres options"
  - Appuyer sur Executer

### STEP 3 : créer l'API
  - Caprover > Apps > entrer "api" dans l'input, cocher "Has persistant data" , cliquer sur le bouton "Create New App"
  - Caprover > Apps > api > Enable HTTPS et cocher Force HTTPS by redirecting all HTTP traffic to HTTPS et "Save & Update"
  - onglet App Configs, Environmental Variables: cocher "bulk edit" et copier dans le champ :

```
DB_HOST=srv-captain--healthymood-api-db
DB_PORT=3306
DB_USER=root
DB_PASS=[DB_PASS]
DB_NAME=healthymood_api_database
JWT_PRIVATE_KEY=[JWT_PRIVATE_KEY]
EMAIL=healthymoodtest@gmail.com
PASSWORD=[MAIL_PASS]
```
  - cliquer sur "Add Persistent directory" plus bas
  - Renseigner dans Path in App : /usr/src/app/uploads
  - Label : uploads
  - cliquer sur "Save & Update"
  - onglet "Deployement"
  - aller à Method 3: Deploy from Github/Bitbucket/Gitlab
  - Repository : https://github.com/healthymood-dev/healthymood-api
  - Branch : master
  - Username : [GH_USER]
  - Password : [GH_PASSWORD]
  - cliquer sur "Save & Update"
  - copier la valeur du champs apparu dans "Method 3: Deploy from Github/Bitbucket/Gitlab"
  - aller sur **https://github.com/healthymood-dev/healthymood-api/settings/hooks**
  - cliquer sur "add webhook"
  - coller la valeur de l'input copiée précédement dans le champs Payload URL de github, cliquer sur le bouton vert "Add webhook". L'API devrait être déployée automatiquement sur caprover. Après chaque push sur master, elle sera redéployée automatiquement.

### STEP 4 : mise en place du dossier  uploads
  - Caprover > Apps > One-click Apps/Databases > Filebrowser
  - app name : filebrowser
  - deploy
  - Aller sur l'app filebrowser
  - Enable https, cocher "Force HTTPS by redirecting all HTTP traffic to HTTPS", cliquer sur "Save & Update"
  - Onglet App configs
  - Pour le path in app /srv changer le label en uploads puis Save & update
  - Se rendre sur https://<span>filebrowser.[NOM DOMAINE]/</span>
  - Se connecter avec les identifiant : admin / admin 
  - Se rendre dans settings et changer le mot de passe et update
  - Se rendre ensuite dans My Files
  - Extraire sur votre poste le fichier healthymood-uploads.zip dans un dossier de votre choix
  - Au niveau de l'interface FileBrowser, en haut à droite cliquer sur le bouton upload (flèche haut)
  - Sélectionner toutes les images extraites précedemment

### STEP 5 : créer le back-office
  - Caprover > Apps > entrer "back-office" dans l'input, cliquer sur le bouton "Create New App"
  - aller sur l'app "back-office"
  - onglet http settings : cliquer sur "Enable HTTPS", dans l'input "Container HTTP Port" mettre 80, cocher "Force HTTPS by redirecting all HTTP traffic to HTTPS", cliquer sur "Save & Update"
  - onglet App Configs, Environmental Variables: cocher "bulk edit" et copier : 
  
    ```
    REACT_APP_API_BASE_URL=https://api.<span>[NOM DE DOMAINE]</span>
    REACT_APP_API_KEY=[TINY_MCE_API_KEY]
    ```
  - "Save & Update"
  - onglet "Deployement"
  - aller à la section Method 3: Deploy from Github/Bitbucket/Gitlab
  - Repository : **https://github.com/healthymood-dev/healthymood-back-office**
  - Branch : master
  - Username : [GH_USER]
  - Password : [GH_PASSWORD]
  - "Save & Update"
  - copier la valeur du champs apparu dans "Method 3: Deploy from Github/Bitbucket/Gitlab"
  - aller sur **https://github.com/healthymood-dev/healthymood-back-office/settings/hooks**
  - cliquer sur "add webhook"
  - coller la valeur de l'input copiée précédement dans le champs Payload URL de github, cliquer sur le bouton vert "Add webhook".

### STEP 6 : créer le front-office
  - Caprover > Apps > entrer "front-office" dans l'input, cliquer sur le bouton "Create New App"
  - aller sur l'app "front-office"
  - onglet http settings : cliquer sur "Enable HTTPS", dans l'input "Container HTTP Port" mettre 80,  cocher "Force HTTPS by redirecting all HTTP traffic to HTTPS", cliquer sur "Save & Update"
  - onglet http settings : à coté du bouton "connect new domain", remplir l'input avec [NOM DE DOMAINE] et cliquer sur le bouton puis sur "enable HTTPS".
  - onglet App Configs, Environmental Variables: cocher "bulk edit" et copier : REACT_APP_API_BASE_URL=https://<span>api.[NOM DE DOMAINE]</span>
  - "Save & Update"
  - onglet "Deployement"
  - aller à la section Method 3: Deploy from Github/Bitbucket/Gitlab
  - Repository : https://github.com/healthymood-dev/healthymood-front-office
  - Branch : master
  - Username : [GH_USER]
  - Password : [GH_PASSWORD]
  - "Save & Update"
  - copier la valeur du champs apparu dans "Method 3: Deploy from Github/Bitbucket/Gitlab"
  - aller sur https://github.com/healthymood-dev/healthymood-back-office/settings/hooks
  - cliquer sur "add webhook"
  - coller la valeur de l'input copiée précédement dans le champs Payload URL de github, cliquer sur le bouton vert "Add webhook". 