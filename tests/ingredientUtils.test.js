jest.mock("../models/foodNutrientModel.js", () => ({
    findOneAndUpdate: jest.fn(),
}));

const {
    fdcIngredientToModelFormat,
    addManualIngredientData,
    fetchFdcIngredients,
    formatNutrients,
} = require("../utils/ingredientUtils.js");

const ingredientsRequestDataMap = new Map([
    [
        170457,
        {
            foodName: "ognion",
            category: "vegetable",
            servingSize: 1,
            costPerServing: 1,
        },
    ],
    [790646, {}],
    [170457, {}],
]);

test("fetch ingredients ognion and tomato from fdcId array", async () => {
    const result = await fetchFdcIngredients([170457, 790646]);
    console.log(JSON.stringify(result, null, 2));
    expect(result).toEqual(testResponseFdcIngredients);
});

test("", () => {
    expect(fdcIngredientToModelFormat(testResponseFdcIngredients)).toBe();
});

test("format fdc nutrient array to model standard", async () => {
    const Nutrient = require("../models/foodNutrientModel.js");
    Nutrient.findOneAndUpdate
        .mockResolvedValueOnce({
            _id: "69d5876b754064d595da85eb",
            name: "folic",
            unitName: "UG",
            nutrientNumber: 431,
            dailyRecommendedIntake: 0,
            __v: 0,
        })
        .mockResolvedValueOnce({
            _id: "69cb0109ce61c003ce9404a7",
            name: "protein",
            unitName: "G",
            nutrientNumber: 203,
            dailyRecommendedIntake: 64,
            __v: 0,
        });
    const result = await formatNutrients([
        {
            number: "431",
            name: "Folic acid",
            amount: 0e-8,
            unitName: "UG",
            derivationCode: "Z",
            derivationDescription:
                "Assumed zero (Insignificant amount or not naturally occurring in a food, such as fiber in meat)",
        },
        {
            number: "203",
            name: "Protein",
            amount: 0.88,
            unitName: "G",
            derivationCode: "JO",
            derivationDescription:
                "Aggregated data involving combinations of data with different source codes when at least one code is not 1, 6, 12, or 13",
        },
    ]);

    console.log(JSON.stringify(result, null, 2));
    expect(result).toEqual([
        {
            foodNutrient: "69d5876b754064d595da85eb",
            amountPer100: 0e-8,
        },
        {
            foodNutrient: "69cb0109ce61c003ce9404a7",
            amountPer100: 0.88,
        },
    ]);
});

test("add manual data to ingredients array from fdc", async () => {
    const result = await addManualIngredientData([
        {
            foodNutrient: "69d5876b754064d595da85eb",
            amountPer100: 0,
        },

        {
            foodNutrient: "69cb0109ce61c003ce9404a7",
            amountPer100: 0.88,
        },
    ]);
    console.log(JSON.stringify(result, null, 2));

    expect(result).toEqual();
});

test("add manual data to formated ingredient model", () => {
    const dataMap = new Map([
        [
            170457,
            {
                foodName: "ognion",
                category: "vegetable",
                costPerServing: 1,
                servingSize: 1,
            },
        ],
        [790646, { category: "vegetable", costPerServing: 1, servingSize: 1 }],
    ]);
    const result = addManualIngredientData(formatedFdcResponse, dataMap);

    console.log(JSON.stringify(result, null, 2));
    expect(result).toEqual(formatedWithManualData);
});

