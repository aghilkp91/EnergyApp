# EnergyApp

### **EnergyApp Highlights**
* The data given in csv is stored in DB so as to make the service production ready and to make it available and scale easier. Updates to data are easily handled since we have a single source of data
* Used bulk create/update where ever possible so that the DB calls are optimized
* New data update can be performed by uploading the csv file to /energies endpoint. This file can be saved to s3 while deploying in AWS.
* All dates are converted to UTC for making search by dates easier
* Authentication passwords are encrypted and saved in DB. Authorization tokens are used for enhanced security of the service and need to be included in every API service request.

### **EnergyApp architecture**

* AWS RDS - To store the users, parks and energies table values
* AWS S3 - To upload energy input files from parks and load it to DB. (Currently done through a post request. Can trigger an AWS lambda call to seed the db on file upload as well).
* ECS Fargate cluster to create containers to run nodejs services with autoscaling
* AWS ECR Repository to upload the nodejs service docker images
* Application load-balancer to divide the incoming client calls across multiple services running inside the ECS cluster.
* AWS API Gateway to expose API endpoints to clients. Currently, the authentication and authorization is handled in the service. We can move it to different service and reduce the load on the EnergyApp service
* Amazon Route 53 to get a domain name(like app.ptcenergy.com)
* AWS CloudFormation will be integrated with the CICD tool to automate the service deployment to cloud

EnergyApp High Level Architecture: ![image](https://drive.google.com/uc?export=view&id=1wFznP5SKDhwECNAiu-ecLac852pbBBmr "EnergyApp High Level Architecture")

### **EnergyApp Cost estimation**
**This is an approximate cost estimation. We can get a better cost estimation only after load testing the application**
| Service | 100,000,000 request/month | 1,000,000,000 request/month
|---|---|---|
| AWS API Gateway | $300 | $3,033 |
| AWS Fargate | 4 * (2 core 8gb) - $135 | 8 * (4 core 16gb) - $520 |
| AWS S3 | 100 GB - $7.97 | 1000 GB - $30 |
| RDS MySQL | 30GB - $517 | 30GB - $517 | 30GB Main and 2 ReadReplicas - $1027 |
| AWS ECR | 10GB - $1 | 10GB - $1 |
| AWS ELB | $17 | $55 |
| Route 53 | $50 | $50 |
| CloudFormation | $2.54 | $2.54 |

There is an option of using lambda instead of Fargate for service endpoints. But the cost would increase as follows when we have more api calls per month
| Service | 100,000,000 request/month | 1,000,000,000 request/month
|---|---|---|
| AWS Fargate | 30ms/req and 1024 mb ram - $83 | 30ms/req and 1024 mb ram - $694 |

### **EnergyApp Rest CRUD API overview**

The following REST API is used to create, retrieve, update, delete and find park and energy related to EnergyApp.

The following table shows overview of the Rest APIs that will be exported

Run the below from [postman](https://www.postman.com/downloads/) by using [![Run in Postman](https://run.pstmn.io/button.svg)](https://www.getpostman.com/collections/6a7e0e2476eb77912d85)

You will get an `AuthToken` when you login. Use the token in header of api call as {Authorization: AuthToken} for authorization.

| Methods | Urls | Actions | body |
|---|---|---|---|
| POST | /signup | Signup a new user | { user_id: "test_user1", password: "test_pass1", age: 20, gender: "Male", country: "Netherlands" } |
| POST | /login | Login using username and password | { user_id: "test_user1", password: "test_pass1" } |
| GET | /users/id/{user_id} | Get the user details | |
| PUT | /users/id/{user_id} | Update user details by `id` | {password: "new_password"}|
| GET | /users/| Get all user details | |
| DELETE | /users/id/{user_id} | Delete the user by user_id| |
|---|---|---|---|
| POST | /parks | Create a new Park | { parkName: "park1", timezone: "Europe/Amsterdam", energyType: ["Solar"|"Wind"] } |
| PUT | /parks | Update Park details | { parkName: "park1", timezone: "Europe/Amsterdam", energyType: ["Solar"|"Wind"] } |
| GET | /parks/id/:id | Get the park details by id | |
| GET | /parks?energyType="Solar"&timezone="Europe/Amsterdam" | Get Park details by energy type or timezone | |
| DELETE | /parks/id/:id | Delete a Park by id |
|---|---|---|---|
| GET | /energies | Get Energy Details on different parameters | Parameters supported : energyType, timezone, parkName, startTime(In UTC), endTime(In UTC), offset, limit |
| POST | /energies/file_upload | Upload file containing energy data to add it to db | {input: <filename>} |

### **EnergyApp Improvements**
* Currently the file upload is done to local folder(tmp). This need to moved to AWS S3 after creating a S3 bucket.
* Create more unit and integration test cases. 
* Create the AWS resouces mentioned above and then create the CloudFormation script to automate the deployment
* Set up monitoring and alerting in AWS so as to understand the deployed service in more detail and get alerted in case of any issues.
* Move the Authentication and Authorization to different microservice service. The number of requests will be less and we can scale that service accrodingly
* Create different accessMode in users so as to restrict/grant access to different services for different users/companies
* Move the db secrets from config file to AWS Secret Manager
