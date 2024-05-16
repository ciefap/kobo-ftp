Para utilizar el proyecto:

npm install

cp .env-sample .env

Completar las variables.

KOBO:
Si deseo obtener las encuestas que han sido cargadas el día de ayer:
nodejs kobo.js

Si deseo obtener las encuestas que han sido cargadas a partir de una fecha dada:
nodejs kobo.js --date_from 2024-01-01


FTP:
nodejs ftp.js

CLEAN-FTP:
nodejs clean-ftp.js
