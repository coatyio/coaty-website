---
slug: nutshell
title: "In a Nutshell"
navorder: 10
navstickytop: true
includes:
    - file: document.html
---

Using Coaty [koʊti] as a middleware, you can build distributed applications out
of decentrally organized application components, so called Coaty agents, which
are loosely coupled and communicate with each other in (soft) real-time. The
main focus is on IoT prosumer scenarios where smart agents act in an autonomous,
collaborative, and ad-hoc fashion.

Coaty removes the need for a central coordination authority by decoupling
interaction between agents. You can dynamically and spontaneously add new agents
and new features without distracting the existing system in order to adapt to
your ever-changing scenarios. All types of agents such as sensors, mobile
devices, edge and cloud services can be considered equivalent.

At its core, Coaty offers a standardized set of event-based communication
patterns for Coaty agents to talk to each other by one-way/two-way and
one-to-many/many-to-many communication flows without the need to know about each
other. Subject of communication is domain-specific data based on a simple,
extensible typed object model. Thereby, objects in a distributed system can be
shared (Advertise, Channel), discovered (Discover-Resolve), queried
(Query-Retrieve), as well as modified and persisted (Update-Complete). Moreover,
remote operations targeted at multiple executing agents can be requested
(Call-Return).

We think collaborative applications often have a natural need for such powerful
forms of interaction. Restricting interaction to strongly coupled one-to-one
communication (classic request-response) quickly becomes complex, inflexible,
and unmaintainable. Restricting interaction to loosely coupled one-way
communication (classic publish-subscribe) lacks the power of transmitting
information in direct responses. Which is why Coaty combines the best of both
worlds.

The Coaty framework is easy to use, straightforward to port to different
programming languages, and based on modern software engineering and technology
standards.

We believe Coaty is a major step forward in practice that allows developers to
create more powerful collaborative applications with less complexity and in less
time.

## Why use Coaty

To realize decentralized, collaborative applications Coaty leverages the
publish-subscribe paradigm by making use of existing pub-sub messaging
protocols. The reason is to provide a powerful yet easy to use high-level
abstraction of essential collaboration features without coping with the
low-level complexities of pub-sub transport layers:

* **Beyond messaging**: object-centric interaction replaces message-centric
  programming.
* **Efficient and easy programmability**: use Reactive Programming for handling
  asynchrounous event streams in a declarative way.
* **Two-way communication patterns and many-to-many communication flows**:
  realized on top of classic pub-sub communication to enable sophisticated
  features such as live queries or context-filtered remote operation calls with
  progressive results.
* **Routing of information flows** by dynamic subscriptions based on context.
* **Spatial filtering of information flows** by location and proximity aware
  subscriptions.
* **Adapt communication infrastructure to your use case needs**: choose among
  different broker-based or brokerless transport bindings.
* **Track liveliness of objects and agents** across your distributed system and
  their lifecycles.
* **Cross platform deployments** by interoperable framework implementations.

Read on to gain a deeper understanding of Coaty's underlying technical concepts.

<a name="lightweight-and-modular-framework-architecture"></a>

## Lightweight and modular framework architecture

Coaty embodies a modern software architecture with a shift in mindset from an
imperative to a resource-oriented and declarative programming style: You express
where and how things should be, not how things should be done.

To achieve this, Coaty uses an object-oriented framework design with inversion
of control (IoC), dependency injection (DI), and distributed lifecycle
management (LM).

Coaty provides a modular framework structure where you can choose from a set of
core and specialized modules to achieve operational simplicity with minimal
dependencies.

Connecting to heterogenous IoT system landscapes is achieved by extensible
environment *connectors*. Connectors serve as gateways to external networks, or
bridges to connect to external systems.

