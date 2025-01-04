<script lang="ts">
    interface WinningTeam {
        year: string;
        teamName: string;
        members: {
            name: string;
            username: string;
            role: string;
        }[];
    }

    const winners: WinningTeam[] = [
        {
            year: "2023 - 2024",
            teamName: "Waffle Stompers",
            members: [
                { name: "Jacob Iniguez", username: "jcub", role: "Top" },
                { name: "Jesus Contreras", username: "floppitybopps", role: "Jungle" },
                { name: "Tyler Brady", username: "BUDDA69", role: "Mid" },
                { name: "Carlos Hernandez", username: "Billong", role: "ADC" },
                { name: "Theo Sprouse", username: "Fear", role: "Supp" }
            ]
        },
        {
            year: "2022 - 2023",
            teamName: "Dive Our Bot",
            members: [
                { name: "Jason Chang", username: "headpat machine", role: "Top" },
                { name: "Anson Chen", username: "Gyaraados", role: "Jungle" },
                { name: "Brian Liu", username: "bliu1", role: "Mid" },
                { name: "Valeria Iniguez", username: "Ghoulfreak", role: "ADC" },
                { name: "Teghvir Grewal", username: "TeggyWeggy", role: "Support" }
            ]
        },
        {
            year: "2021 - 2022",
            teamName: "Kitten Cwusade :3",
            members: [
                { name: "Jacob Feinstein", username: "Pinkachu", role: "Top" },
                { name: "John Stapakis", username: "StingingChicken", role: "Jungle" },
                { name: "Kaveh Shafiei", username: "Yolkie", role: "Mid" },
                { name: "Wei Zhao", username: "PokGaiWeeWee", role: "ADC" },
                { name: "Evelyn Tay", username: "Small Fluffy Cat", role: "Support" }
            ]
        },
        {
            year: "2020 - 2021",
            teamName: "Not Team Ten",
            members: [
                { name: "Dylan Tabalan", username: "umnotsosure", role: "Top" },
                { name: "Justin Chan", username: "Shishinik", role: "Jungle" },
                { name: "Yicherpe Vang", username: "Ibei", role: "Mid" },
                { name: "Laurent Hirakata", username: "hmhsl", role: "ADC" },
                { name: "Kenneth Thai", username: "LionwingsX", role: "Support" }
            ]
        },
        {
            year: "2019 - 2020",
            teamName: "___",
            members: [
                { name: "Scott Seno", username: "FuzzyHamster", role: "Top" },
                { name: "Alex Halaszynski", username: "MrMooraf", role: "Jungle" },
                { name: "Sam Park", username: "Rampakslue", role: "Mid" },
                { name: "Wei Zhao", username: "PokGaiWeeWee", role: "ADC" },
                { name: "Anthony Tyler", username: "EdibleTeddyBear", role: "Support" }
            ]
        },
        {
            year: "2018 - 2019",
            teamName: "Team 7",
            members: [
                { name: "Eric Ying", username: "Freuclid", role: "Top" },
                { name: "Nathan Hamilton", username: "Nathamilton", role: "Jungle" },
                { name: "Dario Delgadillo", username: "RedDragon0001", role: "Mid" },
                { name: "Kyle Van", username: "An0lized", role: "ADC" },
                { name: "Earianne Bihis", username: "Scarletlover", role: "Support" }
            ]
        },
        {
            year: "2017 - 2018",
            teamName: "Meme Team",
            members: [
                { name: "Scott Seno", username: "FuzzyHamster", role: "Top" },
                { name: "Nick Nordheim", username: "Arceus411", role: "Jungle" },
                { name: "Kobe Phan", username: "Dischord", role: "Mid" },
                { name: "Lucas Kalin", username: "Lucas", role: "ADC" },
                { name: "Garrett Cheng", username: "Paperplate", role: "Support" }
            ]
        },
        {
            year: "2016 - 2017",
            teamName: "Team 1der",
            members: [
                { name: "Sam Verkruyse", username: "Sprucegroose", role: "Top" },
                { name: "Matt Halvorson", username: "MsterChief-Batman", role: "Jungle" },
                { name: "Scott Kuphaldt", username: "Soccerstar007", role: "Mid" },
                { name: "Ian Fireman", username: "Worlds Best Noob", role: "ADC" },
                { name: "Earianne Bihis", username: "Scarletlover", role: "Support" }
            ]
        }
    ];
</script>

<div class="header">
    <div class="opacity">
        <h1>SLOLCS</h1>
    </div>
</div>

<div class="description">
    <p>SLOLCS is a friendly SLOLERS sponsored tournament between members of the club. Each team consists of 5 members of varying skill ranges that compete against one another.</p>
    <p><b>2023 - 2024 SLOLCS has completed! The winners are below, and stay tuned for next years Tournament!</b></p>
</div>

<div class="winners">
    <h2>Past Winners</h2>
    {#each winners as winner}
        <h3>{winner.year} SLOLCS Champions</h3>
        <h4>{winner.teamName}</h4>
        <div class="members">
            {#each winner.members as member}
                <div class="member">
                    <p>{member.name}</p>
                    <p><b>{member.username}</b></p>
                    <p>{member.role}</p>
                </div>
            {/each}
        </div>
    {/each}
</div>

<style>
    div.header {
        width: 100%;
        height: 20rem;
        margin: 3rem 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-image: url('https://cpsloesports.blob.core.windows.net/slolcs/slolcs_background.jpg');
        background-size: cover;
    }

    div.opacity {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.3);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    div.winners {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 3rem 0;
    }

    div.members {
        width: 100%;
        display: flex;
        justify-content: center;
        margin: 3rem 0;

    }

    div.member {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    div.member > p {
        margin: 0;
    }

    h1 {
        text-align: center;
        color: white;
        font-size: 10rem;
    }

    h2 {
        text-align: center;
        font-size: 4rem;
        margin-top: 1rem;
        margin-bottom: 3rem;
        text-decoration-line: underline;
        text-decoration-color: var(--cal-poly-secondary);
        text-decoration-thickness: 0.3rem;
        text-underline-offset: 1.5rem;
    }

    h3 {
        text-align: center;
        font-size: 2.5rem;
        margin: 0rem;
    }

    h4 {
        text-align: center;
        font-size: 2rem;
        margin: 0rem;
    }

    p {
        font-size: 2rem;
        margin: 2rem;
        text-align: center;
    }
</style>
