energy_controller =  require('../energy_controller');
const $db = require("../../models");
const $energies = $db.energy;

describe("Energy Controller Tests", () => {
    let mock;
    let result;
    beforeEach(() => {
        mock = jest.spyOn($energies, 'findAndCountAll');
        result = {"count":9,"rows":[
            {"id":194385,"energyTime":"2020-06-30 20:30:00","energyTimeUTC":"2020-06-30T19:30:00.000Z","energyInMW":2.456,"parkId":6,
            "park":{"id":6,"parkName":"Bemmel2","timezone":"Europe/London","energyType":"Solar"}}]
        };
    })

    test("Get Energy Details BY Query Params calls next after successsful call", async () => {
            mock.mockImplementation(() => {
                return new Promise(resolve => {
                    resolve(result);
                })
            })
            const req = { "query": {"energyType": "Solar"}};
            let res = {};
            const next = jest.fn();
            const results = await energy_controller.getEnergyDetailsByQueryParams(req, res, next);
            expect(next).toHaveBeenCalled();
            mock.mockRestore();
    })

    test("Get Energy Details BY Query Params give back 200 for success", async () => {
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
        const results = await energy_controller.getEnergyDetailsByQueryParams(req, res, next);
        expect(res.statusCode).toEqual(200);
        mock.mockRestore();
    })

    test("Get Energy Details BY Query Params give back 404 for failure", async () => {
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
        const results = await energy_controller.getEnergyDetailsByQueryParams(req, res, next);
        expect(res.statusCode).toEqual(404);
        mock.mockRestore();
    })
})