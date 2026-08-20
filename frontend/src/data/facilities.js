export const facilities = [
  {
    id: 1,
    name: "Nairobi Hospital",
    type: "Hospital",
    description:
      "A major healthcare facility providing a wide range of medical services.",
    address: "Argwings Kodhek Road, Nairobi",
    county: "Nairobi",
    latitude: -1.3007,
    longitude: 36.8065,

    services: [
      "Emergency",
      "Outpatient",
      "Laboratory",
      "Pharmacy",
      "Maternity",
      "Radiology",
    ],

    openingHours: {
      monday: "Open 24 hours",
      tuesday: "Open 24 hours",
      wednesday: "Open 24 hours",
      thursday: "Open 24 hours",
      friday: "Open 24 hours",
      saturday: "Open 24 hours",
      sunday: "Open 24 hours",
    },

    phone: "+254 703 082000",

    emergency: true,
  },

  {
    id: 2,
    name: "Kenyatta National Hospital",
    type: "Hospital",
    description:
      "A major public referral and teaching hospital serving patients from across Kenya.",
    address: "Hospital Road, Nairobi",
    county: "Nairobi",
    latitude: -1.3017,
    longitude: 36.8073,

    services: [
      "Emergency",
      "Outpatient",
      "Laboratory",
      "Pharmacy",
      "Maternity",
      "Surgery",
      "Radiology",
    ],

    openingHours: {
      monday: "Open 24 hours",
      tuesday: "Open 24 hours",
      wednesday: "Open 24 hours",
      thursday: "Open 24 hours",
      friday: "Open 24 hours",
      saturday: "Open 24 hours",
      sunday: "Open 24 hours",
    },

    phone: "+254 20 2726300",

    emergency: true,
  },

  {
    id: 3,
    name: "Afya Pharmacy",
    type: "Pharmacy",
    description:
      "Community pharmacy providing prescription and over-the-counter services.",
    address: "Kilimani, Nairobi",
    county: "Nairobi",
    latitude: -1.2921,
    longitude: 36.7876,

    services: [
      "Pharmacy",
      "Prescription",
      "Health Products",
    ],

    openingHours: {
      monday: "8:00 AM - 8:00 PM",
      tuesday: "8:00 AM - 8:00 PM",
      wednesday: "8:00 AM - 8:00 PM",
      thursday: "8:00 AM - 8:00 PM",
      friday: "8:00 AM - 8:00 PM",
      saturday: "9:00 AM - 6:00 PM",
      sunday: "10:00 AM - 4:00 PM",
    },

    phone: "+254 700 000000",

    emergency: false,
  },
 
    {
    id: 4,
    name: "Mater Misericordiae Hospital",
    type: "Hospital",
    address: "Mukenia Road, Nairobi",
    county: "Nairobi",
    latitude: -1.3038,
    longitude: 36.8219,
    phone: "+254 732 163000",
    services: [
        "Emergency",
        "Maternity",
        "Outpatient",
        "Inpatient",
        "Laboratory",
        "Pharmacy",
        "Radiology",
     ],
     openingHours: "24 hours",
     emergency: true,
    wheelchair: "yes",
    operator: "Mater Misericordiae Hospital",
  source: "AfyaLink / Reference data",
},

{
  id: 5,
  name: "Coptic Hospital",
  type: "Hospital",
  address: "Ngong Road, Nairobi",
  county: "Nairobi",
  latitude: -1.3002,
  longitude: 36.7815,
  phone: "+254 711 043000",
  services: [
    "Outpatient",
    "Inpatient",
    "Laboratory",
    "Pharmacy",
    "Radiology",
    "Specialist Care",
  ],
  openingHours: "24 hours",
  emergency: true,
  wheelchair: "yes",
  operator: "Coptic Hospital",
  source: "AfyaLink / Reference data",
},

  {
    id: 6,
    name: "M.P. Shah Hospital",
    type: "Hospital",
    description:
      "A 217-bed hospital in Nairobi providing specialist, inpatient, outpatient and diagnostic healthcare services.",
    address: "Shivachi Road, Parklands, Nairobi",
    county: "Nairobi",
    latitude: -1.2636,
    longitude: 36.8172,

    services: [
      "Emergency",
      "Outpatient",
      "Inpatient",
      "Laboratory",
      "Pharmacy",
      "Radiology",
      "Specialist Care",
      "Dental",
      "Children's Hospital",
    ],

    openingHours: {
      monday: "Open 24 hours",
      tuesday: "Open 24 hours",
      wednesday: "Open 24 hours",
      thursday: "Open 24 hours",
      friday: "Open 24 hours",
      saturday: "Open 24 hours",
      sunday: "Open 24 hours",
    },

    phone: "+254 111 000600",

    emergency: true,

    wheelchair: "yes",

    operator: "M.P. Shah Hospital",

    source: "AfyaLink / Reference data",
  },

  {
    id: 7,
    name: "Gertrude's Children's Hospital",
    type: "Children's Hospital",
    description:
      "A specialist children's hospital providing paediatric healthcare services in Nairobi.",
    address: "34 Muthaiga Road, Muthaiga, Nairobi",
    county: "Nairobi",
    latitude: -1.2505,
    longitude: 36.8332,

    services: [
      "Emergency",
      "Paediatrics",
      "Outpatient",
      "Inpatient",
      "Laboratory",
      "Pharmacy",
      "Specialist Care",
      "Maternity",
    ],

    openingHours: {
      monday: "Open 24 hours",
      tuesday: "Open 24 hours",
      wednesday: "Open 24 hours",
      thursday: "Open 24 hours",
      friday: "Open 24 hours",
      saturday: "Open 24 hours",
      sunday: "Open 24 hours",
    },

    phone: "+254 709 529000",

    emergency: true,

    wheelchair: "yes",

    operator: "Gertrude's Children's Hospital",

    source: "AfyaLink / Reference data",
  },

  {
    id: 8,
    name: "AAR Hospital",
    type: "Hospital",
    description:
      "A private hospital in Nairobi providing medical, diagnostic and emergency healthcare services.",
    address: "Nairobi, Kenya",
    county: "Nairobi",
    latitude: -1.2309,
    longitude: 36.8064,

    services: [
      "Emergency",
      "Outpatient",
      "Inpatient",
      "Laboratory",
      "Pharmacy",
      "Radiology",
      "Specialist Care",
    ],

    openingHours: {
      monday: "Open 24 hours",
      tuesday: "Open 24 hours",
      wednesday: "Open 24 hours",
      thursday: "Open 24 hours",
      friday: "Open 24 hours",
      saturday: "Open 24 hours",
      sunday: "Open 24 hours",
    },

    phone: "+254 111 049900",

    emergency: true,

    wheelchair: "yes",

    operator: "AAR Hospital",

    source: "AfyaLink / Reference data",
  },
];