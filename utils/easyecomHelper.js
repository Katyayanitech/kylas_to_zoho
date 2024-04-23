const axios = require('axios');

const salesPersons = {
    'uqqo2': 'sales1',
    'bkze3': 'sales2',
    'qgzz4': 'sales3',
    'nqjg5': 'sales4',
    'ydju6': 'sales5',
    'wumj7': 'sales6',
    'ymrh8': 'sales7',
    'yfer9': 'sales8',
    'kscs0': 'sales9',
    'jvxe1': 'sales10',
    'sssk2': 'ksk11',
    'mgsq3': 'sales12',
    'kxwo4': 'sales13',
    'dzyp5': 'sales14',
    'ezgh6': 'sales15',
    'qtqw7': 'sales16',
    'aoos8': 'sales17',
    'egmy9': 'sales18',
    'jylo0': 'sales19',
    'njsi1': 'sales20',
    'mxmd2': 'sales21',
    'emsa3': 'sales22',
    'pvpt4': 'sales23',
    'sefv5': 'sales24',
    'uaji6': 'sales25',
    'znoi7': 'sales26',
    'beap8': 'sales27',
    'vtob9': 'sales28',
    'yqrz0': 'sales29',
    'tskm1': 'sales30',
    'vjby2': 'sales31',
    'voik3': 'sales32',
    'syzf4': 'sales33',
    'pray5': 'sales34',
    'qfis6': 'sales35',
    'vhbw7': 'sales36',
    'wtwd8': 'sales37',
    'czgh9': 'sales38',
    'eanw0': 'sales39',
    'xpyw1': 'sales40',
    'rblj2': 'sales41',
    'zoxw3': 'ksk44',
    'webm4': 'sales45',
    'lghb5': 'sales46',
    'ocfz6': 'sales47',
    'zmyc7': 'sales48',
    'eyjp8': 'sales49',
    'bnmv9': 'sales50',
    'irhj0': 'sales51',
    'bzmh1': 'sales52',
    'yxhr2': 'sales53',
    'zoov3': 'ksk55',
    'cigd4': 'sales56',
    'npre5': 'sales57',
    'eftn6': 'sales58',
    'onzb7': 'sales59',
    'dbpl8': 'sales60',
    'kafs9': 'sales61',
    'qihf0': 'sales62',
    'guuu1': 'sales63',
    'juya2': 'sales64',
    'qtbt3': 'ksk66',
    'pkdn4': 'sales67',
    'dcmq5': 'sales68',
    'ekls6': 'sales69',
    'dbkg7': 'sales70',
    'ioaj8': 'sales71',
    'ykur9': 'sales72',
    'hcit0': 'sales73',
    'adam1': 'sales74',
    'qokt2': 'sales75',
    'mirj3': 'ksk77',
    'bazs4': 'sales78',
    'lhaq5': 'sales79',
    'zuvn6': 'sales80',
    'kaov7': 'sales81',
    'qroq8': 'sales82',
    'puea9': 'sales83',
    'gdpc0': 'sales84',
    'bijy1': 'sales85',
    'nczi2': 'sales86',
    'matd3': 'sales87',
    'ykge4': 'ksk88',
    'juuw5': 'sales89',
    'estf6': 'sales90',
    'wjuo7': 'sales91',
    'klxa8': 'sales92',
    'ngyz9': 'sales93',
    'jvxs0': 'sales94',
    'ydpa1': 'sales95',
    'koro2': 'sales96',
    'wjak3': 'sales97',
    'yscs4': 'sales98',
    'quau5': 'ksk99',
    'fycm6': 'sales100',
    'rsek7': 'sales101',
    'svlt8': 'sales102',
    'qjfn9': 'sales103',
    'dsmm0': 'sales104',
    'ircn1': 'sales105'
}

const platformTags = {
    "KO Website": "1155413000012339214",
    "Agribegri": "1155413000012339222",
    "Amazon Saudi Arabia": "1155413000012339230",
    "Amazon Japan": "1155413000012339238",
    "GGV UAE": "1155413000012339246",
    "Amazon France": "1155413000019461798",
    "Amazon Belgium": "1155413000019461810",
    "Agrociaa": "1155413000060100009",
    "Snapdeal": "1155413000075418068",
    "JioMart": "1155413000077342092",
    "KSK Website": "1155413000012339216",
    "Amazon UAE": "1155413000012339224",
    "Amazon Canada": "1155413000012339232",
    "Amazon Sweden": "1155413000012339240",
    "Amazon Ireland": "1155413000019461802",
    "E Kisani Store": "1155413000041144149",
    "Moglix": "1155413000061392032",
    "Meesho": "1155413000075588011",
    "Plantlane": "1155413000078593336",
    "Other's Sales": "1155413000012339212",
    "Bighaat": "1155413000012339220",
    "Amazon USA": "1155413000012339228",
    "Amazon Mexico": "1155413000012339236",
    "GGV Canada": "1155413000012339244",
    "GEM": "1155413000019437395",
    "Amazon Netherlands": "1155413000019461806",
    "Industry Buying": "1155413000055264011",
    "GGV USA": "1155413000072130681",
    "Bharat Agri": "1155413000077328129",
    "Amazon India": "1155413000012339218",
    "Amazon UK": "1155413000012339226",
    "Amazon Singapore": "1155413000012339234",
    "Amazon Australia": "1155413000012339242",
    "E Kisani Zone": "1155413000016137185",
    "Amazon Italy": "1155413000019461804",
    "Amazon Spain": "1155413000051187046",
    "Badikheti": "1155413000065257961",
    "Shopclues": "1155413000077328117",
    "Kisan Shop": "1155413000078765023"
}

