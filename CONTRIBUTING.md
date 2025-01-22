# Contributing to PowerHouse

Please read through this file before making any contributions to this main repository, Discuss with your sub-team before creating a pull request to merge into the main branch.

## Getting Started

1. **Fork the repository:** Fork this repository to your GitHub account.
2. **Clone your fork:** Clone your forked repository on to your local machine.
3. **Create a branch:** Create a new branch for your feature or bug fix
    - Follow the below format for creating a branch
        - **For features:** feature/name (e.g. feature/add-device)
        - **For bugs:** bugfix/name (e.g. bugfix/extra-space)
4. **Switch to new branch:** Ensure you switch to the new branch you created before
    ```shell
    git checkout feature/name
    ```

## Making Changes

1. **Code Style:** Follow a strict policy of maintaining readable and commented code. Be consistent with indentation, naming, and formatting.
2. **Commit Messages:** Write clear and concise commit messages that explain the changes you've made. Use the imperative mood (e.g., "Add device support", "Fix login issue").
3. **Testing:** Write unit tests for any new code you add or modify, Ensure that all existing tests pass before submitting a pull request.
4. **Documentation:** Update the project's documentation (README.md, code comments, etc.) as needed to reflect your changes.

## Submitting Changes
1. **Push your branch:** Push your branch into the forked repository on GitHub
    ```shell
    git push origin feature/name
    ```
2. **Create a pull request:** Create a pull request from your branch to the ``main`` branch of the original repository
3. **Code review:** Your pull request will be reviewed by other team members. Be prepared to address any feedback or requested changes
4. **Merge:** Once your pull request has been approved and all checks pass, it will be merged on to the ``main`` branch

## Reporting Bugs
If you find a bug, please open an issue on GitHub, providing a clear and detailed description of the problem. Including steps to reproduce the bug, if possible
