# Asva Summarizer Assignment

Asva Summarizer is a web application that allows users to input text and generate summarized versions of the text. It also maintains a history of all the summarizations performed by the user. This application is built using the MERN stack (MongoDB, Express.js, React.js, and Node.js).

## Teach stack used:
-Frontend: React.js
-Backend: Node.js, Express.js
-Database: MongoDB
-Authentication: JWT (JSON Web Tokens)
-Styling: Tailwind CSS, CSS
-HTTP Client: Axios

## Dependencies:

### Frontend
  1. react
  2. axios
  3. react-toastify
  4. tailwindcss
### Backend
  1. express
  2. mongoose
  3. jsonwebtoken
  4. body-parser
  5. cors
  6. dotenv

     
## Application Functionality:

1. ### User Authentication:
  Sign Up: Users can create a new account by providing an email and password.
  Sign In: Users can log in with their credentials.

2. ### Text Summarization:
  Users can input text and select the desired summary length (number of words). The application uses an algorithm to generate a summarized version of the input text.

3. ### History
  The application maintains a history of all summarizations performed by the user. Users can view their history and click on a history item to repopulate the input field with that item.

## Getting Started

### Prerequisites

- Node.js (version >= 12.0.0)
- npm (or yarn)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/adnan179/Asva_summarizer_assignment.git
   cd project-name
2. **Install front-end dependencies:**
   ```bash
   cd frontend
   npm install
3. **Install back-end dependencies:**
   ```bash
   cd backend
   npm install
4. **Replace the URL to connect to your MongoDB Atlas in the backend/server file**
5. **Start the front-end**
   ```bash
   cd frontend
   npm start
   
6. **Open up two terminals separately:**
   ```bash
   cd backend
   nodemon server
