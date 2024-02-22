# NorthCoders News API

Welcome to the NorthCoders News API! This API provides access to application data programmatically, aiming to simulate a real-world backend service similar to platforms like Reddit. You can interact with various endpoints to retrieve articles, users, comments, and more.

## Hosted Version

You can access the hosted version of the API at [NorthCoders News API](https://northcoders-news-iumv.onrender.com/api).

## Summary of Project

The NorthCoders News API serves as a backend system allowing users to retrieve and manipulate data through HTTP requests. With multiple endpoints catering to different data types, developers can integrate this API into their applications seamlessly.

## Getting Started

To run your own version of the NorthCoders News API, follow these steps:

### Cloning

1. Clone the repository by clicking on the green code button and copying the provided link.
2. Open your terminal and navigate to the directory where you want to clone the repository.
3. Use the following command to clone the repository:

    ```
    git clone <paste-the-copied-link>
    ```

### Dependencies

After cloning the repository, install the required dependencies by running the following command:

```
npm install
```

### Seed Local Databases

To seed the database with initial data, execute the following commands:

```
npm run setup-dbs
npm run seed
```

### Running Tests

To ensure everything is set up correctly, run the tests using the following command:

```
npm test
```

### Important Environment Files

For successful deployment and operation, you need to create three environment files:

- `.env.test`: Test environment configuration.
- `.env.development`: Development environment configuration.
- `.env.production`: Production (live) environment configuration.

In each file, add `PGDATABASE=` with the correct database name for that environment (refer to `/db/setup.sql` for the test and development database names).

## Minimum Software Versions Required

- **Node.js**: Version 21.1 or higher.
- **Postgres**: Version 14.9 or higher.

Feel free to explore the endpoints and integrate the NorthCoders News API into your applications. If you encounter any issues or have suggestions for improvement, please don't hesitate to contact me.

Happy coding! 🚀