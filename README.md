
# Hospedaje Menéndez Pelayo
_https://app-hospedaje.herokuapp.com/_

![Mozilla Add-on](https://img.shields.io/amo/dw/dustman) ![Conda (channel only)](https://img.shields.io/conda/vn/conda-forge/python) ![Hackage-Deps](https://img.shields.io/hackage-deps/v/lens)

## _Trabajo de fin de Máster_

Este desarrollo web surge para digitalizar el proceso de reserva de habitaciones para un hospedaje, cuyo control de clientes y bookings se realizaba en papel.

Para el desarrollo de la parte del servidor, se ha utilizado Express como capa de negocio, y MongoDB como base de datos..

Express es un framework web transigente, escrito en JavaScript y alojado dentro del entorno de ejecución NodeJS. En este proyecto, se ha utilizado como servidor web, donde se aloja toda la capa lógica de la aplicación.

Por su parte, MongoDB es un sistema de base de datos NoSQL (No relacional) orientado a documentos. A diferencia de otras bases de datos, MongoDB cuenta con una notoria capacidad de aprovechar los recursos de la máquina.


## Características

- Servidor web
- Sistema de autenticación y cookies
- Sistema de envío de emails
- Roles y permisos

## Tecnologías

La parte del servidor ha utilizado las siguientes tecnologías:

- [ExpressJS] - Framework de NodeJS!
- [Visual Code] - IDE 
- [MongoDB]
- [Mongo Compass / Mongo Atlas] - Sistema de base de datos
- Nodemailer - Servicio de mensajeria
- [GIT] - Controlador de versiones.
- [node.js] - Manejador de paquetes

## Instalación

Este proyecto requiere [Node.js](https://nodejs.org/) v10+ para levantarse.

Para correr la parte de servidor, es necesario realizar los siguientes comandos.

```
cd <directory>
npm i
npm start
```

## Despliegue

Este proyecto está desplegado en Heroku.

Heroku es una plataforma como servicio de computación en la Nube que soporta distintos lenguajes de programación. 

Para el lanzamiento del servicio web, se ha linkado un repositorio de Github con el código del frontend compilado e integrado correctamente con el backend, la base de datos en Cloud con Mongo Atlas, y las pertinentes configuraciones.

De este modo, aseguramos que el proceso de despliegue a través de integración contínua se realicen correctamente.


