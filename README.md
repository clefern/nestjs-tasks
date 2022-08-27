<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

# Notes

## Validation

### In order to validate we need to install some packages

- class-validator
- class-transformer

To use the validation in the app global level we need to set in the main.ts file right before app.listen
`app.useGlobalPipes(new ValidationPipe());`

To throw an error in case of not found we should apply the login in the service and use:

`if (!task) { throw new NotFoundException(`Task with ID ${id} not found`); } `

## Postgres -

Run postgres in the docker

`docker run --name postgres-nest -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres`

check if the docker is running our container
`docker container ls`

stop the container running
`docker container stop postgres-nest`

start the container
`docker container start postgres-nest`

delete a container
`docker container rm postgres-nest`

### typeorm

Object relation map tool to use in relation databases

integration with
decorations, dependency injection
great integration with the

pg database driver to postgres
Every time we use with a different database we will need the corresponding driver

Database config was put in the app.module.ts
` Type0rmModule.forRoot({ type:'postgres', host:'localhost', port:5432, username:'postgres', password:'postgres', database:'task-management', autoLoadEntities:true, }),`

TypeOrm supports

- Active Record
- Data Mapper

# JWT Passport Authentication

`npm i @nestjs/jwt @nestjs/passport passport passport-jwt @types/passport-jwt`

Auth Module
` PassportModule.register({ defaultStrategy: 'jwt' }), JwtModule.register({ secret: 'topSecret51', signOptions: { expiresIn: 3600, }, }),`

In the auth service to generate the jwt token
`const payload: JwtPayload = { username }; const accessToken: string = await this.jwtService.sign(payload); return { accessToken };`

### JWT Strategy

`@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
constructor(private userService: UserService) {
super({
secretOrKey: 'topSecret51',
jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
});
}

async validate({ username }: JwtPayload): Promise<User> {
const user: User = await this.userService.getUserByUsername(username);
return user;
}
}

`

After provide the JwtStrategy for AuthModule and exports it as well

Protect only one route in a controller or the entire controller
`@UseGuards(AuthGuard())`

### TypeOrm Relations

set a new property that will be owner of the object created in a OneToMany relation
One To Many
`@OneToMany((_type) => Task, (task) => task.user, { eager: true }) tasks: Task[];`

Eager means whenever e fetch the owner object it will also fetch the many objects that belong to that owner

Many To One
`@ManyToOne((_type) => User, (user) => user.tasks, { eager: false })`

We need both parent and child declaration to the relation works

### Create our own decorators

The below decorator gets the user of the request token when the user is logged in and has that token

`export const GetUser = createParamDecorator( (data, ctx: ExecutionContext): User => { const req = ctx.switchToHttp().getRequest(); return req.user; }, );`

To associate the owner id in the child object created is necessary to pass the parent object in the child creation. Automatically it's create a ownerId column in the child table

## Class Transformer -

#### How to avoid pass all owner information when associating the owner with the child

One of the decorators exposed by class-transformer is
`@Exclude({ toPlainOnly: true })`

It will exclude the relation object in
whenever you bridge that object into plain text it will be exclude
Whenever you set a response in json it means plain text

But it is not enough, we need to Use interceptable to achieve that.
You can put a interceptable in any scale like:

- handler level\
- controller level
- application level

Create Interceptor an use it in the mais.ts file as follow
`app.useGlobalInterceptors(new TransformInterceptor());`

### Get the children that just belongs to the logged in user

We can use the custom decorator that grabs the user logged in that we get from the request token and use it to associate the user and the children that are being created, listed, etc...

The place we use custom decorators is in the Controller method metadata, as follow

```
@Get()
getTasks( @Query() filterDto: GetTasksFilterDto, @GetUser() user: User): Promise<Task[]> {
  return this.taskService.getTasks(filterDto, user);
}
```

Then we only need to pass the user for the service and repository where we will compose our query to look for children only for that logged in user.

In the repository we pass the entire user to a where closure method inside an object.
That way the queryBuilder will know how to handle that user cince in its child entity declaration has a relation with the user
`const query = this.createQueryBuilder('task').where({ user });`

```

```

### Config Environments

First of all we would need to create a config module that exposes a ConfigService which loads the appropriate .env file. For this NestJs provides a package:
This follow the NestJs Approach

`npm i --save @nestjs/config`

This follow the TypeOrm Does:
`yarn add dotenv @types/dotenv pg`
``

### TypeOrm Schematics

`typeorm migration:create -n CrateUserTable`

### Schema validation for environments

We could check if any environment variable is missing and give the proper message
validation for correct the mistake as soon as possible

Install two packages:
`yarn add @hapi/joi`
`yarn add @types/hapi__joi ` -D for devDependency - and we need this package because @hapi/joi don't have type definition

After we are going to create a config/schema.ts where we define our schema
check the mentioned file.

That implementation made me use the same environment config for both different scenarios like for migrations and for loading the env variables with validation.

### Security - the JWT secret

We are usin the key in two places:

- jwt.strategy and auth.module

Then we can provide an extra value JWT_SECRET TO OUR environment
`JWT_SECRET: Joi.string().required(),` in the config.schema

and put the `JWT_SECRET` in the env file

Usually the value of it is using a online password generator tool

### Heroku

Create an Addon for Postgres database
`heroku addons:create heroku-postgresql:hobby-dev -a tasky-apis`
The database will be on the resources tab in the heroku.

To get the credentials we click in the Heroku-postgres resource

##### Prepare Environment to Production

We need to set ssl and extra.ssl in the TypeOrmModuleOptions in order to access a different env for our app

```
  const isProduction = process.env.NODE_ENV === 'prod';
  const configuration: TypeOrmModuleOptions = {
    ssl: isProduction,
    extra: {
      ssl: isProduction ? { rejectUnauthorized: false } : null,
    },
    ...
  }
```

After that we need to use out PORT from env not hardcoded anymore. For that we include the PORT variable in our schema config

```
  export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(3000),
    ...
  });
```

And in the main.ts file we use that from env as well:

```
  async function bootstrap() {
    const PORT = process.env.PORT;
    ...
  }
  bootstrap();
```

##### Add a remote git for production env using heroku cli

That command will create a remote in heroku to our project
`heroku git:remote -a HEROKU-APP-NAME`

We need to handle a problem with typescript without elaborate too much.
`heroku config:set NPM_CONFIG_PRODUCTION=false`
`heroku config:set NODE_ENV=production`

There are two ways to set the env variables to production:
Manually by heroku CLI or in its own interface

Than we need to create a Procfile in the app root with the content:

```
  web: yarn start:prod
```

I changed the procfile to use npm because yarn didn't run the command to build the app

After I create the Procfile it was not initiating the Dyno for web
Than I changed the Procfile and the command became orange.
When I tried to push the heroku wasn't recognizing changes,
to solve that I run a command that solved the issue:
`git push -f heroku HEAD:master`

To check up the logs about the build in heroku run:
`heroku logs --tail`
You 'll have access to the logs in real time as the user make request to the app

Test deploy automatic
Remove tick in "wait for CI to pass before deploy" checkbox to test deploy automatic, and it works, amazing make deploys automatic using github connection
