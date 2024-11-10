# Recipe Sharing Application

## Description
The Recipe Sharing Application is a platform that allows users to share, discover, and manage various recipes. Users can search for recipes, filter them based on different criteria, and share their own creations with the community.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Contribution Guidelines](#contribution-guidelines)
- [Changelog](#changelog)

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
