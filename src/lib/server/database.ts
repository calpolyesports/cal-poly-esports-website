const blogs = [
    {
        title: "Blog 1",
        content: "This is the first blog",
    },
    {
        title: "Blog 2",
        content: "This is the second blog",
    },
];

const teams = [
    {
        name: "Overwatch Gold",
        members: [
            {
                username: "Thundderr",
                role: "Tank",
            },
            {
                username: "Copy",
                role: "Support",
            },
            {
                username: "Pied",
                role: "Hitscan DPS",
            },
            {
                username: "ignitor135",
                role: "Flex DPS",
            },
            {
                username: "Gark",
                role: "Main Support",
            },
            {
                username: "Mustard",
                role: "Main Support",
            },
            {
                username: "vexed",
                role: "Flex Support",
            },
            {
                username: "Rouffle",
                role: "Flex Support",
            },
        ],
    },
    {
        name: "Overwatch Green",
        members: [
            {
                username: "Thundderr",
                role: "Tank",
            },
            {
                username: "Copy",
                role: "Support",
            },
            {
                username: "Pied",
                role: "Hitscan DPS",
            },
            {
                username: "ignitor135",
                role: "Flex DPS",
            },
            {
                username: "Gark",
                role: "Main Support",
            },
            {
                username: "Mustard",
                role: "Main Support",
            },
            {
                username: "vexed",
                role: "Flex Support",
            },
            {
                username: "Rouffle",
                role: "Flex Support",
            },
        ],
    },
];

const events = [
    {
        id: "1",
        allDay: false,
        start: new Date("2024-08-23T12:00:00Z"),
        end: new Date("2024-08-23T13:00:00Z"),
        title: "Test Event 1",
        display: 'auto',
        backgroundColor: '#154734',
    }
]

export function getBlogs() {
    return blogs;
}

export function getTeams() {
    return teams;
}

export function getEvents() {
    return events;
}
