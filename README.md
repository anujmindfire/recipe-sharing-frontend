# Recipe Sharing Application

## Description
The Recipe Sharing Application is a platform that allows users to share, discover, and manage various recipes. Users can search for recipes, filter them based on different criteria, and share their own creations with the community.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Contribution Guidelines](#contribution-guidelines)
- [Changelog](#changelog)
- [Branching Strategy](#branching-strategy)

## Installation

### Frontend Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/anujmindfire/recipe-sharing-frontend.git
   cd recipe-sharing-frontend
   
2. **Install backend dependencies:**
   ```bash
   npm install

3. **Set up environment variables: Create a .env file in the root directory with the following content:**
   ```bash
   APIURL=<APIURL>

4. **Start the frontend App::**
   ```bash
   npm run start

The frontend should now be accessible at http://localhost:3000.

## Usage
Once both the backend and frontend servers are running, you can start activities in app.

## Contribution Guidelines
We welcome contributions to improve and expand the functionality of the Recipe Sharing Application. Please follow these guidelines:

Fork the repository and create a new branch with a descriptive name.
Make your changes and ensure that your code adheres to the project's style guidelines.
Write tests for any new functionality and ensure all existing tests pass.
Submit a pull request with a clear description of your changes and the problem they solve.
Review feedback: Be responsive to any feedback provided during the review process.

## Changelog

All notable changes to this project will be documented in this section.

v1.0.0 - Initial Release
Initial setup of the backend with user authentication and recipe management.
Basic CRUD functionality for recipes.
Filtering and searching recipes.
Initial setup for email notifications and AWS S3 image storage.

v1.0.1 - Initial Changes
Adding Constant all message.
Adding Custom validation for form validation.
Adding test cases.

## Branching Strategy

We follow a branching strategy to maintain a smooth and organized development process. Below is the overview of how branches should be used.

1. Main Branches
development: The production-ready branch. Always contains stable, production-ready code.

2. Feature Branches
Naming Convention: feature/<feature-name>
These branches are used to develop new features or enhancements and are created from develop.
Example: feature/user-authentication, feature/recipe-search, feature/image-upload.
Once the feature is complete, it is merged back into develop.

3. Bugfix Branches
Naming Convention: bugfix/<bug-name>
These branches are used for fixing bugs and are also created from develop.
Example: bugfix/fix-login-error, bugfix/recipe-filter-issue.
Once the bug is fixed, the branch is merged back into develop.

4. Release Branches
Naming Convention: release/<version-number>
These branches are created from develop when preparing for a new release.
Example: release/v1.0.0, release/v1.1.0.
Once the release is stable, it is merged into both main and develop.

5. Hotfix Branches
Naming Convention: hotfix/<hotfix-name>
These branches are created from main to address critical issues in production.
Example: hotfix/fix-login-bug, hotfix/image-upload-crash.
After the fix, the branch is merged into both main and develop.

6. Pull Requests (PRs) and Code Reviews
PRs should be submitted from feature, bugfix, release, or hotfix branches to develop (or main for hotfixes).
Once the PR is reviewed and approved, it can be merged into the respective branch.

7. Merging
Feature and Bugfix Merges: Merge into develop after the PR is reviewed.
Release Merges: Merge the release branch into main for production deployment, and also back into develop.
Hotfix Merges: Merge hotfixes into both main and develop.