# General Instructions
## Frontend Instructions

- Tech Stack
    - NextJS
    - React
    - Tailwind and MUI

- Instructions to compile:
    1. Make sure you're in the root directory then install required packages
        ```shell
        npm i
        ```
    2. To run the server, run
        ```shell
        npm start
        ```
    3. To run the test API server (Only for test purposes)
        - First install json-server
            ```shell
            npm i -g json-server
            ```
        - Then run the API server using
            ```shell
            json-server --watch ./frontend/api/info.json
            ```
