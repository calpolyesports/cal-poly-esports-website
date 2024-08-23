const articles = [
    {
        title: "Esports Opens New Lab for Students",
        summary: "Cal Poly's first computer building event",
        link: "https://www.google.com",
        image: "/images/articles/P1011922.JPG",
    },
    {
        title: "Gamers Play Volleyball",
        summary: "Why? I'm not sure but looks fun",
        link: "https://www.google.com",
        image: "/images/articles/IMG_9385.jpg"
    },
    {
        title: "Why Kazuma Kiryu Should Be in Fortnite",
        summary: "Featuring the insane ramblings of Bernardo",
        link: "https://www.google.com",
        image: "/images/articles/10_13 - PP Night.jpg",
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

export function getArticles() {
    return articles;
}

export function getTeams() {
    return teams;
}

export function getEvents() {
    return events;
}
