park_controller = require('../park_controller');
const $db = require("../../models");
const $parks = $db.park;

describe("Park Controller Tests", () => {
    let mock;
    let result;
    beforeEach(() => {
        mock = jest.spyOn($parks, 'findAll');
        result = [{"id":6,"parkName":"Bemmel2","timezone":"Europe/London","energyType":"Solar"}];
    })

    test("Get Park Details by park id returns 200 on success", async () => {
            mock.mockImplementation(() => {
                return new Promise(resolve => {
                    resolve(result);
                })
            })
            const req = { "query": {"energyType": "Solar"}};
            let res =  {
                send: function(){},
                status: function(s) {this.statusCode = s; return this;}
            };
            const next = jest.fn();
            const results = await park_controller.getParkDetailsById(req, res, next);
            expect(res.statusCode).toEqual(200);
            mock.mockRestore();
    })

    test("Get park Details by park id return 404 if no record found", async () => {
        mock.mockImplementation(() => {
            return new Promise(resolve => {
                resolve([]);
            })
        })
        const req = { "query": {"energyType": "Solar"}};
        let res =  {
            send: function(){},
            status: function(s) {this.statusCode = s; return this;}
        };
        const next = jest.fn();
        const results = await park_controller.getParkDetailsById(req, res, next);
        expect(res.statusCode).toEqual(404);
        mock.mockRestore();
    })

    test("Get park Details BY Query Params give 200 on success", async () => {
        mock.mockImplementation(() => {
            return new Promise(resolve => {
                resolve(result);
            })
        })
        const req = { "query": {"energyType": "Solar"}};
        let res =  {
            send: function(){},
            status: function(s) {this.statusCode = s; return this;}
        };
        const next = jest.fn();
        const results = await park_controller.getParkDetailsByQueryParams(req, res, next);
        expect(res.statusCode).toEqual(200);
        mock.mockRestore();
})

test("Get Energy Details BY Query Params returns 404 if no record found", async () => {
    mock = jest.spyOn($parks, 'findAndCountAll');
    mock.mockImplementation(() => {
        return new Promise(resolve => {
            resolve([]);
        })
    })
    const req = { "query": {"energyType": "Solar"}};
    let res =  {
        send: function(){},
        status: function(s) {this.statusCode = s; return this;}
    };
    const next = jest.fn();
    const results = await park_controller.getParkDetailsByQueryParams(req, res, next);
    expect(res.statusCode).toEqual(404);
    mock.mockRestore();
})
})