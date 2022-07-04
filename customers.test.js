// Describe: Scenario Name, CallBack Function
// Annotation (before, after, beforeEach, afterEach)
// IT: Test Case (Test Case Title, Excution CallBack Function)
// it.skip (skips the test case); it.only (runs only that test case)
// Async is used to make web service calls. 
// Axios: Packaged name for calling Api
// package.json -> scripts {Testing Server: (test); Staging Server: (start); Custom Commend (npm run fileName)}

const axios = require('axios');
const { expect } = require('chai');
const envVariables = require('./env.json');
const fs = require('fs');
const faker = require('faker');

describe("Customer API Testing", async () => {
    it("Get Users", async () => {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users', {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        // console.log(response.data);
        expect(response.status).equals(200);
        expect(response.data[0].id).equals(1);
    })
    it("User Login", async () => {
        const response = await axios.post(`${envVariables.baseUrl}/customer/api/v1/login`,
            // API BODY
            {
                "username": "salman",
                "password": "salman1234"
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
            // Filter (response = res.data)
        ).then(function (res) { return res.data })
        console.log(response);

        envVariables.token = response.token;
        fs.writeFileSync('./env.json', JSON.stringify(envVariables));
    })
    it("Customer List", async () => {
        const response = await axios.get(`${envVariables.baseUrl}/customer/api/v1/list`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': envVariables.token
                }
            }
        ).then(res => res.data)
        console.log(response);
    })
    it("Get Customer Info", async () => {
        const response = await axios.get(`${envVariables.baseUrl}/customer/api/v1/get/101`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': envVariables.token
                }
            }
        ).then(res => res.data)
        console.log(response);
        expect(response.id).equals(101)
    })
    it("Signup User", async () => {
        const response = await axios.post(`${envVariables.baseUrl}/customer/api/v1/create`,
            {
                "id": Math.floor((Math.random() * (9999 - 1111)) + 1),
                "name": faker.name.firstName(),
                "email": faker.internet.email(),
                "address": faker.address.streetAddress(),
                "phone_number": faker.phone.phoneNumber()
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': envVariables.token
                }
            }
        ).then(res => res.data)
        console.log(response);
        expect(response.message).contains("Success");

        envVariables.id = response.Customers.id;
        envVariables.name = response.Customers.name;
        envVariables.email = response.Customers.email;
        envVariables.address = response.Customers.address;
        envVariables.phone_number = response.Customers.phone_number;
        fs.writeFileSync('./env.json', JSON.stringify(envVariables));
    })
    it("Update Customer", async () => {
        const response = await axios.put(`${envVariables.baseUrl}/customer/api/v1/update/${envVariables.id}`,
            {
                "id": envVariables.id,
                "name": envVariables.name,
                "email": envVariables.email,
                "address": "Dhaka,Bangladesh",
                "phone_number": "01706994692"
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': envVariables.token
                }
            }
        ).then(res => res.data)
        console.log(response);
        expect(response.message).contains("Success");
    })
    it("Delete Customer", async () => {
        const response = await axios.delete(`${envVariables.baseUrl}/customer/api/v1/delete/${envVariables.id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': envVariables.token
                }
            }
        ).then(res => res.data)
        console.log(response);
        expect(response.message).contains("Customer deleted!");
    })
})