const marketPlaces = {
    "Shopify13": "GGV Canada",
    "Woocommerce": "Website Sales",
    "Shopify": "New Website (KSK)",
    "Katyayani": "Other's Sales",
    "Amazon.in": "Amazon India",
    "Offline": "Other's Sales",
    "Shopify2": "Bighaat",
    "Shopify14": "GGV USA",
    "Amazon.ca": "Amazon Canada",
    "Amazon.ae": "Amazon UAE",
    "Amazon.co.uk": "Amazon UK",
    "Amazon.com": "Amazon USA",
    "Amazon.co.jp": "Amazon Japan",
    "Jio mart": "JioMart"
}

const salesSectorTags = {
    "Others": "1155413000016023096",
    "Web": "1155413000009542011",
    "Export": "1155413000000000638",
    "Ecommerce": "1155413000009542009"
}

const salesSector = {
    "Shopify13": "Ecommerce",
    "Woocommerce": "Web",
    "Shopify": "Web",
    "Katyayani": "Others",
    "Amazon.in": "Ecommerce",
    "Offline": "Others",
    "Shopify2": "Ecommerce"
}

const termsOfPayment = {
    "COD": "Cash on Delivery",
    "PrePaid": "Prepaid",
}

const generateAuthToken = async () => {
    try {
        const response = await axios.get(
            "https://script.google.com/macros/s/AKfycbz4HwSNCuMV-s1Bz9-G-37E1tHp7bxQ35ICns48cXgwd6mdgE4KqIT8LDuxjMr7w7Gzww/exec",
        );
        return response.data.trim();
    } catch (error) {
        console.error("Error generating auth token:", error.message);
        // throw error;
    }
};

const getCustomerId = async (phoneNumber) => {
    const ZOHO_BOOK_ACCESS_TOKEN = await generateAuthToken();
    console.log("ZohoBookToken", ZOHO_BOOK_ACCESS_TOKEN);
    try {
        const response = await axios.get(
            `https://www.zohoapis.in/books/v3/contacts/?organization_id=60019077540&phone=%2B91${phoneNumber}`,
            {
                headers: {
                    Authorization: `Zoho-oauthtoken ${ZOHO_BOOK_ACCESS_TOKEN}`,
                },
            }
        );

        const contactId = response.data.contacts[0].contact_id;
        return contactId;
    } catch (e) {
        console.error("Error:", e);
        return null;
    }
};


const postInvoiceToBooks = async (easycomData) => {
    const ZOHO_BOOK_ACCESS_TOKEN = await generateAuthToken();
    console.log("ZohoBookToken", ZOHO_BOOK_ACCESS_TOKEN);

    const config = {
        method: 'post',
        url: 'https://www.zohoapis.in/books/v3/invoices?organization_id=60019077540',
        headers: {
            'Authorization': `Zoho-oauthtoken ${ZOHO_BOOK_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        },
        data: easycomData
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log('Error in postInvoiceToBooks function:', error);
        // throw error;
    }
}

const getItemIdFromSKU = async (sku) => {
    try {
        const ZOHO_BOOK_ACCESS_TOKEN = await generateAuthToken();
        const response = await axios.get(
            `https://www.zohoapis.in/books/v3/items?organization_id=60019077540&sku=${sku}`,
            {
                headers: {
                    Authorization: `Zoho-oauthtoken ${ZOHO_BOOK_ACCESS_TOKEN}`,
                },
            }
        );

        const itemId = response.data.items[0].item_id;
        return itemId;
    } catch (error) {
        console.error("Error getting item ID:", error);
        return null;
    }
};



