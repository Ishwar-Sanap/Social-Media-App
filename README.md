# Social-Media-App

## Frontend

- Library Used
  - react : For building user interfaces and managing the frontend of the application.
  - tailwindcss : For styling the application with utility-first CSS classes.
  - react-router-dom : For handling routing and navigation within the application.
  - lucide-react : For using a collection of icons in the application.
  - react-hot-toast : For displaying toast notifications to users.
  - redux toolkit : For managing the application's states
  - moment : For handling date and time formatting in the application.
  - Axios : For making HTTP requests to the backend API.

- Concepts
  - Taking images as input from user using `<input type="file accept="image/*" />`
    To display the image in the frontend we are using URL.createObjectURL() method to create a temporary URL for the image file and then using that URL as the source for an `<img>` tag.
  - For enabling dark mode using tailwindcss, we are using the `dark` variant in our CSS classes.
    We can toggledark mode by adding or removing the `dark` class from the root element of our application
  - Used axios for making HTTP requests to the backend API, allowing us to fetch and send data between the frontend and backend of application. 
    and used api service layer to centralize and manage all API calls in one place, making it easier to maintain and update the codebase. 
    handled errors on the frontend by catching errors from API calls and displaying appropriate error messages to users.
  - For manging the user stories, and displaying the media content and ongoing progress bar, using setInterval() method to update the progress bar and manage the timing of story display. 
    When a user views a story, we start an interval that updates the progress bar until the story duration is complete or the user navigates away from the story. called clearInterval() to stop the interval when the story is no longer being viewed. Used elapsed time to calculate the progress of the story and update the progress bar accordingly.

## Backend

- Library Used
  - express : For building the backend server and handling HTTP requests and responses.
  - mongoose : For connecting to MongoDB and defining schemas for the application's data models.
  - dotenv : For loading environment variables from a .env file, allowing us to manage configuration settings securely.
  - bcrypt : For hashing and salting user passwords to enhance security.
  - jsonwebtoken : For generating and verifying JSON Web Tokens (JWT) for user authentication and authorization.
  - cookie-parser : For parsing cookies in incoming HTTP requests, allowing us to access and manage cookies in our backend code.
  - validator : For validating and sanitizing user input to prevent security vulnerabilities and ensure data integrity.
  - imageKit : for handling image uploads and storage in the application, providing a convenient way to manage media files.
  - multer : For handling multipart/form-data, which is commonly used for file uploads in web applications.

- Concepts
  - Using ES6 module syntax for importing and exporting modules in the backend code.
    type: "module" is added in package.json to enable this feature
  - express.json() middleware is used to parse incoming JSON payloads in request and sending JSON responses back to the client. It allows us to easily handle JSON data in our API endpoints.
- JWT (JSON Web Tokens) is used for user authentication and authorization in the application. It allows us to securely transmit information between the client and server in protected routes and manage user sessions effectively.
- While comparing the object _id from MongoDB with userId that we get from req.body or req.params, we are using the .toString() method to convert the ObjectId to a string before comparing it with the userId. 
  This is necessary because the ObjectId is a special type in MongoDB and needs to be converted to a string for accurate comparison.
- Scheduling background tasks using node-cron to perform periodic operations such as sending notifications, deleting old user stories data , or performing maintenance tasks at specified intervals.