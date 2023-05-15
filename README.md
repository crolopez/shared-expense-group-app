# Shared Expense APP

Small APP to manage a group of shared expenses between friends using Angular.

## Configuration

To launch this application it is necessary to have an instance of the `Shared Expense API running`. You can find more information about this project, as well as how to deploy it, [here](https://github.com/crolopez/shared-expense-group-api/).

Once the API is instantiated, it is necessary to modify the [environment.ts](./src/environments/environment.ts) file by setting the `apiBaseUrl` parameter.

## Run locally

To deploy the application locally just run:

```bash
npm install
npm run build
npm run start
```

After this, the APP will be ready at http://localhost:4200/.

If you want to build the application in a dockerized environment:

```bash
docker build -t sharedexpense-app .
docker run -p 4200:80 sharedexpense-app
```
