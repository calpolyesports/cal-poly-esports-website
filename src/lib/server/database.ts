import * as models from '../models';

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

const gameRosters: models.Game[] = [
    {
        id: 1,
        name: "Overwatch 2",
        icon: "/images/games/Overwatch 2.png",
        teams: [
            {
                name: "Overwatch Gold",
                members: [
                    {
                        name: "Aiden Smith",
                        username: "Thundderr",
                        role: "Tank",
                        picture: "/images/players/Thundderr.jpg",
                    },
                    {
                        name: "Ethan Ng",
                        username: "Copy",
                        role: "Tank",
                        picture: "/images/players/Copy.jpg",
                    },
                    {
                        name: "Jason Chen",
                        username: "ignitor135",
                        role: "Hitscan DPS",
                        picture: "/images/players/ignitor135.png",
                    },
                    {
                        name: "Carson Wong",
                        username: "Pied",
                        role: "Flex DPS",
                        picture: "/images/players/Pied.jpg",
                    },
                    {
                        name: "Hingsun Luu",
                        username: "Gark",
                        role: "Main Support",
                        picture: "/images/players/Gark.png",
                    },
                    {
                        name: "Tarsa Yuen",
                        username: "Mustard",
                        role: "Main Support",
                        picture: "/images/players/Mustard.jpg",
                    },
                    {
                        name: "Jordan Twitty",
                        username: "Rouffle",
                        role: "Flex Support",
                        picture: "/images/players/Rouffle.jpg",
                    },
                ],
            }
        ]
    },
    {
        id: 2,
        name: "League of Legends",
        icon: "/images/games/LOL.png",
        teams: [],
    },
    {
        id: 3,
        name: "Valorant",
        icon: "/images/games/Valorant.png",
        teams: [],
    }
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

export function getGameRosters() {
    return gameRosters;
}

export function getEvents() {
    return events;
}