exports.postInvoiceToZohoBooks = async (invoice) => {
    console.log("easyecom invoice : ", invoice);
    const customerId = await getCustomerId(invoice[0].contact_num);
    console.log(invoice[0].order_items);
    console.log("Salesperson Id ", invoice[0].reference_code.split("/")[1]);
    try {
        const easycomData = {
            "customer_id": customerId,
            "invoice_number": invoice[0].reference_code.length > 16 ? invoice[0].reference_code.substring(0, 6) + Math.floor(Math.random() * 1000000000).toString().padStart(10, '0') : invoice[0].reference_code,
            "reference_number": invoice[0].reference_code,
            "line_items": [],
            "salesperson_name": salesPersons[invoice[0].reference_code.split("/")[1]] || "",
            "is_inclusive_tax": true,
            "account_id": "1155413000010057962",
            "account_name": "KSK Sale",
            "custom_fields": [
                {
                    "field_id": "1155413000002568031",
                    "customfield_id": "1155413000002568031",
                    "show_in_store": false,
                    "show_in_portal": false,
                    "is_active": true,
                    "index": 1,
                    "label": "Marketplace",
                    "show_on_pdf": true,
                    "edit_on_portal": false,
                    "edit_on_store": false,
                    "api_name": "cf_sales_account",
                    "show_in_all_pdf": true,
                    "selected_option_id": "1155413000002568033",
                    "value_formatted": marketPlaces[invoice[0].marketplace] || invoice[0].marketPlaces,
                    "search_entity": "invoice",
                    "data_type": "dropdown",
                    "placeholder": "cf_sales_account",
                    "value": marketPlaces[invoice[0].marketplace] || invoice[0].marketPlaces,
                    "is_dependent_field": false
                },
                {
                    "field_id": "1155413000001759107",
                    "customfield_id": "1155413000001759107",
                    "show_in_store": false,
                    "show_in_portal": false,
                    "is_active": true,
                    "index": 1,
                    "label": "Terms of Payment",
                    "show_on_pdf": true,
                    "edit_on_portal": false,
                    "edit_on_store": false,
                    "api_name": "cf_terms_of_payment",
                    "show_in_all_pdf": true,
                    "value_formatted": termsOfPayment[invoice[0].payment_mode],
                    "search_entity": "invoice",
                    "data_type": "multiselect",
                    "placeholder": "cf_terms_of_payment",
                    "value": [
                        termsOfPayment[invoice[0].payment_mode]
                    ],
                    "is_dependent_field": false
                },
                {
                    "field_id": "1155413000001759115",
                    "customfield_id": "1155413000001759115",
                    "show_in_store": false,
                    "show_in_portal": false,
                    "is_active": true,
                    "index": 2,
                    "label": "Payment to be Collected (If COD)",
                    "show_on_pdf": true,
                    "edit_on_portal": false,
                    "edit_on_store": false,
                    "api_name": "cf_payment_to_be_collected_if_",
                    "show_in_all_pdf": true,
                    "value_formatted": invoice[0].payment_mode == "COD" ? invoice[0].collectable_amount : "0",
                    "search_entity": "invoice",
                    "data_type": "string",
                    "placeholder": "cf_payment_to_be_collected_if_",
                    "value": invoice[0].payment_mode == "COD" ? invoice[0].collectable_amount : "0",
                    "is_dependent_field": false
                },
                {
                    "field_id": "1155413000014100001",
                    "customfield_id": "1155413000014100001",
                    "show_in_store": false,
                    "show_in_portal": false,
                    "is_active": true,
                    "index": 5,
                    "label": "Order Date",
                    "show_on_pdf": true,
                    "edit_on_portal": false,
                    "edit_on_store": false,
                    "api_name": "cf_order_date",
                    "show_in_all_pdf": true,
                    "value_formatted": "20/04/2024",
                    "search_entity": "invoice",
                    "data_type": "date",
                    "placeholder": "cf_order_date",
                    "value": new Date(invoice[0].order_date).toISOString().split('T')[0],
                    "is_dependent_field": false
                },

            ]
        };

        for (const item of invoice[0].order_items) {
            const itemId = await getItemIdFromSKU(item.sku);
            easycomData.line_items.push({
                item_id: itemId, quantity: item.item_quantity, rate: (item.selling_price / item.item_quantity), tags: [
                    {
                        "tag_option_id": salesSectorTags[salesSector[invoice[0].marketplace]],
                        "is_tag_mandatory": false,
                        "tag_name": "Sales Sector",
                        "tag_id": "1155413000000000638",
                        "tag_option_name": salesSector[invoice[0].marketplace] || invoice[0].marketPlaces,
                    },
                    {
                        "tag_option_id": platformTags[marketPlaces[invoice[0].marketplace]],
                        "is_tag_mandatory": false,
                        "tag_name": "Platform",
                        "tag_id": "1155413000000000640",
                        "tag_option_name": marketPlaces[invoice[0].marketplace] || invoice[0].marketPlaces,
                    }
                ],
            });
        }

        console.log(easycomData);

        const response = await postInvoiceToBooks(easycomData);
        console.log('easyecom invoice posted to Zoho books successfully:', response.data);
    } catch (error) {
        console.log('Error posting easyecom invoice to Zoho books:', error.response ? error.response.data : error);
    }
}