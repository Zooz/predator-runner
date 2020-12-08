module.exports.VALID_CUSTOM_TEST = {
    'id': 'test_id',
    'name': 'test_name',
    'description': 'test_description',
    'type': 'custom',
    'raw_data': null,
    'artillery_test': {
        'config': {
            'target': '',
            'http': {
                'pool': 100
            },
            'phases': [
                {
                    'duration': 0,
                    'arrivalRate': 0
                }
            ]
        },
        'scenarios': [
            {
                'flow': [
                    {
                        'post': {
                            'forever': true,
                            'gateway': 'pci',
                            'url': '/tokens',
                            'json': {
                                'token_type': 'credit_card',
                                'holder_name': 'MY NAME',
                                'expiration_date': '11/2020',
                                'card_number': '5105105105105100',
                                'identity_document': {
                                    'number': '5415668464654',
                                    'type': 'ID'
                                },
                                'billing_address': {
                                    'first_name': 'FN',
                                    'last_name': 'LN',
                                    'country': 'ARG',
                                    'line1': 'Viamonte',
                                    'line2': '1366',
                                    'city': 'Plata',
                                    'phone': '7563126',
                                    'state': 'Buenos Aires',
                                    'zip_code': '64000'
                                }
                            }
                        }
                    }
                ]
            }
        ]
    }
};

module.exports.VALID_CUSTOM_TEST_WITH_EXPECT = {
    'id': 'test_id',
    'name': 'test_name',
    'description': 'test_description',
    'type': 'custom',
    'raw_data': null,
    'artillery_test': {
        'config': {
            'target': '',
            'http': {
                'pool': 100
            },
            'phases': [
                {
                    'duration': 0,
                    'arrivalRate': 0
                }
            ]
        },
        'scenarios': [
            {
                'flow': [
                    {
                        'post': {
                            'forever': true,
                            'gateway': 'pci',
                            'url': '/tokens',
                            'json': {
                                'token_type': 'credit_card',
                                'holder_name': 'MY NAME',
                                'expiration_date': '11/2020',
                                'card_number': '5105105105105100',
                                'identity_document': {
                                    'number': '5415668464654',
                                    'type': 'ID'
                                },
                                'billing_address': {
                                    'first_name': 'FN',
                                    'last_name': 'LN',
                                    'country': 'ARG',
                                    'line1': 'Viamonte',
                                    'line2': '1366',
                                    'city': 'Plata',
                                    'phone': '7563126',
                                    'state': 'Buenos Aires',
                                    'zip_code': '64000'
                                }
                            },
                            "expect": [
                                {
                                    "hasProperty": "id"
                                }
                            ],
                        }
                    }
                ]
            }
        ]
    }
};

module.exports.VALID_POST_BODY_CUSTOM = {
    'name': 'system-tests',
    'description': 'performance-framework-runner system tests',
    'type': 'custom',
    'artillery_schema': {
        'config': {
            'target': 'http://localhost:3003',
            'http': {
                'pool': 100
            },
            'phases': [{
                'duration': '10',
                'arrivalRate': '10'
            }],
            'statsInterval': 30
        },
        'before': {
            'flow': [
                {'post':
                        {
                            'url': '/pets',
                            'json': {'name': 'MickeyTheDog', 'species': 'Dog'},
                            'capture': {
                                'json': '$.id',
                                'as': 'petId'
                            }
                        }
                }
            ]
        },
        'scenarios': [{
            'name': 'Get tests',
            'flow': [{
                'get': {
                    'url': '/pets/{{ petId }}',
                    'headers': {
                        'Content-Type': 'application/json'
                    }
                }
            }]
        }]
    }
};

module.exports.EXPECTED_ARTILLERY_CUSTOM_TEST = {
    'config': {
        'target': '',
        'http': {
            'pool': 100
        },
        'phases': [{
            'duration': 5,
            'arrivalRate': 10
        }],
        'statsInterval': 30
    },
    'scenarios': [{
        'flow': [{
            'post': {
                'forever': true,
                'gateway': 'pci',
                'url': '/tokens',
                'json': {
                    'token_type': 'credit_card',
                    'holder_name': 'MY NAME',
                    'expiration_date': '11/2020',
                    'card_number': '5105105105105100',
                    'identity_document': {
                        'number': '5415668464654',
                        'type': 'ID'
                    },
                    'billing_address': {
                        'first_name': 'FN',
                        'last_name': 'LN',
                        'country': 'ARG',
                        'line1': 'Viamonte',
                        'line2': '1366',
                        'city': 'Plata',
                        'phone': '7563126',
                        'state': 'Buenos Aires',
                        'zip_code': '64000'
                    }
                }
            }
        }]
    }]
};

module.exports.PROMETHEUS_CONFIGURATION = {
    push_gateway_url: 'http://pushgateway.com',
    buckets_sizes: [0.5, 1, 2, 5, 10]
};

module.exports.INFLUX_CONFIGURATION = {
    host: 'host',
    username: 'mickey',
    password: 'password',
    database: 'database'
};
