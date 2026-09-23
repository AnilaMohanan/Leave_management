\# Leave Management System



A MERN Stack based Leave Management System that manages employee leave requests through a multi-level approval workflow.



\## Tech Stack



\### Frontend



\* React.js

\* Tailwind CSS

\* Axios

\* React Router DOM

\* Vite



\### Backend



\* Node.js

\* Express.js

\* MongoDB

\* Mongoose

\* Multer



\## Features



\* Employee leave request creation

\* Leave request management

\* MongoDB database integration

\* Multi-level leave approval workflow

\* Employee → Team Lead → Project Lead → HR → CEO

\* Approve leave requests

\* Reject leave requests

\* Current approver tracking

\* Leave status display

\* Employee profile image upload

\* REST API integration

\* Responsive UI



\## Project Structure



```text

Leave\_management/

│

├── client/

│   ├── src/

│   │   ├── components/

│   │   ├── pages/

│   │   ├── services/

│   │   ├── App.jsx

│   │   ├── main.jsx

│   │   └── index.css

│   └── package.json

│

├── server/

│   ├── config/

│   ├── controllers/

│   ├── middleware/

│   ├── models/

│   ├── routes/

│   ├── images/

│   ├── server.js

│   └── package.json

│

├── .gitignore

└── README.md

```



\## Prerequisites



Install the following before running the project:



\* Node.js

\* npm

\* MongoDB

\* Git



\## Installation



Clone the repository:



```bash

git clone https://github.com/AnilaMohanan/Leave\_management.git

```



Navigate to the project folder:



```bash

cd Leave\_management

```



\## Backend Setup



Navigate to the server folder:



```bash

cd server

```



Install dependencies:



```bash

npm install

```



Create a `.env` file inside the `server` folder.



Add:



```env

PORT=5000

MONGO\_URI=mongodb://127.0.0.1:27017/leave\_management

```



Make sure MongoDB is running.



Start the backend:



```bash

node server.js

```



Backend URL:



```text

http://localhost:5000

```



\## Frontend Setup



Open a new terminal.



Navigate to the client folder:



```bash

cd client

```



Install dependencies:



```bash

npm install

```



Start the frontend:



```bash

npm run dev

```



Frontend URL:



```text

http://localhost:5173

```



\## API Endpoints



\### Users



Get all users:



```http

GET /api/users

```



Create a user:



```http

POST /api/users

```



Profile image upload uses `multipart/form-data`.



Fields:



```text

name

role

profileImage

```



\### Leave Requests



Create a leave request:



```http

POST /api/leave-requests

```



Get all leave requests:



```http

GET /api/leave-requests

```



Get a leave request by ID:



```http

GET /api/leave-requests/:id

```



Update a leave request:



```http

PUT /api/leave-requests/:id

```



Delete a leave request:



```http

DELETE /api/leave-requests/:id

```



Approve a leave request:



```http

PUT /api/leave-requests/:id/approve

```



Reject a leave request:



```http

PUT /api/leave-requests/:id/reject

```



\## Leave Approval Workflow



The leave approval workflow is:



```text

Employee

&#x20;   ↓

Team Lead

&#x20;   ↓

Project Lead

&#x20;   ↓

HR

&#x20;   ↓

CEO

```



When an employee submits a leave request, it is initially assigned to the Team Lead.



After approval, the request moves to the next level:



```text

Team Lead → Project Lead

Project Lead → HR

HR → CEO

```



After CEO approval, the leave request status becomes:



```text

Approved

```



If the leave request is rejected at any approval stage, the status becomes:



```text

Rejected

```



\## Profile Image Upload



Profile images are uploaded using Multer.



The actual image file is stored in:



```text

server/images/

```



The image path is stored in MongoDB.



For example:



```text

/images/example-image.jpg

```



\## Environment Variables



The `.env` file is not included in the GitHub repository.



Create your own:



```text

server/.env

```



with:



```env

PORT=5000

MONGO\_URI=mongodb://127.0.0.1:27017/leave\_management

```



\## Running the Application



Start the backend:



```bash

cd server

node server.js

```



In another terminal, start the frontend:



```bash

cd client

npm run dev

```



Then open the frontend URL provided by Vite, normally:



```text

http://localhost:5173

```



\## Author



Anila Mohanan



