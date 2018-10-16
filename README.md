# CRDT - Vizualizer

This project contains the CRDT-Visualizer tool. It is a tool, which can be embedded into a web-page. The functionality let's you vizualize CRDT executions in order to explain the semantics of different CRDTs.

######Available CRDT at the moment:
- Counter
- Add-wins Set
- Multi-Value Register

To read about different types of CRDTs, please look up [the documentation on AntidoteDB](https://antidotedb.gitbook.io/documentation/api/datatypes).

## Demo

You can find the deployed version of CRDT-Vizualizer [here](https://www.antidotedb.eu/crdt-visualizer/).

## Usage

The application is quite intuitive to use. 

##### Creating an operation
For each CRDT-datatype, you have a section, where the timelines for different replicas are displayed. By clicking at the timeline, you can perform a specific operation for the current type of CRDT. Doing that will affect the state of the replica.

##### Editing the operation
To edit already created operations, you can click on the operation element and type the name of another operation supported by the current CRDT-datatype, which you can look up at the description of the CRDT datatype in the application.

##### Merging
 Apart from performing operations on the current replica, you can create a merge operation from one replica to another one. To do that, click at one replica and drag an arrow to another replica of your choice. That will also affect the current state of the replicas.

 ##### Removing the operation or merge

 In order to remove the merge / operation performed on replica, just drag an arrow or an operation element to the area on the right hand side, which appears when you start dragging the above-mentioned elements.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

### Prerequisites

Before you can run the application, you have to go through the following steps of installing the pre-requisites.

#### Install npm

To run this project, you will need to install `npm`. It goes together with `Nodejs`. Therefore, download and install `node` from [here](https://nodejs.org/en/).

After you did install node, to check whether you have it, run the following commands in the console.

######To check if you have Node.js installed, run this command in your terminal:
`node -v`
######To confirm that you have npm installed you can run this command in your terminal:
`npm -v`

#### Install packages

Now, once you installed `npm`, under the root directory, run the following command to install all required packages to run the application.

```
npm i
```

### Running

After you have installed all the packages, you can run the application.
To do that, use the following command:
`npm run start`

## Running the tests

To run the automated test for the system, use the following command:

`npm run test`

## Built With

* [Konva](https://konvajs.github.io/) - HTML5 2d canvas library for desktop and mobile applications.
* [React](https://reactjs.org/) - A JavaScript library for building user interfaces

## Authors

You can see the list of [contributors](https://github.com/AntidoteDB/crdt-visualizer/graphs/contributors) who participated in this project.

## Related projects

[AntidoteDB](https://www.antidotedb.eu/) - A planet scale, highly available, transactional database.