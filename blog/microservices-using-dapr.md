---
slug: 
title: 
author: B. Balaji
author_url: https://github.com/balaji-balu
author_image_url: https://avatars.githubusercontent.com/u/22535075?v=4
tags: []
---

executive summary goes here

<!--truncate-->

**convert this into picture**
--post messages-----> node app --> dapr ---> mongo

### Test your app with Dapr installed locally 

#### Install Docker 

#### Install Dapr CLI

verify the installation
```
dapr --version
```

#### Start Dapr locally

``` 
dapr init  
```



### install your app dependencies

install and attach your application dependencies like databases, messaging(ex: kafka), 3rd party apis(twitter, sendgrid etc) as components 

create a yaml file for each dependency 

refer [managing dapr components](https://docs.dapr.io/operations/components/)
for writing your dapr component file

```yaml title="<home dir>/.dapr/components/mongo.yaml"

apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: mongostatestore
spec:
  type: state.mongodb
  metadata:
  - name: host
    value: localhost:27017
```

place the components the home directory:

on windows : `%USERPROFILE%`

on linux : `/home/<user>`

verify your components are available

```
dapr dashboard
```

### Run the node.js app with dapr
```
dapr run --app-id nodeapp --app-port 3000 --dapr-http-port 3500 node app.js
```

run via nodeman 
``` 
nodemon --exec  dapr run --app-id nodeapp --app-port 3000 --dapr-http-port 3500 node app.js
```

### Post a message to node app using postman

```
POST http://localhost:3500/v1.0/invoke/nodeapp/method/neworder
{
  "data": {
    "orderId": "42"
  } 
}
```

### Add a store component 

```
// Dapr
const daprPort = process.env.DAPR_HTTP_PORT || "3500";

// The Dapr endpoint for the state store component to store the tweets.
const stateEndpoint = `http://localhost:${daprPort}/v1.0/state/mongostatestore`;

app.post('/neworder', bodyParser.json(), (req, res) => {
    const orderData = req.body.data || {};
    const orderId = orderData.orderId;
    console.log(`Got a new order! Order ID: order ${orderId}` );

    const state = [{
      key: `order${orderId}`, 
      value: orderData,
    }]

    fetch(`${stateEndpoint}`, {
      method: "POST",
      body: JSON.stringify(state),
      headers: {
        "Content-Type": "application/json"
      }
    }).then((response) => {
        if (!response.ok) {
            throw "Failed to persist state.", response.status, response.statusText;
        }

        console.log("Successfully persisted state.");
        res.status(200).send("Got a new order! Order ID: " + orderId);
    }).catch((error) => {
        console.log(error);
        res.status(500).send({message: error});
    });
   
});
```

![](/img/post-data.png)

```json
_id   : "nodeapp||order"
value : "{"orderId":"48"}"
_etag : "ef284562-857a-4ccc-b085-159dba5f9c5f"

_id   : "nodeapp||order[object Object]"
value : "{"orderId":"50","items":[{"id":1,"qty":100}]}"
_etag : "01830558-ae6e-45f2-a20a-715dc391512a"

_id   : "nodeapp||order51"
value : "{"orderId":"51","items":[{"id":1,"qty":100}]}"
_etag : "bb0128d2-5a99-4df1-981b-a11c61983d45"

_id   : "nodeapp||order551"
value : "{"items":[{"id":1,"qty":100}],"orderId":"551"}"
_etag : "41210ef5-1f3e-48bc-9c59-aa05e47dc7c6"
```


```
app.get('/order', (_req, res) => {
  fetch(`${stateEndpoint}/order551`)
      .then((response) => {
          if (!response.ok) {
              throw "Could not get state.";
          }

          return response.text();
      }).then((orders) => {
          res.send(orders);
      }).catch((error) => {
          console.log(error);
          res.status(500).send({message: error});
      });
});
```
![](/img/get-data.png)

## Test your app with Dapr installed on a kubernetes cluster 

### Install Kubernetes 

#### Locally
docker-destop, minikube, kind 

#### Remotely
aks, eks, gks

verify the remote cluster is running 
if case of any errors, verify the cluster is started 
```
kubectl config current-context
kubectl get pods 
```

install dapr on your local or remote cluster 


### Start Dapr on kubernetes 
verify dapr is running already :
```
dapr status-k
```

if it is installed uninstall before installing it 

```
dapr uninstall -k
```

Install the Dapr on kubernetes
```
dapr init -k
```
or using helm
```
helm repo add dapr https://dapr.github.io/helm-charts/
helm repo update
helm search repo dapr --devel --versions
```

```
helm upgrade --install dapr dapr/dapr --version=1.1.2 --namespace dapr-system  --create-namespace --wait
```

Verify installation
```
kubectl get pods --namespace dapr-system
```

Refer [Deploy Dapr on kubernetes](https://docs.dapr.io/operations/hosting/kubernetes/kubernetes-deploy/)

### Install mongodb on kubernetes 

The easiest way to install MongoDB on Kubernetes is by using the Helm chart:

```
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install my-release bitnami/mongodb
```

This will install MongoDB into the default namespace. To interact with MongoDB, find the service with: `kubectl get svc my-release-mongodb`.

For example, if installing using the example above, the MongoDB host address would be:

`kubectl get svc my-release-mongodb.default.svc.cluster.local:27017`

Follow the on-screen instructions to get the root password for MongoDB. The username will be `admin` by default.

Refer [Setup Mongodb State store on kubernetes](https://github.com/RicardoNiepel/dapr-docs/blob/master/howto/setup-state-store/setup-mongodb.md)


`export MONGODB_ROOT_PASSWORD=$(kubectl get secret --namespace default my-release-mongodb -o jsonpath="{.data.mongodb-root-password}" | base64 --decode)`

To connect to your database, create a MongoDB(R) client container:

   ` kubectl run --namespace default my-release-mongodb-client --rm --tty -i --restart='Never' --env="MONGODB_ROOT_PASSWORD=$MONGODB_ROOT_PASSWORD" --image docker.io/bitnami/mongodb:4.4.5-debian-10-r0 --command -- bash`

Then, run the following command:
    `mongo admin --host "my-release-mongodb" --authenticationDatabase admin -u root -p $MONGODB_ROOT_PASSWORD`

To connect to your database from outside the cluster execute the following commands:

    `kubectl port-forward --namespace default svc/my-release-mongodb 27017:27017 &
    mongo --host 127.0.0.1 --authenticationDatabase admin -p $MONGODB_ROOT_PASSWORD`

```yaml title=nodeapp.yaml
kind: Service
apiVersion: v1
metadata:
  name: nodeapp
  labels:
    app: node
spec:
  selector:
    app: node
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nodeapp
  labels:
    app: node
spec:
  replicas: 1
  selector:
    matchLabels:
      app: node
  template:
    metadata:
      labels:
        app: node
      annotations:
        dapr.io/enabled: "true"
        dapr.io/app-id: "nodeapp"
        dapr.io/app-port: "3000"
    spec:
      containers:
      - name: node
        image: dapriosamples/hello-k8s-node:latest
        ports:
        - containerPort: 3000
        imagePullPolicy: Always
```

Install the nodeapp on kuberenetes
`kubectl apply -f nodeapp.yaml`