const testResponseFdcIngredients = [
    {
        fdcId: 170457,
        description: "Tomatoes, red, ripe, raw, year round average",
        dataType: "SR Legacy",
        publicationDate: "2019-04-01",
        ndbNumber: "11529",
        foodNutrients: [
            {
                number: "431",
                name: "Folic acid",
                amount: 0e-8,
                unitName: "UG",
                derivationCode: "Z",
                derivationDescription:
                    "Assumed zero (Insignificant amount or not naturally occurring in a food, such as fiber in meat)",
            },
            {
                number: "313",
                name: "Fluoride, F",
                amount: 2.3,
                unitName: "UG",
                derivationCode: "A",
                derivationDescription: "Analytical",
            },
            {
                number: "324",
                name: "Vitamin D (D2 + D3), International Units",
                amount: 0e-8,
                unitName: "IU",
                derivationCode: "Z",
                derivationDescription:
                    "Assumed zero (Insignificant amount or not naturally occurring in a food, such as fiber in meat)",
            },
            {
                number: "628",
                name: "MUFA 20:1",
                amount: 0e-8,
                unitName: "G",
            },
            {
                number: "630",
                name: "MUFA 22:1",
                amount: 0e-8,
                unitName: "G",
            },
            {
                number: "421",
                name: "Choline, total",
                amount: 6.7,
                unitName: "MG",
            },
            {
                number: "454",
                name: "Betaine",
                amount: 0.1,
                unitName: "MG",
                derivationCode: "A",
                derivationDescription: "Analytical",
            },
            {
                number: "503",
                name: "Isoleucine",
                amount: 0.018,
                unitName: "G",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "607",
                name: "SFA 4:0",
                amount: 0e-8,
                unitName: "G",
            },
            {
                number: "608",
                name: "SFA 6:0",
                amount: 0e-8,
                unitName: "G",
            },
            {
                number: "610",
                name: "SFA 10:0",
                amount: 0e-8,
                unitName: "G",
            },
            {
                number: "620",
                name: "PUFA 20:4",
                amount: 0e-8,
                unitName: "G",
            },
            {
                number: "627",
                name: "PUFA 18:4",
                amount: 0e-8,
                unitName: "G",
            },
            {
                number: "504",
                name: "Leucine",
                amount: 0.025,
                unitName: "G",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "505",
                name: "Lysine",
                amount: 0.027,
                unitName: "G",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "507",
                name: "Cystine",
                amount: 0.009,
                unitName: "G",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "510",
                name: "Valine",
                amount: 0.018,
                unitName: "G",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "511",
                name: "Arginine",
                amount: 0.021,
                unitName: "G",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "512",
                name: "Histidine",
                amount: 0.014,
                unitName: "G",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "514",
                name: "Aspartic acid",
                amount: 0.135,
                unitName: "G",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "518",
                name: "Serine",
                amount: 0.026,
                unitName: "G",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "501",
                name: "Tryptophan",
                amount: 0.006,
                unitName: "G",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "502",
                name: "Threonine",
                amount: 0.027,
                unitName: "G",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "506",
                name: "Methionine",
                amount: 0.006,
                unitName: "G",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "509",
                name: "Tyrosine",
                amount: 0.014,
                unitName: "G",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "513",
                name: "Alanine",
                amount: 0.027,
                unitName: "G",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "515",
                name: "Glutamic acid",
                amount: 0.431,
                unitName: "G",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "516",
                name: "Glycine",
                amount: 0.019,
                unitName: "G",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "517",
                name: "Proline",
                amount: 0.015,
                unitName: "G",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "609",
                name: "SFA 8:0",
                amount: 0e-8,
                unitName: "G",
            },
            {
                number: "611",
                name: "SFA 12:0",
                amount: 0e-8,
                unitName: "G",
            },
            {
                number: "612",
                name: "SFA 14:0",
                amount: 0e-8,
                unitName: "G",
            },
            {
                number: "621",
                name: "PUFA 22:6 n-3 (DHA)",
                amount: 0e-8,
                unitName: "G",
            },
            {
                number: "629",
                name: "PUFA 20:5 n-3 (EPA)",
                amount: 0e-8,
                unitName: "G",
            },
            {
                number: "631",
                name: "PUFA 22:5 n-3 (DPA)",
                amount: 0e-8,
                unitName: "G",
            },
            {
                number: "605",
                name: "Fatty acids, total trans",
                amount: 0e-8,
                unitName: "G",
                derivationCode: "Z",
                derivationDescription:
                    "Assumed zero (Insignificant amount or not naturally occurring in a food, such as fiber in meat)",
            },
            {
                number: "221",
                name: "Alcohol, ethyl",
                amount: 0e-8,
                unitName: "G",
            },
            {
                number: "319",
                name: "Retinol",
                amount: 0e-8,
                unitName: "UG",
                derivationCode: "Z",
                derivationDescription:
                    "Assumed zero (Insignificant amount or not naturally occurring in a food, such as fiber in meat)",
            },
            {
                number: "337",
                name: "Lycopene",
                amount: 2.57e3,
                unitName: "UG",
                derivationCode: "A",
                derivationDescription: "Analytical",
            },
            {
                number: "401",
                name: "Vitamin C, total ascorbic acid",
                amount: 13.7,
                unitName: "MG",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "255",
                name: "Water",
                amount: 94.5,
                unitName: "G",
                derivationCode: "JO",
                derivationDescription:
                    "Aggregated data involving combinations of data with different source codes when at least one code is not 1, 6, 12, or 13",
            },
            {
                number: "636",
                name: "Phytosterols",
                amount: 7.0,
                unitName: "MG",
            },
            {
                number: "601",
                name: "Cholesterol",
                amount: 0e-8,
                unitName: "MG",
                derivationCode: "Z",
                derivationDescription:
                    "Assumed zero (Insignificant amount or not naturally occurring in a food, such as fiber in meat)",
            },
            {
                number: "418",
                name: "Vitamin B-12",
                amount: 0e-8,
                unitName: "UG",
                derivationCode: "Z",
                derivationDescription:
                    "Assumed zero (Insignificant amount or not naturally occurring in a food, such as fiber in meat)",
            },
            {
                number: "645",
                name: "Fatty acids, total monounsaturated",
                amount: 0.031,
                unitName: "G",
                derivationCode: "NC",
                derivationDescription: "Calculated",
            },
            {
                number: "646",
                name: "Fatty acids, total polyunsaturated",
                amount: 0.083,
                unitName: "G",
                derivationCode: "NC",
                derivationDescription: "Calculated",
            },
            {
                number: "435",
                name: "Folate, DFE",
                amount: 15.0,
                unitName: "UG",
                derivationCode: "NC",
                derivationDescription: "Calculated",
            },
            {
                number: "269",
                name: "Total Sugars",
                amount: 2.63,
                unitName: "G",
                derivationCode: "NC",
                derivationDescription: "Calculated",
            },
            {
                number: "205",
                name: "Carbohydrate, by difference",
                amount: 3.89,
                unitName: "G",
                derivationCode: "NC",
                derivationDescription: "Calculated",
            },
            {
                number: "208",
                name: "Energy",
                amount: 18.0,
                unitName: "KCAL",
                derivationCode: "NC",
                derivationDescription: "Calculated",
            },
            {
                number: "613",
                name: "SFA 16:0",
                amount: 0.02,
                unitName: "G",
            },
            {
                number: "614",
                name: "SFA 18:0",
                amount: 0.008,
                unitName: "G",
            },
            {
                number: "617",
                name: "MUFA 18:1",
                amount: 0.03,
                unitName: "G",
            },
            {
                number: "618",
                name: "PUFA 18:2",
                amount: 0.08,
                unitName: "G",
            },
            {
                number: "619",
                name: "PUFA 18:3",
                amount: 0.003,
                unitName: "G",
            },
            {
                number: "318",
                name: "Vitamin A, IU",
                amount: 833,
                unitName: "IU",
            },
            {
                number: "320",
                name: "Vitamin A, RAE",
                amount: 42.0,
                unitName: "UG",
            },
            {
                number: "268",
                name: "Energy",
                amount: 74.0,
                unitName: "kJ",
                derivationCode: "NC",
                derivationDescription: "Calculated",
            },
            {
                number: "432",
                name: "Folate, food",
                amount: 15.0,
                unitName: "UG",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "606",
                name: "Fatty acids, total saturated",
                amount: 0.028,
                unitName: "G",
                derivationCode: "NC",
                derivationDescription: "Calculated",
            },
            {
                number: "626",
                name: "MUFA 16:1",
                amount: 0.001,
                unitName: "G",
            },
            {
                number: "508",
                name: "Phenylalanine",
                amount: 0.027,
                unitName: "G",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "301",
                name: "Calcium, Ca",
                amount: 10.0,
                unitName: "MG",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "306",
                name: "Potassium, K",
                amount: 237,
                unitName: "MG",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "309",
                name: "Zinc, Zn",
                amount: 0.17,
                unitName: "MG",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "317",
                name: "Selenium, Se",
                amount: 0e-8,
                unitName: "UG",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "323",
                name: "Vitamin E (alpha-tocopherol)",
                amount: 0.54,
                unitName: "MG",
                derivationCode: "JO",
                derivationDescription:
                    "Aggregated data involving combinations of data with different source codes when at least one code is not 1, 6, 12, or 13",
            },
            {
                number: "338",
                name: "Lutein + zeaxanthin",
                amount: 123,
                unitName: "UG",
                derivationCode: "A",
                derivationDescription: "Analytical",
            },
            {
                number: "341",
                name: "Tocopherol, beta",
                amount: 0.01,
                unitName: "MG",
                derivationCode: "JO",
                derivationDescription:
                    "Aggregated data involving combinations of data with different source codes when at least one code is not 1, 6, 12, or 13",
            },
            {
                number: "342",
                name: "Tocopherol, gamma",
                amount: 0.12,
                unitName: "MG",
                derivationCode: "JO",
                derivationDescription:
                    "Aggregated data involving combinations of data with different source codes when at least one code is not 1, 6, 12, or 13",
            },
            {
                number: "344",
                name: "Tocotrienol, alpha",
                amount: 0.01,
                unitName: "MG",
                derivationCode: "JO",
                derivationDescription:
                    "Aggregated data involving combinations of data with different source codes when at least one code is not 1, 6, 12, or 13",
            },
            {
                number: "345",
                name: "Tocotrienol, beta",
                amount: 0e-8,
                unitName: "MG",
                derivationCode: "JO",
                derivationDescription:
                    "Aggregated data involving combinations of data with different source codes when at least one code is not 1, 6, 12, or 13",
            },
            {
                number: "406",
                name: "Niacin",
                amount: 0.594,
                unitName: "MG",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "410",
                name: "Pantothenic acid",
                amount: 0.089,
                unitName: "MG",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "415",
                name: "Vitamin B-6",
                amount: 0.08,
                unitName: "MG",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "210",
                name: "Sucrose",
                amount: 0e-8,
                unitName: "G",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "211",
                name: "Glucose",
                amount: 1.25,
                unitName: "G",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "214",
                name: "Maltose",
                amount: 0e-8,
                unitName: "G",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "262",
                name: "Caffeine",
                amount: 0e-8,
                unitName: "MG",
                derivationCode: "Z",
                derivationDescription:
                    "Assumed zero (Insignificant amount or not naturally occurring in a food, such as fiber in meat)",
            },
            {
                number: "263",
                name: "Theobromine",
                amount: 0e-8,
                unitName: "MG",
                derivationCode: "Z",
                derivationDescription:
                    "Assumed zero (Insignificant amount or not naturally occurring in a food, such as fiber in meat)",
            },
            {
                number: "204",
                name: "Total lipid (fat)",
                amount: 0.2,
                unitName: "G",
                derivationCode: "JO",
                derivationDescription:
                    "Aggregated data involving combinations of data with different source codes when at least one code is not 1, 6, 12, or 13",
            },
            {
                number: "334",
                name: "Cryptoxanthin, beta",
                amount: 0e-8,
                unitName: "UG",
                derivationCode: "A",
                derivationDescription: "Analytical",
            },
            {
                number: "430",
                name: "Vitamin K (phylloquinone)",
                amount: 7.9,
                unitName: "UG",
                derivationCode: "JO",
                derivationDescription:
                    "Aggregated data involving combinations of data with different source codes when at least one code is not 1, 6, 12, or 13",
            },
            {
                number: "287",
                name: "Galactose",
                amount: 0e-8,
                unitName: "G",
                derivationCode: "A",
                derivationDescription: "Analytical",
            },
            {
                number: "291",
                name: "Fiber, total dietary",
                amount: 1.2,
                unitName: "G",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "303",
                name: "Iron, Fe",
                amount: 0.27,
                unitName: "MG",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "304",
                name: "Magnesium, Mg",
                amount: 11.0,
                unitName: "MG",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "305",
                name: "Phosphorus, P",
                amount: 24.0,
                unitName: "MG",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "307",
                name: "Sodium, Na",
                amount: 5.0,
                unitName: "MG",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "312",
                name: "Copper, Cu",
                amount: 0.059,
                unitName: "MG",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "315",
                name: "Manganese, Mn",
                amount: 0.114,
                unitName: "MG",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "203",
                name: "Protein",
                amount: 0.88,
                unitName: "G",
                derivationCode: "JO",
                derivationDescription:
                    "Aggregated data involving combinations of data with different source codes when at least one code is not 1, 6, 12, or 13",
            },
            {
                number: "207",
                name: "Ash",
                amount: 0.5,
                unitName: "G",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "209",
                name: "Starch",
                amount: 0e-8,
                unitName: "G",
                derivationCode: "A",
                derivationDescription: "Analytical",
            },
            {
                number: "212",
                name: "Fructose",
                amount: 1.37,
                unitName: "G",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "213",
                name: "Lactose",
                amount: 0e-8,
                unitName: "G",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "321",
                name: "Carotene, beta",
                amount: 449,
                unitName: "UG",
                derivationCode: "A",
                derivationDescription: "Analytical",
            },
            {
                number: "322",
                name: "Carotene, alpha",
                amount: 101,
                unitName: "UG",
                derivationCode: "A",
                derivationDescription: "Analytical",
            },
            {
                number: "343",
                name: "Tocopherol, delta",
                amount: 0e-8,
                unitName: "MG",
                derivationCode: "JO",
                derivationDescription:
                    "Aggregated data involving combinations of data with different source codes when at least one code is not 1, 6, 12, or 13",
            },
            {
                number: "346",
                name: "Tocotrienol, gamma",
                amount: 0e-8,
                unitName: "MG",
                derivationCode: "JO",
                derivationDescription:
                    "Aggregated data involving combinations of data with different source codes when at least one code is not 1, 6, 12, or 13",
            },
            {
                number: "347",
                name: "Tocotrienol, delta",
                amount: 0e-8,
                unitName: "MG",
                derivationCode: "JO",
                derivationDescription:
                    "Aggregated data involving combinations of data with different source codes when at least one code is not 1, 6, 12, or 13",
            },
            {
                number: "429",
                name: "Vitamin K (Dihydrophylloquinone)",
                amount: 0e-8,
                unitName: "UG",
                derivationCode: "A",
                derivationDescription: "Analytical",
            },
            {
                number: "404",
                name: "Thiamin",
                amount: 0.037,
                unitName: "MG",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "405",
                name: "Riboflavin",
                amount: 0.019,
                unitName: "MG",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "417",
                name: "Folate, total",
                amount: 15.0,
                unitName: "UG",
                derivationCode: "JA",
                derivationDescription:
                    "Aggregated data involving combinations of data with only source codes 1 and 12 and/or 13",
            },
            {
                number: "573",
                name: "Vitamin E, added",
                amount: 0e-8,
                unitName: "MG",
                derivationCode: "Z",
                derivationDescription:
                    "Assumed zero (Insignificant amount or not naturally occurring in a food, such as fiber in meat)",
            },
            {
                number: "578",
                name: "Vitamin B-12, added",
                amount: 0e-8,
                unitName: "UG",
                derivationCode: "Z",
                derivationDescription:
                    "Assumed zero (Insignificant amount or not naturally occurring in a food, such as fiber in meat)",
            },
            {
                number: "328",
                name: "Vitamin D (D2 + D3)",
                amount: 0e-8,
                unitName: "UG",
                derivationCode: "Z",
                derivationDescription:
                    "Assumed zero (Insignificant amount or not naturally occurring in a food, such as fiber in meat)",
            },
        ],
    },
    {
        fdcId: 790646,
        description: "Onions, yellow, raw",
        dataType: "Foundation",
        publicationDate: "2020-04-01",
        ndbNumber: "100253",
        foodNutrients: [
            {
                number: "416",
                name: "Biotin",
                amount: 0e-8,
                unitName: "UG",
                derivationCode: "A",
                derivationDescription: "Analytical",
            },
            {
                number: "212",
                name: "Fructose",
                amount: 1.91,
                unitName: "G",
                derivationCode: "A",
                derivationDescription: "Analytical",
            },
            {
                number: "211",
                name: "Glucose",
                amount: 2.31,
                unitName: "G",
                derivationCode: "A",
                derivationDescription: "Analytical",
            },
            {
                number: "213",
                name: "Lactose",
                amount: 0e-8,
                unitName: "G",
                derivationCode: "A",
                derivationDescription: "Analytical",
            },
            {
                number: "214",
                name: "Maltose",
                amount: 0e-8,
                unitName: "G",
                derivationCode: "A",
                derivationDescription: "Analytical",
            },
            {
                number: "210",
                name: "Sucrose",
                amount: 1.6,
                unitName: "G",
                derivationCode: "A",
                derivationDescription: "Analytical",
            },
            {
                number: "291",
                name: "Fiber, total dietary",
                amount: 1.9,
                unitName: "G",
                derivationCode: "A",
                derivationDescription: "Analytical",
            },
            {
                number: "314",
                name: "Iodine, I",
                amount: 0e-8,
                unitName: "UG",
                derivationCode: "A",
                derivationDescription: "Analytical",
            },
            {
                number: "293",
                name: "Total dietary fiber (AOAC 2011.25)",
                amount: 2.71,
                unitName: "G",
                derivationCode: "A",
                derivationDescription: "Analytical",
            },
            {
                number: "315",
                name: "Manganese, Mn",
                amount: 0.144,
                unitName: "MG",
                derivationCode: "A",
                derivationDescription: "Analytical",
            },
            {
                number: "305",
                name: "Phosphorus, P",
                amount: 34.0,
                unitName: "MG",
                derivationCode: "A",
                derivationDescription: "Analytical",
            },
            {
                number: "306",
                name: "Potassium, K",
                amount: 182,
                unitName: "MG",
                derivationCode: "A",
                derivationDescription: "Analytical",
            },
            {
                number: "309",
                name: "Zinc, Zn",
                amount: 0.2,
                unitName: "MG",
                derivationCode: "A",
                derivationDescription: "Analytical",
            },
            {
                number: "301",
                name: "Calcium, Ca",
                amount: 15.0,
                unitName: "MG",
                derivationCode: "A",
                derivationDescription: "Analytical",
            },
            {
                number: "312",
                name: "Copper, Cu",
                amount: 0.035,
                unitName: "MG",
                derivationCode: "A",
                derivationDescription: "Analytical",
            },
            {
                number: "303",
                name: "Iron, Fe",
                amount: 0.28,
                unitName: "MG",
                derivationCode: "A",
                derivationDescription: "Analytical",
            },
            {
                number: "304",
                name: "Magnesium, Mg",
                amount: 9.0,
                unitName: "MG",
                derivationCode: "A",
                derivationDescription: "Analytical",
            },
            {
                number: "307",
                name: "Sodium, Na",
                amount: 1.0,
                unitName: "MG",
                derivationCode: "A",
                derivationDescription: "Analytical",
            },
            {
                number: "317",
                name: "Selenium, Se",
                amount: 0e-8,
                unitName: "UG",
                derivationCode: "A",
                derivationDescription: "Analytical",
            },
            {
                number: "255",
                name: "Water",
                amount: 90.1,
                unitName: "G",
                derivationCode: "A",
                derivationDescription: "Analytical",
            },
            {
                number: "203",
                name: "Protein",
                amount: 0.83,
                unitName: "G",
                derivationCode: "A",
                derivationDescription: "Analytical",
            },
            {
                number: "207",
                name: "Ash",
                amount: 0.41,
                unitName: "G",
                derivationCode: "A",
                derivationDescription: "Analytical",
            },
            {
                number: "204",
                name: "Total lipid (fat)",
                amount: 0.05,
                unitName: "G",
                derivationCode: "A",
                derivationDescription: "Analytical",
            },
            {
                number: "401",
                name: "Vitamin C, total ascorbic acid",
                amount: 8.2,
                unitName: "MG",
                derivationCode: "A",
                derivationDescription: "Analytical",
            },
            {
                number: "269.3",
                name: "Sugars, Total",
                amount: 5.82,
                unitName: "G",
                derivationCode: "AS",
                derivationDescription: "Summed",
            },
            {
                number: "205",
                name: "Carbohydrate, by difference",
                amount: 8.61,
                unitName: "G",
                derivationCode: "AS",
                derivationDescription: "Summed",
            },
            {
                number: "208",
                name: "Energy",
                amount: 38.0,
                unitName: "KCAL",
                derivationCode: "NC",
                derivationDescription: "Calculated",
            },
            {
                number: "268",
                name: "Energy",
                amount: 160,
                unitName: "kJ",
                derivationCode: "NC",
                derivationDescription: "Calculated",
            },
        ],
    },
];

