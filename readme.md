# Requirements

- Node JS >= 15.0.0 (download node from https://nodejs.org/pt-br/download/)

# Getting start

## Install

With Node JS installed, follow these steps:

- Open a terminal and enter in root directory of this project;
- Run: `npm install`;

## Start

- Run `npm start` to run Express server

# About

## Server

The Express server is only intended to serve static files from anywhere in the project. This can be easily replicated with an apache server + .htaccess or nginx + settings.

You can run the `index.html` file in any environment, as long as the protocol to be used is not `file://`. 

## Application

The application is a simple website built in vanilla whose core is inspired by React or Angular. It is clear that the core of this project cannot offer the whole world of possibilities that the two aforementioned frameworks do. However, it offers componentization and intelligent rendering of component properties in the final DOM, whether they be scalar properties or more complex objects.

This was thought so to meet the biggest challenge of the project, scaling the project in vanilla is complex. 

## Known bugs

- Currently it is not possible to render two components inside another one through a nodeText with the example value: `{{ render.Foo }} {{ render.Bar }}`
- It is possible to have a nodeText with the value: `lorem ipsum {{ render.Foo }}`, but the component will be re-rendered before the phrase `lorem ipsum`

# Curiosities

## Main logic

The main logic is to traverse the DOM looking for textNode's and find mustache patterns in them. In addition, we go through the other elements looking for mustache patterns in their attributes. When a pattern is found, a class is added to that element. If the element is a nodeText, the class is added to the parent element.

Through a Proxy object available in all components (which has a centralized class that is extended by all components) we can modify the component properties and trigger a component life cycle called `changes`. The same lifecycle is called when attributes change. Then `changes` traverses the entire observable DOM through the classes previously added on the first re-render. On the second re-render the original state of the DOM is restored to reprocess the references and all mustaches again. 

## Fun fun fun

It was really fun to work on this project. Thanks.
