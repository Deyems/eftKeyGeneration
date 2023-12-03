## eftKeyGeneration
---

# ExpressJS Project

[![StartEase](https://img.shields.io/badge/Generated%20by-StartEase-blue)](https://github.com/JC-Coder/startease)

## Overview

Welcome to the project generated using Express! This guide will walk you through the basic configuration steps to get your backend project up and running.

## Prerequisites

Before you begin, make sure you have the following prerequisites installed on your system:

- Node.js and npm: Download and install Node.js from [nodejs.org](https://nodejs.org/).
- Redis Server Installed.

## Installation

Install project dependencies using npm :

```bash
npm install
```

OR

Install project dependencies using yarn :

```bash
yarn install
```

## Configuration

### Environment Variables

Your project relies on environment variables for configuration. To set up these variables:

1. Create a `.env` file in the project root directory.

2. Add the following environment variables to the `.env` file:

   ```plaintext
   APP_NAME=YourAppName
   APP_PORT=3000
   NODE_ENV=development
   
   PORT="YOUR_PORT"
   REDIS_HOST=HOSTNAME
   REDIS_PORT=XXXX
   COMP_KEY_1='XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
   COMP_KEY_2='XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
   KCV_DATA_TO_ENCRYPT="00000000000000000000000000000000"
   ENABLE_DEV_LOG=
   ```

   Note: configuration variables should be added based on config in the index.ts file in the config folder.

Replace `All Environment Variables`, with your actual project and database information.

### Start the Project

Once you've configured your environment variables, you can start your project:

```bash
npm run start # FOR PROD
npm run start:dev # FOR DEVELOPMENT
```

Your backend server should now be running at http://localhost:<specified-port>.
