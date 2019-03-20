---
slug: nutshell
title: "In a Nutshell"
navorder: 10
navstickytop: true
includes:
    - file: document.html
---

Using Coaty [koʊti] as a middleware, you can build distributed applications out of
decentrally organized application components, so called Coaty agents, which are
loosely coupled and communicate with each other in (soft) real-time.
The main focus is on IoT prosumer scenarios where smart agents
act in an autonomous, collaborative, and ad-hoc fashion.

Coaty removes the need for a central coordination authority by decoupling interaction
between agents. You can dynamically and spontaneously add new agents and new features
without distracting the existing system in order to adapt to your ever-changing scenarios.
All types of agents such as sensors, mobile devices, edge and cloud services can be
considered equivalent.

At its core, Coaty offers a standardized set of event-based communication patterns
for Coaty agents to talk to each other by one-way/two-way and one-to-many/many-to-many
communication flows without the need to know about each other. Subject of communication
is domain-specific data based on a typed, extensible object model. Thereby, data in
a distributed system can be shared (Advertise, Channel), discovered (Discover-Resolve),
queried (Query-Retrieve), as well as modified and persisted (Update-Complete).
Moreover, remote operations can be performed by executing one-to-many or many-to-many
remote procedure calls (Call-Return).

We think collaborative applications often have a natural need for such powerful forms
of interaction. Restricting interaction to strongly coupled one-to-one
communication (classic request-response) quickly becomes complex, inflexible,
and unmaintainable. Restricting interaction to loosely coupled one-way
communication (classic publish-subscribe) lacks the power of transmitting
information in direct responses. Which is why Coaty combines the best of both worlds.

The Coaty framework is easy to use, straightforward to port to different
programming languages, and based on modern software engineering and technology
standards.

We believe Coaty is a major step forward in practice that allows developers
to create more powerful collaborative applications with less complexity and in
less time.

<a name="lightweight-and-modular-framework-architecture"></a>

## Lightweight and modular framework architecture

Coaty embodies a modern software architecture with a shift in mindset from an
imperative to a resource-oriented and declarative programming style:
You express where and how things should be, not how things should be done.

To achieve this, Coaty uses an object-oriented framework design with inversion
of control (IoC), dependency injection (DI), and distributed lifecycle management
(LM).

Coaty provides a modular framework structure where you can choose from a
set of core and specialized modules to achieve operational simplicity
with minimal dependencies.

Connecting to heterogenous IoT system landscapes is achieved by
extensible environment connectors. Connectors serve as gateways
to external networks, or bridges to connect to external systems.

