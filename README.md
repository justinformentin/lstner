<p align="center">
  <a href="https://github.com/justinformentin/lstner">
    <img
      src="https://i.imgur.com/ERHMGRR.png"
      height="100"
      alt="Lstner"
      title="Lstner podcast app"
    />
  </a>
</p>
<p align="center">
  <a href="https://circleci.com/gh/justinformentin/lstner">
    <img
      src="https://circleci.com/gh/justinformentin/lstner.svg?style=svg"
      alt="CircleCI"
    />
  </a>
  <a href="https://codeclimate.com/github/justinformentin/lstner">
    <img
      src="https://codeclimate.com/github/justinformentin/lstner/badges/gpa.svg"
      alt="Maintainability"
    />
  </a>
  <a href="https://david-dm.org/justinformentin/gatsby-v2-tutorial-starter">
    <img
      src="https://img.shields.io/david/justinformentin/gatsby-v2-tutorial-starter.svg"
      alt="Dependencies"
    />
  </a>
</p>

<p align="center">
  <strong>
    View the site at <a href="https://lstner.com">https://lstner.com</a>.
  </strong>
</p>

Podcast dashboard where you can:
- Browse by category
- Search for podcasts by name
- Add podcasts to favorites list
- Subscribe to podcasts
- Register and login to save all your subscriptions, favorites, played, and in-progress podcasts with data being saved in the database
- Non-registered guest users have data saved in local storage.

## Usage

Lstner uses Meteor, which comes bundled with npm. To use Meteor, [install Meteor](https://www.meteor.com/install) on your computer.

```bash
meteor npm install # Installs dependencies

meteor # Runs application on port 3000 with MongoDB running on port 3001

npm run test # Runs tests 
```

## Folder structure
```bash
├── .circleci # Circleci integration
├── .meteor # Theme and site metadata
├── client # Client entry
├── imports
│   ├── api # All GraphQL schemas and resolvers
│   ├── localData # Mutations, queries, resolvers
│   └── startup
│       ├── client # Importing client startup files
│       └── server # Registering API and data schema
│   └── tests
│       ├── components
│       ├── fixtures
│       └── mocks
│   └── ui # Reusable components, mutations, and queries
├── public # Logo, images, favicons
└── server # ApolloEngine 
```

<p align="center">
  <a href="https://github.com/justinformentin/lstner">
    <img
      src="https://i.imgur.com/MiO8RKB.png"
      alt="Discover"
      title="Lstner podcast app discover page"
    />
  </a>
</p>
<p align="center">
  <a href="https://github.com/justinformentin/lstner">
    <img
      src="https://i.imgur.com/RYq7xLo.png"
      alt="Mobile"
      title="Lstner podcast app mobile"
    />
  </a>
</p>
