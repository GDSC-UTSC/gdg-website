1. Next.js API Routes and Server Components
In this project, we utilize Next.js as a full-stack framework. The backend logic is handled primarily through a combination of API Routes and React Server Components.
API Routes: For creating dedicated API endpoints, we use Next.js API Routes. Any file inside the pages/api directory is mapped to an /api/* endpoint and is treated as a server-side only bundle. This is useful for tasks like handling form submissions or communicating with external services.
Official Documentation: To understand how to build APIs with Next.js, please refer to the official documentation on API Routes: https://nextjs.org/docs/pages/building-your-application/routing/api-routes
Server Components: We use React Server Components to run logic on the server before a page is rendered.[4][5] This allows us to directly access backend resources and fetch data, reducing the amount of client-side JavaScript and improving performance. This is especially important for keeping Firebase usage low.
2. Running on the Edge with Vercel
To ensure our application is fast and responsive for users globally, our backend code runs on the Edge Runtime.
What is the Edge?: The Edge Runtime is a lightweight JavaScript runtime provided by Vercel, the company behind Next.js. Instead of running on a traditional server in one location, our backend functions are deployed to a global network of servers. When a user makes a request, it's handled by the server geographically closest to them, significantly reducing latency. 
Key Characteristics:
It uses a subset of Node.js APIs, so not all Node.js functionalities are available.
It is designed for speed and efficiency.
You will learn more about how this works in the Deployment section.
Official Documentation: For a deeper dive into the specifics of the Edge Runtime, check out the Next.js documentation: https://nextjs.org/docs/app/api-reference/edge
3. Middleware for Protected Routes with Firebase Cloud Functions
For handling user authentication and securing certain routes (like our admin dashboard), we combine Next.js Middleware with Firebase Cloud Functions.
What is Next.js Middleware?: Middleware is code that runs before a request is completed, intercepting every request before it reaches your page or API route. It executes on Vercel's Edge Runtime, allowing you to modify requests, perform redirects, set headers, or control access to routes. Our middleware is defined in `src/middleware.ts` and runs automatically for every request.
Official Documentation: Learn more about Next.js Middleware: https://nextjs.org/docs/app/api-reference/file-conventions/middleware
What are Firebase Cloud Functions?: Cloud Functions are serverless backend functions that run on Google's infrastructure in response to events. They automatically scale based on usage, and Google handles all server management. Functions can be triggered by HTTP requests, database changes, authentication events, or scheduled jobs. In our case, we use an HTTP-triggered Cloud Function to verify admin permissions.
Official Documentation: Learn more about Firebase Cloud Functions: https://firebase.google.com/docs/functions
How we use them together:
1. When a request is made to a protected route (e.g., `/admin/*` or `/api/admin/*`), our Next.js middleware intercepts it (see `src/middleware.ts`)
2. The middleware checks if the user is authenticated using Firebase Auth
3. If authenticated, it calls our Firebase Cloud Function (`checkAdminClaims`) via an HTTP request, passing the user's authentication token
4. The Cloud Function verifies the token and checks the user's custom claims to determine if they are an admin or super admin
5. Based on the response, the middleware either allows the request to proceed or redirects the user to the login page or home page
This architecture keeps sensitive authorization logic secure on the backend while leveraging the Edge Runtime's speed for initial authentication checks.
You will find more detailed information on how to work with and write these functions in the Firebase section of these docs.
