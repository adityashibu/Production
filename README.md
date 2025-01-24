# General Instructions
## Frontend Instructions

- Tech Stack
    - NextJS
    - React
    - Tailwind and MUI

- Instructions to compile:
    1. Make sure you have Node installed on your machine
        - Run the following to make sure you have Node installed
            ```
            node -v
            ```
        - If it's not installed, download it from [Node.JS](https://nodejs.org/) 
    2. Make sure you're in the root directory then install required
        ```shell
        npm i
        ```
    3. To run the server, run
        ```shell
        npm run dev
        ```
    4. To run the test API server (Only for test purposes)
        - First install json-server
            ```shell
            npm i -g json-server
            ```
        - Then run the API server using
            ```shell
            json-server --watch ./frontend/api/info.json
            ```
