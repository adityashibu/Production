# General Instructions

## CI/CD Pipeline

![Node Setup](https://github.com/PowerHouse-Project/Production/actions/workflows/devOps.yml/badge.svg)

## Sections

1. [Frontend Setup](#frontend-instructions)
2. [Backend Setup](#backend-instructions)

## Frontend Instructions

- Tech Stack

  - NextJS
  - React
  - Tailwind and MUI

- Instructions to compile:

  - Make sure you have Node installed on your machine

    - Run the following to make sure you have Node installed
      ```
      node -v
      ```
    - If it's not installed, download it from [Node.JS](https://nodejs.org/)

  - Make sure you're in the root directory then install required
    ```shell
    npm i
    ```
  - To run the server, run

    ```shell
    npm run dev
    ```

  - Continue from the [Backend Instructions](#backend-instructions)

## Backend Instructions

- Instructions to startup the FastAPI server

  - Make sure you have python installed on your machine, run:

    ```shell
    python --version
    ```

    It should print out your current python version, if Python is installed on your machine

  - Install the required dependencies using the following command
    ```shell
    pip install -r requirements.txt
    ```
