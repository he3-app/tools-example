export const JsonExample = `{
  "id": 1,
  "uuid": "3d877494-e7d4-48e3-aa7a-164373a7920d",
  "name": "He3",
  "age": 26,
  "isActive": true,
  "registered": "2020-02-03T06:00:03 -08:00",
  "tags": [
    "tools",
    "development"
  ],
  "language": [
    {
      "id": 0,
      "name": "English"
    },
    {
      "id": 1,
      "name": "Español"
    },
    {
      "id": 2,
      "name": "Chinese"
    }
  ]
}`;

export const uglyJsonExample = `{"id":1,"uuid":"3d877494-e7d4-48e3-aa7a-164373a7920d","name":"He3","age":26,"isActive":true,"registered":"2020-02-03T06:00:03 -08:00","tags":["tools","development"],"language":[{"id":0,"name":"English"},{"id":1,"name":"Español"},{"id":2,"name":"Chinese"}]}`;

export const jsonToSQLExample = {
  id: 1,
  uuid: '3d877494-e7d4-48e3-aa7a-164373a7920d',
  name: 'He3',
  age: 26,
  isActive: true,
  registered: '2020-02-03T06:00:03',
  tags: ['tools', 'development'],
  language: [
    {
      id: 0,
      name: 'English',
    },
    {
      id: 1,
      name: 'Español',
    },
    {
      id: 2,
      name: 'Chinese',
    },
  ],
};

export const jsonGeneratorExample = {
  min_position: 'int(3,4,5-9)',
  has_more_items: 'bool',
  items_html: "string('Bus','Car','Bike')",
  new_latent_count: 'int',
  data: {
    length: 'int(20-30)',
    text: 'string',
  },
  numericalArray: ['repeat[5]', 'int(20,23-33)'],
  StringArray: ['repeat[4]', "string('Carbon','Nitrogen','Oxygen')"],
  multipleTypesArray: [3, 'Hello', 5, true],
  objArray: [
    'repeat[5]',
    {
      class: "string('middle','upper','lower')",
      age: 'int',
    },
  ],
};
export const propertiesExample = `id=1
uuid=3d877494-e7d4-48e3-aa7a-164373a7920d
name=He3
age=26
registered=2020-02-03T06:00:03 -08:00
tags[0]=tools
tags[1]=development
language[0].id=0
language[0].name=English
language[1].id=1
language[1].name=Español
language[2].id=2
language[2].name=Chinese`

export const JsonUnescape = `{
  \\"id\\": 1,
  \\"uuid\\": \\"3d877494-e7d4-48e3-aa7a-164373a7920d\\",
  \\"name\\": \\"He3\\",
  \\"age\\": 26,
  \\"isActive\\": true,
  \\"registered\\": \\"2020-02-03T06:00:03 -08:00\",
  \\"tags\\": [
    \\"tools\\\",
    \\"development\\"
  ],
  \\"language\\": [
    {
      \\"id\\": 0,
      \\"name\\": \\"English\\"
    },
    {
      \\"id\\": 1,
      \\"name\\": \\"Español\\"
    },
    {
      \\"id\\": 2,
      \\"name\\": \\"Chinese\\"
    }
  ]
}`