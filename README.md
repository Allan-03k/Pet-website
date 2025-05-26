## Project Overview
  - This is a full-stack pet adoption management system built on React + Flask, supporting user registration, pet browsing, questionnaire filling, adoption record management and
  - administrator backend operations. Use Docker and Docker Compose for one-click deployment

## Local Setup Instructions
  - source venv/bin/activate
  - python3 -m backend.main
  - npm start

## Docker Setup
  - docker-compose build
  - docker-compose up

## web page using reminder
  - admin account: admin password admin123
  - Functional testing: After the user registers an account, he can view the existing pets on the main page. If he wants to adopt a pet, he needs to fill out the questionnaire and then be 
  - reviewed by the administrator account. After the review is passed, the user can return to the pet interface and click to view individual pets and confirm whether they are interested.
  - After waiting for the administrator account to confirm, the adoption can be added to the administrator account, and the user can view it through my adoption.