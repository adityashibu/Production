# General Instructions

## CI/CD Pipeline

![Node Setup](https://github.com/PowerHouse-Project/Production/actions/workflows/node.yml/badge.svg)
![Pytest Setup](https://github.com/PowerHouse-Project/Production/actions/workflows/python.yml/badge.svg)

## Sections

1. [Frontend Setup](#frontend-instructions)
2. [Backend Setup](#backend-instructions)
3. [Alternative Method](#alternative-method)
4. [Database Setup](#database-setup)

## Frontend Instructions

- Tech Stack

  - React
  - NextJS
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

- Tech Stack

  - Python
  - FastAPI

- Instructions to startup the FastAPI server

  - Make sure you have python installed on your machine, run:

    ```shell
    python --version
    ```

    It should print out your current python version, if Python is installed on your machine. If it says command not found then install Python from the official website at [python.org](https://www.python.org)

  - Change directory to backend using

    ```shell
    cd backend
    ```

  - Create a virtual environment using the command

    ```shell
    python -m venv venv
    ```

  - Activate the virtual environment using the command
    - For Windows
      ```shell
      venv\Scripts\Activate
      ```
    - For Linux and MacOS
      ```shell
      source venv/bin/Activate
      ```
  - Install the required dependencies using the following command

    ```shell
    pip install -r requirements.txt
    ```

  - After installing all the required packages, start up the fastAPI server using uvicorn
    ```shell
    uvicorn fastAPI:app --reload
    ```

## Alternative Method

- Alternatively, there is a script to run both backend and frontend using one command

  ```shell
  npm run start
  ```

<!-- ## Database Setup -->

## Total Dev Time

[![Total Dev Time](https://wakatime.com/badge/user/fdd42682-464a-4d52-8867-a5c27a922c77/project/77ef4e30-ada9-4375-a6f2-8ae3e83e4bf5.svg)](https://wakatime.com/badge/user/fdd42682-464a-4d52-8867-a5c27a922c77/project/77ef4e30-ada9-4375-a6f2-8ae3e83e4bf5)