const formatedFdcResponse = [
    {
        name: "tomatoes",
        foodNutrients: [
            {
                foodNutrient: "69d5876b754064d595da85eb",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d5876b754064d595da85ec",
                amountPer100: 2.3,
            },
            {
                foodNutrient: "69d5876b754064d595da85ed",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abadc1ddc888014f0bb",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abadc1ddc888014f0bc",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d5876b754064d595da85f0",
                amountPer100: 6.7,
            },
            {
                foodNutrient: "69d5876b754064d595da85f1",
                amountPer100: 0.1,
            },
            {
                foodNutrient: "69d5876b754064d595da85f2",
                amountPer100: 0.018,
            },
            {
                foodNutrient: "69d7663885bfed4aac6c0f41",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abadc1ddc888014f0be",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abadc1ddc888014f0bf",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d5876b754064d595da85f6",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abadc1ddc888014f0c0",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d6d20dac67ba82209c6aa4",
                amountPer100: 0.025,
            },
            {
                foodNutrient: "69d6d20dac67ba82209c6aa2",
                amountPer100: 0.027,
            },
            {
                foodNutrient: "69d6d20dac67ba82209c6aa6",
                amountPer100: 0.009,
            },
            {
                foodNutrient: "69d6d20dac67ba82209c6aaa",
                amountPer100: 0.018,
            },
            {
                foodNutrient: "69d6d20dac67ba82209c6aa8",
                amountPer100: 0.021,
            },
            {
                foodNutrient: "69d6d20dac67ba82209c6aac",
                amountPer100: 0.014,
            },
            {
                foodNutrient: "69d6d20dac67ba82209c6aae",
                amountPer100: 0.135,
            },
            {
                foodNutrient: "69d7663885bfed4aac6c0f42",
                amountPer100: 0.026,
            },
            {
                foodNutrient: "69d7663885bfed4aac6c0f43",
                amountPer100: 0.006,
            },
            {
                foodNutrient: "69d7663985bfed4aac6c0f44",
                amountPer100: 0.027,
            },
            {
                foodNutrient: "69d7663985bfed4aac6c0f45",
                amountPer100: 0.006,
            },
            {
                foodNutrient: "69d7663985bfed4aac6c0f46",
                amountPer100: 0.014,
            },
            {
                foodNutrient: "69d7663985bfed4aac6c0f47",
                amountPer100: 0.027,
            },
            {
                foodNutrient: "69d7663985bfed4aac6c0f48",
                amountPer100: 0.431,
            },
            {
                foodNutrient: "69d7663985bfed4aac6c0f49",
                amountPer100: 0.019,
            },
            {
                foodNutrient: "69d7663985bfed4aac6c0f4a",
                amountPer100: 0.015,
            },
            {
                foodNutrient: "69f10abadc1ddc888014f0c2",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abadc1ddc888014f0c3",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0c4",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0c5",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0c6",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0c7",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d7663a85bfed4aac6c0f4b",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d7663a85bfed4aac6c0f4c",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d7663a85bfed4aac6c0f4d",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d7663a85bfed4aac6c0f4e",
                amountPer100: 2570,
            },
            {
                foodNutrient: "69f10abadc1ddc888014f0c1",
                amountPer100: 13.7,
            },
            {
                foodNutrient: "69d7663a85bfed4aac6c0f4f",
                amountPer100: 94.5,
            },
            {
                foodNutrient: "69d7663b85bfed4aac6c0f50",
                amountPer100: 7,
            },
            {
                foodNutrient: "69d7663b85bfed4aac6c0f51",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0c8",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0c9",
                amountPer100: 0.031,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0ca",
                amountPer100: 0.083,
            },
            {
                foodNutrient: "69d7663b85bfed4aac6c0f52",
                amountPer100: 15,
            },
            {
                foodNutrient: "69d7663b85bfed4aac6c0f53",
                amountPer100: 2.63,
            },
            {
                foodNutrient: "69d2e7ad640df7871418d7d0",
                amountPer100: 3.89,
            },
            {
                foodNutrient: "69d2e70d640df7871418d7cc",
                amountPer100: 18,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0cb",
                amountPer100: 0.02,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0cc",
                amountPer100: 0.008,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0cd",
                amountPer100: 0.03,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0ce",
                amountPer100: 0.08,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0cf",
                amountPer100: 0.003,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0d0",
                amountPer100: 833,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0d1",
                amountPer100: 42,
            },
            {
                foodNutrient: "69d7663b85bfed4aac6c0f54",
                amountPer100: 74,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0d2",
                amountPer100: 15,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0d3",
                amountPer100: 0.028,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0d4",
                amountPer100: 0.001,
            },
            {
                foodNutrient: "69d7663b85bfed4aac6c0f55",
                amountPer100: 0.027,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f56",
                amountPer100: 10,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f57",
                amountPer100: 237,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f58",
                amountPer100: 0.17,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f59",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0d5",
                amountPer100: 0.54,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f5a",
                amountPer100: 123,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f5b",
                amountPer100: 0.01,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0d6",
                amountPer100: 0.12,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f5c",
                amountPer100: 0.01,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0d7",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f5d",
                amountPer100: 0.594,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f5e",
                amountPer100: 0.089,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0d8",
                amountPer100: 0.08,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f5f",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f60",
                amountPer100: 1.25,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f61",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f62",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f63",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d2e771640df7871418d7ce",
                amountPer100: 0.2,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f64",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abcdc1ddc888014f0d9",
                amountPer100: 7.9,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f65",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d2e678640df7871418d7ca",
                amountPer100: 1.2,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f66",
                amountPer100: 0.27,
            },
            {
                foodNutrient: "69d7663d85bfed4aac6c0f67",
                amountPer100: 11,
            },
            {
                foodNutrient: "69d7663d85bfed4aac6c0f68",
                amountPer100: 24,
            },
            {
                foodNutrient: "69d2e7ee640df7871418d7d4",
                amountPer100: 5,
            },
            {
                foodNutrient: "69d7663d85bfed4aac6c0f69",
                amountPer100: 0.059,
            },
            {
                foodNutrient: "69d7663d85bfed4aac6c0f6a",
                amountPer100: 0.114,
            },
            {
                foodNutrient: "69cb0109ce61c003ce9404a7",
                amountPer100: 0.88,
            },
            {
                foodNutrient: "69d7663d85bfed4aac6c0f6b",
                amountPer100: 0.5,
            },
            {
                foodNutrient: "69d7663d85bfed4aac6c0f6c",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d7663d85bfed4aac6c0f6d",
                amountPer100: 1.37,
            },
            {
                foodNutrient: "69d7663d85bfed4aac6c0f6e",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d7663d85bfed4aac6c0f6f",
                amountPer100: 449,
            },
            {
                foodNutrient: "69f10abcdc1ddc888014f0da",
                amountPer100: 101,
            },
            {
                foodNutrient: "69f10abcdc1ddc888014f0db",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abcdc1ddc888014f0dc",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abcdc1ddc888014f0dd",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abcdc1ddc888014f0de",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d7663d85bfed4aac6c0f70",
                amountPer100: 0.037,
            },
            {
                foodNutrient: "69d7663d85bfed4aac6c0f71",
                amountPer100: 0.019,
            },
            {
                foodNutrient: "69f10abcdc1ddc888014f0df",
                amountPer100: 15,
            },
            {
                foodNutrient: "69f10abcdc1ddc888014f0e0",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abcdc1ddc888014f0e1",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abcdc1ddc888014f0e2",
                amountPer100: 0,
            },
        ],
    },
    {
        name: "onions",
        foodNutrients: [
            {
                foodNutrient: "69d7663d85bfed4aac6c0f72",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d7663d85bfed4aac6c0f6d",
                amountPer100: 1.91,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f60",
                amountPer100: 2.31,
            },
            {
                foodNutrient: "69d7663d85bfed4aac6c0f6e",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f61",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f5f",
                amountPer100: 1.6,
            },
            {
                foodNutrient: "69d2e678640df7871418d7ca",
                amountPer100: 1.9,
            },
            {
                foodNutrient: "69d7663d85bfed4aac6c0f73",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abadc1ddc888014f0bd",
                amountPer100: 2.71,
            },
            {
                foodNutrient: "69d7663d85bfed4aac6c0f6a",
                amountPer100: 0.144,
            },
            {
                foodNutrient: "69d7663d85bfed4aac6c0f68",
                amountPer100: 34,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f57",
                amountPer100: 182,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f58",
                amountPer100: 0.2,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f56",
                amountPer100: 15,
            },
            {
                foodNutrient: "69d7663d85bfed4aac6c0f69",
                amountPer100: 0.035,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f66",
                amountPer100: 0.28,
            },
            {
                foodNutrient: "69d7663d85bfed4aac6c0f67",
                amountPer100: 9,
            },
            {
                foodNutrient: "69d2e7ee640df7871418d7d4",
                amountPer100: 1,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f59",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d7663a85bfed4aac6c0f4f",
                amountPer100: 90.1,
            },
            {
                foodNutrient: "69cb0109ce61c003ce9404a7",
                amountPer100: 0.83,
            },
            {
                foodNutrient: "69d7663d85bfed4aac6c0f6b",
                amountPer100: 0.41,
            },
            {
                foodNutrient: "69d2e771640df7871418d7ce",
                amountPer100: 0.05,
            },
            {
                foodNutrient: "69f10abadc1ddc888014f0c1",
                amountPer100: 8.2,
            },
            {
                foodNutrient: "69d7663e85bfed4aac6c0f74",
                amountPer100: 5.82,
            },
            {
                foodNutrient: "69d2e7ad640df7871418d7d0",
                amountPer100: 8.61,
            },
            {
                foodNutrient: "69d2e70d640df7871418d7cc",
                amountPer100: 38,
            },
            {
                foodNutrient: "69d7663b85bfed4aac6c0f54",
                amountPer100: 160,
            },
        ],
    },
];