Coaty comes with an essential set of database connectors to [store and retrieve
Coaty objects](#query-anywhere-retrieve-anywhere-persist-anywhere) in SQL and
noSQL database systems. Additional connectors are realized as extension packages
of the Coaty core framework. For example, an OPC UA connector seamlessly
connects Coaty applications with OPC UA servers.

### Set up your agent

To set up a Coaty agent, you define, configure, and bootstrap an IoC *container*
with its *controllers* that encapsulate the agent's application logic for
communication:

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
         // Common options shared by container components
         agentIdentity: { name: "My Coaty agent" },
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
* providing methods for local lifecycle management.

```ts
class SupportTaskController extends Controller {

    /* Lifecycle methods called by framework */

    onInit() {
        // Define application-specific initializations here.
    }

    onCommunicationManagerStarting() {
        // Set up observations for incoming communication events here.
    }

    onCommunicationManagerStopping() {
        // Define application-specific cleanup tasks here.
    }

    /* Business logic methods */
    ...
}
```

For communication, controllers utilize the *communication manager*, a component
that is an integral part of each IoC container. It provides a set of methods to
publish and observe communication events asynchronously.

You can use the communication manager without the need to understand and deal
with the complexities of the underlying publish-subscribe messaging protocol,
including auto-reconnect, automatic re-subscription upon connection, queued
offline publishing, message dispatching, and payload coding.

The communication manager also supports *distributed lifecycle management* of
Coaty agents in a decentralized application. A Coaty agent can keep track of
other agents or specific Coaty objects by observing agent identities or custom
object types which are advertised and made discoverable by joining agents, and
deadvertised by leaving agents. Tracking also handles late-joining agents, and
abnormal disconnection or termination of an agent, e.g. when its connection is
lost temporarily or when its process crashes or is killed.

<a name="reactive-programming-for-asynchronous-event-handling"></a>

### Reactive Programming for asynchronous event handling

Reactive Programming (RP) is a paradigm for asynchronous programming with
observable data streams. It is a combination of the best ideas from the Observer
software design pattern, the Iterator pattern, and functional programming.

Coaty adopts RP to handle incoming asynchronous communication events modular and
in context. You can process each event where needed according to the structure
of your overall business logic, rather than having to implement a (central)
event dispatching logic yourself.

RP also raises the level of abstraction of your code, so you can focus on the
interdependence of events rather than having to constantly cope with a large
amount of implementation details. Code in RP will be more concise and clear by
hiding asynchronous issues such as low-level threading, synchronization and
concurreny.

[Reactive Programming libraries](http://reactivex.io/) are ubiquitously
available for a variety of programming languages and platforms. Coaty
JavaScript, our reference framework implementation uses the
[RxJS](https://rxjs.dev/) library. You can also find examples and explanations
on the [Learn RxJS](https://www.learnrxjs.io/) website.

<a name="reactive-programming-examples"></a>
Using RxJS observables in a Coaty controller is as simple as that:

```ts
/* Observe all incoming Advertise events for Task objects with status 'Done' */

this.communicationManager
    .observeAdvertiseWithCoreType("Task")
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
    .publishDiscover(DiscoverEvent.withExternalId(machineId))
    .pipe(
        take(1),
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
    .publishDiscover(DiscoverEvent.withObjectTypes(["com.mycompany.myproject.SupportTask"]))
    .pipe(
        filter(event => event.eventData.object !== undefined),
        map(event => event.eventData.object as SupportTask)
    );

const advertisedTasks$ = this.communicationManager
    .observeAdvertiseWithObjectType("com.mycompany.myproject.SupportTask")
    .pipe(
        map(event => event.eventData.object as SupportTask)
        filter(task => task !== undefined)
    );

return merge(discoveredTasks$, advertisedTasks$)
            .subscribe(task => {
                // Handle both discovered and advertised tasks as they are emitted...
            });
```

<a name="typed-object-model"></a>

## Typed Object Model

You can model your domain data with Coaty's platform-agnostic typed object
model. It provides an opinionated set of core object types to be used or
extended by Coaty applications. These Coaty objects are the subject of
communication between Coaty agents.

```text
CoatyObject
  |
  |-- Annotation
  |-- Identity
  |-- IoContext
  |-- IoNode
  |-- IoSource
  |-- IoActor
  |-- Location
  |-- Log
  |-- Snapshot
  |-- Task
  |-- User
  |
  |-- Sensor
  |-- Thing
  |-- Observation
  |-- FeatureOfInterest
```

Coaty objects are [JSON](http://www.json.org) ([JavaScript Object
Notation](https://www.ietf.org/rfc/rfc4627.txt)) compatible to be easily
interoperable between languages and platforms. As such, Coaty objects solely
represent property - value pairs that model state but no behavior.

Besides core object types, the framework also defines object types to manage a
self-discovering network of sensors and to distribute sensor data. For this
purpose, Coaty leverages the [OGC SensorThings
API](https://coatyio.github.io/coaty-js/man/sensor-things-guide/).

The base `CoatyObject` interface defines the following generic properties:

```ts
interface CoatyObject {

  // Base core type
  coreType: "CoatyObject" | ... ;

  // Concrete type name
  objectType: string;

  // A descriptive name for the object
  name: string;

  // Unique identifier of the object
  objectId: Uuid;

  // Identifier of an object relative to an external system (optional)
  externalId?: string;

  // Object ID of parent object (optional)
  parentObjectId?: Uuid;

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

Coaty communication provides a [Query-Retrieve](#communication-event-patterns)
event pattern to seamlessly query distributed domain-specific data across
decentralized application components, and retrieve them from a single or
multiple storage systems, no matter if storage is persistent in a database or in
memory. Query-Retrieve enables declarative, seamless and transparent retrieval
of Coaty objects across Coaty agents independent of storage implementations. The
Query event’s object filter which specifies selection and ordering criteria can
be directly passed to Coaty's *Unified Storage API* for object retrieval.

Using the Unified Storage API, Coaty objects can be persisted schemalessly in
arbitary data sources. The database-agnostic API provides a common interface to
store and retrieve data from NoSQL and relational SQL data stores using the
notion of *adapters* to connect to specific databases.

The Coaty framework provides ready-to-use built-in adapters for NoSQL/SQL-based
storage in e.g. PostgreSQL and SQLite databases. In addition, it provides an
in-memory storage. You can also write your own custom adapter to connect to a
specific database not yet supported by the framework.

<a name="communication-foundation"></a>

## Communication foundation

Coaty reaches distributed system flexibility by decoupling communication
endpoints, but maintaining all types of communication flows.

![Communication foundation](/_assets/nutshell/communication-foundation.png)

Coaty uses event-based communication flows with one-way/two-way and
one-to-many/many-to-many event patterns to realize decentralized prosumer
scenarios. Thereby, Coaty combines the characteristics of both classic
request-response and publish-subscribe communication. In contrast to classic
client-server systems, all Coaty participants are equal in that they can act
both as producers/requesters and consumers/responders.

One of the unique features of Coaty communication is the fact that a single
request in principle can yield multiple responses over time, *even* from the
same responder. The use case specific logic implemented by the requester
determines how to handle such responses. For example, the requester can decide
to

* just take the first response and ignore all others,
* only take responses received within a given time interval,
* only take responses until a specific condition is met,
* handle any response over time, or
* process responses as defined by any other application-specific logic.

Using this "open channel" communication, you can realize advanced interaction
scenarios beyond classic request-response in a very simple way. For example, by
introducing *live queries*, a Query event responder could monitor the database
for changes and publish a Retrieve event with the latest query result every time
the concerned data is updated. In this way, inefficient manual database polling
is replaced by an efficient automatic push-based approach that helps your
application feel quick and responsive.

To give you another example, it may be desirable for some remote operation calls
to have a progressive series of call results, e.g. to return partial data in
chunks or progress status of long running operations, even simultaneously by
different callees.

<a name="communication-event-patterns"></a>

### Communication event patterns

Coaty provides a set of event-based communication patterns to discover, query,
share, and update data on demand in a distributed system, and to request
execution of context-filtered remote operations.

![Communication event patterns](/_assets/nutshell/communication-event-patterns.png)

Coaty's standardized [communication event
patterns](https://coatyio.github.io/coaty-js/man/communication-events/) are
build on top of interchangeable open-standard publish-subscribe (pub/sub)
messaging protocols which are either broker-based, such as
[MQTT](http://mqtt.org/) or [WAMP](https://wamp-proto.org/), or brokerless like
[DDS](https://www.dds-foundation.org/) or peer-to-peer approaches. Providing
*communication bindings*, you can choose a specific messaging transport for your
Coaty application while keeping the set of communication event patterns and your
application code completely unaffected. By choosing a WebSocket-aware
communication binding, Coaty agents can also natively run in mobile and web
browsers.

With the help of Reactive Programming, all Coaty event patterns are programmed
in a simple, uniform way. You can find some examples in the section on [Reactive
Programming](#reactive-programming-examples). For details and advanced use
cases, take a look at the [Coaty JS Developer
Guide](https://coatyio.github.io/coaty-js/man/developer-guide/#communication-event-patterns).

<a name="smart-routing-of-iot-data"></a>

## Smart routing of IoT data

Coaty provides what we call *Smart Routing* of IoT (sensor) data, or also called
IO Routing, where data is dynamically routed from sources to actors, i.e.
consumers based on context. Backpressure strategies that enable data transfer
rate controlled publishing of data are negotiated between sources and actors.

Smart routing ensures that IoT data events published by sources are dispatched
only to the currently relevant actors, depending on application-specific context
logic which can be defined by a set of rules. Coaty's rule engine evaluates
these rules and updates associations between sources and actors accordingly.

For details, take a look at the [Coaty JS Developer Guide](https://coatyio.github.io/coaty-js/man/developer-guide/#io-routing).

<a name="works-across-languages-and-platforms"></a>

## Works across languages and platforms

Coaty is designed with interoperability in mind. It can be easily ported to a
variety of programming languages and platforms because of its layered and
modular architecture and its lightweight technology stack:

* a library for Reactive Programming, such as the Rx* library family,
* a pub/sub messaging client, such as an MQTT or WAMP library,
  with a JSON serializer.

[Coaty JS](https://github.com/coatyio/coaty-js) is the *reference
implementation* of the Coaty framework. It works across platforms and is
targeted at JavaScript/TypeScript, running as mobile and web apps in the browser,
or as Node.js services. Coaty JS provides a complete set of features as described
in the [Developer Guide](https://coatyio.github.io/coaty-js/man/developer-guide/).

[Coaty Swift](https://github.com/coatyio/coaty-swift) is a subset implementation
of the Coaty framework for the [Swift](https://www.apple.com/swift/) programming
language targeted at iOS, iPadOS, and macOS applications.

Coaty JS should be used as reference for porting Coaty to new programming
languages and platforms. We intend to make additional framework implementations
available as open source.

## Getting started

Get started with Coaty by using its best practice code examples as application
skeleton. In addition, Coaty comes with all you need to know: a developer guide,
coding style guide, and complete framework API documentation.

Details can be found on the [Documentation](/docs) page.