Coaty comes with an essential set of connectors to store and retrieve
Coaty objects in SQL and noSQL database systems (see
[here](#query-anywhere-retrieve-anywhere-persist-anywhere)).

### Set up your agent

To set up a Coaty agent, you define, configure, and bootstrap an IoC *container*
with its *controllers* that encapsulate the agent's application logic:

```ts
// Define container components
const components: Components = {
    controllers: {
        ProductionOrderController,
        SupportTaskController,
    }
};

// Configure container components
const configuration: Configuration = {
    common: {
         // Common options shared by all container components
         agentInfo: ... ,
         ...
    },
    communication: {
          // Options used for communication
          brokerUrl: ... ,
          ...
    },
    controllers: {
        // Controller-specific configuration options
        ProductionOrderController: {
            ...
        },
        SupportTaskController: {
            ...
        },
    },
    ...
};

// Bootstrap container
Container.resolve(components, configuration);
```

### Program your agent's application logic

Controller classes realize custom application logic of a Coaty agent by:

* exchanging object data with other agent controllers,
* providing observable state to the application views,
* providing methods for lifecycle management.

```ts
class SupportTaskController extends Controller {

    /* Lifecycle methods called by framework */

    onInit() {
        // Define initializations here
    }

    onCommunicationManagerStarting() {
        // Set up observations for incoming communication events here
    }

    onCommunicationManagerStopping() {
        // Clean up observations for incoming communication events here
    }

    /* Business logic methods */
    ...
}
```

For communication, controllers utilize the *communication manager*, a
component that is an integral part of each IoC container. It provides a
set of methods to publish and observe communication events asynchronously.

You can use the communication manager without the need to understand
and deal with details of the underlying publish-subscribe messaging protocol,
including auto-reconnect, automatic re-subscription upon connection, and
queued offline publishing.

<a name="reactive-programming-for-asynchronous-event-handling"></a>

### Reactive Programming for asynchronous event handling

Reactive Programming (RP) is a paradigm for asynchronous programming with
observable data streams. It is a combination of the best ideas from
the Observer software design pattern, the Iterator pattern, and
functional programming.

Coaty adopts RP to handle incoming asynchronous communication events in
context. You can process each event where needed according to the structure
of your business logic, rather than having to implement a central event
dispatching logic yourself.

RP also raises the level of abstraction of your code, so you
can focus on the interdependence of events rather than having to constantly
cope with a large amount of implementation details. Code in RP will be more
concise and clear by hiding asynchronous issues such as low-level threading,
synchronization and concurreny.

[Reactive Programming libraries](http://reactivex.io/) are ubiquitously
available for a variety of programming languages and platforms.
Coaty JavaScript, our reference framework implementation uses the
[RxJS](https://rxjs.dev/) library. You can also find examples and
explanations on the [Learn RxJS](https://www.learnrxjs.io/) website.

<a name="reactive-programming-examples"></a>
Using RxJS observables in a Coaty controller is as simple as that:

```ts
/* Observe all incoming Advertise events for Task objects with status 'Done' */

this.communicationManager
    .observeAdvertiseWithCoreType(this.identity, "Task")
    .pipe(
        map(event => event.eventData.object as Task),
        filter(task => task.status === TaskStatus.Done)
    )
    .subscribe(task => {
        console.log("Task done:", task.name);
    });
```

```ts
/* Discover machine information for a given machine ID */

this.communicationManager
    .publishDiscover(DiscoverEvent.withExternalId(this.identity, machineId))
    .pipe(
        first(),
        map(event => event.eventData.object)
        timeout(5000)
    )
    .subscribe(
        info => {
            console.log("Machine info:", info);
        },
        error => {
            // No response has been received within the given timeout period
            this.logError(error, "Failed to discover machine");
        });
```

```ts
/* Handle both discovered and advertised tasks in context as they are received */

const discoveredTasks$ = this.communicationManager
    .publishDiscover(DiscoverEvent.withObjectTypes(this.identity, ["com.mycompany.myproject.SupportTask"]))
    .pipe(
        filter(event => !!event.eventData.object),
        map(event => event.eventData.object as SupportTask)
    );

const advertisedTasks$ = this.communicationManager
    .observeAdvertiseWithObjectType(this.identity, "com.mycompany.myproject.SupportTask")
    .pipe(
        map(event => event.eventData.object as SupportTask)
    );

return merge(discoveredTasks$, advertisedTasks$)
            .subscribe(task => {
                // Handle both discovered and advertised tasks in one place...
            });
```

<a name="typed-object-model"></a>

## Typed Object Model

You can model your domain data with Coaty's platform-agnostic typed object model.
It provides an extensible hierarchy of core object types for distributed data exchange:

```text
CoatyObject
  |
  |-- User
  |-- Device
  |-- Component
  |-- Annotation
  |-- Task
  |-- Location
  |-- Log
  |-- Snapshot
  |
  |-- IoSource
  |-- IoActor
  |
  |-- Sensor
  |-- Thing
  |-- Observation
  |-- FeatureOfInterest
```

Coaty objects are [JSON](http://www.json.org) ([JavaScript Object Notation](https://www.ietf.org/rfc/rfc4627.txt))
compatible to be easily interoperable between languages and platforms. As such, Coaty objects solely represent
property - value pairs that model state but no behavior.

Besides core object types, the framework also defines object types to manage a
self-discovering network of sensors and to distribute sensor data. For this purpose,
Coaty leverages the [OGC SensorThings API](https://coatyio.github.io/coaty-js/man/sensor-things-guide/).

The base `CoatyObject` interface defines the following generic properties:

```ts
interface CoatyObject {

  // Base core type
  coreType: "CoatyObject" | "User" | "Device" | ... ;

  // Concrete type name
  objectType: string;

  // A descriptive name for the object
  name: string;

  // Unique identity of the object
  objectId: Uuid;

  // Identity of an object relative to an external system (optional)
  externalId?: string;

  // Object ID of parent object (optional)
  parentObjectId?: Uuid;

  // Object ID of User object this object has been assigned (optional)
  assigneeUserId?: Uuid;

  // Object ID of associated Location object (optional)
  locationId?: Uuid;

  // Indicates whether object is no longer in use (optional)
  isDeactivated?: boolean;
}
```

To enable the distributed system architecture to uniquely identify an object
without central coordination, each object has a universally unique object
identifier (UUID).

To define a domain-specific object type, simply extend one of the core object
types with additional properties and specify a canonical object type name:

```ts
enum SupportTaskUrgency {
    Low,
    Medium,
    High,
    Critical
}

interface SupportTask extends Task {
    coreType: "Task",
    objectType: "com.mycompany.myproject.SupportTask";

    // Level of urgency of a support task
    urgency: SupportTaskUrgency;
}
```

<a name="query-anywhere-retrieve-anywhere-persist-anywhere"></a>

## Query anwhere - retrieve anywhere - persist anywhere

Coaty communication provides a [Query-Retrieve](#communication-event-patterns) event pattern to
seamlessly query distributed domain-specific data across decentralized application components,
and retrieve them from a single or multiple storage systems, no matter if storage is persistent
in a database or in memory. Query-Retrieve enables declarative, seamless and transparent retrieval
of Coaty objects across Coaty agents independent of storage implementations. The Query event’s object
filter which specifies selection and ordering criteria can be directly passed to Coaty's
*Unified Storage API* for object retrieval.

Using the Unified Storage API, Coaty objects can be persisted schemalessly in arbitary data
sources. The database-agnostic API provides a common interface to store and retrieve data from
NoSQL and relational SQL data stores using the notion of *adapters* to connect to specific databases.

The Coaty framework provides ready-to-use built-in adapters for NoSQL/SQL-based storage
in e.g. PostgreSQL and SQLite databases. In addition, it provides an in-memory storage.
You can also write your own custom adapter to connect to a specific database not yet
supported by the framework.

<a name="communication-foundation"></a>

## Communication foundation

Coaty reaches distributed system flexibility by decoupling communication endpoints,
but maintaining all types of communication flows.

![Communication foundation](/_assets/nutshell/communication-foundation.png)

Coaty uses event-based communication flows with one-way/two-way and one-to-many/many-to-many
event patterns to realize decentralized prosumer scenarios. Thereby, Coaty combines the
characteristics of both classic request-response and publish-subscribe communication.
In contrast to classic client-server systems, all Coaty participants are equal in that
they can act both as producers/requesters and consumers/responders.

One of the unique features of Coaty communication is the fact that a single request in principal
can yield multiple responses over time, *even* from the same responder. The use case specific
logic implemented by the requester determines how to handle such responses. For example,
the requester can decide to

* just take the first response and ignore all others,
* only take responses received within a given time interval,
* handle any response over time, or
* process responses as defined by any other application-specific logic.

Using this "open channel" communication, you can realize advanced interaction scenarios in a very
simple way. For example, a Query event responder could re-execute the database query
and publish a Retrieve event with the latest results every time the concerned storage area
is updated. In this way, inefficient database polling is replaced by an efficient
push-based approach.

<a name="communication-event-patterns"></a>

### Communication event patterns

Coaty provides a set of event-based communication patterns to discover, query,
share, and update data on demand in a distributed system. You can also
perform remote operations by issuing one-to-many or many-to-many
remote procedure call events.

![Communication event patterns](/_assets/nutshell/communication-event-patterns.png)

Coaty's standardized communication protocol is build on top of
exchangeable open-standard publish-subscribe (pub/sub) messaging protocols such as
[MQTT](http://mqtt.org/) or [WAMP](https://wamp-proto.org/), but it does not
expose the messaging primitives whcih are just an implementation detail.
By choosing WebSocket-aware pub/sub messaging systems, Coaty agents can also
run in mobile and web browsers.

With the help of Reactive Programming, all Coaty event patterns are programmed
in a simple, uniform way. You can find some examples in the section on
[Reactive Programming](#reactive-programming-examples). For details and advanced
use cases, take a look at the [Coaty JS Developer Guide](https://coatyio.github.io/coaty-js/man/developer-guide/#communication-event-patterns).

<a name="smart-routing-of-iot-data"></a>

## Smart routing of IoT data

Coaty provides what we call *Smart Routing* of IoT (sensor) data,
where data is dynamically routed from sources to actors, i.e. consumers
based on context. Backpressure strategies
that enable data transfer rate controlled publishing of data are
negotiated between sources and actors.

Smart routing ensures that IoT data events published by sources are
dispatched only to the currently relevant actors, depending on
application-specific context logic which is defined by a set of rules.
Coaty's rule engine evaluates these rules and updates associations
between sources and actors accordingly.

For details, take a look at the [Coaty JS Developer Guide](https://coatyio.github.io/coaty-js/man/developer-guide/#io-routing).

<a name="works-across-languages-and-platforms"></a>

## Works across languages and platforms

Coaty is designed with interoperability in mind. It can be easily
ported to a variety of programming languages and platforms because of its
layered and modular architecture and its lightweight technology stack:

* a library for Reactive Programming, such as the Rx* library family,
* a pub/sub messaging client, such as an MQTT or WAMP library,
  with a JSON serializer.

[Coaty JS](https://github.com/coatyio/coaty-js) is the *reference
implementation* of the Coaty framework. It works across platforms and is
targeted at JavaScript/TypeScript, running as mobile and web apps in the browser,
or as Node.js services. Coaty JS provides a complete set of features as described
in the [Developer Guide](https://coatyio.github.io/coaty-js/man/developer-guide/).

Coaty JS is intended to be used as reference for porting Coaty to new programming languages
and platforms. We intend to make additional framework implementations available as open source.
For example, a [Unity](https://unity3d.com) implementation for programming
collaborative Augmented Reality and Virtual Reality applications is in the works.

## Getting started

Get started with Coaty by using its best practice examples as
application skeleton. In addition, Coaty comes with all you
need to know: a developer guide, coding style guide, and
complete framework source code documentation.

Details can be found on the [Documentation](/docs) page.