const formatedWithManualData = [
    {
        name: "tomatoes",
        foodNutrients: [
            {
                foodNutrient: "69d5876b754064d595da85eb",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d5876b754064d595da85ec",
                amountPer100: 2.3,
            },
            {
                foodNutrient: "69d5876b754064d595da85ed",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abadc1ddc888014f0bb",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abadc1ddc888014f0bc",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d5876b754064d595da85f0",
                amountPer100: 6.7,
            },
            {
                foodNutrient: "69d5876b754064d595da85f1",
                amountPer100: 0.1,
            },
            {
                foodNutrient: "69d5876b754064d595da85f2",
                amountPer100: 0.018,
            },
            {
                foodNutrient: "69d7663885bfed4aac6c0f41",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abadc1ddc888014f0be",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abadc1ddc888014f0bf",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d5876b754064d595da85f6",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abadc1ddc888014f0c0",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d6d20dac67ba82209c6aa4",
                amountPer100: 0.025,
            },
            {
                foodNutrient: "69d6d20dac67ba82209c6aa2",
                amountPer100: 0.027,
            },
            {
                foodNutrient: "69d6d20dac67ba82209c6aa6",
                amountPer100: 0.009,
            },
            {
                foodNutrient: "69d6d20dac67ba82209c6aaa",
                amountPer100: 0.018,
            },
            {
                foodNutrient: "69d6d20dac67ba82209c6aa8",
                amountPer100: 0.021,
            },
            {
                foodNutrient: "69d6d20dac67ba82209c6aac",
                amountPer100: 0.014,
            },
            {
                foodNutrient: "69d6d20dac67ba82209c6aae",
                amountPer100: 0.135,
            },
            {
                foodNutrient: "69d7663885bfed4aac6c0f42",
                amountPer100: 0.026,
            },
            {
                foodNutrient: "69d7663885bfed4aac6c0f43",
                amountPer100: 0.006,
            },
            {
                foodNutrient: "69d7663985bfed4aac6c0f44",
                amountPer100: 0.027,
            },
            {
                foodNutrient: "69d7663985bfed4aac6c0f45",
                amountPer100: 0.006,
            },
            {
                foodNutrient: "69d7663985bfed4aac6c0f46",
                amountPer100: 0.014,
            },
            {
                foodNutrient: "69d7663985bfed4aac6c0f47",
                amountPer100: 0.027,
            },
            {
                foodNutrient: "69d7663985bfed4aac6c0f48",
                amountPer100: 0.431,
            },
            {
                foodNutrient: "69d7663985bfed4aac6c0f49",
                amountPer100: 0.019,
            },
            {
                foodNutrient: "69d7663985bfed4aac6c0f4a",
                amountPer100: 0.015,
            },
            {
                foodNutrient: "69f10abadc1ddc888014f0c2",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abadc1ddc888014f0c3",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0c4",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0c5",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0c6",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0c7",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d7663a85bfed4aac6c0f4b",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d7663a85bfed4aac6c0f4c",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d7663a85bfed4aac6c0f4d",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d7663a85bfed4aac6c0f4e",
                amountPer100: 2570,
            },
            {
                foodNutrient: "69f10abadc1ddc888014f0c1",
                amountPer100: 13.7,
            },
            {
                foodNutrient: "69d7663a85bfed4aac6c0f4f",
                amountPer100: 94.5,
            },
            {
                foodNutrient: "69d7663b85bfed4aac6c0f50",
                amountPer100: 7,
            },
            {
                foodNutrient: "69d7663b85bfed4aac6c0f51",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0c8",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0c9",
                amountPer100: 0.031,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0ca",
                amountPer100: 0.083,
            },
            {
                foodNutrient: "69d7663b85bfed4aac6c0f52",
                amountPer100: 15,
            },
            {
                foodNutrient: "69d7663b85bfed4aac6c0f53",
                amountPer100: 2.63,
            },
            {
                foodNutrient: "69d2e7ad640df7871418d7d0",
                amountPer100: 3.89,
            },
            {
                foodNutrient: "69d2e70d640df7871418d7cc",
                amountPer100: 18,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0cb",
                amountPer100: 0.02,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0cc",
                amountPer100: 0.008,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0cd",
                amountPer100: 0.03,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0ce",
                amountPer100: 0.08,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0cf",
                amountPer100: 0.003,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0d0",
                amountPer100: 833,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0d1",
                amountPer100: 42,
            },
            {
                foodNutrient: "69d7663b85bfed4aac6c0f54",
                amountPer100: 74,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0d2",
                amountPer100: 15,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0d3",
                amountPer100: 0.028,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0d4",
                amountPer100: 0.001,
            },
            {
                foodNutrient: "69d7663b85bfed4aac6c0f55",
                amountPer100: 0.027,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f56",
                amountPer100: 10,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f57",
                amountPer100: 237,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f58",
                amountPer100: 0.17,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f59",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0d5",
                amountPer100: 0.54,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f5a",
                amountPer100: 123,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f5b",
                amountPer100: 0.01,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0d6",
                amountPer100: 0.12,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f5c",
                amountPer100: 0.01,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0d7",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f5d",
                amountPer100: 0.594,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f5e",
                amountPer100: 0.089,
            },
            {
                foodNutrient: "69f10abbdc1ddc888014f0d8",
                amountPer100: 0.08,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f5f",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f60",
                amountPer100: 1.25,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f61",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f62",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f63",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d2e771640df7871418d7ce",
                amountPer100: 0.2,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f64",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abcdc1ddc888014f0d9",
                amountPer100: 7.9,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f65",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d2e678640df7871418d7ca",
                amountPer100: 1.2,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f66",
                amountPer100: 0.27,
            },
            {
                foodNutrient: "69d7663d85bfed4aac6c0f67",
                amountPer100: 11,
            },
            {
                foodNutrient: "69d7663d85bfed4aac6c0f68",
                amountPer100: 24,
            },
            {
                foodNutrient: "69d2e7ee640df7871418d7d4",
                amountPer100: 5,
            },
            {
                foodNutrient: "69d7663d85bfed4aac6c0f69",
                amountPer100: 0.059,
            },
            {
                foodNutrient: "69d7663d85bfed4aac6c0f6a",
                amountPer100: 0.114,
            },
            {
                foodNutrient: "69cb0109ce61c003ce9404a7",
                amountPer100: 0.88,
            },
            {
                foodNutrient: "69d7663d85bfed4aac6c0f6b",
                amountPer100: 0.5,
            },
            {
                foodNutrient: "69d7663d85bfed4aac6c0f6c",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d7663d85bfed4aac6c0f6d",
                amountPer100: 1.37,
            },
            {
                foodNutrient: "69d7663d85bfed4aac6c0f6e",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d7663d85bfed4aac6c0f6f",
                amountPer100: 449,
            },
            {
                foodNutrient: "69f10abcdc1ddc888014f0da",
                amountPer100: 101,
            },
            {
                foodNutrient: "69f10abcdc1ddc888014f0db",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abcdc1ddc888014f0dc",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abcdc1ddc888014f0dd",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abcdc1ddc888014f0de",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d7663d85bfed4aac6c0f70",
                amountPer100: 0.037,
            },
            {
                foodNutrient: "69d7663d85bfed4aac6c0f71",
                amountPer100: 0.019,
            },
            {
                foodNutrient: "69f10abcdc1ddc888014f0df",
                amountPer100: 15,
            },
            {
                foodNutrient: "69f10abcdc1ddc888014f0e0",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abcdc1ddc888014f0e1",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abcdc1ddc888014f0e2",
                amountPer100: 0,
            },
        ],
    },
    {
        name: "onions",
        foodNutrients: [
            {
                foodNutrient: "69d7663d85bfed4aac6c0f72",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d7663d85bfed4aac6c0f6d",
                amountPer100: 1.91,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f60",
                amountPer100: 2.31,
            },
            {
                foodNutrient: "69d7663d85bfed4aac6c0f6e",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f61",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f5f",
                amountPer100: 1.6,
            },
            {
                foodNutrient: "69d2e678640df7871418d7ca",
                amountPer100: 1.9,
            },
            {
                foodNutrient: "69d7663d85bfed4aac6c0f73",
                amountPer100: 0,
            },
            {
                foodNutrient: "69f10abadc1ddc888014f0bd",
                amountPer100: 2.71,
            },
            {
                foodNutrient: "69d7663d85bfed4aac6c0f6a",
                amountPer100: 0.144,
            },
            {
                foodNutrient: "69d7663d85bfed4aac6c0f68",
                amountPer100: 34,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f57",
                amountPer100: 182,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f58",
                amountPer100: 0.2,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f56",
                amountPer100: 15,
            },
            {
                foodNutrient: "69d7663d85bfed4aac6c0f69",
                amountPer100: 0.035,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f66",
                amountPer100: 0.28,
            },
            {
                foodNutrient: "69d7663d85bfed4aac6c0f67",
                amountPer100: 9,
            },
            {
                foodNutrient: "69d2e7ee640df7871418d7d4",
                amountPer100: 1,
            },
            {
                foodNutrient: "69d7663c85bfed4aac6c0f59",
                amountPer100: 0,
            },
            {
                foodNutrient: "69d7663a85bfed4aac6c0f4f",
                amountPer100: 90.1,
            },
            {
                foodNutrient: "69cb0109ce61c003ce9404a7",
                amountPer100: 0.83,
            },
            {
                foodNutrient: "69d7663d85bfed4aac6c0f6b",
                amountPer100: 0.41,
            },
            {
                foodNutrient: "69d2e771640df7871418d7ce",
                amountPer100: 0.05,
            },
            {
                foodNutrient: "69f10abadc1ddc888014f0c1",
                amountPer100: 8.2,
            },
            {
                foodNutrient: "69d7663e85bfed4aac6c0f74",
                amountPer100: 5.82,
            },
            {
                foodNutrient: "69d2e7ad640df7871418d7d0",
                amountPer100: 8.61,
            },
            {
                foodNutrient: "69d2e70d640df7871418d7cc",
                amountPer100: 38,
            },
            {
                foodNutrient: "69d7663b85bfed4aac6c0f54",
                amountPer100: 160,
            },
        ],
    },
];
