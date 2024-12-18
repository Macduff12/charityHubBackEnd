# CharityHub Back-End

## Description
This repository contains the back-end code for the CharityHub platform, enabling seamless management of donations, projects, and user data. The back-end is responsible for handling business logic, database interactions, and API endpoints.

## Features
- **User Authentication:** Secure login and registration for donors and administrators.
- **Donation Tracking:** Record and manage user donations efficiently.
- **Project API:** Endpoints for managing charitable initiatives.
- **Role-Based Access Control:** Different permissions for donors, administrators, and volunteers.

## Technologies Used
- **Programming Language:** Node.js
- **Framework:** Express.js
- **Database:** MySQL
- **Authentication:** JSON Web Tokens (JWT)
- **Version Control:** Git, GitHub

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/Macduff12/charityHubBackEnd.git
   ```
2. Navigate to the project directory:
   ```bash
   cd charityHubBackEnd
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory and add the following:
   ```env
   DB_HOST=your-database-host
   DB_USER=your-database-user
   DB_PASSWORD=your-database-password
   DB_NAME=your-database-name
   JWT_SECRET=your-jwt-secret
   PORT=your-server-port
   ```
5. Run database migrations (if applicable):
   ```bash
   npm run migrate
   ```
6. Start the server:
   ```bash
   npm start
   ```

## API Endpoints
- **Authentication:**
  - `POST /api/login` - User login
  - `POST /api/register` - User registration

- **Donations:**
  - `GET /api/donations` - Get all donations
  - `POST /api/donations` - Create a new donation

- **Projects:**
  - `GET /api/projects` - Get all projects
  - `POST /api/projects` - Create a new project

- **Teams:**
  - `POST /create-team` - Create a new team
  - `POST /add-user-to-team` - Add a user to a team
  - `POST /remove-user-from-team` - Remove a user from a team
  - `POST /update-team-description` - Update a team's description
  - `POST /move-user-to-another-team` - Move a user to another team
  - `GET /teams` - Get all teams

- **Users:**
  - `GET /users` - Get all users
  - `POST /forgot-password` - Request password reset
  - `POST /reset-password` - Reset password
  - `POST /login` - Login

- **Sponsors:**
  - `POST /create-sponsor` - Create a new sponsor
  - `GET /sponsors` - Get all sponsors
  - `PUT /update-sponsor/:sponsorId` - Update a sponsor
  - `DELETE /delete-sponsor/:sponsorId` - Delete a sponsor

- **Help Requests:**
  - `POST /assign-team` - Assign a team to a help request
  - `POST /update-status` - Update the status of a help request
  - `POST /add-feedback` - Add feedback about a team
  - `GET /requests` - Get all help requests

## Related Repositories
- **Front-End Repository:** [CharityHub Front-End](https://github.com/Macduff12/charityHubFrontEnd.git)

## Contribution Guidelines
1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes with a descriptive message:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push your branch to GitHub:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Contact
For questions or support, please contact:
- **Name:** Macduff12
- **Email:** [Your Email Address]
- **GitHub:** [Macduff12](https://github.com/Macduff12)

