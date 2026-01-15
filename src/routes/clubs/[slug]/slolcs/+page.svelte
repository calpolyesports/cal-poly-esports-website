<script lang="ts">
	interface WinningTeam {
		year: string;
		teamName: string;
		members: {
			name: string;
			username: string;
			role: string;
			imageFilename?: string;
		}[];
	}

	const winners: WinningTeam[] = [
		{
			year: '2025',
			teamName: 'Baron Brawling Lovers',
			members: [
				{
					name: 'Justin Chan',
					username: 'shishinik',
					role: 'Top',
					imageFilename: 'shishinik.jpg'
				},
				{
					name: 'Jesus Contreras',
					username: 'floppitybopps',
					role: 'Jungle',
					imageFilename: 'floppitybopps2.jpg'
				},
				{
					name: 'Ranen Javelona',
					username: 'Raycovel',
					role: 'Mid',
					imageFilename: 'Raycovel.jpg'
				},
				{
					name: 'Nick Hernandez',
					username: 'Headon',
					role: 'ADC',
					imageFilename: 'Headon.jpg'
				},
				{
					name: 'Aaron Guerrero',
					username: 'ELIGMApp',
					role: 'Support',
					imageFilename: 'ELIGMApp.jpg'
				}
			]
		},
		{
			year: '2024',
			teamName: 'Waffle Stompers',
			members: [
				{ name: 'Jacob Iniguez', username: 'jcub', role: 'Top', imageFilename: 'jcub.jpg' },
				{
					name: 'Jesus Contreras',
					username: 'floppitybopps',
					role: 'Jungle',
					imageFilename: 'floppitybopps.jpg'
				},
				{
					name: 'Tyler Brady',
					username: 'BUDDA69',
					role: 'Mid',
					imageFilename: 'BUDDA69.webp'
				},
				{
					name: 'Carlos Hernandez',
					username: 'Billong',
					role: 'ADC',
					imageFilename: 'Billong.jpg'
				},
				{
					name: 'Theo Sprouse',
					username: 'Fear',
					role: 'Support',
					imageFilename: 'Fear.webp'
				}
			]
		},
		{
			year: '2023',
			teamName: 'Dive Our Bot',
			members: [
				{
					name: 'Jason Chang',
					username: 'headpat machine',
					role: 'Top',
					imageFilename: 'headpat_machine.jpg'
				},
				{
					name: 'Anson Chen',
					username: 'Gyaraados',
					role: 'Jungle',
					imageFilename: 'Gyaraados.jpg'
				},
				{ name: 'Brian Liu', username: 'bliu1', role: 'Mid', imageFilename: 'bliu1.webp' },
				{
					name: 'Valeria Iniguez',
					username: 'Ghoulfreak',
					role: 'ADC',
					imageFilename: 'Ghoulfreak.png'
				},
				{
					name: 'Teghvir Grewal',
					username: 'TeggyWeggy',
					role: 'Support',
					imageFilename: 'TeggyWeggy.jpg'
				}
			]
		},
		{
			year: '2022',
			teamName: 'Kitten Cwusade :3',
			members: [
				{
					name: 'Lyra Feinstein',
					username: 'Pinkachu',
					role: 'Top',
					imageFilename: 'Pinkachu.jpg'
				},
				{
					name: 'John Stapakis',
					username: 'StingingChicken',
					role: 'Jungle',
					imageFilename: 'StingingChicken.jpg'
				},
				{
					name: 'Kaveh Shafiei',
					username: 'Yolkie',
					role: 'Mid',
					imageFilename: 'Yolkie.jpg'
				},
				{
					name: 'Wei Zhao',
					username: 'PokGaiWeeWee',
					role: 'ADC',
					imageFilename: 'PokGaiWeeWee.jpg'
				},
				{
					name: 'Evelyn Tay',
					username: 'Small Fluffy Cat',
					role: 'Support',
					imageFilename: 'Small_Fluffy_Cat.jpg'
				}
			]
		},
		{
			year: '2021',
			teamName: 'Not Team Ten',
			members: [
				{
					name: 'Dylan Tabalan',
					username: 'umnotsosure',
					role: 'Top',
					imageFilename: 'umnotsosure.jpg'
				},
				{
					name: 'Justin Chan',
					username: 'Shishinik',
					role: 'Jungle',
					imageFilename: 'Shishinik.jpg'
				},
				{ name: 'Yicherpe Vang', username: 'Ibei', role: 'Mid', imageFilename: 'Ibei.jpg' },
				{
					name: 'Laurent Hirakata',
					username: 'hmhsl',
					role: 'ADC',
					imageFilename: 'hmhsl.jpg'
				},
				{
					name: 'Kenneth Thai',
					username: 'LionwingsX',
					role: 'Support',
					imageFilename: 'LionwingsX.jpg'
				}
			]
		},
		{
			year: '2020',
			teamName: '___',
			members: [
				{
					name: 'Scott Seno',
					username: 'FuzzyHamster',
					role: 'Top',
					imageFilename: 'FuzzyHamster.jpeg'
				},
				{
					name: 'Alex Halaszynski',
					username: 'MrMooraf',
					role: 'Jungle',
					imageFilename: 'MrMooraf.jpg'
				},
				{
					name: 'Sam Park',
					username: 'Rampakslue',
					role: 'Mid',
					imageFilename: 'Rampakslue.jpg'
				},
				{
					name: 'Wei Zhao',
					username: 'PokGaiWeeWee',
					role: 'ADC',
					imageFilename: 'PokGaiWeeWee2.jpg'
				},
				{
					name: 'Anthony Tyler',
					username: 'EdibleTeddyBear',
					role: 'Support',
					imageFilename: 'EdibleTeddyBear.jpg'
				}
			]
		},
		{
			year: '2019',
			teamName: 'Team 7',
			members: [
				{
					name: 'Eric Ying',
					username: 'Freuclid',
					role: 'Top',
					imageFilename: 'Freuclid.jpg'
				},
				{
					name: 'Nathan Hamilton',
					username: 'Nathamilton',
					role: 'Jungle',
					imageFilename: 'Nathamilton.jpg'
				},
				{
					name: 'Dario Delgadillo',
					username: 'RedDragon0001',
					role: 'Mid',
					imageFilename: 'RedDragon0001.jpg'
				},
				{
					name: 'Kyle Van',
					username: 'An0lized',
					role: 'ADC',
					imageFilename: 'An0lized.jpg'
				},
				{
					name: 'Earianne Bihis',
					username: 'Scarletlover',
					role: 'Support',
					imageFilename: 'Scarletlover.jpg'
				}
			]
		},
		{
			year: '2018',
			teamName: 'Meme Team',
			members: [
				{
					name: 'Scott Seno',
					username: 'FuzzyHamster',
					role: 'Top',
					imageFilename: 'FuzzyHamster2.jpg'
				},
				{
					name: 'Nick Nordheim',
					username: 'Arceus411',
					role: 'Jungle',
					imageFilename: 'Arceus411.jpg'
				},
				{
					name: 'Kobe Phan',
					username: 'Dischord',
					role: 'Mid',
					imageFilename: 'Dischord.jpg'
				},
				{ name: 'Lucas Kalin', username: 'Lucas', role: 'ADC', imageFilename: 'Lucas.jpg' },
				{
					name: 'Garrett Cheng',
					username: 'Paperplate',
					role: 'Support',
					imageFilename: 'Paperplate.jpg'
				}
			]
		},
		{
			year: '2017',
			teamName: 'Team 1der',
			members: [
				{
					name: 'Sam Verkruyse',
					username: 'Sprucegroose',
					role: 'Top',
					imageFilename: 'Sprucegroose.jpg'
				},
				{
					name: 'Matt Halvorson',
					username: 'MsterChief-Batman',
					role: 'Jungle',
					imageFilename: 'MsterChief-Batman.jpg'
				},
				{
					name: 'Scott Kuphaldt',
					username: 'Soccerstar007',
					role: 'Mid',
					imageFilename: 'Soccerstar007.jpg'
				},
				{
					name: 'Ian Fireman',
					username: 'Worlds Best Noob',
					role: 'ADC',
					imageFilename: 'Worlds_Best_Noob.jpg'
				},
				{
					name: 'Earianne Bihis',
					username: 'Scarletlover',
					role: 'Support',
					imageFilename: 'Scarletlover2.jpg'
				}
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
	<p>
		Cal Poly League of Legends proudly hosts SLOLCS, an intramural tournament where members of the
		club compete against one another in balanced teams throughout the quarter for the championship
		title!
	</p>
</div>

<div class="winners">
	<h2>Past Winners</h2>
	{#each winners as winner (winner.year)}
		<h4>{winner.year} SLOLCS Champions</h4>
		<h3>{winner.teamName}</h3>
		<div class="members">
			{#each winner.members as member (member.username)}
				<div class="member">
					<div class="member-background-image">
						<img
							src={`https://cpsloesports.blob.core.windows.net/events/slolcs/cards/${member.imageFilename}`}
							alt={member.name}
						/>
					</div>
					<div class="member-info">
						<p>{member.name}</p>
						<p><b>{member.username}</b></p>
						<p>{member.role}</p>
					</div>
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
		background-image: url('https://cpsloesports.blob.core.windows.net/events/slolcs/slolcs_background.jpg');
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

	div.description {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 0;
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
		flex-wrap: wrap;
		margin-top: 3rem;
		margin-bottom: 5rem;
		gap: 1rem;
	}

	div.member {
		width: 20rem;
		height: 10rem;
		position: relative;
		padding: 0.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	div.member-info p {
		margin: 0;
		position: relative;
		z-index: 1;
		text-align: center;
		color: white;
		text-shadow: 0 0 0.5rem rgba(0, 0, 0, 1);
	}

	div.member-background-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background-color: black;
		border-radius: 1rem;
	}

	div.member-background-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		z-index: -1;
		opacity: 0.7;
	}

	h1 {
		text-align: center;
		color: white;
		font-size: 10rem;
		text-shadow: 0 0 1.5rem rgba(0, 0, 0, 0.8);
	}

	h2 {
		text-align: center;
		font-size: 4rem;
		margin-top: 0rem;
		margin-bottom: 5rem;
		text-decoration-line: underline;
		text-decoration-color: var(--cal-poly-secondary);
		text-decoration-thickness: 0.3rem;
		text-underline-offset: 1.5rem;
	}

	h3 {
		text-align: center;
		font-size: 3rem;
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

	@media (max-width: 768px) {
		div.header {
			height: 10rem;
		}

		h1 {
			font-size: 4rem;
		}

		h2 {
			font-size: 2.5rem;
			margin-bottom: 3rem;
		}

		h3 {
			font-size: 2rem;
		}

		h4 {
			font-size: 1.5rem;
		}

		p {
			font-size: 1.5rem;
			margin: 2rem 0;
		}

		div.member {
			width: 15rem;
			height: 7.5rem;
		}
	}
</style>
