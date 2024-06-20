# Socket

> A Real-Time Anonymous Chat Application

Socket is a real-time anonymous chat application where users can log in or register with a unique username and email. This username serves as the pass to engage in anonymous chats with other users who have accepted their request. Users can send friend requests to others using their usernames and start chatting once the requests are accepted.

## Getting Started

1. **Fork the Repository**: Start by forking the repository to your GitHub account.

2. **Clone the Repository**: Clone the forked repository to your local machine using the following command:

   ```bash
   git clone https://github.com/your-github-username/socket
   ```

3. **Install Required Packages**: Navigate to the cloned directory and install the required packages:

   ```bash
   npm install
   ```

4. **Set Up and Run the Socket Server**: Before running the front-end, make sure to set up and run the [Socket Server](https://github.com/SuperSahitya/socket-server).

5. **Run the Development Server**: Once the server is running, start the development server for the front-end:

   ```bash
   npm run dev
   ```

   You can also use `yarn dev`, `pnpm dev`, or `bun dev` depending on your package manager.

6. **View the Application**: Open your browser and go to [http://localhost:3000](http://localhost:3000) to see the Socket application in action.

## Project Overview

Socket is built using Next.js, a React framework, and is bootstrapped with `create-next-app`.

It incorporates the following technologies and features:

- **TypeScript**: Ensures static typing for a more robust codebase.
- **TailwindCSS**: Used for styling the application, providing a sleek and responsive design.
- **Zustand**: Utilized for global state management, enabling efficient data handling across components.
