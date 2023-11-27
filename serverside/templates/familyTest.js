module.exports = (data) => String.raw `familyTest.js
import { test, expect } from '@erp-auto/playwright-global';
import {
    printAPIResponseToLog,
    get${data.familyName}DataForRegulatoryTable,
    getSectionsFromRecord,
    get${data.familyName}DataForSchema
} from '@/common/common.util';
import { faker } from '@faker-js/faker';
import * as dataset from '@/data/api-testdata.json';

// Request context is reused by all tests in the file.
let apiContext;

test.beforeAll(async ({ playwright }) => {

    apiContext = await playwright.request.newContext({

        baseURL: \`\${process.env.BASE_URL}\`
    });
});

test.beforeEach(async () => {
    // database = new Database();
});

test.afterAll(async () => {
    //console.log('After All');
});

//Test Suite for Families APIs
test.describe('Families', () => {

    //Test Suite for ${data.familyName} APIs
    test.describe('${data.familyName}', () => {

        /**
         * GRF-314 - - Get details of one ${data.familyName} using 'Fetch One ${data.familyName}' api
         * Test # 740646 - Get details of one ${data.familyName} using 'Fetch One ${data.familyName}' api
         * 
         * Test Data : api-testdata.json
         * 
         * @author : swetaS
         */
        test('FetchOne Happy Path  ##740646## @API @${data.familyName} @SMOKE @REGRESSION', async ({ global }) => {

            const recordId = dataset.fetchOne${data.familyName};
            //Sending the request to server
            const response = (await apiContext.get(\`/${data.familyName}/\${recordId}\`));

            //Validating the response status code
            await global.apiUtil.verifyStatusCode(response, '200');

            //Converting response to JSON and print to logs
            const resBody = await response.json();
            printAPIResponseToLog(response, resBody);
        });

        /**
         * GRF-314 - - Get details of one ${data.familyName} using 'Fetch One ${data.familyName}' api
         * Test # 740865 - Get details of one ${data.familyName} using 'Fetch One ${data.familyName}' api
         * 
         * Test Data : api-testdata.json
         * 
         * @author : swetaS
         */
        test('FetchOne with no Regulatory data ##740865## @API @${data.familyName} @SMOKE @REGRESSION', async ({ global }) => {

            const recordId = "5dbd8723-d5a6-48e2-b141-0ed66ce020e3";

            const response = (await apiContext.get(\`/${data.familyName}/\${recordId}\`));

            await global.apiUtil.verifyStatusCode(response, '200');
            const resBody = await response.json();
            printAPIResponseToLog(response, resBody);
        });

        /**
         * GRF-316 - 'Fetch One ${data.familyName}' api not finding any matching record
         * Test # 740739 - 'Fetch One ${data.familyName}' api not finding any matching record
         * 
         * Test Data : api-testdata.json
         * 
         * @author : swetaS
         */
        test('FetchOne No Data found##740739## @API @${data.familyName}', async ({ global }) => {
            const recordId = faker.string.uuid();
            const response = (await apiContext.get(\`/${data.familyName}/\${recordId}\`));
            await global.apiUtil.verifyStatusCode(response, '500');
            const resBody = await response.json();

            printAPIResponseToLog(response, resBody);

            expect(resBody.message).toBe(\`Internal server error: Error: Record with regulatory_record_id "\${recordId}" not found.\`);
        });

        test('Insert One ${data.familyName} with no metadata all fields filled##740750## @API @${data.familyName}', async ({ global }) => {
            //Generating payload for the API
            get${data.familyName}DataForRegulatoryTable(1, 'json');
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const data = require('../data/generatedData/${data.familyName}ErpData.json');

            const testdata = data.${data.familyName}Records[0];
            const regData = get${data.familyName}DataForSchema('${data.familyName}', testdata.erp_${data.familyName}_id, testdata.erp_${data.familyName}_desc);

            const payload = {};
            payload["grcData"] = getSectionsFromRecord('grcData', testdata, '${data.familyName}');
            payload["erpData"] = getSectionsFromRecord('erpData', testdata, '${data.familyName}');
            payload[regData[0]] = regData[1];
            console.log(JSON.stringify(payload));

            //Sending Request to the server
            const response = (await apiContext.post('/${data.familyName}/create', { data: JSON.stringify(payload) }));
            const resBody = await response.json();

            printAPIResponseToLog(response, resBody);

            //Validating the record created in database
            await global.apiUtil.verifyStatusCode(response, '200');
            expect(resBody.message).toBe("${data.familyName} record inserted successfully");
        });

        test('Insert One ${data.familyName} with no metadata and no ${data.schemaSectionName} section##740750## @API @${data.familyName}', async ({ global }) => {
            //Generating payload for the API
            get${data.familyName}DataForRegulatoryTable(1, 'json');
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const data = require('../data/generatedData/${data.familyName}ErpData.json');

            const testdata = data.${data.familyName}Records[0];
            const payload = {};
            payload["grcData"] = getSectionsFromRecord('grcData', testdata, '${data.familyName}');
            payload["erpData"] = getSectionsFromRecord('erpData', testdata, '${data.familyName}');
            console.log(JSON.stringify(payload));

            //Sending Request to the server
            const response = (await apiContext.post(\`/${data.familyName}/create\`, { data: JSON.stringify(payload) }));
            const resBody = await response.json();

            printAPIResponseToLog(response, resBody);

            //Validating the record created in database
            await global.apiUtil.verifyStatusCode(response, '200');
            expect(resBody.message).toBe("${data.familyName} record inserted successfully");
        });

        test('Insert One ${data.familyName} with no metadata and only required field for erpData section filled##740750## @API @${data.familyName}', async ({ global }) => {
            //Generating payload for the API
            get${data.familyName}DataForRegulatoryTable(1, 'json');
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const data = require('../data/generatedData/${data.familyName}ErpData.json');

            const testdata = data.${data.familyName}Records[0];
            const regData = get${data.familyName}DataForSchema('${data.familyName}', testdata.erp_${data.familyName}_id, testdata.erp_${data.familyName}_desc);

            const payload = {};
            payload["grcData"] = getSectionsFromRecord('grcData', testdata, '${data.familyName}');
            payload["erpData"] = { "erp_${data.familyName}_id": \`\${testdata.erp_${data.familyName}_id}\` };
            payload[regData[0]] = regData[1];
            console.log(JSON.stringify(payload));

            //Sending Request to the server
            const response = (await apiContext.post('/${data.familyName}/create', { data: JSON.stringify(payload) }));
            const resBody = await response.json();

            printAPIResponseToLog(response, resBody);

            //Validating the record created in database
            await global.apiUtil.verifyStatusCode(response, '200');
            expect(resBody.message).toBe("${data.familyName} record inserted successfully");
        });

        test('Insert One ${data.familyName} with no metadata no grcData section filled##740750## @API @${data.familyName}', async ({ global }) => {
            //Generating payload for the API
            get${data.familyName}DataForRegulatoryTable(1, 'json');
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const data = require('../data/generatedData/${data.familyName}ErpData.json');

            const testdata = data.${data.familyName}Records[0];
            const regData = get${data.familyName}DataForSchema('${data.familyName}', testdata.erp_${data.familyName}_id, testdata.erp_${data.familyName}_desc);

            const payload = {};
            payload["erpData"] = getSectionsFromRecord('erpData', testdata, '${data.familyName}');
            payload[regData[0]] = regData[1];
            console.log(JSON.stringify(payload));

            //Sending Request to the server
            const response = (await apiContext.post('/${data.familyName}/create', { data: JSON.stringify(payload) }));
            const resBody = await response.json();

            printAPIResponseToLog(response, resBody);

            //Validating the record created in database
            await global.apiUtil.verifyStatusCode(response, '400');
            expect(resBody.message).toBe("Missing required fields in the request body");
        });

        test('Insert One ${data.familyName} with no metadata no erpData section filled##740750## @API @${data.familyName}', async ({ global }) => {
            //Generating payload for the API
            get${data.familyName}DataForRegulatoryTable(1, 'json');
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const data = require('../data/generatedData/${data.familyName}ErpData.json');

            const testdata = data.${data.familyName}Records[0];
            const regData = get${data.familyName}DataForSchema('${data.familyName}', testdata.erp_${data.familyName}_id, testdata.erp_${data.familyName}_desc);

            const payload = {};
            payload["grcData"] = getSectionsFromRecord('grcData', testdata, '${data.familyName}');
            payload[regData[0]] = regData[1];
            console.log(JSON.stringify(payload));

            //Sending Request to the server
            const response = (await apiContext.post('/${data.familyName}/create', { data: JSON.stringify(payload) }));
            const resBody = await response.json();

            printAPIResponseToLog(response, resBody);

            //Validating the record created in database
            await global.apiUtil.verifyStatusCode(response, '400');
            expect(resBody.message).toBe("Missing required fields in the request body");
        });

        test('Insert One ${data.familyName} with no metadata wrong field in grcData filled##740750## @API @${data.familyName}', async ({ global }) => {
            //Generating payload for the API
            get${data.familyName}DataForRegulatoryTable(1, 'json');
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const data = require('../data/generatedData/${data.familyName}ErpData.json');

            const testdata = data.${data.familyName}Records[0];
            const regData = get${data.familyName}DataForSchema('${data.familyName}', testdata.erp_${data.familyName}_id, testdata.erp_${data.familyName}_desc);

            const payload = {};
            const wrongFieldGrcData = getSectionsFromRecord('grcData', testdata, '${data.familyName}');
            wrongFieldGrcData['erpType'] = wrongFieldGrcData['erp_type'];
            delete wrongFieldGrcData['erp_type'];
            payload["grcData"] = wrongFieldGrcData;
            payload[regData[0]] = regData[1];
            console.log(JSON.stringify(payload));

            //Sending Request to the server
            const response = (await apiContext.post('/${data.familyName}/create', { data: JSON.stringify(payload) }));
            const resBody = await response.json();

            printAPIResponseToLog(response, resBody);

            //Validating the record created in database
            await global.apiUtil.verifyStatusCode(response, '400');
            expect(resBody.message).toBe("Missing required fields in the request body");
        });

        test('Insert One ${data.familyName} with no metadata wrong field in erpData ##740750## @API @${data.familyName}', async ({ global }) => {
            //Generating payload for the API
            get${data.familyName}DataForRegulatoryTable(1, 'json');
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const data = require('../data/generatedData/${data.familyName}ErpData.json');

            const testdata = data.${data.familyName}Records[0];
            const regData = get${data.familyName}DataForSchema('${data.familyName}', testdata.erp_${data.familyName}_id, testdata.erp_${data.familyName}_desc);

            const payload = {};
            const wrongFieldErpData = getSectionsFromRecord('erpData', testdata, '${data.familyName}');
            wrongFieldErpData['year'] = wrongFieldErpData['erp_academic_year'];
            wrongFieldErpData['${data.familyName}_desc'] = wrongFieldErpData['erp_${data.familyName}_desc'];
            delete wrongFieldErpData['erp_academic_year'];
            delete wrongFieldErpData['erp_${data.familyName}_desc'];
            payload["grcData"] = getSectionsFromRecord('grcData', testdata, '${data.familyName}');
            payload["erpData"] = wrongFieldErpData;
            payload[regData[0]] = regData[1];
            console.log(JSON.stringify(payload));

            //Sending Request to the server
            const response = (await apiContext.post('/${data.familyName}/create', { data: JSON.stringify(payload) }));
            const resBody = await response.json();

            printAPIResponseToLog(response, resBody);

            //Validating the record created in database
            await global.apiUtil.verifyStatusCode(response, '500');
            expect(resBody.message).toBe('Internal server error: column "year" of relation "regulatory_${data.familyName}" does not exist');
        });

        test('Insert One ${data.familyName} with no metadata with duplicate record with all fields ##740750## @API @${data.familyName}', async ({ global }) => {
            //Generating payload for the API
            get${data.familyName}DataForRegulatoryTable(1, 'json');
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const data = require('../data/generatedData/${data.familyName}ErpData.json');

            const testdata = data.${data.familyName}Records[0];
            const regData = get${data.familyName}DataForSchema('${data.familyName}', testdata.erp_${data.familyName}_id, testdata.erp_${data.familyName}_desc);

            const payload = {};
            const erpData = getSectionsFromRecord('erpData', testdata, '${data.familyName}');

            payload["grcData"] = getSectionsFromRecord('grcData', testdata, '${data.familyName}');
            payload["erpData"] = erpData;
            payload[regData[0]] = regData[1];
            console.log(JSON.stringify(payload));

            //Sending Request to the server
            let response = (await apiContext.post('/${data.familyName}/create', { data: JSON.stringify(payload) }));
            let resBody = await response.json();

            await global.apiUtil.verifyStatusCode(response, '200');

            //Sending Request to the server
            response = (await apiContext.post('/${data.familyName}/create', { data: JSON.stringify(payload) }));
            resBody = await response.json();

            printAPIResponseToLog(response, resBody);

            //Validating the record created in database
            await global.apiUtil.verifyStatusCode(response, '500');
            expect(resBody.message).toBe('Internal server error: duplicate key value violates unique constraint "rc_comp_unique"');

            console.log("******* Test with chenged ${data.familyName} ID ********** ");

            erpData['erp_${data.familyName}_id'] = erpData['erp_${data.familyName}_id'].replace(/[0-9]/gm, faker.number.int({ min: 100000, max: 999999 }));
            payload["erpData"] = erpData;
            console.log(JSON.stringify(payload));

            //Sending Request to the server
            response = (await apiContext.post('/${data.familyName}/create', { data: JSON.stringify(payload) }));
            resBody = await response.json();

            printAPIResponseToLog(response, resBody);

            //Validating the record created in database
            await global.apiUtil.verifyStatusCode(response, '200');
            expect(resBody.message).toBe('${data.familyName} record inserted successfully');
        });

        test('Insert One ${data.familyName} with metadata all fields filled##740750## @API @${data.familyName}', async ({ global }) => {
            //Generating payload for the API
            get${data.familyName}DataForRegulatoryTable(1, 'json');
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const data = require('../data/generatedData/${data.familyName}ErpData.json');

            const testdata = data.${data.familyName}Records[0];
            const regData = get${data.familyName}DataForSchema('${data.familyName}', testdata.erp_${data.familyName}_id, testdata.erp_${data.familyName}_desc);

            const payload = {};
            payload["grcData"] = getSectionsFromRecord('grcData', testdata, '${data.familyName}');
            payload["erpData"] = getSectionsFromRecord('erpData', testdata, '${data.familyName}');
            payload["metadata"] = getSectionsFromRecord('metadata', testdata, '${data.familyName}');
            payload[regData[0]] = regData[1];
            console.log(JSON.stringify(payload));

            //Sending Request to the server
            const response = (await apiContext.post('/${data.familyName}/create', { data: JSON.stringify(payload) }));
            const resBody = await response.json();

            printAPIResponseToLog(response, resBody);

            //Validating the record created in database
            await global.apiUtil.verifyStatusCode(response, '200');
            expect(resBody.message).toBe("${data.familyName} record inserted successfully");
        });

        test('Insert One ${data.familyName} with metadata and no ${data.schemaSectionName} section##740750## @API @${data.familyName}', async ({ global }) => {
            //Generating payload for the API
            get${data.familyName}DataForRegulatoryTable(1, 'json');
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const data = require('../data/generatedData/${data.familyName}ErpData.json');

            const testdata = data.${data.familyName}Records[0];
            const payload = {};
            payload["grcData"] = getSectionsFromRecord('grcData', testdata, '${data.familyName}');
            payload["erpData"] = getSectionsFromRecord('erpData', testdata, '${data.familyName}');
            payload["metadata"] = getSectionsFromRecord('metadata', testdata, '${data.familyName}');
            console.log(JSON.stringify(payload));

            //Sending Request to the server
            const response = (await apiContext.post('/${data.familyName}/create', { data: JSON.stringify(payload) }));
            const resBody = await response.json();

            printAPIResponseToLog(response, resBody);

            //Validating the record created in database
            await global.apiUtil.verifyStatusCode(response, '200');
            expect(resBody.message).toBe("${data.familyName} record inserted successfully");
        });

        test('Insert One ${data.familyName} with metadata and only required field for erpData section filled##740750## @API @${data.familyName}', async ({ global }) => {
            //Generating payload for the API
            get${data.familyName}DataForRegulatoryTable(1, 'json');
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const data = require('../data/generatedData/${data.familyName}ErpData.json');

            const testdata = data.${data.familyName}Records[0];
            const regData = get${data.familyName}DataForSchema('${data.familyName}', testdata.erp_${data.familyName}_id, testdata.erp_${data.familyName}_desc);

            const payload = {};
            payload["grcData"] = getSectionsFromRecord('grcData', testdata, '${data.familyName}');
            payload["erpData"] = { "erp_${data.familyName}_id": \`\${testdata.erp_${data.familyName}_id}\` };
            payload["metadata"] = getSectionsFromRecord('metadata', testdata, '${data.familyName}');
            payload[regData[0]] = regData[1];
            console.log(JSON.stringify(payload));

            //Sending Request to the server
            const response = (await apiContext.post('/${data.familyName}/create', { data: JSON.stringify(payload) }));
            const resBody = await response.json();

            printAPIResponseToLog(response, resBody);

            //Validating the record created in database
            await global.apiUtil.verifyStatusCode(response, '200');
            expect(resBody.message).toBe("${data.familyName} record inserted successfully");
        });

        test('Insert One ${data.familyName} with metadata and no grcData section filled##740750## @API @${data.familyName}', async ({ global }) => {
            //Generating payload for the API
            get${data.familyName}DataForRegulatoryTable(1, 'json');
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const data = require('../data/generatedData/${data.familyName}ErpData.json');

            const testdata = data.${data.familyName}Records[0];
            const regData = get${data.familyName}DataForSchema('${data.familyName}', testdata.erp_${data.familyName}_id, testdata.erp_${data.familyName}_desc);

            const payload = {};
            payload["erpData"] = getSectionsFromRecord('erpData', testdata, '${data.familyName}');
            payload["metadata"] = getSectionsFromRecord('metadata', testdata, '${data.familyName}');
            payload[regData[0]] = regData[1];
            console.log(JSON.stringify(payload));

            //Sending Request to the server
            const response = (await apiContext.post('/${data.familyName}/create', { data: JSON.stringify(payload) }));
            const resBody = await response.json();

            printAPIResponseToLog(response, resBody);

            //Validating the record created in database
            await global.apiUtil.verifyStatusCode(response, '400');
            expect(resBody.message).toBe("Missing required fields in the request body");
        });

        test('Insert One ${data.familyName} with metadata no erpData section filled##740750## @API @${data.familyName}', async ({ global }) => {
            //Generating payload for the API
            get${data.familyName}DataForRegulatoryTable(1, 'json');
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const data = require('../data/generatedData/${data.familyName}ErpData.json');

            const testdata = data.${data.familyName}Records[0];
            const regData = get${data.familyName}DataForSchema('${data.familyName}', testdata.erp_${data.familyName}_id, testdata.erp_${data.familyName}_desc);

            const payload = {};
            payload["grcData"] = getSectionsFromRecord('grcData', testdata, '${data.familyName}');
            payload["metadata"] = getSectionsFromRecord('metadata', testdata, '${data.familyName}');
            payload[regData[0]] = regData[1];
            console.log(JSON.stringify(payload));

            //Sending Request to the server
            const response = (await apiContext.post('/${data.familyName}/create', { data: JSON.stringify(payload) }));
            const resBody = await response.json();

            printAPIResponseToLog(response, resBody);

            //Validating the record created in database
            await global.apiUtil.verifyStatusCode(response, '400');
            expect(resBody.message).toBe("Missing required fields in the request body");
        });

        test('Insert One ${data.familyName} with metadata wrong field in grcData filled##740750## @API @${data.familyName}', async ({ global }) => {
            //Generating payload for the API
            get${data.familyName}DataForRegulatoryTable(1, 'json');
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const data = require('../data/generatedData/${data.familyName}ErpData.json');

            const testdata = data.${data.familyName}Records[0];
            const regData = get${data.familyName}DataForSchema('${data.familyName}', testdata.erp_${data.familyName}_id, testdata.erp_${data.familyName}_desc);

            const payload = {};
            const wrongFieldGrcData = getSectionsFromRecord('grcData', testdata, '${data.familyName}');
            wrongFieldGrcData['erpType'] = wrongFieldGrcData['erp_type'];
            delete wrongFieldGrcData['erp_type'];
            payload["grcData"] = wrongFieldGrcData;
            payload["metadata"] = getSectionsFromRecord('metadata', testdata, '${data.familyName}');
            payload[regData[0]] = regData[1];
            console.log(JSON.stringify(payload));

            //Sending Request to the server
            const response = (await apiContext.post('/${data.familyName}/create', { data: JSON.stringify(payload) }));
            const resBody = await response.json();

            printAPIResponseToLog(response, resBody);

            //Validating the record created in database
            await global.apiUtil.verifyStatusCode(response, '400');
            expect(resBody.message).toBe("Missing required fields in the request body");
        });

        test('Insert One ${data.familyName} with metadata wrong field in erpData ##740750## @API @${data.familyName}', async ({ global }) => {
            //Generating payload for the API
            get${data.familyName}DataForRegulatoryTable(1, 'json');
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const data = require('../data/generatedData/${data.familyName}ErpData.json');

            const testdata = data.${data.familyName}Records[0];
            const regData = get${data.familyName}DataForSchema('${data.familyName}', testdata.erp_${data.familyName}_id, testdata.erp_${data.familyName}_desc);

            const payload = {};
            const wrongFieldErpData = getSectionsFromRecord('erpData', testdata, '${data.familyName}');
            wrongFieldErpData['year'] = wrongFieldErpData['erp_academic_year'];
            wrongFieldErpData['${data.familyName}_desc'] = wrongFieldErpData['erp_${data.familyName}_desc'];
            delete wrongFieldErpData['erp_academic_year'];
            delete wrongFieldErpData['erp_${data.familyName}_desc'];
            payload["grcData"] = getSectionsFromRecord('grcData', testdata, '${data.familyName}');
            payload["erpData"] = wrongFieldErpData;
            payload["metadata"] = getSectionsFromRecord('metadata', testdata, '${data.familyName}');
            payload[regData[0]] = regData[1];
            console.log(JSON.stringify(payload));

            //Sending Request to the server
            const response = (await apiContext.post('/${data.familyName}/create', { data: JSON.stringify(payload) }));
            const resBody = await response.json();

            printAPIResponseToLog(response, resBody);

            //Validating the record created in database
            await global.apiUtil.verifyStatusCode(response, '500');
            expect(resBody.message).toBe('Internal server error: column "year" of relation "regulatory_${data.familyName}" does not exist');
        });

        test('Insert One ${data.familyName} with metadata with duplicate record with all fields ##740750## @API @${data.familyName}', async ({ global }) => {
            //Generating payload for the API
            get${data.familyName}DataForRegulatoryTable(1, 'json');
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const data = require('../data/generatedData/${data.familyName}rpData.json');

            const testdata = data.${data.familyName}Records[0];
            const regData = get${data.familyName}DataForSchema('${data.familyName}', testdata.erp_${data.familyName}_id, testdata.erp_${data.familyName}_desc);

            const payload = {};
            const erpData = getSectionsFromRecord('erpData', testdata, '${data.familyName}');

            payload["grcData"] = getSectionsFromRecord('grcData', testdata, '${data.familyName}');
            payload["erpData"] = erpData;
            payload["metadata"] = getSectionsFromRecord('metadata', testdata, '${data.familyName}');
            payload[regData[0]] = regData[1];
            console.log(JSON.stringify(payload));

            //Sending Request to the server
            let response = (await apiContext.post('/${data.familyName}/create', { data: JSON.stringify(payload) }));
            let resBody = await response.json();

            await global.apiUtil.verifyStatusCode(response, '200');

            //Sending Request to the server
            response = (await apiContext.post('/${data.familyName}/create', { data: JSON.stringify(payload) }));
            resBody = await response.json();

            printAPIResponseToLog(response, resBody);

            //Validating the record created in database
            await global.apiUtil.verifyStatusCode(response, '500');
            expect(resBody.message).toBe('Internal server error: duplicate key value violates unique constraint "rc_comp_unique"');

            console.log("******* Test with chenged ${data.familyName} ID ********** ");

            erpData['erp_${data.familyName}_id'] = erpData['erp_${data.familyName}_id'].replace(/[0-9]/gm, faker.number.int({ min: 100000, max: 999999 }));
            payload["erpData"] = erpData;
            console.log(JSON.stringify(payload));

            //Sending Request to the server
            response = (await apiContext.post('/${data.familyName}/create', { data: JSON.stringify(payload) }));
            resBody = await response.json();

            printAPIResponseToLog(response, resBody);

            //Validating the record created in database
            await global.apiUtil.verifyStatusCode(response, '200');
            expect(resBody.message).toBe('${data.familyName} record inserted successfully');
        });
    });
});


		`;
