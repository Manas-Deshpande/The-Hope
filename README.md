# The Hope — An Online Portal for Mental Health Support

## About the Project

Mental health is an important concern in today's fast-paced world, yet access to timely support and reliable information can remain limited. **The Hope** is a web application envisioned as an accessible, user-friendly platform to promote mental health awareness and help connect individuals with relevant support resources.

The project's long-term vision is to provide a supportive digital space where people can learn about mental well-being, explore self-assessment resources, discover coping strategies, and find appropriate professional support. It aims to encourage awareness, reduce stigma, and make mental health resources easier to access.

The current implementation focuses on the core web application, including user registration, login, and a needs-assessment form. Additional mental health resources and support features are part of the broader project vision and may be developed in future iterations.

## Currently Implemented Features

- **User Registration and Login:** Basic account registration and login functionality.
- **Needs Assessment Form:** Allows users to submit assessment information.
- **Backend API:** Handles application requests through a Python FastAPI backend.
- **Database Integration:** Uses MongoDB Atlas for data storage.
- **Cloud Deployment:** Frontend hosted on GitHub Pages and backend deployed to Azure Container Apps.

## Planned Features

The following features represent the broader project vision and are not fully implemented yet:

- Mental health awareness content and educational resources.
- Self-assessment tools for mental well-being.
- Guided coping strategies and helpful resources.
- Access to professional mental health support.
- Additional privacy-focused and user-support features.

## Technology Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Python, FastAPI
- **Database:** MongoDB Atlas
- **Containerization:** Docker, Docker Compose
- **Cloud Deployment:** Azure Container Apps, Azure Container Registry
- **Frontend Hosting:** GitHub Pages
- **Version Control:** Git, GitHub

## Application Architecture

```text
User
  |
  v
Frontend — GitHub Pages
  |
  v
FastAPI Backend
— Azure Container Apps
  |
  v
MongoDB Atlas
```

Docker is used to package the backend application into a container image, which is stored in Azure Container Registry and deployed to Azure Container Apps.

## Live Demo and Source Code

- **Live Website:** https://manas-deshpande.github.io/The-Hope/
- **Source Code:** https://github.com/Manas-Deshpande/The-Hope
- **Backend API Documentation:** https://the-hope-backend.yellowmoss-813aadfe.koreacentral.azurecontainerapps.io/docs

## Project Objective

The Hope aims to demonstrate how web technologies and cloud deployment can support the development of accessible digital platforms for mental health awareness and support. The project is being developed incrementally, with the current focus on core application functionality and deployment.

## Author

**Manas Deshpande**

GitHub: https://github.com/Manas-Deshpande
